# Community Intake And Repo Hygiene

Use this reference for external contributor/community PRs and issues, plus repo hygiene around AI-friendly templates and WordPress Playground previews.

## Contributor PR Courtesy Protocol

- Treat human contributor PRs as a first-class intake lane: PRs opened by someone other than `@mehul0810` or automation/bots.
- Acknowledge human contributor PRs within 24 hours when feasible.
- Do not close immediately unless spam, malicious/unsafe, unrelated, clearly invalid, or urgent security/release incident handling requires maintainer replacement.
- Review before replacing: say what is good, what blocks merge, what must change, and what proof/validation is missing.
- Wait 2 business days after the initial review for contributor updates, then follow up once if still needed.
- Wait 2 more business days after follow-up before creating a maintainer replacement PR for the same work, unless an exception applies.
- If maintainer replacement is needed, create the replacement PR first, reference the contributor PR, preserve credit where appropriate, and only then close the contributor PR with a clear thanks/reason/link.
- If meaningful contributor code is reused, preserve credit with co-author attribution or explicit credit where appropriate. If only the idea is reused, thank/reference the contributor in the replacement PR or close comment.
- Exceptions: spam, malicious code, unrelated PR, clearly invalid change, urgent security fix, urgent release blocker, production breakage, or clean/scoped/green non-production PRs that policy allows you to merge directly.

## External Issue Courtesy Protocol

- Treat new human-created issues as a first-class community issue intake lane: issues opened by someone other than `@mehul0810` or automation/bots.
- Acknowledge new external issues within 24 hours when feasible.
- Do not close immediately unless spam, abusive/malicious, duplicate with a clear canonical link, clearly unrelated, or sensitive/security content requires private handling.
- Initial triage should classify: confirmed bug, needs reproduction, feature request, support/question, documentation gap, duplicate, security/private, or not planned/out of scope.
- If more info is needed, ask only for the minimum reproducible details: plugin version, WordPress/PHP/browser version when relevant, reproduction steps, expected vs actual result, safe screenshots/logs, and conflict/plugin/theme context when relevant.
- Wait 2 business days after asking for info, then follow up once if still needed.
- Wait 2 more business days after follow-up before closing as stale/needs-info, unless product policy keeps support issues open longer.
- If evidence is sufficient, create or link a focused internal issue or PR-sized task, label/milestone it appropriately, and keep the external issue open until resolved or clearly routed.
- If a fix ships, close with thanks, release/version reference, and any verification steps.
- If not planned, close with a clear product reason and, where possible, an alternative or workaround.
- Security/privacy reports must move to a private/security process; do not ask for secrets publicly.
- Urgent production/support regressions should escalate immediately and create a patch/hotfix lane.

## AI-Friendly Templates

- Prefer GitHub Issue Forms YAML for structured issue intake where practical.
- Issue forms should separate bug report, feature request, docs/support gap, release/readiness task, and security/private guidance where appropriate.
- Include fields that help both humans and AI tools: problem, user impact, reproduction steps, expected/actual behavior, environment, screenshots/logs, product/version, acceptance criteria, non-goals, validation expectations, owner decisions, sensitivity, and suggested milestone/type.
- PR templates should require summary, linked issue, scope, implementation notes, screenshots/UI proof, validation run, risk/rollback, data/privacy/security impact, release/milestone target, follow-up issues, and contributor credit/co-author notes when applicable.

## WordPress Playground PR Preview

- Every plugin/theme repo should have a PR workflow/comment that creates or updates a WordPress Playground test link when technically possible.
- Prefer a packaged artifact or zip for Playground when source archives miss build assets or vendor. If that is not possible, treat it as a tooling/release-readiness gap and create a focused issue.
- Playground comments should be updated, not spammed, and should include the test route and any safe test credentials.
- Playground previews must not expose secrets and must never trigger production deploy/publish actions.
- Contributor PRs should also get the Playground link when technically possible.
- For UI/user-workflow PRs, treat missing Playground or equivalent visual/browser proof as a readiness gap to challenge before merge or release-ready reporting.
