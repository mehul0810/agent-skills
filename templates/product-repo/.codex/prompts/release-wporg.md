# /release-wporg

Use `$wp-product-orchestrator` and `$wp-expert` WordPress.org release operations. Release requires explicit target version and publish permission.

1. Confirm clean branch, target version, changelog, readme stable tag, build artifacts, and production-only dependencies.
2. Confirm effective issue/PR queue for the release milestone is empty or explicitly deferred.
3. Run package/build/plugin-check gates documented by the repo.
4. Verify artifact contents: no dev-only Composer/npm packages, runtime vendor/build files included.
5. For wp.org, verify SVN `trunk/`, `tags/<version>/`, and `assets/` directly after deploy.
6. Report tag, release URL, SVN proof, ZIP proof, and post-release closeout state.
