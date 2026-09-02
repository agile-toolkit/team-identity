# Changelog

## Unreleased

## 0.2.2 — Remove Management 3.0 references; fix invisible brand colors (2026-09-02)

- **content**: removed "Management 3.0" text from the intro workshop
  copy, the Learn page's "why" section, and `README.md` — reworded to
  reference the Identity Symbols/Work Expo practices directly rather
  than the framework brand. All 4 locales updated.
- **fix**: `brand-200`/`brand-300`/`brand-800`/`brand-900` were
  referenced but never defined in `tailwind.config.js` — invisible
  borders/backgrounds/text in both light and dark mode. Same class of
  bug found and fixed across several repos this session. Completed the
  `brand` scale with Tailwind's own `sky` values.

## 0.2.1 — Fix header nav ordering; E1 (partial): storage-layer tests (2026-09-02)

- **fix**: "About Team Identity" rendered after the language picker and
  theme toggle instead of before them — found during a suite-wide UX
  audit comparing headers across all 11 apps. It was passed through
  `AppHeader`'s `children` slot instead of `navItems`, so it landed after
  the `LanguagePicker` render instead of before it, unlike every sibling
  app. Now uses `navItems`, both on the main flow and the Learn screen
  (where it also now shows as the active tab).
- **test**: added `vitest` + `jsdom` (this repo's first automated test
  coverage — partial E1/#40). Covers `loadCharters`/`loadHistory`
  (including corrupted-storage recovery), the cross-app readers
  `readWpParticipants`/`readMmTopMotivators`, `defaultCharter`, and
  `scrumValuesCovered` — extracted from an inline JSX computation in the
  charter's Scrum-alignment badge row so it could be tested directly.
  Charter history diffing and the base64 URL-hash encode/decode remain
  untested; both are still inline rather than standalone functions.
  `npm test` now passes cleanly: 1 file, 16 tests.

## 0.2.0 — E2: Charter library JSON export/import (2026-09-02)

- **feat**: "Export"/"Import" buttons on the My Teams screen. Export
  downloads the full charter library (`team-identity:charters`) as
  `team-charters-export-<date>.json`; Import reads a `.json` file back in,
  validates each entry's shape independently (malformed items are skipped,
  not the whole file), skips duplicates by `id` (existing entry wins),
  respects the 20-item library cap, and shows an inline result message
  ("Imported N teams. N duplicates skipped."). Closes a gap issue #14 left
  open: clearing site data or switching devices previously lost a team's
  entire saved library with no way to back it up. i18n:
  `teams.export`/`teams.import`/`teams.import_success`/
  `teams.import_duplicates`/`teams.import_cap_skipped`/`teams.import_invalid`
  in EN/ES/BE/RU.
- **docs**: refresh `GOAL.md` from the suite-wide `GOALS.md` platform
  thesis and rebuild `ROADMAP.md` around it.
- **chore**: closed 17 stale GitHub issues that were already implemented
  or needed no further work in this repo — no functional change, repo
  housekeeping only.
- Docs-only pass: added `.artefacts/GOAL.md` and `.artefacts/ROADMAP.md`, filled in `README.md` with dev commands, localStorage keys, and tech notes, and created this changelog. No behavior change — documents existing functionality that previously only lived in `.artefacts/BRIEF.md`.
- docs: move GOAL.md and ROADMAP.md from .artefacts/ to the repo root.
