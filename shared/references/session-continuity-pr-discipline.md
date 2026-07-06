# Session Continuity And PR Branch Discipline

Use this reference when a task starts in a new chat/session, resumes repository work, creates or updates branches, opens PRs, targets a release, or performs GitHub issue/PR workflow.

## Goal

Prevent context drift across chats. Rebuild the current repository, branch, release, and user-rule context from durable evidence before making GitHub decisions.

## New Session Rehydration

Do not assume the previous chat's branch, release target, validation state, or PR rules are still true. At the start of repo-affecting work, establish:

- Current working directory and Git root.
- Remote URL and default branch.
- Current branch, dirty files, local commits ahead/behind, and untracked files.
- Existing release, hotfix, support, develop, or milestone branches.
- Relevant project workflow docs such as `README.md`, `CONTRIBUTING.md`, `AGENTS.md`, `CLAUDE.md`, `.github/PULL_REQUEST_TEMPLATE*`, release docs, milestone docs, and issue instructions.
- Active issue, milestone, version, release branch, or existing PR if the user referenced one.

Use cheap commands first:

```bash
pwd
git rev-parse --show-toplevel
git status --short --branch
git remote -v
git branch --show-current
git remote show origin
git branch -a --list '*release*' '*hotfix*' '*support*' '*develop*'
```

Fetch before deciding PR bases when network access is available:

```bash
git fetch --all --prune --tags
```

If memory or prior chat context exists, treat it as a hint only. Verify branch, release, and PR facts from the current repo and remote before acting.

## PR Base Branch Gate

Never create a PR by relying on GitHub's default base branch. `main`/`trunk` is only acceptable when evidence says it is the intended target.

Before `gh pr create`, prove and explicitly set:

- Head branch: the branch containing the task commits.
- Base branch: the intended integration target.
- Why that base is correct: release branch, milestone, issue text, repo docs, existing PR pattern, or default branch because no release/support target exists.

Use an explicit base:

```bash
gh pr create --base "$base_branch" --head "$head_branch"
```

Immediately verify the created PR:

```bash
gh pr view --json url,baseRefName,headRefName,state
```

If the PR base is wrong, fix it immediately with `gh pr edit --base "$correct_base"` when safe, or close/recreate if repo policy requires that.

## Release Branch Detection

When work is release-scoped, do not default to the remote default branch. Check:

- User-provided version or milestone, such as `0.4.0`, `1.6.0`, or `release/0.4.0`.
- Existing remote branches named `release/*`, `hotfix/*`, `support/*`, `maintenance/*`, `develop`, or project-specific equivalents.
- GitHub milestones, linked issues, active PRs, changelog targets, package/plugin version, and release docs.
- The branch point of the current work when resuming an existing branch.

If a matching release branch exists, base the PR on that branch unless repo docs or the user explicitly say otherwise.

If multiple plausible bases exist and choosing wrong would create release drift, stop and ask before creating the PR. Do not create a temporary PR against `main` just to keep moving.

## Issue Milestone To PR Base Gate

When work is tied to a GitHub issue, Trac ticket, or project tracker item, use the issue's milestone or release target as PR-base evidence before defaulting to `main` or `trunk`.

Before opening the PR:

- Inspect the issue milestone title, labels, body, linked project item, linked release, and existing related PRs.
- Fetch remote branches and look for matching `release/<release-version>`, `hotfix/<release-version>`, `support/<release-version>`, `maintenance/<release-version>`, `develop`, or project-specific release branches. Use the version/milestone title, not the GitHub milestone ID or sequence number.
- If a matching release branch exists, create the work branch from that release branch and open the PR against that branch.
- If the milestone explicitly targets default-branch development, document that evidence and still pass `--base` explicitly.
- If multiple issues are included, confirm they share the same release target; otherwise split the work or ask before creating a combined PR.

The PR body should state the issue number, milestone or release target, chosen base branch, and why that base is correct.

## Branch Creation Discipline

Before creating a work branch:

- Pick the correct starting branch first.
- Pull or fetch the chosen base according to repo policy.
- Create the feature branch from the chosen base, not from whatever branch happens to be checked out.
- Use the user's requested branch naming convention when provided; otherwise follow repo convention.

Suggested flow:

```bash
git fetch origin "$base_branch"
git switch -c "$work_branch" "origin/$base_branch"
```

Do not merge unrelated local branches into release work to "catch up" unless the repo policy requires it.

## PR Description Discipline

In the PR body, include:

- Base branch and why it was chosen.
- Linked issue/milestone/release target.
- Scope summary and intentionally excluded work.
- After-fix screenshot or linked artifact when the PR changes visible admin, editor, frontend, style, layout, UX, screenshots/assets, banners/icons, or onboarding output; if unavailable, include the exact proof blocker.
- Validation commands actually run.
- Release, migration, rollback, and deployment notes when relevant.

For partial issue coverage, do not use closing keywords. Use closing keywords only when the PR fully resolves the issue.

## Completion Standard

Before saying GitHub work is complete:

- Confirm the PR exists against the intended base.
- Confirm only intended commits/files are included.
- Confirm validation state and CI state if CI is part of the task.
- Report the PR URL, base branch, head branch, and any remaining risk.
