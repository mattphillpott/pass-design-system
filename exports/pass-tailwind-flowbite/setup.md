# Setup — Tailwind v4 + Flowbite v3 + Pass tokens

Three flavours: **vanilla HTML (CDN)** for prototypes, **vanilla npm**, **React** (Next.js / Vite), and **Vue** (Nuxt 3 / Vite).

---

## 1. Vanilla HTML — CDN (fastest, for prototypes & this export's demos)

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Pass</title>

  <!-- Tailwind v4 browser build (DEV ONLY — do NOT ship to prod) -->
  <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>

  <!-- Pass tokens + base — both as <style> blocks so the browser CDN reads them -->
  <link rel="stylesheet" href="./tokens.css">
  <link rel="stylesheet" href="./base.css">
</head>
<body>
  <!-- your markup -->

  <!-- Flowbite JS (Modal, Drawer, Dropdown, Tabs, Tooltip, Datepicker) -->
  <script src="https://cdn.jsdelivr.net/npm/flowbite@3.1.2/dist/flowbite.min.js"></script>
</body>
</html>
```

> **Important.** The `@tailwindcss/browser@4` runtime does **not** read `@plugin` or `@source` directives. For CDN demos, load Flowbite's JS and its pre-compiled CSS (see fallback below) instead.

Fallback Flowbite CSS for CDN-only setups:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flowbite@3.1.2/dist/flowbite.min.css">
```

The example HTML in this export (`booking-wizard/index.html`, `index.html`, every `components/*.html`) uses this CDN flow.

---

## 2. Vanilla npm — Vite

```bash
pnpm create vite@latest my-app -- --template vanilla
cd my-app
pnpm add -D tailwindcss @tailwindcss/vite
pnpm add flowbite
```

`vite.config.js`:

```js
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss()],
});
```

`src/main.css`:

```css
@import "tailwindcss";
@plugin "flowbite/plugin";
@source "../../node_modules/flowbite";

@import "./tokens.css";
@import "./base.css";
```

`src/main.js`:

```js
import './main.css';
import 'flowbite';
```

Done. Drop component class strings from `components/*.html` into your templates.

---

## 3. React — Next.js (App Router) or Vite + React

```bash
pnpm add -D tailwindcss @tailwindcss/postcss
pnpm add flowbite flowbite-react
```

`postcss.config.mjs`:

```js
export default { plugins: { '@tailwindcss/postcss': {} } };
```

`app/globals.css` (Next.js) or `src/index.css` (Vite):

```css
@import "tailwindcss";
@plugin "flowbite/plugin";
@source "../node_modules/flowbite";
@source "../node_modules/flowbite-react";

@import "./tokens.css";
@import "./base.css";
```

Use `flowbite-react` for components — it wraps the JS interactions (Modal, Drawer, Datepicker) into proper React state. Or hand-roll with class strings from `components/*.html` if you want zero extra dependencies.

```jsx
import { Button } from 'flowbite-react';

export default function CTA() {
  return (
    <Button color="primary" size="lg">
      Book your exam
    </Button>
  );
}
```

`flowbite-react` reads the same `primary-*` scale from tokens.css, so `color="primary"` is Pass green out of the box.

### Per-stack notes

- **Next.js 14+** — App Router works out of the box. For client-side Flowbite components (Modal, Drawer), mark the consumer file `"use client"` at the top.
- **Remix / Vite + React** — same setup; use `flowbite-react`.

---

## 4. Vue — Nuxt 3 or Vite + Vue

```bash
pnpm add -D tailwindcss @tailwindcss/vite
pnpm add flowbite flowbite-vue
```

`nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [(await import('@tailwindcss/vite')).default()],
  },
});
```

`assets/css/main.css`:

```css
@import "tailwindcss";
@plugin "flowbite/plugin";
@source "../../node_modules/flowbite";
@source "../../node_modules/flowbite-vue";

@import "./tokens.css";
@import "./base.css";
```

Register Flowbite-Vue components:

```ts
// plugins/flowbite-vue.client.ts
import 'flowbite-vue';
```

Use in `<template>`:

```vue
<script setup>
import { FwbButton } from 'flowbite-vue';
</script>

<template>
  <FwbButton color="green" size="lg">Book your exam</FwbButton>
</template>
```

`flowbite-vue` ships its own colour names (`green`, `blue`, …); to keep Pass-green-as-primary, pass class overrides via `class="bg-primary-600 hover:bg-primary-700 focus:ring-primary-600/30"` — examples in `components/Button.html`.

---

## 5. Sanity-check the build

After install, verify:

```html
<button class="px-5 h-10 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 focus:ring-3 focus:ring-primary-600/25">
  Book your exam
</button>
```

You should see a 12 px-radius Pass-green button that hovers darker. If you see a grey button — `tokens.css` isn't loading after `tailwindcss`. Re-check import order.

---

## What changed between Flowbite v2 → v3

| Concern               | v2                                    | v3                                       |
|-----------------------|---------------------------------------|------------------------------------------|
| Init script           | `<script src="flowbite.js">`           | `<script src="flowbite.min.js">` (same)  |
| Tailwind config       | `require('flowbite/plugin')` in JS    | `@plugin "flowbite/plugin"` in CSS       |
| Dark-mode class       | `class="dark"` toggle                 | Same. `prefers-color-scheme` honoured.    |
| Modal `data-modal-*`  | `data-modal-toggle="…"`               | Same.                                    |
| Drawer attrs          | `data-drawer-*`                       | Same. Adds `aria-expanded` automatically. |
| Datepicker            | Separate `flowbite-datepicker` pkg    | Bundled in `flowbite@3`                  |

More detail in `flowbite-config.md`.
