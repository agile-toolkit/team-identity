# Team Identity — Roadmap

Derived from GOAL.md. Rebuilt when GOAL changes or an epic ships.

## Current epic
None — idle. See `## Next epics` below.

## Next epics
1. **E1 remainder: Vitest coverage for charter logic** — serves signal #1 (reliability of the charter artefact). A first pass now covers the storage-layer functions and Scrum-values coverage counting (see Recently shipped); still untested: charter history diffing and base64 URL-hash encode/decode, both currently inline in `App.tsx`'s JSX/render logic rather than standalone functions — extracting them is naturally paired with E3's decomposition below. [#40](https://github.com/agile-toolkit/team-identity/issues/40) — `needs-review`, well past the 7-day staleness threshold.
2. **E3: Decompose App.tsx into per-screen components** — serves ongoing maintainability, not a numbered success criterion directly. `src/App.tsx` has grown past 1000 lines across many feature cycles with no screen-level extraction beyond `AppHeader`/`LanguagePicker`/`ThemeToggle`. [#42](https://github.com/agile-toolkit/team-identity/issues/42) — `needs-review`, well past the 7-day staleness threshold.

## Recently shipped
**Add glass effect to the header** (2026-09-04) — see `## Shipped`. `AppHeader.tsx`'s background changed to a translucent blur, matching the Dashboard's own nav — user-reported inconsistency.

**Facilitator Mode persists across suite apps** (2026-09-03) — see `## Shipped`. `FACILITATOR_KEY` changed to the shared `agile-toolkit:facilitatorMode` so the mode survives switching to another suite app in the same tab, per direct user request — 10th and last repo in this rollout.

**Replace decorative ✕/✓ emoji with SVG icons** (2026-09-03) — see `## Shipped`. Last app in a suite-wide emoji→SVG sweep the user asked for — the Identity Symbols picker's emoji stay untouched, they're functional selectable data, not decoration.

**Set the missing `data-accent="amber"` on the app root** (2026-09-03) — see `## Shipped`. The design-system contract has documented "amber → Work Profiles / Team Identity" for a while, but this app never actually set it — silently fell back to cobalt everywhere. Found while wiring the dashboard's app cards into the same per-app accent contract.

**Normalize LanguagePicker dark shades** (2026-09-02) — see `## Shipped`. `LanguagePicker.tsx` had dark-mode classes on slightly different shades than the design-system's canonical copy. Normalized to match exactly.

**Confirm before deleting a saved team** (2026-09-02) — see `## Shipped`. A suite-wide UX audit found "My Teams"' Delete button had no confirmation. Added one, matching the pattern used for destructive actions elsewhere in the suite.

**Fix: header nav ordering + E1 (partial): storage-layer test coverage** (2026-09-02) — see `## Shipped`. A suite-wide UX audit found the "About Team Identity" link rendered after the language picker/theme toggle instead of before, unlike every sibling app's header convention — it was passed as a `children` slot item instead of via `navItems`. Fixed, and added this repo's first automated tests along the way.

**E2: Charter library JSON export/import** (2026-09-02) — see `## Shipped`. [#41](https://github.com/agile-toolkit/team-identity/issues/41)

## Polish backlog
- None filed with no issue — all known small items are tracked as GitHub issues above.

## Shipped
- ~~Add glass/backdrop-blur effect to the header, matching the Dashboard's own nav~~
- ~~Unify Facilitator Mode's storage key to the shared `agile-toolkit:facilitatorMode` so it persists across suite apps~~
- ~~Replace decorative ✕/✓ text-glyph indicators with shared SVG icons~~
- ~~Set `data-accent="amber"` on the app root, matching the design-system's own documented contract~~
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

**v0.2.1 — Fix header nav ordering; E1 (partial): storage-layer tests** (2026-09-02):
- ~~"About Team Identity" now renders as a nav pill before the language
  picker, matching every sibling app's header convention~~
- ~~Added `vitest` + `jsdom`; covers `loadCharters`/`loadHistory`,
  `readWpParticipants`/`readMmTopMotivators`, `defaultCharter`, and the
  newly-extracted `scrumValuesCovered`~~

**v0.2.3 — Confirm before deleting a saved team** (2026-09-02):
- ~~Added a confirm dialog to "My Teams"' Delete button~~

**v0.2.4 — Normalize LanguagePicker dark shades** (2026-09-02):
- ~~Synced `LanguagePicker.tsx`'s dark-mode shades exactly with the
  design-system's canonical copy~~

Not carried into Next epics: [#8](https://github.com/agile-toolkit/team-identity/issues/8), [#16](https://github.com/agile-toolkit/team-identity/issues/16), [#18](https://github.com/agile-toolkit/team-identity/issues/18), and [#43](https://github.com/agile-toolkit/team-identity/issues/43) are all "team context banner" integrations scoped entirely to *other* repos (scrum-facilitator, planning-poker, sprint-metrics, change-planner, improvement-board, kanban-designer, work-profiles, salary-formula) — Team Identity's write side (`team-identity-charter`) already exists and needs no further change. All four closed as completed in this repo's issue cleanup — see the 2026-09-02 commit.

## Repo cleanup (2026-09-02)
Closed 17 stale `approved`/`needs-review` issues (#3–#21, plus #43) that
were already implemented or, for the four team-context-banner issues, need
no further work in this repo — confirmed against source and this file's own
`## Shipped` section before closing.
