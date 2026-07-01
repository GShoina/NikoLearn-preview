# NikoLearn — Bug + Systemic Fix Tracker (live, owner-tracked)
**Updated 2026-07-01.** SSOT for every owner-reported bug + the systemic class behind it. New owner
reports get inserted here in priority order; nothing is asked until the list reaches the bottom.

## GOAL
Every reported bug fixed at the **choke-point** (shared layer, whole class dies), verified before it
reaches the owner. LOOP: weakest/highest-value open item → fix at choke-point → verify (logic+§6c render)
→ deploy (fix) → tick. DONE = root found · shared-layer fix · verified · live.

---

## ✅ LIVE (deployed + verified today)
- [x] pattern/reasoning owl speaks Georgian + right lesson/label — v1.298
- [x] iOS keyboard on every tap (registration) — v1.299
- [x] „Русский" dead option removed — v1.299
- [x] teaching beat on the FIRST wrong answer (grasp before retry, shared reQueueWrong) — v1.300
- [x] duplicate question in a round (deduped word/phrase pools) — v1.301
- [x] owl SPEAKS in math (fixed voiceable `say` phrases + clips) — v1.302
- [x] units/tens hint now DEFINES the terms inline (no assumed knowledge) — v1.302
- [x] READABILITY STANDARD (structured tutor text: lead+bullets+conclusion, adaptive font, measure) — v1.303
      + `docs/READABILITY_STANDARD.md`; units/tens hint restructured to match owner mockup.
- [x] adaptive fonts fanned out to ALL cards (question/sub/teach card/equation/count) — v1.304
- [x] owl speaks ka in ALL subjects (INV-3 fan-out complete: vocab/alpha/kings/count/compare/…) — v1.305
- [x] fast-reveal modes (spell/listen-yle/yesno/story) now teach-gate, no fast auto-advance — v1.306

## Findings (verified, no code change needed)
- "correct answer marks too fast": on the CURRENT live build a wrong math answer no longer flash-marks the
  correct one (verified via a timed DOM timeline) — it teaches (hint 1st miss, gated teach card 2nd miss).
  This was the OLD behaviour before v1.300/v1.302. Re-test on v1.303; if it persists, name the exact mode.

## ⏳ OPEN — priority order
0. [ ] **Privacy/consent copy is OVER-STATED (owner 07-02)** — consent banner claims a "Meta cookie for
       ad-effectiveness" but Meta Pixel is INERT (placeholder ID) + no ads run → no Meta cookie ever set.
       Only Clarity sets cookies (landing-only). Fix: banner mentions ONLY Clarity (or drop Clarity → 100%
       cookieless), "privacy"→"კონფიდენციალურობა" (#7/#9), soften "GDPR & KIDS" badge, privacy.html Meta
       "not currently active". Full numbered inventory (23 msgs: 1❌/3⚠️/19✅) →
       `output/2026-07-02-უსაფრთხოების და კონფიდენციალურობის მესიჯების ინვენტარი by Niko.html`.
       CUSTOMER-FACING → owner picks which strings change before deploy (§6f copy-list).
1. [ ] **Fast reveal-and-auto-advance modes** (spell / listen-yle / yesno / story) still auto-skip on a
       timer → route them through the same teach-gate (finishes the "too fast" fix everywhere).
2. [ ] **Post-test explanation in tiny letters** → readable POPUP (large text + listen where a clip exists).
3. [ ] **English flow clarity** — "დაიწყე აქედან" should be one tap = one ready session, not a
       6-mode × N-topic fork. (Customer-facing redesign — build + show before live.)
4. [ ] **Puzzle/riddle objects too small on phone** (INV-5) — content objects clamp-fluid at 320/360/390.
5. [ ] **INV-3 tutor speaks ka fan-out** — clip-first live for pattern; extend fixed voiceable phrases to
       the other hint modes (vocab/math/alpha) so the owl talks everywhere.
6. [ ] **B3/B4 talk grammar** — text fixed; regen audio (tlk_024 etc.) + full Gemini+native grammar sweep (INV-6).
7. [ ] **INV-1 teach before test** — math primer / multiplication table.
8. [ ] **INV-2 answerOutcome resolver** — unify all wrong-answer handlers to one contract (the durable
       structural fix; items 1 + first-miss-teach are down-payments on it).
9. [ ] **INV-4 adaptive ladder** for the flat modes (count/compare/skip/shapes/money/clock).

Legend: `[ ]` open · `[~]` partial · `[x]` DONE + live.
Architecture SSOT: `docs/INTERACTION_CONTRACT.md`. Branch note: hotfixes linear on main; F2 feature branch
(jelly cards, vivid counting, landing telemetry) to be rebased onto main before its own ship.
