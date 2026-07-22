# NikoLearn — RESUME

> Startup SSOT. Hard cap: 2 KB. Semantic state only; machine state is `.recovery/current.md`.

**UPDATED:** 2026-07-23 · **v1.369 LIVE; dayq v4 = v1.370 BUILT+VERIFIED on branch `fix/dayq-native-voice`, awaiting live-push GO (§13.4).** NB-91: 2 hard+1 soft non-native KA fixed in `niko/dayq.js` (მოგვდის/სცვივა/გამოიღებს) + owner „გახმოვანებაც" done = 12 EkaNeural clips (dqq/dqa_1-6, drift-guarded pipeline `tools/dayq-extract.mjs`→`_gen_dayq.py`): Bubu auto-reads Q on open + 🔊 replay, speaks A on reveal; EN reward silent. npm test + visual-gate green, §6c looked-at. Roadmap „ჩემი ვერსია" delivered → `output/2026-07-22-ნიკოს როუდმეპი ჩემი ვერსია by Niko.html` (P0 = Georgian-quality-as-a-system = AF-3). MC-2 build + MC-6 paused behind this.
**LIVE (prod):** `v1.369` (`60ee370`) · origin/main = `60ee370` · footer v1.369, 0 console errors, SW cache nikolearn-1.369 · W7 day-question live. **dayq v4 (1.370) NOT pushed — owner GO gates the live push.**
**WORKER (prod):** `nikolearn-t` `5b1ab168` — feedback-notify live · inbox intentionally EMPTY (restore `backups/kv-feedback-2026-07-21/`).

## NOW — finish Opus-doable deliverables FIRST, then global (strategy/orchestration)

**DONE this turn:** dayq v4 (1.370) — NB-91 text fixes + owner „გახმოვანებაც" (12 EkaNeural clips, Bubu reads Q+A), version+cache rolled lockstep (screens/sw/landing 1.370), npm test + visual-gate green, §6c looked-at, committed on `fix/dayq-native-voice`. **Next single action: owner GO → merge to main + push (live re-verify with ?v=1.370).** Prior: MC-2/MC-6 authored (Gemini §6f passed) in scratchpad, paused behind the P0 quality gate.

## BUILD QUEUE · then owner-gated ship

✅W7 v1.369 LIVE · ✅MC-2 content Gemini-passed · ✅**owner APPROVED MC-2 Georgian text 2026-07-22** ("გიდასტურებ ტექსტს") · ✅**owner chose MC-6 child-first fork 2026-07-22** ("შენ რეკომენდაციასაც ვეთანხმები") → **NOW BUILDING:** MC-2 „ფიგურების ქვეყანა" = new `niko/figures-game.js` (figureRound modes A-F, reuse figures.js renderer + games.js helpers) + edge_tts ka clips (figure names + prompts, voice ka-GE-EkaNeural) registered in audio-manifest.js + menu wire + index.html load order after games.js; then MC-6 „უნარების რუკა" = extract `niko/mastery.js` shared from parent.js:298 + child skill-map view. Preview-first (§7b), live-ship GO collected async. Then W1/W2 redesign to v7 bar → Bubu-repeat English voice redo (VOICE_CREATION_GATE).
Carried-open NB: NB-82, NB-65/PI-89.

## BACKUPS / ROUTES

`backup/main-pre-v1.369` (93ff7ec) + `backup/main-pre-v1.368` (c08bd15) + `backups/kv-feedback-2026-07-21/`. Bugs→`docs/BUGFIX_TRACKER.md` · Seq→`docs/PRODUCT_ROADMAP.md` · Ideas→`docs/PRODUCT_IDEAS.md` · recovery→`tools/recover.ps1`. Branch: main (W7 merged+pushed).
