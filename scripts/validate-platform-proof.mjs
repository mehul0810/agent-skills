#!/usr/bin/env node
// Receipt integrity only. This cannot establish the truth or quality of a capture.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { inflateSync } from 'node:zlib';
import { pathToFileURL } from 'node:url';

const runtimes = { web: ['browser'], macos: ['native_macos'], game: ['browser', 'game_engine'], other: ['custom'] };
const statuses = new Set(['pass', 'fail', 'blocked', 'out_of_scope']);
const kinds = new Set(['behavior', 'appearance', 'native_runtime', 'performance', 'artifact']);
const artifactKinds = new Set(['screenshot', 'test_log', 'runtime_log']);
const MAX_BYTES = 64 * 1024 * 1024;
const nonempty = value => typeof value === 'string' && value.trim().length > 0;

function safeArtifact(root, relative) {
  if (!nonempty(relative) || path.isAbsolute(relative) || relative.includes('\\') || relative.split('/').some(part => !part || part === '.' || part === '..')) throw new Error('artifact path must be relative without traversal');
  let current = root;
  for (const part of relative.split('/')) {
    current = path.join(current, part);
    if (fs.lstatSync(current).isSymbolicLink()) throw new Error('symlink artifact paths are not permitted');
  }
  // Open once without following a last-component link. Reject path/descriptor drift
  // before reading; callers must still supply an immutable trusted evidence root.
  const fd = fs.openSync(current, fs.constants.O_RDONLY | fs.constants.O_NOFOLLOW | fs.constants.O_NONBLOCK);
  try {
    const stat = fs.fstatSync(fd);
    if (!stat.isFile()) throw new Error('artifact must be a regular file');
    if (stat.size < 1 || stat.size > MAX_BYTES) throw new Error('artifact size must be 1..64 MiB');
    const resolved = fs.realpathSync(current);
    const named = fs.statSync(current);
    if (resolved !== current || named.dev !== stat.dev || named.ino !== stat.ino) throw new Error('artifact path changed during validation');
    const bytes = Buffer.alloc(stat.size + 1);
    let used = 0;
    while (used < bytes.length) { const count = fs.readSync(fd, bytes, used, bytes.length - used, used); if (!count) break; used += count; }
    if (used !== stat.size) throw new Error('artifact size changed during validation');
    return bytes.subarray(0, used);
  } finally { fs.closeSync(fd); }
}

function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) { crc ^= byte; for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0); }
  return (crc ^ 0xffffffff) >>> 0;
}

function validatePng(bytes) {
  if (!bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) throw new Error('screenshot requires PNG evidence');
  let offset = 8, header, ended = false, idatEnded = false;
  const data = [];
  while (offset < bytes.length) {
    if (offset + 12 > bytes.length) throw new Error('truncated PNG chunk');
    const length = bytes.readUInt32BE(offset);
    if (length > MAX_BYTES || offset + 12 + length > bytes.length) throw new Error('invalid PNG chunk length');
    const type = bytes.toString('ascii', offset + 4, offset + 8);
    if (!/^[A-Za-z]{2}[A-Z][A-Za-z]$/.test(type)) throw new Error('invalid PNG chunk type');
    const payload = bytes.subarray(offset + 8, offset + 8 + length);
    if (crc32(bytes.subarray(offset + 4, offset + 8 + length)) !== bytes.readUInt32BE(offset + 8 + length)) throw new Error('invalid PNG CRC');
    if (!header && type !== 'IHDR') throw new Error('PNG must start with IHDR');
    if (type === 'IHDR') {
      if (header || length !== 13) throw new Error('invalid PNG header');
      const width = payload.readUInt32BE(0), height = payload.readUInt32BE(4);
      const channels = { 0: 1, 2: 3, 4: 2, 6: 4 }[payload[9]];
      if (!width || !height || payload[8] !== 8 || !channels || payload[10] !== 0 || payload[11] !== 0 || payload[12] !== 0) throw new Error('requires non-interlaced 8-bit grayscale/RGB/RGBA PNG');
      const row = width * channels + 1, size = row * height;
      if (size > MAX_BYTES) throw new Error('PNG decoded data exceeds 64 MiB');
      header = { row, size, height };
    } else if (type === 'IDAT') {
      if (idatEnded) throw new Error('non-contiguous PNG image data');
      data.push(payload);
    } else if (type === 'IEND') {
      if (length || !data.length) throw new Error('invalid PNG end');
      ended = true; offset += 12; break;
    } else {
      if (data.length) idatEnded = true;
      if (!['PLTE'].includes(type) && /^[A-Z]/.test(type)) throw new Error('unknown critical PNG chunk');
    }
    offset += length + 12;
  }
  if (!ended || offset !== bytes.length) throw new Error('incomplete PNG or trailing data');
  const decoded = inflateSync(Buffer.concat(data), { maxOutputLength: MAX_BYTES });
  if (decoded.length !== header.size) throw new Error('PNG scanline size mismatch');
  for (let row = 0; row < header.height; row++) if (decoded[row * header.row] > 4) throw new Error('invalid PNG scanline filter');
}

export function validatePlatformProof(record, evidenceRoot) {
  const errors = [];
  if (!record || typeof record !== 'object' || Array.isArray(record)) return { ok: false, errors: ['record must be an object'] };
  if (record.schemaVersion !== 1) errors.push('schemaVersion must be 1');
  if (typeof record.platform !== 'string' || !Object.hasOwn(runtimes, record.platform)) errors.push('platform must be web, macos, game or other; WordPress retains its adapter');
  if (!['explore', 'build', 'verify', 'ship'].includes(record.workflow_stage)) errors.push('workflow_stage is invalid');
  if (!nonempty(record.target?.id) || !nonempty(record.target?.revision)) errors.push('exact target id and revision are required');
  if (!nonempty(record.environment?.id) || !nonempty(record.environment?.runtime)) errors.push('environment id and actual runtime are required');
  if (!['independent', 'self'].includes(record.observer?.kind)) errors.push('observer kind is required');
  if (typeof record.observer?.contaminated !== 'boolean') errors.push('observer contamination state is required');
  if (record.observer?.kind === 'independent' && record.observer?.contaminated !== false) errors.push('contaminated observation cannot claim independence');
  let root;
  try { root = fs.realpathSync(evidenceRoot); if (!fs.statSync(root).isDirectory()) throw new Error('not a directory'); }
  catch { errors.push('evidence root must be an existing directory'); }
  const artifacts = new Map();
  if (!Array.isArray(record.artifacts)) errors.push('artifacts must be an array');
  for (const artifact of Array.isArray(record.artifacts) ? record.artifacts : []) {
    if (!artifact || !nonempty(artifact.id) || artifacts.has(artifact.id)) { errors.push('artifact ids must be unique and nonempty'); continue; }
    artifacts.set(artifact.id, artifact);
    if (!artifactKinds.has(artifact.kind)) errors.push(`artifact ${artifact.id}: invalid kind`);
    if (typeof artifact.sha256 !== 'string' || !/^[a-f0-9]{64}$/.test(artifact.sha256)) errors.push(`artifact ${artifact.id}: sha256 required`);
    if (root) try {
      const bytes = safeArtifact(root, artifact.path);
      if (!bytes.length) throw new Error('empty artifact');
      if (crypto.createHash('sha256').update(bytes).digest('hex') !== artifact.sha256) throw new Error('hash mismatch');
      if (artifact.kind === 'screenshot') validatePng(bytes);
    } catch (error) { errors.push(`artifact ${artifact.id}: ${error.message}`); }
  }
  const clauses = Array.isArray(record.clauses) ? record.clauses : [];
  if (!clauses.length) errors.push('at least one explicit clause is required');
  const ids = new Set();
  for (const clause of clauses) {
    if (!clause || !nonempty(clause.id) || ids.has(clause.id)) { errors.push('clause ids must be unique and nonempty'); continue; }
    ids.add(clause.id);
    if (!kinds.has(clause.kind) || !statuses.has(clause.status)) errors.push(`clause ${clause.id}: invalid kind/status`);
    if (!nonempty(clause.observation)) errors.push(`clause ${clause.id}: observation or reason required`);
    const refs = Array.isArray(clause.evidence) ? clause.evidence : [];
    if (!Array.isArray(clause.evidence)) errors.push(`clause ${clause.id}: evidence must be an array`);
    if (refs.some(id => !artifacts.has(id))) errors.push(`clause ${clause.id}: unknown evidence`);
    if (clause.status === 'pass') {
      if (!refs.length) errors.push(`clause ${clause.id}: pass requires artifact evidence`);
      if (['behavior', 'appearance', 'native_runtime', 'performance'].includes(clause.kind) && !(typeof record.platform === 'string' && Object.hasOwn(runtimes, record.platform) && runtimes[record.platform].includes(record.environment?.runtime))) errors.push(`clause ${clause.id}: runtime does not match platform`);
      if (clause.kind === 'native_runtime' && (record.platform !== 'macos' || record.environment?.runtime !== 'native_macos')) errors.push(`clause ${clause.id}: native runtime proof requires macOS app runtime`);
      if (clause.kind === 'appearance' && !refs.some(id => artifacts.get(id)?.kind === 'screenshot')) errors.push(`clause ${clause.id}: appearance requires visual evidence`);
    }
  }
  return { ok: errors.length === 0, errors, summary: { passed: clauses.filter(c => c?.status === 'pass').length, failed: clauses.filter(c => c?.status === 'fail').length, blocked: clauses.filter(c => c?.status === 'blocked').length, outOfScope: clauses.filter(c => c?.status === 'out_of_scope').length }, scope: 'receipt integrity only; not artifact quality, authenticated execution or publication authorization' };
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const [file, root, ...extra] = process.argv.slice(2);
  if (!file || !root || extra.length) { console.error('Usage: node scripts/validate-platform-proof.mjs <record.json> <evidence-root>'); process.exitCode = 2; }
  else try { const result = validatePlatformProof(JSON.parse(fs.readFileSync(file, 'utf8')), root); console.log(JSON.stringify(result, null, 2)); process.exitCode = result.ok ? 0 : 1; }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
