# Release, Backport, And Security

Use this for release phase decisions, backports, RC caution, and suspected vulnerabilities.

## Release Phase Awareness

Before proposing or landing changes, identify the current release phase:

- Early cycle: larger enhancements and refactors may be considered when scoped and reviewed.
- Feature freeze/beta: new enhancements become harder; bugs and regressions need stronger evidence.
- RC: be conservative. Changes usually need high confidence, focused scope, and appropriate committer review.
- Minor release: generally security fixes, critical bugs, and regressions only.

Do not assign release milestones or claim release inclusion unless maintainers have done so.

## Backports

Backports need extra discipline:

- Confirm the target branch and reason.
- Avoid unrelated cleanup.
- Preserve branch-specific compatibility.
- Include reviewed-by or merge context where maintainers require it.
- Retest on the target branch, not only trunk/main.

## Security Reports

If a suspected vulnerability affects WordPress Core, WordPress.org infrastructure, plugins/themes in official directories, or project systems:

- Do not open a public Trac ticket, GitHub issue, PR, or Make post with exploit details.
- Do not include proof-of-concept exploit details in public comments.
- Use the current official private reporting process, such as the WordPress security reporting guidance or HackerOne where applicable.
- Keep local notes factual: affected versions, impact, reproduction, preconditions, and suggested fix.

## Public Security-Adjacent Work

Some hardening changes are safe to discuss publicly when they do not reveal an active exploit. When uncertain, choose private disclosure first.

## Release Comment Shape

```text
Release impact: [trunk/beta/RC/minor]
Risk: [compatibility, regression, security, performance]
Reason for inclusion: [why this belongs now]
Testing: [target branch commands and manual checks]
Backport notes: [conflicts or branch differences]
```
