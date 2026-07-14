# Core-First Site And Theme Scenarios

Use these scenarios to verify runtime-first block decisions without loading unrelated references.

| Scenario | Prompt | Passing behavior |
|---|---|---|
| Documented block absent | "Build tabs with the documented Core Tabs block on this site." | Queries the live block registry first; if `core/tabs` is absent, reports it and chooses a registered composition or justified custom block without invented markup. |
| Site Editor promotion | "The approved header, template part, and Global Styles look correct in the Site Editor but exist only as database overrides. Make clean installs match." | Inventories and fingerprints the resolved `wp_template`, `wp_template_part`, and `wp_global_styles` inputs plus `wp_navigation`, synced-pattern, media, and other referenced IDs; maps them to reviewed repository files; removes or migrates nonportable references; treats export output as a draft; proves the packaged artifact on a clean database with no missing database entity or user-origin override required; verifies frontend and author workflows; and preserves existing-site customizations through an owner-approved migration/rollback path. |
| WordPress 7 core-first redesign | "Rebuild this page using WordPress 7 blocks before custom code." | Verifies registration, then prefers suitable Icon, Breadcrumbs, Accordion, Query, Featured Image, Navigation, Search, Table, Group, Columns, and Template Part blocks. |
| Missing design contract | "Spacing and alignment drift between pages and DESIGN.md is missing." | Creates or queues a concise `DESIGN.md` with reusable spacing/alignment and `theme.json`-aligned tokens; avoids generic docs churn. |
| Editable page proof | "Confirm this FSE landing page is really editable from Pages > Edit." | Uses `parse_blocks()` on saved content, renders with `do_blocks()`, checks ownership and forbidden shortcut blocks, and captures desktop/mobile proof. |
| File part appears unchanged | "I edited parts/header.html but the frontend did not change." | Inspects resolved template-part precedence and matching `wp_template_part` database records; preserves intentional overrides and reports the active source. |

## Failure Signals

- Assumes a block exists from documentation or WordPress version alone.
- Emits unregistered block markup, Custom HTML, or a shortcode as a shortcut.
- Validates only a file/pattern while saved page content controls the frontend.
- Deletes a Site Editor database override without approval and rollback evidence.
- Calls the theme production-ready from source-site screenshots or a working-tree diff without packaged clean-install source-resolution proof.
