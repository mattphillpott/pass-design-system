# Pass Design System — Nuxt 3 / Vue 3 / Tailwind v4 export

This package contains everything needed to skin a **Nuxt 3 + Vue 3 + Tailwind v4** app to Pass's visual system, using **PrimeVue 4 (unstyled)** for headless overlay components and plain HTML + Tailwind utilities for everything else.

**No React. No Svelte. No Flowbite JavaScript.**

---

## Install

```bash
pnpm add -D tailwindcss @tailwindcss/vite
pnpm add primevue @primevue/nuxt-module lucide-vue-next
```

`nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  css: ['~/assets/css/main.css'],
  modules: ['@primevue/nuxt-module'],
  primevue: { options: { unstyled: true } },
  vite: { plugins: [ (await import('@tailwindcss/vite')).default() ] },
})
```

`assets/css/main.css`:

```css
@import "tailwindcss";
@import "./tokens.css";
@import "./base.css";
```

Drop `tokens.css` and `base.css` into `assets/css/`. You're ready.

---

## What's in the box

```
tokens.css                         Tailwind v4 @theme block (OKLCH colours, type, radii, shadows, z, motion)
base.css                           Resets, body, focus-visible, scrollbar, selection, @utility, @variant
tailwind-config-notes.md           v4 config (it's all CSS), @utility / @variant inventory
icons.md                           Lucide via lucide-vue-next or @nuxt/icon, sizes, stroke, colour, pairing
flowbite-js-replacements.md        Map every Flowbite JS behaviour → PrimeVue unstyled equivalent

components/
  Button.html                      Primary / Secondary / Ghost / Danger / Link · sizes · icon-only · loading · disabled · block · group
  Input.html                       Text / search / file / number · sizes · prefix/suffix · error · success · disabled · dropzone
  Select.html                      Native select + PrimeVue Select :pt wiring
  Checkbox.html                    Default · help text · indeterminate · error · disabled · sizes
  Radio.html                       Stack · cards (using has-[input:checked])
  Switch.html                      sm/md/lg · on/off/hover/disabled · Vue template note
  Textarea.html                    Default · counter · error · disabled
  Card.html                        Static · hover-lift · header/body/footer · stat · empty
  Dialog.html                      Native <dialog> recipe + PrimeVue Dialog :pt wiring · confirm variant
  Drawer.html                      Right / left / bottom-sheet · transition + transform
  Toast.html                       Success / info / warning / error · ARIA live regions
  Tabs.html                        Underline · pill · card · vertical
  Badge.html                       6 intents · dot · icon · removable · sizes · notification dot
  Alert.html                       Info / success / warning / danger · compact · inline
  Tooltip.html                     Pure-CSS hover · 4 positions · light · rich (with kbd)
  Avatar.html                      5 sizes · initials · icon fallback · status · stacked · square
  Table.html                       Full table · sticky · dense · empty row · skeleton row
  Pagination.html                  Numbered · compact · with page size
  Breadcrumb.html                  Slash · chevron · truncating
  Nav.html                         Marketing top bar · portal sidebar · collapsed sidebar
  Menu.html                        Dropdown (<details>) · checkbox/radio item · disabled · section heading
```

Each component file is **plain HTML + class strings**. Copy into a Vue SFC `<template>`, bind state where needed, done.

---

## Conventions

- **Class strings, not class objects.** Every variant is rendered out so you can grep for the exact look.
- **Native HTML where viable** — `<dialog>`, `<details>`, `<input type="checkbox">` + `peer` — only reach for PrimeVue when ARIA / portal / focus-trap matter.
- **Class names use Pass tokens.** `bg-primary-600`, `text-fg-2`, `border-border-default`. Tailwind v4 generates these from `tokens.css`.
- **Dark mode** — toggle the `.dark` class on `<html>`. `prefers-color-scheme` is honoured automatically.

---

## Next steps for the eng team

1. Drop `tokens.css` + `base.css` into `assets/css/`.
2. Install PrimeVue (`unstyled: true`) and Lucide.
3. Build a thin `<UiButton>` SFC that wraps the **Button.html** class strings + variant props.
4. For overlays (Dialog, Drawer, Tabs, Toast, Tooltip, Menu, Select), wrap the matching PrimeVue component with the `:pt` slot mapping shown in each file.

Ping back if you want a Storybook for these or a worked-example `<UiButton>`/`<UiInput>` SFC.
