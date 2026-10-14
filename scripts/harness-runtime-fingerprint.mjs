import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

// Closed dependency set for the installed CLI validation path, not every harness API.
export const VALIDATION_FILES = ['package.json', 'bin/agent-harness.js', 'src/cli.js', 'src/init.js', 'src/validate.js', 'src/contracts.js', 'src/constants.js', 'src/errors.js', 'src/path-safety.js', 'schemas/config.schema.json', 'schemas/run-record.schema.json'];
const ADDITIONAL_VALIDATION_FILES = ['src/bounded-read.js', 'src/init-templates.js'];

export function validationFingerprint(root, read = file => {
  const resolved = path.resolve(root, file);
  if (!fs.lstatSync(resolved).isFile() || fs.realpathSync(resolved) !== resolved) throw new Error('Unsafe validation dependency');
  return fs.readFileSync(resolved);
}) {
  const contents = new Map(VALIDATION_FILES.map(file => [file, Buffer.from(read(file))]));
  // Older pins lack these modules; preserve their original fingerprint bytes.
  for (const file of ADDITIONAL_VALIDATION_FILES) {
    try { contents.set(file, Buffer.from(read(file))); }
    catch (error) { if (error.code !== 'ENOENT') throw error; }
  }
  for (const [file, bytes] of contents) {
    if (!file.endsWith('.js')) continue;
    const source = bytes.toString('utf8');
    const imports = [];
    for (const match of source.matchAll(/\b(?:import|export)\s*(?:[^;'"()]*?\bfrom\s*)?(['"])([^'"]+)\1/gu)) {
      if (match[0].includes('/*') || match[0].includes('//')) throw new Error('Commented validation dependency requires an explicit contract');
      imports.push([match.index, match.index + match[0].length]);
      const specifier = match[2];
      if (specifier.startsWith('node:')) continue;
      const dependency = path.posix.normalize(path.posix.join(path.posix.dirname(file), specifier));
      if (!specifier.startsWith('.') || !contents.has(dependency)) throw new Error(`Unfingerprinted validation dependency: ${specifier}`);
    }
    for (const match of source.matchAll(/\bimport\b/gu)) {
      if (imports.some(([start, end]) => match.index >= start && match.index < end)) continue;
      if (/^import\s*\.\s*meta\b/u.test(source.slice(match.index))) continue;
      throw new Error('Unrecognized validation import requires an explicit contract');
    }
    for (const match of source.matchAll(/\bexport\b/gu)) {
      if (imports.some(([start, end]) => match.index >= start && match.index < end)) continue;
      const declaration = source.slice(match.index);
      if (/^export\s+(?:default|(?:async\s+)?function|class|const|let|var)\b/u.test(declaration)) continue;
      if (/^export\s*\{[^'"`;{}]*\}\s*(?:;|$)/u.test(declaration)) continue;
      throw new Error('Unrecognized validation export requires an explicit contract');
    }
  }
  const digest = crypto.createHash('sha256');
  for (const file of [...contents.keys()].sort()) {
    const bytes = contents.get(file);
    digest.update(`${file}\0${bytes.length}\0`); digest.update(bytes); digest.update('\0');
  }
  return digest.digest('hex');
}

export function compatibleValidationRuntime({ root, baseline, evidence, manifest, testedPin }) {
  if (baseline.harnessContract !== 'cli-validation-v1' || evidence.runtime?.harnessRevision !== testedPin) return false;
  const receipts = manifest.harnessCompatibility;
  if (!Array.isArray(receipts)) return false;
  const matches = receipts.filter(r => r?.fromRevision === testedPin && r?.toRevision === manifest.harnessRevision);
  if (matches.length !== 1) return false;
  const receipt = matches[0];
  if (Object.keys(receipt).sort().join(',') !== 'evidencePointer,fromRevision,toRevision,validationSha256'
    || !/^[a-f0-9]{40}$/.test(receipt.fromRevision) || !/^[a-f0-9]{40}$/.test(receipt.toRevision)
    || !/^[a-f0-9]{64}$/.test(receipt.validationSha256) || typeof receipt.evidencePointer !== 'string' || !receipt.evidencePointer.trim()) return false;
  try { return validationFingerprint(path.join(root, 'node_modules/@mehul0810/agent-harness')) === receipt.validationSha256; }
  catch { return false; }
}
