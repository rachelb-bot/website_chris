# Off 80 Electric — website

Static website for a licensed electrician based in Newcastle, CA, serving the I-80 corridor
(Sacramento → Roseville → Rocklin → Loomis → Penryn → Newcastle → Auburn → Meadow Vista → Applegate → Colfax)
and Hwy 49 to Grass Valley and Nevada City.

No framework, no dependencies: `node build.mjs` writes ~37 plain HTML pages to `dist/`.
Plain HTML is the fastest thing Google can crawl, so Core Web Vitals scores are excellent by default.

## Structure

| Path | What it is |
|---|---|
| `src/config.mjs` | **Business details: name, phone, license, domain. Edit this first.** |
| `src/services.mjs` | 12 service pages: copy, typical costs, FAQs |
| `src/cities.mjs` | 18 service-area pages: utility, permit office, elevation, local notes |
| `src/faqs.mjs` | Site-wide FAQ |
| `build.mjs` | Templates, schema.org markup, sitemap, robots.txt, llms.txt |
| `assets/` | CSS, JS, icons, social share image |
| `tools/make-images.cjs` | Regenerates icons and `og.png` (uses Playwright) |

## Run it

```bash
npm run serve   # builds, then serves on http://localhost:8080
```

## Deploy

Netlify is preferred because the estimate form works there with no extra setup. Connect the repo and it
reads `netlify.toml` (build `node build.mjs`, publish `dist`). Form submissions show up under
**Forms → estimate** in Netlify; set up an email notification there.
On another host, point the form's `action` at Formspree or similar, in `estimateBlock()` in `build.mjs`.

## What's built in for SEO and AEO

- One page per service and per town, with **unique local content** (utility, permit office, housing stock), not swapped-in city names
- Every page opens with a short, direct answer that search engines and AI assistants can quote
- schema.org JSON-LD: `Electrician` (LocalBusiness) with areaServed, `Service`, `FAQPage`, `BreadcrumbList`, `WebSite`
- `sitemap.xml`, `robots.txt` that explicitly welcomes AI crawlers, and `llms.txt` (a plain summary for AI assistants)
- Canonical URLs, Open Graph/Twitter cards, geo meta tags, semantic HTML, one H1 per page, accessible
  (keyboard focus, reduced motion, contrast)

## ⚠️ Before launch: owner must fill in

Everything below lives in `src/config.mjs` unless noted.

- [x] **Phone number:** (530) 368-5077
- [x] **CSLB license number:** #1128029 (confirm the class is C-10)
- [ ] **Email address and domain.** Placeholder `off80electric.com`; register the domain
- [x] **Owner's name:** Chris Bodily
- [ ] **Founding year**
- [ ] **Business hours and after-hours/emergency policy.** Confirm or edit `hoursText`
- [ ] **Confirm the typical cost ranges** in `src/services.mjs`. They're reasonable regional estimates, but they're his prices to set
- [ ] **Confirm drive times** and towns in `src/cities.mjs`; add or remove towns freely (each one is a single entry)

## Ranking: the parts a website can't do alone

The site is the foundation, but these decide most local "electrician near me" rankings:

1. **Google Business Profile.** Create or claim it under exactly the same name, phone and city as the site
   (NAP consistency). Set it up as a service-area business listing the same towns. Add the URL to `googleBusinessUrl`.
2. **Reviews.** Ask every happy customer for a Google review. This is the single biggest local ranking factor
   after proximity. Put the "write a review" link in `googleReviewUrl`. Don't add fake reviews or rating markup.
3. **Real photos.** Add job photos (panels, EV chargers, the truck with the new name) to service and city pages.
4. **Citations.** List the business on Yelp, Nextdoor, Angi, BBB, Bing Places and Apple Business Connect,
   with identical name, phone and city.
5. **Google Search Console and Bing Webmaster Tools.** Verify the domain and submit `/sitemap.xml`.
6. **Rebrand continuity.** Keep "Formerly Northern Spark Electric" on the site for a year, and update the truck,
   invoices and any existing listings to the new name.
