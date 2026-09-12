#!/usr/bin/env node
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { handleContinuityHook } from './codex-continuity-hook.mjs';

const base = { hook_event_name: 'SessionStart', source: 'compact', session_id: 'test-session', cwd: '/private/tmp', model: 'fixture-model' };
const ready = async () => ({ result: { ok: true, warnings: [] } });
const absent = async () => ({ result: { ok: false } });
const json = value => JSON.stringify(value);
let checks = 0;
async function check(event, inspect, pattern) {
  const result = await handleContinuityHook(event, inspect);
  assert.match(json(result), pattern);
  assert.equal(result.continue, undefined);
  assert.equal(result.decision, undefined);
  checks++;
}
await check(base, ready, /output\/continuity\/test-session\/checkpoint.json/);
await check(base, async () => ({ result: { ok: true, warnings: ['changed'], text: 'PRIVATE_SENTINEL' } }), /reacquire effective context limits/);
assert.doesNotMatch(json(await handleContinuityHook(base, async () => ({ result: { ok: true, warnings: [], text: 'PRIVATE_SENTINEL' } }))), /PRIVATE_SENTINEL/);
checks++;
await check(base, absent, /unavailable or stale/);
await check(base, async () => ({ result: { ok: false, status: 'historical', retrievable: true } }), /does not authorize continuation/);
await check(base, async () => ({ result: { ok: false, status: 'absent' } }), /self-contained request needs no historical reconstruction/);
await check({ ...base, source: 'startup' }, absent, /^\{\}$/);
await check({ ...base, source: 'clear' }, ready, /^\{\}$/);
await check({ ...base, hook_event_name: 'Stop' }, ready, /^\{\}$/);
await check({ ...base, hook_event_name: 'PreCompact', trigger: 'auto' }, ready, /did not write it/);
await check({ ...base, hook_event_name: 'PreCompact', trigger: 'manual' }, absent, /unavailable or stale/);
await check(base, async () => { throw new Error('PRIVATE_SENTINEL'); }, /unavailable or stale/);
for (const bad of [null, [], 3, {}, { ...base, session_id: '../escape' }, { ...base, model: 'bad\nmodel' }, { ...base, cwd: 'relative' }]) {
  const result = await handleContinuityHook(bad, () => { throw new Error('must not inspect'); });
  assert.doesNotMatch(json(result), /must not inspect|PRIVATE_SENTINEL/);
  checks++;
}
for (const input of ['{', 'x'.repeat(65537), json(base)]) {
  const run = spawnSync(process.execPath, ['scripts/codex-continuity-hook.mjs'], { input, encoding: 'utf8', timeout: 7000 });
  assert.equal(run.status, 0);
  assert.match(json(JSON.parse(run.stdout)), /unavailable or stale/);
  assert.equal(run.stderr, '');
  checks++;
}
const config = JSON.parse(readFileSync('templates/project-hooks/hooks.json', 'utf8'));
if (existsSync('.codex/hooks.json')) assert.deepEqual(JSON.parse(readFileSync('.codex/hooks.json', 'utf8')), config);
assert.deepEqual(Object.keys(config.hooks).sort(), ['PreCompact', 'SessionStart']);
for (const list of Object.values(config.hooks)) for (const group of list) for (const hook of group.hooks) {
  assert.equal(hook.timeout, 5);
  assert.equal(hook.type, 'command');
  assert.match(hook.command, /scripts\/codex-continuity-hook.mjs/);
}
checks++;
console.log(`PASS: ${checks} synthetic hook checks; native lifecycle dispatch unverified.`);
