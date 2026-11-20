# WordPress Compatibility: 7.0, 7.1 And 7.2 Testing

Use for Core upgrades, versioned APIs and `Tested up to`.

## Evidence State

Checked 2026-08-30 against official WordPress sources:

- 7.0 production: [7.0 Field Guide](https://make.wordpress.org/core/2026/05/14/wordpress-7-0-field-guide/) and [7.0.3 security release](https://wordpress.org/news/2026/08/wordpress-7-0-3-release/).
- 7.1 production: [release page](https://make.wordpress.org/core/7-1/), [Field Guide](https://make.wordpress.org/core/2026/08/05/wordpress-7-1-field-guide/), and [accessibility note](https://make.wordpress.org/core/2026/08/13/accessibility-improvements-in-wordpress-7-1/).
- Focused notes: [iframed editor](https://make.wordpress.org/core/2026/08/03/iframed-editor-changes-in-wordpress-7-1/) and [Abilities filtering](https://make.wordpress.org/core/2026/08/05/filtering-registered-abilities-with-wp_get_abilities-in-wordpress-7-1/).
- Roadmap context only: [Roadmap to 7.1](https://make.wordpress.org/core/2026/06/19/roadmap-to-7-1/).

Recheck official release/security/dev sources and runtime registry. Classify relied-on capabilities as `production`, `release-candidate`, `experimental/deferred`, or `unverified`; documentation does not prove shipment.

On 2026-11-20 the [release archive](https://wordpress.org/download/releases/) listed **7.1.5** as stable; the [7.2 tracker](https://make.wordpress.org/core/7-2/) recorded **RC2**. The [7.2 Field Guide](https://make.wordpress.org/core/2026/11/20/wordpress-7-2-field-guide/) compares 7.1.4 with RC1. That diff is not today's support matrix. Recheck before publishing claims.

## 7.2 Field Guide

- **[Abilities](https://make.wordpress.org/core/2026/11/19/abilities-api-updates-in-wordpress-7-2/):** During execution Core checks **every** declared `required_capabilities` entry before the permission callback. Reserve the list for requirements common to all inputs. `has_required_capabilities` filters discovery, not object-specific checks or permission-result filters. Keep the enforcing callback on older Core and wherever access depends on the input. Only 7.2 can omit it when a nonempty list fully covers permissions.
- **PHP/REST parity:** `execute()` prepares raw input; direct `check_permissions()` needs `prepare_input()` first. Normalize, validate, sanitize; stop on error (`ability_invalid_input` on sanitization failure). Schema `number` yields floats. Direct PHP returns the callback result; at a custom JSON boundary use `wp_prepare_json_value_for_client()` on success with the output schema. Preserve nested objects as `{}` and lists as `[]`; don't force mixed schemas, fill defaults, or serialize errors as success.
- **[REST](https://make.wordpress.org/core/2026/11/17/rest-api-changes-in-wordpress-7-2/):** Non-revisioned meta is absent from revisions; don't default it on restore. An author's own draft autosave can return the post instead. Comments collection status is an array. `rest_allowed_cors_methods` controls the advertised header, not permissions; an explicit response header wins.
- **Editor/themes:** [State-aware controls](https://make.wordpress.org/core/2026/11/18/api-for-style-state-aware-block-styling-controls/) use `getStyleForState`/`setStyleForState`; InspectorControls `group` is placement, not persistence. Compare base/hover after save/reopen and on the frontend. [Text shadow](https://make.wordpress.org/core/2026/11/11/new-block-support-in-wordpress-7-2-text-shadow/) requires block opt-in (`supports.typography.textShadow`; Paragraph/Heading already opt in), separate from theme presets (`settings.typography.textShadowPresets`). Previously ignored [Navigation Link CSS](https://make.wordpress.org/core/2026/11/18/miscellaneous-editor-changes-in-wordpress-7-2/) now applies through the parent.
- **Assets:** Check public editor menu items under Panels, not the old DOM. For [CSS module collisions](https://make.wordpress.org/core/2026/11/16/update-bundled-wordpress-packages-and-wordpress-build-to-fix-css-module-class-name-collisions/), update and rebuild privately bundled packages; a Core update only fixes Core's copies. Test [admin icons](https://make.wordpress.org/core/2026/11/05/svg-icons-in-the-admin-bar-and-menu-in-wordpress-7-2/) against inline SVG, not Dashicon pseudo-elements.
- **[Interactivity](https://make.wordpress.org/core/2026/11/17/changes-to-the-interactivity-api-in-wordpress-7-2/):** Migrate unique IDs (`data-wp-watch--refresh` to `data-wp-watch---refresh`), not arguments (`data-wp-on--click`). Replace `data-wp-ignore` assumptions and negated function references. Exercise handlers after hydration/navigation. `asDangerousHTML()` marks trust; it doesn't sanitize. Prefer text for untrusted values.
- **[Media](https://make.wordpress.org/core/2026/11/17/media-changes-in-wordpress-7-2/):** Test the grid, Add New and modal alongside the editor. Compare isolated Chromium against server fallback (Firefox or a device reporting 2 GB); Safari HEIC conversion alone doesn't prove WASM ran. Check remote assets, quota and animated GIF/WebP sizes on the actual path. [Browser prerequisites](https://developer.wordpress.org/block-editor/how-to-guides/client-side-media/) are not grounds to weaken site policy.
- **[Site operations](https://make.wordpress.org/core/2026/11/19/miscellaneous-developer-changes-in-wordpress-7-2/):** A `.git` file in the checked path or its ancestors counts as a checkout. Automatic Core/plugin/theme/translation updates normally skip it; inspect Site Health, updater filters and deployment ownership before intervening. Guard `register_site_meta()` by version, multisite and table support (`is_site_meta_supported()`); `show_in_rest` doesn't create a Core sites endpoint.
- **[Application passwords](https://make.wordpress.org/core/2026/11/19/miscellaneous-developer-changes-in-wordpress-7-2/#application-password-data-passed-to-hooks-is-now-unslashed):** Direct create/update method input: **slashed** (use `wp_slash()` on raw values). The 7.2 create/update action arguments: **unslashed**. An audit hook must not call `wp_unslash()` again: it strips literal backslashes. On successful named creation Core normally emails the user. Identify duplicate senders in a mail sink before changing notifications; never log credentials.
- **Other boundaries:** Test [random permalinks](https://make.wordpress.org/core/2026/11/05/your-content-is-going-to-get-more-random/) for collisions and type eligibility (`randomable`). [SQL mode](https://make.wordpress.org/core/2026/10/09/no_backslash_escapes-sql-mode-is-now-turned-off-by-default-in-wordpress-7-2/) changes the connection session, not the server. The [Secrets API was withdrawn](https://make.wordpress.org/core/2026/11/11/the-secrets-api-in-wordpress-7-2/): don't require it or migrate production credentials. Identify beta package/provider before recovery; failed writes or read-only storage never justify clearing, exposing or downgrading secrets. [jQuery Migrate 3.6.0](https://make.wordpress.org/core/2026/11/17/preparing-for-jquery-4-with-wordpress-7-2/) isn't jQuery 4; [React 19](https://developer.wordpress.org/news/2026/11/whats-new-for-developers-november-2026/) is Gutenberg-plugin-only here. Test with Gutenberg off for Core claims.

## WordPress 7.0 Production Baseline

- WP AI Client, client-side Abilities, Connectors, and provider-agnostic routing. Treat credentials as secrets; require capabilities, consent/data-flow disclosure, quotas, timeouts, redaction, and deterministic fallbacks.
- Modern admin styling, transitions, command palette, Font Library, Visual Revisions, navigation overlays, visibility, and broader `contentOnly` editing. Test admin CSS/DOM/workflows; do not copy internals.
- Icon, Headings, and Breadcrumbs blocks; Gallery lightbox/slideshow; video Cover backgrounds; paragraph text columns/indent; dimension presets; block-level custom CSS; button pseudo-state support in `theme.json`. Prefer native author controls, but verify the exact registered block/support at runtime.
- Pattern Overrides and wider `contentOnly` use. Mark attributes `role: "content"` where required; prove List View discoverability and non-technical editing.
- PHP-only `autoRegister`, generated DataForm controls, Interactivity `watch()`/`data-wp-watch`, DataViews/DataForms, bindings, plugin-list filters, and Site Editor foundations. Feature-detect with older-Core fallbacks.
- Script modules may depend on scripts; HTML5 script theme support was removed; bundled libraries and registration hardening changed. Audit handles, declarations, snapshots, mail/account flows, and library assumptions; never replace Core libraries.
- Core's PHP floor is 7.4; choose an actively supported PHP for new work.

Target patched 7.0.x. WordPress 7.0.3 is a security release; disclose sensitive details privately.

## WordPress 7.1 Production Baseline

7.1.0 shipped on 2026-08-19. Test the current patched 7.1.x package; runtime registration, not dev notes, establishes availability.

- Client media processing, REST changes, and opt-out Media Library infinite scrolling. Test sizes, large/offline/unsupported uploads, quotas, permissions, memory, and server fallback. Verify `media_library_infinite_scrolling` and document fallback.
- Accessible tooltips and admin/list-table improvements. Use supported tooltips, `speak()`, labels, and keyboard behavior, never `title`/hover-only substitutes. Check relevant image/Cover states, Breadcrumb separators, Accordion keys, duplicate IDs, and frontend regressions.
- Abilities filtering/hooks/public exposure/JSON Schema. Category/namespace/meta filters and `wp_get_abilities_item_include`/`wp_get_abilities_result` shape results; filtering is not authorization. Use `WP_Abilities_Registry::get_all_registered()` only when raw unfiltered registry state is explicitly required. Preserve permissions, least privilege, coercion, schemas, auditability, rate limits, and isolation. Expose REST abilities only deliberately.
- Responsive Global Styles/viewports, pseudo/custom states, text shadow, gradients, and minimum width. Prefer `theme.json`/block support over CSS patches; prove cascade, saved markup, editor/frontend/mobile parity, accessibility, and rollback.
- SVG Icon API: validate allowlists, namespaces, provenance, accessible/decorative state, collisions, fallback, and sanitization.
- DataViews/DataForm/View Config, persistent toolbar navigation, and Design System theming. Use public APIs; test cleanup, permissions, states, color schemes, and Site Editor filtering.
- Block supports add gradients/minimum width, Custom HTML preview, and `disableContentOnlyForTemplateParts`. Verify registration, ownership, markup, and parity; Custom HTML is not a page-building shortcut.
- [Always-iframed post editor](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-api-versions/), including legacy meta boxes. Use Block API v3, supported iframe assets, `ownerDocument`/`defaultView` (not global `document`/`window`), and `useRefEffect` cleanup. Test canvas DOM/CSS, save/reopen, frontend parity, document-panel controls, and classic-editor meta-box isolation; suppress incompatible boxes.
- [Unicode email support](https://make.wordpress.org/core/2026/06/10/call-for-testing-unicode-email-addresses/) on `utf8mb4` sites changes `is_email()`/`sanitize_email()` and adds `WP_Email_Address`. Test normalization/confusables, uniqueness, delivery, imports/exports, authentication/recovery, multisite, charset, and ASCII-dependent services. Do not silently disable Core behavior; gate any fallback.
- jQuery UI 1.14.2 and hook/return/markup changes: audit loaded version, deprecations, assumptions, snapshots, and integrations; do not replace Core.

### API and behavior migrations

- Replace `__experimentalCloneSanitizedBlock`/`__experimentalSanitizeBlockAttributes` with stable APIs; deprecations are migration work. `@wordpress/nux` is a no-op compatibility package (migrate to `Guide`); migrate deprecated `@wordpress/reusable-blocks` calls to core entity methods.
- Check persistent admin-bar extensions across editor, Site Editor, frontend, and client navigation. Re-test `notify_post_author`, Query Loop exclude-current, `get_file_data()` `<?` headers, non-integer REST attachment metadata, `WP_Theme::get_post_templates()` performance, and `WP_Theme_JSON::to_ruleset()` coercion when used.
- Check the AI execute-ability guard, multisite SSL signup, privacy cleanup cron and pseudo-state fixes when used; record fallbacks or `Not applicable - reason`.

Runtime block discovery remains mandatory. Testing posts (Playlist, Tabs) and the roadmap (Table of Contents) don't establish registration. Query the live registry; choose a supported Core, plugin or custom-block fallback.

Even with editable nested blocks, don't use Custom HTML instead of suitable blocks, patterns, styles or bindings. Use document/block panels for new work; classic-editor meta boxes remain classic-only and should be suppressed in the block editor.

## Explicit Non-Features And Drift Guards

React 19, real-time collaboration, and the proposed On This Day widget did not ship in 7.1; the Classic block remains available. Don't depend on experimental Tabs internals/private stores or equate a proposal or Gutenberg-only experiment with Core. Raising `Requires at least` or removing older-version fallbacks needs an approved compatibility decision, not an RC feature.

## Enterprise Upgrade And Release Gate

For each affected product, record:

1. Exact WordPress build/package and date; PHP/database/browser/multisite mode; theme; Gutenberg state; cache and relevant plugins.
2. API/block/support inventory with feature-detection and older-Core fallback decisions.
3. Install/activate/update/deactivate/uninstall, admin navigation/settings, editor save/reopen, frontend render, REST/cron/CLI, roles/capabilities, i18n/RTL, multisite, accessibility, and rollback evidence as applicable.
4. Targeted regressions for iframe boundaries, Global Styles precedence, responsive/pseudo states, media failures, icons/SVG, Abilities/AI privacy, DataViews lifecycle, and bundled-library changes.
5. Packaged artifact proof, current local validation, browser screenshots for changed UI, performance/query/asset comparison, security/privacy review, and explicit proof gaps.
6. Matching headers, `readme.txt`, changelog/release notes, package, docs and WordPress.org assets. Use `Tested up to: 7.1` only after running the product's compatibility matrix on its package and current patched 7.1.x; RC, trunk or Gutenberg runs don't establish production support.

Require a tested rollback and no unexplained notices/deprecations, editor/frontend divergence, lost editability or capability/privacy/performance regressions. Report untested boundaries.
