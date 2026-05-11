# WordPress.org Plugin Guidelines Review

Use this when reviewing a plugin for WordPress.org Plugin Directory submission, resubmission, rejection remediation, block directory eligibility, readme policy, trademark risk, upsell/tracking policy, or repository compliance.

## Official Anchors

- Detailed Plugin Guidelines: https://developer.wordpress.org/plugins/wordpress-org/detailed-plugin-guidelines/
- Block Specific Plugin Guidelines: https://developer.wordpress.org/plugins/wordpress-org/block-specific-plugin-guidelines/
- Plugin developer information: https://wordpress.org/plugins/developers/
- Plugin readme standard: https://developer.wordpress.org/plugins/wordpress-org/how-your-plugin-assets-work/

Guidelines can change. The Detailed Plugin Guidelines page showed a March 11, 2026 last-updated date when this reference was written. Re-check official docs for any real submission/rejection review.

## Review Workflow

1. Identify submission target: Plugin Directory, Block Directory, private marketplace, VIP/internal, or GitHub-only.
2. Inspect packaged artifact, not just source. WordPress.org users receive the submitted directory/SVN version.
3. Map all files included in the package: PHP, JS, CSS, images, libraries, build output, vendor code, readme, assets, tests, source maps.
4. Review guidelines by user impact: licensing, security, privacy/tracking, external services, admin behavior, spam/SEO, trademark, build transparency.
5. Separate hard violations from quality recommendations. Plugin Directory review is policy-driven, not a generic code-style audit.

## High-Risk Guideline Areas

- Licensing: all shipped code, data, images, libraries, and bundled assets must be GPL-compatible.
- Developer responsibility: every file and third-party service/API usage is the plugin developer's responsibility.
- Stable directory version: the WordPress.org-hosted version must be usable and kept current if distributed elsewhere.
- Human-readable code: obfuscated code is not permitted. If build/minification exists, source code and build tools must be included or linked and documented.
- Trialware: included functionality cannot be locked behind payment, quota, or trial expiry. Paid SaaS can be allowed when the service provides real external functionality.
- Tracking/consent: plugins must not contact external servers or collect user data without explicit authorized consent and readme disclosure.
- External executable code: plugins generally must not load executable code from third-party systems unless it is part of a legitimate service pattern.
- Dishonest behavior: no fake reviews, legal-compliance guarantees, misleading unlock messaging, resource abuse, sockpuppeting, keyword manipulation, or guideline loophole exploitation.
- Public credits/links: frontend credits or powered-by links must be opt-in and not required for functionality.
- Admin hijacking: global notices, dashboard widgets, nags, upsells, and ads must be scoped, dismissible, and not disruptive.
- Readme spam: no keyword stuffing, competitor tag abuse, cloaked affiliate links, excessive tags, or bot-written marketing copy.
- Default libraries: use WordPress-bundled libraries instead of shipping duplicate copies of default libraries such as jQuery, PHPMailer, SimplePie, and other core-provided scripts/libraries.
- Release discipline: avoid noisy frequent commits to SVN and increment plugin versions for each release.
- Completeness: submitted plugin must be complete and functional at submission time.
- Trademarks: plugin names, slugs, block names, and branding must not imply ownership/official status for third-party projects.

## Block Directory Review

For block-specific plugins submitted to the Block Directory:

- Must also comply with the overall Detailed Plugin Guidelines.
- Should be a single independent top-level block with minimal supporting code.
- Should have no UX outside the editor: no wp-admin menus/options for a pure Block Directory submission.
- Must include a valid `block.json` with required metadata and script/style entry points.
- Must work independently and seamlessly after install from the editor.
- Should not require payment, account creation, manual external-service connection, or another plugin/theme.
- Block name must be unique, properly namespaced, and not use reserved namespaces such as `core` or `wordpress`.

## Packaging Review

Check the final artifact:

- No `node_modules`, local env files, test fixtures with secrets, CI-only config, or source-only files unless intentionally shipped.
- Vendor dependencies are GPL-compatible and intentionally bundled.
- Minified/built files have corresponding source or public source/build documentation.
- `readme.txt` includes required metadata, service disclosures, privacy notes, external dependencies, and clear setup instructions.
- Plugin headers, text domain, stable tag, version constants, and readme version are consistent.
- Assets in `.wordpress-org/` or plugin assets follow expected naming and licensing.

## Review Output Format

For each issue, include:

- Guideline area and whether it is likely blocking.
- File/path and concrete evidence.
- Why a reviewer or user would care.
- Minimal remediation.
- Whether official docs should be rechecked before submission.

Example:

```text
[P1] Likely Plugin Directory blocker: built JS is minified with no source or build instructions
File: /abs/path/plugin/build/admin.js
Impact: WordPress.org guidelines require human-readable code or public maintained source/build tooling, and reviewers cannot audit this bundle.
Fix: Include source files and documented build commands, or link to public source in readme and ensure the submitted artifact matches that source.
```
