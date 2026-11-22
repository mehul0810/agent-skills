import { constants } from 'node:fs';
import { open } from 'node:fs/promises';
import { setTimeout as hold } from 'node:timers/promises';

const roles = new Set(['button', 'tab', 'radio', 'checkbox', 'link']);
const limit = 16 * 1024;
const only = (object, fields) => object && typeof object === 'object' && !Array.isArray(object) &&
  Object.keys(object).every(key => fields.includes(key));
const label = value => typeof value === 'string' && value.trim() === value && value.length > 0 &&
  value.length <= 100 && !/[\x00-\x1f\x7f]/.test(value);

export function validatePlan(input) {
  if (!only(input, ['version', 'steps']) || input.version !== 1 || !Array.isArray(input.steps) ||
      !input.steps.length || input.steps.length > 12) throw Error('Expected a version 1 plan with 1-12 steps');
  const steps = input.steps.map((s, i) => {
    if (!only(s, ['role', 'name', 'expect', 'holdMs']) || !roles.has(s.role) || !label(s.name) ||
        !label(s.expect) || !Number.isInteger(s.holdMs) || s.holdMs < 500 || s.holdMs > 6000) {
      throw Error(`Step ${i + 1} needs a named control, a visible result and a 500-6000 ms reading hold`);
    }
    return Object.freeze({ role: s.role, name: s.name, expect: s.expect, holdMs: s.holdMs });
  });
  return Object.freeze({ version: 1, steps: Object.freeze(steps) });
}

export async function loadPlan(file) {
  const handle = await open(file, constants.O_RDONLY | constants.O_NONBLOCK | constants.O_NOFOLLOW);
  try {
    if (!(await handle.stat()).isFile()) throw Error('Plan must be a regular file');
    const buffer = Buffer.alloc(limit + 1);
    let used = 0;
    while (used < buffer.length) {
      const { bytesRead } = await handle.read(buffer, used, buffer.length - used);
      if (!bytesRead) break;
      used += bytesRead;
    }
    if (used > limit) throw Error('Plan exceeds 16 KiB');
    return validatePlan(JSON.parse(buffer.toString('utf8', 0, used)));
  } finally { await handle.close(); }
}

export async function performPlan(page, plan, onObserved, { pause = hold, now = () => performance.now() } = {}) {
  const start = now();
  const action = { timeout: 5000 };
  await pause(1000); // Leave room for the viewer to locate the starting state.
  for (const [i, step] of plan.steps.entries()) {
    const target = page.getByRole(step.role, { name: step.name, exact: true });
    const result = page.getByText(step.expect, { exact: true });
    if (await target.count() !== 1 || await result.count() > 1 || await result.isVisible()) {
      throw Error(`Step ${i + 1}: ambiguous control or result already on screen; no click attempted`);
    }
    await target.hover(action);
    await pause(450);
    if (await result.isVisible()) throw Error(`Step ${i + 1}: result appeared before clicking`);
    await target.click(action);
    await result.waitFor({ state: 'visible', timeout: 8000 });
    onObserved(i + 1, Math.round(now() - start));
    await pause(step.holdMs);
  }
}
