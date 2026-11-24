import { DEFAULT_FILE_LIMITS } from './bounded-files.mjs';

export const assertFields = (value, allowed, label) => {
  if (!value || typeof value !== 'object' || Array.isArray(value) || Object.keys(value).some(k => !allowed.includes(k))) throw new Error(`invalid ${label} fields`);
};
const key = (check, packet, id) => JSON.stringify([check, packet, id]);
const nonempty = value => typeof value === 'string' && value.trim().length > 0;
const sha = value => typeof value === 'string' && /^[a-f0-9]{64}$/.test(value);

// This binds supplied claims to supplied bytes, not a scorer's identity or honesty.
export function bindGrade(grade, evaluation, checks, { compareResults = true, maxEntries = DEFAULT_FILE_LIMITS.maxEntries } = {}) {
  assertFields(grade, ['schemaVersion', 'scorerIdentity', 'decisions'], 'grade');
  if (grade.schemaVersion !== 1 || !nonempty(grade.scorerIdentity) || grade.scorerIdentity !== evaluation?.scorer?.identity || !Array.isArray(grade.decisions)) throw new Error('grade identity or schema mismatch');
  if (!Array.isArray(checks) || !checks.length || checks.length > maxEntries || grade.decisions.length > maxEntries) throw new Error('grade or checks exceed entry limit');
  const index = new Map();
  for (const item of grade.decisions) {
    assertFields(item, ['check', 'packetId', 'caseId', 'result', 'resultSha256', 'manifestSha256'], 'decision');
    if (![item.check, item.packetId, item.caseId].every(nonempty) || !['pass', 'fail', 'incomplete'].includes(item.result) || !sha(item.resultSha256) || !sha(item.manifestSha256)) throw new Error('invalid grade decision');
    const id = key(item.check, item.packetId, item.caseId);
    if (index.has(id)) throw new Error('duplicate grade decision');
    index.set(id, item);
  }
  const names = new Set();
  let count = 0;
  return checks.map(check => {
    if (!check || !nonempty(check.name) || names.has(check.name) || !Array.isArray(check.cases) || !check.cases.length) throw new Error('missing or duplicate check or case mappings');
    names.add(check.name);
    count += check.cases.length;
    if (count > maxEntries) throw new Error('case mappings exceed entry limit');
    const outcomes = [];
    for (const ref of check.cases) {
      const id = key(check.name, ref?.packetId, ref?.caseId);
      const decision = index.get(id);
      if (!decision) throw new Error('missing, duplicate, or reused grade decision');
      if (ref.resultSha256 !== decision.resultSha256 || ref.manifestSha256 !== decision.manifestSha256) throw new Error('unbound or stale grade decision');
      outcomes.push(decision.result);
      index.delete(id);
    }
    const result = outcomes.includes('fail') ? 'fail' : outcomes.includes('incomplete') ? 'incomplete' : 'pass';
    if (compareResults && check.result !== result) throw new Error('receipt check result does not match grade decisions');
    return result;
  }).map((result, i, all) => {
    if (i === all.length - 1 && index.size) throw new Error('unmapped grade decisions');
    return result;
  });
}
