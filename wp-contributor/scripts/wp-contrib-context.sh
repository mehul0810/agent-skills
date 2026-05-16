#!/usr/bin/env bash
set -u

TARGET="${1:-.}"
cd "$TARGET" || exit 1

printf '== Location ==\n'
pwd

printf '\n== Git ==\n'
if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  printf 'root: '
  git rev-parse --show-toplevel
  git status --short --branch
  git remote -v | sed -n '1,8p'
else
  echo 'not a git worktree'
fi

printf '\n== SVN ==\n'
if command -v svn >/dev/null 2>&1 && [ -d .svn ]; then
  svn info | sed -n '1,20p'
else
  echo 'no svn checkout detected'
fi

printf '\n== Contribution Surface Markers ==\n'
[ -f package.json ] && echo 'package.json present'
[ -f composer.json ] && echo 'composer.json present'
[ -f phpunit.xml.dist ] && echo 'phpunit.xml.dist present'
[ -f .wp-env.json ] && echo '.wp-env.json present'
[ -d tests/phpunit ] && echo 'Core-style tests/phpunit present'
[ -d src/wp-admin ] && echo 'wordpress-develop src/wp-admin present'
[ -d packages ] && echo 'packages/ present'
[ -d bin ] && echo 'bin/ present'
[ -d .github/workflows ] && echo '.github/workflows present'

printf '\n== Likely Project ==\n'
remote_urls=""
if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  remote_urls="$(git remote -v 2>/dev/null || true)"
fi
case "$remote_urls" in
  *wordpress-develop*) echo 'wordpress-develop / Core Git mirror or fork' ;;
  *gutenberg*) echo 'Gutenberg / block editor' ;;
  *WordPress.org*|*meta*) echo 'possible Meta project' ;;
  *)
    if [ -d src/wp-admin ] && [ -d tests/phpunit ]; then
      echo 'possible wordpress-develop checkout'
    elif [ -d packages ] && [ -f package.json ]; then
      echo 'possible Gutenberg or package monorepo'
    else
      echo 'unknown; inspect ticket/repository docs'
    fi
    ;;
esac

printf '\n== Available npm scripts ==\n'
if [ -f package.json ] && command -v npm >/dev/null 2>&1; then
  npm run 2>/dev/null | sed -n '1,120p' || true
else
  echo 'no npm scripts discovered'
fi

printf '\n== Recent Tickets Or Contribution Hints ==\n'
if command -v rg >/dev/null 2>&1; then
  rg -n --glob '!node_modules/**' --glob '!vendor/**' --glob '!build/**' --glob '!dist/**' --glob '!wp-expert/**' --glob '!wp-contributor/**' 'core\.trac\.wordpress\.org|meta\.trac\.wordpress\.org|Fixes #[0-9]+|See #[0-9]+|Props |has-patch|needs-testing|good-first-bug' . | sed -n '1,120p' || true
else
  grep -RInE --exclude-dir=node_modules --exclude-dir=vendor --exclude-dir=build --exclude-dir=dist --exclude-dir=wp-expert --exclude-dir=wp-contributor 'core\.trac\.wordpress\.org|meta\.trac\.wordpress\.org|Fixes #[0-9]+|See #[0-9]+|Props |has-patch|needs-testing|good-first-bug' . | sed -n '1,120p' || true
fi
