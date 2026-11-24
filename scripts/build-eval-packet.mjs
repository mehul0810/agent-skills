#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { DEFAULT_FILE_LIMITS, listRegularFiles, normalizeFileLimits, safeReadFile } from './bounded-files.mjs';

const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
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
  const manifest = { version: 2, id: input.id, sourceRevision, files: {} };
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
  const validV2 = manifest.version === 2 && /^[a-f0-9]{40}$/.test(manifest.sourceRevision) && manifest.files && manifest.packetDigest === packetDigest(manifest.files, hashBytes);
  if ((!validV1 && !validV2) || !manifest.files || !Object.hasOwn(manifest.files, 'request.md')) throw new Error('Invalid packet manifest');
  if (JSON.stringify(actual) !== JSON.stringify(Object.keys(manifest.files).sort())) throw new Error('Unlisted or missing packet file');
  for (const [file, hash] of Object.entries(manifest.files)) {
    relativeFile(file);
    const bytes = readFile(path.join(root, file), { maxBytes: normalizedLimits.maxFileBytes });
    totalBytes += bytes.length;
    if (totalBytes > normalizedLimits.maxTotalBytes) throw new Error('Packet exceeds total byte limit');
    if (!/^[a-f0-9]{64}$/.test(hash) || hashBytes(bytes) !== hash) throw new Error('Packet content changed');
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
