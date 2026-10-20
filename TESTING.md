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

The aggregate runs checks sequentially with a 120-second per-command deadline,
a 16 MiB combined stdout/stderr capture limit, and a 250 ms SIGTERM-to-SIGKILL
grace period, followed by a 500 ms final drain bound. On POSIX, timed-out or
completed commands have their owned process group signaled; escaped sessions
remain outside this boundary and unfinished stream cleanup is reported as a
failure. Run-record batches use the pinned harness `validateRunFile` API once
per file rather than starting a CLI process for every record.

The shared `agent-harness` owns generic route-budget, scenario-inventory, and sanitized run-record validation. Repository-specific skill frontmatter/body limits and routing contracts remain in the local shell audits. Routine validation is local-first; the hosted workflow is manual and supplemental.

## Full Gate

```bash
npm test
```

When the local Skill Creator is installed, also run `quick_validate.py` for every changed skill folder.

`npm test` is the aggregate publication gate: it runs reference/domain/token/routing checks, record validation, regression self-tests, and install-link proof once at their owning layer. It prints timings and expands failures. Do not repeat the full gate without changed inputs. During iteration use the affected `validate:*` command or reference mode; those focused checks do not replace the final gate. Shell syntax and Skill Creator checks remain separate.

## Behavioral Gate

Honor the standing owner exclusion of macOS VoiceOver and voice-over narration verification. Do not execute or request these checks, substitute another screen reader to recreate them, or block ordinary completion solely on their absence. Mark them excluded by owner direction, not passed. Synthetic tests of exclusion receipts and fresh-agent decisions remain required for changes to this policy; they do not perform the excluded checks. Retain all other applicable accessibility, safety, artifact-identity and formal-claim gates. A later explicit owner request can restore the named check for its scope.

Use `skill-evals/README.md`. Run changed-role scenarios with a fresh agent and raw artifacts for changes affecting authority, routing, release behavior, hallucination controls, design execution, runtime assurance, graph closure, or owner-correction learning. Store a sanitized run record or durable evidence pointer with the changed behavior.

Green grep/structure audits do not prove the behavior is correct.

For content-migration changes, the aggregate includes
`node scripts/test-content-migration-regression.mjs`. Also run the blind
`skill-evals/cases/content-migration-integrity/input.json` requests with a fresh
agent, keeping criteria outside its context. Exercise source discovery, changing
query membership, failed writes/checkpoint resume, bounded stops and empty-source
counterexamples. These synthetic mechanics do not prove a real source inventory,
WordPress migration, production-data integrity or rollback.

For role-specific worker completion or cadence freshness, use the blind
`skill-evals/cases/chat-governance-corrections/input.json` packet, including
owner-created tasks, active corrections, missing handoff acknowledgement and
expired-override counterexamples. These are decisions, not real archival or
schedule changes. For brand identity, inspect the raw vectors and rendered
desktop/mobile gallery in `skill-evals/cases/brand-identity-regression/input.json`;
palette fit cannot substitute for exact marks or approval evidence. The separate
native pilot retains its own write/structure/authoring gates.

Freeze the applicable owning router and material support references into decision
packets, not just the files changed by the patch. Check route reachability before
dispatch. Missing guidance makes coverage incomplete; correct the packet and
rerun the affected requests without weakening criteria or hiding earlier attempts.

For cross-project GitHub writing changes, use the blind packet in
`skill-evals/cases/github-communication/` and score separately against its
author-only `criteria.md`. Cover title/body consistency, explicit upstream
exceptions, small-change proportionality and honest proof limits. These are
synthetic writing decisions, not live GitHub posting or reader-comprehension proof.

For system-health reviewer changes, dispatch the blind
`skill-evals/cases/system-health-reviewer/input.json` packet and score against
`skill-evals/system-health-reviewer-scenarios.md` outside the evaluator context.
Treat these as synthetic decisions, not live retrieval/automation proof. Re-run
affected governance baselines when an owning router changes.

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

For video changes, use `skill-evals/video-quality-benchmark.md`: blind production
decisions, crop/zoom coverage, rendered defect controls and native UHD delivery are
separate gates. Cross-model decision passes do not prove equal generated quality.

For design calibration, use `skill-evals/frontend-benchmark/README.md`. Give independent evaluators only its contract and rendered artifacts. Record detected/missed defects separately from deterministic smoke checks; the fixture is not native WordPress or production repair proof.

For creative exploration changes, use `skill-evals/creative-exploration-scenarios.md`.
Freeze guidance before a separate author prepares an unseen held-out brief; keep
criteria outside generation packets. Independently inspect the actual concept
artifacts at desktop and mobile. Check useful differences, brief fit, truthful
content and safe repetition/exact-target counterexamples, not a numeric creativity
score. These checks do not establish native authoring, production usability or
business impact. Preserve failed attempts; a held-out case used to tune a fix must
become development material and be replaced before claiming transfer.

For source-design implementation capability, run `skill-evals/frontend-benchmark/EXECUTION.md`: a frozen held-out target, fresh native WordPress implementation, independent fidelity and UI-only author proof, and bounded repair. Report actual failed/blocked gates; a discrimination or persistence-only pass does not satisfy this execution test.

For Pen-to-WordPress acceptance changes, also dispatch the blind
`skill-evals/cases/pen-wordpress-acceptance/input.json` packet. It tests stale
composition, text-only source inspection, capture calibration, surface-specific
proof invalidation and contradictory status, plus a safe directional exception.
These decision cases supplement, never replace, the native execution benchmark.

For native Figma/Pen authoring routes, run `skill-evals/native-design-authoring-scenarios.md` through its blind input packet. Use `skill-evals/frontend-benchmark/NATIVE-DESIGN.md` for actual artifact execution; decision checks cannot pass native structure, save/reopen, transfer or production gates.

For shared harness/topology changes, run `node scripts/check-agent-consumers.mjs <skills-root> <loop-root> <book-root>` against explicit local checkouts. Different pins are allowed only with passing consumer contracts; this read-only check does not upgrade dependencies or establish live runtime adoption.

The consumer check also accepts `--json` and `--source-root <agent-harness-checkout>`. It reports source HEAD, consumer pin/lock, installed validation-byte fingerprint, and local contract validation separately. With a source checkout, it compares installed bytes to the pinned Git commit, never to an assumed latest release. Native host loading and task outcomes remain unavailable until independently observed. See [attempt evidence](skill-evals/attempt-evidence.md) for bounded first-attempt, recovery, activation and rendered-result receipts.

Measure available token usage, elapsed time, handoffs, retries, reopened defects, and accepted completion over a comparable task set. Missing telemetry is unavailable, not zero. Word budgets and faster validators alone do not establish end-to-end token savings.

## Portable Platform Proof

Run `node --test scripts/test-platform-proof.mjs` for the optional non-WordPress receipt validator. It checks bounded local artifact integrity, platform/runtime compatibility and truthful clause-status representation, not capture authenticity or appearance quality. WordPress retains its existing proof adapter. Use fresh task-matched agents for routing decisions, actual runtime artifacts for behavior, and separate visual comparisons for creative-quality claims. Blocked native/browser execution must remain blocked. Never refresh historical behavior fingerprints solely to turn the aggregate green.
