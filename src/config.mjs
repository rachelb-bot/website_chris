// ─────────────────────────────────────────────────────────────
// Business details. Everything marked TODO must be confirmed by
// the owner before launch — these values feed every page, the
// schema.org markup, the sitemap and llms.txt.
// ─────────────────────────────────────────────────────────────
export const business = {
  name: 'Off 80 Electric',
  formerly: 'Northern Spark Electric', // shown in footer + schema alternateName; set to '' to hide
  tagline: 'Licensed electrician for the I-80 corridor, Sacramento to Colfax',
  owner: 'Chris Bodily',
  domain: 'https://www.off80electric.com', // TODO: final domain (no trailing slash)
  phone: '(530) 368-5077',
  phoneE164: '+15303685077',
  email: 'info@off80electric.com', // public address; confirmation emails are sent from this address
  // Where new quote requests and messages are delivered. Set NOTIFY_EMAIL in Netlify's environment variables.
  notifyEmail: process.env.NOTIFY_EMAIL || '', // TODO: inbox address for new requests
  license: 'CA C-10 License #1128029', // TODO: confirm the license class is C-10
  licenseNumber: '1128029',
  street: '', // leave blank to run as a service-area business (address hidden), or add a street
  city: 'Newcastle',
  region: 'CA',
  zip: '95658',
  county: 'Placer County',
  lat: 38.8741,
  lng: -121.1336,
  hours: [
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '07:00', closes: '17:00' },
  ],
  hoursText: 'Mon–Fri 7am–5pm. Emergency calls answered after hours.', // TODO: confirm
  googleBusinessUrl: '', // TODO: Google Business Profile URL (big ranking factor)
  googleReviewUrl: '', // TODO: direct "write a review" link
  yelpUrl: '',
  facebookUrl: '',
  nextdoorUrl: '',
  founded: '', // TODO: year, e.g. '2015'
};

export const fullUrl = (path = '/') => business.domain + path;
