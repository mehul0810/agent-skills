import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

// Closed dependency set for the installed CLI validation path, not every harness API.
export const VALIDATION_FILES = ['package.json', 'bin/agent-harness.js', 'src/cli.js', 'src/init.js', 'src/validate.js', 'src/contracts.js', 'src/constants.js', 'src/errors.js', 'src/path-safety.js', 'schemas/config.schema.json', 'schemas/run-record.schema.json'];
export function validationFingerprint(root, read = file => {
  const resolved = path.resolve(root, file);
  if (!fs.lstatSync(resolved).isFile() || fs.realpathSync(resolved) !== resolved) throw new Error('Unsafe validation dependency');
  return fs.readFileSync(resolved);
}) {
  const digest = crypto.createHash('sha256');
  for (const file of [...VALIDATION_FILES].sort()) {
    const bytes = Buffer.from(read(file));
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
