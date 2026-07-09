# Plugin Development And Architecture

Use this for plugin creation, features, refactoring, custom tables, settings, REST/AJAX, async work, releases, and maintainability. Add one product-architecture or supportability reference only when that boundary is confirmed.

## Plugin Development Workflow

1. Identify the plugin boundary: entry file, namespace/prefix, autoload, main class, module registration, activation/deactivation/uninstall hooks.
2. Map integration points: actions, filters, shortcodes, blocks, REST routes, AJAX actions, WP-CLI commands, cron/Action Scheduler hooks.
3. Separate concerns: bootstrap, domain rules, persistence, admin UI, frontend rendering, assets, jobs, third-party adapters.
4. Preserve public contracts unless the user accepts a breaking change.
5. Add validation and tests around the changed surface before broad refactors.

## Recommended Shape

```text
plugin.php                  thin bootstrap, constants, autoload, Plugin::boot()
src/Plugin.php              composition root and module registration
src/Admin/                  menu pages, settings, list tables, notices
src/Rest/                   REST controllers, schemas, permissions
src/Domain/                 business rules and DTOs
src/Persistence/            options, repositories, custom table gateways
src/Jobs/                   cron/Action Scheduler handlers
src/Assets/                 enqueue, asset metadata, localization
src/Blocks/                 block registration and render callbacks
src/Integrations/           third-party adapters and provider clients
```

Keep the bootstrap thin. It should define constants, load autoloaders, check dependencies, and start the plugin. It should not contain business logic.

## Settings And Options

- Use Settings API for conventional admin settings when it fits; use custom controllers when the UX requires richer flows.
- Validate settings on write. Do not rely on UI controls to constrain values.
- Use `autoload = false` for settings not needed on most requests.
- Split very large or frequently updated options by access pattern. Do not create one giant hot option.
- Store secrets deliberately. Prefer environment/host secret management; if WordPress storage is required, prevent REST/client/log exposure.

## REST And AJAX

- REST is the default for new interactive endpoints in admin, editor, frontend, and external integrations.
- Do not create new `admin-ajax.php` handlers when the same behavior can be expressed as a REST route.
- Treat existing AJAX handlers as legacy compatibility surfaces. Keep them only when backward compatibility, old integrations, or non-REST constraints require them.
- If an existing AJAX endpoint is touched, consider adding a REST route and keeping the AJAX action as a thin compatibility wrapper around the same service.
- Every state-changing entry point needs capability check, nonce/CSRF where applicable, validation, idempotency, and clear error responses.
- Route schemas should describe input shape and reduce controller-level parsing.
- Public endpoints must be explicitly public and return only public data.

Use `admin-ajax.php` only with a documented reason, such as maintaining an existing public action contract, supporting legacy third-party JS already calling that action, or working inside a constrained older admin flow where adding REST is riskier than keeping a thin wrapper.

## Custom Tables

Use custom tables for high-volume operational data, logs, attempts, events, reporting, or indexed lookups that post/meta tables cannot support.

Requirements:

- Versioned schema option.
- Idempotent migration runner.
- Indexes for list views, lookups, retention cleanup, and foreign keys by convention even when MySQL constraints are not used.
- Bounded activation behavior. Long migrations must run in batches after activation.
- Repository/gateway layer to isolate SQL and make query behavior reviewable.
- Privacy/export/erase/retention policy when data contains user information.

## Activation, Deactivation, Uninstall

- Activation can create tables, default options, capabilities, scheduled hooks, and rewrite rules when necessary.
- Activation must not make slow remote calls or process large datasets synchronously.
- Deactivation should unschedule plugin-owned jobs and release runtime state without deleting user data unexpectedly.
- Uninstall must be explicit and careful. Destructive cleanup needs user intent or documented plugin policy.

## Async Jobs

- Use Action Scheduler for plugin-owned queues when available and appropriate.
- Use WP-Cron for simple scheduled tasks, but account for traffic-driven execution.
- Job args should be stable IDs or opaque tokens, not full payloads, secrets, or PII.
- Jobs must be idempotent, retry-safe, bounded, and observable.
- Add locks for single-flight tasks and external provider cooldowns.

## Release Packaging

- Confirm plugin header, text domain, version constants, readme metadata, license, build assets, translation files, Composer vendor policy, and generated asset manifests.
- Ensure source-only files, tests, node modules, local env files, and secrets are excluded from release artifacts.
- Confirm release artifact names do not conflict with local dev symlinks or monorepo source checkouts.
