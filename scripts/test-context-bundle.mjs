import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { buildContextBundle, formatBundle, parseArgs } from './plan-context-bundle.mjs';

const temporaryDirectories = [];
const script = path.resolve('scripts/plan-context-bundle.mjs');

async function fixture({ routes, projectRoot = '.', files = {} }) {
  const root = await mkdtemp(path.join(os.tmpdir(), 'context-bundle-'));
  temporaryDirectories.push(root);
  const project = path.join(root, projectRoot);
  await mkdir(project, { recursive: true });
  for (const [name, contents] of Object.entries(files)) {
    const target = path.join(project, name);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, contents, 'utf8');
  }
  const config = {
    schemaVersion: 1,
    projectRoot,
    requiredFiles: [],
    requiredPhrases: [],
    routeBudgets: routes,
    scenarios: [],
  };
  const configPath = path.join(root, 'agent-harness.config.json');
  await writeFile(configPath, `${JSON.stringify(config)}\n`, 'utf8');
  return { root, project, configPath };
}

test.after(async () => {
  await Promise.all(temporaryDirectories.map((directory) => rm(directory, { recursive: true, force: true })));
});

test('deduplicates repeated routes and shared files while retaining route provenance', async () => {
  const { configPath } = await fixture({
    routes: [
      { name: 'alpha', maxWords: 10, files: ['shared.md', 'alpha.md'] },
      { name: 'beta', maxWords: 10, files: ['shared.md', 'beta.md'] },
    ],
    files: { 'shared.md': 'sensitive marker shared', 'alpha.md': 'alpha', 'beta.md': 'beta' },
  });
  const bundle = await buildContextBundle(configPath, ['alpha', 'alpha', 'beta']);
  assert.equal(bundle.ok, true);
  assert.deepEqual(bundle.routes.map(({ route }) => route), ['alpha', 'beta']);
  assert.deepEqual(bundle.files, [
    { path: 'shared.md', words: 3, routes: ['alpha', 'beta'] },
    { path: 'alpha.md', words: 1, routes: ['alpha'] },
    { path: 'beta.md', words: 1, routes: ['beta'] },
  ]);
  assert.deepEqual(bundle.summary, {
    routeCount: 2,
    fileCount: 3,
    naiveSummedWords: 8,
    uniqueWords: 5,
    avoidedDuplicateWords: 3,
  });
  assert.equal(formatBundle(bundle).includes('sensitive marker'), false);
});

test('rejects unknown routes without reporting a successful bundle', async () => {
  const { configPath } = await fixture({ routes: [{ name: 'known', maxWords: 5, files: ['ok.md'] }], files: { 'ok.md': 'ok' } });
  const bundle = await buildContextBundle(configPath, ['missing']);
  assert.equal(bundle.ok, false);
  assert.equal(bundle.routes[0].diagnostics[0].code, 'ROUTE_NOT_FOUND');
});

test('fails the whole bundle and CLI when one selected route fails', async () => {
  const { configPath } = await fixture({ routes: [{ name: 'known', maxWords: 10, files: ['ok.md'] }], files: { 'ok.md': 'ok' } });
  const bundle = await buildContextBundle(configPath, ['known', 'missing']);
  assert.equal(bundle.ok, false);
  assert.equal(bundle.complete, false);
  assert.deepEqual(bundle.routes.map(({ ok }) => ok), [true, false]);
  const result = spawnSync(process.execPath, [script, '--config', configPath, '--route', 'known', '--route', 'missing', '--json'], { encoding: 'utf8' });
  assert.equal(result.status, 2);
  assert.equal(JSON.parse(result.stdout).complete, false);
});

test('fails an invalid configuration instead of planning any route successfully', async () => {
  const { configPath } = await fixture({ routes: [{ name: 'known', maxWords: 10, files: ['ok.md'] }], files: { 'ok.md': 'ok' } });
  await writeFile(configPath, '{ invalid json', 'utf8');
  const bundle = await buildContextBundle(configPath, ['known']);
  assert.equal(bundle.ok, false);
  assert.ok(bundle.routes[0].diagnostics.some(({ code }) => code === 'JSON_INVALID'));
});

test('fails unsafe route paths through the harness API', async () => {
  const { configPath } = await fixture({ routes: [{ name: 'escape', maxWords: 10, files: ['../outside.md'] }] });
  const bundle = await buildContextBundle(configPath, ['escape']);
  assert.equal(bundle.ok, false);
  assert.ok(bundle.routes[0].diagnostics.some(({ code }) => code === 'UNSAFE_PATH'));
});

test('fails a route with a missing file rather than silently omitting it', async () => {
  const { configPath } = await fixture({ routes: [{ name: 'missing-file', maxWords: 10, files: ['absent.md'] }] });
  const bundle = await buildContextBundle(configPath, ['missing-file']);
  assert.equal(bundle.ok, false);
  assert.ok(bundle.routes[0].diagnostics.some(({ code }) => code === 'FILE_MISSING'));
});

test('fails over-budget routes and preserves the route budget diagnostic', async () => {
  const { configPath } = await fixture({ routes: [{ name: 'large', maxWords: 2, files: ['large.md'] }], files: { 'large.md': 'one two three' } });
  const bundle = await buildContextBundle(configPath, ['large']);
  assert.equal(bundle.ok, false);
  assert.ok(bundle.routes[0].diagnostics.some(({ code }) => code === 'ROUTE_BUDGET_EXCEEDED'));
  assert.equal(bundle.routes[0].budget.maxWords, 2);
});

test('re-reads file word counts on every call without a persistent cache', async () => {
  const { configPath, project } = await fixture({ routes: [{ name: 'changing', maxWords: 10, files: ['mutable.md'] }], files: { 'mutable.md': 'one' } });
  assert.equal((await buildContextBundle(configPath, ['changing'])).summary.uniqueWords, 1);
  await writeFile(path.join(project, 'mutable.md'), 'one two three', 'utf8');
  assert.equal((await buildContextBundle(configPath, ['changing'])).summary.uniqueWords, 3);
});

test('resolves configured projectRoot independently of the process working directory', async () => {
  const { root, project, configPath } = await fixture({ projectRoot: 'project', routes: [{ name: 'isolated', maxWords: 10, files: ['source.md'] }], files: { 'source.md': 'inside project' } });
  await writeFile(path.join(root, 'source.md'), 'outside project root must not be read', 'utf8');
  const bundle = await buildContextBundle(configPath, ['isolated']);
  assert.equal(bundle.ok, true);
  assert.equal(bundle.files[0].words, 2);
  assert.equal((await readFile(path.join(project, 'source.md'), 'utf8')), 'inside project');
});

test('identifies distinct fixture roots by absolute config path', async () => {
  const first = await fixture({ routes: [{ name: 'same', maxWords: 10, files: ['source.md'] }], files: { 'source.md': 'first' } });
  const second = await fixture({ routes: [{ name: 'same', maxWords: 10, files: ['source.md'] }], files: { 'source.md': 'second' } });
  const firstBundle = await buildContextBundle(first.configPath, ['same']);
  const secondBundle = await buildContextBundle(second.configPath, ['same']);
  assert.equal(firstBundle.configPath, path.resolve(first.configPath));
  assert.equal(secondBundle.configPath, path.resolve(second.configPath));
  assert.notEqual(firstBundle.configPath, secondBundle.configPath);
});

test('validates CLI flags and emits a JSON manifest without file contents', async () => {
  assert.throws(() => parseArgs(['--route', 'x', '--mystery']), /Unknown argument/);
  assert.throws(() => parseArgs(['--route', '']), /cannot be empty/);
  assert.throws(() => parseArgs(['--json']), /At least one --route/);
  const { root } = await fixture({ routes: [{ name: 'json', maxWords: 10, files: ['private.md'] }], files: { 'private.md': 'do not expose this body' } });
  const result = spawnSync(process.execPath, [script, '--config', path.join(root, 'agent-harness.config.json'), '--route', 'json', '--json'], { cwd: os.tmpdir(), encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  const output = JSON.parse(result.stdout);
  assert.equal(output.files[0].path, 'private.md');
  assert.equal(result.stdout.includes('do not expose this body'), false);
  assert.equal(output.summary.uniqueWords, 5);
});
