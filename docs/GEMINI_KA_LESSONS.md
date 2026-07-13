# GEMINI KA LESSONS — internalized Georgian-copy checklist (token-efficient internal reporting)

**Status:** ACTIVE · created 2026-07-14 · owner decision 2026-07-14 (token-efficiency of internal reporting).
**Purpose:** stop spending tokens on a live Gemini pass for INTERNAL reports. Learn from Gemini's
recurring feedback once, apply it myself every time. Customer-facing copy is NOT affected.

## The scoped policy (what changed)
- **Customer-facing copy (ships to kids/parents: in-app text, tutor lines, ka/en UI):** UNCHANGED.
  Full CLAUDE.md §6f stays mandatory — Gemini pass THEN owner validation. Non-negotiable.
- **Internal owner-facing reports (HTML in `output/`, agent docs):** NO live Gemini call by default.
  Self-apply the checklist below. Reserve a Gemini pass only for a specific phrase I genuinely
  cannot judge, not the whole document. Rationale: internal reports are read once by the owner, the
  marginal quality Gemini adds there is small, the token cost is not. (Aligns with the global
  token-efficiency directive: the cheapest token is the one never spent.)

## The checklist (recurring Gemini corrections, distilled — apply to every Georgian text I write)
1. **Do not transliterate English tech terms into Georgian letters.** Use the real Georgian word.
   - რიზონინგი → მსჯელობა · ვერსირებული → ვერსიონირებული · ალაინმენტი/"alignment" → შესაბამისობა.
   - If a term is a genuine proper name / project token, keep it in Latin (see allowlist), do not Georgian-spell it.
2. **No literal calque of English idioms.** Use the natural Georgian verb+noun collocation.
   - "ჭრის დეფექტს" → "აღმოაჩენს ხარვეზს" · "scaffolding as ტვინი" → "საფუძველი".
3. **Negation/aspect grammar.** Correct perfective negation.
   - "მე ის არა ვთქვი" → "მე ეს არ მითქვამს".
4. **§8 em dash is banned** in every human-facing string (already a rule; the check belongs here too).
   Contrast = new sentence or "მაგრამ"; pause = period; "that is" = colon; list = comma.
5. **Prefer plain over ornate.** Shortest version that stays clear (matches the compact-output rule).

## Owner-vocabulary allowlist (NEVER "correct" these — they are deliberate)
`GO` · `ფორკი` (fork) · `ინსაიტი` (insight) · `mastery-belief` · `learning` · `Preview→GO→Live` ·
any term the owner himself used in the same thread. Gemini flags these as anglicisms; they are the
owner's chosen vocabulary, so keep them verbatim.

## When to STILL call Gemini (the exceptions worth the tokens)
- Any customer-facing copy (§6f full loop — mandatory).
- A single Georgian phrase in an internal doc where I am genuinely unsure it reads naturally — pass
  that phrase, not the document.

Registered in `docs/README.md` (Standards table). Companion to `GEORGIAN_COPY_STANDARD.md` (that one
governs customer-facing gates; this one governs my own internal writing + the efficiency policy).
