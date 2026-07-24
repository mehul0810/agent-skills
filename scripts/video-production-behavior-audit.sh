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

require_text "product-video-producer/SKILL.md" "Reference work is analysis, not imitation" "reference originality boundary"
require_text "product-video-producer/SKILL.md" "No white-box logo artifacts" "logo matte guard"
require_text "product-video-producer/SKILL.md" "never fabricate product UI, customers, metrics, capabilities, or outcomes" "product truth guard"
require_text "product-video-producer/SKILL.md" "obtain storyboard or animatic approval before the full-quality render" "storyboard approval gate"
require_text "product-video-producer/SKILL.md" "Do not publish, release, upload, or overwrite an approved master" "publication gate"
require_text "product-video-producer/references/reference-to-storyboard.md" "source and timestamp" "timestamped reference review"
require_text "product-video-producer/references/reference-to-storyboard.md" "Do not describe a reference you could not view" "inaccessible reference guard"
require_text "product-video-producer/references/reference-to-storyboard.md" "a contact sheet alone cannot prove pacing" "motion review guard"
require_text "product-video-producer/references/reference-to-storyboard.md" "Treat a white rectangle behind a logo as a defect" "white-box asset preflight"
require_text "product-video-producer/references/reference-to-storyboard.md" "Do not generate exact logos, UI screenshots, wordmarks, or readable product copy" "exact asset generation boundary"
require_text "product-video-producer/references/render-review-iteration.md" '`1080p`: 1920x1080' "1080p render profile"
require_text "product-video-producer/references/render-review-iteration.md" '`4K UHD`: 3840x2160' "4K render profile"
require_text "product-video-producer/references/render-review-iteration.md" "Machine-readable manifest" "render manifest"
require_text "product-video-producer/references/render-review-iteration.md" "Intentional poster frame" "poster requirement"
require_text "product-video-producer/references/render-review-iteration.md" "Critique Loop" "safe critique loop"
require_text "skill-evals/product-video-producer-scenarios.md" "Logo matte defect" "logo regression scenario"
require_text "skill-evals/product-video-producer-scenarios.md" "Inaccessible reference" "reference hallucination scenario"
require_text "skill-evals/product-video-producer-scenarios.md" "Deterministic 4K" "render regression scenario"
require_text "skill-evals/product-video-producer-scenarios.md" "Exact critique" "critique regression scenario"

if [ "$errors" -gt 0 ]; then
  echo "video production behavior audit failed: $errors issue(s)" >&2
  exit 1
fi

echo "video production behavior audit passed"
