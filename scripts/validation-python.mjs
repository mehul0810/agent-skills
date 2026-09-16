import { spawnSync } from 'node:child_process';

const probe = `import json, sys
try:
    import tomllib
    has_tomllib = True
except ImportError:
    has_tomllib = False
print(json.dumps({"version": list(sys.version_info[:3]), "tomllib": has_tomllib}))
`;

export function validationPython(env = process.env, spawn = spawnSync) {
  const executable = env.PYTHON ?? 'python3';
  const help = 'Set PYTHON to one Python >=3.11 executable (not a shell command), or activate a compatible virtual environment. See TESTING.md. No dependencies were installed.';
  if (!executable.trim()) throw new Error(`PYTHON is empty. ${help}`);
  const result = spawn(executable, ['-c', probe], {
    env, encoding: 'utf8', timeout: 10000, maxBuffer: 1024 * 1024,
  });
  if (result.error || result.status !== 0) {
    throw new Error(`Cannot run validation Python ${JSON.stringify(executable)}: ${result.error?.message || result.stderr?.trim() || `exit ${result.status}`}. ${help}`);
  }
  let runtime;
  try { runtime = JSON.parse(result.stdout); } catch {
    throw new Error(`Invalid runtime response from validation Python ${JSON.stringify(executable)}. ${help}`);
  }
  const version = runtime?.version;
  if (!Array.isArray(version) || version.length !== 3 || !version.every(Number.isInteger)) {
    throw new Error(`Invalid Python version from ${JSON.stringify(executable)}. ${help}`);
  }
  if (version[0] < 3 || (version[0] === 3 && version[1] < 11)) {
    throw new Error(`Python >=3.11 required; ${JSON.stringify(executable)} reports ${version.join('.')}. ${help}`);
  }
  if (runtime.tomllib !== true) {
    throw new Error(`Validation Python ${JSON.stringify(executable)} cannot import standard-library tomllib. ${help}`);
  }
  return { executable, version: version.join('.') };
}
