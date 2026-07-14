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

reference="shared/references/command-ci-approval-boundary.md"
eval_file="skill-evals/command-ci-approval-scenarios.md"

require_text "$reference" "grants technical capability, not product or owner authorization" "allowlist is not authorization"
require_text "$reference" "Read-only Git/GitHub inspection" "read-only inspection is safe"
require_text "$reference" "tests, lint, format checks, static analysis, security scans, builds, packaging" "local quality checks are safe"
require_text "$reference" "reviewed non-production CI" "safe CI execution"
require_text "$reference" "deploy-capable workflow dispatch" "dangerous workflow gate"
require_text "$reference" "Destructive actions" "destructive action gate"
require_text "$reference" "Transfers of repository/domain ownership" "transfer action gate"
require_text "$reference" "Split compound commands" "compound command split"
require_text "$reference" "Never request blanket shell/interpreter approval" "blanket approval prohibition"
require_text "$eval_file" "Safe non-production rerun" "safe CI scenario"
require_text "$eval_file" "Deploy-capable dispatch" "dangerous CI scenario"
require_text "$eval_file" "Destructive cleanup" "delete scenario"
require_text "$eval_file" "Protected-data transfer" "transfer scenario"
require_text "wp-portfolio-cto/SKILL.md" "command-ci-approval-boundary.md" "CTO command authority route"
require_text "wp-product-orchestrator/SKILL.md" "command-ci-approval-boundary.md" "PO command authority route"
require_text "shared/references/worker-execution-discipline.md" "command-ci-approval-boundary.md" "worker command authority route"
require_text "shared/references/product-autonomy-permissions.md" "critical, destructive, transfer, uncertain-side-effect, and approval-bypass actions" "autonomy cannot weaken command policy"
require_text "shared/references/product-autonomy-permissions.md" "Protected/production merge" "autonomy merge authority boundary"

if [ "$errors" -gt 0 ]; then
  echo "command and CI approval audit failed: $errors issue(s)" >&2
  exit 1
fi

echo "command and CI approval audit passed"
