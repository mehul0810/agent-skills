#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { DEFAULT_FILE_LIMITS, listRegularFiles, normalizeFileLimits, safeReadFile } from './bounded-files.mjs';

const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const SELECTABLE_CASES = {
  'editorial-signature': ['season-notes', 'one-caption'],
  'navigation-study-selection': ['two-explanations', 'one-correct-click', 'same-people', 'bounded-label'],
  'design-route-regression': Array.from({ length: 26 }, (_, i) => String(i + 1)),
};
export function selectableCaseIds(id) { return SELECTABLE_CASES[id] ? [...SELECTABLE_CASES[id]] : null; }
function packetDigest(files, hashBytes = sha) {
  return hashBytes(Buffer.from(JSON.stringify(Object.entries(files).sort(([a], [b]) => a.localeCompare(b)))));
}
function repositoryFor(root) {
  try {
    return execFileSync('git', ['-C', root, 'rev-parse', '--show-toplevel'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  } catch (error) {
    if (error.code === 'ENOENT') throw error;
    if (/not a git repository/i.test(error.stderr?.toString?.() || error.message)) return null;
    throw error;
  }
}
function matchesCommittedFullPacket(manifest, contents) {
  try {
    const repo = repositoryFor(path.dirname(fileURLToPath(import.meta.url)));
    if (!repo) return false;
    const root = `skill-evals/cases/${manifest.id}`;
    const revision = manifest.sourceRevision ?? manifest.revision;
    const show = file => execFileSync('git', ['-C', repo, 'show', `${revision}:${root}/${file}`], { encoding: 'buffer', stdio: ['ignore', 'pipe', 'pipe'] });
    const input = JSON.parse(show('input.json'));
    if (input.id !== manifest.id || !Array.isArray(input.artifacts) || !contents.get('request.md').equals(Buffer.from(input.request + '\n'))) return false;
    if (contents.size !== input.artifacts.length + 1) return false;
    return input.artifacts.every(file => contents.get(`artifacts/${file}`)?.equals(show(`artifacts/${file}`)));
  } catch { return false; }
}
function verifyCommittedSelection(manifest, contents, ids) {
  const repo = repositoryFor(path.dirname(fileURLToPath(import.meta.url)));
  if (!repo) throw new Error('Selected packet source unavailable: source repository unavailable');
  const root = `skill-evals/cases/${manifest.id}`;
  const revision = manifest.sourceRevision ?? manifest.revision;
  const show = file => {
    try { return execFileSync('git', ['-C', repo, 'show', `${revision}:${root}/${file}`], { encoding: 'buffer', stdio: ['ignore', 'pipe', 'pipe'] }); }
    catch { throw new Error(`Selected packet source unavailable: committed ${file} at ${revision}`); }
  };
  try {
    const input = JSON.parse(show('input.json'));
    if (input.id !== manifest.id || !Array.isArray(input.artifacts)) throw new Error('source input mismatch');
    if (manifest.id === 'design-route-regression') {
      if (input.artifacts.length || contents.size !== 1) throw new Error('unexpected packet artifacts');
      const lines = input.request.split('\n');
      const intro = 'Use the repository\'s owning WordPress skills to answer these independent hypothetical requests. Report concrete decisions, actually loaded routes, and required proof; no implementation.';
      const warning = 'These are synthetic decisions, not supplied source images or runtime proof. Do not claim to have inspected missing screenshots, packages or real users.';
      const cases = new Map();
      if (lines[0] !== intro || lines.filter(line => line === warning).length !== 1) throw new Error('unsupported source cases');
      for (const line of lines.slice(1)) {
        if (!line || line === warning) continue;
        const match = line.match(/^([1-9][0-9]*)\. (.+)$/);
        if (!match || cases.has(match[1])) throw new Error('unsupported source cases');
        cases.set(match[1], line);
      }
      if (cases.size !== 26 || selectableCaseIds(manifest.id).some(id => !cases.has(id)) || ids.some(id => !cases.has(id))) throw new Error('unsupported source cases');
      const expected = Buffer.from([intro, ...ids.map(id => cases.get(id)), '', warning].join('\n') + '\n');
      if (!contents.get('request.md').equals(expected)) throw new Error('request differs from committed selection');
    } else {
      if (JSON.stringify(input.artifacts) !== JSON.stringify(['briefs.json']) || contents.size !== 2 || !contents.get('request.md').equals(Buffer.from(input.request + '\n'))) throw new Error('unexpected packet contents');
      const briefs = JSON.parse(show('artifacts/briefs.json'));
      if (!Array.isArray(briefs)) throw new Error('invalid source briefs');
      const selected = ids.map(id => briefs.find(brief => brief.id === id));
      if (selected.some(item => !item) || !contents.get('artifacts/briefs.json')?.equals(Buffer.from(JSON.stringify(selected, null, 2) + '\n'))) throw new Error('briefs differ from committed selection');
    }
  } catch (error) {
    if (error.message.startsWith('Selected packet source unavailable:')) throw error;
    throw new Error(`Selected packet source mismatch: ${error.message}`);
  }
}
function verifyRepositoryInputs(root, revision, selectedFiles) {
  const repo = repositoryFor(root);
  if (!repo) return;
  const head = execFileSync('git', ['-C', repo, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  if (head !== revision) throw new Error('Packet source revision does not match the case repository HEAD');
  for (const [file, bytes] of selectedFiles) {
    const relative = path.relative(repo, path.join(root, file)).split(path.sep).join('/');
    if (relative === '..' || relative.startsWith('../')) throw new Error('Repository case path escapes its checkout');
    let committed;
    try {
      const treeEntry = execFileSync('git', ['-C', repo, 'ls-tree', '-r', '--full-tree', revision, '--', relative], { encoding: 'utf8' }).trim();
      const match = treeEntry.match(/^100(?:644|755) blob [a-f0-9]+\t(.+)$/);
      if (!match || match[1] !== relative) throw new Error('Selected input is not a regular committed file');
      committed = execFileSync('git', ['-C', repo, 'show', `${revision}:${relative}`], { encoding: 'buffer' });
    } catch {
      throw new Error(`Selected packet input is not present at source revision: ${relative}`);
    }
    if (!committed.equals(bytes)) throw new Error(`Selected packet input differs from source revision: ${relative}`);
  }
}
function relativeFile(value) {
  if (typeof value !== 'string' || !value || path.isAbsolute(value) || value.includes('\\') || value.split('/').some(x => !x || x === '.' || x === '..')) throw new Error('Unsafe artifact path');
  return value;
}
export function buildPacket(caseRoot, output, sourceRevision, options = {}) {
  const limits = normalizeFileLimits(options.limits);
  const { maxFileBytes, maxTotalBytes, maxEntries, maxDepth } = limits;
  if (!/^[a-f0-9]{40}$/.test(sourceRevision)) throw new Error('Exact source revision required');
  const root = fs.realpathSync(caseRoot);
  const inputPath = path.join(root, 'input.json');
  const inputBytes = safeReadFile(inputPath, { maxBytes: maxFileBytes });
  const input = JSON.parse(inputBytes);
  if (Object.keys(input).some(k => !['id', 'request', 'artifacts'].includes(k)) || typeof input.id !== 'string' || !input.id || typeof input.request !== 'string' || !input.request.trim() || !Array.isArray(input.artifacts)) throw new Error('Input permits only id, request and artifacts');
  const files = input.artifacts.map(relativeFile);
  if (new Set(files).size !== files.length) throw new Error('Duplicate artifact');
  const artifactDirectories = new Set(files.length ? ['artifacts'] : []);
  for (const file of files) {
    const parts = file.split('/');
    for (let index = 0; index < parts.length; index += 1) {
      if (index < parts.length - 1) artifactDirectories.add(['artifacts', ...parts.slice(0, index + 1)].join('/'));
    }
  }
  if (files.length + artifactDirectories.size + 2 > maxEntries) throw new Error('Packet exceeds entry limit');
  let totalBytes = inputBytes.length;
  let payloads = files.map(file => {
    const source = path.join(root, 'artifacts', file);
    const parts = file.split('/');
    if (parts.length + 1 > maxDepth) throw new Error('Artifact exceeds depth limit');
    let directory = path.join(root, 'artifacts');
    const artifactsStat = fs.lstatSync(directory);
    if (artifactsStat.isSymbolicLink() || !artifactsStat.isDirectory()) throw new Error('Artifact must be in a regular artifacts directory');
    for (const part of parts.slice(0, -1)) {
      directory = path.join(directory, part);
      const stat = fs.lstatSync(directory);
      if (stat.isSymbolicLink() || !stat.isDirectory()) throw new Error('Artifact path contains a non-directory component');
    }
    const bytes = safeReadFile(source, { maxBytes: maxFileBytes });
    totalBytes += bytes.length;
    if (totalBytes > maxTotalBytes) throw new Error('Packet exceeds total byte limit');
    return [file, bytes];
  });
  verifyRepositoryInputs(root, sourceRevision, [['input.json', inputBytes], ...payloads.map(([file, bytes]) => [`artifacts/${file}`, bytes])]);
  let request = input.request;
  if (options.caseIds !== undefined) {
    const ids = options.caseIds;
    if (!Array.isArray(ids) || !ids.length || ids.some(id => typeof id !== 'string' || !id) || new Set(ids).size !== ids.length) throw new Error('Case IDs must be non-empty and unique');
    if (input.id === 'design-route-regression' && files.length === 0) {
      const lines = input.request.split('\n');
      const intro = 'Use the repository\'s owning WordPress skills to answer these independent hypothetical requests. Report concrete decisions, actually loaded routes, and required proof; no implementation.';
      const warning = 'These are synthetic decisions, not supplied source images or runtime proof. Do not claim to have inspected missing screenshots, packages or real users.';
      const cases = new Map();
      if (lines[0] !== intro || lines.filter(line => line === warning).length !== 1) throw new Error('Unsupported design regression format');
      for (const line of lines.slice(1)) {
        if (!line || line === warning) continue;
        const match = line.match(/^([1-9][0-9]*)\. (.+)$/);
        if (!match || cases.has(match[1])) throw new Error('Unsupported design regression format');
        cases.set(match[1], line);
      }
      if (cases.size !== 26 || Array.from({ length: 26 }, (_, i) => String(i + 1)).some(id => !cases.has(id))) throw new Error('Unsupported design regression format');
      request = [intro, ...ids.map(id => {
        if (!cases.has(id)) throw new Error(`Unknown case ID: ${id}`);
        return cases.get(id);
      }), '', warning].join('\n');
    } else if (['editorial-signature', 'navigation-study-selection'].includes(input.id) && files.length === 1 && files[0] === 'briefs.json') {
      const briefs = JSON.parse(payloads[0][1]);
      if (!Array.isArray(briefs) || briefs.some(brief => !brief || Object.keys(brief).sort().join(',') !== 'id,request' || typeof brief.id !== 'string' || !brief.id || typeof brief.request !== 'string' || !brief.request.trim()) || new Set(briefs.map(brief => brief.id)).size !== briefs.length) throw new Error('Invalid selectable briefs');
      if (JSON.stringify(briefs.map(brief => brief.id).sort()) !== JSON.stringify(selectableCaseIds(input.id).sort())) throw new Error('Unsupported selectable case inventory');
      const selected = ids.map(id => {
        const brief = briefs.find(item => item.id === id);
        if (!brief) throw new Error(`Unknown case ID: ${id}`);
        return brief;
      });
      payloads = [['briefs.json', Buffer.from(JSON.stringify(selected, null, 2) + '\n')]];
      if (payloads[0][1].length > maxFileBytes) throw new Error('Artifact exceeds byte limit');
    } else throw new Error('Case selection unsupported for this packet');
  }
  const requestBytes = Buffer.from(request + '\n');
  const packetBytes = requestBytes.length + payloads.reduce((sum, [, bytes]) => sum + bytes.length, 0);
  if (requestBytes.length > maxFileBytes) throw new Error('Request exceeds byte limit');
  if (packetBytes > maxTotalBytes) throw new Error('Packet exceeds total byte limit');
  const manifest = { version: options.caseIds === undefined ? 2 : 3, id: input.id, sourceRevision, files: {} };
  if (options.caseIds !== undefined) manifest.selection = { caseIds: [...options.caseIds] };
  manifest.files['request.md'] = sha(requestBytes);
  for (const [file, bytes] of payloads) manifest.files['artifacts/' + file] = sha(bytes);
  manifest.packetDigest = packetDigest(manifest.files);
  const manifestBytes = Buffer.from(JSON.stringify(manifest, null, 2) + '\n');
  if (manifestBytes.length > maxFileBytes || packetBytes + manifestBytes.length > maxTotalBytes) throw new Error('Packet exceeds byte limit');
  // Exclusive creation avoids overwriting evidence from an earlier run.
  fs.mkdirSync(output);
  const write = (file, bytes) => {
    fs.mkdirSync(path.dirname(path.join(output, file)), { recursive: true });
    fs.writeFileSync(path.join(output, file), bytes, { flag: 'wx' });
  };
  write('request.md', requestBytes);
  for (const [file, bytes] of payloads) write('artifacts/' + file, bytes);
  fs.writeFileSync(path.join(output, 'manifest.json'), manifestBytes, { flag: 'wx' });
  return manifest;
}
export function verifyPacket(output, options = {}) {
  const {
    readFile = safeReadFile,
    listFiles = listRegularFiles,
    hashBytes = sha,
  } = options;
  const normalizedLimits = normalizeFileLimits(options.limits);
  const root = fs.realpathSync(output);
  // Inspect every directory entry first so special files are rejected before any packet bytes are read.
  const actual = listFiles(root, { maxEntries: normalizedLimits.maxEntries, maxDepth: normalizedLimits.maxDepth }).filter(x => x !== 'manifest.json').sort();
  if (actual.length + 1 > normalizedLimits.maxEntries) throw new Error('Packet exceeds entry limit');
  const manifestBytes = readFile(path.join(root, 'manifest.json'), { maxBytes: normalizedLimits.maxFileBytes });
  let totalBytes = manifestBytes.length;
  if (totalBytes > normalizedLimits.maxTotalBytes) throw new Error('Packet exceeds total byte limit');
  const manifest = JSON.parse(manifestBytes);
  const validV1 = manifest.version === 1 && /^[a-f0-9]{40}$/.test(manifest.revision);
  const validV2 = [2, 3].includes(manifest.version) && /^[a-f0-9]{40}$/.test(manifest.sourceRevision) && manifest.files && manifest.packetDigest === packetDigest(manifest.files, hashBytes);
  if ((!validV1 && !validV2) || !manifest.files || !Object.hasOwn(manifest.files, 'request.md') || (manifest.version !== 3 && Object.hasOwn(manifest, 'selection'))) throw new Error('Invalid packet manifest');
  if (JSON.stringify(actual) !== JSON.stringify(Object.keys(manifest.files).sort())) throw new Error('Unlisted or missing packet file');
  const packetContents = new Map();
  for (const [file, hash] of Object.entries(manifest.files)) {
    relativeFile(file);
    const bytes = readFile(path.join(root, file), { maxBytes: normalizedLimits.maxFileBytes });
    totalBytes += bytes.length;
    if (totalBytes > normalizedLimits.maxTotalBytes) throw new Error('Packet exceeds total byte limit');
    if (!/^[a-f0-9]{64}$/.test(hash) || hashBytes(bytes) !== hash) throw new Error('Packet content changed');
    packetContents.set(file, bytes);
  }
  const inventory = selectableCaseIds(manifest.id);
  if (manifest.version === 3 || (inventory && !matchesCommittedFullPacket(manifest, packetContents))) {
    if (!inventory) throw new Error('Unsupported selected packet');
    let actual;
    if (manifest.id === 'design-route-regression') {
      actual = [...packetContents.get('request.md').toString('utf8').matchAll(/^([1-9][0-9]*)\. .+$/gm)].map(match => match[1]);
    } else {
      const bytes = packetContents.get('artifacts/briefs.json');
      if (!bytes) throw new Error('Selected packet is missing briefs');
      const briefs = JSON.parse(bytes);
      if (!Array.isArray(briefs) || briefs.some(item => !item || Object.keys(item).sort().join(',') !== 'id,request' || typeof item.request !== 'string' || !item.request.trim())) throw new Error('Invalid selected briefs');
      actual = briefs.map(item => item.id);
    }
    if (!actual.length || new Set(actual).size !== actual.length || actual.some(id => !inventory.includes(id))) throw new Error('Invalid packet case inventory');
    if (manifest.version === 3) {
      if (!manifest.selection || Object.keys(manifest.selection).join(',') !== 'caseIds' || !Array.isArray(manifest.selection.caseIds) || JSON.stringify(manifest.selection.caseIds) !== JSON.stringify(actual)) throw new Error('Packet selection does not match payload');
      verifyCommittedSelection(manifest, packetContents, actual);
    } else if (actual.length < inventory.length) {
      // Detect pre-selection-metadata packets without modifying their historical bytes.
      verifyCommittedSelection(manifest, packetContents, actual);
      Object.defineProperty(manifest, 'selection', { value: { caseIds: actual }, enumerable: false });
    }
  }
  if (validV1) return manifest;
  return manifest;
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    const [mode, source, output, ...args] = process.argv.slice(2);
    if (mode === 'verify' && source && !output) console.log(JSON.stringify(verifyPacket(path.resolve(source))));
    else if (mode === 'build' && source && output) {
      if (args.length % 2 || args.some((arg, index) => index % 2 === 0 && arg !== '--case')) throw new Error('Expected repeated --case ID options');
      const caseIds = args.length ? args.filter((_, index) => index % 2 === 1) : undefined;
      console.log(JSON.stringify(buildPacket(path.resolve(source), path.resolve(output), execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(), { caseIds })));
    } else throw new Error('Usage: build-eval-packet.mjs build CASE OUTPUT [--case ID ...] | verify OUTPUT');
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
