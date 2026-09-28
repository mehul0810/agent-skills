import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { buildPacket } from './build-eval-packet.mjs';
import { mergeChangedPaths, planBaselines, preflightReceipt } from './eval-feedback-loop.mjs';

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
    checks: baseline.requiredChecks.map((name) => ({ name, result: 'pass', cases: [reference] })),
  };
  const good = preflightReceipt(root, receipt);
  assert.equal(good.valid, true, JSON.stringify(good.errors));
  assert.equal(good.state, 'complete');
  assert.equal(good.admission, 'not-performed');

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
  assert.ok(preflightReceipt(root, receipt).errors.some((error) => error.includes('changed')));
  fs.rmSync(resultFile, { force: true });
  fs.rmSync(root, { recursive: true, force: true });
} finally {
  if (fs.existsSync(root)) fs.rmSync(root, { recursive: true, force: true });
}
console.log('Evaluation feedback planner and draft receipt preflight tests passed');
