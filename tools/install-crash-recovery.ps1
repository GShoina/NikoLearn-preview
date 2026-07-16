[CmdletBinding()]
param([string]$Root = '', [switch]$Apply)

$ErrorActionPreference = 'Stop'
if (-not $Root) { $Root = Split-Path -Parent $PSScriptRoot }
$Root = [IO.Path]::GetFullPath($Root)
if (-not $Apply) {
    Write-Output 'Dry run: back up and set VS Code recovery options; register 5-minute NikoLearn-CrashCheckpoint task; write first checkpoint.'
    exit 0
}

$backup = Join-Path (Split-Path -Parent $Root) 'backups\NikoLand-recovery\install'
New-Item -ItemType Directory -Path $backup -Force | Out-Null
$settingsPath = Join-Path $env:APPDATA 'Code\User\settings.json'
if (Test-Path -LiteralPath $settingsPath) {
    Copy-Item -LiteralPath $settingsPath -Destination (Join-Path $backup ("vscode-settings-" + (Get-Date -Format 'yyyyMMdd-HHmmss') + '.json')) -Force
    $settings = Get-Content -LiteralPath $settingsPath -Raw -Encoding UTF8 | ConvertFrom-Json
} else {
    New-Item -ItemType Directory -Path (Split-Path -Parent $settingsPath) -Force | Out-Null
    $settings = New-Object psobject
}

function Set-Setting([object]$Object, [string]$Name, [object]$Value) {
    $p = $Object.PSObject.Properties[$Name]
    if ($p) { $p.Value = $Value } else { $Object | Add-Member -NotePropertyName $Name -NotePropertyValue $Value }
}
Set-Setting $settings 'files.autoSave' 'afterDelay'
Set-Setting $settings 'files.autoSaveDelay' 1000
Set-Setting $settings 'files.hotExit' 'onExitAndWindowClose'
Set-Setting $settings 'window.restoreWindows' 'all'
Set-Setting $settings 'workbench.localHistory.enabled' $true
Set-Setting $settings 'workbench.localHistory.maxFileEntries' 100
Set-Setting $settings 'workbench.localHistory.mergeWindow' 30
Set-Setting $settings 'chat.checkpoints.enabled' $true
Set-Setting $settings 'chat.checkpoints.showFileChanges' $true
$utf8NoBom = New-Object Text.UTF8Encoding($false)
[IO.File]::WriteAllText($settingsPath, (($settings | ConvertTo-Json -Depth 20) + "`n"), $utf8NoBom)

$taskName = 'NikoLearn-CrashCheckpoint'
$ps = Join-Path $env:WINDIR 'System32\WindowsPowerShell\v1.0\powershell.exe'
$script = Join-Path $Root 'tools\recovery-checkpoint.ps1'
$args = "-NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File `"$script`" -Root `"$Root`" -Event scheduled"
$action = New-ScheduledTaskAction -Execute $ps -Argument $args
$trigger = New-ScheduledTaskTrigger -Once -At (Get-Date).AddMinutes(1) -RepetitionInterval (New-TimeSpan -Minutes 5)
$principal = New-ScheduledTaskPrincipal -UserId ([Security.Principal.WindowsIdentity]::GetCurrent().Name) -LogonType Interactive -RunLevel Limited
$taskSettings = New-ScheduledTaskSettingsSet -Hidden -StartWhenAvailable -MultipleInstances IgnoreNew -ExecutionTimeLimit (New-TimeSpan -Minutes 2)
Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Principal $principal -Settings $taskSettings -Description 'Crash-safe NikoLearn session and working-tree checkpoint every 5 minutes.' -Force | Out-Null

& (Join-Path $Root 'tools\recovery-checkpoint.ps1') -Root $Root -Event manual
if (-not (Get-ScheduledTask -TaskName $taskName -ErrorAction Stop)) { throw 'Scheduled task registration was not verifiable.' }
Write-Output "Installed: VS Code recovery settings + $taskName (every 5 minutes)."

