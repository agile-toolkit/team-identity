# Changelog

## Unreleased

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
