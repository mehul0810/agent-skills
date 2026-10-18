import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { buildPacket } from './build-eval-packet.mjs';
import { preflightReceipt } from './eval-feedback-loop.mjs';

const root = fs.mkdtempSync(path.join(os.tmpdir(), 'attempt-evidence-'));
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const revision = 'a'.repeat(40);
let checks = 0;
try {
  const write = (name, data) => {
    const target = path.join(root, name);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, Buffer.isBuffer(data) || typeof data === 'string' ? data : JSON.stringify(data));
    return { path: target, sha256: hash(fs.readFileSync(target)) };
  };
  write('skill-evals/behavior-baselines.json', { schemaVersion: 2, baselines: [{ name: 'sample', requiredChecks: ['understood', 'finished'] }] });
  write('fixture/input.json', { id: 'blind', request: 'Inspect the raw fixture and produce the requested artifact.', artifacts: [] });
  buildPacket(path.join(root, 'fixture'), path.join(root, 'packet'), revision);
  const manifestHash = hash(fs.readFileSync(path.join(root, 'packet/manifest.json')));
  const skill = write('skill/SKILL.md', 'Example instruction bytes');
  const artifact = write('artifact.html', '<!doctype html><p>Small test artifact</p>');
  // A real small PNG; fixture validation proves byte/type binding, not rendering.
  const png = write('capture.png', Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+j2ioAAAAASUVORK5CYII=', 'base64'));
  const evaluation = {
    evaluator: { identity: 'performer', exposedPaths: ['packet', 'skill'], expectedAnswersExposed: false, candidateSourceExposed: false },
    scorer: { identity: 'reviewer', exposedPaths: ['output', 'criteria'], expectedAnswersExposed: true, candidateSourceExposed: false },
  };
  const missing = reason => ({ status: 'unavailable', reason });
  const makeAttempt = (id, kind, outcome = 'pass', completion = 'accepted', lane = 'standalone-agent') => {
    const identity = { attemptId: id, targetId: 'local-artifact-1', sourceRevision: revision };
    const result = write(`${id}-result.json`, { cases: [{ packetId: 'blind', id: 'one', outcome: 'Recorded response' }] });
    const acceptance = write(`${id}-completion.json`, { ...identity, kind: 'completion', acceptedBy: 'reviewer', result: 'accepted', artifacts: [artifact] });
    const trace = write(`${id}-trace.log`, `Synthetic fixture: ${id} read ${skill.path}; not a real host trace.\n`);
    const activation = write(`${id}-activation.json`, { ...identity, kind: 'skill-activation', observer: 'evaluator-log', trace, loadedFiles: [skill] });
    return {
      id, kind, turnCount: 1,
      checks: ['understood', 'finished'].map(name => ({ name, result: outcome, cases: [{ packetId: 'blind', caseId: 'one', packetPath: path.join(root, 'packet'), manifestSha256: manifestHash, resultPath: result.path, resultSha256: result.sha256 }] })),
      runtime: { lane, targetId: identity.targetId, activation: { status: 'observed', evidence: activation },
        renders: missing('No rendered proof required for this decision fixture'),
        completion: completion === 'accepted' ? { status: completion, evidence: acceptance } : { status: completion, reason: 'Required work not yet accepted' } },
    };
  };
  const initial = makeAttempt('first', 'initial');
  const good = { schemaVersion: 2, status: 'draft', baseline: 'sample', testedRevision: revision, evaluation, caseUsage: 'held-out', requiredCaptures: [], attempts: [initial] };
  const run = receipt => preflightReceipt(root, receipt);
  const assertGood = receipt => { const result = run(receipt); assert.equal(result.valid, true, JSON.stringify(result.errors)); checks++; return result; };
  const bad = (change, pattern, base = good) => {
    const receipt = structuredClone(base); change(receipt);
    const result = run(receipt);
    assert.equal(result.valid, false, JSON.stringify(result));
    assert.match(result.errors.join('; '), pattern);
    checks++;
  };
  const passed = assertGood(good);
  assert.equal(passed.state, 'complete');
  assert.equal(passed.firstAttempt.checks, 'complete');
  assert.equal(passed.heldOutTransferEligible, true);
  assert.equal(passed.recoveryAssisted, false);
  const recovery = { ...good, attempts: [makeAttempt('failed-first', 'initial', 'fail', 'rejected'), makeAttempt('repair', 'recovery')] };
  const repaired = assertGood(recovery);
  assert.equal(repaired.firstAttempt.checks, 'failed');
  assert.equal(repaired.finalAttempt.completion, 'accepted');
  assert.equal(repaired.recoveryAssisted, true);
  assert.equal(repaired.heldOutTransferEligible, false, 'a repaired held-out task is development evidence');
  assert.equal(repaired.totalTurns, 2);
  const noTelemetry = structuredClone(good); noTelemetry.attempts[0].turnCount = null;
  assert.equal(assertGood(noTelemetry).totalTurns, null);
  const lostAck = structuredClone(good);
  lostAck.attempts[0].runtime.completion = { status: 'incomplete', reason: 'Execution acknowledgement was lost; outcome not reconciled' };
  assert.equal(assertGood(lostAck).state, 'incomplete', 'green checks cannot override missing authoritative completion');
  const absentHost = structuredClone(good);
  absentHost.attempts[0].runtime.lane = 'target-harness';
  absentHost.attempts[0].runtime.activation = missing('Native host trace is not exposed');
  absentHost.attempts[0].runtime.completion = { status: 'blocked', reason: 'Target host unavailable' };
  assert.equal(assertGood(absentHost).state, 'incomplete');
  const dev = { ...good, caseUsage: 'development' };
  assert.equal(assertGood(dev).heldOutTransferEligible, false);
  bad(r => { r.attempts[0].runtime.lane = 'target-harness'; }, /host-trace/);
  bad(r => { r.attempts[0].kind = 'recovery'; }, /first attempt/);
  bad(r => { r.attempts.push(structuredClone(r.attempts[0])); }, /unique attempt/);
  bad(r => { r.attempts[0].runtime.targetId = 'stale-target'; }, /stale or mismatched/);
  bad(r => { r.attempts[0].id = 'stale-attempt'; }, /stale or mismatched/);
  bad(r => { r.attempts[0].checks[0].result = 'incomplete'; }, /every check/);
  bad(r => { r.attempts[0].checks.pop(); }, /missing required check/);
  bad(r => { r.attempts[0].checks[0].cases[0].caseId = 'corrected-id'; }, /not locatable/);
  bad(r => { r.attempts[0].checks[0].cases[0].resultSha256 = '0'.repeat(64); }, /hash mismatch/);
  bad(r => { r.attempts[0].runtime.completion.evidence = r.attempts[0].runtime.activation.evidence; }, /mismatched/);
  bad(r => { r.attempts[0].turnCount = -1; }, /turnCount/);
  bad(r => { r.attempts[0].runtime.activation = { status: 'unavailable' }; }, /reason/);
  bad(r => { r.checks = r.attempts[0].checks; }, /overwrite/);
  bad(r => { r.requiredCaptures = null; }, /explicit array/);
  bad(r => { r.caseUsage = 'probably-unseen'; }, /caseUsage/);
  bad(r => { r.attempts[1].runtime.targetId = 'new-target'; }, /target or runtime lane changed/, recovery);
  const editedAcceptance = (name, values) => write(name, { kind: 'completion', attemptId: 'first', targetId: 'local-artifact-1', sourceRevision: revision, acceptedBy: 'reviewer', result: 'accepted', artifacts: [artifact], ...values });
  bad(r => { r.attempts[0].runtime.completion.evidence = editedAcceptance('wrong-scorer.json', { acceptedBy: 'performer' }); }, /independent scorer/);
  bad(r => { r.attempts[0].runtime.completion.evidence = editedAcceptance('wrong-revision.json', { sourceRevision: 'b'.repeat(40) }); }, /mismatched/);
  bad(r => { r.attempts[0].runtime.completion.evidence = editedAcceptance('absent-artifact.json', { artifacts: [] }); }, /final artifact/);
  const requirements = [{ id: 'desktop-small-height', width: 1280, height: 600, state: 'initial' }, { id: 'mobile', width: 390, height: 844, state: 'expanded' }];
  const renderData = { kind: 'rendered-artifact', attemptId: 'first', targetId: 'local-artifact-1', sourceRevision: revision,
    captures: requirements.map(item => ({ ...item, artifact, image: png })) };
  const rendered = structuredClone(good);
  rendered.requiredCaptures = requirements;
  rendered.attempts[0].runtime.renders = { status: 'observed', evidence: write('renders.json', renderData) };
  assert.equal(assertGood(rendered).state, 'complete');
  bad(r => { r.attempts[0].runtime.renders = missing('No browser available'); }, /requires.*rendered/, rendered);
  bad(r => { const data = structuredClone(renderData); data.captures.pop(); r.attempts[0].runtime.renders.evidence = write('missing-render.json', data); }, /every requested rendered capture/, rendered);
  bad(r => { const data = structuredClone(renderData); data.captures[0].image = artifact; r.attempts[0].runtime.renders.evidence = write('fake-render.json', data); }, /PNG image bytes/, rendered);
  bad(r => { const data = structuredClone(renderData); data.captures[0].height = 900; r.attempts[0].runtime.renders.evidence = write('wrong-size.json', data); }, /viewport/, rendered);
  const unrelated = write('unrendered-artifact.html', '<p>Different candidate</p>');
  bad(r => { r.attempts[0].runtime.completion.evidence = editedAcceptance('wrong-artifact.json', { artifacts: [unrelated] }); }, /not bound to the accepted/, rendered);
  const partial = structuredClone(rendered);
  const partialData = structuredClone(renderData); partialData.captures.pop();
  partial.attempts[0].runtime.renders.evidence = write('partial-render.json', partialData);
  partial.attempts[0].runtime.completion = { status: 'rejected', reason: 'Mobile capture was not produced' };
  const partialResult = assertGood(partial);
  assert.equal(partialResult.state, 'failed');
  assert.equal(partialResult.firstAttempt.rendered, 'partial');
  const partialRecovery = structuredClone(partial);
  partialRecovery.attempts[0].checks[1].result = 'fail';
  const completeRetry = makeAttempt('render-retry', 'recovery');
  completeRetry.runtime.renders = { status: 'observed', evidence: write('render-retry.json', { ...renderData, attemptId: completeRetry.id }) };
  partialRecovery.attempts.push(completeRetry);
  const resumedRender = assertGood(partialRecovery);
  assert.equal(resumedRender.state, 'complete');
  assert.equal(resumedRender.firstAttempt.checks, 'failed');
  assert.equal(resumedRender.firstAttempt.rendered, 'partial');
  assert.equal(resumedRender.recoveryAssisted, true);
  assert.equal(resumedRender.heldOutTransferEligible, false);
  const readActivation = () => JSON.parse(fs.readFileSync(initial.runtime.activation.evidence.path));
  bad(r => { const data = readActivation(); delete data.trace; r.attempts[0].runtime.activation.evidence = write('no-trace.json', data); }, /activation trace/);
  bad(r => { const data = readActivation(); data.trace = write('empty-trace.log', ''); r.attempts[0].runtime.activation.evidence = write('empty-trace.json', data); }, /must not be empty/);
  bad(r => { const data = readActivation(); data.trace.sha256 = '0'.repeat(64); r.attempts[0].runtime.activation.evidence = write('wrong-trace.json', data); }, /hash mismatch/);
  const zeroLoads = structuredClone(good);
  const noLoadedFiles = readActivation(); noLoadedFiles.loadedFiles = [];
  zeroLoads.attempts[0].runtime.activation.evidence = write('zero-loads.json', noLoadedFiles);
  zeroLoads.attempts[0].runtime.completion = { status: 'blocked', reason: 'Observed trace had no skill reads' };
  assert.equal(assertGood(zeroLoads).state, 'incomplete');
  const link = path.join(root, 'linked.json');
  fs.symlinkSync(initial.runtime.completion.evidence.path, link);
  bad(r => { r.attempts[0].runtime.completion.evidence.path = link; }, /unsafe evidence/);
  assert.equal(preflightReceipt(root, good, { limits: { maxTotalBytes: 10 } }).valid, false); checks++;
  // Frozen output replacement and stale receipts fail; a new read observes edits.
  fs.writeFileSync(artifact.path, '<p>Changed after acceptance</p>');
  assert.equal(run(good).valid, false); checks++;
  fs.writeFileSync(artifact.path, '<!doctype html><p>Small test artifact</p>');
  assertGood(good);
  // Repeated preflight is read-only validation, never task execution or replay.
  const before = fs.readdirSync(root).sort();
  assertGood(recovery);
  assert.deepEqual(fs.readdirSync(root).sort(), before);
  for (const value of [null, 1, 'x', [], {}]) {
    assert.equal(run({ ...good, attempts: [value] }).valid, false); checks++;
  }
  console.log(`Attempt evidence regression passed (${checks} cases; synthetic local evidence, no model/API calls or runtime execution).`);
} finally { fs.rmSync(root, { recursive: true, force: true }); }
