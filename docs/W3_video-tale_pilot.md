# W3 Video-Tale Pilot — Template #2 „რატომ, ბუბუ?"

> Status: **HERO + 7-SCENE ANIMATIC BUILT & §6c-VERIFIED. PENDING owner direction-confirm + owner KA validation (§6f) → then audio (money/§13.3 gate) + MP4.**
> Script Gemini-gate PASSED (2 fixes). Hero (card 6) rendered, mascot-lock verified (147px, centred). Animatic (all 7 scenes, one canonical `<use href="#owl">` each, captions = Gemini script) rendered + LOOKED at (day/night/dawn), loop-წესი all ≥8.
> Deliverables (output/, gitignored): `2026-07-20-W3 hero კადრი გახსნა by Niko.html` · `2026-07-20-W3 ვიდეო-ანიმატიკი რატომ ბუბუ by Niko.html` (playable) · `2026-07-20-W3 ვიდეო-ზღაპრის სცენარი Gemini-გავლილი by Niko.html` (copy-list).
> Gemini KA-QA 2026-07-20: lines 1-4,7 OK; line 5 + line 6 fixed per Gemini (idiom „მჭრის თვალებს", verb „ფხიზლობს"). Overall now ship-ready copy.
> §6c-caught bug (logged as method note): CSS `transform` float-animation on the SVG group overrode the position/scale presentation attr → mascot rendered tiny in the corner; fixed by nesting (position attr outer, float CSS on a bare wrapper). Static assertion had passed; only the LOOK caught it.
> Skill: `.claude/skills/video-tale-pipeline` v1 · Standard: kid-visual-standard v1.2 · build-provenance v1.1
> Path chosen: FREE HTML-frames (owner money-gate not triggered). Owner sees the FINAL video (step 7 = §13 gate-4).
> Created 2026-07-20. Pilot topic: **„რატომ ღვიძავს ბუბუს ღამით?"** (Why is Bubu awake at night?)
> Why this topic: TRUE fact (owls are nocturnal), uses OUR canonical mascot ბუ, satisfying simple answer for ages 4-7.

## SCRIPT (Georgian narration — ORIGINAL §11, no em dash §8)

Beat map: hook (wonder) → question → 3 discovery steps → reveal → recap/cheer. ~50s narration, ~65s with animation.

1. **HOOK** (~6s): მზე მაღლა დგას, ბავშვები ეზოში თამაშობენ. ბუბუ კი თვალებს იფშვნეტს და ამთქნარებს.
2. **QUESTION** (~6s): „ბუბუ, რატომ გეძინება, როცა ჩვენ ვთამაშობთ?" ჰკითხა პატარა ნიკომ.
3. **DISCOVERY 1** (~7s): ბუბუმ გაიღიმა. „ჩემი დიდი თვალები სიბნელეში ყველაზე კარგად ხედავს."
4. **DISCOVERY 2** (~7s): „ღამით მე მღვიძავს. ჩუმად დავფრინავ და პაწაწინა ხმასაც კი გავიგონებ."
5. **DISCOVERY 3** (~7s): „დღისით კი მზე ძალიან მჭრის თვალებს. ამიტომ ვისვენებ." *(Gemini fix: natural idiom vs calque)*
6. **REVEAL** (~8s): ანუ ბუბუ ღამის მეგობარია. ის ფხიზლობს, როცა ჩვენ გვძინავს, და ისვენებს, როცა ჩვენ ვთამაშობთ. *(Gemini fix: ფხიზლობს vs მუშაობს)*
7. **RECAP / CHEER** (~7s): აი, რატომ! დღისით ტკბილი ძილი, ღამით მხიარული ფრენა. დაუქნიე ხელი ბუბუს!

Optional English bridge (English voice clip only, never Georgian TTS): ბუბუ waves — „Good night!" (teaches one warm English phrase; owner/Gemini decide keep or cut).

## STORYBOARD (one card per beat — mascot = canonical logo ბუ, mascot-lock)

| # | Scene | On-screen text (minimal) | Narration | Dur |
|---|-------|--------------------------|-----------|-----|
| 1 | Bright day, sun high, 2 kids playing; ბუ on a branch yawning | title: „რატომ, ბუბუ?" | beat 1 | 6s |
| 2 | Kid ნიკო looks up at ბუ, question mark above | — | beat 2 | 6s |
| 3 | Close on ბუ's big round eyes; soft dark vignette shows what ბუ sees | „დიდი თვალები" | beat 3 | 7s |
| 4 | Night sky, stars, ბუ gliding silently, small ear pips | „ღამე / night" | beat 4 | 7s |
| 5 | Bright sun icon vs squinting ბუ; ბუ settles on branch | „დღე / day" | beat 5 | 7s |
| 6 | Split: kids asleep (moon) / ბუ awake — then flip | — | beat 6 | 8s |
| 7 | ბუ waves, kids wave back, warm sunrise | „აი, რატომ!" | beat 7 | 7s |

Hero frame (design first, kid-visual-standard): card 6 REVEAL split — it carries the learning payoff.

## loop-წესი self-score (each ≥8 to proceed; VERIFY brutally)

| # | Criterion | Score | Note |
|---|-----------|-------|------|
| 1 | Factually correct | 9 | Owls nocturnal; big eyes = low-light vision; acute hearing. All true. |
| 2 | Understandable from what's shown | 8 | Visuals + narration self-explain; no outside knowledge needed. |
| 3 | Logical / natural narrative | 9 | Clean wonder→Q→discovery→reveal→cheer arc, no contrived trick. |
| 4 | Natural Georgian, no em dash | 9 | Gemini KA-QA PASSED (2 fixes applied); owner is final human validator (§6f, 1-hr timeout). |
| 5 | Age-appropriate (4-7) | 9 | Short sentences, warm, concrete, one clear concept. |

Self-pass (all ≥8). Criterion 4 is provisional: script copy is NOT done until the Gemini gate passes and the owner validates (self-score ≠ validation).

## NEXT (pipeline)

DONE: 2. Gemini gate ✓ · 3-4. storyboard + hero + all-scene assets ✓ · 5. compose = self-contained HTML animatic ✓ · 6a. §6c visual QA (3 scenes LOOKed) ✓.
REMAINING → **GATED, do not force:**
- **Owner direction-confirm** on the animatic look (preview presented; if silent, §6f window applies to the copy only, not to spending on audio).
- **Audio (money/§13.3 + §15b dep gate):** 7 NEW Georgian lines are not in AUDIO_MANIFEST; producing them = EkaNeural/Azure generation (cost) OR recording. NEVER Georgian TTS at runtime. Needs owner GO.
- **MP4 compose (FFmpeg):** only after audio + direction-confirm. Then 7. OWNER PREVIEW of FINAL video (§13 gate-4) → live = separate GO.
Recommendation + default: keep the free HTML-animatic as the shippable-in-app format (no audio-spend needed; captions carry the story, autoplay + tap). Add voice ONLY if owner wants it (then it is a money decision). Default if owner silent: hold at this gate, do not spend on audio.
