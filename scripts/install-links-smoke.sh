#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT
tmp="$tmp/path with spaces"
mkdir -p "$tmp"

CODEX_HOME="$tmp/codex" CLAUDE_HOME="$tmp/claude" \
  bash "$repo_root/scripts/install-global-skill-links.sh" >/dev/null

CODEX_HOME="$tmp/codex" CLAUDE_HOME="$tmp/claude" \
  bash "$repo_root/scripts/check-global-skill-links.sh" >/dev/null

# Ordinary installation links policy inputs but must not edit global policy.
[ ! -e "$tmp/codex/AGENTS.md" ] || { echo "ERROR: ordinary install edited AGENTS.md" >&2; exit 1; }
if CODEX_HOME="$tmp/codex" CLAUDE_HOME="$tmp/claude" \
  bash "$repo_root/scripts/install-global-skill-links.sh" --check-design-defaults >/dev/null 2>&1; then
  echo "ERROR: design checker accepted missing global policy" >&2; exit 1
fi

printf 'Owner instructions stay byte-for-byte.\nsecond line' > "$tmp/codex/AGENTS.md"
cp "$tmp/codex/AGENTS.md" "$tmp/prefix.expected"
CODEX_HOME="$tmp/codex" CLAUDE_HOME="$tmp/claude" \
  bash "$repo_root/scripts/install-global-skill-links.sh" --design-defaults wp-expert >/dev/null
head -c "$(wc -c < "$tmp/prefix.expected" | tr -d ' ')" "$tmp/codex/AGENTS.md" > "$tmp/prefix.actual"
cmp -s "$tmp/prefix.expected" "$tmp/prefix.actual" || {
  echo "ERROR: activation changed existing AGENTS.md prefix" >&2; exit 1;
}
cp "$tmp/codex/AGENTS.md" "$tmp/activated.expected"
CODEX_HOME="$tmp/codex" CLAUDE_HOME="$tmp/claude" \
  bash "$repo_root/scripts/install-global-skill-links.sh" --design-defaults wp-expert >/dev/null
cmp -s "$tmp/activated.expected" "$tmp/codex/AGENTS.md" || {
  echo "ERROR: repeated activation changed policy" >&2; exit 1;
}
CODEX_HOME="$tmp/codex" CLAUDE_HOME="$tmp/claude" \
  bash "$repo_root/scripts/install-global-skill-links.sh" --check-design-defaults >/dev/null

printf '\n# Design Defaults\nConflicting owner rule.\n' >> "$tmp/codex/AGENTS.md"
for mode in --check-design-defaults --design-defaults; do
  if CODEX_HOME="$tmp/codex" CLAUDE_HOME="$tmp/claude" \
    bash "$repo_root/scripts/install-global-skill-links.sh" "$mode" wp-expert >/dev/null 2>&1; then
    echo "ERROR: valid marked policy concealed a conflicting design section" >&2; exit 1
  fi
done
cp "$tmp/activated.expected" "$tmp/codex/AGENTS.md"

mkdir -p "$tmp/conflicting"
printf '# Design Defaults\n\nowner-authored conflicting rule\n' > "$tmp/conflicting/AGENTS.md"
if CODEX_HOME="$tmp/conflicting" CLAUDE_HOME="$tmp/conflicting-claude" \
  bash "$repo_root/scripts/install-global-skill-links.sh" --design-defaults wp-expert >/dev/null 2>&1; then
  echo "ERROR: conflicting Design Defaults were appended" >&2; exit 1
fi
[ ! -e "$tmp/conflicting/skills/wp-expert" ] || {
  echo "ERROR: conflict was discovered after installer mutation" >&2; exit 1;
}

mkdir -p "$tmp/marked-conflict/skills"
printf '%s\n# Design Defaults\n\nchanged design rule\n' \
  '<!-- agent-skills:global-design-defaults:start -->' \
  > "$tmp/marked-conflict/AGENTS.md"
printf '%s\n' '<!-- agent-skills:global-design-defaults:end -->' >> "$tmp/marked-conflict/AGENTS.md"
if CODEX_HOME="$tmp/marked-conflict" CLAUDE_HOME="$tmp/marked-conflict-claude" \
  bash "$repo_root/scripts/install-global-skill-links.sh" --design-defaults wp-expert >/dev/null 2>&1; then
  echo "ERROR: mismatched marked policy was accepted" >&2; exit 1
fi
[ ! -e "$tmp/marked-conflict/skills/wp-expert" ] || {
  echo "ERROR: marked conflict was discovered after installer mutation" >&2; exit 1;
}

mkdir -p "$tmp/outside"
printf 'external sentinel\n' > "$tmp/outside/AGENTS.md"
mkdir -p "$tmp/symlink-home"
ln -s "$tmp/outside" "$tmp/symlink-home/.codex"
if CODEX_HOME="$tmp/symlink-home/.codex" CLAUDE_HOME="$tmp/symlink-claude" \
  bash "$repo_root/scripts/install-global-skill-links.sh" --design-defaults wp-expert >/dev/null 2>&1; then
  echo "ERROR: activation accepted symlinked home" >&2; exit 1
fi
[ "$(cat "$tmp/outside/AGENTS.md")" = "external sentinel" ] || {
  echo "ERROR: symlinked target was modified" >&2; exit 1;
}
mkdir -p "$tmp/outside/home"
ln -s "$tmp/outside" "$tmp/ancestor-link"
if CODEX_HOME="$tmp/ancestor-link/home" CLAUDE_HOME="$tmp/ancestor-claude" \
  bash "$repo_root/scripts/install-global-skill-links.sh" --design-defaults wp-expert >/dev/null 2>&1; then
  echo "ERROR: activation accepted a symlinked ancestor above a real home directory" >&2; exit 1
fi

while IFS= read -r skill_dir; do
  skill="$(basename "$skill_dir")"
  for root in "$tmp/codex/skills" "$tmp/claude/skills"; do
    link="$root/$skill"
    [ -L "$link" ] || { echo "ERROR: missing symlink $link" >&2; exit 1; }
    [ "$(readlink "$link")" = "$skill_dir" ] || { echo "ERROR: wrong target $link" >&2; exit 1; }
    [ -f "$link/SKILL.md" ] || { echo "ERROR: unreadable skill $link" >&2; exit 1; }
  done
done < <(find "$repo_root" -mindepth 1 -maxdepth 1 -type d -exec test -f "{}/SKILL.md" \; -print | sort)

for required in product-video-producer wp-product-docs-writer loop-steward; do
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
