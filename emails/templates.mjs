// Email templates for every form submission.
// Each function returns { subject, preheader, html, text }.
//   customerQuote / customerMessage  → confirmation sent to the person who filled in the form
//   inboxQuote / inboxMessage        → new-request alert sent to the business inbox
// HTML uses tables and inline styles so it renders in Gmail, Outlook and Apple Mail.
import { business as B } from '../src/config.mjs';
import { cities } from '../src/cities.mjs';

const C = { night: '#16302F', night2: '#1F403E', rust: '#B9481F', tan: '#E7CF97', paper: '#F0EDE5', ink: '#1A2A2A', soft: '#4B5957', rule: '#D5CEBF' };
const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const nl = (s = '') => esc(s).replace(/\n/g, '<br>');
const first = (name = '') => (name.trim().split(/\s+/)[0] || 'there');
const site = B.domain;
const tel = `tel:${B.phoneE164}`;
const isEmail = (v = '') => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const digits = (v = '') => v.replace(/[^\d+]/g, '');

export const cityInfo = (town = '') => cities.find((c) => c.name.toLowerCase() === town.trim().toLowerCase());

// Photos from Netlify file uploads arrive as {url, filename} objects, an array of them, or a URL string.
export const photoList = (p) => {
  if (!p) return [];
  const arr = Array.isArray(p) ? p : [p];
  return arr.map((x) => (typeof x === 'string' ? { url: x, filename: 'photo' } : { url: x.url, filename: x.filename || 'photo' })).filter((x) => x.url);
};

// ── shared pieces ──
const shell = ({ preheader, body, footer }) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light"><title>${esc(B.name)}</title></head>
<body style="margin:0;padding:0;background:${C.paper};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(preheader)}&#8199;&#65279;&#847; &#8199;&#65279;&#847; &#8199;&#65279;&#847;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.paper};"><tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;">
  <tr><td style="background:${C.night};padding:22px 28px;border-bottom:5px solid ${C.rust};">
    <table role="presentation" cellpadding="0" cellspacing="0"><tr>
      <td style="padding-right:12px;"><img src="${site}/assets/logo-off80-300.png" width="56" height="56" alt="" style="display:block;"></td>
      <td style="font:700 22px/1.1 Georgia,'Rockwell',serif;color:${C.tan};">${esc(B.name)}<br><span style="font:400 13px/1.6 Arial,sans-serif;color:#AFBDB6;">Licensed electrician, Newcastle, CA</span></td>
    </tr></table>
  </td></tr>
  <tr><td style="padding:28px 28px 8px;font:16px/1.6 Arial,Helvetica,sans-serif;color:${C.ink};">${body}</td></tr>
  <tr><td style="padding:18px 28px 26px;font:13px/1.6 Arial,Helvetica,sans-serif;color:${C.soft};border-top:1px solid ${C.rule};">${footer}</td></tr>
</table>
</td></tr></table>
</body></html>`;

const button = (href, label, color = C.rust) => `<a href="${esc(href)}" style="display:inline-block;background:${color};color:#ffffff;font:700 16px/1 Arial,sans-serif;text-decoration:none;padding:14px 22px;border-radius:6px;margin:0 8px 8px 0;">${esc(label)}</a>`;
const rows = (pairs) => `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:2px solid ${C.ink};margin:8px 0 20px;">
${pairs.filter(([, v]) => v).map(([k, v]) => `<tr><td style="padding:10px 12px 10px 0;border-bottom:1px solid ${C.rule};font:14px/1.5 Arial,sans-serif;color:${C.soft};vertical-align:top;width:34%;">${esc(k)}</td><td style="padding:10px 0;border-bottom:1px solid ${C.rule};font:15px/1.5 Arial,sans-serif;color:${C.ink};vertical-align:top;">${v}</td></tr>`).join('')}
</table>`;
const steps = (list) => `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 20px;">${list.map((t, i) => `<tr><td style="vertical-align:top;padding:0 12px 12px 0;"><div style="width:28px;height:28px;border-radius:14px;background:${C.night};color:${C.tan};font:700 14px/28px Arial,sans-serif;text-align:center;">${i + 1}</div></td><td style="padding:3px 0 12px;font:16px/1.5 Arial,sans-serif;color:${C.ink};">${t}</td></tr>`).join('')}</table>`;
const spamNote = `<div style="background:${C.paper};border-radius:8px;padding:14px 16px;margin:0 0 20px;font:14px/1.55 Arial,sans-serif;color:${C.ink};"><strong>Make sure our reply reaches you:</strong> add <a href="mailto:${B.email}" style="color:${C.rust};">${esc(B.email)}</a> to your contacts. If you can’t find an email from us, check your spam or promotions folder.</div>`;
const emergencyNote = `<div style="border-left:4px solid ${C.rust};background:#FBEFE9;padding:14px 16px;margin:0 0 22px;font:14px/1.55 Arial,sans-serif;color:${C.ink};"><strong>If it turns urgent</strong> (a burning smell, sparks, or part of the house without power), don’t wait for our reply. Turn off the breaker for that area and call <a href="${tel}" style="color:${C.rust};font-weight:700;">${esc(B.phone)}</a>. If you see smoke or flames, call 911.</div>`;
const signoff = `<p style="margin:0 0 4px;">Thanks,</p><p style="margin:0 0 20px;"><strong>${esc(B.owner)}</strong><br>Owner, ${esc(B.name)}<br><a href="${tel}" style="color:${C.rust};">${esc(B.phone)}</a></p>`;
const customerFooter = (why) => `${esc(B.name)}${B.formerly ? ` (formerly ${esc(B.formerly)})` : ''}, ${esc(B.city)}, ${B.region}. ${esc(B.license)}.<br>You’re getting this email because ${why} at <a href="${site}" style="color:${C.soft};">${site.replace(/^https?:\/\//, '')}</a>. It’s a one-time confirmation, not a mailing list.`;
const replyLabel = (d) => ({ Call: `call you at ${d.phone}`, Text: `text you at ${d.phone}`, Email: `email you at ${d.email}` }[d.reply] || `call you at ${d.phone}`);
const textBlock = (lines) => lines.filter((l) => l !== null && l !== undefined).join('\n');

// ───────────────────────── Customer: quote confirmation ─────────────────────────
export function customerQuote(d) {
  const photos = photoList(d.photos);
  const subject = `We got your quote request, ${first(d.name)}`;
  const preheader = `We’ll ${replyLabel(d)} within one business day.`;
  const body = `
<h1 style="font:700 26px/1.2 Georgia,'Rockwell',serif;color:${C.night};margin:0 0 14px;">Thanks, ${esc(first(d.name))}. Your request is in.</h1>
<p style="margin:0 0 18px;">We’ve received your request${d.service ? ` for <strong>${esc(d.service.toLowerCase())}</strong>` : ''}${d.town ? ` in <strong>${esc(d.town)}</strong>` : ''}. Here’s what happens next:</p>
${steps([
  `${esc(B.owner.split(' ')[0])} reviews your details${photos.length ? ' and photos' : ''}.`,
  `We ${esc(replyLabel(d))} within one business day, usually the same day.`,
  'You get a written price, or we set a time to look at the job in person. Project quotes are free.',
])}
${spamNote}
<p style="margin:0 0 6px;font-weight:700;">What you sent us</p>
${rows([['Service', esc(d.service)], ['Town', esc(d.town)], ['Phone', esc(d.phone)], ['Email', esc(d.email)], ['Best way to reach you', esc(d.reply)], ['Details', nl(d.message)], ['Photos', photos.length ? `${photos.length} attached` : '']])}
<p style="margin:0 0 20px;">Want to add something, like a photo of your panel? Just reply to this email.</p>
${emergencyNote}
${signoff}`;
  const text = textBlock([
    `Thanks, ${first(d.name)}. Your request is in.`, '',
    `We've received your request${d.service ? ` for ${d.service.toLowerCase()}` : ''}${d.town ? ` in ${d.town}` : ''}. What happens next:`,
    `1. ${B.owner.split(' ')[0]} reviews your details${photos.length ? ' and photos' : ''}.`,
    `2. We ${replyLabel(d)} within one business day, usually the same day.`,
    '3. You get a written price, or we set a time to look at the job in person. Project quotes are free.', '',
    `Make sure our reply reaches you: add ${B.email} to your contacts. If you can't find an email from us, check your spam or promotions folder.`, '',
    'What you sent us:', d.service && `Service: ${d.service}`, d.town && `Town: ${d.town}`, d.phone && `Phone: ${d.phone}`, d.email && `Email: ${d.email}`, d.reply && `Best way to reach you: ${d.reply}`, d.message && `Details: ${d.message}`, photos.length ? `Photos: ${photos.length} attached` : null, '',
    'Want to add something, like a photo of your panel? Just reply to this email.', '',
    `If it turns urgent (a burning smell, sparks, or part of the house without power), don't wait for our reply. Turn off the breaker for that area and call ${B.phone}. If you see smoke or flames, call 911.`, '',
    'Thanks,', B.owner, `Owner, ${B.name}`, B.phone, '', `${B.name}, ${B.city}, ${B.region}. ${B.license}.`,
  ]);
  return { subject, preheader, html: shell({ preheader, body, footer: customerFooter('you requested a quote') }), text };
}

// ───────────────────────── Customer: message confirmation ─────────────────────────
export function customerMessage(d) {
  const subject = `Thanks for your message, ${first(d.name)}`;
  const preheader = 'We’ll reply within one business day.';
  const body = `
<h1 style="font:700 26px/1.2 Georgia,'Rockwell',serif;color:${C.night};margin:0 0 14px;">Thanks, ${esc(first(d.name))}. We got your message.</h1>
<p style="margin:0 0 18px;">We’ll reply within one business day, usually the same day. If you need a price for a project, you can also <a href="${site}/contact/#quote" style="color:${C.rust};font-weight:700;">request a quote</a> and add photos.</p>
${spamNote}
<p style="margin:0 0 6px;font-weight:700;">Your message</p>
${rows([['Message', nl(d.message)]])}
${emergencyNote}
${signoff}`;
  const text = textBlock([
    `Thanks, ${first(d.name)}. We got your message.`, '',
    'We will reply within one business day, usually the same day.', '',
    `Make sure our reply reaches you: add ${B.email} to your contacts. If you can't find an email from us, check your spam or promotions folder.`, '',
    'Your message:', d.message, '',
    `If it turns urgent (a burning smell, sparks, or part of the house without power), turn off the breaker for that area and call ${B.phone}. If you see smoke or flames, call 911.`, '',
    'Thanks,', B.owner, `Owner, ${B.name}`, B.phone,
  ]);
  return { subject, preheader, html: shell({ preheader, body, footer: customerFooter('you sent us a message') }), text };
}

// ───────────────────────── Inbox alerts ─────────────────────────
const when = (iso) => new Date(iso || Date.now()).toLocaleString('en-US', { timeZone: 'America/Los_Angeles', weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) + ' Pacific';
const inboxFooter = (meta) => `Sent from the ${meta.form} form on ${site.replace(/^https?:\/\//, '')}${meta.page ? ` (page: <a href="${esc(meta.page)}" style="color:${C.soft};">${esc(meta.page.replace(/^https?:\/\/[^/]+/, '') || '/')}</a>)` : ''}. ${meta.confirmed ? 'A confirmation email was sent to the customer.' : '<strong>No confirmation was sent</strong> because the customer didn’t give an email address. Reply by phone or text.'}`;

export function inboxQuote(d, meta = {}) {
  const photos = photoList(d.photos);
  const city = cityInfo(d.town);
  const subject = `New quote request: ${d.service || 'General'}${d.town ? ` in ${d.town}` : ''} from ${d.name}`;
  const preheader = `${d.name}, ${d.phone}. Prefers ${(d.reply || 'Call').toLowerCase()}.`;
  const actions = [
    d.phone && button(`tel:${digits(d.phone)}`, `Call ${d.phone}`),
    d.phone && button(`sms:${digits(d.phone)}`, 'Send a text', C.night),
    isEmail(d.email) && button(`mailto:${d.email}?subject=${encodeURIComponent(`Your ${d.service ? d.service.toLowerCase() : 'electrical'} quote from ${B.name}`)}`, 'Reply by email', C.night2),
  ].filter(Boolean).join('');
  const body = `
<p style="margin:0 0 4px;font:700 13px/1.4 Arial,sans-serif;color:${C.rust};">New quote request, ${esc(when(meta.at))}</p>
<h1 style="font:700 26px/1.2 Georgia,'Rockwell',serif;color:${C.night};margin:0 0 6px;">${esc(d.name)}${d.town ? `, ${esc(d.town)}` : ''}</h1>
<p style="margin:0 0 16px;font-size:18px;">${esc(d.service || 'Service not chosen')}. Prefers <strong>${esc((d.reply || 'Call').toLowerCase())}</strong>.</p>
<div style="margin:0 0 14px;">${actions}</div>
<p style="margin:0 0 18px;font-size:14px;color:${C.soft};">Promised reply: within one business day.</p>
${rows([
  ['Phone', d.phone ? `<a href="tel:${digits(d.phone)}" style="color:${C.rust};">${esc(d.phone)}</a>` : ''],
  ['Email', isEmail(d.email) ? `<a href="mailto:${esc(d.email)}" style="color:${C.rust};">${esc(d.email)}</a>` : '<span style="color:#8A6A00;">Not given</span>'],
  ['Town', esc(d.town)],
  ['Utility', city ? esc(city.utility) : ''],
  ['Permits', city ? esc(city.permits) : ''],
  ['Drive from shop', city && city.drive ? `About ${city.drive} min` : ''],
  ['Service', esc(d.service)],
  ['Details', nl(d.message) || '<span style="color:#8A6A00;">None given</span>'],
  ['Photos', photos.length ? photos.map((p, i) => `<a href="${esc(p.url)}" style="color:${C.rust};">Photo ${i + 1}</a>`).join(' &nbsp; ') : 'None'],
])}`;
  const text = textBlock([
    `New quote request, ${when(meta.at)}`, '',
    `${d.name}${d.town ? `, ${d.town}` : ''}`, `${d.service || 'Service not chosen'}. Prefers ${(d.reply || 'call').toLowerCase()}.`, '',
    `Phone: ${d.phone}`, `Email: ${isEmail(d.email) ? d.email : 'Not given'}`, d.town && `Town: ${d.town}`, city && `Utility: ${city.utility}`, city && `Permits: ${city.permits}`, city && city.drive ? `Drive from shop: about ${city.drive} min` : null,
    `Details: ${d.message || 'None given'}`, `Photos: ${photos.length ? photos.map((p) => p.url).join(' ') : 'None'}`, '',
    meta.confirmed ? 'A confirmation email was sent to the customer.' : 'No confirmation was sent (no email given). Reply by phone or text.',
  ]);
  return { subject, preheader, html: shell({ preheader, body, footer: inboxFooter({ ...meta, form: 'Request a quote', confirmed: meta.confirmed }) }), text, replyTo: isEmail(d.email) ? d.email : undefined };
}

export function inboxMessage(d, meta = {}) {
  const email = isEmail(d.contact) ? d.contact.trim() : '';
  const phone = email ? '' : d.contact;
  const subject = `New message from ${d.name}`;
  const preheader = (d.message || '').slice(0, 90);
  const actions = [
    phone && button(`tel:${digits(phone)}`, `Call ${phone}`),
    phone && button(`sms:${digits(phone)}`, 'Send a text', C.night),
    email && button(`mailto:${email}?subject=${encodeURIComponent(`Re: your message to ${B.name}`)}`, 'Reply by email'),
  ].filter(Boolean).join('');
  const body = `
<p style="margin:0 0 4px;font:700 13px/1.4 Arial,sans-serif;color:${C.rust};">New message, ${esc(when(meta.at))}</p>
<h1 style="font:700 26px/1.2 Georgia,'Rockwell',serif;color:${C.night};margin:0 0 14px;">${esc(d.name)}</h1>
<div style="margin:0 0 14px;">${actions}</div>
<p style="margin:0 0 18px;font-size:14px;color:${C.soft};">Promised reply: within one business day.</p>
${rows([['Contact', esc(d.contact)], ['Message', nl(d.message)]])}`;
  const text = textBlock([`New message, ${when(meta.at)}`, '', d.name, `Contact: ${d.contact}`, '', d.message, '', meta.confirmed ? 'A confirmation email was sent to the customer.' : 'No confirmation was sent (no email given).']);
  return { subject, preheader, html: shell({ preheader, body, footer: inboxFooter({ ...meta, form: 'Send a message', confirmed: meta.confirmed }) }), text, replyTo: email || undefined };
}
