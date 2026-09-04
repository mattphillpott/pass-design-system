# Importing the Pass Design System into another Claude Design account

1. Create a new project on the other account and tell Claude: "this project is a design system".
2. Upload every file/folder from this zip, keeping the structure.
3. Two one-off fixups (they exist only so this folder can live inside the source project without colliding with it):
   - strip the trailing `.txt` from the six files in `components/`
   - in every file in `preview/`, replace `<!-- TXT@dsCard ` with `<!-- @dsCard `
4. Ask Claude to validate the design system — it regenerates the compiled bundle and manifest.

## What's in here
- `styles.css` — the single stylesheet consumers link (imports the tokens/type layer)
- `colors_and_type.css` — tokens: green primary (#0FBC0F), neutrals, semantics, type scale, spacing, radii, shadows, base component classes
- `components/` — Button, Badge, Card, plus the card grid `index.html`.
  **Important:** the source files ship as `Button.jsx.txt` / `Button.d.ts.txt` etc. Strip the trailing `.txt` from all six files after unzipping (they are suffixed only so they do not collide with the originals in the source project).
- `assets/` — icons, logos, illustrations, patterns
- `preview/` — the design-system tab cards (colors, type, spacing, radii, shadows, buttons, inputs, badges, cards, icons, logo, illustration)
- `thumbnail.html` — project tile
- `README.md` / `SKILL.md` — usage guidance

## Deliberately excluded
- The Pass Revise "Volt" violet theme (`pass-revise-theme.css`) and its preview card — primary here is Pass heritage green.
- All prototypes, handoff packages and Tailwind/Flowbite exports from the source project.
- `_ds_bundle.js`, `_ds_manifest.json`, `_adherence.oxlintrc.json` — these are generated, do not copy them.
