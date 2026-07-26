#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
template="$repo_root/templates/product-repo"
installer="$repo_root/scripts/install-product-agent-kit.sh"
failures=0

require_text() {
  local file="$1"
  local text="$2"
  local label="$3"
  if grep -Fq -- "$text" "$repo_root/$file"; then
    echo "PASS: $label"
  else
    echo "FAIL: $label" >&2
    failures=$((failures + 1))
  fi
}

require_text "templates/product-repo/AGENTS.md" 'Use `$wp-expert` only when' "umbrella router reserved for ambiguity"
require_text "templates/product-repo/AGENTS.md" 'Each worker owns one issue, branch, worktree, and PR.' "worker scope boundary"
require_text "templates/product-repo/AGENTS.md" 'The PO may coordinate parallel workers only when their scopes do not overlap.' "PO parallel coordination"
require_text "templates/product-repo/AGENTS.md" 'The PO may merge a reviewed, green, non-draft PR into a verified non-production branch' "safe non-production merge authority"
require_text "templates/product-repo/AGENTS.md" 'Never merge to `main`/production' "production hard gate"
require_text "templates/product-repo/.codex/prompts/fixissue.md" '$wp-quality-reviewer' "focused quality routing"
require_text "templates/product-repo/.codex/prompts/fixissue.md" '$behavior-validator' "independent behavior routing"
require_text "scripts/install-product-agent-kit.sh" 'Existing files are never overwritten.' "non-destructive installer contract"
require_text "scripts/install-product-agent-kit.sh" '--stage-update' "versioned update staging"
require_text "scripts/install-product-agent-kit.sh" 'unsafe symlink in managed path' "symlink escape rejection"
require_text "scripts/install-product-agent-kit.sh" 'retired managed path (preserved)' "retired managed path reporting"

tmp="$(mktemp -d "${TMPDIR:-/tmp}/product-agent-kit.XXXXXX")"
trap 'rm -rf "$tmp"' EXIT

bash "$installer" "$tmp" >/dev/null
if bash "$installer" --check "$tmp" >/dev/null; then
  echo "PASS: fresh install matches current kit version"
else
  echo "FAIL: fresh install reports drift" >&2
  failures=$((failures + 1))
fi

printf '\nowner rule\n' >> "$tmp/AGENTS.md"

if bash "$installer" --check "$tmp" >"$tmp/check.log" 2>&1; then
  echo "FAIL: drift check should fail on a changed active file" >&2
  failures=$((failures + 1))
elif grep -Fq "changed: AGENTS.md" "$tmp/check.log"; then
  echo "PASS: drift check identifies changed active file"
else
  echo "FAIL: drift check did not identify AGENTS.md" >&2
  failures=$((failures + 1))
fi

bash "$installer" --stage-update "$tmp" >/dev/null
version="$(tr -d '[:space:]' < "$template/.codex/product-agent-kit.version")"
candidate="$tmp/.codex/product-agent-kit-updates/v$version/AGENTS.md"

if grep -Fq "owner rule" "$tmp/AGENTS.md" && cmp -s "$candidate" "$template/AGENTS.md"; then
  echo "PASS: staged update preserves active file and supplies versioned candidate"
else
  echo "FAIL: staged update overwrote active file or missed candidate" >&2
  failures=$((failures + 1))
fi

mkdir -p "$tmp/dangling-target" "$tmp/dangling-outside"
ln -s "$tmp/dangling-outside/escaped.md" "$tmp/dangling-target/AGENTS.md"
if bash "$installer" "$tmp/dangling-target" >"$tmp/dangling.log" 2>&1; then
  echo "FAIL: installer accepted a dangling destination symlink" >&2
  failures=$((failures + 1))
elif grep -Fq "unsafe symlink in managed path" "$tmp/dangling.log" &&
  [ ! -e "$tmp/dangling-outside/escaped.md" ]; then
  echo "PASS: dangling destination symlink rejected without outside write"
else
  echo "FAIL: dangling symlink rejection lacked containment proof" >&2
  failures=$((failures + 1))
fi

mkdir -p "$tmp/parent-target" "$tmp/parent-outside"
ln -s "$tmp/parent-outside" "$tmp/parent-target/.codex"
if bash "$installer" "$tmp/parent-target" >"$tmp/parent.log" 2>&1; then
  echo "FAIL: installer accepted a symlinked .codex parent" >&2
  failures=$((failures + 1))
elif grep -Fq "unsafe symlink in managed path" "$tmp/parent.log" &&
  [ -z "$(find "$tmp/parent-outside" -mindepth 1 -print -quit)" ]; then
  echo "PASS: symlinked .codex parent rejected without outside write"
else
  echo "FAIL: symlinked parent rejection lacked containment proof" >&2
  failures=$((failures + 1))
fi

mkdir -p "$tmp/stage-target" "$tmp/stage-outside"
bash "$installer" "$tmp/stage-target" >/dev/null
printf '\nowner stage rule\n' >> "$tmp/stage-target/AGENTS.md"
ln -s "$tmp/stage-outside" "$tmp/stage-target/.codex/product-agent-kit-updates"
if bash "$installer" --stage-update "$tmp/stage-target" >"$tmp/stage-symlink.log" 2>&1; then
  echo "FAIL: stage update accepted a symlinked stage root" >&2
  failures=$((failures + 1))
elif grep -Fq "unsafe symlink in managed path" "$tmp/stage-symlink.log" &&
  [ -z "$(find "$tmp/stage-outside" -mindepth 1 -print -quit)" ]; then
  echo "PASS: symlinked stage root rejected without outside write"
else
  echo "FAIL: stage-root rejection lacked containment proof" >&2
  failures=$((failures + 1))
fi

mkdir -p "$tmp/retired-target"
bash "$installer" "$tmp/retired-target" >/dev/null
printf '%s\n' "LEGACY.md" >> "$tmp/retired-target/.codex/product-agent-kit.files"
printf '%s\n' "preserve me" > "$tmp/retired-target/LEGACY.md"
if bash "$installer" --check "$tmp/retired-target" >"$tmp/retired.log" 2>&1; then
  echo "FAIL: check accepted a present retired managed path" >&2
  failures=$((failures + 1))
elif grep -Fq "retired managed path (preserved): LEGACY.md" "$tmp/retired.log" &&
  grep -Fq "preserve me" "$tmp/retired-target/LEGACY.md"; then
  echo "PASS: retired managed path reported and preserved"
else
  echo "FAIL: retired managed path was not reported non-destructively" >&2
  failures=$((failures + 1))
fi

if [ "$failures" -ne 0 ]; then
  echo "product agent kit audit failed: $failures issue(s)" >&2
  exit 1
fi

echo "product agent kit audit passed"
