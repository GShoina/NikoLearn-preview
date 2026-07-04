# NikoLearn Pass 1D, Subject Mapping and i18n Precheck

## Goal

გადამოწმდეს ორი კონკრეტული რისკი:

1. ქართული დავალება ხომ არ იღებს English teacher label-ს.
2. ენის გადართვის შემდეგ menu/UI ხომ არ რჩება ქართულად source-level მიზეზით.

## Output

ეს ფაილი არის source-backed QA report. კოდში ცვლილება არ გაკეთებულა.

## Done Criteria

- `gameSubject()` mapping შემოწმებულია.
- Georgian reading/digit modes შემოწმებულია.
- app language toggle path შემოწმებულია.
- დასკვნა Red Team-ით გადამოწმებულია.
- თითო finding-ს აქვს confidence.

Status: Done.

## Executive Verdict

ყველაზე ძლიერი finding არის teacher identity/routing bug:

`gameSubject()` რამდენიმე ქართულ/ანბანის mode-ს არ ცნობს და default-ად აბრუნებს `vocab`-ს. შემდეგ `tutor.js` non-math და non-alpha subject-ს აძლევს label-ს `ბუ · ინგლისურის მასწავლებელი`.

ეს ნიშნავს, რომ ქართული კითხვა, ციფრები, მარცვლებით აწყობა ან ქართული spelling mode შეიძლება tutor bubble-ში English teacher label-ით გამოჩნდეს.

Overall confidence: 88/100.

## Finding 1, Georgian learning modes can fall into `vocab` and show English teacher label

Priority: P1/P2.

Status: Confirmed source-level risk. Needs runtime screenshot to confirm exact visible manifestation.

Evidence:

- `NikoLearn_repo_audit/niko/owl.js:7` defines `gameSubject()`.
- `gameSubject()` maps `ka-alpha` and `en-alpha` to `alpha`, but does not map `read`, `sent`, `build`, `rtext`, `digit`, `shead`.
- Unknown modes return `vocab`.
- `NikoLearn_repo_audit/niko/tutor.js:190` computes `mathish`.
- If subject is not `alpha` and not mathish, coach name becomes `ბუ · ინგლისურის მასწავლებელი`.
- Georgian reading modes are real:
  - `NikoLearn_repo_audit/niko/alpha.js:230`, `game.mode='read'`, `game.subj='ka-alpha'`
  - `NikoLearn_repo_audit/niko/alpha.js:290`, `game.mode='sent'`, `game.subj='ka-alpha'`
  - `NikoLearn_repo_audit/niko/alpha.js:333`, `game.mode='rtext'`, `game.subj='ka-alpha'`
  - `NikoLearn_repo_audit/niko/alpha.js:378`, `game.mode='build'`, `game.subj='ka-alpha'`
  - `NikoLearn_repo_audit/niko/alpha.js:140`, `game.mode='digit'`, `game.subj='counting'`
  - `NikoLearn_repo_audit/niko/alpha.js:452`, `game.mode='shead'`, `game.subj=subj`

User impact:

ბავშვი ქართულ კითხვაში ან ციფრებში დახმარებას ითხოვს და ბუშტში შეიძლება დაინახოს `ინგლისურის მასწავლებელი`. ეს არღვევს tutor trust-ს და parent-ისთვის ქმნის შთაბეჭდილებას, რომ AI tutor „ვერ ხვდება სად არის“.

Recommended fix:

Update `gameSubject()` mapping:

- `read`, `sent`, `build`, `rtext` → `alpha` or new `reading`
- `digit` → `counting`
- `shead` should depend on `game.subj`:
  - if `game.subj==='ka-alpha'`, return `alpha`
  - if `game.subj==='en-alpha'`, return `alpha` or `vocab` depending on desired tutor label

Better product fix:

Add explicit tutor role names:

- Georgian reading: `ბუ · კითხვის მასწავლებელი`
- Georgian alphabet: `ბუ · ანბანის მასწავლებელი`
- Counting/digits: `ბუ · დათვლის მასწავლებელი`
- English: `ბუ · ინგლისურის მასწავლებელი`

Done criteria:

- In `read`, `sent`, `build`, `rtext`, `digit`, `shead(ka-alpha)`, tutor bubble never says `ინგლისურის მასწავლებელი`.
- In English modes it can still say English teacher.
- Generic fallback remains safe and does not crash.

Confidence: 92/100.

## Finding 2, fallback tutor text is safe but too generic for Georgian reading/digit modes

Priority: P2.

Status: Confirmed source-level behavior.

Evidence:

- `tutor.js` `vocab()` has a guard for modes with no `.en`.
- If `q.en` is missing, it returns generic hints:
  - `დააკვირდი სურათსა და მინიშნებას...`
  - `მოისმინე ხმა...`
- This avoids crash, but it does not teach reading, syllables, sentence comprehension or digit recognition specifically.

User impact:

The tutor does not break, but help feels generic. For a child stuck in Georgian reading, generic English/vocab-style help is weaker than a real reading hint.

Recommended fix:

Add explicit tutor functions or branches:

- `readingT(q)` for `read`, `sent`, `rtext`
- `buildT(q)` for syllable build
- `digitT(q)` for digits

Done criteria:

- Reading mode hint mentions reading/listening/word or sentence matching.
- Build mode hint mentions syllables or letters.
- Digit mode hint mentions number sound and numeral recognition.

Confidence: 88/100.

## Finding 3, language switching is not source-confirmed as broken, but coverage is partial by design

Priority: P2/P3.

Status: Not confirmed as a blocker from source only. Needs runtime check.

Evidence against the bug:

- `index.html:43` has bottom nav language button calling `openLangPicker(event)`.
- `core.js:153` defines `openLangPicker()`.
- `core.js:166` calls `setUILang(l)` from picker.
- `i18n.js:81` switches language and calls `applyLang(document.body)` when English is selected.
- `core.js:187` calls `applyLang($('#app'))` after render.
- `screens.js:58` has a gate-foot language button calling `appLang(event)`.

Evidence that partial Georgian can still remain:

- `i18n.js:35` intentionally keeps untranslated strings Georgian.
- `i18n-strings.js:875` says content stays Georgian by design.
- Dynamic strings generated after language switch need `applyLang()` or re-render.
- Some strings are generated by code with `window.UILANG` conditions, so immediate DOM translation may not update all logic-driven labels until re-render.

User impact:

If a parent switches to English, the app should be navigable in English, but some content and some dynamic labels may remain Georgian. That is not always a bug, but UI chrome should be consistent enough for navigation.

Recommended next check:

Runtime Pass 2C:

1. Open app.
2. Switch UI to English from bottom nav or gate.
3. Visit home, subject grid, math menu, English menu, parent dashboard.
4. Record which strings remain Georgian.
5. Classify each as:
   - OK content remains Georgian
   - missing chrome translation
   - stale dynamic label
   - bug

Confidence: 74/100.

## Finding 4, stale comments can mislead future audits

Priority: P3.

Status: Confirmed.

Evidence:

- `i18n.js` comment says language toggle lives only on marketing landing and is intentionally not mounted inside kids app.
- Current source has app language controls:
  - `index.html:43` bottom nav language picker
  - `screens.js:58` gate foot language button
  - `parent.js:317` parent dashboard language chips

User impact:

Not user-facing. But this misled the audit at first and can mislead future agents.

Recommended fix:

Update the comment in `i18n.js` to reflect current architecture:

- landing has injected `#langtgl`
- app has bottom nav language picker and gate language button
- parent dashboard has explicit language chips

Confidence: 95/100.

## Red Team Check

What could be wrong:

1. The teacher-label bug is source-level. Runtime might hide tutor hints in some modes or not expose coach mode by default.
2. Some modes intentionally use generic tutor to avoid overbuilding. That may be acceptable for MVP, but the English teacher label is still wrong.
3. i18n should not be judged as broken just because content remains Georgian. The code explicitly keeps learning content Georgian in English UI.
4. The language switch issue needs browser verification before claiming visible bug.

Skeptical conclusion:

The routing/teacher label issue is real enough to fix. The i18n menu issue should move to runtime verification before being filed as a bug.

## Recommended Fix Batch

Fix now:

1. Extend `gameSubject()` mapping for `read`, `sent`, `build`, `rtext`, `digit`, `shead`.
2. Add or adjust role labels so Georgian reading and counting do not show English teacher.
3. Update stale `i18n.js` comment.

Verify next:

1. Runtime language switch across core menus.
2. Tutor bubble in `read`, `digit`, `build`, `shead`.

Out of scope:

- Full i18n rewrite.
- Full tutor text rewrite.
- Visual regression.
- Audio generation.
