# Enterprise Code Quality Gate

Use this for WordPress code creation, refactoring, and review when the output should meet enterprise, WP VIP-style, or long-lived product standards.

## Principle

Treat every generated or reviewed code path as production code for a high-traffic, security-sensitive WordPress environment unless the user explicitly accepts a lower bar. Prefer the simplest design that is modular, performant, secure, maintainable, observable, and testable under realistic failure modes.

Every implementation should explicitly consider these quality dimensions before being called done, merge-ready, or release-ready:

- Scalability.
- Modularity and ownership boundaries.
- Maintainability and duplication pressure.
- Meaningful comments only where comments add value.
- Test coverage proportional to risk.
- Performance on realistic hot paths.
- Security and privacy hardening.

Do not force a new abstraction or exhaustive test suite when the risk does not justify it. If a dimension is not materially relevant, state `Not applicable - reason` instead of silently skipping it.

## Before Writing Code

- Define the contract: hooks, filters, REST routes, block attributes, options, meta keys, schema versions, CLI commands, queue hooks, assets, templates, and public APIs.
- Define ownership: theme vs plugin, bootstrap vs module, domain logic vs persistence, admin/editor UI vs frontend rendering, provider adapter vs core service.
- Identify trust boundaries: request input, REST/AJAX, webhooks, uploads, imports, cron/action queues, external APIs, editor attributes, and saved content.
- Identify hot paths: page render, REST/editor load, checkout/forms, search, admin bootstrap, list tables, cron, migrations, and cache misses.
- Decide validation: unit, integration, WP test suite, JS tests, e2e, visual, accessibility, static analysis, runtime smoke, or manual evidence.
- Avoid premature abstraction, but do not duplicate rules that can drift across entry points, providers, migrations, or tests.

## Implementation Bar

- Keep bootstraps thin and composition explicit; move behavior into named modules/classes/functions with one clear reason to change.
- Pass dependencies where practical; avoid hidden globals except at WordPress integration boundaries.
- Make data contracts explicit through schemas, DTO-like arrays, typed methods where supported, and documented option/meta/table shapes.
- Prefer plug-and-play defaults and avoid adding settings unless they unlock real value, safety, or developer flexibility.
- Bound every query, loop, migration, remote call, queue batch, cache payload, and rendered collection.
- Sanitize and validate on ingress; escape at the output boundary; authorize with capabilities and object ownership before mutation or disclosure.
- Make side effects idempotent, retry-safe, race-aware, and observable with redacted logs/status where appropriate.
- Use deterministic cache keys with the right dimensions and invalidation near the data owner.
- Keep admin/editor/frontend assets scoped to the screens, blocks, templates, or routes that need them.
- Preserve backward compatibility for launched contracts and real data; remove or reshape unreleased draft code instead of adding unnecessary shims.
- Add concise comments only for non-obvious security, compatibility, cache, migration, concurrency, or platform decisions.
- Keep comments useful for the next engineer; remove stale debug comments, commented-out code, and narrative that restates obvious code.

## Test Expectations

Tests should prove behavior, not just line coverage. Choose the smallest reliable set that covers the changed risk.

Cover common paths:

- Successful authorized operation.
- Validation failure and user-facing error shape.
- Permission denied or unauthenticated access.
- Persistence read/write, cache hit/miss, and invalidation when relevant.
- Rendered output, REST response, block save/render, or admin/editor UI behavior.

Cover rare and failure scenarios when relevant:

- Empty, missing, malformed, oversized, translated, RTL, long-string, and special-character inputs.
- Deleted/missing referenced posts, terms, users, files, options, jobs, or remote records.
- Duplicate submissions, retries, concurrent runners, stale cache, expired tokens, and partial migrations.
- Multisite blog/network scope, switched blog restoration, role/capability variations, and object ownership.
- External API timeout, 429/rate limit, 5xx, invalid JSON/XML, auth failure, webhook replay, and idempotency conflict.
- Large data volume, pagination boundaries, indexed lookup paths, and no-result states.
- Editor reload, invalid block avoidance, frontend parity, keyboard navigation, focus, contrast, and reduced-motion behavior.
- Activation, upgrade, rollback/backout, uninstall, and production artifact boundaries.

When tests are not feasible locally, provide the strongest available evidence and explicitly name the untested risk.

## Merge And Release Expectation

Before opening, recommending, merging, or counting an implementation PR toward release readiness, confirm the changed code meets this contract or record the exact exception and residual risk.

## Review Gate

For code review, block or flag code that:

- Mixes unrelated responsibilities in a way that prevents focused tests or safe changes.
- Adds unbounded queries, synchronous remote calls on hot paths, global asset loading, or large autoloaded options.
- Misses capability checks, object ownership checks, REST permission callbacks, nonce/CSRF protection, sanitization, escaping, SQL preparation, SSRF protection, or secret/PII redaction.
- Introduces broad refactors without reducing concrete risk or improving testability.
- Adds compatibility for unreleased intermediate shapes instead of cleaning the final contract.
- Lacks tests for the changed behavior or skips rare scenarios that match the risk.
- Produces generated code that works only for the happy path and would fail under scale, multisite, cache, race, migration, or editor/frontend parity conditions.

## Completion Rule

Do not call work done until implementation, tests or validation, and residual risk are all stated with evidence. If the repo lacks tooling, use syntax/static/runtime smoke checks and say what deeper gates were unavailable.
