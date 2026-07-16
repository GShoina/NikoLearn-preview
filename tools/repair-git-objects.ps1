[CmdletBinding()]
param([string]$Root = '', [switch]$Apply)

$ErrorActionPreference = 'Stop'
if (-not $Root) { $Root = Split-Path -Parent $PSScriptRoot }
$Root = [IO.Path]::GetFullPath($Root)
if (-not $Apply) {
    Write-Output 'Dry run: full .git backup; quarantine zero-byte objects; refetch private remotes; rebuild known working blobs; fsck.'
    exit 0
}

$backupBase = Join-Path (Split-Path -Parent $Root) 'backups\NikoLand-recovery\git-pre-repair'
$stamp = (Get-Date).ToString('yyyyMMdd-HHmmss')
$backup = Join-Path $backupBase $stamp
New-Item -ItemType Directory -Path $backup -Force | Out-Null
Copy-Item -LiteralPath (Join-Path $Root '.git') -Destination (Join-Path $backup '.git') -Recurse -Force

$objects = [IO.Path]::GetFullPath((Join-Path $Root '.git\objects'))
$objectsPrefix = $objects.TrimEnd('\','/') + [IO.Path]::DirectorySeparatorChar
$quarantine = Join-Path $backup 'zero-object-quarantine'
New-Item -ItemType Directory -Path $quarantine -Force | Out-Null
$zero = @(Get-ChildItem -LiteralPath $objects -File -Recurse | Where-Object { $_.Length -eq 0 -and $_.Directory.Name -match '^[0-9a-f]{2}$' -and $_.Name -match '^[0-9a-f]{38}$' })
foreach ($file in $zero) {
    $resolved = [IO.Path]::GetFullPath($file.FullName)
    if (-not $resolved.StartsWith($objectsPrefix, [StringComparison]::OrdinalIgnoreCase)) { throw "Unsafe object path: $resolved" }
    $sha = $file.Directory.Name + $file.Name
    Move-Item -LiteralPath $resolved -Destination (Join-Path $quarantine $sha) -Force
}

foreach ($remote in @('origin','preview')) {
    & git -C $Root fetch --refetch --no-tags $remote
    if ($LASTEXITCODE -ne 0) {
        & git -C $Root fetch --force --no-tags $remote
        if ($LASTEXITCODE -ne 0) { throw "Could not refetch remote: $remote" }
    }
}

$known = [ordered]@{
    '6cc4e07009a11e4fc7350d9badee152522cc230a' = 'docs/nb48-shots/nb49-profile-after.png'
    'a289db7cae1333a0ac1327982296314b7f3812ad' = '01_NikoLearn_Strategy_drafts/2026-07-15-NikoLearn AI Constitution (vision) by Niko.html'
    '86ed8766dfc80b66d21a05b4a5b66f61e59c6fa6' = '01_NikoLearn_Strategy_drafts/trategic Framework for Georgia’s Innovation and Technology Policy Optimization.docx'
}
foreach ($sha in $known.Keys) {
    & git -C $Root cat-file -e $sha 2>$null
    if ($LASTEXITCODE -eq 0) { continue }
    $path = Join-Path $Root $known[$sha]
    if (-not (Test-Path -LiteralPath $path -PathType Leaf)) { throw "Missing recovery source: $($known[$sha])" }
    $actual = (& git -C $Root hash-object -- $path).Trim()
    if ($actual -ne $sha) { throw "Working file does not match missing object $sha ($($known[$sha]))" }
    $written = (& git -C $Root hash-object -w -- $path).Trim()
    if ($written -ne $sha) { throw "Failed to rebuild object $sha" }
}

$missingTree = '34f1496656f73c6a576fe105bc9ace2f3ca71a00'
& git -C $Root cat-file -e $missingTree 2>$null
if ($LASTEXITCODE -ne 0) {
    $candidate = (& git -C $Root write-tree --prefix='01_NikoLearn_Strategy_drafts/').Trim()
    if ($candidate -ne $missingTree) { throw "Historical tree $missingTree was not restored by remotes and differs from current subtree ($candidate). Backup is at $backup" }
}

$fsck = @(& git -C $Root fsck --full --no-reflogs 2>&1)
$bad = @($fsck | Where-Object { $_ -match 'missing |corrupt|object file .* is empty|fatal:|unable to read' })
if ($LASTEXITCODE -ne 0 -or $bad.Count) { throw "Git fsck still reports corruption. Backup: $backup`n$($bad -join "`n")" }
Write-Output "Git object database repaired; pre-repair backup: $backup"

