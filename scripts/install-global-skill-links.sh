#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
codex_skills_dir="${CODEX_HOME:-$HOME/.codex}/skills"
claude_skills_dir="${CLAUDE_HOME:-$HOME/.claude}/skills"
force=0

usage() {
  cat <<'USAGE'
Usage:
  bash scripts/install-global-skill-links.sh [--force] [skill-name ...]

Options:
  --force    Replace existing non-symlink paths in target directories.

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

if [ "${1:-}" = "--force" ]; then
  force=1
  shift
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
    rm -f "$link_path"
    ln -s "$skill_dir" "$link_path"
    echo "updated: $link_path -> $skill_dir"
    return 0
  fi

  if [ -e "$link_path" ]; then
    if [ "$force" -eq 1 ]; then
      rm -rf "$link_path"
      ln -s "$skill_dir" "$link_path"
      echo "replaced: $link_path -> $skill_dir"
      return 0
    fi
    echo "exists and not symlink, skipped: $link_path (use --force to replace)" >&2
    return 1
  fi

  ln -s "$skill_dir" "$link_path"
  echo "created: $link_path -> $skill_dir"
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
echo "done"
