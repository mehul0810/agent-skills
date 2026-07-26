#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const recordsDirectory = path.join(repoRoot, "skill-evals/run-records");
const records = fs
  .readdirSync(recordsDirectory)
  .filter((name) => name.endsWith(".json"))
  .sort();

if (records.length === 0) {
  console.error("no behavior run records found");
  process.exit(1);
}

const executable = path.join(
  repoRoot,
  "node_modules/.bin",
  process.platform === "win32" ? "agent-harness.cmd" : "agent-harness",
);

for (const record of records) {
  const relativePath = `skill-evals/run-records/${record}`;
  const result = spawnSync(executable, ["validate-run", "--file", relativePath], {
    cwd: repoRoot,
    stdio: "inherit",
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

console.log(`validated ${records.length} discovered behavior run record(s)`);
