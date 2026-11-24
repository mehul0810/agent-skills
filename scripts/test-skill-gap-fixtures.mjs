import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { buildPacket, verifyPacket } from './build-eval-packet.mjs';

const repo = fileURLToPath(new URL('../', import.meta.url));
const fixture = 'skill-evals/cases/governance-contract-refresh-supplement';
const releaseArtifact = `${fixture}/artifacts/release-decision.md`;

function withPacket(run) {
  const root = fs.mkdtempSync(path.join(fs.realpathSync(os.tmpdir()), 'skill-gap-fixture-'));
  try {
    const source = path.join(root, 'source');
    const output = path.join(root, 'packet');
    fs.cpSync(path.join(repo, fixture), source, { recursive: true });
    // External synthetic fixture copy tests packaging, not repository admission.
    const manifest = buildPacket(source, output, 'a'.repeat(40));
    run({ source, output, manifest });
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

test('release decision is included byte-for-byte while author criteria stay private', () => {
  withPacket(({ output, manifest }) => {
    assert.ok(manifest.files['artifacts/release-decision.md']);
    assert.deepEqual(fs.readFileSync(path.join(output, 'artifacts/release-decision.md')), fs.readFileSync(path.join(repo, releaseArtifact)));
    assert.equal(fs.existsSync(path.join(output, 'criteria.md')), false);
    assert.equal(verifyPacket(output).packetDigest, manifest.packetDigest);
  });
});

test('missing required release decision prevents packet creation', () => {
  withPacket(({ source, output }) => {
    fs.unlinkSync(path.join(source, 'artifacts/release-decision.md'));
    assert.throws(() => buildPacket(source, `${output}-missing`, 'a'.repeat(40)), /ENOENT/);
  });
});

test('release decision edits invalidate the frozen packet', () => {
  withPacket(({ output }) => {
    fs.appendFileSync(path.join(output, 'artifacts/release-decision.md'), '\nChanged decision.\n');
    assert.throws(() => verifyPacket(output), /Packet content changed/);
  });
});

test('every baseline binding the supplement also binds the release decision', () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(repo, 'skill-evals/behavior-baselines.json')));
  const consumers = manifest.baselines.filter(row => row.scenario.fixtureFiles?.includes(`${fixture}/input.json`));
  assert.ok(consumers.length > 0);
  for (const row of consumers) assert.ok(row.scenario.fixtureFiles.includes(releaseArtifact), row.name);
});
