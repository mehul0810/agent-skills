#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
codex_skills_dir="${CODEX_HOME:-$HOME/.codex}/skills"
claude_skills_dir="${CLAUDE_HOME:-$HOME/.claude}/skills"
force=0
design_defaults=0
check_design_defaults=0

usage() {
  cat <<'USAGE'
Usage:
  bash scripts/install-global-skill-links.sh [--force] [--design-defaults] [--check-design-defaults] [skill-name ...]

Options:
  --force    Repoint incorrect symlinks. Real files/directories are never replaced.
  --design-defaults  Append this repo's marked design defaults to CODEX_HOME/AGENTS.md.
  --check-design-defaults  Check the marked policy and shared-reference link without writing.

Defaults:
  - If no skill names are provided, all top-level skill directories in this repo
    that contain SKILL.md are linked.
  - Codex target:  ${CODEX_HOME:-~/.codex}/skills/<skill-name>
  - Claude target: ${CLAUDE_HOME:-~/.claude}/skills/<skill-name>
USAGE
}

if [ "${1:-}" = "--help" ] || [ "${1:-}" = "-h" ]; then
  usage
  exit 0
fi

args=()
while [ "$#" -gt 0 ]; do
  case "$1" in
    --force) force=1 ;;
    --design-defaults) design_defaults=1 ;;
    --check-design-defaults) check_design_defaults=1 ;;
    --) shift; args+=("$@"); break ;;
    -*) echo "unknown option: $1" >&2; exit 2 ;;
    *) args+=("$1") ;;
  esac
  shift
done
if [ "${#args[@]}" -gt 0 ]; then
  set -- "${args[@]}"
else
  set --
fi

design_policy="$repo_root/templates/global-design-defaults.md"
design_agents_file="${CODEX_HOME:-$HOME/.codex}/AGENTS.md"
design_marker_start='<!-- agent-skills:global-design-defaults:start -->'
design_marker_end='<!-- agent-skills:global-design-defaults:end -->'

# Reject symlinked path components so mkdir, temp files, and policy writes cannot
# be redirected outside the explicitly configured home.
assert_no_symlink_components() {
  local path="$1" current="" part
  # macOS exposes these standard paths as aliases; normalize only those known
  # aliases, then inspect every lexical component without following links.
  case "$path" in
    /var/*) path="/private$path" ;;
    /tmp/*) path="/private$path" ;;
    /*) ;;
    *) path="$PWD/$path" ;;
  esac
  IFS='/' read -r -a parts <<< "$path"
  for part in "${parts[@]}"; do
    [ -z "$part" ] && continue
    current="$current/$part"
    if [ -L "$current" ]; then
      echo "refusing symlinked target path component: $current" >&2
      return 1
    fi
  done
}

check_design_policy_state() {
  local f="$design_agents_file" body expected actual
  body="$(cat "$design_policy")"
  assert_no_symlink_components "$f"
  if [ -L "$f" ]; then
    echo "refusing symlinked policy file: $f" >&2
    return 1
  fi
  if [ -e "$f" ]; then
    [ -f "$f" ] || { echo "policy target is not a regular file: $f" >&2; return 1; }
    if grep -Fq "$design_marker_start" "$f" || grep -Fq "$design_marker_end" "$f"; then
      expected="$( { printf '%s\n' "$design_marker_start"; cat "$design_policy"; printf '\n%s' "$design_marker_end"; } )"
      actual="$(awk -v start="$design_marker_start" -v end="$design_marker_end" \
        '$0==start {inside=1} inside {print} $0==end {exit}' "$f")"
      marker_count="$(awk -v start="$design_marker_start" -v end="$design_marker_end" \
        '$0==start {starts++} $0==end {ends++} END {print starts+0, ends+0}' "$f")"
      if [ "$actual" = "$expected" ] && [ "$marker_count" = "1 1" ] && \
        [ "$(grep -Ec '^# Design Defaults[[:space:]]*$' "$f")" = "1" ]; then
        return 0
      fi
      echo "conflicting or incomplete marked design defaults in $f; review manually" >&2
      return 1
    fi
    if grep -Eq '^# Design Defaults[[:space:]]*$' "$f"; then
      if [ "$check_design_defaults" -eq 1 ]; then
        legacy="$(awk '/^# Design Defaults[[:space:]]*$/ {inside=1} inside && /^# / && !/^# Design Defaults[[:space:]]*$/ {exit} inside {print}' "$f")"
        if [ "$legacy" = "$body" ]; then
          echo "design defaults exist as an unmarked legacy section in $f" >&2
          return 0
        fi
      fi
      echo "unmarked Design Defaults section already exists in $f; review manually" >&2
      return 1
    fi
  fi
}

if [ "$check_design_defaults" -eq 1 ]; then
  check_design_policy_state
  if [ ! -f "$design_agents_file" ] || { ! grep -Fq "$design_marker_start" "$design_agents_file" && ! grep -Eq '^# Design Defaults[[:space:]]*$' "$design_agents_file"; }; then
    echo "global design defaults are not installed in $design_agents_file" >&2
    exit 1
  fi
  if [ ! -L "$codex_skills_dir/shared" ] || [ "$(readlink "$codex_skills_dir/shared")" != "$repo_root/shared" ] || [ ! -f "$codex_skills_dir/shared/references/native-design-authoring.md" ]; then
    echo "shared design reference is not resolvable through $codex_skills_dir/shared" >&2
    exit 1
  fi
  echo "design defaults are linked and reference-resolvable; runtime loading is not verified by this filesystem check"
  exit 0
fi

if [ "$design_defaults" -eq 1 ]; then
  check_design_policy_state
fi

validate_skill() {
  local skill_dir="$1"
  local skill_name
  local skill_file="$skill_dir/SKILL.md"
  skill_name="$(basename "$skill_dir")"

  has_pattern() {
    local pattern="$1"
    local file="$2"
    if command -v rg >/dev/null 2>&1; then
      rg -n "$pattern" "$file" >/dev/null
    else
      grep -En "$pattern" "$file" >/dev/null
    fi
  }

  if [[ ! "$skill_name" =~ ^[a-z0-9-]+$ ]]; then
    echo "invalid skill directory name: $skill_name (allowed: lowercase letters, numbers, hyphens)" >&2
    return 1
  fi

  if [ ! -f "$skill_file" ]; then
    echo "missing SKILL.md: $skill_file" >&2
    return 1
  fi

  if ! awk 'BEGIN {ok=0} NR==1 && $0=="---" {in_frontmatter=1; next} in_frontmatter && $0=="---" {ok=1; exit} END {exit ok ? 0 : 1}' "$skill_file"; then
    echo "invalid frontmatter delimiters in: $skill_file" >&2
    return 1
  fi

  if ! has_pattern "^name:\\s*\"?${skill_name}\"?\\s*$" "$skill_file"; then
    echo "frontmatter name must match directory: $skill_file (expected name: ${skill_name})" >&2
    return 1
  fi

  if ! has_pattern "^description:\\s*.+" "$skill_file"; then
    echo "missing non-empty description in frontmatter: $skill_file" >&2
    return 1
  fi

  return 0
}

ensure_link() {
  local target_root="$1"
  local skill_dir="$2"
  local skill_name link_path
  skill_name="$(basename "$skill_dir")"
  link_path="$target_root/$skill_name"

  mkdir -p "$target_root"

  if [ -L "$link_path" ]; then
    local current
    current="$(readlink "$link_path")"
    if [ "$current" = "$skill_dir" ]; then
      echo "ok: $link_path -> $skill_dir"
      return 0
    fi
    if [ "$force" -ne 1 ]; then
      echo "incorrect symlink, skipped: $link_path -> $current (use --force to repoint)" >&2
      return 1
    fi
    unlink "$link_path"
    ln -s "$skill_dir" "$link_path"
    echo "updated: $link_path -> $skill_dir"
    return 0
  fi

  if [ -e "$link_path" ]; then
    echo "exists and is not a symlink, preserved: $link_path" >&2
    return 1
  fi

  ln -s "$skill_dir" "$link_path"
  echo "created: $link_path -> $skill_dir"
}

ensure_named_link() {
  local target_root="$1"
  local link_name="$2"
  local source_dir="$3"
  local link_path="$target_root/$link_name"

  mkdir -p "$target_root"

  if [ -L "$link_path" ]; then
    local current
    current="$(readlink "$link_path")"
    if [ "$current" = "$source_dir" ]; then
      echo "ok: $link_path -> $source_dir"
      return 0
    fi
    if [ "$force" -ne 1 ]; then
      echo "incorrect symlink, skipped: $link_path -> $current (use --force to repoint)" >&2
      return 1
    fi
    unlink "$link_path"
    ln -s "$source_dir" "$link_path"
    echo "updated: $link_path -> $source_dir"
    return 0
  fi

  if [ -e "$link_path" ]; then
    echo "exists and is not a symlink, preserved: $link_path" >&2
    return 1
  fi

  ln -s "$source_dir" "$link_path"
  echo "created: $link_path -> $source_dir"
}

skill_dirs=()

if [ "$#" -gt 0 ]; then
  for name in "$@"; do
    candidate="$repo_root/$name"
    if [ -d "$candidate" ] && [ -f "$candidate/SKILL.md" ]; then
      skill_dirs+=("$candidate")
    else
      echo "skill not found or missing SKILL.md: $name" >&2
      exit 1
    fi
  done
else
  while IFS= read -r dir; do
    skill_dirs+=("$dir")
  done < <(find "$repo_root" -mindepth 1 -maxdepth 1 -type d ! -name ".git" ! -name "shared" ! -name "scripts" -exec test -f "{}/SKILL.md" \; -print | sort)
fi

# Validate all target parents before the first mkdir/symlink operation.
assert_no_symlink_components "$codex_skills_dir"
assert_no_symlink_components "$claude_skills_dir"
for root in "$codex_skills_dir" "$claude_skills_dir"; do
  for name in "${skill_dirs[@]##*/}" shared templates; do
    target="$root/$name"
    if [ -L "$target" ] && [ "$force" -ne 1 ]; then
      current="$(readlink "$target")"
      expected="$repo_root/$name"
      if [ "$current" != "$expected" ]; then
        echo "incorrect symlink, skipped: $target -> $current (use --force to repoint)" >&2
        exit 1
      fi
    elif [ -e "$target" ] && [ ! -L "$target" ]; then
      echo "exists and is not a symlink, preserved: $target" >&2
      exit 1
    fi
  done
done

if [ "${#skill_dirs[@]}" -eq 0 ]; then
  echo "no skills found to link" >&2
  exit 1
fi

echo "repo root: $repo_root"
echo "codex skills: $codex_skills_dir"
echo "claude skills: $claude_skills_dir"

echo
echo "== Validation =="
for skill_dir in "${skill_dirs[@]}"; do
  validate_skill "$skill_dir"
  echo "valid: $(basename "$skill_dir")"
done

echo
echo "== Symlink Codex =="
for skill_dir in "${skill_dirs[@]}"; do
  ensure_link "$codex_skills_dir" "$skill_dir"
done

echo
echo "== Symlink Claude =="
for skill_dir in "${skill_dirs[@]}"; do
  ensure_link "$claude_skills_dir" "$skill_dir"
done

echo
echo "== Symlink Shared References =="
ensure_named_link "$codex_skills_dir" "shared" "$repo_root/shared"
ensure_named_link "$claude_skills_dir" "shared" "$repo_root/shared"

echo
echo "== Symlink Product Templates =="
ensure_named_link "$codex_skills_dir" "templates" "$repo_root/templates"
ensure_named_link "$claude_skills_dir" "templates" "$repo_root/templates"

if [ "$design_defaults" -eq 1 ]; then
  echo
  echo "== Activate Global Design Defaults =="
  if [ ! -e "$design_agents_file" ]; then
    mkdir -p "$(dirname "$design_agents_file")"
    : > "$design_agents_file"
  fi
  if ! grep -Fq "$design_marker_start" "$design_agents_file"; then
    original_file="$(mktemp "$(dirname "$design_agents_file")/.AGENTS.md.original.XXXXXX")"
    temp_file="$(mktemp "$(dirname "$design_agents_file")/.AGENTS.md.XXXXXX")"
    cp "$design_agents_file" "$original_file"
    cp -p "$design_agents_file" "$temp_file"
    if [ -s "$temp_file" ] && [ "$(tail -c 1 "$temp_file" | wc -l | tr -d ' ')" = "0" ]; then
      printf '\n' >> "$temp_file"
    fi
    printf '\n%s\n' "$design_marker_start" >> "$temp_file"
    cat "$design_policy" >> "$temp_file"
    printf '\n%s\n' "$design_marker_end" >> "$temp_file"
    if ! cmp -s "$design_agents_file" "$original_file"; then
      rm -f "$temp_file" "$original_file"
      echo "AGENTS.md changed during activation; refusing to overwrite concurrent edits" >&2
      exit 1
    fi
    mv "$temp_file" "$design_agents_file"
    rm -f "$original_file"
    echo "appended marked design defaults to $design_agents_file"
  else
    echo "design defaults already present in $design_agents_file"
  fi
fi

echo
echo "done"
