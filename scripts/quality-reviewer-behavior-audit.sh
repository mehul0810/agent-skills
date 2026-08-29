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
require_text "wp-quality-reviewer/references/multi-domain-release-review.md" "apply the non-breaking checkpoint" "release matrix compatibility checkpoint"
require_text "wp-quality-reviewer/SKILL.md" "A fix is not complete until its original failure clause is rerun" "failure-clause reproof"
require_text "wp-quality-reviewer/SKILL.md" "If owner evidence contradicts a pass" "owner correction recovery"
require_text "wp-quality-reviewer/SKILL.md" "owns the technical quality evidence and gate dispositions" "reviewer technical release evidence ownership"
require_text "wp-quality-reviewer/SKILL.md" "fresh source-aware re-review" "critical fix independent code review"
require_text "wp-quality-reviewer/references/security-review-fix.md" "source through normalization, validation, authorization" "security source-to-sink review"
require_text "wp-quality-reviewer/references/security-review-fix.md" "negative proof" "security negative proof"
require_text "wp-quality-reviewer/references/security-review-fix.md" "Do not put exploitable details" "security disclosure safety"
require_text "wp-quality-reviewer/references/security-review-fix.md" "actor x action x resource matrix" "security authorization matrix"
require_text "wp-quality-reviewer/references/security-review-fix.md" "quantitative limits" "security resource abuse budget"
require_text "wp-quality-reviewer/references/security-review-fix.md" "public REST, GraphQL, Abilities, MCP" "security API inventory"
require_text "wp-quality-reviewer/references/security-review-fix.md" "CSP/frame ancestors" "conditional browser security controls"
require_text "wp-quality-reviewer/references/security-review-fix.md" "classification, retention, erase/export" "security data lifecycle"
require_text "wp-quality-reviewer/references/performance-review-fix.md" "Before and after values" "performance measured delta"
require_text "wp-quality-reviewer/references/performance-review-fix.md" "Lab evidence catches regressions; field data represents real users" "performance lab/field distinction"
require_text "wp-quality-reviewer/references/performance-review-fix.md" "repeated-run distribution" "performance tail distribution evidence"
require_text "wp-quality-reviewer/references/performance-review-fix.md" "retry storm or runaway backlog" "performance overload and retry bound"
require_text "wp-quality-reviewer/references/performance-review-fix.md" "read-after-write behavior" "cache consistency proof"
require_text "wp-quality-reviewer/references/performance-review-fix.md" "compact capacity envelope" "performance capacity-envelope routing"
require_text "wp-expert/references/load-testing-capacity-planning.md" "Capacity Envelope And Scale Lifecycle" "capacity lifecycle contract"
require_text "wp-expert/references/load-testing-capacity-planning.md" "tenant/actor quotas or concurrency caps" "capacity fairness and admission"
require_text "wp-expert/references/load-testing-capacity-planning.md" "arrival rate versus service rate" "capacity queue throughput"
require_text "wp-expert/references/load-testing-capacity-planning.md" "storage and index growth" "capacity storage lifecycle"
require_text "wp-expert/references/load-testing-capacity-planning.md" "backup size, and restore time" "capacity restore evidence"
require_text "wp-quality-reviewer/references/modularity-review-fix.md" "WordPress entry point -> adapter/controller -> business decision -> persistence/provider" "modularity dependency map"
require_text "wp-quality-reviewer/references/modularity-review-fix.md" "Portable Modularity Contract" "portable modularity contract"
require_text "wp-quality-reviewer/references/modularity-review-fix.md" "no-growth ratchet" "legacy no-growth ratchet"
require_text "wp-quality-reviewer/references/modularity-review-fix.md" "approving owner, issue or dated reduction target" "modularity exception metadata"
require_text "wp-quality-reviewer/references/modularity-review-fix.md" "product repository owns the executable checker" "repo-local modularity checker ownership"
require_text "wp-quality-reviewer/references/modularity-review-fix.md" "The stop condition is simpler ownership" "modularity anti-overengineering"
require_text "wp-quality-reviewer/references/modularity-review-fix.md" "Non-Breaking Modularity Checkpoint" "non-breaking modularity checkpoint"
require_text "wp-quality-reviewer/references/modularity-review-fix.md" "launched/public and real-data contracts" "modularity contract inventory"
require_text "wp-quality-reviewer/references/modularity-review-fix.md" "characterization or consumer proof" "modularity before-after proof"
require_text "wp-quality-reviewer/references/modularity-review-fix.md" "expand -> migrate/backfill -> contract" "additive migration sequencing"
require_text "wp-quality-reviewer/references/modularity-review-fix.md" "intentional public or stored-contract break" "intentional break gate"
require_text "wp-quality-reviewer/SKILL.md" "compact non-breaking modularity checkpoint" "reviewer task-level modularity checkpoint"
require_text "wp-quality-reviewer/references/accessibility-review-fix.md" "no automated tool alone determines accessibility" "accessibility manual judgment"
require_text "wp-quality-reviewer/references/accessibility-review-fix.md" "Fix semantics and DOM order before adding ARIA" "accessibility native semantics"
require_text "wp-quality-reviewer/references/accessibility-review-fix.md" "zero-violation automated scan is not an accessibility pass" "accessibility no scanner-only pass"
require_text "wp-quality-reviewer/scripts/validate-review-report.mjs" "finding.negativeTests" "security validator proof"
require_text "wp-quality-reviewer/scripts/validate-review-report.mjs" "must improve and meet the lower-is-better budget" "performance improvement and budget proof"
require_text "wp-quality-reviewer/scripts/validate-review-report.mjs" "manualChecks" "accessibility validator proof"
require_text "wp-quality-reviewer/scripts/validate-review-report.mjs" "must be a structured evidence receipt" "structured evidence receipt validation"
require_text "wp-quality-reviewer/scripts/validate-review-report.mjs" "empty multi domains" "complete domain negative self-test"
require_text "wp-quality-reviewer/scripts/validate-review-report.mjs" "critical fix without independent review" "critical independent review negative self-test"
require_text "wp-quality-reviewer/scripts/validate-review-report.mjs" "failed modularity proof" "modularity pass-only negative self-test"
require_text "wp-quality-reviewer/scripts/validate-review-report.mjs" "vague evidence" "vague evidence negative self-test"
require_text "wp-quality-reviewer/scripts/validate-review-report.mjs" "unknown top key" "schema parity negative self-test"
require_text "shared/schemas/wp-quality-review.schema.json" '"domainDisposition"' "quality domain disposition schema"
require_text "shared/schemas/wp-quality-review.schema.json" '"independentReview"' "critical independent review schema"
require_text "shared/schemas/wp-quality-review.schema.json" '"distribution"' "performance distribution schema"
require_text "shared/schemas/wp-quality-review.schema.json" '"authorizationMatrix"' "authorization matrix schema"
require_text "shared/schemas/wp-quality-review.schema.json" '"resourceBudget"' "resource budget schema"
require_text "wp-expert/SKILL.md" "use \`wp-quality-reviewer\`" "wp-expert quality routing"
require_text "wp-product-orchestrator/SKILL.md" "wp-quality-reviewer" "product quality worker routing"
require_text "skill-evals/wp-quality-reviewer-scenarios.md" "Contradicted pass" "quality correction scenario"
require_text "skill-evals/wp-quality-reviewer-scenarios.md" "Legacy modularity ratchet and adapter boundary" "legacy modularity behavior scenario"
require_text "skill-evals/wp-quality-reviewer-scenarios.md" "Non-breaking launched-contract refactor" "launched contract modularity scenario"
require_text "skill-evals/wp-quality-reviewer-scenarios.md" "Additive custom-table migration" "additive migration modularity scenario"
require_text "skill-evals/wp-quality-reviewer-scenarios.md" "Performance tail, overload, and cache proof" "performance resilience scenario"
require_text "skill-evals/wp-quality-reviewer-scenarios.md" "Capacity envelope and scale lifecycle" "capacity lifecycle scenario"
require_text "skill-evals/wp-quality-reviewer-scenarios.md" "Security authorization matrix and abuse budget" "security authorization and abuse scenario"
require_text "skill-evals/routing-collision-scenarios.md" "Feature delivery vs focused quality review" "quality routing collision"
require_text "skill-evals/routing-collision-scenarios.md" "Critical fix vs independent re-review" "critical fix separation collision"
require_text "skill-evals/routing-collision-scenarios.md" "Release evidence vs PO" "release evidence ownership collision"
require_text "shared/references/release-train-discipline.md" "The PO must not infer a technical pass" "PO technical pass boundary"
require_text "shared/references/enterprise-code-quality-gate.md" "Compact Non-Breaking Modularity Checkpoint" "shared task-level modularity checkpoint"
require_text "shared/references/enterprise-code-quality-gate.md" "preserve observable behavior with characterization or consumer proof" "shared compatibility proof checkpoint"
require_text "shared/references/enterprise-code-quality-gate.md" "Performance checkpoint" "shared performance micro-checkpoint"
require_text "shared/references/enterprise-code-quality-gate.md" "Security checkpoint" "shared security micro-checkpoint"

if [ "$errors" -gt 0 ]; then
  echo "quality reviewer behavior audit failed: $errors issue(s)" >&2
  exit 1
fi

echo "quality reviewer behavior audit passed"
