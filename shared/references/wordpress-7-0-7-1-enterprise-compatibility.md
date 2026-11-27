# WordPress Compatibility: 7.0, 7.1 And 7.2 Testing

For Core upgrades and `Tested up to`.

## Evidence State

Checked 2026-08-30:

- 7.0 production: [guide](https://make.wordpress.org/core/2026/05/14/wordpress-7-0-field-guide/), [7.0.3 security release](https://wordpress.org/news/2026/08/wordpress-7-0-3-release/).
- 7.1 production: [release](https://make.wordpress.org/core/7-1/), [guide](https://make.wordpress.org/core/2026/08/05/wordpress-7-1-field-guide/), [accessibility](https://make.wordpress.org/core/2026/08/13/accessibility-improvements-in-wordpress-7-1/), [iframed editor](https://make.wordpress.org/core/2026/08/03/iframed-editor-changes-in-wordpress-7-1/), [Abilities filtering](https://make.wordpress.org/core/2026/08/05/filtering-registered-abilities-with-wp_get_abilities-in-wordpress-7-1/).
- [7.1 roadmap](https://make.wordpress.org/core/2026/06/19/roadmap-to-7-1/): context only.

Recheck official releases, advisories and runtime registry. Classify capabilities as `production`, `release-candidate`, `experimental/deferred`, or `unverified`.

Report stable and candidate separately. November 20: **7.1.5 stable / 7.2 RC2**. November 27, 2026: [7.1.5 stable](https://wordpress.org/download/releases/) / [7.2 RC3](https://wordpress.org/news/2026/11/wordpress-7-2-release-candidate-3/) for non-production testing; December 8 scheduled, not shipped. The [Field Guide](https://make.wordpress.org/core/2026/11/20/wordpress-7-2-field-guide/) compares 7.1.4 with RC1.

## 7.2 Field Guide

- **[Abilities](https://make.wordpress.org/core/2026/11/19/abilities-api-updates-in-wordpress-7-2/):** Execution checks **every** `required_capabilities` entry before the permission callback. Declare only input-independent requirements. `has_required_capabilities` filters discovery without callbacks or permission-result filters. Keep enforcing callbacks for older Core and object-specific access; on 7.2 omit only if a nonempty list fully covers authorization.
- **PHP/REST parity:** `execute()` prepares raw input; before direct `check_permissions()`, call `prepare_input()`. Normalize, validate, sanitize; stop on error (`ability_invalid_input` for failed sanitization). Schema `number` yields floats. Keep raw PHP results; at JSON boundaries use `wp_prepare_json_value_for_client()` on success with the output schema. Preserve nested objects `{}`, lists `[]` and mixed schemas; don't invent defaults or serialize errors as success.
- **[REST](https://make.wordpress.org/core/2026/11/17/rest-api-changes-in-wordpress-7-2/):** Compare a revision (non-revisioned meta absent; don't default on restore) with an author's own draft autosave (may return the post instead). In `rest_comment_query`, test array membership; without `edit_posts`, non-default statuses are rejected. Explicit CORS methods headers override `rest_allowed_cors_methods`; neither authorizes requests.
- **Editor/themes:** [State-aware controls](https://make.wordpress.org/core/2026/11/18/api-for-style-state-aware-block-styling-controls/) use `getStyleForState`/`setStyleForState`; InspectorControls `group` is placement, not persistence. Compare base/hover after save/reopen and on the frontend. [Text shadow](https://make.wordpress.org/core/2026/11/11/new-block-support-in-wordpress-7-2-text-shadow/) requires block opt-in (`supports.typography.textShadow`; Paragraph/Heading already opt in), separate from theme presets (`settings.typography.textShadowPresets`). Previously ignored [Navigation Link CSS](https://make.wordpress.org/core/2026/11/18/miscellaneous-editor-changes-in-wordpress-7-2/) now applies through the parent.
- **[Components](https://make.wordpress.org/core/2026/11/10/editor-components-updates-in-wordpress-7-2/):** SCSS Modules replace internal Emotion. Replace generated selectors and ineffective View `css` props with owned classes/styles. If using Emotion, declare dependencies; target each iframe/portal document's head. Check RTL/keyboard. `ResponsiveWrapper` is deprecated, not removed: use CSS `aspect-ratio`. For [module collisions](https://make.wordpress.org/core/2026/11/16/update-bundled-wordpress-packages-and-wordpress-build-to-fix-css-module-class-name-collisions/), rebuild privately bundled packages.
- **[Editor integrations](https://make.wordpress.org/core/2026/11/18/miscellaneous-editor-changes-in-wordpress-7-2/):** On `InspectorControls`, replace removed `__experimentalGroup` with `group`; verify placement. The deprecated `__experimentalImageEditor` stylesheet moved from block-library to block-editor. Find plugin menu items under Panels. For [admin icons](https://make.wordpress.org/core/2026/11/05/svg-icons-in-the-admin-bar-and-menu-in-wordpress-7-2/), target the item's SVG/wrapper; retain older glyph selectors. Custom Dashicons still work.
- **[Interactivity](https://make.wordpress.org/core/2026/11/17/changes-to-the-interactivity-api-in-wordpress-7-2/):** Use three hyphens for unique IDs (`data-wp-watch---refresh`), two for arguments (`data-wp-on--click`). Remove `data-wp-ignore`; replace negated functions with derived state. Test hydration and back/forward using `state.navigating`/`state.initiator`. For `data-wp-html`, `asDangerousHTML()` marks trust; it doesn't sanitize. Prefer text for untrusted values.
- **[Media](https://make.wordpress.org/core/2026/11/17/media-changes-in-wordpress-7-2/):** Exercise grid, Add New, modal and editor. Trace isolated Chromium: REST create/sideload/finalize, not `DOING_AJAX`; original uses `wp_handle_upload_prefilter`, browser sizes use `wp_handle_sideload_prefilter`. Compare classic `async-upload.php` on Firefox or a 2 GB device. Verify offloaded derivatives and animation. At multisite quota, missing sizes may go unreported; if none fit, expect deletion. Safari HEIC conversion doesn't prove WASM; preserve [isolation](https://developer.wordpress.org/block-editor/how-to-guides/client-side-media/).
- **[PHP 8.6](https://make.wordpress.org/core/2026/11/23/wordpress-and-php-8-6/):** Test with WordPress 7.2+ and its matching test library; Core support neither certifies plugins nor raises the floor. Allow `font/ttf` and `font/sfnt` for TTF. Test GD mirrored EXIF images; use `imageflip()`, not negative dimensions. Wrappers need `stream_flush()` reporting actual failures. `spl_object_id()` returns an integer, unlike deprecated `spl_object_hash()`; check keys/comparisons.
- **[Site operations](https://make.wordpress.org/core/2026/11/19/miscellaneous-developer-changes-in-wordpress-7-2/):** A `.git` file here or in ancestors normally blocks automatic Core/plugin/theme/translation updates. Check Site Health, updater filters and deployment owner. Guard `register_site_meta()` by version, multisite and `is_site_meta_supported()`; `show_in_rest` creates no Core sites endpoint.
- **[Application passwords](https://make.wordpress.org/core/2026/11/19/miscellaneous-developer-changes-in-wordpress-7-2/#application-password-data-passed-to-hooks-is-now-unslashed):** Direct create/update input: **slashed** (`wp_slash()` raw values). 7.2 action arguments: **unslashed**; a second `wp_unslash()` strips backslashes. Named creation normally emails the user. Identify both senders in a mail sink before changing notifications; never log credentials.
- **Dependencies:** [jQuery Migrate 3.6.0](https://make.wordpress.org/core/2026/11/17/preparing-for-jquery-4-with-wordpress-7-2/) isn't jQuery 4. Exercise plugin workflows with development scripts; fix warnings at their caller, don't replace Core jQuery. [React 19](https://developer.wordpress.org/news/2026/11/whats-new-for-developers-november-2026/) is Gutenberg-plugin-only here; test Core with Gutenberg off.
- **Other boundaries:** Test [random permalinks](https://make.wordpress.org/core/2026/11/05/your-content-is-going-to-get-more-random/) for collisions/type eligibility (`randomable`). [SQL mode](https://make.wordpress.org/core/2026/10/09/no_backslash_escapes-sql-mode-is-now-turned-off-by-default-in-wordpress-7-2/) changes the connection session only. The [Secrets API was withdrawn](https://make.wordpress.org/core/2026/11/11/the-secrets-api-in-wordpress-7-2/): don't require it or migrate production credentials. Identify beta package/provider before recovery; failed writes/read-only storage never justify clearing, exposing or downgrading secrets.

## WordPress 7.0 Production Baseline

- WP AI Client, client-side Abilities, Connectors, and provider-agnostic routing. Treat credentials as secrets; require capabilities, consent/data-flow disclosure, quotas, timeouts, redaction, and deterministic fallbacks.
- Admin styling/transitions, command palette, Font Library, Visual Revisions, navigation overlays, visibility and `contentOnly` editing: test CSS/DOM/workflows without copying internals.
- Icon, Headings, and Breadcrumbs blocks; Gallery lightbox/slideshow; video Cover backgrounds; paragraph text columns/indent; dimension presets; block-level custom CSS; button pseudo-state support in `theme.json`. Prefer native author controls, but verify the exact registered block/support at runtime.
- Pattern Overrides/`contentOnly`: mark attributes `role: "content"` where required; prove List View discoverability and non-technical editing.
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

Record per product:

1. Exact dated Core/plugin builds; PHP/database/browser/multisite, theme, Gutenberg, cache and relevant plugins.
2. API/block/support inventory, feature detection and older-Core fallbacks.
3. Applicable lifecycle (install through uninstall), admin/settings, editor save/reopen, frontend, REST/cron/CLI, capabilities, i18n/RTL, multisite, accessibility and rollback.
4. Regressions: iframe boundaries, Global Styles precedence, responsive/pseudo states, media errors, icons/SVG, Abilities/AI privacy, DataViews lifecycle and bundled libraries.
5. Package proof, local checks, changed-UI captures, performance/query/asset comparison, security/privacy review and gaps.
6. Align headers/readme/package/docs. Prepare only `Tested up to: 7.2` for the exact passing package. Name the RC; recheck final for stable claims. Leave minimums, plugin version and stable tag unchanged; no bulk edit or publication.

Require a tested rollback and no unexplained notices/deprecations, editor/frontend divergence, lost editability or capability/privacy/performance regressions. Report untested boundaries.
