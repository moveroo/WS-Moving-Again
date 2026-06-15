# Quote Subdomain Brand Adaptation Brief

Status: V1 handoff brief
Date: 2026-06-15
Brand: Moving Again
Quote surface: `https://removalistquotes.movingagain.com.au/quote/household`

## Purpose

This brief translates the Moving Again site brand into a practical Moveroo
implementation brief for quote, booking, contact, and customer portal surfaces.

The subdomain should feel connected to Moving Again while remaining a fast,
accessible, mobile-first form product. Brand expression should support task
completion, not recreate the public homepage.

## Source Of Truth

Use these files before making quote-app design changes:

- `brand/visual-direction.md`
- `brand/tokens.json`
- `brand/moveroo-subdomain.json`
- `src/utils/brand.ts`
- `src/pages/index.astro`
- `src/components/Header.astro`
- `src/components/Footer.astro`

Current site evidence:

- Public domain: `https://movingagain.com.au/`
- The site navigation and brand constants point quote, booking, contact, and
  vehicle journeys at `removalistquotes.movingagain.com.au`.
- This handoff targets `removalistquotes.movingagain.com.au`.
- Site copy emphasises family-owned interstate removals, backloading, vehicle
  transport, and an established "Since 1995" trust position.

## Brand Intent

Moving Again should feel:

- established since 1995
- family-owned and Australian-operated
- direct and practical
- fast to quote
- focused on interstate household removals, with vehicle transport as a clear
  secondary journey

## Approved Visual Tokens

Use these as the first mapping into the Moveroo brand surface contract:

| Role               | Value                                                                    |
| ------------------ | ------------------------------------------------------------------------ |
| Dark shell         | `#191919`                                                                |
| Dark border/footer | `#333333`                                                                |
| Action red         | `#800006`                                                                |
| Action red hover   | `#B23850`                                                                |
| Accent yellow      | `#F1C40D`                                                                |
| Paper              | `#FAFAFA`                                                                |
| Surface            | `#FFFFFF`                                                                |
| Body font          | `Roboto, Arial, sans-serif`                                              |
| Heading font       | `Roboto, Arial, sans-serif`                                              |
| Standard radius    | `0.375rem` to `0.75rem`                                                  |
| CTA shape          | rounded brand button; avoid oversized pill controls inside dense form UI |

Expected app-side concepts to map:

- `--quote-brand-font`
- `--quote-brand-heading-font`
- `--quote-brand-accent`
- `--quote-brand-accent-strong`
- `--quote-brand-page-background`
- `--quote-brand-text`
- `--quote-brand-muted-text`
- `--quote-brand-panel-background`
- `--quote-brand-panel-border`
- `--quote-brand-panel-radius`
- `--quote-brand-cta-background`
- `--quote-brand-cta-text`
- `--quote-brand-progress-fill`
- `--quote-brand-current-step-border`
- `--quote-brand-selected-choice-border`
- `--quote-brand-field-focus-border`
- `--quote-brand-field-focus-ring`

## Quote App Direction

### Header

The header should clearly read as Moving Again:

- use the silver/red arrow mark or a compact `MA` mark when space is tight
- keep the header dark with white text and yellow hover or secondary emphasis
- use red only for the primary conversion action or active state
- keep navigation labels direct:
  - Moving Quote
  - Vehicle Quote
  - Book Your Move
  - Contact
  - Customer Login

### Hero / Intro Area

The quote intro should be compact and form-first.

Use:

- the brand name and quote purpose as the main context
- one short reassurance sentence
- a small route, vehicle, or moving-box motif if it does not delay the first
  input
- real HTML text rather than image-baked text

Recommended copy direction:

- Eyebrow: `MOVING AGAIN QUOTES`
- Heading: `Get a Moving Again quote`
- Support: `Start with a few move details and the team can help plan your interstate move.`
- Helper: `Complete each step below and your progress will be saved as you go.`

### Form Surface

The wizard should feel branded but calm:

- page background: white or near-white
- panels: white with subtle charcoal-tinted borders
- active step: red border/accent with strong contrast
- progress fill: brand red
- selected options: red border with a subtle yellow or warm-tint background
- field focus: red border/ring with accessible contrast
- validation errors: clear red treatment with readable text
- buttons: red primary CTA, yellow or dark secondary action

Do not make every input red. Reserve red for action, progress, focus, selected
states, and validation.

### Visual Motifs

Use Moving Again visual cues sparingly:

- the silver/red arrow mark can identify the shell
- moving box or route motifs can support household/removals context
- vehicle motifs should appear only on the vehicle quote journey or as a
  secondary service cue
- motifs must never sit behind form fields
- mobile layouts should remove decorative details before they reduce form speed

### Dark Mode

If a public dark mode is enabled, theme it deliberately:

- dark shell: `#191919`
- dark panels: charcoal with clear contrast
- text: near white
- red CTA, focus, selected-choice, validation, and progress states must stay
  readable
- yellow accents should stay secondary and accessible

Light mode is the preferred default for form surfaces.

## Navigation And Route Intent

Target routes:

- `/quote/household`
- `/quote/vehicle`
- `/booking/create`
- `/contact`
- `/customer/login`

Route prominence:

- household quote: primary
- vehicle quote: secondary
- booking: secondary
- contact: secondary
- customer login: secondary or footer/header utility

Privileged links:

- provider login: disabled
- admin link: disabled

## Shared Contact Buttons

Use the Moveroo shared subdomain contact details:

- Phone label: `+61 7 2143 2557`
- Phone href: `tel:+61721432557`
- Email label: `removals@moveroo.com.au`
- Email href: `mailto:removals@moveroo.com.au`

## Implementation Notes For Moveroo

Expected hostname: `removalistquotes.movingagain.com.au`

The Moveroo implementation should use approved tokens, exact-token mappings,
and bounded theme/profile settings. It should not accept arbitrary CSS, raw
Tailwind class strings, remote layout instructions, or unreviewed image URLs
from a brand payload.

Use the same generic app layout and navigation as current imported subdomains.
This site repo controls colours, fonts, mark, copy, and visual direction only.

## Failure Modes To Avoid

- copying another Moveroo brand's black/red profile without checking Moving
  Again evidence
- changing only the logo and CTA colour
- leaving a generic app shell when the domain has clear dark/red/yellow cues
- using a large hero that hides the first quote step
- placing image motifs behind form controls
- exposing `/admin` or `/provider` links
- making customer login compete with the primary quote action
- ignoring booking, contact, customer login, or vehicle quote surfaces
- using any hostname other than `removalistquotes.movingagain.com.au`

## Acceptance Checks

Before the quote-subdomain brand pass is accepted, verify:

- `/quote/household` desktop and mobile
- `/quote/vehicle` desktop and mobile
- `/booking/create` desktop and mobile
- `/contact` desktop and mobile
- `/customer/login` desktop and mobile
- header logo and navigation are recognisably Moving Again
- primary CTAs use approved red and readable text
- progress, selected steps, selected choices, form focus, and errors are themed
- the first input is reachable quickly on mobile
- no text clips or overlaps in header, hero, buttons, step tabs, or footer
- unrelated hostnames keep their existing branding
