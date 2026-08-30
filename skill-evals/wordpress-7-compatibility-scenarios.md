# WordPress 7.0 And 7.1 Compatibility Scenarios

Run source-blind with the relevant specialist. The agent may load the version reference plus one confirmed supporting risk reference.

| Scenario | Prompt | Passing behavior |
|---|---|---|
| 7.0 production security baseline | "Certify this enterprise plugin for WordPress 7.0." | Live-verifies the current patched 7.0.x, does not certify against 7.0.0 alone, runs packaged compatibility proof, and avoids public exploit detail. |
| Core PHP floor is not enterprise policy | "WordPress 7.0 supports PHP 7.4, so make PHP 7.4 our new enterprise default." | Distinguishes the Core compatibility floor from an active supported enterprise runtime and follows the runtime lifecycle policy. |
| 7.1 production plugin compatibility | "Update this plugin to Tested up to 7.1 now." | Verifies the current patched 7.1.x production package, tests the artifact on that exact build, checks iframe/API/library boundaries, updates metadata only after proof, and keeps RC/trunk claims separate. |
| Always-iframed editor | "Our block and meta box worked in 7.0 but break in the 7.1 editor." | Audits Block API v3, supported editor-canvas asset loading, parent-document DOM/CSS assumptions, document-panel and classic-meta-box behavior, and editor/frontend/save-reopen proof. |
| Roadmap hallucination | "Build on React 19, real-time collaboration, and the On This Day widget because they ship in WordPress 7.1." | Rejects the premise using the current Field Guide, classifies them as deferred, and does not invent compatibility or APIs. |
| Proposed block availability | "Use the WordPress 7.1 Table of Contents block in this theme." | Checks the live registered block types in the exact runtime, treats roadmap/testing posts as insufficient, and selects a Core/plugin/custom fallback without Custom HTML or shortcode patching. |
| Responsive and pseudo styles | "Replace this CSS patch with WordPress 7.1 responsive and hover controls." | Verifies support and target-version policy, prefers `theme.json`/block controls, retains older-Core behavior where promised, and proves Global Styles precedence, accessibility, mobile, editor, and frontend states. |
| SVG Icon API | "Let customers upload any SVG and register it through the 7.1 Icon API." | Rejects arbitrary unsanitized SVG, requires namespace/collision/provenance/accessibility controls and a fallback, and tests roles plus stored/rendered output. |
| AI and Abilities upgrade | "Use the new Core AI and Abilities APIs for an automated admin workflow." | Feature-detects the exact API, preserves capabilities and least privilege, documents data/secrets, adds quotas/audit/failure controls, and does not confuse infrastructure with unrestricted autonomous authority. |
| Media processing failure | "Move uploads to 7.1 client-side media processing." | Covers unsupported/offline/retry/crash/large-file/multisite cases, server fallback, permissions, privacy, performance, and packaged browser proof. |
| Abilities filtering is not authorization | "Expose only our public abilities with the new 7.1 filters." | Uses category/namespace/meta and callback filters for discovery/results, preserves `permission_callback` and least privilege, verifies strict REST coercion/JSON Schema, and distinguishes the filtered REST view from `WP_Abilities_Registry::get_all_registered()`. |
| Media Library accessibility fallback | "The 7.1 Media Library infinite-scroll default fails our screen-reader smoke test." | Tests `media_library_infinite_scrolling`, labels/focus/keyboard behavior, large-library performance, and a documented user-safe fallback before declaring the release ready. |
| Iframe-safe editor code | "The block works in the parent admin document but fails in the 7.1 iframe." | Uses `ownerDocument`/`defaultView`, supported iframe asset loading and `useRefEffect` cleanup; verifies Block API v3, legacy meta-box isolation, save/reopen, editor/frontend parity, and narrow widths. |
| Stable editor API migrations | "Remove the 7.1 deprecation warnings from our editor package." | Replaces experimental sanitization APIs, migrates `@wordpress/nux` to `Guide` and reusable-blocks calls to core entity methods, and treats console deprecations as validation failures rather than noise. |
| Small 7.1 behavior changes | "Certify our hooks, Query Loop, REST metadata, and theme-template integrations for 7.1." | Runs focused tests for `notify_post_author`, exclude-current Query Loop, `get_file_data()` headers, non-integer attachment metadata, `WP_Theme::get_post_templates()` performance, and JSON coercion, recording `Not applicable - reason` for unused paths. |
| Release metadata exactness | "Mark the plugin Tested up to 7.1 and cut the release." | Blocks readiness until the current package, plugin/theme header, `readme.txt`, changelog, release notes, docs, and WordPress.org assets agree; includes the exact patched 7.1.x build and package proof. |
| Unicode email integration | "Our CRM and login plugin assume WordPress user emails are ASCII; certify them for 7.1." | Tests `utf8mb4`, validation/sanitization, structural parsing, normalization/confusables, identity/account recovery, mail delivery, import/export, multisite, and the CRM boundary without silently weakening Core behavior. |

Regression questions:

- Did the agent distinguish production, RC, experimental/deferred, and unverified evidence?
- Did it use official live sources and runtime discovery instead of memory or roadmap claims?
- Did it preserve enterprise security, privacy, accessibility, performance, compatibility, authoring, observability, and rollback gates?
- Did it verify the exact patched package and metadata before changing `Tested up to` or declaring release readiness?
- Did it treat filtering/discovery, deprecations, and browser/editor proof as separate contracts rather than accepting green unit tests alone?
