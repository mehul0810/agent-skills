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
require_text "wp-expert/SKILL.md" "Stop after routing when the specialist is clear" "wp-expert no broad load after auto route"
require_text "wp-expert/SKILL.md" "wp-plugin-expert" "wp-expert plugin specialist routing"
require_text "wp-expert/SKILL.md" "wp-theme-expert" "wp-expert theme specialist routing"
require_text "wp-expert/SKILL.md" "wp-site-expert" "wp-expert site specialist routing"
require_text "wp-expert/SKILL.md" "wp-portfolio-cto" "wp-expert portfolio specialist routing"
require_text "wp-plugin-expert/SKILL.md" "references/router.md" "wp-plugin-expert modular router routing"
require_text "wp-plugin-expert/SKILL.md" "enterprise-code-quality-gate.md" "wp-plugin-expert quality contract routing"
require_text "wp-plugin-expert/SKILL.md" "worker-execution-discipline.md" "wp-plugin-expert worker execution routing"
require_text "wp-plugin-expert/SKILL.md" "design-intelligence-routing.md" "wp-plugin-expert design routing"
require_text "wp-plugin-expert/SKILL.md" "adjacent-finding-protocol.md" "wp-plugin-expert adjacent finding routing"
require_text "wp-plugin-expert/SKILL.md" "hand off instead of loading broad WordPress context" "wp-plugin-expert lane handoff"
require_text "wp-plugin-expert/references/router.md" "../../wp-expert/references/plugin-architecture.md" "wp-plugin-expert plugin architecture routing"
require_text "wp-theme-expert/SKILL.md" "references/router.md" "wp-theme-expert modular router routing"
require_text "wp-theme-expert/SKILL.md" "enterprise-code-quality-gate.md" "wp-theme-expert quality contract routing"
require_text "wp-theme-expert/SKILL.md" "worker-execution-discipline.md" "wp-theme-expert worker execution routing"
require_text "wp-theme-expert/SKILL.md" "design-intelligence-routing.md" "wp-theme-expert design routing"
require_text "wp-theme-expert/SKILL.md" "adjacent-finding-protocol.md" "wp-theme-expert adjacent finding routing"
require_text "wp-theme-expert/SKILL.md" "hand off instead of loading broad WordPress context" "wp-theme-expert lane handoff"
require_text "wp-theme-expert/references/router.md" "../../wp-expert/references/block-theme-architecture.md" "wp-theme-expert block theme routing"
require_text "wp-site-expert/SKILL.md" "references/router.md" "wp-site-expert modular router routing"
require_text "wp-site-expert/SKILL.md" "enterprise-code-quality-gate.md" "wp-site-expert quality contract routing"
require_text "wp-site-expert/SKILL.md" "worker-execution-discipline.md" "wp-site-expert worker execution routing"
require_text "wp-site-expert/SKILL.md" "design-intelligence-routing.md" "wp-site-expert design routing"
require_text "wp-site-expert/SKILL.md" "adjacent-finding-protocol.md" "wp-site-expert adjacent finding routing"
require_text "wp-site-expert/SKILL.md" "hand off instead of loading broad WordPress context" "wp-site-expert lane handoff"
require_text "wp-site-expert/references/router.md" "../../wp-expert/references/conversion-focused-website-engineering.md" "wp-site-expert conversion routing"
require_text "shared/references/project-subagent-routing.md" "Auto-select the narrowest skill from the artifact" "subagent specialist auto routing"
require_text "shared/references/project-subagent-routing.md" "Inspect the exact referenced artifact first" "subagent exact artifact first"
require_text "shared/references/enterprise-code-quality-gate.md" "Every implementation should explicitly consider these quality dimensions" "shared quality contract dimensions"
require_text "shared/references/enterprise-code-quality-gate.md" '`Not applicable - reason`' "shared quality contract explicit exceptions"
require_text "shared/references/worker-execution-discipline.md" "Direct Task Decision Contract" "shared worker direct task contract"
require_text "shared/references/worker-execution-discipline.md" "Assumption And Confidence Gate" "shared worker assumption gate"
require_text "shared/references/worker-execution-discipline.md" "Worker Recovery Ladder" "shared worker recovery ladder"
require_text "shared/references/worker-execution-discipline.md" "Finish Pass" "shared worker finish pass"
require_text "shared/references/adjacent-finding-protocol.md" "Do not expand the current PR or task scope blindly" "shared adjacent finding scope boundary"
require_text "shared/references/adjacent-finding-protocol.md" "Adjacent findings" "shared adjacent finding worker output"
require_text "shared/references/design-intelligence-routing.md" 'Use `product-design:index` as the router only' "shared design router rule"
require_text "shared/references/design-intelligence-routing.md" "If UI changed, require screenshot proof" "shared design screenshot proof rule"
require_text "shared/references/design-intelligence-routing.md" "Convert Product Design findings into actionable acceptance criteria" "shared design actionable feedback rule"
require_text "shared/references/design-intelligence-routing.md" "product-experience-principles.md" "shared design product experience lens"
require_text "shared/references/product-experience-principles.md" "Build premium WordPress products that feel enterprise-grade, simple by default, and powerful when needed" "shared product experience goal"
require_text "shared/references/product-experience-principles.md" "The default path should be plug-and-play for non-technical users" "shared product experience plug-and-play principle"
require_text "shared/references/product-experience-principles.md" "Advanced configuration should exist for developers and power users" "shared product experience advanced-user principle"
require_text "shared/references/project-subagent-routing.md" "Report adjacent findings separately" "subagent adjacent finding reporting"
require_text "shared/references/project-subagent-routing.md" "Turn Product Design feedback into acceptance criteria" "subagent design actionable feedback"
require_text "wp-portfolio-cto/SKILL.md" "Route product-level backlog" "portfolio does not execute product backlog"
require_text "wp-product-orchestrator/SKILL.md" "Cross-product portfolio governance" "product hands portfolio governance off"
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
