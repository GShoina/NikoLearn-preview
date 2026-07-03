# NikoLearn — Copy & Readability Standard

**Owner-set 2026-07-03.** Applies to ALL user-facing text (screens, cards, buttons, owl/tutor lines,
empty states, errors). The bar: **write like the best modern kids' EdTech — Duolingo, Khan Academy Kids,
Headspace for Kids.** Optimize for **parent trust + child engagement**, NOT clever writing.

## 5 principles
1. **Simple.** Shortest wording that stays clear. One idea per line. Prefer a common word over a fancy one.
   A 5-8yo (or a scanning parent) understands it in one read.
2. **Warm.** Encouraging, human, on the child's side. „ერთად შევძლებთ", „ყოჩაღ". Never cold, clinical, or
   scolding — especially on wrong answers.
3. **Practical.** Every line earns its place — it tells the user what this is or what to do. Cut anything
   decorative or redundant with what's already on screen (e.g. don't repeat a button's label in the subtitle).
4. **Trustworthy.** Concrete and honest (parents are the buyers). No hype, no vague claims. Say the real
   thing: „მონაცემები ამ მოწყობილობაზე რჩება".
5. **Scannable.** Structure for the eye: short lines, intentional line breaks (never let a phrase wrap
   mid-instruction on a phone), clear hierarchy (one bold thing per block), takeaway first.

## Layout / readability rules
- **Intentional line breaks.** On a phone a title/subtitle must break where MEANING breaks, not wherever
  the width runs out. Stack steps as separate lines/spans rather than one long wrapping sentence.
- **One emphasis per block.** One bold/large element carries the eye; supporting text is lighter/smaller.
- **Tap targets ≥ 44px.** Every button/interactive control.
- **Don't duplicate.** If cards/buttons already say it, the header shouldn't repeat it.
- **Georgian:** no em dash in displayed copy (house style); correct case/plural; natural phrasing
  (read it aloud — if a native wouldn't say it, rewrite). New Georgian copy → §6f (Gemini + owner) before live.
- **Numbers/steps:** a warm one-liner beats a paragraph; if steps matter, show them as short stacked lines,
  or let the on-screen buttons carry them.

## Before shipping any copy — quick checklist
- [ ] Would Duolingo/Khan Kids write it this plainly and warmly?
- [ ] Does every line earn its place (nothing redundant with on-screen buttons/cards)?
- [ ] On a 320-360px phone, does it break at meaning, not mid-phrase? (render-check)
- [ ] One clear emphasis per block? Scannable in one glance?
- [ ] Parent reads it and trusts it (concrete, honest, no hype)?

## Examples from this codebase
- **Entry greeting (fixed v1.32x):** was one wrapping line „მოგესალმები 👋 ჯერ გამოსცადე, მერე შექმენი პროფილი"
  → now 3 intentional lines (greeting / step 1 / step 2). Red-team note: the two steps partly duplicate the
  „გამოსცადე ახლავე" + „შექმენი პროფილი" cards below — a shorter warm subtitle is the on-standard alternative
  if the cards carry the steps.
