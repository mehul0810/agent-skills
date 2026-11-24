#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { validationFingerprint } from './harness-runtime-fingerprint.mjs';

const PACKAGE = '@mehul0810/agent-harness';
const MAX_BYTES = 2 * 1024 * 1024;
const REVISION = /^[a-f0-9]{40}$/;
const LIMITS = [
  'Fingerprint covers the cli-validation-v1 dependency set, not all harness APIs or skill files.',
  'A local validation CLI pass does not establish native agent skill activation or host-loaded capability.',
  'Host telemetry and observed task outcomes are unavailable; no receipts or traces are inferred.',
];

export function parseArgs(args) {
  const options = { roots: [], json: false, sourceRoot: null };
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === '--json' && !options.json) options.json = true;
    else if (argument === '--source-root' && options.sourceRoot === null) {
      const value = args[++index];
      if (!value || value.startsWith('--')) throw new Error('--source-root requires a path');
      options.sourceRoot = value;
    } else if (argument.startsWith('--')) throw new Error(`Unknown or repeated option: ${argument}`);
    else options.roots.push(argument);
  }
  if (!options.roots.length) throw new Error('Provide explicit agent repository paths');
  return options;
}

function readBounded(root, relative) {
  const target = path.resolve(root, relative);
  if (!target.startsWith(`${root}${path.sep}`) || !fs.lstatSync(target).isFile() || fs.realpathSync(target) !== target) throw new Error('Unsafe consumer dependency path');
  const fd = fs.openSync(target, fs.constants.O_RDONLY | fs.constants.O_NOFOLLOW | fs.constants.O_NONBLOCK);
  try {
    const stat = fs.fstatSync(fd);
    if (!stat.isFile() || stat.size > MAX_BYTES) throw new Error('Consumer dependency must be a regular file of at most 2 MiB');
    const bytes = Buffer.alloc(MAX_BYTES + 1);
    let length = 0;
    while (length < bytes.length) {
      const count = fs.readSync(fd, bytes, length, bytes.length - length, null);
      if (!count) break;
      length += count;
    }
    if (length > MAX_BYTES) throw new Error('Consumer dependency exceeds 2 MiB');
    return bytes.subarray(0, length);
  } finally { fs.closeSync(fd); }
}

function git(root, args, raw = false) {
  const result = spawnSync('git', ['-C', root, ...args], {
    encoding: raw ? null : 'utf8', timeout: 10000, maxBuffer: MAX_BYTES,
    env: { ...process.env, GIT_OPTIONAL_LOCKS: '0', GIT_NO_REPLACE_OBJECTS: '1' },
  });
  if (result.error || result.status !== 0) throw new Error(result.error?.message || String(result.stderr).trim() || 'Source Git object unavailable');
  return result.stdout;
}

function sourceInventory(input) {
  if (!input) return { status: 'unavailable', reason: 'No --source-root supplied' };
  const root = fs.realpathSync(path.resolve(input));
  if (fs.realpathSync(git(root, ['rev-parse', '--show-toplevel']).trim()) !== root) throw new Error('--source-root must be the harness repository root');
  const revision = git(root, ['rev-parse', '--verify', 'HEAD^{commit}']).trim();
  if (!REVISION.test(revision)) throw new Error('Source HEAD is not a full commit revision');
  if (JSON.parse(git(root, ['show', `${revision}:package.json`])).name !== PACKAGE) throw new Error('--source-root must contain the agent-harness package');
  return { status: 'available', root, revision, scope: 'Git HEAD commit; working-tree edits are not source revision evidence' };
}

// Compare immutable pinned Git objects, never the latest checkout's working-tree bytes.
function pinnedFingerprint(root, revision) {
  git(root, ['cat-file', '-e', `${revision}^{commit}`]);
  return validationFingerprint(root, file => {
    const entry = git(root, ['ls-tree', revision, '--', file]).trim();
    if (!entry) throw Object.assign(new Error(`Pinned dependency missing: ${file}`), { code: 'ENOENT' });
    if (!/^100(?:644|755) blob [a-f0-9]{40}\t/.test(entry)) throw new Error(`Unsafe pinned dependency: ${file}`);
    return git(root, ['show', `${revision}:${file}`], true);
  });
}

export function inspectConsumer(input, source = { status: 'unavailable' }) {
  const report = {
    root: path.resolve(input), name: null, ok: false,
    declaration: { status: 'unavailable' },
    installed: { status: 'unavailable', scope: 'cli-validation-v1', validationSha256: null, pinnedByteComparison: 'unavailable' },
    localValidation: { status: 'not-run', scope: 'local CLI consumer contracts' },
    hostLoaded: { status: 'unavailable', reason: 'No host activation telemetry inspected' },
    observedOutcomes: { status: 'unavailable', reason: 'No task execution traces inspected' },
    errors: [],
  };
  let root, revision;
  try {
    root = fs.realpathSync(report.root);
    report.root = root;
    const readJson = file => JSON.parse(readBounded(root, file));
    const pkg = readJson('package.json');
    const lock = readJson('package-lock.json');
    report.name = pkg.name;
    const pin = pkg.devDependencies?.[PACKAGE];
    const locked = lock.packages?.[`node_modules/${PACKAGE}`];
    revision = typeof pin === 'string' ? pin.match(/\/archive\/([a-f0-9]{40})\.tar\.gz$/)?.[1] : null;
    report.declaration = {
      status: 'mismatch', pin: pin ?? null, revision: revision ?? null,
      lockResolved: locked?.resolved ?? null, lockIntegrity: locked?.integrity ?? null,
      sourceHeadMatchesPin: source.status === 'available' && revision ? source.revision === revision : null,
    };
    if (!revision || locked?.resolved !== pin || typeof locked.integrity !== 'string' || !locked.integrity) throw new Error('Harness pin/lock/integrity mismatch');
    const contract = 'contracts/agent-system.compatibility.json';
    if (fs.lstatSync(path.join(root, contract), { throwIfNoEntry: false }) && readJson(contract).validation?.harness_commit !== revision) throw new Error('Compatibility contract disagrees with lock');
    report.declaration.status = 'valid';
  } catch (error) { report.errors.push(error.message); }
  if (!root) return report;
  try {
    const installedRoot = path.join(root, 'node_modules', PACKAGE);
    report.installed.validationSha256 = validationFingerprint(installedRoot, file => readBounded(root, path.join('node_modules', PACKAGE, file)));
    report.installed.status = 'fingerprinted';
    if (source.status === 'available' && revision) {
      try {
        report.installed.pinnedValidationSha256 = pinnedFingerprint(source.root, revision);
        report.installed.pinnedByteComparison = report.installed.validationSha256 === report.installed.pinnedValidationSha256 ? 'match' : 'mismatch';
      } catch (error) {
        report.installed.comparisonReason = error.message;
      }
      if (report.installed.pinnedByteComparison === 'mismatch') throw new Error('Installed validation bytes differ from the pinned source revision');
    }
  } catch (error) { report.errors.push(error.message); }
  if (report.errors.length) return report;
  try {
    const result = spawnSync(process.execPath, ['node_modules/@mehul0810/agent-harness/bin/agent-harness.js', 'validate', '--config', 'agent-harness.config.json'], {
      cwd: root, encoding: 'utf8', timeout: 60000, maxBuffer: MAX_BYTES,
    });
    report.localValidation.status = !result.error && result.status === 0 ? 'passed' : 'failed';
    if (report.localValidation.status === 'failed') throw new Error(result.error?.message || result.stderr || result.stdout || 'Harness unavailable');
    report.ok = true;
  } catch (error) {
    report.errors.push(error.message);
  }
  return report;
}

function main() {
  let options;
  try { options = parseArgs(process.argv.slice(2)); }
  catch (error) { console.error(error.message); process.exitCode = 2; return; }
  let source;
  try { source = sourceInventory(options.sourceRoot); }
  catch (error) { source = { status: 'unavailable', reason: error.message, invalidInput: true }; }
  const consumers = options.roots.map(root => inspectConsumer(root, source));
  const result = { schemaVersion: 1, ok: !source.invalidInput && consumers.every(consumer => consumer.ok), source, consumers, limitations: LIMITS };
  if (options.json) console.log(JSON.stringify(result, null, 2));
  else {
    console.log(`SOURCE ${source.status === 'available' ? source.revision : `unavailable: ${source.reason}`}`);
    for (const consumer of consumers) {
      console.log(`${consumer.ok ? 'PASS' : 'FAIL'} ${consumer.name || consumer.root}: ${consumer.declaration.revision || 'unavailable'} consumer contracts ${consumer.localValidation.status}`);
      console.log(`  pin/lock=${consumer.declaration.status}; installed=${consumer.installed.validationSha256 || 'unavailable'}; pinned-byte comparison=${consumer.installed.pinnedByteComparison}`);
      if (consumer.installed.comparisonReason) console.log(`  pinned-byte evidence unavailable: ${consumer.installed.comparisonReason}`);
      console.log('  host-loaded capability=unavailable; observed task outcomes=unavailable');
      for (const error of consumer.errors) console.error(`  ${error}`);
    }
    for (const limit of LIMITS) console.log(`NOTE ${limit}`);
  }
  process.exitCode = result.ok ? 0 : 1;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
