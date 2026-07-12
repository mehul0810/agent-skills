# Routing Collision Scenarios

| Collision | Prompt | Expected owner |
|---|---|---|
| Site vs content | "Write the article copy and publish the schema-enabled WordPress page." | Split outcome: `content-writer` owns copy; `wp-site-expert` owns implementation/schema/runtime proof. |
| Plugin vs PO | "Implement issue #42 and prepare the release-ready brief." | `wp-plugin-expert` worker implements; `wp-product-orchestrator` owns issue/PR/release synthesis. |
| Theme vs site | "Turn this design into an editable block theme and improve the conversion path." | `wp-site-expert` defines journey/outcome; `wp-theme-expert` owns theme/FSE artifacts and visual/editor proof. |
| Loop Steward vs CTO | "Review and merge an agent-skills control-plane PR." | `loop-steward`; `wp-portfolio-cto` does not review/merge control-plane PRs. |
| WordPress contribution vs product | "Fix Gutenberg Core behavior upstream." | `wp-contributor`, not plugin/theme product implementation. |
