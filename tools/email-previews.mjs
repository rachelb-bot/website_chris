// Renders every email with sample data to emails/previews/ for review, and tests the send logic.
import { writeFileSync, mkdirSync } from 'node:fs';
import { buildEmails, send } from '../netlify/functions/submission-created.mjs';
process.env.NOTIFY_EMAIL ||= 'inbox@example.com';
const quote = { form_name: 'quote', created_at: '2026-11-06T18:42:00Z', data: { name: 'Dana Whitfield', phone: '(530) 555-0142', email: 'dana@example.com', town: 'Auburn', service: 'Panel upgrades', reply: 'Text', message: 'Federal Pacific panel in the garage, 100 amp. Want to add an EV charger next year. Weekday mornings work best.', photos: [{ url: 'https://example.com/panel-1.jpg', filename: 'panel-1.jpg' }, { url: 'https://example.com/panel-2.jpg', filename: 'panel-2.jpg' }], referrer: 'https://www.off80electric.com/services/panel-upgrades/' } };
const quoteNoEmail = { ...quote, data: { ...quote.data, email: '', reply: 'Call', name: 'Ray Ortega', town: 'Colfax', service: 'Generators', photos: null } };
const msg = { form_name: 'message', created_at: '2026-11-06T19:05:00Z', data: { name: 'Pat Lindqvist', contact: 'pat@example.com', message: 'Do you work on Saturdays? We have a few outlets in the kitchen that stopped working.', referrer: 'https://www.off80electric.com/contact/' } };
mkdirSync('emails/previews', { recursive: true });
const names = { 0: ['quote-customer', 'quote-inbox'], 1: ['quote-no-email-inbox'], 2: ['message-customer', 'message-inbox'] };
const results = [quote, quoteNoEmail, msg].map((p) => buildEmails(p));
results.forEach((list, i) => list.forEach((e, j) => {
  writeFileSync(`emails/previews/${names[i][j]}.html`, e.html);
  console.log(`${names[i][j]}  to=${e.to}  subject="${e.subject}"  replyTo=${e.replyTo || '-'}`);
}));
// Exercise send() against a stand-in for the email service
const calls = [];
const fake = async (url, opts) => { calls.push(JSON.parse(opts.body)); return { ok: true }; };
for (const e of results.flat()) await send(e, fake);
console.log('send() calls:', calls.length, 'from:', calls[0].from, 'reply_to on inbox alert:', calls[1].reply_to);
