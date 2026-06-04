# NikoLearn — Changelog

Human-readable log. Full audit trail = git history (`git log`, 70+ commits).

## v3.4 — 2026-06-05
- Security: scanned client JS for secrets (none found). Removed owner Leads-sheet ID
  + button from the admin view. Added `docs/SECURITY_RULES.md`.

## Repo/IP hardening — 2026-06-05
- Repo made **private** (source/history/strategy no longer browseable or cloneable).
- `_config.yml`: internal docs/output excluded from the public Pages site (404).
- Proprietary LICENSE added. `output/` kept local. Live site stayed up (zero downtime).
- Weekly routines reconfigured **sourceless + email** (no GitHub login needed):
  Product Owner (competitor scan → email ideas) + Security & IP (live-file audit +
  clone-watch → email findings).

## v3.3 — 2026-06-04
- Age tiers: ages 3-4 no longer shown arithmetic (counting / alphabet / shapes only); age 5 unchanged.

## v3.2 — 2026-06-04
- Pre-reader voicing of break + level-up screens (13 new recorded ka clips).
- Content fix: school word showed a chair 🪑 but said "მაგიდა/desk" → corrected to "სკამი/chair".
- Polish: Jupiter emoji dedupe; ka sub-labels.

## v3.1 — 2026-06-04
- Removed in-app parent-phone field + external send (PII off the kids' app; privacy promise restored).
- 5-agent QA sweep: removed Georgian-mode English leaks (level names, Exam, Kings, streak, etc.).
- Fixed replay-of-phrases; login no longer pre-fills a real name.

## v3.0 — 2026-06-04
- Georgian UI sweep: all English-in-Georgian-mode menu leaks translated (EN mode unchanged).

## v2.9 — 2026-06-04
- Alphabet: 3 example words per letter (variety) + 47 new recorded ka clips (no robot voice).

## v2.8 — 2026-06-04
- New math modes: money (₾/tetri) + clock. Georgian/young-kid copy + voicing fixes.

## v2.7 — 2026-06-04
- Praise voice safety net; confirmed recorded ka clips play (the earlier "kochas" was stale cache).

## v2.6 — 2026-06-04
- New math modes: comparison (>/<), skip-counting (5s/10s), shapes.

## v2.5 — 2026-06-04
- Math gentle progression 1-20 → 1-40 → 1-70 → 1-100 (fixes "tests go above 20" for Niko).

## v2.1 – v2.4 — 2026-06-04
- v2.1 English UI language (ka/EN toggle). v2.2 web fonts + color-theme switcher.
- v2.3/v2.4 mobile menu polish (controls in hamburger; compact; palette label).

## v2.0 (baseline) — 2026-06-03
- Landing + app live; mobile hero order; GA4 proxy pending.
