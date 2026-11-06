// ─────────────────────────────────────────────────────────────
// Business details. Everything marked TODO must be confirmed by
// the owner before launch — these values feed every page, the
// schema.org markup, the sitemap and llms.txt.
// ─────────────────────────────────────────────────────────────
export const business = {
  name: 'Off 80 Electric',
  formerly: 'Northern Spark Electric', // shown in footer + schema alternateName; set to '' to hide
  tagline: 'Licensed electrician for the I-80 corridor, Sacramento to Colfax',
  owner: 'Chris', // TODO: confirm owner's full name
  domain: 'https://www.off80electric.com', // TODO: final domain (no trailing slash)
  phone: '(916) 555-0180', // TODO: real phone number (555-01xx is a reserved fictional number)
  phoneE164: '+19165550180', // TODO: same number in +1XXXXXXXXXX form
  email: 'hello@off80electric.com', // TODO: real email
  license: 'CA C-10 License #0000000', // TODO: real CSLB license number
  licenseNumber: '0000000', // TODO: digits only, used for the CSLB lookup link
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
