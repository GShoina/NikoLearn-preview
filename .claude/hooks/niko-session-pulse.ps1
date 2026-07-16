# Compatibility wrapper for the old NB-64 Stop pulse. The durable implementation is tracked in tools/.
$ErrorActionPreference = 'SilentlyContinue'
try {
    $json = [Console]::In.ReadToEnd()
    $root = $env:CLAUDE_PROJECT_DIR
    if (-not $root) { $root = 'C:\Users\gela.shonia\Documents\NGT 2020-07\AI_Projects\NikoLand' }
    $checkpoint = Join-Path $root 'tools\recovery-checkpoint.ps1'
    if (Test-Path -LiteralPath $checkpoint) {
        & $checkpoint -Root $root -Event stop -FromHook -HookJson $json *> $null
    }
} catch {}
exit 0

