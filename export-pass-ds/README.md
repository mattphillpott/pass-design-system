# Pass Design System

A brand-aligned design system for **Pass** (pass.tech), the UK's AI-powered learning and teaching platform for maths and English. This system powers both the **learner-facing learning portal** and the **marketing website**.

---

## About Pass

Pass is an AI-powered learning and teaching platform that helps educators and learners improve **maths and English pass rates** for:

- **Functional Skills** (Level 1 & Level 2)
- **GCSE resits**
- Adult returners, apprentices, and vocational learners

**Core audience:** Further Education (FE) colleges, apprenticeship training providers, universities, public-sector bodies, schools, and alternative education providers across the UK. Also students directly.

**Products represented in this system**

1. **Pass Learning Portal** — the authenticated tutor/learner app: diagnostic assessments, courses, AI-marked mock exams, reporting dashboards, learning plans.
2. **Pass Marketing Website** (pass.tech) — public-facing site: value proposition, "Powered by Pass" partners, case studies, blog, contact.

**Key product pillars**

- Free diagnostic assessments (Initial Assessment, Subject Knowledge Assessment) with AI marking
- Self-paced online courses with topic tests and video tutorials
- AI-marked mock exams "to examiner standard"
- Full reporting suite with LMS/e-portfolio integration (Ofsted-compliant exports)
- Registered Ofqual exam centre (four awarding organisations)

---

## Sources consulted

- **Figma (attached):** `WP _ Flowbite.fig` — the full Flowbite Pro v3.0 UI kit (219 pages, ~800 frames). Used as the source-of-truth for tokens, spacing, shadows, components, and icon set. This is a generic Flowbite file; **Pass has not yet committed any bespoke brand artefacts to Figma**, so this system **derives** a Pass brand layer on top of Flowbite's foundations.
- **pass.tech** — public website, used for tone/copy, target audience and product descriptions. See the CONTENT FUNDAMENTALS section.
- **No codebase was attached.** See CAVEATS at the bottom.

---

## Index — what's in this folder

```
README.md                  ← you are here
SKILL.md                   ← agent-skill entrypoint
styles.css                 ← canonical global entry — @imports colors_and_type.css (link THIS one)
colors_and_type.css        ← CSS custom properties (tokens) for colour + type + .pass-* utilities
components/                ← exported React primitives (Button, Badge, Card) + @dsCard preview
fonts/                     ← webfonts (Inter via Google Fonts @import; JetBrains Mono pending upload)
assets/
  logos/                   ← Pass logo marks (placeholder — see CAVEATS)
  icons/                   ← Flowbite icon subset copied from Figma
  illustrations/           ← Flowbite illustrations copied from Figma (education-themed subset)
  patterns/                ← backgrounds + decorative SVGs
preview/                   ← small HTML cards populating the Design System tab
ui_kits/
  learning-portal/         ← authenticated app UI kit (dashboard, course, mock exam, reporting)
    index.html             ← click-through demo
    *.jsx                  ← component files
  marketing-website/       ← public site UI kit (hero, features, pricing, footer)
    index.html
    *.jsx
```

### Using the system

Consumers link **one** stylesheet — the canonical entry:

```html
<link rel="stylesheet" href="styles.css">
```

Tokens, the Inter `@import`, and the `.pass-*` utility classes all come through it. Exported React primitives live in `components/` (`Button`, `Badge`, `Card`, wrapping the matching `.pass-btn` / `.pass-badge` / `.pass-card` classes) and are exposed on `window.PassDesignSystem_*` once the compiled `_ds_bundle.js` is loaded — see `components/index.html` for a worked example.

---

## CONTENT FUNDAMENTALS

Voice derived from pass.tech public copy.

### Voice in one line
**Supportive, professional, plainly-written UK English.** Pass speaks like a competent FE practitioner talking to another educator — confident but never slick. It leads with **outcomes** (pass rates, progress, workload reduction) and avoids hype.

### Specifics

- **UK English throughout.** "maths" (never "math"), "personalised", "organisation", "programme", "centre". Don't Americanise.
- **Person.** Third-person brand voice on marketing ("Pass offers…", "The platform helps…"). Second-person for direct learner/educator outreach ("Achieve your goals…", "Whether you're preparing for…"). Never first-person singular ("I", "my").
- **Capitalisation.** Product/feature names capitalised as proper nouns: *Functional Skills*, *GCSE*, *Initial Assessment*, *Subject Knowledge Assessment*, *Powered by Pass*. Sentence case for everything else including page titles and button labels ("Book a demo", not "Book A Demo").
- **Tone.** Supportive of learners who struggle; respectful of educators' time. No condescension. No emoji in marketing or product surfaces. No exclamation marks except in celebration moments (mock-exam completion, diagnostic result).
- **Sentence length.** Mixed — punchy CTAs, medium body paragraphs. Headings stay short (4–10 words).
- **Jargon policy.** UK education jargon is *welcome* (Ofsted, Ofqual, FE, GCSE, KS3, awarding body, e-portfolio, LMS, apprentice, resit). Silicon-valley jargon is *not* ("seamless", "revolutionary", "game-changing", "unlock", "10x").
- **Numbers.** Lead with concrete ones. "90% of Educationwise learners are now ahead of target" beats "dramatically better outcomes".

### Canonical copy examples (from pass.tech)

- Hero headline style: *"AI-powered learning & teaching platform for educators looking to improve maths and English outcomes."*
- Feature bullet style: *"Save time & improve feedback with automatically marked mock exams to examiner standard."*
- Partner/CTA style: *"Contact us today to understand how being Powered by Pass can transform your provision."*
- Learner-facing: *"No more continuous cycles of GCSE resits, empower your learners with Pass."*
- Ampersand `&` is used freely in headings/bullets in place of "and" — this is a Pass idiom.

### CTA vocabulary
Primary: **Book a demo**, **Access free diagnostics**, **Register**, **Get started**.
Secondary: **View case study**, **Learn more**, **Download report**.

### Don'ts
- ❌ Emoji in UI
- ❌ "Hey!" / "Woohoo!" / exclamations in marketing copy
- ❌ American spellings
- ❌ Vague superlatives ("best", "world-class", "cutting-edge") without a number behind them
- ❌ "Revolutionise" and "seamless" — overused on ed-tech sites; Pass sounds more grounded

---

## VISUAL FOUNDATIONS

### Colour

Pass's visual DNA is **calm, trustworthy, institutional-but-modern**. The primary is **Pass Green** (`#0FBC0F`) — confident and energetic without being neon — over neutral **cool-grays** (Tailwind `gray-*`), with a distinct emerald success plus red/amber for the remaining semantic states. (Earlier drafts used a blue primary; the system has since migrated to green, and the legacy `--pass-blue-*` tokens are now aliases that resolve to the green ramp.)

- **Primary / brand:** `#0FBC0F` (Pass Green, `--pass-green-600`). Used for CTAs, links, active states, illustration accents, logomark. Hover `#0F8610`, press `#116A12`.
- **Primary tints:** `#F0FEEF` (subtle background / `primary-bg`), `#DBFEDA` (panel), `#B8FBB7` (inner stroke), `#81F580` (decorative).
- **Neutral scale (text + chrome):** `#101828 → #344054 → #4A5565 → #6A7282 → #98A2B3 → #D1D5DB → #E5E7EB → #F3F4F6 → #F9FAFB → #FFFFFF`.
- **Semantic:**
  - Success (pass, correct answer): `#0E9F6E` / bg `#ECFDF5`
  - Warning: `#D97706` / bg `#FFF7ED`
  - Error (fail, incorrect): `#C70036` / bg `#FDF2F2`
  - Info: `#1C64F2` / bg `#EEF6FF`
- **Accent (learner-facing):** we reserve a warm **amber-300** (`#FDBA8C`) for celebratory/achievement moments (mock complete, diagnostic result reveal), used sparingly.

Pass imagery skews **cool and bright**. Photography (when used) leans toward classroom/desk scenes in natural light, not overly saturated, no heavy grain.

### Typography

**Primary typeface: Inter** — used for 95% of UI. Available via Google Fonts (`@import` in `colors_and_type.css`).

**Monospace: JetBrains Mono** (`--font-mono`) — for code samples and the `.pass-code` style. The webfont file is **not yet uploaded**; the token deliberately keeps pointing at `'JetBrains Mono'` and renders via its `ui-monospace` fallback stack until the font is added (do not substitute another family).

Weights in use:
- 400 Regular — body, inputs
- 500 Medium — labels, button text, small headings
- 600 SemiBold — H2/H3, section titles
- 700 Bold — emphatic body, occasional H1
- 800 ExtraBold — hero H1 only

Size scale (matches Flowbite/Tailwind): `text-xs 12` · `text-sm 14` · `text-base 16` · `text-lg 18` · `text-xl 20` · `text-2xl 24` · `text-3xl 30` · `text-4xl 36` · `text-5xl 48` · `text-6xl 60`.

Tracking: `tracking-tight -0.025em` for H1/H2; normal everywhere else. Body line-height `1.5` (`leading-relaxed`).

### Spacing & layout

- 4-px base grid. Token scale `0, 1(4), 2(8), 3(12), 4(16), 6(24), 8(32), 12(48), 16(64), 24(96)`.
- **Layout containers:** marketing 1280px max / portal 1440px max. Gutter 24 at desktop, 16 at mobile.
- **Cards**: `border-radius: 12px` (= `rounded-lg`, the "default" corner), `border: 1px solid #E5E7EB`, `background: #FFFFFF`, `padding: 24px`. No shadow on static cards; add `shadow-sm` only on elevated (hover) or floating (dropdown, modal).
- **Buttons & form fields**: `rounded-lg` (12px) matching cards. Inputs are 42px tall; buttons are 40/48/56 for sm/base/lg.
- **Section padding** (marketing): `py-16` (64px) on mobile, `py-24` (96px) on desktop.

### Elevation / shadows

From Flowbite, six-step scale:
- `shadow-sm` — `0 1px 2px 0 rgba(0,0,0,0.05)` (cards on hover)
- `shadow` — `0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)` (dropdowns)
- `shadow-md` — `0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)`
- `shadow-lg` — `0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)` (modals)
- `shadow-xl` — `0 20px 25px -5px rgba(0,0,0,0.1)` (featured hero cards)
- `shadow-inner` — `inset 0 2px 4px 0 rgba(0,0,0,0.05)` (inputs on focus-in-tree)

Pass prefers **borders over shadows** for structure. Shadows appear on overlays (dropdowns, modals, popovers, hover-lifted cards) only.

### Borders & radii

- Default radius: **12px** (`rounded-lg`) — cards, inputs, buttons, images-in-UI.
- Small radius: 6px — badges, small chips.
- Pill: `rounded-full` — avatars, status pills, progress-bar ends.
- Border widths: `1px` default (`#E5E7EB`), `2px` for focus rings (primary), occasionally `2px dashed` for drop-zones.
- Focus ring: `0 0 0 3px rgba(15,188,15,0.25)` + `border-color: #0FBC0F`.

### Backgrounds

- **Surface 0** (page background): `#F9FAFB` for app views, `#FFFFFF` for marketing.
- **Surface 1** (cards): `#FFFFFF`.
- **Surface 2** (raised on white, e.g. sidebar active row): `#F3F4F6`.
- Marketing heroes sometimes use a soft **green-tinted gradient** `linear-gradient(180deg, #F0FEEF 0%, #FFFFFF 100%)` — subtle, never harsh.
- Hand-drawn illustrations (Flowbite) are used on empty states, auth screens, and the marketing landing hero. They sit on white/off-white and never bleed over imagery.
- No repeating textures. No grain. No glassmorphism.

### Motion & interaction

- **Easing:** `cubic-bezier(0.4, 0, 0.2, 1)` (Tailwind `ease-in-out`) for 90% of transitions. `cubic-bezier(0, 0, 0.2, 1)` (`ease-out`) for enter animations.
- **Durations:** 150ms (hovers, color/opacity), 200ms (small moves), 300ms (panels/drawers), 400ms (modal enter). Nothing longer than 400ms in-product.
- **Bounces:** none by default. Celebratory moments (e.g. submitting a correct answer, completing a mock) may use a single short spring on an icon, not on layout.
- **Fades:** simple opacity fades on mount/unmount for tooltips and popovers.
- **Page transitions:** none — pages swap instantly; spinners/skeletons cover async.

### States

- **Hover (buttons):** primary darkens to `#0F8610` (`--pass-green-700`). Secondary/ghost buttons add `background: #F3F4F6`. Icons get `color: #0FBC0F`.
- **Active/Press:** scale stays at 1.0 — Pass **does not** shrink buttons on press. Instead, deepen the colour one more step (`#116A12`) and add `shadow-inner`.
- **Focus:** always a visible ring (`0 0 0 3px rgba(15,188,15,0.25)` + 2px primary border). Never remove focus outlines.
- **Disabled:** `opacity: 0.5`, `cursor: not-allowed`, no hover response.
- **Loading:** inline spinner (small), or full-card skeleton.

### Iconography at a glance

See ICONOGRAPHY below.

### Layout rules

- **Sticky top nav** on marketing (64px tall, white, 1px bottom border).
- **Fixed sidebar** (256px) on portal; collapses to icon-only at 1024px and below; drawer at mobile.
- **Progress indicators** are prominent throughout the learning portal — every course card, every mock result, every learner row in the dashboard has a progress bar or % ring.
- Generous use of `max-width: 65ch` for long-form text (blog, diagnostic result narrative).

### Transparency / blur

Only in **overlay scrims**: modals and drawers use `rgba(17,24,39,0.5)` with `backdrop-filter: blur(4px)`. Nowhere else. No frosted cards.

### Cards — the canonical recipe

```
background: #FFFFFF;
border: 1px solid #E5E7EB;
border-radius: 12px;
padding: 24px;
/* shadow only on hover / floating */
```

### Imagery vibe

- Product screenshots sit inside a **device mockup** or **browser chrome** (see `/Device-mockups` in Figma).
- Illustrations (education-themed subset from Flowbite): friendly, hand-drawn, bright-blue accented — used on empty states and marketing blocks.
- Photography (rare): natural-light classroom/desk scenes. Never stock-smiley groups-around-a-laptop.

---

## ICONOGRAPHY

Pass inherits the **Flowbite icon system** from Figma — approximately **2,000+ icons** across outline and solid variants, organised into 22 families (Arrows, Education, E-commerce, Files & Folders, Users, Media, Weather, Text, General, Brands, Emoji, …).

### Specifics

- **Format:** SVG, 24×24 viewBox, 2px stroke on outline variants, flat fills on solid variants.
- **Pairing:** outline icons for navigation and neutral UI; solid icons for active/selected states, badges, and status indicators (success check, error cross, warning triangle).
- **Colouring:** inherit `currentColor` from parent. Default `#4A5565`; on primary surfaces `#0FBC0F`; muted `#6A7282`.
- **Stroke weight:** consistent 2px. Never mix 1.5px and 2px icons in the same view.
- **Pass uses Flowbite's Education family extensively** (school-book, graduation-cap, pencil-ruler, calculator, abacus, clipboard-list) — these are the spine of the learning portal's navigation and course metadata.
- **Brand/social icons** come from Flowbite's Brands family (LinkedIn, YouTube, X/Twitter, Facebook, Instagram) for the marketing footer.
- **Flag icons** from `/Flags` are used for language/region switchers — Pass ships UK-only so they appear mostly on future-proofing / accessibility menus.

### Emoji & unicode

- **Emoji are NOT used** anywhere in Pass UI (marketing or product). See CONTENT FUNDAMENTALS.
- **Unicode arrows** (→, ←) are fine in body copy links. Icon glyphs are not substituted with unicode.

### CDN fallback

We substitute any missing icon with **[Lucide](https://lucide.dev/)** (`lucide@latest` from unpkg) — Lucide's 2px-stroke outline style matches Flowbite closely. This is declared in `colors_and_type.css` and loaded per-page in the UI kits. Flag this substitution wherever it applies.

### Copied-out assets

See `assets/icons/` for a curated subset (~40 education- and UI-critical icons) copied directly from the Figma. All originals are in the Figma under `/Icons/<family>/`.

---

## CAVEATS & open questions

1. **No bespoke Pass branding in Figma.** The attached file is a stock Flowbite kit. We derived the Pass layer from **pass.tech copy + product structure**, not from a dedicated brand system. **If you have a brand guidelines PDF, a Pass logo SVG, or a brand colour spec, please attach it and I'll swap it in.**
2. **Logo is a placeholder.** `assets/logos/` contains a typographic wordmark I've built as a stand-in. Replace with the real Pass logo.
3. **No codebase was attached.** UI kits are recreated from the Flowbite patterns + pass.tech visuals alone. Component behaviour is mocked, not production-accurate. **Attach the Pass repo** via Import for pixel-accurate UI kits.
4. **Photography is absent.** I've used placeholder blocks where photography would sit. Supply a small set and I'll wire them into the hero, case-study, and "Powered by Pass" sections.
5. **Dark mode not yet defined** — Flowbite supports it; I can add a dark token layer if you want the portal to ship dark-first.

**Next step:** tell me which of the above to tackle first, or ask for a specific screen / slide and I'll iterate.
