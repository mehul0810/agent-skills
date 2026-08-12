# WordPress 7.0 And 7.1 Enterprise Compatibility

Use when work targets WordPress 7.0/7.1, changes `Tested up to`, adopts an API, or assesses an upgrade. This dated snapshot does not replace live Core verification.

## Evidence State

Checked 2026-08-12 against official WordPress sources:

- 7.0 production: [7.0 Field Guide](https://make.wordpress.org/core/2026/05/14/wordpress-7-0-field-guide/) and [7.0.3 security release](https://wordpress.org/news/2026/08/wordpress-7-0-3-release/).
- 7.1 release candidate: [7.1 release page](https://make.wordpress.org/core/7-1/), [7.1 Field Guide](https://make.wordpress.org/core/2026/08/05/wordpress-7-1-field-guide/), and [Help Test 7.1](https://make.wordpress.org/test/2026/07/15/help-test-wordpress-7-1/).
- Roadmap context only: [Roadmap to 7.1](https://make.wordpress.org/core/2026/06/19/roadmap-to-7-1/).

Recheck official release/security/dev sources and the runtime registry. Classify every relied-on capability as `production`, `release-candidate`, `experimental/deferred`, or `unverified`. Roadmaps, experiments, proposals, tickets, and documentation do not prove shipment.

At this snapshot, final 7.1 was scheduled for 2026-08-19; 7.1 RC2 carried applicable 7.0.3 fixes. Candidate number and date remain live facts.

## WordPress 7.0 Production Baseline

Relevant shipped surfaces include:

- WP AI Client, client-side Abilities, the Connectors screen/API, and provider-agnostic model routing. Treat connector credentials as secrets; require capability checks, consent/data-flow disclosure, quotas, timeouts, redaction, and deterministic non-AI fallbacks.
- Modern admin styling, margin-free components, view transitions, command palette, Font Library, Visual Revisions, navigation overlays, viewport visibility, and broader `contentOnly` editing. Test admin CSS/DOM/spacing assumptions and workflows; do not copy Core internals.
- Icon, Headings, and Breadcrumbs blocks; Gallery lightbox/slideshow; video Cover backgrounds; paragraph text columns/indent; dimension presets; block-level custom CSS; button pseudo-state support in `theme.json`. Prefer native author controls, but verify the exact registered block/support at runtime.
- Pattern Overrides for custom blocks and wider `contentOnly` use. Mark content attributes with `role: "content"` where required; prove List View discoverability and non-technical editing.
- PHP-only block registration with `autoRegister`, generated DataForm inspector controls, Interactivity API `watch()`/`data-wp-watch`, DataViews/DataForms additions, block-binding iterations, plugin-list filters, and Site Editor build/routing foundations. Feature-detect and retain fallbacks when supporting older WordPress versions.
- Script modules may depend on scripts; HTML5 script theme support was removed; CodeMirror 5-era tooling, Backbone 1.6.1, Requests 2.0.17, PHPMailer 7.0.2, and registration hardening changed compatibility. Audit handles, theme declarations, snapshots, mail/account flows, and bundled-library assumptions; do not ship replacement Core libraries.
- Core's minimum PHP floor changed to 7.4. This is a compatibility floor, not an enterprise recommendation: new enterprise work still follows the active-runtime policy and must not select an EOL PHP version merely because Core accepts it.

Production operations must target the latest patched 7.0.x, not 7.0.0. WordPress 7.0.3 is a security release and official guidance says to update immediately. Do not reproduce exploit details in public product issues; use sanitized hardening language and private disclosure paths.

## WordPress 7.1 Release-Candidate Baseline

Until the final release is live-verified, test in disposable/staging environments and do not use 7.1 RC on production or mission-critical sites. Important compatibility surfaces in the RC Field Guide include:

- Client-side media processing, related REST changes, and Media Library infinite scrolling with a user opt-out. Test large files, offline/retry behavior, unsupported formats, multisite quotas, permissions, memory, and server fallback.
- Accessible Core tooltips plus admin semantics, focus, contrast, pointer, setup, and list-table improvements. Do not use `title` attributes or hover-only affordances as a replacement.
- Abilities API filtering, execution lifecycle hooks, unified public exposure, and client-compatible JSON Schema. Preserve existing capability checks, least privilege, input/output schemas, auditability, rate limits, and failure isolation.
- Responsive Global Styles and configurable viewports, pseudo/custom style states, text shadow, background gradients, and minimum-width support. Prefer `theme.json`/block support over CSS patches, while proving cascade, saved markup, editor/frontend parity, mobile behavior, and rollback across supported Core versions.
- SVG Icon API registration/rendering. Validate SVG allowlists, namespaces, provenance, accessible names/decorative state, collisions, and graceful fallback; never render arbitrary unsanitized SVG.
- DataViews, DataForm, and View Config extension points; persistent toolbar behavior during client-side navigation; and the WordPress Design System theming foundation. Use public stable APIs only, avoid internal component contracts, and test navigation lifecycle cleanup, permissions, loading/empty/error states, and admin color schemes.
- [Always-iframed post editor](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-api-versions/), including sites with legacy meta boxes. Update blocks to Block API v3, enqueue editor-canvas assets through supported APIs, and remove assumptions that editor content shares the parent admin document. Test both document panel controls and intentional classic-editor meta boxes.
- [Unicode email support](https://make.wordpress.org/core/2026/06/10/call-for-testing-unicode-email-addresses/) on `utf8mb4` sites, including updated `is_email()`/`sanitize_email()` behavior and `WP_Email_Address`. Test normalization/confusables, lookup and uniqueness, mail delivery, imports/exports, authentication/account recovery, multisite, database charset, and every external service that assumes ASCII. Do not silently disable the Core behavior merely because an integration is incompatible; document and gate any temporary fallback.
- jQuery UI 1.14.2 and focused hook/return/markup changes. Audit deprecated behaviors, bundled-library assumptions, snapshots, and third-party integrations.

Runtime block discovery remains mandatory. Playlist and Tabs appeared in official testing; a roadmap also proposed Table of Contents. Never assume any is registered in the installed candidate merely from those posts. Query the live block registry and provide a Core/plugin/custom-block fallback based on the product's supported-version contract.

Editable nested blocks inside Custom HTML do not override this skill pack's architecture rule: do not use Custom HTML as a page-building shortcut when native blocks, patterns, styles, bindings, or a properly owned custom block fit. For new block-editor functionality, use document or relevant block panels; classic-editor meta boxes remain classic-only and should be suppressed in the block editor.

## Explicit Non-Features And Drift Guards

The 7.1 Field Guide states that React 19, real-time collaboration, and the proposed On This Day widget did not ship in 7.1; the Classic block remains available. Broader merge proposals may have contributed foundations without shipping their full product surface. Do not:

- code against experimental Tabs internals or other private stores;
- claim a roadmap item, Gutenberg-only experiment, or merge proposal is Core behavior;
- raise `Requires at least` or remove older-version fallbacks solely to use an RC feature without an approved compatibility decision;
- update `Tested up to: 7.1` without executing the product's compatibility matrix on the current RC/final package.

## Enterprise Upgrade And Release Gate

For each affected plugin/theme/site, record:

1. Exact WordPress build/package and date; PHP/database/browser/multisite mode; theme; Gutenberg state; cache and relevant plugins.
2. API/block/support inventory with feature-detection and older-Core fallback decisions.
3. Install/activate/update/deactivate/uninstall, admin navigation/settings, editor save/reopen, frontend render, REST/cron/CLI, roles/capabilities, i18n/RTL, multisite, accessibility, and rollback evidence as applicable.
4. Targeted regressions for iframe boundaries, Global Styles precedence, responsive/pseudo states, media failures, icons/SVG, Abilities/AI privacy, DataViews lifecycle, and bundled-library changes.
5. Packaged artifact proof, current local validation, browser screenshots for changed UI, performance/query/asset comparison, security/privacy review, and explicit proof gaps.
6. Metadata agreement across plugin/theme headers, `readme.txt`, changelog/release notes, package, docs, and WordPress.org assets. Use `Tested up to: 7.1` only after current candidate/final proof; do not imply that an RC is production support.

Compatibility completion means no unexplained deprecations/notices, no editor/frontend divergence, no lost author editability, no capability/privacy regression, no material performance regression, and a tested rollback. If evidence is incomplete, report the exact gap instead of declaring compatibility.
