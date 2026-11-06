// Builds a claude.ai-artifact-friendly copy of dist/: relative links, inert form, preview banner.
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, readdirSync, statSync } from 'node:fs';
import { join, relative, dirname, posix } from 'node:path';
const SRC = 'dist', OUT = process.argv[2];
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
cpSync(join(SRC, 'assets'), join(OUT, 'assets'), { recursive: true });
cpSync(join(SRC, 'favicon.svg'), join(OUT, 'favicon.svg'));
const banner = `<div style="background:#F3C433;color:#22302A;font:600 15px/1.4 Archivo,system-ui,sans-serif;padding:8px max(16px, env(safe-area-inset-left, 0px));text-align:center">Website preview. The email address is still a placeholder.</div>`;
const formScript = `<script>document.addEventListener('submit',function(e){e.preventDefault();var f=e.target;f.innerHTML='<p style="grid-column:1/-1;font-size:1.2rem;font-weight:700">Preview only. On the live site this sends your request to Chris, and a confirmation email comes from info@off80electric.com. If you can’t find it, check your spam folder.</p>';});</script>`;
const files = [];
(function walk(d) { for (const f of readdirSync(d)) { const p = join(d, f); if (statSync(p).isDirectory()) { if (f !== 'assets') walk(p); } else if (f.endsWith('.html')) files.push(p); } })(SRC);
for (const file of files) {
  const rel = relative(SRC, file).split('\\').join('/');           // e.g. services/panel-upgrades/index.html
  const dir = posix.dirname(rel) === '.' ? '' : posix.dirname(rel);
  const toRel = (target) => {                                       // target like /services/x/ or /assets/a.css or /
    let [path, hash = ''] = target.split('#');
    if (path.endsWith('/')) path += 'index.html';
    let r = posix.relative(dir || '.', path.replace(/^\//, '')) || 'index.html';
    return r + (hash ? '#' + hash : '');
  };
  let h = readFileSync(file, 'utf8');
  h = h.replace(/(href|src|action)="(\/[^"]*)"/g, (m, a, t) => `${a}="${toRel(t)}"`);
  h = h.replace(/<a class="skip"/, banner + '<a class="skip"');
  h = h.replace('</body>', formScript + '</body>');
  if (rel === 'index.html') {
    // The artifact host wraps the main page in its own document skeleton.
    h = h.replace(/^<!doctype html>\s*<html[^>]*>\s*<head>/i, '').replace(/<\/head>\s*<body[^>]*>/i, '').replace(/<\/body>\s*<\/html>\s*$/i, '');
  }
  mkdirSync(join(OUT, dirname(rel)), { recursive: true });
  writeFileSync(join(OUT, rel), h);
}
console.log(files.length, 'pages');
