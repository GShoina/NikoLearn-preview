# NikoLearn — RESUME

> Startup SSOT. Hard cap: 2 KB. Semantic state only; machine state is `.recovery/current.md`.

**UPDATED:** 2026-07-21 · **v1.366 LIVE on nikolearn.com** (owner GO = GI-33)  
**LIVE (prod):** `v1.366` (`71f42b1`) · main = fully shipped · §6c-verified  
**WORKER (prod):** `nikolearn-t` deployed version `5b1ab168` — feedback-notify live  
**BRANCH NOW:** `fix/nb77-nb80-learnnav-tutorlabel` (from main) · fix wave + skills + NB-88 committed here, nothing pushed to main

## NOW — NB-88 feedback DONE + skill-first standards + fix wave

**NB-88 SHIPPED + INBOX-VERIFIED 2026-07-20/21:** parent feedback now actively EMAILS the owner on every submit (worker `notifyOwner()` → Brevo). Root cause of "reached nowhere" = form stored in KV but pushed to no one, AND sending from unauthenticated **bivision.ge** is silently dropped (DMARC) → sender switched to authenticated **niko@bihub.ge** (never revert). Live POST → email in INBOX at nikolearn@outlook.com + info@bivision.ge, Georgian intact. Key in creds env only; `NOTIFY_KEY` secret set; sends only the consented row. My 3 agent test rows purged from KV; owner's 4 real rows kept. Commits `90591af` (fix) + `a1dee02` (PI-100 Khan Academy intake).
Earlier this wave: (1) 3 SKILLS on disk `.claude/skills/` (README-registered): **kid-visual-standard v1.1**, **build-provenance**, **video-tale-pipeline**. (2) **NB-77 home btn + NB-80 tutor label FIXED** (commit 58cdd25, npm test green, §14 tables); NB-81 root cause = owner tested stale preview bench (live=v1.366). (3) **W7 v2** + (4) **W8-B** + (5) owner prompt/plan deliverable — all in `output/`, §6c-verified.

## NEXT (sequential, token-efficient, skill-first + provenance footer)

W3 pilot: script Gemini-PASSED (`docs/W3_video-tale_pilot.md`, template #2 „რატომ, ბუბუ?", free HTML-frames path). NEXT = storyboard frames (hero=card6) → compose → QA → owner previews FINAL. Then W1 redesign to Fable-5 bar. (build-provenance v1.1 = min content-volume standard shipped.)

## OPEN — owner picks (in deliverable HTML)

1. W7 v2 design level OK to continue? · 2. W3 video: free HTML-frames (no spend, REC) vs paid tool · 3. refresh preview bench to live tip (NB-81, infra GO) · 4. TRUE path-B needs GO for ~40MB on-device model dep (§15b). Carried: NB-65/PI-89, NB-72..75 audit, NB-82/83 mislabels, wave live-push GO.

## BACKUPS / ROUTES

`backup/main-pre-v1.366` (main@8ec2916 rollback ref) + 5 dir backups (see s23/s24 handoff). Bugs → `docs/BUGFIX_TRACKER.md` · Seq → `docs/PRODUCT_ROADMAP.md` · Ideas → `docs/PRODUCT_IDEAS.md` · recovery → `tools/recover.ps1`.
