import fs from 'node:fs';
import path from 'node:path';

export const DEFAULT_FILE_LIMITS = Object.freeze({
  maxFileBytes: 32 * 1024 * 1024,
  maxTotalBytes: 128 * 1024 * 1024,
  maxEntries: 512,
  maxDepth: 12,
});

function byteLimit(value, fallback) {
  if (value === undefined) return fallback;
  if (!Number.isSafeInteger(value) || value < 0) throw new Error('Invalid file size limit');
  return value;
}

export function normalizeFileLimits(limits = {}) {
  if (!limits || typeof limits !== 'object' || Array.isArray(limits)) throw new Error('Invalid file limits');
  const allowed = new Set(['maxFileBytes', 'maxTotalBytes', 'maxEntries', 'maxDepth']);
  if (Object.keys(limits).some(key => !allowed.has(key))) throw new Error('Unknown file limit');
  return {
    maxFileBytes: byteLimit(limits.maxFileBytes, DEFAULT_FILE_LIMITS.maxFileBytes),
    maxTotalBytes: byteLimit(limits.maxTotalBytes, DEFAULT_FILE_LIMITS.maxTotalBytes),
    maxEntries: byteLimit(limits.maxEntries, DEFAULT_FILE_LIMITS.maxEntries),
    maxDepth: byteLimit(limits.maxDepth, DEFAULT_FILE_LIMITS.maxDepth),
  };
}

export function safeReadFile(filePath, { maxBytes = DEFAULT_FILE_LIMITS.maxFileBytes } = {}) {
  maxBytes = byteLimit(maxBytes, DEFAULT_FILE_LIMITS.maxFileBytes);
  const before = fs.lstatSync(filePath);
  if (before.isSymbolicLink() || !before.isFile()) throw new Error('Expected a regular non-symlink file');

  const noFollow = fs.constants.O_NOFOLLOW || 0;
  const nonBlock = fs.constants.O_NONBLOCK || 0;
  const fd = fs.openSync(filePath, fs.constants.O_RDONLY | noFollow | nonBlock);
  try {
    const opened = fs.fstatSync(fd);
    if (!opened.isFile() || opened.dev !== before.dev || opened.ino !== before.ino) {
      throw new Error('File changed while opening');
    }
    if (opened.size > maxBytes) throw new Error('File exceeds byte limit');

    const chunks = [];
    let total = 0;
    const chunk = Buffer.allocUnsafe(Math.min(64 * 1024, maxBytes + 1));
    while (true) {
      const remaining = maxBytes + 1 - total;
      if (remaining <= 0) throw new Error('File exceeds byte limit');
      const count = fs.readSync(fd, chunk, 0, Math.min(chunk.length, remaining), null);
      if (count === 0) break;
      total += count;
      if (total > maxBytes) throw new Error('File exceeds byte limit');
      chunks.push(Buffer.from(chunk.subarray(0, count)));
    }
    return Buffer.concat(chunks, total);
  } finally {
    fs.closeSync(fd);
  }
}

export function listRegularFiles(root, {
  maxEntries = DEFAULT_FILE_LIMITS.maxEntries,
  maxDepth = DEFAULT_FILE_LIMITS.maxDepth,
} = {}) {
  maxEntries = byteLimit(maxEntries, DEFAULT_FILE_LIMITS.maxEntries);
  maxDepth = byteLimit(maxDepth, DEFAULT_FILE_LIMITS.maxDepth);
  const canonicalRoot = fs.realpathSync(root);
  const rootStat = fs.lstatSync(canonicalRoot);
  if (!rootStat.isDirectory() || rootStat.isSymbolicLink()) throw new Error('Expected a regular directory');

  const files = [];
  let entries = 0;
  const visit = (directory, depth) => {
    const dirStat = fs.lstatSync(directory);
    if (dirStat.isSymbolicLink() || !dirStat.isDirectory()) throw new Error('Packet directory changed while walking');
    const handle = fs.opendirSync(directory);
    try {
      let entry;
      while ((entry = handle.readSync()) !== null) {
        entries += 1;
        if (entries > maxEntries) throw new Error('Directory exceeds entry limit');
        const absolute = path.join(directory, entry.name);
        const relativeDepth = depth + 1;
        if (relativeDepth > maxDepth) throw new Error('Directory exceeds depth limit');
        const stat = fs.lstatSync(absolute);
        if (entry.isSymbolicLink() || stat.isSymbolicLink()) throw new Error('Packet symlink');
        if (entry.isDirectory() && stat.isDirectory()) visit(absolute, relativeDepth);
        else if (entry.isFile() && stat.isFile()) files.push(path.relative(canonicalRoot, absolute).split(path.sep).join('/'));
        else throw new Error('Packet contains a non-regular entry');
      }
    } finally {
      handle.closeSync();
    }
  };
  visit(canonicalRoot, 0);
  return files;
}
