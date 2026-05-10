# Team Identity — Brief

## Overview

Workshop flow for team name, symbol, values, and working agreements (Identity Symbols / Work Expo). React 18, Vite, Tailwind, react-i18next; README mentions Firebase for future sync. Deploy: GitHub Pages.

## Features

- [x] Multi-step workshop — intro, name, symbol, values, agreements, charter preview (`App.tsx`)
- [x] EN + RU strings for main steps
- [x] Charter preview headings — `charter.team_name_fallback` i18n key added; `'Our Team'` literal removed
- [x] Agreement remove control — uses `t('agreements.delete')` instead of hardcoded `✕`
- [x] Back/Next navigation — replaced inline language checks with `t('common.back')` / `t('common.next')`
- [x] ES + BE locale support — `es.json` and `be.json` added; `i18n/index.ts` registers all 4 locales; header language switcher upgraded from binary EN/RU toggle to 4-way `<select>` (EN / ES / BE / RU)

## localStorage keys

| Key | Written by | Content |
|-----|-----------|---------|
| `team-identity-charter` | `App.tsx` `saveCharter()` | Full `TeamCharter` object + `savedAt` timestamp |
| `team-identity:lastSession` | _planned_ (issue #10) | Dashboard summary: `{teamName, symbol, valuesCount, agreementsCount, savedAt}` |

## Backlog

<!-- Issues awaiting human review; agent appends here during research runs -->
- [x] [#3] Feature: ES + BE locale support (suite standard) — implemented
- [ ] [#4] Feature: Charter image export (html2canvas)
- [ ] [#5] Integration: Moving Motivators → Team Identity (import motivators as values)
- [ ] [#6] Integration: Work Profiles → Team Identity (participant import via localStorage)
- [ ] [#7] Feature: Charter deep-link sharing via URL hash (base64, clipboard copy, QR optional)
- [ ] [#8] Integration: Team Identity → Scrum Facilitator (team context banner — implementation in scrum-facilitator repo)
- [ ] [#10] Feature: Dashboard card integration (write `team-identity:lastSession` on save; update dashboard reader)
- [ ] [#11] Feature: Print-optimized charter layout (`@media print` CSS, hide nav, white background)
- [ ] [#12] Feature: Keyboard accessibility for symbol grid and values selection (arrow-key nav, ARIA roles)

## Tech notes

- Firebase mentioned in `README.md` for collaboration; verify env when enabling.
- GitHub Project #13 created for this repo (project ID: `PVT_kwDOEGuPAc4BXTDB`).

## Agent Log

### 2026-05-10 — research: dashboard integration, print UX, accessibility
- Done: created GitHub Project #13 for team-identity; added all open issues (#3–#8) to project; created issues #10 (dashboard localStorage key), #11 (print-optimized CSS), #12 (keyboard accessibility); all three set to Backlog in project
- Issue #3 confirmed implemented — set to In Progress (In Review proxy) in project
- Issue #8 approved but scoped entirely to scrum-facilitator; no code changes needed in team-identity; set to In Progress in project as team-identity's obligation is complete
- Added `## localStorage keys` section documenting `team-identity-charter` and planned `team-identity:lastSession`
- Next task: check issues for human feedback; implement first approved item — #10 (write `team-identity:lastSession` in `App.tsx` `saveCharter()`, update dashboard) or #11 (add `@media print` block in `src/index.css`, hide nav, white charter background) or #12 (keyboard nav for symbol/values grids)

### 2026-05-08 — feat: ES + BE locale support (issue #3)
- Done: created `src/i18n/es.json` (Spanish) and `src/i18n/be.json` (Belarusian) with full translations of all keys; registered both in `src/i18n/index.ts`; replaced binary EN/RU toggle in both header instances with a 4-way `<select>` dropdown (EN / ES / BE / RU)
- Issue #3 fully implemented; set to In Review
- Issue #8 (Scrum Facilitator banner) is approved but scoped to scrum-facilitator repo — to be picked up in that repo's next run
- Next task: implement #4 (charter image export via html2canvas; `id="charter-card"` already present) if approved; else check issues for human feedback

### 2026-04-27 — research: integration + UX opportunities
- Done: created issue #6 (Work Profiles → Team Identity participant import via localStorage), #7 (charter URL deep-link sharing via base64 URL hash + clipboard), #8 (Team Identity → Scrum Facilitator team context banner — implementation lives in scrum-facilitator repo)
- Issues #3–#5 remain in needs-review; no human feedback yet
- Next task: check needs-review issues for human feedback (#3 ES+BE locales, #4 charter image export, #5 Moving Motivators integration, #6 Work Profiles participant import, #7 URL sharing, #8 Scrum Facilitator banner)

### 2026-04-25 — research: market + integration opportunities
- Done: created issue #3 (ES+BE locales — suite standard gap), #4 (charter image export via html2canvas; charter card already has `id="charter-card"`), #5 (Moving Motivators → Team Identity motivator import at values step)
- Waiting for human review on all three
- Next task: check needs-review issues for human feedback (#3 ES+BE locales, #4 charter image export, #5 Moving Motivators integration)

### 2026-04-20 — feat: complete i18n for agreements, charter, and navigation
- Done: `t('agreements.delete')` replaces `✕` on agreement remove button; `charter.team_name_fallback` key added (EN: "Our Team", RU: "Наша команда") replaces hardcoded literal; `common.back`/`common.next` keys added and all inline `i18n.language.startsWith` checks in Back/Next buttons replaced with `t()` calls
- All BRIEF features now implemented
- Next task: check needs-review issues for human feedback; run research cycle for market/integration/UX improvements

### 2026-04-19 — docs: BRIEF template (AGENT_AUTONOMOUS)

- Done: Template migration; noted i18n gaps.
- Next task: Replace `✕` with `t('agreements.delete')` in `App.tsx`; add `charter.preview_fallback` (or wire `charter.team_name` / `symbol_title`) and remove `Our Team` literal.
