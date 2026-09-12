#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

if (Number(process.versions.node.split('.')[0]) !== 24) {
  console.error(`Node 24 required by package.json/.nvmrc; found ${process.versions.node}. Activate the repository runtime before validation.`);
  process.exit(1);
}

const cwd = fileURLToPath(new URL('..', import.meta.url));
// The reference gate owns domain audits; do not rerun them in this aggregate.
const checks = [
  ['Diff', 'git', ['diff', '--check']],
  ['Continuity hook regression', 'node', ['scripts/test-continuity-hook.mjs']],
  ['Harness dependency compatibility', 'node', ['scripts/test-harness-runtime-fingerprint.mjs']],
  ['Agent profiles', 'python3', ['scripts/validate-agent-profiles.py']],
  ['Agent profile rejection regression', 'python3', ['-O', 'scripts/test-agent-profiles.py']],
  ['References and domain audits', 'bash', ['scripts/validate-references.sh']],
  ['Example record', 'npm', ['run', 'run-record:example']],
  ['Behavior records', 'node', ['scripts/validate-behavior-run-records.mjs']],
  ['Evidence validator regression', 'node', ['scripts/behavior-evidence-audit.mjs', '--self-test']],
  ['Quality validator regression', 'node', ['wp-quality-reviewer/scripts/validate-review-report.mjs', '--self-test']],
  ['Install links', 'bash', ['scripts/install-links-smoke.sh']],
];
let failed = false;
for (const [name, command, args] of checks) {
  const start = performance.now();
  const result = spawnSync(command, args, { cwd, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
  const pass = result.status === 0 && !result.error;
  console.log(`${pass ? 'PASS' : 'FAIL'} ${name} (${Math.round(performance.now() - start)} ms)`);
  if (!pass) {
    failed = true;
    process.stderr.write(result.stdout || '');
    process.stderr.write(result.stderr || '');
    if (result.error) console.error(result.error.message);
  } else {
    const warnings = `${result.stdout}\n${result.stderr}`.split('\n').filter(line => /WARNING|low headroom/.test(line));
    for (const warning of warnings) console.log(warning);
  }
}
process.exitCode = failed ? 1 : 0;
