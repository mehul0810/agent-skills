# Testing Agent Skills

## Fast Gate

Read-only explanation/review does not require installation or a publication gate.
During implementation run affected checks; use `npm ci` when the lockfile changes
or establishing a clean dependency environment. Run the full aggregate once before
publication, not after every tool call or literal substitution.

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

For design calibration, use `skill-evals/frontend-benchmark/README.md`. Give independent evaluators only its contract and rendered artifacts. Record detected/missed defects separately from deterministic smoke checks; the fixture is not native WordPress or production repair proof.

For source-design implementation capability, run `skill-evals/frontend-benchmark/EXECUTION.md`: a frozen held-out target, fresh native WordPress implementation, independent fidelity and UI-only author proof, and bounded repair. Report actual failed/blocked gates; a discrimination or persistence-only pass does not satisfy this execution test.

For shared harness/topology changes, run `node scripts/check-agent-consumers.mjs <skills-root> <loop-root> <book-root>` against explicit local checkouts. Different pins are allowed only with passing consumer contracts; this read-only check does not upgrade dependencies or establish live runtime adoption.

Measure available token usage, elapsed time, handoffs, retries, reopened defects, and accepted completion over a comparable task set. Missing telemetry is unavailable, not zero. Word budgets and faster validators alone do not establish end-to-end token savings.
