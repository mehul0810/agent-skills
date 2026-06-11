#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
template_dir="$repo_root/templates/product-repo"
force=0

target="${PWD}"

usage() {
  cat <<'USAGE'
Usage: bash scripts/install-product-agent-kit.sh [--force] [target-repo]

Copies the WordPress product autonomy kit into a plugin/theme repository:
  AGENTS.md
  PRODUCT.md
  .codex/config.toml
  .codex/agents/*.toml
  .codex/prompts/*.md

Existing files are not overwritten unless --force is passed.
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

if [ "$#" -gt 1 ]; then
  usage >&2
  exit 2
fi

if [ "$#" -eq 1 ]; then
  target="$1"
fi

if [ ! -d "$target" ]; then
  echo "target directory does not exist: $target" >&2
  exit 1
fi

if [ ! -d "$template_dir" ]; then
  echo "template directory missing: $template_dir" >&2
  exit 1
fi

cd "$template_dir"

copied=0
skipped=0

while IFS= read -r rel_path; do
  src="$template_dir/$rel_path"
  dest="$target/$rel_path"
  mkdir -p "$(dirname "$dest")"

  if [ -e "$dest" ] && [ "$force" -ne 1 ]; then
    echo "skip existing: $rel_path"
    skipped=$((skipped + 1))
    continue
  fi

  cp "$src" "$dest"
  echo "copied: $rel_path"
  copied=$((copied + 1))
done < <(find . -type f | sed 's#^./##' | sort)

echo "done: copied $copied, skipped $skipped"
