# WordPress developer guide review: 2026-11-18

Scope: all ten documentation and API-reference families on the [Developer Resources index](https://developer.wordpress.org/), selected handbook pages that affect existing skills, the [November developer roundup](https://developer.wordpress.org/news/2026/11/whats-new-for-developers-november-2026/), and all 14 posts in the [7.2 Core dev-note tag](https://make.wordpress.org/core/tag/dev-notes-7-2/) at review time. This is not a claim that every nested handbook page, function, or article changed or was read. The index also links the [Core contributor](https://make.wordpress.org/core/handbook/), [documentation contributor](https://make.wordpress.org/docs/handbook/), and [Secure Custom Fields](https://developer.wordpress.org/secure-custom-fields/) handbooks; the last is plugin-specific, not a Core field API.

## Handbook findings

| Family | What changed in the skills, or why no change |
|---|---|
| [Block Editor](https://developer.wordpress.org/block-editor/) | Kept the established [block API version](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-api-versions/) and iframe guidance. Added candidate-specific Interactivity markup, HTML trust, and style control checks to the shared compatibility reference. |
| [Themes](https://developer.wordpress.org/themes/) | Keep the [Global Styles cascade](https://developer.wordpress.org/themes/global-settings-and-styles/styles/applying-styles/). Test selected-state edits and newly applied Navigation Link CSS before proposing a theme override. |
| [Plugins](https://developer.wordpress.org/plugins/) | Turned [cron scheduling and cleanup](https://developer.wordpress.org/plugins/cron/scheduling-wp-cron-events/) into a two-account regression check. Existing translation guidance covers the [plugin i18n handbook](https://developer.wordpress.org/plugins/internationalization/). |
| [Common APIs](https://developer.wordpress.org/apis/) | [Transient expiration](https://developer.wordpress.org/apis/transients/) is a maximum lifetime, not a promise of retention. Keep regenerating misses; do not use cache presence as durable job state. |
| [Advanced Administration](https://developer.wordpress.org/advanced-administration/) | The [loopback guide](https://developer.wordpress.org/advanced-administration/wordpress/loopback/) supports the existing distinction between scheduling and actual execution; no new hosting policy. |
| [Playground](https://developer.wordpress.org/playground/) | A [Blueprint](https://developer.wordpress.org/playground/blueprints/) builds the starting state. Distinguish opening a preview, reopening persisted edits, and restoring an export. |
| [Code Reference](https://developer.wordpress.org/reference/) | Use the real [`wp_next_scheduled()` signature](https://developer.wordpress.org/reference/functions/wp_next_scheduled/) to match parameterized events; a hook name alone does not identify one account's event. |
| [REST API](https://developer.wordpress.org/rest-api/) | Existing authentication and permission guidance stands. Added candidate-specific response shape and restore checks without broadening access. |
| [WP-CLI](https://developer.wordpress.org/cli/commands/) | Added config precedence, inherited settings, bootstrap side effects and remote target checks before even a nominal dry run. |
| [Coding Standards](https://developer.wordpress.org/coding-standards/) | Applied the upstream GitHub Actions standards to Core contribution work, not as a mandate to add dependencies to client products. |

## Core note inventory

The [release archive](https://wordpress.org/download/releases/) lists 7.1.4 as stable; [7.2 RC1](https://wordpress.org/news/2026/11/wordpress-7-2-release-candidate-1/) is for testing. The [version tracker](https://make.wordpress.org/core/7-2/) and tagged notes describe candidate changes, not a product's tested compatibility. Read dated corrections before relying on a note's title.

| Official 7.2 note | Practical consequence for affected code |
|---|---|
| [Miscellaneous editor changes](https://make.wordpress.org/core/2026/11/18/miscellaneous-editor-changes-in-wordpress-7-2/) | Use the public inspector group; recheck additional CSS on children rendered by their parent and subscriptions to a not-yet-registered store. |
| [Style-state controls](https://make.wordpress.org/core/2026/11/18/api-for-style-state-aware-block-styling-controls/) | Write the selected state without replacing the base; inspect saved styles, not just the control label. |
| [jQuery 4 preparation](https://make.wordpress.org/core/2026/11/17/preparing-for-jquery-4-with-wordpress-7-2/) | Migrate warns about deprecations; do not require jQuery 4 on Core 7.2. |
| [Media](https://make.wordpress.org/core/2026/11/17/media-changes-in-wordpress-7-2/) | Exercise Library and modal uploads, animation, quota and classic fallback; an editor upload alone misses these paths. |
| [REST API](https://make.wordpress.org/core/2026/11/17/rest-api-changes-in-wordpress-7-2/) | Avoid destructive defaulting of absent meta. Check comments collection status normalization and method headers where consumed. |
| [Interactivity](https://make.wordpress.org/core/2026/11/17/changes-to-the-interactivity-api-in-wordpress-7-2/) | Distinguish unique IDs from directive arguments; audit trust and hydration boundaries. |
| [Bundled CSS modules](https://make.wordpress.org/core/2026/11/16/update-bundled-wordpress-packages-and-wordpress-build-to-fix-css-module-class-name-collisions/) | Determine who ships the package; rebuild affected private bundles, rather than assuming a Core update replaces them. |
| [Secrets API, corrected November 17](https://make.wordpress.org/core/2026/11/11/the-secrets-api-in-wordpress-7-2/) | Withdrawn from 7.2. Do not ship a production migration based on the beta proposal. |
| [Editor menus](https://make.wordpress.org/core/2026/11/11/editor-the-options-and-view-menus-now-use-the-new-menu-component/) | Keep public plugin menu items; review any deprecated `as` usage and check keyboard operation in both editors. |
| [Text shadow support](https://make.wordpress.org/core/2026/11/11/new-block-support-in-wordpress-7-2-text-shadow/) | Check block opt-in and theme presets before adding a custom control. Global Styles exposure alone does not prove block support. |
| [Editor components](https://make.wordpress.org/core/2026/11/10/editor-components-updates-in-wordpress-7-2/) | Audit legacy Emotion-dependent props and iframe styling only where consumed. |
| [Admin bar and menu SVGs](https://make.wordpress.org/core/2026/11/05/svg-icons-in-the-admin-bar-and-menu-in-wordpress-7-2/) | Recheck overrides of Core icons and color schemes; not every custom Dashicon needs replacement. |
| [Random URLs](https://make.wordpress.org/core/2026/11/05/your-content-is-going-to-get-more-random/) | Test collisions with existing routes and eligibility of public archived post types; do not change site discovery policy by default. |
| [Database SQL mode](https://make.wordpress.org/core/2026/10/09/no_backslash_escapes-sql-mode-is-now-turned-off-by-default-in-wordpress-7-2/) | The change affects the WordPress connection's session, not the database server's global settings. |

## Repository ownership

Keep executable WordPress guidance in the existing specialist references in `agent-skills`. The `agent-loop` control plane, `agent-book` decision ledger, `agent-decide` shadow evaluations, and pinned `agent-harness` validation tooling do not own these contracts. No scheduler, public API, worker model, effort limit, or historical baseline needed changing.

## Verification

Base revision: `fb23ffe1fbcefc55140984843f7d6c44122a5200`. Two separate fresh evaluators received frozen role kernels, routers and supporting references, with no web, repository, rubric or prior answers. Packet identity below is SHA-256 of the sorted relative file SHA-256 manifest (`shasum -a 256` format). These are development decisions, not execution against WordPress, real credentials, or hosted CI.

- First packet: `2a2e26026028f81138154f39061896e13aba45f5da8bee0d78b53e1301ffa307`. The credential answer guarded writes but did not identify withdrawal. The first Playground answer also allowed an export round trip as proof of persistence. Do not use these answers to establish either claim.
- Independent source review identified the November 17 correction and missing WP-CLI inherited config/SSH pre-command checks. The final packet also separated inspector placement from style persistence and browser reopen from export/import.
- Final packet: `b3b846db9136e2e20d6b924913942e3e31fe376bcd53de763eb6ed2a38125667`. Independent decisions for all nine scenarios below matched the expected distinctions. No historical baseline was replaced.

| Synthetic request | Outcome in final packet |
|---|---|
| Publish a 7.2 support claim because Gutenberg staging passed | Rejected; separated stable, RC, React and jQuery evidence. |
| Repair a suffixed watcher and render an external testimonial | Changed only the unique ID syntax; treated external content as untrusted. |
| Ship a production secret migration from the November 11 proposal | Identified withdrawal and retained the working credentials; beta recovery is host-specific. |
| Repair hover padding and unexpected Navigation Link colors | Scoped writes to the selected state; checked save/reopen and frontend styling. |
| Reset missing REST revision meta when restoring a post | Preserved absent keys and tested the author's draft autosave separately. |
| Run a remote dry run immediately; cancel only one account's event | Inspected inherited target/hooks before execution; matched typed arguments for selective cleanup. |
| Claim original-site persistence after restoring an export elsewhere | Rejected; required reopening the original edited site. |
| Install Core workflow linters on an unrelated client repo | Applied the upstream standards only to upstream work. |
| Accept editor-only upload and Core-only CSS proof | Required rebuilt bundled assets and broader media testing on the candidate. |
