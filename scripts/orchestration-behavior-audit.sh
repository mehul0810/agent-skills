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

require_file() {
  local file="$1"
  local label="$2"

  if [ -f "$repo_root/$file" ]; then
    echo "ok: $label"
  else
    echo "missing: $label ($file)" >&2
    errors=$((errors + 1))
  fi
}

require_file "shared/references/cto-orchestration-operating-model.md" "CTO operating model reference"
require_file "shared/references/delegation-protocol.md" "delegation protocol reference"
require_file "shared/references/release-train-discipline.md" "release train discipline reference"
require_file "shared/references/github-communication-protocol.md" "GitHub communication protocol reference"
require_file "shared/references/commit-pr-discipline.md" "commit and PR discipline reference"
require_file "shared/references/weekly-wordpress-intelligence.md" "weekly WordPress intelligence reference"
require_file "shared/references/self-improvement-loop.md" "self-improvement loop reference"
require_file "shared/references/repo-product-docs-contract.md" "repo product docs contract reference"

require_text "wp-product-orchestrator/SKILL.md" "CTO control-plane" "orchestrator CTO control-plane language"
require_text "wp-product-orchestrator/SKILL.md" "GitHub issue-first" "orchestrator GitHub issue-first routing"
require_text "wp-product-orchestrator/SKILL.md" "Plan before delegation" "orchestrator plan-before-delegation rule"
require_text "wp-product-orchestrator/SKILL.md" "source of truth hierarchy" "orchestrator source-of-truth hierarchy"
require_text "wp-product-orchestrator/SKILL.md" "Do not create a next milestone prerelease" "orchestrator release train prerelease gate"
require_text "wp-product-orchestrator/SKILL.md" "Milestones need due dates" "orchestrator milestone due-date rule"
require_text "wp-product-orchestrator/SKILL.md" "Codex:" "orchestrator owner-authored Codex instructions"
require_text "wp-product-orchestrator/SKILL.md" "Do not post GitHub comments for routine notifications" "orchestrator quiet GitHub comment discipline"
require_text "wp-product-orchestrator/SKILL.md" "CTO control chat thread" "orchestrator CTO chat status routing"
require_text "wp-product-orchestrator/SKILL.md" "../shared/references/delegation-protocol.md" "orchestrator delegation protocol routing"
require_text "wp-product-orchestrator/SKILL.md" "../shared/references/github-communication-protocol.md" "orchestrator GitHub communication routing"
require_text "wp-product-orchestrator/SKILL.md" "../shared/references/commit-pr-discipline.md" "orchestrator commit/PR routing"
require_text "wp-product-orchestrator/SKILL.md" "../shared/references/weekly-wordpress-intelligence.md" "orchestrator weekly intelligence routing"
require_text "wp-product-orchestrator/SKILL.md" "../shared/references/self-improvement-loop.md" "orchestrator self-improvement routing"

require_text "shared/references/cto-orchestration-operating-model.md" "Source Of Truth Hierarchy" "source-of-truth hierarchy reference section"
require_text "shared/references/cto-orchestration-operating-model.md" "GitHub Issue-First Intake" "GitHub issue-first intake reference section"
require_text "shared/references/delegation-protocol.md" "Delegated Thread Prompt" "delegated thread/worktree protocol"
require_text "shared/references/delegation-protocol.md" "no subdelegation unless the parent CTO thread asks" "delegated no-subdelegation rule"
require_text "shared/references/release-train-discipline.md" "Do not create a next milestone prerelease" "release train production gate"
require_text "shared/references/release-train-discipline.md" "Milestones need due dates" "milestone due-date reference rule"
require_text "shared/references/github-communication-protocol.md" "GitHub Issue And PR Comments" "GitHub issue and PR comments protocol"
require_text "shared/references/github-communication-protocol.md" "Codex:" "owner-authored Codex instruction handling"
require_text "shared/references/github-communication-protocol.md" "Write GitHub comments sparingly" "quiet GitHub write discipline"
require_text "shared/references/github-communication-protocol.md" "Do not post GitHub comments for routine notifications" "no routine GitHub notification comments"
require_text "shared/references/github-communication-protocol.md" "CTO control chat thread" "routine status routes to CTO chat"
require_text "shared/references/commit-pr-discipline.md" "type(scope): concise action" "commit convention"
require_text "shared/references/commit-pr-discipline.md" "Every PR must include" "PR template requirements"
require_text "shared/references/weekly-wordpress-intelligence.md" "Weekly WordPress Ecosystem Intelligence" "weekly WordPress ecosystem intelligence"
require_text "shared/references/self-improvement-loop.md" "Self-Improvement Loop" "self-improvement loop"
require_text "shared/references/repo-product-docs-contract.md" "Product Truth Does Not Live Only In The Skill" "repo product docs contract"

if [ "$errors" -gt 0 ]; then
  echo "orchestration behavior audit failed: $errors missing guardrail(s)" >&2
  exit 1
fi

echo "orchestration behavior audit passed"
