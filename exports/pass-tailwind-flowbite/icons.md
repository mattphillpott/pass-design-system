# Icons

## Library

**Primary:** [Flowbite Icons](https://flowbite.com/icons/) — 500+ icons, MIT-licensed, ship as both outline and solid SVGs. Their stroke weight and visual rhythm match Flowbite components natively.

**Fallback / extras:** [Lucide](https://lucide.dev/) — covers anything Flowbite doesn't.

---

## Install

### Flowbite Icons (any stack)

Vendored — copy the SVGs you need from the [Flowbite Icons CDN](https://flowbite.com/icons/) or install:

```bash
pnpm add flowbite
```

…then reference from `node_modules/flowbite/icons/` (or any of the SVG-icon-set packages: `flowbite-react-icons`, `flowbite-vue-icons`, depending on stack).

### React

```bash
pnpm add lucide-react
```

```jsx
import { ChevronRight, Search, Plus } from 'lucide-react';

<Search className="w-4 h-4 text-gray-500" />
```

### Vue

```bash
pnpm add lucide-vue-next
```

```vue
<script setup>
import { ChevronRight, Search } from 'lucide-vue-next';
</script>

<template>
  <Search class="w-4 h-4 text-gray-500" />
</template>
```

### Vanilla HTML / SSR

Inline SVGs directly (best for first-paint) OR use Iconify's web component:

```html
<script src="https://code.iconify.design/iconify-icon/2.0.0/iconify-icon.min.js"></script>

<!-- Flowbite icons -->
<iconify-icon icon="flowbite:arrow-right-outline" width="16"></iconify-icon>

<!-- Lucide as fallback -->
<iconify-icon icon="lucide:trending-down" width="14"></iconify-icon>
```

---

## Sizes

| Token        | Class         | px   | Use                                       |
|--------------|---------------|------|-------------------------------------------|
| `xs`         | `w-3 h-3`     | 12   | Inline within text-xs                     |
| `sm`         | `w-3.5 h-3.5` | 14   | Inline within text-sm                     |
| `md` default | `w-4 h-4`     | 16   | Buttons, inputs, menus (most common)      |
| `lg`         | `w-5 h-5`     | 20   | Section headings, primary action icons    |
| `xl`         | `w-6 h-6`     | 24   | Empty-state hero icons                    |
| `2xl`        | `w-8 h-8`     | 32   | Avatar fallbacks, marketing feature blocks|

---

## Stroke

- **2 px stroke** on outline icons (Flowbite default; Lucide default).
- **Never mix** 1.5 px and 2 px in the same view.
- **Solid icons** for status (success ✓, error ✗, warning ⚠, info ⓘ).

---

## Colour

Icons inherit `currentColor`. Use Tailwind text utilities:

- Default neutral: `text-gray-500` (matches `--color-fg-3`)
- Primary surfaces: `text-primary-600` / `text-primary-700`
- Muted / placeholders: `text-gray-400`
- In status badges: matches the badge's text colour

---

## Pairing rules

- **Outline** — navigation, neutral UI, form prefixes
- **Solid** — active/selected items, status badges, toast leading icons
- **Brand glyphs** — LinkedIn, YouTube, X, Facebook, Instagram in marketing footers (Flowbite Brands set or simple-icons)

---

## Specific icons used by the booking wizard

The wizard relies on these (all available in Flowbite Icons + Lucide):

| Wizard step      | Icons                                                          |
|------------------|----------------------------------------------------------------|
| Page header      | `lock`, `phone`, `arrow-left`                                  |
| Step 1 details   | `user`, `mail`, `phone`, `lock-closed` (security note)         |
| Step 2 invigil.  | `users`, `clock`, `shield-check`, `headphones`, `video`, `zap`, `globe`, `alert-triangle` |
| Step 3 date/time | `chevron-left`, `chevron-right`, `zap`, `trending-down`        |
| Step 4 course    | `check`, `x`, `trending-up`, `graduation-cap`                  |
| Step 5 checkout  | `lock-closed`, `shield-check`, `rotate-ccw` (refund), `clock`  |
| Trust sidebar    | `shield-check`, `award`, `lock`, `rotate-ccw`, `phone`         |
| Price chip       | `trending-down`                                                |

Drop them in inline:

```html
<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
</svg>
```

Or use Iconify / Lucide as shown above.

---

## Emoji

**Do not** use emoji anywhere in product or marketing — Pass is institutional in tone.

## Unicode arrows

`→`, `←`, `↗` are fine in body copy (link affordances). Never substitute for icons in UI.
