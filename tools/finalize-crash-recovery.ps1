[CmdletBinding()]
param([string]$Root = '', [switch]$Apply)

$ErrorActionPreference = 'Stop'
if (-not $Root) { $Root = Split-Path -Parent $PSScriptRoot }
$Root = [IO.Path]::GetFullPath($Root)
if (-not $Apply) {
    Write-Output 'One transaction: backup+repair Git -> recovery tests -> QA -> install VS Code/task -> commit -> private recovery push. main/live untouched.'
    exit 0
}

& (Join-Path $Root 'tools\repair-git-objects.ps1') -Root $Root -Apply
if ($LASTEXITCODE -ne 0) { throw 'Git repair failed.' }

& node (Join-Path $Root 'qa\session-pulse.test.mjs')
if ($LASTEXITCODE -ne 0) { throw 'Crash-recovery discriminator test failed.' }
& npm --prefix $Root test
if ($LASTEXITCODE -ne 0) { throw 'Project QA gate failed.' }

& (Join-Path $Root 'tools\install-crash-recovery.ps1') -Root $Root -Apply
if ($LASTEXITCODE -ne 0) { throw 'System installation failed.' }

$normal = @(
    'AGENTS.md','.gitignore','CLAUDE.md','package.json',
    'docs/RESUME.md','docs/README.md','docs/SESSION-HANDOFF.md','docs/BUGFIX_TRACKER.md',
    'qa/session-pulse.test.mjs',
    'tools/recovery-checkpoint.ps1','tools/recover.ps1','tools/repair-git-objects.ps1',
    'tools/install-crash-recovery.ps1','tools/finalize-crash-recovery.ps1'
)
& git -C $Root add -- $normal
if ($LASTEXITCODE -ne 0) { throw 'Could not stage tracked recovery files.' }
& git -C $Root add -f -- '.claude/settings.json' '.claude/hooks/niko-handoff.ps1' '.claude/hooks/niko-session-pulse.ps1' '.vscode/settings.json'
if ($LASTEXITCODE -ne 0) { throw 'Could not force-stage project hook/editor settings.' }
& git -C $Root diff --cached --check
if ($LASTEXITCODE -ne 0) { throw 'Staged diff check failed.' }

& git -C $Root commit -m 'system(recovery): crash-proof sessions with lean resume checkpoints'
if ($LASTEXITCODE -ne 0) { throw 'Recovery system commit failed.' }
& (Join-Path $Root 'tools\recovery-checkpoint.ps1') -Root $Root -Event manual

$branch = (& git -C $Root rev-parse --abbrev-ref HEAD).Trim()
if ($branch -eq 'main') { throw 'Refusing to push recovery work from main.' }
& git -C $Root push -u origin "HEAD:refs/heads/$branch"
if ($LASTEXITCODE -ne 0) { throw 'Private recovery branch push failed; local commit and backups remain safe.' }

Write-Output "DONE: Git healthy; tests passed; task installed; committed and privately backed up on $branch. main/live unchanged."
