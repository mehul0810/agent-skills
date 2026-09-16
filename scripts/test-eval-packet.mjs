import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import { buildPacket, verifyPacket } from './build-eval-packet.mjs';
const root = fs.mkdtempSync(path.join(os.tmpdir(), 'eval-packet-test-'));
const source = path.join(root, 'case'), out = path.join(root, 'packet');
fs.mkdirSync(path.join(source, 'artifacts'), { recursive: true });
fs.writeFileSync(path.join(source, 'artifacts', 'sample.txt'), 'raw fixture');
fs.writeFileSync(path.join(source, 'criteria.md'), 'private answer key');
const input = { id: 'sample', request: 'Review the supplied fixture.', artifacts: ['sample.txt'] };
const write = value => fs.writeFileSync(path.join(source, 'input.json'), JSON.stringify(value));
write(input);
buildPacket(source, out, 'a'.repeat(40));
assert.equal(verifyPacket(out).id, 'sample');
assert.equal(fs.existsSync(path.join(out, 'criteria.md')), false);
assert.throws(() => buildPacket(source, out, 'a'.repeat(40)));
fs.writeFileSync(path.join(out, 'request.md'), 'tampered');
assert.throws(() => verifyPacket(out), /changed/);
write({ ...input, expected: 'secret answer' });
assert.throws(() => buildPacket(source, path.join(root, 'rejected'), 'a'.repeat(40)), /permits only/);
for (const file of ['../criteria.md', '/tmp/answer', 'missing.txt']) {
  write({ ...input, artifacts: [file] });
  assert.throws(() => buildPacket(source, path.join(root, 'rejected'), 'a'.repeat(40)));
}
fs.symlinkSync(path.join(source, 'criteria.md'), path.join(source, 'artifacts', 'linked'));
write({ ...input, artifacts: ['linked'] });
assert.throws(() => buildPacket(source, path.join(root, 'rejected'), 'a'.repeat(40)), /non-symlink/);
console.log('Evaluation packet isolation and integrity tests passed');
