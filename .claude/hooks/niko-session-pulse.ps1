# Compatibility wrapper for the old NB-64 Stop pulse. The durable implementation is tracked in tools/.
$ErrorActionPreference = 'SilentlyContinue'
try {
    # Read stdin as UTF-8 (not the OEM console codepage) so non-ASCII in the hook JSON is not mangled
    # before it reaches the checkpoint. Same class as recovery-checkpoint.ps1's stdin read.
    $reader = New-Object System.IO.StreamReader([Console]::OpenStandardInput(), [System.Text.Encoding]::UTF8)
    $json = $reader.ReadToEnd()
    $reader.Dispose()
    $root = $env:CLAUDE_PROJECT_DIR
    if (-not $root) { $root = 'C:\Users\gela.shonia\Documents\NGT 2020-07\AI_Projects\NikoLand' }
    $checkpoint = Join-Path $root 'tools\recovery-checkpoint.ps1'
    if (Test-Path -LiteralPath $checkpoint) {
        & $checkpoint -Root $root -Event stop -FromHook -HookJson $json *> $null
    }
} catch {}
exit 0

