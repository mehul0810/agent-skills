#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const schemaPath = path.join(root, "shared/schemas/wordpress-visual-proof.schema.json");
const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
const version = schema.properties?.schemaVersion?.const;
const sources = [
  "shared/references/design-intelligence-routing.md",
  "shared/references/visual-to-wordpress-implementation.md",
  "wp-expert/scripts/fse-design-map.sh",
  "UPGRADE.md",
];
const errors = [];

if (!Number.isInteger(version) || version < 1) {
  errors.push("visual proof schema must declare an integer schemaVersion const");
}

for (const relativePath of sources) {
  const content = fs.readFileSync(path.join(root, relativePath), "utf8");
  const matches = [...content.matchAll(/(?:visual[- ]proof|WordPress Visual Proof Schema)[^\n]*?v(\d+)/gi)];
  for (const match of matches) {
    if (Number(match[1]) !== version) {
      errors.push(`${relativePath}: visual proof v${match[1]} disagrees with schema v${version}`);
    }
  }
}

if (errors.length > 0) {
  console.error(errors.map((error) => `ERROR: ${error}`).join("\n"));
  process.exit(1);
}

console.log(`contract integrity audit passed: visual proof schema v${version}`);
