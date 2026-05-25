#!/usr/bin/env bash
set -euo pipefail

checkout_path="${1:-}"
version="${2:-}"

if [ -z "$checkout_path" ] || [ -z "$version" ]; then
  echo "usage: bash wp-expert/scripts/wporg-release-verify.sh /path/to/svn-checkout 1.2.3" >&2
  exit 1
fi

cd "$checkout_path"

missing=0
dev_dep_hits=0

check_path() {
  local path="$1"
  if [ -e "$path" ]; then
    echo "ok: $path"
  else
    echo "missing: $path"
    missing=1
  fi
}

echo "== SVN Structure =="
check_path "trunk"
check_path "tags/$version"
check_path "assets"

echo
echo "== Production Vendor Hygiene =="

dev_pattern='phpunit/phpunit|phpstan/phpstan|squizlabs/php_codesniffer|wp-coding-standards/wpcs|dealerdirect/phpcodesniffer-composer-installer|php-stubs/wordpress-stubs|php-stubs/woocommerce-stubs'

for target in "trunk" "tags/$version"; do
  if [ ! -d "$target" ]; then
    continue
  fi

  if [ -d "$target/vendor" ]; then
    echo "vendor present: $target/vendor"
    if [ -f "$target/vendor/composer/installed.json" ]; then
      if command -v rg >/dev/null 2>&1; then
        if rg -n -e "$dev_pattern" "$target/vendor/composer/installed.json" >/tmp/wporg-release-verify-devdeps.txt; then
          echo "dev package indicators found in $target/vendor/composer/installed.json"
          cat /tmp/wporg-release-verify-devdeps.txt
          dev_dep_hits=1
        else
          echo "no known dev package indicators in $target/vendor/composer/installed.json"
        fi
      else
        if grep -En "$dev_pattern" "$target/vendor/composer/installed.json" >/tmp/wporg-release-verify-devdeps.txt; then
          echo "dev package indicators found in $target/vendor/composer/installed.json"
          cat /tmp/wporg-release-verify-devdeps.txt
          dev_dep_hits=1
        else
          echo "no known dev package indicators in $target/vendor/composer/installed.json"
        fi
      fi
    else
      echo "note: $target/vendor/composer/installed.json not found; inspect vendor manually"
    fi
  else
    echo "vendor absent: $target/vendor (acceptable if plugin has no Composer runtime dependencies)"
  fi
done

echo
echo "== Summary =="
if [ "$missing" -ne 0 ]; then
  echo "failed: missing required SVN paths"
fi
if [ "$dev_dep_hits" -ne 0 ]; then
  echo "failed: dev-only Composer packages detected in deployed vendor"
fi

if [ "$missing" -ne 0 ] || [ "$dev_dep_hits" -ne 0 ]; then
  exit 1
fi

echo "passed: required SVN paths present and no known dev-only Composer packages detected"
