#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
errors=0

require_file() {
  local file="$1"
  if [ -s "$repo_root/$file" ]; then
    echo "ok: $file"
  else
    echo "ERROR: missing/empty eval file $file" >&2
    errors=$((errors + 1))
  fi
}

for file in \
  skill-evals/wp-expert-scenarios.md \
  skill-evals/wp-portfolio-cto-scenarios.md \
  skill-evals/wp-product-orchestrator-scenarios.md \
  skill-evals/visual-wordpress-scenarios.md \
  skill-evals/core-first-site-theme-scenarios.md \
  skill-evals/model-routing-scenarios.md \
  skill-evals/loop-steward-scenarios.md \
  skill-evals/content-writer-scenarios.md \
  skill-evals/wp-contributor-scenarios.md \
  skill-evals/routing-collision-scenarios.md; do
  require_file "$file"
done

grep -Fq "fresh agent" "$repo_root/skill-evals/README.md" || { echo "ERROR: missing fresh-agent eval protocol" >&2; errors=$((errors + 1)); }
grep -Fq "Structural audits only prove" "$repo_root/skill-evals/loop-steward-scenarios.md" || { echo "ERROR: evals do not distinguish structure from behavior" >&2; errors=$((errors + 1)); }
grep -Fq "Site vs content" "$repo_root/skill-evals/routing-collision-scenarios.md" || { echo "ERROR: missing site/content collision" >&2; errors=$((errors + 1)); }
grep -Fq "Loop Steward vs CTO" "$repo_root/skill-evals/routing-collision-scenarios.md" || { echo "ERROR: missing steward/CTO collision" >&2; errors=$((errors + 1)); }

if [ "$errors" -gt 0 ]; then
  echo "skill eval audit failed: $errors issue(s)" >&2
  exit 1
fi

echo "skill eval inventory audit passed"
