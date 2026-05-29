# Enterprise Acceptance Criteria Templates

Use this to define done criteria for enterprise/WPVIP WordPress work before implementation or review. Use alongside the primary technical reference for the task plus `test-coverage-discipline.md`, `validation-commands.md`, and `vip-enterprise-launch-readiness.md`.

## Acceptance Criteria Rules

Good acceptance criteria are:

- User-visible or operationally verifiable.
- Tied to security, performance, accessibility, compatibility, maintainability, or business outcome.
- Specific about roles, states, data shapes, and validation evidence.
- Clear about what is out of scope.
- Matched with test/validation commands where possible.

## Plugin Feature Template

```text
Functional:
Security:
Data/storage:
Performance/cache:
Admin/editor UX:
Compatibility:
Tests:
Validation:
Rollback:
```

Minimum expectations:

- Capability and object ownership checks exist for mutations and private reads.
- Inputs are validated and outputs escaped.
- REST/AJAX/admin/CLI contracts are documented if public.
- Options/custom tables/migrations are versioned when shapes change.
- Tests cover success, permission denied, malformed input, missing/deleted dependency, retry/idempotency, and cache invalidation when relevant.

## Theme Or Block Theme Template

```text
Templates/parts/patterns:
Editor editability:
Frontend fidelity:
Responsive states:
Accessibility:
Performance:
SEO/content preservation:
Visual parity:
Validation:
Rollback:
```

Minimum expectations:

- No Custom HTML or Shortcode blocks for new design sections unless explicitly justified.
- Editor and frontend remain aligned.
- Mobile, tablet, desktop, and wide layouts are checked for changed surfaces.
- Typography, spacing, image crops, and tokens match the style guide or reference.
- Core Web Vitals risks are addressed.

## REST/API Template

```text
Route/endpoint:
Actors and permissions:
Input schema:
Output schema:
Error schema:
Rate/idempotency:
Privacy/redaction:
Tests:
Validation:
Compatibility:
```

Minimum expectations:

- Meaningful `permission_callback`.
- Object ownership checks when IDs are accepted.
- Stable error codes/statuses.
- No secrets or PII in responses.
- Tests cover unauthenticated, unauthorized, malformed, wrong-owner, success, and provider failure cases.

## Migration Template

```text
Source data:
Target data:
Batching:
Resume marker:
Locking:
Rollback/backout:
Dry run:
Observability:
Tests:
Launch plan:
```

Minimum expectations:

- Bounded batches and resume-safe execution.
- No long blocking activation migration on large datasets.
- Backups/restore path known.
- Counts and sample records verified before and after.
- Rollback/backout is explicit even if data rollback is partial.

## Performance Fix Template

```text
Hot path:
Baseline evidence:
Budget:
Fix:
Cache/query behavior:
Validation evidence:
Regression guard:
Remaining risk:
```

Minimum expectations:

- Baseline and candidate measurements or an explicit reason they are unavailable.
- Query count, slow queries, object-cache behavior, remote HTTP, payload size, and frontend metrics checked as relevant.
- Cache invalidation tested for writes.

## Security Fix Template

```text
Asset protected:
Threat actor:
Entry point:
Vulnerability:
Fix:
Negative tests:
Compatibility:
Disclosure/release notes:
```

Minimum expectations:

- Capability/ownership, nonce/CSRF, validation, escaping, SQL/file/redirect/SSRF boundaries checked as relevant.
- Negative tests prove denied access and malformed input behavior.
- No secrets/PII leak in logs, cache keys, client JS, or responses.

## Conversion Page Template

```text
Conversion goal:
Audience:
Primary CTA:
Trust proof:
Friction removed:
Measurement:
Accessibility:
Performance:
SEO:
Validation:
```

Minimum expectations:

- CTA path works on mobile and desktop.
- Form/checkout states include error, success, duplicate submit, and privacy copy.
- Tracking fires once with consent respected.
- Page remains crawlable, fast, accessible, and visually aligned with brand/reference.
