#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -eq 1 ] && [ "$1" = --help ]; then
  echo 'Usage: bash record.sh NEW_OUTPUT_DIR (run from a project with Playwright and Chromium)'
  exit 0
fi
if [ "$#" -ne 1 ] || [ -z "$1" ]; then
  echo 'Pass a new output directory. Run with --help for usage.' >&2; exit 2
fi
case "$1" in /*) out="$1" ;; *) out="$PWD/$1" ;; esac
if [ -e "$out" ] || [ -L "$out" ]; then
  echo 'Choose a new directory; the example does not replace previous takes.' >&2; exit 1
fi
command -v ffmpeg >/dev/null || { echo 'FFmpeg with libx264 is required for the MP4.' >&2; exit 1; }
repo=$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd -P)
umask 077
node "$repo/product-video-producer/scripts/record-walkthrough.mjs" --demo --out "$out"
clips=("$out"/*.webm)
if [ "${#clips[@]}" -ne 1 ] || [ ! -f "${clips[0]}" ]; then
  echo 'Expected one finalized browser recording; no MP4 created.' >&2; exit 1
fi
ffmpeg -nostdin -n -v error -xerror -i "${clips[0]}" -map 0:v:0 -an -map_metadata -1 \
  -c:v libx264 -pix_fmt yuv420p -crf 21 -movflags +faststart "$out/proof-desk.mp4"
ffmpeg -nostdin -v error -xerror -i "$out/proof-desk.mp4" -map 0:v:0 -f null -
printf 'Watch %s at normal speed: the divider should travel across the actual proof.\n' "$out/proof-desk.mp4"
