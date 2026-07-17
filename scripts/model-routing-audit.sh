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

reject_section_regex() {
  local file="$1" start="$2" end="$3" pattern="$4" label="$5" section
  section="$(awk -v start="$start" -v end="$end" '
    index($0, start) { capture = 1 }
    capture && index($0, end) { capture = 0 }
    capture { printf "%s ", $0 }
  ' "$repo_root/$file")"
  if printf '%s\n' "$section" | grep -Eiq -- "$pattern"; then
    echo "ERROR: found forbidden $label in $file" >&2
    errors=$((errors + 1))
  else
    echo "ok: no $label"
  fi
}

require_text "shared/references/project-subagent-routing.md" "Inspect the model/reasoning combinations exposed by the current host or tool" "runtime availability inventory"
require_text "shared/references/project-subagent-routing.md" "Honor an explicit owner-specified combination" "owner model preference"
require_text "shared/references/project-subagent-routing.md" "lowest sufficient available capability tier" "lowest sufficient tier"
require_text "shared/references/project-subagent-routing.md" "Strongest suitable reasoning-capable" "strongest suitable tier"
require_text "shared/references/project-subagent-routing.md" "Luna-class: monitoring, read-only mapping" "Luna evidence class"
require_text "shared/references/project-subagent-routing.md" "Terra-class: default PO execution" "Terra default execution class"
require_text "shared/references/project-subagent-routing.md" "Sol-class: release readiness" "Sol high-risk class"
require_text "shared/references/project-subagent-routing.md" "current capability-class aliases, not permanent model IDs" "non-pinned class aliases"
require_text "shared/references/project-subagent-routing.md" "Allocation changes capability, not authority" "allocation authority boundary"
require_text "shared/references/project-subagent-routing.md" "Preserve the task-required risk tier first" "fallback risk-tier precedence"
reject_section_regex "shared/references/project-subagent-routing.md" "- Fast/economical:" "- Balanced implementation:" '(product/code|implementation|fix)' "product implementation in fast/economical tier"
require_text "shared/references/project-subagent-routing.md" 'Use reasoning above `xhigh` only' "reasoning cost ceiling"
require_text "shared/references/project-subagent-routing.md" "do not silently substitute" "transparent unavailable fallback"
require_text "shared/references/project-subagent-routing.md" "nearest available fast/economical class" "same-tier fallback"
require_text "shared/references/project-subagent-routing.md" "Requested: <model/reasoning>" "fallback requested field"
require_text "shared/references/project-subagent-routing.md" "Available constraint: <missing model or unsupported reasoning>" "fallback constraint field"
require_text "shared/references/project-subagent-routing.md" "Fallback: <selected capability tier and supported reasoning>" "fallback selection field"
require_text "shared/references/project-subagent-routing.md" "Impact: <none or evidence/risk difference>" "fallback impact field"
require_text "shared/references/project-subagent-routing.md" "Do not downgrade the final reviewer merely for model diversity" "high-risk reviewer tier"
require_text "shared/references/project-subagent-routing.md" "Capability-check both fields at runtime" "reasoning capability check"
require_text "shared/references/project-subagent-routing.md" "must not pin transient model IDs" "model-free reusable profiles"
require_text "shared/references/cto-orchestration-operating-model.md" "strongest suitable available model and highest supported reasoning level" "capability-based CTO bypass"
require_text "skill-evals/model-routing-scenarios.md" "Exact Planned Implementation" "bounded implementation scenario"
require_text "skill-evals/model-routing-scenarios.md" "Routine Evidence Lane" "routine evidence scenario"
require_text "skill-evals/model-routing-scenarios.md" "Complex Security And Release Decision" "complex decision scenario"
require_text "skill-evals/model-routing-scenarios.md" "Unavailable Explicit Request" "unavailable request scenario"
require_text "skill-evals/model-routing-scenarios.md" "Missing Runtime Classes" "per-class fallback scenario"
require_text "skill-evals/wp-product-orchestrator-scenarios.md" "Terra-class with medium reasoning as the default execution lane" "PO runtime class mapping"

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
