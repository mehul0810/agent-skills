# Modularity And Maintainability Review And Fix

Use for duplication, weak boundaries/ownership/comments/tests, coupling, global state, dead code, or unsafe WordPress architecture.

## Authoritative Anchors

- Plugin best practices: https://developer.wordpress.org/plugins/plugin-basics/best-practices/
- PHP standards/docs: https://developer.wordpress.org/coding-standards/wordpress-coding-standards/php/ and https://developer.wordpress.org/coding-standards/inline-documentation-standards/php/
- Namespaces/scalable organization: https://developer.wordpress.org/news/2025/09/implementing-namespaces-and-coding-standards-in-wordpress-plugin-development/

Fit architecture to product size: small plugins rarely need complex class systems; larger products need clear boundaries, namespaces, autoloading, and separated assets.

## Review Model

Map the real dependency path:

`WordPress entry point -> adapter/controller -> business decision -> persistence/provider -> output/side effect`

Then assess:

- Single ownership of capability, validation, schema, cache invalidation, data migration, provider, and rendering rules.
- Direction of dependencies and cycles between admin, REST, CLI, cron, blocks, domain, persistence, and infrastructure.
- Cohesion: one change reason versus mixed hooks, HTTP, SQL, UI, and business decisions.
- Coupling: globals/static state, service location, direct construction, cross-module data access, and hidden hook order.
- Duplication of behavior contracts, not just similar syntax.
- Public hooks, REST schemas, block attributes, stored data, CLI commands, extension APIs, and launched compatibility.
- Test seams, deterministic inputs/outputs, failure handling, comments, dead/debug code, and onboarding clarity.

Size/complexity/duplication metrics are signals. Prove risk through divergent behavior, multiple owners, hidden dependencies, regressions, or blocked tests.

## Portable Modularity Contract

Use stricter repo policy; otherwise apply these logical-code budgets, excluding generated, vendored, fixture, and migration files only when inventoried:

| Shape | Review threshold | Hard threshold for new or growing code |
|---|---:|---:|
| Thin WordPress adapter, controller, hook, route, or view boundary | 250 lines/file or 40 lines/method | 500 lines/file or 80 lines/method |
| General application, domain, infrastructure, or UI module | 400 lines/file or 60 lines/method | 800 lines/file or 100 lines/method |

- A review threshold requires a cohesion and extraction decision with evidence; it does not automatically require a split.
- A hard-threshold violation blocks growth without an approved exception. Reject fragments/wrappers/traits/partials that preserve the ownership problem.
- Measure changed files and changed methods. For legacy debt already above a hard threshold, use a no-growth ratchet: the file's logical lines, oversized-method count, and largest changed method must not grow. Put new behavior behind a narrow tested boundary and leave only the minimum compatibility seam or wiring in the legacy file.
- A fix in a 9,000-line legacy file needs no unrelated rewrite, but does need characterization, no-growth evidence, and an issue-backed reduction target when extraction does not fit.

Check dependency direction, not directory names. WordPress entry points, admin/UI, REST, CLI, cron, and block adapters may call application use cases; application code depends on domain policies and ports; infrastructure implements those ports. Domain code must not depend on WordPress globals, UI, HTTP clients, storage adapters, or provider SDKs. Reject cycles, inward layers constructing outward adapters, and callers bypassing a port to reach a database/provider directly.

Every exception records: approving owner, issue or dated reduction target, measured value and allowed budget, affected path/method, rationale and risk, plus either a reduction plan or an explicit no-growth posture. Missing or expired metadata is not an exception.

The product repo owns its executable checker, path inventory/exclusions, language rules, baselines, exceptions, and local/CI commands. This skill owns review policy and evidence. Report current/baseline values, threshold, dependency direction, exception, proof, and `pass`, `fix`, `exception`, or `blocked`.

## Non-Breaking Modularity Checkpoint

Apply this gate to every code change that edits existing behavior, including non-refactors. Inspect changed files and callers/consumers first; do not turn a focused task into repository-wide cleanup.

1. Record the launched/public and real-data contracts touched: hooks/filters and priorities; REST/AJAX routes and schemas; block names, attributes, deprecations, and saved markup; options/meta/custom-table schemas and migrations; WP-CLI commands; template paths; asset handles; CSS/JS selectors/events; and serialized payloads.
2. Capture characterization or consumer proof before moving ownership. After the change, compare defaults, outputs, error semantics, side effects/order, permissions, cache/performance behavior, and each reachable admin, editor, frontend, CLI, or cron path.
3. Keep the public boundary stable while extracting one clear owner behind it. For stored data, prefer additive `expand -> migrate/backfill -> contract` steps with resume and rollback behavior; do not delete or rename a launched field, route, hook, column, option, or saved block attribute in the first migration step.
4. If an intentional public or stored-contract break is necessary, stop the routine refactor and record the target version, deprecation/migration, rollback, and owner/release approval. Otherwise report an explicit compatibility result; passing tests alone is not compatibility proof.

Keep improvements within the changed dependency neighborhood; route unrelated findings through the adjacent-finding protocol. Report contracts, before/after behavior, migration, budget/no-growth, tests, and deferrals.

## Finding Threshold

Refactor when at least one is true:

- The same invariant or bug fix must be maintained in multiple paths.
- A security, validation, persistence, cache, or provider rule lacks one owner.
- A module cannot be tested without booting unrelated WordPress/UI/network state.
- A dependency cycle or global state makes order and failure behavior unpredictable.
- The current shape blocks a known requirement or safe onboarding.

Leave code alone when extraction would:

- Hide meaningful domain differences.
- Add flags/modes to one generic abstraction.
- Create interfaces with one implementation and no boundary benefit.
- Preserve obsolete unreleased code that should be deleted.
- Expand the task without reducing demonstrated risk.

## Remediation Workflow

1. Capture current behavior with characterization tests when compatibility matters.
2. Name the responsibility and owner before moving code.
3. Prefer a narrow shape:
   - Controller/adapter for WordPress or HTTP mechanics.
   - Service/policy for business decisions.
   - Repository/gateway for option, meta, table, filesystem, or provider access.
   - DTO/view model for explicit boundary data.
   - Validator/normalizer for one reusable input contract.
4. Inject unstable boundaries where useful; add no unneeded container/framework.
5. Keep hooks/routes/render callbacks thin and named so removal and testing remain possible.
6. Use namespaces/prefixes and project-compatible autoloading. Avoid catch-all `Helper`, `Utils`, `Common`, `Manager`, or “God service” types.
7. Preserve or deliberately version public contracts. Do not add compatibility shims for abandoned unreleased intermediate designs.
8. Delete replaced/dead/debug code. Update docs when the new boundary changes future work.

## Comment Standard

Comments explain why, invariants, surprising WordPress/platform constraints, security/performance tradeoffs, and extension contracts. They do not narrate obvious syntax or preserve commented-out code. Public functions, hooks, filters, complex arrays, and compatibility behavior follow WordPress documentation standards.

## Proof

Every fixed finding needs:

- Behavior or characterization tests showing the user/public contract remains correct.
- Focused unit tests for extracted policies/validators/mappers and integration tests for WordPress hooks, REST, persistence, migrations, or blocks.
- Static analysis, lint, and architecture/dependency checks already supported by the repo.
- Proof that duplicate owners, cycle, hidden global, or untestable boundary was actually reduced.
- Diff review for accidental public API/schema/hook/data changes.

The stop condition is simpler ownership and safer changeability, not maximum abstraction. If the next developer needs more files, indirection, or configuration to understand an unchanged behavior, the refactor has likely failed.
