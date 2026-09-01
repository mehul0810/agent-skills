import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const MAX_PROOF_EVIDENCE_BYTES = 100 * 1024 * 1024;

function isInside(root, target) {
  const relative = path.relative(root, target);
  return relative === "" || (!relative.startsWith(`..${path.sep}`) && relative !== "..");
}

function sha256File(filePath) {
  const hash = crypto.createHash("sha256");
  const descriptor = fs.openSync(filePath, "r");
  const buffer = Buffer.allocUnsafe(64 * 1024);
  try {
    let bytesRead;
    do {
      bytesRead = fs.readSync(descriptor, buffer, 0, buffer.length, null);
      if (bytesRead > 0) hash.update(buffer.subarray(0, bytesRead));
    } while (bytesRead > 0);
  } finally {
    fs.closeSync(descriptor);
  }
  return `sha256:${hash.digest("hex")}`;
}

export function collectProofEvidence(value, pointer = "proof", output = []) {
  if (!value || typeof value !== "object") return output;
  if (
    !Array.isArray(value) &&
    Object.hasOwn(value, "kind") &&
    Object.hasOwn(value, "locator") &&
    Object.hasOwn(value, "fingerprint")
  ) {
    output.push([pointer, value]);
  }
  for (const [key, child] of Object.entries(value)) {
    if (child && typeof child === "object") {
      collectProofEvidence(child, `${pointer}.${key}`, output);
    }
  }
  return output;
}

export function resolveProofEvidenceFile(locator, evidenceRoot = process.cwd()) {
  if (/^https?:\/\//i.test(locator)) {
    return { error: "must be downloaded to a local verifiable artifact" };
  }
  if (path.isAbsolute(locator)) {
    return { error: "must be relative to the declared evidence root" };
  }

  let canonicalRoot;
  try {
    canonicalRoot = fs.realpathSync(evidenceRoot);
  } catch (error) {
    return { error: `declared evidence root is unavailable: ${error.message}` };
  }

  const resolved = path.resolve(canonicalRoot, locator);
  if (!isInside(canonicalRoot, resolved)) {
    return { error: "must remain inside the declared evidence root" };
  }
  if (!fs.existsSync(resolved) || !fs.statSync(resolved).isFile()) {
    return { error: `does not resolve to a file: ${locator}` };
  }

  const canonicalFile = fs.realpathSync(resolved);
  if (!isInside(canonicalRoot, canonicalFile)) {
    return { error: "must not escape the declared evidence root through a symlink" };
  }
  if (fs.statSync(canonicalFile).size > MAX_PROOF_EVIDENCE_BYTES) {
    return { error: "exceeds the 100 MiB verification limit" };
  }
  return { path: canonicalFile };
}

export function verifyProofEvidenceFiles(
  value,
  { evidenceRoot = process.cwd(), pointer = "proof" } = {},
) {
  const errors = [];
  const checked = new Set();
  for (const [evidencePointer, evidence] of collectProofEvidence(value, pointer)) {
    const key = `${evidence.locator}\0${evidence.fingerprint}`;
    if (checked.has(key)) continue;
    checked.add(key);
    const resolved = resolveProofEvidenceFile(evidence.locator, evidenceRoot);
    if (resolved.error) {
      errors.push(`${evidencePointer}.locator ${resolved.error}`);
      continue;
    }
    if (sha256File(resolved.path) !== evidence.fingerprint) {
      errors.push(`${evidencePointer}.fingerprint does not match evidence bytes: ${evidence.locator}`);
    }
  }
  return errors;
}

export function isProofCliEntrypoint(moduleUrl, argumentPath = process.argv[1]) {
  if (!argumentPath) return false;
  try {
    return fs.realpathSync(fileURLToPath(moduleUrl)) === fs.realpathSync(argumentPath);
  } catch {
    return false;
  }
}
