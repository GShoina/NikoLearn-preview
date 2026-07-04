@echo off
REM NikoLearn weekly Run-the-App Visual QA (AGENT_TEAM_STANDARD section 8). Owner-locked 2026-07-04.
cd /d "C:\Users\gela.shonia\Documents\NGT 2020-07\AI_Projects\NikoLand"
if not exist "output\visual-qa" mkdir "output\visual-qa"
claude --dangerously-skip-permissions -p "Run AGENT_TEAM_STANDARD section 8 (Run-the-App Visual QA) on NikoLearn end to end: launch the app headless, drive every subject and mode at 320/360/390 in KA and EN, open the tutor in each subject, screenshot every state to output/visual-qa/<date>/, assert overflow / tap<44 / AI-fab overlap / contrast / answer-in-stem / i18n-leak / wrong-label, LOOK at the screenshots, and write an HTML findings report to output/visual-qa/. Any fixes stay Preview -> owner GO -> Live." >> "output\visual-qa\weekly.log" 2>&1
