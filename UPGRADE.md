# Upgrade Guide

The skill pack currently uses validated rolling `main` distribution. `VERSION` names the development stream; use the Git commit for exact identity. Do not infer a tagged release from `VERSION` or `CHANGELOG.md`.

## Update A Git Installation

```bash
cd /path/to/agent-skills
git status --short --branch
git pull --ff-only origin main
bash scripts/install-global-skill-links.sh --refresh
```

Start from a clean checkout. If it is dirty or cannot fast-forward, stop and inspect the divergence instead of resetting it. Updating the checkout updates the code behind the existing links; `--refresh` checks those selections in place. It neither installs missing skills nor registers a new host. An empty host stays empty, and Codex and Claude Code may have different selections. Review stale or moved paths manually. A link check is not proof of host discovery. npm is not required for this consumer update; maintainers use [the full validation gate](TESTING.md#full-gate).

For Antigravity, run the installer from the same shared checkout registered in
`~/.gemini/config/skills.json`. `--refresh` preserves an explicit Antigravity list rather than adding new public names. If you deliberately want **the full current catalog, including newly added skills**, run `bash scripts/install-global-skill-links.sh` without arguments. That command installs all skills in both link-based hosts and syncs the already registered Antigravity list. To add just one public skill, pass its name instead. Use
`bash scripts/install-global-skill-links.sh --antigravity` for first-time
registration and `bash scripts/install-global-skill-links.sh --check-antigravity`
for read-only verification of a full registration. Refresh reports a stale name or an unfiltered Antigravity entry for manual review without rewriting it. Inspect an obsolete or foreign link rather than using `--force` as an upgrade shortcut. If you move the checkout, review the old manifest
entry yourself; the installer does not remove entries for other paths.

## Update A ZIP Installation

Use a reviewed archive at the same stable path, preserving any local work. Run `bash scripts/install-global-skill-links.sh --refresh` there to check existing Codex and Claude selections. If the path changed, inspect the old links instead of assuming the new checkout owns them. Antigravity registration and sync require a Git checkout.

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
bash scripts/install-global-skill-links.sh --refresh
```

Restart Codex or Claude after changing skill links if the host caches discovery metadata.
