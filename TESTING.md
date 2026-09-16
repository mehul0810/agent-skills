# Testing Agent Skills

## Python Setup

The aggregate requires Python 3.11 or newer with the standard-library `tomllib`
module. Before any checks run, it probes `PYTHON` when set, otherwise `python3`
from `PATH`. An incompatible or missing interpreter fails immediately; the runner
does not search for another version or install anything. `PYTHON` must be one
executable name or path, not a shell command or a command with flags:

```bash
PYTHON=/absolute/path/to/python3.11 npm test
```

Both aggregate agent-profile checks use that exact executable. This override does
not rewrite `PATH` or change standalone commands. For individual Python checks,
invoke the same executable explicitly. A virtual environment can instead put its
compatible `python3` first on `PATH`.

Optional Skill Creator `quick_validate.py` checks also require PyYAML in the
interpreter used to run them. PyYAML is not required by the aggregate profile
checks. If running those optional checks, create a compatible virtual environment
and explicitly install the dependency before invoking the validator:

```bash
python3.11 -m venv "$HOME/.venvs/agent-skills"
"$HOME/.venvs/agent-skills/bin/python" -m pip install PyYAML
"$HOME/.venvs/agent-skills/bin/python" /path/to/skill-creator/scripts/quick_validate.py /path/to/changed-skill
```

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

For conversion-guidance changes, use `skill-evals/conversion-journey-scenarios.md`.
This is repository evaluation infrastructure, not an installed-skill dependency.
Supplement decision cases with a fresh rendered journey: supply only a frozen
brief and rendered candidate to the independent reviewer, retain safe
counterexamples, and record detected defects, missed defects, and false positives.
Use the existing visual-proof capture fields for viewport/state/identity and
workflow evidence for the actual CTA destination, result, and untested steps.
An incomplete pilot stays incomplete; a static analogue cannot pass native
WordPress authoring, and a rendered pass cannot establish business impact.

For recurring multi-step product proof, adapt
`templates/operational-proof/README.md` in the owning product. It separates fixture
readiness from real-control journeys and links existing harness run records to
private evidence. It is opt-in, not extra setup for small fixes. For repository
review-rule changes, use `skill-evals/scoped-review-workflow-scenarios.md` and test
safe counterexamples as well as violations and ordinary bugs.
For native hook activation proof, use `templates/project-hooks/activation-proof.md`;
it records existing boundaries without enabling hooks or changing trust.

For design calibration, use `skill-evals/frontend-benchmark/README.md`. Give independent evaluators only its contract and rendered artifacts. Record detected/missed defects separately from deterministic smoke checks; the fixture is not native WordPress or production repair proof.

For source-design implementation capability, run `skill-evals/frontend-benchmark/EXECUTION.md`: a frozen held-out target, fresh native WordPress implementation, independent fidelity and UI-only author proof, and bounded repair. Report actual failed/blocked gates; a discrimination or persistence-only pass does not satisfy this execution test.

For shared harness/topology changes, run `node scripts/check-agent-consumers.mjs <skills-root> <loop-root> <book-root>` against explicit local checkouts. Different pins are allowed only with passing consumer contracts; this read-only check does not upgrade dependencies or establish live runtime adoption.

Measure available token usage, elapsed time, handoffs, retries, reopened defects, and accepted completion over a comparable task set. Missing telemetry is unavailable, not zero. Word budgets and faster validators alone do not establish end-to-end token savings.
