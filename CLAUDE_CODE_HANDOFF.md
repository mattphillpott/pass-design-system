# Pass Functional Skills — Landing Page Handoff

This is a spec for converting the prototype in `PFS Landing Page.html` + `PFS Sections.jsx` into the production site (Tailwind + Flowbite). The prototype uses inline styles + a custom `colors_and_type.css`; everything below maps those choices to Tailwind/Flowbite equivalents.

> **For Claude Code:** treat the prototype as the visual source of truth. When in doubt about spacing, weight, or colour, open the prototype and copy the value, not the class name I've suggested.

---

## 1. Tokens — add to `tailwind.config.{js,ts}`

```js
// tailwind.config.js
module.exports = {
  content: ['./**/*.{html,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Pass green — primary brand scale
        primary: {
          50:  '#F0FEEF',
          100: '#DBFEDA',
          200: '#B8FBB7',
          300: '#81F580',
          400: '#42E741',
          500: '#18CF18',
          600: '#0FBC0F',  // DEFAULT brand
          700: '#0F8610',  // hover
          800: '#116A12',  // press
          900: '#105712',
          950: '#033005',
        },
        // Semantic — match Flowbite's defaults; safe to drop if you already have them
        info:    { 50: '#EEF6FF', 500: '#1C64F2', 700: '#1A56DB' },
        warning: { 50: '#FFF7ED', 500: '#D97706', 700: '#B45309' },
        success: { 50: '#ECFDF5', 500: '#0E9F6E', 700: '#047857' },
        danger:  { 50: '#FDF2F2', 500: '#C70036', 700: '#9B1C1C' },
      },
      borderRadius: {
        // Default radius for cards/buttons/inputs is `lg` (12px) — confirm yours matches.
        DEFAULT: '0.75rem',
      },
      boxShadow: {
        focus: '0 0 0 3px rgba(15,188,15,0.25)',
        'card-pop': '0 24px 48px -16px rgba(15,188,15,0.25)',
      },
    },
  },
  plugins: [require('flowbite/plugin')],
};
```

Add `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');` to your global CSS (or load via `<link>`).

---

## 2. Token → Tailwind class cheatsheet

| Prototype value | Tailwind class |
|---|---|
| `#0FBC0F` (brand) | `bg-primary-600` / `text-primary-600` / `border-primary-600` |
| `#0F8610` (hover/dark green) | `bg-primary-700` / `text-primary-700` |
| `#033005` (deepest green, top strip + dark section) | `bg-primary-950` |
| `#F0FEEF` / `#DBFEDA` / `#B8FBB7` (light green tints) | `bg-primary-50` / `bg-primary-100` / `border-primary-200` |
| `#101828` (heading text) | `text-gray-900` |
| `#344054` (body) | `text-gray-700` |
| `#4A5565` (secondary) | `text-gray-600` |
| `#6A7282` (muted) | `text-gray-500` |
| `#98A2B3` (placeholder) | `text-gray-400` |
| `#E5E7EB` (default border) | `border-gray-200` |
| `#F9FAFB` (page bg) | `bg-gray-50` |
| `#F3F4F6` (raised) | `bg-gray-100` |
| `#EEF6FF` / `#1C64F2` (info badge) | `bg-info-50 text-info-500 border-info-100` |
| `#FFF7ED` / `#D97706` (warning badge) | `bg-warning-50 text-warning-500 border-warning-100` |
| Radius 12 / 16 / 20 | `rounded-xl` (12) / `rounded-2xl` (16) / `rounded-3xl` (20) |
| Container width 1200px, padded 32px | `max-w-7xl mx-auto px-8` |
| Letter-spacing `-0.025em` / `-0.035em` | `tracking-tight` / `tracking-tighter` |

Headings use Inter 800 for h1, 700 for h2, 600 for h3+. Hero h1 is **64px / 1.05 / -0.035em**, section h2 is **44px**, big final-CTA h2 is **56px**.

---

## 3. Page structure — top to bottom

The prototype renders these in order. Each maps cleanly to a section in markup.

1. `PFSTopStrip` — dark green announcement bar (Ofqual + 4.7★)
2. `PFSNav` — sticky white header with Pass logo + centered "UK's #1" pill + phone + CTA
3. `PFSHero` — split: left pitch + 4 stat cards + phone block, right lead form
4. `PFSLogos` — placeholder partner logos strip
5. `PFSRoutes` — 3 pricing-style cards (FS L2 popular, GCSE blue, Equivalency amber) + advisor strip below
6. `PFSProcess` — 4 numbered steps with dashed connector
7. `PFSCareers` — 3×3 grid of career cards
8. `PFSReviews` — 3 testimonial cards + 4.7★ pill
9. `PFSWhy` — dark green section, 2-column (sticky heading left, 4 stat tiles + 4 reason cards right)
10. `PFSFinalCTA` — light gradient, split: copy + tick list + black phone block / lead form
11. `PFSFooter` — 4 columns
12. `PFSStickyBar` — bottom-fixed mobile-style call/callback bar (appears after scroll)

---

## 4. Flowbite components to use

| Section element | Flowbite component | Notes |
|---|---|---|
| Sticky nav | [`Navbar`](https://flowbite.com/docs/components/navbar/) | Strip the menu links — this is a landing page, no nav. |
| Phone CTA pill in nav | [`Button` + `Tooltip`](https://flowbite.com/docs/components/buttons/) | Use `pill` variant. |
| Lead form fields | [`Forms`](https://flowbite.com/docs/components/forms/) | Standard inputs with floating-label or top-label style. Use `Select` for the career dropdown. |
| Trust badges (`93%`, `Ofqual` etc.) | [`Badge`](https://flowbite.com/docs/components/badge/) — but these are **custom card-style stat tiles**, not stock badges | Green check icon + bold number + label. |
| Route cards | [`Card`](https://flowbite.com/docs/components/card/) — heavily customised | "Most popular" gets primary border + popped shadow + absolute green tab badge. Other two get light Flowbite badges (info / warning). |
| "Most popular" / "Traditional route" / "Alternative route" pill labels | [`Badge`](https://flowbite.com/docs/components/badge/) | See §5. |
| Tick lists inside route cards | Manual `<ul>` + Lucide `check-circle` | No Flowbite list component matches. |
| Testimonial cards | [`Rating`](https://flowbite.com/docs/components/rating/) for the stars + plain card | Use Flowbite's star SVGs. |
| Sticky bottom bar | [`Bottom navigation`](https://flowbite.com/docs/components/bottom-navigation/) | Heavy custom — 2 buttons + caption. Probably easier to hand-roll. |
| Footer | [`Footer`](https://flowbite.com/docs/components/footer/) | 4 columns. |

Everything else (hero pattern, process connector, dark "Why Pass" section, final CTA gradient) is custom — build directly with Tailwind utilities.

---

## 5. Route-card badges (recently changed — important)

Three variants:

```html
<!-- Most popular — green tab attached to top-left of card -->
<span class="absolute -top-3.5 left-7 inline-flex items-center rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white">
  Most popular
</span>

<!-- Traditional route — Flowbite info (blue) light badge, inline at top of card -->
<span class="self-start inline-flex items-center rounded-lg border border-info-100 bg-info-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-info-500 mb-3">
  Traditional route
</span>

<!-- Alternative route — Flowbite warning (amber) light badge -->
<span class="self-start inline-flex items-center rounded-lg border border-warning-100 bg-warning-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-warning-500 mb-3">
  Alternative route
</span>
```

The popular card also has `border-2 border-primary-600` and `shadow-card-pop`. Other cards have `border border-gray-200` and no shadow.

---

## 6. Buttons

Two variants used:

```html
<!-- Primary -->
<a class="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-xl bg-primary-600 text-white font-semibold text-sm hover:bg-primary-700 active:bg-primary-800 focus-visible:shadow-focus transition-colors">
  Get free advice
</a>

<!-- Secondary (outline) -->
<a class="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-xl bg-white border border-gray-200 text-gray-900 font-semibold text-sm hover:bg-gray-100 transition-colors">
  Call us free
</a>
```

Sizes: `--lg` is `h-12 text-base px-6`, `--sm` is `h-8 text-xs px-3`.

**No underlines on any `<a>` rendered as a button.** Add `text-decoration: none` globally if you've inherited any.

---

## 7. Icons

The prototype uses **Lucide** (lucide-static SVGs in `assets/icons/`). For React/Vue/etc., use the official Lucide package (`lucide-react`, `lucide-vue-next`, etc.). Specific names referenced:

`phone`, `award`, `check`, `check-circle`, `chevron-down`, `lightbulb`, `book-open`, `clock`, `graduation-cap`, `clipboard-list`, `message-circle`, `play`, `sparkles`, `file-text`, `trending-up`, `calculator`, `users`, `user`.

Phone-call CTAs use `phone`. The `message-circle` is reserved for "speak to an advisor" semantic moments — keep that distinction.

---

## 8. Responsive breakpoints

The prototype collapses with two breakpoints — match these in Tailwind:

```css
/* lg: 1024px down — stack hero/footer/why/final-CTA, drop to 2-col grids */
@media (max-width: 1024px) { .pfs-routes-grid, .pfs-careers-grid, .pfs-reviews-grid, .pfs-process-grid { grid-template-columns: repeat(2, 1fr); } }

/* md: 720px down — single column, stack top strip */
@media (max-width: 720px) { /* all grids → 1 col, top strip stacks */ }
```

Tailwind equivalent:
- Hero / final-CTA / why / footer: `flex flex-col lg:flex-row` or `grid grid-cols-1 lg:grid-cols-2`
- Cards grids: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Process steps: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4` + hide the dashed connector under `lg`
- Centered "UK's #1" pill in nav: `hidden lg:flex`

---

## 9. Special effects worth preserving

- **Hero background**: subtle dot pattern. CSS: `background-image: radial-gradient(circle at 1px 1px, rgba(15,188,15,0.08) 1px, transparent 0); background-size: 24px 24px;` over `bg-primary-50/40`.
- **Lead-form header**: solid `bg-primary-600` band with white text + small "⏱ Reply in ~1 hr" pill (`bg-white/20`).
- **Process connector**: dashed horizontal line `repeating-linear-gradient(90deg, theme(colors.primary.100) 0 8px, transparent 8px 16px)` positioned absolutely behind the step circles.
- **Why Pass section**: full-bleed `bg-primary-950` with light-green eyebrows (`text-primary-400`) and `text-primary-100` body.
- **Final-CTA black phone block**: `bg-gray-900` card with green icon tile, used as alt path next to the form.

---

## 10. Copy & content

All copy lives in `PFS Sections.jsx` — the route bullets, career grid items, testimonial bodies, process steps, footer links. Lift verbatim; nothing in there is filler.

Phone number `020 4574 9155` and hours `Mon–Fri 08:45–20:00 · Sat 09:30–16:00` are constants at the top of the file.

---

## 11. What's intentionally NOT real

- The "trusted by" logo strip is **placeholder marks** (NHS-style block, Ford pill, etc.). Replace with real partner SVGs before launch.
- The lead form's submit handler is a `alert()` stub. Wire to your actual lead-capture endpoint.
- Reviews are illustrative. Replace with real Trustpilot/Reviews.io feed if available.

---

## 12. Files to ship to Claude Code

When handing off, send:

1. `PFS Landing Page.html` — entry/structure
2. `PFS Sections.jsx` — full source of every section (the truth for copy + layout)
3. `PFS Icon.jsx` — icon loader (just shows which icons are used; replace with `lucide-react`)
4. `colors_and_type.css` — token reference (don't ship; tokens go into `tailwind.config`)
5. This file (`CLAUDE_CODE_HANDOFF.md`)

Claude Code's job: rebuild each section as Tailwind/Flowbite components in your stack, using §1's tokens, §4's component map, and the prototype as the pixel reference.
