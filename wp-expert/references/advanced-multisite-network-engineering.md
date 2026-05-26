# Advanced Multisite And Network Engineering

Use this for WordPress multisite, network activation, domain mapping, sunrise/drop-ins, cross-site data, SaaS/WaaS networks, migrations, network admin UX, and enterprise governance.

## Current Official Anchors

- Multisite handbook: https://developer.wordpress.org/advanced-administration/multisite/
- Network administration: https://developer.wordpress.org/advanced-administration/multisite/administration/
- Prepare a network: https://developer.wordpress.org/advanced-administration/multisite/prepare-network/
- Learn WordPress multisite development: https://learn.wordpress.org/lesson/developing-for-a-multisite-network/
- VIP multisite imports: https://docs.wpvip.com/databases/import/multisite-database-imports/

Verify platform and host-specific multisite constraints before architecture or migration commitments.

## Network First Pass

- Identify network shape: subdomain, subdirectory, mapped domains, regional networks, enterprise intranet, WaaS, multilingual, or multisite used only for environment isolation.
- Identify ownership: network admin, site admins, editors, tenants, central platform team, client teams, and automated provisioning.
- Identify data boundaries: global users, per-site options, network options, shared tables, uploads, object cache groups, search index, analytics, and billing/licensing.
- Identify plugin/theme activation model: network active, per-site active, must-use, shared theme, child theme, or tenant-specific extensions.

## Architecture Rules

- Never assume a single-site option/meta/table lookup is correct in multisite. Include site/blog ID in cache keys, table names, logs, queue args, and external IDs where behavior varies per site.
- Avoid `switch_to_blog()` loops across large networks on web requests. Use WP-CLI, queues, indexed central tables, or search/index infrastructure for cross-network operations.
- Use network options for true network config only. Do not put high-churn per-site state in network options.
- Keep uploads, media URLs, domain mapping, SSL, redirects, and CDN behavior explicit per mapped domain.
- Treat super-admin capabilities as a separate trust boundary from site admin capabilities.

## Network Activation And Provisioning

- Network activation must be idempotent and safe across existing sites.
- Provision per-site schema/options lazily or in controlled batches; do not upgrade thousands of sites during one web request.
- For new site creation, hook provisioning with clear defaults, rollback behavior, and audit logs.
- For uninstall, define whether data removal is per-site, network-wide, tenant-controlled, or intentionally retained.

## Migrations

- Plan migrations as batches with resume markers, locking, dry runs, and progress output.
- Validate table prefixes, blog IDs, domain mappings, serialized data, upload paths, search indexes, and object cache invalidation.
- For domain mapping or network splits/merges, preserve redirects, canonical URLs, media URLs, user roles, and external service callbacks.
- Avoid direct SQL across all site tables unless APIs are too slow and cache/index cleanup is explicitly planned.

## Governance And Admin UX

- Give network admins visibility into per-site status, version drift, failed provisioning, queue health, and configuration overrides.
- Keep tenant/site admin UI scoped to their authority.
- Include audit trails for network-level setting changes, provisioning, domain changes, and destructive operations.
- Document escalation paths for tenant-impacting incidents.

## Validation

- Test single site, multiple sites, network active/per-site active modes, mapped domain, subsite admin, super admin, CLI batch, cache hit/miss, and deactivation/uninstall.
- For large networks, test against production-shaped site counts and avoid relying on dev networks with only two sites.

## Output Expectations

- State network shape, data boundaries, activation model, migration/batch strategy, capability model, and validation surfaces.
- For reviews, prioritize cross-site data leaks, unbounded network loops, cache key collisions, broken domain mapping, and unsafe network activation.
