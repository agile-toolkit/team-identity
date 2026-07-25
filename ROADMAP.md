# Team Identity — Roadmap

Derived from GOAL.md. Rebuilt when GOAL changes or an epic ships.

## Current epic
None — idle. See `## Next epics` below.

## Next epics
1. **E1: Vitest coverage for charter logic** — serves #2. No test files or test runner exist yet; the app has accumulated non-trivial pure logic (charter history diffing, Scrum-values coverage counting, library 20-item cap/eviction, base64 URL-hash encode/decode) with zero regression protection. [#40](https://github.com/agile-toolkit/team-identity/issues/40) — filed 2026-07-08, `needs-review`, 17 days past the 7-day staleness threshold.
2. **E2: Charter library JSON export/import** — serves #4. `team-identity:charters` (up to 20 saved teams) and `team-identity:history` live only in the browser that created them; clearing site data or switching devices silently loses everything. [#41](https://github.com/agile-toolkit/team-identity/issues/41) — filed 2026-07-08, `needs-review`, 17 days past the 7-day staleness threshold.
3. **E3: Decompose App.tsx into per-screen components** — serves ongoing maintainability, not a numbered success criterion directly. `src/App.tsx` has grown to 1017 lines across 10 feature cycles with no screen-level extraction beyond `AppHeader`/`LanguagePicker`/`ThemeToggle`. [#42](https://github.com/agile-toolkit/team-identity/issues/42) — filed 2026-07-11, `needs-review`, 14 days past the 7-day staleness threshold.

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

Not carried into Next epics: [#8](https://github.com/agile-toolkit/team-identity/issues/8), [#16](https://github.com/agile-toolkit/team-identity/issues/16), [#18](https://github.com/agile-toolkit/team-identity/issues/18), and [#43](https://github.com/agile-toolkit/team-identity/issues/43) are all "team context banner" integrations scoped entirely to *other* repos (scrum-facilitator, planning-poker, sprint-metrics, change-planner, improvement-board, kanban-designer, work-profiles, salary-formula) — Team Identity's write side (`team-identity-charter`) already exists and needs no further change.
