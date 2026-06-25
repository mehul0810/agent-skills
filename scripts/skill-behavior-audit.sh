#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
errors=0

require_text() {
  local file="$1"
  local text="$2"
  local label="$3"

  if grep -Fq "$text" "$repo_root/$file"; then
    echo "ok: $label"
  else
    echo "missing: $label ($file)" >&2
    errors=$((errors + 1))
  fi
}

require_text "wp-expert/SKILL.md" "push only when explicitly asked or repo-local automation policy authorizes it" "wp-expert push authorization discipline"
require_text "wp-expert/SKILL.md" "../shared/references/live-proof-wordpress.md" "wp-expert live proof routing"
require_text "wp-expert/SKILL.md" "../shared/references/context-window-discipline.md" "wp-expert context window discipline routing"
require_text "wp-expert/SKILL.md" "references/architecture-decision-gate.md" "wp-expert architecture gate routing"
require_text "wp-expert/SKILL.md" "wp-plugin-expert" "wp-expert plugin specialist routing"
require_text "wp-expert/SKILL.md" "wp-theme-expert" "wp-expert theme specialist routing"
require_text "wp-expert/SKILL.md" "wp-site-expert" "wp-expert site specialist routing"
require_text "wp-plugin-expert/SKILL.md" "references/router.md" "wp-plugin-expert modular router routing"
require_text "wp-plugin-expert/references/router.md" "../../wp-expert/references/plugin-architecture.md" "wp-plugin-expert plugin architecture routing"
require_text "wp-theme-expert/SKILL.md" "references/router.md" "wp-theme-expert modular router routing"
require_text "wp-theme-expert/references/router.md" "../../wp-expert/references/block-theme-architecture.md" "wp-theme-expert block theme routing"
require_text "wp-site-expert/SKILL.md" "references/router.md" "wp-site-expert modular router routing"
require_text "wp-site-expert/references/router.md" "../../wp-expert/references/conversion-focused-website-engineering.md" "wp-site-expert conversion routing"
require_text "shared/references/context-window-discipline.md" "Continuity-sensitive task" "context discipline continuity rule"
require_text "shared/references/context-window-discipline.md" "New or unrelated task" "context discipline fresh thread rule"
require_text "wp-expert/references/reference-routing-map.md" "## Risk-Triggered Overlays" "risk-triggered overlay routing"
require_text "wp-expert/references/architecture-decision-gate.md" "Source of truth" "architecture source-of-truth gate"
require_text "wp-expert/references/agent-behavior-eval-scenarios.md" "Block theme page from screenshot" "block theme editability eval scenario"
require_text "wp-expert/references/agent-behavior-eval-scenarios.md" "Milestone issue PR" "PR base eval scenario"
require_text "wp-expert/references/agent-behavior-eval-scenarios.md" "Plugin REST setting save" "REST settings eval scenario"
require_text "wp-expert/references/agent-behavior-eval-scenarios.md" "Unreleased feature rework" "unreleased compatibility eval scenario"
require_text "wp-expert/scripts/fse-design-map.sh" "Primary editing surface" "FSE editing surface field"
require_text "wp-expert/scripts/fse-design-map.sh" "Templates that must render Post Content" "FSE Post Content requirement field"
require_text "wp-expert/references/custom-block-theme-from-design.md" "Design-To-FSE Page Recipe" "design-to-FSE recipe"
require_text "wp-expert/references/standards-ci-github.md" "Push only when the user explicitly asks" "GitHub push authorization discipline"

if [ "$errors" -gt 0 ]; then
  echo "behavior audit failed: $errors missing guardrail(s)" >&2
  exit 1
fi

echo "behavior audit passed"
