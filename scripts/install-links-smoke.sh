#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
tmp="$(mktemp -d)"
actual_tmp=""
trap 'rm -rf "$tmp"; [ -z "$actual_tmp" ] || rm -rf "$actual_tmp"' EXIT
tmp="$tmp/path with spaces"
mkdir -p "$tmp"

# Selected installs are checked without requiring every other skill or policy.
CODEX_HOME="$tmp/selected-codex" CLAUDE_HOME="$tmp/selected-claude" \
  bash "$repo_root/scripts/install-global-skill-links.sh" wp-expert >/dev/null
selected_check() {
  CODEX_HOME="$tmp/selected-codex" CLAUDE_HOME="$tmp/selected-claude" \
    bash "$repo_root/scripts/check-global-skill-links.sh" "$@"
}
selected_check wp-expert >/dev/null
if selected_check >/dev/null 2>&1; then
  echo "ERROR: a selective install satisfied full-pack verification" >&2; exit 1
fi
[ ! -e "$tmp/selected-codex/AGENTS.md" ] && [ ! -e "$tmp/selected-claude/AGENTS.md" ] || {
  echo "ERROR: selected install or check wrote policy" >&2; exit 1;
}
for invalid in ../wp-expert /tmp/wp-expert not-a-skill --unknown; do
  code=0; selected_check "$invalid" >/dev/null 2>&1 || code=$?
  [ "$code" -eq 2 ] || { echo "ERROR: expected usage failure for $invalid, got $code" >&2; exit 1; }
done
for extra in wp-expert --health; do
  code=0; selected_check --health "$extra" >/dev/null 2>&1 || code=$?
  [ "$code" -eq 2 ] || { echo "ERROR: expected usage failure for --health $extra, got $code" >&2; exit 1; }
done
for target in wp-expert shared templates; do
  link="$tmp/selected-codex/skills/$target"
  unlink "$link"
  if selected_check wp-expert >/dev/null 2>&1; then
    echo "ERROR: checker accepted missing $target" >&2; exit 1
  fi
  ln -s "$tmp/wrong-target" "$link"
  if selected_check wp-expert >/dev/null 2>&1; then
    echo "ERROR: checker accepted wrong $target" >&2; exit 1
  fi
  unlink "$link"
  ln -s "$repo_root/$target" "$link"
done
ln -s "$repo_root/retired-skill" "$tmp/selected-claude/skills/retired-skill"
if selected_check wp-expert >/dev/null 2>&1; then
  echo "ERROR: selective checker accepted stale pack link" >&2; exit 1
fi
unlink "$tmp/selected-claude/skills/retired-skill"
selected_check wp-expert >/dev/null

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
rm "$tmp/codex/skills/wp-expert"
if health_failure="$(CODEX_HOME="$tmp/codex" CLAUDE_HOME="$tmp/claude" \
  bash "$repo_root/scripts/check-global-skill-links.sh" --health 2>&1)"; then
  echo "ERROR: unified health accepted missing global policy" >&2; exit 1
fi
printf '%s\n' "$health_failure" | grep -Fq "MISSING: $tmp/codex/skills/wp-expert" || {
  echo "ERROR: unified health omitted simultaneous skill-link failure" >&2; exit 1;
}
printf '%s\n' "$health_failure" | grep -Fq 'global design defaults are not installed' || {
  echo "ERROR: unified health omitted missing policy failure" >&2; exit 1;
}
[ ! -e "$tmp/codex/AGENTS.md" ] && [ ! -e "$tmp/codex/skills/wp-expert" ] || {
  echo "ERROR: failed unified health check mutated installation state" >&2; exit 1;
}
CODEX_HOME="$tmp/codex" CLAUDE_HOME="$tmp/claude" \
  bash "$repo_root/scripts/install-global-skill-links.sh" >/dev/null

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
cp "$tmp/codex/AGENTS.md" "$tmp/health.expected"
health_output="$(CODEX_HOME="$tmp/codex" CLAUDE_HOME="$tmp/claude" \
  bash "$repo_root/scripts/check-global-skill-links.sh" --health)"
cmp -s "$tmp/health.expected" "$tmp/codex/AGENTS.md" || {
  echo "ERROR: unified health check modified global policy" >&2; exit 1;
}
printf '%s\n' "$health_output" | grep -Fq 'runtime loading is not verified' || {
  echo "ERROR: unified health did not distinguish configured state from runtime verification" >&2; exit 1;
}

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

# Exercise lexical /tmp traversal directly on both Linux and macOS, where /tmp
# may be a real directory or the exact /private/tmp alias.
actual_tmp="$(mktemp -d /tmp/agent-skills-path-check.XXXXXX)"
mkdir -p "$actual_tmp/outside"
printf 'external sentinel\n' > "$actual_tmp/outside/AGENTS.md"
ln -s "$actual_tmp/outside" "$actual_tmp/link"
if CODEX_HOME="$actual_tmp/link/home" CLAUDE_HOME="$actual_tmp/claude" \
  bash "$repo_root/scripts/install-global-skill-links.sh" --design-defaults wp-expert >/dev/null 2>&1; then
  echo "ERROR: activation accepted a symlink beneath the standard /tmp path" >&2; exit 1
fi
[ "$(cat "$actual_tmp/outside/AGENTS.md")" = "external sentinel" ] || {
  echo "ERROR: standard /tmp symlink path was modified" >&2; exit 1;
}

while IFS= read -r skill_dir; do
  skill="$(basename "$skill_dir")"
  for root in "$tmp/codex/skills" "$tmp/claude/skills"; do
    link="$root/$skill"
    [ -L "$link" ] || { echo "ERROR: missing symlink $link" >&2; exit 1; }
    [ "$(readlink "$link")" = "$skill_dir" ] || { echo "ERROR: wrong target $link" >&2; exit 1; }
    [ -f "$link/SKILL.md" ] || { echo "ERROR: unreadable skill $link" >&2; exit 1; }
  done
done < <(find "$repo_root" -mindepth 1 -maxdepth 1 -type d -exec test -f "{}/SKILL.md" \; -print | sort)

# A link that resolves is not proof that Node ran its CLI instead of just importing it.
printf '{}\n' > "$tmp/incomplete-report.json"
for root in "$tmp/codex/skills" "$tmp/claude/skills"; do
  quality="$root/wp-quality-reviewer/scripts/validate-review-report.mjs"
  fidelity="$root/product-video-producer/scripts/check-shot-fidelity.mjs"
  motion="$root/product-video-producer/scripts/render-motion-starter.mjs"
  for cli in "$quality" "$fidelity"; do
    if node "$cli" "$tmp/incomplete-report.json" >"$tmp/cli-error" 2>&1; then
      echo "ERROR: linked CLI silently accepted an incomplete document: $cli" >&2; exit 1
    fi
    [ -s "$tmp/cli-error" ] || { echo "ERROR: linked CLI gave no diagnostic: $cli" >&2; exit 1; }
  done
  node "$quality" --self-test | grep -F 'quality review validator self-test passed' >/dev/null
  node "$fidelity" --self-test | grep -F 'self-test passed' >/dev/null
  node "$motion" --help | grep -F 'Usage: node' >/dev/null
  imported="$(SKILL_TEST_ROOT="$root" node --input-type=module -e '
    import { pathToFileURL } from "node:url";
    for (const file of ["wp-quality-reviewer/scripts/validate-review-report.mjs",
      "product-video-producer/scripts/check-shot-fidelity.mjs", "product-video-producer/scripts/render-motion-starter.mjs"])
      await import(pathToFileURL(process.env.SKILL_TEST_ROOT + "/" + file));
  ')"
  [ -z "$imported" ] || { echo "ERROR: importing a linked CLI ran it" >&2; exit 1; }
done

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
