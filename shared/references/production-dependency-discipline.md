# Production Dependency Discipline

Use this when reviewing, building, packaging, deploying, or contributing WordPress code that uses Composer, npm, Node, webpack, build tooling, CI artifacts, release ZIPs, or production deployment branches.

## Core Rule

Before adding a runtime dependency, test the hardest acceptance case against an existing repo component or supported platform API. If it works, reuse it; if it doesn't, name the missing behavior and add only what supplies it. For example, a native date control can collect one date, but it doesn't enforce a booking blackout on the server. Keep authorization, validation, accessibility and fallback behavior either way. Fewer lines or packages alone aren't success.

Never ship development-only packages to production. Development dependencies can exist in source manifests, lockfiles, local environments, and CI build stages, but they must not be installed, bundled, committed as runtime code, or included in the production artifact unless the target platform explicitly requires them at runtime.

## Composer Rules

- Treat `require` as runtime and `require-dev` as development-only. Do not rely on `require-dev` packages in production code paths.
- Build production PHP artifacts with `composer install --no-dev` when Composer dependencies are included in the deployed package.
- For WordPress.org plugins, production `vendor/` is often required because users will not run Composer; include runtime packages from `require`, not dev tooling from `require-dev`.
- Add `--optimize-autoloader` or stricter autoloader flags when the project/platform supports them and the change is validated.
- Do not ship test, lint, static-analysis, scaffold, coding-standard, fixture, or dev-only tool packages in `vendor/`.
- Common dev-only Composer packages include PHPUnit, PHPCS/WPCS/VIPCS, PHPStan/Psalm, Rector, Brain Monkey, Mockery test-only usage, composer-normalize, and installer/checker tools that are not runtime dependencies.
- If a package is needed at runtime, move it to `require` deliberately and explain why it is not dev-only.
- Verify production `vendor/` from a clean install, not from a local directory that previously ran a dev install.

## npm And Node Rules

- Treat `dependencies` as runtime and `devDependencies` as build/test/development-only, unless the package manager or workspace has documented exceptions.
- For WordPress plugins/themes, do not ship `node_modules` in production ZIPs unless the release policy explicitly requires vendored Node runtime dependencies.
- Use npm packages to build assets, then ship the generated JS/CSS/assets needed at runtime; do not ship webpack, Vite, Babel, TypeScript, ESLint, Jest, Playwright, Cypress, Storybook, wp-env, or test tooling as runtime payload.
- For Node services or deployments where `node_modules` is runtime payload, install production dependencies with `npm ci --omit=dev` or prune with `npm prune --omit=dev` after build when appropriate.
- Keep `package-lock.json`, `npm-shrinkwrap.json`, or workspace lockfiles when they are part of reproducible builds; lockfiles may record dev dependencies without meaning dev packages should be installed in production.
- Do not import dev-only packages from runtime JS/PHP entry points, block frontend scripts, admin bundles, REST handlers, CLIs, or server code.

## Artifact Review Checklist

- Fresh production install was used: Composer with `--no-dev`; npm with omitted dev packages when `node_modules` is deployed.
- Runtime artifact excludes `tests/`, fixtures, coverage, `.phpunit*`, `phpstan*`, `psalm*`, `phpcs*`, Playwright/Cypress reports, Storybook output unless intentionally public, source maps if disallowed, and local env files.
- Built assets, Composer autoload files, dependency-extraction `.asset.php` files, and manifests required at runtime are present.
- CI separates build/test stages from package/deploy stages so dev tools are available for validation but absent from the final artifact.
- Release notes or PR summary mention production dependency pruning when the packaging/deploy path changed.

## Review Finding Pattern

Use this when raising an issue:

```text
Finding: Development dependency is included in the production artifact.
Impact: [runtime bloat/security/license/platform conflict/autoload exposure]
Evidence: [file/package/path]
Fix: Build/package from a clean production install and exclude dev-only dependency paths.
Validation: [command or artifact inspection]
```
