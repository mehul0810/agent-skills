# Plugin Product Architecture

Use this for product-grade plugin architecture beyond basic module layout: extension contracts, add-on ecosystems, feature flags, diagnostics, upgrade-safe public APIs, dependency detection, Site Health integration, support exports, and enterprise product readiness.

Use alongside `plugin-architecture.md` for baseline structure, `marketplace-product-readiness.md` for product packaging, `release-contract-compatibility.md` for public contracts, and `plugin-debuggability-supportability.md` for diagnostics.

## Product Architecture Goals

A mature WordPress plugin should be:

- Extensible without editing core plugin files.
- Safe to upgrade across launched versions.
- Observable enough for support and enterprise operations.
- Modular enough for add-ons, pro features, integrations, and tests.
- Clear about ownership of data, hooks, REST routes, blocks, assets, jobs, and settings.
- Conservative with public contracts and explicit when breaking changes are unavoidable.

## Public Contract Inventory

Before adding or changing plugin behavior, inventory:

- Hooks and filters, including argument order, data shapes, and return expectations.
- Public PHP classes, functions, constants, interfaces, traits, and service IDs.
- Shortcodes, blocks, block attributes, block names, block variations, and render output contracts.
- REST routes, schemas, statuses, error codes, permissions, and response shapes.
- WP-CLI commands, arguments, output formats, and exit codes.
- Options, transients, custom table schemas, meta keys, taxonomy terms, capabilities, and roles.
- Asset handles, localized object names, CSS class contracts, template override paths, and integration slugs.

Treat undocumented but externally used contracts as launched once customers, add-ons, snippets, or integrations depend on them.

## Extension Surface Design

Prefer extension points that are stable, specific, and testable:

- Use namespaced hook names: `vendor_plugin_area_event`.
- Pass compact DTOs or arrays with documented keys instead of raw globals when possible.
- Put filters near the decision they alter, not around broad controller output.
- Keep action hooks for events and filter hooks for values.
- Validate filtered values before use; third-party code is untrusted.
- Include integration tests or contract tests for hooks that add-ons rely on.
- Avoid exposing internal service objects unless they are intentionally public APIs.

Bad extension points create permanent compatibility debt. Add a hook only when there is a real customization use case.

## Add-On And Pro Architecture

For free/pro or add-on ecosystems:

- Keep the base plugin useful and stable without the pro/add-on package.
- Detect add-ons by capabilities, classes, package metadata, or registered integration APIs, not brittle file paths.
- Put shared contracts in the base plugin or a shared package with explicit versioning.
- Avoid circular dependencies between base and pro modules.
- Design pro feature gates so missing license servers do not break base functionality.
- Keep upgrade paths safe when pro is deactivated before base or base is updated before pro.
- Avoid duplicate bundled libraries across base/pro where dependency extraction or Composer conflict rules can manage the boundary.

## Feature Flags And Rollouts

Use feature flags for risky enterprise changes, migrations, new data models, external integrations, and UI rewrites.

- Flags should have an owner, default, rollout phase, removal plan, and test coverage.
- Avoid flags that change storage shape without migration discipline.
- Log flag changes with actor and timestamp when they affect production behavior.
- Prefer kill switches for external integrations and expensive async work.
- Do not leave permanent flag branches that double maintenance cost without reason.

## Dependency And Environment Detection

Detect dependencies explicitly:

- WordPress, PHP, database, Composer package, extension, WooCommerce, multisite, object cache, cron, REST, block editor, and theme requirements.
- Fail safely with admin notices or Site Health checks, not fatals.
- Gate optional integrations behind availability checks and clear admin messaging.
- Do not run dependency-heavy code on every request if it is only needed on one screen or job.

## Upgrade And Migration Product Rules

- Version every schema and option shape that can change after launch.
- Migrations must be idempotent, bounded, resumable, observable, and safe under concurrent requests.
- Preserve launched data contracts unless the release explicitly includes a migration and communication plan.
- Do not add backward compatibility for abandoned unreleased intermediate shapes.
- Provide rollback notes when migrations, custom tables, or public APIs change.

## Enterprise Support Surface

A plugin intended for serious clients should include, where useful:

- Site Health checks for dependency, cron, REST, queue, cache, and provider status.
- Diagnostics export with redacted environment, versions, feature flags, active integrations, queue status, and recent safe errors.
- Stable correlation IDs for provider requests, jobs, and support tickets.
- Admin recovery controls for retrying jobs, clearing safe caches, reconnecting providers, and pausing integrations.
- Clear privacy and data retention documentation for logs, diagnostics, telemetry, and exports.

## Review Checklist

- Are public contracts inventoried and protected?
- Are extension points narrow, documented, and validated?
- Can add-ons/pro features activate, deactivate, and update independently without fatals?
- Are feature flags temporary, observable, and tested?
- Do dependency failures degrade gracefully?
- Are migrations bounded and resumable?
- Does support have safe diagnostics without exposing secrets or PII?
- Are tests covering launched contracts and add-on compatibility boundaries?
