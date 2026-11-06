// Renders favicon PNGs, logo and the Open Graph image with Playwright.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const out = path.join(__dirname, '..', 'assets');
const fonts = `<link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@75..125,500..900&family=Atkinson+Hyperlegible:wght@400;700&display=swap" rel="stylesheet">`;
const mark = (s) => `<svg width="${s}" height="${s}" viewBox="-2 -1 44 46"><path d="M4 4h32v20c0 9-7 15-16 18C11 39 4 33 4 24Z" fill="#1E3B2F" stroke="#F3C433" stroke-width="2.5"/><text x="20" y="28" text-anchor="middle" font-family="Archivo" font-weight="900" font-size="15" fill="#F3C433">80</text></svg>`;
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  for (const [name, s, bg] of [['favicon-32.png', 32, 'transparent'], ['apple-touch-icon.png', 180, '#F2F3EE'], ['icon-192.png', 192, '#F2F3EE'], ['icon-512.png', 512, '#F2F3EE'], ['logo.png', 512, '#F2F3EE']]) {
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
