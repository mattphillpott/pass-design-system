# tailwind-config notes (Tailwind v4)

Tailwind v4 reads its config from CSS. There is no `tailwind.config.ts` here — `tokens.css` is the source of truth.

## Entry CSS (`assets/css/main.css`)

```css
@import "tailwindcss";
@import "./tokens.css";
@import "./base.css";

/* Optional: PrimeVue's data attribute hooks  */
@source "../../node_modules/primevue";

/* Dark variant — already declared in tokens.css, repeat here only if you don't @import tokens.css */
/* @variant dark (&:where(.dark, .dark *)); */
```

## Nuxt 3 wiring

`nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  css: ['~/assets/css/main.css'],
  modules: ['@nuxtjs/tailwindcss'],   // v4 — set viteOptions to skip the legacy config
  // OR Nuxt 3.13+ Vite plugin form:
  vite: {
    plugins: [
      // @ts-ignore
      (await import('@tailwindcss/vite')).default(),
    ],
  },
})
```

## `@utility` defined in `base.css`

| Utility            | Purpose                                                  |
|--------------------|----------------------------------------------------------|
| `container-page`   | Marketing container (max-width: 1280, gutter responsive) |
| `container-portal` | Portal container (max-width: 1440)                       |
| `focus-ring`       | Reusable focus ring (matches `focus-visible` default)    |
| `skeleton`         | Shimmer placeholder                                      |
| `eyebrow`          | Uppercase brand-coloured small caps                      |

## `@variant` defined in `tokens.css`

```css
@variant dark (&:where(.dark, .dark *));
```

That's it — Tailwind v4 doesn't need the `darkMode: 'class'` flag. The `.dark` class and `prefers-color-scheme: dark` overrides live in `tokens.css` (`@layer base`).

## Plugins

None required. Everything (typography, forms, container-queries) is achievable with v4 utilities + the few `@utility` blocks above.

If you want **@tailwindcss/typography** for marketing blog content, add it:

```css
@plugin "@tailwindcss/typography";
```

…and apply with `prose prose-pass` on a long-form container. Tweak via:

```css
@theme {
  --typography-pass-body: var(--color-fg-2);
  --typography-pass-headings: var(--color-fg-1);
  --typography-pass-links: var(--color-primary-700);
}
```

## Custom screens (already aligned to Tailwind defaults)

```css
@theme {
  --breakpoint-sm:  640px;
  --breakpoint-md:  768px;
  --breakpoint-lg:  1024px;
  --breakpoint-xl:  1280px;
  --breakpoint-2xl: 1536px;
}
```

## Generated utilities you'll use most

- Color: `bg-primary-600`, `text-fg-2`, `border-border-default`
- Spacing: `p-6` (24px), `gap-4` (16px), all from `--spacing: 0.25rem`
- Radius: `rounded-lg` (12px default)
- Shadows: `shadow-md`, `shadow-focus`
- Type: `text-sm`, `font-medium`, `tracking-tight`, `leading-relaxed`
- Motion: `duration-150`, `ease-[cubic-bezier(.4,0,.2,1)]` (or define an `@theme` ease)
