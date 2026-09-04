# Flowbite v3 ↔ Tailwind v4 cheat-sheet

A quick reference for the bits where Flowbite v3 differs from older guides and where Tailwind v4 differs from v3.

---

## Tailwind v4 — there is no `tailwind.config.ts`

Tailwind v4 reads everything from CSS. `tokens.css` in this export is the entire config surface.

| Tailwind v3 (JS config)              | Tailwind v4 (CSS only)                          |
|--------------------------------------|--------------------------------------------------|
| `theme.extend.colors`                | `@theme { --color-primary-600: …; }`             |
| `content: ['./src/**/*.html']`       | `@source "./src/**/*.html";`                     |
| `darkMode: 'class'`                  | `@variant dark (&:where(.dark, .dark *));`       |
| `plugins: [require('flowbite/plugin')]` | `@plugin "flowbite/plugin";`                  |
| `theme.extend.fontFamily.sans`       | `@theme { --font-sans: "Inter", …; }`            |
| `theme.extend.borderRadius.lg = '12px'` | `@theme { --radius-lg: 12px; }`              |
| `theme.extend.boxShadow.focus`       | `@theme { --shadow-focus: 0 0 0 3px …; }`        |

If you find a tutorial telling you to write `tailwind.config.ts`, **stop** — that's v3. Open `tokens.css` instead.

---

## Flowbite v3 — what's new vs. v2

- **One package**: `flowbite` ships components, datepicker, and the plugin. No more `flowbite-datepicker`.
- **CSS plugin syntax**: `@plugin "flowbite/plugin"` (Tailwind v4) replaces `require('flowbite/plugin')` in JS.
- **Dark-mode handling unchanged**: toggle `.dark` on `<html>`.
- **Data-attribute APIs unchanged**: `data-modal-toggle`, `data-drawer-target`, `data-dropdown-toggle`, `data-tabs-toggle`, `data-tooltip-target`, `data-datepicker`.
- **ESM build**: `import 'flowbite'` works in modern bundlers; the IIFE is at `flowbite/dist/flowbite.min.js`.

---

## Re-initialising Flowbite after route changes (SPA / SSR)

Flowbite scans the DOM once on `DOMContentLoaded`. After a client-side navigation in Next.js / Nuxt 3 you need to re-init:

```js
import { initFlowbite } from 'flowbite';

// Next.js App Router
'use client';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function FlowbiteReinit() {
  const pathname = usePathname();
  useEffect(() => { initFlowbite(); }, [pathname]);
  return null;
}
```

Drop `<FlowbiteReinit />` once in your root layout.

For Nuxt 3:

```ts
// plugins/flowbite.client.ts
export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter();
  router.afterEach(() => {
    import('flowbite').then(({ initFlowbite }) => initFlowbite());
  });
});
```

---

## Pass-specific Flowbite tweaks

| Concern                  | Pass override                                                         |
|--------------------------|------------------------------------------------------------------------|
| Default radius           | 12 px (`rounded-lg`). Flowbite components inherit via tokens.css.       |
| Primary scale            | Pass Green. `--color-primary-600 = #0FBC0F`.                            |
| Focus ring               | 3 px primary @ 25 % alpha. Override Flowbite's blue ring.               |
| Buttons height           | 32 / 40 / 48 px (sm / md / lg). Flowbite defaults are close — kept.     |
| Modal max-width          | `max-w-2xl` on confirm, `max-w-4xl` on big edit. See `Modal.html`.       |
| Tooltip background       | `#101828` (gray-900). Flowbite default already matches.                 |

The tokens.css already handles colour + radius + focus. Buttons and form controls re-pick those via `--color-primary-*` and `--radius-lg`.

---

## What you DON'T need

- **`flowbite-react`** or **`flowbite-vue`** are convenience wrappers. You can use plain `<button class="…">` everywhere — `flowbite.js` only matters for **dynamic** components (Modal, Drawer, Dropdown, Tabs, Tooltip, Datepicker).
- **`@tailwindcss/forms`** — Flowbite's plugin already styles `<input>`, `<select>`, `<textarea>`. Adding `@tailwindcss/forms` double-styles them.
- **`@tailwindcss/typography`** — optional; add `@plugin "@tailwindcss/typography";` to `main.css` if you need `prose` for marketing blog content.

---

## Production build size

Tailwind v4 + Flowbite v3 with the Pass token surface produces roughly:

- ~20 KB of compiled CSS (minified, gzipped) for a typical app
- ~14 KB of Flowbite JS (minified, gzipped) — only needed if you use Modal / Drawer / Dropdown / Tabs / Tooltip / Datepicker

Lazy-load `flowbite.min.js` if your above-the-fold doesn't need it.
