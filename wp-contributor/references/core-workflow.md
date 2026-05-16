# Core Workflow

Use this for WordPress Core tickets, patches, and `wordpress-develop` work.

## Source Of Truth

- Canonical code history is managed through SVN.
- Git mirrors exist for contributor convenience, including `develop.git.wordpress.org` and `WordPress/wordpress-develop`.
- GitHub PRs can help review code, but Core changes are not merged from GitHub directly. They must be associated with a Core Trac ticket unless current official docs say otherwise.

## Setup And Orientation

Start by identifying:

- Repository: SVN checkout, Git mirror, or GitHub fork.
- Branch: normally trunk for new work.
- Ticket: Core Trac ticket number, component, milestone, keywords, prior patches, related changesets, and linked PRs.
- Local environment: built-in Docker environment, VVV, wp-env, or another setup.
- Scripts: inspect `package.json`, Composer config, PHPUnit config, and project docs before running assumptions.

Official Core docs currently describe `npm run env:start` and `npm run env:install` for the built-in Docker environment when using a GitHub clone.

## Patch Workflow

1. Update trunk/main and make sure the working tree is clean.
2. Create a branch named with the ticket number and concise topic.
3. Reproduce the issue or document why reproduction is not applicable.
4. Implement the smallest fix or test.
5. Run targeted validation and relevant lint/build/test commands.
6. Generate a `.diff` from the repository root when attaching a patch to Trac.
7. Name patch files with the ticket number and sequence when appropriate, such as `12345.diff` or `12345.2.diff`.
8. Upload the patch or link the PR, then post a concise Trac comment with summary and tests.

## GitHub PR Workflow For Core

- Fork `WordPress/wordpress-develop` when using GitHub.
- Put the full Core Trac ticket URL in the PR body so the PR links back to the ticket.
- Keep the Trac ticket updated because PR comments and inline reviews may not notify Trac subscribers reliably.
- Expect the final commit to happen through WordPress committers and SVN-backed workflows.

## Patch Refresh Workflow

Use this when a patch no longer applies:

1. Fetch latest upstream trunk/main.
2. Rebase or recreate the work on top of current trunk.
3. Resolve conflicts without changing unrelated behavior.
4. Rerun targeted tests.
5. Generate the next patch sequence.
6. Comment with what changed during the refresh and what was retested.

## Acceptance Heuristics

A Core patch is stronger when it includes:

- Clear reproduction steps or a failing test.
- Minimal scope and no unrelated formatting churn.
- Tests for regressions and sensitive components.
- Backward compatibility analysis.
- Updated docs or dev-note flag when public behavior changes.
- Accessibility, i18n, performance, privacy, and security considerations where relevant.
