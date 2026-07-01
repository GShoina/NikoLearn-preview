# NikoLearn — Readability Standard (child-facing text)
**2026-07-01, owner-requested + owner-illustrated.** Every string a child/parent READS (tutor hints,
explanations, teach cards, results, instructions) follows this standard. Trigger: a units/tens hint shipped
as a dense run-on paragraph, hard to read; the owner showed the target form (intro + bullets + conclusion).

## Why (researched best-practice for young readers)
Legibility for 5–10 yo and non-fluent readers depends less on the font and more on STRUCTURE + SPACING:
- **Line-height** 1.5–1.7 (WCAG 1.4.12 floor is 1.5; kids benefit from more air).
- **Font size** adaptive, ≥ ~1.1rem, scaling up on larger screens (`clamp()`), never a fixed px that
  looks tiny on a big phone.
- **Measure (line length)** ~45–75 chars; in a narrow bubble cap with `max-width` (~34ch) so lines don't
  run edge-to-edge.
- **Alignment** left, ragged-right. Never justified (rivers), never long centered blocks.
- **Structure over prose:** one idea per line. A multi-part instruction becomes an intro line + short
  bullet lines + a conclusion, NOT one paragraph. This is the single biggest readability win.
- **Block spacing:** clear gap between the lead, the list, and the conclusion.
- **Font:** legible, high x-height. Georgian body = `Noto Sans Georgian` (already in use). No decorative
  face for body text. Avoid long ALL-CAPS runs.

## How to apply (implementation)
CSS lives on the reading surfaces (`.ai-text`, teach card). Authors of multi-part tutor text emit:
```html
<span class="r-lead">დაშალე ათეულებად და ერთეულებად:</span>
<span class="r-item">ათეული = ათ-ათი (10, 20, 30)</span>
<span class="r-item">ერთეული = თითო (1, 2, 3)</span>
<span class="r-end">ჯერ ათეულები შეკრიბე, მერე ერთეულები.</span>
```
`.r-lead` = bold intro block · `.r-item` = a bulleted line · `.r-end` = spaced conclusion. CSS gives the
bullet, indent, line-height 1.62, adaptive size (`clamp(1.12rem,4.6vw,1.42rem)`), `max-width:34ch`,
left-align. The spoken version is unaffected (voice uses the fixed `say` clip; tags are stripped for TTS).

## Rule
- Any tutor hint/explanation with more than ~1 sentence of instruction MUST be structured (lead + items +
  end), not a run-on. Single short hints can stay plain.
- New reading surfaces inherit the `.ai-text` treatment (adaptive size + line-height + measure), never a
  fixed tiny font.

## Rollout status
- DONE: standard defined; CSS on `.ai-text`; adaptive font on `.ai-text`; units/tens hint restructured (v1.303).
- TODO (fan-out): audit every tutor function's multi-part hints (add build-a-ten, sub, kingsMath, pattern
  explain, vocab) and restructure the run-ons; extend the treatment to the teach-card lesson + results.
