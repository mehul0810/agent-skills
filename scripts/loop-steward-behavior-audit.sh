#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
errors=0

require_text() {
  local file="$1" text="$2" label="$3"
  if grep -Fq -- "$text" "$repo_root/$file"; then
    echo "ok: $label"
  else
    echo "ERROR: missing $label in $file" >&2
    errors=$((errors + 1))
  fi
}

require_text loop-steward/SKILL.md "Policy Preflight" "policy preflight"
require_text loop-steward/SKILL.md "Missing, unreadable, stale, conflicting, or unrecognized policy fails closed" "missing policy fail closed"
require_text loop-steward/SKILL.md "exact head SHA" "head SHA binding"
require_text loop-steward/SKILL.md "fresh independent Steward run/actor" "reviewer separation"
require_text loop-steward/SKILL.md "Immediately before merge" "pre-merge race recheck"
require_text loop-steward/SKILL.md "reconcile the queue idempotently" "idempotent reconciliation"
require_text loop-steward/SKILL.md "Never bypass required, flaky, missing, or failing checks" "required-check fail closed"
require_text skill-evals/loop-steward-scenarios.md "Missing policy" "missing policy scenario"
require_text skill-evals/loop-steward-scenarios.md "Head changed before merge" "changed head scenario"
require_text skill-evals/loop-steward-scenarios.md "Duplicate event" "duplicate event scenario"
require_text skill-evals/loop-steward-scenarios.md "Missing required check" "missing required-check scenario"

if [ "$errors" -gt 0 ]; then
  echo "loop steward behavior audit failed: $errors issue(s)" >&2
  exit 1
fi

echo "loop steward behavior audit passed"
