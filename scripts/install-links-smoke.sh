#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

CODEX_HOME="$tmp/codex" CLAUDE_HOME="$tmp/claude" \
  bash "$repo_root/scripts/install-global-skill-links.sh" >/dev/null

while IFS= read -r skill_dir; do
  skill="$(basename "$skill_dir")"
  for root in "$tmp/codex/skills" "$tmp/claude/skills"; do
    link="$root/$skill"
    [ -L "$link" ] || { echo "ERROR: missing symlink $link" >&2; exit 1; }
    [ "$(readlink "$link")" = "$skill_dir" ] || { echo "ERROR: wrong target $link" >&2; exit 1; }
    [ -f "$link/SKILL.md" ] || { echo "ERROR: unreadable skill $link" >&2; exit 1; }
  done
done < <(find "$repo_root" -mindepth 1 -maxdepth 1 -type d -exec test -f "{}/SKILL.md" \; -print | sort)

echo "global skill link smoke test passed"
