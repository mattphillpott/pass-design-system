---
name: pass-design
description: Use this skill to generate well-branded interfaces and assets for Pass (pass.tech — AI-powered learning & teaching platform for maths and English), either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Quick map

- `README.md` — brand context, CONTENT FUNDAMENTALS, VISUAL FOUNDATIONS, ICONOGRAPHY, caveats.
- `colors_and_type.css` — CSS custom properties for every token. Always `<link>` this.
- `assets/logos/`, `assets/icons/`, `assets/illustrations/`, `assets/patterns/` — brand artefacts.
- `preview/` — small specimen cards (reference only).
- `ui_kits/learning-portal/` — authenticated app (dashboard, course, mock result).
- `ui_kits/marketing-website/` — pass.tech (hero, features, stats, testimonial, CTA).

## Guardrails

- UK English always (maths, personalised, centre).
- Inter only. Weights 400/500/600/700/800.
- No emoji. No bluish-purple gradients. No glassmorphism.
- `#1447E6` is the single brand blue. Use tints for backgrounds, not new hues.
- 12px radius on cards, buttons, inputs. Pill for badges/avatars.
- Borders over shadows. Shadows only on overlays and hover-lifted cards.
