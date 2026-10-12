# GitHub Communication Protocol

Use this reference when writing commit messages, GitHub issue/PR titles and bodies, comments, reviews or handoffs, applying ownership labels, or deciding whether a GitHub comment is durable enough to post.

## Cross-Project Writing Standard

Use this default for new owner-managed project work. An explicit repository or upstream contribution convention takes precedence, including WordPress Core/Trac formats. Preserve its required fields while using the information order below. Do not rename historical records, rewrite commits, edit someone else's draft, or override generated dependency/release titles solely for consistency. This writing standard grants no permission to create, publish, merge, close or release anything.

### Titles

Commit subjects, PR titles and issue titles share this shape:

```text
type(scope): plain-language summary
```

- Use a lowercase type: `feat`, `fix`, `docs`, `refactor`, `test`, `perf`, `build`, `ci`, `chore` or `revert`. Choose the main purpose, not the size of the change. `fix` on an issue describes requested work, not a completed fix.
- Use a short, stable area as the scope, such as `auth`, `checkout` or `routing`; reuse the repository's vocabulary. Omit scope only when the applicable convention omits it or there is no useful area. Do not put worker names, dates, priority, status or issue numbers in the scope.
- For commits and PRs, describe the actual change with a present-tense action. For issues, describe the observed problem or requested outcome without inventing a cause or solution.
- Aim for 72 characters or fewer, without a final period. Prefer specificity over an unreadable abbreviation. Keep issue links, versions and detailed evidence in the body unless essential to identify the work.
- Avoid vague subjects such as `update files`, inflated claims such as `production-ready`, or internal agent/process jargon. A squash-merge title should describe the combined change, not just the last fixup commit.

Hypothetical examples, not claims about shipped work:

| Artifact | Title |
| --- | --- |
| Bug issue | `fix(auth): sign-in repeats after a successful login` |
| Fix commit and PR | `fix(auth): prevent repeated sign-in redirects` |
| Feature issue | `feat(export): let users download filtered orders` |
| Feature commit and PR | `feat(export): add filtered order downloads` |
| Documentation | `docs(setup): explain local test prerequisites` |
| CI maintenance | `ci(validation): reuse the local validation command` |

### Information Order

Keep the same reading order across projects: **summary, context, changes or requested scope, validation or evidence, risks and next action, links**. Scale the body to the artifact; a one-line commit or direct reply does not need six empty headings. Preserve exact commands, paths, errors, versions and identifiers when they matter. Explain unfamiliar technical terms rather than dropping material detail.

- **Commits:** subject, then a blank line and the reason/non-obvious constraint when needed. Record relevant checks or known gaps for substantive changes. Put verified issue references and genuine attribution in footers; never invent co-authors or use closing keywords unless closure is intended.
- **PRs:** use `Summary`, `Context`, `Changes`, `Validation`, and `Risks And Follow-Up`. Put the issue/milestone and explicit base evidence in Context; scope, non-goals and key files in Changes; exact tested revision/artifact, commands/results, screenshots or proof gaps in Validation; rollback, release impact and owner decisions in Risks And Follow-Up. Include `Changelog:` for milestone issue PRs as required by `commit-pr-discipline.md`. A missing issue or milestone is stated, not fabricated.
- **Issues:** use `Summary`, `Evidence`, `Acceptance Criteria`, and `Scope And Constraints`. State actual versus expected behavior, reproduction steps and relevant environment for bugs where available. For proposals, separate supporting evidence from assumptions. Make acceptance criteria observable; proposed checks are not completed validation. Include dependencies, exclusions and canonical links where relevant. Keep sensitive reports in the private security process.
- **Comments and handoffs:** lead with the new decision, finding or outcome, then necessary evidence and the exact next action or owner question. Do not paste a full PR template into a short reply. Apply the comment novelty gate below before posting.
- **Reviews:** findings first, ordered by severity, with location, concrete impact and reproduction/evidence; distinguish questions from defects. Then list unresolved proof gaps. A tidy template is not review evidence.
- **Changelogs and release notes:** use audience-facing outcomes and the repository's version/category format, not Conventional Commit prefixes or internal worker history. Include compatibility, migration or known limitations when material; do not imply release or deployment occurred before verification.

In validation sections, distinguish `Passed`, `Failed`, `Blocked` and `Not run`, with the relevant command, environment and revision/artifact. Keep local, CI, packaged, editor/browser and production proof separate. Never turn a proposed test, synthetic scenario or formatting pass into runtime or release proof. Use an explicit reason for material non-applicability, not unexplained checkmarks or empty sections.

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
