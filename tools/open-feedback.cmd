@echo off
rem NikoLearn parent feedback - double-click to open the report in your browser.
rem Reads STATS_KEY from your creds file automatically; no key or paths to type.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0open-feedback.ps1"
