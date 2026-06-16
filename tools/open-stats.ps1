# NikoLearn - open the live STATS dashboard in one double-click.
# ASCII-only source on purpose: the Georgian UI comes from the viewer TEMPLATE (read as UTF-8 at
# runtime) and from the fetched data (pure ASCII JSON: aggregate counters + fixed key strings), so
# PowerShell 5.1's script-source encoding can never corrupt it. STATS_KEY is read from creds, never typed,
# and is NEVER written into the viewer file (it goes straight from creds into the live fetch).
$ErrorActionPreference = 'Stop'
try { [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12 } catch {}

$creds = Join-Path $env:USERPROFILE '.claude\.bivision-creds.env'
if (-not (Test-Path $creds)) { Write-Host 'creds file not found.'; Start-Sleep 6; exit 1 }
$line = Get-Content $creds -Encoding UTF8 | Where-Object { $_ -match '^NIKO_STATS_KEY=' } | Select-Object -First 1
if (-not $line) { Write-Host 'NIKO_STATS_KEY not found in creds.'; Start-Sleep 6; exit 1 }
$key = ($line -replace '^NIKO_STATS_KEY=', '').Trim()

$tpl = Join-Path $PSScriptRoot '..\output\NikoLearn-stats-viewer.html'
if (-not (Test-Path $tpl)) { Write-Host 'stats viewer template not found.'; Start-Sleep 6; exit 1 }
$tpl = (Resolve-Path $tpl).Path

$uri = 'https://nikolearn-t.bivision.workers.dev/v1/stats?k=' + [uri]::EscapeDataString($key)
try {
  # decode the body bytes as UTF-8 explicitly (PS 5.1 Invoke-RestMethod assumes ISO-8859-1 with no charset).
  $resp  = Invoke-WebRequest -Uri $uri -Method Get -Headers @{ 'Cache-Control' = 'no-store' } -UseBasicParsing
  $bytes = $resp.RawContentStream.ToArray()
  $json  = [System.Text.Encoding]::UTF8.GetString($bytes)
} catch {
  $st = ''
  if ($_.Exception.Response) { $st = ' (HTTP ' + [int]$_.Exception.Response.StatusCode + ')' }
  Write-Host ('Could not load stats' + $st + ': ' + $_.Exception.Message)
  if ($st -match '403') { Write-Host 'STATS_KEY is wrong or unset on the Worker. Re-check NIKO_STATS_KEY in creds.' }
  Start-Sleep 7; exit 1
}

# the stats endpoint returns a JSON OBJECT of aggregate counters. Inject it verbatim (it is valid JS).
if ($json.TrimStart() -notmatch '^\{') { Write-Host ('Unexpected response (not JSON): ' + $json.Substring(0, [Math]::Min(120, $json.Length))); Start-Sleep 7; exit 1 }

$html   = [System.IO.File]::ReadAllText($tpl, [System.Text.Encoding]::UTF8)
$inject = '<script>window.__STATS_DATA__ = ' + $json + ';</script>'
$html   = $html.Replace('<!--STATS_DATA-->', $inject)

$out = Join-Path $env:TEMP 'nikolearn-stats.html'
[System.IO.File]::WriteAllText($out, $html, (New-Object System.Text.UTF8Encoding($true)))
Start-Process $out
