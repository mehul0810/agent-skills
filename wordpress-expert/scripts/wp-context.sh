#!/usr/bin/env bash
set -euo pipefail

target="${1:-$PWD}"
cd "$target"

echo "== Location =="
pwd

echo
echo "== Git =="
if git_root=$(git rev-parse --show-toplevel 2>/dev/null); then
  echo "root: $git_root"
  git status --short --branch
  git remote -v 2>/dev/null || true
else
  echo "not a git repository"
fi

echo
echo "== WordPress Markers =="
find . -maxdepth 5 \( -name wp-load.php -o -path '*/wp-content/plugins' -o -path '*/wp-content/themes' -o -path '*/wp-content/mu-plugins' \) -print 2>/dev/null | sort || true

echo
echo "== Package Files =="
find . -maxdepth 4 \( -name composer.json -o -name package.json -o -name phpcs.xml -o -name phpcs.xml.dist -o -name phpstan.neon -o -name phpunit.xml -o -name vite.config.* -o -name webpack.config.* -o -name block.json \) -print 2>/dev/null | sort || true

echo
echo "== Plugin Headers =="
while IFS= read -r file; do
  if grep -Eq '^[[:space:]]*(\*[[:space:]]*)?Plugin Name:' "$file"; then
    echo "$file"
  fi
done < <(find . -maxdepth 6 -type f -name '*.php' -not -path '*/vendor/*' -not -path '*/node_modules/*' -not -path '*/.git/*' -print 2>/dev/null | sort)

echo
echo "== Theme Markers =="
find . -maxdepth 6 -type f \( -name style.css -o -name theme.json -o -name functions.php \) -not -path '*/vendor/*' -not -path '*/node_modules/*' -not -path '*/.git/*' -print 2>/dev/null | sort || true

echo
echo "== WordPress Entry Points =="
if command -v rg >/dev/null 2>&1; then
  rg -n --glob '!vendor/**' --glob '!node_modules/**' --glob '!build/**' --glob '!dist/**' --glob '!coverage/**' --glob '!wordpress-expert/**' 'register_rest_route|register_block_type|add_action|add_filter|wp_ajax_|wp_schedule_|as_enqueue_|register_activation_hook|register_deactivation_hook' . || true
else
  grep -RInE --exclude-dir=vendor --exclude-dir=node_modules --exclude-dir=build --exclude-dir=dist --exclude-dir=coverage --exclude-dir=wordpress-expert 'register_rest_route|register_block_type|add_action|add_filter|wp_ajax_|wp_schedule_|as_enqueue_|register_activation_hook|register_deactivation_hook' . || true
fi
