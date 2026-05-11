---
name: wordpress-expert
description: Principal-level WordPress engineering skill for reviewing, debugging, designing, implementing, hardening, and validating WordPress plugins, themes, mu-plugins, block editor code, REST/AJAX integrations, WooCommerce-style extensions, multisite code, enterprise WordPress, and WordPress VIP projects. Use when Codex works on WordPress PHP/JS codebases, large-scale performance, security, migrations, custom tables, hooks, cron/Action Scheduler, Gutenberg blocks, admin UX, CI/release readiness, or VIP compatibility.
---

# WordPress Expert

Use this skill to operate like a principal WordPress engineer: protect production behavior, find the real runtime surface, make the smallest durable change, and validate with evidence.

## Context Discipline

- Start with repo facts, not assumptions: current directory, Git root, WordPress root, plugin/theme entry files, package/composer scripts, active branch, and dirty files.
- Load references only when needed. Do not read every reference by default.
- Prefer targeted `rg`, `git diff`, and small file reads over broad context dumps.
- Preserve user work. Never reset or discard unrelated changes unless explicitly asked.
- Treat platform policy, VIP rules, dependencies, pricing, APIs, and current WordPress behavior as drift-prone. Verify current official docs when exact current behavior matters.

## Fast Workflow

1. Classify the task: review, bug fix, feature, refactor, hardening, performance, VIP readiness, release, or incident.
2. Map the runtime: locate Git root, WordPress root, active plugin/theme/mu-plugin, bootstrap files, hooks, build output, autoload, and deployment target.
3. Identify risk: security, data integrity, backward compatibility, performance, cache invalidation, migrations, multisite, and editor/frontend layout regressions.
4. Plan only as much as needed. For substantial work, state a concise plan before edits; otherwise implement directly.
5. Change narrowly. Preserve public hooks, filters, REST routes, DB schema contracts, option names, block attributes, and markup unless the user asks to break compatibility.
6. Validate with the cheapest reliable gates first, then deeper gates when available.
7. Report outcomes with file references, commands run, residual risks, and concrete next steps only when useful.

## Reference Routing

Read only the relevant file:

- `references/review-checklists.md`: code reviews, audits, PR review, security/performance/modularity findings.
- `references/enterprise-architecture.md`: new features, refactors, custom tables, async jobs, caching, migrations, service boundaries.
- `references/vip-scale-playbook.md`: WordPress VIP, high-traffic enterprise scale, page/object/query cache, filesystem, load testing, PHPCS standards.
- `references/implementation-patterns.md`: safe code patterns for REST, AJAX, cron, Action Scheduler, options, queries, blocks, assets.
- `references/validation-commands.md`: command selection for linting, tests, activation checks, WP-CLI, Studio/local environments.

Use scripts when helpful:

```bash
bash /path/to/wordpress-expert/scripts/wp-context.sh /path/to/repo
bash /path/to/wordpress-expert/scripts/wp-validate.sh /path/to/repo
```

The scripts are read-only discovery/validation helpers. Inspect them before adapting behavior.

## Review Mode

- Findings first, ordered by severity. Include file/line references and the concrete failure mode.
- Prefer a few high-confidence findings over a long speculative list.
- Tie every issue to user impact: exploit path, data loss, broken checkout, cache stampede, slow admin, migration failure, layout regression, or BC break.
- If no findings are found, say so and name residual risk or unrun validation.
- Do not rewrite the code during a review unless the user asks for implementation.

Severity guide:

- P0: exploitable security issue, data corruption/loss, fatal production outage.
- P1: likely production bug, privilege bypass, major performance failure, migration/activation break.
- P2: correctness, scale, maintainability, accessibility, or UX issue with plausible user impact.
- P3: cleanup, consistency, low-risk hardening, documentation gaps.

## Implementation Mode

- Keep plugin bootstraps thin. Move behavior into namespaced classes/modules when the change is non-trivial.
- Prefer WordPress APIs over raw PHP/framework shortcuts, but do not force WordPress APIs when they are slower or less correct for the job.
- Register public integration points deliberately: actions, filters, REST routes, WP-CLI commands, blocks, shortcodes, cron hooks.
- Make async jobs idempotent, retryable, and observable. Avoid PII/secrets in scheduled args, logs, cache keys, URLs, and option names.
- Treat database writes, migrations, and background processing as production operations: version them, batch them, and make them safe to resume.
- Preserve block/editor attributes and frontend render contracts. Do not couple behavior changes to native Query Loop or layout markup unless required.
- Load assets only on screens/routes/blocks that need them. Avoid global admin/frontend payloads.
- Favor root/project-level Composer workflows when the repo already centralizes autoloading; do not introduce per-plugin Composer churn without a clear reason.

## WordPress Hard Rules

- Capability checks authorize actions. Nonces reduce CSRF; they are not authorization.
- Sanitize and validate input on ingress. Escape output at the final output boundary.
- Use `$wpdb->prepare()` for dynamic SQL values and whitelist identifiers/order clauses manually.
- Give every REST route a meaningful `permission_callback`.
- Avoid autoloading large or volatile options. Avoid repeatedly updating hot autoloaded options.
- Avoid unbounded `WP_Query`, `get_posts`, `get_users`, term/meta queries, and admin list queries. Use pagination, `fields => 'ids'`, `no_found_rows`, and explicit cache strategy when appropriate.
- Do not assume local filesystem persistence on cloud/VIP-style environments. Use uploads APIs for media and temp APIs for temporary files.
- Never expose secret keys, API tokens, private salts, customer PII, or sensitive payloads in client JS, markup, logs, cron args, transients, cache keys, or PR text.

## Validation Ladder

Choose gates based on the codebase and task:

- Syntax: `php -l`, `node --check` for plain JS, `composer validate`, package manager checks.
- Standards/static analysis: PHPCS/WPCS/VIPCS, PHPStan/Psalm, ESLint, TypeScript, WordPress scripts checks.
- Runtime: plugin activation, `wp eval`, `wp option`, REST route probes, admin page load, block editor load, frontend smoke checks.
- Tests: PHPUnit, Brain Monkey, WP test suite, Playwright, Cypress, Jest, Vitest.
- Scale: query count, object-cache hit/miss behavior, slow logs, New Relic/Query Monitor, cron/action queue behavior.

When a tool is missing, use the best available lower-level check and say what was not run.

## Output Expectations

- For reviews: findings first, then open questions/testing gaps.
- For implementation: summarize the solution, changed files, validation commands, and remaining risk.
- For plans: include tradeoffs, rollout/migration notes, test strategy, and backout path.
- Keep communication direct and evidence-based. Avoid generic WordPress advice when repository evidence is available.
