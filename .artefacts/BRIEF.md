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
- [x] Charter URL deep-link sharing (#7) — "Share Link" button on charter step; `shareLink()` base64-encodes charter JSON to `location.hash` as `#charter=<base64>`; copies URL to clipboard (fallback: execCommand); shows "Link copied!" toast auto-dismissed after 2s; on app mount, hash decoded and charter hydrated, jumping directly to charter step in editable mode; hash cleared from URL after load; i18n keys `charter.share_url/share_copied` in EN/ES/BE/RU
- [x] Facilitator/projector display mode (#19) — projector icon toggle in header (both main and showLearn views); `sessionStorage` key `team-identity:facilitatorMode`; when active: `facilitator-mode` class on `<html>` scales base font to 1.25rem; symbol grid buttons grow from `text-3xl p-2` to `text-5xl p-4`; value cards grow from `text-sm px-4 py-2` to `text-base px-6 py-3`; charter symbol grows from `text-7xl` to `text-9xl`; high-contrast ring on selected symbol (ring-4) and selected values (ring-2); language switcher and progress bar hidden; i18n keys `facilitator.toggle_on/toggle_off` in EN/ES/BE/RU
- [x] Multi-team support (#26) — `team-identity:charters` localStorage key stores `Array<SavedCharter>` (max 20); "Save to My Teams" inline form on charter step with custom library name; "My Teams" screen lists saved charters with Load/Rename/Delete actions; loading a charter restores full charter state and navigates to charter step; "My Teams (N)" button on intro screen when library non-empty; `teams.*` i18n keys in EN/ES/BE/RU; `SavedCharter` type in `types.ts`
- [x] Scrum values alignment (#15) — static `src/data/scrum-values-map.ts` maps each value card to 0–2 Scrum values (Commitment/Courage/Focus/Openness/Respect); "Scrum Alignment" toggle button on charter step; when enabled, each selected value badge shows its Scrum tag(s) below it; coverage row at bottom of charter card shows 5 Scrum values with ✓/strikethrough per coverage; i18n keys `charter.scrum_toggle_show/hide/coverage` in EN/ES/BE/RU; no new dependencies
- [x] Print-optimized charter layout (#11) — `@media print` block in `src/index.css` hides `header` and `.no-print` elements (progress bar, charter action buttons, save-to-library section, history panel, back button); `#charter-card` gets white background, no gradient, no shadow, 0.5rem radius, and gray border for printing; `#charter-card *` text overrides to `#1f2937`; `document.title` dynamically set to `"[TeamName] — Team Charter"` on charter step via `useEffect`; no new dependencies
- [x] Unified header component (#20) — `src/components/AppHeader.tsx` + `LanguagePicker.tsx` copied from `design-system/components/`; replaces all 3 inline `<header>` blocks (main workshop, showLearn, showMyTeams) with `<AppHeader>`; local `hideLanguagePicker` prop added (app-specific extension, not in design-system source) so facilitator mode still hides the language switcher; children slot carries the Learn button and facilitator toggle
- [x] Light/dark theme support (#21) — `darkMode: ['selector', '[data-theme="dark"]']` in `tailwind.config.js` (suite convention — not the stale `darkMode: 'class'` the issue text originally suggested); anti-flash inline script in `index.html` sets `data-theme` before paint based on `localStorage.theme` / `prefers-color-scheme`; `src/components/ThemeToggle.tsx` copied from `design-system/components/`, wired into all 3 `AppHeader` usages (main workshop, showLearn, showMyTeams); `dark:` Tailwind variants added throughout `AppHeader.tsx`, `LanguagePicker.tsx`, `index.css` (`.card`/`.btn-primary`/`.btn-secondary`/`.btn-ghost`/`.label`/`.input`), and `App.tsx` (progress bar, draft/MM-import banners, symbol/value grids, agreements list, charter history/diff panel, My Teams screen); the branded gradient charter card is left unchanged (self-contained white-on-brand styling, readable in both themes, matching how other suite apps treat similarly colorful hero cards); verified visually via headless-browser screenshots across intro/symbol/values/agreements/charter/history-compare/my-teams/learn screens in both themes; `npm run build` passes

## localStorage keys

| Key | Written by | Content |
|-----|-----------|---------|
| `team-identity-charter` | `App.tsx` `saveCharter()` | Full `TeamCharter` object + `savedAt` timestamp |
| `team-identity:lastSession` | `App.tsx` `saveCharter()` | Dashboard summary: `{teamName, symbol, valuesCount, agreementsCount, membersCount, savedAt}` |
| `team-identity:draft` | `App.tsx` `writeDraft()` | In-progress session: `{charter, step, savedAt}`; cleared on save or discard |
| `team-identity:charters` | `App.tsx` `persistCharters()` | Charter library: `Array<SavedCharter>` (max 20, newest first) |
| `team-identity:history` | `App.tsx` `saveCharter()` | Charter version history: `Array<HistoryEntry>` (max 10, newest first); each entry has id, savedAt, teamName, symbol, customSymbol, values, agreements |

## Backlog

<!-- Issues awaiting human review; agent appends here during research runs -->
- [x] [#3] Feature: ES + BE locale support (suite standard) — implemented
- [x] [#4] Feature: Charter image export (html2canvas) — implemented
- [x] [#5] Integration: Moving Motivators → Team Identity (import motivators as values) — implemented
- [x] [#6] Integration: Work Profiles → Team Identity (participant import via localStorage)
- [x] [#7] Feature: Charter deep-link sharing via URL hash (base64, clipboard copy, QR optional)
- [ ] [#8] Integration: Team Identity → Scrum Facilitator (team context banner — implementation in scrum-facilitator repo)
- [x] [#10] Feature: Dashboard card integration (write `team-identity:lastSession` on save; update dashboard reader)
- [x] [#11] Feature: Print-optimized charter layout (`@media print` CSS, hide nav, white background) — implemented
- [x] [#12] Feature: Keyboard accessibility for symbol grid and values selection (arrow-key nav, ARIA roles)
- [x] [#14] Charter history and version comparison — `team-identity:history` localStorage key; "Charter History" panel on charter step; side-by-side diff (values added/removed in green/red, agreements added/removed) between any past version and current charter; "Restore" loads any past version; capped at 10 versions
- [x] [#15] Research: Scrum values alignment layer (static map + toggleable tags on charter card)
- [ ] [#16] Integration: Team Identity → Planning Poker + Sprint Metrics (team context banner, scoped to those repos)
- [x] [#17] Feature: Draft auto-save between workshop steps (write team-identity:draft on step transitions; resume banner on mount)
- [ ] [#18] Integration: Change Planner — read team-identity-charter to pre-fill team context in change scenarios (scoped to change-planner repo)
- [x] [#19] UX: Facilitator/projector display mode — CSS class toggle for larger text and cards on projected displays
- [x] [#26] Feature: Multi-team support — charter library in `team-identity:charters`, My Teams screen with Load/Rename/Delete actions per charter
- [x] [#20] UX: Unify header — copy `AppHeader.tsx` + `LanguagePicker.tsx` from design-system into `src/components/`, replace all 3 header blocks (main app, showLearn, showMyTeams) with unified component — implemented
- [x] [#21] Feature: Light/dark theme — `darkMode: ['selector', '[data-theme="dark"]']` in tailwind.config.js, anti-flash inline script in index.html, `ThemeToggle.tsx` from design-system, `dark:` Tailwind variants on all color classes — implemented
- [x] [#39] Technical: code-split html2canvas — removed static `import html2canvas from 'html2canvas'` from `App.tsx` line 3; added `const { default: html2canvas } = await import('html2canvas')` inside `copyImage()` handler; main bundle 461.76 kB → 259.91 kB (gzip 128.48 kB → 80.58 kB); html2canvas now a separate lazy chunk (202.43 kB, only loaded on "Copy Image" click)
- [ ] [#40] Technical: add Vitest unit tests for charter logic (history diff, Scrum coverage map, library cap/eviction, URL-hash encode/decode)
- [ ] [#41] Feature: JSON export/import of the charter library (My Teams) for backup and cross-device transfer
- [ ] [#42] Technical: split App.tsx (1017 lines) into per-screen components
- [ ] [#43] Integration: Team Identity → Improvement Board, Kanban Designer, Work Profiles, Salary Formula (team context banner, scoped to those repos)

## Tech notes

- Firebase mentioned in `README.md` for collaboration; verify env when enabling.
- GitHub Project #13 created for this repo (project ID: `PVT_kwDOEGuPAc4BXTDB`).

## Agent Log

### 2026-07-16 — feat: code-split html2canvas (#39); auto-approved #39/#40/#41
- Done: auto-approved #39/#40/#41 (all filed 2026-07-08, 8 days past 7-day threshold, still `needs-review`). Implemented #39: removed static `import html2canvas from 'html2canvas'` (App.tsx line 3); added `const { default: html2canvas } = await import('html2canvas')` inside `copyImage()` async handler — zero behavior change. Build passes: main bundle 461.76 kB → 259.91 kB (gzip 128.48 → 80.58 kB); html2canvas appears as its own lazy chunk (202.43 kB / gzip 48.09 kB), fetched only on "Copy Image" click. Patch bump 0.1.0 → 0.1.1.
- Remaining: #40 (Vitest tests) and #41 (charter library JSON export/import) still to implement in next runs.
- Next task: implement #40 (Vitest unit tests — `npm install -D vitest`; add `"test": "vitest run"` script; extract and test `persistCharters()` 20-item cap, `SCRUM_VALUE_MAP` coverage counting, history diff sets, base64 URL-hash encode/decode round-trip from App.tsx/types.ts); then #41 (charter library JSON export/import on My Teams screen)

### 2026-07-11 — research: no pending human feedback, filed 2 new findings
- Done: checked all 19 open issues. All previously-approved work (#3,#4,#5,#6,#7,#10,#11,#14,#15,#17,#19,#20,#21,#26) confirmed already implemented per Features checklist, awaiting human "Done" close; #8/#16/#18 confirmed scoped to other repos, no team-identity action needed; #39/#40/#41 (filed 2026-07-08) are still within their 7-day needs-review window (auto-approve threshold 2026-07-15, not yet reached) — no action possible on them this run. No changes-requested/research-more/incomplete issues present. Surveyed the codebase for new findings not already covered by #39–#41: confirmed `src/App.tsx` has grown to 1017 lines across 10 feature cycles with zero screen-level component extraction (only `AppHeader`/`LanguagePicker`/`ThemeToggle` exist in `src/components/`); confirmed the suite-wide "team context banner" pattern (#8 scrum-facilitator, #16 planning-poker+sprint-metrics, #18 change-planner) has not been proposed for Improvement Board, Kanban Designer, Work Profiles, or Salary Formula. Filed #42 (split App.tsx into per-screen components) and #43 (extend team context banner to the 4 remaining apps) — both `needs-review`.
- Remaining: #42/#43 await human review; #39/#40/#41 await their auto-approve threshold (2026-07-15).
- Next task: check issues for human feedback; #39/#40/#41 reach the 7-day auto-approve threshold 2026-07-15 — auto-approve if still needs-review and implement first approved (in issue-number order: #39 then #40 then #41), else continue research cycle. #42/#43 reach their own threshold 2026-07-18 if untouched. Note: `gh` CLI auth is broken in this session (`gh auth login`/`gh project item-list` both fail — invalid token) — used `mcp__github__` tools for all GitHub ops (list_issues, issue_write); Projects v2 field mutations remain unavailable via MCP, so the two new issues could not be added to the project board — rely on the `needs-review` label only, matching every sibling repo's precedent this session.

### 2026-07-08 — research: no pending approved work, filed 3 new findings
- Done: checked all 16 open issues; all previously-approved work (#3,#4,#5,#6,#7,#10,#11,#14,#15,#17,#19,#20,#21,#26) confirmed already implemented per Features checklist and Agent Log, awaiting human "Done" close; #8/#16/#18 confirmed scoped to other repos (scrum-facilitator/planning-poker+sprint-metrics/change-planner respectively), no team-identity action possible or needed this run — consistent with the last two runs' assessment. Verified three technical/UX gaps before filing: `html2canvas` is still a static top-level import in `App.tsx` despite only being used in the "Copy Image" handler (main bundle 461.76 kB / gzip 128.48 kB, no code splitting at all — same pattern already fixed in `salary-formula` #38 and proposed in `sprint-metrics` #55); zero test files and no `vitest`/test script exist anywhere in the repo; no export/import path exists for the `team-identity:charters` library, leaving 20 saved teams unrecoverable if local storage is cleared (issue #14 left this exact question open and unanswered). Filed #39 (code-split html2canvas), #40 (Vitest unit tests for pure charter logic), #41 (charter library JSON export/import) — all `needs-review`.
- Remaining: all three await human review; no approved work available to implement this run.
- Next task: check issues for human feedback; #39/#40/#41 reach the 7-day auto-approve threshold 2026-07-15 — auto-approve if still needs-review and implement first approved; else continue research cycle. Note: gh CLI/API GraphQL and Actions REST are blocked in this session (403, same as sibling repos) — used mcp__github__ tools for all GitHub ops (list_issues, issue_write); no MCP tool exposes Projects v2 item-add/field-edit, so the project board Status field could not be set for the new issues — rely on the needs-review label only, matching every other repo's precedent this session.

### 2026-07-04 — feat: Light/dark theme support (#21)
- Done: `darkMode: ['selector', '[data-theme="dark"]']` added to `tailwind.config.js` (the established suite-wide convention across all other 9 apps — the issue's original `darkMode: 'class'` text predates that convention); anti-flash inline script added to `index.html` head, setting `data-theme` on `<html>` before first paint from `localStorage.theme` or `prefers-color-scheme`; `src/components/ThemeToggle.tsx` copied verbatim from `design-system/components/`; `<ThemeToggle />` wired into all 3 `AppHeader` usages (main workshop, showLearn, showMyTeams), placed first in the children slot ahead of the Learn button/facilitator toggle; `dark:` variants added to `AppHeader.tsx` (header bg/border, dashboard-link icon, nav pills) and `LanguagePicker.tsx` (trigger button, dropdown panel, selected/hover states) matching the convention used in salary-formula/planning-poker/sprint-metrics/change-planner; `index.css` shared component classes (`.card`, `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.label`, `.input`) and `body` gained `dark:` variants; `App.tsx` gained `dark:` variants across the progress bar, draft-resume and Moving-Motivators-import banners, symbol grid, values grid, agreements list + suggestions, charter history panel (diff badges, compare view, version list), and the My Teams screen; the branded gradient charter card itself (`#charter-card`) is left unchanged — it's a self-contained white-on-brand-gradient design that reads fine in both themes, matching how other suite apps treat similarly colorful hero/branded elements; print styles (`@media print`, already forcing a white background `!important`) are unaffected by the theme change
- Verified visually via headless-browser screenshots (Playwright + local `vite preview`) across intro, symbol, values, agreements, charter, history/compare, My Teams, and Learn screens in both light and dark mode; `npm run build` passes
- Issue #21 fully implemented; all approved issues for this repo are now either implemented (awaiting human "Done" close) or scoped to other repos (#8, #16, #18)
- Next task: check issues for human feedback; no other approved-but-unimplemented issues remain — if nothing new is approved, run a research cycle for the next market/integration/UX opportunity

### 2026-07-02 — feat: Unified header component (#20)
- Done: copied `AppHeader.tsx` + `LanguagePicker.tsx` from `design-system/components/` into `src/components/`; added a local `hideLanguagePicker` prop to `AppHeader.tsx` (not in the shared source) so the existing facilitator-mode behavior of hiding the language switcher still works; replaced all 3 inline `<header>` blocks (main workshop screen, showLearn screen, showMyTeams screen — one more than the issue described, since #26 added a third header since the issue was filed) with `<AppHeader>`; removed the now-unused `i18n` destructure from `useTranslation()`; verified visually via a local preview build + headless-browser screenshots across all 3 screens; `npm run build` passes
- Remaining: none — #20 fully implemented
- Next task: check issues for human feedback; implement #21 (light/dark theme — `darkMode: 'class'` in tailwind.config.js, anti-flash inline script in index.html, `ThemeToggle.tsx` from design-system, `dark:` Tailwind variants across `src/`) if still approved

### 2026-06-29 — feat: Print-optimized charter layout (#11)
- Done: `@media print` block in `src/index.css` — hides `header` and `.no-print` elements (progress bar, charter action buttons, save-to-library section, history panel, back button); `#charter-card` prints white background with gray border, no gradient/shadow/large radius; `#charter-card *` text overrides to `#1f2937` for readability; `document.title` set to `"[TeamName] — Team Charter"` on charter step via `useEffect` (resets on navigation); `no-print` class added to 5 DOM elements in `App.tsx`; no new dependencies; auto-approved #11 (50 days), #20 (40 days), #21 (40 days)
- Remaining: none — #11 fully implemented
- Next task: check issues for human feedback; implement #20 (header unification — copy AppHeader.tsx + LanguagePicker.tsx from design-system/components/ into src/components/, replace both header blocks); then #21 (light/dark theme)

### 2026-06-27 — feat: Charter history and version comparison (#14)
- Done: `HistoryEntry` type in `types.ts`; `HISTORY_KEY = 'team-identity:history'`; `loadHistory()`/`persistHistory()` helpers; `saveCharter()` now prepends a snapshot to history (capped at 10); `showHistory` toggle button on charter step (shows count); history panel lists all past saves with symbol, team name, date, values count; "Compare" button highlights selected version and shows side-by-side diff (values: removed in red strikethrough, kept in gray, added in green; agreements: same pattern); "Restore" loads past version into current charter; "Close" dismisses comparison; i18n keys `history.*` in EN/ES/BE/RU; no new dependencies
- Remaining: none — issue fully implemented
- Next task: check issues for human feedback; auto-approve stale needs-review #11 (print CSS, 48 days), #20 (header unification, 37 days), #21 (light/dark theme, 38 days); implement first approved item; else research cycle

### 2026-06-24 — feat: Scrum values alignment (#15)
- Done: `src/data/scrum-values-map.ts` with `SCRUM_VALUES` array and `SCRUM_VALUE_MAP` mapping all 20 VALUE_CARDS to 0–2 Scrum values; `showScrumAlignment` state (off by default); "Scrum Alignment" toggle button on charter step with active ring indicator; when enabled: each value badge in charter card shows its Scrum tag(s) in a sub-label; coverage row appended at bottom of charter card showing all 5 Scrum values with filled/strikethrough styles per coverage count; i18n keys `charter.scrum_toggle_show/scrum_toggle_hide/scrum_coverage` in EN/ES/BE/RU; no new dependencies
- Remaining: none — issue fully implemented
- Next task: check issues for human feedback; implement #14 (charter history — `team-identity:history` localStorage key, history panel on charter step, version compare) if approved; else auto-approve stale needs-review items #20 (header unification ≥35 days old) and #21 (light/dark theme ≥35 days old) then research cycle

### 2026-06-22 — feat: Multi-team support (#26)
- Done: `team-identity:charters` localStorage key (`Array<SavedCharter>`, cap 20); `SavedCharter` type in `types.ts`; `loadCharters()`/`persistCharters()` helpers; "Save to My Teams" inline form on charter step; "My Teams" screen with Load/Rename/Delete; "My Teams (N)" button on intro when library non-empty; `teams.*` i18n keys in EN/ES/BE/RU
- Remaining: none — issue fully implemented
- Next task: check issues for human feedback; research cycle for next improvements

### 2026-06-19 — feat: Facilitator/projector display mode (#19)
- Done: `facilitatorMode` state from `sessionStorage('team-identity:facilitatorMode')`; `useEffect` toggles `facilitator-mode` class on `<html>`; `html.facilitator-mode { font-size: 1.25rem }` in `index.css`; projector SVG icon button in both main and showLearn headers; language switcher + progress bar hidden in facilitator mode; symbol buttons grow (`text-5xl p-4`, `ring-4`) in facilitator mode; value card buttons grow (`text-base px-6 py-3`, `ring-2`) in facilitator mode; charter symbol grows to `text-9xl`; i18n keys `facilitator.toggle_on/toggle_off` in EN/ES/BE/RU
- Issue #19 fully implemented; setting to In Review
- Next task: check issues for human feedback; implement #26 (multi-team support — charter library in `team-identity:charters`, My Teams screen, Load/Delete/Rename) if approved; else research cycle

### 2026-06-14 — feat: Keyboard accessibility for symbol grid and values (#12)
- Done: Symbol grid → `role="radiogroup"` on container + `role="radio"` + `aria-checked` on each symbol button + roving tabindex (selected item gets `tabIndex=0`, others -1, first item focusable when none selected) + `onKeyDown` handler on container (ArrowLeft/Right/Up/Down/Home/End navigate and select); Values grid → `role="group"` + `aria-pressed` on each value toggle button + `onKeyDown` for Left/Right/Home/End focus nav without toggling; Custom symbol input → `id` + `htmlFor` label association; Custom value input → `aria-label`; Charter card → `role="region"` + `aria-label`; Agreement buttons → descriptive `aria-label` including agreement text; `focus-visible:ring-2 focus-visible:ring-brand-400` added to interactive symbol and value buttons
- Issue #12 fully implemented; setting to In Review
- Next task: check issues for human feedback; implement #19 (facilitator/projector display mode — CSS class toggle for larger text) or #26 (multi-team support — charter library in localStorage) if approved

### 2026-06-10 — feat: Charter URL deep-link sharing (issue #7)
- Done: `shareLink()` base64-encodes charter JSON → sets `location.hash` as `#charter=<base64>` → copies full URL to clipboard (with execCommand fallback) → shows "Link copied!" toast (auto-dismiss 2s); on mount, hash decoded and charter hydrated directly to charter step; hash cleared from URL after load; i18n keys `charter.share_url`/`charter.share_copied` in EN/ES/BE/RU
- Issue #7 fully implemented; setting to In Review
- Next task: check issues for human feedback; implement #11 (print-optimized @media print CSS) or #12 (keyboard accessibility) if approved

### 2026-06-10 — research: found approved #7 (URL hash sharing), transitioning to implement
- Done: Checked open issues; found approved #7 (Charter deep-link sharing via URL hash); set project status to In Progress
- Remaining: #7 not yet implemented
- Next task: Implement #7 — add Share button on charter step; base64-encode charter JSON to `location.hash`; copy URL to clipboard; show "Link copied!" toast; on app load decode hash and hydrate charter state, jumping to charter step if valid; open in editable mode (not read-only); URL-only sharing (no QR library); keep existing localStorage path unchanged

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
