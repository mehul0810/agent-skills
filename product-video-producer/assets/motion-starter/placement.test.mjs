import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, existsSync, readFileSync, symlinkSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { geometry, parseArgs } from '../../scripts/review-placement-frames.mjs';

const script = fileURLToPath(new URL('../../scripts/review-placement-frames.mjs', import.meta.url));
const base = ['--input', 'video.mp4', '--width', '360', '--times', '0,1.25', '--output', 'new-dir'];
const call = (cmd, args) => spawnSync(cmd, args, { encoding: 'utf8' });
test('argument validation and import have no effects', () => {
  assert.deepEqual(parseArgs(base).times, [0, 1.25]);
  for (const bad of ['0', '-1', '1.2', '8193', 'NaN']) assert.throws(() => parseArgs(base.map(x => x === '360' ? bad : x)));
  for (const bad of ['', '-1', 'NaN', '1,', '1e3']) assert.throws(() => parseArgs(base.map(x => x === '0,1.25' ? bad : x)));
  assert.throws(() => parseArgs([...base, '--width', '10']));
  const imported = call(process.execPath, ['--input-type=module', '-e', `await import(${JSON.stringify(new URL('../../scripts/review-placement-frames.mjs', import.meta.url).href)})`]);
  assert.equal(imported.status, 0); assert.equal(imported.stdout, ''); assert.equal(imported.stderr, '');
  const stdin = spawnSync(process.execPath, ['--input-type=module', '-'], { input: `await import(${JSON.stringify(new URL('../../scripts/review-placement-frames.mjs', import.meta.url).href)})`, encoding: 'utf8' });
  assert.equal(stdin.status, 0); assert.equal(stdin.stdout, ''); assert.equal(stdin.stderr, '');
  for (const stream of [{tags:{rotate:'bad'}}, {tags:{rotate:'90'}}, {side_data_list:[{side_data_type:'Display Matrix',rotation:0}]}, {side_data_list:[{rotation:'bad'}]}]) assert.throws(() => geometry(stream));
});
const available = ['ffmpeg', 'ffprobe'].every(c => call(c, ['-version']).status === 0);
test('encoded fixture extraction and fail-closed boundaries', { skip: available ? false : 'ffmpeg and ffprobe unavailable; native fixture check not run' }, () => {
  const dir = mkdtempSync(join(tmpdir(), 'placement-test-'));
  try {
    const video = join(dir, 'video.mp4'), guide = join(dir, 'guide.png'), opaque = join(dir, 'opaque.png'), transparent = join(dir, 'transparent.png'), wrong = join(dir, 'wrong.png');
    const make = (args) => { const r = call('ffmpeg', ['-v', 'error', '-y', ...args]); assert.equal(r.status, 0, r.stderr); };
    make(['-f', 'lavfi', '-i', 'testsrc2=size=320x180:rate=10:duration=2', '-c:v', 'mpeg4', video]);
    make(['-f', 'lavfi', '-i', 'color=black@0.0:size=320x180,format=rgba,drawbox=x=0:y=130:w=320:h=50:color=black@0.8:t=fill:replace=1', '-frames:v', '1', guide]);
    const highDepth = join(dir, 'guide16.png');
    make(['-i', guide, '-pix_fmt', 'rgba64be', '-frames:v', '1', highDepth]);
    make(['-f', 'lavfi', '-i', 'color=black@1.0:size=320x180,format=rgba', '-frames:v', '1', opaque]);
    make(['-f', 'lavfi', '-i', 'color=black@0.0:size=320x180,format=rgba', '-frames:v', '1', transparent]);
    make(['-f', 'lavfi', '-i', 'color=black@0.0:size=100x100,format=rgba', '-frames:v', '1', wrong]);
    const link = join(dir, 'installed-cli.mjs'); symlinkSync(script, link);
    const invoke = (output, extra = []) => call(link, ['--input', video, '--width', '160', '--times', '0,1', '--output', output, ...extra]);
    const output = join(dir, 'output'); const good = invoke(output, ['--overlay', guide]);
    assert.equal(good.status, 0, good.stderr);
    const highDepthInfo = JSON.parse(call('ffprobe', ['-v', 'error', '-show_streams', '-of', 'json', highDepth]).stdout);
    assert.equal(highDepthInfo.streams[0].pix_fmt, 'rgba64be');
    const deep = invoke(join(dir, 'deep'), ['--overlay', highDepth]);
    assert.equal(deep.status, 0, deep.stderr);
    const clean = join(output, 'frame-001-clean.png'), guided = join(output, 'frame-001-guided.png');
    assert.ok(existsSync(clean)); assert.ok(existsSync(guided));
    const pixels = path => { const r = spawnSync('ffmpeg', ['-v', 'error', '-i', path, '-frames:v', '1', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], { maxBuffer: 1024 * 1024 }); assert.equal(r.status, 0, r.stderr?.toString()); return r.stdout; };
    const plainPixels = pixels(clean), guidePixels = pixels(guided);
    const pixel = (buffer, x, y) => buffer.subarray((y * 160 + x) * 3, (y * 160 + x) * 3 + 3);
    assert.deepEqual(pixel(plainPixels, 80, 20), pixel(guidePixels, 80, 20));
    assert.notDeepEqual(pixel(plainPixels, 80, 80), pixel(guidePixels, 80, 80));
    const before = readFileSync(clean); assert.notEqual(invoke(output).status, 0); assert.deepEqual(readFileSync(clean), before);
    for (const [name, extra] of [['opaque', ['--overlay', opaque]], ['transparent', ['--overlay', transparent]], ['wrong', ['--overlay', wrong]]]) {
      const dest = join(dir, `bad-${name}`); assert.notEqual(invoke(dest, extra).status, 0); assert.equal(existsSync(dest), false);
    }
    const late = join(dir, 'bad-late');
    assert.notEqual(call(process.execPath, [link, '--input', video, '--width', '160', '--times', '2', '--output', late]).status, 0);
    assert.equal(existsSync(late), false);
    const rotated = join(dir, 'rotated.mp4'), anamorphic = join(dir, 'anamorphic.mp4'), playlist = join(dir, 'playlist.m3u8');
    const supportsDisplayRotation = call('ffmpeg', ['-h', 'full']).stdout.includes('-display_rotation');
    make(supportsDisplayRotation ? ['-display_rotation', '90', '-i', video, '-c', 'copy', rotated] : ['-i', video, '-c', 'copy', '-metadata:s:v:0', 'rotate=90', rotated]);
    const rotatedInfo = JSON.parse(call('ffprobe', ['-v', 'error', '-show_streams', '-of', 'json', rotated]).stdout);
    assert.ok(rotatedInfo.streams[0].side_data_list?.some(x => x.rotation), 'rotation fixture must contain rotation metadata');
    make(['-f', 'lavfi', '-i', 'testsrc2=size=320x180:rate=10:duration=1,setsar=2/1', '-c:v', 'mpeg4', anamorphic]);
    const untagged = join(dir, 'untagged.mov');
    make(['-f', 'lavfi', '-i', 'testsrc2=size=180x320:rate=10:duration=1,setsar=0', '-c:v', 'png', untagged]);
    const inspect = (input, name, ...flags) => call(link, ['--input', input, '--width', '90', '--times', '0', '--output', join(dir, name), ...flags]);
    assert.match(inspect(untagged, 'no-assumption').stderr, /No pixel-aspect tag/);
    assert.ok(!existsSync(join(dir, 'no-assumption')));
    const assumed = inspect(untagged, 'confirmed', '--assume-square');
    assert.equal(assumed.status, 0, assumed.stderr);
    assert.match(assumed.stderr, /caller-confirmed/);
    for (const input of [anamorphic, rotated]) assert.notEqual(inspect(input, 'wrong-override', '--assume-square').status, 0);
    writeFileSync(playlist, '#EXTM3U\n#EXTINF:1,\nvideo.mp4\n');
    for (const [name, input] of [['rotated', rotated], ['anamorphic', anamorphic], ['playlist', playlist], ['directory', dir]]) {
      const dest = join(dir, `bad-${name}`);
      assert.notEqual(call(link, ['--input', input, '--width', '160', '--times', '0', '--output', dest]).status, 0, name);
      assert.equal(existsSync(dest), false, name);
    }
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
