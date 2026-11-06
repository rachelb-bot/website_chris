// Static site generator for Off 80 Electric.
// Usage: node build.mjs   → writes the finished site to ./dist
import { mkdirSync, writeFileSync, cpSync, rmSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { business as B, fullUrl } from './src/config.mjs';
import { services, serviceBySlug } from './src/services.mjs';
import { cities, cityUrl } from './src/cities.mjs';
import { generalFaqs } from './src/faqs.mjs';

const OUT = 'dist';
const TODAY = new Date().toISOString().slice(0, 10);
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
  logo: fullUrl('/assets/logo.png'),
  priceRange: '$$',
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

  const grid = [0, 500, 1000, 1500, 2000, 2500].map((e) => `
    <line class="rp-grid" x1="${L - 20}" x2="${W - 20}" y1="${Y(e)}" y2="${Y(e)}"/>
    <text class="rp-axis" x="${L - 28}" y="${Y(e) + 4}" text-anchor="end">${e === 0 ? 'sea level' : fmt(e) + ' ft'}</text>`).join('');

  const stop = (c, x, y, i, above) => {
    const isCur = current === c.slug;
    // Labels sit above, or below-right: the wire always climbs to the right, so that corner stays clear
    const ly = above ? y - 22 : y + 30;
    const lx = above ? x : x + 12;
    const anchor = above ? 'middle' : 'start';
    const cls = ['rp-stop', c.home ? 'is-home' : '', isCur ? 'is-current' : ''].join(' ');
    return `<a href="${cityUrl(c)}" class="${cls}" style="--i:${i}" aria-label="Electrician in ${esc(c.name)}, ${fmt(c.elev)} feet">
      ${c.home ? `<circle class="rp-halo" cx="${x}" cy="${y}" r="17"/>` : ''}
      <circle class="rp-dot" cx="${x}" cy="${y}" r="${c.home || isCur ? 8 : 6}"/>
      <text class="rp-name" x="${lx}" y="${ly}" text-anchor="${anchor}">${esc(c.name)}</text>
      <text class="rp-elev" x="${lx}" y="${ly + (above ? -17 : 17)}" text-anchor="${anchor}">${c.home ? 'Our shop · ' : ''}${fmt(c.elev)} ft</text>
    </a>`;
  };

  const svg = `<svg class="rp-svg${animate ? ' rp-animate' : ''}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="rp-title rp-desc">
    <title id="rp-title">Service route along Interstate 80</title>
    <desc id="rp-desc">Elevation profile of towns served, from Sacramento at 30 feet to Colfax at 2,425 feet, with Highway 49 branching from Auburn to Grass Valley and Nevada City.</desc>
    <g class="rp-stars">${stars}</g>
    <path class="rp-far" d="${far}"/>
    <path class="rp-snow" d="${caps}"/>
    <path class="rp-ground" d="${groundD}"/>
    ${grid}
    <path class="rp-spur" d="${spurD}" pathLength="1"/>
    <path class="rp-wire" d="${mainD}" pathLength="1"/>
    <text class="rp-road" x="${(pts[1][0] + pts[2][0]) / 2}" y="${Y(900)}" text-anchor="middle">I-80 east</text>
    <text class="rp-road" x="${(spurPts[0][0] + spurPts[1][0]) / 2 - 16}" y="${(spurPts[0][1] + spurPts[1][1]) / 2}" text-anchor="end">Hwy 49 north</text>
    ${routeCities.map((c, i) => stop(c, pts[i][0], pts[i][1], i, i === routeCities.length - 1)).join('')}
    ${spurCities.map((c, i) => stop(c, spurPts[i + 1][0], spurPts[i + 1][1], auburnIdx + 1 + i, true)).join('')}
  </svg>`;

  // Mobile/small-screen version: the same route as a vertical line
  const list = `<ol class="rp-list" aria-label="Towns along I-80, lowest to highest">
    ${routeCities.map((c) => `<li class="${c.home ? 'is-home' : ''}${current === c.slug ? ' is-current' : ''}"><a href="${cityUrl(c)}"><span class="rp-list-name">${esc(c.name)}</span><span class="rp-list-elev">${c.home ? 'Our shop · ' : ''}${fmt(c.elev)} ft</span></a>${c.slug === 'auburn' ? `<ol class="rp-list-spur" aria-label="Highway 49 north from Auburn">${spurCities.map((s) => `<li class="${current === s.slug ? 'is-current' : ''}"><a href="${cityUrl(s)}"><span class="rp-list-name">${esc(s.name)}</span><span class="rp-list-elev">Hwy 49 · ${fmt(s.elev)} ft</span></a></li>`).join('')}</ol>` : ''}</li>`).join('')}
  </ol>`;
  return `<div class="route-profile">${svg}${list}</div>`;
}

// ───────────── layout ─────────────
const nav = [
  { url: '/services/', name: 'Services' },
  { url: '/service-areas/', name: 'Service areas' },
  { url: '/about/', name: 'About' },
  { url: '/faq/', name: 'FAQ' },
  { url: '/contact/', name: 'Contact' },
];

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
  ${badge()}
  <span class="logo-word"><span class="logo-off">Off 80</span><span class="logo-elec">Electric</span></span>
</a>`;

function layout({ path, title, description, body, schema = [], crumbs = null, ogType = 'website', bodyClass = '' }) {
  const canonical = fullUrl(path);
  pages.push({ path, priority: path === '/' ? '1.0' : path.split('/').filter(Boolean).length === 1 ? '0.8' : '0.7' });
  const crumbHtml = crumbs ? `<nav class="crumbs wrap" aria-label="Breadcrumb"><ol>${crumbs.map((c, i) => i === crumbs.length - 1 ? `<li aria-current="page">${esc(c.name)}</li>` : `<li><a href="${c.url}">${esc(c.name)}</a></li>`).join('')}</ol></nav>` : '';
  const allSchema = [businessSchema(), websiteSchema(), ...(crumbs ? [crumbSchema(crumbs)] : []), ...schema].filter(Boolean);
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
<meta name="theme-color" content="#1E3B2F">
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
<a class="skip" href="#main">Skip to content</a>
<div class="topbar"><div class="wrap topbar-in">
  <span>${esc(B.license)}, bonded and insured</span>
  <span class="topbar-hours">${esc(B.hoursText)}</span>
</div></div>
<header class="site-header"><div class="wrap header-in">
  ${logo}
  <button class="nav-toggle" aria-expanded="false" aria-controls="site-nav">Menu</button>
  <nav id="site-nav" class="site-nav" aria-label="Main">
    <ul>${nav.map((n) => `<li><a href="${n.url}"${path.startsWith(n.url) ? ' aria-current="page"' : ''}>${n.name}</a></li>`).join('')}</ul>
    <a class="btn btn-call" href="${telHref}">Call ${esc(B.phone)}</a>
  </nav>
</div></header>
${crumbHtml}
<main id="main">
${body}
</main>
${footer()}
<div class="callbar"><a href="${telHref}" class="btn btn-call">Call now</a><a href="/contact/" class="btn btn-ghost-dark">Get an estimate</a></div>
<script src="/assets/main.js" defer></script>
</body>
</html>`;
}

function footer() {
  return `<footer class="site-footer"><div class="wrap">
  <div class="footer-grid">
    <div class="footer-brand">
      ${badge('footer-badge', true)}
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

const estimateBlock = ({ city = null, service = null } = {}) => `
<section class="section estimate" id="estimate" aria-labelledby="est-h"><div class="wrap estimate-grid">
  <div class="estimate-copy">
    <h2 id="est-h">${city ? `Book an electrician in ${esc(city.name)}` : 'Tell us what you need'}</h2>
    <p>Call for anything urgent. For quotes, send the form and we’ll call back within one business day, usually the same day.</p>
    <a class="estimate-phone" href="${telHref}">${esc(B.phone)}</a>
    <p class="estimate-hours">${esc(B.hoursText)}</p>
  </div>
  <form class="estimate-form" name="estimate" method="POST" action="/thanks/" data-netlify="true" netlify-honeypot="company">
    <input type="hidden" name="form-name" value="estimate">
    <p class="hp"><label>Company <input name="company" tabindex="-1" autocomplete="off"></label></p>
    <div class="field"><label for="f-name">Name</label><input id="f-name" name="name" autocomplete="name" required></div>
    <div class="field"><label for="f-phone">Phone</label><input id="f-phone" name="phone" type="tel" autocomplete="tel" required></div>
    <div class="field"><label for="f-email">Email <span class="opt">(optional)</span></label><input id="f-email" name="email" type="email" autocomplete="email"></div>
    <div class="field"><label for="f-town">Town</label><select id="f-town" name="town" required><option value="">Choose your town</option>${cityOptions}<option>Somewhere else</option></select></div>
    <div class="field field-wide"><label for="f-service">What do you need?</label><select id="f-service" name="service"><option value="">Choose a service</option>${serviceOptions}<option>Something else</option></select></div>
    <div class="field field-wide"><label for="f-msg">Details</label><textarea id="f-msg" name="message" rows="4" placeholder="Panel brand, what’s happening, best time to call"></textarea></div>
    <button class="btn btn-call field-wide" type="submit">Send request</button>
  </form>
</div></section>`
  .replace(city ? `<option>${esc(city.name)}</option>` : '§', city ? `<option selected>${esc(city.name)}</option>` : '§')
  .replace(service ? `<option>${esc(service.short)}</option>` : '§', service ? `<option selected>${esc(service.short)}</option>` : '§');

const serviceIndex = (list = services) => `<ul class="svc-index">${list.map((s) => `
  <li><a href="${svcUrl(s)}"><span class="svc-name">${esc(s.name)}</span><span class="svc-blurb">${esc(s.blurb)}</span><span class="svc-cost">Typical cost: ${esc(s.cost.range)}</span></a></li>`).join('')}
</ul>`;

const utilityTable = () => `<div class="table-scroll"><table class="util-table">
  <caption>Who supplies the power, and who signs off on the permit, along our route</caption>
  <thead><tr><th scope="col">Town</th><th scope="col">Electric utility</th><th scope="col">Permits issued by</th><th scope="col">Elevation</th></tr></thead>
  <tbody>${[...cities].sort((a, b) => a.elev - b.elev).map((c) => `<tr><th scope="row"><a href="${cityUrl(c)}">${esc(c.name)}</a></th><td><span class="util util-${c.utility.split(' ')[0].replace(/[^A-Za-z]/g, '').toLowerCase()}">${esc(c.utility)}</span></td><td>${esc(c.permits)}</td><td class="num">${fmt(c.elev)} ft</td></tr>`).join('')}</tbody>
</table></div>`;

const steps = [
  ['You call or send the form', 'Tell us what’s going on. Urgent problems get a call back right away; quotes within one business day.'],
  ['We look at it in person', 'For projects we visit, check the panel and do a load calculation if needed. Estimates for projects are free.'],
  ['You get a written price', 'One number for the job, including permit fees, with any options priced side by side.'],
  ['We pull the permit and do the work', 'We handle the city or county permit and any PG&E, SMUD or Roseville Electric scheduling.'],
  ['The inspector signs off', 'We meet the inspector, close out the permit and send you the final paperwork.'],
];
const stepsBlock = `<ol class="steps">${steps.map(([h, p]) => `<li><h3>${esc(h)}</h3><p>${esc(p)}</p></li>`).join('')}</ol>`;

// ───────────── pages ─────────────
function home() {
  const faqs = generalFaqs;
  const body = `
<section class="hero hero-home"><div class="wrap">
  <h1><span class="h1-big">Electrical work, anywhere off&nbsp;80.</span>
  <span class="h1-sub">Licensed electrician in Newcastle, CA, serving Sacramento to Colfax and Highway 49 to Grass Valley.</span></h1>
  <div class="hero-actions">
    <a class="btn btn-call btn-lg" href="${telHref}">Call ${esc(B.phone)}</a>
    <a class="btn btn-ghost btn-lg" href="#estimate">Request an estimate</a>
  </div>
</div>
<div class="wrap-wide hero-route">
  ${routeProfile({ animate: true })}
  <p class="route-caption">From 30 feet in Sacramento to 2,425 in Colfax. Every stop has a page covering who supplies the power, who issues the permit, and what we usually find in the walls there.</p>
</div></section>

<section class="section intro"><div class="wrap narrow">
  <p class="lead">${esc(B.name)} is a licensed C-10 electrical contractor based in ${esc(B.city)}, California. We do residential, rural and light commercial electrical work along the I-80 corridor, including panel upgrades, EV chargers, generator hookups for PG&amp;E shutoffs, rewiring older homes, and power for barns, shops and ADUs. Every job is permitted and inspected.</p>
  <p class="also">Also serving ${offRoute.map((c) => `<a href="${cityUrl(c)}">${esc(c.name)}</a>`).join(', ').replace(/, ([^,]*)$/, ' and $1')}.</p>
</div></section>

<section class="section" aria-labelledby="svc-h"><div class="wrap">
  <div class="section-head"><h2 id="svc-h">What we do</h2><a class="more" href="/services/">All services</a></div>
  ${serviceIndex()}
</div></section>

<section class="section band-psps" aria-labelledby="psps-h"><div class="wrap psps-grid">
  <div>
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
  <p class="section-intro">Between Sacramento and Colfax your power comes from SMUD, Roseville Electric or PG&amp;E, and your permit from one of a dozen city and county offices. We work with all of them, and knowing which applies is half of scheduling a panel upgrade.</p>
  ${utilityTable()}
</div></section>

<section class="section" aria-labelledby="steps-h"><div class="wrap">
  <h2 id="steps-h">How a job goes</h2>
  ${stepsBlock}
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
<section class="section"><div class="wrap">${serviceIndex()}</div></section>
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
  <h1>${esc(s.name)}</h1>
  <p class="hero-answer">${esc(s.answer)}</p>
  <div class="hero-actions"><a class="btn btn-call" href="${telHref}">Call ${esc(B.phone)}</a><a class="btn btn-ghost" href="#estimate">Get a quote</a></div>
</div></section>

<section class="section"><div class="wrap svc-layout">
  <article class="prose">
    ${s.sections.map((sec) => `<h2>${esc(sec.h)}</h2>${sec.p.map((p) => `<p>${esc(p)}</p>`).join('')}`).join('')}
  </article>
  <aside class="svc-aside">
    <div class="cost-box">
      <h2>Typical cost</h2>
      <p class="cost-range">${esc(s.cost.range)}</p>
      <p>${esc(s.cost.note)}</p>
      <p class="cost-fine">Every job is quoted in writing before work starts.</p>
    </div>
    <div class="signs-box">
      <h2>Signs you need this</h2>
      <ul>${s.signs.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
    </div>
  </aside>
</div></section>

${faqBlock(s.faqs, `${s.short}: common questions`)}

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
  const body = `
<section class="hero hero-inner hero-route-inner"><div class="wrap">
  <h1>Service areas</h1>
  <p class="hero-answer">${esc(B.name)} serves ${cities.length} towns across Placer, Sacramento, Nevada and El Dorado counties. Most are within 35 minutes of our Newcastle shop along I-80 or Highway 49.</p>
</div>
<div class="wrap-wide hero-route">${routeProfile()}</div></section>

<section class="section"><div class="wrap county-grid">
  ${counties.map((co) => `<div><h2>${co}</h2><ul class="county-list">${cities.filter((c) => c.county === co).map((c) => `<li><a href="${cityUrl(c)}"><span>${esc(c.name)}</span><span class="county-meta">${c.drive ? `about ${c.drive} min` : 'home base'}</span></a></li>`).join('')}</ul></div>`).join('')}
</div></section>

<section class="section"><div class="wrap">
  <h2>Utilities and permit offices by town</h2>
  ${utilityTable()}
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
  const answer = `${B.name} is a licensed electrician serving ${c.name}, ${c.county}, from our shop in ${B.city}${c.drive ? `, about ${c.drive} minutes away` : ''}. We handle ${focus.map((s) => s.noun).join(', ').replace(/, ([^,]*)$/, ' and $1')}, plus repairs and everything in between, with permits through ${withThe(c.permits.split(' (')[0])}.`;
  const faqs = [
    ...c.faqs,
    { q: `Who supplies electricity in ${c.name}, CA?`, a: `${c.name} is served by ${c.utility}. We coordinate disconnects, reconnects and service upgrades with ${c.utility} as part of panel and service work.` },
    { q: `Where do I get an electrical permit in ${c.name}?`, a: `Electrical permits for ${c.name} are issued by ${withThe(c.permits)}. We pull the permit and schedule the inspection for you.` },
    { q: `How quickly can an electrician get to ${c.name}?`, a: c.drive ? `Our shop in Newcastle is about ${c.drive} minutes from ${c.name}. Urgent calls are often seen the same day, and estimates are usually scheduled within a few days.` : `We’re based in Newcastle, so we can usually be there the same day.` },
  ].filter((f, i, arr) => arr.findIndex((g) => g.q === f.q) === i);
  const body = `
<section class="hero hero-inner"><div class="wrap">
  <h1>Electrician in ${esc(c.name)}, CA</h1>
  <p class="hero-answer">${esc(answer)}</p>
  <div class="hero-actions"><a class="btn btn-call" href="${telHref}">Call ${esc(B.phone)}</a><a class="btn btn-ghost" href="#estimate">Get an estimate</a></div>
  <dl class="facts">
    <div><dt>Elevation</dt><dd>${fmt(c.elev)} ft</dd></div>
    <div><dt>Utility</dt><dd>${esc(c.utility)}</dd></div>
    <div><dt>County</dt><dd>${esc(c.county)}</dd></div>
    <div><dt>From our shop</dt><dd>${c.drive ? `about ${c.drive} min` : 'We’re here'}</dd></div>
    <div><dt>ZIP codes</dt><dd>${c.zips.join(', ')}</dd></div>
  </dl>
</div>
${c.route !== null || c.spur !== undefined ? `<div class="wrap-wide hero-route">${routeProfile({ current: c.slug })}</div>` : ''}
</section>

<section class="section"><div class="wrap narrow prose">
  <h2>Electrical work in ${esc(c.name)}</h2>
  <p class="lead">${esc(c.lede)}</p>
  ${c.notes.map((n) => `<p>${esc(n)}</p>`).join('')}
  <p><strong>Permits:</strong> issued by ${esc(withThe(c.permits))}.</p>
</div></section>

<section class="section"><div class="wrap">
  <h2>Most requested in ${esc(c.name)}</h2>
  ${serviceIndex(focus)}
  <h3 class="also-h">We also handle</h3>
  <ul class="related">${others.map((s) => `<li><a href="${svcUrl(s)}">${esc(s.name)}</a></li>`).join('')}</ul>
</div></section>

${faqBlock(faqs, `Electricians in ${c.name}: common questions`)}

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
    body, crumbs, ogType: 'profile',
    schema: [{ '@context': 'https://schema.org', '@type': 'AboutPage', url: fullUrl(path), about: { '@id': BIZ_ID } }],
  }));
}

function faqPage() {
  const path = '/faq/';
  const crumbs = [{ name: 'Home', url: '/' }, { name: 'FAQ', url: path }];
  const groups = [
    { h: 'Working with us', faqs: generalFaqs },
    ...services.map((s) => ({ h: s.name, faqs: s.faqs, url: svcUrl(s) })),
  ];
  const all = groups.flatMap((g) => g.faqs);
  const body = `
<section class="hero hero-inner"><div class="wrap">
  <h1>Electrical questions, answered</h1>
  <p class="hero-answer">Straight answers about costs, permits, utilities and safety for homeowners in Placer, Sacramento, Nevada and El Dorado counties. If your question isn’t here, call ${esc(B.phone)}.</p>
</div></section>
<section class="section"><div class="wrap narrow">
  <nav class="faq-toc" aria-label="FAQ topics"><ul>${groups.map((g, i) => `<li><a href="#g${i}">${esc(g.h)}</a></li>`).join('')}</ul></nav>
  ${groups.map((g, i) => `<section class="faq-group" id="g${i}"><h2>${esc(g.h)}</h2><div class="faq-list">${g.faqs.map((f) => `<details><summary><h3>${esc(f.q)}</h3></summary><p>${esc(f.a)}</p></details>`).join('')}</div>${g.url ? `<p class="faq-more"><a href="${g.url}">More about ${esc(g.h.toLowerCase())}</a></p>` : ''}</section>`).join('')}
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
  <h1>Contact ${esc(B.name)}</h1>
  <p class="hero-answer">Call <a href="${telHref}">${esc(B.phone)}</a> or send the form below. ${esc(B.hoursText)}</p>
</div></section>
${estimateBlock()}
<section class="section"><div class="wrap narrow prose">
  <h2>Where we are</h2>
  <p>Based in ${esc(B.city)}, ${B.region} ${B.zip}, ${esc(B.county)}, just off I-80 between Penryn and Auburn. We come to you: see our <a href="/service-areas/">service areas</a>.</p>
</div></section>`;
  write(path, layout({
    path, title: `Contact | Call ${B.phone} | ${B.name}`,
    description: `Contact ${B.name}, a licensed electrician in Newcastle, CA. Call ${B.phone} or request an estimate online.`,
    body, crumbs, schema: [{ '@context': 'https://schema.org', '@type': 'ContactPage', url: fullUrl(path), about: { '@id': BIZ_ID } }],
  }));
}

function simplePages() {
  write('/thanks/', layout({
    path: '/thanks/', title: `Request received | ${B.name}`, description: 'Thanks for your request.',
    body: `<section class="hero hero-inner"><div class="wrap"><h1>Request received</h1><p class="hero-answer">We’ll call you back within one business day. If it’s urgent, call <a href="${telHref}">${esc(B.phone)}</a> now.</p><div class="hero-actions"><a class="btn btn-ghost" href="/">Back to home</a></div></div></section>`,
  }).replace('index, follow', 'noindex, follow'));
  pages.pop();
  write('/privacy/', layout({
    path: '/privacy/', title: `Privacy policy | ${B.name}`, description: `How ${B.name} handles information you send us.`,
    crumbs: [{ name: 'Home', url: '/' }, { name: 'Privacy', url: '/privacy/' }],
    body: `<section class="hero hero-inner"><div class="wrap"><h1>Privacy policy</h1></div></section>
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

> ${B.name}${B.formerly ? ` (formerly ${B.formerly})` : ''} is a licensed California C-10 electrical contractor based in ${B.city}, CA ${B.zip} (${B.county}). It serves the I-80 corridor from Sacramento to Colfax, Highway 49 to Grass Valley and Nevada City, plus Lincoln, Granite Bay, Folsom, El Dorado Hills and Lake of the Pines. Phone: ${B.phone}. License: ${B.license}.

## Key facts
- Services: ${services.map((s) => s.name).join('; ')}
- Hours: ${B.hoursText}
- Permits pulled and inspections handled on every job that requires them
- Works with all three local utilities: PG&E, SMUD (Sacramento, Citrus Heights) and Roseville Electric Utility (Roseville)
- Specializes in foothill and rural work: PSPS generator hookups, well pumps, barns and shops, older-home rewiring

## Services
${services.map((s) => `- [${s.name}](${fullUrl(svcUrl(s))}): ${s.answer} Typical cost: ${s.cost.range}.`).join('\n')}

## Service areas
${[...cities].sort((a, b) => a.elev - b.elev).map((c) => `- [Electrician in ${c.name}, CA](${fullUrl(cityUrl(c))}): ${c.county}; utility ${c.utility}; permits ${c.permits}; about ${c.drive} min from Newcastle.`).join('\n')}

## Pages
- [FAQ](${fullUrl('/faq/')})
- [About](${fullUrl('/about/')})
- [Contact](${fullUrl('/contact/')})
`);
  writeFileSync(join(OUT, 'site.webmanifest'), JSON.stringify({
    name: B.name, short_name: 'Off 80', start_url: '/', display: 'browser', background_color: '#F2F3EE', theme_color: '#1E3B2F',
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
home(); servicesIndex(); services.forEach(servicePage);
areasIndex(); cities.forEach(cityPage);
about(); faqPage(); contact(); simplePages();
seoFiles();
console.log(`Built ${pages.length} pages into ./${OUT}`);
