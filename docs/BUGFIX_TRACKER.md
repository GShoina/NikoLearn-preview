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
- [x] privacy/consent copy OVER-STATED (owner 07-02): removed Clarity + inert Meta Pixel + cookie banner →
      site 100% cookieless (kept cookieless CF beacon + first-party aggregate Worker); privacy.html ka+en
      rewritten to no-ads reality; "სრული privacy"→"სრული კონფიდენციალურობა"; softened "GDPR & KIDS" — v1.307.
      Live-verified: banner gone, fbq/clarity never load, 0 errors, layout intact.
- [x] post-test recommendation was tiny (.88rem) + buried "which topic" (owner 07-02): placement results now a
      readable `.reco` card — prominent adaptive topic (clamp 1.28-1.7rem), readable lead/sub, + listen button
      (reco_start.mp3, edge-tts ka; playClip-gated) — v1.308. Live-verified: topic 27px, mp3 HTTP 200.

## Findings (verified, no code change needed)
- "correct answer marks too fast": on the CURRENT live build a wrong math answer no longer flash-marks the
  correct one (verified via a timed DOM timeline) — it teaches (hint 1st miss, gated teach card 2nd miss).
  This was the OLD behaviour before v1.300/v1.302. Re-test on v1.303; if it persists, name the exact mode.

## ⏳ OPEN — priority order
1. [ ] **English flow clarity** — "დაიწყე აქედან" should be one tap = one ready session, not a
       6-mode × N-topic fork. (Customer-facing redesign — build + show before live.) v1.308 made the
       recommendation READABLE; this item is the deeper one-tap-session flow.
2. [ ] **Readability STRUCTURE fan-out** — apply the lead/item/end structured spans (v1.303) to the other
       multi-part hints (build-a-ten, kingsMath, etc.), not just units/tens.
3. [ ] **Puzzle/riddle objects too small on phone** (INV-5) — content objects clamp-fluid at 320/360/390.
4. [ ] **INV-3 tutor speaks ka fan-out** — clips live for pattern/math/subjects (v1.302/1.305); extend
       fixed voiceable phrases to the remaining hint modes (alpha/vocab detail) so the owl talks everywhere.
5. [ ] **B3/B4 talk grammar** — text fixed; regen audio (tlk_024 etc.) + full Gemini+native grammar sweep (INV-6).
6. [ ] **INV-1 teach before test** — math primer / multiplication table.
7. [ ] **INV-2 answerOutcome resolver** — unify all wrong-answer handlers to one contract (the durable
       structural fix; fast-reveal + first-miss-teach are down-payments on it).
8. [ ] **INV-4 adaptive ladder** for the flat modes (count/compare/skip/shapes/money/clock).

Legend: `[ ]` open · `[~]` partial · `[x]` DONE + live.
Architecture SSOT: `docs/INTERACTION_CONTRACT.md`. Branch note: hotfixes linear on main; F2 feature branch
(jelly cards, vivid counting, landing telemetry) to be rebased onto main before its own ship.
