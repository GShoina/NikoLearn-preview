# NikoLearn SessionStart: inject bounded semantic + machine state, never the full handoff.
$ErrorActionPreference = 'SilentlyContinue'
$root = $env:CLAUDE_PROJECT_DIR
if (-not $root) { $root = 'C:\Users\gela.shonia\Documents\NGT 2020-07\AI_Projects\NikoLand' }

$sid = ''
try {
    $inputJson = [Console]::In.ReadToEnd() | ConvertFrom-Json
    if ($inputJson.session_id) { $sid = [string]$inputJson.session_id }
} catch {}

$resumePath = Join-Path $root 'docs\RESUME.md'
$resume = ''
if (Test-Path -LiteralPath $resumePath) {
    $resume = Get-Content -LiteralPath $resumePath -Raw -Encoding UTF8
} else {
    $handoff = Join-Path $root 'docs\SESSION-HANDOFF.md'
    if (Test-Path -LiteralPath $handoff) { $resume = (Get-Content -LiteralPath $handoff -TotalCount 18 -Encoding UTF8) -join "`n" }
}
if ($resume.Length -gt 2200) { $resume = $resume.Substring(0, 2200) + "`n[RESUME TRUNCATED: enforce the 2 KB cap]" }

$statePath = Join-Path $root '.recovery\current.json'
$machinePath = Join-Path $root '.recovery\current.md'
if (-not (Test-Path -LiteralPath $statePath)) {
    $external = Join-Path (Split-Path -Parent $root) 'backups\NikoLand-recovery'
    $statePath = Join-Path $external 'current.json'
    $machinePath = Join-Path $external 'current.md'
}

$machine = ''
$alert = ''
if (Test-Path -LiteralPath $machinePath) {
    $machine = Get-Content -LiteralPath $machinePath -Raw -Encoding UTF8
    if ($machine.Length -gt 2600) { $machine = $machine.Substring(0, 2600) + "`n[MACHINE CHECKPOINT TRUNCATED]" }
    try {
        $state = Get-Content -LiteralPath $statePath -Raw -Encoding UTF8 | ConvertFrom-Json
        if ($state.session_id -and [string]$state.session_id -ne $sid) {
            $alert = "`n[RECOVERY] A different prior session has a newer machine checkpoint. Use its Resume/Snapshot lines before any broad investigation.`n"
        }
    } catch {}
}

$ctx = @"
NikoLearn lean auto-resume. `docs/RESUME.md` is the ONLY startup SSOT. Load routed detail only when the current task needs it; never read the full handoff by default.

$resume
$alert
$machine
"@

$payload = @{
    hookSpecificOutput = @{
        hookEventName = 'SessionStart'
        additionalContext = $ctx
    }
}
$payload | ConvertTo-Json -Depth 6 -Compress

