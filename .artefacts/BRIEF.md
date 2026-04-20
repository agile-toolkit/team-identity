# Team Identity — Brief

## Overview

Workshop flow for team name, symbol, values, and working agreements (Identity Symbols / Work Expo). React 18, Vite, Tailwind, react-i18next; README mentions Firebase for future sync. Deploy: GitHub Pages.

## Features

- [x] Multi-step workshop — intro, name, symbol, values, agreements, charter preview (`App.tsx`)
- [x] EN + RU strings for main steps
- [x] Charter preview headings — `charter.team_name_fallback` i18n key added; `'Our Team'` literal removed
- [x] Agreement remove control — uses `t('agreements.delete')` instead of hardcoded `✕`
- [x] Back/Next navigation — replaced inline language checks with `t('common.back')` / `t('common.next')`

## Backlog

## Tech notes

- Firebase mentioned in `README.md` for collaboration; verify env when enabling.

## Agent Log

### 2026-04-20 — feat: complete i18n for agreements, charter, and navigation
- Done: `t('agreements.delete')` replaces `✕` on agreement remove button; `charter.team_name_fallback` key added (EN: "Our Team", RU: "Наша команда") replaces hardcoded literal; `common.back`/`common.next` keys added and all inline `i18n.language.startsWith` checks in Back/Next buttons replaced with `t()` calls
- All BRIEF features now implemented
- Next task: check needs-review issues for human feedback; run research cycle for market/integration/UX improvements

### 2026-04-19 — docs: BRIEF template (AGENT_AUTONOMOUS)

- Done: Template migration; noted i18n gaps.
- Next task: Replace `✕` with `t('agreements.delete')` in `App.tsx`; add `charter.preview_fallback` (or wire `charter.team_name` / `symbol_title`) and remove `Our Team` literal.
