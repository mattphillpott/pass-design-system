# Handoff: PFS product page — C8-A buy box

## Overview

The Functional Skills Maths Level 2 product page currently asks a buyer to make four
sequential decisions before it will name a price, and the price it advertises above the
fold (`from £157.60`) is not reachable through the path it then presents. **C8-A** is a
redesign of that page which keeps all four decisions and all four existing controls, and
fixes the presentation around them — deliberately scoped so it can ship as an A/B test
rather than a platform change.

Live page: https://passfunctionalskills.co.uk/shop/exams/functional-skills-maths-level-2-online-exam/

**What C8-A changes**

1. Three-column layout — reduced gallery / details + steps / sticky buy rail.
2. The resolved price is visible in the rail at every step, so the basket contains no new
   information. (This is also a DMCC drip-pricing exposure, not only a conversion issue.)
3. Each option states its *consequence*, not just its name — "invigilation" is meaningless
   to a first-time buyer, but "results in 2–6 working days, sit it any time" is not.
4. Step 4 (bundle) is disabled until the course is added, instead of throwing a validation
   error above the CTA after a click.
5. The exam-date calendar sits behind a two-option toggle — *Choose date later* /
   *Choose date now* — instead of presenting 36 clickable prices before a decision is framed.
6. Five competing urgency devices reduced to one line.
7. Imagery demoted; on mobile the gallery becomes a 36px utility row.

---

## ⚠️ Read this before writing any code

### 1. Decide which artefact you are building

This determines the entire implementation and the two answers are mutually exclusive.

| | **A — A/B variation (no deploy)** | **B — theme change (deploy)** |
|---|---|---|
| Ships via | Test tool's CSS/JS injection boxes | Template override + SCSS partial |
| Starting point | `variation.css` + `variation.js` in this bundle — refine them | Same *design*, different build; treat the CSS as a spec, not source |
| Selectors | Must fight theme specificity from outside | Not needed — change the markup |
| Injected DOM | Needs the MutationObserver (see §2) | Not needed — render it server-side |
| Reversible | Instantly, by removing one class | Needs a feature flag |

**If nobody has told you which, ask.** Building B when the team wanted A destroys the
ability to run it as a variation; building A when B was available leaves you maintaining
`!important` overrides forever. The files in this bundle assume **A**.

### 2. The trap that will silently break this

WooCommerce Composite Products re-renders each component's options from an Underscore
template (`tmpl-wc_cp_options_radio_buttons`) **every time a selection changes or a
scenario re-evaluates**. Anything injected into `.component_selections` is destroyed on
the next click.

A single `DOMContentLoaded` pass therefore produces a variation that looks correct until
the user interacts, then quietly loses its badges and sub-labels. That does not fail the
test — it *corrupts* it, because half the exposed sessions see a different design.

`variation.js` handles this with idempotent injections re-driven by a debounced
MutationObserver, plus a re-entry guard so its own writes don't loop. **Do not replace that
with a one-shot init.** If you go with option B, this stops mattering — server-rendered
markup survives re-renders.

### 3. Do not "fix" these — they are deliberate

- **Bright `#0FBC0F` never carries text.** White on brand green is 2.4:1, and even at
  14.5px/700 it only reaches 4.62:1. Selected options are `#116A12` on `#F0FEEF` instead.
  Filling the selected state with solid green will fail AA.
- **Success green splits by role.** `#0E9F6E` for icons and borders (3:1 non-text
  threshold); `#047857` for any text on a light surface. Using `#0E9F6E` for text drops it
  to 3.39:1.
- **One urgency line, not five.** The live page fires a red sticker bar, a yellow duplicate,
  a countdown, "1 day left", and per-date price decay simultaneously. All five are factually
  true, which is exactly why the waste is avoidable — scarcity works by contrast.
- **The 93% claim appears once**, with its sample size (5,399 sittings), next to the decision
  it should influence. It currently appears five times.
- **Results are "2–6 working days"**, not "as little as 2". Fast Track is a separately
  purchased upsell (`result-speed.php`); the current hero implies it is included. This is a
  refund-and-complaint driver, and correcting it is not optional.

---

## About the design files

`C8-A Reference.html` in this bundle is a **design reference built in HTML/React** — a
prototype showing intended layout and behaviour. It is **not production code to copy**.
The target is a live WordPress/WooCommerce page; your job is to reproduce the design in
that environment using its existing template and SCSS patterns.

**Fidelity: high.** Colours, type, spacing and interaction states are final. Reproduce them
precisely. Every value in §Design tokens is exact.

Open the reference and interact with it — change invigilation, toggle the date mode, switch
between Exam Only and Exam & Course. The dependent state (awarding body, turnaround, resit
row, locked step 4, rail total) is all wired, and watching it is faster than reading a spec.

---

## Platform facts (verified against `MathsMadeEasy/mme-wp@main`)

The buy box is a **WooCommerce Composite Product** — not a variable product, and not
variation attributes. This surprised us too; several early assumptions were wrong.

```
mme-core/src/Classes/Templates/woocommerce/single-product/
  add-to-cart/composite.php        → #composite-product-form.composite_form.cart_group
                                      .card.shadow.border  (navigation_style 'single')
  component-single-page.php        → #component_<id>.row[.open|.toggled|.closed]
                                      .component_title_wrapper
                                      #component_<id>_inner.component_inner
                                      .component_description_wrapper
                                      .component_selections
  js/options-radio-buttons.php     → fieldset.component_option_radio_buttons_fieldset
                                      ul.component_option_radio_buttons_container
                                      li.component_option_radio_button_container
                                      div.component_option_radio_button[data-val]
                                      .radio_button_input
                                      input.radio_button
                                        (name="wccp_component_radio[<group>]")
                                      label.component_option_radio_button_select
                                        [.first-of-type.rounded-left]
                                        [.last-of-type.rounded-right]
                                      label > span  ← holds the option title (HTML)
```

Three consequences worth knowing:

- **Each step is a composite *component*.** Each resolves to a separate product carrying
  `_aem_product_type` (`exam`, `invigilation-type`, `exam-date`, `book-later-date`, `course`,
  `fasttrack`) — which is why one purchase produces several basket line items.
- **The options are already a segmented radio row.** mme-core overrides the option template
  and emits `first-of-type rounded-left` / `last-of-type rounded-right` with flex-fill
  labels. C8-A's step rows are that template with different SCSS — the structure is already
  right.
- **Calendar-on-load is already a feature.** `component-single-page.php` reads the ACF field
  `calendar_options_show_calendar_on_page_load` and adds an `open` class, on top of an
  existing `toggled`/`closed` system. "Choose date now" should drive that existing
  mechanism, not a new one.

Also already available, so don't rebuild it:

- **Live running total** — composite products maintain their own price as components are
  selected. The rail *displays* a value the page already computes.
- **"8 places remaining"** — `product-sale-spaces.php`, coupon-driven with ACF fields for the
  template string and colours. Rewording is an admin change, not a deploy.
- **Business-day result dates** — `BusinessLogic.php` already computes them for the account
  area. Surfacing one on the product page needs it exposed to the template or localised to
  JS; it is not new logic.
- **Invigilation is constrained per awarding body** — `ExamValidator.php`,
  `allowed_invigilation_types`. It is not a free choice, which is why C8-A presents it as a
  turnaround/support consequence rather than a technical toggle.

---

## Layout

### Desktop (≥1200px, container 1470px)

```
┌────────────────────────────────────────────────────────────────────────────┐
│ 64px  │ 300px          │ 1fr (details + steps)      │ 372px (buy rail)     │
│ thumb │ main image      │ title, rating, price,      │ sticky, top: 24px    │
│ rail  │ (300×300)       │ steps 1–4, About this exam │                      │
└────────────────────────────────────────────────────────────────────────────┘
        gap 28px / 44px            ↓ full-width row below
        Reviews (1fr) │ Questions (440px)   — gap 44px
```

Two nested grids, because the buy rail lives **inside** `#composite-product-form`:

```css
div.product            { grid-template-columns: 300px minmax(0,1fr); gap: 28px 44px; }
#composite-product-form{ grid-template-columns: minmax(0,1fr) 372px; gap: 0 28px; }
.composite_wrap        { grid-column: 2; grid-row: 1 / span 99; position: sticky; }
```

**This is why no DOM re-parenting is needed** — and it is the single detail that keeps the
variation cheap. The form wraps every component *and* the price/button block (via
`woocommerce_composite_after_components`), so the rail is just a grid child. Resist any urge
to move nodes out of the form; it breaks the composite's own submit handling.

### Mobile (<1200px)

Everything collapses to one column and the steps stay **inline, in document order**. C8-A
deliberately does *not* use the full-screen-sheet pattern from concepts C1–C4: moving a
composite form into a modal is a large JS job and would put this outside "cheap test".

- Gallery → a 36px utility row: one 36px thumbnail (`+5` overlay) + a "Watch the 90-second
  setup" button. A hero photo of someone at a laptop answers nothing; the video answers the
  top objection ("can I really sit this at home?").
- Options stack vertically, left-aligned, price right-aligned — `+£284.00 · Exam + 12 months
  + free resit` does not fit a half-width button.
- Calendar becomes a compact month: day number + price only, 52px cells. The result date
  moves to a summary line beneath, because "result 19 Sep" cannot fit a 51px cell.
- **Sticky bottom bar, 108px**: price + instalment left, result date right, full-width CTA
  under. `body { padding-bottom: 108px }`.
- The sticky CTA **proxies** the real add-to-cart button (`real.click()`) rather than
  duplicating a submit control — one source of truth for validation, no second POST path.

---

## Components

### Step row (the core control)

Applies to all four steps. Restyle of the existing radio markup.

| | Unselected | Selected |
|---|---|---|
| Border | `1px solid #E5E7EB` | `2px solid #0FBC0F` |
| Padding | `12px 14px` | `11px 13px` |
| Background | `#fff` | `#F0FEEF` |
| Title colour | `#344054` | `#116A12` |
| Title weight | 500 | 700 |
| Sub colour | `#6A7282` | `#116A12` at 85% opacity |
| Radius | `10px` (overrides `rounded-left`/`rounded-right`) | same |

- Hover (unselected): border `#C6CBD2`.
- Disabled: `opacity: .45`, `cursor: not-allowed`.
- Transition: `border-color .15s, background-color .15s`. **Padding compensates for the
  border weight**, so the box never changes size on selection and the page cannot jump under
  the cursor.
- Grid: `repeat(auto-fit, minmax(0,1fr))`, `gap: 8px`.
- Step heading: 13.5px/700 `#101828`, step index `#6A7282`/600 with `margin-right: 6px`.
- Step description: 12.5px/1.45 `#6A7282`, `margin-bottom: 9px`.

**Accessibility, non-negotiable:** the real `input.radio_button` stays in the accessibility
tree, visually hidden via clip-path — never `display: none`, which removes it from the tab
order and breaks keyboard selection. `:focus-visible` on the input draws
`outline: 2px solid #0FBC0F; outline-offset: 2px` on the label. Selection is signalled by
border weight *and* fill *and* text colour, never colour alone.

### "Most popular" badge

One reusable pill, used exactly twice: **Exam & Course** (step 3) and **Premium Bundle**
(step 4).

- `position: absolute; top: -9px; left: 50%; transform: translateX(-50%)`
- Background `#0FBC0F`, text `#fff`, 10px/700, `letter-spacing: .05em`, uppercase
- `padding: 2px 9px`, `border-radius: 999px`, `white-space: nowrap`, `z-index: 2`
- Parent `li` gets `padding-top: 9px` so the badge has room; `.component_option_radio_button`
  becomes the positioning context
- `aria-hidden="true"` — decorative, and the label already carries the meaning. Without this
  a screen reader announces "Most popular Exam & Course" as one string.

### Buy rail (372px, sticky)

Order, top to bottom:

1. **Price** — 28px/700, `letter-spacing: -.025em`, `#101828`. Struck RRP 14px `#98A2B3`.
2. **Instalment line** — 12.5px `#6A7282`: `or £36.80/month with Klarna, Clearpay or Payl8r`.
3. **Sitting summary** — `#F9FAFB`, radius 8px, padding `11px 13px`.
   `Sitting <b>chosen later</b>` at 13px, then the result line at 14px/700 `#047857`.
4. **In stock** — 14.5px/700 `#047857`.
5. **Urgency** — 12.5px/600 `#D97706`: `Only 8 places left at this price`. The only place
   amber appears.
6. **Primary CTA** — full width, 46px, `border-radius: 999px`, `#0FBC0F`, white 15.5px/700.
   Hover `#0F8610`. Disabled `#98A2B3` + `cursor: not-allowed`.
7. **Secondary CTA** — same geometry, white fill, `1px solid #E5E7EB`, `#101828` 15px/600.
8. **Spec list** — `dl`, rows `display: flex; justify-content: space-between`, 12.5px,
   `1px solid #E5E7EB` between rows. Labels `#6A7282`, values `#344054` right-aligned;
   `.is-good` values `#047857`/600.
   Rows: Exam centre · Awarded by · Invigilation · Resit · Exam pack.
9. **Secure transaction** — 12px `#6A7282` with a lock icon, above a single payment-marks
   row (20px tall logos). **One** payment row, at the CTA, where payment anxiety actually
   occurs — the live page prints them three times.

### Reactive state

All of this must update on selection, and is wired in the reference:

| Trigger | Effect |
|---|---|
| Invigilation = Remote | Awarding body → TQUK; turnaround → 2–6 working days |
| Invigilation = Human | Awarding body → Open Awards; turnaround → 6–16 working days |
| Course = Exam Only | Step 4 locked (`opacity .5`, `pointer-events: none`), description → "Available once you add the course."; Resit row → `£157.60` |
| Course = Exam & Course | Step 4 unlocked, description → "Premium adds 12 months instead of 3, and a free resit if you don't pass." |
| Bundle = Premium | Resit row → "Free if you don't pass", styled `.is-good` |
| Date = Choose date now | Calendar revealed; CTA disabled with label "Choose a sitting first" until a date is picked |
| Date = Choose date later | Calendar hidden; sitting summary → "chosen later" |

The disabled-CTA-with-a-reason pattern replaces the current page's post-click validation
error. Blocking with an explanation beats erroring after a click.

---

## Copy

Exact strings. The option sub-labels are the largest comprehension win in the whole design.

**Step 1 · Choose invigilation style**
- `Online Remote Invigilation` — *Results in 2–6 working days · sit it any time · TQUK*
- `Online Human Invigilation` — *Results in 6–16 working days · guided setup · Open Awards*
- Info panel: *Sit it any time, day or night. Your session is recorded and reviewed
  afterwards.* / *A person walks you through setup and stays on the call. Fixed appointment
  times.*

**Step 2 · Choose date**
- `Choose date later` — *Book now, decide within 12 months*
- `Choose date now` — *Pick from the calendar*
- Under the calendar: *Dated slots are priced by demand — later dates cost less. Free date
  change up to 7 days before.* ⚠️ **Verify the 7-day policy before shipping** — see Open
  questions.
- Empty state: *Choose a sitting to see your price and result date.*

**Step 3 · Choose course option**
- Help: *93% of learners who complete the course pass, measured across 5,399 sittings. Exam
  only is for people already prepared.*
- `Exam Only` — *For learners already prepared*
- `Exam & Course` — *93% of learners who complete the course pass* — **Most popular**

**Step 4 · Choose course bundle option**
- `Basic Bundle` — *+£184 · exam + 3 months of course access*
- `Premium Bundle` — *+£284 · exam + 12 months + free resit* — **Most popular**

**Rail**: `In stock` · `Only 8 places left at this price` · `Add to basket` ·
`Book with a £29 deposit` · `Secure transaction` · `Choose a sitting first` (disabled state)

**Mobile**: `Watch the 90-second setup` · `Complete your choices` (disabled sticky CTA)

---

## Design tokens

```
Neutrals      #101828 fg1 (16.1:1)   #344054 fg2   #4A5565 fg3
              #6A7282 fg4 (4.9:1)    #98A2B3 fg5
Lines/surface #E5E7EB line           #F9FAFB sunk   #F3F4F6 bg
Brand         #0FBC0F primary  — borders, fills, badges. NEVER text.
              #0F8610 primary-600 — CTA hover
              #116A12 primary-700 — selected label text on tint
              #F0FEEF tint        #B8FBB7 tint border
Success       #0E9F6E — icons/borders only (3:1 threshold)
              #047857 — text on light surfaces (5.48:1 white, 5.21:1 tint)
              #ECFDF5 bg          #A7F3D0 border
Urgency       #D97706 on white (4.6:1). Never white-on-amber. ONE use only.
Info          #1A56DB text        #EEF6FF bg      #C3DDFD border
Danger        #C70036 (discount %, validation)

Type          Inter / system-ui
  H1 26px/600/-0.015em/1.25       Step heading 13.5px/700
  Price 34px/700/-0.025em         Rail price 28px/700/-0.025em
  Option title 14.5px (500 → 700 selected)
  Option sub 12px/1.4             Body 13.5px/1.5        Meta 12.5px
  Badge 10px/700/uppercase/0.05em
  Mobile: H1 20px/600, price 30px, sticky price 19px/800

Radius        999px pills/CTAs · 12px cards · 10px options · 8px small tiles
Shadow        0 1px 3px rgba(0,0,0,.06) rail
              0 -4px 12px rgba(0,0,0,.06) mobile sticky bar
Focus         0 0 0 3px rgba(15,188,15,.25) / outline 2px #0FBC0F offset 2px
Grid gaps     28px columns · 44px desktop section · 8px option grid
Transitions   150ms border-color/background-color. Honour prefers-reduced-motion.
Tap targets   Step rows 74px · date rows 62px · CTA 46px · sticky CTA 44px (≥44px min)
```

---

## Assets

Nothing new to produce. All of it already exists on the live page or in the theme:

- Gallery: 7 images at `/app/uploads/…` (`PFS-hero-exam-product`, `93-pass-rates`,
  `PFS-maths-exam-pack-product-image`, `PFS-results-product-image`,
  `PFS-Free-resit-product-image`, `PFS-reviews-product-image`,
  `PFS-fsml2-course-product-image`) — all `.webp`, 500×281 and 150×150 variants.
- Payment marks: `complete-tuition-theme/dist/assets/img/cards/` — `visa`, `mastercard`,
  `maestro`, `american-express`, `clearpay-light`, `klarna`, `payl8r-white` (`.webp`), plus
  `img/logos/paypal.webp`.
- Awarding-body marks: `complete-tuition-theme/src/img/exam-boards/`.
- The reference file uses hatched grey placeholders where photography goes — substitute the
  real images above.

Real review data for the histogram (from the live page): 258 reviews, 4.7 average —
5★ 209 · 4★ 32 · 3★ 7 · 2★ 5 · 1★ 5. 94% recommend. Highly rated for: *Fast Track Results*,
*High Pass Rates*, *Accepted by Uni's and Employers*.

---

## Open questions — resolve before shipping

1. **"Choose date later" needs a real purchasable target.** The live page renders the
   calendar directly under *Choose Date* with no option toggle, so C8-A's two-button control
   is injected. The repo has a `book-later-date` product type — if it exists as an option
   inside that component, set `BOOK_LATER_MATCH` in `variation.js` to the start of its label
   and the toggle will select it properly. **If it does not, the toggle only hides the
   calendar, and someone must confirm that submitting without a date is a valid path.** This
   is the highest-risk unknown in the bundle.
2. **Result date in the rail.** Currently states a range ("Result 2–6 working days after you
   sit it") because `BusinessLogic.php` computes real dates server-side but they are not
   exposed to the front end. A named date ("Result by 9 Sep") is materially more persuasive —
   worth the plumbing — but do not invent one client-side.
3. **Five selectors marked `(VERIFY)`** in `variation.css`: `div.product`,
   `.summary.entry-summary`, `.composite_wrap`, `.single_add_to_cart_button`, and the gallery
   thumb classes. These are WooCommerce/theme defaults that could not be confirmed from
   template source. **Check all five against the rendered DOM first** — `.composite_wrap` in
   particular, since the entire rail hangs off it.
4. **The `HIDE` array in `variation.js` is deliberately empty.** It needs real selectors for
   the *Course Option Comparison* section (a duplicate of steps 3 and 4), the standalone 93%
   band (4th repeat), and the second payment-badge row. Left empty rather than guessing and
   hiding the wrong node.
5. **Three unverified claims** are placeholders in the copy: the Fast Track price (£39 is a
   guess), the "140+ UK universities" acceptance figure, and the free-date-change window
   (assumed 7 days). Get real numbers or cut the claims.
6. **Which codebase is the target?** This bundle assumes the live WordPress theme. The
   project's own notes name Vue 3 + Nuxt + Tailwind as a future build target — if C8-A is
   meant for that instead, say so, because the composite-re-render problem disappears and the
   whole implementation shape changes.

---

## Test design (context for why the scope is what it is)

C8-A should be tested **against the live page, not against the other concepts.** It holds
the option set constant and changes only presentation, which isolates one variable — so a
win is attributable to layout and clarity rather than to reduced choice.

Be aware of the honest trade: keeping all four decisions means the Hick's Law gain that
concept C1 was built for does not arrive. Expect a smaller lift than C1's, from price
transparency and comprehension. That is the price of a test that ships without platform work,
and it makes C1 the natural follow-up rather than a competing bet.

Primary metric is **add-to-basket rate** (~8,600 sessions/arm at a +15% MDE from an assumed
8% baseline). Order conversion is not viable as a primary metric — it needs ~29,000
sessions/arm.

Instrument at minimum: `package_selected` (with `was_default`), `date_option_selected`
(mode + slot), `buybox_first_interaction`, `add_to_basket` (with resolved total), and
`price_delta_shown` (advertised vs resolved) as a compliance audit trail.

---

## Files in this bundle

| File | What it is |
|---|---|
| `C8-A Reference.html` | **The visual target.** Interactive — desktop + mobile side by side. Open it first. |
| `variation.css` | Override stylesheet, scoped to `html.pfs-v2`. Selector provenance in the header comment. |
| `variation.js` | DOM injections + MutationObserver. Read §2 above before touching it. |
| `pfs-*.jsx`, `pfs-data.js` | Source of the reference file. Read for exact values; do not port. |

The reference renders via React + Babel in-browser — no build step, just open it.

### Wider context, if useful

`PFS Product Page Redesign.html` in the parent project holds all eight concepts (C1–C8) plus
the enforcer audit, colour system and mobile set. `PFS CRO Strategy.html` holds the personas,
per-concept rationale, A/B plan with sample-size maths, and the assumptions register. Neither
is needed to implement C8-A, but they explain why it looks like this.
