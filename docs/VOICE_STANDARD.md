# Georgian Voice Standard — pronunciation-first, warm teacher
**Owner-locked 2026-06-12 · NikoLearn · for every Georgian audio clip (praise, words, syllables, sentences, talk).**

## 0. The goal
A child should hear a **warm, calm, clear Georgian teacher** talking to them. NOT an AI, a robot, a news
presenter, an audiobook narrator, or a hyped YouTube voice. Success test: the child thinks *"a real person is
talking to me."* Fail: *"this is an AI voice."*

## 1. Hard gate — pronunciation comes FIRST (before warmth, before speed)
Georgian sounds must be **clearly articulated**, never dropped or anglicised: **ღ · ყ · ძ · ჩ · ჭ · წ · ც · ხ · ჯ**.
**Never swallow a final consonant.**

**Critical reference test — „ბრავო, ყოჩაღ!"** must sound like **„ბრა-ვო, ყო-ჩაღ!"** with an audible, clean
final **„ღ"**. FAIL if:
- „ყოჩაღ" sounds like „yocha" / „ყოჩა" (final ღ gone)
- „ყ" sounds like English "y"; „ღ" sounds like English "g"
- the word ending is swallowed, or it sounds non-Georgian
- vowels are artificially lengthened, or there is a Russian/English accent

Other FAILs: English transliteration of Georgian, Latin-vowel sound, robotic syllable-by-syllable delivery.

## 2. Voice personality (the warmth gate)
Warm, soft, slight smile. Calm and unhurried. Clear articulation. Encouraging ("a mistake is fine", "let's go
slowly", "you can do it"). Child-friendly. NOT theatrical, NOT TikTok/news-anchor, NOT robotic-rhythm, NOT
over-energetic, NOT artificial excitement.

## 3. Speed + rhythm
- 0.88x–0.96x of conversational speed. Slower on hard explanations; a touch warmer on praise.
- Short natural pauses, real breathing, emphasis on key words. Not monotone, not exaggerated acting.

## 4. Priority when it conflicts
**clarity + correct Georgian pronunciation > speed > emotional performance.** A slightly slower but correct
voice always beats a fluent voice that damages words.

## 5. Current TTS recipe
- Engine: `edge-tts`, voice **`ka-GE-EkaNeural`** (Eka, warm female). Owner-picked **slower Eka** (rate −15%ish,
  pending the final ear-pick on the „ღ" fix). Male `GiorgiNeural` = owner-rejected.
- Pronunciation-safe formatting: for words where a final consonant drops, use an internal syllable hint in the
  TTS input (e.g. `ყო-ჩაღ`) — but the OUTPUT must still sound natural, not robotic. Do NOT transliterate
  Georgian into English unless the engine needs phoneme hints; prefer Georgian-aware hints.
- If edge-tts cannot articulate a sound cleanly even with hints, escalate: try another engine/voice and bring
  candidates to the owner.

## 6. QA loop — the agent CANNOT hear (owner ear-gate)
Audio quality is verified by the owner's ear, never asserted by the agent. Process: generate candidate clips
(rate / hint variants) → open a local compare page the owner plays himself (never auto-blast to his speakers,
per the silence rule) → owner picks → batch-apply that recipe to all affected clips → owner spot-confirms.

## 7. Test script (record/verify against this)
„გამარჯობა! დღეს ერთად ვისწავლით ახალ რაღაცას. თუ თავიდან რთულად მოგეჩვენება, არაუშავს. ნელა გავყვეთ და
აუცილებლად გამოგვივა. ბრავო, ყოჩაღ! ახლა ვნახოთ ეს მაგალითი." — every word whole, „ყოჩაღ" complete, ღ clear,
pauses natural, unhurried.

---
*NikoLearn-scoped. Companion to [Georgian Copy Standard](GEORGIAN_COPY_STANDARD.md): copy = how text reads,
voice = how it sounds.*
