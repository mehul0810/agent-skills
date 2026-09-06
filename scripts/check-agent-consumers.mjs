#!/usr/bin/env node
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

// Different pinned revisions are allowed; each consumer must satisfy its own contract.
const roots = process.argv.slice(2);
if (!roots.length) throw new Error('Provide explicit agent repository paths');
let failed = false;
for (const input of roots) {
  const root = resolve(input);
  try {
    const read = name => JSON.parse(readFileSync(resolve(root, name), 'utf8'));
    const pkg = read('package.json');
    const lock = read('package-lock.json');
    const pin = pkg.devDependencies?.['@mehul0810/agent-harness'];
    const installed = lock.packages?.['node_modules/@mehul0810/agent-harness'];
    const revision = pin?.match(/\/archive\/([a-f0-9]{40})\.tar\.gz$/)?.[1];
    if (!revision || installed?.resolved !== pin || !installed.integrity) throw new Error('Harness pin/lock/integrity mismatch');
    const contract = resolve(root, 'contracts/agent-system.compatibility.json');
    if (existsSync(contract) && JSON.parse(readFileSync(contract)).validation.harness_commit !== revision) throw new Error('Compatibility contract disagrees with lock');
    const result = spawnSync(process.execPath, ['node_modules/@mehul0810/agent-harness/bin/agent-harness.js', 'validate', '--config', 'agent-harness.config.json'], { cwd: root, encoding: 'utf8', timeout: 60000 });
    if (result.status !== 0) throw new Error(result.stderr || result.stdout || 'Harness unavailable');
    console.log(`PASS ${pkg.name}: ${revision} consumer contracts valid`);
  } catch (error) {
    failed = true;
    console.error(`FAIL ${root}: ${error.message}`);
  }
}
process.exitCode = failed ? 1 : 0;
