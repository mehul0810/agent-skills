#!/usr/bin/env bash
set -euo pipefail

target="${1:-$PWD}"
cd "$target"
max_files="${WP_EXPERT_MAX_FILES:-1000}"

echo "== Validation Target =="
pwd

php_files=()
while IFS= read -r -d '' file; do
  php_files+=("$file")
done < <(find . -type f -name '*.php' \
  -not -path '*/vendor/*' \
  -not -path '*/node_modules/*' \
  -not -path '*/.git/*' \
  -not -path '*/build/*' \
  -not -path '*/dist/*' \
  -print0 2>/dev/null)

echo
echo "== PHP Syntax =="
if command -v php >/dev/null 2>&1; then
  if [ "${#php_files[@]}" -gt "$max_files" ] && [ "${WP_EXPERT_VALIDATE_ALL:-0}" != "1" ]; then
    echo "skipped: ${#php_files[@]} PHP files exceeds WP_EXPERT_MAX_FILES=$max_files"
    echo "set WP_EXPERT_VALIDATE_ALL=1 to lint all files"
  elif [ "${#php_files[@]}" -eq 0 ]; then
    echo "no PHP files found"
  else
    for file in "${php_files[@]}"; do
      php -l "$file" >/dev/null
    done
    echo "passed: ${#php_files[@]} PHP files"
  fi
else
  echo "skipped: php not found"
fi

js_files=()
while IFS= read -r -d '' file; do
  js_files+=("$file")
done < <(find . -type f -name '*.js' \
  -not -name '*.min.js' \
  -not -path '*/vendor/*' \
  -not -path '*/node_modules/*' \
  -not -path '*/.git/*' \
  -not -path '*/build/*' \
  -not -path '*/dist/*' \
  -print0 2>/dev/null)

echo
echo "== Plain JS Syntax =="
if command -v node >/dev/null 2>&1; then
  if [ "${#js_files[@]}" -gt "$max_files" ] && [ "${WP_EXPERT_VALIDATE_ALL:-0}" != "1" ]; then
    echo "skipped: ${#js_files[@]} JS files exceeds WP_EXPERT_MAX_FILES=$max_files"
  elif [ "${#js_files[@]}" -eq 0 ]; then
    echo "no JS files found"
  else
    failures=0
    for file in "${js_files[@]}"; do
      if ! node --check "$file" >/dev/null 2>&1; then
        echo "failed: $file"
        failures=$((failures + 1))
      fi
    done
    if [ "$failures" -gt 0 ]; then
      echo "failed: $failures JS files did not parse with node --check"
      echo "note: JSX/TypeScript or browser-only syntax may require project build/lint instead"
      exit 1
    fi
    echo "passed: ${#js_files[@]} JS files"
  fi
else
  echo "skipped: node not found"
fi

echo
echo "== Project Scripts =="
if [ -f composer.json ]; then
  echo "composer.json present"
  if command -v composer >/dev/null 2>&1; then
    composer validate --no-check-publish
  else
    echo "composer not found"
  fi
fi

if [ -f package.json ]; then
  echo "package.json present"
  if command -v npm >/dev/null 2>&1; then
    npm run 2>/dev/null | sed -n '1,80p' || true
  else
    echo "npm not found"
  fi
fi

echo
echo "== GitHub Actions Workflow YAML =="
workflow_files=()
while IFS= read -r -d '' file; do
  workflow_files+=("$file")
done < <(find .github/workflows -maxdepth 1 -type f \( -name '*.yml' -o -name '*.yaml' \) -print0 2>/dev/null)

if [ "${#workflow_files[@]}" -eq 0 ]; then
  echo "no GitHub Actions workflows found"
elif command -v ruby >/dev/null 2>&1; then
  ruby -e 'require "yaml"; ARGV.each { |file| YAML.load_file(file); puts "parsed: #{file}" }' "${workflow_files[@]}"
else
  echo "skipped: ruby not found for YAML parse"
fi
