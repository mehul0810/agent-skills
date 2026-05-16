# Enterprise Search And Content Scale

Use this for WordPress VIP Enterprise Search, Elasticsearch/OpenSearch-style search, high-volume content querying, admin search, index strategy, facets, related content, and avoiding MySQL bottlenecks.

## Current Official Anchors

- VIP Enterprise Search overview: https://docs.wpvip.com/guidebooks/upgrade-elasticsearch/prepare-new-index/
- Activate Enterprise Search: https://docs.wpvip.com/enterprise-search/enable/
- Index with Enterprise Search: https://docs.wpvip.com/enterprise-search/index/
- Choose what to index: https://docs.wpvip.com/enterprise-search/indexing/
- Offload a WP_Query to Enterprise Search: https://docs.wpvip.com/enterprise-search/enable-non-search-queries/
- Check index health: https://docs.wpvip.com/enterprise-search/check-index-health/

## Search Architecture Principle

At enterprise content volume, search is not just a feature. It is a query offload layer that protects MySQL, improves editorial workflows, and makes faceted discovery feasible.

Use Enterprise Search or an equivalent search backend when:

- Public search, archive filters, facets, related content, or reports rely on broad text/meta/taxonomy queries.
- Admin/editor search is slow at production cardinality.
- `WP_Query` filters require sorting or filtering on fields that do not belong in hot MySQL meta queries.
- Multisite networks need cross-site or site-scoped search with clear indexing boundaries.

## VIP Enterprise Search Rules

Verify current VIP docs before implementation. Stable operating points:

- Enterprise Search is a VIP Integration and is activated per environment/application context.
- VIP Enterprise Search loads its own forks/integration code; do not keep competing Elasticsearch adapters such as Jetpack Search or custom `es-wp-query` adapters active at the same time unless VIP docs explicitly support that architecture.
- Indexing normally depends on WordPress event hooks. Direct database writes or non-standard content mutation can leave indexes stale.
- Default indexing does not mean every custom field belongs in the index. Index only what queries, filters, sorting, facets, or relevance actually need.

## Index Design

Plan indexed data deliberately:

- Post types: public content first, private/protected content only with explicit permission design.
- Post statuses: include non-public statuses only when the consuming UI enforces access correctly.
- Taxonomies: index those used for filtering, facets, relevance, or routing.
- Post meta: allow-list fields needed for search, filtering, sorting, or display snippets; avoid dumping arbitrary meta.
- Users/terms/custom objects: index only with ownership, privacy, deletion, and stale-data behavior defined.
- Locale and multisite: include site/blog, language, region, and network boundaries in queries and index strategy.

## Query Offload Guidance

- Keep WordPress query semantics where possible, but verify generated search behavior and permission constraints.
- Avoid falling back to expensive MySQL queries when search is unavailable; define graceful degradation.
- Do not use search as a dumping ground for operational logs or high-churn records unless the backend is designed for that workload.
- Add relevance requirements before tuning: exact title match, taxonomy boost, recency, synonyms, typo tolerance, exclusions, and editorial boosts.
- For admin search, prioritize speed, permission correctness, and predictable result ordering over fancy relevance.

## Operations And Release

- Run indexing/versioning in controlled windows for large content sets.
- Check index health before switching traffic to a new index.
- Monitor indexing lag, failures, queue backlog, query latency, and fallback rate.
- Reindex after migrations that bypass normal WordPress hooks.
- Include rollback behavior: previous index version, disabled feature flag, or safe MySQL fallback for low-traffic admin-only views.

## Review Checklist

- Are competing search integrations disabled or intentionally isolated?
- Are indexed fields minimal and justified by query requirements?
- Are private/protected results excluded or permission-filtered correctly?
- Does content mutation go through hooks or trigger explicit reindexing?
- Are large imports followed by reindex/version/health checks?
- Are slow MySQL search/meta queries removed from hot paths?
