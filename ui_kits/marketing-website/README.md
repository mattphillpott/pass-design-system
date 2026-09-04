# Pass Marketing Website — UI Kit

Recreation of pass.tech marketing site using the Pass design system.

## Sections (in order)

1. **Nav** — sticky, 72px, white with 8px blur.
2. **Hero** — headline + subhead + two CTAs, product screenshot card on the right, new-feature badge up top.
3. **Logo strip** — "Powered by Pass" wall of partner wordmarks (placeholder text — real logos needed).
4. **Features** — 3×2 grid of platform pillars.
5. **Stats** — blue band with 4 big numbers.
6. **Testimonial / case study** — quote + stat card.
7. **CTA** — dark band with demo CTA.
8. **Footer** — multi-column + legal row.

## Files

- `index.html` — stitches sections together.
- `NavFooter.jsx` — shared nav + footer.
- `Sections.jsx` — hero, logos, features, stats, testimonial, CTA.
- Icons are re-used from `../learning-portal/Icon.jsx` (same component).

## Caveats

- Partner logos are text placeholders — supply real SVGs.
- Hero product-preview card is a stylised mock of the portal, not an actual screenshot.
- No real links. This is a visual recreation, not a functional site.
