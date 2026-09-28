#!/usr/bin/env node
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { validationPython } from './validation-python.mjs';
import { runValidationChecks } from './run-validation-command.mjs';

export function validationChecks(python) {
  // The reference gate owns domain audits; do not rerun them in this aggregate.
  return [
    ['Diff', 'git', ['diff', '--check']],
    ['Validation Python regression', 'node', ['scripts/test-validation-python.mjs']],
    ['Validation process runner regression', 'node', ['scripts/test-validation-runner.mjs']],
    ['Evaluation packet regression', 'node', ['scripts/test-eval-packet.mjs']],
    ['Evaluation feedback lifecycle regression', 'node', ['scripts/test-eval-feedback-loop.mjs']],
    ['Continuity hook regression', 'node', ['scripts/test-continuity-hook.mjs']],
    ['Harness dependency compatibility', 'node', ['scripts/test-harness-runtime-fingerprint.mjs']],
    ['Context bundle regression', 'node', ['scripts/test-context-bundle.mjs']],
    ['Agent profiles', python.executable, ['scripts/validate-agent-profiles.py']],
    ['Agent profile rejection regression', python.executable, ['-O', 'scripts/test-agent-profiles.py']],
    ['References and domain audits', 'bash', ['scripts/validate-references.sh']],
    ['Example record', 'npm', ['run', 'run-record:example']],
    ['Behavior records', 'node', ['scripts/validate-behavior-run-records.mjs']],
    ['Evidence validator regression', 'node', ['scripts/behavior-evidence-audit.mjs', '--self-test']],
    ['Quality validator regression', 'node', ['wp-quality-reviewer/scripts/validate-review-report.mjs', '--self-test']],
    ['Install links', 'bash', ['scripts/install-links-smoke.sh']],
  ];
}

export async function main({ log = console.log, errorLog = console.error } = {}) {
  if (Number(process.versions.node.split('.')[0]) !== 24) {
    errorLog(`Node 24 required by package.json/.nvmrc; found ${process.versions.node}. Activate the repository runtime before validation.`);
    return 1;
  }

  const cwd = fileURLToPath(new URL('..', import.meta.url));
  let python;
  try {
    python = validationPython();
  } catch (error) {
    errorLog(`FAIL Python runtime: ${error.message}`);
    return 1;
  }
  log(`PASS Python runtime: ${JSON.stringify(python.executable)} (${python.version})`);
  const passed = await runValidationChecks(validationChecks(python), { cwd, log, errorLog });
  return passed ? 0 : 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  process.exitCode = await main();
}
