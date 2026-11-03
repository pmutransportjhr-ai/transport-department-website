#!/usr/bin/env node
'use strict';

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject'
};
const server = http.createServer((req, res) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://127.0.0.1').pathname); }
  catch { res.writeHead(400).end(); return; }

  if (pathname === '/security' || pathname.startsWith('/security/')) {
    res.writeHead(404).end('Not Found'); return;
  }
  if (/(^|\/)\.(?!well-known(?:\/|$))/.test(pathname)) {
    res.writeHead(403).end('Forbidden'); return;
  }

  if (pathname === '/') pathname = '/index.html';
  let target = path.resolve(root, '.' + pathname);
  if (target !== root && !target.startsWith(root + path.sep)) {
    res.writeHead(403).end('Forbidden'); return;
  }
  try {
    if (fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');
    const body = fs.readFileSync(target);
    res.writeHead(200, {
      'Content-Type': types[path.extname(target).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-store'
    });
    res.end(body);
  } catch {
    res.writeHead(404).end('Not Found');
  }
});

function assert(condition, message) {
  if (!condition) throw new Error(message);
  console.log('PASS:', message);
}

(async () => {
  await new Promise((resolve) => server.listen(4173, '127.0.0.1', resolve));
  let browserInstance;
  try {
    browserInstance = await chromium.launch({ headless: true });
    const page = await browserInstance.newPage({ viewport: { width: 390, height: 844 } });
    const pageErrors = [];
    const localFailures = [];
    page.on('pageerror', error => pageErrors.push(error.message));
    page.on('requestfailed', request => {
      if (request.url().startsWith('http://127.0.0.1:4173/')) {
        localFailures.push(request.url() + ' — ' + (request.failure()?.errorText || 'request failed'));
      }
    });
    await page.route('**/*', route => {
      const url = new URL(route.request().url());
      if (url.hostname === '127.0.0.1' || url.hostname === 'localhost') return route.continue();
      return route.abort();
    });

    const response = await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' });
    assert(response && response.status() === 200, 'Homepage returns HTTP 200');
    await page.waitForSelector('#mainNavbar .navbar-nav', { state: 'attached' });
    await page.waitForSelector('.scheme-card-col');

    assert(await page.locator('.scheme-card-col').count() === 3, 'Homepage renders exactly three road-safety/scheme cards');
    const schemeText = (await page.locator('.scheme-card-col').allTextContents()).join(' ');
    assert(schemeText.includes('Gram Gadi Yojna'), 'Gram Gadi Yojna card is present');
    assert(schemeText.includes('Good Samaritan Policy'), 'Good Samaritan Policy card is present');
    assert(schemeText.includes('Vehicle Scrappage Facility'), 'Vehicle Scrappage Facility card is present');
    assert(!schemeText.includes('IRC Road Safety Signs'), 'Fourth scheme card is absent from rendered homepage');
    assert(await page.locator('.social-media-section').count() === 0, 'Official Social Media Hub section is absent from rendered homepage');
    assert(await page.locator('#social-media-container').count() === 0, 'Social Media renderer target is absent from rendered homepage');

    const menuButton = page.locator('.navbar-toggler');
    assert(await menuButton.isVisible(), 'Mobile navigation toggle is visible at 390px');
    await menuButton.click();
    await page.waitForFunction(() => document.querySelector('#mainNavbar')?.classList.contains('show'));
    assert(true, 'Mobile navigation expands when toggle is clicked');

    const dropdownToggle = page.locator('#mainNavbar .dropdown-toggle').first();
    if (await dropdownToggle.count()) {
      await dropdownToggle.click();
      await page.waitForFunction(() => !!document.querySelector('#mainNavbar .dropdown-menu.show'));
      assert(true, 'Mobile navigation dropdown opens');
    }

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.waitForTimeout(150);
    assert(!(await menuButton.isVisible()), 'Mobile navigation toggle is hidden at desktop width');
    assert(await page.locator('#mainNavbar').isVisible(), 'Desktop navigation is visible');

    const brokenLocalImages = await page.locator('img').evaluateAll(images => images
      .filter(img => img.currentSrc.startsWith(location.origin) && img.complete && img.naturalWidth === 0)
      .map(img => img.getAttribute('src')));
    assert(brokenLocalImages.length === 0, 'No broken local homepage images' + (brokenLocalImages.length ? ': ' + brokenLocalImages.join(', ') : ''));

    assert(localFailures.length === 0, 'No failed local asset requests' + (localFailures.length ? ': ' + localFailures.join('; ') : ''));
    assert(pageErrors.length === 0, 'No uncaught browser page errors' + (pageErrors.length ? ': ' + pageErrors.join('; ') : ''));

    console.log('Browser regression completed at 390px and 1440px.');
  } finally {
    if (browserInstance) await browserInstance.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
