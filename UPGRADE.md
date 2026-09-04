# Upgrade Guide

The skill pack currently uses validated rolling `main` distribution. `VERSION` names the development stream; use the Git commit for exact identity. Do not infer a tagged release from `VERSION` or `CHANGELOG.md`.

## Update A Git Installation

```bash
cd /path/to/agent-skills
git status --short --branch
git pull --ff-only origin main
npm ci
npm test
bash scripts/install-global-skill-links.sh
bash scripts/check-global-skill-links.sh
```

Preserve local changes. If the checkout is dirty or cannot fast-forward, inspect the divergence instead of resetting it.

## Update A ZIP Installation

Replace the repository directory with the reviewed archive, then rerun installation and validation. Existing global links should resolve to the new repository location; recreate them when the path changed.

## Product Repo Kit

The product kit is independently versioned in `templates/product-repo/.codex/product-agent-kit.version`.

```bash
bash scripts/install-product-agent-kit.sh --check /path/to/product-repo
bash scripts/install-product-agent-kit.sh --stage-update /path/to/product-repo
```

The installer never overwrites active product files. Review staged candidates and merge only relevant rules.

## Current Contract Migrations

### Quality Review Schema v2

Regenerate old formal quality-review receipts. Current reports require immutable target identity, explicit domain dispositions, structured evidence, comparable performance measurements where applicable, and fresh source-aware evidence for critical fixes.

### WordPress Visual Proof Schema v3

Regenerate v2 receipts. Schema v3 requires distinct candidate artifacts, workflow/environment coverage per scoped surface, structured token implementation evidence, and affected capture/workflow/environment identities for fixed defects.

```bash
node wp-expert/scripts/validate-visual-proof.mjs --example
node wp-expert/scripts/validate-visual-proof.mjs /path/to/proof.json
```

The validator rejects prior schema versions rather than silently upgrading evidence claims.

## Troubleshooting

```bash
git rev-parse HEAD
cat VERSION
bash scripts/check-global-skill-links.sh
bash scripts/validate-references.sh
```

Restart Codex or Claude after changing skill links if the host caches discovery metadata.
