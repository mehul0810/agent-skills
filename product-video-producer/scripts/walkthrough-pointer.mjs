import {setTimeout as sleep} from 'node:timers/promises';

// This cue follows browser-delivered trusted pointer events; it is not the OS cursor.
export async function installWalkthroughPointer(context) {
  await context.addInitScript(() => {
    let cue;
    const hide = () => { if (cue) cue.style.display = 'none'; };
    const show = event => {
      if (!event.isTrusted || !event.isPrimary || !['mouse', 'pen'].includes(event.pointerType)) return;
      if ((event.type === 'pointerdown' || event.type === 'pointerup') && event.button !== 0) return;
      if (event.buttons & ~1) return;
      if (!cue) {
        const host = document.createElement('div');
        host.setAttribute('aria-hidden', 'true');
        host.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:2147483647;';
        const shadow = host.attachShadow({mode: 'closed'});
        cue = document.createElement('div');
        cue.style.cssText = 'display:none;position:fixed;width:18px;height:18px;margin:-9px 0 0 -9px;border:3px solid white;border-radius:50%;background:#102d3c;box-shadow:0 0 0 2px #102d3c;box-sizing:border-box;pointer-events:none;';
        shadow.append(cue);
        document.documentElement.append(host);
      }
      cue.style.left = `${event.clientX}px`;
      cue.style.top = `${event.clientY}px`;
      cue.style.display = 'block';
      cue.style.background = event.buttons & 1 ? '#f9c74f' : '#102d3c';
    };
    for (const type of ['pointermove', 'pointerdown', 'pointerup']) window.addEventListener(type, show, true);
    window.addEventListener('blur', hide, true);
    document.addEventListener('visibilitychange', () => { if (document.hidden) hide(); });
    document.addEventListener('pointerout', event => { if (event.isTrusted && event.isPrimary && !event.relatedTarget) hide(); }, true);
  });
}

// The first move establishes a point; subsequent moves are paced real browser input.
export function createWalkthroughMouse(page, {pause = sleep} = {}) {
  let point;
  const move = async (x, y, durationMs = 600) => {
    if (![x, y, durationMs].every(Number.isFinite) || durationMs < 0 || durationMs > 10000) throw Error('Invalid pointer movement');
    if (!point || durationMs === 0) {
      await page.mouse.move(x, y);
      point = {x, y};
      return;
    }
    const start = point;
    const steps = Math.max(2, Math.ceil(durationMs / 40));
    for (let i = 1; i <= steps; i++) {
      await pause(durationMs / steps);
      const next = {x: start.x + (x - start.x) * i / steps, y: start.y + (y - start.y) * i / steps};
      await page.mouse.move(next.x, next.y);
      point = next;
    }
  };
  return {
    move,
    async click() { if (!point) throw Error('Pointer position not established'); await page.mouse.click(point.x, point.y); },
    async drag(x, y, durationMs = 600) {
      if (!point) throw Error('Pointer position not established');
      await page.mouse.down();
      try { await move(x, y, durationMs); } finally { await page.mouse.up(); }
    },
  };
}

export async function moveToWalkthroughTarget(target, mouse) {
  await target.hover({trial: true, timeout: 5000});
  const box = await target.boundingBox();
  if (!box || box.width <= 0 || box.height <= 0) throw Error('Target is not visible');
  await mouse.move(box.x + box.width / 2, box.y + box.height / 2);
}
