import fs from 'node:fs';
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
console.log('Evaluation packet isolation and integrity tests passed');
