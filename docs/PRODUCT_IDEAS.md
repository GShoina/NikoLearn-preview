# NikoLearn — Product Ideas Backlog (living)

**Owner:** Gela Shonia · **Maintained by:** weekly "Product Owner" routine + ad-hoc.
**Last updated:** 2026-06-04 (v3.3 era)

This is the single source of truth for product ideas. Every idea is logged, scored,
and given a roadmap decision. The weekly Product Owner routine appends competitor
findings + new ideas and re-scores open ones.

## How ideas are scored
- **Impact 1-5** — value to the child's learning / parent trust / growth.
- **Effort 1-5** — build cost (1 = hours, 5 = weeks).
- **Priority = round(Impact / Effort × 2)** — higher = do sooner (quick wins float up).
- **Roadmap?** — Yes / Maybe / No (fits NikoLearn positioning: Georgian-first,
  bilingual ka/en, privacy/on-device, ages 3-12, offline, no ads).
- **Status** — Proposed → Accepted → In progress → Done / Rejected.

## Positioning guardrails (an idea must respect these)
Georgian-first (real recorded ka audio, no robot voice) · bilingual ka/en · all data
on-device, no ads, no external links in the kids' app · age-appropriate tiers
(3-4 / 5 / 6-12) · works offline (PWA) · warm, pre-reader-friendly (voiced).

---

## Backlog

| # | Idea | Source | Impact | Effort | Prio | Roadmap? | Status | Notes |
|---|------|--------|:-----:|:-----:|:----:|:--------:|--------|-------|
| 1 | English "deep": sentence building, phonics, short readable stories | session | 5 | 4 | 3 | Yes | Proposed | natural next content track (B) |
| 2 | Georgian reading ladder: syllable → word → sentence | session | 5 | 4 | 3 | Yes | Proposed | core local value, pairs with ka audio |
| 3 | More questions per existing category (less repetition) | QA | 3 | 2 | 3 | Yes | Proposed | data-only, low risk |
| 4 | Logic / memory mini-games (match pairs, odd-one-out) | session | 4 | 3 | 3 | Maybe | Proposed | breadth + variety |
| 5 | Voiced result/break sentences for pre-readers | tester (3yo) | 4 | 2 | 4 | Yes | **Done v3.2** | clips generated |
| 6 | Age-appropriate tiers (hide arithmetic for ages 3-4) | tester (3yo) | 5 | 1 | 5 | Yes | **Done v3.3** | isTiny |
| 7 | Parent weekly progress email/summary (opt-in, off-device) | session | 4 | 3 | 3 | Maybe | Proposed | privacy: explicit opt-in only |
| 8 | GA4 live metric tiles inside admin console | start of session | 2 | 3 | 1 | Maybe | Blocked | needs self-owned GCP OAuth client |
| 9 | Owl/tutor hint bodies translated in EN mode | QA | 2 | 3 | 1 | Maybe | Proposed | only matters for EN-mode users |
| 10 | Distinct mascot identity (avoid Duolingo-owl association) | owner | 2 | 3 | 1 | Maybe | Proposed | low legal risk today; brand polish |
| 11 | PWA "install to home screen" prompt + onboarding | session | 3 | 2 | 3 | Yes | Proposed | better retention for testers |
| 12 | Rewards depth: badges, daily streak goal, weekly recap | session | 3 | 3 | 2 | Maybe | Proposed | motivation, watch for over-gamification |

*(Competitor-derived ideas are appended below by the weekly Product Owner.)*

---

## Competitor analysis log
*(Each weekly run appends a dated section: competitor → notable feature → idea.)*

<!-- WEEKLY-PO-APPEND-BELOW -->

### 2026-06-04 — Scan #1 (Duolingo ABC, Khan Kids, Lingokids, Endless, ABCmouse, Gus on the Go, Busuu, Montessori, ქართული ანბანი)

**Biggest opportunity:** every major competitor is English-first; none teach the Georgian alphabet + native ka voice as a first-class subject, and in-market Georgian apps are thin alphabet-only tools (no math, no English, no tiers, no polish). NikoLearn's wedge: the one warm, privacy-safe, offline app doing Georgian **and** English **and** math with recorded native ka voice. Borrow proven mechanics, apply to Georgian-first content.

| App | Does well | Notable feature | Monetization | Borrow |
|---|---|---|---|---|
| Duolingo ABC | structured English literacy, ad-free+offline | word-highlight read-aloud; speech recognition | 100% free | word-highlight synced to our ka voice |
| Khan Academy Kids | broad free curriculum 2-8, COPPA | Kodi Bear narrator guide | 100% free | owl as persistent narrator; breadth-in-one-app |
| Lingokids | polished playlearning + life skills | parent progress dashboard; offline | $90/yr | on-device parent dashboard (privacy = feature) |
| Endless Alphabet/Numbers | beloved no-fail letter/number sound mechanic | drag-letter-into-word, each letter speaks | free + one-time IAP | **drag ka letter into word, each voices its sound** |
| ABCmouse | massive structured path 2-8 | 10 levels / 850+ lessons | $45-60/yr | step-by-step path mapped to age tiers |
| Gus on the Go | low-pressure vocab, 28 langs | native pronunciation; culture maps | one-time $3.99 | hear→see→tap vocab loop; one-time pricing |
| Busuu | speaking practice + structure | AI personalization, community | freemium + ads | speaking practice (but their ads/cloud = our anti-pattern) |
| Montessori Preschool | self-correcting Montessori, 5M families | no-fail autonomy design | $65/yr | self-correcting no-score mode for 3-5 |
| ქართული ანბანი (GE) | in-market Georgian alphabet | recognition + quizzes | free, low production | direct rival but alphabet-only — our breadth+warmth wins (quality unverified) |

**New ideas (competitor-derived):**

| Idea | Source | Impact | Effort | Prio | Roadmap? | Status |
|---|---|:--:|:--:|:--:|:--:|---|
| C1 · "Privacy & no-ads" trust badge + 1-screen parent explainer at install | Khan/Duolingo ABC | 3 | 1 | 6 | Yes | Proposed |
| C2 · Owl tutor as named, ka-voiced narrator across all subjects | Khan (Kodi Bear) | 4 | 2 | 4 | Yes | Proposed |
| C3 · Hear-word → see-picture → tap/match vocab loop (ka+en) | Gus on the Go | 4 | 2 | 4 | Yes | Proposed |
| C4 · Self-correcting, no-score/no-timer mode for ages 3-5 | Endless/Montessori | 4 | 2 | 4 | Yes | Proposed |
| C5 · Drag Georgian letter into word; each letter voices its ka sound (no fail) | Endless Alphabet | 5 | 3 | 3 | Yes | Proposed |
| C6 · Word-highlight synced to recorded ka voice in read-aloud stories | Duolingo ABC | 5 | 3 | 3 | Yes | Proposed |
| C7 · On-device parent dashboard, no cloud (privacy as the feature) | Lingokids | 4 | 3 | 3 | Yes | Proposed |
| C8 · Tiered step-by-step path mapped to 3-5 / 6-8 / 9-12 | ABCmouse | 4 | 3 | 3 | Yes | Proposed |
| C9 · GEL money + clock marketed as unique localized math module | Georgian gap | 4 | 3 | 3 | Yes | partly Done (v2.8) |
| C10 · One-time-unlock pricing option (vs subscription fatigue) for GE | Gus/Endless | 3 | 2 | 3 | Maybe | Proposed |
| C11 · Gentle daily-goal/streak (stars, not leagues), ages 6-12 only | Duolingo | 3 | 3 | 2 | Maybe | Proposed |
| C12 · Cultural micro-cards (Georgian objects/places) on vocab | Gus (maps) | 3 | 3 | 2 | Maybe | Proposed |
