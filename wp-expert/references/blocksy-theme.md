# Blocksy Theme And Blocksy Pro

Use this when a WordPress task involves the Blocksy theme, Blocksy Companion, Blocksy Pro, Blocksy starter sites, header/footer builders, Customizer options, Content Blocks, Dynamic Data, Post Types Extra, Shop Extra/WooCommerce, Advanced Menu, Pro extensions, custom sidebars, snippets, licensing, or Blocksy-specific troubleshooting.

## Current Source Anchors

Blocksy docs and Pro features change. Verify current docs, installed versions, and active modules before giving exact implementation or licensing guidance.

- Blocksy docs: https://creativethemes.com/blocksy/docs/
- Installing Blocksy: https://creativethemes.com/blocksy/docs/general/install-blocksy-theme/
- Theme Options intro: https://creativethemes.com/blocksy/docs/theme-options/theme-options-intro/
- Blocksy Dashboard: https://creativethemes.com/blocksy/docs/getting-started/blocksy-dashboard/
- Manage Options: https://creativethemes.com/blocksy/docs/general-options/manage-options/
- Blocksy Companion: https://creativethemes.com/blocksy/companion/
- Starter Sites: https://creativethemes.com/blocksy/starter-sites/
- Blocksy Premium features: https://creativethemes.com/blocksy/premium/
- Upgrade to Blocksy Pro: https://creativethemes.com/blocksy/docs/general/install-activate-blocksy-companion-pro/
- Blocksy Pro plans: https://creativethemes.com/blocksy/docs/general/blocksy-pro-plans-comparison/
- Licence Utilisation: https://creativethemes.com/blocksy/docs/general/licence-utilisation/
- Header Builder elements: https://creativethemes.com/blocksy/docs/header-elements/header-builder-elements/
- Footer introduction: https://creativethemes.com/blocksy/docs/footer-elements/footer-introduction/
- Extensions overview: https://creativethemes.com/blocksy/docs/extensions/extensions-general/
- Content Blocks Hooks: https://creativethemes.com/blocksy/docs/modules/content-blocks/
- Conditional Module: https://creativethemes.com/blocksy/docs/modules/conditions-module/
- Theme Blocks intro: https://creativethemes.com/blocksy/docs/theme-blocks/theme-blocks-getting-started/
- Dynamic Data: https://creativethemes.com/blocksy/docs/theme-blocks/dynamic-data/
- Post Types Extra: https://creativethemes.com/blocksy/docs/extensions/post-types-extra/
- Shop Extra: https://creativethemes.com/blocksy/docs/extensions/woocommerce-extra/
- Quick View: https://creativethemes.com/blocksy/docs/woocommerce/quick-view/
- Floating Cart: https://creativethemes.com/blocksy/docs/woocommerce/floating-cart/
- Filters Canvas: https://creativethemes.com/blocksy/docs/woocommerce/off-canvas-filter/
- Custom Code Snippets: https://creativethemes.com/blocksy/docs/extensions/custom-code-snippets/
- Developer docs category: https://creativethemes.com/blocksy/docs/
- Blocksy on WordPress.org: https://wordpress.org/themes/blocksy/

## Product Model

Blocksy is a fast Gutenberg-friendly classic/customizer theme, not a pure core block theme. It uses the WordPress Customizer, header builder, footer builder, theme options, per-page/post options, and optional Companion/Pro plugin features. Do not assume Site Editor or `theme.json` is the primary control layer unless the installed version/site has explicitly added a block-theme-like workflow.

Blocksy Companion is the companion plugin that unlocks starter sites, extensions, performance controls, beta releases, and other helper features. Blocksy Pro is delivered through the Blocksy Companion Pro plugin and adds premium modules such as enhanced header/footer builder features, Content Blocks, Advanced Menu, custom fonts, local Google fonts, Adobe Fonts, custom sidebars, white label, custom snippets, Shop Extra, Post Types Extra, and other Pro extensions.

## Runtime Discovery

Before changing a Blocksy site, collect:

- Active parent/child theme and versions: `wp theme list`, `wp option get stylesheet`, `wp option get template`.
- Companion state: `wp plugin list | rg -i 'blocksy|companion|woocommerce'`.
- Whether the site uses free Companion, Companion Pro, or no Companion plugin.
- License/activation state if Pro features are involved, without exposing the key.
- Customizer settings and whether options were copied between parent/child theme.
- Header/footer builder layouts, conditional headers/footers, and per-page/post overrides.
- Content Blocks, hooks, popups, templates, display conditions, and hook priorities.
- Enabled extensions/modules: Post Types Extra, Shop Extra, Advanced Menu, Custom Code Snippets, Custom Fonts, Local Google Fonts, Multiple Sidebars, Newsletter, Product Reviews, Colour Mode Switch, Cookies Consent, White Label.
- Page builder or block stack used by starter site/content: Gutenberg, Elementor, Brizy, Greenshift, or other bundled plugins.

Useful probes:

```bash
wp theme list
wp plugin list
wp option get stylesheet
wp option get template
wp option get theme_mods_blocksy 2>/dev/null || true
wp post list --post_type=ct_content_block --fields=ID,post_title,post_status 2>/dev/null || true
wp post list --post_type=wp_template --fields=ID,post_title,post_status 2>/dev/null || true
```

## Free Blocksy Implementation Guidance

- Use the Customizer and Blocksy theme options first. Most Blocksy settings are exposed through Appearance -> Customizer, with live preview and per-page/post overrides.
- Treat Blocksy as a theme framework with strong Gutenberg compatibility, not a place to bypass WordPress APIs.
- Use a Blocksy child theme for PHP templates, functions, persistent CSS, and overrides. Do not edit parent theme files.
- Use the Companion plugin for starter sites, extensions, and performance controls only when the project accepts the dependency.
- Prefer Customizer/header/footer options for layout changes before writing CSS or template overrides.
- Keep page-specific settings documented because per-page/post overrides can explain behavior that differs from global Customizer settings.
- For enterprise/team projects, keep durable code in a child theme or project plugin rather than only in dashboard settings.

## Header, Footer, And Navigation

Blocksy has drag-and-drop header and footer builders. Free and Pro features differ, so inspect the active package before promising an element or condition.

Guidelines:

- Use the header/footer builder for structural header/footer layout before custom templates.
- Validate desktop, tablet, mobile rows, sticky/transparent states, off-canvas areas, and per-device visibility.
- For Pro conditional headers/footers, document each display condition and user role/login condition.
- Advanced Menu/mega menu work should preserve keyboard navigation, focus order, hover/focus parity, mobile behavior, and menu semantics.
- Do not solve navigation with raw custom HTML when native menu/header elements or Content Blocks are sufficient.

## Content Blocks, Hooks, Conditions, And Templates

Blocksy Pro Content Blocks can create Hooks, Pop-ups, and Templates. Hook blocks can insert static or dynamic content throughout theme locations and integrate with the Conditional Module for display rules.

Use Content Blocks when the site needs editor-managed sections at theme hook locations. Use child theme or plugin code when behavior is business logic, complex data access, security-sensitive, or needs version control.

Review these details:

- Content Block type: Hook, Popup, Template, or inserted Content Block block.
- Hook location, priority, container structure, display conditions, language conditions, and device visibility.
- Dynamic content preview source for custom fields or post-specific data.
- Multilingual behavior with WPML, Polylang, or TranslatePress.
- Whether hook locations are visible in the admin toolbar and whether they should be hidden on production.

## Dynamic Data, Theme Blocks, And Custom Fields

Blocksy Theme Blocks are available when the Companion plugin is installed. Current docs include blocks such as Advanced Posts, Advanced Search, Advanced Taxonomies, Dynamic Data, Shop Filters, Active Filters, and Filter by Price.

Dynamic Data can display core post data, WooCommerce product data, taxonomy data, and Pro custom fields from supported systems such as ACF, ACPT, MetaBox, Pods, Toolset, and JetEngine when the relevant Pro module is enabled.

Rules:

- Enable and verify Post Types Extra/Dynamic Data before troubleshooting missing custom fields.
- Use Dynamic Data inside Content Blocks, archive/singular templates, Query Loop-like contexts, WooCommerce product layouts, and Advanced Posts/Taxonomies only where it improves maintainability.
- Add fallbacks for empty custom fields and validate previews against real posts/products/terms.
- Avoid duplicating dynamic-field rendering in PHP snippets when Blocksy Dynamic Data can express the same display safely.
- For custom CPT/taxonomy work, verify archive/single layout, filters, taxonomy customization, and dynamic data source availability.

## Blocksy Pro Extensions

Use Pro extensions when they match the product need and the license/dependency is accepted:

- Content Blocks for hooks, popups, templates, conditional display, and fixed blocks.
- Advanced Menu for mega menus, menu icons, Content Block mega menu content, and individual item styling.
- Custom Fonts, Adobe Fonts, and Local Google Fonts for typography governance and privacy/GDPR needs.
- Multiple Sidebars for conditional widget areas.
- Custom Code Snippets for simple CSS/JS snippets when dashboard-managed code is acceptable.
- White Label only when the plan and agency workflow justify hiding or replacing branding.
- Post Types Extra for CPT/blog enhancements, read time, reading progress, filters, taxonomy customization, and dynamic data.
- Shop Extra for WooCommerce modules.

Do not add Pro-only implementation assumptions on a free site without checking license and active modules.

## WooCommerce And Shop Extra

Blocksy integrates deeply with WooCommerce. Pro Shop Extra modules include features such as Floating Cart, Quick View, Filters, Wish List, Compare View, Variation Swatches, Product Brands, Custom Tabs, Size Guide, custom Order Confirmation pages, Advanced Reviews, Free Shipping Bar, Advanced Gallery, Product Share Box, Search by SKU, and affiliate product links.

WooCommerce guidance:

- Validate product archive, product detail, cart, checkout, account, search, filters, wishlist, compare, quick view, floating cart, and mini-cart/off-canvas flows.
- Check AJAX settings where required, especially cart/mini-cart behavior.
- Confirm filter behavior with real product attributes, global attributes, brands, stock, variable products, and pagination.
- Test mobile/off-canvas filters, sticky/floating UI, modals, focus trapping, scroll lock, and keyboard escape behavior.
- Measure performance on realistic product counts and image sizes.
- Avoid layering redundant WooCommerce filter/wishlist/compare plugins when Blocksy Pro already supplies the feature.

## Starter Sites And Imports

Blocksy starter sites can use Gutenberg, Elementor, Brizy, or bundled plugins. Some are Pro and may include mega menus, WooCommerce features, dynamic CPTs, forms, newsletter integrations, or other dependencies.

Rules:

- Import starter sites only on a fresh install or after a verified backup because starter imports can replace content and settings.
- Document bundled plugins, page builder choice, starter-site source, Pro requirement, and imported content.
- After import, normalize branding, typography, colors, privacy, analytics, forms, SEO, redirects, accessibility, WooCommerce settings, and performance.
- Remove unused imported pages, plugins, demo content, images, and menu items before launch.

## Licensing, Local, Staging, And Multisite

Blocksy Pro requires downloading and installing the Companion Pro plugin, then activating with a license key. Docs describe Personal, Business, and Agency plans with different site activation limits, development/staging domain allowances, and multisite behavior.

Security and operations rules:

- Never commit license keys, account credentials, zip files from private accounts, or Freemius/auth artifacts.
- Prefer environment-specific deployment of Pro plugin files and license activation.
- Verify whether local/staging domains count against activations before advising a deployment workflow.
- In multisite, treat each sub-site/license-seat behavior as plan-dependent and verify current docs before rollout.
- Do not rely on Pro features in production unless license ownership, renewal, updates, and support are operationally clear.

## Developer And Custom Code Guidance

Blocksy exposes developer filters/actions and documented snippets. Use official hooks before DOM hacks.

- Put reusable PHP in a child theme or project plugin, not random admin snippets, unless the project explicitly wants dashboard-managed snippets.
- Custom Code Snippets can be acceptable for simple global or per-page CSS/JS, but enterprise projects should prefer version-controlled code with review and deployment history.
- Use Blocksy custom condition filters for Conditional Manager extensions only when needed and test resolution on the frontend.
- Keep snippets scoped, escaped, capability-safe, and documented.
- Avoid editing generated/minified theme assets.

## Troubleshooting Checklist

- Missing settings: confirm active theme, child theme, Companion/Pro plugin status, package level, extension toggle, and user capability.
- Layout differs by page: check per-page/post Blocksy settings before changing global Customizer settings.
- Header/footer issue: inspect builder rows, device visibility, sticky/transparent state, conditional header/footer, and cached CSS.
- Content Block not showing: check type, hook location, priority, container, display conditions, language condition, device visibility, status, and hook debugger visibility.
- Dynamic Data missing: confirm Companion, Post Types Extra/Dynamic Data module, preview post, field plugin, field group location, product/term context, and fallback configuration.
- WooCommerce issue: check Shop Extra module activation, WooCommerce AJAX settings, product data, attributes, global attributes, stock, cache, and template overrides.
- Starter site issue: check import logs, bundled plugin installation, page builder dependency, demo content state, and whether import overwrote existing content.
- Performance issue: audit enabled extensions, fonts, local Google fonts, global snippets, images, product grids, quick view/floating UI, and third-party page builder assets.

## Delivery Output

When reporting Blocksy work, include:

- Free Blocksy vs Companion vs Companion Pro status.
- Active theme/child theme versions and Pro package/module assumptions.
- Where the change lives: Customizer setting, per-page/post option, Content Block, child theme, project plugin, snippet, starter import, WooCommerce module, or page builder content.
- Validation: desktop/tablet/mobile, header/footer, frontend/editor, accessibility, WooCommerce flows, performance, cache, and Pro module behavior.
- Source docs checked when exact Blocksy feature behavior matters.
