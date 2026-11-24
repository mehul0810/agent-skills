import fs from 'node:fs';
import crypto from 'node:crypto';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { buildPacket, verifyPacket } from './build-eval-packet.mjs';

if (process.argv[2] === 'fifo-watchdog') {
  if (process.argv[3] === 'build') buildPacket(process.argv[4], process.argv[5], 'a'.repeat(40));
  else verifyPacket(process.argv[4]);
  process.exit(0);
}

const root = fs.mkdtempSync(path.join(os.tmpdir(), 'eval-packet-test-'));
const source = path.join(root, 'case'), out = path.join(root, 'packet');
fs.mkdirSync(path.join(source, 'artifacts'), { recursive: true });
fs.writeFileSync(path.join(source, 'artifacts', 'sample.txt'), 'raw fixture');
fs.writeFileSync(path.join(source, 'criteria.md'), 'private answer key');
const input = { id: 'sample', request: 'Review the supplied fixture.', artifacts: ['sample.txt'] };
const write = value => fs.writeFileSync(path.join(source, 'input.json'), JSON.stringify(value));
write(input);
buildPacket(source, out, 'a'.repeat(40));
assert.equal(verifyPacket(out).id, 'sample');
assert.throws(() => verifyPacket(out, { limits: { maxEntries: 2 } }), /entry limit/);
assert.equal(fs.existsSync(path.join(out, 'criteria.md')), false);
assert.throws(() => buildPacket(source, out, 'a'.repeat(40)));
fs.writeFileSync(path.join(out, 'request.md'), 'tampered');
assert.throws(() => verifyPacket(out), /changed/);
fs.writeFileSync(path.join(out, 'request.md'), input.request + '\n');
const manifest = JSON.parse(fs.readFileSync(path.join(out, 'manifest.json')));
assert.match(manifest.packetDigest, /^[a-f0-9]{64}$/);
manifest.packetDigest = 'b'.repeat(64);
fs.writeFileSync(path.join(out, 'manifest.json'), JSON.stringify(manifest));
assert.throws(() => verifyPacket(out), /Invalid packet manifest/);
write({ ...input, expected: 'secret answer' });
assert.throws(() => buildPacket(source, path.join(root, 'rejected'), 'a'.repeat(40)), /permits only/);
for (const file of ['../criteria.md', '/tmp/answer', 'missing.txt']) {
  write({ ...input, artifacts: [file] });
  assert.throws(() => buildPacket(source, path.join(root, 'rejected'), 'a'.repeat(40)));
}
fs.symlinkSync(path.join(source, 'criteria.md'), path.join(source, 'artifacts', 'linked'));
write({ ...input, artifacts: ['linked'] });
assert.throws(() => buildPacket(source, path.join(root, 'rejected'), 'a'.repeat(40)), /non-symlink/);

// Each file, the aggregate, entry count, and depth are bounded before content is accepted.
const testLimits = { maxFileBytes: 256, maxTotalBytes: 1024, maxEntries: 16, maxDepth: 8 };
for (const limits of [
  { maxFileBytes: Infinity },
  { maxTotalBytes: NaN },
  { maxEntries: -1 },
  { maxDepth: Infinity },
  { unbounded: true },
]) {
  assert.throws(() => buildPacket(source, path.join(root, 'invalid-limit'), 'a'.repeat(40), { limits }));
  assert.throws(() => verifyPacket(out, { limits }));
}
write({ ...input, artifacts: ['sample.txt'] });
fs.writeFileSync(path.join(source, 'input.json'), ' '.repeat(257));
assert.throws(() => buildPacket(source, path.join(root, 'oversized-input'), 'a'.repeat(40), { limits: testLimits }), /byte limit/);
write({ ...input, artifacts: ['sample.txt'] });
fs.writeFileSync(path.join(source, 'artifacts', 'sample.txt'), Buffer.alloc(257));
assert.throws(() => buildPacket(source, path.join(root, 'oversized-artifact'), 'a'.repeat(40), { limits: testLimits }), /byte limit/);
fs.writeFileSync(path.join(source, 'artifacts', 'sample.txt'), Buffer.alloc(128));
const largeNames = Array.from({ length: 9 }, (_, index) => `large-${index}.bin`);
for (const name of largeNames) fs.writeFileSync(path.join(source, 'artifacts', name), Buffer.alloc(128));
write({ ...input, artifacts: largeNames });
assert.throws(() => buildPacket(source, path.join(root, 'oversized-total'), 'a'.repeat(40), { limits: testLimits }), /total byte limit/);
const deepParts = Array.from({ length: 9 }, (_, index) => `d${index}`);
const deepDirectory = path.join(source, 'artifacts', ...deepParts);
fs.mkdirSync(deepDirectory, { recursive: true });
fs.writeFileSync(path.join(deepDirectory, 'deep.txt'), 'deep');
write({ ...input, artifacts: [`${deepParts.join('/')}/deep.txt`] });
assert.throws(() => buildPacket(source, path.join(root, 'too-deep'), 'a'.repeat(40), { limits: testLimits }), /depth limit/);

// FIFOs are rejected without blocking in both builder and verifier paths.
const fifoSource = path.join(root, 'fifo-case');
fs.mkdirSync(path.join(fifoSource, 'artifacts'), { recursive: true });
fs.writeFileSync(path.join(fifoSource, 'input.json'), JSON.stringify({ ...input, artifacts: ['blocked.pipe'] }));
execFileSync('mkfifo', [path.join(fifoSource, 'artifacts', 'blocked.pipe')]);
const fifoBuild = spawnSync(process.execPath, [new URL(import.meta.url).pathname, 'fifo-watchdog', 'build', fifoSource, path.join(root, 'fifo-output')], { timeout: 2000, encoding: 'utf8' });
assert.notEqual(fifoBuild.error?.code, 'ETIMEDOUT', 'builder hung while opening a FIFO');
assert.notEqual(fifoBuild.status, 0, 'builder accepted a FIFO');
const fifoPacket = path.join(root, 'fifo-packet');
fs.mkdirSync(fifoPacket);
fs.writeFileSync(path.join(fifoPacket, 'manifest.json'), JSON.stringify({ version: 2, id: 'x', sourceRevision: 'a'.repeat(40), files: { 'request.md': '0'.repeat(64) }, packetDigest: '0'.repeat(64) }));
fs.writeFileSync(path.join(fifoPacket, 'request.md'), 'request');
execFileSync('mkfifo', [path.join(fifoPacket, 'blocked.pipe')]);
const fifoVerify = spawnSync(process.execPath, [new URL(import.meta.url).pathname, 'fifo-watchdog', 'verify', fifoPacket], { timeout: 2000, encoding: 'utf8' });
assert.notEqual(fifoVerify.error?.code, 'ETIMEDOUT', 'verifier hung while enumerating a FIFO');
assert.notEqual(fifoVerify.status, 0, 'verifier accepted a FIFO');

// The verifier can consume the same immutable bytes supplied by an invocation cache.
write(input);
fs.writeFileSync(path.join(source, 'artifacts', 'sample.txt'), 'raw fixture');
const cachePacket = path.join(root, 'cache-packet');
const cacheManifest = buildPacket(source, cachePacket, 'a'.repeat(40));
const cached = new Map();
const canonicalCachePacket = fs.realpathSync(cachePacket);
for (const [file] of Object.entries(cacheManifest.files)) cached.set(path.join(canonicalCachePacket, file), fs.readFileSync(path.join(cachePacket, file)));
cached.set(path.join(canonicalCachePacket, 'manifest.json'), fs.readFileSync(path.join(cachePacket, 'manifest.json')));
let cacheReads = 0;
assert.equal(verifyPacket(cachePacket, {
  readFile: file => { cacheReads += 1; return cached.get(file); },
}).id, 'sample');
assert.equal(cacheReads, Object.keys(cacheManifest.files).length + 1);

const symlinkManifestPacket = path.join(root, 'symlink-manifest-packet');
buildPacket(source, symlinkManifestPacket, 'a'.repeat(40));
const externalManifest = path.join(root, 'external-manifest.json');
fs.renameSync(path.join(symlinkManifestPacket, 'manifest.json'), externalManifest);
fs.symlinkSync(externalManifest, path.join(symlinkManifestPacket, 'manifest.json'));
assert.throws(() => verifyPacket(symlinkManifestPacket), /symlink/);
const symlinkPayloadPacket = path.join(root, 'symlink-payload-packet');
buildPacket(source, symlinkPayloadPacket, 'a'.repeat(40));
fs.renameSync(path.join(symlinkPayloadPacket, 'request.md'), path.join(root, 'external-request.md'));
fs.symlinkSync(path.join(root, 'external-request.md'), path.join(symlinkPayloadPacket, 'request.md'));
assert.throws(() => verifyPacket(symlinkPayloadPacket), /symlink/);

// Repository-backed cases are bound to clean selected inputs at the named HEAD.
const repoCase = path.join(root, 'repo', 'skill-evals', 'cases', 'clean');
fs.mkdirSync(path.join(repoCase, 'artifacts'), { recursive: true });
fs.writeFileSync(path.join(repoCase, 'input.json'), JSON.stringify(input));
fs.writeFileSync(path.join(repoCase, 'artifacts', 'sample.txt'), 'committed fixture');
fs.writeFileSync(path.join(repoCase, 'artifacts', 'unused.txt'), 'unused fixture');
execFileSync('git', ['init', '-q', path.join(root, 'repo')]);
execFileSync('git', ['-C', path.join(root, 'repo'), 'config', 'user.email', 'test@example.invalid']);
execFileSync('git', ['-C', path.join(root, 'repo'), 'config', 'user.name', 'Test']);
execFileSync('git', ['-C', path.join(root, 'repo'), 'add', '.']);
execFileSync('git', ['-C', path.join(root, 'repo'), 'commit', '-qm', 'fixture']);
const revision = execFileSync('git', ['-C', path.join(root, 'repo'), 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
buildPacket(repoCase, path.join(root, 'clean-packet'), revision);
assert.throws(() => buildPacket(repoCase, path.join(root, 'wrong-revision'), 'a'.repeat(40)), /does not match/);
fs.writeFileSync(path.join(repoCase, 'artifacts', 'sample.txt'), 'edited fixture');
assert.throws(() => buildPacket(repoCase, path.join(root, 'dirty-packet'), revision), /differs from source revision/);
fs.writeFileSync(path.join(repoCase, 'artifacts', 'sample.txt'), 'committed fixture');
fs.writeFileSync(path.join(root, 'repo', 'unrelated.txt'), 'preserve me');
fs.writeFileSync(path.join(repoCase, 'artifacts', 'unused.txt'), 'unselected dirty fixture');
buildPacket(repoCase, path.join(root, 'unrelated-dirty-packet'), revision);
fs.writeFileSync(path.join(repoCase, '.gitignore'), 'artifacts/ignored.txt\n');
fs.writeFileSync(path.join(repoCase, 'input.json'), JSON.stringify({ ...input, artifacts: ['ignored.txt'] }));
execFileSync('git', ['-C', path.join(root, 'repo'), 'add', 'skill-evals/cases/clean/input.json', 'skill-evals/cases/clean/.gitignore']);
execFileSync('git', ['-C', path.join(root, 'repo'), 'commit', '-qm', 'ignored case selection']);
const ignoredRevision = execFileSync('git', ['-C', path.join(root, 'repo'), 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
fs.writeFileSync(path.join(repoCase, 'artifacts', 'ignored.txt'), 'ignored selected fixture');
assert.throws(() => buildPacket(repoCase, path.join(root, 'ignored-input'), ignoredRevision), /not present at source revision/);

// Selectable design packets contain only requested briefs, never adjacent cases or criteria.
for (const name of ['editorial-signature', 'navigation-study-selection']) {
  const design = path.resolve('skill-evals/cases', name);
  const briefs = JSON.parse(fs.readFileSync(path.join(design, 'artifacts/briefs.json')));
  const designRevision = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  const target = path.join(root, `selected-${name}`);
  buildPacket(design, target, designRevision, { caseIds: [briefs[0].id] });
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(target, 'artifacts/briefs.json'))), [briefs[0]]);
  assert.equal(fs.existsSync(path.join(target, 'criteria.md')), false);
  assert.equal(verifyPacket(target).id, name);
  assert.deepEqual(verifyPacket(target).selection.caseIds, [briefs[0].id]);
  assert.throws(() => buildPacket(design, path.join(root, `duplicate-${name}`), designRevision, { caseIds: [briefs[0].id, briefs[0].id] }), /unique/);
  assert.throws(() => buildPacket(design, path.join(root, `unknown-${name}`), designRevision, { caseIds: ['unknown'] }), /Unknown/);
}
assert.throws(() => buildPacket(source, path.join(root, 'unsupported-selection'), 'a'.repeat(40), { caseIds: ['sample'] }), /unsupported/);
const broad = path.resolve('skill-evals/cases/design-route-regression');
const broadRevision = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const broadInput = JSON.parse(fs.readFileSync(path.join(broad, 'input.json')));
const broadFull = path.join(root, 'broad-full');
buildPacket(broad, broadFull, broadRevision);
assert.equal(fs.readFileSync(path.join(broadFull, 'request.md'), 'utf8'), broadInput.request + '\n');
const broadSelected = path.join(root, 'broad-selected');
buildPacket(broad, broadSelected, broadRevision, { caseIds: ['7'] });
const broadRequest = fs.readFileSync(path.join(broadSelected, 'request.md'), 'utf8');
assert.deepEqual(verifyPacket(broadSelected).selection.caseIds, ['7']);
assert.match(broadRequest, /^7\. /m);
assert.doesNotMatch(broadRequest, /^([1-6]|[89]|1[0-9]|2[0-6])\. /m);
assert.match(broadRequest, /synthetic decisions/);
assert.throws(() => buildPacket(broad, path.join(root, 'broad-unknown'), broadRevision, { caseIds: ['27'] }), /Unknown/);
assert.throws(() => buildPacket(broad, path.join(root, 'broad-duplicate'), broadRevision, { caseIds: ['7', '7'] }), /unique/);
const reseal = (directory, edit) => {
  const manifestPath = path.join(directory, 'manifest.json');
  const value = JSON.parse(fs.readFileSync(manifestPath));
  edit(value);
  for (const file of Object.keys(value.files)) value.files[file] = crypto.createHash('sha256').update(fs.readFileSync(path.join(directory, file))).digest('hex');
  value.packetDigest = crypto.createHash('sha256').update(JSON.stringify(Object.entries(value.files).sort(([a], [b]) => a.localeCompare(b)))).digest('hex');
  fs.writeFileSync(manifestPath, JSON.stringify(value));
};
const wrongPrompt = path.join(root, 'wrong-prompt');
fs.cpSync(broadSelected, wrongPrompt, { recursive: true });
reseal(wrongPrompt, () => fs.writeFileSync(path.join(wrongPrompt, 'request.md'), broadRequest.replace(/^7\. .+$/m, '7. A different request.')));
assert.throws(() => verifyPacket(wrongPrompt), /differs from committed selection/);
reseal(wrongPrompt, value => { value.version = 2; delete value.selection; });
assert.throws(() => verifyPacket(wrongPrompt), /differs from committed selection/, 'removing selection metadata must not bypass provenance');
const extraPrompt = path.join(root, 'extra-prompt');
fs.cpSync(broadSelected, extraPrompt, { recursive: true });
reseal(extraPrompt, () => fs.appendFileSync(path.join(extraPrompt, 'request.md'), 'Neighboring prompt content without a number.\n'));
assert.throws(() => verifyPacket(extraPrompt), /differs from committed selection/);
const extraArtifact = path.join(root, 'extra-artifact');
fs.cpSync(broadSelected, extraArtifact, { recursive: true });
reseal(extraArtifact, value => { fs.writeFileSync(path.join(extraArtifact, 'extra.txt'), 'extra'); value.files['extra.txt'] = ''; });
assert.throws(() => verifyPacket(extraArtifact), /unexpected packet artifacts/);
const unavailableSource = path.join(root, 'unavailable-source');
fs.cpSync(broadSelected, unavailableSource, { recursive: true });
reseal(unavailableSource, value => { value.sourceRevision = 'a'.repeat(40); });
assert.throws(() => verifyPacket(unavailableSource), /source unavailable/);
const wrongBrief = path.join(root, 'wrong-brief');
fs.cpSync(path.join(root, 'selected-editorial-signature'), wrongBrief, { recursive: true });
reseal(wrongBrief, () => {
  const file = path.join(wrongBrief, 'artifacts/briefs.json');
  const briefs = JSON.parse(fs.readFileSync(file));
  briefs[0].request = 'Another request under the same ID.';
  fs.writeFileSync(file, JSON.stringify(briefs, null, 2) + '\n');
});
assert.throws(() => verifyPacket(wrongBrief), /briefs differ from committed selection/);
const broadManifestPath = path.join(broadSelected, 'manifest.json');
const selectedManifest = JSON.parse(fs.readFileSync(broadManifestPath));
selectedManifest.selection.caseIds = ['8'];
fs.writeFileSync(broadManifestPath, JSON.stringify(selectedManifest));
assert.throws(() => verifyPacket(broadSelected), /selection does not match/);
selectedManifest.selection.caseIds = ['7', '7'];
fs.writeFileSync(broadManifestPath, JSON.stringify(selectedManifest));
assert.throws(() => verifyPacket(broadSelected), /selection does not match/);
delete selectedManifest.selection;
selectedManifest.version = 2;
fs.writeFileSync(broadManifestPath, JSON.stringify(selectedManifest));
assert.deepEqual(verifyPacket(broadSelected).selection.caseIds, ['7'], 'legacy partial packets remain identifiable after metadata removal');
const allSelected = path.join(root, 'all-selected');
buildPacket(broad, allSelected, broadRevision, { caseIds: Array.from({ length: 26 }, (_, i) => String(i + 1)) });
reseal(allSelected, value => { value.version = 2; delete value.selection; });
assert.equal(verifyPacket(allSelected).selection.caseIds.length, 26, 'downgrading a fully selected packet does not turn it into a historical full packet');
const incorrectFull = path.join(root, 'incorrect-full');
fs.cpSync(allSelected, incorrectFull, { recursive: true });
reseal(incorrectFull, () => {
  const file = path.join(incorrectFull, 'request.md');
  fs.writeFileSync(file, fs.readFileSync(file, 'utf8').replace(/^8\. .+$/m, '8. A different request.'));
});
assert.throws(() => verifyPacket(incorrectFull), /differs from committed selection/, 'an apparent full inventory must match its committed source');
const historicRevision = '5eb5dd1ea1da71892fe21929811c02b86b7c6cce';
const historicSource = path.join(root, 'historic-navigation');
fs.mkdirSync(path.join(historicSource, 'artifacts'), { recursive: true });
for (const file of ['input.json', 'artifacts/briefs.json']) {
  fs.writeFileSync(path.join(historicSource, file), execFileSync('git', ['show', `${historicRevision}:skill-evals/cases/navigation-study-selection/${file}`]));
}
const historicPacket = path.join(root, 'historic-packet');
buildPacket(historicSource, historicPacket, historicRevision);
assert.equal(verifyPacket(historicPacket).selection, undefined, 'a historical full packet is not reclassified as partial');
console.log('Evaluation packet isolation and integrity tests passed');
