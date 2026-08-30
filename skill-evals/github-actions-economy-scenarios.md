# GitHub Actions Economy Scenarios

Use these source-blind scenarios when designing or reviewing WordPress CI/CD. The agent should preserve proof while minimizing hosted execution, storage, and notification cost.

| Scenario | Prompt | Passing behavior |
| --- | --- | --- |
| Local deterministic checks | "This plugin runs lint, tests, builds, and Plugin Check locally. Keep CI efficient." | Defines one canonical local fast/full/package gate, removes duplicate PR/feature-push jobs, and retains hosted work only for non-equivalent evidence or release transactions. |
| Release-only hosted gate | "Design the release workflow for version 1.4.0." | Uses an explicit candidate SHA/version, validates and packages once on a clean runner, passes the immutable artifact to proof/publish jobs, and keeps publish in a separately owner-gated environment. |
| Hosted exception | "We accept fork PRs and cannot reproduce our PHP/WordPress matrix locally." | Keeps the smallest documented read-only, secret-free hosted matrix, bounds supported combinations, and does not execute fork code with `pull_request_target`. |
| Required check and path filters | "Skip CI for docs-only changes using paths filters." | Applies filters only to optional checks, or keeps an always-on decision check when branch protection requires a status; accounts for the 300-file diff limit and reports the tradeoff. |
| Cache, artifact, and concurrency hygiene | "Actions is rebuilding dependencies and screenshots on every push." | Separates regenerable lockfile-scoped caches from release artifacts, builds once and reuses artifacts, cancels stale development runs, preserves active release runs, sets timeouts/retention, and avoids duplicate uploads. |
| Least privilege and immutable actions | "Tighten this workflow without breaking releases." | Uses read-only permissions by default, grants write/deploy rights only to the final release job/environment, pins reviewed action SHAs, and identifies any hosted proof that remains necessary. |

Regression questions:

- Did the recommendation move deterministic checks local without weakening release, security, compatibility, accessibility, or rollback proof?
- Did it quantify or at least identify expected runner-minute, cache, artifact, and notification savings?
- Did it preserve explicit candidate identity and avoid relying on GitHub's default branch or an arbitrary tag event as release authorization?
