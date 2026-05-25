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
  --help      Show this message

Examples:
  bash scripts/validate-references.sh
  bash scripts/validate-references.sh --links
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
  ((errors++))
}

log_warning() {
  echo -e "${YELLOW}⚠ WARNING: $1${NC}" >&2
  ((warnings++))
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
    grep -o '`references/[a-z0-9-]*\.md`' "$skill_file" | sed 's/`//g' | while read -r ref_path; do
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
    grep -o '\.\./shared/references/[a-z0-9-]*\.md' "$skill_dir/SKILL.md" 2>/dev/null | sort -u | while read -r ref_path; do
      # Resolve relative to the skill directory
      local full_path="$skill_dir/$ref_path"

      if [ ! -f "$full_path" ]; then
        log_error "Referenced but missing: $ref_path"
      else
        log_success "Found shared: $ref_path"
      fi
    done
  done < <(find_skill_dirs)
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

    # Skip shared references (they're not in the routing map, they're in the SKILL.md)
    if [ "$ref_file" = "research-token-discipline.md" ] || [ "$ref_file" = "production-dependency-discipline.md" ]; then
      log_success "Routing map: $ref_file (shared, skipped)"
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

      # Check if referenced in SKILL.md or routing map
      if ! grep -q "$ref_file" "$skill_dir/SKILL.md" 2>/dev/null && \
         ! grep -q "$ref_file" "$skill_dir/references/reference-routing-map.md" 2>/dev/null; then
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
  )

  for file in "${files[@]}"; do
    if [ -f "$repo_root/$file" ]; then
      log_success "Found: $file"
    else
      log_warning "Missing: $file"
    fi
  done
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

  if [ "$check_type" = "--all" ] || [ "$check_type" = "all" ]; then
    check_all=1
  fi

  cd "$repo_root"

  echo "WP Expert Skill Pack - Validation Script"
  echo "========================================"

  if [ "$check_all" -eq 1 ] || [ "$check_type" = "files" ]; then
    validate_skill_files
    validate_referenced_files
    validate_unreferenced_files
  fi

  if [ "$check_all" -eq 1 ] || [ "$check_type" = "routing" ]; then
    validate_routing_map
  fi

  if [ "$check_all" -eq 1 ]; then
    validate_skill_format
    validate_reference_sizes
    validate_scripts
    validate_metadata
  fi

  print_summary
}

main "$@"
