#!/usr/bin/env node
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DEFAULT_FILE_LIMITS, safeReadFile } from './bounded-files.mjs';
import { preflightReceipt } from './eval-feedback-loop.mjs';
import { assertFields, bindGrade } from './eval-grade-binding.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const keys = assertFields;

export function prepareReceipt(rootDir, descriptor, { hashBytes = sha } = {}) {
  keys(descriptor, ['schemaVersion', 'baseline', 'testedRevision', 'evaluation', 'gradePath', 'groups', 'checks'], 'descriptor');
  if (descriptor.schemaVersion !== 1) throw new Error('Only schemaVersion 1 preparation is supported; retain attempt history separately');
  const compact = Object.hasOwn(descriptor, 'groups');
  const groups = new Map();
  if (compact) {
    if (!Array.isArray(descriptor.groups) || !descriptor.groups.length || descriptor.groups.length > DEFAULT_FILE_LIMITS.maxEntries) throw new Error('groups must be a non-empty bounded array');
    for (const group of descriptor.groups) {
      keys(group, ['alias', 'packetId', 'packetPath', 'manifestSha256', 'resultPath'], 'group');
      if (typeof group.alias !== 'string' || !/^[A-Za-z][A-Za-z0-9_-]{0,63}$/.test(group.alias) || groups.has(group.alias)) throw new Error('missing, duplicate, or unsafe group alias');
      if (![group.packetId, group.packetPath, group.resultPath].every(value => typeof value === 'string' && value.trim()) || !/^[a-f0-9]{64}$/.test(group.manifestSha256 ?? '')) throw new Error('group evidence fields are required');
      groups.set(group.alias, group);
    }
  }
  if (!Array.isArray(descriptor.checks) || !descriptor.checks.length || descriptor.checks.length > DEFAULT_FILE_LIMITS.maxEntries) throw new Error('checks exceed entry limit');
  let count = 0;
  const usedGroups = new Set();
  const materializedChecks = descriptor.checks.map(check => {
    keys(check, ['name', 'cases'], 'check');
    if (!Array.isArray(check.cases) || !check.cases.length || (count += check.cases.length) > DEFAULT_FILE_LIMITS.maxEntries) throw new Error('case mappings exceed entry limit');
    return { name: check.name, cases: check.cases.map(ref => {
      if (!compact) {
        keys(ref, ['packetId', 'caseId', 'packetPath', 'manifestSha256', 'resultPath'], 'case');
        return ref;
      }
      keys(ref, ['group', 'caseId'], 'group case');
      if (typeof ref.group !== 'string' || !groups.has(ref.group)) throw new Error('unknown or missing group alias');
      if (typeof ref.caseId !== 'string' || !ref.caseId.trim()) throw new Error('group caseId is required');
      usedGroups.add(ref.group);
      const { packetId, packetPath, manifestSha256, resultPath } = groups.get(ref.group);
      return { packetId, caseId: ref.caseId, packetPath, manifestSha256, resultPath };
    }) };
  });
  if (compact && usedGroups.size !== groups.size) throw new Error('unused group alias');
  const cache = new Map();
  const digests = new Map();
  let total = 0;
  const read = value => {
    if (typeof value !== 'string' || !value.trim() || (!path.isAbsolute(value) && value.split('/').some(p => !p || p === '.' || p === '..' || p === '.git'))) throw new Error('invalid evidence path');
    const file = path.resolve(rootDir, value);
    if (fs.lstatSync(file).isSymbolicLink()) throw new Error('Expected a regular non-symlink file');
    const canonical = fs.realpathSync(file);
    if (!path.isAbsolute(value) && !canonical.startsWith(fs.realpathSync(rootDir) + path.sep)) throw new Error('evidence path escapes repository');
    if (!cache.has(canonical)) {
      if (cache.size >= DEFAULT_FILE_LIMITS.maxEntries) throw new Error('Evidence exceeds file count limit');
      const bytes = safeReadFile(file, { maxBytes: Math.min(DEFAULT_FILE_LIMITS.maxFileBytes, DEFAULT_FILE_LIMITS.maxTotalBytes - total) });
      total += bytes.length;
      cache.set(canonical, bytes);
    }
    return { bytes: cache.get(canonical), canonical };
  };
  const digest = file => {
    const { bytes, canonical } = read(file);
    if (!digests.has(canonical)) digests.set(canonical, hashBytes(bytes));
    return digests.get(canonical);
  };
  const gradeBytes = read(descriptor.gradePath).bytes;
  const grade = JSON.parse(gradeBytes);
  const resultIndexes = new Map();
  const checks = materializedChecks.map(check => {
    keys(check, ['name', 'cases'], 'check');
    if (!Array.isArray(check.cases) || !check.cases.length) throw new Error('case mappings required');
    const cases = check.cases.map(ref => {
      keys(ref, ['packetId', 'caseId', 'packetPath', 'manifestSha256', 'resultPath'], 'case');
      const manifestSha256 = digest(path.join(ref.packetPath, 'manifest.json'));
      if (manifestSha256 !== ref.manifestSha256) throw new Error('frozen manifest hash mismatch');
      const { bytes: resultBytes, canonical: resultKey } = read(ref.resultPath);
      const resultSha256 = digest(ref.resultPath);
      if (!resultIndexes.has(resultKey)) {
        const result = JSON.parse(resultBytes);
        if (!Array.isArray(result.cases) || result.cases.length > DEFAULT_FILE_LIMITS.maxEntries) throw new Error('result cases exceed entry limit');
        const index = new Map();
        for (const row of result.cases) {
          const id = JSON.stringify([row?.packetId, row?.id]);
          const valid = (typeof row?.outcome === 'string' && row.outcome.trim()) || (typeof row?.decision === 'string' && row.decision.trim());
          index.set(id, index.has(id) ? false : Boolean(valid));
        }
        resultIndexes.set(resultKey, index);
      }
      if (!resultIndexes.get(resultKey).get(JSON.stringify([ref.packetId, ref.caseId]))) throw new Error('missing or ambiguous result case');
      return { ...ref, manifestSha256, resultSha256 };
    });
    return { name: check.name, cases };
  });
  const outcomes = bindGrade(grade, descriptor.evaluation, checks, { compareResults: false });
  checks.forEach((check, index) => { check.result = outcomes[index]; });
  const receipt = { schemaVersion: 1, status: 'draft', baseline: descriptor.baseline, testedRevision: descriptor.testedRevision, evaluation: descriptor.evaluation, checks, preparation: { gradePath: descriptor.gradePath, gradeSha256: digest(descriptor.gradePath) } };
  const preflight = preflightReceipt(rootDir, receipt);
  if (!preflight.valid) throw new Error(`preflight invalid: ${preflight.errors.join('; ')}`);
  return { receipt, preflight };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    if (process.argv.length !== 4 || process.argv[2] !== '--descriptor') throw new Error('Usage: prepare-eval-receipt.mjs --descriptor PATH > NEW-RECEIPT');
    const descriptor = JSON.parse(safeReadFile(path.resolve(process.argv[3])));
    const { receipt, preflight } = prepareReceipt(root, descriptor);
    process.stderr.write(`preflight: ${preflight.state}; admission: not-performed; scorer identity is not authenticated\n`);
    process.stdout.write(JSON.stringify(receipt, null, 2) + '\n');
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
