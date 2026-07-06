# Repo Product Docs Contract

Use this reference when a managed product repo lacks durable product, workflow, roadmap, release, or architecture truth.

## Product Truth Does Not Live Only In The Skill

The skill provides reusable orchestration behavior. Product-specific truth belongs in the product repo or GitHub.

Recommended repo docs:

- `AGENTS.md`: repo-specific agent workflow, branch rules, validation gates, PR rules, and automation constraints.
- `PRODUCT.md`: product positioning, target users/customers, product principles, free/pro boundaries, and non-goals.
- `DESIGN.md`: concise product design contract for admin UI patterns, screen hierarchy, components/controls, empty/loading/error/success states, accessibility, responsive behavior, WordPress.org/website assets, copy/tone, and visual non-goals.
- `ROADMAP.md`: milestone sequence, release intent, current priorities, and deferred work.
- `RELEASE.md`: beta/stable process, packaging, release train rules, WordPress.org or marketplace steps, rollback notes.
- `docs/decisions/ADR-xxxx.md`: material architecture or product decisions.

Do not create these files automatically for every repo. Recommend or create them only when a real durable gap exists and the user or repo workflow supports it.

`DESIGN.md` is not a heavy design-system spec. Product orchestrators should create or adapt it only through duplicate-screened product issues, not blind docs churn. Prioritize CleanLinks and Aculect first, add OneSMTP early enough to shape UI, and keep PreviewShare/WP Distraction Free View lightweight unless the surface grows.

## When To Update Docs

Update or recommend docs when:

- Repeated chats drift on the same branch, release, or product rule.
- A milestone or release train rule is ambiguous.
- A product decision affects multiple future issues.
- A repo automation needs stable local instructions.
- GitHub issue comments alone would hide important long-term context.

Keep docs concise and repo-specific. Do not duplicate broad `wp-expert` or `wp-product-orchestrator` guidance in every product repo.
