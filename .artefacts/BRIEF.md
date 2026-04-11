# BRIEF — Team Identity

## What this app does
A team identity workshop tool based on Management 3.0's "Identity Symbols" and "Work Expo" practices. Teams collaboratively define their shared identity — choosing symbols, values, working agreements, and team name — and create a living "team charter" artifact they can display and update.

## Target users
Newly formed teams, teams going through restructuring, Agile coaches running team-building workshops.

## Core features (MVP)
- Guided workshop flow: Name → Symbol → Values → Working Agreements → Expo
- Symbol picker (from M3.0 identity symbols set + custom upload)
- Value cards: choose from a curated set or write custom values
- Working agreements builder (editable list with vote/rank)
- Team charter output: beautiful printable/shareable summary card
- Team session mode: real-time collaboration via Firebase (or link-based share)

## Educational layer
- "Why team identity?" intro panel with M3.0 context
- Each workshop step has a facilitator guide tooltip
- Work Expo explanation: when and how to run it
- Reference to source materials

## Tech stack
React 18 + TypeScript + Vite + Tailwind CSS. Firebase Realtime Database for team sessions. GitHub Pages deployment.

## Source materials in `.artefacts/`
- `identity symbols.pdf` — M3.0 identity symbols catalog and workshop instructions
- `work expo.pdf` — Work Expo practice guide

## i18n
English + Russian (react-i18next).

## Agentic pipeline roles
- `/vadavik` — spec & requirements validation
- `/lojma` — UX/UI design (workshop flow, charter output card)
- `/laznik` — architecture (workshop state machine, Firebase real-time sync)
- `@cmok` — implementation
- `@bahnik` — QA (multi-user session sync, symbol picker accessibility)
- `@piarun` — documentation
- `@zlydni` — git commits & GitHub Pages deploy
