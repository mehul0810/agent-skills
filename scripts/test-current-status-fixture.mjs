import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { after, test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { buildPacket, verifyPacket } from './build-eval-packet.mjs';

const root = fileURLToPath(new URL('../skill-evals/cases/current-status/', import.meta.url));
const cli = path.join(root, 'fixture/lookup.mjs');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'current-status-fixture-'));
after(() => fs.rmSync(tmp, { recursive: true, force: true }));

function query(id, kind, repo, number, name = `${id}-${kind}`) {
  const trace = path.join(tmp, `${name}.jsonl`);
  const result = spawnSync(process.execPath, [cli, id, kind, repo, String(number), '--trace', trace], {
    encoding: 'utf8', timeout: 10000,
  });
  assert.ifError(result.error);
  assert.notEqual(result.status, null);
  return { ...result, trace, data: JSON.parse(result.status === 0 ? result.stdout : result.stderr) };
}

test('lookup distinguishes merged from closed without merge and records exact targets', () => {
  const merged = query('status-01', 'pr', 'acme-example/atlas-widget', 41);
  const closed = query('status-02', 'pr', 'acme-example/copper-theme', 72);
  assert.equal(merged.status, 0);
  assert.equal(merged.data.merged, true);
  assert.equal(closed.status, 0);
  assert.equal(closed.data.state, 'closed');
  assert.equal(closed.data.merged, false);
  const trace = JSON.parse(fs.readFileSync(merged.trace, 'utf8'));
  assert.equal(trace.caseId, 'status-01');
  assert.equal(trace.repo, 'acme-example/atlas-widget');
  assert.equal(trace.number, 41);
  assert.equal(trace.kind, 'pr');
  assert.ok(Number.isFinite(Date.parse(trace.at)));
});

test('unavailable service returns an error rather than a PR state', () => {
  const result = query('status-03', 'pr', 'acme-example/harbor-plugin', 19);
  assert.equal(result.status, 1);
  assert.equal(result.data.error, 'service_unavailable');
  assert.equal(result.data.state, undefined);
});

test('CI fixture requires PR metadata to identify the current head', () => {
  const pr = query('status-04', 'pr', 'acme-example/river-blocks', 58);
  const checks = query('status-04', 'checks', 'acme-example/river-blocks', 58);
  assert.equal(pr.status, 0);
  assert.equal(checks.status, 0);
  // Run SHAs alone must not disclose which revision is the current PR head.
  assert.deepEqual(Object.keys(checks.data).sort(), ['number', 'repository', 'runs']);
  const current = checks.data.runs.find(run => run.sha === pr.data.headSha);
  const success = checks.data.runs.find(run => run.conclusion === 'success');
  assert.equal(current.status, 'queued');
  assert.equal(current.conclusion, null);
  assert.notEqual(success.sha, pr.data.headSha);
});

test('same-number wrong repository, unknown case and unsupported endpoint fail closed', () => {
  const exact = query('status-05', 'pr', 'acme-example/cedar-core', 26);
  const wrong = query('status-05', 'pr', 'acme-example/cedar-docs', 26, 'wrong-repo');
  const unknown = query('unknown', 'pr', 'acme-example/cedar-core', 26);
  const unsupported = query('status-01', 'checks', 'acme-example/atlas-widget', 41);
  assert.equal(exact.status, 0);
  assert.equal(exact.data.state, 'open');
  assert.equal(wrong.status, 1);
  assert.equal(wrong.data.error, 'not_found');
  assert.equal(unknown.status, 1);
  assert.equal(unknown.data.error, 'not_found');
  assert.equal(unsupported.status, 1);
  assert.equal(unsupported.data.error, 'not_available');
});

test('invalid invocation does not create a trace', () => {
  const trace = path.join(tmp, 'invalid.jsonl');
  const result = spawnSync(process.execPath, [cli, 'status-01', 'delete', 'acme-example/atlas-widget', '41', '--trace', trace], {
    encoding: 'utf8', timeout: 10000,
  });
  assert.equal(result.status, 2);
  assert.equal(fs.existsSync(trace), false);
});

test('the only fixture write appends queries to the caller-selected trace', () => {
  const snapshot = () => fs.readdirSync(root, { recursive: true }).sort()
    .filter(file => fs.statSync(path.join(root, file)).isFile())
    .map(file => [file, fs.readFileSync(path.join(root, file), 'utf8')]);
  const before = snapshot();
  const first = query('status-01', 'pr', 'acme-example/atlas-widget', 41, 'append');
  const initial = fs.readFileSync(first.trace, 'utf8');
  query('status-02', 'pr', 'acme-example/copper-theme', 72, 'append');
  const final = fs.readFileSync(first.trace, 'utf8');
  assert.ok(final.startsWith(initial));
  assert.deepEqual(final.trim().split('\n').map(row => JSON.parse(row).caseId), ['status-01', 'status-02']);
  assert.deepEqual(snapshot(), before);
});

test('all seven blind packets exclude scorer criteria and backend responses', () => {
  for (let n = 1; n <= 7; n++) {
    const id = `status-${String(n).padStart(2, '0')}`;
    const source = path.join(tmp, id);
    fs.cpSync(path.join(root, id), source, { recursive: true });
    const input = JSON.parse(fs.readFileSync(path.join(source, 'input.json')));
    assert.equal(input.id, id);
    const output = path.join(tmp, `${id}-packet`);
    // This external copy tests packet mechanics without claiming a Git revision.
    const manifest = buildPacket(source, output, '0'.repeat(40));
    assert.deepEqual(Object.keys(manifest.files).sort(), ['request.md', ...input.artifacts.map(p => `artifacts/${p}`)].sort());
    assert.equal(verifyPacket(output).packetDigest, manifest.packetDigest);
    assert.equal(fs.existsSync(path.join(output, 'criteria.md')), false);
  }
});
