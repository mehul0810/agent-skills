# WordPress Monorepo Engineering

Use this for WordPress monorepos, multi-plugin repositories, shared packages, root Composer/npm workspaces, release artifacts, localized builds, symlinked local development, CI path filtering, and repository structure refactors.

## First Map The Repository

Identify before editing:

- Real Git root versus WordPress root versus plugin/theme package root.
- Package manager model: root Composer, per-package Composer, npm workspaces, pnpm/yarn, custom scripts, or mixed tooling.
- Discoverable WordPress artifacts: plugin headers, theme `style.css`, mu-plugin loaders, generated entry files, block metadata.
- Source versus built output: `src/`, `packages/`, `plugins/`, `themes/`, `dist/`, `build/`, release zips, localized copies, symlinks.
- CI/release entry points: workflows, build scripts, artifact scripts, version bump scripts, changelog, deploy config.
- Local development topology: source checkout location, symlink targets, generated plugin folders, Studio/Local/DDEV/Lando paths.

## Monorepo Design Principles

- Keep source packages non-discoverable by WordPress unless they are intentionally runnable plugins/themes.
- Generate installable plugin/theme artifacts with correct headers, slugs, text domains, versions, and built assets.
- Centralize shared tooling where it reduces drift: PHPCS, PHPStan, PHPUnit bootstrap, ESLint, build tooling, release scripts.
- Avoid coupling unrelated packages through global mutable state or shared options.
- Make package boundaries explicit: namespaces, asset handles, text domains, composer package names, npm package names, and release artifact names.
- Favor deterministic scripts over manual symlink/copy steps.

## WordPress Discovery Risks

Common failure modes:

- Source checkout is accidentally discovered as a plugin because an entry file contains a plugin header.
- Local dev symlink collides with release artifact slug.
- A generated plugin has stale headers, version constants, asset manifests, or text domain.
- WordPress loads both source and generated copies, causing duplicate hooks/classes/functions.
- Build output is ignored locally but required by release, or committed when CI expects to generate it.

Mitigations:

- Keep source entry files headerless when generated packages are the installable artifacts.
- Use dev-only slugs when a generated local package would collide with the source checkout.
- Add doctor scripts that verify headers, symlinks, build output, and WordPress discovery state.
- Validate activation from the generated artifact, not only from source.

## Shared Composer And Autoload

- If root Composer owns dependencies/autoload, avoid adding per-plugin Composer unless package independence requires it.
- Keep PSR-4 prefixes package-specific and unambiguous.
- Be careful with classmaps over broad `plugins/*/src/` paths; confirm package boundaries and generated folders do not duplicate classes.
- Composer lockfile changes are shared-repo changes. Review scope before committing.
- For WordPress.org-style releases, decide whether vendor dependencies are bundled per artifact or installed at deploy time.

## Shared JavaScript Build

- Prefer a root build orchestrator when multiple blocks/plugins share tooling.
- Keep package-specific entry points and asset metadata deterministic.
- Avoid one global frontend/admin bundle for unrelated packages.
- Confirm generated `.asset.php`, block metadata, CSS, and translations land in the installable package.
- For watch scripts, check for stale detached watchers before assuming code self-triggers builds.

## CI/CD In Monorepos

- Use path filters to avoid running every package job on unrelated changes, but keep shared tooling changes broad enough to test affected packages.
- Matrix by package only when the repo can isolate package install/build/test commands.
- Cache dependencies by the correct lockfile and workspace path.
- Build release artifacts in CI from a clean checkout.
- Upload artifacts with package slug/version in the name.
- Validate generated artifacts with smoke activation, header checks, and dependency checks.

## Release Artifacts

A release script should verify:

- Correct plugin/theme header and slug.
- Version constants and metadata match.
- Built PHP/JS/CSS/assets are present.
- Dev files are excluded: tests, source maps if unwanted, local env, node modules, CI configs, fixtures, docs not intended for release.
- Dependencies included or excluded according to release policy.
- Zip root folder name matches install target.
- Artifact installs and activates in a clean WordPress environment.

## Local Development Patterns

Good local-dev scripts should support:

- `build` for deterministic generated packages.
- `watch` for active package development.
- `doctor` to verify symlinks, headers, package discovery, and missing builds.
- `clean` to remove generated local outputs safely.
- Explicit package/profile selection such as `free`, `pro`, `all`, `theme`, or package slug.

Avoid manual cleanup when a repo provides a cleanup command. Manual cleanup tends to miss symlinks or generated entry files.

## Refactor Strategy

When converting a single plugin/theme into a monorepo:

1. Freeze release behavior with tests or validation scripts.
2. Move source without changing runtime behavior.
3. Add deterministic build/localize/package scripts.
4. Make WordPress discover only intended generated artifacts.
5. Update CI to validate source and artifacts.
6. Keep artifact names backward-compatible unless the release plan explicitly changes slugs.

## Review Checklist

- Can WordPress discover only the intended plugins/themes?
- Are source and generated artifacts clearly separated?
- Are package boundaries and namespaces collision-free?
- Does CI test affected packages and shared tooling changes?
- Can a clean checkout build the release artifact?
- Does the packaged artifact activate without repo-only files?
- Are symlink/watch/clean scripts safe and deterministic?
