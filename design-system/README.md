Off 80 Electric is a licensed electrician based in Newcastle, California, working the I-80 corridor from Sacramento up to Colfax and Highway 49 to Grass Valley. The brand comes from the owner's original Northern Spark badge: a lightning bolt striking a snowy Sierra peak at night, ringed in rust with tan lettering. Everything in this system should feel like that badge: a night sky over the foothills, plain-spoken, practical and local.

## The name

- Write it **Off 80 Electric**. Never "Off80", "OFF-80", "Off Eighty" or "Off 80 Electrical". In running text after the first mention, "Off 80" is fine.
- The owner is **Chris Bodily**. The license line is always **CA C-10 License #1128029**. The phone number is always written **(530) 368-5077**. The email is **info@off80electric.com**.
- For the first year after the rename, say **Formerly Northern Spark Electric** in footers, on the truck and on invoices, so existing customers recognise the business.

## Logos

Files are in the Logos group.

- `badge-off80.svg` is the primary logo. Use it wherever it can be 48px (0.75 in) across or larger: the site header, social avatars, the truck door, shirts, signs.
- `lockup-light.svg` (badge plus wordmark) goes on paper, white and tan grounds; `lockup-dark.svg` goes on night grounds. Use a lockup where the name must be read from a distance or the space is wide and short: invoices, email headers, yard signs, the tailgate.
- `mark.svg` is the simplified badge for anything under 48px: browser tabs, app icons, embroidery under 1.5 in.
- `badge-northern-spark.*` is the original badge, kept for continuity. Do not use it on new materials.
- Clear space around the badge is one eighth of its diameter on every side. Never recolor the badge, stretch it, add shadows or outlines, crop the ring, or set it on a photo without the full ring visible.
- All logo lettering is outlined, so the SVGs print correctly without fonts installed.

## Color

The palette is two grounds and two accents.

- **Grounds.** `night` is the brand ground: heroes, the contact band, featured tiles, the footer (`night-deep`). `paper` is the reading ground for long pages and print. Use the `surface` family of tokens for components so they work on either; the Paper and Night themes switch them.
- **Tan** (`tan`) is the badge lettering colour. On night it is the headline and link colour. On paper it is only ever a ground (the call-to-action band) with `ink` text on it. Never set tan text on paper.
- **Rust** (`rust`) means "do this": primary buttons, the badge ring, the band under heroes and the focus ring on paper. Rust text appears on paper only as `rust-deep` (prices, links). Never set small rust text on night.
- **Emergency** uses `rust-deep` text on `emergency-soft`, never a new red.
- **Utility tags** each have their own pair: `pge-ink` on `pge-soft`, `smud-ink` on `smud-soft`, `roseville-ink` on `roseville-soft`. They always carry the utility's name as text, never colour alone.
- Rough proportions on any page or print piece: two-thirds one ground, a quarter the other ground, and the remainder tan and rust. If rust is everywhere, nothing reads as the action.

Approved text pairs (all pass WCAG AA):

| Text | On | Contrast |
| --- | --- | --- |
| `ink` | `paper`, `card`, `paper-2`, `tan` | 9:1 and up |
| `ink-soft` | `paper`, `card` | 6.2:1 |
| `rust-deep` | `paper`, `card` | 6.2:1 |
| `on-night` | `night`, `night-2`, `night-deep` | 10:1 and up |
| `on-night-soft` | `night`, `night-2` | 7.2:1 |
| `tan` | `night`, `night-2`, `night-deep` | 8:1 and up |
| `white` | `rust`, `rust-deep` | 5.3:1 and up |

## Typography

- **Alfa Slab One** (`font-slab`) is for headings, prices and the wordmark. It has one weight. Set headings in sentence case: "How a job goes", not "How A Job Goes".
- **Archivo** (`font-sans`) is for everything else. On the web, titles and labels use Archivo's width axis at 106–112 for a slightly wider, truck-lettering feel; body text stays at normal width.
- Use the type styles by name: `display-hero` once on the home page, `display-page` for page titles, `heading-section` for h2, `title` for card titles, `lead` for the short answer that opens a page, `body` for reading text.
- All caps appear only in the badge and in `wordmark-sub` (ELECTRIC). No all-caps labels or eyebrows above headings.
- Both faces are free on Google Fonts under the SIL Open Font License, so they can be used in print, on the truck and in Canva.

## Layout and shape

- Left-align everything. Center nothing except single short lines on print pieces.
- Content is at most 1180px wide with a 16px gutter on phones and 40px on desktop. Reading text stays under 68 characters a line.
- Sections are `space-12` apart on phones and `space-20` on desktop.
- A hero or night band ends with the **band**: a `stroke-band` rust line with a `stroke-band-inner` tan line inside it, echoing the badge ring.
- Lists of services, questions and towns sit under a `stroke-rule` line in `ink`, with hairline dividers between rows.
- Corners are `radius-sm` on buttons, `radius-lg` on cards and `radius-full` on chips and medallions. Cards use a `line` border, never a shadow; only floating things (menus, the chooser, the Get in touch button) get a shadow.

## Illustration and icons

- Spot illustrations live in the Icons group: one per service, one per guide topic, and small ones for facts (pin, clock, tower, permit, phone, mail, quote, check).
- They are drawn on a 64px grid with a 2.5px `night` line and flat fills of `tan`, `rust`, `snow`-white and `night-2`. New illustrations follow the same rules: one idea per drawing, no gradients, no people.
- On night grounds, set an illustration inside a **medallion**: a `night-2` disc ringed in `rust` and `tan`, like the badge.
- The two place motifs are the **route** (I-80 drawn as a tan wire climbing from Sacramento to Colfax under a night sky) and the **area map** (a night map with tan roads and every town as a dot). Use them to answer "do you work in my town?", never as decoration.
- No emoji, no stock photos of models in hard hats. Photos should be Chris's real jobs: clean panels, finished installs, the truck, in daylight.

## Voice

- Answer first. Every page, post and email opens with the direct answer in one or two sentences, then the detail. "A typical 200-amp panel upgrade costs $3,000 to $6,500, including the permit."
- Plain and specific: real prices, real permit offices, real utilities (PG&E, SMUD, Roseville Electric). No "top-notch", "your trusted partner" or "we go above and beyond".
- Say "we". Short sentences. No exclamation marks.
- Safety comes first and is stated plainly: "Turn off the breaker for that area and call."
- The calls to action are always these words: **Request a quote**, **Give us a call**, **Send a message**, **Electrical emergency**. A button that says "Request a quote" leads to a page titled "Request a quote".
- Confirmation emails always say: add info@off80electric.com to your contacts, and check spam or promotions if a reply doesn't arrive.

## Accessibility

- Every control shows `focus-ring` on keyboard focus: rust on paper, tan on night.
- Tap targets are at least `size-tap` tall. Text never drops below 14px.
- Illustrations are decorative and hidden from screen readers; the meaning is always in the text beside them.
- Motion is limited to the hero route drawing itself once, and it is skipped when reduced motion is on.

## Using the components

The components are React 18 components on `window.Off80`, styled by `components/bundle.css` with the tokens above, and they follow the theme they sit in. Set a section to `data-theme="night"` for a night band. The Templates group holds the print and social layouts: business card, yard sign, truck door, panel sticker, email signature, social post and invoice header. Detailed specs for every printed and physical item are in the Applications section.
