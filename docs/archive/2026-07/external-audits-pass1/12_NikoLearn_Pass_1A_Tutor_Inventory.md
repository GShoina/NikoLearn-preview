# NikoLearn Pass 1A, Tutor Logic Inventory

## Goal

NikoLearn-ის tutor, ხმა, feedback და subject mapping ლოგიკის ზუსტი source map.

## Output

ეს ფაილი არის Pass 1A-ის audit inventory. აქ არ არის code change და არ არის broad audit. მიზანია შემდეგი QA ნაბიჯების სწორად დამიზნება.

## Done Criteria

- მოძებნილია tutor-ის მთავარი engine.
- მოძებნილია owl/help UI-ის entry point.
- მოძებნილია voice/TTS gate.
- მოძებნილია answer feedback/requeue flow.
- ცნობილი bug seeds მიბმულია source-მდე.
- გამოყოფილია რა არის ფაქტი და რა არის hypothesis.

Status: Done.

## Executive Verdict

Pass 1A-მ დაადასტურა, რომ მიმდინარე რისკები მოდის 3 გადაბმული ფენიდან:

1. `Tutor.build()` subject route.
2. `gameSubject()` mode-to-subject mapping.
3. voice gate, სადაც Georgian speech მხოლოდ recorded clip-ზე ან real ka voice-ზეა დამოკიდებული.

ყველაზე მაღალი რისკი ახლა არის regular `math-div` tutor/help path. `math-div` კითხვები იქმნება `op:'div'`-ით, მაგრამ `tutor.js`-ის `math()` branch-ში `op==='div'` handler არ ჩანს. ეს არ ნიშნავს, რომ division მთლიანად broken არის. `games.js`-ში division intro არსებობს და `kingsMath()`-ს აქვს division branch. ზუსტი რისკია: regular `math-div` help შეიძლება explicit division tutor-ის გარეშე დარჩეს და fallback explanation მიიღოს.

Confidence: 90/100.

## Source Map

| Area | File | Evidence | Why it matters |
|---|---|---:|---|
| Main tutor engine | `NikoLearn_repo_audit/niko/tutor.js` | line 12, line 105, line 177, line 190 | აქ იქმნება hints, explain და tutor role name. |
| Owl/help UI | `NikoLearn_repo_audit/niko/owl.js` | line 7, line 21, line 73, line 108 | აქ განისაზღვრება subject, current question და speak hint behavior. |
| Generic feedback | `NikoLearn_repo_audit/niko/games.js` | line 218, line 261 | აქ ხდება wrong answer-ის requeue და answer reveal/teach flow. |
| Math generator | `NikoLearn_repo_audit/niko/games.js` | line 576 | აქ იქმნება math modes, მათ შორის `math-div`. |
| Kings answer flow | `NikoLearn_repo_audit/niko/games.js` | line 862, line 865 | kings-math wrong answer voice flow აქ წყდება. |
| Pattern flow | `NikoLearn_repo_audit/niko/games.js` | line 1159 | pattern-ს საკუთარი reveal flow აქვს და generic tutor/speak flow-ს არ იყენებს. |
| Rebus/model/triangle flow | `NikoLearn_repo_audit/niko/games.js` | line 1185, line 1247, line 1265 | reason strands-ს საკუთარი reveal flow აქვს. |
| Core TTS | `NikoLearn_repo_audit/niko/core.js` | line 136, line 249, line 261, line 265 | Georgian voice hard gate აქ არის. |
| Audio clips wrapper | `NikoLearn_repo_audit/niko/audio.js` | line 15, line 36, line 72, line 155 | recorded clip lookup და no-ka-voice skip აქ ხდება. |
| i18n engine | `NikoLearn_repo_audit/niko/i18n.js` | line 41, line 86, line 116 | English UI mode render-time translation-ით მუშაობს. |

## Known Risk Seed Mapping

| Seed | Current status | Evidence | Confidence | Next action |
|---|---|---|---:|---|
| 11, tutor „+1 rule“, division wrong method | Confirmed source-level risk, narrowly scoped | `games.js` creates regular `math-div` with `op:'div'`, but `tutor.js math()` has add/sub/mul/pic/multi/pattern logic and no visible `op==='div'` branch. Red team note: division intro and `kingsMath()` division branch do exist, so this is not „division everywhere broken“. | High, 90/100 | Pass 1B: inspect generated `math-div` item and exact tutor output. |
| 12, Georgian task shows English teacher | Plausible mapping issue | `owl.js gameSubject()` maps only selected modes. Unknown modes fall to `vocab`; `tutor.js` names non-math/non-alpha as English teacher. | Medium-high | Pass 1D: list every mode and expected tutor role. |
| 13, kings-math tutor cannot speak raw digits | Plausible and partly sourced | `answerKings()` passes `lang=null` for kings-math wrong answer. `speakHint()` only speaks fallback answer if it is a string. Numeric answer is skipped. | High | Pass 1B: test one kings-math item and check `q.a` type. |
| 14, pattern/rebus tutor has no say | Plausible and partly sourced | `answerPattern()` and `answerReason()` append rule HTML and advance by timeout. No `speak()` or `speakSeq()` found in these local flows. | High | Pass 1B/2B: verify user-facing voice behavior. |
| 15-22, Georgian tutor text defects | Not yet judged | Text lives mostly in `tutor.js`; shell output rendered Georgian incorrectly, so exact copy QA needs UTF-8-safe extraction. | Unknown | Pass 1C: extract tutor strings safely and review them. |
| A, talk footer bespoke vs shared dock | Out of Pass 1A | Needs visual/runtime check. | Unknown | Pass 2D. |
| B, placement letter quiz answer in stem | Out of Pass 1A | Source likely `placement.js`, but not inspected yet. | Unknown | Pass 2B. |
| C, AI-fab covers lower tiles | Out of Pass 1A | Needs viewport screenshot. | Unknown | Pass 2D. |
| E, talk-q font stretched | Out of Pass 1A | Needs viewport screenshot. | Unknown | Pass 2D. |
| F, language switching menu remains Georgian | Partly scoped | `i18n.js` states app respects persisted UI language and uses render-time DOM translation, but missing keys stay Georgian by design. | Medium | Pass 1D and Pass 2C. |
| G, „აბგ“ glyph words-theme | Out of Pass 1A | Needs menu/source plus visual inspection. | Unknown | Pass 2D. |

## Red Team Notes

1. Do not call regular `math-div` risk „division is broken“. Division concept exists in intro text and in `kingsMath()`. The scoped risk is missing explicit tutor/help branch for regular `math-div`.
2. Do not call every Georgian fallback a bug. `i18n.js` explicitly says missing strings stay Georgian as a safe fallback.
3. Do not over-prioritize security here. These findings are product quality, tutor correctness and first experience issues.
4. Do not fix text from mojibake terminal output. Georgian copy must be extracted with UTF-8-safe method before editing or recommending exact wording.
5. Do not treat silence as a bug until we separate intended no-voice flows from missing voice flows.

## Pass 1B Scope

Goal: prove or disprove the highest tutor correctness risks.

Output:

- `math-div` tutor output check.
- `kings-math` answer type and voice path check.
- pattern/rebus speak path check.

Done criteria:

- Each risk has one of these statuses: Confirmed, Not reproduced, Needs runtime.
- Each confirmed issue has exact file, line and user impact.

## Token vs Outcome Forecast

Pass 1A spent low-to-medium tokens and produced high routing value. It did not yet prove all UX bugs, but it prevents wasting the next audit on random screens.

Recommended next step: Pass 1B, focused on `math-div`, `kings-math`, `pattern/rebus` voice.
