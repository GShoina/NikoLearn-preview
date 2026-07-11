# NIKO LEARN — Handoff & Architecture

> **Status: CANONICAL (architecture SSOT) · factual layer refreshed 2026-07-12 by CKO** (entry point,
> file map, network posture, audio state were stale since ~2026-06-12; §8 coding rules are owner-locked
> and UNCHANGED). Doc index: `docs/README.md`. Live state: `docs/SESSION-HANDOFF.md`.

> **For the Owner (ქართულად, მოკლედ):** ეს დოკუმენტი Claude Code-ისთვისაა. ხსნის როგორ არის
> აპლიკაცია აწყობილი, რა ფუნქციები აქვს, რა არის ნამდვილი „ბაგი" (კოდით გასწორებადი) და რა
> საჭიროებს რესურსს/გადაწყვეტილებას (ქართული ხმა, backend). ბოლოში — პრიორიტეტული გეგმა და წესები.

---

## 1. What this is

NIKO LEARN — an offline-capable, privacy-first learning PWA for Georgian children (ages 3–12, tiers
tiny ≤4 / young ≤5 / 6-7 worlds / reader 8+). Subjects: Georgian alphabet+reading, English (vocab,
phrases, Kings/YLE prep), counting, math, movement, drawing, talk-and-think, word-search. A single-page
app, **vanilla JS + HTML + CSS — no build step, no framework, no runtime backend for app logic.** All
learning progress lives in `localStorage` on the device. Zero ads, zero external links in the kids' app.
Network surface (all non-PII): aggregate-only telemetry to a Cloudflare Worker (`niko/analytics.js` →
`cloudflare/telemetry-worker.js`, allow-listed both ends), CF Web Analytics beacon, Google Fonts.

Entry point: **`index.html`** (app; `landing.html` = public front door; `boot()` in `niko/screens.js`
routes first-time visitors to landing, returning/authed → app). Everything else lives in `niko/`.
Live: **https://nikolearn.com** (GitHub Pages, push to `main` deploys via `.github/workflows/`).

There are two roles in this project: **the Brain** (planning/decisions, in a separate chat) and **the
Hands** (Claude Code, executes on the repo). The Owner is not a technical gate — see §8 rules.

---

## 2. Architecture — file map & load order

Originally one monolithic `app.js` (~840 lines). It was **deliberately split into small, single-topic
modules** so any future edit only needs to read/touch one small file (token-efficient for agents, safe to
change). **All functions are global** (plain `<script src>`, no modules, no bundler). Load order is fixed
in the HTML and matters:

Current module map (2026-07-12, load order = the `<script defer>` order in `index.html`; sizes are logic
lines, content tables marked ⌗):

| File | Responsibility | ~lines |
|------|----------------|--------|
| `niko/i18n.js` + `i18n-strings.js`⌗ + `i18n-landing.js`⌗ | EN overlay: ka is source of truth; `toEn` DOM-walks rendered Georgian via I18N_MAP/PATTERNS (see `docs/I18N_ARCHITECTURE.md`) | 7K+111K⌗ |
| `niko/data.js`⌗ | WORDS (13 cats) · PHRASES · KA/EN_ALPHA · COUNTING · AGE_CATS | ⌗ |
| `niko/kings-content.js`⌗ + `kings-exam.js` | Kings/YLE original question banks + exam room engine | ⌗+350 |
| `niko/core.js` | state/load/save, levels (`LEVELS`/`levelOf`), TTS wrapper `speak` (ka-gate: never EN voice on ka text), helpers | 312 |
| `niko/audio.js` + `audio-manifest.js`⌗ | Clip layer: ~1487 recorded ka mp3s (edge-tts EkaNeural), single reused `Audio` element (iOS decode-cap), first-gesture unlock, `stopAudio` on screen change | ~300+⌗ |
| `niko/metrics.js` · `analytics.js` | mastery bands · telemetry sender (CLIENT_ALLOW fail-closed mirror of worker EVENTS; `niko_owner`/DNT excluded) | 5K·15K |
| `niko/placement.js` | per-subject placement + `pathFor` learning paths (age-gated) | 434 |
| `niko/screens.js` | boot/routing, home variants (incl. ≤7 worlds home), profile create/delete+consent, APP_VERSION (canonical) | 413 |
| `niko/screens-menu.js` | subject menus, inner play-labels, nav voicing | 23K |
| `niko/worlds.js` | **THE central worlds map** (WORLDS/WORLD_INNER labels + wSay voicing; renames = 1-line edits here) | 6K |
| `niko/games.js` | ⚠ monolith: round engine + ~40 submodes (genX/nextX/answerX), MATH_LV+rampMath/bumpFlat adaptive tiers, reQueueWrong (can't guess through), results/telemetry | **1706** |
| `niko/alpha.js` | ka/en alphabet learn+quiz (visual-first) | 634 |
| `niko/tutor.js` | owl tutor engine — algorithmic, NEVER reveals the answer, strategy chosen by the numbers (count-on/make-ten/place-value) | 274 |
| `niko/owl.js` | owl hint UI, voice mode, Movement break (voiced move names) | 404 |
| `niko/talk.js`⌗ | „საუბარი და ფიქრი" card decks (ka+en parallel, voiced) | ⌗ |
| `niko/draw.js` · `stroke-data.js`⌗ · `opentype.min.js` (vendored) | drawing + letter tracing | — |
| `niko/wordsearch.js` · `firstrun.js` · `pwa-install.js` · `parent.js` · `tweaks.js` | word-search overlay · first-run voiced activation · PWA nudge · parent gate/dashboard/feedback + **BOOT (keep last)** · tweaks | 488 (parent) |
| `niko/telemetry.js` | ⚠ ORPHAN (superseded by analytics.js, referenced nowhere) — delete candidate | 84 |
| `niko/styles.css` | all styles, mobile-first clamp() | 144K |

**Rules for adding code:** keep each NEW file < ~300 lines and on one topic. (Legacy offenders exist —
`games.js` 1706 is the known monolith; do not grow it further, split when touched substantially.)
`BOOT` lives at the very end of `parent.js` — keep it last. QA gates: `npm test` (static) + pre-push
hook (visual + 6 behavioral Playwright harnesses in `qa/`). Version bumps ONLY via `bump.mjs`.

---

## 3. Data model

- localStorage key: `nikolearn_p2` (`SK` in core.js).
- `state.authed` — has entered the app at least once (no password since v1.129; auto-set on entry).
- `state.onboarded` — completed first-run onboarding.
- `state.kids` — `[{id, name, age, color, langs:['ka'|'en'|'ru'], by:'parent'|'child'}]`.
  `langs` = languages the child speaks → drives instruction/voicing language. `by` = who created the profile.
- `state[kidId]` — per-child progress:
  `{shields (=coins), streak, maxStreak, words:{en:{correct,wrong}}, phrases:{en:{correct,wrong}},
    math:{type:{correct,wrong}}, alpha:{mode:{correct,wrong}}, mathLevel:{type:idx}, sessions, totalTime,
    lastPlayed, dadMessages:[]}`.
- `isYoung(p)` = age ≤ 5 → text-light, picture-first UI (different home tiles, no level card).

### Content datasets (niko/data.js)
- `WORDS` — vocabulary in **13 themed categories** incl. `პლანეტები 🪐` and `პროფესიები 👩‍🚀`. Item `{ka, en, emoji}`.
- `PHRASES` — **~100 short everyday English phrases** in 7 groups (👋 greetings, 🙏 politeness, 🏫 school,
  🏠 home, 😊 feelings, ❓ questions, ⭐ daily). Item `{ka, en}`.
- `KA_ALPHA` (33 letters) / `EN_ALPHA` (26) — letter + example word + emoji.
- `COUNTING` — 1–10 with emoji + Georgian/English number words.
- `KINGS_ENG` / `KINGS_MATH` — Cambridge-YLE-style question banks.
- **Runtime category scoping:** `game.cat` filters `wordPool()` to one WORDS category; `game.pcat` filters
  `phrasePool()`. Both reset to `null` on `selectProfile`.

---

## 4. Feature inventory (everything built so far)

**Auth & profiles**
- No login gate (removed v1.129): landing.html is the public front door, the app opens straight to the
  profile chooser. „გასვლა (ჩაკეტვა)" from the parent space returns to the profile chooser; the parent
  space re-locks via its own PIN / math gate.
- Onboarding asks **who is setting up**: "მე მშობელი ვარ" → straight to profile creation;
  "მე ბავშვი ვარ" → **parental consent** screen first.
- Profile create: name, age, avatar colour, and **which languages the child speaks** (ka locked on; en/ru optional).
- **Delete profile** = 🗑️ icon on each home card → **consent modal** requiring the parent to *type the confirm
  word in the profile's language* (`წაშლა` / `DELETE` / `УДАЛИТЬ`); the button arms only on an exact match,
  then deletes permanently. Same delete also available in the parent dashboard (`.kh-del`).

**Math (graded + adaptive)**
- Real levels: **L1 = ±20 (1st-grade)**, then ±100, then ×/÷; menu labels now match the generator (they
  used to lie). Multiplication/pattern levels too.
- **Adaptive readiness ramp:** ≥85% bumps the child up a level; <50% drops them back — so a child who
  doesn't know 100 yet is never blocked. Level-up is announced on the results screen.
- Praise is spoken **in the child's language** (Georgian: ყოჩაღ/ბრავო…), never English-only.

**English**
- Modes: 🎯 მოისმინე (ka→en), 🔄 Reading (en→ka, **typewriter letter-by-letter reveal**),
  👂 სურათი (audio→emoji), 🧩 დააწყვილე (**two columns ka↔en**, darker selected), ✍️ დაწერე (spelling),
  💬 **ფრაზები** (everyday phrases, typewriter reveal + pick the meaning).
- 📚 **Categories** open a real picker (`openTopics`) — pick a theme and every mode is scoped to it; a chip
  shows the active theme; "🌈  all" resets. (This was the reported "categories don't navigate" bug — the old
  button just looped back to the same menu.)
- Phrases progress is stored separately in `s.phrases` so it does **not** inflate the "words learned" level count.

**Alphabet** — Georgian & English; "Learn" (flip card + sound) and a **visual-first quiz** (picture + the
missing first letter shown as a slot, finger-pulse hint) — no reading required.

**Counting** — clear "რამდენია?" prompt with countable objects; the confusing silent "listen" mode was removed.

**Owl ("ბუ") tutor** — redesigned bubble: big **🔊 მისმინე** button, step **dots** (not "hint 1/3" text a
5-yo can't read), visible **✕** close, bobbing avatar. Auto-reads for young kids. `speakHint` routes around
the missing Georgian voice (reads the English target instead of mispronouncing Georgian). Kings English
coach listen fixed.

**Parent space** (behind a math gate)
- Per-child stats + a dynamic **"გასაუმჯობესებელი"** insight: which words/math/alphabet the child is stuck on,
  written in an **actionable, encouraging ("nicely pushing")** tone — not just "well done".
- **Engagement card** (replaced the long "wins" log): sessions, total minutes, min/session, 🔥 record, plus a
  gentle healthy-use note (positive framing; warns only if a single session runs long).
- **Report export** — copies a plain-text progress summary to share with a teacher (offline; clipboard).
- Reward icon is a **🪙 coin** everywhere (was a shield). "მამას აჩვენე" → **"მამას & დედას აჩვენე"**.

**Visual** — **FiraGO** font (full Georgian + Latin, Helvetica-like, child-legible); Fredoka for numerals.
Responsive home (clamped type). Three themes via Tweaks.

---

## 5. ⚠️ Bug vs. needs-a-resource (read this before "fixing")

> **2026-07-12 status:** §5a is RESOLVED in production — ~1487 Georgian clips are generated (edge-tts
> `ka-GE-EkaNeural`, build-time via `tools/_gen_*.py`) and wired through `AUDIO_MANIFEST`; the runtime
> ka-TTS ban stands. Voice-quality SSOT: `docs/VOICE_QUALITY_STANDARD.md` (verdict: EkaNeural passes,
> do NOT re-voice). The section below is kept as the original diagnosis record.

### 5a. "მოისმინე / listen doesn't work" (Georgian) is NOT a code bug
Verified at runtime: the device exposes **5 voices, all `en-US`, zero Georgian** (`speechSynthesis.getVoices()`).
iOS never ships a Georgian voice. So **English speech works; Georgian is silent** — not because of code, but
because the Georgian voice does not exist in the browser. No code change can synthesize Georgian.

**The fix (already scaffolded):** `niko/audio.js` has `AUDIO_MANIFEST` (lowercased text → file under
`niko/audio/`). Drop recorded/pre-generated Georgian clips there and they instantly override TTS, offline,
on every device. The audio layer also has a duplicate-guard (fixes the "sound repeats" report) and
`hasVoiceFor(lang)`.

**Recommended approach (best practice, decided with the Owner — voice option "A"):** pre-generate the clips
**once** with a cloud TTS that supports `ka-GE` (Google / Azure) and **bundle the audio files** with the app.
Keeps it offline-first and iOS-safe, no runtime backend for audio. Generating + bundling is a **Claude Code
task** (it has network/credentials); the app side is ready.
Clip list: 33 Georgian letters' example words, numbers 1–20 (and above, §7), praise words (ყოჩაღ, ბრავო…),
the "რამდენია?" / "აირჩიე ასო" prompts, and the **Georgian side of the ~100 `PHRASES`** (English phrase
audio already works via TTS).

### 5b. Things that ARE ordinary code (Claude Code can do these freely)
Delete icons, UI/UX polish, new exercises/levels/categories, animations, copy changes, content expansion,
numbers above 20, etc. Everything in §4 is this kind of work.

---

## 6. What's missing to truly hand over / scale to a class of ~20

| Priority | Item | Type |
|----------|------|------|
| 1 | **Georgian audio** (pre-generated clips bundled — see §5a) | resource/decision, then code |
| 2 | **Backend** — *only if* class-sharing + central feedback are wanted: one shareable link for ~20 kids, a teacher dashboard of "where each child gets stuck", credential storage, and **real copy-protection** (logic on server). Same backend could also serve live cloud-TTS instead of bundling. **GitHub credentials live with the Claude Code agent**, so it creates/pushes the repo and stands up the backend. | architecture |
| 3 | **Content depth** — current word/phrase/question pools are prototype-sized; a real curriculum is needed for sustained use (Owner's lesson plan) | Owner curriculum + code |
| 4 | **Copy protection** — client code is inherently copyable; bundle+minify+obfuscate raises the bar but is not a guarantee. **True protection = move logic to the backend (#2)**. So "protect my idea/scripts" and "central class feedback" are the *same* architecture decision. | build step + backend |
| 5 | ~~**PWA / installable**~~ ✅ SHIPPED (manifest + sw.js network-first + install nudge `pwa-install.js`) | done |

**Fragile fact that governs the architecture:** if content/logic stays client-side, it can be copied — full
stop. The only real protection (and the only way to get a central "where are they stuck" dashboard for the
class) is a backend, which also changes the current "all data on-device" privacy promise. That single
decision is still open and is the Owner's to make.

---

## 7. Known backlog (decided, not yet built — safe for Claude Code)

- **Numbers above 20** — number-recognition mode (show numeral, hear it, match a quantity). Owner requested.
- Per-day streak tracking (current `streak` is consecutive-correct, not calendar days) for the engagement card.
- More alphabet quiz variety; Georgian spelling.
- Settings to edit a child's languages after creation.
- Grow `WORDS` / `PHRASES` / Kings banks toward a real curriculum.

---

## 8. Coding rules for Claude Code (from the Owner's operating principles)

1. **Safety ladder:** read-only diagnose → staging → production. Never run a risky change on a live site
   without an explicit "go" and a confirmed backup. The *process* is the safety, not the Owner's manual sign-off.
2. **Route gaps by type:** Owner-only facts (intent, priorities, "is this ready") → ask briefly, say "I don't
   know" rather than invent. Technically-discoverable facts (settings, file contents, metrics) → discover in a
   read-only first step, then proceed. **The Owner is never the technical gate.**
3. **Keep the module discipline:** small single-topic files; global functions; fixed `<script>` load order;
   `BOOT` last in parent.js.
4. **Don't depend on Georgian TTS at runtime** — use `AUDIO_MANIFEST` clips; **never read Georgian text with
   the English voice** (it produces gibberish — a real reported defect). Voice is a bonus, never a dependency.
5. **Visual-first for young kids:** every exercise solvable without reading; pictures/sound carry meaning;
   hit targets ≥ 44px.
6. **Privacy promise:** all data on-device unless the Owner explicitly approves a backend. No ads, no external links.
7. **The Owner is non-technical by choice** — explain in plain language, decide implementation details with
   best practice, and surface only genuine decisions (intent, priorities, money/architecture trade-offs).

---

## 9. How to run

Open `index.html` in a browser (or visit the live link). No login password (removed v1.129): the app
opens straight to the profile chooser. Parent space is behind a PIN / math gate.
To reset: parent space → "პროგრესის გასუფთავება", or clear the localStorage key `nikolearn_p2`.

(A `PHASE2_PROMPT.md` kickoff prompt was referenced here historically; the file no longer exists —
session start now follows `CLAUDE.md` → `docs/SESSION-HANDOFF.md`. Deploy runbook: SESSION-HANDOFF
"DEPLOY PROCESS" block; worker runbook: `cloudflare/DEPLOY.md`.)
