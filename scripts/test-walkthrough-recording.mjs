#!/usr/bin/env node
// Portable CLI boundary checks; native capture is opt-in and needs existing local tools.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {spawn, spawnSync} from 'node:child_process';
import {createServer} from 'node:http';
import {mkdtemp, readFile, writeFile, rm, mkdir, symlink} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {parseArgs} from '../product-video-producer/scripts/record-walkthrough.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const cli = path.join(root, 'product-video-producer/scripts/record-walkthrough.mjs');
const fixture = path.join(root, 'product-video-producer/assets/walkthrough-starter/demo.html');
const nativeCwd = process.cwd();
const invoke = args => spawnSync(process.execPath, [cli, ...args], {cwd: root, encoding: 'utf8', timeout: 15000});

// A hard cut, stationary preview, or pointer-only movement has fewer than four
// ordered divider positions. Positions are measured from decoded app pixels.
function hasContinuousWipe(positions) {
  let last = -Infinity, steps = 0;
  for (const x of positions) {
    if (x !== null && x >= last + 40) { last = x; steps++; }
  }
  return steps >= 4;
}

function wipePosition(frame, width = 960, height = 600) {
  let best = null;
  for (let y = 0; y < height; y += 4) {
    let green = 0, ivory = 0, edge = 0;
    for (let x = 32; x < width - 32; x += 4) {
      const i = (y * width + x) * 3, [r, g, b] = frame.subarray(i, i + 3);
      if (r >= 35 && r <= 70 && g >= 80 && g <= 120 && b >= 65 && b <= 100) { green++; edge = x; }
      if (r >= 205 && r <= 245 && g >= 190 && g <= 230 && b >= 145 && b <= 195) ivory++;
    }
    if (green >= 8 && ivory >= 8 && green + ivory >= 140 && (!best || green + ivory > best.count)) best = {count: green + ivory, edge};
  }
  return best?.edge ?? null;
}

test('continuous wipe detector rejects hard cuts and pointer-only movement', () => {
  assert.equal(hasContinuousWipe([100, 100, 800, 800]), false);
  assert.equal(hasContinuousWipe([300, 300, 300, 300, 300]), false);
  assert.equal(hasContinuousWipe([100, 180, 260, 340, 420]), true);
});

test('help succeeds without browser dependencies', () => {
  const result = invoke(['--help']);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /--demo/);
  assert.match(result.stdout, /--out/);
});

test('help works from a symlinked installed entrypoint', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'walkthrough-link-'));
  try {
    const link = path.join(dir, 'record-walkthrough.mjs');
    await symlink(cli, link);
    const result = spawnSync(process.execPath, [link, '--help'], {cwd: nativeCwd, encoding: 'utf8'});
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /--demo/);
  } finally { await rm(dir, {recursive: true, force: true}); }
});

test('refuses unsupported modes, non-loopback and sensitive URLs', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'walkthrough-cli-'));
  try {
    const out = path.join(dir, 'new');
    const cases = [
      [], ['--demo', '--url', 'http://127.0.0.1:3000/', '--out', out],
      ['--demo', '--unknown', '--out', out], ['--demo', '--demo', '--out', out],
      ['--url', 'http://127.0.0.1:3000/', '--out', out],
      ...['https://127.0.0.1:3000/', 'http://localhost:3000/', 'http://192.168.1.2:3000/',
        'http://user:secret@127.0.0.1:3000/', 'http://127.0.0.1:3000/?token=secret',
        'http://127.0.0.1:3000/#secret', 'http://127.0.0.1/'].map(url => ['--url', url, '--guided', '--out', out])
    ];
    for (const args of cases) {
      assert.throws(() => parseArgs(args), undefined, JSON.stringify(args));
      const result = invoke(args);
      assert.notEqual(result.status, 0, JSON.stringify(args));
      assert.doesNotMatch(result.stderr, /secret/, 'diagnostics must not echo sensitive inputs');
    }
  } finally { await rm(dir, {recursive: true, force: true}); }
});

test('existing output is never overwritten', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'walkthrough-existing-'));
  try {
    const out = path.join(dir, 'existing');
    await mkdir(out);
    await writeFile(path.join(out, 'sentinel'), 'preserve');
    const result = invoke(['--demo', '--out', out]);
    assert.notEqual(result.status, 0);
    assert.equal(await readFile(path.join(out, 'sentinel'), 'utf8'), 'preserve');
  } finally { await rm(dir, {recursive: true, force: true}); }
});

test('native demo and reviewed local plan produce probeable UI-driven captures', {skip: process.env.WALKTHROUGH_NATIVE_TEST === '1' ? false : 'native browser and ffprobe check not run; set WALKTHROUGH_NATIVE_TEST=1 explicitly'}, async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'walkthrough-native-'));
  const html = await readFile(fixture);
  let escapedRequests = 0;
  const target = createServer((req, res) => { escapedRequests++; res.writeHead(200); res.end('unexpected'); });
  await new Promise(resolve => target.listen(0, '127.0.0.1', resolve));
  const server = createServer((req, res) => {
    if (req.url === '/redirect') { res.writeHead(302, {Location: `http://127.0.0.1:${target.address().port}/escaped`}); res.end(); return; }
    if (req.url === '/popup' || req.url === '/dialog') {
      const action = req.url === '/popup' ? "window.open('/extra', '_blank')" : "alert('Unexpected dialog')";
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end(`<button onclick="this.hidden=true;document.querySelector('#compare').hidden=false">Open proof</button><button id="compare" hidden onclick="document.querySelector('#status').textContent='Comparison ready';${action}">Compare versions</button><p id="status"></p>`);
      return;
    }
    res.writeHead(200, {'Content-Type': 'text/html'}); res.end(html);
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const run = (args, success = true) => new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [cli, ...args], {cwd: nativeCwd, stdio: ['ignore', 'pipe', 'pipe']});
    let diagnostic = '';
    child.stdout.on('data', chunk => diagnostic += chunk); child.stderr.on('data', chunk => diagnostic += chunk);
    child.on('error', reject); child.on('close', code => (code === 0) === success ? resolve() : reject(new Error(`unexpected capture result (${code}): ${diagnostic}`)));
  });
  try {
    const {chromium} = createRequire(path.join(nativeCwd, 'package.json'))('playwright');
    const browser = await chromium.launch({headless: true});
    try {
      for (const viewport of [{width: 960, height: 600}, {width: 1280, height: 800}, {width: 390, height: 844}]) {
        const page = await browser.newPage({viewport, reducedMotion: 'reduce'});
        await page.goto(`http://127.0.0.1:${server.address().port}/demo`);
        assert.equal(await page.getByText('Proof desk', {exact: true}).count(), 1);
        await page.getByRole('button', {name: 'Open proof'}).click();
        const slider = page.getByRole('slider', {name: 'Proof comparison'});
        assert.equal(await slider.isVisible(), false);
        await page.getByRole('button', {name: 'Compare versions'}).click();
        await page.getByText('Comparison ready', {exact: true}).waitFor();
        assert.equal(await slider.isVisible(), true);
        await slider.focus();
        await page.keyboard.press('ArrowRight');
        assert.equal(await slider.inputValue(), '16');
        assert.equal(await page.locator('#wipe').evaluate(el => el.style.getPropertyValue('--split')), '16%');
        const layout = await page.evaluate(() => ({width: document.documentElement.scrollWidth, viewport: innerWidth, status: document.querySelector('#status').getBoundingClientRect().bottom, height: innerHeight}));
        assert.ok(layout.width <= layout.viewport, `horizontal overflow at ${viewport.width}px`);
        if (viewport.width >= 960) assert.ok(layout.status <= layout.height, `status below viewport at ${viewport.width}px`);
        await page.close();
      }
    } finally { await browser.close(); }
    const plan = path.join(dir, 'plan.json');
    await writeFile(plan, JSON.stringify({version: 1, steps: [
      {role: 'button', name: 'Open proof', expect: 'Compare versions', holdMs: 800},
      {role: 'button', name: 'Compare versions', expect: 'Comparison ready', holdMs: 1200}
    ]}));
    for (const [name, args] of [
      ['demo', ['--demo']],
      ['plan', ['--url', `http://127.0.0.1:${server.address().port}/demo`, '--plan', plan]]
    ]) {
      const out = path.join(dir, name);
      await run([...args, '--out', out]);
      const receipt = JSON.parse(await readFile(path.join(out, 'receipt.json'), 'utf8'));
      assert.equal(receipt.status, 'captured');
      assert.ok(receipt.observedActions.length >= 2);
      assert.equal(path.basename(receipt.clip.file), receipt.clip.file);
      const clip = await readFile(path.join(out, receipt.clip.file));
      assert.ok(clip.length > 0);
      assert.equal(createHash('sha256').update(clip).digest('hex'), receipt.clip.sha256);
      const probe = spawnSync('ffprobe', ['-v', 'error', '-show_streams', '-of', 'json', path.join(out, receipt.clip.file)], {encoding: 'utf8'});
      assert.equal(probe.status, 0, probe.stderr || 'ffprobe unavailable');
      const streams = JSON.parse(probe.stdout).streams;
      assert.ok(streams.some(s => s.codec_type === 'video' && s.width === 960 && s.height === 600));
      assert.ok(!streams.some(s => s.codec_type === 'audio'));
      if (name === 'demo') {
        const start = receipt.observedActions.find(a => a.action === 'comparison_drag_started')?.elapsedSincePageCreatedMs;
        const end = receipt.observedActions.find(a => a.action === 'comparison_drag_completed')?.elapsedSincePageCreatedMs;
        assert.ok(Number.isFinite(start) && Number.isFinite(end) && end > start, 'missing deliberate drag interval');
        // Page creation is a wall-clock proxy for video start, not a frame-exact
        // timestamp. A half-second margin covers encoder startup uncertainty.
        const from = Math.max(0, start / 1000 - 0.5), duration = (end - start) / 1000 + 1;
        const decoded = spawnSync('ffmpeg', ['-v', 'error', '-ss', String(from), '-i', path.join(out, receipt.clip.file), '-t', String(duration), '-vf', 'fps=5', '-f', 'rawvideo', '-pix_fmt', 'rgb24', 'pipe:1'], {maxBuffer: 40 * 1024 * 1024});
        assert.equal(decoded.status, 0, decoded.stderr?.toString() || 'ffmpeg unavailable');
        const frameSize = 960 * 600 * 3, positions = [];
        for (let i = 0; i + frameSize <= decoded.stdout.length; i += frameSize) positions.push(wipePosition(decoded.stdout.subarray(i, i + frameSize)));
        assert.ok(hasContinuousWipe(positions), `decoded app wipe lacks ordered intermediate positions: ${JSON.stringify(positions)}`);
      }
    }
    const demoOut = path.join(dir, 'demo');
    const previousReceipt = await readFile(path.join(demoOut, 'receipt.json'), 'utf8');
    await run(['--demo', '--out', demoOut], false);
    assert.equal(await readFile(path.join(demoOut, 'receipt.json'), 'utf8'), previousReceipt);
    const badPlan = path.join(dir, 'bad-plan.json');
    await writeFile(badPlan, JSON.stringify({version: 1, steps: [
      {role: 'button', name: 'Open proof', expect: 'This text does not exist', holdMs: 800}
    ]}));
    const failedOut = path.join(dir, 'failed');
    await run(['--url', `http://127.0.0.1:${server.address().port}/demo`, '--plan', badPlan, '--out', failedOut], false);
    const failed = JSON.parse(await readFile(path.join(failedOut, 'receipt.json'), 'utf8'));
    assert.equal(failed.status, 'partial');
    const redirectOut = path.join(dir, 'redirect');
    await run(['--url', `http://127.0.0.1:${server.address().port}/redirect`, '--plan', plan, '--out', redirectOut], false);
    assert.equal(escapedRequests, 0, 'redirect must not request another origin');
    const redirectReceipt = JSON.parse(await readFile(path.join(redirectOut, 'receipt.json'), 'utf8'));
    assert.equal(redirectReceipt.status, 'partial');
    for (const kind of ['popup', 'dialog']) {
      const unsafeOut = path.join(dir, kind);
      await run(['--url', `http://127.0.0.1:${server.address().port}/${kind}`, '--plan', plan, '--out', unsafeOut], false);
      const unsafeReceipt = JSON.parse(await readFile(path.join(unsafeOut, 'receipt.json'), 'utf8'));
      assert.equal(unsafeReceipt.status, 'partial', `${kind} must not be reported as captured`);
    }
  } finally {
    await new Promise(resolve => server.close(resolve));
    await new Promise(resolve => target.close(resolve));
    await rm(dir, {recursive: true, force: true});
  }
});
