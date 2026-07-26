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
require_text "product-video-producer/SKILL.md" "Load only the primary reference for the current stage" "stage-specific reference loading"
require_text "product-video-producer/SKILL.md" "never load all three references in one working context" "no all-reference context"
require_text "product-video-producer/SKILL.md" "Classify the work: enterprise promo/launch" "video mode classification"
require_text "product-video-producer/SKILL.md" "For edit/review/delivery-only work" "existing artifact mode"
require_text "product-video-producer/SKILL.md" "obtain storyboard, animatic, or representative style-sequence approval before the full edit/render" "storyboard approval gate"
require_text "product-video-producer/SKILL.md" "generic AI glow, stock-montage filler, fake customers" "enterprise anti-slop gate"
require_text "product-video-producer/SKILL.md" "For direct critique" "direct critique discipline"
require_text "product-video-producer/SKILL.md" "For post-publication evidence" "analytics hypothesis discipline"
require_text "product-video-producer/SKILL.md" "sanitized deterministic fixtures" "kernel privacy gate"
require_text "product-video-producer/SKILL.md" "start/stop/apply a public experiment" "public experiment approval gate"
require_text "product-video-producer/references/reference-to-storyboard.md" "source and timestamp" "timestamped reference review"
require_text "product-video-producer/references/reference-to-storyboard.md" "Do not describe a reference you could not view" "inaccessible reference guard"
require_text "product-video-producer/references/reference-to-storyboard.md" "a contact sheet alone cannot prove pacing" "motion review guard"
require_text "product-video-producer/references/reference-to-storyboard.md" "Treat a white rectangle behind a logo as a defect" "white-box asset preflight"
require_text "product-video-producer/references/reference-to-storyboard.md" "Do not generate exact logos, UI screenshots, wordmarks, or readable product copy" "exact asset generation boundary"
require_text "product-video-producer/references/reference-to-storyboard.md" "sanitized deterministic fixture data" "privacy-safe software capture"
require_text "product-video-producer/references/reference-to-storyboard.md" "lock controlled exposure, white balance, and frame rate" "controlled original capture"
require_text "product-video-producer/references/reference-to-storyboard.md" "approve a representative style frame before motion" "generated sequence continuity"
require_text "product-video-producer/references/reference-to-storyboard.md" "Preserve truthful chronology" "truthful edit chronology"
require_text "product-video-producer/references/render-review-iteration.md" '`1080p`: 1920x1080' "1080p render profile"
require_text "product-video-producer/references/render-review-iteration.md" '`4K UHD`: 3840x2160' "4K render profile"
require_text "product-video-producer/references/render-review-iteration.md" "Prove the exact project root" "project and output identity"
require_text "product-video-producer/references/render-review-iteration.md" "source-to-proxy map" "proxy conform lineage"
require_text "product-video-producer/references/render-review-iteration.md" "approves picture lock before final sound, color, captions, and graphics" "picture-lock approval gate"
require_text "product-video-producer/references/render-review-iteration.md" "YouTube does not publish a universal required LUFS value" "no invented YouTube loudness rule"
require_text "product-video-producer/references/render-review-iteration.md" "Machine-readable manifest" "render manifest"
require_text "product-video-producer/references/render-review-iteration.md" "--expected-artifact-sha256" "independent completion binding"
require_text "product-video-producer/references/render-review-iteration.md" "--verify-files --verify-media" "live media completion proof"
require_text "product-video-producer/references/render-review-iteration.md" "approval receipt" "approval evidence contract"
require_text "product-video-producer/references/render-review-iteration.md" "Intentional poster frame" "poster requirement"
require_text "product-video-producer/references/render-review-iteration.md" "Never rely on auto-captions as final proof" "caption review gate"
require_text "product-video-producer/references/render-review-iteration.md" "separate text, caption, and audio tracks" "localized delivery tracks"
require_text "product-video-producer/references/render-review-iteration.md" "Critique Loop" "safe critique loop"
require_text "product-video-producer/references/render-review-iteration.md" "Privacy, consent, rights, product-truth, accessibility, and output-identity failures remain blocking" "non-waivable delivery blockers"
require_text "product-video-producer/references/channel-delivery-feedback.md" "Do not center-crop a desktop demo into a Short" "native channel adaptation"
require_text "product-video-producer/references/channel-delivery-feedback.md" "uploading remains owner-gated" "channel publication boundary"
require_text "product-video-producer/references/channel-delivery-feedback.md" "dated source ledger tied to script/timecodes" "educational source and correction discipline"
require_text "product-video-producer/references/channel-delivery-feedback.md" "After explicit approval for the exact target and artifact" "authorized publication gate"
require_text "product-video-producer/references/channel-delivery-feedback.md" "prefer engaged-view and stayed-to-watch signals" "Shorts evidence quality"
require_text "product-video-producer/references/channel-delivery-feedback.md" "Recheck classification, dimensions, bitrates" "live platform policy check"
require_text "product-video-producer/assets/video-manifest.schema.json" '"speech_present"' "speech applicability contract"
require_text "product-video-producer/assets/video-manifest.schema.json" '"source_authority": { "const": "official_primary" }' "official platform source contract"
require_text "product-video-producer/scripts/validate-video-manifest.mjs" "accepted manifest validation requires --verify-media" "live probe fail-closed gate"
require_text "product-video-producer/scripts/validate-video-manifest.mjs" "current-spec verification is older than 30 days" "platform freshness gate"
require_text "skill-evals/product-video-producer-scenarios.md" "Automatic video specialist selection" "source-unaware routing scenario"
require_text "skill-evals/product-video-producer-scenarios.md" "Reference-led direction" "reference originality scenario"
require_text "skill-evals/product-video-producer-scenarios.md" "Inaccessible reference" "reference hallucination scenario"
require_text "skill-evals/product-video-producer-scenarios.md" "Abstract product" "abstract product truth scenario"
require_text "skill-evals/product-video-producer-scenarios.md" "Logo matte defect" "logo regression scenario"
require_text "skill-evals/product-video-producer-scenarios.md" "Deterministic 4K" "render regression scenario"
require_text "skill-evals/product-video-producer-scenarios.md" "Exact critique" "critique regression scenario"
require_text "skill-evals/product-video-producer-scenarios.md" "Unsupported proof" "unsupported claim scenario"
require_text "skill-evals/product-video-producer-scenarios.md" "Privacy-safe software demo" "capture privacy regression scenario"
require_text "skill-evals/product-video-producer-scenarios.md" "Enterprise anti-slop" "enterprise editorial scenario"
require_text "skill-evals/product-video-producer-scenarios.md" "Generated sequence continuity" "generated continuity scenario"
require_text "skill-evals/product-video-producer-scenarios.md" "Non-destructive editing" "editing lineage scenario"
require_text "skill-evals/product-video-producer-scenarios.md" "Long-form and Short" "channel adaptation scenario"
require_text "skill-evals/product-video-producer-scenarios.md" "Accessible post" "accessibility scenario"
require_text "skill-evals/product-video-producer-scenarios.md" "Synthetic media and rights" "synthetic media regression scenario"
require_text "skill-evals/product-video-producer-scenarios.md" "Wrong output identity" "output identity regression scenario"
require_text "skill-evals/product-video-producer-scenarios.md" "Evidence-led YouTube learning" "analytics learning regression scenario"
require_text "skill-evals/product-video-producer-scenarios.md" "Publication boundary" "publication authority scenario"

if node "$repo_root/product-video-producer/scripts/validate-video-manifest.mjs" --self-test; then
  echo "ok: video manifest validator"
else
  echo "ERROR: video manifest validator self-test failed" >&2
  errors=$((errors + 1))
fi

if [ "$errors" -gt 0 ]; then
  echo "video production behavior audit failed: $errors issue(s)" >&2
  exit 1
fi

echo "video production behavior audit passed"
