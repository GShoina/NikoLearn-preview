@echo off
rem NikoLearn stats dashboard - double-click to open the live dashboard in your browser.
rem Reads STATS_KEY from your creds file automatically; no key or paths to type.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0open-stats.ps1"
