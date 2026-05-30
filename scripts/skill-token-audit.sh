#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "$script_dir/.." && pwd)"

max_description_words="${SKILL_DESCRIPTION_MAX_WORDS:-45}"
max_body_words="${SKILL_BODY_MAX_WORDS:-1500}"
max_agent_prompt_words="${AGENT_PROMPT_MAX_WORDS:-45}"
max_reference_words="${REFERENCE_MAX_WORDS:-2200}"
verbose=0
errors=0
ref_count=0
largest_ref_words=0
largest_ref_path=""

if [ "${1:-}" = "--verbose" ]; then
  verbose=1
fi

find_skill_dirs() {
  find "$repo_root" -mindepth 1 -maxdepth 1 -type d \
    ! -name ".git" \
    ! -name ".claude" \
    ! -name "shared" \
    ! -name "scripts" \
    -exec test -f "{}/SKILL.md" \; \
    -print | sort
}

count_words() {
  awk '{ words += NF } END { print words + 0 }' "$1"
}

description_words() {
  awk '
    BEGIN { in_frontmatter = 0; found = 0 }
    /^---$/ { in_frontmatter++; next }
    in_frontmatter == 1 && /^description:/ {
      sub(/^description:[ ]*/, "")
      print split($0, parts, /[[:space:]]+/)
      found = 1
      exit
    }
    END { if (!found) print 0 }
  ' "$1"
}

body_words() {
  awk '
    /^---$/ { sep++; if (sep == 2) { body = 1; next } }
    body { words += NF }
    END { print words + 0 }
  ' "$1"
}

agent_prompt_words() {
  local file="$1"
  if [ ! -f "$file" ]; then
    echo 0
    return
  fi

  awk '
    BEGIN { found = 0 }
    /^[[:space:]]*default_prompt:/ {
      sub(/^[[:space:]]*default_prompt:[[:space:]]*/, "")
      gsub(/^"|"$/, "")
      print split($0, parts, /[[:space:]]+/)
      found = 1
      exit
    }
    END { if (!found) print 0 }
  ' "$file"
}

check_limit() {
  local label="$1"
  local actual="$2"
  local max="$3"
  if [ "$actual" -gt "$max" ]; then
    echo "ERROR: $label is $actual words; max is $max" >&2
    errors=$((errors + 1))
  elif [ "$verbose" -eq 1 ]; then
    echo "OK: $label is $actual/$max words"
  fi
}

echo "Skill token budget audit"
echo "========================"

while IFS= read -r skill_dir; do
  skill_name="$(basename "$skill_dir")"
  skill_file="$skill_dir/SKILL.md"
  agent_file="$skill_dir/agents/openai.yaml"
  desc_words="$(description_words "$skill_file")"
  skill_body_words="$(body_words "$skill_file")"
  prompt_words="$(agent_prompt_words "$agent_file")"

  check_limit "$skill_name description" "$desc_words" "$max_description_words"
  check_limit "$skill_name SKILL body" "$skill_body_words" "$max_body_words"
  check_limit "$skill_name agent default_prompt" "$prompt_words" "$max_agent_prompt_words"

  echo "$skill_name: description ${desc_words}/${max_description_words}, body ${skill_body_words}/${max_body_words}, prompt ${prompt_words}/${max_agent_prompt_words} words"
done < <(find_skill_dirs)

while IFS= read -r ref_file; do
  rel_path="${ref_file#$repo_root/}"
  words="$(count_words "$ref_file")"
  ref_count=$((ref_count + 1))

  if [ "$words" -gt "$largest_ref_words" ]; then
    largest_ref_words="$words"
    largest_ref_path="$rel_path"
  fi

  check_limit "$rel_path reference" "$words" "$max_reference_words"
done < <(find "$repo_root" -path '*/references/*.md' -type f | sort)

echo "References: checked $ref_count files; largest ${largest_ref_path:-none} ${largest_ref_words}/${max_reference_words} words"

if [ "$errors" -gt 0 ]; then
  echo "Token budget audit failed with $errors issue(s)." >&2
  exit 1
fi

echo "Token budget audit passed."
