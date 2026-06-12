# NIKO LEARN — Handoff & Architecture

> **For the Owner (ქართულად, მოკლედ):** ეს დოკუმენტი Claude Code-ისთვისაა. ხსნის როგორ არის
> აპლიკაცია აწყობილი, რა ფუნქციები აქვს, რა არის ნამდვილი „ბაგი" (კოდით გასწორებადი) და რა
> საჭიროებს რესურსს/გადაწყვეტილებას (ქართული ხმა, backend). ბოლოში — პრიორიტეტული გეგმა და წესები.

---

## 1. What this is

NIKO LEARN — an offline, privacy-first learning app for young Georgian children (ages ~5–8).
Subjects: Georgian alphabet, English (vocabulary by theme, ~100 everyday phrases, Cambridge YLE "Kings"
prep), counting, and math. A single-page app, **vanilla JS + HTML + CSS — no build step, no framework,
no runtime backend.** All progress lives in `localStorage` on the device. Zero ads, zero external links,
zero network calls.

Entry point: **`NikoLearn Phase 1.html`** (project root). Everything else lives in `niko/`.

There are two roles in this project: **the Brain** (planning/decisions, in a separate chat) and **the
Hands** (Claude Code, executes on the repo). The Owner is not a technical gate — see §8 rules.

---

## 2. Architecture — file map & load order

Originally one monolithic `app.js` (~840 lines). It was **deliberately split into small, single-topic
modules** so any future edit only needs to read/touch one small file (token-efficient for agents, safe to
change). **All functions are global** (plain `<script src>`, no modules, no bundler). Load order is fixed
in the HTML and matters:

| # | File | Responsibility | ~lines |
|---|------|----------------|--------|
| 1 | `niko/data.js` | Content: `WORDS` (13 themed categories), `PHRASES` (~100, 7 groups), `KA_ALPHA`/`EN_ALPHA`, `COUNTING`, `KINGS_ENG`, `KINGS_MATH`, `AGE_CATS` | — |
| 2 | `niko/tutor.js` | "ბუ" (owl) hint engine — algorithmic, item-specific hint text per subject | ~115 |
| 3 | `niko/core.js` | Icons, `state`, load/save, render helpers, levels, languages, **TTS (`speak`/`speakSeq`/`sayWord`)**, `pulseTap`, `spellOut` (typewriter) | ~175 |
| 4 | `niko/audio.js` | **Audio layer**: recorded-clip manifest, TTS fallback, duplicate-guard, `hasVoiceFor`. Wraps `speakOne`. Must load AFTER core | ~60 |
| 5 | `niko/screens.js` | Home, login/auth, onboarding (parent/child flow + consent), profile create + delete icon, subject menu, **category pickers (`openTopics`/`openPhraseCats`)** | ~280 |
| 6 | `niko/games.js` | Game engine: vocab (quiz/reverse/listen/spell), match, **phrases**, math (graded), counting, Kings, scoring, feedback, results | ~310 |
| 7 | `niko/owl.js` | Owl hint UI (redesigned), `speakHint`, voice/pronunciation mode, break screen | ~140 |
| 8 | `niko/alpha.js` | Alphabet module (Georgian ა–ჰ & English A–Z): learn (flip + sound) + visual-first quiz | ~135 |
| 9 | `niko/parent.js` | Parent gate (math lock), dashboard, engagement card, report export, **delete-with-consent**, BOOT | ~190 |
| 10 | `niko/tweaks.js` | In-design Tweaks panel (host edit-mode protocol) — visual theme + AI role | ~100 |
| — | `niko/styles.css` | All styles. Font: **FiraGO** (Georgian+Latin), Fredoka for numerals. Three themes via `[data-theme]`: sunlit / playground / calm | ~640 |

**Rules for adding code:** keep each file < ~300 lines and on one topic. If a file grows past that, split it.
`BOOT` (`state=load();boot();`) lives at the very end of `parent.js` — keep it last.

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
| 5 | **PWA / installable** — offline install, home-screen icon, splash | code |

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

See **`PHASE2_PROMPT.md`** for the ready-to-paste kickoff prompt that walks Claude Code through
read-only diagnose → GitHub repo → Georgian audio → backlog, on the safety ladder above.
