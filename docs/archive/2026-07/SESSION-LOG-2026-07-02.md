# NikoLearn — Session compress (2026-07-02)

Compact record of this chat. Full resume pointer = `docs/SESSION-HANDOFF.md` (top block). Sprint SSOT =
`docs/BUGFIX_TRACKER.md`.

## What the owner asked & how it went
Owner ran a live bug/UX cascade from his own testing (phone + desktop) and locked an operating mode:
**follow the „loop წესი" autonomously, do NOT wait for „go" between items, add each report to
BUGFIX_TRACKER in priority order, show the checklist at the end of every reply, end on an action.**
§7b stays the one hard gate (customer-facing → build+preview+GO before live).

## Shipped this session — 9 releases, each §6c + live-verified (live = nikolearn.com v1.315)
- v1.307 privacy → 100% cookieless (removed cookie banner + Microsoft Clarity + inert Meta Pixel;
  privacy.html ka+en rewritten to no-ads reality; „სრული privacy"→„კონფიდენციალურობა"; softened GDPR badge).
  Trigger: owner said the consent copy over-stated data collection that never happens (Pixel was a placeholder).
- v1.308 post-test recommendation: tiny (.88rem) buried text → readable `.reco` card, prominent adaptive
  topic + 🔊 listen (reco_start.mp3).
- v1.309 readability structure fan-out: compare/shapes/clock/EN-grammar hints → `.r-lead`+`.r-item` bullets.
- v1.310 puzzle objects clamp-fluid + bigger on phone (pattern/rebus/triangle; triangle went %-positioned).
- v1.311 owl speaks in listen-yle/yesno/speak/story (were returning from Tutor.build with no r.say → silent).
- v1.312 talk grammar + audio drift: built a talk-diff tool (q vs manifest key), synced 4 cards to talk.js
  SSOT + regen clips (ღრუბლები plural agreement, უყენებდე→უწესებდე, tense, reword).
- v1.313 multiplication primer before first mul round (teach-before-test; visual 3×4 = 12 apples + owl clip).
- v1.314 adaptive ladder for flat modes (compare/skip/money/clock climb on a 4-correct mastery streak).
- v1.315 English one-tap „დაიწყე აქედან" (results launches the recommended session in one tap; startHereGo;
  owner-GO'd after desktop preview).

## Decisions / findings
- INV-2 answerOutcome refactor — ASSESSED, deliberately NOT done. Wrong-answer behaviour already consistent
  via 3 correct primitives (reQueueWrong / teachAndConfirm / rule-reveal); exam=no-teach + count=retry are
  by design. A monolithic contract = wrong abstraction + high regression risk + zero user value. (Senior call.)
- „correct marks too fast" = fixed in code (v1.300+ teach-gate); owner to re-confirm the FEEL on live v1.315.

## Fable 5 evaluation (owner asked where to use it)
Ran a real Georgian bake-off (model=fable): 5 talk cards + 1 reading passage. Verdict on ACTUAL output:
Georgian is genuinely good/warm/original, no em dash. Small nuances found (მთვარეს→მთვარისთვის; milk goes
„თასში" not „თეფშზე"; 2 cards overlapped existing deck themes). CONCLUSION: use Fable for creative content
authoring (talk cards, reading/story passages, warm owl copy) — NOT code/architecture (Opus/Sonnet). Hard
guardrail: no Fable text goes live without Gemini KA-QA + owner native check (§6f) + dedup vs existing deck.
Pipeline: **Fable draft → Gemini KA-QA → owner native → dedup → live.** Cost/access = owner money gate.

## Deploy mechanics
Branch `deploy/pattern-owl` → `git push origin deploy/pattern-owl:main`. Preview synced via
`git push preview deploy/pattern-owl:main --force` (remote `preview`=GShoina/NikoLearn-preview). Rollback=revert.
edge-tts clip gen: `tools/_gen_*.py` (write manifest lines to a utf-8 .txt; Windows cp1252 stdout can't print ka).
§6c verify: fresh server port per JS edit (defer, no cache-buster), mute audio in Playwright, ?notrack=1, ?app=1.

## Open / next
- BUGFIX_TRACKER „⏳ OPEN" = empty. Big next rock = v2.00 Sunlit DESIGN integration (the „v2.00" label).
- IN PROGRESS after this compress: Fable authoring 20 new original talk cards (with existing deck as context)
  → Gemini+native QA before any ship. Plus scoping Fable for math + English course content (owner asked).
