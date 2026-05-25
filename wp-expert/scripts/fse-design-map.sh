#!/usr/bin/env bash
set -euo pipefail

output_path="${1:-}"

if [ -z "$output_path" ]; then
  echo "usage: bash wp-expert/scripts/fse-design-map.sh /path/to/design-map.md" >&2
  exit 1
fi

if [ -e "$output_path" ] && [ "${WP_EXPERT_FORCE:-0}" != "1" ]; then
  echo "error: $output_path already exists (set WP_EXPERT_FORCE=1 to overwrite)" >&2
  exit 1
fi

mkdir -p "$(dirname "$output_path")"

cat > "$output_path" <<'TEMPLATE'
# FSE Design Map

## Metadata

- Project:
- Theme slug:
- Design source:
- Date:
- Prepared by:

## Templates

- Required templates:
- Priority templates for milestone 1:
- CPT or WooCommerce templates:

## Template Parts

- Header variants:
- Footer variants:
- Reusable global sections:

## Patterns

- Core section patterns:
- Synced patterns:
- Unsynced patterns:

## Tokens (`theme.json`)

- Color palette:
- Typography scale:
- Spacing scale:
- Layout widths (`contentSize`, `wideSize`):
- Radius, border, shadow, motion:

## Content Model

- Static content fields:
- Dynamic data fields:
- Global reusable content:
- Query-driven sections:

## Block Mapping Ladder

- Solved with `theme.json`:
- Solved with core blocks:
- Solved with block bindings:
- Solved with block styles or variations:
- Solved with templates/parts/patterns:
- Requires custom block (justify each):

## Editor Surface Plan

- Document-level settings (document/sidebar panels):
- Block-level settings (inspector panels):
- Classic editor-only meta boxes (if legacy support is needed):

## Interaction and UX States

- Navigation behavior:
- Form states:
- Empty/loading/error states:
- Animation and reduced-motion behavior:

## Validation Matrix

- Breakpoints:
- Editor/frontend parity targets:
- Accessibility checks:
- Performance checks:

## Open Risks

- Risk:
- Mitigation:
TEMPLATE

echo "created: $output_path"
