# Testing Agent Skills

## Fast Gate

```bash
git diff --check origin/main...HEAD
bash -n scripts/*.sh
npm ci
npm run harness
bash scripts/skill-token-audit.sh
bash scripts/skill-routing-audit.sh
```

The shared `agent-harness` owns generic route-budget and scenario-inventory validation. Repository-specific skill frontmatter/body limits and routing contracts remain in the local shell audits.

## Full Gate

```bash
bash scripts/validate-references.sh
bash scripts/install-links-smoke.sh
```

When the local Skill Creator is installed, also run `quick_validate.py` for every changed skill folder.

## Behavioral Gate

Use `skill-evals/README.md`. Run changed-role scenarios with a fresh agent and raw artifacts for changes affecting authority, routing, release behavior, hallucination controls, design execution, or owner-correction learning. Record loaded references, decision, evidence, and failures in the PR.

Green grep/structure audits do not prove the behavior is correct.
