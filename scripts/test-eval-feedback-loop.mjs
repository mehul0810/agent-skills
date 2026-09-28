import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { buildPacket, verifyPacket } from './build-eval-packet.mjs';
import { mergeChangedPaths, planBaselines, preflightReceipt } from './eval-feedback-loop.mjs';
import { analyzeConfigChange, CONFIG_PATH } from './eval-config-planner.mjs';
import { safeReadFile, listRegularFiles } from './bounded-files.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cliOutput = execFileSync(process.execPath, [path.join(repoRoot, 'scripts/eval-feedback-loop.mjs'), 'plan', '--base', 'HEAD', '--file', 'skill-evals/README.md', '--file', 'wp-expert/SKILL.md'], { cwd: repoRoot, encoding: 'utf8' });
assert.deepEqual(JSON.parse(cliOutput).changedPaths, ['skill-evals/README.md', 'wp-expert/SKILL.md']);

const baseline = {
  name: 'sample-baseline', files: ['skill/example.md'], requiredChecks: ['decision-safe', 'proof-complete'],
  scenario: { files: ['skill-evals/scenarios.md'], fixtureFiles: ['skill-evals/fixture.json'] },
};
const manifest = { schemaVersion: 2, baselines: [baseline, {
  name: 'other-baseline', files: ['other/SKILL.md'], requiredChecks: ['other-check'], scenario: { files: ['other/cases.md'], fixtureFiles: [] },
}] };
const plan = planBaselines(manifest, ['skill-evals/fixture.json']);
assert.deepEqual(plan.affected.map((item) => item.baseline), ['sample-baseline']);
assert.deepEqual(plan.affected[0].requiredChecks, baseline.requiredChecks);
assert.equal(plan.fullAggregateRequired, true);
const unrelated = planBaselines(manifest, ['notes/unmapped.md']);
assert.deepEqual(unrelated.affected, []);
assert.deepEqual(unrelated.unmapped, ['notes/unmapped.md']);
assert.equal(unrelated.fullAggregateRequired, true);
assert.equal(planBaselines(manifest, ['scripts/behavior-evidence-audit.mjs']).affected.length, 2);
const union = mergeChangedPaths(['skill/example.md'], ['other/SKILL.md', 'skill/example.md']);
assert.deepEqual(planBaselines(manifest, union).affected.map((item) => item.baseline), ['other-baseline', 'sample-baseline']);
assert.throws(() => planBaselines(manifest, ['skill/example.md', '../outside']), /unsafe/);
assert.throws(() => planBaselines({ ...manifest, baselines: [{ ...baseline, requiredChecks: [] }] }, ['skill/example.md']), /requiredChecks/);

const semantic = planBaselines(manifest, [CONFIG_PATH], { semanticConfig: { safe: true, ownedPaths: ['skill/example.md'] } });
assert.deepEqual(semantic.affected.map((item) => item.baseline), ['sample-baseline']);
assert.deepEqual(planBaselines(manifest, [CONFIG_PATH]).affected.map((item) => item.baseline), ['other-baseline', 'sample-baseline']);
const cfg = (value) => Buffer.from(JSON.stringify(value));
const configBase = { schemaVersion: 1, projectRoot: '.', routeBudgets: [{ name: 'Example', maxWords: 100, files: ['skill/example.md'] }] };
const configOwnedEdit = { ...configBase, routeBudgets: [{ ...configBase.routeBudgets[0], maxWords: 200 }] };
assert.deepEqual(analyzeConfigChange(cfg(configBase), cfg(configOwnedEdit), manifest), { safe: true, ownedPaths: ['skill/example.md'] });
const configUnknownEdit = { ...configBase, projectRoot: 'elsewhere' };
assert.equal(analyzeConfigChange(cfg(configBase), cfg(configUnknownEdit), manifest).safe, false);
const configUnknownEntryEdit = { ...configBase, routeBudgets: [{ ...configBase.routeBudgets[0], futurePolicy: true }] };
assert.equal(analyzeConfigChange(cfg(configBase), cfg(configUnknownEntryEdit), manifest).safe, false);
const configUnmappedEdit = { ...configBase, routeBudgets: [{ name: 'Unmapped', files: ['other/untracked.md'] }] };
assert.equal(analyzeConfigChange(cfg(configBase), cfg(configUnmappedEdit), manifest).safe, false);
assert.deepEqual(planBaselines(manifest, [CONFIG_PATH, 'scripts/behavior-evidence-audit.mjs'], {
  semanticConfig: { safe: true, ownedPaths: ['skill/example.md'] },
}).affected.map((item) => item.baseline), ['other-baseline', 'sample-baseline']);

const root = fs.mkdtempSync(path.join(os.tmpdir(), 'eval-loop-test-'));
try {
  fs.mkdirSync(path.join(root, 'skill-evals'), { recursive: true });
  const liveManifest = { schemaVersion: 2, baselines: [baseline] };
  fs.writeFileSync(path.join(root, 'skill-evals/behavior-baselines.json'), JSON.stringify(liveManifest));
  const revision = 'a'.repeat(40);
  const packetPath = 'skill-evals/packets/case-one';
  fs.mkdirSync(path.dirname(path.join(root, packetPath)), { recursive: true });
  const caseRoot = path.join(root, 'case-source');
  fs.mkdirSync(path.join(caseRoot, 'artifacts'), { recursive: true });
  fs.writeFileSync(path.join(caseRoot, 'artifacts/evidence.txt'), 'fixture');
  fs.writeFileSync(path.join(caseRoot, 'input.json'), JSON.stringify({ id: 'case-one', request: 'Review fixture', artifacts: ['evidence.txt'] }));
  const packetManifest = buildPacket(caseRoot, path.join(root, packetPath), revision);
  const packetManifestSha = crypto.createHash('sha256').update(fs.readFileSync(path.join(root, packetPath, 'manifest.json'))).digest('hex');
  fs.writeFileSync(path.join(caseRoot, 'input.json'), JSON.stringify({ id: 'second-packet', request: 'Review fixture', artifacts: ['evidence.txt'] }));
  const secondPacketPath = path.join(root, 'skill-evals/packets/second-packet');
  const secondPacketManifest = buildPacket(caseRoot, secondPacketPath, revision);
  const secondPacketManifestSha = crypto.createHash('sha256').update(fs.readFileSync(path.join(secondPacketPath, 'manifest.json'))).digest('hex');
  fs.mkdirSync(path.join(root, 'skill-evals/results'), { recursive: true });
  const resultFile = path.join(os.tmpdir(), `eval-loop-result-${process.pid}.json`);
  const writeResult = () => fs.writeFileSync(resultFile, JSON.stringify({ cases: baseline.requiredChecks.map((check) => ({
    packetId: 'case-one', id: 'context-01', check, outcome: 'synthetic',
  })) }));
  writeResult();
  const hashFile = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
  const reference = { packetId: packetManifest.id, caseId: 'context-01', packetPath: path.join(root, packetPath), manifestSha256: packetManifestSha, resultPath: resultFile, resultSha256: hashFile(resultFile) };
  const receipt = {
    schemaVersion: 1, status: 'draft', baseline: baseline.name, testedRevision: revision,
    evaluation: {
      evaluator: { identity: 'fresh-agent-run-1', exposedPaths: ['packet/case-one', 'wp-expert/SKILL.md'], expectedAnswersExposed: false, candidateSourceExposed: false },
      scorer: { identity: 'independent-reviewer-1', exposedPaths: ['criteria.md', 'result.json'], expectedAnswersExposed: true, candidateSourceExposed: false },
    },
    checks: baseline.requiredChecks.map((name) => ({ name, result: 'pass', cases: Array.from({ length: 25 }, () => reference) })),
  };
  const reads = new Map();
  let verificationCalls = 0;
  let listingCalls = 0;
  let hashCalls = 0;
  const good = preflightReceipt(root, receipt, {
    readFile: (file, options) => {
      const key = path.resolve(file);
      reads.set(key, (reads.get(key) ?? 0) + 1);
      return safeReadFile(file, options);
    },
    verify: (directory, options) => { verificationCalls += 1; return verifyPacket(directory, options); },
    listFiles: (...args) => { listingCalls += 1; return listRegularFiles(...args); },
    hashBytes: (bytes) => { hashCalls += 1; return crypto.createHash('sha256').update(bytes).digest('hex'); },
  });
  assert.equal(good.valid, true, JSON.stringify(good.errors));
  assert.equal(good.state, 'complete');
  assert.equal(good.admission, 'not-performed');
  assert.ok(preflightReceipt(root, receipt, { limits: { maxTotalBytes: Number.POSITIVE_INFINITY } }).errors.some((error) => error.includes('Invalid file size limit')));
  assert.equal(reads.size, 4, '50 repeated references should use one result and three packet files');
  assert.ok([...reads.values()].every((count) => count === 1), 'shared evidence paths must be read once per preflight');
  assert.equal(verificationCalls, 1, 'each unique packet must be verified once per preflight');
  assert.equal(listingCalls, 1, 'each unique packet must be listed once per preflight');
  assert.equal(hashCalls, 5, 'each packet payload, packet digest, manifest, and result are hashed once');

  const emptyExposure = structuredClone(receipt);
  emptyExposure.evaluation.evaluator.exposedPaths = [];
  assert.ok(preflightReceipt(root, emptyExposure).errors.some((error) => error.includes('evaluator.exposedPaths')));

  const missingCheck = structuredClone(receipt);
  missingCheck.checks.pop();
  assert.ok(preflightReceipt(root, missingCheck).errors.some((error) => error.includes('missing required check')));
  const unmappedCheck = structuredClone(receipt);
  unmappedCheck.checks[0].name = 'unknown-check';
  assert.ok(preflightReceipt(root, unmappedCheck).errors.some((error) => error.includes('unmapped check')));
  const contamination = structuredClone(receipt);
  contamination.evaluation.evaluator.expectedAnswersExposed = true;
  assert.ok(preflightReceipt(root, contamination).errors.some((error) => error.includes('exposure')));
  const incomplete = structuredClone(receipt);
  incomplete.checks[0].result = 'incomplete';
  assert.equal(preflightReceipt(root, incomplete).state, 'incomplete');
  const unlocatableCase = structuredClone(receipt);
  unlocatableCase.checks[0].cases[0].caseId = 'not-in-result';
  assert.equal(preflightReceipt(root, unlocatableCase).state, 'invalid');
  const wrongCachedHash = structuredClone(receipt);
  wrongCachedHash.checks[1].cases[0].resultSha256 = '0'.repeat(64);
  assert.ok(preflightReceipt(root, wrongCachedHash).errors.some((error) => error.includes('result hash mismatch')));
  const wrongCachedManifestHash = structuredClone(receipt);
  wrongCachedManifestHash.checks[1].cases[0].manifestSha256 = '0'.repeat(64);
  assert.ok(preflightReceipt(root, wrongCachedManifestHash).errors.some((error) => error.includes('manifest hash mismatch')));
  const wrongCachedPacketId = structuredClone(receipt);
  wrongCachedPacketId.checks[1].cases[0].packetId = 'different-packet';
  assert.ok(preflightReceipt(root, wrongCachedPacketId).errors.some((error) => error.includes('packet id or packet revision')));
  const duplicatedCaseId = structuredClone(receipt);
  duplicatedCaseId.checks[0].cases[0] = { ...reference, packetId: secondPacketManifest.id, packetPath: secondPacketPath, manifestSha256: secondPacketManifestSha };
  assert.equal(preflightReceipt(root, duplicatedCaseId).state, 'invalid');
  const failed = structuredClone(receipt);
  failed.checks[0].result = 'fail';
  assert.equal(preflightReceipt(root, failed).state, 'failed');

  fs.writeFileSync(resultFile, 'modified');
  assert.ok(preflightReceipt(root, receipt).errors.some((error) => error.includes('result hash mismatch')));
  writeResult();
  fs.rmSync(resultFile);
  assert.ok(preflightReceipt(root, receipt).errors.some((error) => error.includes('missing or unsafe evidence')));
  writeResult();
  fs.writeFileSync(path.join(root, packetPath, 'request.md'), 'tampered');
  let failedPacketVerifications = 0;
  const tamperedPacket = preflightReceipt(root, receipt, { verify: (directory, options) => {
    failedPacketVerifications += 1;
    return verifyPacket(directory, options);
  } });
  assert.ok(tamperedPacket.errors.some((error) => error.includes('changed')));
  assert.equal(failedPacketVerifications, 1, 'failed packet verification is cached only for this preflight invocation');
  fs.writeFileSync(path.join(root, packetPath, 'request.md'), 'Review fixture\n');
  assert.equal(preflightReceipt(root, receipt).valid, true, 'a later invocation must reread corrected packet bytes');
  fs.rmSync(resultFile, { force: true });
  fs.rmSync(root, { recursive: true, force: true });
} finally {
  if (fs.existsSync(root)) fs.rmSync(root, { recursive: true, force: true });
}

const cliRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'eval-loop-cli-'));
try {
  const cliScripts = path.join(cliRoot, 'scripts');
  fs.mkdirSync(cliScripts, { recursive: true });
  for (const name of ['eval-feedback-loop.mjs', 'eval-config-planner.mjs', 'bounded-files.mjs', 'build-eval-packet.mjs']) {
    fs.copyFileSync(path.join(repoRoot, 'scripts', name), path.join(cliScripts, name));
  }
  const packageLink = path.join(cliRoot, 'node_modules/@mehul0810/agent-harness');
  fs.mkdirSync(path.dirname(packageLink), { recursive: true });
  fs.symlinkSync(path.join(repoRoot, 'node_modules/@mehul0810/agent-harness'), packageLink, 'dir');
  fs.mkdirSync(path.join(cliRoot, 'skill-evals'), { recursive: true });
  fs.mkdirSync(path.join(cliRoot, 'owned'), { recursive: true });
  fs.writeFileSync(path.join(cliRoot, 'owned/a.md'), 'a');
  fs.writeFileSync(path.join(cliRoot, 'owned/b.md'), 'b');
  const cliManifest = { schemaVersion: 2, baselines: [
    { name: 'baseline-a', files: ['owned/a.md'], requiredChecks: ['a-check'] },
    { name: 'baseline-b', files: ['owned/b.md'], requiredChecks: ['b-check'] },
  ] };
  fs.writeFileSync(path.join(cliRoot, 'skill-evals/behavior-baselines.json'), JSON.stringify(cliManifest, null, 2));
  const writeConfig = (projectRoot, maxWords = 100, files = ['owned/a.md'], extra = {}) => fs.writeFileSync(
    path.join(cliRoot, 'agent-harness.config.json'),
    JSON.stringify({ schemaVersion: 1, projectRoot, routeBudgets: [{ name: 'Scoped route', maxWords, files }], ...extra }, null, 2),
  );
  const git = (...args) => execFileSync('git', args, { cwd: cliRoot, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  git('init', '-b', 'main');
  git('config', 'user.name', 'Eval Loop Test');
  git('config', 'user.email', 'eval-loop@example.invalid');
  writeConfig('.');
  git('add', '-A');
  git('commit', '-m', 'fixture base');
  git('switch', '-c', 'topic');
  writeConfig('.', 200);
  git('add', 'agent-harness.config.json');
  git('commit', '-m', 'scoped config change');
  git('switch', 'main');
  writeConfig('main-only');
  fs.writeFileSync(path.join(cliRoot, 'README.md'), 'main diverged');
  git('add', '-A');
  git('commit', '-m', 'diverged main config change');
  git('switch', 'topic');

  const cli = (...args) => {
    try {
      const cliPath = fs.realpathSync(path.join(cliScripts, 'eval-feedback-loop.mjs'));
      return JSON.parse(execFileSync(process.execPath, [cliPath, 'plan', ...args], {
        cwd: cliRoot, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'],
      }));
    } catch (error) {
      throw new Error(`fixture CLI failed: stdout=${error.stdout ?? ''}; stderr=${error.stderr ?? ''}; ${error.message}`);
    }
  };
  const scopedCli = cli('--base', 'main', '--head', 'topic');
  assert.deepEqual(scopedCli.affected.map((item) => item.baseline), ['baseline-a'], 'CLI semantic config comparison must use the actual merge-base');
  assert.equal(scopedCli.fullAggregateRequired, true);
  const committedManifestBytes = Buffer.from(git('show', 'topic:skill-evals/behavior-baselines.json'));
  const swappedManifest = structuredClone(cliManifest);
  swappedManifest.baselines[0].files = ['owned/b.md'];
  swappedManifest.baselines[1].files = ['owned/a.md'];
  fs.writeFileSync(path.join(cliRoot, 'skill-evals/behavior-baselines.json'), JSON.stringify(swappedManifest, null, 2));
  const scopedWithDirtyManifest = cli('--base', 'main', '--head', 'topic');
  assert.deepEqual(scopedWithDirtyManifest.affected.map((item) => item.baseline), ['baseline-a'], 'committed planning must use head manifest ownership, not dirty worktree ownership');
  assert.throws(() => cli('--base', 'main', '--head', 'topic', '--file', 'skill-evals/behavior-baselines.json'), /differs from the committed head/);
  fs.writeFileSync(path.join(cliRoot, 'skill-evals/behavior-baselines.json'), committedManifestBytes);
  const explicitConfigCli = cli('--base', 'main', '--head', 'topic', '--file', CONFIG_PATH);
  assert.deepEqual(explicitConfigCli.affected.map((item) => item.baseline), ['baseline-a', 'baseline-b'], 'explicit dirty config input must invalidate all');

  git('switch', '-c', 'global-config');
  writeConfig('global-change');
  git('add', 'agent-harness.config.json');
  git('commit', '-m', 'global config change');
  const globalCli = cli('--base', 'main', '--head', 'global-config');
  assert.deepEqual(globalCli.affected.map((item) => item.baseline), ['baseline-a', 'baseline-b']);

  git('switch', 'main');
  git('switch', '-c', 'unknown-config');
  writeConfig('main-only', 100, ['owned/a.md'], { unknownPolicy: true });
  git('add', 'agent-harness.config.json');
  git('commit', '-m', 'unknown config field');
  const unknownCli = cli('--base', 'main', '--head', 'unknown-config');
  assert.deepEqual(unknownCli.affected.map((item) => item.baseline), ['baseline-a', 'baseline-b']);

  git('switch', 'main');
  git('switch', '-c', 'unmapped-config');
  writeConfig('main-only', 101, ['unowned/file.md']);
  git('add', 'agent-harness.config.json');
  git('commit', '-m', 'unmapped config owner');
  const unmappedCli = cli('--base', 'main', '--head', 'unmapped-config');
  assert.deepEqual(unmappedCli.affected.map((item) => item.baseline), ['baseline-a', 'baseline-b']);
} finally {
  fs.rmSync(cliRoot, { recursive: true, force: true });
}
console.log('Evaluation feedback planner and draft receipt preflight tests passed');
