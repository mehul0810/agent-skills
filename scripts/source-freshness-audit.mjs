#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(
  fs.readFileSync(path.join(root, "shared/source-freshness.json"), "utf8"),
);
const today = Date.now();
const ids = new Set();
const errors = [];

if (manifest.schemaVersion !== 1 || !Array.isArray(manifest.sources)) {
  errors.push("source freshness manifest must use schemaVersion 1 and a sources array");
}

for (const [index, source] of (manifest.sources ?? []).entries()) {
  const label = source.id || `sources[${index}]`;
  if (!source.id || ids.has(source.id)) errors.push(`${label}: id must be unique`);
  ids.add(source.id);
  try {
    const url = new URL(source.url);
    if (url.protocol !== "https:") errors.push(`${label}: source URL must use HTTPS`);
  } catch {
    errors.push(`${label}: source URL is invalid`);
  }
  const checkedAt = Date.parse(`${source.checkedAt}T00:00:00Z`);
  if (!Number.isFinite(checkedAt)) errors.push(`${label}: checkedAt is invalid`);
  if (Number.isFinite(checkedAt) && checkedAt > today + 86_400_000) {
    errors.push(`${label}: checkedAt cannot be in the future`);
  }
  if (!Number.isInteger(source.maxAgeDays) || source.maxAgeDays < 1) {
    errors.push(`${label}: maxAgeDays must be a positive integer`);
  } else if (Number.isFinite(checkedAt) && today - checkedAt > source.maxAgeDays * 86_400_000) {
    errors.push(`${label}: source is stale; recheck ${source.url}`);
  }
  if (
    typeof source.owner !== "string" || source.owner.trim() === "" ||
    typeof source.recheckOn !== "string" || source.recheckOn.trim() === "" ||
    !Array.isArray(source.consumers) || source.consumers.length === 0 ||
    source.consumers.some((consumer) => typeof consumer !== "string" || consumer.trim() === "") ||
    new Set(source.consumers).size !== source.consumers.length
  ) {
    errors.push(`${label}: owner/recheckOn and unique non-empty consumers are required`);
  }
}

if (errors.length > 0) {
  console.error(errors.map((error) => `ERROR: ${error}`).join("\n"));
  process.exit(1);
}

console.log(`source freshness audit passed: ${manifest.sources.length} selected source(s)`);
