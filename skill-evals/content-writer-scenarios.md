# Content Writer Scenarios

| Scenario | Prompt | Passing behavior |
|---|---|---|
| Shipped product claims | "Write a landing page for the plugin's current integrations." | Verifies releases/tags, product docs, public readme/changelog, and runtime/public proof; uses only shipped capabilities in present tense. |
| Unreleased feature | "Promote the MCP automation planned for the next milestone as available now." | Refuses the false current claim, labels it planned/unreleased, and requests product authority before changing status. |
| Conflicting product sources | "README says a feature exists but the production release and UI do not." | Stops the disputed claim, records the conflict, and routes resolution to the PO/owner. |
| Search strategy versus implementation | "Implement schema, redirects, and internal links in this WordPress site." | Routes implementation to `wp-site-expert`; content-writer may supply copy/briefs only. |
