# Enterprise Code Quality Gate

Use this for WordPress code creation, refactoring, and review when the output should meet enterprise, WP VIP-style, or long-lived product standards.

## Principle

Treat generated or reviewed paths as production code unless the user accepts a lower bar. Prefer the simplest modular, performant, secure, maintainable, observable, and testable design.

Every implementation should explicitly consider these quality dimensions before being called done, merge-ready, or release-ready: scalability; ownership/modularity; maintainability/duplication; meaningful comments; risk-proportional tests; hot-path performance; and security/privacy.

Do not force a new abstraction or exhaustive test suite when the risk does not justify it. If a dimension is not materially relevant, state `Not applicable - reason` instead of silently skipping it.

## Enterprise Risk Profile

Classify runtime assurance before substantial work:

- `baseline`: ordinary maintained WordPress behavior with reversible scope and no material distribution, data, scale, compatibility, or operational exposure.
- `elevated`: public/commercial/VIP distribution; sensitive or regulated data; custom storage/migrations; authentication, payments, uploads, webhooks, public APIs, external providers, queues, multisite, high traffic, or release-critical workflows.

For elevated work, use `enterprise-runtime-assurance.md` to define the applicable compatibility matrix, supply-chain evidence, post-release observation, rollback signals, and adaptive repo contracts. Do not impose elevated artifacts on a low-risk change without a named reason.

## Before Writing Code

- Define contracts and ownership: hooks/routes/attributes/storage/schema/CLI/queues/assets/templates/APIs; theme vs plugin; domain vs persistence; admin/editor vs frontend; adapter vs core.
- Identify trust boundaries and hot paths: requests, webhooks, uploads, imports, queues, external APIs, saved content, render, editor/admin load, checkout/forms, search, migrations, and cache misses.
- Choose risk-matched unit, integration, WordPress, JS, e2e, visual, accessibility, static, runtime, or manual proof.
- Identify supported environment cells and the exact commit/package/runtime identity needed for proof.
- Avoid premature abstraction, but do not duplicate rules that can drift across entry points, providers, migrations, or tests.

## Implementation Bar

- Keep bootstraps thin, composition explicit, dependencies visible, and modules/functions focused. Limit globals to WordPress boundaries.
- Make data contracts explicit with schemas, typed methods where supported, and documented option/meta/table shapes.
- Prefer plug-and-play defaults and avoid adding settings unless they unlock real value, safety, or developer flexibility.
- Bound queries, loops, migrations, remote calls, queue batches, cache payloads, and rendered collections.
- Validate/sanitize ingress, escape output, and authorize capabilities plus object ownership before mutation/disclosure.
- Make side effects idempotent, retry-safe, race-aware, and observable with redacted signals.
- Use deterministic cache keys with the right dimensions and invalidation near the data owner.
- Keep admin/editor/frontend assets scoped to the screens, blocks, templates, or routes that need them.
- Preserve launched contracts/data; reshape unreleased drafts rather than adding shims. Comment only non-obvious security, compatibility, cache, migration, concurrency, or platform decisions; remove stale/debug/commented-out code.

## Test Expectations

Tests prove behavior, not line coverage. Use the smallest reliable set covering:

- Authorized success; validation/error shape; unauthenticated/unauthorized access; persistence/cache; rendered, REST, block, admin, or editor behavior.
- Applicable edge states: empty/malformed/oversized/translated/RTL input; missing records; retries/concurrency/stale cache/partial migrations; role, ownership, multisite, and switched-blog restoration.
- Applicable integrations/scale: timeouts, 429/5xx, invalid payload/auth/replay/idempotency; volume, pagination, indexed lookup, queues, and no-result states.
- Applicable UX/lifecycle: editor reload/frontend parity; keyboard/focus/contrast/reduced motion; activation, upgrade, rollback, uninstall, and packaged artifact.

When tests are not feasible locally, provide the strongest available evidence and explicitly name the untested risk.

## Local-First Validation Contract

Every maintained repo should provide one canonical local validation command or a documented small command set. Run the applicable gate before commit, PR, or non-production merge and report exact results. Prefer repository scripts so developers and release automation execute the same test/build/package logic. Do not substitute per-push GitHub Actions for locally reproducible validation, and do not treat missing hosted CI as permission to skip tests. Reserve hosted automation for release/prerelease proof or a documented risk that local execution cannot cover reliably.

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
