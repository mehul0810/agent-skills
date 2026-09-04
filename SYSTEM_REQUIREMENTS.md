# System Requirements

This file defines tools needed to maintain and validate this skill repository. Product runtime requirements come from the target repository and current upstream support policy, not from a frozen table here.

## Repository Toolchain

- Git with worktree and ordinary branch-inspection support.
- Node.js matching `.nvmrc` and `package.json#engines`. Run `npm ci`; do not substitute an EOL line. The checked 2026-09-04 baseline is Node 24 LTS.
- npm from that Node distribution.
- Bash 3.2 or newer. Repository scripts intentionally avoid Bash 4-only features and are checked with `bash -n` plus runtime self-tests.
- Python 3 only for Skill Creator's optional `quick_validate.py`.
- `gh` only for live GitHub inspection or owner-authorized mutations.

Authoritative current support sources are registered in `shared/source-freshness.json`. The local audit fails when a selected source exceeds its review window.

## WordPress Product Runtime

Do not impose this repository's Node version or a generic WordPress/PHP/database floor on a product checkout. For implementation and proof:

1. Read its `AGENTS.md`, manifests, compatibility docs, deployment/VIP policy, and release metadata.
2. Select actively supported non-EOL tools compatible with the product's declared floor and deployment target.
3. Test the declared minimum and current supported cells when compatibility risk is material.
4. Use the current [WordPress requirements](https://wordpress.org/about/requirements/), [PHP support windows](https://www.php.net/supported-versions.php), and [Node release status](https://nodejs.org/en/about/previous-releases) as live evidence rather than copying numbers without a product reason.

## Optional Proof Tooling

Most skill validation does not require a WordPress install or browser. Runtime claims do.

- Product projects may provide WordPress Studio, `wp-env`, `wp-proof`, Playground, WP-CLI, PHPUnit, PHPCS/WPCS, PHPStan, ESLint, Playwright, or project-specific tools.
- The spatial capture adapter intentionally does not install Playwright. Run it in a product project that already provides Playwright or use that project's browser harness.
- Authenticated captures may use `storageStatePath`. Keep the state file local, ignored, and outside committed evidence because it can contain impersonation-capable cookies or headers.
- Local HTTPS proof may require project-approved handling for self-signed certificates; do not weaken production TLS policy.

## Install And Validate

```bash
npm ci
npm test
bash scripts/validate-references.sh
bash scripts/install-global-skill-links.sh
bash scripts/check-global-skill-links.sh
```

Run changed skill folders through Skill Creator's `quick_validate.py` when available. See `TESTING.md` for the complete gate.

## Version Identity

`VERSION` identifies the current development stream. The exact Git commit is the authoritative immutable identity. This repository distributes validated `main`; it does not imply that every main commit is a tagged GitHub release.
