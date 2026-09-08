# Block Editor Page Composition Scenarios

| Scenario | Prompt | Passing behavior |
|---|---|---|
| Plugin block inventory | "Build this page with whatever blocks are available from Core and our plugins." | Inventories live Core/plugin blocks, styles, variations, patterns, dependencies, and author-visible behavior; chooses by semantics and portability rather than availability alone. |
| WordPress 7.1 block decision | "Use every new WordPress 7.1 block to make this landing page modern." | Rejects novelty-led selection; verifies live registration, maps each content/interaction need to the smallest semantic block, explains chosen and rejected alternatives, and uses Tabs, Playlist, Accordion, Icon, or Table of Contents only where meaning, authoring, accessibility, responsiveness, and fallback justify it. |
| WooCommerce storefront composition | "Build a premium editable shop, product, cart, and checkout experience with the latest WooCommerce blocks." | Verifies the installed WooCommerce/Core versions and live block registry; uses Product Collection recipes/context, product template primitives, filters, and transactional blocks by ownership; authors empty/error/loading states; preserves designated pages and Store API/extensibility boundaries; proves editor, mobile, accessibility, performance, gateway, and order flows. |
| Automattic product block | "Jetpack and Sensei are installed, so use their premium blocks wherever possible." | Inventories enabled modules, plans, connections, roles, registered blocks, service/data flow, portability, and fallback; chooses a vendor block only when it owns the needed behavior better than Core and never invents paid or connected capability. |
| Editable enterprise landing page | "Create the complete premium landing page so marketing can manage it." | Keeps the template structural with Post Content, creates the actual saved page block tree, uses patterns/styles/variations before custom blocks, and proves marketing can edit content/media/CTA and save/reopen without CSS. |
| Structured article | "Create the post layout and article in the block editor." | Keeps post chrome in the Single template and article hierarchy/media/tables/inline CTA in editable post content with an accessible, scannable block structure. |
| Repeated proof cards | "Add six proof cards and patch their frontend alignment with nth-child CSS." | Rejects positional CSS patching, fixes the saved Grid/pattern/variation/style contract, and preserves responsive editor/frontend parity. |
| Reusable section | "Authors need to insert this testimonial section on many pages." | Chooses an unsynced starter, synced pattern, or synced pattern with supported overrides from the intended update semantics; provides clear inserter metadata and author proof. |
| Third-party block dependency | "Use the premium plugin's carousel block, but the plugin may not be active on every site." | Verifies license/runtime/portability requirements, documents fallback behavior, and selects Core or plugin-owned alternatives when durable content cannot depend safely on it. |
| WYSIWYG proof | "It looks correct on the frontend, so call it done." | Refuses frontend-only completion and proves intended-role creation/edit/save/reopen, representative-section discovery from collapsed List View, editor styling, saved block validity, responsive frontend, and content stress. |

## Failure Signals

- Hard-coded body sections in a page template or pattern that Pages > Edit does not control.
- A pattern/style exists in source but is not discoverable, insertable, valid, or representative in the editor.
- Deep Group nesting or custom classes recreate Columns/Grid/Row/Stack behavior through CSS.
- Redundant single-child Group wrappers have no semantic, layout, style, or locking responsibility.
- Page IDs, `nth-child`, pseudo-content, or absolute offsets fabricate structure on the frontend.
- Plugin blocks are selected without runtime, licensing, accessibility, maintenance, or portability evidence.
- Completion is claimed without a real non-technical author workflow.
