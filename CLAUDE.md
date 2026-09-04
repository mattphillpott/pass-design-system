# Pass Revise — project notes

## Brand direction (as of 2026-07-06)
- **Chosen direction: 1a "Volt"** — bright violet primary (`#6C3BF4`), Inter throughout,
  heritage Pass green reserved for the "pass / correct / unlocked" success signal.
- Source of truth for the visual system: `Pass Revise Brand Foundation.html` (canvas doc, 2 directions, light/dark).

## ⚠️ OPEN DECISION — primary colour
The **primary colour may revert to the default Pass design-system green** (`#0FBC0F`).
Awaiting CEO sign-off on whether Pass Revise:
  (a) keeps the Pass heritage **green** as primary, or
  (b) introduces the new **Volt violet** as a distinct Pass Revise brand colour.
Until signed off, keep primary swappable via **one token** (`--primary` / the Volt violet scale)
so the switch is a single-variable change, not a refactor. Do not hard-code violet hex values
in components — always go through the `--primary*` tokens.

## Handoff constraint
Final build target is **Vue 3 + Nuxt + Tailwind (NOT React)**. Prototypes here render as
framework-agnostic HTML + utility styling so the Vue SFC port stays clean.
