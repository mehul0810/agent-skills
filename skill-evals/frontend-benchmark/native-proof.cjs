// Disposable real WordPress proof; dependencies and browser are supplied explicitly.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { runCLI } = require(process.env.PLAYGROUND_MODULE);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE);
(async () => {
  const out = process.env.NATIVE_PROOF_OUTPUT;
  assert(out && path.resolve(out).startsWith('/private/tmp/'), 'Use a task-owned temporary output directory');
  assert(!fs.existsSync(out), 'Use a new output directory; do not reuse stale evidence');
  fs.mkdirSync(out, { recursive: true });
  const blocks = fs.readFileSync(path.join(__dirname, 'blocks.html'), 'utf8');
  const php = `<?php require '/wordpress/wp-load.php'; $id = wp_insert_post(['post_title'=>'Native calibration','post_type'=>'page','post_status'=>'publish','post_content'=>base64_decode('${Buffer.from(blocks).toString('base64')}')]); update_option('show_on_front','page'); update_option('page_on_front',$id); echo $id;`;
  let site, browser;
  try {
    site = await runCLI({ command: 'server', port: 9418, wp: '6.8', login: true, blueprint: { steps: [{ step: 'runPHP', code: php }] } });
    browser = await chromium.launch({ executablePath: process.env.CHROME_PATH, headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    await page.goto(site.serverUrl + '/wp-admin/', { waitUntil: 'domcontentloaded', timeout: 90000 });
    // Discover the imported page through the public native REST endpoint.
    const post = await page.evaluate(async () => (await (await fetch('/wp-json/wp/v2/pages?slug=native-calibration')).json())[0]);
    assert(post?.id);
    await page.goto(site.serverUrl + `/wp-admin/post.php?post=${post.id}&action=edit`, { waitUntil: 'domcontentloaded', timeout: 90000 });
    await page.waitForFunction(() => window.wp?.data?.select('core/block-editor')?.getBlocks().length > 0);
    const dismissWelcome = async () => {
      const close = page.getByRole('button', { name: 'Close', exact: true });
      if (await close.count()) await close.first().click();
    };
    await dismissWelcome();
    const canvas = page.frameLocator('iframe[name="editor-canvas"]');
    await canvas.locator('.editor-post-title__input').fill('Native title saved through UI');
    await page.evaluate(() => {
      const store = wp.data.select('core/block-editor');
      const flatten = blocks => blocks.flatMap(b => [b, ...flatten(b.innerBlocks)]);
      const blocks = flatten(store.getBlocks());
      if (blocks.some(b => !b.isValid)) throw new Error('Invalid native block');
      wp.data.dispatch('core/block-editor').updateBlockAttributes(blocks.find(b => b.name === 'core/heading').clientId, { content: 'A native editor saved this heading' });
      wp.data.dispatch('core/block-editor').updateBlockAttributes(blocks.find(b => b.name === 'core/button').clientId, { url: '#native-saved-link' });
    });
    await page.evaluate(() => wp.data.dispatch('core/editor').savePost());
    await page.reload({ waitUntil: 'domcontentloaded', timeout: 90000 });
    await page.waitForFunction(() => window.wp?.data?.select('core/block-editor')?.getBlocks().length > 0);
    await dismissWelcome();
    assert.equal(await page.evaluate(() => wp.data.select('core/editor').getEditedPostAttribute('title')), 'Native title saved through UI');
    const saved = await page.evaluate(() => wp.data.select('core/editor').getEditedPostContent());
    assert(saved.includes('A native editor saved this heading'));
    assert(saved.includes('#native-saved-link'));
    await page.screenshot({ path: path.join(out, 'editor-reopened.png'), fullPage: true });
    // Change only this disposable site's user Global Styles, then detect merged output.
    const styles = await page.evaluate(async () => {
      const themes = await wp.apiFetch({ path: '/wp/v2/themes?status=active' });
      const id = themes[0]._links['wp:user-global-styles'][0].href.split('/').pop();
      const before = await wp.apiFetch({ path: '/wp/v2/global-styles/' + id });
      await wp.apiFetch({ path: '/wp/v2/global-styles/' + id, method: 'POST', data: { styles: { ...before.styles, color: { ...before.styles?.color, background: '#f1e2d3' } } } });
      const after = await wp.apiFetch({ path: '/wp/v2/global-styles/' + id });
      return { id, before: before.styles, after: after.styles };
    });
    assert.equal(styles.after.color.background, '#f1e2d3');
    await page.goto(site.serverUrl, { waitUntil: 'domcontentloaded', timeout: 90000 });
    assert.equal(await page.locator('.bench-page h1').textContent(), 'A native editor saved this heading');
    assert.equal(await page.locator('.bench-page .wp-block-button__link').first().getAttribute('href'), '#native-saved-link');
    const background = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    assert.equal(background, 'rgb(241, 226, 211)');
    await page.screenshot({ path: path.join(out, 'frontend-desktop.png'), fullPage: true });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({ path: path.join(out, 'frontend-mobile.png'), fullPage: true });
    await page.goto(site.serverUrl + `/wp-admin/post.php?post=${post.id}&action=edit`, { waitUntil: 'domcontentloaded', timeout: 90000 });
    await page.waitForFunction(() => typeof wp?.apiFetch === 'function');
    const restoredStyles = await page.evaluate(async ({ id, before }) => {
      await wp.apiFetch({ path: '/wp/v2/global-styles/' + id, method: 'POST', data: { styles: before } });
      return (await wp.apiFetch({ path: '/wp/v2/global-styles/' + id })).styles;
    }, styles);
    assert.deepEqual(restoredStyles, styles.before);
    await page.goto(site.serverUrl, { waitUntil: 'domcontentloaded', timeout: 90000 });
    const restoredBackground = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    assert.notEqual(restoredBackground, background);
    fs.writeFileSync(path.join(out, 'result.json'), JSON.stringify({ status: 'passed', scope: 'native persistence and style restoration only', authorUiStatus: 'blocked', visualFidelityStatus: 'not evaluated', wordpress: '6.8', cli: '3.1.53', postId: post.id, saved, styles, background, restoredStyles, restoredBackground, limitations: ['Title entry uses real editor UI; heading/link changes and saving use Gutenberg data dispatch. UI Save click did not settle within 30 seconds in a prior attempt, so UI-only saving is not proven.', 'Disposable default theme only; no supplied design fidelity assertion.'] }, null, 2));
  } finally {
    if (browser) await browser.close();
    if (site) await site[Symbol.asyncDispose]();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
