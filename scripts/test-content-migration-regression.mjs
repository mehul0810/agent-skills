import assert from 'node:assert/strict';
import { importStableIds, safeOffsetWalk, traversePages } from './migration-regression-fixture.mjs';

const ids = Array.from({ length: 300 }, (_, index) => `record-${String(index + 1).padStart(3, '0')}`);
const live = ids.slice();
const processed = [];
const walked = safeOffsetWalk((offset, size) => live.slice(offset, offset + size), id => {
  processed.push(id);
  live.splice(live.indexOf(id), 1);
}, { windowSize: 100, maxRequests: 10, maxItems: 300 });
assert.equal(walked.complete, true);
assert.equal(processed.length, 300);
assert.equal(new Set(processed).size, 300);
assert.deepEqual(live, []);

// The legacy offset progression queries a shrinking resultset and skips its middle 100.
const legacyLive = ids.slice();
const legacyProcessed = [];
for (const offset of [0, 100, 200]) {
  const batch = legacyLive.slice(offset, offset + 100);
  for (const id of batch) {
    legacyProcessed.push(id);
    legacyLive.splice(legacyLive.indexOf(id), 1);
  }
}
assert.equal(legacyProcessed.length, 200);
assert.equal(legacyLive.length, 100);
assert.equal(legacyLive[0], 'record-101');

let failOnce = true;
const calls = new Map();
const write = async id => {
  calls.set(id, (calls.get(id) ?? 0) + 1);
  if (id === 'b' && failOnce) { failOnce = false; throw new Error('temporary'); }
};
let ledger = {};
const first = await importStableIds(['a', 'b', 'c'], write, ledger);
assert.equal(first.complete, false);
assert.equal(ledger.b, 'failed');
ledger = JSON.parse(JSON.stringify(ledger));
const resumed = await importStableIds(['a', 'b', 'c'], write, ledger);
assert.equal(resumed.complete, true);
assert.equal(calls.get('a'), 1);
assert.equal(calls.get('b'), 2);
assert.equal(calls.get('c'), 1);

const pages = [
  { identity: 'p1', items: [{ id: 'x' }, { id: 'y' }], next: 'late-page' },
  { identity: 'p2', items: [{ id: 'y' }, { id: 'z' }], next: null },
];
const result = traversePages(cursor => cursor == null ? pages[0] : pages[1], { maxRequests: 5, maxItems: 10 });
assert.equal(result.complete, true);
assert.deepEqual(result.items.map(item => item.id), ['x', 'y', 'z']);

const clamped = traversePages(() => ({ identity: 'terminal', items: [{ id: 'last' }], next: 'out-of-range' }), { maxRequests: 10, maxItems: 10 });
assert.equal(clamped.complete, false);
assert.equal(clamped.stoppedBy, 'repeated-page');
const budget = traversePages(cursor => ({ identity: String(cursor ?? 0), items: [{ id: String(cursor ?? 0) }], next: (cursor ?? 0) + 1 }), { maxRequests: 2, maxItems: 10 });
assert.equal(budget.complete, false);
assert.equal(budget.stoppedBy, 'request-limit');
const genuinelyEmpty = traversePages(() => ({ identity: 'empty', items: [], next: null }), { maxRequests: 2, maxItems: 10 });
assert.equal(genuinelyEmpty.complete, true);
assert.equal(genuinelyEmpty.items.length, 0);
const stuck = safeOffsetWalk(() => ['same'], () => false, { windowSize: 1, maxRequests: 20, maxItems: 20 });
assert.equal(stuck.complete, false);
assert.equal(stuck.stoppedBy, 'no-progress');
assert.ok(stuck.failed.has('same'));
const throws = safeOffsetWalk(() => ['bad'], () => { throw new Error('write failed'); }, { windowSize: 1, maxRequests: 3, maxItems: 4 });
assert.equal(throws.complete, false);
assert.equal(throws.failed.has('bad'), true);
let endlessPage = 0;
const endless = safeOffsetWalk((offset, size) => {
  const page = endlessPage++;
  return Array.from({ length: size }, (_, i) => `fresh-${page}-${i}`);
}, () => true, { windowSize: 2, maxRequests: 3, maxItems: 100 });
assert.equal(endless.complete, false);
assert.equal(endless.stoppedBy, 'request-limit');
assert.equal(endless.requests, 3);
const itemBound = safeOffsetWalk(() => ['a', 'b', 'c'], () => true, { windowSize: 3, maxRequests: 20, maxItems: 2 });
assert.equal(itemBound.complete, false);
assert.equal(itemBound.stoppedBy, 'item-limit');
assert.equal(itemBound.attempts, 2);

for (const failure of ['false', 'throw']) {
  const partial = ['pending'];
  const result = safeOffsetWalk((offset, size) => partial.slice(offset, offset + size), () => {
    partial.shift();
    if (failure === 'throw') throw new Error('write failed after changing membership');
    return false;
  }, { windowSize: 1, maxRequests: 3, maxItems: 3 });
  assert.equal(result.complete, false, `${failure} after mutation cannot pass an empty selector`);
  assert.equal(result.stoppedBy, 'unresolved-failure');
  assert.deepEqual([...result.failed], ['pending']);
}

console.log('Content migration regression fixtures passed.');
