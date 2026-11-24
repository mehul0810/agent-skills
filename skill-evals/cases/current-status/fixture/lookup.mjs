#!/usr/bin/env node
// Synthetic, read-only GitHub lookup. Evaluators use the CLI, not the backend data.
import { readFileSync, appendFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, isAbsolute, join } from 'node:path';
const root = dirname(fileURLToPath(import.meta.url));
const [caseId, kind, repo, number, traceFlag, tracePath] = process.argv.slice(2);
if (process.argv.length !== 8 || !caseId || !['pr', 'checks', 'recent'].includes(kind) || !repo || !/^\d+$/.test(number ?? '') || traceFlag !== '--trace' || !tracePath || !isAbsolute(tracePath)) {
  console.error('Usage: node lookup.mjs CASE_ID pr|checks|recent OWNER/REPO PR_NUMBER --trace /absolute/path/TRACE.jsonl');
  process.exit(2);
}
const cases = JSON.parse(readFileSync(join(root, 'private', 'development-state.json'), 'utf8'));
const test = cases[caseId];
const query = { at: new Date().toISOString(), caseId, kind, repo, number: Number(number) };
appendFileSync(tracePath, JSON.stringify(query) + '\n');
if (!test || test.repo !== repo || test.number !== Number(number)) {
  console.error(JSON.stringify({ error: 'not_found', message: 'No matching synthetic GitHub record for this exact repository and PR number.' }));
  process.exit(1);
}
const result = test[kind];
if (!result) {
  console.error(JSON.stringify({ error: 'not_available', message: 'This lookup is not available for this case.' }));
  process.exit(1);
}
if (result.error) {
  console.error(JSON.stringify(result));
  process.exit(1);
}
console.log(JSON.stringify(result, null, 2));
