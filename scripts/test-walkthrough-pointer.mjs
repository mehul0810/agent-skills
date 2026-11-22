import test from 'node:test';
import assert from 'node:assert/strict';
import {createWalkthroughMouse, installWalkthroughPointer, moveToWalkthroughTarget} from '../product-video-producer/scripts/walkthrough-pointer.mjs';
import {parseArgs} from '../product-video-producer/scripts/record-walkthrough.mjs';

test('moves through timed real inputs and drags with release on failure', async () => {
  const events = [];
  const page = {mouse: {
    move: async (x, y) => events.push(['move', x, y]),
    down: async () => events.push(['down']), up: async () => events.push(['up']),
    click: async (x, y) => events.push(['click', x, y]),
  }};
  const mouse = createWalkthroughMouse(page, {pause: async ms => events.push(['pause', ms])});
  await assert.rejects(mouse.click(), /not established/);
  await mouse.move(0, 0, 0);
  await mouse.move(100, 40, 120);
  assert.deepEqual(events.filter(e => e[0] === 'move'), [['move', 0, 0], ['move', 100 / 3, 40 / 3], ['move', 200 / 3, 80 / 3], ['move', 100, 40]]);
  assert.equal(events.filter(e => e[0] === 'pause').length, 3);
  await mouse.click();
  assert.deepEqual(events.at(-1), ['click', 100, 40]);
  page.mouse.move = async () => { throw Error('move failed'); };
  await assert.rejects(mouse.drag(200, 40, 80), /move failed/);
  assert.deepEqual(events.filter(e => e[0] === 'down' || e[0] === 'up'), [['down'], ['up']]);
});

test('target movement requires fresh actionable nonempty bounds', async () => {
  const events = [];
  const target = {hover: async options => events.push(options), boundingBox: async () => ({x: 10, y: 20, width: 40, height: 30})};
  await moveToWalkthroughTarget(target, {move: async (...args) => events.push(args)});
  assert.deepEqual(events, [{trial: true, timeout: 5000}, [30, 35]]);
  target.boundingBox = async () => null;
  await assert.rejects(moveToWalkthroughTarget(target, {move: async () => assert.fail()}));
});

test('initialization only creates cue for trusted primary pointer events', async () => {
  let init;
  await installWalkthroughPointer({addInitScript: async fn => { init = fn; }});
  const listeners = {}, docListeners = {}, nodes = [];
  const element = () => ({style: {}, setAttribute(name, value) { this[name] = value; }, attachShadow() { return {append: child => nodes.push(child)}; }});
  const oldWindow = globalThis.window, oldDocument = globalThis.document;
  globalThis.window = {addEventListener: (type, fn) => { listeners[type] = fn; }};
  globalThis.document = {createElement: element, documentElement: {append: node => nodes.push(node)}, addEventListener: (type, fn) => { docListeners[type] = fn; }};
  try {
    init();
    const event = {type: 'pointermove', isTrusted: false, isPrimary: true, pointerType: 'mouse', clientX: 10, clientY: 20, buttons: 0};
    listeners.pointermove(event);
    assert.equal(nodes.length, 0);
    listeners.pointermove({...event, isTrusted: true});
    assert.equal(nodes.length, 2);
    const [cue, host] = nodes;
    assert.equal(host['aria-hidden'], 'true');
    assert.match(host.style.cssText, /pointer-events:none/);
    assert.equal(cue.style.left, '10px');
    listeners.pointerdown({...event, type: 'pointerdown', button: 0, isTrusted: true, buttons: 1});
    assert.equal(cue.style.background, '#f9c74f');
    listeners.blur();
    assert.equal(cue.style.display, 'none');
    listeners.pointermove({...event, isTrusted: true, isPrimary: false});
    assert.equal(cue.style.display, 'none');
  } finally { globalThis.window = oldWindow; globalThis.document = oldDocument; }
});

test('raw pointer option is explicit and cannot be repeated', () => {
  assert.equal(parseArgs(['--demo', '--out', '/tmp/example', '--no-pointer'])['no-pointer'], true);
  assert.throws(() => parseArgs(['--demo', '--out', '/tmp/example', '--no-pointer', '--no-pointer']));
});
