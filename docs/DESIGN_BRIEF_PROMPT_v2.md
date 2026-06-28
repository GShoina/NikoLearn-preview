# NikoLearn — AI Designer Brief (master prompt) · v2
**Created 2026-06-28. v2 adds the mission/emotional/parent layer (the real competitive advantage)
on top of v1's integration contract.** Paste the prompt block below to brief an AI/human designer to
ELEVATE the existing app. After delivery, challenge the result against the Mission Test, the three
design tensions, and the quality bar.

---

ROLE
You are a world-class children's-app product designer. You are ELEVATING an existing, live app
called NikoLearn — not redesigning from zero. Every pixel you propose must drop into the current
codebase with minimal engineering. Beautiful-but-unintegratable is a failure. So is beautiful-but-
soulless: NikoLearn's edge is not its looks, it is what it does to a child.

THE MISSION IS THE SUPREME DESIGN CRITERION (read this first; it overrides everything below)
NikoLearn exists to help children become CURIOUS, CONFIDENT and CREATIVE thinkers.
That mission, not the orange owl or the Georgian language or the tech, is the product's real
competitive advantage. Therefore every major design decision must pass the MISSION TEST:
  - Does this increase the child's CURIOSITY?
  - Does this increase the child's CONFIDENCE?
  - Does this increase the child's CREATIVE thinking?
If a decision does not increase at least one of these, it does not belong in NikoLearn — no matter
how beautiful it is. State, for each hero screen you design, which of the three it serves and how.

CORE EXPERIENCE — design for discovery, not completion
Children should feel they are DISCOVERING A WORLD, not completing lessons. Navigation should create
anticipation and curiosity; every finished activity should make the child wonder "what happens next?"
Reconcile this with the product's structure: the app uses a DEFAULT Guided Journey (the recommended
next step is always obvious). So: the JOURNEY is the structure, DISCOVERY is the feeling. The next
step stays clear and unintimidating, but each step must feel like uncovering something, never like
ticking a checklist. Design exploration INTO the guided path, not as an alternative to it.

ONE EMOTIONAL QUESTION PER SCREEN (the spine of the design)
Every screen must answer exactly ONE emotional question. If a screen does not create a clear emotion,
redesign it. Anchors:
  - Home         -> "What shall we discover today?"
  - Subject-Path -> "Look how far I can go."
  - Lesson       -> "I can do this."
  - Reward       -> "I want one more."
  - Parent Space -> "My child is growing, and I can trust this."
For every screen you deliver, name its single emotional question and show how the layout produces it.

CONFIDENCE OVER BEAUTY (the tie-breaker)
Do not optimize for visual beauty alone. Optimize for the CHILD'S CONFIDENCE. A simpler screen that
helps a child succeed beats a beautiful screen that creates hesitation. When polish and clarity
conflict, clarity wins. Beauty serves confidence; it is never the goal itself.

TUTOR PERSONALITY (this is the heart of the product, not a detail)
The tutor (Niko the owl and the other tutors) is NEVER a lecturer. The tutor is:
  - curious, patient, encouraging, emotionally safe.
The tutor asks questions more often than it gives answers. It celebrates EFFORT, CURIOSITY and
THINKING, not only correctness. A wrong answer is met with warmth and "let's get there together,"
never with disappointment. This is the Amonashvili philosophy: the child must feel respected and safe.
CONSTRAINT: the tutor's "questions" are AUTHORED/scripted reactions and prompts, NOT a live AI chat
(the app is on-device with no conversational AI). Design the EXPRESSION system — face, voice cue,
small animation, and a small library of scripted encouraging/Socratic lines — not a chatbot.

REWARD PHILOSOPHY (protect the child, protect the brand)
Stars, Coins and Streaks exist to reinforce CURIOSITY, PERSISTENCE, EXPLORATION and CREATIVITY.
They must NEVER optimize a child for collecting coins. Progress should feel MEANINGFUL, not addictive.
No dark patterns, no loss-aversion pressure, no slot-machine animations. A reward should say "you grew,"
not "come back or lose your streak." Because of this purpose, give the three currencies a clear visual
HIERARCHY (one primary, others secondary) — never three equal badges competing for a child's attention.

PARENT EXPERIENCE (your real buyer)
The parent is the person who decides to trust and to pay. Every parent-facing surface must make a
parent feel: "I can trust this." Communicate CALM, SAFETY and EDUCATIONAL CREDIBILITY. The app must
NEVER resemble a gambling, ad-driven or dopamine-heavy mobile game. Parent Space should feel like a
calm, credible report from a school you respect, not a game dashboard.

PRODUCT
NikoLearn: a Georgian + English early-learning app. Mascot: Niko, a warm owl. Brand: warm orange/coral,
storybook warmth, parent-trustworthy. Ages ~4-10. 6 screen types today: Onboarding, Lesson,
Tutor-Select, Home, Subject-Path, Activities.

NON-NEGOTIABLE INTEGRATION CONTRACT (this is what makes the design shippable, not just pretty)
1. Token-based theming in OKLCH CSS variables:
   --bg --bg-tint --card --card-2 --ink --muted --faint --line --primary --primary-d
   --green --green-d --sky --sun --purple --red --radius --radius-sm --shadow --press.
   Express ALL color/spacing/radius decisions as these tokens, not raw hexes.
2. THREE themes, one layout: "Sunlit" (warm cream, coral — default), "Playground" (bright, blue bg,
   punchy red, bigger radius), "Calm" (cool grey-blue, calm blue, tighter radius). One structure that
   looks intentional in all three. Never hard-code a color that breaks a theme.
3. The owl/tutor renders through one component (tutorFace) — never a hard-coded emoji. Tutors are
   swappable art; design the FRAME and the expression system, assume the art plugs in.
4. Audio is pre-rendered clips keyed by exact text (Georgian + English neural voices already wired).
   Design audio affordances (tap-to-hear, replay) but assume playback exists.
5. Privacy is absolute: 100% on-device (localStorage), NO backend, NO accounts, NO ads, NO external
   links, NO PII, COPPA-safe. Nothing that implies login, social feed, data upload, or live AI chat.
   Parent Space is PIN-gated, on-device only.
6. PWA, offline-first. Mobile-first at 360-390px: zero horizontal overflow, no clipped chips, tap
   targets >=44px. Tablet/landscape is a scale-up, not a redesign.
7. Accessibility is a gate: all text >= WCAG 2.1 AA (>=4.5:1 normal, >=3:1 large) IN ALL THREE THEMES.
   Correct/incorrect never color-only (pair a glyph). Respect prefers-reduced-motion (calm fallback
   for every animation).
8. Copy: Georgian is primary and 100% human-quality. NEVER use the em dash (it reads as machine text)
   — use a period, comma, or "ანუ"/"მაგრამ". Georgian strings run ~30% longer than English: every
   label/button must flex for length, never truncate.
9. Keep the existing recognizable emoji vocabulary for content (animals, food, shapes). Emoji =
   content; line-icons = chrome; do not mix systems on one surface.
10. Performance: lean. No heavy frameworks, no multi-MB illustration per screen. 60fps on a mid-range phone.

PRODUCT DECISIONS (locked by the product owner — design FOR these)
1. Structure scales: Subject -> Chapter -> Level -> Activity. Subjects, levels, activities are DYNAMIC
   in number (data-driven), never hard-coded counts. Currently 6 subjects; more will be added.
2. Progression: DEFAULT = Guided Journey (obvious next step). Parent can switch to Free Exploration in
   Parent Space. Motivation = Stars + Coins + Streaks (see Reward Philosophy). Parent Dashboard shows
   progress + achievements.
3. Tutors (not "teachers"): present THROUGHOUT, react to correct/incorrect with voice + facial
   expression + simple animation (see Tutor Personality). 8 tutors for MVP; new tutors UNLOCK via
   progress/stars/achievements; system must support adding more.
4. Languages: full bilingual (Georgian + English) on every screen. "Kings" is ONE learning track
   inside the app, not the product — never make it look like the whole app.
5. Platform: mobile-first, iOS + Android + tablet. Three themes (Sunlit/Playground/Calm).

THREE DESIGN TENSIONS YOU MUST SOLVE (where great vs average shows)
A. A 4-level hierarchy (Subject>Chapter>Level>Activity) is DEEP for a 4-year-old. Make deep navigation
   FEEL shallow and obvious for the youngest, while still scaling for 10-year-olds.
B. Three currencies can clutter and confuse young kids. Use the Reward Philosophy to give them a clear
   hierarchy — one primary, others secondary.
C. Bilingual on every screen + 3 themes + age 4-10 = huge variance. Prove ONE layout survives the
   hardest case: longest Georgian string, Playground theme, smallest phone, youngest child.

QUALITY BAR (judged against concrete criteria, not vibes — and always subordinate to the Mission Test)
- "jaw-dropping / delightful": every primary action has a small, purposeful micro-interaction. Joy is
  in motion + feedback, not decoration.
- "pixel-perfect": a real spacing/sizing system (4 or 8px grid), exact type scale, exact token mapping.
  Annotate every screen with measurements.
- "premium-looking": restraint. Generous whitespace, one focal point per screen, consistent
  radius/shadow/elevation from the tokens. Premium = calm + confident, not loud + busy.
- "flawless / world-class": design EVERY state — default, press, correct, incorrect, loading, empty,
  locked/unearned, offline. A screen without its states is unfinished.
- "polished": pass your own AA-contrast + reduced-motion + 360px-overflow checklist before showing me.

BRAND LANGUAGE — learn from the best, imitate none
Learn the CRAFT PRINCIPLES of the best children's products (clarity, pacing, warmth, restraint). Do not
copy any of them. NikoLearn must develop its OWN recognizable design language — a child should know a
NikoLearn screen at a glance. Originality is a brand rule here, not a preference.

DELIVERABLES & PROCESS
Phase 1 — Polished STATIC screens for all 6 screen types. For the 3 HERO screens (Home, Subject-Path,
  Lesson) give 2-3 distinct directions so we can challenge and pick the best. Each screen: its single
  emotional question stated; which Mission-Test value it serves; annotated (tokens, spacing, type);
  shown in at least 2 of the 3 themes; with all relevant states.
Phase 2 — ONE high-fidelity interactive prototype (real clicks, animations, transitions) of the most
  important flow (Home -> Subject-Path -> a Lesson activity -> reward).
Deliver a DESIGN TOKEN SHEET mapping your decisions to the existing CSS variable names so integration
  is copy-paste.

CHALLENGE BACK (do not be a literal order-taker)
If anything here is suboptimal for a child's experience, say so and propose better BEFORE building.
Bring the 10% of ideas we did not ask for that would make a parent say "this feels worth paying for."

Begin by restating, in 5 bullets: (a) the single most important design problem to solve first, and
(b) for the Home screen, its one emotional question and which Mission-Test value it serves. Then start Phase 1.
