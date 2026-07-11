# NikoLearn — Voice & Audio-Output Quality Standard (v1)

**Owner-asked 2026-07-11: give the PO an autonomous way to judge TTS / NotebookLM audio quality WITHOUT the owner's ear.**
Runnable: `node tools/voice-eval.mjs` (SSOT harness). This doc = the rubric + method + pass bars it encodes.

## The honest premise
A text model cannot *hear* a WAV. So quality is triangulated from **three independent signals**, none needing a human:

| # | Signal | What it measures | How | Vendor-neutral? |
|---|--------|------------------|-----|-----------------|
| 1 | **Physics** | loudness, clipping, silence padding, duration, speech rate | computed from PCM bytes | ✅ yes |
| 2 | **Round-trip WER** | intelligibility / pronunciation | transcribe the audio, word-error vs the INTENDED text | partly (uses an ASR) |
| 3 | **Proxy ear** | prosody, warmth, clarity, mispronounced phonemes | Gemini audio-judge on a fixed rubric, run twice | ❌ single-vendor |

**WER is the anchor.** A mispronounced word transcribes wrong, so `WER=0` is hard evidence the words are pronounced correctly. It does not depend on the judge's taste. The proxy-ear corroborates; it never overrides WER.

## App-clip rubric (voicing that a CHILD hears)
Weighted 1-10; **intelligibility carries the most weight because in a learning app a wrong sound teaches the child wrong.**

| Criterion | Weight | Notes |
|-----------|--------|-------|
| Intelligibility / pronunciation | 35% | every Georgian word clear + correct; ქ/კ/ყ/ჭ/წ/ცხ clusters are the usual TTS failure points |
| Clarity / articulation | 25% | clean, distinct, learner-paced (slightly slow is good) |
| Naturalness / prosody | 20% | human rhythm + stress, not robotic |
| Warmth / child-friendliness | 20% | tone a 3-7 y.o. + parent trusts; not a cold newsreader |

**PASS bar:** weighted ≥ 8.0 **AND** intelligibility ≥ 8 **AND** WER ≤ 0.05 **AND** zero mispronounced-word flags. Any mispronounced word = automatic FAIL regardless of the average.

## Parent-content rubric (NotebookLM / listenable audio for adults)
| Criterion | Weight | Notes |
|-----------|--------|-------|
| Language purity | 25% | 100% Georgian, **zero English leak** (NotebookLM's main risk) |
| Source faithfulness | 25% | every claim traceable to the source; no hallucination |
| Coverage | 15% | hits the source's key points |
| Tone fit | 15% | warm, parent-trust register |
| Structure / listenability | 10% | coherent audio flow |
| Voice quality | 10% | the app-clip sub-rubric on the narration |

**PASS bar:** ≥ 8.0 **AND** language purity ≥ 9 (an English leak in a Georgian-first product is near-disqualifying) **AND** faithfulness ≥ 8.

## Confidence discipline (built into the harness)
- **Two judges, conservative aggregate:** run the proxy-ear twice; take the **lower** score; if they split by >1 point, confidence = medium.
- **Degenerate-judge filter:** a response with all-identical scores and no notes is a rubber-stamp → dropped from the average.
- **Vendor-bias caveat:** judging Gemini-TTS audio with a Gemini judge can bias *upward for Gemini*. The correct read: if a Gemini judge still does NOT prefer Gemini over an alternative, that conclusion is robust to the bias. Long-term hardening = a second, non-Gemini ASR for the WER pass.
- **Stated confidence %** on every verdict, with a ≥90% bar before calling anything FINAL. Voice aesthetics rarely clear 90% (I can't hear it); intelligibility via WER can.

## Format facts (encoded in the harness)
- Gemini TTS → 24kHz 16-bit mono **WAV/PCM**. App clips are **MP3** → one `ffmpeg` convert step.
- NotebookLM `download audio` → **MP4/M4A** (despite a `.wav` name; magic bytes `ftyp`). Convert with ffmpeg if reused.
- Inline-audio judge cap ≈ 3.5MB; larger files (NotebookLM ~13MB) → judge a short `ffmpeg` MP3 segment or use the Files API.

## When to escalate to the owner's ear
Only when: (a) two artifacts are within 0.3 on the weighted score AND the decision ships to production, or (b) a criterion the harness can't measure well (a specific dialect/accent preference) is the deciding factor. Otherwise the PO decides from this standard and reports the verdict + confidence.
