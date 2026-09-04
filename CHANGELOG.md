# Changelog

## Unreleased
- **feat**: synced the shared `icons.tsx` (now 64 icons) and replaced the
  remaining decorative emoji — the intro screen's 🤝 empty-state hero is now
  `TeamIcon` (`HandshakeIcon`, which this app used, was retired from the
  shared set with no other consumers), and the working-agreements upvote
  button's 👍 glyph is now `ThumbsUpIcon`. The `agreements.upvote` i18n key
  held only "👍" with no translatable text, so it's now a real word
  ("Upvote"/"Apoyar"/"Падтрымаць"/"Поддержать") used as the button's
  `aria-label`/`title` instead. The Identity Symbols catalog
  (`data/symbols.ts`) and the `values.custom_placeholder` "🚀" example are
  untouched — they're the product's content, not chrome.
- **ci**: CI Node bumped 20 → 22 and `engines` declared. `jsdom@30` requires
  Node `^22.22.2 || ^24.15.0 || >=26`, so the test step could never have passed
  on the pinned Node 20 — invisible until this release started running the
  tests in CI at all. Builds were unaffected (vite and tsc do not load jsdom).


## 0.3.0 — Publish the shared team object (2026-09-03)

- **feat**: this app now writes `agile-toolkit:activeTeam` when a charter is
  saved. `GOALS.md` names one shared team object as "what holds it together"
  and gives this app the job of producing it — but it never wrote the contract,
  so the Dashboard inferred a team name from `team-identity-charter` instead
  and only Moving Motivators wrote it. Consumers now have a real producer to
  read from.
- **feat**: `ErrorBoundary` at the root, with a scoped "clear this app's saved
  data" recovery path.
- **ci**: `npm test` now runs before `npm run build` in `deploy.yml`.

## 0.2.7 — Facilitator Mode persists across suite apps (2026-09-03)

- **fix**: `FACILITATOR_KEY` changed from `'team-identity:facilitatorMode'`
  to the shared `'agile-toolkit:facilitatorMode'` — user-requested so
  Facilitator Mode survives navigating to another suite app in the same
  tab instead of resetting. Team Identity originated this pattern (later
  promoted to a shared design-system hook other apps use), so it still
  has its own inline constant rather than `useFacilitatorMode.ts`; this
  is the 10th and last repo in the key-unification rollout across the
  suite. sessionStorage is already shared per-origin-per-tab, so only the
  key string needed to change.

## 0.2.6 — Replace decorative ✕/✓ emoji with SVG icons (2026-09-03)

- **feat**: replaced 2 decorative text glyphs (a selected value-tag's
  remove indicator, the charter's agreements-list bullet) with
  `CloseIcon`/`CheckIcon` from the new shared `icons.tsx`. Last app in a
  suite-wide emoji→SVG sweep the user asked for — Team Identity's
  Identity Symbols picker (`data/symbols.ts` and the custom-symbol
  placeholder/input) stays untouched: those emoji are the actual
  selectable data, not decoration, per the app's original design.

## 0.2.5 — Set the missing data-accent="amber" on the app root (2026-09-03)

- **fix (consistency)**: the suite's design-system contract
  (`tokens.css` section 5, `agile-toolkit.github.io`'s dashboard now
  reads it too) documents "amber → Work Profiles / Team Identity" —
  but this app's own root `<div>` never actually set
  `data-accent="amber"`, across all three of its top-level render
  paths (My Teams, Learn, main flow). It silently fell back to the
  cobalt default instead, so the app's own UI (header accents, active
  nav pill, primary buttons) never matched its documented brand color.
  Found while wiring the dashboard's app cards into this same contract.

## 0.2.4 — Normalize LanguagePicker dark shades (2026-09-02)

- **fix (consistency)**: `LanguagePicker.tsx` already had dark-mode
  classes, but on slightly different shades than the design-system's
  canonical copy. Normalized to match exactly, part of a suite-wide
  sweep that found the same component had drifted into 3 different
  shade combinations across repos (and was missing dark mode entirely
  in 5 others).

## 0.2.3 — Confirm before deleting a saved team (2026-09-02)

- **fix**: "My Teams" library's Delete button had no confirmation —
  one accidental click permanently removed a saved charter. Added a
  confirm dialog, matching the pattern used for destructive actions
  elsewhere in the suite.
- Found via a suite-wide UX audit.

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
