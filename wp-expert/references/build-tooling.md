# Webpack, Composer, And npm Expertise

Use this for WordPress build systems, dependency management, webpack configuration, Composer workflows, npm scripts, package locks, asset manifests, dependency extraction, CI build failures, release packaging, and monorepo build orchestration.

## Official Anchors

- Composer basic usage: https://getcomposer.org/doc/01-basic-usage.md
- Composer scripts: https://getcomposer.org/doc/articles/scripts.md
- Composer autoloader optimization: https://getcomposer.org/doc/articles/autoloader-optimization.md
- npm `ci`: https://docs.npmjs.com/cli/v8/commands/npm-ci/
- webpack concepts: https://webpack.js.org/concepts/
- webpack configuration: https://webpack.js.org/configuration/
- WordPress dependency extraction webpack plugin: https://developer.wordpress.org/block-editor/reference-guides/packages/packages-dependency-extraction-webpack-plugin/

## Version Policy

- When choosing new PHP, Node, npm, Composer, or build-tool minimums, use `runtime-toolchain-version-policy.md`.
- Default to the lowest stable actively maintained non-EOL version that satisfies WordPress, host/VIP, dependency, and deployment constraints.
- Do not copy old CI examples or package `engines` values without checking current official lifecycle docs.
- If the project currently supports an EOL version, flag it as risk and propose a migration plan instead of silently raising the minimum in a patch release.

## Composer In WordPress

- Use `composer install` in CI/deploy when `composer.lock` exists. It installs locked versions for reproducible builds.
- Use `composer update vendor/package` only when intentionally changing dependency versions and reviewing the lockfile diff.
- Treat `composer.lock` as a shared production artifact for applications/plugins with bundled dependencies. Lockfile changes are not incidental.
- Use `composer validate` before deeper debugging.
- Use `composer dump-autoload` after changing autoload config or adding classes when the repo relies on generated autoload files.
- Use optimized autoloaders for production packages when appropriate: `composer install --no-dev --optimize-autoloader`.
- Be cautious with Composer scripts and plugins in production. Composer scripts execute only from the root package; dependency scripts are not executed.
- In WordPress plugin ecosystems, dependency collisions are real. Consider namespacing/scoping bundled vendor libraries for distributed plugins when conflicts are plausible.

## npm In WordPress

- Use `npm ci` in CI when `package-lock.json` exists and must be authoritative.
- `npm ci` requires a lockfile, removes existing `node_modules`, and will fail when the lockfile and `package.json` disagree.
- Use `npm install` when intentionally adding/updating packages and committing the resulting lockfile changes.
- Commit project `.npmrc` when install flags such as `legacy-peer-deps` or `install-links` are required for reproducible `npm ci`.
- Do not commit `node_modules` unless the release policy explicitly requires vendored JS dependencies.
- Prefer existing repo scripts: `npm run build`, `npm run start`, `npm run lint`, `npm run test`, `npm run packages:build`, etc.
- Check stale watcher processes before assuming a branch checkout or install script is triggering builds by itself.

## Webpack In WordPress

- First inspect whether the repo uses raw webpack, `@wordpress/scripts`, a theme framework, Vite, or custom build scripts.
- Webpack core concepts are entry, output, loaders, plugins, mode, and browser compatibility.
- Webpack 5 defaults can bundle simple projects without config, but WordPress projects usually need explicit entries, output paths, externals, and asset metadata.
- Use `mode: production` for optimized release builds and `mode: development` for watch/debug builds.
- Keep entry points aligned to WordPress enqueue boundaries: admin screen, block editor, frontend block, public page, or shared runtime.
- Avoid one global bundle for unrelated admin/frontend behavior.
- Generated files must be either committed or produced by CI/release scripts consistently.

## WordPress Dependency Extraction

For webpack bundles that import WordPress packages:

- Prefer `@wordpress/scripts` or `@wordpress/dependency-extraction-webpack-plugin` when the project uses WordPress packages.
- Dependency extraction externalizes WordPress-provided scripts/modules and generates `.asset.php` files with dependency handles and versions.
- Enqueue bundles by reading the generated asset file; do not manually duplicate dependency arrays when asset files exist.
- Avoid double-registering `DependencyExtractionWebpackPlugin` when extending `@wordpress/scripts` defaults.
- Do not bundle React, ReactDOM, jQuery, lodash, or `@wordpress/*` packages into WordPress admin/editor bundles unless there is a deliberate isolation reason.

## Build Debugging Checklist

- Confirm Node/npm/PHP/Composer versions match CI or project constraints.
- Confirm lockfiles are in sync with manifests.
- Remove stale `node_modules` or `vendor` only when safe and relevant.
- Check `webpack.config.*`, package scripts, `.babelrc`, `tsconfig.json`, PostCSS config, Browserslist, and generated asset paths.
- Verify output directory matches PHP enqueue paths and block metadata.
- Check source maps and minification policy for production and WordPress.org submission.
- Inspect watch scripts and detached processes if files rebuild unexpectedly.
- For monorepos, confirm workspace root, package-specific cwd, path aliases, and release artifact copy/localize steps.

## Release Build Checklist

- Clean checkout builds successfully.
- Composer/npm install commands are deterministic.
- Build artifacts contain expected JS/CSS/PHP asset metadata.
- Dev-only files are excluded from plugin/theme zip.
- WordPress.org submission includes source/build instructions for minified bundles.
- Generated artifact activates and loads assets without relying on source-only paths.
