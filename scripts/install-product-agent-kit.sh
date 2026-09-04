#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
template_dir="$repo_root/templates/product-repo"
version_file=".codex/product-agent-kit.version"
inventory_file=".codex/product-agent-kit.files"
target="${PWD}"
target_set=0
mode="install"

usage() {
  cat <<'USAGE'
Usage: bash scripts/install-product-agent-kit.sh [--check|--stage-update] [target-repo]

Copies the WordPress product autonomy kit into a plugin/theme repository:
  AGENTS.md
  PRODUCT.md
  .codex/product-agent-kit.version
  .codex/product-agent-kit.files
  .codex/product-docs-intake.md
  .codex/config.toml
  .codex/agents/*.toml
  .codex/prompts/*.md

Existing files are never overwritten.
  --check         Report missing or changed files; exit 3 when drift exists.
  --stage-update  Copy drifted templates into a versioned review directory.
Retired managed paths are reported for review and are never deleted.
USAGE
}

die() {
  echo "$*" >&2
  exit 1
}

validate_relative_path() {
  local rel_path="$1"

  case "$rel_path" in
    ""|/*|"."|".."|"./"*|"../"*|*/".."|*/"../"*|*//*)
      die "unsafe managed path: $rel_path"
      ;;
  esac
}

assert_no_symlink_components() {
  local root="$1"
  local rel_path="$2"
  local remaining="$rel_path"
  local component
  local cursor="$root"

  validate_relative_path "$rel_path"
  while [ -n "$remaining" ]; do
    case "$remaining" in
      */*)
        component="${remaining%%/*}"
        remaining="${remaining#*/}"
        ;;
      *)
        component="$remaining"
        remaining=""
        ;;
    esac
    cursor="$cursor/$component"
    if [ -L "$cursor" ]; then
      die "unsafe symlink in managed path: $cursor"
    fi
  done
}

assert_contained() {
  local root="$1"
  local path="$2"
  local label="$3"

  case "$path" in
    "$root"|"$root"/*)
      ;;
    *)
      die "$label escapes managed root: $path"
      ;;
  esac
}

prepare_parent() {
  local root="$1"
  local rel_path="$2"
  local parent_rel
  local parent
  local canonical_parent

  assert_no_symlink_components "$root" "$rel_path"
  case "$rel_path" in
    */*) parent_rel="${rel_path%/*}" ;;
    *) parent_rel="" ;;
  esac

  parent="$root"
  if [ -n "$parent_rel" ]; then
    parent="$root/$parent_rel"
    mkdir -p "$parent"
    assert_no_symlink_components "$root" "$parent_rel"
  fi

  canonical_parent="$(cd "$parent" && pwd -P)"
  assert_contained "$root" "$canonical_parent" "destination parent"
}

prepare_stage_root() {
  local target_root="$1"
  local stage_rel="$2"
  local canonical_stage

  assert_no_symlink_components "$target_root" "$stage_rel"
  mkdir -p "$target_root/$stage_rel"
  assert_no_symlink_components "$target_root" "$stage_rel"
  canonical_stage="$(cd "$target_root/$stage_rel" && pwd -P)"
  assert_contained "$target_root" "$canonical_stage" "stage directory"
  printf '%s\n' "$canonical_stage"
}

validate_template_inventory() {
  local expected
  local actual

  expected="$(mktemp "${TMPDIR:-/tmp}/product-agent-kit.expected.XXXXXX")"
  actual="$(mktemp "${TMPDIR:-/tmp}/product-agent-kit.actual.XXXXXX")"

  while IFS= read -r rel_path || [ -n "$rel_path" ]; do
    validate_relative_path "$rel_path"
    printf '%s\n' "$rel_path"
  done < "$template_dir/$inventory_file" | LC_ALL=C sort -u > "$expected"

  (cd "$template_dir" && find . -type f | sed 's#^./##' | LC_ALL=C sort) > "$actual"
  if ! cmp -s "$expected" "$actual"; then
    echo "template inventory does not match managed files:" >&2
    diff -u "$expected" "$actual" >&2 || true
    rm -f "$expected" "$actual"
    exit 1
  fi
  rm -f "$expected" "$actual"
}

while [ "$#" -gt 0 ]; do
  case "$1" in
    --help|-h)
      usage
      exit 0
      ;;
    --check)
      [ "$mode" = "install" ] || { echo "choose one mode" >&2; exit 2; }
      mode="check"
      ;;
    --stage-update)
      [ "$mode" = "install" ] || { echo "choose one mode" >&2; exit 2; }
      mode="stage"
      ;;
    --force)
      echo "--force is unsupported: use --stage-update and review candidates" >&2
      exit 2
      ;;
    -*)
      usage >&2
      exit 2
      ;;
    *)
      [ "$target_set" -eq 0 ] || { usage >&2; exit 2; }
      target="$1"
      target_set=1
      ;;
  esac
  shift
done

if [ ! -d "$target" ]; then
  echo "target directory does not exist: $target" >&2
  exit 1
fi

if [ ! -d "$template_dir" ]; then
  echo "template directory missing: $template_dir" >&2
  exit 1
fi

if [ ! -f "$template_dir/$version_file" ]; then
  echo "template version missing: $version_file" >&2
  exit 1
fi

if [ ! -f "$template_dir/$inventory_file" ]; then
  echo "template inventory missing: $inventory_file" >&2
  exit 1
fi

target_root="$(cd "$target" && pwd -P)"
validate_template_inventory

kit_version="$(tr -d '[:space:]' < "$template_dir/$version_file")"
stage_rel=".codex/product-agent-kit-updates/v$kit_version"
stage_root=""
copied=0
current=0
skipped=0
drift=0
staged=0
retired=0

existing_unversioned=0
assert_no_symlink_components "$target_root" "$version_file"
assert_no_symlink_components "$target_root" "$inventory_file"
if [ ! -e "$target_root/$version_file" ]; then
  while IFS= read -r rel_path; do
    assert_no_symlink_components "$target_root" "$rel_path"
    if [ "$rel_path" != "$version_file" ] && [ -e "$target_root/$rel_path" ]; then
      existing_unversioned=1
      break
    fi
  done < "$template_dir/$inventory_file"
fi

if [ -f "$target_root/$inventory_file" ]; then
  while IFS= read -r old_rel_path || [ -n "$old_rel_path" ]; do
    validate_relative_path "$old_rel_path"
    if ! grep -Fxq -- "$old_rel_path" "$template_dir/$inventory_file"; then
      assert_no_symlink_components "$target_root" "$old_rel_path"
      if [ -e "$target_root/$old_rel_path" ]; then
        echo "retired managed path (preserved): $old_rel_path"
        retired=$((retired + 1))
      fi
    fi
  done < "$target_root/$inventory_file"
fi

while IFS= read -r rel_path; do
  src="$template_dir/$rel_path"
  dest="$target_root/$rel_path"
  assert_no_symlink_components "$target_root" "$rel_path"

  if [ -e "$dest" ] && cmp -s "$src" "$dest"; then
    echo "current: $rel_path"
    current=$((current + 1))
    continue
  fi

  drift=$((drift + 1))

  if [ "$mode" = "check" ]; then
    if [ -e "$dest" ]; then
      echo "changed: $rel_path"
    else
      echo "missing: $rel_path"
    fi
    continue
  fi

  if [ "$mode" = "stage" ]; then
    if [ -z "$stage_root" ]; then
      stage_root="$(prepare_stage_root "$target_root" "$stage_rel")"
    fi
    candidate="$stage_root/$rel_path"
    prepare_parent "$stage_root" "$rel_path"
    if [ -e "$candidate" ]; then
      if cmp -s "$src" "$candidate"; then
        echo "preserved staged candidate: $rel_path"
        skipped=$((skipped + 1))
      else
        echo "staged candidate conflicts with version $kit_version: bump the kit version" >&2
        exit 4
      fi
    else
      cp "$src" "$candidate"
      echo "staged for review: $rel_path"
      staged=$((staged + 1))
    fi
    continue
  fi

  if [ -e "$dest" ]; then
    echo "preserved existing: $rel_path"
    skipped=$((skipped + 1))
    continue
  fi

  if [ "$rel_path" = "$version_file" ] && [ "$existing_unversioned" -eq 1 ]; then
    echo "preserved unversioned kit: use --stage-update before adopting version $kit_version"
    skipped=$((skipped + 1))
    continue
  fi

  prepare_parent "$target_root" "$rel_path"
  cp "$src" "$dest"
  echo "copied: $rel_path"
  copied=$((copied + 1))
done < "$template_dir/$inventory_file"

if [ "$mode" = "check" ]; then
  echo "check: version $kit_version, current $current, drift $drift, retired $retired"
  [ "$drift" -eq 0 ] && [ "$retired" -eq 0 ] || exit 3
elif [ "$mode" = "stage" ]; then
  echo "staged: version $kit_version, candidates $staged, current $current, preserved $skipped, retired $retired"
  if [ "$drift" -ne 0 ]; then
    echo "review $stage_root and reconcile active files manually"
  fi
  [ "$retired" -eq 0 ] || echo "review retired managed paths manually; no files were deleted"
else
  echo "done: version $kit_version, copied $copied, current $current, preserved $skipped, retired $retired"
fi
