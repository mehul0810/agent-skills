import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { runCommand, runValidationChecks } from './run-validation-command.mjs';
import { validateBehaviorRecords } from './validate-behavior-run-records.mjs';

const cwd = process.cwd();
const invalid = await runCommand(`${process.execPath}-missing`, [], { cwd, timeoutMs: 1000 });
assert.ok(invalid.error, 'missing executable should report a spawn error');
assert.notEqual(invalid.status, 0);

const overflow = await runCommand(process.execPath, ['-e', 'process.stdout.write(Buffer.alloc(1024 * 1024))'], {
  cwd,
  timeoutMs: 2000,
  outputLimitBytes: 4096,
  killGraceMs: 50,
});
assert.equal(overflow.outputExceeded, true);
assert.ok(Buffer.byteLength(overflow.stdout) + Buffer.byteLength(overflow.stderr) <= 4096);

const sentinel = path.join(os.tmpdir(), `validation-runner-descendant-${process.pid}`);
fs.rmSync(sentinel, { force: true });
const descendantCode = `
  const { spawn } = require('node:child_process');
  const source = ${JSON.stringify(`setTimeout(() => require('node:fs').writeFileSync(${JSON.stringify(sentinel)}, 'survived'), 700); process.on('SIGTERM', () => {}); setInterval(() => {}, 1000);`)};
  spawn(process.execPath, ['-e', source], { stdio: 'ignore' });
  setInterval(() => {}, 1000);
`;
const hung = await runCommand(process.execPath, ['-e', descendantCode], {
  cwd,
  timeoutMs: 100,
  outputLimitBytes: 4096,
  killGraceMs: 50,
});
assert.equal(hung.timedOut, true);
await new Promise(resolve => setTimeout(resolve, 800));
assert.equal(fs.existsSync(sentinel), false, 'timeout cleanup left a descendant alive');

const normalSentinel = `${sentinel}-normal`;
fs.rmSync(normalSentinel, { force: true });
const normalDescendantCode = `
  const { spawn } = require('node:child_process');
  const source = ${JSON.stringify(`setTimeout(() => require('node:fs').writeFileSync(${JSON.stringify(normalSentinel)}, 'survived'), 700); process.on('SIGTERM', () => {}); setInterval(() => {}, 1000);`)};
  spawn(process.execPath, ['-e', source], { stdio: 'ignore' });
  process.exit(0);
`;
const normalExit = await runCommand(process.execPath, ['-e', normalDescendantCode], {
  cwd,
  timeoutMs: 1500,
  outputLimitBytes: 4096,
  killGraceMs: 50,
});
assert.equal(normalExit.status, 0);
assert.equal(normalExit.timedOut, false);
await new Promise(resolve => setTimeout(resolve, 800));
assert.equal(fs.existsSync(normalSentinel), false, 'normal exit cleanup left an owned descendant alive');
assert.throws(() => runCommand(process.execPath, [], { timeoutMs: 0 }), /timeoutMs/);

const escapedSentinel = `${sentinel}-escaped`;
const escapedPidFile = `${sentinel}-escaped-pid`;
fs.rmSync(escapedSentinel, { force: true });
fs.rmSync(escapedPidFile, { force: true });
const escapedCode = `
  const { spawn } = require('node:child_process');
  const fs = require('node:fs');
  const source = ${JSON.stringify(`setTimeout(() => require('node:fs').writeFileSync(${JSON.stringify(escapedSentinel)}, 'survived'), 700); process.on('SIGTERM', () => {}); setInterval(() => {}, 1000);`)};
  const escaped = spawn(process.execPath, ['-e', source], { detached: true, stdio: ['ignore', 'inherit', 'inherit'] });
  fs.writeFileSync(${JSON.stringify(escapedPidFile)}, String(escaped.pid));
  setInterval(() => {}, 1000);
`;
const escaped = await runCommand(process.execPath, ['-e', escapedCode], {
  cwd,
  timeoutMs: 100,
  outputLimitBytes: 4096,
  killGraceMs: 50,
  finalDrainMs: 100,
});
assert.equal(escaped.timedOut, true);
assert.equal(escaped.cleanupIncomplete, true);
const escapedPid = Number(fs.readFileSync(escapedPidFile, 'utf8'));
try { process.kill(escapedPid, 'SIGKILL'); } catch (error) { if (error.code !== 'ESRCH') throw error; }
await new Promise(resolve => setTimeout(resolve, 800));
assert.equal(fs.existsSync(escapedSentinel), false, 'test harness failed to clean its escaped descendant');

const calls = [];
const logs = [];
const passed = await runValidationChecks([
  ['fails first', 'bad', []],
  ['still runs second', 'good', []],
], {
  cwd,
  runner: async command => {
    calls.push(command);
    if (command === 'bad') throw new Error('simulated spawn failure');
    return { status: 0, durationMs: 1, stdout: command, stderr: '' };
  },
  log: line => logs.push(line),
  errorLog: () => {},
});
assert.equal(passed, false);
assert.deepEqual(calls, ['bad', 'good'], 'a failure must not prevent later checks from running');
assert.ok(logs.some(line => line.startsWith('PASS still runs second')));

const root = fs.mkdtempSync(path.join(os.tmpdir(), 'validation-records-'));
const directory = path.join(root, 'skill-evals', 'run-records');
fs.mkdirSync(directory, { recursive: true });
const validRecord = {
  schemaVersion: 1,
  runId: 'batch-check-001',
  scenario: 'batch validation contract',
  result: 'succeeded',
  startedAt: '2026-09-10T00:00:00.000Z',
  durationMs: 1,
  checks: [{ name: 'contract', result: 'pass' }],
  metrics: { host_telemetry_available: 0 },
};
fs.writeFileSync(path.join(directory, 'valid.json'), JSON.stringify(validRecord));
const recordLogs = [];
assert.equal(await validateBehaviorRecords({ root, directory, log: line => recordLogs.push(line), errorLog: line => recordLogs.push(line) }), 0);
assert.ok(recordLogs.some(line => line.includes('validated 1 discovered')));

validRecord.metrics = {};
fs.writeFileSync(path.join(directory, 'valid.json'), JSON.stringify(validRecord));
const telemetryErrors = [];
assert.equal(await validateBehaviorRecords({ root, directory, log: () => {}, errorLog: line => telemetryErrors.push(line) }), 1);
assert.match(telemetryErrors[0], /host_telemetry_available must be 0 or 1/);
console.log('Validation runner and batch record tests passed');
