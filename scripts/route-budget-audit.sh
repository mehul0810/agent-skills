#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
warn_percent="${ROUTE_BUDGET_WARNING_PERCENT:-85}"
errors=0

words() {
  awk '{ total += NF } END { print total + 0 }' "$1"
}

check_route() {
  local label="$1" max="$2"
  shift 2
  local total=0 file count

  for file in "$@"; do
    if [ ! -f "$repo_root/$file" ]; then
      echo "ERROR: $label missing route file $file" >&2
      errors=$((errors + 1))
      return
    fi
    count="$(words "$repo_root/$file")"
    total=$((total + count))
  done

  local percent=$((total * 100 / max))
  local estimated_tokens=$(((total * 4 + 2) / 3))
  if [ "$total" -gt "$max" ]; then
    echo "ERROR: $label route is $total/$max words (~$estimated_tokens tokens)" >&2
    errors=$((errors + 1))
  elif [ "$percent" -ge "$warn_percent" ]; then
    echo "WARNING: $label route is $total/$max words (${percent}%, ~$estimated_tokens tokens)" >&2
  else
    echo "ok: $label route $total/$max words (~$estimated_tokens tokens)"
  fi
}

check_route "PO topology" 3500 \
  wp-product-orchestrator/SKILL.md \
  wp-product-orchestrator/references/router.md \
  shared/references/cto-orchestration-operating-model.md \
  shared/references/delegation-protocol.md

check_route "PO release" 3900 \
  wp-product-orchestrator/SKILL.md \
  wp-product-orchestrator/references/router.md \
  shared/references/release-train-discipline.md \
  shared/references/live-proof-wordpress.md

check_route "CTO heartbeat" 3300 \
  wp-portfolio-cto/SKILL.md \
  wp-portfolio-cto/references/router.md \
  shared/references/cto-orchestration-operating-model.md \
  shared/references/heartbeat-checkin-discipline.md

check_route "Theme visual" 3900 \
  wp-theme-expert/SKILL.md \
  shared/references/visual-to-wordpress-implementation.md \
  wp-expert/references/custom-block-theme-from-design.md

check_route "Plugin architecture" 2700 \
  wp-plugin-expert/SKILL.md \
  wp-expert/references/plugin-product-architecture.md \
  shared/references/enterprise-code-quality-gate.md

check_route "Content research" 2700 \
  content-writer/SKILL.md \
  content-writer/references/organic-search-content.md \
  shared/references/research-token-discipline.md

check_route "Contributor Gutenberg" 3100 \
  wp-contributor/SKILL.md \
  wp-contributor/references/gutenberg-workflow.md \
  shared/references/session-continuity-pr-discipline.md

if [ "$errors" -gt 0 ]; then
  echo "route budget audit failed: $errors issue(s)" >&2
  exit 1
fi

echo "route budget audit passed"
