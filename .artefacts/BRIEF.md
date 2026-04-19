# BRIEF

Derived per [`agent-state.NO-BRIEF.md`](https://github.com/agile-toolkit/.github/blob/main/agent-state.NO-BRIEF.md). There was **no prior** `BRIEF.md`. Sources: `README.md`, `src/i18n/en.json` / `ru.json`, `src/`. Generated **2026-04-19**.

## Product scope (from `README.md`)

- **Team identity workshop:** name, symbol, values, working agreements (Identity Symbols / Work Expo style).
- Stack includes **Firebase** (README).

## Build

- `npm run build` — **passes** (verified **2026-04-19**).

## TODO / FIXME in `src/`

- None.

## i18n — orphaned keys

- **`charter.team_name`**, **`charter.symbol_title`** — not used; `App.tsx` uses other `charter.*` keys and raw fallbacks like **`Our Team`** for preview heading (~line 317). Either wire these keys in the preview / PDF block **or** remove from locales.
- **`agreements.delete`** — remove-control uses hardcoded **`✕`** (`App.tsx` ~267) instead of `t('agreements.delete')`.

## Hardcoded user-visible strings

- **`Our Team`** fallback string in `App.tsx` charter preview — should be i18n.

## Classification (NO-BRIEF)

- **Status:** `in-progress`
- **First next task:** Replace the agreements remove control’s **`✕`** in `App.tsx` with **`{t('agreements.delete')}`** (add tooltip/aria if needed); replace **`Our Team`** with a `charter.preview_fallback` key in `en.json` / `ru.json`.
