# Pass Learning Portal — UI Kit

A click-through recreation of the Pass authenticated learner/tutor app.

## Demo flow

1. **Dashboard** (landing) — tutor view with welcome strip, stat tiles, active courses, upcoming agenda, "Powered by Pass" callout.
2. Click any course → **Course detail** with topic list + AI tutor chat panel.
3. Click the mock topic at the bottom of the topic list → **Mock exam result** (AI-marked feedback with topic breakdown).
4. Use the sidebar to switch between sections.

## Files

- `index.html` — entry point, does routing between the three screens.
- `Sidebar.jsx` — 256px left nav with three sections (Learn / Teach / Account) + user chip.
- `Topbar.jsx` — 64-80px top bar with breadcrumbs, title, search, bell + help.
- `Dashboard.jsx` — tutor home view.
- `Course.jsx` — course detail with progress ring and AI tutor side panel.
- `MockResult.jsx` — AI-marked mock feedback with topic breakdown.
- `Icon.jsx` — shared icon component that loads from `/assets/icons/` with Lucide CDN fallback.

## Tokens

All tokens come from `../../colors_and_type.css`. Any inline style values match the CSS variables there — e.g. `#0F8610` = `--pass-green-700`.

## Caveats

- Not production code — stateful routing is intentionally minimal (no react-router).
- No real auth, API calls, or persistence.
- The AI tutor panel is mocked — it doesn't call `window.claude`.
