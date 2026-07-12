#!/bin/sh
# NikoLearn secret-scan pre-commit guard (NB-33, 2026-07-12). Blocks committing a credential
# literal into ANY tracked file (docs, handoffs, code). Secrets live ONLY in ~/.claude/.bivision-creds.env
# (gitignored). Scans STAGED ADDITIONS only, so git history is untouched and no false-block on existing text.
# Install (per clone): cp tools/hooks/pre-commit-secretscan.sh .git/hooks/pre-commit && chmod +x .git/hooks/pre-commit
# Bypass in a true emergency: git commit --no-verify (discouraged; redact instead).

patterns='nk_[A-Za-z0-9_-]{16}|AIza[0-9A-Za-z_-]{35}|sk-[A-Za-z0-9]{20}|-----BEGIN [A-Z ]*PRIVATE KEY-----|CLOUDFLARE_API_TOKEN=[A-Za-z0-9_-]{20}|GEMINI_API_KEY=[A-Za-z0-9_-]{20}'

added=$(git diff --cached -U0 --no-color | grep -E '^\+' | grep -Ev '^\+\+\+')
hits=$(printf '%s\n' "$added" | grep -En "$patterns")

if [ -n "$hits" ]; then
  echo "❌ pre-commit BLOCKED: a credential-shaped literal is in your staged changes (NB-33 guard)."
  echo "   Redact it and keep the real value only in ~/.claude/.bivision-creds.env."
  printf '%s\n' "$hits" | sed -E 's/(.{0,8}).*/\1…[redacted]/' | head -5
  exit 1
fi
exit 0
