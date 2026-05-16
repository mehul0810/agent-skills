# Duplicate Code, Modularity, And Maintainability Review

Use this for reviewing and refactoring duplicate code, repeated WordPress hook handlers, repeated REST/AJAX logic, copy-pasted admin UI, duplicated queries, repeated provider clients, brittle tests, excessive conditionals, overgrown classes, and opportunities to improve simplicity, reliability, testability, and maintainability.

## Current Official Anchors

- WordPress PHP coding standards: https://developer.wordpress.org/coding-standards/wordpress-coding-standards/php/
- WordPress PHPUnit testing: https://make.wordpress.org/core/handbook/testing/automated-testing/phpunit/
- Writing WordPress PHPUnit tests: https://make.wordpress.org/core/handbook/testing/automated-testing/writing-phpunit-tests/
- PHP Mess Detector rules: https://phpmd.org/rules/index.html
- PHP Copy/Paste Detector: https://phpqa.io/projects/phpcpd.html
- jscpd duplicate detector: https://jscpd.dev/
- ESLint rules reference: https://eslint.org/docs/latest/rules/

## Review Goal

Find duplication that creates real maintenance risk, then propose the smallest modular change that improves reliability and test coverage without adding unnecessary abstraction.

Duplicate code is worth acting on when it causes or is likely to cause:

- Divergent bug fixes across similar branches.
- Repeated security, capability, nonce, validation, or escaping logic.
- Repeated SQL/query/cache logic that can drift across call sites.
- Repeated REST/AJAX/webhook/provider request patterns with inconsistent errors, timeouts, auth, or retries.
- Repeated admin/editor UI state handling, notices, form validation, or settings sanitization.
- Tests that duplicate implementation details instead of protecting behavior.
- Large classes/functions where hidden responsibilities block safe changes.

Do not refactor just because code looks similar. Keep intentional duplication when abstraction would hide domain differences, increase coupling, or make the next change harder.

## Discovery Workflow

1. Start from changed files or the feature surface, not the entire repo by default.
2. Search for repeated names, strings, hooks, route namespaces, option keys, SQL fragments, capabilities, nonces, validation callbacks, and provider endpoints.
3. Compare similar blocks by responsibility: input validation, authorization, persistence, rendering, remote request, response normalization, cache invalidation, or UI state.
4. Identify the real variation points before extracting shared code.
5. Decide whether to extract, parameterize, compose, leave duplicated, or delete dead code.
6. Add or improve tests around behavior before broad refactors when risk is non-trivial.
7. Validate with the smallest meaningful command first, then deeper test/lint gates.

Useful commands:

```bash
rg -n "register_rest_route|wp_ajax_|admin_post_|current_user_can|check_ajax_referer|check_admin_referer|wp_remote_|update_option|get_option|WP_Query|wpdb->prepare" .
rg -n "TODO|FIXME|copy|copied|duplicate|legacy|compat|deprecated" .
```

## WordPress Duplication Hotspots

Prioritize these patterns:

- Capability/nonce checks copied with small differences.
- REST controllers and AJAX handlers doing the same mutation separately.
- Settings sanitization duplicated between PHP forms and REST saves.
- Option/meta schema reads duplicated across admin, cron, REST, and frontend paths.
- Custom SQL copied between reports, exports, list tables, and API endpoints.
- Cache keys/invalidation repeated without one owner.
- Asset enqueue conditions copied across admin/editor/frontend without one registry.
- Block attribute defaults duplicated in `block.json`, PHP render callbacks, and editor JS.
- Remote API clients copied per endpoint instead of using one provider adapter.
- Error-message formatting, logging, and redaction duplicated inconsistently.
- Tests copy-pasting setup without factories/builders, creating brittle fixture drift.

## Refactoring Decision Rules

Extract when:

- The duplicate blocks enforce the same security, validation, persistence, cache, provider, or formatting contract.
- A bug fix must be applied to multiple places.
- A behavior deserves one testable owner.
- The same API or schema is used by admin, REST, cron, CLI, and frontend surfaces.

Do not extract when:

- The only similarity is syntax, not responsibility.
- Future changes are likely to diverge by product requirement.
- The abstraction would require flags such as `$is_admin`, `$is_rest`, `$legacy_mode`, and `$special_case` everywhere.
- The duplicate exists only inside unreleased draft work that should be deleted or rewritten before launch.
- The change would broaden scope beyond the user's requested fix without reducing active risk.

## Preferred Modular Shapes

- Service class for business decisions independent from WordPress globals.
- Repository/gateway for option/meta/custom-table persistence.
- REST controller for HTTP schema/permissions; service for mutation logic.
- Provider client/adapter for third-party API auth, request, retry, and normalization.
- Validator/sanitizer for shared input contracts.
- View model/DTO for admin/editor/frontend display data.
- Factory/test builder for repeated test data setup.
- Small utility only when the behavior is truly generic and has a clear name.

Avoid catch-all `Helper`, `Utils`, `Manager`, or `Common` classes unless the repo already has that convention and the responsibility remains narrow.

## Testing Strategy

Use refactoring to make better tests possible:

- Add characterization tests before risky refactors when current behavior must be preserved.
- Add regression tests for duplicate bug-fix surfaces so future drift is caught.
- Unit-test extracted pure services, validators, normalizers, DTO mappers, and provider response handlers.
- Integration-test WordPress hooks, REST permissions, settings saves, migrations, custom tables, and cron/queue behavior.
- Add negative permission tests for every extracted mutation path.
- Use factories/builders for repeated fixtures instead of copy-pasted arrays and posts.
- Avoid brittle snapshots unless the exact markup or payload is the contract.
- For JS/React, test behavior and accessibility states rather than component internals.

A good refactor usually reduces test setup duplication and increases confidence in the behavior contract.

## Tooling Guidance

Use existing project scripts first. If the repo has no duplication tooling, recommend rather than blindly install.

PHP:

- PHPCS/WPCS/VIPCS for WordPress standards and many security/escaping patterns.
- PHPStan/Psalm for type and contract drift.
- PHPMD for code-size/complexity signals such as excessive method/class length and complexity.
- Copy/paste detectors such as PHPCPD or jscpd can help find candidates, but review results manually before refactoring.

JavaScript/TypeScript:

- ESLint complexity, duplicate cases/keys/imports, max-depth, max-lines-per-function, and project-specific rules.
- TypeScript for shared contracts and typed DTOs.
- Jest/Vitest/Testing Library/Playwright according to project conventions.
- jscpd can scan mixed PHP/JS/CSS repositories when configured carefully.

CI:

- Do not fail CI on low-signal duplication thresholds initially in a legacy codebase.
- Start with reporting or changed-file thresholds, then ratchet only after the team agrees.
- Exclude `vendor`, `node_modules`, build output, snapshots, generated files, translations, minified assets, fixtures, and WordPress core copies.

## Review Output Format

For each finding, include:

```text
[P2] Duplicated REST and AJAX save paths can drift on capability checks
Files: /abs/path/src/Rest/SettingsController.php:88 and /abs/path/src/Admin/Ajax.php:54
Impact: The same setting mutation is authorized and validated in two places, so future fixes may secure one path and leave the other vulnerable.
Fix: Extract a SettingsService::save_from_request() style method that receives validated input, keep REST/AJAX wrappers thin, and add one permission-negative test per entry point plus service tests for validation.
```

## Review Checklist

- Did the review search for repeated hooks, routes, settings, queries, provider calls, cache keys, and UI state, not just identical text?
- Is the recommended extraction tied to one clear responsibility?
- Would the abstraction reduce risk, or would it create a generic helper with hidden coupling?
- Are unreleased draft duplicates deleted or rewritten instead of over-abstracted?
- Are launched/public contracts and real data protected where compatibility matters?
- Are tests improved at the behavioral contract level, not just updated to match refactored internals?
- Does the final change become simpler for the next developer to understand?
