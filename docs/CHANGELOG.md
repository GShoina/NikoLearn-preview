# NikoLearn — Changelog

Human-readable log. Full audit trail = git history (`git log`, 70+ commits).

## v1.80 — 2026-06-07 (stroke-order ამოწერა + bigger syllable chips)
- **✍️ ამოწერა stroke-order, virtual-pen draw.** The writing mode now shows the letter in the
  high-quality FiraGO font and a **virtual pen ✏️ draws each stroke step-by-step in the right order
  and direction** ("👀 უყურე" replays), then the child traces with the finger. Pilot strokes for
  ა ბ გ დ (KA_STROKES); other letters fall back to free trace. (Iterated: hand-drawn SVG letterforms
  looked wrong, then numbered markers were disproportionate per owner feedback, so pivoted to the
  pen-draw concept the owner described.) Stroke paths are a first pass, can be fine-tuned per letter.
  Files: `niko/alpha.js`, `niko/styles.css`, `niko/screens.js` (tile "წერა"→"ამოწერა").
- **🧩 ააწყვე syllable chips bigger + livelier** (owner feedback). Chips are larger, coloured, with
  a gentle bob animation and a "👇 აიღე მარცვალი და ჩასვი" pointer hint, so it's obvious they move.
  Slots enlarged too. `niko/styles.css`, `niko/alpha.js`.

## v1.79 — 2026-06-07 (more reading content + writing/tracing)
- **More reading content:** READING_KA 10 → **18 words** (ვაშლი, ლომი, ძაღლი, წიგნი, ბურთი, სახლი,
  მელა, ცხენი) and READING_SENT_KA 8 → **14 sentences**. All feed the read / build / sentence games.
  25 new recorded EkaNeural clips (8 words + 11 syllables + 6 sentences); full audio coverage verified
  (0 missing). Files: `niko/data.js`, `niko/audio-manifest.js`, `niko/audio/rword_*.mp3` /
  `rsyl_*.mp3` / `sent_09..14.mp3`.
- **New: ✍️ writing / tracing.** New "წერა" mode in the Georgian-alphabet menu: the child traces a
  letter with the finger over a faint guide (free practice, finger-on-canvas, like Aso's pencil
  tracing), with clear + hear-the-letter. 33 letters. Files: `niko/alpha.js` (traceLearn / traceSetup
  / traceClear), `niko/screens.js` (tile), `niko/styles.css` (.trace-*).

## v1.78 — 2026-06-06 (v2.0 feature track: interactive syllable builder)
- New **"🧩 ააწყვე"** mode in the Georgian-alphabet menu: the child ASSEMBLES the word from
  shuffled syllable chips (active, not pick-one). Each tap plays that syllable's recorded clip;
  correct assembly plays the whole word then praise; wrong resets for a retry. Tap a filled slot to
  undo. Uses READING_KA (10 words) + existing syllable clips. Files: `niko/alpha.js` (startBuild /
  nextBuild / renderBuild / buildTap / buildUndo / checkBuild), `niko/screens.js` (tile),
  `niko/games.js` (replay), `niko/styles.css` (.syl-slots/.syl-bank/.syl-slot).

## v1.77 — 2026-06-06 (v2.0 feature track: alphabet in multiple Georgian fonts)
- Alphabet "learn" cards now show each Georgian letter in **3 different Georgian typefaces**
  (Noto Sans Georgian / Noto Serif Georgian / FiraGO) under the big letter, so the child learns to
  recognise the letter across fonts (a real reading skill). Georgian alphabet only; English unchanged.
  Files: `index.html` (added Noto Serif Georgian), `niko/alpha.js` (.alpha-variants row in alphaLearn),
  `niko/styles.css`. (More distinct/handwritten fonts to follow via self-hosted BPG.)
- Process: locked the Go/Plan working protocol (CLAUDE.md §9) + NOW/PARKED board in the handoff.

## v1.76 — 2026-06-06 (#1 priority: Georgian sentence reading)
- **New: Georgian SENTENCE reading** (the #1 learning gap, Georgian-first differentiator).
  The child reads a short sentence, hears it read aloud (real recorded EkaNeural audio, never robot
  TTS), then picks the matching picture (comprehension). 8 sentences to start (subject + verb).
  New "📝 წინადადება" tile in the Georgian-alphabet menu, next to the existing "📖 კითხვა"
  (syllable→word). Files: `niko/data.js` (READING_SENT_KA), `niko/alpha.js` (sentLearn / startSentQuiz
  / nextSent / answerSent), `niko/screens.js` (menu tile), `niko/games.js` (replay), `niko/styles.css`,
  8 new `niko/audio/sent_*.mp3` clips + manifest entries.
- Note: validated that syllable→word Georgian reading already existed and works (the learning map had
  wrongly marked Georgian reading as absent; corrected). This release adds the sentence tier on top.

## v1.75 — 2026-06-06 (UX batch, owner-requested)
- **Theme button in the bottom nav** (home · 🎨 theme · abc · math). Cycles the visual themes
  (sunlit → playground → calm) and remembers the choice. `niko/tweaks.js` + `index.html`.
- **Bottom nav now shows everywhere** (home + inside games/tests, not just menus), and is
  **slimmer inside games/tests** for easier navigation. `niko/core.js`, `niko/screens.js`,
  `niko/games.js`, `niko/styles.css`.
- **Georgian voice clearer for little ones:** recorded clips (numbers, letters, all ka) now play
  ~15% slower with pitch preserved and a Web Audio loudness boost, so a small child can follow.
  `niko/audio.js`.
- **Correct answer is now voiced first, then a bigger pause before the "ბრავო/ყოჩაღ" screen** —
  the child hears the answer before the praise pops. Applied across all game modes. `niko/games.js`.
- **Subject cards gently animate** ("pick me" idle bob on the icon) on the profile screen.
  `niko/styles.css`.
- **Parent space: collapsible per-child cards.** With more than one child, profiles are collapsed
  by default (name + level + coins + accuracy); tap to expand the full detail. Cleaner layout.
  `niko/parent.js`, `niko/styles.css`.

## v1.74 — 2026-06-06
- **Clock game: real analog clock face.** Replaced the tiny emoji clock (🕐) with a drawn SVG dial
  showing the numerals 12 / 3 / 6 / 9, the hour tick divisions around the rim, and a black hour hand
  + green minute hand at the correct time. Owner request. Game logic unchanged (o'clock / half past).
  Visually verified at 3:00 and 6:30. (Fixed a sizing bug first: a global `svg{width:18px}` rule was
  shrinking the dial; the clock SVG now sets its own size inline.)
- **Privacy: moved the WhatsApp + email feedback links off the child home screen** into the
  parent space (behind the math gate), per the no-external-links-in-the-kids-app rule. The child
  home footer now shows only the version. (Audit item from v1.73, owner-approved.)

## v1.73 — 2026-06-06 (code audit + bug-fix pass, 5-agent parallel audit)
- **Bug (CRITICAL): wrong-answer mis-scoring in Listen mode.** Distractor options were de-duplicated
  only by English word, so two different words sharing one emoji (☀️ sun/sunny, 🔴 red/Mars, ⭐ star,
  etc.) could render as two identical emoji buttons. A child tapping the visually-correct emoji was
  marked wrong ~half the time. Options are now de-duplicated by what the child actually SEES in each
  mode (emoji in Listen, Georgian in Reverse, English otherwise). Verified: 0 duplicate option
  screens across 640 generated rounds (was failing before).
- **Bug (HIGH): same duplicate-option flaw in Reverse mode** (Georgian options). Same fix. Verified 0/640.
- **Bug (MED): broken back-navigation for little ones (age ≤4) in Shapes.** A tiny child entering
  Shapes had no subject set, so the in-game Back button and the results Menu button went to an
  "undefined" screen that loaded the English alphabet. Shapes now sets its subject; Back/Menu fall
  back safely to the math menu. Verified back lands on "🧮 მათემატიკა", never "undefined".
- **Copy: removed every em dash from human-facing text** (108 occurrences across app + landing),
  per the no-em-dash rule. Replaced with colon (labels), comma (clauses) or a clean break. English
  i18n re-verified (toggle still translates correctly; 0 em dashes in either language).
- Audit also cleared (no action needed): audio coverage 100% (346 clips, 0 missing/orphan), no
  secrets, no XSS sinks, GA4 fully gone from the kids' app, service-worker cache correct.
- Deferred to owner (customer-facing / by-design, logged in the audit report): feedback links on the
  home screen, Microsoft Clarity on the landing page, cosmetic login/admin codes.

## v3.4 — 2026-06-05
- Security: scanned client JS for secrets (none found). Removed owner Leads-sheet ID
  + button from the admin view. Added `docs/SECURITY_RULES.md`.

## Repo/IP hardening — 2026-06-05
- Repo made **private** (source/history/strategy no longer browseable or cloneable).
- `_config.yml`: internal docs/output excluded from the public Pages site (404).
- Proprietary LICENSE added. `output/` kept local. Live site stayed up (zero downtime).
- Weekly routines reconfigured **sourceless + email** (no GitHub login needed):
  Product Owner (competitor scan → email ideas) + Security & IP (live-file audit +
  clone-watch → email findings).

## v3.3 — 2026-06-04
- Age tiers: ages 3-4 no longer shown arithmetic (counting / alphabet / shapes only); age 5 unchanged.

## v3.2 — 2026-06-04
- Pre-reader voicing of break + level-up screens (13 new recorded ka clips).
- Content fix: school word showed a chair 🪑 but said "მაგიდა/desk" → corrected to "სკამი/chair".
- Polish: Jupiter emoji dedupe; ka sub-labels.

## v3.1 — 2026-06-04
- Removed in-app parent-phone field + external send (PII off the kids' app; privacy promise restored).
- 5-agent QA sweep: removed Georgian-mode English leaks (level names, Exam, Kings, streak, etc.).
- Fixed replay-of-phrases; login no longer pre-fills a real name.

## v3.0 — 2026-06-04
- Georgian UI sweep: all English-in-Georgian-mode menu leaks translated (EN mode unchanged).

## v2.9 — 2026-06-04
- Alphabet: 3 example words per letter (variety) + 47 new recorded ka clips (no robot voice).

## v2.8 — 2026-06-04
- New math modes: money (₾/tetri) + clock. Georgian/young-kid copy + voicing fixes.

## v2.7 — 2026-06-04
- Praise voice safety net; confirmed recorded ka clips play (the earlier "kochas" was stale cache).

## v2.6 — 2026-06-04
- New math modes: comparison (>/<), skip-counting (5s/10s), shapes.

## v2.5 — 2026-06-04
- Math gentle progression 1-20 → 1-40 → 1-70 → 1-100 (fixes "tests go above 20" for Niko).

## v2.1 – v2.4 — 2026-06-04
- v2.1 English UI language (ka/EN toggle). v2.2 web fonts + color-theme switcher.
- v2.3/v2.4 mobile menu polish (controls in hamburger; compact; palette label).

## v2.0 (baseline) — 2026-06-03
- Landing + app live; mobile hero order; GA4 proxy pending.
