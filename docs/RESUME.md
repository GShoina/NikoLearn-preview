# NikoLearn — RESUME

> Startup SSOT. Hard cap: 2 KB. Semantic state only; machine state is `.recovery/current.md`.

**UPDATED:** 2026-07-23 · **v1.372 LIVE + §6c-verified on nikolearn.com.** Shipped **NB-94** (owner IMG_1996): drawing studio broken on phone — scattered 8-button header + ugly native scrollbars through the sticker/template rows. Fix in `niko/styles.css` `.dw-*`: header restructured to a clean 2-row layout (back left + save right on row 1, 6 tools centered on row 2), both emoji strips get `scrollbar-width:none`+webkit-hide (matching the correct `.mv2 .rail`), `flex-shrink:0`+hidden `overflow-y` so nothing clips on short phones. **§14 sweep = INSTANCE-only:** grep (only draw's 2 strips lacked scrollbar-hiding) + live render of 10 section screens at 390×660 (talk/dayq/menus/games/alpha/placement/kings-exam all clean, docOverflowX=none everywhere) → mobile-first holds in every other section; draw was the sole exception (only screen with a multi-button toolbar). Prevention logged: `visual-gate.mjs` never renders section screens. **NB-94 CLOSED live.** npm test GATE PASSED, full pre-push behavioral gate (6 harnesses) GREEN, 0 console errors.
**LIVE (prod):** `v1.372` (`972c227`, = origin/main) VERIFIED (raw Pages fetch: screens.js APP_VERSION=1.372, styles.css carries all 3 dw fixes; rendered LOOK at 390×660 = tools single-row/aligned header, scrollbars gone). **The 2 previously-stuck docs commits (`63db74d`+`251db6c`) are now PUSHED** — this push passed cleanly with RAM freed (browser closed, 2677MB free); origin/main = HEAD, 0 ahead.
**WORKER (prod):** `nikolearn-t` `5b1ab168` — feedback-notify live · inbox intentionally EMPTY (restore `backups/kv-feedback-2026-07-21/`).

## NOW
**DONE this turn:** v1.372 = NB-94 drawing-studio mobile fix — committed, pushed (full gate green), LIVE + §6c-verified, NB-94 CLOSED, §14 mobile-first sweep answered the owner (INSTANCE-only, all 10 other sections clean). The 2 stuck docs commits pushed too. Backup `backup/main-pre-v1.372` = 251db6c. **Next single action: await owner direction; queue = MC-2 build (paused behind P0 Georgian gate AF-3).** Paused behind P0 Georgian-quality gate (AF-3): MC-2 „ფიგურების ქვეყანა" build + MC-6 „უნარების რუკა". Prevention owed: extend `qa/visual-gate.mjs` to render section screens at 320/360/390px (the gap that let NB-94 ship).

## BUILD QUEUE
✅W7 1.369 · ✅dayq v4 1.370 · ✅v1.371 NB-92/93 · ✅v1.372 NB-94 draw-mobile LIVE → MC-2 „ფიგურების ქვეყანა" (`niko/figures-game.js` modes A-F, edge_tts ka clips, menu wire, index load after games.js) → MC-6 „უნარების რუკა" (extract `niko/mastery.js` from parent.js:298) → W1/W2 redesign → Bubu-repeat EN voice redo (VOICE_CREATION_GATE). Carried-open NB: NB-82, NB-65/PI-89, NB-89 (EN voice), NB-90 (owner-home doc).

## BACKUPS / ROUTES
`backup/main-pre-v1.372` (251db6c) + `backup/main-pre-v1.371` (918a5b3) + `backups/kv-feedback-2026-07-21/`. Bugs→`docs/BUGFIX_TRACKER.md` · Seq→`docs/PRODUCT_ROADMAP.md` · Ideas→`docs/PRODUCT_IDEAS.md` · recovery→`tools/recover.ps1`. Branch: main.
