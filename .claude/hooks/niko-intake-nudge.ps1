# UserPromptSubmit hook - S14 owner-report intake nudge (stdout + exit 0 = injected as context)
# Covers S1 (dropped reports), S2 (point-fix vs class), S3 (no strategy challenge). ~30 tokens/turn.
# ASCII-only on purpose: PowerShell 5.1 misreads BOM-less UTF-8 as ANSI.
Write-Output "[NIKO INTAKE GUARD] If this owner message reports a bug/case (text, screenshot, voice): (1) FIRST append one NB-<n> row per case to docs/BUGFIX_TRACKER.md ledger and echo the id back in Georgian in the SAME reply, BEFORE analysis (CLAUDE.md S14 intake). (2) Treat it as a CLASS, not an instance - run the S14 sweep. (3) Add ONE product-owner strategy line: does this case point to a bigger product gap/opportunity than the literal fix (S4)."
exit 0
