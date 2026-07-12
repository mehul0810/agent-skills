#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "$script_dir/.." && pwd)"

max_description_words="${SKILL_DESCRIPTION_MAX_WORDS:-45}"
max_body_words="${SKILL_BODY_MAX_WORDS:-1000}"
max_agent_prompt_words="${AGENT_PROMPT_MAX_WORDS:-45}"
max_reference_words="${REFERENCE_MAX_WORDS:-1500}"
warning_percent="${TOKEN_BUDGET_WARNING_PERCENT:-85}"
verbose=0
errors=0
warnings=0
ref_count=0
largest_ref_words=0
largest_ref_path=""
largest_ref_limit=0

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

estimate_tokens() {
  local chars
  chars="$(wc -m < "$1" | awk '{print $1}')"
  echo $(((chars + 3) / 4))
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
  elif [ $((actual * 100 / max)) -ge "$warning_percent" ]; then
    echo "WARNING: $label is $actual/$max words ($((actual * 100 / max))%); low headroom" >&2
    warnings=$((warnings + 1))
  elif [ "$verbose" -eq 1 ]; then
    echo "OK: $label is $actual/$max words"
  fi
}

skill_body_limit() {
  local skill_name="$1"
  case "$skill_name" in
    wp-portfolio-cto) echo "${WP_PORTFOLIO_CTO_BODY_MAX_WORDS:-850}" ;;
    wp-product-orchestrator) echo "${WP_PRODUCT_ORCHESTRATOR_BODY_MAX_WORDS:-850}" ;;
    wp-contributor) echo "${WP_CONTRIBUTOR_BODY_MAX_WORDS:-1300}" ;;
    wp-expert) echo "${WP_EXPERT_BODY_MAX_WORDS:-900}" ;;
    wp-plugin-expert|wp-theme-expert|wp-site-expert) echo "${WP_SPECIALIST_BODY_MAX_WORDS:-700}" ;;
    content-writer) echo "${CONTENT_WRITER_BODY_MAX_WORDS:-800}" ;;
    *) echo "$max_body_words" ;;
  esac
}

reference_limit() {
  local rel_path="$1"
  case "$rel_path" in
    wp-expert/references/custom-block-theme-from-design.md|\
    wp-expert/references/blocksy-theme.md|\
    wp-expert/references/ux-product-strategy-design-qa.md|\
    wp-expert/references/ollie-block-theme.md|\
    wp-expert/references/database-table-architecture-review.md|\
    wp-expert/references/delivery-excellence.md|\
    shared/references/cto-orchestration-operating-model.md)
      echo "${LARGE_REFERENCE_MAX_WORDS:-2200}"
      ;;
    *)
      echo "$max_reference_words"
      ;;
  esac
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
  estimated_tokens="$(estimate_tokens "$skill_file")"

  check_limit "$skill_name description" "$desc_words" "$max_description_words"
  body_limit="$(skill_body_limit "$skill_name")"

  check_limit "$skill_name SKILL body" "$skill_body_words" "$body_limit"
  check_limit "$skill_name agent default_prompt" "$prompt_words" "$max_agent_prompt_words"

  echo "$skill_name: description ${desc_words}/${max_description_words}, body ${skill_body_words}/${body_limit}, prompt ${prompt_words}/${max_agent_prompt_words} words, file estimate ~${estimated_tokens} tokens"
done < <(find_skill_dirs)

while IFS= read -r ref_file; do
  rel_path="${ref_file#$repo_root/}"
  words="$(count_words "$ref_file")"
  ref_count=$((ref_count + 1))

  if [ "$words" -gt "$largest_ref_words" ]; then
    largest_ref_words="$words"
    largest_ref_path="$rel_path"
    largest_ref_limit="$(reference_limit "$rel_path")"
  fi

  ref_limit="$(reference_limit "$rel_path")"
  check_limit "$rel_path reference" "$words" "$ref_limit"
done < <(find "$repo_root" -path '*/references/*.md' -type f | sort)

echo "References: checked $ref_count files; largest ${largest_ref_path:-none} ${largest_ref_words}/${largest_ref_limit:-$max_reference_words} words; warnings $warnings"

if [ "$errors" -gt 0 ]; then
  echo "Token budget audit failed with $errors issue(s)." >&2
  exit 1
fi

echo "Token budget audit passed."
