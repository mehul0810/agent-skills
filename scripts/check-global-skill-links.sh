#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
codex_skills_dir="${CODEX_HOME:-$HOME/.codex}/skills"
claude_skills_dir="${CLAUDE_HOME:-$HOME/.claude}/skills"
errors=0
health=0

if [ "$#" -gt 0 ]; then
  [ "$#" -eq 1 ] && [ "$1" = "--health" ] || {
    echo "Usage: bash scripts/check-global-skill-links.sh [--health]" >&2
    exit 2
  }
  health=1
fi

check_link() {
  local root="$1"
  local name="$2"
  local expected="$3"
  local link_path="$root/$name"

  if [ ! -L "$link_path" ]; then
    if [ -e "$link_path" ]; then
      echo "CONFLICT: $link_path is a real file or directory; preserved" >&2
    else
      echo "MISSING: $link_path" >&2
    fi
    errors=$((errors + 1))
    return
  fi

  local actual
  actual="$(readlink "$link_path")"
  if [ "$actual" != "$expected" ]; then
    echo "WRONG: $link_path -> $actual (expected $expected)" >&2
    errors=$((errors + 1))
    return
  fi

  if [ ! -e "$link_path" ]; then
    echo "BROKEN: $link_path -> $actual" >&2
    errors=$((errors + 1))
    return
  fi

  echo "OK: $link_path -> $actual"
}

check_stale_pack_links() {
  local root="$1"
  local link_path name target

  [ -d "$root" ] || return
  for link_path in "$root"/*; do
    [ -L "$link_path" ] || continue
    name="$(basename "$link_path")"
    target="$(readlink "$link_path")"
    case "$target" in
      "$repo_root"/*)
        if [ "$name" != "shared" ] && [ "$name" != "templates" ] && [ ! -f "$repo_root/$name/SKILL.md" ]; then
          echo "STALE: $link_path -> $target (retired pack link; review before removal)" >&2
          errors=$((errors + 1))
        fi
        ;;
    esac
  done
}

while IFS= read -r skill_dir; do
  skill_name="$(basename "$skill_dir")"
  check_link "$codex_skills_dir" "$skill_name" "$skill_dir"
  check_link "$claude_skills_dir" "$skill_name" "$skill_dir"
done < <(
  find "$repo_root" -mindepth 1 -maxdepth 1 -type d \
    ! -name ".git" \
    ! -name "shared" \
    ! -name "scripts" \
    -exec test -f "{}/SKILL.md" \; \
    -print | sort
)

check_link "$codex_skills_dir" "shared" "$repo_root/shared"
check_link "$claude_skills_dir" "shared" "$repo_root/shared"
check_link "$codex_skills_dir" "templates" "$repo_root/templates"
check_link "$claude_skills_dir" "templates" "$repo_root/templates"
check_stale_pack_links "$codex_skills_dir"
check_stale_pack_links "$claude_skills_dir"

health_errors=0

if [ "$health" -eq 1 ]; then
  if ! bash "$repo_root/scripts/install-global-skill-links.sh" --check-design-defaults; then
    health_errors=$((health_errors + 1))
  fi
fi

if [ "$errors" -gt 0 ]; then
  echo "global skill link check failed: $errors problem(s)" >&2
fi
if [ "$health_errors" -gt 0 ]; then
  echo "global installation health check failed: $health_errors problem(s)" >&2
fi
if [ "$errors" -gt 0 ] || [ "$health_errors" -gt 0 ]; then
  exit 1
fi

if [ "$health" -eq 0 ]; then
  echo "global skill links match this checkout"
else
  echo "installation health: configured filesystem state verified; runtime loading is not verified"
fi
