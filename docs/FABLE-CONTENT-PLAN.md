# Fable content pipeline — action plan (2026-07-02)

Owner approved trialling Fable 5 for NikoLearn content authoring after live bake-offs (talk cards + math +
English samples all high quality; math arithmetic self-verified, English level-appropriate, natural Georgian).

## Where Fable is used (and NOT)
USE — creative/original content authoring: talk & think cards, English reading/story passages, vocab-in-context,
math word-problem scenarios, Kings-style (YLE) items, warm owl copy.
NOT — code, architecture, difficulty-ladder logic, answer-checking, telemetry, pedagogy engine (Opus/Sonnet).

## Pipelines (guardrails are non-negotiable)
- Talk / reading / vocab (no correctness risk):
  **Fable draft → dedup vs existing → Gemini KA-QA → owner native → (edit) → integrate + edge-tts clips → preview → GO → live.**
- Math / Kings (correctness-critical): one extra gate up front:
  **Fable draft → CORRECTNESS + SOLVABILITY verify (Opus/Sonnet or code; §12 loop criteria each ≥8) → Gemini KA-QA → owner native → integrate → preview → GO → live.**
- §11 ORIGINAL always (esp. Kings: the 2026-06-27 incident was Kings items transcribed from kings.ge — never repeat).
- §8 no em dash. §6f owner is the final native filter. Gemini step: run when key available; else mark "NOT RUN".

## Sequence (owner-ordered 2026-07-02)
1. [done] Talk cards — 20 drafted (`docs/fable-talk-cards-2026-07-02.md`), native-QA'd, awaiting owner + Gemini.
2. [done] Math + English SAMPLES shown (3+3), math arithmetic verified. Quality confirmed.
3. [in progress] Kings direction — same sample-first treatment (original YLE items, correctness-verified).
4. [queued, LAST] Letter-shapes „ასოების მოხაზულობა" — NOT a content-gen task; = handwriting/letter contour
   quality (see parked `feat/centerline-writing`, one-stroke skeletons). Scope when reached.

## Cost / access
Fable usage = owner money/access gate. Volume batches proceed once owner confirms he's OK spending on Fable.

## Integration notes
- Talk cards → append to TALK.ka (niko/talk.js); generate clips tlk_051+ (edge-tts ka-GE-EkaNeural); manifest keys
  must EXACTLY equal the rendered q text (INV-6 lesson: drift = silent clip). Run `tools/_talk_diff.py` after.
- Everything customer-facing → §7b preview → owner GO → live. Nothing ships unverified.
