# Pass — Exam Booking Wizard (React / JSX export)

The full Functional Skills booking wizard, exactly as built. No bundler, no install — open `index.html` in any browser and it runs.

---

## What's in here

```
index.html              Entry — renders the wizard + variant toggle panel
colors_and_type.css     Pass design tokens (Pass Green primary, Inter, 12 px radii)
PFSIcon.jsx             Icon component (loads SVGs from assets/icons/, falls back to Lucide CDN)
tweaks-panel.jsx        The floating "Wizard variants" panel
wiz-shared.jsx          Pricing model · validators · date utils · primitives (Field, TrustPill, …)
wiz-steps-a.jsx         Step nav variants (Numbered / Progress / Chips) · Step 1 details · Step 2 invigilation
wiz-steps-b.jsx         Step 3 date+time (3 layouts) · Step 4 course · Step 5 checkout · password strength
wiz-app.jsx             Page chrome (header, sub-bar, trust sidebar) · BookingWizard shell · price chip
assets/
  icons/                Vendored SVG icon subset
  logos/                Pass wordmark + mark
```

## Stack

- **React 18.3.1** (UMD, loaded from unpkg)
- **Babel Standalone** to transpile JSX at runtime
- Plain CSS custom properties (no Tailwind, no preprocessor)
- Inter via Google Fonts (`@import` in `colors_and_type.css`)
- Icons: local SVGs in `assets/icons/`; anything missing falls back to `lucide-static` on unpkg

No package.json, no node_modules, no build step. Just static files.

---

## Run it

### Local
```bash
# Any static server. Pick one:
npx serve .
# or
python3 -m http.server 8000
```
…then open http://localhost:8000.

> **Note:** `PFSIcon.jsx` `fetch()`-es SVG files, so opening `index.html` via `file://` won't load icons in some browsers. Use a local server.

### Drop on a host
Upload the folder to any static host (Netlify, Vercel, S3, GitHub Pages). No server needed.

---

## Architecture

### State
All wizard state lives in one `useState` object on `BookingWizard` in `wiz-app.jsx`:

```js
{
  firstName, lastName, email, phone,
  invigilation: 'human' | 'auto',
  date: 'YYYY-MM-DD' | null,
  time: 'HH:MM' | null,
  course: 'none' | 'standard' | 'premium',
  portalEmail, portalPassword,
  payment: 'card' | 'paypal' | 'klarna' | 'clearpay' | 'applepay' | 'googlepay',
}
```

Plus `step`, `maxReached`, `direction`, and `errors`. Easy to swap for `useReducer`, Zustand, Redux when wiring to a real app.

### Pricing
`priceFor(date, slot, invigilation, course)` in `wiz-shared.jsx`. Demand-based on day-of-week + day-of-month + slot, blended with invigilation discount and course add-on. Returns a `Number` rounded to pence.

### Step navigation
Three variants — controlled by the `stepNav` tweak:
- **Numbered** — connected stepper with labels (default for ≤ 5 named steps)
- **Progress bar** — gradient bar + step dots (good for ≥ 6 steps)
- **Chips** — pill-shaped chips (most compact)

### Date picker (Step 3)
Three layouts — controlled by the `dateLayout` tweak:
- **List** — 14 upcoming days as price-tagged rows
- **Heat-map** — full month calendar, cell colour = price tier
- **Split** — month grid left, time slots right (default)

### Validation
- Email / phone / required-text — `validators` in `wiz-shared.jsx`, validated on blur, shown inline
- Password strength meter — `passwordStrength()` in `wiz-steps-b.jsx`, only when a course bundle is picked

### Tweaks panel
Floating panel in the bottom-right. Toggles step-nav style, date-picker layout, and density. The `useTweaks` hook in `tweaks-panel.jsx` persists choices by rewriting the JSON block between `/*EDITMODE-BEGIN*/` and `/*EDITMODE-END*/` in `index.html` — that block survives reloads.

### Animations
- Step body — slide L/R via inline `@keyframes wizSlideInR / wizSlideInL`
- Price chip — bumps `scale(1.04)` with a green glow whenever the total changes
- Countdown timer — drives a per-second update of the orange "Offer ends in" pill in the sub-bar

### Icons
`PFSIcon` (in `PFSIcon.jsx`) loads `assets/icons/<name>.svg`. If missing, it falls back to `https://unpkg.com/lucide-static@0.395.0/icons/<name>.svg`. Both responses are cached in `__pfsIconCache`. To bundle every icon locally, copy the matching SVGs from [Lucide](https://lucide.dev) into `assets/icons/`.

The Lucide icons referenced (not bundled locally) include: `arrow-left`, `lock`, `trending-down`, `alert-circle`, `x-circle`, `alert-triangle`, `zap`, `chevron-left`, `shield-check`, `video`, `globe`, `rotate-ccw`, `headphones`.

---

## Customising

| Want to                          | Edit                                                                    |
|----------------------------------|--------------------------------------------------------------------------|
| Change brand colour              | `colors_and_type.css` → `--pass-green-600` (and the rest of the ramp)    |
| Change pricing / discounts        | `wiz-shared.jsx` → `dayDiscount`, `timeDiscount`, `priceFor`             |
| Wire to a real availability API  | Replace `priceFor()` and `spacesLeft()` calls; pass props in             |
| Add a step                       | Add to `STEP_LABELS` (wiz-steps-a) + render in `BookingWizard` (wiz-app) |
| Change the trust sidebar         | `TrustSidebar` in `wiz-app.jsx`                                          |
| Pre-fill from URL params         | Add a `useEffect` reading `URLSearchParams` in `BookingWizard`           |

---

## Porting to a real app

This is a prototype, not production code. To productionise:

1. **Replace the Babel runtime** — set up Vite / Next.js / Remix with proper JSX compilation.
2. **Split state** — invigilation, date, course, and payment naturally become separate slices (Zustand stores or React Context).
3. **Move pricing server-side** — `priceFor()` is the wire format; expose it as a `GET /api/availability?date=&slot=` endpoint.
4. **Real payment** — Stripe Elements (or Adyen) for the card form; their native buttons for Apple Pay / Google Pay; Klarna + Clearpay + PayPal each have their own SDKs.
5. **Replace the heat-map calendar** if you don't need the demand-pricing visualisation — but the visual gain in conversion is significant, so probably keep it.

---

## Caveats

- Tweaks toggles persist only when you're editing the file in an editor that understands the `/*EDITMODE-BEGIN*/.../*EDITMODE-END*/` markers. In a regular browser, changes last until reload.
- The countdown's target is seeded in `sessionStorage`; clear it (`sessionStorage.removeItem('wizCountdownTarget')`) to reset.
- Phone numbers, BNPL marks, and trust copy are placeholders. Drop in the real values before going live.
