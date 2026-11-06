const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const dir = process.argv[2];
  const shots = [
    ['/', 1440, 'home-desktop', true], ['/', 390, 'home-mobile', true],
    ['/services/panel-upgrades/', 1440, 'svc', true], ['/electrician-auburn-ca/', 1440, 'city', true],
    ['/electrician-auburn-ca/', 390, 'city-mobile', false],
  ];
  for (const [u, w, n, full] of shots) {
    const p = await b.newPage({ viewport: { width: w, height: 900 } });
    await p.goto('http://localhost:8080' + u, { waitUntil: 'networkidle' });
    await p.waitForTimeout(3200);
    await p.screenshot({ path: `${dir}/${n}.png`, fullPage: full });
    await p.close();
  }
  await b.close();
})();
