#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
errors=0

error() {
  echo "missing: $1" >&2
  errors=$((errors + 1))
}

ok() {
  echo "ok: $1"
}

reference_mentions() {
  local file="$1"
  { grep -Eo '(\.\./)?(wp-expert|shared)?/?references/[A-Za-z0-9_.-]+\.md' "$file" 2>/dev/null || true; } | wc -l | awk '{print $1}'
}

skill_limit() {
  case "$1" in
    content-writer) echo 4 ;;
    wp-portfolio-cto) echo 8 ;;
    wp-product-orchestrator) echo 11 ;;
    wp-expert) echo 8 ;;
    wp-plugin-expert|wp-theme-expert|wp-site-expert|wp-contributor) echo 10 ;;
    *) echo 10 ;;
  esac
}

check_skill_fanout() {
  local skill_dir skill_name skill_file count limit
  while IFS= read -r skill_dir; do
    skill_name="$(basename "$skill_dir")"
    skill_file="$skill_dir/SKILL.md"
    count="$(reference_mentions "$skill_file")"
    limit="$(skill_limit "$skill_name")"

    if [ "$count" -gt "$limit" ]; then
      error "$skill_name references $count files in SKILL.md; max is $limit"
    else
      ok "$skill_name reference fan-out $count/$limit"
    fi
  done < <(find "$repo_root" -mindepth 1 -maxdepth 1 -type d -exec test -f "{}/SKILL.md" \; -print | sort)
}

require_text() {
  local file="$1" text="$2" label="$3"
  if grep -Fq "$text" "$repo_root/$file"; then
    ok "$label"
  else
    error "$label ($file)"
  fi
}

check_reference_exists() {
  local file="$1" ref="$2"
  local base full
  base="$(dirname "$file")"

  if [[ "$ref" == ../* || "$ref" == references/* ]]; then
    full="$base/$ref"
  elif [[ "$file" == */references/* ]]; then
    full="$base/$ref"
  else
    return 0
  fi

  if [ ! -f "$full" ]; then
    error "broken reference $ref in ${file#$repo_root/}"
  fi
}

check_all_md_links() {
  local file ref
  while IFS= read -r file; do
    while IFS= read -r ref; do
      check_reference_exists "$file" "$ref"
    done < <({ grep -Eo '`(\.\./[^`]+|references/[^`]+|[a-z0-9-]+\.md)`' "$file" 2>/dev/null || true; } | tr -d '`' | grep -E '\.md$' || true)
  done < <(find "$repo_root" \( -path '*/SKILL.md' -o -path '*/references/router.md' \) -type f | sort)
}

check_reference_chain_discipline() {
  local matches
  matches="$(rg -n 'also read|Use it alongside|use .* alongside' "$repo_root/wp-expert/references" "$repo_root/shared/references" 2>/dev/null || true)"
  if [ -n "$matches" ]; then
    error "references contain broad read-chaining directives"
    printf '%s\n' "$matches" >&2
  else
    ok "reference introductions avoid broad read chaining"
  fi
}

check_shared_reference_reachability() {
  local ref basename
  while IFS= read -r ref; do
    basename="$(basename "$ref")"
    if ! grep -RFq "$basename" \
      "$repo_root"/*/SKILL.md \
      "$repo_root"/*/references/router.md \
      "$repo_root/wp-expert/references/reference-routing-map.md" 2>/dev/null; then
      error "shared reference is not reachable from a skill/router: $basename"
    fi
  done < <(find "$repo_root/shared/references" -maxdepth 1 -type f -name '*.md' | sort)
}

check_router_discipline() {
  require_text "wp-expert/SKILL.md" "clear tasks should trigger the specialist directly" "wp-expert narrow trigger wording"
  require_text "wp-expert/SKILL.md" "Auto-select the specialist by the task's primary artifact or outcome" "wp-expert auto specialist selection"
  require_text "wp-plugin-expert/SKILL.md" "Use for WordPress plugin/product engineering" "plugin trigger description"
  require_text "wp-theme-expert/SKILL.md" "Use for WordPress theme engineering" "theme trigger description"
  require_text "wp-site-expert/SKILL.md" "Use for WordPress site engineering" "site trigger description"
  require_text "wp-portfolio-cto/SKILL.md" "Use for cross-product WordPress portfolio CTO governance" "portfolio CTO trigger description"
  require_text "wp-product-orchestrator/SKILL.md" "Use for one WordPress product control thread" "product orchestrator trigger description"
  require_text "wp-expert/SKILL.md" "wp-portfolio-cto" "wp-expert portfolio specialist routing"
  require_text "wp-contributor/SKILL.md" "Use for official WordPress contribution" "contributor trigger description"
  require_text "loop-steward/SKILL.md" "control-plane PR" "loop steward trigger description"
  require_text "wp-expert/SKILL.md" 'use `loop-steward`' "control-plane routing boundary"
  require_text "wp-portfolio-cto/SKILL.md" "references/router.md" "portfolio router pointer"
  require_text "wp-product-orchestrator/SKILL.md" "references/router.md" "product router pointer"
  require_text "wp-product-orchestrator/references/router.md" "authority-growth-lane.md" "authority growth route"
  require_text "wp-product-orchestrator/references/router.md" "weekly-wordpress-intelligence.md" "weekly intelligence route"
  require_text "wp-product-orchestrator/references/router.md" "repo-product-docs-contract.md" "repo docs route"
  require_text "shared/references/context-window-discipline.md" "Context decision: Compact|Fresh thread|Continue" "context decision status phrase"
  require_text "wp-product-orchestrator/SKILL.md" "Context decision: Compact|Fresh thread|Continue" "orchestrator context decision line"
  require_text "wp-product-orchestrator/SKILL.md" "Route by artifact" "orchestrator worker auto routing"
  require_text "wp-portfolio-cto/SKILL.md" "Route backlog" "portfolio routes product execution"
  require_text "wp-plugin-expert/SKILL.md" "references/router.md" "plugin router pointer"
  require_text "wp-theme-expert/SKILL.md" "references/router.md" "theme router pointer"
  require_text "wp-site-expert/SKILL.md" "references/router.md" "site router pointer"
  require_text "wp-contributor/SKILL.md" "references/router.md" "contributor router pointer"
  require_text "shared/references/project-subagent-routing.md" "Assign one lane and the narrowest skill/reference" "subagent narrow skill selection"
  require_text "shared/references/project-subagent-routing.md" "Availability-First Routing Contract" "subagent model reasoning routing"
  require_text "shared/references/project-subagent-routing.md" "lowest sufficient available capability tier" "subagent strongest-model guard"
  require_text "shared/references/project-subagent-routing.md" 'Plugin: `$wp-plugin-expert`' "subagent plugin specialist profile"
  require_text "shared/references/project-subagent-routing.md" 'Theme/FSE: `$wp-theme-expert`' "subagent theme specialist profile"
  require_text "wp-plugin-expert/references/router.md" "plugin-product-architecture.md" "plugin expertise preserved in router"
  require_text "wp-theme-expert/references/router.md" "custom-block-theme-from-design.md" "theme design-to-FSE expertise preserved in router"
  require_text "wp-site-expert/references/router.md" "conversion-focused-website-engineering.md" "site conversion expertise preserved in router"
  require_text "wp-contributor/references/router.md" "gutenberg-workflow.md" "contributor Gutenberg expertise preserved in router"
}

check_skill_fanout
check_router_discipline
check_all_md_links
check_reference_chain_discipline
check_shared_reference_reachability

if [ "$errors" -gt 0 ]; then
  echo "routing audit failed: $errors issue(s)" >&2
  exit 1
fi

echo "routing audit passed"
