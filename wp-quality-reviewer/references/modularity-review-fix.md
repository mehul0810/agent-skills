# Modularity And Maintainability Review And Fix

Use for duplicate code, poor boundaries, excessive coupling, overgrown classes/functions, global state, unclear ownership, weak comments, dead code, brittle tests, or architecture that makes WordPress changes unsafe.

## Authoritative Anchors

- WordPress Plugin best practices: https://developer.wordpress.org/plugins/plugin-basics/best-practices/
- WordPress PHP Coding Standards: https://developer.wordpress.org/coding-standards/wordpress-coding-standards/php/
- WordPress PHP documentation standards: https://developer.wordpress.org/coding-standards/inline-documentation-standards/php/
- WordPress namespaces and scalable organization: https://developer.wordpress.org/news/2025/09/implementing-namespaces-and-coding-standards-in-wordpress-plugin-development/

Architecture must fit product size. WordPress explicitly notes that small single-purpose plugins gain little from complex class systems, while larger projects benefit from clear classes, files, namespaces, autoloading, and separated assets.

## Review Model

Map the real dependency path:

`WordPress entry point -> adapter/controller -> business decision -> persistence/provider -> output/side effect`

Then assess:

- Single ownership of capability, validation, schema, cache invalidation, data migration, provider, and rendering rules.
- Direction of dependencies and cycles between admin, REST, CLI, cron, blocks, domain, persistence, and infrastructure.
- Cohesion: does a class/module change for one reason, or mix hooks, HTTP, SQL, UI, and business decisions?
- Coupling: globals/singletons/static state, service location, direct construction, cross-module option/meta access, and hidden hook ordering.
- Duplication of behavior contracts, not just similar syntax.
- Public hooks, REST schemas, block attributes, stored data, CLI commands, extension APIs, and launched compatibility.
- Test seams, deterministic inputs/outputs, failure handling, comments, dead/debug code, and onboarding clarity.

Size, complexity scores, and copy/paste detectors are signals, not automatic findings. Prove maintenance risk through divergent behavior, multiple owners, hidden dependency, regression history, or blocked testing.

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
4. Inject unstable boundaries where useful; do not build a container or framework unless the product needs one.
5. Keep hooks/routes/render callbacks thin and named so removal and testing remain possible.
6. Use namespaces/prefixes and project-compatible autoloading. Avoid catch-all `Helper`, `Utils`, `Common`, `Manager`, or “God service” types.
7. Preserve or deliberately version public contracts. Do not add compatibility shims for abandoned unreleased intermediate designs.
8. Delete replaced/dead/debug code. Update concise docs only when the new boundary changes how future contributors must work.

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
