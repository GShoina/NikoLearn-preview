# Executive Consulting Report Standard (NikoLearn)

**Status:** ACTIVE · **Owner-issued:** 2026-07-13 (Gela) · **Scope:** every owner-facing report (the HTML dropped in `output/` per CLAUDE.md §6e). Sits ON TOP of §6e (naming/format), §6f (Gemini KA-QA), §8 (no em dash), evidence-tag rule.

## The standard (owner verbatim, ka)
> კარგი რეპორტი პირველ რიგში უნდა ზრდიდეს გადაწყვეტილების ხარისხს და არა უბრალოდ ინფორმაციის მოცულობას. მკითხველმა პირველივე გვერდზე უნდა გაიგოს მთავარი ვერდიქტი, ძირითადი ინსაიტები და რეკომენდებული გადაწყვეტილებები, ხოლო შემდგომ სექციებში ეტაპობრივად ჩავიდეს მტკიცებულებებსა და დეტალებში. ინფორმაცია უნდა იყოს დალაგებული მნიშვნელობის მიხედვით და არა ქრონოლოგიურად. ყოველი სექცია უნდა პასუხობდეს ერთ კონკრეტულ ბიზნეს კითხვას და ემსახურებოდეს ერთ მთავარ აზრს. დასკვნები უნდა ეყრდნობოდეს ფაქტებს, ხოლო დაუდასტურებელი ინფორმაცია მკაფიოდ უნდა განირჩეოდეს ჰიპოთეზებისა და დაშვებებისგან. ტექსტი უნდა იყოს ლაკონური, ბუნებრივი და პროფესიონალური ქართულით დაწერილი, ადვილად წასაკითხი როგორც C-Level მენეჯერისთვის, ისე თემის ექსპერტისთვის. ვიზუალური ელემენტები, ცხრილები და დიაგრამები გამოიყენება მხოლოდ მაშინ, როდესაც ისინი ამარტივებს აღქმას ან გადაწყვეტილების მიღებას. საბოლოო რეპორტი უნდა ჰგავდეს მაღალი დონის მენეჯმენტის საკონსულტაციო დოკუმენტს, სადაც მთავარი აქცენტი კეთდება ინსაიტებზე, ბიზნეს ღირებულებაზე, რეკომენდაციებზე და მოქმედების შემდეგ ნაბიჯებზე, ხოლო ყველა დამატებითი დეტალი რჩება დამხმარე მასალად.

## Operational checklist (apply to every report)
1. **Decision-first, not chronology-first.** Page 1 = verdict + key insights + recommended decision + next step. NEVER open with the agent's thinking-journey ("why my perspective was wrong", discovery narrative). Order by importance, top-down.
2. **One section = one business question = one main idea.** Section headers read as the question they answer.
3. **Facts vs unproven, visibly separated.** Keep the evidence tags (FACT / HYPOTHESIS / TO VALIDATE) with a one-line legend. A file-sourced "fact" = "the file asserts X", not "X is verified".
4. **Language.** Lakonuri, natural, professional Georgian, readable by C-level AND a topic expert. No jargon left untranslated: if a technical term is unavoidable, explain it once in plain Georgian. No em dash (§8).
5. **Visuals only when they simplify a decision.** Keep the card/table/panel design the owner likes; do not add visuals as decoration.
6. **Emphasis order:** insights → business value → recommendations → next steps. All supporting detail = appendix-grade, placed after.
7. **§6f Gemini pass** on the Georgian, then owner validation (1h timeout). Two allowed exceptions to Gemini's advice, learned 2026-07-13: keep words the OWNER himself uses even if flagged as anglicism (e.g. „ინსაიტი" — he uses it in this very standard; „GO" — his §7b term).
8. **Versioning for comparison.** When rebuilding an existing report to this standard, ship as a new `v2` file and KEEP v1, plus a short "რა შეიცვალა v1→v2" section, so the owner can diff.

## Reference implementation
`output/2026-07-13-Marble გრაფის ინტეგრაცია (v2, Executive) by Niko.html` = first report built to this standard (v1 kept alongside for comparison). Section order there is the canonical template: verdict card → 3 insights → recommendation (3 axes) → business value → evidence → risks+mitigations → competitive advantage → what's done → appendix (KNOW/ASSUME/AGREED/VALIDATE) → changelog.
