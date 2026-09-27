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

require_text "shared/references/project-subagent-routing.md" "At each delegation" "delegation-time availability check"
require_text "shared/references/project-subagent-routing.md" "follow the current owner model-allocation policy; it overrides older capability-family guidance" "current owner policy precedence"
require_text "shared/references/project-subagent-routing.md" "use GPT-6 Luna for implementation, fixes, tests, and routine evidence work" "Luna implementation and evidence lane"
require_text "shared/references/project-subagent-routing.md" "use GPT-6 Sol for orchestration, planning, frontend work, and high-risk final review" "Sol orchestration and high-risk lane"
require_text "shared/references/project-subagent-routing.md" "Do not select another model for a task, worker, reviewer, retry, or automation without the owner's explicit approval" "no unapproved model substitution"
require_text "shared/references/project-subagent-routing.md" "stop only that assignment and ask the owner; do not silently fall back" "unavailable required model gate"
require_text "shared/references/project-subagent-routing.md" "Model selection changes capability, not authority" "allocation authority boundary"
require_text "shared/references/project-subagent-routing.md" "Use low reasoning for routine deterministic work, medium by default, and high for ambiguity or consequential risk" "owner reasoning defaults"
require_text "shared/references/project-subagent-routing.md" "Never use max/ultra without explicit owner approval" "max and ultra owner gate"
require_text "shared/references/project-subagent-routing.md" "Verify supported reasoning at runtime" "reasoning capability check"
require_text "shared/references/project-subagent-routing.md" "must not pin transient models/reasoning" "model-free reusable profiles"
require_text "shared/references/project-subagent-routing.md" "Never use a full-history worker fork" "bounded worker context"
require_text "shared/references/project-subagent-routing.md" "first CTO interaction of their local calendar day" "daily owner capacity signal"
require_text "shared/references/project-subagent-routing.md" "Missing answer means one worker at a time" "conservative missing capacity"
require_text "shared/references/project-subagent-routing.md" "one worker at a time" "conservative capacity concurrency"
require_text "shared/references/project-subagent-routing.md" "Never claim quota/reset visibility or control" "no quota reset claim"
require_text "shared/references/project-subagent-routing.md" "never lower risk or expand authority" "capacity authority boundary"
require_text "shared/references/project-subagent-routing.md" "Do not create a recurring automation or durable account-usage record" "no implicit capacity automation"
require_text "wp-portfolio-cto/SKILL.md" "first interaction of their local calendar day" "CTO daily capacity route"
require_text "shared/references/cto-orchestration-operating-model.md" "current owner-approved model/reasoning policy" "owner-policy CTO bypass"
require_text "skill-evals/model-routing-scenarios.md" "Daily Owner Capacity Signal" "daily capacity scenario"
require_text "skill-evals/model-routing-scenarios.md" "Exact Planned Implementation" "bounded implementation scenario"
require_text "skill-evals/model-routing-scenarios.md" "Routine Evidence Lane" "routine evidence scenario"
require_text "skill-evals/model-routing-scenarios.md" "Complex Security And Release Decision" "complex decision scenario"
require_text "skill-evals/model-routing-scenarios.md" "Unavailable Explicit Request" "unavailable request scenario"
require_text "skill-evals/model-routing-scenarios.md" "Max Or Ultra Needs Explicit Approval" "max/ultra reasoning scenario"
require_text "skill-evals/model-routing-scenarios.md" "Missing Runtime Classes" "per-class fallback scenario"
require_text "skill-evals/model-routing-scenarios.md" "Owner Model Policy Overrides Runtime Inventory" "owner model policy scenario"
require_text "skill-evals/model-routing-scenarios.md" "Bounded Worker Context" "worker context scenario"
require_text "skill-evals/wp-product-orchestrator-scenarios.md" "current owner model allocation" "PO owner model allocation"

# Historical records and provider/API integration examples may name models. Current
# guidance may name only models explicitly approved by the current owner policy.
matches="$(find "$repo_root" -type f \( -name '*.md' -o -name '*.toml' -o -name '*.yaml' -o -name '*.yml' -o -name '*.sh' \) \
  ! -path '*/.git/*' \
  ! -path '*/CHANGELOG.md' \
  ! -path '*/PLANNING_REPORT.md' \
  ! -path '*/scripts/model-routing-audit.sh' \
  ! -path '*/wp-expert/references/ai-llm-wordpress-product-engineering.md' \
  ! -path '*/wp-expert/references/third-party-api-integrations.md' \
  -print0 | xargs -0 rg -o -i --no-filename 'gpt-[0-9]+(\.[0-9]+)?-[a-z0-9-]+|codex-spark' 2>/dev/null | sort -u | rg -vi '^gpt-6-(luna|sol)$' || true)"

if [ -n "$matches" ]; then
  echo "ERROR: unapproved/transient Codex model IDs found in normative current guidance:" >&2
  printf '%s\n' "$matches" >&2
  errors=$((errors + 1))
else
  echo "ok: only owner-approved model IDs or no IDs in normative current guidance"
fi

reject_section_regex "shared/references/project-subagent-routing.md" "## Availability-First Routing Contract" "## Planning Before Allocation" '(Terra-class|Astra-class|Daybreak Blue-class|5\.6 capability family|owner choices as preferences|nearest class/reasoning|same-tier capability-equivalent)' "superseded model-family and fallback policy"

if [ "$errors" -gt 0 ]; then
  echo "model routing audit failed: $errors issue(s)" >&2
  exit 1
fi

echo "model routing audit passed"
