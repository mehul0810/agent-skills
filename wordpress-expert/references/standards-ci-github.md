# Coding Standards, Linting, CI/CD, And GitHub Workflows

Use this for standards setup, linting, static analysis, tests, GitHub Actions, PR workflows, release pipelines, and CI troubleshooting. For changelogs and release notes, read `changelog-release-notes.md`. For runtime and tool minimums, also read `runtime-toolchain-version-policy.md`. For issue triage, PR descriptions, labels, estimates, milestones, and enterprise delivery workflow, also read `delivery-excellence.md`.

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

## GitHub Actions Principles

Official GitHub docs define a workflow as YAML in `.github/workflows`. For WordPress repos:

- Choose PHP, Node, npm, Composer, database, and action versions using `runtime-toolchain-version-policy.md`; do not use EOL versions in new workflows.
- Use `pull_request` for validation and `push` for protected branches.
- Use `workflow_dispatch` for manual release/deploy jobs.
- Set least-privilege `permissions`, commonly `contents: read` for CI-only workflows.
- Use `concurrency` to cancel stale branch runs when appropriate.
- Use matrix jobs for PHP/WordPress/Node versions only when the project supports that range.
- Cache Composer/npm dependencies by lockfile hash, not broad paths without keys.
- Upload build artifacts only when needed for release/debug.
- Never echo secrets. Avoid `pull_request_target` unless the security model is fully understood.

## Typical WordPress CI Gates

Minimum useful CI for a plugin/theme:

Verify the current active PHP/Node baselines before copying this example.

```yaml
name: CI
on:
  pull_request:
  push:
    branches: [ main ]
permissions:
  contents: read
concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true
jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: shivammathur/setup-php@v2
        with:
          php-version: '8.4'
          tools: composer
      - uses: actions/setup-node@v4
        with:
          node-version: '24'
          cache: npm
      - run: composer install --no-interaction --prefer-dist
        if: hashFiles('composer.json') != ''
      - run: npm ci
        if: hashFiles('package-lock.json') != ''
      - run: composer lint
        if: hashFiles('composer.json') != ''
      - run: npm run build --if-present
        if: hashFiles('package.json') != ''
      - run: npm test --if-present
        if: hashFiles('package.json') != ''
```

Adapt this to project scripts. Do not paste generic CI if the repo already has a better workflow.

## CI Troubleshooting

- Reproduce locally using the exact failing command and versions when possible.
- Inspect workflow `working-directory`, path filters, cache keys, lockfile presence, generated files, and environment variables.
- Check whether failures are from missing dependencies, PHP extension mismatch, Node version mismatch, DB service readiness, or changed build artifacts.
- For GitHub PR comments, inspect unresolved review threads before replying or marking done.

## GitHub PR Workflow

- Check branch status and dirty tree before changes.
- Link the relevant issue, milestone, and labels when the repo uses them.
- Keep commits scoped and messages specific.
- For review comments, reply to each actionable thread individually when requested.
- Avoid PR bodies with unescaped shell-sensitive backticks when creating PRs through CLI.
- Include summary, scope, validation commands, screenshots for UI, risks, deployment notes, rollback notes, and known gaps in PR descriptions.

## Release Workflow

- Build from a clean checkout.
- Install production dependencies only where release policy requires them.
- Exclude tests, dev configs, source maps, local env, node modules, and secrets unless intentionally shipped.
- Confirm plugin/theme headers, versions, asset manifests, translation files, and readme/changelog.
- Generate changelog entries from the real diff/tag/PR range, and fold fixes/improvements for unreleased features into the original added feature entry.
- Verify activation/install from the packaged artifact, not only source checkout.
