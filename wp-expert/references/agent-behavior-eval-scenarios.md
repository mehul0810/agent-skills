# Agent Behavior Eval Scenarios

Use this to evaluate whether `wp-expert` still routes decisions correctly after skill edits. Do not load during normal project work unless auditing the skill itself.

## Required Scenarios

Each scenario should produce the expected behavior without requiring extra reminders:

1. Block theme page from screenshot: maps design through `theme.json`, templates, patterns, core blocks, and Post Content; page-owned visible content remains editable from Pages > Edit.
2. Milestone issue PR: verifies repo state, fetches branches when possible, proves the release/milestone base branch, passes an explicit PR base, and verifies the created PR base/head.
3. Plugin REST setting save: uses REST over new `admin-ajax.php`, validates schema, checks capability/object ownership, handles nonce/CSRF where applicable, redacts secrets, and adds permission-negative tests.
4. Unreleased feature rework: compares against the last released version, deletes abandoned draft shapes, and avoids backward-compatibility shims for unreleased intermediate work.
5. Production package/release: excludes dev-only Composer/npm packages, includes runtime vendor/build artifacts, validates generated assets, and states artifact proof.
6. External API integration: finds official docs or asks for them, isolates provider clients, sets timeouts/retries/idempotency, avoids hot-path sync calls, and redacts credentials/PII.
7. High-scale query/admin screen: identifies hot path, avoids unbounded meta/query/list-table work, defines cache/index strategy, and adds a regression guard.

## Passing Standard

- The agent chooses one primary reference plus risk-triggered overlays instead of loading every reference.
- The response names ownership, source of truth, release state, validation proof, and remaining risk for substantial work.
- The agent commits only intended files when commits are expected and pushes only with explicit user or repo automation authorization.
