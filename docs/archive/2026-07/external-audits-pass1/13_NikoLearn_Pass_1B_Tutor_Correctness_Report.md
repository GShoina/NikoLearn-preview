# NikoLearn Pass 1B, Tutor Correctness Report

## Goal

დავამტკიცოთ ან მოვხსნათ 3 მაღალი ROI tutor risk:

1. division tutor.
2. kings-math voice.
3. pattern/rebus voice.

## Output

ეს ფაილი არის source-backed bug report. ცვლილებები კოდში არ გაკეთებულა.

## Done Criteria

- თითოეული რისკი იღებს status-ს.
- თითოეულ confirmed issue-ს აქვს file/line evidence.
- თითოეულს აქვს user impact, priority და proposed done criteria.

Status: Done.

## Executive Verdict

სამიდან ორი issue დადასტურებულია source-level evidence-ით. მესამე დადასტურებულია როგორც product behavior gap, მაგრამ მისი severity დამოკიდებულია იმაზე, გვინდა თუ არა pattern/rebus-ში ხმოვანი სწავლება.

Red Team-ის შემდეგ პირველი finding დაზუსტდა: division მთლიანად არ არის broken. აპში division concept არსებობს `math-div` intro-ში და `kingsMath()`-ში. პრობლემა კონკრეტულად regular `math-div` tutor/help path-ზეა, სადაც `op:'div'` question შეიძლება explicit division branch-ის გარეშე fallback logic-ში ჩავარდეს.

Priority order:

1. Fix `math-div` tutor first.
2. Fix `kings-math` answer voice second.
3. Decide pattern/rebus voice standard third.

## Findings

### P1, regular `math-div` tutor/help path lacks explicit division handling

Status: Confirmed source-level risk. Needs runtime confirmation for exact UI manifestation.

Evidence:

- `NikoLearn_repo_audit/niko/games.js:576` defines `genMath(type)`.
- `NikoLearn_repo_audit/niko/games.js:589` creates regular `math-div` as `{ op:'div', a1:b*c, a2:b }`.
- `NikoLearn_repo_audit/niko/tutor.js:12` defines `math(q,kid)`.
- In `math(q,kid)`, visible branches cover `add`, `sub`, `mul`, `pic`, `multi`, then pattern fallback.
- No visible `op==='div'` branch exists before fallback.

User impact:

When a child asks for help in regular division drill, Niko Bu may explain it with a generic or pattern-style hint instead of teaching division. This is not just copy polish. It can teach the wrong mental model in a core math mode.

Business impact:

High. Tutor correctness is core trust. One wrong math explanation can hurt parent confidence more than a visual bug.

Recommended fix:

Add explicit `op==='div'` handling in `tutor.js math()`.

Done criteria:

- For a sample `12 ÷ 3 = 4`, tutor hint explains equal sharing or inverse multiplication.
- It does not use pattern language.
- It does not reveal the answer in the first hint.
- It is understandable for both young and older profiles.

Red Team check:

- Division is not missing everywhere. `games.js` has `MATH_WHY['math-div']`, and `kingsMath()` has a `k==='div'` tutor branch.
- The issue should not be described as „division app broken“.
- The accurate claim is narrower: regular `math-div` tutor/help lacks its own explicit division branch.

Confidence: 90/100.

Why not 100: runtime UI was not executed in this pass. Source path is strong, but exact on-screen behavior still needs one browser check.

### P1/P2, `kings-math` wrong-answer reveal is silent for numeric answers

Status: Confirmed by source path.

Evidence:

- `NikoLearn_repo_audit/niko/games.js:862` defines `answerKings`.
- `NikoLearn_repo_audit/niko/games.js:865` calls `reQueueWrong(cor, game.kind==='eng' ? 'en-US' : null)`.
- For `kings-math`, `lang` becomes `null`.
- `NikoLearn_repo_audit/niko/games.js:261` `teachAndConfirm(cor,lang,advanceFn)` only speaks if `lang` is truthy.
- `NikoLearn_repo_audit/niko/owl.js:119` fallback voice uses `q.en || q.a`, but only speaks if it is a string. Numeric answers are skipped.

User impact:

In kings-math, the child can see the correct answer, but may not hear it. For younger kids this weakens the tutor feeling and makes „Niko Bu helps me“ less consistent.

Business impact:

Medium-high. This is not as damaging as wrong math logic, but it affects the core AI tutor promise.

Recommended fix:

Choose one voice policy:

- Minimal fix: speak numeric answer as a string when answer is numeric and a safe language path exists.
- Better fix: use recorded Georgian number clips or `speakSeq()` for numbers if available.
- Product-safe fallback: if no ka voice or clip exists, show a visible „answer is X“ teach card and do not pretend voice exists.

Done criteria:

- kings-math wrong-answer second miss has predictable teach behavior.
- If audio is supported, the correct numeric answer is voiced.
- If audio is not supported, the UI clearly teaches without silent broken-feeling affordance.

### P2, pattern/rebus/model/triangle reveal has no speak path

Status: Confirmed as source behavior. Severity depends on product standard.

Evidence:

- `NikoLearn_repo_audit/niko/games.js:1159` defines `answerPattern`.
- On second miss it appends a rule card and advances after timeout.
- No `speak()`, `speakSeq()` or `reQueueWrong()` call is used in this local reveal path.
- `NikoLearn_repo_audit/niko/games.js:1265` defines `answerReason`.
- Rebus/model/triangle use the same pattern: append rule card, then timeout advance.

User impact:

If parents expect Niko Bu to „explain and encourage“, these reasoning modes feel less tutored than the rest of the app. The child gets visual help, but the owl does not speak the rule.

Business impact:

Medium. This is a consistency and perceived intelligence issue, not necessarily a blocker.

Recommended fix:

First decide the voice standard:

- Standard A: reasoning modes are visual-only because Georgian TTS is unreliable.
- Standard B: reasoning modes should speak a short safe sentence, only if a voice or clip exists.

My recommendation:

Use Standard B, but keep it short. Do not speak long Georgian rule text unless a reliable ka voice exists.

Done criteria:

- Pattern and rebus have consistent second-miss learning behavior.
- If voice is unavailable, no fake speak button or broken silence is presented.
- If voice is available, the child hears a short, useful prompt, not a long formula dump.

## Red Team

Possible objection: „MVP-ზე ხმა არ არის პრიორიტეტი.“

Answer: Agree partly. Voice is not the first fix if it only improves polish. But `math-div` is correctness, not polish. That should be fixed before growth.

Possible objection: „ყველა Georgian audio-ს გაკეთება ძვირია.“

Answer: Agree. Do not start with full audio coverage. Start with deterministic, high-frequency math explanations and numeric answers.

Possible objection: „Pattern/rebus silent behavior intentionalაა.“

Answer: Acceptable, if documented as product standard. If not documented, it will look inconsistent during parent testing.

## Recommended Fix Sprint

Sprint name: Tutor Correctness Hotfix 1.

Scope:

1. Add explicit division tutor branch.
2. Normalize numeric answer speaking policy for kings-math.
3. Decide and document pattern/rebus voice standard.

Out of scope:

- Full Georgian copy rewrite.
- Full audio manifest expansion.
- Visual redesign.
- Security hardening.

Success metric:

- Parent tester should not encounter a wrong explanation in first 10 minutes.
- Child should receive consistent help on wrong math answers.
- No new broken or silent voice button appears.
