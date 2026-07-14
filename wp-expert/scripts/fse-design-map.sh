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
- Source classification (exact, directional, inspiration):
- Source dimensions and intended viewport:
- Source/candidate screenshot paths:
- Distribution target (WordPress.org Theme Directory, commercial, private/client/VIP):
- Target WordPress/Gutenberg/browser policy:

## Evidence Confidence

- Supplied facts:
- Measured values:
- Inferred values:
- Ambiguity ledger (unknown, evidence, reversible inference, validation/decision):

## Visual Region Measurements

- Region/hierarchy map:
- Widths, gaps, alignment, and layering:
- Typography and font-loading evidence:
- Colors, borders, radii, and shadows:
- Desktop-to-mobile behavior (supplied/inferred/decision needed):

## Component Contracts

- Component/semantic role:
- Variants and full states:
- Content bounds and translated/long behavior:
- Token dependencies:
- WordPress primitive and editing surface:

## Templates

- Required templates:
- Priority templates for milestone 1:
- CPT or WooCommerce templates:

## Ownership Map

- Theme-owned presentation:
- Plugin-owned durable functionality/data:
- Post content:
- Post meta/options:
- External data sources:
- Synced/global editor-owned content:

## Admin Editing Surface

- Primary editing surface (Pages > Edit, Site Editor, synced pattern, option page, CPT, external data):
- Visible content source of truth (`post_content`, template, part, pattern, meta, option, API):
- Templates that must render Post Content:
- Page content seeding plan (manual, WP-CLI, import, migration, none):
- Site Editor database override policy:
- Nonportable Navigation, synced-pattern, attachment, or other database references:
- Locked areas vs editor-editable areas:

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

## Asset Inventory

- Supplied/reused assets:
- Missing assets:
- Generate/source/license/placeholder decisions:
- Asset briefs and approval state:
- Crops, focal points, aspect ratios, responsive variants:
- Provenance, alt-text intent, formats, dimensions, optimization:

## Block Mapping Ladder

- Solved with content model/data contract:
- Solved with `theme.json`:
- Solved with templates/template parts:
- Solved with patterns:
- Solved with core blocks:
- Solved with block bindings:
- Solved with block styles or variations:
- Requires custom block with InnerBlocks (justify each):
- Requires custom dynamic block (justify each):
- Requires Interactivity API behavior:

## Custom Block Decisions

- Static vs dynamic rendering:
- Attributes vs meta/options/data source:
- InnerBlocks allowed blocks/template/locking:
- Parent/ancestor/child relationships:
- Deprecation or migration strategy:
- Editor preview and empty states:

## Editor Surface Plan

- Document-level settings (document/sidebar panels):
- Block-level settings (inspector panels):
- Classic editor-only meta boxes (if legacy support is needed):

## Interaction and UX States

- Navigation behavior:
- Form states:
- Empty/loading/error states:
- Animation and reduced-motion behavior:

## Golden Workflows

- Visitor workflow (entry, action, feedback, completion, recovery):
- Author workflow (locate, edit, reorder constraints, save/reload, preview, rollback/revision):

## Content And Compatibility Stress

- Affected templates and Theme Unit Test Data cases:
- Long/translated/missing-media/query/error/permission states:
- Continuous resize range, container context, orientation, pointer/hover, safe-area risk:
- Browser engines and real-device proof required:

## Validation Matrix

- Breakpoints:
- Pages > Edit controls visible page-owned content:
- Site Editor controls only intended template/part/global content:
- Editor/frontend parity targets:
- Accessibility checks:
- Performance checks:
- Matched viewport/zoom/content/font/data state:
- Capture fingerprint (build, WP/Gutenberg/theme, browser/OS/DPR, locale/timezone, color scheme, font/media readiness, volatile-input policy):
- Overlay or perceptual-diff method:
- Region-level parity tolerance:
- Accepted, constrained, and unresolved deviations:
- WCAG 2.2 checks, including reflow/focus/target/dragging where applicable:
- Repo-specific performance baseline and budget:
- Site Editor source inventory (`wp_template`, `wp_template_part`, `wp_global_styles`; IDs/slugs/theme association/fingerprints):
- Navigation/synced-pattern/media reference resolution or migration:
- Promoted repository files/assets and reviewed diff:
- Commit/package identity and clean-install resolved-source proof, including promoted database dependencies:
- Matched frontend and Site Editor edit/save/reload proof:
- Existing-site migration dry run and rollback evidence:

## Open Risks

- Risk:
- Mitigation:
TEMPLATE

echo "created: $output_path"
