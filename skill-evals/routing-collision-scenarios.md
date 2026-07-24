# Routing Collision Scenarios

| Collision | Prompt | Expected owner |
|---|---|---|
| Site vs content | "Write the article copy and publish the schema-enabled WordPress page." | Split outcome: `content-writer` owns copy; `wp-site-expert` owns implementation/schema/runtime proof. |
| Plugin vs PO | "Implement issue #42 and prepare the release-ready brief." | `wp-plugin-expert` worker implements; `wp-product-orchestrator` owns issue/PR/release synthesis. |
| Theme vs site | "Turn this design into an editable block theme and improve the conversion path." | `wp-site-expert` defines journey/outcome; `wp-theme-expert` owns theme/FSE artifacts and visual/editor proof. |
| Implementation vs independent proof | "Fix the settings bug and independently prove the packaged plugin saves it." | `wp-plugin-expert` implements; a fresh `behavior-validator` receives only the behavior contract, exact package/runtime target, fixtures, and evidence requirements. |
| Loop Steward vs CTO | "Review and merge an agent-skills control-plane PR." | `loop-steward`; `wp-portfolio-cto` does not review/merge control-plane PRs. |
| WordPress contribution vs product | "Fix Gutenberg Core behavior upstream." | `wp-contributor`, not plugin/theme product implementation. |
| Video vs product control | "Turn these brand references into a product launch video and track it for the next milestone." | `product-video-producer` owns storyboard/render/proof; `wp-product-orchestrator` owns issue, milestone, approvals, and product-state reconciliation. |
| Video vs generated visuals | "Create a product film with three generated abstract scenes." | `product-video-producer` owns the storyboard, timeline, claims, render, and review package; Creative Production or `imagegen` may supply governed supporting scene assets only. |
