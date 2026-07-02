# Fable5 — value-ranked action plan (owner-requested 2026-07-02, "apply meta prompt architect")

## Reframe (prompt-architect)
The scarce resource is NOT ideas, it is Fable5's one real edge: original, warm, correct AUTHORED GEORGIAN
TEXT. So spend Fable5 only where authored Georgian text is the bottleneck AND the quality is user-felt:
(1) content kids read/hear, (2) how the tutor EXPLAINS a principle, (3) the owl's personality. Do NOT
spend Fable5 on TTS audio (thread #5 is a voice-engine problem) or on code. Everything Fable produces
still passes: correctness-verify (math) + dedup + Gemini KA-QA + owner native (§6f) + §7b preview→GO.

## Owner's 5 threads → mapped and ranked by (user-felt value × Fable-uniqueness × low risk)

### TIER 1 — ship now (approved / additive / low risk, high felt value)
1. TALK CARDS — owner APPROVED the 20 (loved the Georgian). Action: place into OUR card design
   (theme + character owl/niko/masho + emoji + follow-up subs + age `min`), grade by age, edge-tts clips
   (tlk_051+), dedup vs the 50-card deck. Fable already authored; this is integration + light polish.
2. LEVELED CONTENT BANKS — Math 17 + English 17 (self-verified) → owner+Gemini QA → integrate behind the
   real band gates (isYoung ≤5 / isBig ≥7 / kingsLevel) → clips where voiced. Then the Kings bank.
   „საფეხურობრივი დონე" = the 3 bands A(3-5)/B(6-8)/C(9-12) already used.

### TIER 2 — the moat (highest DIFFERENTIATED value: the „creative teacher")
3. TUTORING = EXPLAIN THE PRINCIPLE (owner #3). Today tutor.js hints are mostly fixed, not level-aware,
   and thin on WHY. Use Fable5 to author clear, warm, band-aware explanations of PRINCIPLES, not just
   answers: multiplication table (as repeated addition + skip-count patterns), 1-2 unknown equations
   („find the hidden number"), place value, fractions, comparison. Code builds the teach/primer flow
   (we already have mulPrimer() as the proven pattern). This is where Fable + our engine become a real
   teacher instead of a quiz app. Biggest v2 differentiator.
4. OWL (ბუ) UPGRADE (owner #4). The owl is the voice of the tutor. Use Fable5 to author a richer owl
   persona: warmer + varied encouragement, band-aware hints, short „think out loud" nudges, celebration
   lines with variety (less repetition). Bundle with #3; keep §6-safe (AUDIO_MANIFEST clips; speakHint
   strips tags). Challenge first: audit where the owl is flat/repetitive/silent, then rewrite.

### TIER 3 — separate track, NOT a Fable job
5. GEORGIAN VOICE (owner #5). This is TTS quality, not text. Fable can't help. Investigate: edge-tts
   voice choice (EkaNeural vs alternatives), SSML/prosody, per-age rate, clip normalization; test child
   intelligibility; report options + any cost. Run in parallel; independent of the Fable threads.

## v2 direction (existing polish → v2 leap)
Leveled content + a genuinely explaining tutor + a warm owl persona + design „wow" together move v2 from
„quiz app" to „Georgian AI learning companion." Design polish/„wow" rides on top of 1-4, so it stays last.

## Sequence for the short period
NOW: (1) Talk integration [approved] + (2) leveled-bank QA/integration.  NEXT: (3) principle-explanations
+ (4) owl upgrade [the moat].  PARALLEL/independent: (5) Georgian-voice eval.  THEN: design wow.
Guardrails unchanged: §11 original, §8 no em dash, math self-verified, §6f Gemini+native, §7b preview→GO.
