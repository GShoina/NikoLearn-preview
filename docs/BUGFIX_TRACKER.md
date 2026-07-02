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
- [x] readability STRUCTURE fan-out beyond units/tens (owner 07-02): 4 inline-list hints → .r-lead + .r-item
      bullets (compare >/</=, shapes, clock hands, EN subject-verb) — v1.309. speakHint strips tags, csay clip
      covers voice (§6-safe). Live-verified: r-item=13, rendered as bullets, 0 errors.
- [x] INV-5 puzzle/riddle objects too small on phone (owner 07-02): pattern/math-pat numbers + rebus/model
      strand text + triangle (fluid box + %-positioned labels + clamp fonts) all clamp-fluid & BIGGER on phone
      — v1.310. Verified @390px: pattern 30→35px, rebus 24→26px, triangle val 15→18px, box 90→117px, aligned.
- [x] INV-3 owl-voice fan-out COMPLETE: listen-yle/yesno/speak/story returned from Tutor.build with no r.say
      (owl silent, TTS-fails on iOS) → added fixed ka say phrases + edge-tts clips (yle/yesno/speak/story_say.mp3)
      — v1.311. Live-verified: manifest ok, 4/4 mp3 HTTP 200, playClip true.
- [x] INV-6 talk grammar + audio drift (owner): built a diff-tool (talk.js q vs manifest key) → found 5 orphans
      (text fixed in talk.js, audio/key stale). Synced 4 prose cards to talk.js SSOT + regen clips: tlk_000
      (plural agreement ყოფილიყო→ყოფილიყვნენ), tlk_018 (უყენებდე→უწესებდე), tlk_025 (tense), tlk_026 (reworded)
      — v1.312. Verified: q→clip resolves, 4/4 mp3 200, old keys gone. tlk_045 poem left (edge). Gemini: NOT RUN (no key).

## Findings (verified, no code change needed)
- "correct answer marks too fast": on the CURRENT live build a wrong math answer no longer flash-marks the
  correct one (verified via a timed DOM timeline) — it teaches (hint 1st miss, gated teach card 2nd miss).
  This was the OLD behaviour before v1.300/v1.302. Re-test on v1.303; if it persists, name the exact mode.

## ⏳ OPEN — priority order
1. [ ] **English flow clarity** — "დაიწყე აქედან" should be one tap = one ready session, not a
       6-mode × N-topic fork. (Customer-facing redesign — build + show before live.) v1.308 made the
       recommendation READABLE; this item is the deeper one-tap-session flow.
2. [ ] **INV-1 teach before test** — math primer / multiplication table.
4. [ ] **INV-2 answerOutcome resolver** — unify all wrong-answer handlers to one contract (the durable
       structural fix; fast-reveal + first-miss-teach are down-payments on it).
5. [ ] **INV-4 adaptive ladder** for the flat modes (count/compare/skip/shapes/money/clock).

Legend: `[ ]` open · `[~]` partial · `[x]` DONE + live.
Architecture SSOT: `docs/INTERACTION_CONTRACT.md`. Branch note: hotfixes linear on main; F2 feature branch
(jelly cards, vivid counting, landing telemetry) to be rebased onto main before its own ship.
