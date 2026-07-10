#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
errors=0

require_text() {
  local file="$1" needle="$2" label="$3"
  if grep -Fq -- "$needle" "$repo_root/$file"; then
    echo "ok: $label"
  else
    echo "ERROR: missing $label in $file" >&2
    errors=$((errors + 1))
  fi
}

require_text "shared/references/project-subagent-routing.md" "Inspect the model/reasoning combinations exposed by the current host or tool" "runtime availability inventory"
require_text "shared/references/project-subagent-routing.md" "Honor an explicit owner-specified combination" "owner model preference"
require_text "shared/references/project-subagent-routing.md" "lowest sufficient available capability tier" "lowest sufficient tier"
require_text "shared/references/project-subagent-routing.md" "Strongest suitable reasoning-capable" "strongest suitable tier"
require_text "shared/references/project-subagent-routing.md" "5.6 Sol-class" "current Sol-class example"
require_text "shared/references/project-subagent-routing.md" 'Use reasoning above `xhigh` only' "reasoning cost ceiling"
require_text "shared/references/project-subagent-routing.md" "do not silently substitute" "transparent unavailable fallback"
require_text "shared/references/project-subagent-routing.md" "nearest available fast/economical tier" "same-tier fallback"
require_text "shared/references/project-subagent-routing.md" "Do not downgrade the final reviewer merely for model diversity" "high-risk reviewer tier"
require_text "shared/references/project-subagent-routing.md" "Capability-check both fields at runtime" "reasoning capability check"
require_text "shared/references/project-subagent-routing.md" "must not pin transient model IDs" "model-free reusable profiles"
require_text "shared/references/cto-orchestration-operating-model.md" "strongest suitable available model and highest supported reasoning level" "capability-based CTO bypass"
require_text "skill-evals/model-routing-scenarios.md" "Exact Planned Implementation" "bounded implementation scenario"
require_text "skill-evals/model-routing-scenarios.md" "Complex Security And Release Decision" "complex decision scenario"
require_text "skill-evals/model-routing-scenarios.md" "Unavailable Explicit Request" "unavailable request scenario"

# Historical records and provider/API integration examples may name models. Current
# Codex routing policy, evals, templates, and user-facing guidance must not.
matches="$(find "$repo_root" -type f \( -name '*.md' -o -name '*.toml' -o -name '*.yaml' -o -name '*.yml' -o -name '*.sh' \) \
  ! -path '*/.git/*' \
  ! -path '*/CHANGELOG.md' \
  ! -path '*/PLANNING_REPORT.md' \
  ! -path '*/scripts/model-routing-audit.sh' \
  ! -path '*/wp-expert/references/ai-llm-wordpress-product-engineering.md' \
  ! -path '*/wp-expert/references/third-party-api-integrations.md' \
  -print0 | xargs -0 rg -n -i 'gpt-[0-9]|codex-spark' 2>/dev/null || true)"

if [ -n "$matches" ]; then
  echo "ERROR: transient Codex model IDs found in normative current guidance:" >&2
  printf '%s\n' "$matches" >&2
  errors=$((errors + 1))
else
  echo "ok: no transient Codex model IDs in normative current guidance"
fi

if [ "$errors" -gt 0 ]; then
  echo "model routing audit failed: $errors issue(s)" >&2
  exit 1
fi

echo "model routing audit passed"
