# Icons

## Lib

**Primary:** [Lucide](https://lucide.dev/) — 2px-stroke outline matches the Pass aesthetic.

In Nuxt:

```bash
pnpm add lucide-vue-next
```

```vue
<script setup>
import { Search, ChevronDown, Plus } from 'lucide-vue-next'
</script>

<template>
  <Search class="w-4 h-4 text-fg-4" />
</template>
```

**Auto-import alternative:** [`@nuxt/icon`](https://github.com/nuxt/icon) with the `lucide` set, plus `flowbite` set as fallback:

```ts
// nuxt.config.ts
modules: ['@nuxt/icon'],
icon: {
  customCollections: [],
  serverBundle: { collections: ['lucide', 'flowbite'] },
}
```

```vue
<Icon name="lucide:search" class="w-4 h-4 text-fg-4" />
```

## Sizes

| Token       | Class    | px   | Use                                       |
|-------------|----------|------|-------------------------------------------|
| `xs`        | `w-3 h-3`     | 12   | Inline within text-xs                   |
| `sm`        | `w-3.5 h-3.5` | 14   | Inline within text-sm                   |
| `md` default| `w-4 h-4`     | 16   | Buttons, inputs, menus (most common)    |
| `lg`        | `w-5 h-5`     | 20   | Section headings, primary action icons  |
| `xl`        | `w-6 h-6`     | 24   | Empty-state hero icons                  |
| `2xl`       | `w-8 h-8`     | 32   | Avatar fallbacks, marketing feature blocks|

## Stroke

- **2 px stroke** on outline icons (Lucide default).
- **Never mix** 1.5 px and 2 px in the same view.
- **Solid icons** for status (success ✓, error ✗, warning ⚠, info ⓘ).

## Colour

Icons inherit `currentColor`:

- Default: `text-fg-3` (`#4A5565`)
- Primary surfaces: `text-primary-600` / `text-primary-700`
- Muted / placeholders: `text-fg-4`
- In status badges: matches badge text colour

## Pairing rules

- **Outline** — navigation, neutral UI
- **Solid** — active/selected items, status (badges, toast leading)
- **Brand glyphs** — LinkedIn, YouTube, X, Facebook, Instagram in marketing footer (use Lucide's brand subset or simple-icons)

## Emoji

**Do not** use emoji anywhere in product or marketing — Pass is institutional in tone.

## Unicode arrows

`→`, `←`, `↗` are fine in body copy (link affordances). Never substitute for icons in UI.
