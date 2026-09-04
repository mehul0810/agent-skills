#!/usr/bin/env bash
set -euo pipefail

# Validation script for WP Expert skill pack
# Ensures references are complete, consistent, and properly linked

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "$script_dir/.." && pwd)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

errors=0
warnings=0

usage() {
  cat <<'USAGE'
Usage: bash validate-references.sh [options]

Validate skill pack references for consistency and completeness.

Options:
  --all       Run all validations (default)
  --links     Check for broken references only
  --files     Check that referenced files exist
  --routing   Validate reference routing map
  --fanout    Check skill routing fan-out and modular router discipline
  --tokens    Check skill token budgets
  --routes    Check shared route-budget and scenario contracts
  --evals     Check shared route-budget and scenario contracts
  --behavior  Check critical agent behavior guardrails
  --orchestration
              Check product orchestrator CTO behavior guardrails
  --visual    Check visual-to-WordPress behavior guardrails
  --models    Check availability-first model routing
  --steward   Check Loop Steward authority guardrails
  --video     Check product video production guardrails
  --help      Show this message

Examples:
  bash scripts/validate-references.sh
  bash scripts/validate-references.sh --links
  bash scripts/validate-references.sh --tokens
USAGE
}

find_skill_dirs() {
  find "$repo_root" -mindepth 1 -maxdepth 1 -type d \
    ! -name ".git" \
    ! -name ".claude" \
    ! -name "shared" \
    ! -name "scripts" \
    -exec test -f "{}/SKILL.md" \; \
    -print | sort
}

log_error() {
  echo -e "${RED}✗ ERROR: $1${NC}" >&2
  errors=$((errors + 1))
}

log_warning() {
  echo -e "${YELLOW}⚠ WARNING: $1${NC}" >&2
  warnings=$((warnings + 1))
}

log_success() {
  echo -e "${GREEN}✓ $1${NC}"
}

# Check if file exists
check_file_exists() {
  local file="$1"
  if [ ! -f "$file" ]; then
    log_error "Missing file: $file"
    return 1
  fi
  return 0
}

# Validate SKILL.md files exist
validate_skill_files() {
  echo "=== Checking SKILL.md files ==="

  local skill_dir
  while IFS= read -r skill_dir; do
    check_file_exists "$skill_dir/SKILL.md"
  done < <(find_skill_dirs)

  log_success "SKILL.md files exist"
}

# Check for referenced files
validate_referenced_files() {
  echo ""
  echo "=== Checking referenced files exist ==="

  local skill_file
  for skill_file in "$repo_root"/*/SKILL.md; do
    local skill_name
    skill_name="$(basename "$(dirname "$skill_file")")"

    # Extract reference file paths from SKILL.md
    local ref_line
    { grep -o '`references/[a-z0-9-]*\.md`' "$skill_file" 2>/dev/null || true; } | sed 's/`//g' | while read -r ref_path; do
      local full_path="$(dirname "$skill_file")/$ref_path"

      if [ ! -f "$full_path" ]; then
        log_error "[$skill_name] Referenced but missing: $ref_path"
      else
        log_success "[$skill_name] Found: $ref_path"
      fi
    done
  done

  # Also check shared references - resolve relative paths from each skill directory
  local skill_dir
  while IFS= read -r skill_dir; do
    { grep -o '\.\./shared/references/[a-z0-9-]*\.md' "$skill_dir/SKILL.md" 2>/dev/null || true; } | sort -u | while read -r ref_path; do
      # Resolve relative to the skill directory
      local full_path="$skill_dir/$ref_path"

      if [ ! -f "$full_path" ]; then
        log_error "Referenced but missing: $ref_path"
      else
        log_success "Found shared: $ref_path"
      fi
    done

    { grep -o '\.\./wp-expert/references/[a-z0-9-]*\.md' "$skill_dir/SKILL.md" 2>/dev/null || true; } | sort -u | while read -r ref_path; do
      # Specialist router skills reuse the canonical wp-expert reference playbooks.
      local full_path="$skill_dir/$ref_path"

      if [ ! -f "$full_path" ]; then
        log_error "Referenced but missing: $ref_path"
      else
        log_success "Found wp-expert reference: $ref_path"
      fi
    done
  done < <(find_skill_dirs)
}

# Resolve routed Markdown files from the file that owns each route. This catches
# broken reference-to-reference paths without treating historical root docs as
# executable skill routing.
validate_relative_reference_routes() {
  echo ""
  echo "=== Checking relative reference routes ==="

  local checked=0
  local source_file
  while IFS= read -r source_file; do
    local token
    while IFS= read -r token; do
      local ref_path="$token"

      ref_path="${ref_path#\`}"
      ref_path="${ref_path%\`}"
      ref_path="${ref_path#]\(}"
      ref_path="${ref_path%\)}"
      ref_path="${ref_path%%#*}"

      checked=$((checked + 1))
      if [ ! -f "$(dirname "$source_file")/$ref_path" ]; then
        log_error "Broken route in ${source_file#$repo_root/}: $ref_path"
      fi
    done < <(
      grep -Eo '`((\.\./)+|references/)[a-zA-Z0-9_./-]+\.md`|\]\(((\.\./)+|references/)[a-zA-Z0-9_./-]+\.md(#[^)]*)?\)' \
        "$source_file" 2>/dev/null | sort -u || true
    )
  done < <(
    while IFS= read -r skill_dir; do
      printf '%s\n' "$skill_dir/SKILL.md"
      if [ -d "$skill_dir/references" ]; then
        find "$skill_dir/references" -maxdepth 1 -type f -name "*.md" -print
      fi
    done < <(find_skill_dirs)
  )

  if [ "$checked" -eq 0 ]; then
    log_warning "No relative reference routes were found"
  else
    log_success "Checked $checked relative reference route(s)"
  fi
}

# Validate reference routing map
validate_routing_map() {
  echo ""
  echo "=== Validating reference routing map ==="

  local routing_file="$repo_root/wp-expert/references/reference-routing-map.md"

  if [ ! -f "$routing_file" ]; then
    log_error "Reference routing map not found: $routing_file"
    return 1
  fi

  # Extract references from routing map
  grep -o '`[a-z0-9-]*\.md`' "$routing_file" | sed 's/`//g' | sort -u | while read -r ref_file; do
    local full_path="$repo_root/wp-expert/references/$ref_file"

    local shared_path="$repo_root/shared/references/$ref_file"
    if [ -f "$shared_path" ]; then
      log_success "Routing map: $ref_file exists in shared references"
      continue
    fi

    if [ ! -f "$full_path" ]; then
      log_error "Routing map references missing file: $ref_file"
    else
      log_success "Routing map: $ref_file exists"
    fi
  done

  log_success "Reference routing map is valid"
}

# Check for unreferenced files
validate_unreferenced_files() {
  echo ""
  echo "=== Checking for unreferenced reference files ==="

  local skill_dir
  while IFS= read -r skill_dir; do
    local skill_name
    skill_name="$(basename "$skill_dir")"

    local ref_dir="$skill_dir/references"
    if [ ! -d "$ref_dir" ]; then
      continue
    fi

    local ref_file
    find "$ref_dir" -maxdepth 1 -name "*.md" -type f | while read -r ref_file; do
      ref_file="$(basename "$ref_file")"

      # Skip reference-routing-map.md as it's meta
      if [ "$ref_file" = "reference-routing-map.md" ]; then
        continue
      fi

      # A specialist router may intentionally own a reference stored under wp-expert.
      if ! grep -q "$ref_file" "$repo_root"/*/SKILL.md 2>/dev/null && \
         ! grep -q "$ref_file" "$repo_root"/*/references/router.md 2>/dev/null && \
         ! grep -q "$ref_file" "$repo_root"/*/references/reference-routing-map.md 2>/dev/null; then
        log_warning "[$skill_name] Unreferenced file: $ref_file"
      else
        log_success "[$skill_name] Referenced: $ref_file"
      fi
    done
  done < <(find_skill_dirs)
}

# Validate SKILL.md format
validate_skill_format() {
  echo ""
  echo "=== Validating SKILL.md format ==="

  local skill_file
  for skill_file in "$repo_root"/*/SKILL.md; do
    local skill_name
    skill_name="$(basename "$(dirname "$skill_file")")"

    # Check for frontmatter
    if ! head -1 "$skill_file" | grep -q "^---$"; then
      log_error "[$skill_name] Missing frontmatter start"
    else
      log_success "[$skill_name] Has frontmatter"
    fi

    # Check for name in frontmatter
    if ! grep -q "^name:" "$skill_file"; then
      log_error "[$skill_name] Missing 'name' in frontmatter"
    else
      log_success "[$skill_name] Has name"
    fi

    # Check for description in frontmatter
    if ! grep -q "^description:" "$skill_file"; then
      log_error "[$skill_name] Missing 'description' in frontmatter"
    else
      log_success "[$skill_name] Has description"
    fi
  done
}

# Check for reference file size
validate_reference_sizes() {
  echo ""
  echo "=== Checking reference file sizes ==="

  local skill_dir
  while IFS= read -r skill_dir; do
    local skill_name
    skill_name="$(basename "$skill_dir")"

    local ref_dir="$skill_dir/references"
    if [ ! -d "$ref_dir" ]; then
      continue
    fi

    find "$ref_dir" -maxdepth 1 -name "*.md" -type f | while read -r ref_file; do
      local lines
      lines=$(wc -l < "$ref_file" | awk '{print $1}')
      local filename
      filename="$(basename "$ref_file")"

      if [ "$lines" -lt 10 ]; then
        log_warning "[$skill_name] Stub file (may be intentional): $filename ($lines lines)"
      elif [ "$lines" -gt 500 ]; then
        log_warning "[$skill_name] Very large file (consider splitting): $filename ($lines lines)"
      else
        log_success "[$skill_name] Good size: $filename ($lines lines)"
      fi
    done
  done < <(find_skill_dirs)
}

# Check helper scripts
validate_scripts() {
  echo ""
  echo "=== Validating helper scripts ==="

  local skill_dir
  while IFS= read -r skill_dir; do
    local script
    for script in "$skill_dir"/scripts/*.sh; do
      if [ ! -f "$script" ]; then
        continue
      fi

      local script_name
      script_name="$(basename "$script")"

      # Check syntax
      if bash -n "$script" 2>/dev/null; then
        log_success "Script syntax OK: $script_name"
      else
        log_error "Script syntax error: $script_name"
      fi

      # Check executable
      if [ -x "$script" ]; then
        log_success "Script is executable: $script_name"
      else
        log_warning "Script not executable: $script_name"
      fi
    done
  done < <(find_skill_dirs)
}

validate_engineering_graph() {
  echo ""
  echo "=== Validating engineering graph contract ==="

  if node "$repo_root/wp-expert/scripts/validate-engineering-graph.mjs" --self-test; then
    log_success "Engineering graph validator rejects incomplete critical proof"
  else
    log_error "Engineering graph validator self-test failed"
  fi
}

validate_behavior_evidence() {
  echo ""
  echo "=== Validating fresh-agent behavior evidence ==="

  if node "$repo_root/scripts/behavior-evidence-audit.mjs"; then
    log_success "Fresh-agent evidence matches the current behavior sources"
  else
    log_error "Fresh-agent behavior evidence is stale or incomplete"
  fi
}

validate_contract_integrity() {
  echo ""
  echo "=== Validating contract versions and source freshness ==="

  if node "$repo_root/scripts/contract-integrity-audit.mjs" &&
    node "$repo_root/scripts/source-freshness-audit.mjs"; then
    log_success "Contract versions and selected external sources are current"
  else
    log_error "Contract integrity or source freshness validation failed"
  fi
}

# Check metadata files
validate_metadata() {
  echo ""
  echo "=== Validating metadata files ==="

  local files=(
    "VERSION"
    "CHANGELOG.md"
    "README.md"
    "CONTRIBUTING.md"
    "SYSTEM_REQUIREMENTS.md"
    "QUICK_REFERENCE.md"
    "AGENTS.md"
    "TESTING.md"
  )

  for file in "${files[@]}"; do
    if [ -f "$repo_root/$file" ]; then
      log_success "Found: $file"
    else
      log_warning "Missing: $file"
    fi
  done
}

validate_agent_metadata() {
  echo ""
  echo "=== Validating skill agent metadata ==="

  local skill_dir
  while IFS= read -r skill_dir; do
    local skill_name
    local metadata_file
    skill_name="$(basename "$skill_dir")"
    metadata_file="$skill_dir/agents/openai.yaml"

    if [ ! -f "$metadata_file" ]; then
      log_error "[$skill_name] Missing agents/openai.yaml"
      continue
    fi

    for field in display_name short_description default_prompt; do
      if ! grep -Eq "^[[:space:]]+${field}:[[:space:]]+\".+\"" "$metadata_file"; then
        log_error "[$skill_name] Missing non-empty agents/openai.yaml field: $field"
      fi
    done

    if ! grep -Fq "\$$skill_name" "$metadata_file"; then
      log_error "[$skill_name] default prompt does not invoke \$$skill_name"
    else
      log_success "[$skill_name] Agent metadata is present and invocable"
    fi
  done < <(find_skill_dirs)
}

validate_token_budgets() {
  echo ""
  echo "=== Validating skill token budgets ==="

  if bash "$repo_root/scripts/skill-token-audit.sh"; then
    log_success "Skill token budgets are within limits"
  else
    log_error "Skill token budget audit failed"
  fi
}

validate_harness_contracts() {
  echo ""
  echo "=== Validating shared harness contracts ==="

  local node_bin="${NODE_BIN:-node}"
  if "$node_bin" "$repo_root/node_modules/@mehul0810/agent-harness/bin/agent-harness.js" validate --config "$repo_root/agent-harness.config.json"; then
    log_success "Route budgets and skill eval inventory are controlled"
  else
    log_error "Shared harness contract validation failed"
  fi
}

validate_behavior_rules() {
  echo ""
  echo "=== Validating critical behavior guardrails ==="

  if bash "$repo_root/scripts/skill-behavior-audit.sh"; then
    log_success "Critical behavior guardrails are present"
  else
    log_error "Critical behavior guardrail audit failed"
  fi
}

validate_orchestration_rules() {
  echo ""
  echo "=== Validating product orchestrator guardrails ==="

  if bash "$repo_root/scripts/orchestration-behavior-audit.sh"; then
    log_success "Product orchestrator guardrails are present"
  else
    log_error "Product orchestrator guardrail audit failed"
  fi

  if bash "$repo_root/scripts/command-ci-approval-audit.sh"; then
    log_success "Command and CI approval guardrails are present"
  else
    log_error "Command and CI approval guardrail audit failed"
  fi
}

validate_visual_wordpress_rules() {
  echo ""
  echo "=== Validating visual WordPress guardrails ==="

  if bash "$repo_root/scripts/visual-wordpress-behavior-audit.sh"; then
    log_success "Visual WordPress guardrails are present"
  else
    log_error "Visual WordPress guardrail audit failed"
  fi

  if node "$repo_root/wp-expert/scripts/validate-visual-proof.mjs" --self-test; then
    log_success "Visual proof receipt validator is valid"
  else
    log_error "Visual proof receipt validator failed"
  fi

  if node "$repo_root/wp-expert/scripts/validate-asset-production.mjs" --self-test; then
    log_success "Asset production receipt validator is valid"
  else
    log_error "Asset production receipt validator failed"
  fi
}

validate_quality_reviewer_rules() {
  echo ""
  echo "=== Validating quality reviewer guardrails ==="

  if bash "$repo_root/scripts/quality-reviewer-behavior-audit.sh"; then
    log_success "Quality reviewer guardrails are present"
  else
    log_error "Quality reviewer guardrail audit failed"
  fi
}

validate_model_routing_rules() {
  echo ""
  echo "=== Validating availability-first model routing ==="

  if bash "$repo_root/scripts/model-routing-audit.sh"; then
    log_success "Availability-first model routing is valid"
  else
    log_error "Availability-first model routing audit failed"
  fi
}

validate_loop_steward_rules() {
  echo ""
  echo "=== Validating Loop Steward guardrails ==="

  if bash "$repo_root/scripts/loop-steward-behavior-audit.sh"; then
    log_success "Loop Steward guardrails are present"
  else
    log_error "Loop Steward guardrail audit failed"
  fi
}

validate_video_production_rules() {
  echo ""
  echo "=== Validating product video production guardrails ==="

  if bash "$repo_root/scripts/video-production-behavior-audit.sh"; then
    log_success "Product video production guardrails are present"
  else
    log_error "Product video production guardrail audit failed"
  fi
}

validate_routing_fanout() {
  echo ""
  echo "=== Validating skill routing fan-out ==="

  if bash "$repo_root/scripts/skill-routing-audit.sh"; then
    log_success "Skill routing fan-out is controlled"
  else
    log_error "Skill routing fan-out audit failed"
  fi
}

# Summary
print_summary() {
  echo ""
  echo "================================"

  if [ "$errors" -eq 0 ] && [ "$warnings" -eq 0 ]; then
    echo -e "${GREEN}✓ All validations passed!${NC}"
    return 0
  elif [ "$errors" -eq 0 ]; then
    echo -e "${YELLOW}✓ Passed with $warnings warning(s)${NC}"
    return 0
  else
    echo -e "${RED}✗ Failed with $errors error(s) and $warnings warning(s)${NC}"
    return 1
  fi
}

# Main
main() {
  local check_all=0
  local check_type="${1:-all}"

  if [ "$check_type" = "--help" ] || [ "$check_type" = "-h" ]; then
    usage
    exit 0
  fi

  check_type="${check_type#--}"

  if [ "$check_type" = "all" ]; then
    check_all=1
  fi

  cd "$repo_root"

  echo "WP Expert Skill Pack - Validation Script"
  echo "========================================"

  if [ "$check_all" -eq 1 ] || [ "$check_type" = "files" ]; then
    validate_skill_files
    validate_referenced_files
    validate_relative_reference_routes
    validate_unreferenced_files
  elif [ "$check_type" = "links" ]; then
    validate_referenced_files
    validate_relative_reference_routes
  fi

  if [ "$check_all" -eq 1 ] || [ "$check_type" = "routing" ]; then
    validate_routing_map
  fi

  if [ "$check_all" -eq 1 ]; then
    validate_skill_format
    validate_reference_sizes
    validate_scripts
    validate_engineering_graph
    validate_behavior_evidence
    validate_contract_integrity
    validate_metadata
    validate_agent_metadata
    validate_token_budgets
    validate_harness_contracts
    validate_routing_fanout
    validate_behavior_rules
    validate_orchestration_rules
    validate_visual_wordpress_rules
    validate_quality_reviewer_rules
    validate_model_routing_rules
    validate_loop_steward_rules
    validate_video_production_rules
  elif [ "$check_type" = "tokens" ]; then
    validate_token_budgets
  elif [ "$check_type" = "routes" ]; then
    validate_harness_contracts
  elif [ "$check_type" = "evals" ]; then
    validate_harness_contracts
  elif [ "$check_type" = "fanout" ]; then
    validate_routing_fanout
  elif [ "$check_type" = "behavior" ]; then
    validate_behavior_rules
  elif [ "$check_type" = "orchestration" ]; then
    validate_orchestration_rules
  elif [ "$check_type" = "visual" ]; then
    validate_visual_wordpress_rules
  elif [ "$check_type" = "quality" ]; then
    validate_quality_reviewer_rules
  elif [ "$check_type" = "models" ]; then
    validate_model_routing_rules
  elif [ "$check_type" = "steward" ]; then
    validate_loop_steward_rules
  elif [ "$check_type" = "video" ]; then
    validate_video_production_rules
  fi

  print_summary
}

main "$@"
