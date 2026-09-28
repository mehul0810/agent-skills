#!/usr/bin/env node
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { verifyPacket } from './build-eval-packet.mjs';
import { DEFAULT_FILE_LIMITS, normalizeFileLimits, safeReadFile, listRegularFiles } from './bounded-files.mjs';
import { analyzeConfigChange, CONFIG_PATH } from './eval-config-planner.mjs';

const rootDefault = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SHA256 = /^[a-f0-9]{64}$/;
const REVISION = /^[a-f0-9]{40}$/;
const GLOBAL_INPUTS = new Set([
  'skill-evals/behavior-baselines.json',
  'scripts/behavior-evidence-audit.mjs',
  'scripts/harness-runtime-fingerprint.mjs',
  'package.json',
  'package-lock.json',
  'agent-harness.config.json',
]);

function safeRepoPath(value) {
  if (typeof value !== 'string' || !value || path.isAbsolute(value) || value.includes('\\')
    || value.split('/').some((part) => !part || part === '.' || part === '..' || part === '.git')) {
    throw new Error(`unsafe repository-relative path: ${value}`);
  }
  return value;
}

export function planBaselines(manifest, changedPaths, { semanticConfig = null } = {}) {
  if (manifest?.schemaVersion !== 2 || !Array.isArray(manifest.baselines)) throw new Error('invalid behavior baseline manifest');
  if (!Array.isArray(changedPaths) || !changedPaths.length) throw new Error('at least one changed path is required');
  const paths = [...new Set(changedPaths.map(safeRepoPath))].sort();
  const allInputs = paths.filter((file) => GLOBAL_INPUTS.has(file)
    && !(file === CONFIG_PATH && semanticConfig?.safe === true));
  const all = new Set(allInputs.length ? manifest.baselines.map((b) => b.name) : []);
  const dependencies = new Map();
  for (const baseline of manifest.baselines) {
    if (typeof baseline.name !== 'string' || !baseline.name || !Array.isArray(baseline.requiredChecks)
      || !baseline.requiredChecks.length || new Set(baseline.requiredChecks).size !== baseline.requiredChecks.length) {
      throw new Error('baseline names and complete unique requiredChecks are required');
    }
    const files = [
      ...(baseline.files ?? []),
      ...(baseline.scenario?.files ?? []),
      ...(baseline.scenario?.fixtureFiles ?? []),
    ].map(safeRepoPath);
    for (const file of files) {
      if (!dependencies.has(file)) dependencies.set(file, new Set());
      dependencies.get(file).add(baseline.name);
    }
  }
  const unmapped = [];
  for (const file of paths) {
    const owners = dependencies.get(file);
    if (owners) for (const name of owners) all.add(name);
    else if (!GLOBAL_INPUTS.has(file)) unmapped.push(file);
  }
  if (paths.includes(CONFIG_PATH) && semanticConfig?.safe === true) {
    for (const file of semanticConfig.ownedPaths ?? []) {
      safeRepoPath(file);
      const owners = dependencies.get(file);
      if (!owners) {
        all.clear();
        for (const baseline of manifest.baselines) all.add(baseline.name);
        break;
      }
      for (const name of owners) all.add(name);
    }
  }
  const byName = new Map(manifest.baselines.map((b) => [b.name, b]));
  return {
    changedPaths: paths,
    affected: [...all].sort().map((name) => ({ baseline: name, requiredChecks: [...byName.get(name).requiredChecks] })),
    unmapped,
    fullAggregateRequired: true,
    policy: 'Run every required check for each affected baseline; never select a subset. Unmapped changes invalidate selective planning. Run the full aggregate gate before publication.',
  };
}

function readJson(file) { return JSON.parse(fs.readFileSync(file, 'utf8')); }
function list(value, label) {
  if (!Array.isArray(value) || value.length === 0 || value.some((x) => typeof x !== 'string' || !x.trim()) || new Set(value).size !== value.length) {
    throw new Error(`${label} must be a non-empty array of unique strings`);
  }
  return value;
}

export function mergeChangedPaths(explicitPaths, diffPaths) {
  return [...new Set([...explicitPaths, ...diffPaths])];
}

function resolveEvidenceFile(root, value) {
  if (typeof value !== 'string' || !value.trim()) throw new Error('evidence file path is required');
  try {
    const isAbsolute = path.isAbsolute(value);
    const target = isAbsolute ? value : path.resolve(root, safeRepoPath(value));
    if (fs.lstatSync(target).isSymbolicLink()) throw new Error('evidence must be a regular file');
    const real = fs.realpathSync(target);
    if (!isAbsolute && !real.startsWith(fs.realpathSync(root) + path.sep)) throw new Error('evidence must be a regular file');
    if (!fs.statSync(real).isFile()) throw new Error('evidence must be a regular file');
    return real;
  } catch (error) {
    if (error.message === 'evidence must be a regular file') throw error;
    throw new Error('missing or unsafe evidence file');
  }
}

const sha256 = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');

export function preflightReceipt(root, receipt, {
  readFile = safeReadFile,
  listFiles = listRegularFiles,
  verify = verifyPacket,
  hashBytes = sha256,
  limits = DEFAULT_FILE_LIMITS,
} = {}) {
  const errors = [];
  try {
    limits = normalizeFileLimits(limits);
    if (receipt?.schemaVersion !== 1 || receipt.status !== 'draft') throw new Error('receipt must use schemaVersion 1 and status draft');
    const manifest = readJson(path.join(root, 'skill-evals/behavior-baselines.json'));
    const baseline = manifest.baselines.find((item) => item.name === receipt.baseline);
    if (!baseline) throw new Error(`unknown baseline: ${receipt.baseline}`);
    if (!REVISION.test(receipt.testedRevision ?? '')) throw new Error('exact testedRevision is required');

    const cache = new Map();
    let cachedBytes = 0;
    const readCached = (file, options = {}) => {
      const absolute = path.resolve(file);
      const maxBytes = Math.min(options.maxBytes ?? limits.maxFileBytes, limits.maxFileBytes);
      let bytes = cache.get(absolute);
      if (!bytes) {
        if (cache.size >= limits.maxEntries) throw new Error('Evidence exceeds file count limit');
        bytes = readFile(absolute, { maxBytes: Math.min(maxBytes, limits.maxTotalBytes - cachedBytes) });
        cachedBytes += bytes.length;
        if (cachedBytes > limits.maxTotalBytes) throw new Error('Evidence exceeds total byte limit');
        cache.set(absolute, bytes);
      }
      if (bytes.length > maxBytes) throw new Error('File exceeds byte limit');
      return bytes;
    };
    const resultCaseIndexes = new Map();
    const resultDigests = new Map();
    const verifiedPackets = new Map();
    const digestFile = (file) => {
      const key = path.resolve(file);
      if (!resultDigests.has(key)) resultDigests.set(key, hashBytes(readCached(file)));
      return resultDigests.get(key);
    };
    const resultHasCase = (file, packetId, caseId) => {
      const key = path.resolve(file);
      let index = resultCaseIndexes.get(key);
      if (!index) {
        const result = JSON.parse(readCached(file).toString('utf8'));
        if (!Array.isArray(result.cases)) {
          resultCaseIndexes.set(key, new Set());
          return false;
        }
        index = new Set(result.cases.filter((item) => item?.packetId && item?.id
          && ((typeof item?.outcome === 'string' && item.outcome.trim())
            || (typeof item?.decision === 'string' && item.decision.trim())))
          .map((item) => JSON.stringify([item.packetId, item.id])));
        resultCaseIndexes.set(key, index);
      }
      return index.has(JSON.stringify([packetId, caseId]));
    };

    const evalInfo = receipt.evaluation;
    if (!evalInfo || typeof evalInfo.evaluator?.identity !== 'string' || !evalInfo.evaluator.identity.trim()
      || typeof evalInfo.scorer?.identity !== 'string' || !evalInfo.scorer.identity.trim()
      || evalInfo.evaluator.identity === evalInfo.scorer.identity) throw new Error('distinct evaluator and scorer identities are required');
    for (const role of ['evaluator', 'scorer']) list(evalInfo[role].exposedPaths, `${role}.exposedPaths`);
    for (const role of ['evaluator', 'scorer']) {
      if (typeof evalInfo[role].expectedAnswersExposed !== 'boolean' || typeof evalInfo[role].candidateSourceExposed !== 'boolean') {
        throw new Error(`${role} must explicitly attest expected-answer and candidate-source exposure`);
      }
    }
    if (evalInfo.evaluator.expectedAnswersExposed || evalInfo.evaluator.candidateSourceExposed) throw new Error('evaluator exposure is contaminated');

    if (!Array.isArray(receipt.checks)) throw new Error('checks must be an array');
    const required = new Set(baseline.requiredChecks);
    const seen = new Set();
    let outcomes = [];
    for (const check of receipt.checks) {
      if (!check || typeof check.name !== 'string' || !required.has(check.name)) {
        errors.push(`unmapped check: ${check?.name ?? '(missing name)'}`);
        continue;
      }
      if (seen.has(check.name)) errors.push(`duplicate check: ${check.name}`);
      seen.add(check.name);
      if (!['pass', 'fail', 'incomplete'].includes(check.result)) errors.push(`${check.name}: result must be pass, fail, or incomplete`);
      outcomes.push(check.result);
      if (!Array.isArray(check.cases) || !check.cases.length) {
        errors.push(`${check.name}: at least one case reference is required`);
        continue;
      }
      for (const ref of check.cases) {
        try {
          if (typeof ref?.caseId !== 'string' || !ref.caseId.trim()) throw new Error('caseId is required');
          if (typeof ref.packetId !== 'string' || !ref.packetId.trim()) throw new Error('packetId is required');
          const packetPath = ref.packetPath;
          if (!SHA256.test(ref.manifestSha256 ?? '')) throw new Error('frozen packet manifest SHA-256 is required');
          const resultPath = ref.resultPath;
          if (!SHA256.test(ref.resultSha256 ?? '')) throw new Error('local result SHA-256 is required');
          const resultFile = resolveEvidenceFile(root, resultPath);
          if (digestFile(resultFile) !== ref.resultSha256) {
            throw new Error('local result hash mismatch');
          }
          const packetRoot = resolveEvidenceFile(root, path.join(packetPath, 'manifest.json'));
          const packetDirectory = path.dirname(packetRoot);
          const packetKey = fs.realpathSync(packetDirectory);
          let verified = verifiedPackets.get(packetKey);
          if (!verified) {
            try {
              const packet = verify(packetDirectory, { readFile: readCached, listFiles, limits, hashBytes });
              verified = { packet, manifestSha256: hashBytes(readCached(packetRoot)) };
            } catch (error) {
              verified = { error: error.message };
            }
            verifiedPackets.set(packetKey, verified);
          }
          if (verified.error) throw new Error(verified.error);
          if (verified.manifestSha256 !== ref.manifestSha256) throw new Error('frozen packet manifest hash mismatch');
          const packet = verified.packet;
          const sourceRevision = packet.sourceRevision ?? packet.revision;
          if (packet.id !== ref.packetId || sourceRevision !== receipt.testedRevision) throw new Error('packet id or packet revision does not match receipt');
          if (!resultHasCase(resultFile, ref.packetId, ref.caseId)) {
            throw new Error(`case ${ref.packetId}/${ref.caseId} is not locatable in structured result evidence`);
          }
        } catch (error) { errors.push(`${check.name}: ${error.message}`); }
      }
    }
    for (const name of required) if (!seen.has(name)) errors.push(`missing required check: ${name}`);
    const state = errors.length ? 'invalid' : outcomes.includes('fail') ? 'failed' : outcomes.includes('incomplete') ? 'incomplete' : 'complete';
    return { valid: errors.length === 0, errors, state, admission: 'not-performed' };
  } catch (error) {
    return { valid: false, errors: [error.message], state: 'invalid', admission: 'not-performed' };
  }
}

function options(args) {
  const result = {};
  for (let i = 0; i < args.length; i++) {
    if (!args[i].startsWith('--') || !args[i + 1] || args[i + 1].startsWith('--')) throw new Error(`invalid option near ${args[i]}`);
    const key = args[i].slice(2);
    if (key === 'file') (result.file ??= []).push(args[++i]);
    else if (['base', 'head', 'receipt'].includes(key)) result[key] = args[++i];
    else throw new Error(`unknown option: ${args[i]}`);
  }
  return result;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const [mode, ...rest] = process.argv.slice(2);
    const opts = options(rest);
    if (mode === 'plan') {
      let changed = opts.file ?? [];
      if (opts.base) {
        const { execFileSync } = await import('node:child_process');
        const diffPaths = execFileSync('git', ['diff', '--name-only', `${opts.base}...${opts.head ?? 'HEAD'}`], { cwd: rootDefault, encoding: 'utf8' }).trim().split('\n').filter(Boolean);
        changed = mergeChangedPaths(changed, diffPaths);
      }
      let manifest;
      if (opts.base) {
        const { execFileSync } = await import('node:child_process');
        const head = opts.head ?? 'HEAD';
        const committedBytes = execFileSync('git', ['show', `${head}:skill-evals/behavior-baselines.json`], { cwd: rootDefault, encoding: 'buffer' });
        const committedManifest = JSON.parse(committedBytes.toString('utf8'));
        const registryPath = 'skill-evals/behavior-baselines.json';
        if ((opts.file ?? []).includes(registryPath)
          && !fs.readFileSync(path.join(rootDefault, registryPath)).equals(committedBytes)) {
          throw new Error('working behavior-baselines.json differs from the committed head; use path-only planning without --base, or commit the registry change before committed-range planning');
        }
        manifest = committedManifest;
      } else manifest = readJson(path.join(rootDefault, 'skill-evals/behavior-baselines.json'));
      let semanticConfig = null;
      if (opts.base && changed.includes(CONFIG_PATH) && !(opts.file ?? []).includes(CONFIG_PATH)) {
        try {
          const { execFileSync } = await import('node:child_process');
          const head = opts.head ?? 'HEAD';
          const mergeBase = execFileSync('git', ['merge-base', opts.base, head], { cwd: rootDefault, encoding: 'utf8' }).trim();
          const before = execFileSync('git', ['show', `${mergeBase}:${CONFIG_PATH}`], { cwd: rootDefault, encoding: 'buffer' });
          const after = execFileSync('git', ['show', `${head}:${CONFIG_PATH}`], { cwd: rootDefault, encoding: 'buffer' });
          semanticConfig = analyzeConfigChange(before, after, manifest);
        } catch (error) {
          semanticConfig = { safe: false, reason: `config comparison unavailable: ${error.message}` };
        }
      }
      const output = planBaselines(manifest, changed, { semanticConfig });
      console.log(JSON.stringify(output, null, 2));
    } else if (mode === 'preflight' && opts.receipt) {
      const result = preflightReceipt(rootDefault, readJson(path.resolve(rootDefault, opts.receipt)));
      console.log(JSON.stringify(result, null, 2));
      if (!result.valid) process.exitCode = 1;
    } else throw new Error('Usage: eval-feedback-loop.mjs plan (--base REF [--head REF] | --file PATH...) | preflight --receipt PATH');
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
