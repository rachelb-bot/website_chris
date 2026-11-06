// Builds tools/og.html from the built home page (route scene + badge); make-images.cjs renders it to assets/og.png.
import { readFileSync, writeFileSync } from 'node:fs';
const h = readFileSync('dist/index.html', 'utf8');
const svg = h.match(/<svg class="rp-svg[\s\S]*?<\/svg>/)[0].replace('rp-svg rp-animate', 'rp-svg');
const sprite = h.match(/<svg class="sprite"[\s\S]*?<\/svg>/)[0];
const logo = 'data:image/png;base64,' + readFileSync('assets/logo-off80-300.png').toString('base64');
const css = readFileSync('assets/styles.css', 'utf8');
writeFileSync('tools/og.html', `<html><head><!--FONTS--><style>${css}
body{background:linear-gradient(180deg,#0F2423,#16302F);margin:0;width:1200px;height:630px;overflow:hidden;color:#F2EBDA;border-bottom:8px solid #B9481F}
.og{padding:54px 64px 0;position:relative}.og h1{font:400 74px/1 'Alfa Slab One';color:#E7CF97;margin:0 0 16px}
.og p{font:400 26px Archivo;color:#AFBDB6;margin:0}.og .rp-svg{margin:-30px 0 0 -40px;width:1220px}
.og .badge{position:absolute;right:56px;top:34px;width:200px;height:200px}</style></head>
<body>${sprite}<div class=og><h1>Electrical work,<br>anywhere off 80.</h1><p>Licensed electrician, Sacramento to Colfax and Grass Valley</p><img class=badge src="${logo}">${svg}</div></body></html>`);
console.log('Wrote tools/og.html');
