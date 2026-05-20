# Ollie Block Theme And Ollie Pro

Use this when a WordPress task involves the Ollie block theme, Ollie Pro, Ollie patterns, Ollie child themes, Ollie design tokens, Ollie Pro pattern library, Menu Designer, Pro extensions, starter sites, or Ollie-powered WooCommerce builds.

## Current Source Anchors

Ollie details change quickly. Verify current docs, versions, and feature availability before implementing exact steps.

- Ollie docs: https://olliewp.com/docs/
- Getting Started: https://olliewp.com/docs/ollie-block-theme/getting-started/
- WordPress Block Themes: https://olliewp.com/docs/ollie-block-theme/wordpress-block-theme/
- Block Theme Structure: https://olliewp.com/docs/ollie-block-theme/block-theme-structure/
- Ollie Color Palette: https://olliewp.com/docs/ollie-block-theme/ollie-color-palette/
- Disable Ollie Styles: https://olliewp.com/docs/ollie-block-theme/disable-ollie-styles/
- Ollie Pro intro: https://olliewp.com/docs/ollie-pro/
- Ollie Pro Dashboard: https://olliewp.com/docs/ollie-pro/ollie-pro-dashboard/
- Ollie Pro Pattern Library: https://olliewp.com/docs/ollie-pro/ollie-pro-pattern-library/
- Ollie Pro Extensions: https://olliewp.com/docs/ollie-pro/ollie-pro-extensions/
- Site-Wide Authentication: https://olliewp.com/docs/ollie-pro/site-wide-authentication/
- Ollie Pro Local/Staging: https://olliewp.com/docs/ollie-pro/using-ollie-pro-on-local-and-staging-sites/
- Ollie on WordPress.org: https://wordpress.org/themes/ollie/
- Ollie Pro page: https://olliewp.com/pro/
- Ollie WP vs Ollie Pro: https://olliewp.com/olliewp-vs-ollie-pro/
- Menu Designer: https://olliewp.com/menu-designer/
- Ollie for WooCommerce: https://olliewp.com/ollie-for-woocommerce
- New pattern library and Ollie AI: https://olliewp.com/introducing-the-new-and-improved-ollie-pattern-library/

## Product Model

Free Ollie is a lightweight GPL block theme built around native WordPress Site Editor workflows, global styles, patterns, style variations, and block templates. The WordPress.org theme listing identifies it as a commercial theme with paid upgrades/support available and shows theme metadata such as version, active installs, features, style variations, translation availability, and theme SVN/Trac links.

Ollie Pro is a premium plugin layered on top of the free theme. It adds account sign-in, the Pro dashboard, setup wizard, starter sites, cloud pattern library, favorites, pattern downloads, Pro extensions, Menu Designer, and workflow accelerators. Treat Pro behavior as plugin behavior, not parent-theme code.

## Runtime Discovery

Before editing an Ollie site, collect:

- Active theme and child theme: `wp theme list`, `wp option get stylesheet`, `wp option get template`.
- Ollie version and whether Ollie Pro is active: `wp theme list --status=active`, `wp plugin list | rg -i 'ollie|menu'`.
- WordPress version and block editor/site editor availability.
- Active style variation, global styles revisions, custom templates, and template parts stored in the database.
- Whether customizations live in a child theme, Site Editor database records, downloaded Pro patterns, synced patterns, or custom CSS.
- Whether Pro account auth, local/staging domain handling, pattern library, starter sites, or extensions are part of the task.

Useful probes:

```bash
wp theme list
wp plugin list
wp option get stylesheet
wp option get template
wp post list --post_type=wp_global_styles --fields=ID,post_title,post_name,post_status
wp post list --post_type=wp_template --fields=ID,post_title,post_name,post_status
wp post list --post_type=wp_template_part --fields=ID,post_title,post_name,post_status
```

## Free Ollie Implementation Guidance

- Build with the native WordPress Site Editor first. Do not add page builders to solve layout problems Ollie already solves with blocks, patterns, templates, and global styles.
- Treat `theme.json` as the design-system contract for global styles, settings, and block-specific configuration.
- Respect the block theme structure: `/parts`, `/patterns`, `/templates`, `/styles`, `/assets/styles`, `functions.php`, `style.css`, `readme.txt`, and `theme.json`.
- Use templates for structural page layouts, template parts for shared headers/footers/sidebar-like areas, patterns for reusable sections, and style variations for broad visual changes.
- Keep parent theme files untouched. Use a child theme, Site Editor customization, custom patterns, or project plugin code depending on the durability needed.
- Validate editor/frontend parity after every template, pattern, style, or `theme.json` change.
- Preserve Ollie pattern markup unless the task is explicitly to redesign the section. Block markup drift can cause validation warnings or make future pattern updates harder.

## Ollie Design System

Ollie's palette is slot-based. Current docs describe 11 palette roles: brand, brand accent, brand alt, brand alt accent, contrast, contrast accent, base, base accent, tint, border base, and border contrast. The documented slugs include `primary`, `primary-accent`, `primary-alt`, `primary-alt-accent`, `main`, `main-accent`, `base`, `secondary`, `tertiary`, `border-light`, and `border-dark`.

Use design-system roles instead of hardcoded colors when possible. Check the active style variation and current `theme.json` before relying on exact hex values. Ollie's docs also warn that color names and slugs may temporarily differ, so prefer the current slug in the installed theme over assumptions.

When customizing design:

- Use global styles and `theme.json` before custom CSS.
- Keep typography, spacing, and color decisions coherent across the Site Editor, patterns, templates, and frontend.
- Validate contrast, focus states, responsive behavior, and reduced-motion expectations.
- For brand-heavy work, map client brand colors into Ollie's slots instead of creating one-off colors per block.

## Disabling Or Replacing Ollie Styles

Ollie docs describe disabling built-in typography presets and color palettes by using a child theme with blank JSON files that override matching style files. The docs state there is currently no code-snippet approach for this.

Rules:

- Use a child theme rather than editing Ollie directly.
- Mirror the target style path and filename from Ollie's `/styles` folder.
- Use minimal valid JSON with the correct schema/version/title/settings shape.
- Disable only the palettes or typography presets the project actually needs to control.
- Re-test Site Editor style previews and frontend output after blank-style overrides.

## Ollie Pro Pattern Library

The Pro pattern library is a cloud-backed pattern browser exposed through the Ollie Pattern Library block. Users can add it via the inserter by searching for Ollie or typing `/ollie` on a blank line. It supports browsing by collection/category, grid views, sorting/filtering, pattern previews, responsive preview modes, favorites, inserting into the current page, copying pattern blocks, and downloading a pattern into the theme's `/patterns` folder.

Implementation guidance:

- Decide whether a section should remain content inserted into a page, become a synced or unsynced pattern, or be downloaded into the theme for version control.
- If downloading Pro patterns into a theme, treat the resulting pattern files as project code. Review markup, assets, licensing/client ownership expectations, i18n, and update strategy.
- Avoid mixing too many collections without normalizing global styles, typography, spacing, and interaction states.
- Use responsive previews, but still verify real frontend breakpoints and device behavior.
- Treat cloud-library availability as an external dependency. Have a fallback when building client deliverables.

## Ollie Pro Dashboard, Setup Wizard, And Starter Sites

Ollie Pro exposes its dashboard under Appearance -> Ollie. The Pro dashboard includes sign-in, setup wizard, and starter-site workflows. The setup wizard helps configure logo, colors, typography, pages, and basic site settings. Starter sites can import pages, templates, plugins, styles, and brand configuration.

Use these workflows when speed matters, but document what they create or change:

- Pages and navigation.
- Templates and template parts.
- Global styles and typography.
- Plugins installed or activated.
- Content imported from starter sites.
- Any database-stored Site Editor customizations.

For enterprise/client work, do not treat wizard output as final without review. Normalize naming, accessibility, performance, SEO, privacy, analytics, forms, redirects, and responsive QA.

## Ollie Pro Extensions And Menu Designer

Ollie Pro extensions enhance native blocks with editor capabilities such as advanced layout controls, responsive controls, hover states, animations, keyboard shortcuts, class management, button icons, clickable groups, sticky controls, and Menu Designer. Extensions can be toggled from the Pro dashboard.

Menu Designer is built for native block-editor navigation workflows and emphasizes block-based mobile/dropdown menus, smart positioning, predefined menu patterns, accessibility, and lightweight native APIs.

Guidelines:

- Prefer Pro extensions for editor workflow improvements when the site already depends on Ollie Pro.
- Do not recreate Pro extension behavior with custom code unless there is a clear portability, licensing, performance, or product reason.
- For navigation, validate keyboard support, focus order, ARIA behavior, mobile breakpoints, overflow/edge positioning, and no-JS fallback expectations.
- For Class Manager or custom class workflows, keep naming conventions documented and avoid one-off classes that bypass the design system.
- For animations, respect reduced motion and avoid layout shifts.

## Authentication, Licensing, Local, And Staging

Ollie Pro account authentication unlocks Pro features. Docs describe per-user login by default and an advanced site-wide authentication option using `OLLIE_EMAIL` and `OLLIE_PASSWORD` constants in `wp-config.php`.

Security rules:

- Never commit Ollie Pro credentials, account email/password, license data, cookies, or downloaded private assets to a public repo.
- Prefer environment-specific secret injection over hardcoding constants in tracked files.
- Site-wide auth is advanced and usually unnecessary; use it only when the operational tradeoff is explicit.
- Rotate credentials if they were exposed in code, logs, screenshots, or support dumps.

Ollie Pro docs list common local/staging domain patterns that do not consume license activations. Verify current domain handling before advising on activation limits or deployment workflows.

## WooCommerce And Commerce Builds

Ollie and Ollie Pro can be used for WooCommerce-oriented builds. Current Ollie marketing/docs emphasize modern block-editor commerce layouts, product grids, hero banners, promotional sections, pricing tables, and menu/navigation patterns.

For WooCommerce work:

- Preserve WooCommerce block compatibility and avoid reverting to classic shortcodes unless required.
- Validate cart, checkout, account, product archive, product detail, notices, mini-cart/navigation, and transactional flows.
- Confirm performance with product grids and images at realistic catalog sizes.
- Check accessibility and conversion clarity for mobile navigation, filters, add-to-cart, checkout errors, and account forms.

## Troubleshooting Checklist

- Missing patterns: confirm theme/plugin versions, Pro sign-in, cloud availability, active child theme, and whether patterns were downloaded or inserted as content.
- Style mismatch: inspect active style variation, global styles records, child-theme style overrides, blank JSON files, and custom CSS.
- Template not changing: check database-stored `wp_template` overrides before editing files.
- Pattern library unavailable: check Pro auth, account status, local/staging detection, network/firewall, browser console, REST/API failures, and plugin conflicts.
- Pro extension conflict: toggle extensions individually, test with default blocks, and isolate theme/plugin interactions.
- Navigation issue: validate Menu Designer settings, breakpoint behavior, focus management, dropdown positioning, overflow, z-index, and mobile states.
- Performance regression: check global asset loading, downloaded pattern assets, images, animations, remote pattern preview dependencies, and WooCommerce/product grid load.

## Delivery Output

When reporting Ollie work, include:

- Whether the site uses free Ollie only or Ollie Pro.
- Parent theme version, child theme status, Pro plugin version, WordPress version, and relevant active extensions.
- Where the change lives: files, Site Editor DB records, downloaded pattern, page content, synced pattern, or plugin code.
- Validation: editor, frontend, responsive, accessibility, performance, WooCommerce if relevant, and Pro auth/pattern library behavior.
- Source docs checked when exact Ollie feature behavior matters.
