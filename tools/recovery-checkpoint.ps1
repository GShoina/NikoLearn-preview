[CmdletBinding()]
param(
    [string]$Root = '',
    [ValidateSet('manual','prompt','tool','stop','compact','session-end','scheduled')]
    [string]$Event = 'manual',
    [switch]$FromHook,
    [string]$HookJson = '',
    [int]$Retention = 40
)

# Crash-safe, token-free checkpoint writer. Hook mode must never write to stdout/stderr.
$ErrorActionPreference = 'Stop'
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

function Write-AtomicUtf8([string]$Path, [string]$Text) {
    $dir = Split-Path -Parent $Path
    if (-not (Test-Path -LiteralPath $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
    $tmp = "$Path.$([Guid]::NewGuid().ToString('N')).tmp"
    [IO.File]::WriteAllText($tmp, $Text, $utf8NoBom)
    if (Test-Path -LiteralPath $Path) {
        [IO.File]::Replace($tmp, $Path, $null)
    } else {
        [IO.File]::Move($tmp, $Path)
    }
}

function Get-Sha256([string]$Text) {
    $sha = [Security.Cryptography.SHA256]::Create()
    try {
        $bytes = [Text.Encoding]::UTF8.GetBytes($Text)
        return (($sha.ComputeHash($bytes) | ForEach-Object { $_.ToString('x2') }) -join '')
    } finally { $sha.Dispose() }
}

function Invoke-Git([string[]]$GitArgs) {
    $result = @(& git -C $script:Root @GitArgs 2>$null)
    $script:LastGitExit = $LASTEXITCODE
    return $result
}

try {
    if (-not $Root) { $Root = $env:CLAUDE_PROJECT_DIR }
    if (-not $Root) { $Root = Split-Path -Parent $PSScriptRoot }
    $Root = [IO.Path]::GetFullPath($Root)
    if (-not (Test-Path -LiteralPath (Join-Path $Root '.git'))) { throw "Not a Git project: $Root" }

    $localDir = Join-Path $Root '.recovery'
    $backupDir = Join-Path (Split-Path -Parent $Root) 'backups\NikoLand-recovery'
    $snapshotRoot = Join-Path $backupDir 'snapshots'
    New-Item -ItemType Directory -Path $localDir -Force | Out-Null
    New-Item -ItemType Directory -Path $snapshotRoot -Force | Out-Null

    $currentJsonPath = Join-Path $localDir 'current.json'
    $previous = $null
    if (Test-Path -LiteralPath $currentJsonPath) {
        try { $previous = Get-Content -LiteralPath $currentJsonPath -Raw -Encoding UTF8 | ConvertFrom-Json } catch {}
    }

    if ($FromHook -and -not $HookJson) { $HookJson = [Console]::In.ReadToEnd() }
    $hook = $null
    if ($HookJson) { try { $hook = $HookJson | ConvertFrom-Json } catch {} }

    $sessionId = if ($hook -and $hook.session_id) { [string]$hook.session_id } elseif ($previous) { [string]$previous.session_id } else { '' }
    $transcript = if ($hook -and $hook.transcript_path) { [string]$hook.transcript_path } elseif ($previous) { [string]$previous.transcript_path } else { '' }
    $launchCwd = if ($hook -and $hook.cwd) { [string]$hook.cwd } elseif ($previous -and $previous.launch_cwd) { [string]$previous.launch_cwd } else { $Root }

    $lastOwner = if ($previous -and $previous.last_owner_message) { [string]$previous.last_owner_message } else { '' }
    if ($hook -and $hook.prompt) { $lastOwner = [string]$hook.prompt }
    $lastOwner = ($lastOwner -replace '\s+', ' ').Trim()
    if ($lastOwner.Length -gt 600) { $lastOwner = $lastOwner.Substring(0, 600) + ' ...' }

    $branch = (Invoke-Git @('rev-parse','--abbrev-ref','HEAD') | Select-Object -First 1)
    $head = (Invoke-Git @('rev-parse','--short=12','HEAD') | Select-Object -First 1)
    $ahead = (Invoke-Git @('rev-list','--count','main..HEAD') | Select-Object -First 1)
    $lastCommit = (Invoke-Git @('log','-1','--pretty=%s') | Select-Object -First 1)
    $status = @(Invoke-Git @('-c','core.quotepath=false','status','--porcelain=v1','--untracked-files=all') | Where-Object { $_ })

    $signature = New-Object System.Collections.Generic.List[string]
    foreach ($line in $status) {
        $signature.Add([string]$line)
        if ($line.Length -lt 4) { continue }
        $rel = $line.Substring(3).Trim('"')
        if ($rel -match ' -> ') { $rel = ($rel -split ' -> ')[-1].Trim('"') }
        try {
            $full = [IO.Path]::GetFullPath((Join-Path $Root $rel))
            if (Test-Path -LiteralPath $full -PathType Leaf) {
                $f = Get-Item -LiteralPath $full
                $signature.Add("$rel|$($f.Length)|$($f.LastWriteTimeUtc.Ticks)")
            }
        } catch {}
    }
    $fingerprint = Get-Sha256 (($signature.ToArray()) -join "`n")

    $snapshotPath = if ($previous -and $previous.snapshot_path) { [string]$previous.snapshot_path } else { '' }
    $patchOk = if ($previous -and $null -ne $previous.patch_ok) { [bool]$previous.patch_ok } else { $true }
    $needsSnapshot = $status.Count -gt 0 -and (-not $previous -or [string]$previous.fingerprint -ne $fingerprint)

    if ($needsSnapshot) {
        $stamp = (Get-Date).ToString('yyyyMMdd-HHmmss-fff')
        $snapshotPath = Join-Path $snapshotRoot "$stamp-$($fingerprint.Substring(0,8))"
        New-Item -ItemType Directory -Path $snapshotPath -Force | Out-Null

        $diff = @(Invoke-Git @('diff','--binary','HEAD','--'))
        $patchOk = ($LastGitExit -eq 0)
        $patchText = if ($diff.Count) { ($diff -join "`n") + "`n" } else { '' }
        Write-AtomicUtf8 (Join-Path $snapshotPath 'working.patch') $patchText

        $copied = New-Object System.Collections.Generic.List[object]
        $skipped = New-Object System.Collections.Generic.List[object]
        $totalBytes = 0L
        $untracked = @(Invoke-Git @('-c','core.quotepath=false','ls-files','--others','--exclude-standard'))
        foreach ($rel in $untracked) {
            if (-not $rel) { continue }
            if ($rel -match '(^|[\\/])(\.env[^\\/]*|[^\\/]*creds[^\\/]*|node_modules|\.git)([\\/]|$)') {
                $skipped.Add([pscustomobject]@{ path = $rel; reason = 'secret-or-generated pattern' }); continue
            }
            try {
                $src = [IO.Path]::GetFullPath((Join-Path $Root $rel))
                $rootPrefix = $Root.TrimEnd('\\','/') + [IO.Path]::DirectorySeparatorChar
                if (-not $src.StartsWith($rootPrefix, [StringComparison]::OrdinalIgnoreCase)) { continue }
                if (-not (Test-Path -LiteralPath $src -PathType Leaf)) { continue }
                $file = Get-Item -LiteralPath $src
                if ($file.Length -gt 20MB -or ($totalBytes + $file.Length) -gt 100MB) {
                    $skipped.Add([pscustomobject]@{ path = $rel; reason = 'snapshot size cap' }); continue
                }
                $dest = [IO.Path]::GetFullPath((Join-Path (Join-Path $snapshotPath 'untracked') $rel))
                $destPrefix = ([IO.Path]::GetFullPath((Join-Path $snapshotPath 'untracked'))).TrimEnd('\\','/') + [IO.Path]::DirectorySeparatorChar
                if (-not $dest.StartsWith($destPrefix, [StringComparison]::OrdinalIgnoreCase)) { continue }
                New-Item -ItemType Directory -Path (Split-Path -Parent $dest) -Force | Out-Null
                Copy-Item -LiteralPath $src -Destination $dest -Force
                $totalBytes += $file.Length
                $copied.Add([pscustomobject]@{ path = $rel; bytes = $file.Length })
            } catch { $skipped.Add([pscustomobject]@{ path = $rel; reason = $_.Exception.Message }) }
        }
        $manifest = [ordered]@{ copied = @($copied); skipped = @($skipped); total_bytes = $totalBytes }
        Write-AtomicUtf8 (Join-Path $snapshotPath 'untracked-manifest.json') ($manifest | ConvertTo-Json -Depth 5)

        $old = @(Get-ChildItem -LiteralPath $snapshotRoot -Directory | Sort-Object Name -Descending | Select-Object -Skip ([Math]::Max(1,$Retention)))
        $safePrefix = ([IO.Path]::GetFullPath($snapshotRoot)).TrimEnd('\\','/') + [IO.Path]::DirectorySeparatorChar
        foreach ($dir in $old) {
            $resolved = [IO.Path]::GetFullPath($dir.FullName)
            if ($resolved.StartsWith($safePrefix, [StringComparison]::OrdinalIgnoreCase)) {
                Remove-Item -LiteralPath $resolved -Recurse -Force
            }
        }
    }

    $health = if ($previous -and $previous.git_health) { [string]$previous.git_health } else { 'not-checked' }
    $healthAt = if ($previous -and $previous.git_health_checked_at) { [string]$previous.git_health_checked_at } else { '' }
    $healthDue = $true
    if ($healthAt) { try { $healthDue = ((Get-Date) - [DateTime]::Parse($healthAt)).TotalHours -ge 24 } catch {} }
    if ($healthDue) {
        $fsck = @(Invoke-Git @('fsck','--connectivity-only','--no-dangling'))
        $health = if ($LastGitExit -eq 0) { 'ok' } else { 'FAILED - run tools/repair-git-objects.ps1' }
        $healthAt = (Get-Date).ToString('o')
    }

    $resumeCommand = if ($sessionId) { "cd `"$launchCwd`" ; claude --resume $sessionId" } else { '' }
    $state = [ordered]@{
        schema = 1
        updated_at = (Get-Date).ToString('o')
        event = $Event
        project_root = $Root
        session_id = $sessionId
        transcript_path = $transcript
        launch_cwd = $launchCwd
        resume_command = $resumeCommand
        last_owner_message = $lastOwner
        branch = [string]$branch
        head = [string]$head
        ahead_of_main = [int]$(if ($ahead -match '^\d+$') { $ahead } else { 0 })
        last_commit = [string]$lastCommit
        dirty_count = $status.Count
        dirty_files = @($status | Select-Object -First 30)
        fingerprint = $fingerprint
        snapshot_path = $snapshotPath
        patch_ok = $patchOk
        git_health = $health
        git_health_checked_at = $healthAt
    }

    $dirtyLine = if ($status.Count) { "$($status.Count) file(s): " + (($status | Select-Object -First 8) -join ' | ') } else { 'clean' }
    $md = @(
        '# MACHINE RECOVERY CHECKPOINT',
        '',
        "> Updated: $($state.updated_at) · event: $Event · Git health: $health",
        '',
        "- Session: $sessionId",
        "- Resume: $resumeCommand",
        "- Transcript: $transcript",
        "- Git: $branch @ $head · $($state.ahead_of_main) ahead of main",
        "- Last commit: $lastCommit",
        "- Working tree: $dirtyLine",
        "- Snapshot: $snapshotPath",
        "- Last owner request: $lastOwner",
        '',
        'This is a bounded machine index. Semantic status lives in `docs/RESUME.md`; detailed history is loaded only by route.'
    ) -join "`n"

    $json = $state | ConvertTo-Json -Depth 6
    Write-AtomicUtf8 $currentJsonPath $json
    Write-AtomicUtf8 (Join-Path $localDir 'current.md') $md
    try {
        Write-AtomicUtf8 (Join-Path $backupDir 'current.json') $json
        Write-AtomicUtf8 (Join-Path $backupDir 'current.md') $md
        if ($snapshotPath -and (Test-Path -LiteralPath (Join-Path $snapshotPath 'working.patch'))) {
            Copy-Item -LiteralPath (Join-Path $snapshotPath 'working.patch') -Destination (Join-Path $backupDir 'latest.patch') -Force
        }
    } catch {}

    if (-not $FromHook -and $Event -ne 'scheduled') {
        Write-Output "checkpoint: $branch@$head · dirty=$($status.Count) · snapshot=$snapshotPath"
    }
} catch {
    if (-not $FromHook) { Write-Error $_; exit 1 }
    try {
        if ($Root) {
            $errDir = Join-Path $Root '.recovery'
            New-Item -ItemType Directory -Path $errDir -Force | Out-Null
            [IO.File]::WriteAllText((Join-Path $errDir 'last-error.log'), "$(Get-Date -Format o) $($_.Exception.Message)", $utf8NoBom)
        }
    } catch {}
}

exit 0
