[CmdletBinding()]
param(
    [string]$Root = '',
    [switch]$ApplyLatest,
    [switch]$Force
)

$ErrorActionPreference = 'Stop'
if (-not $Root) { $Root = Split-Path -Parent $PSScriptRoot }
$Root = [IO.Path]::GetFullPath($Root)
$local = Join-Path $Root '.recovery'
$external = Join-Path (Split-Path -Parent $Root) 'backups\NikoLand-recovery'
$statePath = Join-Path $local 'current.json'
if (-not (Test-Path -LiteralPath $statePath)) { $statePath = Join-Path $external 'current.json' }
if (-not (Test-Path -LiteralPath $statePath)) { throw 'No recovery checkpoint exists yet.' }

$state = Get-Content -LiteralPath $statePath -Raw -Encoding UTF8 | ConvertFrom-Json
if (-not $ApplyLatest) {
    $resume = Join-Path $Root 'docs\RESUME.md'
    if (Test-Path -LiteralPath $resume) { Get-Content -LiteralPath $resume -Encoding UTF8 }
    Write-Output "`n--- machine checkpoint ---"
    $machine = Join-Path (Split-Path -Parent $statePath) 'current.md'
    if (Test-Path -LiteralPath $machine) { Get-Content -LiteralPath $machine -Encoding UTF8 }
    exit 0
}

$snapshot = [string]$state.snapshot_path
if (-not $snapshot -or -not (Test-Path -LiteralPath $snapshot)) { throw 'Latest snapshot is unavailable.' }
$dirty = @(& git -C $Root status --porcelain 2>$null | Where-Object { $_ })
if ($dirty.Count -and -not $Force) { throw 'Working tree is not clean. Refusing to overlay a snapshot; use -Force only after reviewing it.' }

$patch = Join-Path $snapshot 'working.patch'
if ((Test-Path -LiteralPath $patch) -and (Get-Item -LiteralPath $patch).Length -gt 0) {
    & git -C $Root apply --check --binary $patch
    if ($LASTEXITCODE -ne 0) { throw 'Snapshot patch does not apply cleanly.' }
    & git -C $Root apply --binary $patch
    if ($LASTEXITCODE -ne 0) { throw 'Snapshot patch apply failed.' }
}

$untracked = Join-Path $snapshot 'untracked'
if (Test-Path -LiteralPath $untracked) {
    $prefix = ([IO.Path]::GetFullPath($untracked)).TrimEnd('\\','/') + [IO.Path]::DirectorySeparatorChar
    foreach ($file in Get-ChildItem -LiteralPath $untracked -File -Recurse) {
        $full = [IO.Path]::GetFullPath($file.FullName)
        if (-not $full.StartsWith($prefix, [StringComparison]::OrdinalIgnoreCase)) { continue }
        $rel = $full.Substring($prefix.Length)
        $dest = [IO.Path]::GetFullPath((Join-Path $Root $rel))
        $rootPrefix = $Root.TrimEnd('\\','/') + [IO.Path]::DirectorySeparatorChar
        if (-not $dest.StartsWith($rootPrefix, [StringComparison]::OrdinalIgnoreCase)) { continue }
        if ((Test-Path -LiteralPath $dest) -and -not $Force) { throw "Refusing to overwrite existing untracked file: $rel" }
        New-Item -ItemType Directory -Path (Split-Path -Parent $dest) -Force | Out-Null
        Copy-Item -LiteralPath $full -Destination $dest -Force
    }
}

Write-Output "Recovered snapshot: $snapshot"

