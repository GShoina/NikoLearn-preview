# NikoLearn — RESUME

> Startup SSOT. Hard cap: 2 KB. Semantic state only; machine state is `.recovery/current.md`.

**UPDATED:** 2026-07-16 · git object-store repair  
**LIVE:** `v1.365` (`8ec2916`) · **untouched, 100% safe** · branch work is **NOT live**  
**BRANCH:** `recover/s21-nb32-nb3-nb8` · **36 ahead of main**, history damaged, TIP clean

## NOW — git repair (crash of Jul 15 16:22, NB-64 family)

8 zero-byte objects from one interrupted write. **Proven safe:** main=origin/main=`8ec2916` (LIVE); branch TIP tree 100% materializable; working tree intact. **Lost (permanent, harmless):** 5 orphaned intermediate-history objects (unreachable from tip, never on origin); 3 of 8 regenerated from the working tree. **Only breakage:** full-history walk / a normal `git push` of the 36-commit branch. Content + deploy unaffected.

## NEXT — rebuild a clean branch (reversible, no gate; PUSH stays owner-gated)

1. `git checkout -b recover/clean-2026-07-16 main`
2. Materialize the intact tip tree onto it (`git read-tree recover/s21-nb32-nb3-nb8^{tree}` → checkout-index) = exact latest version from clean objects only, no corrupt object read.
3. One squash commit; body carries the 36 recovered NB-commit subjects (provenance — ჩანაცვლება ≠ წაშლა).
4. `git fsck` → clean. Old branch + 3 backups kept until owner confirms.

## OWNER HOLD

No live merge/push. **PI-87** = owner sees the new version first. §15b = merge-to-main needs his GO. The clean-branch rebuild is internal prep, NOT a deploy.
**🛑 STOP-ORDER: no colour/text rewrites until NB-65 + PI-89 answered by him.**

## BACKUPS (3, all present)

- `../NikoLand-git-safety-723ff31` — my full .git copy, pre-touch
- `../backups/NikoLand-recovery/git-pre-repair/20260716-145511/` — tool's
- `../NikoLand-git-safety-723ff31-quarantine/` — the 8 empties (moved, not deleted)

## ROUTES — load only when the task needs them

- Git repair detail → `docs/SESSION-HANDOFF.md` ▶ RESUME (s23)
- Audit (CLOSED 29/29) → `docs/AUDIT-2026-07-15-VERDICTS.md`
- Bugs → `docs/BUGFIX_TRACKER.md` · Sequence → `docs/PRODUCT_ROADMAP.md`
- Crash recovery → `.recovery/`; one-command → `tools/recover.ps1`
