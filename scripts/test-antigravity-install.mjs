import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const tmp = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'antigravity-install-')));
const root = path.join(tmp, 'public checkout');
const home = path.join(tmp, 'clean home');
const cli = 'scripts/install-global-skill-links.sh';
const config = path.join(home, '.gemini/config');
const manifest = path.join(config, 'skills.json');
const env = { ...process.env, HOME: home, CODEX_HOME: path.join(home, '.codex'),
  CLAUDE_HOME: path.join(home, '.claude'), GIT_CONFIG_NOSYSTEM: '1' };
const run = (bin, args, error) => {
  const result = spawnSync(bin, args, { cwd: root, env, encoding: 'utf8' });
  assert.ifError(result.error);
  if (error) {
    assert.notEqual(result.status, 0, `unexpected success: ${args.join(' ')}`);
    assert.match(result.stderr, error);
  } else {
    assert.equal(result.status, 0, result.stderr);
  }
};
const install = (...args) => run('bash', [cli, ...args]);
const reject = (error, ...args) => run('bash', [cli, ...args], error);
const git = (...args) => run('git', args);
const read = () => JSON.parse(fs.readFileSync(manifest, 'utf8'));
const write = doc => fs.writeFileSync(manifest, JSON.stringify(doc));
const entry = names => ({ path: root, include_only: names });
function skill(dir, name = path.basename(dir)) {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'SKILL.md'), `---\nname: ${name}\ndescription: Fixture skill.\n---\n`);
}

try {
  for (const dir of ['scripts', 'shared', 'templates']) fs.mkdirSync(path.join(root, dir), { recursive: true });
  for (const name of [cli, 'scripts/list-global-skills.sh', 'scripts/sync-antigravity-skills.py']) {
    fs.copyFileSync(new URL('../' + name, import.meta.url), path.join(root, name));
  }
  git('init', '-q');
  git('config', 'user.name', 'Installer test');
  git('config', 'user.email', 'fixture@example.invalid');
  skill(path.join(root, 'alpha'));
  skill(path.join(root, 'retired'));
  const privateRepo = path.join(tmp, 'agent-loop');
  skill(privateRepo);
  git('-C', privateRepo, 'init', '-q');
  git('-C', privateRepo, 'add', 'SKILL.md');
  git('-C', privateRepo, '-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid',
    'commit', '-qm', 'Private fixture');
  skill(path.join(root, 'nested/private-skill'));
  fs.symlinkSync(privateRepo, path.join(root, 'linked-private'));
  fs.mkdirSync(path.join(root, 'linked-file'));
  fs.symlinkSync(path.join(privateRepo, 'SKILL.md'), path.join(root, 'linked-file/SKILL.md'));
  git('add', '.');
  git('commit', '-qm', 'Initial fixture');
  skill(path.join(root, 'local-private'));

  reject(/not registered/, '--check-antigravity');
  for (const dir of [config, env.CODEX_HOME, env.CLAUDE_HOME]) {
    assert.ok(!fs.existsSync(dir), 'read-only check created host configuration');
  }
  install();
  assert.ok(!fs.existsSync(config), 'ordinary install opted an unregistered host in');
  for (const name of ['local-private', 'linked-private', 'linked-file', '../agent-loop', privateRepo, 'nested/private-skill']) {
    reject(/not a public top-level skill/, '--antigravity', name);
    assert.ok(!fs.existsSync(path.join(env.CODEX_HOME, 'skills', path.basename(name))));
  }

  install('--antigravity', 'alpha');
  assert.deepEqual(read(), { entries: [entry(['alpha'])] });
  assert.equal(fs.statSync(manifest).mode & 0o777, 0o600);
  install('--check-antigravity', 'alpha');
  reject(/out of sync/, '--check-antigravity');
  install('retired');
  assert.deepEqual(read().entries, [entry(['alpha', 'retired'])]);

  const unrelated = { path: 'my own skills', exclude: ['local'] };
  const ownerFields = { inherits: [{ path: '/example/team.json' }], exclude: ['disabled'] };
  write({ ...ownerFields, entries: [unrelated] });
  const original = fs.readFileSync(manifest, 'utf8');
  install();
  assert.equal(fs.readFileSync(manifest, 'utf8'), original, 'unrelated manifest was adopted');
  install('--antigravity');
  assert.deepEqual(read(), { ...ownerFields, entries: [unrelated, entry(['alpha', 'retired'])] });

  const managed = { ...entry(['alpha', 'retired']), exclude: ['alpha'] };
  write({ ...ownerFields, entries: [unrelated, managed] });
  fs.chmodSync(manifest, 0o640);
  skill(path.join(root, 'new-public'));
  git('add', 'new-public');
  install();
  assert.deepEqual(read().entries[1], managed, 'staged-only skill was published');
  git('rm', '-q', 'retired/SKILL.md');
  git('commit', '-qm', 'Add a public skill and retire one');
  const beforeCheck = fs.readFileSync(manifest, 'utf8');
  reject(/out of sync/, '--check-antigravity');
  assert.equal(fs.readFileSync(manifest, 'utf8'), beforeCheck);
  install();
  assert.deepEqual(read(), { ...ownerFields, entries: [unrelated, { ...managed, include_only: ['alpha', 'new-public'] }] });
  assert.equal(fs.statSync(manifest).mode & 0o777, 0o640);
  const bytes = fs.readFileSync(manifest, 'utf8');
  const inode = fs.statSync(manifest).ino;
  install();
  install('--check-antigravity');
  assert.equal(fs.readFileSync(manifest, 'utf8'), bytes);
  assert.equal(fs.statSync(manifest).ino, inode, 'unchanged manifest was rewritten');

  const alias = path.join(tmp, 'same checkout');
  fs.symlinkSync(root, alias);
  write({ entries: [{ path: alias, include_only: ['alpha'] }] });
  install();
  assert.deepEqual(read().entries, [{ path: alias, include_only: ['alpha', 'new-public'] }]);
  write({ entries: [entry([]), { path: alias }] });
  reject(/multiple entries/, '--antigravity');

  // Fail before any new host link is created, even with --force.
  const link = path.join(env.CODEX_HOME, 'skills/alpha');
  fs.unlinkSync(link);
  for (const bad of ['{broken', '{"entries":{},"entries":[]}', '{"entries":{}}', '{"unknown":NaN}',
    JSON.stringify({ entries: [entry([]), entry([])] }), JSON.stringify({ entries: [entry('alpha')] })]) {
    fs.writeFileSync(manifest, bad);
    reject(/Antigravity:/, '--force', '--antigravity');
    assert.equal(fs.readFileSync(manifest, 'utf8'), bad);
    assert.ok(!fs.existsSync(link));
  }
  const outside = path.join(tmp, 'owner-file');
  fs.writeFileSync(outside, bytes);
  fs.unlinkSync(manifest);
  fs.symlinkSync(outside, manifest);
  reject(/symlinked target/, '--antigravity');
  assert.equal(fs.readFileSync(outside, 'utf8'), bytes);
  fs.unlinkSync(manifest);
  fs.rmdirSync(config);
  fs.symlinkSync(tmp, config);
  reject(/symlinked target/, '--antigravity');
  assert.ok(!fs.existsSync(path.join(tmp, 'skills.json')));
  fs.unlinkSync(config);
  fs.mkdirSync(config);
  fs.writeFileSync(manifest, bytes);
  fs.unlinkSync(path.join(root, 'alpha/SKILL.md'));
  fs.symlinkSync(path.join(privateRepo, 'SKILL.md'), path.join(root, 'alpha/SKILL.md'));
  reject(/unsafe skill source/);
  assert.equal(fs.readFileSync(manifest, 'utf8'), bytes);
  assert.ok(!fs.existsSync(link));
  // A reviewed archive still supports ordinary links, but cannot vouch for a
  // Git-tracked public inventory or register itself with Antigravity.
  fs.unlinkSync(path.join(root, 'alpha/SKILL.md'));
  skill(path.join(root, 'alpha'));
  fs.unlinkSync(path.join(root, 'linked-file/SKILL.md'));
  fs.renameSync(path.join(root, '.git'), path.join(tmp, 'parked-git'));
  reject(/requires a Git checkout/, '--antigravity', 'alpha');
  assert.equal(fs.readFileSync(manifest, 'utf8'), bytes);
  fs.unlinkSync(manifest);
  install('alpha');
  assert.ok(fs.lstatSync(link).isSymbolicLink());
  assert.ok(!fs.existsSync(manifest));
  console.log('Antigravity installer: public additions and retirements, selective sync, privacy, preservation and safe failures passed');
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}
