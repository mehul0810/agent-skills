# Testing Agent Skills

## Fast Gate

```bash
git diff --check
git show --check --oneline --no-renames HEAD
bash -n scripts/*.sh
npm ci
npm test
```

The shared `agent-harness` owns generic route-budget, scenario-inventory, and sanitized run-record validation. Repository-specific skill frontmatter/body limits and routing contracts remain in the local shell audits. Routine validation is local-first; the hosted workflow is manual and supplemental.

## Full Gate

```bash
npm test
```

When the local Skill Creator is installed, also run `quick_validate.py` for every changed skill folder.

`npm test` is the aggregate publication gate: it runs reference/domain/token/routing checks, record validation, regression self-tests, and install-link proof once at their owning layer. It prints timings and expands failures. Do not repeat the full gate without changed inputs. During iteration use the affected `validate:*` command or reference mode; those focused checks do not replace the final gate. Shell syntax and Skill Creator checks remain separate.

## Behavioral Gate

Use `skill-evals/README.md`. Run changed-role scenarios with a fresh agent and raw artifacts for changes affecting authority, routing, release behavior, hallucination controls, design execution, runtime assurance, graph closure, or owner-correction learning. Store a sanitized run record or durable evidence pointer with the changed behavior.

Green grep/structure audits do not prove the behavior is correct.
