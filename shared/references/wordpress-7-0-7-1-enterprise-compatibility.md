# WordPress 7.0 And 7.1 Enterprise Compatibility

Use when work targets WordPress 7.0/7.1, changes `Tested up to`, adopts an API, or assesses an upgrade. This dated snapshot does not replace live Core verification.

## Evidence State

Checked 2026-08-30 against official WordPress sources and the latest 7.1 developer notes:

- 7.0 production: [7.0 Field Guide](https://make.wordpress.org/core/2026/05/14/wordpress-7-0-field-guide/) and [7.0.3 security release](https://wordpress.org/news/2026/08/wordpress-7-0-3-release/).
- 7.1 production: [7.1 release page](https://make.wordpress.org/core/7-1/) (released 2026-08-19), [7.1 Field Guide](https://make.wordpress.org/core/2026/08/05/wordpress-7-1-field-guide/), and the latest checked [Accessibility Improvements dev note](https://make.wordpress.org/core/2026/08/13/accessibility-improvements-in-wordpress-7-1/).
- Focused notes also cover [iframed editor changes](https://make.wordpress.org/core/2026/08/03/iframed-editor-changes-in-wordpress-7-1/) and [Abilities filtering](https://make.wordpress.org/core/2026/08/05/filtering-registered-abilities-with-wp_get_abilities-in-wordpress-7-1/); the Field Guide indexes responsive and pseudo-state changes.
- Roadmap context only: [Roadmap to 7.1](https://make.wordpress.org/core/2026/06/19/roadmap-to-7-1/).

Recheck official release/security/dev sources and the runtime registry. Classify every relied-on capability as `production`, `release-candidate`, `experimental/deferred`, or `unverified`. Roadmaps, experiments, proposals, tickets, and documentation do not prove shipment.

At this snapshot, 7.1.0 is production and the 7.1.x maintenance line is live. Treat any later patch, security release, Gutenberg-only behavior, or 7.2/trunk change as a separately verified fact.

## WordPress 7.0 Production Baseline

Relevant shipped surfaces include:

- WP AI Client, client-side Abilities, the Connectors screen/API, and provider-agnostic model routing. Treat connector credentials as secrets; require capability checks, consent/data-flow disclosure, quotas, timeouts, redaction, and deterministic non-AI fallbacks.
- Modern admin styling, view transitions, command palette, Font Library, Visual Revisions, navigation overlays, viewport visibility, and broader `contentOnly` editing. Test admin CSS/DOM/spacing and workflows; do not copy Core internals.
- Icon, Headings, and Breadcrumbs blocks; Gallery lightbox/slideshow; video Cover backgrounds; paragraph text columns/indent; dimension presets; block-level custom CSS; button pseudo-state support in `theme.json`. Prefer native author controls, but verify the exact registered block/support at runtime.
- Pattern Overrides for custom blocks and wider `contentOnly` use. Mark content attributes with `role: "content"` where required; prove List View discoverability and non-technical editing.
- PHP-only block registration with `autoRegister`, generated DataForm controls, Interactivity API `watch()`/`data-wp-watch`, DataViews/DataForms, block bindings, plugin-list filters, and Site Editor foundations. Feature-detect and retain older-Core fallbacks.
- Script modules may depend on scripts; HTML5 script theme support was removed; CodeMirror 5-era tooling, Backbone 1.6.1, Requests 2.0.17, PHPMailer 7.0.2, and registration hardening changed compatibility. Audit handles, declarations, snapshots, mail/account flows, and bundled-library assumptions; do not ship replacement Core libraries.
- Core's minimum PHP floor changed to 7.4. This is a compatibility floor, not an enterprise recommendation: new enterprise work still follows the active-runtime policy and must not select an EOL PHP version merely because Core accepts it.

Production operations must target the latest patched 7.0.x, not 7.0.0. WordPress 7.0.3 is a security release and official guidance says to update immediately. Do not reproduce exploit details in public product issues; use sanitized hardening language and private disclosure paths.

## WordPress 7.1 Production Baseline

WordPress 7.1.0 shipped on 2026-08-19. Test the current patched 7.1.x package in the supported matrix. Keep RC/trunk/Gutenberg-only behavior separate; notes never prove an API is registered in the candidate runtime.

- Client-side media processing, related REST changes, and Media Library infinite scrolling with a user opt-out. Test dimension/size validation, multiple sizes, large/offline/unsupported uploads, quotas, permissions, memory, and server fallback. Verify the `media_library_infinite_scrolling` user option/filter and document a safe fallback before release.
- Accessible Core tooltips plus admin semantics, focus, contrast, pointer, setup, forced-colors, and list-table improvements. Use supported tooltips, `speak()`, labels, and keyboard behavior; never substitute `title` or hover-only affordances. Check decorative-image/Cover-provider states, Breadcrumb separators, Accordion keys, duplicate IDs, and front-end password/RSS/comment behavior where touched.
- Abilities API filtering, execution hooks, public exposure, and JSON Schema. In 7.1, category/namespace/meta filters and `wp_get_abilities_item_include`/`wp_get_abilities_result` shape discovery/results (AND semantics); filtering is not authorization. Preserve `permission_callback`, least privilege, strict coercion, schemas, auditability, rate limits, and failure isolation. Use the REST view only for explicitly public abilities and `WP_Abilities_Registry::get_all_registered()` for the raw registry.
- Responsive Global Styles and configurable viewports, pseudo/custom style states, text shadow, background gradients, and minimum-width support. Prefer `theme.json`/block support over CSS patches, while proving cascade, saved markup, editor/frontend parity, mobile behavior, accessibility, and rollback across supported Core versions.
- SVG Icon API registration/rendering. Validate SVG allowlists, namespaces, provenance, accessible names/decorative state, collisions, and graceful fallback; never render arbitrary unsanitized SVG.
- DataViews, DataForm, and View Config; persistent admin-bar/toolbar behavior during client-side navigation; and Design System theming. Use public stable APIs, avoid internal contracts, and test cleanup, permissions, loading/empty/error states, admin color schemes, and Site Editor screen filtering.
- Block supports include background gradients and minimum width, with an editable Custom HTML preview and `disableContentOnlyForTemplateParts`. Verify registered supports, content-only ownership, saved markup, and editor/frontend parity; this is not a page-building shortcut.
- [Always-iframed post editor](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-api-versions/), including legacy meta boxes. Use Block API v3, supported iframe assets, `ownerDocument`/`defaultView` (not global `document`/`window`), and `useRefEffect` cleanup. Test canvas DOM/CSS, save/reopen, frontend parity, document-panel controls, and classic-editor meta-box isolation; suppress incompatible boxes.
- [Unicode email support](https://make.wordpress.org/core/2026/06/10/call-for-testing-unicode-email-addresses/) on `utf8mb4` sites changes `is_email()`/`sanitize_email()` and adds `WP_Email_Address`. Test normalization/confusables, uniqueness, delivery, imports/exports, authentication/recovery, multisite, charset, and ASCII-dependent services. Do not silently disable Core behavior; gate any fallback.
- jQuery UI 1.14.2 and focused hook/return/markup changes. Audit the actual loaded version, deprecated behaviors, bundled-library assumptions, snapshots, and third-party integrations; do not vendor a replacement.

### API and behavior migrations

- Replace `__experimentalCloneSanitizedBlock`/`__experimentalSanitizeBlockAttributes` with stable APIs; deprecations are migration work. `@wordpress/nux` is a no-op compatibility package (migrate to `Guide`); migrate deprecated `@wordpress/reusable-blocks` calls to core entity methods.
- Check persistent admin-bar extensions across editor, Site Editor, frontend, and client navigation. Re-test `notify_post_author`, Query Loop exclude-current, `get_file_data()` `<?` headers, non-integer REST attachment metadata, `WP_Theme::get_post_templates()` performance, and `WP_Theme_JSON::to_ruleset()` coercion when used.
- Keep the AI execute-ability guard, multisite SSL signup, privacy cleanup cron, and pseudo-state fixes in the matrix when relevant; record a fallback or `Not applicable - reason` rather than assuming unchanged behavior.

Runtime block discovery remains mandatory. Playlist and Tabs appeared in official testing; a roadmap also proposed Table of Contents. Never assume any is registered in the installed candidate merely from those posts. Query the live block registry and provide a Core/plugin/custom-block fallback based on the product's supported-version contract.

Editable nested blocks inside Custom HTML do not override this skill pack's architecture rule: do not use Custom HTML as a page-building shortcut when native blocks, patterns, styles, bindings, or a properly owned custom block fit. For new block-editor functionality, use document or relevant block panels; classic-editor meta boxes remain classic-only and should be suppressed in the block editor.

## Explicit Non-Features And Drift Guards

The 7.1 Field Guide states that React 19, real-time collaboration, and the proposed On This Day widget did not ship in 7.1; the Classic block remains available. Broader merge proposals may have contributed foundations without shipping their full product surface. Do not:

- code against experimental Tabs internals or other private stores;
- claim a roadmap item, Gutenberg-only experiment, or merge proposal is Core behavior;
- raise `Requires at least` or remove older-version fallbacks solely to use an RC feature without an approved compatibility decision;
- update `Tested up to: 7.1` without executing the product's compatibility matrix on the current patched 7.1.x package; keep the exact package/version in the release evidence.

## Enterprise Upgrade And Release Gate

For each affected plugin/theme/site, record:

1. Exact WordPress build/package and date; PHP/database/browser/multisite mode; theme; Gutenberg state; cache and relevant plugins.
2. API/block/support inventory with feature-detection and older-Core fallback decisions.
3. Install/activate/update/deactivate/uninstall, admin navigation/settings, editor save/reopen, frontend render, REST/cron/CLI, roles/capabilities, i18n/RTL, multisite, accessibility, and rollback evidence as applicable.
4. Targeted regressions for iframe boundaries, Global Styles precedence, responsive/pseudo states, media failures, icons/SVG, Abilities/AI privacy, DataViews lifecycle, and bundled-library changes.
5. Packaged artifact proof, current local validation, browser screenshots for changed UI, performance/query/asset comparison, security/privacy review, and explicit proof gaps.
6. Metadata agreement across plugin/theme headers, `readme.txt`, changelog/release notes, package, docs, and WordPress.org assets. Use `Tested up to: 7.1` only after current patched 7.1.x proof; do not imply that an RC, trunk, or Gutenberg-only behavior is production support.

Compatibility completion means no unexplained deprecations/notices, no editor/frontend divergence, no lost author editability, no capability/privacy regression, no material performance regression, and a tested rollback. If evidence is incomplete, report the exact gap instead of declaring compatibility.
