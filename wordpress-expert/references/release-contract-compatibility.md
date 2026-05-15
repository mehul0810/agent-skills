# Release Contract And Backward Compatibility Policy

Use this when deciding whether to preserve backward compatibility, add migrations, keep legacy REST fields, support old option/meta keys, retain hooks/filters, keep block attributes, or add fallback code while a feature is being reworked before launch.

## Core Rule

Backward compatibility is for launched contracts and real user/client environments. It is not for every intermediate implementation created while an unreleased feature is still being designed.

If a feature, product, API, data model, option, UI, block, or behavior has not been released to the target audience, prefer a clean replacement over compatibility shims for abandoned internal shapes.

Do not add compatibility for unreleased intermediate versions unless one of these is true:

- The intermediate version reached real users, real client preview users, public beta/RC testers, or production behind a feature flag.
- Production data was written with the old shape and must be preserved.
- A documented external contract, integration, API consumer, hook/filter consumer, block markup, or template override already depends on it.
- The user explicitly asks to preserve an unreleased shape for demo, QA, migration, or branch compatibility reasons.

## Release State Matrix

- Internal-only first launch work: no backward compatibility required for intermediate schemas, option names, routes, components, copy, or UI flows. Rework cleanly.
- In-progress next version before release: preserve compatibility with the last released version, not with every draft implementation in the current release branch.
- Private client preview: treat as released for that client if their environment has real data or receives release notes; use targeted migration or compatibility only for that audience.
- Public beta/RC: treat tester-facing behavior and data as released enough to require explicit migration/fallback decisions.
- Feature flag in production: treat enabled cohorts and written production data as released, even if the feature is not generally available.
- Public stable release: normal backward compatibility rules apply.

## WordPress Contract Surfaces

Check whether these were released before preserving them:

- Options, transients, custom table schemas, meta keys, taxonomy terms, post types, statuses, and serialized data shapes.
- REST routes, request/response schemas, permissions, nonces, AJAX actions, admin-post actions, webhooks, and external API payload mappings.
- Hooks, filters, actions, shortcode names/attributes, block names, block attributes, block markup, template paths, theme overrides, asset handles, localized JS object names, and WP-CLI commands.
- Admin settings, default values, capabilities, onboarding flows, emails, cron/action scheduler hooks, queue payloads, cache keys, and feature flags.
- Public docs, client docs, changelog/release notes, support snippets, and third-party integration examples.

## Decision Workflow

1. Identify the target audience and release state: internal, preview, beta/RC, feature flag, stable.
2. Compare against the last released version/tag, not against every local commit.
3. Identify whether real production/client data exists in the old shape.
4. Identify whether external consumers could depend on the old contract.
5. If not released and no real data/consumer exists, remove the old path and simplify.
6. If released or real data exists, choose the smallest safe compatibility approach: migration, fallback read, versioned route, deprecation, or temporary shim.
7. Put compatibility removal on a timeline when a temporary shim is added.
8. Test the compatibility path only for released/real data states, not abandoned unreleased drafts.

## Preferred Approach For Unreleased Rework

When improving an unlaunched feature:

- Rename option/meta keys, DB columns, REST fields, block attributes, and component APIs freely if it improves the final contract.
- Delete dead draft code instead of supporting it.
- Replace draft migrations with a single launch-ready migration path.
- Update fixtures, tests, docs, screenshots, and changelog entries to describe the final launched behavior.
- Remove draft feature flags, route aliases, compatibility wrappers, old selectors, stale cache keys, and abandoned JS/PHP APIs before launch.
- Keep only cleanup code needed for shared dev/staging environments when reset is not practical, and mark it as non-production cleanup.

## Required Compatibility For Launched Work

When improving a launched feature:

- Preserve existing user data or migrate it idempotently.
- Keep backward-compatible reads for renamed option/meta keys when production may contain old values.
- Version REST routes or preserve response fields when external consumers may depend on them.
- Keep hooks/filters/shortcodes/block attributes working or deprecate with a documented replacement.
- Maintain template override compatibility when themes may override plugin templates.
- Communicate breaking changes in changelog/release notes and use a major version when the project follows SemVer.

## Migration And Shim Discipline

- Compatibility shims should be small, observable, documented, and tied to a released source version.
- Avoid permanent dual-write or dual-read code unless the contract genuinely needs long-term support.
- Do not migrate non-production draft data in production activation code.
- For large data migrations, use batched, resumable, idempotent jobs instead of activation-time work.
- Log only redacted migration summaries; never log sensitive data while migrating old shapes.

## Review Checklist

- Is this compatibility path preserving a released contract or just a draft implementation?
- Did the old shape reach production, public beta, feature-flag users, private client preview, or external developers?
- Is there real user/client data in the old shape?
- Can the old code be deleted before launch instead of shimmed?
- Does the changelog describe only released compatibility impact, not internal draft churn?
- Are tests focused on released-version compatibility and final launch behavior?
- Is any temporary shim documented with a removal condition or version?
