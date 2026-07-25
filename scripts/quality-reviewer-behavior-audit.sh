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

require_text "wp-quality-reviewer/SKILL.md" "Own the review, remediation, and proof loop" "reviewer owns full loop"
require_text "wp-quality-reviewer/SKILL.md" "Do not depend on an external Codex plugin or scanner for judgment" "no external plugin dependency"
require_text "wp-quality-reviewer/SKILL.md" "instead of all four detailed references" "multi-mode token discipline"
require_text "wp-quality-reviewer/references/multi-domain-release-review.md" "Load one detailed mode reference only when" "multi-mode selective escalation"
require_text "wp-quality-reviewer/SKILL.md" "A fix is not complete until its original failure clause is rerun" "failure-clause reproof"
require_text "wp-quality-reviewer/SKILL.md" "If owner evidence contradicts a pass" "owner correction recovery"
require_text "wp-quality-reviewer/references/security-review-fix.md" "source through normalization, validation, authorization" "security source-to-sink review"
require_text "wp-quality-reviewer/references/security-review-fix.md" "negative proof" "security negative proof"
require_text "wp-quality-reviewer/references/security-review-fix.md" "Do not put exploitable details" "security disclosure safety"
require_text "wp-quality-reviewer/references/performance-review-fix.md" "Before and after values" "performance measured delta"
require_text "wp-quality-reviewer/references/performance-review-fix.md" "Lab evidence catches regressions; field data represents real users" "performance lab/field distinction"
require_text "wp-quality-reviewer/references/modularity-review-fix.md" "WordPress entry point -> adapter/controller -> business decision -> persistence/provider" "modularity dependency map"
require_text "wp-quality-reviewer/references/modularity-review-fix.md" "The stop condition is simpler ownership" "modularity anti-overengineering"
require_text "wp-quality-reviewer/references/accessibility-review-fix.md" "no automated tool alone determines accessibility" "accessibility manual judgment"
require_text "wp-quality-reviewer/references/accessibility-review-fix.md" "Fix semantics and DOM order before adding ARIA" "accessibility native semantics"
require_text "wp-quality-reviewer/references/accessibility-review-fix.md" "zero-violation automated scan is not an accessibility pass" "accessibility no scanner-only pass"
require_text "wp-quality-reviewer/scripts/validate-review-report.mjs" "fixed security finding requires negativeTests" "security validator proof"
require_text "wp-quality-reviewer/scripts/validate-review-report.mjs" "fixed performance finding requires before and after evidence" "performance validator proof"
require_text "wp-quality-reviewer/scripts/validate-review-report.mjs" "fixed accessibility finding requires manualChecks" "accessibility validator proof"
require_text "wp-expert/SKILL.md" "use \`wp-quality-reviewer\`" "wp-expert quality routing"
require_text "wp-product-orchestrator/SKILL.md" "wp-quality-reviewer" "product quality worker routing"
require_text "skill-evals/wp-quality-reviewer-scenarios.md" "Contradicted pass" "quality correction scenario"
require_text "skill-evals/routing-collision-scenarios.md" "Feature delivery vs focused quality review" "quality routing collision"

if [ "$errors" -gt 0 ]; then
  echo "quality reviewer behavior audit failed: $errors issue(s)" >&2
  exit 1
fi

echo "quality reviewer behavior audit passed"
