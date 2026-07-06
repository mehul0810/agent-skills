# WordPress Live Proof Gate

Use this reference before claiming a WordPress plugin/theme change is done. Pick the cheapest proof that reaches the changed runtime boundary. Do not over-test exact user-fed CSS values when the user said they will visually review; confirm those by diff and state no browser claim.

## Proof Levels

| Level | Use for | Evidence |
| --- | --- | --- |
| Diff proof | Exact copy/CSS/config value provided by user | Git diff and file path |
| Static proof | Syntax, standards, build-only, docs-only | `php -l`, PHPCS, ESLint, build, docs checks |
| Runtime proof | PHP hooks, REST, WP-CLI, admin behavior | WP-CLI, unit/integration tests, local request |
| Editor proof | block editor, Site Editor, FSE, patterns, templates | editor load/save/render check, screenshot when visual |
| Frontend proof | layout, forms, conversion, UX, theme output | browser/screenshot/state check, accessibility basics |
| External proof | payment/API/webhook/email/provider | real safe credential/account or explicit waiver |
| Release proof | packaged artifact, wp.org/SVN, deploy | artifact inspection, production deps, tag/SVN checks |

## Release Candidate Visual Proof

Before beta/production readiness for any release that touches admin UI, frontend UI, consent screens, setup flows, editor surfaces, or other visual output, test the release-candidate package/ZIP or release branch build, not only a dev checkout. Use focused screenshots or Playwright/browser evidence from the packaged artifact.

Prefer disposable localhost `wp-proof` environments for routine release readiness, browser/admin smoke, screenshots, package validation, and golden workflow proof when they are available. Use long-lived Studio environments when parity, existing local data, custom domain URLs, integration reproduction, or owner manual/visual review is the reason.

Cover changed UI plus critical existing UI workflows at desktop and narrow/mobile/admin-constrained widths when relevant. If automation is unavailable, require manual screenshot evidence or state an explicit proof gap in the release brief.

Keep this pragmatic: use a compact product-specific matrix and focused screenshots. Do not build a broad exhaustive browser suite unless the release risk justifies it.

## Golden Workflow Regression Matrix

Each product should define a small golden workflow regression matrix for critical existing behavior that must be smoke-tested before beta/production approval. Start with product-specific versions of:

- Activation/deactivation and upgrade path.
- Admin navigation and primary screen load.
- Settings save and validation failure path.
- Connect/reconnect, permissions, consent approval, or OAuth-like setup.
- Diagnostics, logs, health checks, and support information.
- Public rendering, block/editor output, shortcode output, or core visitor flow.
- Product-specific money path, security-sensitive path, or integration core flow.

Release-ready proof should say which matrix items passed, failed, or were skipped, the package/build used, the exact environment, and whether any skipped proof is acceptable for release.

## Plugin Proof

For plugin changes, verify the closest affected boundary:

- Activation/deactivation: plugin activates cleanly; uninstall/deactivation behavior is safe when touched.
- REST/admin action: capability checks, nonce/CSRF posture, permission callback, validation/sanitization, response shape, failure path.
- Settings/admin UI: screen loads only for authorized users, saves correctly, displays escaped output, and handles invalid input.
- Cron/background jobs: idempotent, bounded, retry-safe, no secrets/PII in args/logs.
- Database/custom tables: migration path, index use, concurrency/rollback plan, multisite behavior if applicable.
- Build/package: production artifact excludes dev-only Composer/npm packages and includes required runtime vendor/build files.
- Public contract: launched hooks, filters, REST schema, block attributes, shortcodes, and WP-CLI behavior remain compatible unless explicitly changed.

Useful commands when present:

```bash
composer test
composer run lint
npm test
npm run lint
npm run build
wp plugin activate <plugin-slug>
wp eval 'echo rest_url();'
wp option get <option-name>
```

## Theme And FSE Proof

For theme/block work, validate editor and frontend parity when behavior or visuals changed:

- `theme.json` parses and maps design tokens intentionally.
- Templates, parts, patterns, block styles, variations, and bindings remain editable.
- Page/post-owned visible content is editable from the intended admin surface; if Pages > Edit should control the page, the relevant template renders Post Content and page-specific sections are not hard-coded only in template/pattern files.
- Avoid Custom HTML/Shortcode blocks for design implementation unless explicitly required.
- Custom blocks are created only when core blocks, patterns, styles, variations, or bindings cannot meet the design/editability requirement.
- Editor canvas and frontend output preserve responsive behavior, accessibility, and premium/enterprise polish.
- SEO-sensitive templates preserve headings, canonicals, breadcrumbs, schema, and content hierarchy when touched.

Useful commands/checks when present:

```bash
npm run build
wp theme list
wp theme activate <theme-slug>
wp eval 'echo wp_get_theme()->get("Name");'
wp post list --post_type=wp_template --fields=ID,post_name,post_status
```

## Local HTTPS And Browser Constraints

If the in-app browser blocks a local HTTPS WordPress domain, use terminal probes and certificate-tolerant browser runners before declaring blocked. Follow `wp-expert/references/local-https-testing.md` when needed.

Acceptable fallback evidence:

- `curl -k -I https://local-domain.test` for server reachability.
- WP-CLI probes for WordPress state.
- Browser runner with certificate errors ignored for local-only domains.
- Screenshot from an available real browser if visual proof is required.

## Design-Visible Issue Screenshot Rule

When creating a GitHub issue for a design-visible problem, attach or link the current-state screenshot that shows the problem. This applies to admin UI, editor UI, frontend UI, styling, layout, UX, screenshots/assets, banners/icons, onboarding screens, and other visible output. If screenshot capture is blocked, put the exact blocker and closest safe evidence in the issue body instead of creating a screenshot-free design issue.

## Design-Visible PR Screenshot Rule

If a PR changes admin, editor, frontend, style, layout, UX, or other design-visible output, include screenshot evidence in the PR body or linked artifacts. If screenshots cannot be captured, state the exact blocker and the closest available proof.

## External Integrations

For third-party APIs, use official docs plus a safe live credential/account when available. Mocks and unit tests prove code shape but do not prove provider behavior. If credentials are unavailable, finish local code/tests/review, then ask for the exact credential, test account, webhook target, or explicit proof waiver.

Do not print secrets, tokens, private salts, customer PII, raw webhook payloads, or personal contact/payment data in proof.

## Completion Language

When done, report:

- What was validated.
- Commands or live path used.
- What was not run and why.
- Whether proof covers the final committed code.
- Any explicit owner waiver.

Do not say "done" when validation only proves syntax but the changed behavior is runtime/editor/frontend/external unless you clearly state the remaining proof gap.
