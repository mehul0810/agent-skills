#!/bin/sh
set -u
if [ "$#" -ne 1 ]; then
  echo "Usage: sh check.sh /path/to/wordpress" >&2
  exit 2
fi
here=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
php "$here/test-case.php" "$1" before
before_status=$?
if [ "$before_status" -ne 42 ]; then
  echo "ERROR: before must return unchanged content (exit 42); got $before_status" >&2
  exit 1
fi
echo "Expected failure observed."
php "$here/test-case.php" "$1" after || exit 1
echo "Before/after check passed."
