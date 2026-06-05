# NikoLearn — QA role + fix batch (owner brief 2026-06-05, sharpened)

Owner asked, as a senior UI/UX designer: design the ideal output, define success
criteria, then act autonomously until achieved. This is the sharpened spec + the
running checklist. (Source: owner's 2026-06-05 message.)

---

## A. THE ROLE — "NikoLearn QA Tester" (autonomous, repeatable, finds bugs without the owner)
A headless functional-test pass (Playwright + static checks) that the owner can re-run
or schedule weekly. It inspects 4 dimensions and reports concrete findings (screen, what,
why) with ZERO false "all good":

1. **Visual** — every screen renders; no overflow/overlap; no console errors.
2. **Audio ↔ image** — every spoken Georgian word has a recorded clip (no robot TTS);
   the spoken word matches the picture/emoji actually shown.
3. **Age-appropriateness** — content per tier (3-4 / 5 / 6-12) is correctly ordered,
   sequenced (learn before test), and physically safe.
4. **Flow / timing** — the answer is voiced BEFORE praise; pauses are correct;
   feedback phrasing is pedagogical.

Output = a dated report (console + saved file) listing each issue by dimension.

---

## B. CONCRETE FIXES found this round

| # | Issue | Ideal behaviour |
|---|-------|-----------------|
| F1 | Movement break: spoken name vs picture mismatch; some moves unsafe for 3-4yo | Emoji must faithfully picture the spoken exercise. For age 3-4 (isTiny) show ONLY safe simple moves (jumps, tip-toes, arm circles, animal walks) — no plank / one-leg hold. |
| F2 | Under-5 math jumps straight to counting; kids don't know digits yet | Insert "ისწავლე ციფრები 1-9" FIRST: numeral + word + voice (recognition), then a digit quiz, THEN "დათვალე" counting. |
| F3 | Count game ("რამდენია") doesn't voice the chosen number | Tap a number → voice it. Wrong → "{number}, კიდევ სცადე". Correct → say the number, short pause, then praise. |
| F4 | SYSTEMIC: "ყოჩაღ" shows/speaks BEFORE the answer is voiced (e.g. picks 5 → "ყოჩაღ" then "ხუთი") | Order everywhere: answer voiced → confirm correct → ~1.2s pause → praise. Never praise first. |
| F5 | No way to choose the VOICING language (ka vs en) independent of UI language | A persistent audio-language control reachable anywhere; switches spoken language instantly; separate from the ka/EN UI toggle. |
| O1 | Child picks the tutor ANIMAL (not only the owl) | A picker (🦉🐱🦁🐶🐰🐼) on profile create/edit AND reachable later; choice stored per profile; the chosen animal replaces the owl in the tutor fab + hint bubble + voice screen. Visual only — recorded ka voice unchanged. Also differentiates from Duolingo's owl (backlog #10). |

---

## C. SUCCESS CRITERIA (binary, testable)
- [ ] Age 3-4: never sees arithmetic; meets digit-learn before counting; movement pool is safe-only.
- [ ] Age <5: counting menu shows "ისწავლე ციფრები" + quiz before "დათვალე".
- [ ] Every movement exercise's spoken name matches its on-screen picture.
- [ ] Count/quiz: the number is spoken FIRST, pause, THEN praise — never reversed.
- [ ] Audio language switchable anywhere; takes effect on the next spoken item.
- [ ] QA pass runs headless and prints every console-error / missing-clip / mismatch it finds.

## D. Running status (single light track — no parallel agents, per owner's "don't overload the PC")
- [ ] F4 praise-order (systemic)  ·  [ ] F3 count voicing  ·  [ ] F2 digit-learn  ·  [ ] F1 movement safe+match  ·  [ ] F5 audio-lang selector  ·  [ ] O1 animal avatar  ·  [ ] A. QA tester script
</content>
