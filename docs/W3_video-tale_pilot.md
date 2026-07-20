# W3 Video-Tale Pilot — Template #2 „რატომ, ბუბუ?"

> Status: **SCRIPT Gemini-gate PASSED (2 fixes applied). PENDING owner KA validation (§6f, 1-hr timeout) → then storyboard frames.**
> Gemini KA-QA 2026-07-20: lines 1-4,7 OK; line 5 + line 6 fixed per Gemini (idiom „მჭრის თვალებს", verb „ფხიზლობს"). Overall now ship-ready copy.
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

2. **GEMINI GATE (MANDATORY)** — run all 7 narration lines + title + on-screen words through Gemini for KA naturalness/anglicism; then owner validates per §6f (1-hour timeout). ← immediate next action.
3. STORYBOARD frames (SVG+CSS, mascot-lock, one palette) → 4. ASSETS (hero = card 6 first) →
5. COMPOSE (SVG+CSS → FFmpeg, or self-contained HTML animation; captions synced to EkaNeural/recorded clips, no Georgian TTS) →
6. QA GATE (watch full video, silent audio check while owner works) → 7. OWNER PREVIEW of FINAL video (§13 gate-4).
