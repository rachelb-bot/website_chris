// Renders favicon PNGs, logo and the Open Graph image with Playwright.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const out = path.join(__dirname, '..', 'assets');
const fonts = `<link href="https://fonts.googleapis.com/css2?family=Alfa+Slab+One&family=Archivo:wdth,wght@75..125,400..900&display=swap" rel="stylesheet">`;
const site = fs.readFileSync(path.join(__dirname, '..', 'dist', 'index.html'), 'utf8');
const small = site.match(/<svg class="logo-mark"[\s\S]*?<\/svg>/)[0];
const big = small;
const mark = (s) => (s >= 180 ? big : small).replace(/class="[^"]*"/, `width="${s}" height="${s}"`);
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  for (const [name, s, bg] of [['favicon-32.png', 32, 'transparent'], ['apple-touch-icon.png', 180, '#F0EDE5'], ['icon-192.png', 192, '#F0EDE5'], ['icon-512.png', 512, '#F0EDE5'], ['logo.png', 512, 'transparent']]) {
    await p.setViewportSize({ width: s, height: s });
    await p.setContent(`<html><head>${fonts}</head><body style="margin:0;background:${bg};display:grid;place-items:center;height:${s}px">${mark(Math.round(s * (bg === 'transparent' ? 1 : 0.8)))}</body></html>`);
    await p.waitForTimeout(600);
    await p.screenshot({ path: path.join(out, name), omitBackground: bg === 'transparent' });
  }
  await p.setViewportSize({ width: 1200, height: 630 });
  const html = fs.readFileSync(path.join(__dirname, 'og.html'), 'utf8');
  await p.setContent(html.replace('<!--FONTS-->', fonts));
  await p.waitForTimeout(1200);
  await p.screenshot({ path: path.join(out, 'og.png') });
  await b.close();
})();
