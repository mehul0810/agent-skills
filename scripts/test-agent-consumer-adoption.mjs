import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { parseArgs } from './check-agent-consumers.mjs';
import { validationFingerprint } from './harness-runtime-fingerprint.mjs';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const checker = path.join(repo, 'scripts/check-agent-consumers.mjs');
const temporary = fs.mkdtempSync(path.join(fs.realpathSync(os.tmpdir()), 'consumer-adoption-'));
const source = path.join(temporary, 'source');
const packagePath = 'node_modules/@mehul0810/agent-harness';
const write = (root, file, value) => {
  fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
  fs.writeFileSync(path.join(root, file), typeof value === 'string' ? value : JSON.stringify(value));
};
const git = (...args) => {
  const result = spawnSync('git', ['-C', source, ...args], {
    encoding: 'utf8', timeout: 10000,
    env: { ...process.env, GIT_CONFIG_NOSYSTEM: '1', GIT_CONFIG_GLOBAL: '/dev/null', GIT_AUTHOR_NAME: 'Fixture', GIT_AUTHOR_EMAIL: 'fixture@example.invalid', GIT_COMMITTER_NAME: 'Fixture', GIT_COMMITTER_EMAIL: 'fixture@example.invalid' },
  });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout.trim();
};
let fixtures = 0;
function consumer(revision, { installed = true } = {}) {
  const root = path.join(temporary, `consumer-${++fixtures}`);
  const pin = `https://github.com/mehul0810/agent-harness/archive/${revision}.tar.gz`;
  write(root, 'package.json', { name: 'synthetic-consumer', devDependencies: { '@mehul0810/agent-harness': pin } });
  write(root, 'package-lock.json', { packages: { [packagePath]: { resolved: pin, integrity: 'sha512-synthetic-fixture-only' } } });
  write(root, 'agent-harness.config.json', { schemaVersion: 1, projectRoot: '.', requiredFiles: [], requiredPhrases: [], routeBudgets: [], scenarios: [] });
  if (installed) fs.cpSync(path.join(repo, packagePath), path.join(root, packagePath), { recursive: true });
  return root;
}
function run(root, args = [], expected = 0) {
  const result = spawnSync(process.execPath, [checker, '--json', ...args, root], { encoding: 'utf8', timeout: 30000, maxBuffer: 2 * 1024 * 1024 });
  assert.equal(result.status, expected, result.stderr || result.stdout);
  return JSON.parse(result.stdout);
}

try {
  fs.cpSync(path.join(repo, packagePath), source, { recursive: true });
  git('init', '--quiet');
  git('add', '.');
  git('-c', 'core.hooksPath=/dev/null', 'commit', '--quiet', '-m', 'Synthetic pinned validation fixture');
  const pin = git('rev-parse', 'HEAD');
  const root = consumer(pin);
  let result = run(root);
  let item = result.consumers[0];
  assert.equal(result.source.status, 'unavailable');
  assert.equal(item.declaration.status, 'valid');
  assert.equal(item.installed.validationSha256, validationFingerprint(path.join(root, packagePath)));
  assert.equal(item.installed.pinnedByteComparison, 'unavailable');
  assert.equal(item.localValidation.status, 'passed');
  assert.equal(item.hostLoaded.status, 'unavailable');
  assert.equal(item.observedOutcomes.status, 'unavailable');
  assert.ok(result.limitations.some(limit => limit.includes('does not establish native agent skill activation')));

  result = run(root, ['--source-root', source]);
  item = result.consumers[0];
  assert.equal(result.source.revision, pin);
  assert.equal(item.declaration.sourceHeadMatchesPin, true);
  assert.equal(item.installed.pinnedByteComparison, 'match');

  // A newer source HEAD is not the adopted pin; dirty source files are also ignored.
  fs.appendFileSync(path.join(source, 'src/validate.js'), '\n// New source revision\n');
  git('add', 'src/validate.js');
  git('-c', 'core.hooksPath=/dev/null', 'commit', '--quiet', '-m', 'Synthetic newer source revision');
  const newer = git('rev-parse', 'HEAD');
  fs.appendFileSync(path.join(source, 'src/validate.js'), '\n// Uncommitted source edit\n');
  result = run(root, ['--source-root', source]);
  item = result.consumers[0];
  assert.equal(result.source.revision, newer);
  assert.equal(item.declaration.revision, pin);
  assert.equal(item.declaration.sourceHeadMatchesPin, false);
  assert.equal(item.installed.pinnedByteComparison, 'match');
  assert.equal(item.hostLoaded.status, 'unavailable');

  const missing = run(consumer(pin, { installed: false }), [], 1).consumers[0];
  assert.equal(missing.declaration.status, 'valid');
  assert.equal(missing.installed.status, 'unavailable');
  assert.equal(missing.installed.validationSha256, null);
  assert.equal(missing.localValidation.status, 'not-run');

  const mismatchRoot = consumer(pin);
  const lock = JSON.parse(fs.readFileSync(path.join(mismatchRoot, 'package-lock.json')));
  lock.packages[packagePath].resolved = lock.packages[packagePath].resolved.replace(pin, 'a'.repeat(40));
  write(mismatchRoot, 'package-lock.json', lock);
  const mismatch = run(mismatchRoot, [], 1).consumers[0];
  assert.equal(mismatch.declaration.status, 'mismatch');
  assert.equal(mismatch.installed.status, 'fingerprinted', 'installed inventory is separate from pin/lock validity');
  assert.equal(mismatch.localValidation.status, 'not-run');
  assert.match(mismatch.errors.join('\n'), /pin\/lock\/integrity mismatch/);

  const contractRoot = consumer(pin);
  write(contractRoot, 'contracts/agent-system.compatibility.json', { validation: { harness_commit: newer } });
  assert.match(run(contractRoot, [], 1).consumers[0].errors.join('\n'), /Compatibility contract disagrees with lock/);

  // Matching source HEAD and declared pin cannot conceal changed installed bytes.
  const driftRoot = consumer(newer);
  fs.copyFileSync(path.join(source, 'src/validate.js'), path.join(driftRoot, packagePath, 'src/validate.js'));
  const drift = run(driftRoot, ['--source-root', source], 1).consumers[0];
  assert.equal(drift.declaration.sourceHeadMatchesPin, true);
  assert.equal(drift.installed.status, 'fingerprinted');
  assert.equal(drift.installed.pinnedByteComparison, 'mismatch');
  assert.equal(drift.localValidation.status, 'not-run');
  assert.equal(drift.hostLoaded.status, 'unavailable');

  // An unavailable pinned Git object stays unknown rather than borrowing HEAD.
  const unknown = run(consumer('b'.repeat(40)), ['--source-root', source]).consumers[0];
  assert.equal(unknown.installed.pinnedByteComparison, 'unavailable');
  assert.ok(unknown.installed.comparisonReason);
  assert.equal(unknown.localValidation.status, 'passed');

  const symlinkRoot = consumer(pin);
  const dependency = path.join(symlinkRoot, packagePath, 'src/validate.js');
  fs.unlinkSync(dependency);
  fs.symlinkSync(path.join(source, 'src/validate.js'), dependency);
  const unsafe = run(symlinkRoot, [], 1).consumers[0];
  assert.match(unsafe.errors.join('\n'), /Unsafe consumer dependency path/);
  assert.equal(unsafe.localValidation.status, 'not-run');

  const oversizedRoot = consumer(pin);
  write(oversizedRoot, 'package-lock.json', ' '.repeat(2 * 1024 * 1024 + 1));
  assert.match(run(oversizedRoot, [], 1).consumers[0].errors.join('\n'), /at most 2 MiB/);
  assert.equal(run(root, ['--source-root', root], 1).source.invalidInput, true);

  const text = spawnSync(process.execPath, [checker, root], { encoding: 'utf8', timeout: 30000 });
  assert.equal(text.status, 0, text.stderr);
  assert.match(text.stdout, /PASS synthetic-consumer/);
  assert.match(text.stdout, /host-loaded capability=unavailable; observed task outcomes=unavailable/);
  assert.throws(() => parseArgs([]), /explicit agent repository paths/);
  assert.throws(() => parseArgs(['--source-root']), /requires a path/);
  assert.throws(() => parseArgs(['--receipt', 'untrusted.json', root]), /Unknown or repeated option/);
  assert.throws(() => parseArgs(['--json', '--json', root]), /Unknown or repeated option/);
  console.log('PASS: consumer adoption inventory separates source, pin/lock, installed bytes, local CLI, unavailable host capability and outcomes; missing installs, mismatched pins, drift, old pins, unsafe and oversized files fail honestly');
} finally { fs.rmSync(temporary, { recursive: true, force: true }); }
