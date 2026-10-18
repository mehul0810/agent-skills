import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { normalizeFileLimits, safeReadFile } from './bounded-files.mjs';

const SHA256 = /^[a-f0-9]{64}$/;
const text = value => typeof value === 'string' && value.trim().length > 0;
const object = value => value && typeof value === 'object' && !Array.isArray(value);
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const unavailable = new Set(['unavailable', 'unrun', 'blocked']);

// This verifies a supplied evidence chain. It does not authenticate a host, the
// scorer, screenshots, or semantic claims, and never executes/replays a task.
export function preflightAttempts(root, receipt, options, preflight) {
  const errors = [];
  const summaries = [];
  try {
    const limits = normalizeFileLimits(options.limits);
    const cache = new Map();
    let totalBytes = 0;
    const readBytes = (file, { maxBytes = limits.maxFileBytes } = {}) => {
      const absolute = path.resolve(file);
      let bytes = cache.get(absolute);
      if (!bytes) {
        if (cache.size >= limits.maxEntries) throw new Error('Attempt evidence exceeds entry limit');
        bytes = (options.readFile ?? safeReadFile)(absolute, { maxBytes: Math.min(maxBytes, limits.maxFileBytes, limits.maxTotalBytes - totalBytes) });
        totalBytes += bytes.length;
        if (totalBytes > limits.maxTotalBytes) throw new Error('Attempt evidence exceeds total byte limit');
        cache.set(absolute, bytes);
      }
      if (bytes.length > maxBytes) throw new Error('Attempt evidence exceeds file byte limit');
      return bytes;
    };
    const read = (reference, label) => {
      if (!object(reference) || !text(reference.path) || !SHA256.test(reference.sha256 ?? '')) throw new Error(`${label}: path and SHA-256 required`);
      const supplied = path.resolve(root, reference.path);
      const absolute = fs.realpathSync(supplied);
      if (absolute !== supplied || (!path.isAbsolute(reference.path) && !absolute.startsWith(fs.realpathSync(root) + path.sep))) throw new Error(`${label}: unsafe evidence path`);
      const bytes = readBytes(absolute);
      if ((options.hashBytes ?? sha)(bytes) !== reference.sha256) throw new Error(`${label}: evidence hash mismatch`);
      return bytes;
    };
    const observation = (value, label, kind, attempt) => {
      if (!object(value)) throw new Error(`${label}: explicit observation status required`);
      if (unavailable.has(value.status)) {
        if (!text(value.reason) || value.evidence !== undefined) throw new Error(`${label}: unavailable observations need a reason and no evidence claim`);
        return null;
      }
      if (value.status !== 'observed') throw new Error(`${label}: invalid observation status`);
      const data = JSON.parse(read(value.evidence, label).toString('utf8'));
      if (!object(data) || data.kind !== kind || data.attemptId !== attempt.id
        || data.targetId !== attempt.runtime.targetId || data.sourceRevision !== receipt.testedRevision) throw new Error(`${label}: stale or mismatched evidence identity`);
      return data;
    };
    if (receipt.status !== 'draft' || !Array.isArray(receipt.attempts) || !receipt.attempts.length || receipt.attempts.length > 100) throw new Error('schemaVersion 2 requires 1–100 retained attempts and status draft');
    if (receipt.checks !== undefined) throw new Error('schemaVersion 2 checks belong to each attempt; do not overwrite earlier results');
    if (!['development', 'held-out'].includes(receipt.caseUsage)) throw new Error('caseUsage must explicitly be development or held-out');
    const requirements = receipt.requiredCaptures;
    if (!Array.isArray(requirements)) throw new Error('requiredCaptures must be an explicit array (empty for non-rendered tasks)');
    const captureIds = new Set();
    for (const capture of requirements) {
      if (!object(capture) || !text(capture.id) || captureIds.has(capture.id) || !text(capture.state)
        || !Number.isSafeInteger(capture.width) || capture.width < 1 || !Number.isSafeInteger(capture.height) || capture.height < 1) throw new Error('requiredCaptures need unique IDs, state and positive viewport dimensions');
      captureIds.add(capture.id);
    }
    const ids = new Set();
    let expectedTarget;
    let expectedLane;
    let caseSet;
    for (const [index, attempt] of receipt.attempts.entries()) {
      try {
        if (!object(attempt) || !text(attempt.id) || ids.has(attempt.id)) throw new Error('unique attempt id required');
        ids.add(attempt.id);
        if (attempt.kind !== (index === 0 ? 'initial' : 'recovery')) throw new Error('first attempt must be initial; every later attempt must be recovery');
        if (attempt.turnCount !== null && (!Number.isSafeInteger(attempt.turnCount) || attempt.turnCount < 1)) throw new Error('turnCount must be observed positive integer or null');
        const runtime = attempt.runtime;
        if (!object(runtime) || !text(runtime.targetId) || !['direct-tool', 'standalone-agent', 'target-harness'].includes(runtime.lane)) throw new Error('runtime lane and exact targetId required');
        expectedTarget ??= runtime.targetId;
        expectedLane ??= runtime.lane;
        if (runtime.targetId !== expectedTarget || runtime.lane !== expectedLane) throw new Error('target or runtime lane changed; use a separate comparison receipt');
        const nested = preflight(root, {
          schemaVersion: 1, status: 'draft', baseline: receipt.baseline, testedRevision: receipt.testedRevision,
          evaluation: attempt.evaluation ?? receipt.evaluation, checks: attempt.checks,
        }, { ...options, readFile: readBytes });
        if (!nested.valid) throw new Error(nested.errors.join('; '));
        const cases = [...new Set(attempt.checks.flatMap(check => check.cases.map(ref => JSON.stringify([check.name, ref.packetId, ref.caseId, ref.manifestSha256]))))].sort();
        const caseKey = JSON.stringify(cases);
        caseSet ??= caseKey;
        if (caseSet !== caseKey) throw new Error('attempt check/case/packet mapping changed; retain the same frozen comparison corpus');
        const activation = observation(runtime.activation, 'activation', 'skill-activation', attempt);
        if (activation) {
          if (!['host-trace', 'evaluator-log'].includes(activation.observer) || !Array.isArray(activation.loadedFiles)) throw new Error('activation needs observer fidelity and actually loaded file evidence');
          if (!read(activation.trace, 'activation trace').length) throw new Error('activation trace must not be empty');
          const loaded = new Set();
          for (const file of activation.loadedFiles) {
            read(file, 'loaded file');
            const key = fs.realpathSync(path.resolve(root, file.path));
            if (loaded.has(key)) throw new Error('duplicate loaded file');
            loaded.add(key);
          }
        }
        const renders = observation(runtime.renders, 'renders', 'rendered-artifact', attempt);
        const renderedSources = new Set();
        let renderComplete = requirements.length === 0;
        if (renders) {
          if (!Array.isArray(renders.captures)) throw new Error('rendered evidence needs captures');
          const seen = new Set();
          for (const capture of renders.captures) {
            const required = requirements.find(item => item.id === capture?.id);
            if (!required || seen.has(capture.id) || capture.width !== required.width || capture.height !== required.height || capture.state !== required.state) throw new Error('rendered capture is duplicate, unmapped or has the wrong viewport/state');
            seen.add(capture.id);
            read(capture.artifact, 'rendered source artifact');
            renderedSources.add(JSON.stringify([fs.realpathSync(path.resolve(root, capture.artifact.path)), capture.artifact.sha256]));
            const image = read(capture.image, 'rendered PNG');
            if (image.length < 33 || !image.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
              || image.toString('ascii', 12, 16) !== 'IHDR' || image.readUInt32BE(16) < 1 || image.readUInt32BE(20) < 1) throw new Error('rendered capture must contain PNG image bytes');
          }
          renderComplete = seen.size === requirements.length;
        }
        const completion = runtime.completion;
        if (!object(completion) || !['accepted', 'rejected', 'incomplete', 'blocked', 'unrun'].includes(completion.status)) throw new Error('explicit completion status required');
        if (completion.status === 'accepted') {
          if (nested.state !== 'complete') throw new Error('accepted completion requires every check to pass');
          if (!renderComplete) throw new Error('accepted completion requires every requested rendered capture');
          const evidence = observation({ status: 'observed', evidence: completion.evidence }, 'completion', 'completion', attempt);
          const scorer = (attempt.evaluation ?? receipt.evaluation)?.scorer?.identity;
          if (evidence.acceptedBy !== scorer || evidence.result !== 'accepted' || !Array.isArray(evidence.artifacts) || !evidence.artifacts.length) throw new Error('completion requires the independent scorer and final artifact evidence');
          const acceptedSources = new Set();
          for (const artifact of evidence.artifacts) {
            read(artifact, 'accepted artifact');
            acceptedSources.add(JSON.stringify([fs.realpathSync(path.resolve(root, artifact.path)), artifact.sha256]));
          }
          for (const renderedSource of renderedSources) {
            if (!acceptedSources.has(renderedSource)) throw new Error('rendered source artifact is not bound to the accepted artifacts');
          }
          // A completed target-harness claim additionally needs a host trace. An
          // evaluator reading instructions is useful evidence, not native loading.
          if (runtime.lane === 'target-harness' && (activation?.observer !== 'host-trace' || !activation.loadedFiles.length)) throw new Error('target-harness acceptance requires host-trace activation evidence and loaded skill bytes');
        } else if (!text(completion.reason) || completion.evidence !== undefined) throw new Error('non-accepted completion needs a reason and no acceptance evidence');
        summaries.push({ id: attempt.id, kind: attempt.kind, checks: nested.state, completion: completion.status,
          turnCount: attempt.turnCount, activation: activation?.observer ?? runtime.activation.status,
          rendered: renders ? (renderComplete ? 'observed' : 'partial') : runtime.renders.status });
      } catch (error) { errors.push(`attempt ${index + 1}: ${error.message}`); }
    }
  } catch (error) { errors.push(error.message); }
  const first = summaries[0];
  const final = summaries.at(-1);
  const valid = errors.length === 0;
  return {
    valid, errors,
    state: !valid ? 'invalid' : final.completion === 'accepted' ? 'complete' : (final.checks === 'failed' || final.completion === 'rejected') ? 'failed' : 'incomplete',
    admission: 'not-performed',
    firstAttempt: valid ? first : null,
    finalAttempt: valid ? final : null,
    recoveryAssisted: valid ? summaries.length > 1 && final.completion === 'accepted' : null,
    heldOutTransferEligible: valid && receipt.caseUsage === 'held-out' && summaries.length === 1 && first.completion === 'accepted',
    totalTurns: valid && summaries.every(item => item.turnCount !== null) ? summaries.reduce((sum, item) => sum + item.turnCount, 0) : null,
    attempts: summaries,
    evidenceLimit: 'Supplied local bytes and identity bindings only; observer/scorer identity, exposure, render quality, remote outcomes and native activation are not authenticated. No execution, replay, baseline admission or model policy change is performed.',
  };
}
