// Draws the round badge logo as SVG: night sky, lightning bolt striking a snowy peak, pines,
// rust rings and slab lettering. Writes one file per name to assets/.
// Usage: node tools/make-logo.mjs
import { writeFileSync } from 'node:fs';

const C = {
  ring: '#1B3735', rust: '#C2552A', tan: '#E9D3A0', ink: '#0F2322',
  sky1: '#27474F', sky2: '#122A2E', cloud: '#5F7F86', snow: '#EEF3F4', snowShade: '#9DB4BE', rock: '#5D7682', pine: '#0D2220', pine2: '#17322F',
};

let seed = 11;
const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const f = (n) => n.toFixed(1);

// Pine: stacked tiers that narrow toward the top
const pine = (x, base, h, fill) => {
  const w = h * 0.42, tiers = 5;
  let d = `M${f(x - 1.5)},${f(base)}h3v${f(-h * 0.12)}h-3z`;
  for (let i = 0; i < tiers; i++) {
    const tb = base - h * 0.1 - (i * h * 0.85) / tiers;
    const tw = w * (1 - i / (tiers + 1.2));
    const tt = tb - (h * 0.9) / tiers - h * 0.08;
    d += `M${f(x - tw / 2)},${f(tb)}L${f(x)},${f(tt)}L${f(x + tw / 2)},${f(tb)}Z`;
  }
  return `<path d="${d}" fill="${fill}"/>`;
};

export function badge({ top = 'NORTHERN SPARK', bottom = 'ELECTRIC', left = 'LICENSED', right = 'INSURED', id = 'b', topSpacing = 3, topSize = 37 } = {}) {
  const cx = 200, cy = 200;
  const stars = Array.from({ length: 46 }, () => {
    const x = 75 + rnd() * 250, y = 80 + rnd() * 110, r = rnd() < 0.15 ? 1.4 : 0.7;
    return `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="#fff" opacity="${f(0.4 + rnd() * 0.6)}"/>`;
  }).join('');
  // Wispy cloud bands
  const clouds = Array.from({ length: 9 }, (_, i) => {
    const y = 108 + i * 11 + rnd() * 6, x = 60 + rnd() * 120, w = 90 + rnd() * 140;
    return `<path d="M${f(x)},${f(y)} q${f(w * 0.25)},${f(-8 - rnd() * 6)} ${f(w * 0.5)},0 t${f(w * 0.5)},0" stroke="${C.cloud}" stroke-width="${f(2 + rnd() * 4)}" fill="none" stroke-linecap="round" opacity="${f(0.25 + rnd() * 0.35)}"/>`;
  }).join('');
  const backTrees = Array.from({ length: 22 }, (_, i) => pine(70 + i * 12.5 + rnd() * 5, 300 + rnd() * 6, 22 + rnd() * 14, C.pine2)).join('');
  const frontLeft = [[78, 335, 92], [96, 340, 70], [112, 338, 104], [130, 342, 66], [146, 345, 82]].map(([x, b, h]) => pine(x, b, h, C.pine)).join('');
  const frontRight = [[258, 345, 70], [274, 342, 96], [292, 340, 78], [308, 338, 110], [326, 336, 84]].map(([x, b, h]) => pine(x, b, h, C.pine)).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" role="img" aria-label="${top} ${bottom}">
  <defs>
    <radialGradient id="${id}-sky" cx="40%" cy="30%" r="80%"><stop offset="0" stop-color="${C.sky1}"/><stop offset="1" stop-color="${C.sky2}"/></radialGradient>
    <radialGradient id="${id}-moon" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#FFF1C4" stop-opacity=".9"/><stop offset=".25" stop-color="#F3D98E" stop-opacity=".45"/><stop offset="1" stop-color="#F3D98E" stop-opacity="0"/></radialGradient>
    <radialGradient id="${id}-flash" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
    <linearGradient id="${id}-snow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.snow}"/><stop offset=".55" stop-color="#C9D7DD"/><stop offset="1" stop-color="${C.rock}"/></linearGradient>
    <clipPath id="${id}-scene"><circle cx="${cx}" cy="${cy}" r="131"/></clipPath>
    <path id="${id}-top" d="M${cx - 154},${cy} A154,154 0 0 1 ${cx + 154},${cy}"/>
    <path id="${id}-bot" d="M${cx - 178},${cy} A178,178 0 0 0 ${cx + 178},${cy}"/>
  </defs>

  <!-- Outer ring and lettering band -->
  <circle cx="${cx}" cy="${cy}" r="197" fill="${C.ring}"/>
  <circle cx="${cx}" cy="${cy}" r="190" fill="none" stroke="${C.rust}" stroke-width="6"/>
  <circle cx="${cx}" cy="${cy}" r="136" fill="none" stroke="${C.rust}" stroke-width="7"/>
  <text font-family="'Alfa Slab One', Rockwell, 'Roboto Slab', Georgia, serif" font-size="${topSize}" fill="${C.tan}" letter-spacing="${topSpacing}"><textPath href="#${id}-top" startOffset="50%" text-anchor="middle">${top}</textPath></text>
  <text font-family="'Alfa Slab One', Rockwell, 'Roboto Slab', Georgia, serif" font-size="37" fill="${C.tan}" letter-spacing="16"><textPath href="#${id}-bot" startOffset="50%" text-anchor="middle">${bottom}</textPath></text>

  <!-- Side tabs -->
  ${[[-1, left], [1, right]].map(([s, t]) => {
    const x0 = cx + s * 139, x1 = cx + s * 189, xa = Math.min(x0, x1);
    return `<rect x="${xa}" y="${cy - 13}" width="50" height="26" fill="${C.ring}"/>
    <path d="M${x0},${cy - 13}H${x1}M${x0},${cy + 13}H${x1}" stroke="${C.rust}" stroke-width="3.5"/>
    <text x="${(x0 + x1) / 2}" y="${cy + 3}" text-anchor="middle" font-family="Archivo, Arial, sans-serif" font-weight="700" font-size="7" letter-spacing=".8" fill="${C.tan}">${t}</text>`;
  }).join('')}

  <!-- Scene -->
  <g clip-path="url(#${id}-scene)">
    <rect x="60" y="60" width="280" height="280" fill="url(#${id}-sky)"/>
    ${stars}
    <circle cx="146" cy="128" r="34" fill="url(#${id}-moon)"/>
    <circle cx="146" cy="128" r="8.5" fill="#FFF4D2"/>
    ${clouds}
    <circle cx="212" cy="158" r="52" fill="url(#${id}-flash)"/>

    <!-- Far range -->
    <path d="M60,250 L95,226 L118,238 L150,205 L176,230 L196,214 L238,236 L262,212 L292,232 L318,214 L340,232 V340 H60Z" fill="#3D5964" opacity=".85"/>
    <path d="M150,205 L141,216 L150,213 L156,219Z M262,212 L254,222 L262,219 L268,225Z M318,214 L311,223 L318,221 L323,226Z" fill="${C.snow}" opacity=".7"/>

    <!-- Main peak, with its shaded face -->
    <path d="M112,300 L166,232 L182,240 L213,158 L246,226 L262,220 L318,300Z" fill="url(#${id}-snow)"/>
    <path d="M213,158 L226,204 L219,232 L238,266 L234,300 L318,300 L262,220 L246,226Z" fill="${C.snowShade}" opacity=".75"/>
    <path d="M213,158 L204,192 L211,188 L201,218 L209,214 L194,254" fill="none" stroke="#7F98A3" stroke-width="2" opacity=".7"/>
    <path d="M168,238 L162,252 L170,250 L160,270M262,226 L270,244 L264,242 L274,262" fill="none" stroke="#7F98A3" stroke-width="1.6" opacity=".7"/>

    <!-- Side peaks -->
    <path d="M64,300 L104,252 L124,266 L146,246 L186,300Z" fill="url(#${id}-snow)"/>
    <path d="M146,246 L156,270 L150,300 L186,300Z M104,252 L112,276 L106,300 L124,300 L124,266Z" fill="${C.snowShade}" opacity=".7"/>
    <path d="M232,300 L276,250 L294,262 L312,244 L344,300Z" fill="url(#${id}-snow)"/>
    <path d="M312,244 L322,268 L316,300 L344,300Z M276,250 L284,272 L278,300 L294,300 L294,262Z" fill="${C.snowShade}" opacity=".7"/>

    <!-- Lightning bolt striking the main peak -->
    <path d="M230,66 L203,116 L220,113 L207,160 L244,104 L226,107 L246,66Z" fill="#fff" stroke="#E9F2F5" stroke-width="1.5" stroke-linejoin="round"/>
    <path d="M207,158 L201,168 M211,158 L219,166" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".85"/>

    ${backTrees}
    <rect x="60" y="306" width="280" height="40" fill="${C.ink}"/>
    ${frontLeft}${frontRight}
  </g>
</svg>`;
}

const variants = [
  { file: 'assets/logo-northern-spark.svg', top: 'NORTHERN SPARK', bottom: 'ELECTRIC', id: 'ns' },
  { file: 'assets/logo-off80.svg', top: 'OFF 80', bottom: 'ELECTRIC', id: 'o80', topSpacing: 11, topSize: 46 },
];
for (const v of variants) { seed = 11; writeFileSync(v.file, badge(v)); }
console.log('Wrote', variants.map((v) => v.file).join(', '));
