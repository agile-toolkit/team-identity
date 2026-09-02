# Team Identity — Roadmap

Derived from GOAL.md. Rebuilt when GOAL changes or an epic ships.

## Current epic
None — idle. See `## Next epics` below.

## Next epics
1. **E1: Vitest coverage for charter logic** — serves signal #1 (reliability of the charter artefact). No test files or test runner exist yet; the app has accumulated non-trivial pure logic (charter history diffing, Scrum-values coverage counting, library 20-item cap/eviction, base64 URL-hash encode/decode) with zero regression protection. [#40](https://github.com/agile-toolkit/team-identity/issues/40) — `needs-review`, well past the 7-day staleness threshold.
2. **E3: Decompose App.tsx into per-screen components** — serves ongoing maintainability, not a numbered success criterion directly. `src/App.tsx` has grown past 1000 lines across many feature cycles with no screen-level extraction beyond `AppHeader`/`LanguagePicker`/`ThemeToggle`. [#42](https://github.com/agile-toolkit/team-identity/issues/42) — `needs-review`, well past the 7-day staleness threshold.

## Recently shipped
**E2: Charter library JSON export/import** (2026-09-02) — see `## Shipped`. [#41](https://github.com/agile-toolkit/team-identity/issues/41)

## Polish backlog
- None filed with no issue — all known small items are tracked as GitHub issues above.

## Shipped
- ~~Core workshop flow (intro → name → symbol → values → agreements → charter) in EN/RU~~
- ~~Full 4-locale suite parity — ES + BE added, 4-way language switcher~~
- ~~Charter persistence: draft auto-save/resume, multi-team library (Save/Load/Rename/Delete, capped at 20), version history with side-by-side diff (capped at 10)~~
- ~~Charter sharing: PNG image export (html2canvas), base64 URL deep-link, print-optimized `@media print` layout~~
- ~~Cross-app integrations: Moving Motivators top-motivators import, Work Profiles participant import, Dashboard summary key (`team-identity:lastSession`)~~
- ~~Facilitator/projector display mode for in-room workshops~~
- ~~Scrum values alignment overlay (badges + coverage row) on the charter~~
- ~~Keyboard accessibility for symbol/values grids (ARIA roles, roving tabindex)~~
- ~~Suite design-system adoption: unified `AppHeader`, light/dark theme with anti-flash script~~
- ~~Main bundle size reduction — code-split `html2canvas` into a lazy chunk (461.76 kB → 259.91 kB)~~

**v0.2.0 — [E2: Charter library JSON export/import](https://github.com/agile-toolkit/team-identity/issues/41)** (2026-09-02):
- ~~Export "My Teams" library as a downloadable `.json` file~~
- ~~Import from a `.json` file, skipping duplicates by `id` and respecting
  the 20-item cap, with an inline result message~~

Not carried into Next epics: [#8](https://github.com/agile-toolkit/team-identity/issues/8), [#16](https://github.com/agile-toolkit/team-identity/issues/16), [#18](https://github.com/agile-toolkit/team-identity/issues/18), and [#43](https://github.com/agile-toolkit/team-identity/issues/43) are all "team context banner" integrations scoped entirely to *other* repos (scrum-facilitator, planning-poker, sprint-metrics, change-planner, improvement-board, kanban-designer, work-profiles, salary-formula) — Team Identity's write side (`team-identity-charter`) already exists and needs no further change. All four closed as completed in this repo's issue cleanup — see the 2026-09-02 commit.

## Repo cleanup (2026-09-02)
Closed 17 stale `approved`/`needs-review` issues (#3–#21, plus #43) that
were already implemented or, for the four team-context-banner issues, need
no further work in this repo — confirmed against source and this file's own
`## Shipped` section before closing.
