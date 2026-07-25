# Team Identity — Goal

## Problem
Agile teams rarely take the time to explicitly define who they are — their name, symbol, shared values, and working agreements — even though Management 3.0's Identity Symbols and Work Expo practices show this shapes how a team collaborates. Team Identity is a guided, single-session workshop tool that walks a facilitator and their team through naming themselves, picking a symbol, selecting shared values, and agreeing on working norms, then produces a shareable team charter — without requiring any account, backend, or setup.

## Audience
Scrum Masters, Agile coaches, and team facilitators running an in-person or remote Identity Symbols workshop, typically projected onto a shared screen for the whole team to see and vote on live, or run solo by one facilitator per team ahead of a workshop.

## Success criteria
1. A facilitator can complete the full workshop (intro → name → symbol → values → agreements → charter) in one sitting and end with a finished, readable team charter.
2. In-progress workshop state survives accidental tab close or refresh (draft auto-save + resume).
3. A finished charter can leave the browser that created it — via print, image export, or a shareable URL link — with no backend involved.
4. A facilitator managing multiple teams can save, reload, rename, and compare charters across sessions without losing prior versions.
5. The app is usable projected in a room (facilitator/projector display mode) and in any of the suite's 4 standard locales (EN/ES/BE/RU).

## Non-goals
- Not a synced, multi-device backend — all charter data lives in browser `localStorage` only; there is no live collaboration or account system (the `README.md` mention of Firebase is aspirational, not implemented).
- Not a live multi-user editing tool — one facilitator drives the app through the steps; participants contribute verbally or by consensus, not through simultaneous input.
- Not a team roster or HR system — participant import from Work Profiles is a one-way, read-only convenience, not a synced membership list.
