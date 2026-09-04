# Pass Design System — Tailwind v4 + Flowbite export

Stack-agnostic class-string export of the Pass system, including the **exam booking wizard**, for any project running **Tailwind CSS v4** with **Flowbite v3**.

Works with vanilla HTML, React (via `flowbite-react`), Vue (`flowbite-vue`), Svelte (`flowbite-svelte`), Angular, Rails, or anything that lets you write class strings.

---

## What's in the box

```
README.md                          ← you are here
tokens.css                         Tailwind v4 @theme block — Pass tokens skinned over Flowbite primary-*
base.css                           Resets, body, focus-visible, scrollbar, selection, custom @utility
main.css                           Single-entry import that wires Tailwind + Flowbite + tokens + base
setup.md                           Install + wiring (vanilla HTML CDN, vanilla npm, React, Vue)
flowbite-config.md                 What changes between Flowbite v2 → v3, and Tailwind v3 → v4
icons.md                           Icon set (Flowbite Icons + Lucide fallback)

components/                        Reference class strings — copy into your templates
  Button.html       Primary / Secondary / Ghost / Danger · sizes · icon-only · loading · group
  Input.html        Text / search / file / number · prefix/suffix · error · success · disabled
  Select.html       Native + Flowbite-styled dropdown
  Checkbox.html     Default · indeterminate · cards via has-[input:checked]
  Radio.html        Stack · radio-card pattern
  Switch.html       sm / md / lg · on/off/disabled (Flowbite toggle)
  Textarea.html     Default · counter · error
  Card.html         Static · hover-lift · header/body/footer · stat · empty state
  Alert.html        Info / success / warning / danger · dismissible · with list
  Badge.html        6 intents · dot · removable · sizes
  Toast.html        Success / info / warning / danger
  Modal.html        Flowbite modal · sizes · confirm variant
  Drawer.html       Right / left / bottom-sheet (data-drawer-*)
  Dropdown.html     Menu · checkbox/radio · with search · nested
  Tooltip.html      Flowbite tooltip · 4 placements
  Tabs.html         Underline · pill · card · vertical (data-tabs-toggle)
  Stepper.html      Numbered · progress-bar · chip (used by the booking wizard)
  Accordion.html    Flush · collapse-all · arrow icons
  Avatar.html       5 sizes · initials · status · stacked
  Table.html        Static · sticky · dense · empty row · skeleton
  Pagination.html   Numbered · prev/next · with helper text
  Breadcrumb.html   Slash · chevron
  Navbar.html       Marketing top bar (responsive collapse via data-collapse-toggle)
  Sidebar.html      Portal sidebar (data-drawer + Flowbite icons)
  Datepicker.html   Flowbite Datepicker (flatpickr-based) · range · inline

booking-wizard/
  index.html                       The full booking wizard — Tailwind + Flowbite, 5 steps, ready to host
  wizard.js                        State, validation, pricing model, step nav, calendar
  README.md                        Wizard architecture + customisation notes

index.html                         Gallery landing page — links to every component reference and the wizard
```

---

## Three-line install (Tailwind v4 + Flowbite v3, npm)

```bash
pnpm add -D tailwindcss @tailwindcss/vite
pnpm add flowbite
```

`assets/css/main.css`:

```css
@import "tailwindcss";
@plugin "flowbite/plugin";
@source "../../node_modules/flowbite";

@import "./tokens.css";
@import "./base.css";
```

In your HTML / root template:

```html
<script src="https://cdn.jsdelivr.net/npm/flowbite@3.1.2/dist/flowbite.min.js"></script>
```

Or import it once in your bundler:

```js
import 'flowbite';
```

That's it. Full per-stack instructions in **setup.md**.

---

## Conventions

- **Brand is Pass Green.** `--color-primary-600 = #0FBC0F`. Flowbite reads `primary-*` automatically — every Flowbite component you drop in is already on-brand.
- **Class strings, not class objects.** Every variant is rendered out so you can grep for the exact look.
- **Native HTML where viable.** `<dialog>`, `<details>`, `<input type="checkbox">` with `peer` — only reach for Flowbite JS when you need ARIA / portal / focus-trap (Modal, Drawer, Dropdown, Tabs, Tooltip, Datepicker).
- **Dark mode** — toggle `.dark` on `<html>`. Tokens flip automatically. `prefers-color-scheme: dark` is honoured unless `.light` is explicit.
- **UK English.** Maths, personalised, organisation, centre.

---

## The booking wizard

`booking-wizard/index.html` is the **headline deliverable**. It's the full Pass Functional Skills Maths Level 2 booking wizard converted to plain Tailwind + Flowbite class strings — no React, no Vue, no Babel. State is in `wizard.js` (small vanilla module).

What it covers:

- 5 steps: details → invigilation → date & time → course → checkout
- Numbered stepper, progress-bar, and chips variants (CSS data attribute switch)
- Three date pickers: list, heat-map calendar, split month + slots
- Demand-priced calendar (greener = cheaper) using the original Pass pricing model
- Inline validation, password strength, BNPL marks, Trustpilot block, countdown timer
- Sticky trust sidebar with phone CTA
- Fully responsive with Tailwind breakpoints
- Flowbite components used: **Stepper, Datepicker, Modal (confirm-leave), Toast, Tooltip**

Open `booking-wizard/index.html` directly in a browser — no build step.

---

## Open the export

- `index.html` — gallery of every component plus the wizard
- `booking-wizard/index.html` — wizard live demo
- `components/*.html` — copy-paste class strings

---

## Caveats

- The Pass logo bundled is the placeholder from the parent design system. Drop a real SVG into `assets/logos/`.
- Flowbite Pro components (Marketing UI, App UI, Plus) are **not** redistributed here — only patterns derived from the open-source Flowbite v3 library. Licence your Pro copy via flowbite.com if your team needs it.
- The wizard uses an inline pricing model for demo. Wire it to your real availability/pricing service before going live.
