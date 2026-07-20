# NikoLearn — RESUME

> Startup SSOT. Hard cap: 2 KB. Semantic state only; machine state is `.recovery/current.md`.

**UPDATED:** 2026-07-21 · **v1.366 LIVE on nikolearn.com** (owner GO = GI-33)  
**LIVE (prod):** `v1.366` (`71f42b1`) · main = fully shipped · §6c-verified  
**WORKER (prod):** `nikolearn-t` deployed version `5b1ab168` — feedback-notify live  
**BRANCH NOW:** `fix/nb77-nb80-learnnav-tutorlabel` (from main) · fix wave + skills + NB-88 committed here, nothing pushed to main

## NOW — NB-88 feedback DONE + skill-first fix wave

**NB-88 SHIPPED + INBOX-VERIFIED:** parent feedback now EMAILS the owner on every submit (worker `notifyOwner()`→Brevo, commit `90591af`). Fix: form stored in KV but pushed to no one; sending from unauthenticated **bivision.ge** is DMARC-dropped → sender = authenticated **niko@bihub.ge** (never revert). Live POST → INBOX at nikolearn@outlook.com + info@bivision.ge, Georgian intact. `NOTIFY_KEY` set, key in creds env only, consented row only. 3 agent test rows purged; owner's 4 real rows kept. `a1dee02` = PI-100 Khan Academy(ka) intake.
Earlier: 3 skills in `.claude/skills/` (kid-visual-standard v1.1, build-provenance, video-tale-pipeline); NB-77/NB-80 fixed (58cdd25, tests green); W7 v2 + W8-B + owner prompt/plan in `output/`, §6c-verified.

## NEXT (sequential, token-efficient, skill-first + provenance footer)

W3 pilot: script Gemini-PASSED (`docs/W3_video-tale_pilot.md`, template #2 „რატომ, ბუბუ?", free HTML-frames path). NEXT = storyboard frames (hero=card6) → compose → QA → owner previews FINAL. Then W1 redesign to Fable-5 bar. (build-provenance v1.1 = min content-volume standard shipped.)

## OPEN — owner picks (in deliverable HTML)

1. W7 v2 design level OK to continue? · 2. W3 video: free HTML-frames (no spend, REC) vs paid tool · 3. refresh preview bench to live tip (NB-81, infra GO) · 4. TRUE path-B needs GO for ~40MB on-device model dep (§15b). Carried: NB-65/PI-89, NB-72..75 audit, NB-82/83 mislabels, wave live-push GO.

## BACKUPS / ROUTES

`backup/main-pre-v1.366` (main@8ec2916 rollback ref) + 5 dir backups (see s23/s24 handoff). Bugs → `docs/BUGFIX_TRACKER.md` · Seq → `docs/PRODUCT_ROADMAP.md` · Ideas → `docs/PRODUCT_IDEAS.md` · recovery → `tools/recover.ps1`.
