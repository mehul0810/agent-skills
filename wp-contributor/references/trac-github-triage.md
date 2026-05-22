# Trac, GitHub, And Triage

Use this for ticket creation, triage, review comments, keywords, labels, and contribution communication.

## Core Trac Ticket Quality

Strong Core tickets include:

- Problem-focused title, not only the proposed solution.
- Exact reproduction steps.
- Actual and expected results.
- Environment details: WordPress version or trunk revision, PHP, browser, multisite, theme/plugins where relevant.
- Screenshots or screen recordings only when they clarify UI behavior.
- Existing related tickets, changesets, Make posts, or docs.
- Accessibility, i18n, performance, privacy, and BC considerations when relevant.

## Common Core Trac Fields

- Component: choose the most specific affected area.
- Milestone: default new tickets usually start in Awaiting Review; do not force release milestones without authority.
- Keywords: use defined workflow keywords, not generic tags.
- Owner: usually leave blank unless a committer/trusted contributor assigns it.

## Keyword Discipline

Apply or recommend keywords only when their official meaning fits:

- `has-patch`: a patch or linked PR exists.
- `needs-testing`: patch needs testing evidence.
- `needs-unit-tests`: tests are needed or expected.
- `needs-refresh`: patch no longer applies or needs update.
- `changes-requested`: actionable feedback requires a patch update.
- `dev-feedback`: feedback from core developers is needed.
- `reporter-feedback`: reporter input is needed.
- `2nd-opinion`: another contributor opinion is needed.
- `close`: candidate for closure with a non-fixed resolution.
- `commit`: only when reviewed/tested enough and appropriate for commit consideration.

## GitHub PR Discipline

For Core PRs:

- Link to the Trac ticket in the PR body.
- Keep Trac updated after important PR changes.
- Do not assume PR review comments are visible to Trac subscribers.
- Keep PR branches refreshable and focused.

For Gutenberg PRs:

- Follow GitHub issue/PR templates.
- Use labels and project fields according to repository norms.
- Provide manual testing steps for editor changes.
- Include screenshots/videos for UI when useful, but do not let visuals replace test evidence.

For Meta tickets or PRs:

- Confirm the Meta Handbook/project docs identify the correct tracker: Meta Trac or a project-specific GitHub repository.
- Include the affected property, component, source path/repository, local environment, reproduction steps, and privacy/cache/deployment concerns.
- For Trac patches, mention the attached patch filename in a comment; do not rely on attachment upload alone.
- For access/admin requests, route through documented Meta Trac or `#meta` ownership paths instead of promising GitHub, SVN, or Slack permissions.

## Triage Output

Use this shape:

```text
Status: confirmed / needs reproduction / needs reporter feedback / duplicate candidate / enhancement / support request
Surface: Core Trac / Meta Trac / Gutenberg GitHub / other
Component: [recommended component]
Keywords or labels: [only if justified]
Evidence: [reproduction or reason]
Next action: [patch, tests, feedback, close suggestion, docs, design/a11y review]
```
