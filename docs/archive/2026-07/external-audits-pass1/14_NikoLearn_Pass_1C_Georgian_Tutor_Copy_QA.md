# NikoLearn Pass 1C, Georgian Tutor Copy QA

## Goal

Tutor-ის ქართული ტექსტების შემოწმება NikoLearn Georgian Copy Standard-ის მიხედვით.

## Output

ეს ფაილი არის copy QA report. კოდში ცვლილება არ გაკეთებულა.

## Done Criteria

- `tutor.js` წაკითხულია UTF-8-safe რეჟიმში.
- მოძებნილია მაღალი სიგნალის ქართული defects.
- თითოეულ finding-ს აქვს severity, source და suggested wording.
- დასკვნა გადამოწმებულია Red Team-ით.
- თითოეულ finding-ს აქვს confidence.

Status: Done.

## Executive Verdict

Tutor copy ძირითადად ადამიანურია, მოკლეა და ბავშვისთვის თბილია. დიდი პრობლემა არ არის „ქართული ცუდია“. პრობლემა უფრო პრაქტიკულია: რამდენიმე typo, რამდენიმე არაბუნებრივი ფრაზა, quote hygiene და 1-2 ადგილი, სადაც ბავშვისთვის wording შეიძლება უფრო მკაფიო იყოს.

ყველაზე სასწრაფო fix არის typo-ები:

1. `ბიჯი` → `ნაბიჯი`
2. `ვკრებავთ` → `ვკრებთ`
3. `რა ხედავ?` → `რას ხედავ?`

Overall confidence: 86/100.

## Findings

### P1, typo: „ბიჯი“

Source: `NikoLearn_repo_audit/niko/tutor.js:33`

Current:

`სულ ${a2} ბიჯი.`

Issue:

`ბიჯი` typo-დ ჩანს. სწორი და ბუნებრივია `ნაბიჯი`.

Suggested:

`სულ ${a2} ნაბიჯი.`

Confidence: 98/100.

### P1, typo: „ვკრებავთ“

Source: `NikoLearn_repo_audit/niko/tutor.js:107`

Current:

`აქ ჯგუფები ერთიანდება, ანუ ვკრებავთ.`

Issue:

სწორია `ვკრებთ`, არა `ვკრებავთ`.

Suggested:

`აქ ჯგუფები ერთიანდება, ანუ ვკრებთ.`

Confidence: 98/100.

### P1, grammar: „რა ხედავ?“

Source: `NikoLearn_repo_audit/niko/tutor.js:96`

Current:

`დააკვირდი სურათს: ${q.emoji}. რა ხედავ?`

Issue:

ბუნებრივი ქართულია `რას ხედავ?`

Suggested:

`დააკვირდი სურათს: ${q.emoji}. რას ხედავ?`

Confidence: 96/100.

### P2, quote hygiene violates Georgian copy standard

Source examples:

- `NikoLearn_repo_audit/niko/tutor.js:17`
- `NikoLearn_repo_audit/niko/tutor.js:22`
- `NikoLearn_repo_audit/niko/tutor.js:96`
- `NikoLearn_repo_audit/niko/tutor.js:107`

Issue:

Several strings use Georgian opening quote `„` but close with straight quote `"`. The project standard asks for Georgian-style quotes. This is visual/copy hygiene, not a logic bug.

Suggested:

Use consistent Georgian quotes:

`„ავაშენოთ ათეული“`

`„რამდენი დარჩა“`

`„რა სხვაობაა“`

Confidence: 92/100.

### P2, awkward phrase: „დიდი რიცხვი ჯერ“

Source: `NikoLearn_repo_audit/niko/tutor.js:22`

Current:

`დიდი რიცხვი ჯერ, პატარა ნაბიჯ-ნაბიჯ დაუმატე.`

Issue:

Meaning is understandable, but phrasing is clipped and not fully natural.

Suggested:

`ჯერ დიდი რიცხვიდან დაიწყე, მერე პატარა რიცხვი ნაბიჯ-ნაბიჯ დაუმატე.`

Confidence: 88/100.

### P2, comparison wording is a bit unnatural for kids

Source: `NikoLearn_repo_audit/niko/tutor.js:132`

Current:

`ნიშნის ღია მხარე დიდი რიცხვისკენ იყურება.`

Issue:

The idea is correct, but `ღია მხარე` and `იყურება` can feel a little unnatural. For children, `გახსნილი მხარე` is clearer.

Suggested:

`ნიშნის გახსნილი მხარე დიდი რიცხვისკენ არის.`

Alternative:

`ნიშანი დიდი რიცხვისკენ იხსნება.`

Confidence: 78/100.

### P2, money wording: „მათი რიცხვები“

Source: `NikoLearn_repo_audit/niko/tutor.js:149`

Current:

`დაითვალე მონეტები: ერთმანეთს მიუმატე მათი რიცხვები.`

Issue:

`მათი რიცხვები` technically understandable, but money context needs value, not just number. A child may read it as count of coins.

Suggested:

`დაითვალე მონეტები: ერთმანეთს მიუმატე მათი მნიშვნელობები.`

More child-friendly:

`ნახე რამდენია თითო მონეტა და ერთად შეკრიბე.`

Confidence: 82/100.

### P3, phrase: „ავაშენოთ ათეული“

Source: `NikoLearn_repo_audit/niko/tutor.js:17`

Current:

`ხერხი „ავაშენოთ ათეული": ${B} + ${need} = ${nextTen}.`

Issue:

The concept is valid, but `ავაშენოთ ათეული` sounds translated/teacher-jargony. In Georgian child-facing copy, `ათეულამდე მივიყვანოთ` may land faster.

Suggested:

`ხერხი „ათეულამდე მივიყვანოთ“: ${B} + ${need} = ${nextTen}.`

Confidence: 72/100.

## Not Bugs After Red Team

### `kingsMath` multiplication wording

Source: `NikoLearn_repo_audit/niko/tutor.js:109`, data in `NikoLearn_repo_audit/niko/data.js:477-482`

Initial concern:

`${A} × ${B}: დაითვალე ${B}-ობით ${A}-ჯერ.`

Red Team result:

Data uses `hintA` as group count and `hintB` as items per group. Example: 3 cats × 4 legs. Counting by 4 three times is correct. This should not be filed as a bug unless runtime examples show confusing UI.

Confidence: 90/100.

### `რამდენი უნდა დაუმატო, რომ ${a1} გამოვიდეს?`

Source: `NikoLearn_repo_audit/niko/tutor.js:27`

Red Team result:

This is acceptable subtraction strategy wording. It teaches inverse addition and is not a defect.

Confidence: 88/100.

## Red Team Check

What could be wrong in this QA:

1. Some suggested wording may be taste, not bug. I marked those P2/P3, not P1.
2. I did not run Gemini KA-QA, and the repo standard says Georgian copy should ideally pass that gate.
3. I did not perform runtime UI review, so line-level text may appear in a context that softens the issue.
4. Owner native validation still beats my wording where nuance matters.

Skeptical conclusion:

Only the first 3 findings are clearly must-fix. Quote hygiene is also strong. The rest are improvement recommendations, not blockers.

## Recommended Fix Batch

Fix now:

1. `ბიჯი` → `ნაბიჯი`
2. `ვკრებავთ` → `ვკრებთ`
3. `რა ხედავ?` → `რას ხედავ?`
4. Georgian quote cleanup in tutor strings.

Fix if already touching `tutor.js`:

5. Improve `დიდი რიცხვი ჯერ...`
6. Improve money hint wording.
7. Consider replacing `ავაშენოთ ათეული`.

Out of scope:

- Full rewrite of tutor voice.
- Audio generation.
- Runtime visual QA.
- Code behavior fixes from Pass 1B.
