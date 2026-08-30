# Coding Standards, Linting, CI/CD, And GitHub Workflows

Use this for standards, linting, static analysis, tests, GitHub Actions, PR workflows, release pipelines, and CI troubleshooting. Add only one supporting reference for the confirmed risk: session continuity/PR base, test coverage, duplicate code, changelog, tool versions, or delivery planning.

For detailed Actions trigger, matrix, cache, artifact, retention, concurrency, and minute-saving design, route to `../../shared/references/github-actions-economy.md` only when CI/CD topology is the task's primary risk.

## Official Anchors

- WordPress Coding Standards for PHP_CodeSniffer: https://github.com/WordPress/WordPress-Coding-Standards
- WordPress Coding Standards Handbook: https://developer.wordpress.org/coding-standards/
- GitHub Actions workflow syntax: https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax
- WP-CLI commands: https://developer.wordpress.org/cli/commands/
- Block Editor Handbook tooling: https://developer.wordpress.org/block-editor/

## Standards Stack

Choose the stack already used by the repo. If adding standards, do it incrementally.

PHP:

- `php -l` for syntax.
- PHPCS with WordPressCS for WordPress conventions.
- VIPCS/WordPressVIPMinimum for VIP-targeted code.
- PHPStan or Psalm for deeper type/static analysis.
- PHPUnit with WordPress test suite, Brain Monkey, or integration tests depending on architecture.

JavaScript/CSS:

- `@wordpress/scripts` when the project already uses WordPress packages.
- ESLint, Stylelint, Prettier, TypeScript, Jest/Vitest, Playwright/Cypress as project conventions require.
- `node --check` only for plain JS; it is not enough for JSX/TypeScript.

Duplication/modularity:

- Use existing project tooling first; recommend new duplicate/complexity tools only when they add signal.
- Exclude generated files, build output, dependencies, snapshots, translations, and fixtures from duplication checks unless intentionally reviewing them.
- Do not fail legacy CI on broad duplicate-code thresholds before the team has reviewed and ratcheted a baseline.

## PHPCS Strategy

- Run existing Composer scripts first.
- If no scripts exist, inspect `composer.json`, `phpcs.xml`, `phpcs.xml.dist`, and installed standards before proposing commands.
- Fix high-risk WordPress.Security, escaping, nonce, SQL, and capability issues before broad formatting churn.
- Avoid touching unrelated files just to satisfy style in a focused fix.
- For legacy codebases, use a baseline or narrower include path instead of demanding full-repo compliance in one PR.

## Static Analysis Strategy

- Start with changed files or target modules.
- Prefer adding types/phpdoc where they clarify contracts, not to silence tools blindly.
- Treat dynamic WordPress hooks carefully; document array shapes and expected object types.
- Do not refactor public APIs solely for static analysis without BC review.

## Local-First Automation Policy

Make deterministic validation locally executable before adding hosted automation. Each repo should expose one canonical command or small ordered command set for its applicable syntax, lint, static analysis, tests, build, package, Plugin Check, and focused browser/runtime proof.

- Run the canonical local gate before commit, PR, and non-production merge; record commands, relevant tool versions, and results.
- Absence of hosted CI is not permission to skip validation. A failed or unavailable local gate is a proof gap.
- Do not add GitHub Actions that merely repeat reliable local checks on every PR or feature-branch push.
- Keep validation logic in versioned repository scripts or package/composer commands. Hosted workflows call those same entrypoints instead of maintaining a second YAML-only test definition.
- Separate fast changed-boundary checks from the full release gate when that improves developer speed without weakening release proof.

## GitHub Actions Economy

For owner-managed WordPress products, default GitHub Actions to beta/prerelease/stable release mechanisms. The release workflow reruns the canonical full local gate in a clean runner against the exact candidate, builds and validates the package, then permits the separately owner-gated publish/release step.

Use `workflow_dispatch` with explicit candidate SHA/version inputs for owner-initiated beta or production releases by default. A tag/release event may publish only when an owner-approved upstream gate created and verified that exact tag; never let an arbitrary tag push become release authorization.

Do not use `pull_request` or feature-branch `push` triggers for locally reproducible checks by default. Hosted PR/development CI is an exception when it adds evidence local execution cannot reliably provide, such as untrusted external contributions, enforced branch protection, a required operating-system/runtime matrix, secret-backed integration proof, or an independent compliance runner. Document the reason in `AGENTS.md`, `TESTING.md`, or `RELEASE.md`; do not preserve hosted jobs only because they already exist.

For retained workflows:

- Choose active stable tool/action versions using `runtime-toolchain-version-policy.md`.
- Use least-privilege `permissions`; never echo secrets or use `pull_request_target` without a reviewed security model.
- For untrusted PRs, use a read-only token, no secrets, and a disposable GitHub-hosted runner; never execute fork code through `pull_request_target` or a privileged persistent/self-hosted runner.
- Bound matrices to supported combinations, set timeouts, cache by lockfile, reuse the candidate artifact, and avoid duplicate checkout/build jobs.
- Use concurrency carefully for prereleases; never cancel an active production publication merely to save minutes.
- Upload artifacts only when needed for release, proof, rollback, or debugging.

## CI Troubleshooting

- Reproduce locally using the exact failing command and versions when possible.
- Inspect workflow `working-directory`, path filters, cache keys, lockfile presence, generated files, and environment variables.
- Check whether failures are from missing dependencies, PHP extension mismatch, Node version mismatch, DB service readiness, or changed build artifacts.
- For GitHub PR comments, inspect unresolved review threads before replying or marking done.

## GitHub PR Workflow

- Rehydrate repo context at the start of a new chat or resumed task: verify Git root, remote, default branch, current branch, dirty tree, ahead/behind state, workflow docs, active issue/milestone, and release/hotfix/support branches.
- Fetch remote refs before deciding a PR base when network access is available.
- Never create a PR by relying on the GitHub default base. Explicitly choose and pass `--base`; `main`/`trunk` is only correct when evidence says it is the intended target.
- If release, hotfix, support, milestone, or version-scoped branches exist, choose the matching branch as the PR base unless repo docs or the user explicitly say otherwise.
- If the correct PR base is ambiguous and a wrong choice would cause release drift, stop and ask before creating the PR.
- After creating a PR, verify `baseRefName` and `headRefName` before reporting success.
- Check branch status and dirty tree before changes.
- Link the relevant issue, milestone, and labels when the repo uses them.
- Keep commits scoped and messages specific. For implementation tasks, create small focused commits for separately validated units of work when the change naturally splits.
- Stage only intended files. Do not include unrelated local changes, secrets, generated noise, or local environment files.
- Push only when the user explicitly asks, or when repo-local automation policy explicitly authorizes pushing after validation. If no push is authorized, report the branch ahead/behind state instead.
- If the remote has advanced, fetch and use the repo's normal safe sync path before pushing. Do not force-push, amend, or rewrite shared history without explicit approval.
- For review comments, reply to each actionable thread individually when requested.
- Avoid PR bodies with unescaped shell-sensitive backticks when creating PRs through CLI.
- Include summary, scope, validation commands, screenshots for UI, risks, deployment notes, rollback notes, and known gaps in PR descriptions.
- Include what tests were added/updated, what existing tests cover the change, or why new automated tests were not needed.

## Release Workflow

- Build from a clean checkout.
- Run the same canonical full validation entrypoint used locally before packaging; do not reimplement its commands only in workflow YAML.
- Keep validation/package jobs separate from the owner-gated beta/production publish job, and fail closed when candidate identity or validation is stale.
- Install production dependencies only where release policy requires them.
- Exclude tests, dev configs, source maps, local env, node modules, and secrets unless intentionally shipped.
- Confirm plugin/theme headers, versions, asset manifests, translation files, and readme/changelog.
- Generate changelog entries from the real diff/tag/PR range, and fold fixes/improvements for unreleased features into the original added feature entry.
- Verify activation/install from the packaged artifact, not only source checkout.
