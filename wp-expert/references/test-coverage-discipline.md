# Test Coverage Discipline

Use this for implementation, review, and PR preparation when deciding whether a WordPress change needs new or updated automated tests, what kind of tests are appropriate, and how to report missing test coverage.

## Principle

Every code change or PR must make an explicit test-coverage decision. Add or update tests when the change alters behavior, protects a public contract, fixes a bug, touches data/security/performance, or prevents a realistic regression. Do not add token-wasting or brittle tests for changes that do not carry behavior risk.

The goal is durable regression protection, not vanity line coverage.

## Test Need Gate

Tests are normally required for:

- Bug fixes, especially regressions found in production, review, or QA.
- New or changed REST routes, admin actions, AJAX handlers, forms, webhooks, WP-CLI commands, cron/action jobs, imports, exports, and third-party API flows.
- Capability checks, object ownership, nonce/CSRF handling, sanitization, escaping, SQL, SSRF protection, uploads, redirects, secrets, or PII redaction.
- Persistence changes: options, meta, custom tables, schema versions, migrations, uninstall behavior, cache invalidation, and query/repository methods.
- Block editor behavior: block attributes, save/render output, dynamic blocks, inspector/document panels, editor reloads, variations, bindings, and template/pattern behavior.
- Theme/FSE behavior that changes rendered markup contracts, responsive behavior, accessibility-sensitive output, or editor/frontend parity.
- WooCommerce/order/account/checkout/payment/shipping/subscription behavior.
- Performance changes that depend on query bounds, cache keys, invalidation, async jobs, pagination, or batching.
- Backward compatibility for launched/public contracts and real production/client data.

Tests are often not required for:

- Documentation-only changes.
- Changelog/readme copy-only changes.
- Comments/docblocks that do not change runtime behavior.
- Exact user-fed CSS/value changes handled under `planning-drift-control.md` Level 0.
- Mechanical formatting-only changes with no behavior delta.
- Generated artifacts when the source change is already tested and the artifact is verified by build output.

If tests are omitted, state why the risk does not justify new coverage and what validation was run instead.

## Coverage Selection

Choose the smallest test type that proves the changed risk.

PHP:

- Pure domain logic: PHPUnit unit tests.
- Hook-heavy WordPress integration without full WP bootstrap: Brain Monkey or existing test doubles.
- Real WordPress APIs, roles/caps, options/meta, REST, blocks, migrations, custom tables: WP test suite or project integration tests.
- Database table repositories: install/upgrade tests, CRUD tests, query filter tests, duplicate/idempotency tests, and migration tests.
- WP-CLI commands and migrations: command-level tests where the repo has infrastructure, otherwise focused runtime probes plus follow-up if risk is high.

JavaScript/React/block editor:

- Utility/data logic: Jest/Vitest/unit tests.
- Components: React Testing Library or existing component tests.
- `@wordpress/data` flows: store/resolver/action tests where possible.
- Blocks: save output, deprecated/migration transforms, attributes, dynamic render callbacks, and editor behavior tests.
- Critical editor or admin flows: Playwright/Cypress/e2e when component/unit coverage cannot prove the behavior.

Frontend/theme:

- Rendering contracts: PHP render tests, snapshot-like assertions only when stable, or DOM assertions.
- Responsive/visual changes: visual regression or screenshot checks when layout risk is material.
- Accessibility-sensitive changes: keyboard/focus/label/contrast checks using available tools.

Security:

- Permission denied, unauthenticated, wrong role, wrong owner, missing/invalid nonce, malformed input, replay/duplicate request, and redaction tests.

Performance:

- Query bounds, pagination limits, cache hit/miss/invalidation, batch size, idempotency, and no unbounded data loading tests.
- Measurement evidence when automated performance assertions are not stable.

## Existing Test Infrastructure First

Before adding new tooling:

- Inspect `composer.json`, `package.json`, `phpunit.xml*`, `tests/`, `.github/workflows/`, and repo docs.
- Use existing scripts and conventions first.
- Avoid adding a new test framework when the repo already has a workable path.
- If no test infrastructure exists and the change is low risk, run syntax/static/runtime validation and state that no automated test harness exists.
- If no test infrastructure exists and the change is high risk, propose or add the smallest maintainable harness that fits the repo, unless that would exceed the task scope.

## PR And Change Checklist

For every implementation PR/change, confirm:

- What behavior changed?
- What could regress?
- Which existing tests cover it, if any?
- Which new or updated tests were added?
- Which negative/failure scenarios are covered?
- Which validation command proves the changed surface?
- If no tests were added, why is that acceptable?

PR bodies should include a concise "Tests" or "Validation" section with actual commands run and any test coverage gaps.

## Missing Test Coverage Review

When reviewing code, flag missing tests as a finding when a plausible regression has user, security, data, scale, editor, or release impact.

Severity guidance:

- P1: Missing tests around security authorization, payment/order/account behavior, migrations, custom table data integrity, destructive actions, or high-risk production bug fixes.
- P2: Missing tests around normal behavior changes, REST/admin/editor contracts, cache invalidation, async jobs, block rendering, or performance-sensitive query changes.
- P3: Missing tests around low-risk edge cases, cleanup, or documentation of existing untested debt.

Do not report "missing tests" generically. Name the exact untested scenario and why it matters.

Finding template:

```text
[P2] Missing regression test for denied REST access
File: /abs/path/src/Rest/ReportsController.php:88
Impact: Future changes could re-open report data to users without the required capability.
Untested scenario: subscriber requests GET /wp-json/example/v1/reports/{id} for another user's report.
Expected coverage: REST permission test for unauthenticated, subscriber/wrong-owner, and authorized admin paths.
```

## Avoid Bad Tests

- Do not pin private implementation details when a public behavior test is better.
- Do not add snapshots for unstable markup unless that is the project convention and the output is intentionally contractual.
- Do not mock WordPress so heavily that the tested behavior no longer resembles production.
- Do not add tests for abandoned intermediate shapes of unreleased features; test the intended final contract.
- Do not chase coverage percentage while leaving security, migration, cache, and permission risks untested.
- Do not mark work complete because tests were added if the relevant behavior was not actually asserted.

## Completion Standard

Before saying work is done:

- Tests were added/updated when the test need gate says they are required.
- Existing relevant tests were run.
- New tests fail for the old bug or unprotected path when feasible.
- Untested risks are explicitly named.
- If tests are not feasible, the best available validation was run and the reason is documented.
