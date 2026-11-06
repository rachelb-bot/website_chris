// Runs automatically on Netlify each time a form on the site is submitted
// (the "submission-created" event). Sends:
//   1. a confirmation to the customer (only when they gave an email address)
//   2. a new-request alert to the business inbox (NOTIFY_EMAIL)
//
// Environment variables (Netlify → Site configuration → Environment variables):
//   RESEND_API_KEY  API key from resend.com (the email sending service)
//   NOTIFY_EMAIL    inbox for new requests, e.g. chris@...; comma-separate for several
//   FROM_EMAIL      optional, defaults to "Off 80 Electric <info@off80electric.com>"
import { business as B } from '../../src/config.mjs';
import { customerQuote, customerMessage, inboxQuote, inboxMessage } from '../../emails/templates.mjs';

const isEmail = (v = '') => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim());

export async function send({ to, subject, html, text, replyTo }, fetchImpl = fetch) {
  const res = await fetchImpl('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.FROM_EMAIL || `${B.name} <${B.email}>`,
      to: Array.isArray(to) ? to : String(to).split(',').map((s) => s.trim()).filter(Boolean),
      subject, html, text,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
  });
  if (!res.ok) throw new Error(`Email to ${to} failed: ${res.status} ${await res.text()}`);
  return res;
}

// Builds the emails for one submission. Exported so it can be tested without sending anything.
export function buildEmails(payload) {
  const form = payload.form_name;
  const d = payload.data || {};
  const meta = { at: payload.created_at, page: d.referrer };
  const inbox = (process.env.NOTIFY_EMAIL || B.notifyEmail || '').trim();
  const out = [];

  if (form === 'quote') {
    const confirmed = isEmail(d.email);
    if (confirmed) out.push({ to: d.email.trim(), replyTo: B.email, ...customerQuote(d) });
    if (inbox) out.push({ to: inbox, ...inboxQuote(d, { ...meta, confirmed }) });
  } else if (form === 'message') {
    const confirmed = isEmail(d.contact);
    if (confirmed) out.push({ to: d.contact.trim(), replyTo: B.email, ...customerMessage(d) });
    if (inbox) out.push({ to: inbox, ...inboxMessage(d, { ...meta, confirmed }) });
  }
  return out;
}

export const handler = async (event) => {
  const { payload } = JSON.parse(event.body || '{}');
  if (!payload) return { statusCode: 400, body: 'No submission payload' };
  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not set; no emails were sent.');
    return { statusCode: 200, body: 'Email not configured' };
  }
  if (!process.env.NOTIFY_EMAIL && !B.notifyEmail) console.warn('NOTIFY_EMAIL is not set; the business inbox alert was skipped.');

  const emails = buildEmails(payload);
  // Send the inbox alert even if the customer confirmation fails, and vice versa.
  const results = await Promise.allSettled(emails.map((e) => send(e)));
  results.filter((r) => r.status === 'rejected').forEach((r) => console.error(r.reason));
  return { statusCode: 200, body: `Sent ${results.filter((r) => r.status === 'fulfilled').length} of ${emails.length} emails` };
};
