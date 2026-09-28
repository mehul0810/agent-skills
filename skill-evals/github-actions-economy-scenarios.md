# GitHub Actions Economy Scenarios

Use these source-blind scenarios when designing or reviewing WordPress CI/CD. The agent should preserve proof while minimizing hosted execution, storage, and notification cost.

Coverage mapping: **Local deterministic checks** is exercised by Private-repo cost control; Public-repo useful CI tests the boundary where retaining hosted feedback is justified. **Cache, artifact, and concurrency hygiene** is exercised by CI performance without proof loss.

| Scenario | Prompt | Passing behavior |
| --- | --- | --- |
| Private-repo cost control | "This private plugin already runs lint, tests, builds, and Plugin Check locally. Reduce billed GitHub Actions without weakening assurance." | Verifies or treats visibility as unknown, defaults private deterministic checks to one canonical local fast/full/package gate, retains only documented hosted evidence that is required or non-equivalent, and does not claim cost savings without before/after usage. |
| Public-repo useful CI | "This public plugin gets useful PR feedback from lint, tests, and build checks. Keep the CI, but improve performance." | Allows useful standard-runner CI for ordinary work; checks runner class and storage separately, avoids unnecessary bigger runners, redundant full-gate triggers and setup/build duplication, and preserves all useful checks. |
| Visibility is unknown | "We do not know whether this repository is public or private. Recommend a CI policy and estimate cost." | Verifies visibility before cost claims; until then uses the private-safe local-first posture without asserting the repo's visibility or a dollar amount. |
| Release-only hosted gate | "Design the release workflow for version 1.4.0." | Uses an explicit candidate SHA/version, validates and packages once on a clean runner, passes the immutable artifact to proof/publish jobs, and keeps publish in a separately owner-gated environment. |
| Hosted exception | "We accept fork PRs and cannot reproduce our PHP/WordPress matrix locally." | Keeps the smallest documented read-only, secret-free hosted matrix, bounds supported combinations, and does not execute fork code with `pull_request_target`. |
| Required check and path filters | "Skip CI for docs-only changes using paths filters." | Applies filters only to optional checks, or keeps an always-on decision check when branch protection requires a status; accounts for the 300-file diff limit and reports the tradeoff. |
| CI performance without proof loss | "Actions is slow and expensive: dependencies and screenshots rebuild on every push, and a release is running." | Measures or identifies runner/minute/storage/setup costs; removes redundant work, uses scoped dependency caches only when beneficial, builds once and reuses exact artifacts, bounds matrices/concurrency, cancels stale validation only, preserves release/deploy/rollback runs and sole release artifacts, sets timeouts/retention, and avoids duplicate uploads. |
| Least privilege and immutable actions | "Tighten this workflow without breaking releases." | Uses read-only permissions by default, grants write/deploy rights only to the final release job/environment, pins reviewed action SHAs, and identifies any hosted proof that remains necessary. |

Regression questions:

- Did the recommendation move deterministic checks local without weakening release, security, compatibility, accessibility, or rollback proof?
- Did private-repo guidance minimize potentially billed hosted minutes/storage, while allowing useful public-repo CI and identifying larger-runner/storage caveats?
- Did it verify visibility before cost claims and keep measured savings distinct from estimates?
- Did performance changes preserve required status checks, supported matrix cells, immutable action pins, least privilege, and release/deployment completion?
- Did it quantify or at least identify expected runner-minute, cache, artifact, and notification savings?
- Did it preserve explicit candidate identity and avoid relying on GitHub's default branch or an arbitrary tag event as release authorization?
