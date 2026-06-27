# NikoLearn — Design / Tone / Readability standards (2026-06-28, from the 8-dim audit)

These are the three written guides the audit flagged as missing ≥8-bar items (Dim 2 visual, Dim 5 human, Dim 3
age-fit). They mostly codify patterns already in the code so consistency rides on a standard, not on the author.

## A. Art direction (Dim 2)
- **Contrast:** all secondary/trust text must be WCAG 2.1 AA (≥4.5:1 normal, ≥3:1 large). Tokens `--faint`,
  `--green-d`, `--muted` were darkened to ≥4.6:1 in all 3 themes (v1.281). Any NEW text token must be ratio-checked
  before use (compute OKLCH→WCAG; do not eyeball).
- **Owl mascot:** render the tutor ONLY through `tutorFace(profile)` (raster `owl-logo.png` or the chosen tutor).
  Do NOT hardcode the flat 🦉 emoji — there are ~9 legacy hardcoded 🦉 to route through `tutorFace()` (open Dim-2 fix).
- **Icon language:** CHROME/nav uses the SVG line-icon set; EMOJI are reserved for CONTENT (vocab, rewards). Don't mix
  emoji icons (🌐/🎨) into the SVG nav — pick one system per surface.
- **Emoji vocab:** keep the existing recognizable set (owner: "ფიგურა=ფიგურა"); never swap for lower-fidelity art.
- **Per-release visual checklist:** no horizontal overflow at 360/390px; no clipped chips; right/wrong never
  color-only (✓/✗ glyph baked in — keep); reduced-motion respected.

## B. Tone & voice for TEXT (Dim 5) — the warm pattern, made a standard
The in-app copy is already warm and human; this freezes the pattern so it can't drift:
- **Praise = varied, never single-string:** rotate (ბრავო / შესანიშნავია / ყოჩაღ / ზუსტად / გენიოსი ხარ). Personalize
  with the child's name (`voc()`). 💛 on BOTH outcomes.
- **Wrong answers NEVER scold:** gentle, "we'll get there together" (კიდევ ცადე / თითქმის / ერთად შევძლებთ / ნუ
  დანებდები). A miss is framed as progress, not failure.
- **Hints scaffold, never give the answer** (see the Dim-7 owl rule): step-by-step, "ნელა, ნაბიჯ-ნაბიჯ", ends with
  "შენ თვითონ მიხვდები".
- **Warm, never robotic/templated:** address the child directly; parent-bonding moments ("აჩვენე დედას"); the owl is
  a kind friend, not a system. No machine-translated strings to children (Georgian = 100% human; the EN UI layer is
  currently pattern-translated — mark EN child-facing copy non-final until human-reviewed).
- No em dash (§8 / Georgian Copy Standard).

## C. Readability rubric per age band (Dim 3)
A question/text is age-appropriate only if it stays within its band's caps. Add this to the content-QA gate.
| Band | Sentence length | Vocab / concept | Glyph / text size | Cognitive load |
|---|---|---|---|---|
| **3-5** | ≤6 words, 1 clause | concrete nouns only; no abstract terms | large (≥1.3rem prompts) | **≤1 new concept per screen**; ≤4 options; picture-led |
| **6-8** | ≤10 words, 1-2 clauses | everyday vocab; one new idea per item | ≥1.1rem | ≤1 new concept; 3 options |
| **9-12** | ≤16 words | grade-level; multi-step allowed | normal | multi-step OK, but one logical thread |
- **Held success band:** first-attempt success per mode/age should sit in **70-85%**. Items measured <70% (too hard)
  or >85% (too easy) are flagged for revision. This needs the `item_result` instrument (Dim-8 backlog) to measure;
  until then, the adaptive placement diagnostic is the proxy — make it non-skippable for 9-12 (entry items too easy).
