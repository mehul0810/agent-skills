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

check_router_discipline() {
  require_text "wp-expert/SKILL.md" "clear tasks should trigger the specialist directly" "wp-expert narrow trigger wording"
  require_text "wp-expert/SKILL.md" "Auto-select the specialist by the task's primary artifact or outcome" "wp-expert auto specialist selection"
  require_text "wp-plugin-expert/SKILL.md" "Use for WordPress plugin/product engineering" "plugin trigger description"
  require_text "wp-theme-expert/SKILL.md" "Use for WordPress theme engineering" "theme trigger description"
  require_text "wp-site-expert/SKILL.md" "Use for WordPress site engineering" "site trigger description"
  require_text "wp-portfolio-cto/SKILL.md" "Use for cross-product WordPress portfolio CTO governance" "portfolio CTO trigger description"
  require_text "wp-product-orchestrator/SKILL.md" "Use for one WordPress plugin/theme product thread" "product orchestrator trigger description"
  require_text "wp-expert/SKILL.md" "wp-portfolio-cto" "wp-expert portfolio specialist routing"
  require_text "wp-contributor/SKILL.md" "Use for official WordPress contribution" "contributor trigger description"
  require_text "shared/references/context-window-discipline.md" "Context decision: Compact|Fresh thread|Continue" "context decision status phrase"
  require_text "wp-product-orchestrator/SKILL.md" "Context decision: Compact|Fresh thread|Continue" "orchestrator context decision line"
  require_text "wp-product-orchestrator/SKILL.md" "Auto-route workers by changed artifact" "orchestrator worker auto routing"
  require_text "wp-portfolio-cto/SKILL.md" "Route product-level backlog" "portfolio routes product execution"
  require_text "wp-plugin-expert/SKILL.md" "references/router.md" "plugin router pointer"
  require_text "wp-theme-expert/SKILL.md" "references/router.md" "theme router pointer"
  require_text "wp-site-expert/SKILL.md" "references/router.md" "site router pointer"
  require_text "wp-contributor/SKILL.md" "references/router.md" "contributor router pointer"
  require_text "shared/references/project-subagent-routing.md" "Auto-select the narrowest skill from the artifact" "subagent narrow skill selection"
  require_text "shared/references/project-subagent-routing.md" "Model And Reasoning Routing" "subagent model reasoning routing"
  require_text "shared/references/project-subagent-routing.md" "do not default every worker to the strongest model" "subagent strongest-model guard"
  require_text "shared/references/project-subagent-routing.md" 'Use $wp-plugin-expert with plugin-architecture.md only' "subagent plugin specialist profile"
  require_text "shared/references/project-subagent-routing.md" 'Use $wp-theme-expert with block-theme-architecture.md only' "subagent theme specialist profile"
  require_text "wp-plugin-expert/references/router.md" "plugin-product-architecture.md" "plugin expertise preserved in router"
  require_text "wp-theme-expert/references/router.md" "custom-block-theme-from-design.md" "theme design-to-FSE expertise preserved in router"
  require_text "wp-site-expert/references/router.md" "conversion-focused-website-engineering.md" "site conversion expertise preserved in router"
  require_text "wp-contributor/references/router.md" "gutenberg-workflow.md" "contributor Gutenberg expertise preserved in router"
}

check_skill_fanout
check_router_discipline
check_all_md_links

if [ "$errors" -gt 0 ]; then
  echo "routing audit failed: $errors issue(s)" >&2
  exit 1
fi

echo "routing audit passed"
