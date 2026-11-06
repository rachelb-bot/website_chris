// Static site generator for Off 80 Electric.
// Usage: node build.mjs   → writes the finished site to ./dist
import { mkdirSync, writeFileSync, cpSync, rmSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { business as B, fullUrl } from './src/config.mjs';
import { services, serviceBySlug } from './src/services.mjs';
import { cities, cityUrl } from './src/cities.mjs';
import { generalFaqs } from './src/faqs.mjs';
import { guides, guideTopics, guideUrl, guideBySlug } from './src/guides.mjs';
import { glossary } from './src/glossary.mjs';
import { icon, iconSprite } from './src/icons.mjs';

const OUT = 'dist';
const TODAY = new Date().toISOString().slice(0, 10);
const MONTH = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
const firstSentence = (t) => { const parts = t.match(/[^.!?]+[.!?]+(\s|$)/g) || [t]; return (parts[0].length < 60 && parts[1] ? parts[0] + parts[1] : parts[0]).trim(); };
const slugify = (t) => t.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const toc = (items) => `<nav class="toc" aria-label="On this page"><span class="toc-h">On this page</span><ul>${items.map(([id, t]) => `<li><a href="#${id}">${esc(t)}</a></li>`).join('')}</ul></nav>`;
const medal = (name) => `<div class="medal" aria-hidden="true">${icon(name, 'medal-ic')}</div>`;
const ticks = (list) => `<ul class="ticks">${list.map((x) => `<li>${icon('check', 'tick')}<span>${esc(x)}</span></li>`).join('')}</ul>`;
const guidesFor = (slug) => guides.filter((g) => g.services.includes(slug));
const pages = []; // for sitemap

// ───────────── helpers ─────────────
const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const fmt = (n) => n.toLocaleString('en-US');
const svcUrl = (s) => `/services/${s.slug}/`;
const withThe = (t) => /^(City|Town)\b/.test(t) ? 'the ' + t : t;
const telHref = `tel:${B.phoneE164}`;
const jsonld = (obj) => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`;
const write = (path, html) => {
  const file = join(OUT, path.endsWith('/') ? path + 'index.html' : path);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
};
const routeCities = cities.filter((c) => c.route !== null && c.route !== undefined).sort((a, b) => a.route - b.route);
const spurCities = cities.filter((c) => c.spur !== undefined).sort((a, b) => a.spur - b.spur);
const offRoute = cities.filter((c) => (c.route === null || c.route === undefined) && c.spur === undefined);
const byUtility = (u) => cities.filter((c) => c.utility.startsWith(u));
const BIZ_ID = fullUrl('/#business');

// ───────────── schema.org ─────────────
const businessSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Electrician',
  '@id': BIZ_ID,
  name: B.name,
  ...(B.formerly ? { alternateName: B.formerly } : {}),
  description: `${B.name} is a licensed C-10 electrical contractor based in ${B.city}, California, serving the I-80 corridor from Sacramento to Colfax, plus Grass Valley, Nevada City, Folsom and El Dorado Hills.`,
  url: fullUrl('/'),
  telephone: B.phoneE164,
  email: B.email,
  image: fullUrl('/assets/og.png'),
  logo: fullUrl('/assets/logo-off80.png'),
  priceRange: '$$',
  founder: { '@type': 'Person', name: B.owner, jobTitle: 'Owner and licensed electrician' },
  address: {
    '@type': 'PostalAddress',
    ...(B.street ? { streetAddress: B.street } : {}),
    addressLocality: B.city, addressRegion: B.region, postalCode: B.zip, addressCountry: 'US',
  },
  geo: { '@type': 'GeoCoordinates', latitude: B.lat, longitude: B.lng },
  areaServed: [
    ...cities.map((c) => ({ '@type': 'City', name: `${c.name}, CA`, containedInPlace: { '@type': 'AdministrativeArea', name: c.county } })),
    ...['Placer County', 'Sacramento County', 'Nevada County', 'El Dorado County'].map((n) => ({ '@type': 'AdministrativeArea', name: `${n}, CA` })),
  ],
  openingHoursSpecification: B.hours.map((h) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: h.days, opens: h.opens, closes: h.closes })),
  hasCredential: { '@type': 'EducationalOccupationalCredential', credentialCategory: 'license', name: 'California C-10 Electrical Contractor License', recognizedBy: { '@type': 'GovernmentOrganization', name: 'Contractors State License Board' } },
  knowsAbout: services.map((s) => s.name),
  hasOfferCatalog: {
    '@type': 'OfferCatalog', name: 'Electrical services',
    itemListElement: services.map((s) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: s.name, url: fullUrl(svcUrl(s)) } })),
  },
  sameAs: [B.googleBusinessUrl, B.yelpUrl, B.facebookUrl, B.nextdoorUrl].filter(Boolean),
});
const websiteSchema = () => ({ '@context': 'https://schema.org', '@type': 'WebSite', '@id': fullUrl('/#website'), url: fullUrl('/'), name: B.name, publisher: { '@id': BIZ_ID } });
const faqSchema = (faqs) => faqs.length ? ({
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
}) : null;
const crumbSchema = (crumbs) => ({
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: fullUrl(c.url) })),
});

// ───────────── route profile (the signature element) ─────────────
// Draws I-80 as a wire climbing from Sacramento to Colfax, with the Hwy 49 spur to Grass Valley.
function routeProfile({ current = null, animate = false } = {}) {
  const W = 1200, H = 440, L = 96, R = 70, base = 372, top = 70, maxE = 2600;
  const step = (W - L - R) / (routeCities.length - 1);
  const X = (i) => L + i * step;
  const Y = (e) => base - (e / maxE) * (base - top);
  const pts = routeCities.map((c, i) => [X(i), Y(c.elev)]);
  const auburnIdx = routeCities.findIndex((c) => c.slug === 'auburn');
  const spurPts = [pts[auburnIdx], ...spurCities.map((c, i) => [X(auburnIdx + 1 + i), Y(c.elev)])];

  // Catmull-Rom → cubic Bézier for a smooth, cable-like line
  const smooth = (p) => {
    let d = `M${p[0][0].toFixed(1)},${p[0][1].toFixed(1)}`;
    for (let i = 0; i < p.length - 1; i++) {
      const p0 = p[i - 1] || p[i], p1 = p[i], p2 = p[i + 1], p3 = p[i + 2] || p2;
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
    }
    return d;
  };
  const mainD = smooth(pts);
  const spurD = 'M' + spurPts.map((p) => p.map((n) => n.toFixed(1)).join(',')).join(' L');
  const groundD = `${mainD} L${W + 200},${Y(2700)} L${W + 200},${H + 400} L${-200},${H + 400} L${-200},${pts[0][1]} Z`;
  // Far Sierra crest (decorative backdrop, rises behind Colfax) and a field of stars
  const far = `M-200,${Y(900)} L80,${Y(1500)} L260,${Y(1150)} L430,${Y(1900)} L560,${Y(1500)} L700,${Y(2300)} L820,${Y(1900)} L960,${Y(2950)} L1060,${Y(2500)} L1170,${Y(3350)} L1290,${Y(2700)} L1400,${Y(3100)} L1400,${H + 400} L-200,${H + 400} Z`;
  const caps = [[700, 2300], [960, 2950], [1170, 3350], [1400, 3100]].map(([x, e]) => { const y = Y(e); return `M${x - 34},${y + 30} L${x},${y} L${x + 34},${y + 30} L${x + 16},${y + 24} L${x},${y + 32} L${x - 14},${y + 23}Z`; }).join(' ');
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const stars = Array.from({ length: 70 }, () => { const x = rnd() * W, y = rnd() * (H * 0.45) - 40, r = rnd() < 0.15 ? 1.6 : 0.9; return `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${r}"/>`; }).join('');


  const stop = (c, x, y, i, above) => {
    const isCur = current === c.slug;
    // Labels sit above, or below-right: the wire always climbs to the right, so that corner stays clear
    const ly = above ? y - 22 : y + 30;
    const lx = above ? x : x + 12;
    const anchor = above ? 'middle' : 'start';
    const cls = ['rp-stop', c.home ? 'is-home' : '', isCur ? 'is-current' : ''].join(' ');
    return `<a href="${cityUrl(c)}" class="${cls}" style="--i:${i}" aria-label="Electrician in ${esc(c.name)}">
      ${c.home ? `<circle class="rp-halo" cx="${x}" cy="${y}" r="17"/>` : ''}
      <circle class="rp-dot" cx="${x}" cy="${y}" r="${c.home || isCur ? 8 : 6}"/>
      <text class="rp-name" x="${lx}" y="${ly}" text-anchor="${anchor}">${esc(c.name)}</text>
      ${c.home ? `<text class="rp-elev" x="${lx}" y="${ly + 17}" text-anchor="${anchor}">Home base</text>` : ''}
    </a>`;
  };

  const svg = `<svg class="rp-svg${animate ? ' rp-animate' : ''}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="rp-title rp-desc">
    <title id="rp-title">Service route along Interstate 80</title>
    <desc id="rp-desc">Towns served along Interstate 80, from Sacramento in the valley up into the Sierra foothills at Colfax, with Highway 49 branching from Auburn to Grass Valley and Nevada City.</desc>
    <g class="rp-stars">${stars}</g>
    <path class="rp-far" d="${far}"/>
    <path class="rp-snow" d="${caps}"/>
    <path class="rp-ground" d="${groundD}"/>
    <path class="rp-spur" d="${spurD}" pathLength="1"/>
    <path class="rp-wire" d="${mainD}" pathLength="1"/>
    <text class="rp-road" x="${(pts[1][0] + pts[2][0]) / 2}" y="${Y(900)}" text-anchor="middle">I-80 east</text>
    <text class="rp-road" x="${(spurPts[0][0] + spurPts[1][0]) / 2 - 16}" y="${(spurPts[0][1] + spurPts[1][1]) / 2}" text-anchor="end">Hwy 49 north</text>
    ${routeCities.map((c, i) => stop(c, pts[i][0], pts[i][1], i, i === routeCities.length - 1)).join('')}
    ${spurCities.map((c, i) => stop(c, spurPts[i + 1][0], spurPts[i + 1][1], auburnIdx + 1 + i, true)).join('')}
  </svg>`;

  // Mobile/small-screen version: the same route as a vertical line
  const list = `<ol class="rp-list" aria-label="Towns along I-80, from Sacramento to Colfax">
    ${routeCities.map((c) => `<li class="${c.home ? 'is-home' : ''}${current === c.slug ? ' is-current' : ''}"><a href="${cityUrl(c)}"><span class="rp-list-name">${esc(c.name)}</span>${c.home ? '<span class="rp-list-elev">Home base</span>' : ''}</a>${c.slug === 'auburn' ? `<ol class="rp-list-spur" aria-label="Highway 49 north from Auburn">${spurCities.map((s) => `<li class="${current === s.slug ? 'is-current' : ''}"><a href="${cityUrl(s)}"><span class="rp-list-name">${esc(s.name)}</span><span class="rp-list-elev">Hwy 49</span></a></li>`).join('')}</ol>` : ''}</li>`).join('')}
  </ol>`;
  return `<div class="route-profile">${svg}${list}</div>`;
}

// ───────────── service area map ─────────────
// A stylised map drawn from real coordinates: roads, Folsom Lake and every town as a link.
const MAP = { latMax: 39.31, lngMin: -121.56, k: 990, cos: 0.777 };
const mxy = ([lat, lng]) => [(lng - MAP.lngMin) * MAP.cos * MAP.k, (MAP.latMax - lat) * MAP.k];
const mpath = (pts) => 'M' + pts.map((p) => mxy(p).map((n) => n.toFixed(1)).join(',')).join(' L');
const ROADS = {
  // (Foresthill Road and Hwy 49 south to Cool are drawn inline in areaMap)
  i80: [[38.58, -121.50], [38.62, -121.42], [38.66, -121.36], [38.70, -121.31], [38.745, -121.27], [38.79, -121.236], [38.82, -121.195], [38.85, -121.17], [38.873, -121.13], [38.90, -121.07], [38.95, -121.04], [38.985, -121.012], [39.0, -120.99], [39.06, -120.97], [39.10, -120.95], [39.2, -120.88]],
  h49: [[38.90, -121.07], [38.97, -121.068], [39.04, -121.066], [39.13, -121.07], [39.20, -121.064], [39.219, -121.061], [39.245, -121.035], [39.262, -121.016], [39.30, -120.99]],
  us50: [[38.58, -121.50], [38.57, -121.40], [38.59, -121.30], [38.63, -121.22], [38.65, -121.17], [38.665, -121.10], [38.68, -121.05], [38.70, -120.88]],
  h65: [[38.75, -121.27], [38.79, -121.29], [38.85, -121.30], [38.89, -121.29], [38.96, -121.31]],
};
const LAKE = [[38.707, -121.157], [38.73, -121.15], [38.76, -121.123], [38.79, -121.103], [38.82, -121.083], [38.845, -121.072], [38.835, -121.06], [38.80, -121.082], [38.77, -121.098], [38.74, -121.112], [38.715, -121.138]];
// Label side for each town, chosen so neighbours in the Rocklin–Auburn cluster don't collide
const LBL = { sacramento: 'r', 'citrus-heights': 'l', roseville: 'l', rocklin: 'l', loomis: 'l', penryn: 'l', newcastle: [8, 23, 'start'], auburn: 'l', 'meadow-vista': 'l', applegate: 'r', colfax: 'r', 'grass-valley': 'l', 'nevada-city': 'r', 'granite-bay': 'b', lincoln: 'l', folsom: 'b', 'el-dorado-hills': 'r', 'lake-of-the-pines': 'l',
  weimar: 'r', foresthill: 'r', cool: [12, 3, 'start'], 'penn-valley': 'l', carmichael: 'l', 'fair-oaks': 'l', orangevale: 'l', 'rancho-cordova': 'r' };
const MAP_W = 690; // viewBox width (Foresthill sits furthest east)
function areaMap({ current = null } = {}) {
  const shield = (lat, lng, label, cls = '') => { const [x, y] = mxy([lat, lng]); const w = label.length > 2 ? 34 : 28; return `<g class="map-shield ${cls}"><rect x="${(x - w / 2).toFixed(1)}" y="${(y - 11).toFixed(1)}" width="${w}" height="22" rx="5"/><text x="${x.toFixed(1)}" y="${(y + 5).toFixed(1)}" text-anchor="middle">${label}</text></g>`; };
  const ridges = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => { const pts = Array.from({ length: 9 }, (_, j) => [39.3 - j * 0.09, -121.02 + i * 0.03 - Math.sin(j * 1.3 + i) * 0.02]); return `<path class="map-ridge" d="${mpath(pts)}"/>`; }).join('');
  const towns = cities.map((c) => {
    const [x, y] = mxy([c.lat, c.lng]);
    const side = LBL[c.slug] || 'r';
    const [lx, ly, anchor] = Array.isArray(side) ? [x + side[0], y + side[1], side[2]] : side === 'l' ? [x - 11, y + 6, 'end'] : side === 'b' ? [x, y + 26, 'middle'] : [x + 11, y + 6, 'start'];
    const cls = ['map-town', c.home ? 'is-home' : '', current === c.slug ? 'is-current' : ''].join(' ');
    return `<a href="${cityUrl(c)}" class="${cls}" id="map-${c.slug}" aria-label="Electrician in ${esc(c.name)}">
      ${current === c.slug ? `<circle class="map-ring" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="16"/>` : ''}
      <circle class="map-dot" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${c.home || current === c.slug ? 8 : 6}"/>
      <text class="map-name" x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="${anchor}">${esc(c.name)}</text>
    </a>`;
  }).join('');
  return `<figure class="area-map">
  <svg viewBox="-12 -12 ${MAP_W + 12} 778" role="img" aria-labelledby="map-t map-d">
    <title id="map-t">Map of towns served by ${esc(B.name)}</title>
    <desc id="map-d">${cities.length} towns along Interstate 80 from Sacramento to Colfax, Highway 49 from Cool to Nevada City, Highway 65 to Lincoln, Highway 50 to Folsom and El Dorado Hills, and Foresthill east of Auburn.</desc>
    <defs><linearGradient id="map-hills" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#1F403E" stop-opacity="0"/><stop offset="1" stop-color="#2A504D"/></linearGradient></defs>
    <rect x="-12" y="-12" width="${MAP_W + 12}" height="778" rx="14" class="map-bg"/>
    <rect x="180" y="-12" width="${MAP_W - 180}" height="778" fill="url(#map-hills)"/>
    ${ridges}
    <text class="map-region" x="${mxy([38.98, -121.47])[0]}" y="${mxy([38.98, -121.47])[1]}">Sacramento Valley</text>
    <path class="map-lake" d="${mpath(LAKE)} Z"/>
    <text class="map-water" x="${mxy([38.79, -121.05])[0]}" y="${mxy([38.79, -121.05])[1]}">Folsom Lake</text>
    <path class="map-road minor" d="${mpath(ROADS.us50)}"/>
    <path class="map-road minor" d="${mpath(ROADS.h65)}"/>
    <path class="map-road" d="${mpath(ROADS.h49)}"/>
    <path class="map-road major" d="${mpath(ROADS.i80)}"/>
    ${shield(38.93, -121.05, '80', 'i')}${shield(39.13, -120.935, '80', 'i')}${shield(39.12, -121.07, '49')}${shield(38.565, -121.36, '50')}${shield(38.85, -121.31, '65')}
    <path class="map-road minor" d="${mpath([[38.90, -121.07], [38.93, -120.98], [38.97, -120.90], [39.0202, -120.818]])}"/>
    <path class="map-road minor" d="${mpath([[38.90, -121.07], [38.887, -121.0147], [38.86, -120.98]])}"/>
    <text class="map-region small" x="${mxy([39.2, -120.87])[0]}" y="${mxy([39.2, -120.87])[1]}" text-anchor="end">to Tahoe</text>
    ${towns}
  </svg>
</figure>`;
}

// ───────────── layout ─────────────
const nav = [
  { url: '/services/', name: 'Services', menu: 'services' },
  { url: '/service-areas/', name: 'Service areas', menu: 'areas' },
  { url: '/guides/', name: 'Guides', menu: 'guides' },
  { url: '/pricing/', name: 'Pricing' },
  { url: '/faq/', name: 'FAQ' },
  { url: '/contact/', name: 'Contact' },
];

// Drop-down menus: shown on hover and keyboard focus on desktop, as expandable sections on phones
const megaMenus = {
  services: () => `<div class="mega-grid mega-svc">
    <div><p class="mega-h">Most requested</p><ul class="mega-feat">${popular.map((s) => `<li><a href="${svcUrl(s)}">${icon(s.slug, 'mega-ic')}<span><strong>${esc(s.name)}</strong><span class="mega-sub">Typical ${esc(s.cost.range)}</span></span></a></li>`).join('')}</ul></div>
    <div><p class="mega-h">Everything else</p><ul class="mega-list two">${others.map((s) => `<li><a href="${svcUrl(s)}">${icon(s.slug, 'mega-ic-s')}<span>${esc(s.name)}</span></a></li>`).join('')}</ul></div>
  </div>
  <p class="mega-foot"><a href="/services/">All services</a><a href="/pricing/">Prices</a><a href="/contact/#quote" data-open="quote">Request a quote</a></p>`,
  areas: () => `<div class="mega-grid mega-areas">${['Placer County', 'Sacramento County', 'Nevada County', 'El Dorado County'].map((co) => `
    <div><p class="mega-h">${co}</p><ul class="mega-list${co === 'Placer County' ? ' two' : ''}">${cities.filter((c) => c.county === co).sort((a, b) => a.name.localeCompare(b.name)).map((c) => `<li><a href="${cityUrl(c)}">${esc(c.name)}</a></li>`).join('')}</ul></div>`).join('')}
  </div>
  <p class="mega-foot"><a href="/service-areas/">See the service area map</a></p>`,
  guides: () => `<div class="mega-grid mega-guides">${guideTopics.map((t) => `
    <div class="mega-topic"><a class="mega-topic-h" href="/guides/#${t.key}">${icon(t.key, 'mega-ic-s')}<span>${esc(t.name)}</span></a>
      <ul class="mega-list qs">${guides.filter((g) => g.topic === t.key).slice(0, 2).map((g) => `<li><a href="${guideUrl(g)}">${esc(g.q)}</a></li>`).join('')}</ul></div>`).join('')}
  </div>
  <p class="mega-foot"><a href="/guides/">All guides</a><a href="/glossary/">Electrical glossary</a><a href="/faq/">FAQ</a></p>`,
};

// Round badge in the spirit of the original Northern Spark truck logo: rust ring, night sky, snowy peak, bolt.
const badge = (cls = 'logo-mark', ring = false) => `<svg class="${cls}" viewBox="0 0 120 120" aria-hidden="true">
  <circle cx="60" cy="60" r="57" fill="#16302F"/>
  <circle cx="60" cy="60" r="${ring ? 55 : 52}" fill="none" stroke="#B9481F" stroke-width="${ring ? 4 : 9}"/>
  ${ring ? `<defs><path id="badge-top" d="M19,60 a41,41 0 1,1 82,0"/><path id="badge-bot" d="M11,60 a49,49 0 0,0 98,0"/></defs>
  <circle cx="60" cy="60" r="36" fill="none" stroke="#E7CF97" stroke-width="1.2"/>
  <circle cx="60" cy="60" r="34" fill="#0F2423"/>
  <text font-family="Alfa Slab One, Rockwell, serif" font-size="10.5" fill="#E7CF97" letter-spacing="1.2"><textPath href="#badge-top" startOffset="50%" text-anchor="middle">OFF 80 ELECTRIC</textPath></text>
  <text font-family="Archivo, sans-serif" font-weight="700" font-size="6.2" fill="#E7CF97" letter-spacing="1.8"><textPath href="#badge-bot" startOffset="50%" text-anchor="middle">NEWCASTLE · CALIFORNIA</textPath></text>
  <clipPath id="badge-in"><circle cx="60" cy="60" r="34"/></clipPath>
  <g clip-path="url(#badge-in)">` : `<clipPath id="badge-in-s"><circle cx="60" cy="60" r="47.5"/></clipPath><g clip-path="url(#badge-in-s)">`}
    <circle cx="${ring ? 46 : 38}" cy="${ring ? 46 : 36}" r="${ring ? 3 : 5}" fill="#E7CF97"/>
    <path d="M0,104 L30,70 L44,82 L64,52 L86,80 L98,70 L120,96 L120,120 L0,120Z" fill="#D8E3E2"/>
    <path d="M64,52 L56,64 L62,62 L60,72 L70,66 L64,66 L72,58Z" fill="#1F403E" opacity=".55"/>
    <path d="M0,112 L22,92 L38,100 L58,84 L80,98 L100,88 L120,104 L120,120 L0,120Z" fill="#1F403E"/>
    <path d="M72,${ring ? 30 : 18} L62,${ring ? 50 : 46} L70,${ring ? 49 : 45} L63,${ring ? 66 : 66} L80,${ring ? 42 : 38} L72,${ring ? 43 : 39} L78,${ring ? 30 : 18}Z" fill="#fff"/>
  </g>
</svg>`;
const logo = `<a class="logo" href="/" aria-label="${esc(B.name)} home">
  <img class="logo-badge" src="/assets/logo-off80-300.png" width="58" height="58" alt="">
  <span class="logo-word"><span class="logo-off">Off 80</span><span class="logo-elec">Electric</span></span>
</a>`;

function layout({ path, title, description, body, schema = [], crumbs = null, ogType = 'website', bodyClass = '', pageType = 'WebPage' }) {
  const canonical = fullUrl(path);
  if (description.length > 158) description = description.slice(0, 156).replace(/[\s,;:]+\S*$/, '') + '…';
  pages.push({ path, priority: path === '/' ? '1.0' : path.split('/').filter(Boolean).length === 1 ? '0.8' : '0.7' });
  const crumbHtml = crumbs ? `<nav class="crumbs wrap" aria-label="Breadcrumb"><ol>${crumbs.map((c, i) => i === crumbs.length - 1 ? `<li aria-current="page">${esc(c.name)}</li>` : `<li><a href="${c.url}">${esc(c.name)}</a></li>`).join('')}</ol></nav>` : '';
  const pageSchema = {
    '@context': 'https://schema.org', '@type': pageType, '@id': canonical + '#webpage', url: canonical, name: title, description,
    isPartOf: { '@id': fullUrl('/#website') }, about: { '@id': BIZ_ID }, inLanguage: 'en-US', dateModified: TODAY,
    // Marks the short answer at the top of every page as the part to read aloud or quote
    speakable: { '@type': 'SpeakableSpecification', cssSelector: ['h1', '.hero-answer', '.lead'] },
  };
  const allSchema = [businessSchema(), websiteSchema(), pageSchema, ...(crumbs ? [crumbSchema(crumbs)] : []), ...schema].filter(Boolean);
  return `<!doctype html>
<html lang="en-US">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
<meta name="geo.region" content="US-CA">
<meta name="geo.placename" content="${esc(B.city)}, California">
<meta name="geo.position" content="${B.lat};${B.lng}">
<meta name="ICBM" content="${B.lat}, ${B.lng}">
<meta property="og:type" content="${ogType}">
<meta property="og:site_name" content="${esc(B.name)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${fullUrl('/assets/og.png')}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="en_US">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#16302F">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/assets/favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Alfa+Slab+One&family=Archivo:ital,wdth,wght@0,75..125,400..900;1,100,400&display=swap">
<link rel="stylesheet" href="/assets/styles.css">
<script>document.documentElement.classList.add('js')</script>
${allSchema.map(jsonld).join('\n')}
</head>
<body class="${bodyClass}">
${iconSprite()}
<a class="skip" href="#main">Skip to content</a>
<div class="topbar"><div class="wrap topbar-in">
  <span>${esc(B.license)}, bonded and insured</span>
  <span class="topbar-hours">${esc(B.hoursText)}</span>
</div></div>
<header class="site-header"><div class="wrap header-in">
  ${logo}
  <button class="nav-toggle" aria-expanded="false" aria-controls="site-nav">Menu</button>
  <nav id="site-nav" class="site-nav" aria-label="Main">
    <ul class="nav-list">${nav.map((n) => n.menu ? `<li class="has-menu"><a class="nav-top" href="${n.url}"${path.startsWith(n.url) ? ' aria-current="page"' : ''}>${n.name}</a><button class="sub-toggle" type="button" aria-expanded="false" aria-controls="menu-${n.menu}"><span class="sr-only">Show the ${n.name.toLowerCase()} menu</span></button>
      <div class="mega" id="menu-${n.menu}"><div class="mega-in">${megaMenus[n.menu]()}</div></div></li>` : `<li><a class="nav-top" href="${n.url}"${path.startsWith(n.url) ? ' aria-current="page"' : ''}>${n.name}</a></li>`).join('')}</ul>
    <a class="nav-phone" href="${telHref}">${icon('phone', 'nav-ic')}${esc(B.phone)}</a>
    <a class="btn btn-call" href="/contact/#quote" data-open="quote">Request a quote</a>
  </nav>
</div></header>
${crumbHtml}
<main id="main">
${body}
</main>
${footer()}
${helpDialog()}
<button class="launcher" type="button" data-open="menu" aria-haspopup="dialog">${icon('check', 'launch-ic')}Get in touch</button>
<div class="callbar"><a href="${telHref}" class="btn btn-call">${icon('phone', 'bar-ic')}Call</a><a href="/contact/" class="btn btn-ghost-dark" data-open="menu" aria-haspopup="dialog">Get in touch</a></div>
<script src="/assets/main.js" defer></script>
</body>
</html>`;
}

function footer() {
  return `<footer class="site-footer"><div class="wrap">
  <div class="footer-grid">
    <div class="footer-brand">
      <img class="footer-badge" src="/assets/logo-off80-300.png" width="150" height="150" alt="${esc(B.name)} badge">
      <p>Licensed electrician based in ${esc(B.city)}, ${B.region} ${B.zip}. Serving the I-80 corridor from Sacramento to Colfax, and Highway 49 to Grass Valley and Nevada City.</p>
      <p><a class="footer-phone" href="${telHref}">${esc(B.phone)}</a><br><a href="mailto:${B.email}">${esc(B.email)}</a></p>
      <p class="footer-small">${esc(B.license)}${B.formerly ? `<br>Formerly ${esc(B.formerly)}` : ''}</p>
    </div>
    <div>
      <h2 class="footer-h">Services</h2>
      <ul>${services.map((s) => `<li><a href="${svcUrl(s)}">${esc(s.short)}</a></li>`).join('')}</ul>
    </div>
    <div>
      <h2 class="footer-h">Service areas</h2>
      <ul class="footer-cols">${[...cities].sort((a, b) => a.name.localeCompare(b.name)).map((c) => `<li><a href="${cityUrl(c)}">${esc(c.name)}</a></li>`).join('')}</ul>
    </div>
    <div>
      <h2 class="footer-h">Answers</h2>
      <ul><li><a href="/guides/">Homeowner guides</a></li><li><a href="/pricing/">Pricing</a></li><li><a href="/faq/">FAQ</a></li><li><a href="/glossary/">Electrical glossary</a></li><li><a href="/about/">About us</a></li><li><a href="/contact/">Contact</a></li></ul>
    </div>
  </div>
  <div class="footer-base">
    <span>© ${new Date().getFullYear()} ${esc(B.name)}</span>
    <span><a href="/privacy/">Privacy</a> · <a href="/sitemap.xml">Sitemap</a></span>
  </div>
</div></footer>`;
}

// ───────────── shared blocks ─────────────
const faqBlock = (faqs, heading = 'Questions people ask') => faqs.length ? `
<section class="section faq" aria-labelledby="faq-h"><div class="wrap narrow">
  <h2 id="faq-h">${esc(heading)}</h2>
  <div class="faq-list">${faqs.map((f) => `<details><summary><h3>${esc(f.q)}</h3></summary><p>${esc(f.a)}</p></details>`).join('')}</div>
</div></section>` : '';

const serviceOptions = services.map((s) => `<option>${esc(s.short)}</option>`).join('');
const cityOptions = [...cities].sort((a, b) => a.name.localeCompare(b.name)).map((c) => `<option>${esc(c.name)}</option>`).join('');

// ── Ways to get in touch: one vocabulary across the whole site ──
const helpItems = [
  { key: 'quote', icon: 'quote', name: 'Request a quote', note: 'Free for projects. Add photos if you have them.', href: '/contact/#quote' },
  { key: 'call', icon: 'phone', name: 'Give us a call', note: `${B.phone}, Mon–Fri 7am–5pm`, href: `tel:${B.phoneE164}` },
  { key: 'message', icon: 'mail', name: 'Send a message', note: 'Questions or scheduling. We reply within one business day.', href: '/contact/#message' },
  { key: 'emergency', icon: 'emergency-electrician', name: 'Electrical emergency', note: 'Burning smell, sparks, or part of the house without power', href: '/contact/#emergency' },
];
const helpOptions = (cls = 'help-list') => `<ul class="${cls}">${helpItems.map((h) => `<li><a class="help-opt help-${h.key}" href="${h.href}"${h.key === 'call' ? '' : ` data-open="${h.key}"`}>
  ${icon(h.icon, 'help-ic')}<span class="help-text"><span class="help-name">${esc(h.name)}</span><span class="help-note">${esc(h.note)}</span></span></a></li>`).join('')}</ul>`;

const quoteForm = (id) => `<form class="form" name="quote" method="POST" action="/thanks/" data-netlify="true" netlify-honeypot="company" enctype="multipart/form-data">
  <input type="hidden" name="form-name" value="quote">
  <p class="hp"><label>Company <input name="company" tabindex="-1" autocomplete="off"></label></p>
  <div class="field"><label for="${id}-name">Name</label><input id="${id}-name" name="name" autocomplete="name" required></div>
  <div class="field"><label for="${id}-phone">Phone</label><input id="${id}-phone" name="phone" type="tel" autocomplete="tel" required></div>
  <div class="field"><label for="${id}-email">Email <span class="opt">(optional)</span></label><input id="${id}-email" name="email" type="email" autocomplete="email"></div>
  <div class="field"><label for="${id}-town">Town</label><select id="${id}-town" name="town" required><option value="">Choose your town</option>${cityOptions}<option>Somewhere else</option></select></div>
  <div class="field field-wide"><label for="${id}-service">What do you need?</label><select id="${id}-service" name="service" class="svc-select"><option value="">Choose a service</option>${serviceOptions}<option>Something else</option></select></div>
  <div class="field field-wide"><label for="${id}-msg">Details</label><textarea id="${id}-msg" name="message" rows="3" placeholder="Panel brand, what’s happening, best time to call"></textarea></div>
  <div class="field field-wide"><label for="${id}-photos">Photos <span class="opt">(optional, a photo of your panel helps)</span></label><input id="${id}-photos" name="photos" type="file" accept="image/*" multiple></div>
  <fieldset class="field field-wide pref"><legend>How should we reply?</legend>
    <label><input type="radio" name="reply" value="Call" checked> Call</label><label><input type="radio" name="reply" value="Text"> Text</label><label><input type="radio" name="reply" value="Email"> Email</label></fieldset>
  <button class="btn btn-call field-wide" type="submit">Request a quote</button>
  <p class="spam-note field-wide">We’ll send a confirmation from <strong>${esc(B.email)}</strong>. Can’t find it? Check your spam or promotions folder.</p>
</form>`;
const messageForm = (id) => `<form class="form" name="message" method="POST" action="/thanks/message/" data-netlify="true" netlify-honeypot="company">
  <input type="hidden" name="form-name" value="message">
  <p class="hp"><label>Company <input name="company" tabindex="-1" autocomplete="off"></label></p>
  <div class="field"><label for="${id}-name">Name</label><input id="${id}-name" name="name" autocomplete="name" required></div>
  <div class="field"><label for="${id}-contact">Phone or email</label><input id="${id}-contact" name="contact" autocomplete="email" required></div>
  <div class="field field-wide"><label for="${id}-msg">Message</label><textarea id="${id}-msg" name="message" rows="4" required></textarea></div>
  <button class="btn btn-call field-wide" type="submit">Send message</button>
  <p class="spam-note field-wide">If you gave an email, we’ll send a confirmation from <strong>${esc(B.email)}</strong>. Can’t find it? Check your spam or promotions folder.</p>
</form>`;
const emergencySteps = () => `<ol class="em-steps">
  <li><strong>Turn off the breaker</strong> for that area, or the main breaker if you’re not sure which one.</li>
  <li><strong>Smoke or flames?</strong> Get everyone out and call 911.</li>
  <li><strong>Power line down?</strong> Stay 30 feet away and call PG&amp;E at 1-800-743-5002 (SMUD: 1-888-456-7683).</li>
  <li><strong>Then call us.</strong> We’ll tell you if it’s safe to wait.</li>
</ol>
<a class="btn btn-emergency" href="${telHref}">${icon('phone', 'bar-ic')}Call ${esc(B.phone)}</a>`;

const helpDialog = () => `<dialog class="help" id="help" aria-labelledby="help-title">
  <div class="help-head"><button class="help-back" type="button" data-back hidden>Back</button><h2 id="help-title" class="help-title">How can we help?</h2><button class="help-close" type="button" data-close aria-label="Close">✕</button></div>
  <div data-view="menu">${helpOptions()}</div>
  <div data-view="quote" hidden><p class="help-lede">Tell us about the job. We’ll reply within one business day with a price or a time to look at it.</p>${quoteForm('dq')}</div>
  <div data-view="message" hidden><p class="help-lede">Questions, scheduling or anything else. We reply within one business day.</p>${messageForm('dm')}</div>
  <div data-view="emergency" hidden><p class="help-lede">Burning smell, sparks, a buzzing panel or part of the house without power? Do this first:</p>${emergencySteps()}</div>
</dialog>`;

// Bottom-of-page section on every page: the same four choices as large tiles
const estimateBlock = ({ city = null, service = null } = {}) => `
<section class="section estimate" id="estimate" aria-labelledby="est-h"${service ? ` data-service="${esc(service.short)}"` : ''}><div class="wrap estimate-grid">
  <div class="estimate-copy">
    <h2 id="est-h">${city ? `Need an electrician in ${esc(city.name)}?` : service ? `Ready to talk about ${esc(service.short.toLowerCase())}?` : 'How can we help?'}</h2>
    <p>Pick what fits. Project quotes are free, and every job is permitted and inspected.</p>
    <a class="estimate-phone" href="${telHref}">${esc(B.phone)}</a>
    <p class="estimate-hours">${esc(B.hoursText)}</p>
  </div>
  ${helpOptions('help-list help-tiles')}
</div></section>`;

// Short call-to-action band for the middle of long pages
const ctaBand = (text) => `<aside class="cta-band" aria-label="Get in touch"><div class="wrap cta-in">
  <p>${text}</p>
  <div class="cta-actions"><a class="btn btn-call" href="/contact/#quote" data-open="quote">Request a quote</a><a class="btn btn-ghost-dark" href="${telHref}">Give us a call</a></div>
</div></aside>`;
const heroActions = (big = false) => `<div class="hero-actions"><a class="btn btn-call${big ? ' btn-lg' : ''}" href="/contact/#quote" data-open="quote">Request a quote</a><a class="btn btn-ghost${big ? ' btn-lg' : ''}" href="${telHref}">${icon('phone', 'btn-ic')}Give us a call</a></div>`;

const popular = services.filter((s) => s.popular);
const others = services.filter((s) => !s.popular);
// Chris's three most requested jobs get a larger feature row
const featured = () => `<ul class="featured">${popular.map((s) => `<li><a href="${svcUrl(s)}">
  <span class="feat-medal" aria-hidden="true">${icon(s.slug, 'feat-ic')}</span>
  <span class="feat-name">${esc(s.name)}</span>
  <span class="feat-blurb">${esc(firstSentence(s.answer))}</span>
  <span class="feat-cost">Typical cost <strong>${esc(s.cost.range)}</strong></span>
  <span class="feat-go">${esc(s.short.replace(/s$/, ''))} details</span></a></li>`).join('')}</ul>`;
const serviceIndex = (list = services) => `<ul class="svc-index">${list.map((s) => `
  <li><a href="${svcUrl(s)}">${icon(s.slug, 'svc-ic')}<span class="svc-text"><span class="svc-name">${esc(s.name)}</span><span class="svc-blurb">${esc(s.blurb)}</span><span class="svc-cost">Typical cost: ${esc(s.cost.range)}</span></span></a></li>`).join('')}
</ul>`;



const steps = [
  ['You call or send the form', 'Tell us what’s going on. Urgent problems get a call back right away; quotes within one business day.'],
  ['We look at it in person', 'For projects we visit, check the panel and do a load calculation if needed. Estimates for projects are free.'],
  ['You get a written price', 'One number for the job, including permit fees, with any options priced side by side.'],
  ['We pull the permit and do the work', 'We handle the city or county permit and any PG&E, SMUD or Roseville Electric scheduling.'],
  ['The inspector signs off', 'We meet the inspector, close out the permit and send you the final paperwork.'],
];
const stepsBlock = `<ol class="steps">${steps.map(([h, p]) => `<li><h3>${esc(h)}</h3><p>${esc(p)}</p></li>`).join('')}</ol>`;

const guideList = (list) => `<ul class="q-list">${list.map((g) => `<li><a href="${guideUrl(g)}">${icon(g.topic, 'q-ic')}<span class="q-q">${esc(g.q)}</span><span class="q-a">${esc(firstSentence(g.answer))}</span></a></li>`).join('')}</ul>`;

// ───────────── pages ─────────────
function home() {
  const faqs = generalFaqs;
  const body = `
<section class="hero hero-home"><div class="wrap">
  <h1><span class="h1-big">Electrical work, anywhere off&nbsp;80.</span>
  <span class="h1-sub">Licensed electrician in Newcastle, CA, serving Sacramento to Colfax and Highway 49 to Grass Valley.</span></h1>
  ${heroActions(true)}
</div>
<div class="wrap-wide hero-route">
  ${routeProfile({ animate: true })}
  <p class="route-caption">From the valley floor in Sacramento up into the foothills at Colfax. Tap any town to see its permit office, power company and the jobs we do most there.</p>
  <div class="also-serving"><span class="also-h">Also serving</span><ul>${offRoute.sort((a, b) => a.name.localeCompare(b.name)).map((c) => `<li><a href="${cityUrl(c)}">${esc(c.name)}</a></li>`).join('')}</ul></div>
</div></section>

<section class="section intro"><div class="wrap narrow">
  <p class="lead">${esc(B.name)} is a licensed C-10 electrical contractor based in ${esc(B.city)}, California. We do residential, rural and light commercial electrical work along the I-80 corridor, and our most requested jobs are panel upgrades, EV charger installs and generator hookups for PG&amp;E shutoffs. We also rewire older homes and power barns, shops and ADUs. Every job is permitted and inspected.</p>
  <ul class="quick">
    <li>${icon('permit', 'quick-ic')}<span><strong>Licensed C-10</strong> #${esc(B.licenseNumber)}</span></li>
    <li>${icon('check', 'quick-ic')}<span><strong>Permits handled</strong> on every job</span></li>
    <li>${icon('pin', 'quick-ic')}<span><strong>${cities.length} towns</strong> from Sacramento to Nevada City</span></li>
    <li>${icon('costs', 'quick-ic')}<span><strong>Free estimates</strong> for projects</span></li>
  </ul>

</div></section>

<section class="section" aria-labelledby="svc-h"><div class="wrap">
  <div class="section-head"><h2 id="svc-h">Most requested</h2><a class="more" href="/services/">All services</a></div>
  ${featured()}
  <h3 class="also-h">Everything else we do</h3>
  ${serviceIndex(others)}
</div></section>
${ctaBand('Know what you need? Tell us about the job and get a written price, free.')}

<section class="section band-psps" aria-labelledby="psps-h"><div class="wrap psps-grid">
  <div>${medal('generator-installation')}
    <h2 id="psps-h">Ready for the next shutoff</h2>
    <p>Above Auburn, PG&amp;E Public Safety Power Shutoffs and winter storm outages can last days, and on a well, no power means no water. We install generator interlocks, inlet boxes, transfer switches and standby generators so you choose what stays on.</p>
    <a class="btn btn-call" href="/services/generator-installation/">Generator hookups</a>
  </div>
  <ul class="psps-list">
    <li><strong>Interlock + inlet</strong><span>Run a portable generator safely through your panel. Typically ${esc(serviceBySlug['generator-installation'].cost.range)}.</span></li>
    <li><strong>Standby generator</strong><span>Starts by itself within seconds. Propane or natural gas.</span></li>
    <li><strong>Battery backup</strong><span>Silent backup that pairs with solar, wired to a critical-loads panel.</span></li>
  </ul>
</div></section>

<section class="section" aria-labelledby="util-h"><div class="wrap">
  <h2 id="util-h">Three utilities, a dozen permit offices</h2>
  <p class="section-intro">Between Sacramento and Colfax your power comes from one of three utilities. We work with all of them, and knowing which one serves you is half of scheduling a panel upgrade.</p>
  <div class="util-groups">${[['PG&E', 'pge', 'Most of Placer, Nevada and El Dorado counties, plus Folsom'], ['SMUD', 'smud', 'Sacramento and nearby Sacramento County towns'], ['Roseville Electric', 'roseville', 'City of Roseville only']].map(([u, k, note]) => `
    <div class="util-group util-g-${k}">${icon('tower', 'ug-ic')}<h3>${esc(u)}</h3><p>${esc(note)}</p>
      <ul class="town-chips">${cities.filter((c) => c.utility.startsWith(u.split(' ')[0])).map((c) => `<li><a href="${cityUrl(c)}">${esc(c.name)}</a></li>`).join('')}</ul></div>`).join('')}
  </div>
  <p class="more-line"><a href="/service-areas/">See every town we serve</a></p>
</div></section>

<section class="section" aria-labelledby="steps-h"><div class="wrap">
  <h2 id="steps-h">How a job goes</h2>
  ${stepsBlock}
</div></section>

<section class="section" aria-labelledby="ans-h"><div class="wrap">
  <div class="section-head"><h2 id="ans-h">Straight answers</h2><a class="more" href="/guides/">All guides</a></div>
  <p class="section-intro">The questions we hear most on job sites between Sacramento and Colfax, answered by a licensed electrician.</p>
  ${guideList(['panel-upgrade-cost', 'prepare-for-pge-psps', 'breaker-keeps-tripping', 'ev-charger-installation-cost', 'federal-pacific-zinsco-panels', 'who-to-call-power-outage'].map((x) => guideBySlug[x]))}
</div></section>

${faqBlock(faqs)}
${estimateBlock()}`;
  write('/', layout({
    path: '/', title: `Electrician in Newcastle, Auburn & Roseville | ${B.name}`,
    description: `Licensed electrician in Newcastle, CA. Panel upgrades, EV chargers, generators and repairs from Sacramento to Auburn, Colfax and Grass Valley.`,
    body, schema: [faqSchema(faqs)], bodyClass: 'is-home',
  }));
}

function servicesIndex() {
  const crumbs = [{ name: 'Home', url: '/' }, { name: 'Services', url: '/services/' }];
  const body = `
<section class="hero hero-inner"><div class="wrap">
  <h1>Electrical services</h1>
  <p class="hero-answer">Residential, rural and light commercial electrical work across Placer, Sacramento, Nevada and El Dorado counties. Every job is done by a licensed C-10 contractor, with permits and inspections handled for you.</p>
</div></section>
<section class="section"><div class="wrap">
  <h2>Most requested</h2>
  ${featured()}
  <h2 class="spaced-h">All other services</h2>
  ${serviceIndex(others)}
</div></section>
<section class="section"><div class="wrap"><h2>How a job goes</h2>${stepsBlock}</div></section>
${estimateBlock()}`;
  write('/services/', layout({
    path: '/services/', title: `Electrical Services in Placer & Sacramento | ${B.name}`,
    description: 'Panel upgrades, EV chargers, generators, rewiring, lighting, spa wiring, barn and well pump power, and repairs from a licensed Newcastle electrician.',
    body, crumbs,
    schema: [{ '@context': 'https://schema.org', '@type': 'ItemList', itemListElement: services.map((s, i) => ({ '@type': 'ListItem', position: i + 1, name: s.name, url: fullUrl(svcUrl(s)) })) }],
  }));
}

function servicePage(s) {
  const path = svcUrl(s);
  const crumbs = [{ name: 'Home', url: '/' }, { name: 'Services', url: '/services/' }, { name: s.name, url: path }];
  const related = services.filter((x) => x.slug !== s.slug).slice(0, 12);
  const featuredIn = cities.filter((c) => c.focus.includes(s.slug));
  const body = `
<section class="hero hero-inner"><div class="wrap">
  <div class="hero-grid"><div>
  ${s.popular ? `<p class="popular-tag">${icon('check', 'tick')}One of our three most requested services</p>` : ''}
  <h1>${esc(s.name)}</h1>
  <p class="hero-answer">${esc(s.answer)}</p>
  ${heroActions()}
  </div>${medal(s.slug)}</div>
</div></section>
<div class="wrap">${toc([...s.sections.map((x) => [slugify(x.h), x.h]), ['faq-h', 'Questions'], ['estimate', 'Request a quote']])}</div>

<section class="section"><div class="wrap svc-layout">
  <article class="prose">
    ${s.sections.map((sec) => `<h2 id="${slugify(sec.h)}">${esc(sec.h)}</h2>${sec.p.map((p) => `<p>${esc(p)}</p>`).join('')}`).join('')}
  </article>
  <aside class="svc-aside">
    <div class="cost-box">
      <h2>At a glance</h2>
      <p class="cost-range">${esc(s.cost.range)}</p>
      <p>${esc(s.cost.note)}</p>
      <dl class="glance">
        <div><dt>Time</dt><dd>${esc(s.time)}</dd></div>
        <div><dt>Permit needed</dt><dd>${esc(s.permit)}</dd></div>
        <div><dt>Licensed</dt><dd>${esc(B.license)}</dd></div>
        <div><dt>Service area</dt><dd>Sacramento to Colfax, Grass Valley and Nevada City</dd></div>
      </dl>
      <p class="cost-fine">Every job is quoted in writing before work starts.</p>
    </div>
    <div class="signs-box">
      <h2>Signs you need this</h2>
      ${ticks(s.signs)}
    </div>
  </aside>
</div></section>
${ctaBand(`Get a written price for ${esc(s.short.toLowerCase())}. Photos of your panel help us quote faster.`)}

${faqBlock(s.faqs, `${s.short}: common questions`)}
${guidesFor(s.slug).length ? `<section class="section" aria-labelledby="sg-h"><div class="wrap narrow">
  <h2 id="sg-h">Guides on ${esc(s.short.toLowerCase())}</h2>
  ${guideList(guidesFor(s.slug))}
</div></section>` : ''}

<section class="section" aria-labelledby="where-h"><div class="wrap">
  <h2 id="where-h">${esc(s.short)} near you</h2>
  <p class="section-intro">We do this work across the whole route.${featuredIn.length ? ` It comes up most often in ${featuredIn.map((c) => `<a href="${cityUrl(c)}">${esc(c.name)}</a>`).join(', ').replace(/, ([^,]*)$/, ' and $1')}.` : ''}</p>
  <ul class="town-chips">${cities.map((c) => `<li><a href="${cityUrl(c)}">${esc(c.name)}</a></li>`).join('')}</ul>
</div></section>

<section class="section"><div class="wrap">
  <h2>Other services</h2>
  <ul class="related">${related.map((x) => `<li><a href="${svcUrl(x)}">${esc(x.name)}</a></li>`).join('')}</ul>
</div></section>
${estimateBlock({ service: s })}`;
  const schema = [
    {
      '@context': 'https://schema.org', '@type': 'Service', '@id': fullUrl(path + '#service'),
      name: s.name, serviceType: s.name, description: s.answer, url: fullUrl(path),
      provider: { '@id': BIZ_ID },
      areaServed: cities.map((c) => ({ '@type': 'City', name: `${c.name}, CA` })),
    },
    faqSchema(s.faqs),
  ];
  write(path, layout({ path, title: s.title.length <= 48 ? `${s.title} | ${B.name}` : s.title, description: s.meta, body, crumbs, schema }));
}

function areasIndex() {
  const path = '/service-areas/';
  const crumbs = [{ name: 'Home', url: '/' }, { name: 'Service areas', url: path }];
  const counties = ['Placer County', 'Sacramento County', 'Nevada County', 'El Dorado County'];
  const card = (c) => {
    const focus = c.focus.slice(0, 3).map((x) => serviceBySlug[x]);
    return `<li><a class="town-card${c.home ? ' is-home' : ''}" href="${cityUrl(c)}" data-town="${c.slug}">
      <span class="tc-head"><span class="tc-name">${esc(c.name)}</span>${c.home ? '<span class="tc-tag">Home base</span>' : ''}</span>
      <span class="tc-blurb">${esc(firstSentence(c.lede))}</span>
      <span class="tc-meta"><span class="util util-${c.utility.split(' ')[0].replace(/[^A-Za-z]/g, '').toLowerCase()}">${esc(c.utility)}</span></span>
      <span class="tc-svcs" aria-label="Most requested here">${focus.map((x) => `<span>${icon(x.slug, 'tc-ic')}${esc(x.short)}</span>`).join('')}</span>
    </a></li>`;
  };
  const body = `
<section class="hero hero-inner"><div class="wrap">
  <h1>Where we work</h1>
  <p class="hero-answer">${esc(B.name)} serves ${cities.length} towns across Placer, Sacramento, Nevada and El Dorado counties: up I-80 from Sacramento to Colfax, up Highway 49 to Grass Valley and Nevada City, and out to Lincoln, Folsom and El Dorado Hills.</p>
  ${heroActions()}
</div></section>

<section class="section"><div class="wrap areas-layout">
  <div class="areas-map">${areaMap()}<p class="map-note">Tap a town on the map or pick one from the list.</p></div>
  <div class="areas-list">
    ${counties.map((co) => { const list = cities.filter((c) => c.county === co).sort((a, b) => (b.home ? 1 : 0) - (a.home ? 1 : 0) || a.name.localeCompare(b.name)); return `
    <section class="county" aria-labelledby="co-${slugify(co)}">
      <h2 id="co-${slugify(co)}">${co} <span class="county-count">${list.length} ${list.length === 1 ? 'town' : 'towns'}</span></h2>
      <ul class="town-cards">${list.map(card).join('')}</ul>
    </section>`; }).join('')}
    <div class="not-listed">${icon('pin', 'nl-ic')}<p><strong>Don’t see your town?</strong> If you’re near I-80, Highway 49 or Highway 50, ask anyway. We often work just outside these towns.</p><a class="btn btn-call" href="/contact/#quote" data-open="quote">Request a quote</a></div>
  </div>
</div></section>
${estimateBlock()}`;
  write(path, layout({
    path, title: `Service Areas: Sacramento to Colfax | ${B.name}`,
    description: 'Licensed electrician serving Sacramento, Roseville, Rocklin, Loomis, Newcastle, Auburn, Colfax, Grass Valley, Nevada City, Lincoln and more.',
    body, crumbs,
  }));
}

function cityPage(c) {
  const path = cityUrl(c);
  const crumbs = [{ name: 'Home', url: '/' }, { name: 'Service areas', url: '/service-areas/' }, { name: c.name, url: path }];
  const focus = c.focus.map((s) => serviceBySlug[s]);
  const others = services.filter((s) => !c.focus.includes(s.slug));
  const nearby = [...cities].filter((x) => x.slug !== c.slug)
    .map((x) => ({ x, d: Math.hypot(x.lat - c.lat, (x.lng - c.lng) * 0.78) }))
    .sort((a, b) => a.d - b.d).slice(0, 5).map((o) => o.x);
  const answer = `${B.name} is a licensed electrician serving ${c.name}, ${c.county}, from our base in ${B.city}. We handle ${focus.map((s) => s.noun).join(', ').replace(/, ([^,]*)$/, ' and $1')}, plus repairs and everything in between, with permits through ${withThe(c.permits.split(' (')[0])}.`;
  const faqs = [
    ...c.faqs,
    { q: `Who supplies electricity in ${c.name}, CA?`, a: `${c.name} is served by ${c.utility}. We coordinate disconnects, reconnects and service upgrades with ${c.utility} as part of panel and service work.` },
    { q: `Where do I get an electrical permit in ${c.name}?`, a: `Electrical permits for ${c.name} are issued by ${withThe(c.permits)}. We pull the permit and schedule the inspection for you.` },
    { q: `How much does an electrician cost in ${c.name}?`, a: `Most service calls and small repairs in ${c.name} run $150–$450. Typical project prices: panel upgrades ${serviceBySlug['panel-upgrades'].cost.range}, EV charger installs ${serviceBySlug['ev-charger-installation'].cost.range}, and generator interlocks ${serviceBySlug['generator-installation'].cost.range}. Estimates for projects are free.` },
    c.utility === 'PG&E'
      ? { q: `Is ${c.name} affected by PG&E power shutoffs (PSPS)?`, a: c.elev >= 900 ? `Yes. ${c.name} is in the foothills, where PG&E Public Safety Power Shutoffs happen during high fire danger. A permitted generator interlock, standby generator or battery system keeps essentials running.` : `Less often than foothill towns, but PG&E can de-energize any line that passes through high fire-threat areas. Many ${c.name} homeowners add a generator inlet or battery backup as a precaution.` }
      : { q: `Does ${c.utility} offer rebates for electrical upgrades in ${c.name}?`, a: `${c.utility} has offered incentives for EV chargers, panel upgrades and electrification in recent years. Programs change often, so we confirm what’s currently available before you buy equipment.` },
    { q: `What electrical problems are common in ${c.name} homes?`, a: firstSentence(c.notes[0]) + ' ' + (c.focus.includes('home-rewiring') ? 'Older homes here often need rewiring or panel replacement.' : c.focus.includes('generator-installation') ? 'Outage preparation is one of the most common requests here.' : 'Adding capacity for EV chargers, solar and spas is one of the most common requests here.') },
    { q: `How soon can an electrician come out to ${c.name}?`, a: `Urgent problems in ${c.name} are often seen the same day, and project estimates are usually scheduled within a few days. Call ${B.phone} or request a quote online.` },
  ].filter((f, i, arr) => arr.findIndex((g) => g.q === f.q) === i);
  const body = `
<section class="hero hero-inner"><div class="wrap city-hero">
  <div class="city-hero-text">
  <h1>Electrician in ${esc(c.name)}, CA</h1>
  <p class="hero-answer">${esc(answer)}</p>
  ${heroActions()}
  <dl class="facts">
    <div>${icon('tower', 'fact-ic')}<dt>Power company</dt><dd>${esc(c.utility)}</dd></div>
    <div>${icon('pin', 'fact-ic')}<dt>County</dt><dd>${esc(c.county)}</dd></div>
    <div>${icon('permit', 'fact-ic')}<dt>Permits</dt><dd>${esc(withThe(c.permits.split(' (')[0]).replace(/^the /, ''))}</dd></div>
    <div>${icon('mail', 'fact-ic')}<dt>ZIP codes</dt><dd>${c.zips.slice(0, 4).join(', ')}${c.zips.length > 4 ? ' and more' : ''}</dd></div>
  </dl>
  </div>
  <div class="city-map">${areaMap({ current: c.slug })}</div>
</div></section>

<div class="wrap">${toc([['local', `Work in ${c.name}`], ['popular', 'Most requested'], ['faq-h', 'Questions'], ['cg-h', 'Guides'], ['estimate', 'Get in touch'] ])}</div>
<section class="section"><div class="wrap narrow prose">
  <h2 id="local">Electrical work in ${esc(c.name)}</h2>
  <p class="lead">${esc(c.lede)}</p>
  ${c.notes.map((n) => `<p>${esc(n)}</p>`).join('')}
  <p><strong>Permits:</strong> issued by ${esc(withThe(c.permits))}.</p>
</div></section>

<section class="section"><div class="wrap">
  <h2 id="popular">Most requested in ${esc(c.name)}</h2>
  ${serviceIndex(focus)}
  <h3 class="also-h">We also handle</h3>
  <ul class="related">${others.map((s) => `<li><a href="${svcUrl(s)}">${esc(s.name)}</a></li>`).join('')}</ul>
</div></section>

${ctaBand(`Need an electrician in ${esc(c.name)}? Tell us about the job and get a written price.`)}

${faqBlock(faqs, `Electricians in ${c.name}: common questions`)}

<section class="section" aria-labelledby="cg-h"><div class="wrap narrow">
  <h2 id="cg-h">Guides for ${esc(c.name)} homeowners</h2>
  ${guideList([...new Set(c.focus.flatMap((f) => guidesFor(f)))].slice(0, 5))}
</div></section>

<section class="section"><div class="wrap">
  <h2>Nearby towns we serve</h2>
  <ul class="town-chips">${nearby.map((x) => `<li><a href="${cityUrl(x)}">Electrician in ${esc(x.name)}</a></li>`).join('')}<li><a href="/service-areas/">All service areas</a></li></ul>
</div></section>
${estimateBlock({ city: c })}`;
  const schema = [
    {
      '@context': 'https://schema.org', '@type': 'Service', '@id': fullUrl(path + '#service'),
      name: `Electrician in ${c.name}, CA`, serviceType: 'Electrician', url: fullUrl(path), description: answer,
      provider: { '@id': BIZ_ID },
      areaServed: { '@type': 'City', name: `${c.name}, CA`, geo: { '@type': 'GeoCoordinates', latitude: c.lat, longitude: c.lng }, containedInPlace: { '@type': 'AdministrativeArea', name: `${c.county}, CA` } },
      hasOfferCatalog: { '@type': 'OfferCatalog', name: `Electrical services in ${c.name}`, itemListElement: services.map((s) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: s.name, url: fullUrl(svcUrl(s)) } })) },
    },
    faqSchema(faqs),
  ];
  write(path, layout({
    path, title: `Electrician in ${c.name}, CA | ${B.name}`,
    description: `Licensed electrician in ${c.name}, CA. ${focus.slice(0, 2).map((s) => s.noun).join(', ').replace(/^./, (m) => m.toUpperCase())} and repairs, with permits handled. Call ${B.phone}.`,
    body, crumbs, schema,
  }));
}

function about() {
  const path = '/about/';
  const crumbs = [{ name: 'Home', url: '/' }, { name: 'About', url: path }];
  const body = `
<section class="hero hero-inner"><div class="wrap">
  <h1>About ${esc(B.name)}</h1>
  <p class="hero-answer">${esc(B.name)} is a locally owned electrical contractor based in ${esc(B.city)}, California, run by ${esc(B.owner)}. We work along the I-80 corridor from Sacramento to Colfax, and up Highway 49 to Grass Valley and Nevada City.</p>
</div></section>
<section class="section"><div class="wrap narrow prose">
  <figure class="about-badge"><img src="/assets/logo-off80-300.png" width="220" height="220" alt="${esc(B.name)} badge: a lightning bolt striking a snowy Sierra peak above the pines"><figcaption>The new badge keeps the Northern Spark mountain, bolt and colors.</figcaption></figure>
  <h2>Why “Off 80”</h2>
  <p>Almost every town we work in sits just off Interstate 80. Sacramento, Roseville, Rocklin, Loomis, Penryn, Newcastle, Auburn, Meadow Vista, Applegate and Colfax are all a few minutes from an I-80 exit, and Grass Valley and Nevada City are a short run up Highway 49 from Auburn. Our shop in Newcastle sits right in the middle of that climb, so the name tells you where we go.</p>
  ${B.formerly ? `<p>If you know our truck, you may know us as ${esc(B.formerly)}. Same electrician, same phone number, with a name that says where we work.</p>` : ''}
  <h2>How we work</h2>
  <ul>
    <li>Licensed, bonded and insured California C-10 electrical contractor.</li>
    <li>Written prices before any work starts.</li>
    <li>Permits pulled and inspections met on every job that needs them.</li>
    <li>We tell you when the cheaper fix is the right one.</li>
    <li>We clean up after ourselves, every time.</li>
  </ul>
  <h2>Check our license</h2>
  <p>Before hiring any contractor in California, look up their license on the Contractors State License Board website. Ours is ${esc(B.license)}. <a href="https://www.cslb.ca.gov/OnlineServices/CheckLicenseII/LicenseDetail.aspx?LicNum=${B.licenseNumber}" rel="noopener">Verify it on cslb.ca.gov</a>.</p>
</div></section>
${estimateBlock()}`;
  write(path, layout({
    path, title: `About ${B.name} | Licensed Electrician in Newcastle, CA`,
    description: `${B.name} is a locally owned, licensed C-10 electrician based in Newcastle, CA, serving the I-80 corridor from Sacramento to Colfax and Grass Valley.`,
    body, crumbs, ogType: 'profile', pageType: 'AboutPage',
  }));
}

function faqPage() {
  const path = '/faq/';
  const crumbs = [{ name: 'Home', url: '/' }, { name: 'FAQ', url: path }];
  const groups = [
    { h: 'Working with us', faqs: generalFaqs },
    ...services.map((s) => ({ h: s.name, faqs: s.faqs, url: svcUrl(s) })),
    ...guideTopics.map((t) => ({ h: t.name, faqs: guides.filter((g) => g.topic === t.key).flatMap((g) => [{ q: g.q, a: g.answer }]), url: '/guides/#' + t.key })),
  ];
  const all = groups.flatMap((g) => g.faqs);
  const body = `
<section class="hero hero-inner"><div class="wrap">
  <h1>Electrical questions, answered</h1>
  <p class="hero-answer">Straight answers about costs, permits, utilities and safety for homeowners in Placer, Sacramento, Nevada and El Dorado counties. If your question isn’t here, call ${esc(B.phone)}.</p>
</div></section>
<section class="section"><div class="wrap narrow">
  <nav class="faq-toc" aria-label="FAQ topics"><ul>${groups.map((g, i) => `<li><a href="#g${i}">${esc(g.h)}</a></li>`).join('')}</ul></nav>
  ${groups.map((g, i) => `<section class="faq-group" id="g${i}"><h2>${esc(g.h)}</h2><div class="faq-list">${g.faqs.map((f) => `<details><summary><h3>${esc(f.q)}</h3></summary><p>${esc(f.a)}</p></details>`).join('')}</div>${g.url ? `<p class="faq-more"><a href="${g.url}">${g.url.startsWith('/guides/') ? 'Read the full guides' : `More about ${esc(g.h.toLowerCase())}`}</a></p>` : ''}</section>`).join('')}
</div></section>
${estimateBlock()}`;
  write(path, layout({
    path, title: `Electrician FAQ: Costs, Permits & Safety | ${B.name}`,
    description: 'Answers on electrical costs, permits, PG&E, SMUD and Roseville Electric, panel upgrades, EV chargers and generators in the Sacramento–Placer area.',
    body, crumbs, schema: [faqSchema(all)],
  }));
}

function contact() {
  const path = '/contact/';
  const crumbs = [{ name: 'Home', url: '/' }, { name: 'Contact', url: path }];
  const body = `
<section class="hero hero-inner"><div class="wrap">
  <h1>How can we help?</h1>
  <p class="hero-answer">Request a free quote for a project, give us a call at <a href="${telHref}">${esc(B.phone)}</a>, or send a message. ${esc(B.hoursText)}</p>
</div></section>
<section class="section"><div class="wrap narrow">${helpOptions('help-list help-tiles help-light')}</div></section>
<section class="section" id="quote"><div class="wrap contact-form-wrap">
  <div><h2>Request a quote</h2><p class="section-intro">Tell us about the job. We’ll reply within one business day with a price or a time to look at it. Project quotes are free.</p></div>
  ${quoteForm('cq')}
</div></section>
<section class="section" id="message"><div class="wrap contact-form-wrap">
  <div><h2>Send a message</h2><p class="section-intro">Questions, scheduling or anything else.</p></div>
  ${messageForm('cm')}
</div></section>
<section class="section" id="emergency"><div class="wrap contact-form-wrap">
  <div><h2>Electrical emergency</h2><p class="section-intro">Burning smell, sparks, a buzzing panel or part of the house without power? Do this first.</p></div>
  <div>${emergencySteps()}</div>
</div></section>
<section class="section"><div class="wrap narrow prose">
  <h2>Where we are</h2>
  <p>Based in ${esc(B.city)}, ${B.region} ${B.zip}, ${esc(B.county)}, just off I-80 between Penryn and Auburn. We come to you: see our <a href="/service-areas/">service areas</a>.</p>
</div></section>`;
  write(path, layout({
    path, title: `Contact | Call ${B.phone} | ${B.name}`,
    description: `Request a free quote, call ${B.phone} or send a message to ${B.name}, a licensed electrician in Newcastle, CA.`,
    body, crumbs, pageType: 'ContactPage',
  }));
}

function simplePages() {
  const thanks = (path, title, lede, nextSteps) => {
    write(path, layout({
      path, title: `${title} | ${B.name}`, description: lede,
      body: `<section class="hero hero-inner"><div class="wrap"><h1>${esc(title)}</h1><p class="hero-answer">${esc(lede)}</p></div></section>
<section class="section"><div class="wrap narrow">
  <h2>What happens next</h2>
  <ol class="em-steps next-steps">${nextSteps.map((x) => `<li>${x}</li>`).join('')}</ol>
  <div class="spam-box">${icon('mail', 'spam-ic')}<p><strong>Check your inbox, and your spam folder.</strong> If you gave us an email address, a confirmation from <strong>${esc(B.email)}</strong> is on its way. If it’s not in your inbox in a few minutes, look in spam or promotions and mark it “not spam” so our reply reaches you.</p></div>
  <div class="spam-box urgent">${icon('emergency-electrician', 'spam-ic')}<p><strong>Is it urgent?</strong> A burning smell, sparks or part of the house without power can’t wait for a reply. Turn off the breaker for that area and call <a href="${telHref}">${esc(B.phone)}</a>.</p></div>
  <p class="more-line"><a href="/guides/">Read our homeowner guides</a> while you wait.</p>
</div></section>`,
    }).replace('index, follow', 'noindex, follow'));
    pages.pop();
  };
  thanks('/thanks/', 'Your quote request is in', `We’ll reply within one business day, usually the same day, by your chosen method.`, [
    `<strong>${esc(B.owner.split(' ')[0])} reviews your request</strong> and any photos you sent.`,
    '<strong>We get back to you within one business day</strong> by call, text or email, whichever you chose.',
    '<strong>You get a written price</strong>, or we set a time to look at the job in person. Project quotes are free.',
  ]);
  thanks('/thanks/message/', 'Your message is in', 'We’ll reply within one business day, usually the same day.', [
    '<strong>We read your message</strong> the same business day.',
    '<strong>We reply</strong> by phone or email, whichever you gave us.',
  ]);
  write('/privacy/', layout({
    path: '/privacy/', title: `Privacy policy | ${B.name}`, description: `How ${B.name} handles information you send us.`,
    crumbs: [{ name: 'Home', url: '/' }, { name: 'Privacy', url: '/privacy/' }],
    body: `<section class="hero hero-inner"><div class="wrap"><h1>Privacy policy</h1><p class="hero-answer">We only use what you send through our form to answer your request. We don’t sell it, share it or track you with ads.</p></div></section>
<section class="section"><div class="wrap narrow prose">
<p>When you send our estimate form, we receive your name, phone number, email address, town and message. We use them only to respond to your request and to provide the work you ask for. We don’t sell or share your information with anyone outside the business, except service providers that host this website and its form.</p>
<p>This site doesn’t use advertising trackers. To ask what we hold about you or to have it deleted, email <a href="mailto:${B.email}">${esc(B.email)}</a>.</p>
<p>Last updated ${TODAY}.</p></div></section>`,
  }));
  const nf = layout({
    path: '/404.html', title: `Page not found | ${B.name}`, description: 'Page not found.',
    body: `<section class="hero hero-inner"><div class="wrap"><h1>That page isn’t here</h1><p class="hero-answer">The link may be old. Try the <a href="/services/">services list</a> or <a href="/service-areas/">service areas</a>, or call <a href="${telHref}">${esc(B.phone)}</a>.</p></div></section>`,
  }).replace('index, follow', 'noindex, follow');
  pages.pop();
  writeFileSync(join(OUT, '404.html'), nf);
}

function guidePage(g) {
  const path = guideUrl(g);
  const topic = guideTopics.find((t) => t.key === g.topic);
  const crumbs = [{ name: 'Home', url: '/' }, { name: 'Guides', url: '/guides/' }, { name: g.q, url: path }];
  const svc = g.services.map((x) => serviceBySlug[x]);
  const related = guides.filter((x) => x.slug !== g.slug && (x.topic === g.topic || x.services.some((y) => g.services.includes(y)))).slice(0, 6);
  const faqs = g.faqs;
  const body = `
<section class="hero hero-inner"><div class="wrap">
  <div class="hero-grid"><div>
  <h1>${esc(g.q)}</h1>
  <p class="hero-answer">${esc(g.answer)}</p>
  <p class="byline">Written by ${esc(B.owner)}, licensed electrician at ${esc(B.name)}. Reviewed ${MONTH}.</p>
  </div>${medal(g.topic)}</div>
</div></section>
<div class="wrap">${toc([['key-facts', 'Key facts'], ...g.sections.map((x) => [slugify(x.h), x.h]), ['faq-h', 'Related questions']])}</div>

<section class="section"><div class="wrap svc-layout">
  <article class="prose">
    ${g.sections.map((sec) => `<h2 id="${slugify(sec.h)}">${esc(sec.h)}</h2>${sec.p.map((p) => `<p>${esc(p)}</p>`).join('')}`).join('')}
  </article>
  <aside class="svc-aside">
    <div class="signs-box key-facts" id="key-facts">
      <h2>Key facts</h2>
      ${ticks(g.facts)}
    </div>
    <div class="cost-box">
      <h2>Need this done?</h2>
      <p>We handle ${svc.map((x) => `<a href="${svcUrl(x)}">${esc(x.short.toLowerCase())}</a>`).join(', ').replace(/, ([^,]*)$/, ' and $1')} from Sacramento to Colfax and Grass Valley.</p>
      <a class="btn btn-call" href="/contact/#quote" data-open="quote">Request a quote</a>
    </div>
  </aside>
</div></section>

${ctaBand('Rather have an electrician look at it? Quotes for projects are free.')}

${faqBlock(faqs, 'Related questions')}

<section class="section" aria-labelledby="rg-h"><div class="wrap narrow">
  <h2 id="rg-h">More guides on ${esc(topic.name.toLowerCase())}</h2>
  ${guideList(related)}
</div></section>
${estimateBlock({ service: svc[0] })}`;
  const schema = [
    {
      '@context': 'https://schema.org', '@type': 'Article', '@id': fullUrl(path + '#article'),
      headline: g.q, description: g.answer, mainEntityOfPage: { '@id': fullUrl(path) + '#webpage' },
      author: { '@type': 'Person', name: B.owner, jobTitle: 'Licensed electrician', worksFor: { '@id': BIZ_ID } },
      publisher: { '@id': BIZ_ID }, dateModified: TODAY, image: fullUrl('/assets/og.png'),
      about: svc.map((x) => ({ '@type': 'Service', name: x.name, url: fullUrl(svcUrl(x)) })),
    },
    faqSchema([{ q: g.q, a: g.answer }, ...faqs]),
  ];
  write(path, layout({ path, title: g.title.length <= 48 ? `${g.title} | ${B.name}` : g.title, description: g.meta, body, crumbs, schema, ogType: 'article' }));
}

function guidesIndex() {
  const path = '/guides/';
  const crumbs = [{ name: 'Home', url: '/' }, { name: 'Guides', url: path }];
  const body = `
<section class="hero hero-inner"><div class="wrap">
  <h1>Homeowner guides</h1>
  <p class="hero-answer">Plain answers to the electrical questions homeowners in Placer, Sacramento, Nevada and El Dorado counties ask most: what things cost, what’s safe, how to get through a PG&amp;E shutoff, and what California code requires. Each guide starts with the short answer.</p>
</div></section>
<section class="section"><div class="wrap narrow">
  <nav class="faq-toc" aria-label="Guide topics"><ul>${guideTopics.map((t) => `<li><a href="#${t.key}">${esc(t.name)}</a></li>`).join('')}</ul></nav>
  ${guideTopics.map((t) => `<section class="faq-group" id="${t.key}"><h2 class="topic-h">${icon(t.key, 'topic-ic')}${esc(t.name)}</h2>${guideList(guides.filter((g) => g.topic === t.key))}</section>`).join('')}
  <p class="faq-more">Looking for a term? See the <a href="/glossary/">electrical glossary</a>.</p>
</div></section>
${estimateBlock()}`;
  write(path, layout({
    path, title: `Electrical Guides for Placer & Sacramento Homeowners | ${B.name}`.replace(' | Off 80 Electric', '').length > 60 ? 'Electrical Guides for Placer & Sacramento Homeowners' : `Electrical Guides | ${B.name}`,
    description: 'Answer-first guides on electrical costs, safety, PG&E shutoffs, generators, EV charging, older-home wiring and California permits, from a licensed electrician.',
    body, crumbs, pageType: 'CollectionPage',
    schema: [{ '@context': 'https://schema.org', '@type': 'ItemList', itemListElement: guides.map((g, i) => ({ '@type': 'ListItem', position: i + 1, name: g.q, url: fullUrl(guideUrl(g)) })) }],
  }));
}

function pricingPage() {
  const path = '/pricing/';
  const crumbs = [{ name: 'Home', url: '/' }, { name: 'Pricing', url: path }];
  const num = (t) => (t.match(/\$[\d,]+/g) || []).map((x) => Number(x.replace(/[$,]/g, '')));
  const faqs = ['electrician-cost-per-hour', 'panel-upgrade-cost', 'ev-charger-installation-cost', 'generator-hookup-cost'].map((x) => ({ q: guideBySlug[x].q, a: guideBySlug[x].answer }));
  const body = `
<section class="hero hero-inner"><div class="wrap">
  <h1>Electrician prices in Placer County and Sacramento</h1>
  <p class="hero-answer">Most electrical service calls and small repairs in Placer and Sacramento counties cost $150 to $450. Typical project prices: panel upgrades ${esc(serviceBySlug['panel-upgrades'].cost.range)}, Level 2 EV charger installs ${esc(serviceBySlug['ev-charger-installation'].cost.range)}, generator interlocks ${esc(serviceBySlug['generator-installation'].cost.range)}, and full rewires ${esc(serviceBySlug['home-rewiring'].cost.range)}. Every job is quoted in writing first.</p>
  <p class="byline">Typical ${MONTH} ranges from ${esc(B.name)}. Your price depends on your home; estimates for projects are free.</p>
</div></section>
<section class="section"><div class="wrap">
  <div class="table-scroll"><table class="util-table price-table">
    <caption>Typical installed prices, including permit, for single-family homes between Sacramento and Colfax</caption>
    <thead><tr><th scope="col">Service</th><th scope="col">Typical price</th><th scope="col">What changes the price</th><th scope="col">Time</th></tr></thead>
    <tbody>${services.map((s) => `<tr><th scope="row"><a class="price-svc" href="${svcUrl(s)}">${icon(s.slug, 'row-ic')}<span>${esc(s.name)}</span></a></th><td class="price" data-label="Typical price">${esc(s.cost.range)}</td><td data-label="What changes the price">${esc(s.cost.note.replace(/^./, (m) => m.toUpperCase()))}</td><td data-label="Time">${esc(s.time)}</td></tr>`).join('')}</tbody>
  </table></div>
</div></section>
<section class="section"><div class="wrap narrow prose">
  <h2>What affects the price of electrical work</h2>
  <p>Distance from the panel, access through attics and crawlspaces, whether walls are finished or plaster, and whether your panel has capacity for the new load all change the price. Utility scheduling with PG&amp;E, SMUD or Roseville Electric affects timing more than cost.</p>
  <p>Rural foothill jobs can cost more because of longer wire runs, rocky trenching and well-pump work. We price those pieces separately so you can see exactly what you’re paying for.</p>
  <h2>How we quote</h2>
  <p>Troubleshooting is billed by time, because finding the fault is the work. Projects get a written, fixed price after a free site visit, including permit fees.</p>
</div></section>
${faqBlock(faqs, 'Pricing questions')}
<section class="section"><div class="wrap narrow"><h2>Cost guides</h2>${guideList(guides.filter((g) => g.topic === 'costs'))}</div></section>
${estimateBlock()}`;
  write(path, layout({
    path, title: `Electrician Prices in Placer County & Sacramento (2026)`,
    description: 'Typical electrician prices in Placer and Sacramento counties: service calls $150–$450, panel upgrades $3,000–$6,500, EV chargers $800–$2,500 and more.',
    body, crumbs,
    schema: [faqSchema(faqs), {
      '@context': 'https://schema.org', '@type': 'OfferCatalog', name: `${B.name} typical prices`,
      itemListElement: services.map((s) => { const n = num(s.cost.range); return { '@type': 'Offer', itemOffered: { '@type': 'Service', name: s.name, url: fullUrl(svcUrl(s)) }, ...(n.length === 2 ? { priceSpecification: { '@type': 'PriceSpecification', priceCurrency: 'USD', minPrice: n[0], maxPrice: n[1] } } : {}) }; }),
    }],
  }));
}

function glossaryPage() {
  const path = '/glossary/';
  const crumbs = [{ name: 'Home', url: '/' }, { name: 'Glossary', url: path }];
  const sorted = [...glossary].sort((a, b) => a.term.localeCompare(b.term));
  const body = `
<section class="hero hero-inner"><div class="wrap">
  <h1>Electrical glossary</h1>
  <p class="hero-answer">Plain-English definitions of the electrical terms you’ll see in quotes, inspection reports and utility letters, from amps and AFCI to PSPS and transfer switches.</p>
</div></section>
<section class="section"><div class="wrap narrow">
  <dl class="glossary">${sorted.map((t) => `<div id="${t.id}"><dt>${esc(t.term)}</dt><dd>${esc(t.def)}</dd></div>`).join('')}</dl>
  <p class="faq-more">Want more than a definition? Read the <a href="/guides/">homeowner guides</a>.</p>
</div></section>
${estimateBlock()}`;
  write(path, layout({
    path, title: `Electrical Glossary: Terms Explained | ${B.name}`,
    description: 'Plain-English definitions of electrical terms: amps, service, subpanel, GFCI, AFCI, interlock, transfer switch, PSPS, knob-and-tube and more.',
    body, crumbs,
    schema: [{
      '@context': 'https://schema.org', '@type': 'DefinedTermSet', '@id': fullUrl(path + '#terms'), name: 'Electrical glossary', url: fullUrl(path),
      hasDefinedTerm: sorted.map((t) => ({ '@type': 'DefinedTerm', name: t.term, description: t.def, url: fullUrl(path + '#' + t.id) })),
    }],
  }));
}

// ───────────── machine-readable files ─────────────
function seoFiles() {
  writeFileSync(join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((p) => `  <url><loc>${fullUrl(p.path)}</loc><lastmod>${TODAY}</lastmod><priority>${p.priority}</priority></url>`).join('\n')}
</urlset>
`);
  writeFileSync(join(OUT, 'robots.txt'), `# Search engines and AI assistants are welcome.
User-agent: *
Allow: /
Disallow: /thanks/

User-agent: GPTBot
Allow: /
User-agent: OAI-SearchBot
Allow: /
User-agent: ChatGPT-User
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: Claude-SearchBot
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Google-Extended
Allow: /
User-agent: Applebot-Extended
Allow: /

Sitemap: ${fullUrl('/sitemap.xml')}
`);
  // llms.txt: a plain-language summary for AI assistants (AEO)
  writeFileSync(join(OUT, 'llms.txt'), `# ${B.name}

> ${B.name}${B.formerly ? ` (formerly ${B.formerly})` : ''} is a licensed California C-10 electrical contractor based in ${B.city}, CA ${B.zip} (${B.county}). It serves ${cities.length} towns: the I-80 corridor from Sacramento to Colfax, Highway 49 from Cool to Grass Valley and Nevada City, plus ${offRoute.filter((c) => !['grass-valley', 'nevada-city'].includes(c.slug)).map((c) => c.name).sort().join(', ')}. Phone: ${B.phone}. License: ${B.license}.

## Key facts
- Most requested services: ${popular.map((s) => s.name).join(', ')}
- Services: ${services.map((s) => s.name).join('; ')}
- Hours: ${B.hoursText}
- Permits pulled and inspections handled on every job that requires them
- Works with all three local utilities: PG&E, SMUD (Sacramento, Citrus Heights, Carmichael, Fair Oaks, Orangevale, Rancho Cordova) and Roseville Electric Utility (Roseville)
- Specializes in foothill and rural work: PSPS generator hookups, well pumps, barns and shops, older-home rewiring

## Services
${services.map((s) => `- [${s.name}](${fullUrl(svcUrl(s))}): ${s.answer} Typical cost: ${s.cost.range}.`).join('\n')}

## Service areas
${[...cities].sort((a, b) => a.name.localeCompare(b.name)).map((c) => `- [Electrician in ${c.name}, CA](${fullUrl(cityUrl(c))}): ${c.county}; utility ${c.utility}; permits ${c.permits}.`).join('\n')}

## Guides (answer-first)
${guides.map((g) => `- [${g.q}](${fullUrl(guideUrl(g))}): ${g.answer}`).join('\n')}

## Pages
- [Pricing](${fullUrl('/pricing/')}): typical prices for every service
- [Glossary](${fullUrl('/glossary/')}): plain-English electrical terms
- [FAQ](${fullUrl('/faq/')})
- [About](${fullUrl('/about/')})
- [Contact](${fullUrl('/contact/')})
`);
  writeFileSync(join(OUT, 'site.webmanifest'), JSON.stringify({
    name: B.name, short_name: 'Off 80', start_url: '/', display: 'browser', background_color: '#F0EDE5', theme_color: '#16302F',
    icons: [{ src: '/assets/icon-192.png', sizes: '192x192', type: 'image/png' }, { src: '/assets/icon-512.png', sizes: '512x512', type: 'image/png' }],
  }, null, 2));
  writeFileSync(join(OUT, '_headers'), `/assets/*
  Cache-Control: public, max-age=31536000, immutable
/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
`);
}

// ───────────── run ─────────────
if (existsSync(OUT)) rmSync(OUT, { recursive: true });
mkdirSync(OUT, { recursive: true });
cpSync('assets', join(OUT, 'assets'), { recursive: true });
cpSync('static', OUT, { recursive: true });
// Browser-tab icon: the simple round mark (the full badge is too detailed at 16px)
writeFileSync(join(OUT, 'favicon.svg'), badge('logo-mark').replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" '));
home(); servicesIndex(); services.forEach(servicePage);
areasIndex(); cities.forEach(cityPage);
about(); faqPage(); contact(); simplePages();
guidesIndex(); guides.forEach(guidePage); pricingPage(); glossaryPage();
seoFiles();
console.log(`Built ${pages.length} pages into ./${OUT}`);
