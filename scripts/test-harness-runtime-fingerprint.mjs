import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { VALIDATION_FILES, validationFingerprint, compatibleValidationRuntime } from './harness-runtime-fingerprint.mjs';
const root = fs.mkdtempSync('/private/tmp/harness-fingerprint-');
try {
  const installed = path.join(root, 'node_modules/@mehul0810/agent-harness');
  for (const file of VALIDATION_FILES) { fs.mkdirSync(path.dirname(path.join(installed, file)), { recursive: true }); fs.writeFileSync(path.join(installed, file), file); }
  const from = 'a'.repeat(40), to = 'b'.repeat(40);
  const receipt = { fromRevision: from, toRevision: to, validationSha256: validationFingerprint(installed), evidencePointer: 'synthetic:test' };
  const input = { root, testedPin: from, baseline: { harnessContract: 'cli-validation-v1' }, evidence: { runtime: { harnessRevision: from } }, manifest: { harnessRevision: to, harnessCompatibility: [receipt] } };
  assert.equal(compatibleValidationRuntime(input), true);
  for (const change of [ { testedPin: to }, { baseline: {} }, { manifest: { ...input.manifest, harnessCompatibility: [receipt, receipt] } }, { manifest: { ...input.manifest, harnessCompatibility: [{ ...receipt, evidencePointer: '' }] } }, { manifest: { ...input.manifest, harnessRevision: from } } ]) assert.equal(compatibleValidationRuntime({ ...input, ...change }), false);
  fs.writeFileSync(path.join(installed, 'src/continuity.js'), 'unrelated additive API');
  assert.equal(compatibleValidationRuntime(input), true);
  for (const file of VALIDATION_FILES) {
    fs.appendFileSync(path.join(installed, file), 'changed');
    assert.equal(compatibleValidationRuntime(input), false);
    fs.writeFileSync(path.join(installed, file), file);
  }
  fs.unlinkSync(path.join(installed, 'src/validate.js'));
  assert.equal(compatibleValidationRuntime(input), false);
  console.log('PASS: exact dependency compatibility, unknown contracts, duplicates, wrong pins, missing and changed dependencies');
} finally { fs.rmSync(root, { recursive: true, force: true }); }
