import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { test } from 'node:test';
import { deflateSync } from 'node:zlib';
import { validatePlatformProof } from './validate-platform-proof.mjs';

const root = fs.mkdtempSync(path.join(os.tmpdir(), 'portable-proof-'));
const bytes = Buffer.from('synthetic test log; no product execution');
fs.writeFileSync(path.join(root, 'run.txt'), bytes);
const hash = crypto.createHash('sha256').update(bytes).digest('hex');
const base = () => ({ schemaVersion: 1, platform: 'web', workflow_stage: 'verify', target: { id: 'fixture', revision: 'fixture-v1' }, environment: { id: 'isolated-fixture', runtime: 'browser' }, observer: { kind: 'self', contaminated: false }, artifacts: [{ id: 'log', kind: 'test_log', path: 'run.txt', sha256: hash }], clauses: [{ id: 'synthetic', kind: 'behavior', status: 'pass', observation: 'Synthetic contract fixture only', evidence: ['log'] }] });
for (const [platform, runtime] of [['web', 'browser'], ['macos', 'native_macos'], ['game', 'browser'], ['game', 'game_engine'], ['other', 'custom']]) test(`accepts ${platform}/${runtime} receipt structure only`, () => { const r = base(); r.platform = platform; r.environment.runtime = runtime; assert.equal(validatePlatformProof(r, root).ok, true); });
for (const [name, mutate] of [
  ['browser is not native app proof', r => { r.platform = 'macos'; }],
  ['Figma is not native app proof', r => { r.platform = 'macos'; r.environment.runtime = 'figma'; }],
  ['unknown platform cannot inherit WordPress', r => { r.platform = 'unknown'; }],
  ['WordPress keeps its existing adapter', r => { r.platform = 'wordpress'; }],
  ['log is not appearance proof', r => { r.clauses[0].kind = 'appearance'; }],
  ['missing evidence is not pass', r => { r.clauses[0].evidence = []; }],
  ['unknown evidence rejected', r => { r.clauses[0].evidence = ['other']; }],
  ['hash mismatch rejected', r => { r.artifacts[0].sha256 = 'a'.repeat(64); }],
  ['outside path rejected', r => { r.artifacts[0].path = '../run.txt'; }],
  ['absolute path rejected', r => { r.artifacts[0].path = path.join(root, 'run.txt'); }],
  ['fake screenshot rejected', r => { r.artifacts[0].kind = 'screenshot'; }],
  ['contamination prevents independence', r => { r.observer = { kind: 'independent', contaminated: true }; }],
  ['unknown contamination rejected', r => { delete r.observer.contaminated; }],
  ['duplicate clause rejected', r => { r.clauses.push({ ...r.clauses[0] }); }],
  ['missing revision rejected', r => { delete r.target.revision; }],
  ['unknown stage rejected', r => { r.workflow_stage = 'release-anyway'; }],
  ['blocked requires reason', r => { r.clauses[0].status = 'blocked'; r.clauses[0].observation = ''; }],
]) test(name, () => { const r = base(); mutate(r); assert.equal(validatePlatformProof(r, root).ok, false); });
test('missing native runtime remains explicit blocked proof, portable artifact tests can pass', () => { const r = base(); r.platform = 'macos'; r.environment.runtime = 'linux'; r.clauses[0].kind = 'artifact'; r.clauses.push({ id: 'native', kind: 'native_runtime', status: 'blocked', observation: 'No native runner', evidence: [] }); const result = validatePlatformProof(r, root); assert.equal(result.ok, true); assert.equal(result.summary.blocked, 1); assert.equal(result.summary.passed, 1); });
test('failure and out-of-scope statuses are retained, not silently passed', () => { const r = base(); r.clauses[0].status = 'fail'; r.clauses.push({ id: 'excluded', kind: 'behavior', status: 'out_of_scope', observation: 'Owner exclusion', evidence: [] }); const result = validatePlatformProof(r, root); assert.equal(result.ok, true); assert.deepEqual(result.summary, { passed: 0, failed: 1, blocked: 0, outOfScope: 1 }); });
test('symlink evidence rejected', () => { fs.symlinkSync(path.join(root, 'run.txt'), path.join(root, 'link.txt')); const r = base(); r.artifacts[0].path = 'link.txt'; assert.equal(validatePlatformProof(r, root).ok, false); });
test('missing root rejected', () => assert.equal(validatePlatformProof(base(), path.join(root, 'missing')).ok, false));
process.on('exit', () => fs.rmSync(root, { recursive: true, force: true }));
for (const platform of [['web'], { toString: null }, null, 42, '__proto__']) test(`malformed platform fails closed: ${JSON.stringify(platform)}`, () => { const r = base(); r.platform = platform; assert.equal(validatePlatformProof(r, root).ok, false); });
test('relabeling text as video cannot pass appearance', () => { const r = base(); r.artifacts[0].kind = 'video'; r.clauses[0].kind = 'appearance'; assert.equal(validatePlatformProof(r, root).ok, false); });
test('PNG header alone cannot pass appearance', () => { const r = base(); const header = Buffer.from([137,80,78,71,13,10,26,10]); fs.writeFileSync(path.join(root, 'header.png'), header); r.artifacts[0] = { id: 'log', path: 'header.png', kind: 'screenshot', sha256: crypto.createHash('sha256').update(header).digest('hex') }; r.clauses[0].kind = 'appearance'; assert.equal(validatePlatformProof(r, root).ok, false); });
test('final-component swap to outside symlink is rejected before read', () => {
  const file = path.join(root, 'race.txt'); fs.writeFileSync(file, bytes);
  const r = base(); r.artifacts[0].path = 'race.txt';
  const original = fs.openSync;
  fs.openSync = function (target, ...args) { if (target === file) { fs.unlinkSync(file); fs.symlinkSync('/etc/hostname', file); } return original.call(this, target, ...args); };
  try { assert.equal(validatePlatformProof(r, root).ok, false); } finally { fs.openSync = original; }
});

function chunk(type, data) {
  const name = Buffer.from(type), buffer = Buffer.concat([name, data]);
  let crc = 0xffffffff;
  for (const byte of buffer) { crc ^= byte; for (let i = 0; i < 8; i++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0); }
  const out = Buffer.alloc(data.length + 12); out.writeUInt32BE(data.length); buffer.copy(out, 4); out.writeUInt32BE((crc ^ 0xffffffff) >>> 0, out.length - 4); return out;
}
function png() { const header = Buffer.alloc(13); header.writeUInt32BE(1); header.writeUInt32BE(1, 4); header[8] = 8; header[9] = 2; return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]), chunk('IHDR', header), chunk('IDAT', deflateSync(Buffer.from([0,20,30,40]))), chunk('IEND', Buffer.alloc(0))]); }
function screenshotRecord(content, filename) { const r = base(); fs.writeFileSync(path.join(root, filename), content); r.artifacts[0] = { id: 'log', path: filename, kind: 'screenshot', sha256: crypto.createHash('sha256').update(content).digest('hex') }; r.clauses[0].kind = 'appearance'; return r; }
test('valid PNG bytes pass integrity only, not a visual-quality verdict', () => assert.equal(validatePlatformProof(screenshotRecord(png(), 'valid.png'), root).ok, true));
test('corrupt PNG CRC rejected', () => { const bytes = png(); bytes[29] ^= 1; assert.equal(validatePlatformProof(screenshotRecord(bytes, 'corrupt.png'), root).ok, false); });
test('truncated PNG rejected', () => assert.equal(validatePlatformProof(screenshotRecord(png().subarray(0, 40), 'truncated.png'), root).ok, false));
test('PNG trailing data rejected', () => assert.equal(validatePlatformProof(screenshotRecord(Buffer.concat([png(), Buffer.from('extra')]), 'trailing.png'), root).ok, false));

test('malformed hash fails closed without coercion', () => { const r = base(); r.artifacts[0].sha256 = { toString: null }; assert.equal(validatePlatformProof(r, root).ok, false); });
