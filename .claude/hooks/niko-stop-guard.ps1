# NikoLand Stop hook. Two guards:
#   A) GATE-TRUTH (owner 2026-07-15): a declared gate must survive being computed. Fires every time.
#   B) S14 close-out: app code changed but the NB ledger untouched today. Fires max once/session.
$ErrorActionPreference = 'SilentlyContinue'
$stdin = [Console]::In.ReadToEnd()
$sid = 'nosession'; $tpath = $null
try { $j = $stdin | ConvertFrom-Json; if ($j.session_id) { $sid = $j.session_id }; if ($j.transcript_path) { $tpath = $j.transcript_path } } catch {}
$root = 'C:\Users\gela.shonia\Documents\NGT 2020-07\AI_Projects\NikoLand'

# ================================================================================================
# GUARD A - GATE-TRUTH
# ------------------------------------------------------------------------------------------------
# WHY: owner, 2026-07-15 - "იგონებ gateებს და მიზეზიებს? რომელი პროტოკოლი გავალებს რომ ამ საკითხე
# არ შეიძლია სწორი რეზონინგით გადაწყვიტო?" I had declared `Gate item: [1 live-write]` over an
# 18-commit branch because CLAUDE.md S15b says "merge to main = approval required", applying that
# line to the BRANCH without asking what each commit DOES. 13 of 18 touched zero deployed files:
# merging them leaves nikolearn.com byte-identical. Nothing ever gated them. I had invented a gate
# and spent the owner's attention on it - the exact cost S13 exists to prevent.
#
# He then asked the real question: "სისტემაში რა გაასწორე ამ ფაქტიდან?" The honest answer was
# "nothing, I wrote a markdown lesson." A doc only works if a future me reads it and remembers.
# That is a note, not a system. This is the system: the claim is now CHECKED, not trusted.
#
# HOW: if the reply declares a live-write / customer-facing gate, qa/ship-scope.mjs computes - from
# the allowlist parsed out of deploy-pages.yml - whether anything on this branch can reach a child.
# If nothing can, the gate is a fiction and the stop is refused with the computed truth attached.
# Money (3) and irreversible-delete (2) gates are NOT about the allowlist, so they pass untouched.
# ================================================================================================
if ($tpath -and (Test-Path $tpath)) {
    $lastText = ''
    try {
        $lines = Get-Content $tpath -Tail 40
        foreach ($ln in $lines) {
            $o = $ln | ConvertFrom-Json
            if ($o.type -eq 'assistant' -and $o.message.content) {
                foreach ($c in $o.message.content) { if ($c.type -eq 'text' -and $c.text) { $lastText = $c.text } }
            }
        }
    } catch {}

    # Only the two gates that are claims about what a user receives.
    if ($lastText -match 'Gate item:\s*\[?\s*(1\b|4\b|1 live-write|4 customer-facing)') {
        # Range seam: defaults to the real question (main..HEAD). Overridable ONLY so the block path
        # itself is testable - a guard whose failure branch was never executed is not a guard.
        $range = 'main..HEAD'
        if ($env:NIKO_SHIP_SCOPE_RANGE) { $range = $env:NIKO_SHIP_SCOPE_RANGE }
        $scope = ''
        try { $scope = (& node (Join-Path $root 'qa\ship-scope.mjs') $range 2>&1 | Out-String) } catch {}

        # ship-scope exits 2 and says FATAL when it cannot trust its own answer. Never convert that
        # into a verdict - an unverifiable check must stay silent, not guess in either direction.
        if ($scope -match 'nothing here reaches a child') {
            $cnt = 0
            $cf = Join-Path $env:TEMP "niko-gate-truth-$sid.count"
            if (Test-Path $cf) { $cnt = [int](Get-Content $cf) }
            if ($cnt -lt 3) {
                Set-Content -Path $cf -Value ($cnt + 1) -Encoding utf8
                $msg = '[NIKO GATE-TRUTH GUARD] You declared a live-write / customer-facing gate. It was COMPUTED and it is false: ' +
                       'no commit on this branch touches any path in deploy-pages.yml''s allowlist, so merging changes what a child sees by ZERO bytes. ' +
                       'This is the L15 failure (docs/REASONING-LESSONS.md): quoting a protocol line instead of checking what the change does. ' +
                       'Run `node qa/ship-scope.mjs` and either name the real gate or drop it and CONTINUE. ' +
                       'The owner''s own PI-87 hold is legitimate but it is HIS, not a protocol - say so plainly instead of hiding behind a gate number.'
                $out = @{ decision = 'block'; reason = $msg } | ConvertTo-Json -Compress
                Write-Output $out
                exit 0
            }
        }
    }
}

# ================================================================================================
# GUARD B - S14 close-out (unchanged), max once per session
# ================================================================================================
$flag = Join-Path $env:TEMP "niko-stop-guard-$sid.done"
if (Test-Path $flag) { exit 0 }
$st = git -C $root status --porcelain 2>$null
$codeChanged = $false
foreach ($line in $st) { if ($line -match 'niko/|index\.html|sw\.js|landing\.html') { $codeChanged = $true; break } }
$tracker = Get-Item (Join-Path $root 'docs\BUGFIX_TRACKER.md') 2>$null
$trackerFresh = ($tracker -and $tracker.LastWriteTime.Date -eq (Get-Date).Date)
if ($codeChanged -and -not $trackerFresh) {
    New-Item -ItemType File -Path $flag -Force | Out-Null
    Write-Output '{"decision":"block","reason":"[NIKO S14 GUARD, once/session] App code has uncommitted changes but docs/BUGFIX_TRACKER.md was not touched today. Before finishing: reconcile the NB ledger (append new NB rows for anything the owner reported, tick/annotate rows you fixed with class-sweep verdict), then stop."}'
    exit 0
}
exit 0
