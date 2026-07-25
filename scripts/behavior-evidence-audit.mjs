#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = path.join(repoRoot, "skill-evals/behavior-baselines.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const printOnly = process.argv.includes("--print");
const errors = [];

function fingerprint(files) {
  const hash = crypto.createHash("sha256");
  for (const relativePath of [...files].sort()) {
    const absolutePath = path.join(repoRoot, relativePath);
    if (!fs.existsSync(absolutePath)) {
      errors.push(`missing behavior source: ${relativePath}`);
      continue;
    }
    const content = fs.readFileSync(absolutePath);
    hash.update(relativePath);
    hash.update("\0");
    hash.update(String(content.length));
    hash.update("\0");
    hash.update(content);
    hash.update("\0");
  }
  return hash.digest("hex");
}

if (manifest.schemaVersion !== 1 || !Array.isArray(manifest.baselines)) {
  console.error("behavior baseline manifest must use schemaVersion 1 and baselines[]");
  process.exit(1);
}

for (const baseline of manifest.baselines) {
  if (!baseline.name || !Array.isArray(baseline.files) || baseline.files.length === 0) {
    errors.push("each behavior baseline needs a name and files");
    continue;
  }
  const actual = fingerprint(baseline.files);
  if (printOnly) {
    console.log(`${baseline.name} ${actual}`);
    continue;
  }
  if (baseline.sha256 !== actual) {
    errors.push(
      `${baseline.name} behavior changed; run a fresh-agent scenario and update its sanitized record and fingerprint`,
    );
  }
  if (!Array.isArray(baseline.runRecords) || baseline.runRecords.length === 0) {
    errors.push(`${baseline.name} has no sanitized run record`);
    continue;
  }
  for (const relativePath of baseline.runRecords) {
    const absolutePath = path.join(repoRoot, relativePath);
    if (!fs.existsSync(absolutePath)) {
      errors.push(`${baseline.name} run record is missing: ${relativePath}`);
      continue;
    }
    const record = JSON.parse(fs.readFileSync(absolutePath, "utf8"));
    if (record.result !== "succeeded" || record.checks?.some((check) => check.result !== "pass")) {
      errors.push(`${baseline.name} run record is not a clean pass: ${relativePath}`);
    }
  }
}

if (printOnly) {
  process.exit(errors.length === 0 ? 0 : 1);
}

if (errors.length > 0) {
  for (const error of errors) {
    console.error(`ERROR: ${error}`);
  }
  process.exit(1);
}

console.log(`behavior evidence audit passed: ${manifest.baselines.length} baseline(s)`);
