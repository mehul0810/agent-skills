# Held-Out Design To WordPress Execution

Use this benchmark to test implementation capability, not merely recognition of
injected defects. Keep the existing rendered fixture for cheap discrimination
checks. This protocol adds no mandatory reading to routine design tasks.

## Prepare And Freeze

An independent case author supplies one unfamiliar editorial or marketing page:
header, asymmetric hero with a real local asset, primary CTA, next-section
transition, and footer. Include truthful final copy, locally usable font files
with licensing/provenance, media and crop intent, and full-page reference PNGs at
1280 x 900, 768 x 900, and 390 x 900 CSS viewports. Record browser, DPR, viewport,
source dimensions, SHA-256 hashes, and source creation time before dispatch.

Keep source HTML/CSS, answer keys, and author diagnostics outside the implementer
packet. Provide only the brief, approved screenshots, fonts/media and provenance,
and acceptance contract. The implementation worker may inspect these supplied
design artifacts, but must not inspect the reference implementation. The case
must not have informed the skill changes under test. Record exposure per actor;
filesystem separation is an instruction boundary, not a security sandbox.

Freeze the exact skill Git revision, packet hashes, intended WordPress runtime,
and acceptance criteria before work. Missing fonts/assets or an unbootable native
runtime blocks the attempt; do not substitute the static fixture. Use a new,
task-owned disposable environment, never an existing Studio/product site.
Name the evidence destination, access and retention expectations before dispatch;
if only temporary storage is available, retain a durable sanitized summary and
explicitly mark raw artifact retention unproven. Define a local/mock CTA outcome;
do not submit external payments, signups, messages or analytics during the test.

## Execute

Give a fresh worker the packet, `wp-site-expert/SKILL.md`, and an authorized
disposable runtime. Let normal routing select theme ownership and supporting
references. Do not supply expected CSS, implementation hints, earlier solutions,
or grading results before the first candidate is frozen.

Require a complete saved native block composition with scoped theme styling,
real fonts/media, and frontend/editor ownership. Follow the existing visual
implementation contract; do not create a second proof schema. Record the
candidate file hashes and runtime identity before each independent review.

First prove header, hero, CTA and next-section transition, then finish the page.
Capture every required width with fonts/media ready, fixed input data and stable
animations. Include source/candidate overlays or region comparisons, not just
candidate screenshots. Do not resize either image to conceal scale drift.

## Independent Acceptance

Give a different source-blind evaluator only this contract, the frozen packet,
candidate identity, running URL/access method, and rendered artifacts. Also allow
the pinned `shared/schemas/wordpress-visual-proof.schema.json`,
`shared/schemas/wordpress-spatial-proof.schema.json` and matching
`wp-expert/scripts/validate-{visual,spatial}-proof.mjs` dependencies for receipt
validation; these are proof infrastructure, not candidate implementation. Withhold
implementation, rationale, source history and author diagnostics. Evaluate:

| Gate | Required observable proof |
| --- | --- |
| Fidelity | Source-matched containers, heading font/weight/wraps, hero proportions, CTA bounds, media crop, section starts, borders and radii at all three widths. Investigate hard-edge differences above 2 CSS px; unexplained material differences fail. |
| Visual quality | Coherent hierarchy, readable copy, balanced rhythm, no overlap/clipping/overflow, and no placeholders replacing supplied assets. Score separately from fidelity. |
| Visitor | Keyboard navigation, visible focus and CTA completion; intermediate resize and one long-content stress do not break the task. |
| Author | Through visible editor controls, change heading, replace media and edit a link, save, reopen, and verify frontend changes. Insert/reorder an allowed native region without code and verify persistence. API/store-only mutation or saving cannot pass this gate. |
| Editor parity | Readable canvas with intended fonts, media and layout; no invalid-block recovery; author controls remain usable. DOM persistence alone cannot pass. |
| Provenance | Exact source/candidate/runtime identity, immutable captures and different implementer/evaluator identities. Missing evidence is blocked. |

Record each gate as pass/fail/blocked with evidence. All gates must pass; never
average fidelity, design quality and usability into an overall passing score.
This is controlled task usability, not representative-user research or production
release proof. Native persistence calibration is not a substitute.

Return observable defects to the implementer, preserving initial captures. Allow
at most two focused repair cycles under the unchanged contract, retaining defect
IDs and affected reproof. If still failing, report failed execution; reopening
the design contract starts a new attempt and cannot retroactively pass this one.

For acceptance claims, use the existing visual-proof v3 and spatial receipts and
their validators. Receipt integrity is necessary, not independent aesthetic
judgment. Failed/blocked attempts still retain their raw evidence and exact gaps;
never manufacture a passing receipt just to complete the benchmark.

## Record And Repeat

Store a compact durable evidence note: tested revision, case/packet hashes,
actor identities and contamination, runtime/build, initial and final gate
verdicts, evidence location, observed repair count, non-zero elapsed time, and
host-reported usage when available. Missing usage is unavailable, not zero.
Keep raw screenshots/traces in the governed evidence location; temporary paths
are explicitly non-durable. Use the existing harness sanitized run-record format
when admitting a behavior baseline, rather than inventing a benchmark telemetry
format.

One attempt demonstrates only that case. Report accepted attempts / total,
defects and repairs for repeated fresh attempts; do not claim reliability or
token savings from one run. Once findings inform a skill fix, retire the case to
development and obtain a new private case before claiming held-out improvement.
Broaden to another composition or interaction only when a failure justifies it.
