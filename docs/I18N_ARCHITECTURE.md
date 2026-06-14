# NikoLearn — i18n Architecture (future-proof multi-language)

**Author:** Niko · **Date:** 2026-06-14 · **Status:** design adopted; mass-translation pending owner SCOPE decision.
**Trigger:** owner wants (a) future-proof i18n so e.g. French-in-France is easy, (b) bilingual-by-default for all new work,
(c) parallel jobs so it doesn't drag into weeks. Shared challenge to the first estimate = ACCEPTED and extended below.

---

## 1. Verified facts (not assumptions)

- **i18n today = render-time DOM-walk** (`niko/i18n.js`): on language toggle it walks text nodes and swaps any that
  match `I18N_MAP` (~270 exact ka→en pairs) or one of 37 `I18N_PATTERNS` regexes. **Georgian is the source.**
- **KA-literal spread:** `data.js` ≈ 509 (clean content pool, mostly already `{ka,en}`); generators ≈ 460
  (placement 155, screens 145, tutor 91, talk 61, games 57, owl 51).
- **CONFIRMED BUG (FACT, 2026-06-14):** tutor/owl math hints are inline Georgian templates with number-slots
  (`${B} + ${need} = ${nextTen}`). Their phrases (`ათეული`, `დაითვალე თითებზე`, …) exist in `tutor.js` but are
  **0× in `i18n-strings.js`** → on EN toggle these hints **stay Georgian today**. So full-EN is NOT "additive" work
  on a clean base; the existing render-time mechanism already leaks Georgian for generated content.

**Why the DOM-walk approach can't scale to N languages:** it matches *source Georgian text*, so every new language is
another full pass of fragile string/regex matching, and any dynamic string (numbers, names) silently falls through.

---

## 2. Target architecture — locale-keyed, data-driven (standard i18n)

1. **Strings are KEYS, not matched text.** `LOCALES = { ka:{...}, en:{...}, fr:{...} }`. Render calls `t('key', vars)`
   for the active locale. **Adding French = add a `fr` column. Zero code change.** This is the single move that makes
   "French in France" easy.
2. **Content is data, translated once.** `data.js` (WORDS/PHRASES/COUNTING/SHAPES already `{ka,en}`) → extend to
   `{ka,en,fr}`. Translate as DATA in batch (LLM → Gemini QA → owner KA/native QA, §6f) — never via regex.
3. **Generators emit via `t(key, vars)`, not inline Georgian.** tutor hints, owl lines, word-problems become keyed
   bilingual templates: `t('hint.add.buildTen', {B, need, nextTen})`. **The mechanism already exists** — `parent.js`
   does exactly this ~12×; the generators just don't use it yet.
4. **Fallback chain.** Missing key in active locale → fall back to `ka` (never blank), and the fallback is explicit/
   loggable, not the current silent "stays Georgian".

---

## 3. Migration path (incremental, never big-bang)

- **Phase 0 — STANDING RULE (adopted 2026-06-14):** every NEW human-facing string is added bilingual `{ka,en}` (key +
  both values) from the start. No new ka-only literals. This stops the debt from growing while we decide scope.
- **Phase 1 — chrome strings** (~130: nav, menus, parent dashboard, game chrome) → keyed table. ~1–2 days. Makes
  navigation + parent space fully EN.
- **Phase 2 — data.js as data** (509) → batch translate. ~days.
- **Phase 3 — generators → t() templates** (tutor 91 / placement 155 / screens 145 / owl 51 / games 57 / talk 61).
  The heavy part: ~1.5–2.5 weeks done right (keyed templates), NOT 3–6 weeks fragile. **Only if generated-content EN
  is in scope** (see §5).

Also: until Phase 3 ships, EN mode should **cleanly fall back** (or hide) untranslated hints so EN never *looks* broken
(the confirmed leak in §1).

---

## 4. Parallel jobs — so it doesn't drag

The translation work parallelizes perfectly: each file/bucket is an independent unit (data.js, chrome, tutor, owl,
placement, …). Run a **team of agents** (same pattern as the 2026-06-14 audit): each agent owns one bucket →
translate → Gemini QA → return, all concurrently → owner does one native KA/native pass at the end (§6f). This is what
collapses "weeks sequential" into "days wall-clock". A `Workflow` script is the right tool when we execute.

---

## 5. The ONE decision that sets weeks vs days (OWNER)

**Does the EN toggle need the FULL learning experience (tutor hints, word-problems, owl teaching) in English at launch,
or just NAVIGATION + MENUS + PARENT DASHBOARD?**

- **Nav + parent only** → Phases 1+2, ~days, parallel-agent execution, I can start now.
- **Full learning experience** → add Phase 3; with parallel agents ~1.5–2.5 weeks, not 3–6.

Tied to AUDIENCE: NikoLearn teaches Georgian kids English, so ka UI is correct for them. Full EN pays off only for a
non-Georgian (diaspora / international) audience. **That market call is the owner's** and it decides the scope above.

---

## 6. Estimate correction (vs the first pass)

- Chrome "2–4 days" → realistically **1–2 days** (~130 strings).
- Heavy "3–6 weeks fragile (regex method)" → **1.5–2.5 weeks robust (keyed t() templates)**, less if fanned out across
  parallel agents.
- The first estimate measured one meter: "translate everything via the current (wrong) method." Two moves —
  **data-as-data** + **t()-keyed generators** — cut the cost AND raise quality. The scope question (§5) is the real lever.
