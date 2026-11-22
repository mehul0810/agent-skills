import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { loadPlan, validatePlan, performPlan } from '../product-video-producer/scripts/walkthrough-plan.mjs';

const step = { role: 'button', name: 'Compare', expect: 'Ready', holdMs: 1400 };
const plan = { version: 1, steps: [step] };

test('accepts only bounded data and does not allow selectors, executable steps or text entry', () => {
  assert.deepEqual(validatePlan(plan), plan);
  for (const bad of [{}, { ...plan, url: 'anything' }, { ...plan, steps: [] }, { ...plan, steps: Array(13).fill(step) }]) {
    assert.throws(() => validatePlan(bad));
  }
  for (const patch of [{ role: 'textbox' }, { name: ' ' }, { expect: 'x\ny' }, { holdMs: 0 }, { run: 'code' }, { selector: '*' }]) {
    assert.throws(() => validatePlan({ ...plan, steps: [{ ...step, ...patch }] }));
  }
});

test('rejects links, oversized files and non-files before interpreting a plan', async t => {
  const root = await mkdtemp(join(tmpdir(), 'walkthrough-plan-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const good = join(root, 'take.json');
  await writeFile(good, JSON.stringify(plan));
  assert.deepEqual(await loadPlan(good), plan);
  await symlink(good, join(root, 'link'));
  await assert.rejects(loadPlan(join(root, 'link')));
  await assert.rejects(loadPlan(root));
  await writeFile(good, ' '.repeat(16384) + JSON.stringify(plan));
  await assert.rejects(loadPlan(good), /16 KiB/);
});

function rig({ targets = 1, preexisting = false, hoverReveals = false, resultCount = 1, missing = false } = {}) {
  const events = [];
  let visible = preexisting;
  const target = {
    count: async () => targets,
    hover: async () => { events.push('orient'); if (hoverReveals) visible = true; },
    click: async () => { events.push('click'); visible = !missing; },
  };
  const result = {
    count: async () => resultCount, isVisible: async () => visible,
    waitFor: async () => { events.push('inspect'); if (!visible) throw Error('missing result'); },
  };
  return { events, run: () => performPlan({
    getByRole: (role, options) => { assert.equal(role, step.role); assert.deepEqual(options, { name: step.name, exact: true }); return target; },
    getByText: (text, options) => { assert.equal(text, step.expect); assert.deepEqual(options, { exact: true }); return result; },
  }, plan, n => events.push('observed ' + n), { pause: async ms => events.push(ms), now: () => 0 }) };
}

test('paces the control before the action and holds only after a new visible result', async () => {
  const r = rig(); await r.run(); assert.deepEqual(r.events, [1000, 'orient', 450, 'click', 'inspect', 'observed 1', 1400]);
  for (const option of [{ targets: 0 }, { targets: 2 }, { resultCount: 2 }, { preexisting: true }, { hoverReveals: true }]) {
    const r = rig(option); await assert.rejects(r.run()); assert.ok(!r.events.includes('click'));
  }
  const bad = rig({ missing: true }); await assert.rejects(bad.run()); assert.ok(!bad.events.includes('observed 1'));
});
