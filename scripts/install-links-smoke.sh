#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

CODEX_HOME="$tmp/codex" CLAUDE_HOME="$tmp/claude" \
  bash "$repo_root/scripts/install-global-skill-links.sh" >/dev/null

CODEX_HOME="$tmp/codex" CLAUDE_HOME="$tmp/claude" \
  bash "$repo_root/scripts/check-global-skill-links.sh" >/dev/null

while IFS= read -r skill_dir; do
  skill="$(basename "$skill_dir")"
  for root in "$tmp/codex/skills" "$tmp/claude/skills"; do
    link="$root/$skill"
    [ -L "$link" ] || { echo "ERROR: missing symlink $link" >&2; exit 1; }
    [ "$(readlink "$link")" = "$skill_dir" ] || { echo "ERROR: wrong target $link" >&2; exit 1; }
    [ -f "$link/SKILL.md" ] || { echo "ERROR: unreadable skill $link" >&2; exit 1; }
  done
done < <(find "$repo_root" -mindepth 1 -maxdepth 1 -type d -exec test -f "{}/SKILL.md" \; -print | sort)

for required in product-video-producer loop-steward; do
  [ -L "$tmp/codex/skills/$required" ] || { echo "ERROR: required Codex skill missing: $required" >&2; exit 1; }
  [ -L "$tmp/claude/skills/$required" ] || { echo "ERROR: required Claude skill missing: $required" >&2; exit 1; }
done

mkdir -p "$tmp/protected-codex/skills/product-video-producer"
printf 'keep\n' > "$tmp/protected-codex/skills/product-video-producer/owner-file"
if CODEX_HOME="$tmp/protected-codex" CLAUDE_HOME="$tmp/protected-claude" \
  bash "$repo_root/scripts/install-global-skill-links.sh" --force product-video-producer >/dev/null 2>&1; then
  echo "ERROR: installer replaced a non-symlink skill directory" >&2
  exit 1
fi
[ -f "$tmp/protected-codex/skills/product-video-producer/owner-file" ] || {
  echo "ERROR: installer removed a user-owned file" >&2
  exit 1
}

ln -s "$repo_root/retired-skill" "$tmp/codex/skills/retired-skill"
if CODEX_HOME="$tmp/codex" CLAUDE_HOME="$tmp/claude" \
  bash "$repo_root/scripts/check-global-skill-links.sh" >/dev/null 2>&1; then
  echo "ERROR: live checker accepted a stale pack symlink" >&2
  exit 1
fi
unlink "$tmp/codex/skills/retired-skill"

echo "global skill link smoke test passed"
