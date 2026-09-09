# GitHub Communication Protocol

Use this reference when reading GitHub issues/PRs/comments/reviews, applying ownership labels, or deciding whether a GitHub comment is durable enough to post.

## GitHub Issue And PR Comments

Read GitHub issue and PR comments as part of the CTO control loop. Write GitHub comments sparingly.

Use the relevant Codex task for routine progress, retries, local tests, handoffs, periodic check-ins and CI polling. Keep implementation summaries, validation results and remaining proof gaps in the PR description/checks. Do not post GitHub comments for routine notifications.

Before posting, inspect the exact issue/PR's existing comments, substantive reviews, PR body, CI and native timeline. Ask: is this new; does someone need to act or does it preserve a necessary durable record; is it already represented elsewhere? Default to skipping duplicates, including automatic PR links, commit notifications and green CI. If current evidence is unavailable, defer nonessential posting rather than guess novelty. This gate does not suppress an explicit owner-requested comment, a direct reply, or required substantive review feedback; keep those concise and specific.

Reserve GitHub comments for durable repo-visible state transitions or decisions that future maintainers need to see:

- Strategy or decision records that affect implementation or release sequencing.
- Owner questions and answered-decision records.
- PR link and scope when it helps connect issue state to implementation.
- Blockers requiring action, with the exact question, impact and recommended next step.
- Deferral, re-scope, or milestone rationale.
- Necessary completion reconciliation absent from the existing record.
- New actionable review feedback and direct replies.
- Owner decisions that future maintainers need to understand.

For contributor/community closures, comments should be owner-readable and explicit about why the item is closing, what shipped or replaced it, and any canonical PR/issue/release link.

When opening a PR, comment on the linked issue with the PR link and scope only when it adds useful durable context beyond automatic linking. After merge, reconcile issue state; add a completion comment only when the disposition or remaining scope is not already clear. Explain material deferral or milestone changes when their rationale is missing. Preserve contributor courtesy and explicit owner requests. Do not delete or edit historical comments merely to clean up noise.

Do not post comments just to say the orchestrator is checking, polling CI, waiting, continuing, delegating internally, or preparing another update. Keep that status in the CTO control chat thread.

## Contributor And Community Courtesy

- Thank external contributors and reporters when closing or rerouting their PR/issue.
- If a contributor PR is replaced, link the maintainer replacement PR and preserve credit where appropriate.
- If meaningful contributor code is reused, preserve credit with co-author attribution or explicit credit where appropriate.
- If only the idea is reused, thank/reference the contributor in the replacement PR or close comment.
- For duplicates, close only with a clear canonical issue/PR link and thanks.
- For fixes that shipped, close with the release/version reference and any verification steps.
- For security/privacy reports, move the conversation to the private/security process and never request secrets publicly.

## Playground Preview Comments

- WordPress Playground preview comments are durable repo-visible proof, not chatty status.
- Update the existing Playground preview comment when refreshing the link; do not spam a new comment on every run.
- Include the preview link, relevant route, and only safe test credentials or setup notes.
- If the repo cannot generate a useful Playground preview because packaged assets/vendor/build output are missing, say so clearly and route it to a focused tooling issue.
- Never expose secrets, private tokens, production credentials, or deploy/publish actions in Playground comments.

## Label-Driven Ready State

GitHub labels define work ownership and readiness:

- `owner:codex`: ready for Codex/orchestrator/worker action.
- `owner:me`: waiting on `@mehul0810` for true hard gates, but not a stall for reversible non-release choices.

A milestone-assigned issue or PR is considered ready to work unless it hits a production/beta release gate. Product orchestrators should ensure both labels exist in each managed repo and apply them to ready or waiting backlog items.

Do not require owner comments to start with `Codex:`. Comments, PR conversations, and reviews are evidence/context to read before work, stale-PR closure, PR creation, issue closure, or rescope decisions, but labels, milestones, and hard gates determine ready state.

When work has a concrete blocker/question, ask it clearly in the issue or PR and label `owner:me`. If the choice is reversible and non-release, document the rationale, relabel `owner:codex`, and proceed/delegate. If `@mehul0810` answers and relabels `owner:codex`, read the body plus all comments/reviews and continue without asking again.

## Required Comment Checks

Check issue/PR comments:

- During issue intake.
- Before delegation.
- Before PR creation.
- Before milestone or release decisions.
- Before closing issues.
- During stale or blocked work review.
