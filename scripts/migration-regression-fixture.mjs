// Synthetic migration mechanics only; this is not a WordPress importer.
export function traversePages(fetchPage, { maxRequests, maxItems }) {
  const seenPages = new Set();
  const seenIds = new Set();
  const items = [];
  let cursor = null;
  let requests = 0;
  let stoppedBy = null;

  while (requests < maxRequests && items.length < maxItems) {
    const page = fetchPage(cursor);
    requests += 1;
    const pageKey = String(page.identity);
    if (seenPages.has(pageKey)) { stoppedBy = 'repeated-page'; break; }
    seenPages.add(pageKey);
    for (const item of page.items) {
      if (seenIds.has(item.id)) continue;
      if (items.length >= maxItems) { stoppedBy = 'item-limit'; break; }
      seenIds.add(item.id);
      items.push(item);
    }
    if (stoppedBy) break;
    if (page.next == null) { stoppedBy = 'terminal'; break; }
    cursor = page.next;
  }
  if (!stoppedBy) stoppedBy = requests >= maxRequests ? 'request-limit' : 'item-limit';
  return { items, requests, stoppedBy, complete: stoppedBy === 'terminal' };
}

export async function importStableIds(ids, write, ledger = {}) {
  for (const id of ids) {
    if (ledger[id] === 'done') continue;
    try {
      const result = await write(id);
      ledger[id] = result === false ? 'failed' : 'done';
    } catch (error) {
      ledger[id] = 'failed';
    }
  }
  return { ledger, complete: ids.every(id => ledger[id] === 'done') };
}

export function safeOffsetWalk(fetchWindow, processItem, { windowSize, maxRequests, maxItems, maxNoProgress = 2 }) {
  const done = new Set();
  const failed = new Set();
  let noProgress = 0;
  let requests = 0;
  let attempts = 0;
  while (requests < maxRequests && noProgress < maxNoProgress) {
    const window = fetchWindow(0, windowSize);
    requests += 1;
    if (window.length === 0) return { ids: done, failed, requests, attempts, complete: failed.size === 0, stoppedBy: failed.size ? 'unresolved-failure' : 'empty-window' };
    if (attempts >= maxItems) return { ids: done, failed, requests, attempts, complete: false, stoppedBy: 'item-limit' };
    let progress = 0;
    for (const id of window) {
      if (done.has(id)) continue;
      if (attempts >= maxItems) break;
      attempts += 1;
      try {
        if (processItem(id) === false) { failed.add(id); continue; }
        done.add(id);
        failed.delete(id);
        progress += 1;
      } catch {
        failed.add(id);
      }
    }
    if (progress === 0) noProgress += 1;
    else noProgress = 0;
  }
  const stoppedBy = noProgress >= maxNoProgress ? 'no-progress' : requests >= maxRequests ? 'request-limit' : 'item-limit';
  return { ids: done, failed, requests, attempts, complete: false, stoppedBy };
}
