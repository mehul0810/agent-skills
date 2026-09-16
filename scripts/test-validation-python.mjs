import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validationPython } from './validation-python.mjs';

const response = (version = [3, 11, 0], tomllib = true) => ({
  status: 0, stdout: JSON.stringify({ version, tomllib }), stderr: '',
});
for (const env of [{}, { PYTHON: '/a path/python3.13' }, { PYTHON: 'custom-python' }]) {
  const expected = env.PYTHON ?? 'python3';
  let calls = 0;
  const selected = validationPython(env, (command, args, options) => {
    calls++;
    assert.equal(command, expected);
    assert.equal(args[0], '-c');
    assert.equal(options.env, env);
    assert.equal(options.shell, undefined);
    return response();
  });
  assert.equal(calls, 1);
  assert.deepEqual(selected, { executable: expected, version: '3.11.0' });
}
for (const version of [[2, 7, 18], [3, 9, 6], [3, 10, 15]]) {
  assert.throws(() => validationPython({}, () => response(version)), /Python >=3\.11 required/);
}
assert.throws(() => validationPython({}, () => response([3, 11, 0], false)), /cannot import.*tomllib/);
for (const version of [null, [3, 11], ['3', 11, 0]]) {
  assert.throws(() => validationPython({}, () => response(version)), /Invalid Python version/);
}
assert.throws(() => validationPython({}, () => ({ status: 0, stdout: 'unexpected output' })), /Invalid runtime response/);
assert.throws(() => validationPython({}, () => ({ status: 1, stderr: 'probe failed' })), /probe failed/);
assert.throws(() => validationPython({}, () => ({ error: new Error('ETIMEDOUT') })), /ETIMEDOUT/);
for (const PYTHON of ['', '   ']) {
  assert.throws(() => validationPython({ PYTHON }, () => assert.fail('Must not spawn')), /PYTHON is empty/);
}

// Exercise the real subprocess boundary and prove aggregate failure precedes checks.
const root = mkdtempSync(join(tmpdir(), 'validation-python-'));
const cwd = fileURLToPath(new URL('..', import.meta.url));
try {
  const fake = join(root, 'python with spaces');
  const fakePython = version => writeFileSync(fake,
    `#!/bin/sh\nprintf '%s\\n' '${JSON.stringify({ version, tomllib: true })}'\n`,
    { mode: 0o755 });
  fakePython([3, 13, 1]);
  assert.deepEqual(validationPython({ ...process.env, PYTHON: fake }), {
    executable: fake, version: '3.13.1',
  });
  fakePython([3, 9, 6]);
  const cases = [
    [{ PYTHON: fake }, /reports 3\.9\.6/],
    [{ PYTHON: join(root, 'missing') }, /Cannot run validation Python/],
    [{ PYTHON: '' }, /PYTHON is empty/],
    [{ PYTHON: fake + ' --flag' }, /Cannot run validation Python/],
    [{ PATH: root }, /Cannot run validation Python "python3"/],
  ];
  for (const [overrides, diagnostic] of cases) {
    const env = { ...process.env };
    delete env.PYTHON;
    Object.assign(env, overrides);
    const result = spawnSync(process.execPath, ['scripts/validate-all.mjs'], {
      cwd, env, encoding: 'utf8', timeout: 10000,
    });
    assert.equal(result.status, 1, result.stderr);
    assert.match(result.stderr, diagnostic);
    assert.match(result.stderr, /See TESTING\.md/);
    assert.equal(result.stdout, '', 'No aggregate check may run before Python preflight passes');
  }
} finally {
  rmSync(root, { recursive: true, force: true });
}
console.log('PASS: Python selection, version/module rejection, exact executable paths, and aggregate fail-fast');
