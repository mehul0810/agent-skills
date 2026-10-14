import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { VALIDATION_FILES, validationFingerprint, compatibleValidationRuntime } from './harness-runtime-fingerprint.mjs';
const root = fs.mkdtempSync(path.join(fs.realpathSync(os.tmpdir()), 'harness-fingerprint-'));
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
  const originalFingerprint = validationFingerprint(installed);
  const legacyDigest = (await import('node:crypto')).createHash('sha256');
  for (const file of [...VALIDATION_FILES].sort()) {
    const bytes = fs.readFileSync(path.join(installed, file));
    legacyDigest.update(`${file}\0${bytes.length}\0`); legacyDigest.update(bytes); legacyDigest.update('\0');
  }
  assert.equal(originalFingerprint, legacyDigest.digest('hex'), 'unchanged older pins retain their historical digest');
  const validationPath = path.join(installed, 'src/validate.js');
  const readerPath = path.join(installed, 'src/bounded-read.js');
  fs.writeFileSync(validationPath, 'import { limit } from "./bounded-read.js";\n');
  assert.equal(compatibleValidationRuntime(input), false, 'a missing imported module cannot reuse compatibility');
  fs.writeFileSync(readerPath, 'export const limit = 32;\n');
  receipt.validationSha256 = validationFingerprint(installed);
  assert.equal(compatibleValidationRuntime(input), true);
  fs.writeFileSync(readerPath, 'export const limit = 1;\n');
  assert.equal(compatibleValidationRuntime(input), false, 'reader behavior changes invalidate the receipt');
  fs.writeFileSync(readerPath, 'export const limit = 32;\n');
  fs.writeFileSync(path.join(installed, 'src/init-templates.js'), 'export const templates = {};\n');
  fs.writeFileSync(path.join(installed, 'src/init.js'), 'export { templates } from "./init-templates.js";\n');
  receipt.validationSha256 = validationFingerprint(installed);
  fs.appendFileSync(path.join(installed, 'src/init-templates.js'), 'export const revision = 2;\n');
  assert.equal(compatibleValidationRuntime(input), false, 'scaffold dependencies are part of the CLI closure');
  fs.writeFileSync(validationPath, 'import "./unknown-reader.js";\n');
  fs.writeFileSync(path.join(installed, 'src/unknown-reader.js'), 'export const limit = 32;\n');
  assert.equal(compatibleValidationRuntime(input), false, 'undeclared imports fail closed even when present');
  fs.writeFileSync(validationPath, 'import{limit}from"./unknown-reader.js";\n');
  assert.equal(compatibleValidationRuntime(input), false, 'compact module syntax cannot hide a dependency');
  fs.writeFileSync(validationPath, 'export{limit}from"./unknown-reader.js";\n');
  assert.equal(compatibleValidationRuntime(input), false, 'reexports are also dependency edges');
  fs.writeFileSync(validationPath, 'export { limit } from /* dependency annotation */ "./unknown-reader.js";\n');
  assert.equal(compatibleValidationRuntime(input), false, 'commented reexports cannot bypass closure');
  fs.writeFileSync(validationPath, 'export /* dependency annotation */ * from "./unknown-reader.js";\n');
  assert.equal(compatibleValidationRuntime(input), false, 'unrecognized namespace exports fail closed');
  fs.writeFileSync(validationPath, 'export /* from "node:fs" */ { limit } from "./unknown-reader.js";\n');
  assert.equal(compatibleValidationRuntime(input), false, 'a commented builtin cannot disguise a reexport');
  fs.writeFileSync(validationPath, 'import /* from "node:fs" */ { limit } from "./unknown-reader.js";\nexport { limit };\n');
  assert.equal(compatibleValidationRuntime(input), false, 'a commented builtin cannot disguise an import');
  fs.writeFileSync(validationPath, 'import/* reviewed separately */("./bounded-read.js");\n');
  assert.equal(compatibleValidationRuntime(input), false, 'comments cannot hide a dynamic import');
  fs.writeFileSync(validationPath, 'import("./bounded-read.js");\n');
  assert.equal(compatibleValidationRuntime(input), false, 'dynamic imports require explicit contract review');
  fs.unlinkSync(path.join(installed, 'src/validate.js'));
  assert.equal(compatibleValidationRuntime(input), false);
  console.log('PASS: exact dependency compatibility, unknown contracts, duplicates, wrong pins, missing and changed dependencies');
} finally { fs.rmSync(root, { recursive: true, force: true }); }
