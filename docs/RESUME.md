# NikoLearn — RESUME

> Startup SSOT. Hard cap: 2 KB. Semantic state only; machine state is `.recovery/current.md`.

**UPDATED:** 2026-07-16 · full clean branch LIVE on preview bench  
**LIVE (prod):** `v1.365` (`8ec2916`) · untouched · branch work is **NOT on nikolearn.com**  
**BRANCH:** `recover/clean-2026-07-16` (`5e4d0ff`) · 3 ahead of main · pushed to preview:main

## NOW — preview up; recovery tooling fixed

**Owner preview (PI-87):** whole clean branch built + live → **https://gshoina.github.io/NikoLearn-preview/** (HTTP 200, noindex, build 29498067965 ✅). Production Pages workflow **skipped** — `nikolearn.com` untouched. This is the "სრული ტოტი" he asked for.
**NB-68 + NB-67:** the NB-64 recovery checkpoint was dead-on-arrival (5 PS-5.1 bug sub-classes); mtime discriminator retired. Fixed in `5e4d0ff`; QA gate green; `.recovery/` gitignored. Detail → BUGFIX_TRACKER.

## NEXT — owner taps preview, then go-live gates (all owner-side)

(1) PI-87 = satisfied when he taps the URL. (2) audit #29 — drop `changes.html`+`validate.html` from `deploy-pages.yml` allowlist before prod. (3) NB-65/PI-89 TYPE gate — branch bundles frozen colour/text; hold. Recommend: preview → stage DEFECT fixes live → hold frozen slice.
_Untracked, not mine: `100_Final_Docs/` — ask owner before touching._

## OWNER HOLD

No live merge/push. §15b = merge-to-main needs his GO. **🛑 STOP-ORDER: no colour/text rewrites until NB-65 + PI-89 answered by him.**

## BACKUPS / ROUTES

3 backups present (`../NikoLand-git-safety-723ff31`, `…/git-pre-repair/20260716-145511/`, `…-quarantine/`). Bugs → `docs/BUGFIX_TRACKER.md` · Seq → `docs/PRODUCT_ROADMAP.md` · Repair+handoff detail → `docs/SESSION-HANDOFF.md` (s23) · one-command recovery → `tools/recover.ps1`.
