import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'skill-reference-test-'));
const put = (name, contents) => {
  const target = path.join(fixture, name);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, contents);
};
const run = (mode, status, message) => {
  const result = spawnSync('bash', [path.join(fixture, 'scripts/validate-references.sh'), mode], { encoding: 'utf8' });
  assert.equal(result.status, status, `${mode}: ${result.stdout}\n${result.stderr}`);
  if (message) assert.match(result.stdout + result.stderr, message);
};

try {
  put('scripts/validate-references.sh', fs.readFileSync(path.join(root, 'scripts/validate-references.sh')));
  put('example/SKILL.md', '# Example\n');
  put('example/references/router.md', '- `sibling.md`: route.\n- Context: `other.md`.\n- The product `README.md` and `readme.md` describe the repository.\n');
  put('example/references/sibling.md', '[Link](other.md#section)\n');
  put('example/references/other.md', '# Other\n');
  put('shared/references/guide.md', '[Shared target](./shared.target.md#notes) and [external](https://example.invalid/missing.md).\n');
  put('shared/references/shared.target.md', '# Shared target\n');
  put('wp-expert/references/reference-routing-map.md', 'Use `local-map.md` and `shared-map.md`.\n');
  put('wp-expert/references/local-map.md', '# Local\n');
  put('shared/references/shared-map.md', '# Shared\n');
  run('--links', 0);
  run('--routing', 0);

  fs.unlinkSync(path.join(fixture, 'example/references/sibling.md'));
  run('--links', 1, /Broken route in example\/references\/router\.md: sibling\.md/);
  put('example/references/sibling.md', '[Link](other.md#section)\n');
  fs.unlinkSync(path.join(fixture, 'example/references/other.md'));
  run('--links', 1, /Broken route in example\/references\/sibling\.md: other\.md/);
  put('example/references/other.md', '# Other\n');
  fs.unlinkSync(path.join(fixture, 'shared/references/shared.target.md'));
  run('--links', 1, /Broken route in shared\/references\/guide\.md: \.\/shared\.target\.md/);
  put('shared/references/shared.target.md', '# Shared target\n');
  fs.unlinkSync(path.join(fixture, 'shared/references/shared-map.md'));
  run('--routing', 1, /Routing map references missing file: shared-map\.md/);
  put('shared/references/shared-map.md', '# Shared\n');
  put('example/SKILL.md', 'Use `references/missing.md`.\n');
  run('--links', 1, /Referenced but missing: references\/missing\.md/);
  console.log('Reference validator synthetic regression: PASS');
} finally {
  fs.rmSync(fixture, { recursive: true, force: true });
}
