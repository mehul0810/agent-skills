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
require_text "shared/references/visual-to-wordpress-implementation.md" "ambiguity ledger" "visual ambiguity decision discipline"
require_text "shared/references/visual-to-wordpress-implementation.md" "reusable component contracts" "visual component-system extraction"
require_text "shared/references/visual-to-wordpress-implementation.md" "Handle Image Assets Deliberately" "asset generation workflow"
require_text "shared/references/visual-to-wordpress-implementation.md" "small candidate set" "generated asset convergence"
require_text "shared/references/visual-to-wordpress-implementation.md" "provenance" "asset provenance"
require_text "shared/references/visual-to-wordpress-implementation.md" "Site strategy" "site/theme ownership split"
require_text "shared/references/visual-to-wordpress-implementation.md" "overlay or perceptual diff" "measurable visual comparison"
require_text "shared/references/visual-to-wordpress-implementation.md" "hard-edge geometry deltas above 2 CSS px" "deterministic exact-target investigation threshold"
require_text "shared/references/visual-to-wordpress-implementation.md" "capture fingerprint" "deterministic capture contract"
require_text "shared/references/visual-to-wordpress-implementation.md" "visitor completes the primary task" "visitor workflow proof"
require_text "shared/references/visual-to-wordpress-implementation.md" "author completes the primary editing task" "author workflow proof"
require_text "shared/references/visual-to-wordpress-implementation.md" "mobile proof covers accessible, coherent inferred behavior, not pixel parity" "missing-mobile-design rule"
require_text "shared/references/visual-to-wordpress-implementation.md" "support slot" "single-support collision handling"
require_text "wp-expert/references/visual-parity-regression.md" "Baseline Governance" "visual baseline governance"
require_text "wp-expert/references/visual-parity-regression.md" "WordPress Theme Unit Test Data" "theme content stress fixture"
require_text "wp-expert/references/visual-parity-regression.md" "container queries" "intrinsic responsive architecture"
require_text "wp-expert/references/visual-parity-regression.md" "repo-specific budgets" "measurable frontend budget"
require_text "wp-expert/references/block-theme-architecture.md" "WordPress.org Theme Directory themes must not ship custom blocks" "public theme custom block boundary"
require_text "wp-expert/references/block-theme-architecture.md" "theme switch/deactivation portability" "theme portability proof"
require_text "wp-expert/references/accessibility-i18n-global-readiness.md" "Focus Not Obscured" "WCAG 2.2 focus criterion"
require_text "wp-expert/references/accessibility-i18n-global-readiness.md" "24x24" "WCAG 2.2 target size criterion"
require_text "wp-expert/references/theme-frontend-performance-quality-gate.md" "Measurable Budget Contract" "theme performance budget contract"
require_text "wp-expert/references/style-guide-theme-translation.md" "CSS And Cascade Governance" "enterprise CSS cascade contract"
require_text "wp-expert/references/style-guide-theme-translation.md" "user Global Styles" "Global Styles precedence"
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
require_text "skill-evals/visual-wordpress-scenarios.md" "WordPress.org Theme Custom Block Boundary" "theme distribution scenario"
require_text "skill-evals/visual-wordpress-scenarios.md" "Exact Visual With Custom Block Architecture Risk" "combined visual architecture route scenario"
require_text "skill-evals/visual-wordpress-scenarios.md" "Enterprise Theme Content And Responsive Stress" "theme stress scenario"
require_text "skill-evals/visual-wordpress-scenarios.md" "Site Editor Design Promotion" "Site Editor promotion scenario"
require_text "shared/references/core-first-site-theme-workflow.md" "get_all_registered()" "live block registry verification"
require_text "shared/references/core-first-site-theme-workflow.md" 'Treat `core/tabs`, `core/table-of-contents`, `core/form`' "runtime-dependent documented blocks"
require_text "shared/references/core-first-site-theme-workflow.md" 'prefer `core/icon`, `core/breadcrumbs`, `core/accordion`' "core-first block mapping"
require_text "shared/references/core-first-site-theme-workflow.md" "parse_blocks()" "saved block structure proof"
require_text "shared/references/core-first-site-theme-workflow.md" "do_blocks()" "saved block render proof"
require_text "shared/references/core-first-site-theme-workflow.md" '`wp_template` or `wp_template_part` records' "Site Editor override precedence"
require_text "shared/references/core-first-site-theme-workflow.md" "Promote Intentional Editor Changes" "Site Editor database-to-file lifecycle"
require_text "shared/references/core-first-site-theme-workflow.md" '`wp_global_styles`' "Global Styles database precedence"
require_text "shared/references/core-first-site-theme-workflow.md" '`wp_navigation`' "Navigation database dependency"
require_text "shared/references/core-first-site-theme-workflow.md" 'templates/{slug}.html' "Site Editor template artifact mapping"
require_text "shared/references/core-first-site-theme-workflow.md" 'Resolve nonportable `ref` and numeric IDs' "Site Editor reference migration"
require_text "shared/references/core-first-site-theme-workflow.md" "Production-Ready Evidence" "Site Editor production evidence gate"
require_text "shared/references/core-first-site-theme-workflow.md" "release artifact" "packaged clean-install proof"
require_text "skill-evals/core-first-site-theme-scenarios.md" "Documented block absent" "runtime block availability scenario"
require_text "wp-site-expert/references/router.md" "core-first-site-theme-workflow.md" "site core-first routing"
require_text "wp-theme-expert/references/router.md" "core-first-site-theme-workflow.md" "theme core-first routing"
require_text "wp-expert/scripts/fse-design-map.sh" "Component Contracts" "FSE component contract fields"
require_text "wp-expert/scripts/fse-design-map.sh" "Golden Workflows" "FSE golden workflow fields"
require_text "wp-expert/scripts/fse-design-map.sh" "Capture fingerprint" "FSE deterministic proof fields"

if [ "$errors" -gt 0 ]; then
  echo "visual WordPress behavior audit failed: $errors issue(s)" >&2
  exit 1
fi

echo "visual WordPress behavior audit passed"
