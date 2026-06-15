# NikoLearn - open the parent-feedback report in one double-click.
# ASCII-only source on purpose: the Georgian UI comes from the viewer TEMPLATE (read as UTF-8 at
# runtime) and from the fetched data (escaped to \uXXXX by ConvertTo-Json), so PowerShell 5.1's
# script-source encoding can never corrupt it. The STATS_KEY is read from creds, never typed.
$ErrorActionPreference = 'Stop'
try { [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12 } catch {}

$creds = Join-Path $env:USERPROFILE '.claude\.bivision-creds.env'
if (-not (Test-Path $creds)) { Write-Host 'creds file not found.'; Start-Sleep 6; exit 1 }
$line = Get-Content $creds -Encoding UTF8 | Where-Object { $_ -match '^NIKO_STATS_KEY=' } | Select-Object -First 1
if (-not $line) { Write-Host 'NIKO_STATS_KEY not found in creds.'; Start-Sleep 6; exit 1 }
$key = ($line -replace '^NIKO_STATS_KEY=', '').Trim()

$tpl = Join-Path $PSScriptRoot '..\cloudflare\feedback-viewer.html'
if (-not (Test-Path $tpl)) { Write-Host 'viewer template not found.'; Start-Sleep 6; exit 1 }
$tpl = (Resolve-Path $tpl).Path

$uri = 'https://nikolearn-t.bivision.workers.dev/v1/feedback?k=' + [uri]::EscapeDataString($key)
try {
  # decode the body as UTF-8 explicitly. PowerShell 5.1's Invoke-RestMethod assumes ISO-8859-1 when the
  # response has no charset, which mojibakes Georgian — so read the raw bytes and decode them ourselves.
  $resp  = Invoke-WebRequest -Uri $uri -Method Get -Headers @{ 'Cache-Control' = 'no-store' } -UseBasicParsing
  $bytes = $resp.RawContentStream.ToArray()
  $text  = [System.Text.Encoding]::UTF8.GetString($bytes)
  $rows  = $text | ConvertFrom-Json
} catch {
  Write-Host ('Could not load feedback: ' + $_.Exception.Message)
  Start-Sleep 7; exit 1
}

if (-not $rows -or @($rows).Count -eq 0) {
  $json = '[]'
} else {
  $json = ConvertTo-Json @($rows) -Depth 6 -Compress
  if ($json -notmatch '^\s*\[') { $json = '[' + $json + ']' }   # PS 5.1 collapses a 1-item array to an object
}

$html = [System.IO.File]::ReadAllText($tpl, [System.Text.Encoding]::UTF8)
$inject = '<script>window.__FEEDBACK_DATA__ = ' + $json + ';</script>'
$html = $html.Replace('<!--FEEDBACK_DATA-->', $inject)

$out = Join-Path $env:TEMP 'nikolearn-feedback.html'
[System.IO.File]::WriteAllText($out, $html, (New-Object System.Text.UTF8Encoding($true)))
Start-Process $out
