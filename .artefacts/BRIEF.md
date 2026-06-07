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
- [x] Dashboard localStorage key — `saveCharter()` writes `team-identity:lastSession` with `{teamName, symbol, valuesCount, agreementsCount, savedAt}` for Dashboard card integration (#10)
- [x] Charter image export (#4) — "Copy Image" button on charter step using html2canvas; clipboard write with download fallback; `charter.share` i18n key in all 4 locales — `saveCharter()` writes `team-identity:lastSession` with `{teamName, symbol, valuesCount, agreementsCount, savedAt}` for Dashboard card integration (#10)
- [x] Moving Motivators integration (#5) — on values step, reads `moving-motivators:lastSession` from localStorage; if present shows dismissible amber banner; "Import" adds top 3 ranked motivators as values with "MM" badge; i18n keys `values.import_mm_banner/import/dismiss/from_mm` in EN/ES/BE/RU
- [x] Work Profiles participant import (#6) — on charter step, reads `work-profiles-data` from localStorage; "Import Participants" button appears when WP data present and no members imported yet; imported names shown as pill tags in "Team Members" section between symbol and values on charter card; `TeamCharter.members?: string[]` field added; `membersCount` included in `team-identity:lastSession` key; i18n keys `charter.members_title/import_wp` in EN/ES/BE/RU
- [x] Draft auto-save (#17) — `writeDraft()` called on every `next()`/`back()` transition, saves `{charter, step, savedAt}` to `team-identity:draft`; on mount, banner shown if draft is newer than saved charter; "Resume" restores charter+step, "Discard" clears draft; `saveCharter()` and "Start Over" both clear the draft key; i18n keys `draft.resume_prompt/resume/discard` in EN/ES/BE/RU

## localStorage keys

| Key | Written by | Content |
|-----|-----------|---------|
| `team-identity-charter` | `App.tsx` `saveCharter()` | Full `TeamCharter` object + `savedAt` timestamp |
| `team-identity:lastSession` | `App.tsx` `saveCharter()` | Dashboard summary: `{teamName, symbol, valuesCount, agreementsCount, membersCount, savedAt}` |
| `team-identity:draft` | `App.tsx` `writeDraft()` | In-progress session: `{charter, step, savedAt}`; cleared on save or discard |

## Backlog

<!-- Issues awaiting human review; agent appends here during research runs -->
- [x] [#3] Feature: ES + BE locale support (suite standard) — implemented
- [x] [#4] Feature: Charter image export (html2canvas) — implemented
- [x] [#5] Integration: Moving Motivators → Team Identity (import motivators as values) — implemented
- [x] [#6] Integration: Work Profiles → Team Identity (participant import via localStorage)
- [ ] [#7] Feature: Charter deep-link sharing via URL hash (base64, clipboard copy, QR optional)
- [ ] [#8] Integration: Team Identity → Scrum Facilitator (team context banner — implementation in scrum-facilitator repo)
- [x] [#10] Feature: Dashboard card integration (write `team-identity:lastSession` on save; update dashboard reader)
- [ ] [#11] Feature: Print-optimized charter layout (`@media print` CSS, hide nav, white background)
- [ ] [#12] Feature: Keyboard accessibility for symbol grid and values selection (arrow-key nav, ARIA roles)
- [ ] [#14] Research: Charter history and version comparison (store array of versioned charters, diff view)
- [ ] [#15] Research: Scrum values alignment layer in the values step (map values to Scrum/Agile principles)
- [ ] [#16] Integration: Team Identity → Planning Poker + Sprint Metrics (team context banner, scoped to those repos)
- [x] [#17] Feature: Draft auto-save between workshop steps (write team-identity:draft on step transitions; resume banner on mount)
- [ ] [#18] Integration: Change Planner — read team-identity-charter to pre-fill team context in change scenarios (scoped to change-planner repo)
- [ ] [#19] UX: Facilitator/projector display mode — CSS class toggle for larger text and cards on projected displays

## Tech notes

- Firebase mentioned in `README.md` for collaboration; verify env when enabling.
- GitHub Project #13 created for this repo (project ID: `PVT_kwDOEGuPAc4BXTDB`).

## Agent Log

### 2026-06-07 — feat: Draft auto-save between workshop steps (issue #17)
- Done: added `DRAFT_KEY = 'team-identity:draft'` constant; `loadDraft()` helper; `writeDraft(charter, step)` called in `next()`/`back()` on every step transition; mount effect checks draft vs saved charter timestamp and sets `showDraftBanner`; dismissible blue banner on intro step with "Resume" (restores charter+step) and "Discard" (clears key) buttons; `saveCharter()` and "Start Over" both call `localStorage.removeItem(DRAFT_KEY)`; i18n keys `draft.resume_prompt`, `draft.resume`, `draft.discard` added in EN/ES/BE/RU
- Issue #17 fully implemented; setting to In Review
- Next task: check issues for human feedback; implement next approved item among #7 (URL hash sharing), #12 (keyboard accessibility), #19 (facilitator display mode), #26 (multi-team support)

### 2026-06-03 — feat: Work Profiles participant import (issue #6)
- Done: `readWpParticipants()` reads `work-profiles-data` from localStorage (filters archived); "Import Participants" button on charter step visible only when WP data present and members not yet imported; imports all active participant names as `charter.members`; "Team Members" section added to charter card between symbol/name and values/agreements grid; `TeamCharter.members?: string[]` field added to types; `membersCount` added to `team-identity:lastSession`; i18n keys `charter.members_title` + `charter.import_wp` in EN/ES/BE/RU
- Issue #6 fully implemented; setting to In Review
- Next task: check issues for human feedback

### 2026-05-30 — feat: Moving Motivators integration (issue #5)
- Done: `readMmTopMotivators()` reads `moving-motivators:lastSession` from localStorage at values step; dismissible amber banner with Import/Dismiss buttons; "Import" adds top-3 ranked motivators (capitalized) as values and tracks them for "MM" badge display; 4 i18n keys added in EN/ES/BE/RU (`values.import_mm_banner`, `values.import_mm_import`, `values.import_mm_dismiss`, `values.from_mm`)
- Issue #5 fully implemented; setting to In Review
- Next task: implement #6 (Work Profiles → Team Identity: participant import via localStorage)

### 2026-05-29 — feat: charter image export (issue #4)
- Done: installed `html2canvas`; added `copyImage()` async handler in `App.tsx` (canvas capture → clipboard write → download fallback); added "Copy Image" button beside Print on charter step; added `charter.share` i18n key in EN/ES/BE/RU locale files
- Issue #4 fully implemented; setting to In Review
- Next task: implement #5 (Moving Motivators → Team Identity: import motivators as values; read `moving-motivators:lastSession` from localStorage and offer ranked motivators as selectable values on the values step)

### 2026-05-26 — feat: Dashboard localStorage key (issue #10)
- Done: `saveCharter()` in `App.tsx` now writes `team-identity:lastSession` with `{teamName, symbol, valuesCount, agreementsCount, savedAt}` immediately after the existing `team-identity-charter` write
- Issue #10 team-identity side fully implemented; Dashboard reader update scoped to agile-toolkit.github.io repo
- Next task: in agile-toolkit.github.io, add `readTeamIdentity()` reader function parsing `team-identity:lastSession` and display team name/symbol/counts on the Team Identity dashboard card

### 2026-05-26 — research: checked feedback, transitioning to implement #10
- Done: scanned all open issues; found multiple approved issues (#4, #5, #6, #7, #10, #12, #14, #15, #17, #19)
- Picked #10 (Dashboard card integration: write `team-identity:lastSession` after `saveCharter()`) as the next implementation target; set project status to In Progress
- Next task: in `App.tsx` `saveCharter()`, add `localStorage.setItem('team-identity:lastSession', JSON.stringify({teamName, symbol, valuesCount, agreementsCount, savedAt: Date.now()}))` after the existing `team-identity-charter` write; also update `agile-toolkit.github.io` to add a reader function and card for this key

### 2026-05-22 — fix: repair broken JSX header structure in App.tsx (CI blocker)
- Done: fixed duplicate `<a>` logo link and unclosed `<div>` tags in `showLearn` header; fixed premature `</div></div>` closing tags in main header (lines 133–152); build now passes
- Status restored to stable; blockers cleared
- Next task: check issues for human feedback; implement #10 (write `team-identity:lastSession` in `App.tsx` `saveCharter()`) if approved; implement #11 (print @media CSS) if approved; implement #12 (keyboard a11y) if approved

### 2026-05-17 — research: draft auto-save, Change Planner integration, facilitator mode
- Done: checked open issues — all open issues have needs-review label; #3 implemented, #8 scoped to scrum-facilitator; no actionable approved/incomplete/changes-requested/research-more items
- Created issue #17 (draft auto-save: write team-identity:draft on step transitions; resume banner on mount; prevent data loss in in-person workshops)
- Created issue #18 (Change Planner integration: read team-identity-charter to pre-fill team context; implementation scoped to change-planner repo)
- Created issue #19 (facilitator/projector display mode: CSS class toggle for larger text/cards on projected displays; sessionStorage persistence)
- All three issues set to Backlog in GitHub Project #13
- Next task: check issues for human feedback; implement first approved item among #10 (team-identity:lastSession Dashboard key), #11 (print-optimized @media print CSS), #12 (keyboard a11y for symbol/values grids)

### 2026-05-15 — research: charter history, Scrum values alignment, suite-wide team context
- Done: checked open issues — #3 already implemented, #8 (approved) scoped to scrum-facilitator — no actionable approved items for team-identity; no changes-requested or research-more issues pending
- Created issue #14 (charter history/versioning — store array of versioned charters, diff view)
- Created issue #15 (Scrum values alignment layer — map selected values to Scrum/Agile principles as optional badges on charter)
- Created issue #16 (Team Identity → Planning Poker + Sprint Metrics team context banner — implementation scoped to those repos)
- All three issues set to Backlog in GitHub Project #13
- Next task: check issues for human feedback; implement first approved item among #10 (team-identity:lastSession Dashboard key), #11 (print-optimized @media print CSS), #12 (keyboard a11y for symbol/values grids)

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
