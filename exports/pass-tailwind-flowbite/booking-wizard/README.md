# Booking Wizard — Tailwind v4 + Flowbite

The Pass Functional Skills Maths Level 2 booking wizard, ported from the original React/JSX implementation to **plain HTML + Tailwind v4 utility classes + Flowbite v3 JS**.

## What's here

```
index.html        Single-file wizard. Open directly in a browser — no build needed.
wizard.js         All wizard logic: state, validation, pricing, step rendering, calendar
README.md         You are here
```

## Architecture

- **Page chrome** (top nav, exam sub-bar with countdown, trust sidebar, footer pricing chip) is **static HTML** in `index.html`. The user can comment, drag, and edit any of it directly.
- **The 5 wizard steps** live in `wizard.js`. Each step is a function that returns an HTML string. The wizard re-renders the active step on every state change.
- **State** is one plain object on `window.wizState` with `set(patch)` and `subscribe(fn)`. Easy to swap for Pinia / Zustand / React state when you wire it into a real app.
- **Pricing** is the same model from the original JSX wizard: demand-based on day-of-week + day-of-month + slot, blended with invigilation discount and course add-on.

## Step → component map

| Step                       | Renderer (`wizard.js`)          | Components used (from `../components/`) |
|----------------------------|-----------------------------------|------------------------------------------|
| Page chrome                | `index.html`                      | Navbar, Badge                            |
| Stepper nav                | `renderStepNav()`                  | **Stepper** (3 variants)                 |
| 1 — Your details           | `renderStep1Details()`             | Input                                    |
| 2 — Invigilation           | `renderStep2Invigilation()`        | Radio (card pattern)                     |
| 3 — Date & time            | `renderStep3DateTime()`            | **Datepicker** (custom heat-map calendar) |
| 4 — Course                 | `renderStep4Course()`              | Card, Radio (card pattern)               |
| 5 — Checkout               | `renderStep5Checkout()`            | Radio, Input, Card                       |
| Trust sidebar              | `index.html`                       | Card, Badge                              |
| Price chip                 | `renderPriceChip()`                 | Badge                                    |
| Confirm-leave modal        | `index.html` (Flowbite modal)      | **Modal**                                 |

## Customising

### Switch step-nav style
The wizard supports three step-nav styles — `numbered` (default), `bar`, `chips`. Change the data attribute on the wizard root:

```html
<div id="wizard" data-step-nav="bar">…</div>
```

…or call `window.wizState.set({ stepNav: 'chips' })` from the console.

### Switch date layout
Same idea — `data-date-layout` accepts `split` (default), `heatmap`, or `list`.

### Pricing
All pricing lives in `wizard.js` under `PRICING_MODEL`. Replace `dayDiscount()`, `timeDiscount()`, and `priceFor()` to wire to your availability API.

### Branding
Already inherited from `../tokens.css`. Change `--color-primary-600` once and every CTA, stepper dot, calendar cell, and chip re-tints.

## Wiring into a real app

1. **Vue / Nuxt 3:** Replace the renderer functions with `<template>` blocks. Move state to Pinia.
2. **React / Next.js:** Replace the renderer functions with components. Move state to a `useReducer` or Zustand.
3. **Replace the calendar:** Plug Flowbite Datepicker (`<input datepicker>`) in if you don't need the heat-map pricing visualisation.

See `../setup.md` for the per-stack install.
