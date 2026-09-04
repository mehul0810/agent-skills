#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const telemetryContractStart = Date.parse("2026-09-04T00:00:00.000Z");
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
  const run = JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), "utf8"));
  if (Date.parse(run.startedAt) >= telemetryContractStart) {
    const availability = run.metrics?.host_telemetry_available;
    if (![0, 1].includes(availability)) {
      console.error(`${relativePath}: host_telemetry_available must be 0 or 1`);
      process.exit(1);
    }
    if (!Number.isInteger(run.durationMs) || run.durationMs <= 0) {
      console.error(`${relativePath}: durationMs must be measured and greater than zero`);
      process.exit(1);
    }
    if (
      availability === 1 &&
      !["input_tokens", "cached_input_tokens", "output_tokens", "context_tokens_peak", "tool_calls", "retry_count"]
        .some((name) => Number.isFinite(run.metrics?.[name]))
    ) {
      console.error(`${relativePath}: available host telemetry must include at least one portable metric`);
      process.exit(1);
    }
  }
}

console.log(`validated ${records.length} discovered behavior run record(s)`);
