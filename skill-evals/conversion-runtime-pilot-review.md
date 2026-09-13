# Conversion Runtime Pilot Review

## Portable Guidance Correction

2026-09-13, base `6594337`: removed the repository-only scenario dependency
from the installed conversion reference. Product work now uses its available
proof tooling and reports gaps. Repository scenario and rendered-evaluation
instructions live in TESTING.md, not the runtime skill.

Tested working-tree SHA-256:

- Conversion reference: `826f73df252f7253f926475b283cb55cbc3a02ca43b8440f33d6a3dbe93b580a`.
- TESTING.md: `7f80c58457dae2c6cb4ea752b593e07e1b06990950fe218aea9e35bafa846b9d`.

## Proof Tooling Review

The existing visual-proof schema already requires capture viewport, state,
environment, identity and result. Its validator requires evidence for passing
workflows and reasons for blocked/failed ones. CTA destination and untested-step
meaning still require review of the workflow evidence; structural validation
cannot establish that a journey happened. No duplicate schema, new dependency,
hook activation, or subjective taste-scoring hook was introduced.

## Frozen Pilot Contract

New synthetic Fieldnotes newsletter journey, independently implemented by
`/root/journey_candidate`, with source withheld from `/root/journey_observer`.
The observer receives the brief, contract, identity, runtime access and synthetic
data only. Parent has not read candidate source. The instruction boundary is not
an OS security sandbox.

- Contract SHA-256: `71fbf37d106cd18d713beeb3413afe265759b56d0f0c15a2c30aff728d75b180`.
- Initial candidate manifest SHA-256: `74a4857048602f3c67662cdb81c917ee854c543354b38878f2312415ba2d6f18`.
- Runtime: disposable WordPress 6.8.8, PHP 8.3, Playground CLI 3.1.53; calibration versions, not current-support claims.
- Listener independently checked as `127.0.0.1:9418`; no existing Studio/product site was used.
- Raw contract and reviewer artifacts: `/private/tmp/conversion-pilot-review-20260913/`.
- Private candidate source and manifest: `/private/tmp/conversion-pilot-20260913/`.

Temporary artifacts have no guaranteed durable retention. Native collaboration
messages retain the raw decision/proof handbacks; no credentials are copied here.
The case was not used to author the guidance under test. It is a fresh generated
journey, not the full held-out source-design execution benchmark: no external
reference target, licensed-media packet, or source-fidelity score was supplied.
No injected-defect answer key exists, so missed-defect and false-positive rates
cannot be calculated from this single case. No conversion improvement claim is
eligible from controlled synthetic interactions.

## Observed Result: Partial, Author Blocked

The source-blind observer exercised the initial unchanged candidate through CUA.
The actual session was auto-authenticated admin, not the intended Editor or an
anonymous visitor. The following results are bounded to that session:

| Gate | Observed result |
| --- | --- |
| Offer and CTA | Free essays/newsletter distinguished from optional future paid workshop; newsletter CTA reached the labeled local mock without payment. |
| Mock form | Empty/invalid input received correction and focus; synthetic valid input submitted by keyboard reached a truthful mock-success message. Refresh reset the state. No network/storage audit claimed. |
| Reading | One essay opened and was readable without newsletter signup; anonymous access and every link were not tested. |
| Responsive | CSS widths 1280, 768 and 390 sampled, scrollWidth equaled clientWidth, no observed overlap; focus and primary action usable in sampled interactions. |
| Author | BLOCKED: native editor chrome loaded, canvas blank after first visit and reload, Save disabled. No heading/link edits, save/reopen or frontend persistence proof. |
| Design | Parent inspected current viewport captures: coherent editorial hierarchy and readable offer/action; no confirmed frontend design defect in those samples. Not source fidelity or representative-user research. |

Initial full-page screenshots showed duplication/scaling anomalies. They were
retained but rejected as design evidence rather than labeled product defects.
Viewport-only replacements were inspected. CSS viewport/DPR metadata was recorded,
but captured PNG dimensions differed (for example desktop 1265x889 versus CSS
1280x900, DPR 1); these are not exact-pixel fidelity evidence.

Parent independently observed the same blank editor in a visible in-app tab.
One bounded implementer diagnosis confirmed editor HTML and the Core editor
script loaded; it established no safe source fix. Root cause remains unresolved,
not proven to be either candidate or host. Zero code repairs; original candidate
identity preserved. No iframe/security changes or API/store author-save shortcuts.

Raw observer report and screenshot hashes are in the `observer/` subdirectory
of the private review location above. Report SHA-256:
`d7369cb9a03b1882b657e0fbd2fb1aadb0112173078955c655f8421fc452c99a`;
screenshot-index SHA-256:
`3c001c88b0bc77fa7029b20ba1f7fda373eff3143caa1cf19a9a7597ded919d3`.
The first review ended at 12:58:47 UTC;
exact agent start time and host token telemetry were unavailable, so no measured
agent duration, cost or efficiency claim is made. No current baseline run record
or all-gates-passing visual receipt was admitted from this partial pilot.

Next proof should establish a working native editor in an explicitly approved
browser/runtime, then rerun heading/link UI save/reopen and frontend persistence
with an actual Editor session. Separately verify anonymous access. Do not add
more design rules or loosen the author gate to hide this unresolved blocker.
The task-owned runtime was stopped after review and port 9418 no longer listened;
temporary artifacts were preserved, not deleted.

## Validation And Publication

Full `npm test`, visual-validator self-test, shell syntax, Skill Creator validation
and Git whitespace checks passed. Existing route/headroom warnings remain.
Remote main was freshly checked at `b590bf659c462612e0612395194dfd0f5a532136`, with
no open PRs. Earlier local commits were preserved. Publication was not retried
after the prior rejection; local validation is not remote or installed adoption.
