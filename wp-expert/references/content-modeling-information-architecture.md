# Content Modeling And Information Architecture

Use this for CPTs, taxonomies, metadata, custom tables, block-based content models, editorial workflows, permissions, search/index strategy, reusable patterns, and long-term content maintainability. For custom table schema/index/migration review, use `database-table-architecture-review.md`.

## Current Official Anchors

- Custom post types: https://developer.wordpress.org/plugins/post-types/
- Taxonomies: https://developer.wordpress.org/plugins/taxonomies/
- Metadata API: https://developer.wordpress.org/plugins/metadata/
- Settings API: https://developer.wordpress.org/plugins/settings/
- Block Editor Handbook: https://developer.wordpress.org/block-editor/
- WordPress REST API reference: https://developer.wordpress.org/rest-api/reference/

Verify current project conventions and plugin/theme ownership before changing content architecture.

## Model The Editorial Job

Start with how editors and visitors think, not how developers want tables:

- Content types: durable entities with identity, URLs, permissions, templates, workflows, and archives.
- Taxonomies: classification, filtering, navigation, relationships, and editorial governance.
- Meta: structured attributes that belong to a post/user/term/comment and do not need independent lifecycle.
- Custom tables: high-volume, transactional, relational, reporting, or non-post-shaped data.
- Blocks/patterns: editorial layout and presentation, not a dumping ground for durable business data unless block attributes are the real contract.

## Decision Rules

- Use CPTs when content needs its own URL, editorial lifecycle, permissions, REST shape, archive, search behavior, or template.
- Use taxonomies when many items share a controlled vocabulary that drives navigation, filtering, permissions, or reporting.
- Use post meta for bounded attributes; avoid broad unindexed meta queries on high-traffic paths.
- Use custom tables for high-volume writes, complex queries, reporting, queues, logs, event data, or data that would abuse postmeta.
- When custom tables are chosen, document expected cardinality, read/write paths, indexes, retention, migrations, multisite ownership, and repository boundaries using `database-table-architecture-review.md`.
- Use options for configuration, not content or high-churn state.
- Use reusable blocks/patterns/template parts for layout reuse; use CPTs or global styles/tokens for durable data and design systems.

## Block-Based Content Models

- Preserve editor agency without making content unstructured.
- Prefer core blocks, patterns, block styles, variations, and bindings before custom blocks.
- Create custom blocks when the design/content unit has validation rules, structured fields, reusable behavior, dynamic rendering, or integration logic.
- Store durable business data outside fragile HTML comments when it must be queried, migrated, exported, permissioned, or integrated.
- Keep block attributes versioned and migration-aware for launched content.

## Editorial Workflow

- Define roles, capabilities, revisions, preview, scheduled publishing, moderation, legal review, translations, and ownership.
- Make admin list tables usable at scale with columns, filters, search, bulk actions, and indexes.
- Plan import/export, redirects, archive pages, feeds, sitemap behavior, search indexing, and analytics events.
- Include empty states, invalid states, missing media, long titles, translated text, and mobile editing when relevant.

## Data Integrity

- Validate on save, not only in UI.
- Keep schemas explicit for REST, blocks, options, custom tables, and imports.
- Add migrations for schema changes and backfill tasks for derived data.
- Avoid duplicate sources of truth. If duplicates are necessary for performance, define synchronization, invalidation, and repair commands.

## Validation

- Test create/edit/delete, bulk edits, revisions, autosaves, REST responses, permissions, templates, search/filter, imports, exports, and migration rollback.
- For high scale, test query plans and admin behavior with production-shaped counts.

## Output Expectations

- State chosen content model, why alternatives were rejected, editor workflow, query/index implications, migration needs, and validation plan.
