# WordPress.org Release Operations

Use this for WordPress.org Plugin Directory releases, SVN deploy workflows, GitHub Actions release automation, plugin ZIP generation, `.wordpress-org` assets, production `vendor/`, Plugin Check automation, and post-release verification.

## Core Release Truths

- WordPress.org deployment is SVN-first. The source of truth after deployment is the WordPress.org SVN repository, not the GitHub Actions conclusion alone.
- A GitHub Action can show failure even when the SVN commit completed server-side. Always verify SVN directly before assuming release failure, rerunning destructive steps, retagging, or rolling back.
- Verify all release surfaces: `trunk/`, `tags/<version>/`, and `assets/`.
- WordPress.org users will not run Composer or npm. The deployed plugin artifact must include runtime PHP dependencies and built assets required for the plugin to work.

## SVN Verification Checklist

Before declaring a WordPress.org deployment failed, inspect SVN directly:

```bash
svn ls https://plugins.svn.wordpress.org/<plugin-slug>/trunk/
svn ls https://plugins.svn.wordpress.org/<plugin-slug>/tags/<version>/
svn ls https://plugins.svn.wordpress.org/<plugin-slug>/assets/
svn log -l 5 https://plugins.svn.wordpress.org/<plugin-slug>/
```

For deeper verification, export a clean copy and inspect the runtime artifact:

```bash
svn export https://plugins.svn.wordpress.org/<plugin-slug>/tags/<version>/ /tmp/<plugin-slug>-<version>
```

Confirm:

- `trunk/` contains the expected current release files.
- `tags/<version>/` exists and matches the intended release.
- `assets/` contains expected icons, banners, screenshots, blueprint files, and any other WordPress.org assets.
- The WordPress.org preview page shows the expected assets and readme metadata.

## Production Vendor Rule For WordPress.org

- Production `vendor/` is required when the plugin depends on Composer runtime packages, because WordPress.org users will not run Composer after installing the plugin.
- `composer.json` should keep runtime packages in `require` and dev tools in `require-dev`.
- Build SVN artifacts from a production Composer install, typically `composer install --no-dev --optimize-autoloader` when compatible with the project.
- Verify deployed `vendor/` does not include dev tooling such as PHPUnit, PHPStan, PHPCS, WPCS, stubs, fixtures, or test-only libraries.
- See `../../shared/references/production-dependency-discipline.md` for general Composer/npm production artifact rules.

## First SVN Commit Risk

The first WordPress.org SVN commit for a plugin can be slow and fragile because it may add `trunk/`, `tags/<version>/`, `assets/`, built files, and production `vendor/` all at once.

If the first commit times out after transmitting data:

- Do not assume nothing deployed.
- Verify `trunk/`, `tags/<version>/`, and `assets/` in SVN first.
- If the intended tag already exists and files are correct, rerunning the workflow may be safe and may no-op the deploy step while continuing later release steps.
- Future releases should usually be faster because SVN commits only diffs.

## GitHub Actions And Deploy Workflow Lessons

- `10up/action-wordpress-plugin-deploy` can work for SVN deployment, but treat a timeout or failed job as inconclusive until SVN is checked.
- If a rerun sees `tags/<version>/` already present, the deploy action may no-op and allow subsequent release steps, such as GitHub ZIP upload, to continue.
- `wordpress/plugin-check-action@v1` has been unstable in some runner/Node setups. If it flakes or fails due to environment setup, run Plugin Check explicitly with a pinned Node/runtime path known to work for the project.
- A reliable observed fallback was explicit Plugin Check execution with Node `24.15.0` and `@wordpress/env@11.6.0`. Treat those versions as a project-proven baseline, not a permanent global truth; revalidate when modernizing the workflow.
- Modernize older release workflows when practical. `actions/upload-release-asset@v1` and nested legacy actions can produce deprecation warnings and should be replaced with maintained release/upload patterns.

## Assets Verification

For `.wordpress-org` or SVN `assets/` releases, confirm:

- Icons and banners follow WordPress.org naming expectations.
- Screenshots referenced in `readme.txt` exist and render in preview.
- Blueprint/demo assets deploy to `assets/` when the plugin uses them.
- The WordPress.org preview page displays expected visual assets before announcing release completion.

## Release Completion Criteria

A WordPress.org release is complete only after:

- SVN `trunk/` is correct.
- SVN `tags/<version>/` exists and is correct.
- SVN `assets/` is correct and preview renders expected assets.
- Production `vendor/` contains runtime dependencies only.
- Built JS/CSS/assets needed at runtime are present.
- Plugin Check has run through a reliable path or the failure reason is documented with a lower-confidence fallback.
- GitHub release ZIP, if used, was generated/uploaded from the intended artifact.
- Any workflow deprecation warnings are captured as backlog when they do not block the release.
