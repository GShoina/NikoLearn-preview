# NikoLand agent bootstrap

1. Read `docs/RESUME.md` first. It is the only startup state file.
2. Do not load all of `docs/SESSION-HANDOFF.md`, the tracker, roadmap, or transcripts unless `RESUME.md` routes the current task there.
3. If a prior session crashed, read `.recovery/current.md` (or run `tools/recover.ps1`) before doing any broad search. It contains the exact session, prompt, Git state, and snapshot pointer.
4. Keep `docs/RESUME.md` under 2 KB. Update it at each completed milestone with only: NOW, NEXT, owner hold, and routing links. Put detail in its existing SSOT.
5. Follow `CLAUDE.md` for project policy, safety gates, intake ledgers, and verification. Never push `main` or deploy from recovery work.

