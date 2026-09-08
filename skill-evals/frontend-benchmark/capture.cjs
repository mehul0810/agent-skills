// Offline browser fixture capture, not a WordPress runtime test.
const { createServer } = require('node:http');
const { readFileSync, mkdirSync, writeFileSync } = require('node:fs');
const { resolve } = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const output = resolve(process.env.BENCH_OUTPUT || 'output/playwright/frontend-benchmark');
const server = createServer((req, res) => {
 const path = new URL(req.url, 'http://localhost').pathname;
 if (!['/', '/index.html', '/blocks.html'].includes(path)) { res.writeHead(404).end(); return; }
 res.setHeader('Content-Type', 'text/html; charset=utf-8');
 res.end(readFileSync(resolve(__dirname, path === '/' ? 'index.html' : path.slice(1))));
});
(async () => {
 await new Promise((resolve, reject) => {
  server.once('error', reject);
  server.listen(0, '127.0.0.1', resolve);
 });
 let browser;
 try {
  browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
  mkdirSync(output, { recursive: true });
  const evidence = { browser: browser.version(), kind: 'source-aware fixture smoke; independent grading pending', results: [] };
  for (const variant of ['a','b','c','d','e','f','g','h','i','j']) {
   for (const width of [1280,768,390]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.goto(`http://127.0.0.1:${server.address().port}/?variant=${variant}`);
    await page.locator('h1').waitFor();
    await page.screenshot({ path: `${output}/${variant}-${width}.png`, fullPage: true });
    const geometry = await page.evaluate(() => ({
     overflow: document.documentElement.scrollWidth > innerWidth,
     buttonTops: [...document.querySelectorAll('.wp-block-button__link')].map(el => el.getBoundingClientRect().top)
    }));
    await page.getByLabel('Page heading', {exact:true}).fill('A changed routine');
    await page.getByRole('button', {name:'Save heading'}).click();
    await page.reload();
    await page.locator('h1').waitFor();
    const persisted = await page.locator('h1').textContent() === 'A changed routine';
    evidence.results.push({variant, width, ...geometry, persisted});
    if (geometry.overflow !== ((variant === 'd' && width === 390) || (variant === 'j' && width === 768))) throw Error(`Overflow mismatch ${variant} ${width}`);
    if (persisted !== (variant !== 'e')) throw Error(`Persistence mismatch ${variant} ${width}`);
    if (width === 1280 && (Math.abs(geometry.buttonTops[0]-geometry.buttonTops[1]) > 1) !== (variant === 'c')) throw Error(`Alignment mismatch ${variant}`);
    await page.close();
   }
  }
  writeFileSync(`${output}/smoke.json`, JSON.stringify(evidence,null,2)+'\n');
  console.log(`Captured 30 screenshots and passed fixture smoke assertions: ${output}`);
 } finally { if (browser) await browser.close(); server.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; server.close(); });
