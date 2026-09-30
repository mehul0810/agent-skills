import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const audit = fs.readFileSync(path.join(root, 'scripts/model-routing-audit.sh'), 'utf8');
const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'model-routing-audit-'));
try {
  const files = new Set([...audit.matchAll(/^require_text "([^"]+)"/gm)].map(match => match[1]));
  files.add('scripts/model-routing-audit.sh');
  for (const file of files) {
    fs.mkdirSync(path.dirname(path.join(fixture, file)), { recursive: true });
    fs.copyFileSync(path.join(root, file), path.join(fixture, file));
  }
  const run = () => spawnSync('bash', [path.join(fixture, 'scripts/model-routing-audit.sh')], { encoding: 'utf8' });
  const probe = path.join(fixture, 'model-probe.md');
  for (const id of ['gpt-6-luna', 'gpt-6-sol', 'gpt-6.1-sol', 'gpt-6-astra']) {
    fs.writeFileSync(probe, id);
    const result = run();
    assert.equal(result.status, 0, `${id}: ${result.stderr}`);
  }
  for (const id of ['gpt-6.1-luna', 'gpt-6.1-astra', 'gpt-6.1-sol-extra', 'gpt-6.2-sol', 'gpt-5.6-sol']) {
    fs.writeFileSync(probe, id);
    const result = run();
    assert.notEqual(result.status, 0, `${id} must fail`);
    assert.match(result.stderr, /unapproved\/transient Codex model IDs/);
  }
  fs.unlinkSync(probe);
  const routing = path.join(fixture, 'shared/references/project-subagent-routing.md');
  const original = fs.readFileSync(routing, 'utf8');
  for (const removed of [
    'use GPT-6 Luna (`gpt-6-luna`) for routine implementation, fixes, tests, and evidence work',
    'Reserve GPT-6 Astra (`gpt-6-astra`) for exceptional work with a recorded complexity or failed-proof justification showing why 6.1 Sol is insufficient',
    'Missing access, stale inputs, tool outages, and authority gaps are not reasoning failures',
    'Return to the lowest sufficient approved lane after the exceptional work',
  ]) {
    assert.ok(original.includes(removed), 'mutation must affect current input');
    fs.writeFileSync(routing, original.replace(removed, 'removed by regression probe'));
    assert.notEqual(run().status, 0, 'lost Luna/Astra boundary must fail');
  }
  console.log('Model routing audit regression passed: 4 approved IDs, 5 rejected IDs, 4 preserved boundaries');
} finally {
  fs.rmSync(fixture, { recursive: true, force: true });
}
