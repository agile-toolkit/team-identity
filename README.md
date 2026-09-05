# Team Identity

A guided, single-session workshop tool based on the Identity Symbols and Work Expo practices. A facilitator walks a team through naming themselves, picking a symbol, selecting shared values, and agreeing on working norms, then leaves with a shareable team charter — no account, no backend. Available in EN/ES/BE/RU.

Part of the [Agile Tools](https://github.com/bthos) suite built on ICAgile source materials.

See `GOAL.md` for why this app exists and `ROADMAP.md` for what's shipped and what's next.

## Stack
React 18 · TypeScript · Vite · Tailwind CSS · react-i18next (EN/ES/BE/RU)

## Dev commands
```bash
npm install      # install dependencies
npm run dev       # start Vite dev server
npm run build      # type-check (tsc) then production build
npm run preview     # preview the production build locally
npm test            # vitest run — App.tsx's pure storage/derived-data functions
```

## Deploy
GitHub Pages via GitHub Actions on push to `main`.

## localStorage keys

| Key | Shape | Purpose |
|-----|-------|---------|
| `team-identity-charter` | `TeamCharter` object + `savedAt` timestamp | Full active charter — the source of truth on load |
| `team-identity:lastSession` | `{teamName, symbol, valuesCount, agreementsCount, membersCount, savedAt}` | Dashboard summary card for agile-toolkit.github.io |
| `team-identity:draft` | `{charter, step, savedAt}` | In-progress workshop state, written on every step transition; cleared on save or discard |
| `team-identity:charters` | `Array<SavedCharter>` (max 20, newest first) | Multi-team charter library ("My Teams"). Exportable/importable as JSON from the My Teams screen — import skips duplicates by `id` and respects the 20-item cap. |
| `team-identity:history` | `Array<HistoryEntry>` (max 10, newest first) | Version history per save, used for the diff/compare panel |
| `team-identity:facilitatorMode` (sessionStorage) | boolean flag | Facilitator/projector display mode, resets per tab session |

Team Identity also *reads* (never writes) two keys owned by sibling apps: `moving-motivators:lastSession` (top-3 ranked motivators, offered as suggested values) and `work-profiles-data` (active participant names, offered as importable team members).

## Tech notes
- **State management** — `App.tsx` owns all workshop state and step routing (`step` string gates which screen renders); no external state library. Each screen is a presentational component under `src/components/screens/` (`IntroScreen`, `NameStep`, `SymbolStep`, `ValuesStep`, `AgreementsStep`, `CharterScreen`, `MyTeamsScreen`, `LearnScreen`), taking the charter/step state plus the handful of callbacks it needs as props — a split shipped for issue #42, presentational only, no state-management rewrite. The charter-history compare panel is its own `src/components/HistoryPanel.tsx`. Pure, storage-free logic (charter diffing, base64 hash encode/decode, library merge/cap, localStorage read/write helpers) lives in `src/charterLogic.ts`, imported by both `App.tsx` and the screens that need it, avoiding a circular import between `App.tsx` and `HistoryPanel.tsx`.
- **i18n** — `react-i18next` with 4 static JSON locale files (`src/i18n/{en,es,be,ru}.json`), all registered in `src/i18n/index.ts`. No translation is fetched at runtime.
- **Theme** — dark mode uses Tailwind's `darkMode: ['selector', '[data-theme="dark"]']` convention (shared across the suite). An inline anti-flash script in `index.html` sets `data-theme` on `<html>` before first paint, reading `localStorage.theme` or `prefers-color-scheme`. The branded gradient charter card is intentionally left theme-invariant (self-contained white-on-brand design).
- **Charter sharing** — image export uses `html2canvas`, dynamically imported inside the "Copy Image" handler (not a static import) so its ~200 kB weight only loads on click. URL sharing base64-encodes the charter JSON into `location.hash`; decoded and hydrated on mount, then the hash is cleared.
- **Test coverage** — `src/App.test.ts` covers `src/charterLogic.ts`'s pure functions (re-exported from `App.tsx` for backward compatibility): the module-level storage functions (`loadCharters`/`loadHistory`, including corrupted-storage recovery), the cross-app readers (`readWpParticipants`/`readMmTopMotivators`), `defaultCharter`, `scrumValuesCovered`, the charter share-link `encodeCharterHash`/`decodeCharterHash` round-trip (plus invalid-input cases), `mergeIntoLibrary`'s dedupe-by-id/cap/eviction behavior, and `diffCharterFields`'s added/removed/kept value and agreement sets. Fulfills issue #40's full scope.
- **Print** — a dedicated `@media print` block in `src/index.css` hides chrome (header, nav, buttons) and strips the charter card's gradient/shadow for a clean printout; `document.title` is set dynamically to `"[TeamName] — Team Charter"` while on the charter step.
- **Firebase** is referenced as a future collaboration backend but is not wired up anywhere in `src/` — treat any mention as aspirational, not implemented.
- **Charter library backup** — Export/Import on the My Teams screen (`exportLibrary`/`importLibrary` in `App.tsx`) serialize `team-identity:charters` to/from a downloadable `.json` file, using the same `Blob` + anchor-click pattern the CSV/image exports use elsewhere in the suite. Import validates each entry's shape independently (skips malformed items rather than rejecting the whole file), skips duplicates by `id` (existing entry wins), and silently caps additions at the 20-item library limit — reported back to the user as "N imported / N duplicates skipped / N skipped (library full)".

## Source materials
See `.artefacts/BRIEF.md` for the full run-by-run agent history and source file references.
