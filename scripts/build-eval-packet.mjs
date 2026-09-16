#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
function relativeFile(value) {
  if (typeof value !== 'string' || !value || path.isAbsolute(value) || value.includes('\\') || value.split('/').some(x => !x || x === '.' || x === '..')) throw new Error('Unsafe artifact path');
  return value;
}
export function buildPacket(caseRoot, output, revision) {
  if (!/^[a-f0-9]{40}$/.test(revision)) throw new Error('Exact source revision required');
  const root = fs.realpathSync(caseRoot);
  const input = JSON.parse(fs.readFileSync(path.join(root, 'input.json')));
  if (Object.keys(input).some(k => !['id', 'request', 'artifacts'].includes(k)) || typeof input.id !== 'string' || !input.id || typeof input.request !== 'string' || !input.request.trim() || !Array.isArray(input.artifacts)) throw new Error('Input permits only id, request and artifacts');
  const files = input.artifacts.map(relativeFile);
  if (new Set(files).size !== files.length) throw new Error('Duplicate artifact');
  const payloads = files.map(file => {
    const source = path.join(root, 'artifacts', file);
    const real = fs.realpathSync(source);
    if (!real.startsWith(path.join(root, 'artifacts') + path.sep) || real !== source || !fs.statSync(real).isFile()) throw new Error('Artifact must be a regular non-symlink file in artifacts/');
    return [file, fs.readFileSync(real)];
  });
  // Exclusive creation avoids overwriting evidence from an earlier run.
  fs.mkdirSync(output);
  const manifest = { version: 1, id: input.id, revision, files: {} };
  const write = (file, bytes) => {
    fs.mkdirSync(path.dirname(path.join(output, file)), { recursive: true });
    fs.writeFileSync(path.join(output, file), bytes, { flag: 'wx' });
    manifest.files[file] = sha(bytes);
  };
  write('request.md', input.request + '\n');
  for (const [file, bytes] of payloads) write('artifacts/' + file, bytes);
  fs.writeFileSync(path.join(output, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n', { flag: 'wx' });
  return manifest;
}
export function verifyPacket(output) {
  const manifest = JSON.parse(fs.readFileSync(path.join(output, 'manifest.json')));
  if (manifest.version !== 1 || !/^[a-f0-9]{40}$/.test(manifest.revision) || !manifest.files || !Object.hasOwn(manifest.files, 'request.md')) throw new Error('Invalid packet manifest');
  const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => {
    if (e.isSymbolicLink()) throw new Error('Packet symlink');
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : [path.relative(output, p).split(path.sep).join('/')];
  });
  const actual = walk(output).filter(x => x !== 'manifest.json').sort();
  if (JSON.stringify(actual) !== JSON.stringify(Object.keys(manifest.files).sort())) throw new Error('Unlisted or missing packet file');
  for (const [file, hash] of Object.entries(manifest.files)) {
    relativeFile(file);
    if (!/^[a-f0-9]{64}$/.test(hash) || sha(fs.readFileSync(path.join(output, file))) !== hash) throw new Error('Packet content changed');
  }
  return manifest;
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    const [mode, source, output] = process.argv.slice(2);
    if (mode === 'verify' && source && !output) console.log(JSON.stringify(verifyPacket(path.resolve(source))));
    else if (mode === 'build' && source && output) console.log(JSON.stringify(buildPacket(path.resolve(source), path.resolve(output), execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim())));
    else throw new Error('Usage: build-eval-packet.mjs build CASE OUTPUT | verify OUTPUT');
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
