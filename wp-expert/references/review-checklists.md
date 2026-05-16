# WordPress Review Checklists

Use this for audits, PR review, plugin/theme review, VIP readiness review, and security/performance/modularity checks. For duplicate-code and modularity reviews, also read `duplicate-code-modularity-review.md`.

## Triage Map

Before judging code, identify:

- Entry points: plugin headers, theme functions, mu-plugins, autoload, block metadata, REST route registration, AJAX actions, WP-CLI commands, cron hooks.
- Trust boundaries: forms, REST, AJAX, webhooks, imports, uploads, admin pages, third-party APIs, background jobs.
- Persistence: options, post meta, term meta, user meta, custom tables, transients, object cache, scheduled events, logs.
- Runtime target: single site, multisite, WooCommerce, block theme, classic theme, VIP/enterprise, local Studio, CI.
- Deployment shape: built assets, generated files, Composer autoload, release artifacts, symlinks, mu-plugin loading.

## Finding Quality Bar

A valid finding needs:

- Location: file and exact line when possible.
- Impact: what breaks, leaks, slows down, or becomes exploitable.
- Trigger: request, role, data shape, traffic pattern, migration path, or environment.
- Fix direction: concise and compatible with the codebase.
- Confidence: avoid speculative findings unless labeled as risk or open question.

## Security

Check these first for externally reachable code:

- Authorization: every state-changing action has an explicit capability check. Do not rely on nonce, menu visibility, or UI hiding.
- CSRF: admin/AJAX/form mutations verify a nonce tied to the action.
- REST: every route has `permission_callback`; public routes intentionally return public data only.
- AJAX/API design: new JS-driven interactions should use REST API unless a concrete legacy compatibility reason requires `admin-ajax.php`.
- Input: sanitize and validate by type, length, enum, ID ownership, URL scheme, MIME type, and business rule.
- Output: escape at output boundary with `esc_html`, `esc_attr`, `esc_url`, `wp_kses`, or context-specific escaping.
- SQL: dynamic values use `$wpdb->prepare`; table/column/order identifiers are whitelisted.
- Files: validate uploads with WordPress media APIs; block path traversal; never trust filenames or MIME from the client alone.
- SSRF: restrict outbound URLs, block internal IP ranges where applicable, set timeouts, and validate protocols.
- Secrets: no secrets in client JS, markup, logs, options exposed through REST, cron args, cache keys, screenshots, or PR bodies.
- PII: no unnecessary PII persistence. Logs should use IDs/tokens and redaction.
- Unserialization: avoid `unserialize` on untrusted data; use JSON and strict schemas.
- Redirects: use `wp_safe_redirect` or explicit allowlists for external redirects.

## Performance And Scale

Look for production-scale failure modes:

- Autoloaded options: large, volatile, or frequently updated options should not autoload.
- Queries: avoid unbounded queries, broad meta queries, leading-wildcard search, taxonomy explosions, and N+1 loops.
- Counts: use `no_found_rows => true` when pagination counts are not needed.
- Payload shape: use `fields => 'ids'` when only IDs are needed; prime caches intentionally when object hydration is needed.
- Cache strategy: expensive reads should have deterministic keys, groups, TTLs when useful, and invalidation hooks.
- Stampedes: high-traffic expensive cache misses need locks, stale-while-revalidate, or async warming.
- Remote calls: never make slow third-party calls on hot form submissions, checkout, REST, or page-render paths without timeouts and fallback.
- Cron: scheduled work should be bounded, chunked, idempotent, and safe with duplicate runners.
- Admin bootstrap: avoid expensive work on every `admin_init`, `init`, dashboard load, plugin list, or Site Health request.
- Assets: enqueue only where needed; avoid global admin/frontend bundles.

## Data And Migrations

- Activation must not perform long blocking migrations on large sites.
- Use versioned migrations and resume-safe batches for existing data.
- Custom tables need clear ownership, schema version, indexes for real queries, and uninstall policy.
- `dbDelta` changes need stable SQL definitions and tested upgrade paths.
- Multisite needs explicit per-site vs network-wide storage decisions.
- Background jobs must tolerate retries, missing records, partial completion, and deleted dependencies.

## Architecture And Maintainability

- Bootstrap files should wire modules, not hold business logic.
- Service classes should have clear responsibility and no hidden request globals where dependencies can be passed.
- Hooks are API contracts. Renaming/removing hooks can be a BC break.
- Public classes/functions/constants/options need namespacing or prefixes.
- Avoid mixing admin UI, domain logic, persistence, and rendering in one function.
- Prefer adapters for third-party providers and integration-specific code.
- Avoid broad refactors unless they reduce active risk or are requested.
- Flag duplication when repeated logic can drift across hooks, REST/AJAX paths, settings saves, queries, cache keys, provider clients, or tests.
- Do not recommend an abstraction unless it creates a clear owner, improves testability, and stays easier to understand than the duplicated code.

## Block Editor And Frontend

- Persist editor controls as real block attributes when frontend rendering depends on them.
- Keep native Query Loop/layout markup intact unless layout is explicitly in scope.
- Do not solve frontend behavior by rewriting server markup when an isolated script or query adjustment is safer.
- Validate editor and frontend rendering separately.
- Preserve accessibility: labels, focus states, keyboard behavior, ARIA only when semantically correct.

## Release Readiness

- Confirm build output is committed or generated by release workflow as expected.
- Confirm plugin headers, text domain, version constants, asset versions, and dependency declarations.
- Confirm activation/deactivation/uninstall behavior.
- Confirm rollback/backout path for migrations and feature flags.
- Confirm CI covers the changed surface or document the gap.

## Finding Template

```text
[P1] Missing capability check allows subscriber-triggered resend
File: /abs/path/plugin/src/Rest/MessagesController.php:88
Impact: Any logged-in user can trigger email resend for arbitrary message IDs, causing data exposure and provider abuse.
Trigger: POST /wp-json/example/v1/messages/{id}/resend with a valid nonce but no capability check.
Fix: Require a capability such as manage_options or a plugin-specific capability and verify ownership before enqueueing resend.
```
