# Repo Product Docs Contract

Use this reference when a managed product repo lacks durable product, workflow, roadmap, release, or architecture truth.

## Product Truth Does Not Live Only In The Skill

The skill provides reusable orchestration behavior. Product-specific truth belongs in the product repo or GitHub.

Recommended repo docs:

- `AGENTS.md`: repo-specific agent workflow, branch rules, local validation gates, PR rules, hosted-CI exceptions, and automation constraints.
- `PRODUCT.md`: product positioning, target users/customers, product principles, free/pro boundaries, and non-goals.
- `ARCHITECTURE.md`: durable system owners, dependency/state boundaries, data and public contracts, failure behavior, migrations, and rollback when a compact set of ADRs is not enough.
- `DESIGN.md`: concise product design contract for admin UI patterns, screen hierarchy, components/controls, empty/loading/error/success states, accessibility, responsive behavior, WordPress.org/website assets, copy/tone, visual non-goals, and the default UI baseline. Use the [WordPress Design System](https://www.figma.com/community/file/1436359662053949167/wordpress-design-system) as the starting point, then layer each product's brand colors and product-specific identity on top of it.
- `CONTENT.md`: site information architecture, page purpose, editorial ownership, blocks/patterns, claim evidence, SEO/AEO/GEO, internal links, and publishing workflow when content operations are material.
- `TESTING.md`: canonical local fast/full/package commands, prerequisites, fixtures, environments, expected evidence, and any justified hosted-only checks.
- `ROADMAP.md`: milestone sequence, release intent, current priorities, and deferred work.
- `RELEASE.md`: beta/stable process, release/prerelease GitHub Actions boundary, canonical validation command reuse, packaging, main-first production merge/tag/release sequence, post-release ancestry and forward-sync checks, WordPress.org or marketplace steps, rollback notes.
- `PLAYGROUND.md`: repo-specific WordPress Playground preview rules, entry routes, test users, and packaging caveats when Playground support matters.
- `docs/decisions/ADR-xxxx.md`: material architecture or product decisions.

Do not create these files automatically for every repo. Recommend or create them only when a real durable gap exists and the user or repo workflow supports it.

For plugin, theme, or site implementation where missing project truth changes the architecture, use `wordpress-engineering-graph.md`. Inspect discoverable evidence first, ask only the unresolved blocking questions, and create or update the minimum necessary docs before crossing the affected ownership, design, data, proof, or release boundary. Do not fill policy files with guessed placeholders.

`DESIGN.md` is not a heavy design-system spec. Product orchestrators should create or adapt it only through duplicate-screened product issues, not blind docs churn. Prioritize products with active UI drift, onboarding risk, or an upcoming design-heavy train; keep it lightweight when the product surface is small.

Portfolio CTO and product POs should audit active products for missing, weak, or stale `AGENTS.md`, `DESIGN.md`, `TESTING.md`, and `RELEASE.md` guidance. Create focused GitHub issues instead of relying on chat instructions unless a tiny owner-approved docs fix is safer. Repo-specific workflow rules belong here; cross-product orchestration rules belong in the WP Expert skills and shared references.

Treat product docs as self-improving, not one-time setup. When a finding changes how future workers should behave, add or queue a concise repo-specific rule in `AGENTS.md`, `DESIGN.md`, `TESTING.md`, `RELEASE.md`, architecture docs, or relevant README/docs instead of leaving it only in chat memory.

## When To Update Docs

Update or recommend docs when:

- Repeated chats drift on the same branch, release, or product rule.
- A milestone or release train rule is ambiguous.
- A product decision affects multiple future issues.
- A repo automation needs stable local instructions.
- Hosted PR/push workflows duplicate locally reproducible checks, no canonical local validation entrypoint exists, or a hosted-CI exception lacks a documented reason.
- A release workflow can publish from `release/*`, auto-create a tag, or finish without proving the production tag is reachable from `main`.
- GitHub issue comments alone would hide important long-term context.
- An active product still depends on chat-only instructions for workflow, design, testing, or release behavior.
- A design-visible issue lacks before screenshots, or a design-visible PR lacks after screenshots.
- Unexpected behavior, maintainability debt, weak non-obvious comments, missing test coverage, repeated validation/tooling surprises, or workflow friction teaches a reusable product-specific rule.

Keep docs concise and repo-specific. Do not duplicate broad `wp-expert` or `wp-product-orchestrator` guidance in every product repo.
