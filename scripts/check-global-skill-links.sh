#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
codex_skills_dir="${CODEX_HOME:-$HOME/.codex}/skills"
claude_skills_dir="${CLAUDE_HOME:-$HOME/.claude}/skills"
errors=0
health=0

if [ "$#" -eq 1 ] && [ "$1" = "--health" ]; then
  health=1
  shift
fi
inventory="$(bash "$repo_root/scripts/list-global-skills.sh")"
for name in "$@"; do
  case "$name" in
    -*|*[!a-z0-9-]*|'') echo "Usage: bash scripts/check-global-skill-links.sh [--health | skill-name ...]" >&2; exit 2 ;;
  esac
  if ! grep -Fxq -- "$name" <<< "$inventory"; then
    echo "Unknown skill: $name" >&2
    exit 2
  fi
done

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
        if [ "$name" != "shared" ] && [ "$name" != "templates" ] && ! grep -Fxq -- "$name" <<< "$inventory"; then
          echo "STALE: $link_path -> $target (retired pack link; review before removal)" >&2
          errors=$((errors + 1))
        fi
        ;;
    esac
  done
}

check_skill() {
  local skill_dir="$1" skill_name
  skill_name="$(basename "$skill_dir")"
  check_link "$codex_skills_dir" "$skill_name" "$skill_dir"
  check_link "$claude_skills_dir" "$skill_name" "$skill_dir"
}
if [ "$#" -gt 0 ]; then
  for name in "$@"; do check_skill "$repo_root/$name"; done
else
  while IFS= read -r name; do check_skill "$repo_root/$name"; done <<< "$inventory"
fi

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
  echo "checked skill links match this checkout; runtime loading is not verified"
else
  echo "installation health: configured filesystem state verified; runtime loading is not verified"
fi
