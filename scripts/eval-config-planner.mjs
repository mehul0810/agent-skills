import path from 'node:path';
import { validateConfigObject } from '@mehul0810/agent-harness';

const CONFIG_PATH = 'agent-harness.config.json';
const CONFIG_SECTIONS = new Map([
  ['requiredFiles', { key: (item) => item, paths: (item) => [item] }],
  ['requiredPhrases', { key: (item) => item?.file, paths: (item) => [item?.file] }],
  ['routeBudgets', { key: (item) => item?.name, paths: (item) => item?.files }],
  ['scenarios', { key: (item) => item?.name, paths: (item) => [item?.file] }],
]);

function stable(value) {
  if (Array.isArray(value)) return `[${value.map(stable).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stable(value[key])}`).join(',')}}`;
  return JSON.stringify(value);
}

function safeConfigPath(value) {
  return typeof value === 'string' && value.length > 0 && !path.isAbsolute(value)
    && !value.includes('\\') && !value.split('/').some((part) => !part || part === '.' || part === '..' || part === '.git');
}

function keyedEntries(value, keyOf) {
  if (!Array.isArray(value)) return null;
  const map = new Map();
  for (const item of value) {
    const key = keyOf(item);
    if (typeof key !== 'string' || !key || map.has(key)) return null;
    map.set(key, item);
  }
  return map;
}

// Only config edits scoped to declared file owners are safe to narrow. Any
// changed global field, malformed section, or unowned file returns unsafe.
export function analyzeConfigChange(baseBytes, headBytes, manifest) {
  if (!Buffer.isBuffer(baseBytes) || !Buffer.isBuffer(headBytes)) return { safe: false, reason: 'config bytes unavailable' };
  if (baseBytes.equals(headBytes)) return { safe: true, ownedPaths: [] };

  let before;
  let after;
  try {
    before = JSON.parse(baseBytes.toString('utf8'));
    after = JSON.parse(headBytes.toString('utf8'));
  } catch { return { safe: false, reason: 'config is not valid JSON' }; }
  if (!before || !after || Array.isArray(before) || Array.isArray(after) || typeof before !== 'object' || typeof after !== 'object') {
    return { safe: false, reason: 'config root is not an object' };
  }
  if (!validateConfigObject(before).valid || !validateConfigObject(after).valid) {
    return { safe: false, reason: 'config does not match the known supported schema' };
  }

  const dependencyOwners = new Map();
  for (const baseline of manifest?.baselines ?? []) {
    const files = [
      ...(baseline.files ?? []),
      ...(baseline.scenario?.files ?? []),
      ...(baseline.scenario?.fixtureFiles ?? []),
    ];
    for (const file of files) {
      if (!safeConfigPath(file)) return { safe: false, reason: 'manifest contains unsafe dependency path' };
      if (!dependencyOwners.has(file)) dependencyOwners.set(file, new Set());
      dependencyOwners.get(file).add(baseline.name);
    }
  }

  const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
  const ownedPaths = new Set();
  for (const section of keys) {
    const oldValue = before[section];
    const newValue = after[section];
    if (stable(oldValue) === stable(newValue)) continue;
    const spec = CONFIG_SECTIONS.get(section);
    if (!spec) return { safe: false, reason: `global or unknown config section changed: ${section}` };
    const oldMap = keyedEntries(oldValue ?? [], spec.key);
    const newMap = keyedEntries(newValue ?? [], spec.key);
    if (!oldMap || !newMap) return { safe: false, reason: `invalid config section: ${section}` };
    for (const name of new Set([...oldMap.keys(), ...newMap.keys()])) {
      const oldEntry = oldMap.get(name);
      const newEntry = newMap.get(name);
      if (stable(oldEntry) === stable(newEntry)) continue;
      for (const entry of [oldEntry, newEntry].filter((item) => item !== undefined)) {
        const refs = spec.paths(entry);
        if (!Array.isArray(refs) || !refs.length || refs.some((file) => !safeConfigPath(file))) {
          return { safe: false, reason: `unscoped config change in ${section}` };
        }
        for (const file of refs) {
          if (!dependencyOwners.has(file)) return { safe: false, reason: `config file is not owned by a baseline: ${file}` };
          ownedPaths.add(file);
        }
      }
    }
  }
  return { safe: true, ownedPaths: [...ownedPaths].sort() };
}

export { CONFIG_PATH };
