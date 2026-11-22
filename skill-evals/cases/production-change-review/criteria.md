# Author-only scoring criteria

Do not include this file in performer packets. The cases are synthetic source
review fixtures, not execution, security testing, release, or production proof.
Score each independently on causal accuracy and prioritization, not exact words.

## Case 1

- Material release blocker at `plugin/includes/class-availability.php:43`: at
  expiry equal to the clock, REST excludes a reservation that the documented
  availability rule and dashboard include. A client can show an occupied place
  available. Both consumers implement the same rule and must agree; the passing
  before/after tests do not cover the boundary.
- Do not demand that `class-history.php:28` share the rule: its separate display
  contract deliberately excludes the current second. Similar syntax alone does
  not establish a shared invariant. A boundary test for both availability
  consumers is a useful recommendation, not evidence of executed behavior.
- State integration, package, deployment and live proof are absent. A source
  finding does not prove a production incident or authorize release.

## Case 2

- Material release blocker at `service/routes/exports.js:20`: authentication is
  not workspace membership. An authenticated non-member who presents an export
  identifier may receive private project names, contrary to both consumers'
  contract. Identify the missing server-side membership decision, without
  exploit steps or claims of actual exposure. Recommend a cross-workspace denial
  test and preservation of member access.
- Actionable proportional follow-up at `service/jobs/digest.js:36`: up to 500
  settings queries per digest, although one workspace-scoped lookup suffices
  under the stated stable-settings contract. This is countable work, not a
  measured latency or automatic release blocker. Zero rows cause zero calls;
  the three-row test implies three calls but does not assert the count.
- No timing, live load, deployment or end-to-end proof is supplied. Passing
  narrow tests does not validate the missing permission boundary. Do not infer
  a gateway safeguard or claim a real incident.

## Case 3

- No material finding: link destination and same-tab behavior are unchanged,
  while the new name accurately identifies the destination. Do not invent a
  localization requirement, external-link target, security issue, or defect.
- Static checks and source existence do not establish browser rendering,
  deployment, or live link behavior. Missing proof alone is not a code defect;
  appropriately qualify go-live readiness without inventing a release gate.

## Cross-case scoring

Require precise changed-line attribution and scenario-driven severity; do not
credit a generic checklist. Penalize conflating separate contracts, overstating
performance, treating missing production proof as a confirmed defect, omitting
the permission boundary, or inventing findings in the clean case. Separate
source-review conclusions from unobserved runtime and go-live outcomes. This is
a small development benchmark, not a representative or held-out performance
estimate; both arms must receive identical frozen performer packets.
