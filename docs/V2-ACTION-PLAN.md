# NikoLearn v2 — business-anchored action plan (owner "build v2", 2026-07-02)

## Reframe (meta prompt architect + skeptical board member)
The owner's 6 areas (design, visual, tutor, levels, owl, Georgian voice) are INPUTS, not the goal. At this
stage the only DATA-BACKED business bottleneck is ACTIVATION: 53% of round abandons happen on question 0
(math 65% / kings 59% worst). RETENTION is not measurable by design (no persistent ID = child PII), and
monetization/pricing/PMF remain [HYPOTHESIS] until real usage/payments prove them. So v2 is NOT "polish 6
features." v2 = the release that (1) fixes activation (child reaches a first win), (2) deepens the loop so
there is a reason to return (leveled progression + a tutor that actually TEACHS), (3) makes quality visible
(design + Georgian voice = parent trust + shareability; facebook is already the main external channel).
Honest: only (1) is measurable now; (2)/(3) are bets that COULD drive retention, to be validated as usage grows.

## v2 releases (sequenced by business value x evidence). Each: §7b preview->GO, §6d earns its number, measured.

### v2.0 — ACTIVATION (highest value, data-proven). Target metric: round_abandon q0 down.
- Round-ENTRY redesign: inviting, calm first screen (not an immediate hard question). Owl greets + frames the topic.
- Universal WARM-UP before q0 (generalize the proven mulPrimer pattern to every mode): 1 teach/confidence beat, then a GENTLE first item, then ramp. Kids should hit an easy win before any challenge.
- Warm owl round-entry intro per subject x band (Fable5 copy). Ties owl (#owl) + tutor (#tutor) to activation.
- Visual: low-intimidation entry, big clear affordance, first-item styling that says "you can do this."

### v2.1 — DEPTH / reason to return. Target: mode-completion up, more first_win, longer sessions.
- Leveled content banks LIVE (Math 17 + English 17 self-verified, Kings next) behind band gates (isYoung/isBig/kingsLevel). First item of each band = easy-win, then ramp.
- Tutor = EXPLAIN THE PRINCIPLE (x-table as repeated addition/patterns, 1-2 unknown equations = "find the hidden number", place value, fractions). Code = teach/primer flow; copy = Fable5. This is the moat.
- Owl persona upgrade: varied, band-aware encouragement + "think out loud" nudges (less repetition).

### v2.2 — TRUST / WOW / shareability. Target: parent trust, word-of-mouth (facebook).
- Design "wow" polish (Sunlit) + micro-interactions/celebration variety.
- Georgian VOICE upgrade (NOT a Fable job): edge-tts voice/SSML/rate/loudnorm; child intelligibility test; options + cost. Separate technical track, can start in parallel.
- Talk deck: the 20 approved Fable cards get clips (tlk_051-070) + ship; expand further.

## Measurement (honest)
Measurable now: round_abandon by q-index (q0), round_complete rate, first_win, mode_usage, session count,
page_view ref. NOT measurable: unique-user return/retention (privacy). If the owner wants retention, that
is a separate privacy decision (add a privacy-safe aggregate returning-visitor counter) — RECOMMEND, owner OK needed.

## Guardrails (unchanged): §11 original, §8 no em dash, math self-verified, §6f Gemini+native, §6c visual gate,
## §7b preview->GO, §12 loop (each criterion >=8). Fable5 only for authored Georgian text, not code/TTS.

## EXISTING v2 design assets — REVIEWED 2026-07-02 (do NOT reinvent, BUILD to these)
The owner already designed v2. Two branches hold it:
- `feat/v2-thinking-first` -> `v2-prototype/extracted/` = the owner's hand-designed FIRST-RUN FLOW, 8 screens +
  MANIFEST + 73 icons + niko assets, extracted from `Downloads/ნიკო - სწრაფი დაწყება (ერთიანი).html`.
  Screens: 01 OPEN (voice greet + 3 big jelly buttons რიცხვები/ასოები/ენა) · 02 TAP (pick a picture) ·
  03 "ყოჩაღ, წავედით" ~1s transition · 04 FIRST TASK (voice+pictures, no writing) · 05 FIRST WIN under a
  minute (green celebrate, star +1, "≈50 წამი" timer, "კიდევ ერთი") · 06 HOME (jelly cards + water-dock nav +
  streak/stars + continue-card) · 07 SUBJECT winding path · 08 STAGE cards inside a subject. Also has
  thinking-first UX code: child-paced win button, Socratic wrong-answer, mobile-fluid tiles.
- `v2-sunlit-f2` = Sunlit visual layer partially implemented: jelly-card .opt tiles, vivid counting cards,
  pattern-owl clips. (All v2 commits are branch-only / NOT yet live.)
- Design tokens (MANIFEST): ink #2A1C12, orange brand #FF8A00, green #00C48C, red #E2483D, cream #FAF5EC/#FFF3DF,
  category hues blue #2E86DE / pink #EC4899. Fonts Inter + Poppins + Noto Sans Georgian.
RENDERED + verified 2026-07-02 (§6c): design-01/05/06 look polished, coherent, kid-warm, professional.

## KEY INSIGHT (reconciliation)
The owner's designed first-run flow IS the data-backed activation solution: screens 01->05 take a child from
open to a FIRST WIN under a minute = exactly the fix for the q0-abandonment (53%). So v2.0 = IMPLEMENT the
owner's designs, not invent new ones. My Fable5 activation copy (15 greetings + 12 encouragement + 5 warm-up
lines, Gemini-QA'd) plugs straight into design-01 (greet) + design-04/05 (first task/win). Leveled content
feeds design-07/08 (path/stage). Sunlit feeds design-06 (home).

## Start now (revised)
v2.0 = build the owner's first-run activation flow (design 01-05) into the app + Sunlit home (06). HARVEST the
partial code from the two branches (jelly tiles, child-paced win, Socratic wrong-answer) rather than rewrite.
Plug in the Gemini-QA'd Fable copy. §6c render-verify each screen, preview -> owner GO -> live. Then v2.1
(leveled depth + path/stage 07/08 + principle-tutor), v2.2 (voice + wow + talk clips).
