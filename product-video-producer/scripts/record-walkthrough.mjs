#!/usr/bin/env node
import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';
import {mkdir, lstat, readdir, stat, writeFile} from 'node:fs/promises';
import {createReadStream, existsSync, realpathSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {createInterface} from 'node:readline';
import {loadPlan, performPlan} from './walkthrough-plan.mjs';

const help = `Usage: node record-walkthrough.mjs --demo [--guided] --out NEW_DIR
       node record-walkthrough.mjs --url http://127.0.0.1:PORT/path --guided --out NEW_DIR
       node record-walkthrough.mjs --url http://127.0.0.1:PORT/path --plan FILE --out NEW_DIR
Node 24 and project-installed Playwright with Chromium are required; nothing is downloaded.
Guided capture opens an isolated browser and ends on Enter in a terminal (maximum 5 minutes).
Use only a sanitized, owned local app. The page video excludes desktop, microphone and system audio;
the hardware cursor may not appear. A receipt is not a playback or human-verification approval.
Extra pages and JavaScript dialogs invalidate a take. Browser-native permission and chooser prompts
are not reliably observable here; their absence or outcome is not verified.
`;
const fixture = fileURLToPath(new URL('../assets/walkthrough-starter/demo.html', import.meta.url));
const size = {width: 960, height: 600};
const limitMs = 5 * 60 * 1000;
class PreflightError extends Error {}

export function approvedOrigin(value) {
  if (typeof value !== 'string' || !/^http:\/\/127\.0\.0\.1:\d+(?:\/[^?#]*)?$/i.test(value)) throw new Error('URL must be an HTTP loopback address with an explicit port and no query or fragment');
  let url;
  try { url = new URL(value); } catch { throw new Error('Invalid local URL'); }
  if (url.protocol !== 'http:' || url.hostname !== '127.0.0.1' || !url.port || url.username || url.password || url.search || url.hash) throw new Error('Invalid local URL');
  return url.origin;
}

export function parseArgs(argv) {
  if (argv.length === 1 && argv[0] === '--help') return {help: true};
  const result = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (!['--demo', '--guided', '--url', '--out', '--plan'].includes(arg) || Object.hasOwn(result, arg.slice(2))) throw new Error('Invalid or repeated argument');
    const key = arg.slice(2);
    if (key === 'demo' || key === 'guided') result[key] = true;
    else {
      const value = argv[++i];
      if (!value || value.startsWith('--')) throw new Error('Missing argument value');
      result[key] = value;
    }
  }
  if (!result.out || path.resolve(result.out) === path.parse(path.resolve(result.out)).root) throw new Error('A new output directory is required');
  if (Boolean(result.demo) === Boolean(result.url)) throw new Error('Select exactly one of --demo or --url');
  if (result.demo && result.plan) throw new Error('Plans require a local URL');
  if (result.url) {
    approvedOrigin(result.url);
    if (Boolean(result.guided) === Boolean(result.plan)) throw new Error('Local app capture requires exactly one of --guided or --plan');
  }
  return result;
}

function resolvePlaywright() {
  const root = process.cwd();
  const require = createRequire(path.join(root, 'package.json'));
  let resolved;
  try { resolved = require.resolve('playwright'); } catch { throw new Error('Install Playwright in the current project and install its Chromium separately'); }
  // Reject NODE_PATH, global modules, and unrelated ancestor project installations.
  const modules = path.join(root, 'node_modules') + path.sep;
  if (!resolved.startsWith(modules)) throw new Error('Playwright must be installed in the current project');
  const {chromium} = require(resolved);
  if (!chromium?.launch) throw new Error('Installed Playwright does not provide Chromium');
  return chromium;
}

async function autoDemo(page, observed) {
  await page.getByText('Proof desk', {exact: true}).waitFor({state: 'visible'});
  observed.push('proof_desk_visible');
  await page.waitForTimeout(1600);
  const open = page.getByRole('button', {name: 'Open proof', exact: true});
  await open.hover();
  await page.waitForTimeout(700);
  await open.click();
  observed.push('open_proof_clicked');
  const compare = page.getByRole('button', {name: 'Compare versions', exact: true});
  await compare.waitFor({state: 'visible'});
  await page.waitForTimeout(900);
  await compare.hover();
  await page.waitForTimeout(700);
  await compare.click();
  observed.push('compare_versions_clicked');
  await page.getByText('Comparison ready', {exact: true}).waitFor({state: 'visible'});
  observed.push('comparison_ready_visible');
  await page.waitForTimeout(2400);
}

export async function main(argv) {
  let options;
  try { options = parseArgs(argv); } catch { throw new PreflightError('Invalid arguments. Use --help to check capture modes and URL restrictions.'); }
  if (options.help) { process.stdout.write(help); return; }
  if (Number(process.versions.node.split('.')[0]) < 24) throw new PreflightError('Node 24 or newer is required.');
  if (options.guided && (!process.stdin.isTTY || !process.stdout.isTTY)) throw new PreflightError('Guided capture requires an interactive terminal.');
  let plan, chromium;
  try { plan = options.plan ? await loadPlan(options.plan) : null; } catch { throw new PreflightError('The plan could not be read or validated; review its schema and file permissions.'); }
  try { chromium = resolvePlaywright(); } catch { throw new PreflightError('Install Playwright in the current project and provide its matching Chromium installation.'); }
  const output = path.resolve(options.out);
  try {
    const parent = await lstat(path.dirname(output));
    if (!parent.isDirectory() || parent.isSymbolicLink()) throw new Error();
    await mkdir(output, {mode: 0o700}); // Exclusive creation; retain partial output for inspection.
  } catch { throw new PreflightError('Output must be a new directory under an existing real, writable parent.'); }
  const start = Date.now();
  const observed = [];
  const receipt = {
    status: 'partial', mode: options.guided ? (options.demo ? 'demo-guided' : 'local-guided') : (plan ? 'local-plan' : 'demo-automatic'),
    startedAt: new Date(start).toISOString(), durationLimitSeconds: limitMs / 1000,
    viewport: size, videoSize: size, observedActions: observed,
    humanVerification: 'unknown', playbackReview: 'not performed', productSuccess: 'requires independent verification',
    boundaries: {capture: 'browser page only', microphone: false, systemAudio: false, desktop: false, hardwareCursor: 'may not appear', mediaFormat: 'Playwright Chromium WebM; probe independently', nativePermissionAndChooserPrompts: 'not reliably observable; absence and outcome unverified'}
  };
  let browser, context, page, timer, rl, interrupted = false, finished = false;
  let boundaryViolation = false, rejectBoundary;
  const failBoundary = () => {
    boundaryViolation = true;
    if (rejectBoundary) rejectBoundary(new Error('Capture surface boundary violated'));
  };
  const onSignal = () => { interrupted = true; if (rl) rl.close(); };
  process.once('SIGINT', onSignal);
  process.once('SIGTERM', onSignal);
  try {
    browser = await chromium.launch({headless: !options.guided, timeout: 15000});
    context = await browser.newContext({viewport: size, recordVideo: {dir: output, size}, serviceWorkers: 'block', acceptDownloads: false});
    if (typeof context.routeWebSocket !== 'function') throw new Error('Installed Playwright lacks WebSocket interception');
    await context.routeWebSocket('**/*', socket => socket.close());
    const origin = options.url ? approvedOrigin(options.url) : null;
    const fixtureUrl = pathToFileURL(fixture).href;
    await context.route('**/*', async route => {
      const request = route.request();
      let permitted = false;
      try {
        const u = new URL(request.url());
        if (!page || request.frame().page() !== page) {
          failBoundary();
        } else {
          permitted = ['GET', 'HEAD'].includes(request.method()) && (origin ? u.origin === origin && !u.username && !u.password : u.href === fixtureUrl);
        }
      } catch { failBoundary(); } // Includes requests without an identifiable frame.
      if (permitted && !origin) {
        await route.continue();
      } else if (permitted) {
        const headers = {...request.headers()};
        delete headers.authorization;
        delete headers['proxy-authorization'];
        // The API request context shares cookies with the browser. An explicit empty
        // cookie header prevents those cookies from being attached to this request.
        headers.cookie = '';
        try {
          const response = await route.fetch({headers, maxRedirects: 0, timeout: 15000});
          const responseHeaders = {...response.headers()};
          delete responseHeaders['set-cookie'];
          await context.clearCookies();
          if (response.status() >= 300 && response.status() < 400) await route.abort('blockedbyclient');
          else await route.fulfill({response, headers: responseHeaders});
          await response.dispose();
        } catch {
          await context.clearCookies().catch(() => {});
          await route.abort('blockedbyclient').catch(() => {});
        }
      } else await route.abort('blockedbyclient');
    });
    page = await context.newPage();
    context.on('page', popup => {
      if (popup !== page) {
        failBoundary();
        void popup.close().catch(() => {});
      }
    });
    context.on('dialog', dialog => {
      failBoundary();
      void dialog.dismiss().catch(() => {});
    });
    const stopped = new Promise((_, reject) => {
      rejectBoundary = reject;
      timer = setTimeout(() => reject(new Error('Capture duration limit reached')), limitMs);
      const interval = setInterval(() => { if (interrupted) { clearInterval(interval); reject(new Error('Capture interrupted')); } }, 100);
      timer.unref(); interval.unref();
      page.once('close', () => { clearInterval(interval); if (!finished) reject(new Error('Capture page closed')); });
    });
    const capture = async () => {
      await page.goto(options.url || fixtureUrl, {waitUntil: 'load', timeout: 15000});
      if (options.guided) {
        process.stdout.write('Isolated capture is recording. Press Enter to finish; this does not verify the take.\n');
        await new Promise((resolve, reject) => {
          rl = createInterface({input: process.stdin, output: process.stdout});
          let entered = false;
          rl.once('line', () => { entered = true; rl.close(); resolve(); });
          rl.once('close', () => { if (!entered) reject(new Error('Capture ended without Enter')); });
        });
        if (interrupted) throw new Error('Capture interrupted');
      } else if (plan) {
        await performPlan(page, plan, (step, elapsedMs) => observed.push({step, elapsedMs}));
      } else await autoDemo(page, observed);
    };
    await Promise.race([capture(), stopped]);
    if (boundaryViolation) throw new Error('Capture surface boundary violated');
    finished = true;
    const video = page.video();
    await context.close(); context = null;
    if (boundaryViolation) throw new Error('Capture surface boundary violated');
    if (!video) throw new Error('Page video unavailable');
    const videoPath = await video.path();
    if (path.dirname(videoPath) !== output || !videoPath.endsWith('.webm')) throw new Error('Unexpected video output');
    const info = await stat(videoPath);
    if (!info.isFile() || info.size === 0) throw new Error('Video is empty');
    const clips = (await readdir(output)).filter(name => name.endsWith('.webm'));
    if (clips.length !== 1) throw new Error('Unexpected video outputs');
    const hash = createHash('sha256');
    for await (const chunk of createReadStream(videoPath)) hash.update(chunk);
    receipt.clip = {file: path.basename(videoPath), bytes: info.size, sha256: hash.digest('hex')};
    receipt.status = 'captured';
  } finally {
    clearTimeout(timer);
    if (rl) rl.close();
    if (context) await context.close().catch(() => {});
    if (browser) await browser.close().catch(() => {});
    process.removeListener('SIGINT', onSignal);
    process.removeListener('SIGTERM', onSignal);
    receipt.finishedAt = new Date().toISOString();
    receipt.elapsedMs = Date.now() - start;
    await writeFile(path.join(output, 'receipt.json'), JSON.stringify(receipt, null, 2) + '\n', {flag: 'wx'});
  }
  process.stdout.write('Capture complete; inspect the receipt and independently probe and review the clip.\n');
}

if (process.argv[1] && process.argv[1] !== '-' && existsSync(process.argv[1]) && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2)).catch(error => {
    // Do not leak local URLs, browser inputs, or request details in diagnostics.
    process.stderr.write(error instanceof PreflightError ? `${error.message}\n` : 'Capture failed or was interrupted. Check the local app, Chromium installation, and any partial receipt.\n');
    process.exitCode = 1;
  });
}
