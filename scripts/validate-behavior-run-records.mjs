#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { formatCliResult, validateRunFile } from '@mehul0810/agent-harness';

const telemetryContractStart = Date.parse('2026-09-04T00:00:00.000Z');
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export async function validateBehaviorRecords({
  root = repoRoot,
  directory = path.join(root, 'skill-evals/run-records'),
  validator = validateRunFile,
  readRecord = filePath => JSON.parse(fs.readFileSync(filePath, 'utf8')),
  log = console.log,
  errorLog = console.error,
} = {}) {
  let records;
  try {
    records = fs.readdirSync(directory).filter(name => name.endsWith('.json')).sort();
  } catch (error) {
    errorLog(`behavior run records could not be discovered: ${error.message}`);
    return 1;
  }
  if (records.length === 0) {
    errorLog('no behavior run records found');
    return 1;
  }

  for (const record of records) {
    const relativePath = path.relative(root, path.join(directory, record)).split(path.sep).join('/');
    const result = await validator(relativePath, { cwd: root });
    if (!result.ok) {
      errorLog(formatCliResult({ ...result, json: false }));
      return result.exitCode ?? 1;
    }
    let run;
    try {
      run = readRecord(path.join(root, relativePath));
    } catch (error) {
      errorLog(`${relativePath}: record could not be read after validation: ${error.message}`);
      return 1;
    }
    if (Date.parse(run.startedAt) >= telemetryContractStart) {
      const availability = run.metrics?.host_telemetry_available;
      if (![0, 1].includes(availability)) {
        errorLog(`${relativePath}: host_telemetry_available must be 0 or 1`);
        return 1;
      }
      if (!Number.isInteger(run.durationMs) || run.durationMs <= 0) {
        errorLog(`${relativePath}: durationMs must be measured and greater than zero`);
        return 1;
      }
      if (
        availability === 1 &&
        !['input_tokens', 'cached_input_tokens', 'output_tokens', 'context_tokens_peak', 'tool_calls', 'retry_count']
          .some(name => Number.isFinite(run.metrics?.[name]))
      ) {
        errorLog(`${relativePath}: available host telemetry must include at least one portable metric`);
        return 1;
      }
    }
  }

  log(`validated ${records.length} discovered behavior run record(s)`);
  return 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  process.exitCode = await validateBehaviorRecords();
}
