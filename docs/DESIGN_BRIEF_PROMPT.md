# NikoLearn — AI Designer Brief (master prompt)
**Created 2026-06-28. Use this to brief an AI/human designer to ELEVATE the existing app.**
Paste the prompt block below. It encodes the product owner's locked decisions + the integration
contract (so the design is drop-in) + a quality bar with testable criteria. After the designer
delivers, challenge the result against the "three design tensions" and the "quality bar".

---

ROLE
You are a world-class children's-app product designer (think the team behind Duolingo
ABC, Khan Academy Kids, Sago Mini). You are ELEVATING an existing, live app called
NikoLearn — not redesigning from zero. Every pixel you propose must drop into the
current codebase with minimal engineering. Beautiful-but-unintegratable is a failure.

PRODUCT
NikoLearn: a Georgian + English early-learning app. Mascot: Niko, a warm owl.
Brand: warm orange/coral, storybook warmth, parent-trustworthy. Ages ~4-10.
6 screen types today: Onboarding, Lesson, Tutor-Select, Home, Subject-Path, Activities.

NON-NEGOTIABLE INTEGRATION CONTRACT (the design MUST honor these — this is what makes it shippable)
1. Token-based theming. The app is themed by CSS custom properties in OKLCH:
   --bg --bg-tint --card --card-2 --ink --muted --faint --line --primary --primary-d
   --green --green-d --sky --sun --purple --red --radius --radius-sm --shadow --press.
   Express ALL of your color/spacing/radius decisions as these tokens, not raw hexes.
2. THREE themes must all work with one layout: "Sunlit" (warm cream, coral accent — default),
   "Playground" (bright, blue bg, punchy red, bigger radius), "Calm" (cool grey-blue, calm blue,
   tighter radius). Design the structure once; it must look intentional in all three. Never
   hard-code a color that breaks a theme.
3. The owl/tutor is always rendered through one component (tutorFace) — never a hard-coded emoji.
   Tutors are swappable art; design the FRAME, assume the art plugs in.
4. Audio is pre-rendered clips keyed by exact text (Georgian + English neural voices already wired).
   Design audio affordances (tap-to-hear, replay) but assume playback exists.
5. Privacy is absolute: 100% on-device (localStorage), NO backend, NO accounts, NO ads,
   NO external links, NO PII, COPPA-safe. Do not design anything that implies a login,
   social feed, or data upload. Parent space is PIN-gated, on-device only.
6. PWA, offline-first. Mobile-first at 360-390px width: zero horizontal overflow, no clipped
   chips, large tap targets (>=44px). Tablet/landscape is a supported scale-up, not a redesign.
7. Accessibility is a gate, not a nice-to-have: all text >= WCAG 2.1 AA contrast (>=4.5:1 normal,
   >=3:1 large) IN ALL THREE THEMES. Correct/incorrect must never be color-only (pair with a
   glyph). Respect prefers-reduced-motion (provide a calm fallback for every animation).
8. Copy: Georgian is primary and 100% human-quality. NEVER use the em dash (it reads as machine
   text and breaks trust) — use a period, comma, or "ანუ"/"მაგრამ" instead. Georgian strings run
   ~30% longer than English: design every label/button to flex for length, never truncate.
9. Keep the existing recognizable emoji vocabulary set for content (animals, food, shapes) —
   do not swap it for lower-fidelity custom art. Emoji = content; line-icons = chrome. Don't mix.
10. Performance: lean. No heavy frameworks, no multi-MB illustration per screen. Animations must
    run at 60fps on a mid-range phone.

PRODUCT DECISIONS (locked by the product owner — design FOR these)
1. Structure scales: hierarchy is Subject -> Chapter -> Level -> Activity. Subjects, levels and
   activities are DYNAMIC in number (data-driven), never hard-coded counts. Currently 6 subjects;
   more will be added.
2. Progression: DEFAULT = Guided Journey (recommended next step is obvious). Parent can switch to
   Free Exploration in Parent Space. Motivation = Stars + Coins + Streaks. Parent Dashboard shows
   progress + achievements.
3. Tutors (not "teachers"): present THROUGHOUT the experience, react to correct/incorrect with
   voice + facial expression + simple animation. 8 tutors for MVP; new tutors UNLOCK via progress/
   stars/achievements; system must support adding more.
4. Languages: full bilingual (Georgian + English) on every screen. "Kings" is ONE learning track
   inside the app, not the product — never make it look like the whole app.
5. Platform: mobile-first, iOS + Android + tablet. Three themes (Sunlit/Playground/Calm).

THREE DESIGN TENSIONS YOU MUST SOLVE (do not ignore — this is where great vs average shows)
A. A 4-level hierarchy (Subject>Chapter>Level>Activity) is DEEP for a 4-year-old. Make deep
   navigation FEEL shallow and obvious for the youngest users while still scaling for 10-year-olds.
B. Three currencies (Stars + Coins + Streaks) can clutter and confuse young kids. Design a clear
   VISUAL HIERARCHY so one is primary and the others are secondary — never three equal badges
   competing for attention.
C. Bilingual on every screen + 3 themes + age 4-10 = huge variance. Prove ONE layout survives the
   hardest case: longest Georgian string, Playground theme, smallest phone, youngest child.

QUALITY BAR (your output is judged against these CONCRETE criteria, not vibes)
- "jaw-dropping / delightful": every primary action has a small, purposeful micro-interaction
  (press, reward, transition). Joy is in motion + feedback, not decoration.
- "pixel-perfect": deliver a real spacing/sizing system (4 or 8px grid), exact type scale, exact
  token mapping. Annotate every screen with measurements.
- "premium-looking": restraint. Generous whitespace, one clear focal point per screen, consistent
  radius/shadow/elevation from the tokens. Premium = calm + confident, not loud + busy.
- "flawless / world-class": design EVERY state, not just the happy path — default, hover/press,
  correct, incorrect, loading, empty, locked/unearned, offline. A screen without its states is unfinished.
- "polished": pass your own AA-contrast + reduced-motion + 360px-overflow checklist before showing me.

DELIVERABLES & PROCESS
Phase 1 — Polished STATIC screens for all 6 screen types. For the 3 HERO screens (Home,
  Subject-Path, Lesson) give 2-3 distinct directions so we can challenge and pick the best.
  Each screen: annotated (tokens, spacing, type), shown in at least 2 of the 3 themes, with all
  relevant states.
Phase 2 — ONE high-fidelity interactive prototype (real clicks, animations, transitions) of the
  single most important flow (Home -> Subject-Path -> a Lesson activity -> reward).
Deliver a short DESIGN TOKEN SHEET mapping your decisions to the existing CSS variable names so
  engineering integration is copy-paste.

CHALLENGE BACK (do not be a literal order-taker)
If anything in this brief is suboptimal for a child's experience, say so and propose better BEFORE
building. Bring the 10% of ideas we didn't ask for that would make a parent say "this feels worth paying for."

Begin by restating, in 5 bullets, your understanding of the single most important design problem to
solve first. Then start Phase 1.
