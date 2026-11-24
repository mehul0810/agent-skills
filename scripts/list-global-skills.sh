#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
# The committed tree, not the parent workspace or a local draft, defines a
# checkout's public skills. Git does not recurse into submodules or symlinks.
if [ -e "$root/.git" ]; then
  top="$(git -C "$root" rev-parse --show-toplevel)"
  [ "$(cd "$top" && pwd -P)" = "$root" ] || { echo "not the checkout root: $root" >&2; exit 1; }
  names="$(git -C "$root" ls-tree -r --full-tree HEAD |
    LC_ALL=C sed -nE 's/^100(644|755) blob [[:xdigit:]]+[[:space:]]([a-z0-9][a-z0-9-]*)\/SKILL\.md$/\2/p')"
else
  # Keep Codex and Claude installs from a reviewed ZIP working without Git.
  names="$(for dir in "$root"/*; do
    if [ -d "$dir" ] && [ ! -L "$dir" ] && [ -f "$dir/SKILL.md" ]; then
      basename "$dir"
    fi
  done)"
fi
[ -n "$names" ] || { echo "no public skills in $root" >&2; exit 1; }
while IFS= read -r name; do
  if [[ ! "$name" =~ ^[a-z0-9][a-z0-9-]*$ ]] || [ -L "$root/$name" ] ||
     [ -L "$root/$name/SKILL.md" ] || [ ! -f "$root/$name/SKILL.md" ]; then
    echo "missing or unsafe skill source: $root/$name/SKILL.md" >&2; exit 1
  fi
  printf '%s\n' "$name"
done <<< "$names"
