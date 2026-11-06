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
  logo: fullUrl('/assets/logo.png'),
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
  { url: '/guides/', name: 'Guides' },
  { url: '/pricing/', name: 'Pricing' },
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

const guideList = (list) => `<ul class="q-list">${list.map((g) => `<li><a href="${guideUrl(g)}">${icon(g.topic, 'q-ic')}<span class="q-q">${esc(g.q)}</span><span class="q-a">${esc(firstSentence(g.answer))}</span></a></li>`).join('')}</ul>`;

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
  <p class="lead">${esc(B.name)} is a licensed C-10 electrical contractor based in ${esc(B.city)}, California. We do residential, rural and light commercial electrical work along the I-80 corridor, and our most requested jobs are panel upgrades, EV charger installs and generator hookups for PG&amp;E shutoffs. We also rewire older homes and power barns, shops and ADUs. Every job is permitted and inspected.</p>
  <ul class="quick">
    <li>${icon('permit', 'quick-ic')}<span><strong>Licensed C-10</strong> #${esc(B.licenseNumber)}</span></li>
    <li>${icon('check', 'quick-ic')}<span><strong>Permits handled</strong> on every job</span></li>
    <li>${icon('pin', 'quick-ic')}<span><strong>${cities.length} towns</strong> from Sacramento to Nevada City</span></li>
    <li>${icon('costs', 'quick-ic')}<span><strong>Free estimates</strong> for projects</span></li>
  </ul>
  <p class="also">Also serving ${offRoute.map((c) => `<a href="${cityUrl(c)}">${esc(c.name)}</a>`).join(', ').replace(/, ([^,]*)$/, ' and $1')}.</p>
</div></section>

<section class="section" aria-labelledby="svc-h"><div class="wrap">
  <div class="section-head"><h2 id="svc-h">Most requested</h2><a class="more" href="/services/">All services</a></div>
  ${featured()}
  <h3 class="also-h">Everything else we do</h3>
  ${serviceIndex(others)}
</div></section>

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
  <div class="util-groups">${[['PG&E', 'pge', 'Most of Placer, Nevada and El Dorado counties, plus Folsom'], ['SMUD', 'smud', 'Sacramento and Citrus Heights'], ['Roseville Electric', 'roseville', 'City of Roseville only']].map(([u, k, note]) => `
    <div class="util-group util-g-${k}">${icon('tower', 'ug-ic')}<h3>${esc(u)}</h3><p>${esc(note)}</p>
      <ul class="town-chips">${cities.filter((c) => c.utility.startsWith(u.split(' ')[0])).map((c) => `<li><a href="${cityUrl(c)}">${esc(c.name)}</a></li>`).join('')}</ul></div>`).join('')}
  </div>
  <p class="more-line"><a href="/service-areas/">See permit offices for every town</a></p>
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
  <div class="hero-actions"><a class="btn btn-call" href="${telHref}">Call ${esc(B.phone)}</a><a class="btn btn-ghost" href="#estimate">Get a quote</a></div>
  </div>${medal(s.slug)}</div>
</div></section>
<div class="wrap">${toc([...s.sections.map((x) => [slugify(x.h), x.h]), ['faq-h', 'Questions'], ['estimate', 'Get a quote']])}</div>

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
    { q: `How much does an electrician cost in ${c.name}?`, a: `Most service calls and small repairs in ${c.name} run $150–$450. Typical project prices: panel upgrades ${serviceBySlug['panel-upgrades'].cost.range}, EV charger installs ${serviceBySlug['ev-charger-installation'].cost.range}, and generator interlocks ${serviceBySlug['generator-installation'].cost.range}. Estimates for projects are free.` },
    c.utility === 'PG&E'
      ? { q: `Is ${c.name} affected by PG&E power shutoffs (PSPS)?`, a: c.elev >= 900 ? `Yes. ${c.name} is in the foothills, where PG&E Public Safety Power Shutoffs happen during high fire danger. A permitted generator interlock, standby generator or battery system keeps essentials running.` : `Less often than foothill towns, but PG&E can de-energize any line that passes through high fire-threat areas. Many ${c.name} homeowners add a generator inlet or battery backup as a precaution.` }
      : { q: `Does ${c.utility} offer rebates for electrical upgrades in ${c.name}?`, a: `${c.utility} has offered incentives for EV chargers, panel upgrades and electrification in recent years. Programs change often, so we confirm what’s currently available before you buy equipment.` },
    { q: `What electrical problems are common in ${c.name} homes?`, a: firstSentence(c.notes[0]) + ' ' + (c.focus.includes('home-rewiring') ? 'Older homes here often need rewiring or panel replacement.' : c.focus.includes('generator-installation') ? 'Outage preparation is one of the most common requests here.' : 'Adding capacity for EV chargers, solar and spas is one of the most common requests here.') },
    { q: `How quickly can an electrician get to ${c.name}?`, a: c.drive ? `Our shop in Newcastle is about ${c.drive} minutes from ${c.name}. Urgent calls are often seen the same day, and estimates are usually scheduled within a few days.` : `We’re based in Newcastle, so we can usually be there the same day.` },
  ].filter((f, i, arr) => arr.findIndex((g) => g.q === f.q) === i);
  const body = `
<section class="hero hero-inner"><div class="wrap">
  <h1>Electrician in ${esc(c.name)}, CA</h1>
  <p class="hero-answer">${esc(answer)}</p>
  <div class="hero-actions"><a class="btn btn-call" href="${telHref}">Call ${esc(B.phone)}</a><a class="btn btn-ghost" href="#estimate">Get an estimate</a></div>
  <dl class="facts">
    <div>${icon('mountain', 'fact-ic')}<dt>Elevation</dt><dd>${fmt(c.elev)} ft</dd></div>
    <div>${icon('tower', 'fact-ic')}<dt>Utility</dt><dd>${esc(c.utility)}</dd></div>
    <div>${icon('pin', 'fact-ic')}<dt>County</dt><dd>${esc(c.county)}</dd></div>
    <div>${icon('clock', 'fact-ic')}<dt>From our shop</dt><dd>${c.drive ? `about ${c.drive} min` : 'We’re here'}</dd></div>
    <div>${icon('permit', 'fact-ic')}<dt>ZIP codes</dt><dd>${c.zips.join(', ')}</dd></div>
  </dl>
</div>
${c.route !== null || c.spur !== undefined ? `<div class="wrap-wide hero-route">${routeProfile({ current: c.slug })}</div>` : ''}
</section>

<div class="wrap">${toc([['local', `Work in ${c.name}`], ['popular', 'Most requested'], ['faq-h', 'Questions'], ['cg-h', 'Guides'], ['estimate', 'Book'] ])}</div>
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
    body, crumbs, pageType: 'ContactPage',
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
      <a class="btn btn-call" href="#estimate">Get an estimate</a>
    </div>
  </aside>
</div></section>

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
    <tbody>${services.map((s) => `<tr><th scope="row"><a class="price-svc" href="${svcUrl(s)}">${icon(s.slug, 'row-ic')}<span>${esc(s.name)}</span></a></th><td class="price">${esc(s.cost.range)}</td><td>${esc(s.cost.note.replace(/^./, (m) => m.toUpperCase()))}</td><td>${esc(s.time)}</td></tr>`).join('')}</tbody>
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

> ${B.name}${B.formerly ? ` (formerly ${B.formerly})` : ''} is a licensed California C-10 electrical contractor based in ${B.city}, CA ${B.zip} (${B.county}). It serves the I-80 corridor from Sacramento to Colfax, Highway 49 to Grass Valley and Nevada City, plus Lincoln, Granite Bay, Folsom, El Dorado Hills and Lake of the Pines. Phone: ${B.phone}. License: ${B.license}.

## Key facts
- Most requested services: ${popular.map((s) => s.name).join(', ')}
- Services: ${services.map((s) => s.name).join('; ')}
- Hours: ${B.hoursText}
- Permits pulled and inspections handled on every job that requires them
- Works with all three local utilities: PG&E, SMUD (Sacramento, Citrus Heights) and Roseville Electric Utility (Roseville)
- Specializes in foothill and rural work: PSPS generator hookups, well pumps, barns and shops, older-home rewiring

## Services
${services.map((s) => `- [${s.name}](${fullUrl(svcUrl(s))}): ${s.answer} Typical cost: ${s.cost.range}.`).join('\n')}

## Service areas
${[...cities].sort((a, b) => a.elev - b.elev).map((c) => `- [Electrician in ${c.name}, CA](${fullUrl(cityUrl(c))}): ${c.county}; utility ${c.utility}; permits ${c.permits}; about ${c.drive} min from Newcastle.`).join('\n')}

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
guidesIndex(); guides.forEach(guidePage); pricingPage(); glossaryPage();
seoFiles();
console.log(`Built ${pages.length} pages into ./${OUT}`);
