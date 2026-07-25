# Testing Agent Skills

## Fast Gate

```bash
git diff --check
git show --check --oneline --no-renames HEAD
bash -n scripts/*.sh
npm ci
npm test
bash scripts/skill-token-audit.sh
bash scripts/skill-routing-audit.sh
```

The shared `agent-harness` owns generic route-budget, scenario-inventory, and sanitized run-record validation. Repository-specific skill frontmatter/body limits and routing contracts remain in the local shell audits. Routine validation is local-first; the hosted workflow is manual and supplemental.

## Full Gate

```bash
bash scripts/validate-references.sh
bash scripts/install-links-smoke.sh
```

When the local Skill Creator is installed, also run `quick_validate.py` for every changed skill folder.

## Behavioral Gate

Use `skill-evals/README.md`. Run changed-role scenarios with a fresh agent and raw artifacts for changes affecting authority, routing, release behavior, hallucination controls, design execution, runtime assurance, graph closure, or owner-correction learning. Store a sanitized run record or durable evidence pointer with the changed behavior.

Green grep/structure audits do not prove the behavior is correct.
