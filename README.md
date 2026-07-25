# Team Identity

A guided, single-session workshop tool based on Management 3.0's Identity Symbols and Work Expo practices. A facilitator walks a team through naming themselves, picking a symbol, selecting shared values, and agreeing on working norms, then leaves with a shareable team charter — no account, no backend. Available in EN/ES/BE/RU.

Part of the [Agile Tools](https://github.com/bthos) suite built on Management 3.0 and ICAgile source materials.

See `GOAL.md` for why this app exists and `ROADMAP.md` for what's shipped and what's next.

## Stack
React 18 · TypeScript · Vite · Tailwind CSS · react-i18next (EN/ES/BE/RU)

## Dev commands
```bash
npm install      # install dependencies
npm run dev       # start Vite dev server
npm run build      # type-check (tsc) then production build
npm run preview     # preview the production build locally
```
There is no test script yet — see `ROADMAP.md` E1 (Vitest coverage, issue #40).

## Deploy
GitHub Pages via GitHub Actions on push to `main`.

## localStorage keys

| Key | Shape | Purpose |
|-----|-------|---------|
| `team-identity-charter` | `TeamCharter` object + `savedAt` timestamp | Full active charter — the source of truth on load |
| `team-identity:lastSession` | `{teamName, symbol, valuesCount, agreementsCount, membersCount, savedAt}` | Dashboard summary card for agile-toolkit.github.io |
| `team-identity:draft` | `{charter, step, savedAt}` | In-progress workshop state, written on every step transition; cleared on save or discard |
| `team-identity:charters` | `Array<SavedCharter>` (max 20, newest first) | Multi-team charter library ("My Teams") |
| `team-identity:history` | `Array<HistoryEntry>` (max 10, newest first) | Version history per save, used for the diff/compare panel |
| `team-identity:facilitatorMode` (sessionStorage) | boolean flag | Facilitator/projector display mode, resets per tab session |

Team Identity also *reads* (never writes) two keys owned by sibling apps: `moving-motivators:lastSession` (top-3 ranked motivators, offered as suggested values) and `work-profiles-data` (active participant names, offered as importable team members).

## Tech notes
- **State management** — a single `App.tsx` component owns all workshop state and step routing (`step` string gates 8 conditional render branches); no external state library. This is a known scaling issue — see `ROADMAP.md` E3 (issue #42) for the planned per-screen component split.
- **i18n** — `react-i18next` with 4 static JSON locale files (`src/i18n/{en,es,be,ru}.json`), all registered in `src/i18n/index.ts`. No translation is fetched at runtime.
- **Theme** — dark mode uses Tailwind's `darkMode: ['selector', '[data-theme="dark"]']` convention (shared across the suite). An inline anti-flash script in `index.html` sets `data-theme` on `<html>` before first paint, reading `localStorage.theme` or `prefers-color-scheme`. The branded gradient charter card is intentionally left theme-invariant (self-contained white-on-brand design).
- **Charter sharing** — image export uses `html2canvas`, dynamically imported inside the "Copy Image" handler (not a static import) so its ~200 kB weight only loads on click. URL sharing base64-encodes the charter JSON into `location.hash`; decoded and hydrated on mount, then the hash is cleared.
- **Print** — a dedicated `@media print` block in `src/index.css` hides chrome (header, nav, buttons) and strips the charter card's gradient/shadow for a clean printout; `document.title` is set dynamically to `"[TeamName] — Team Charter"` while on the charter step.
- **Firebase** is referenced as a future collaboration backend but is not wired up anywhere in `src/` — treat any mention as aspirational, not implemented.

## Source materials
See `.artefacts/BRIEF.md` for the full run-by-run agent history and source file references.
