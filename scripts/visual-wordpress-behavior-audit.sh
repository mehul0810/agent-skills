#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
errors=0

require_text() {
  local file="$1"
  local needle="$2"
  local label="$3"
  if grep -Fq -- "$needle" "$repo_root/$file"; then
    echo "ok: $label"
  else
    echo "ERROR: missing $label in $file" >&2
    errors=$((errors + 1))
  fi
}

require_text "shared/references/visual-to-wordpress-implementation.md" "Inspect the actual source visual" "actual visual inspection"
require_text "shared/references/visual-to-wordpress-implementation.md" 'supplied`, `measured`, or `inferred' "visual evidence confidence"
require_text "shared/references/visual-to-wordpress-implementation.md" "Handle Image Assets Deliberately" "asset generation workflow"
require_text "shared/references/visual-to-wordpress-implementation.md" "provenance" "asset provenance"
require_text "shared/references/visual-to-wordpress-implementation.md" "Site strategy" "site/theme ownership split"
require_text "shared/references/visual-to-wordpress-implementation.md" "overlay or perceptual diff" "measurable visual comparison"
require_text "shared/references/visual-to-wordpress-implementation.md" "geometry deltas above 2px" "exact-target investigation threshold"
require_text "shared/references/visual-to-wordpress-implementation.md" "mobile proof covers accessible, coherent inferred behavior, not pixel parity" "missing-mobile-design rule"
require_text "shared/references/design-intelligence-routing.md" "Discover the named capability" "design capability discovery"
require_text "shared/references/worker-execution-discipline.md" "Claim And Evidence Gate" "claim evidence gate"
require_text "shared/references/worker-execution-discipline.md" "Never invent WordPress hooks" "hallucination guard"
require_text "shared/references/worker-execution-discipline.md" "Owner Correction To Learning" "worker learning trigger"
require_text "wp-product-orchestrator/SKILL.md" "invoke the self-improvement loop" "PO learning routing"
require_text "wp-expert/scripts/fse-design-map.sh" "Visual Region Measurements" "FSE visual measurements"
require_text "wp-expert/scripts/fse-design-map.sh" "Asset Inventory" "FSE asset inventory"
require_text "skill-evals/visual-wordpress-scenarios.md" "Skills loaded" "eval context telemetry"
require_text "skill-evals/visual-wordpress-scenarios.md" "Unavailable Design Capability" "unavailable capability scenario"
require_text "skill-evals/visual-wordpress-scenarios.md" "Hallucinated WordPress Contract" "hallucination scenario"
require_text "skill-evals/visual-wordpress-scenarios.md" "Owner Correction Learning" "learning scenario"

if [ "$errors" -gt 0 ]; then
  echo "visual WordPress behavior audit failed: $errors issue(s)" >&2
  exit 1
fi

echo "visual WordPress behavior audit passed"
