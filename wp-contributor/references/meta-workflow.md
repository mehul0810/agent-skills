# Meta Workflow

Use this for WordPress.org, WordCamp.org, Make sites, developer.wordpress.org, directories, profiles, badges, Slack integrations, handbooks, project infrastructure, and other websites maintained by the Meta team.

## Scope

The Meta team works on the websites and infrastructure used by the WordPress project itself, including WordPress.org, WordCamp.org, Make WordPress, developer.wordpress.org, global.wordpress.org, jobs.wordpress.net, Learn WordPress, Pattern Directory, Plugin/Theme Directory surfaces, profiles, badges, and contributor infrastructure.

## Official Meta Handbook Anchors

- Meta Handbook: `https://make.wordpress.org/meta/handbook/`
- About the Meta Team: `https://make.wordpress.org/meta/handbook/about/`
- Projects: `https://make.wordpress.org/meta/handbook/about/projects/`
- Getting Started: `https://make.wordpress.org/meta/handbook/getting-started/`
- Contribute with Code: `https://make.wordpress.org/meta/handbook/getting-started/contribute-with-code/`
- Setting Up Your Machine: `https://make.wordpress.org/meta/handbook/getting-started/contribute-with-code/setting-up-your-machine/`
- Contribute with Testing: `https://make.wordpress.org/meta/handbook/getting-started/contribute-with-testing/`
- Contribute with Docs: `https://make.wordpress.org/meta/handbook/getting-started/contribute-with-docs/`
- Contributor Day: `https://make.wordpress.org/meta/handbook/getting-started/contributor-day/`
- Contributing with Git: `https://make.wordpress.org/meta/handbook/tutorials-guides/contributing-with-git/`
- GitHub administration: `https://make.wordpress.org/meta/handbook/tutorials-guides/github/`
- Slack guide: `https://make.wordpress.org/meta/handbook/tutorials-guides/slack/`
- Subversion access: `https://make.wordpress.org/meta/handbook/tutorials-guides/svn-access/`
- Meta Trac: `https://meta.trac.wordpress.org/`

## Source Of Truth

- Start with the Meta Handbook and the exact project page or repository for the affected site.
- Use Meta Trac for WordPress.org site issues unless the Projects page or project docs identify a GitHub repository as the correct queue.
- Confirm component, project, ticket list, source location, and deployment path before filing, triaging, or moving issues.
- Ask in `#meta` when ownership, environment setup, permissions, or deployment path is unclear.
- Treat handbook pages as drift-prone; verify current pages before giving exact setup, SVN, GitHub, or Slack administration instructions.

## Project Routing

Before implementing or triaging, identify:

- Production property: WordPress.org, WordCamp.org, Make, developer.wordpress.org, global.wordpress.org, jobs.wordpress.net, Learn, Pattern Directory, Plugin Directory, Theme Directory, profiles, badges, or another listed project.
- Issue tracker: Meta Trac ticket, project-specific GitHub issue/PR, or handbook/docs editing surface.
- Source location: Meta SVN/Git mirror, GitHub repository, project Docker setup, VVV/Meta Environment checkout, or handbook page.
- Component owner, required access, and whether the work is contributor patch, maintainer commit, GitHub organization administration, Slack administration, or documentation.

## Local Environment

- Prefer the current project-specific environment when documented. The Meta Handbook has older VVV/WordPress Meta Environment setup guidance, notes newer project-bundled environments, and lists Dockerized environments for several WordPress.org sections; verify the current project before choosing setup.
- Do not assume one environment covers every Meta project. Some projects have standalone GitHub repositories, Docker setups, or specific source paths.
- Confirm path layout before giving commands; Meta examples often require symlinks from a local WordPress install into the checked-out Meta source tree.
- If local setup is heavy or unavailable, still provide useful review, patch, docs, reproduction, or manual testing guidance with clear environment limitations.

## Contribution Workflow

- Start from an existing ticket or issue when possible. For new issues, use a specific project/component and include actual behavior, expected behavior, reproduction steps, environment, screenshots only when useful, and privacy/security considerations.
- For code contributions, keep patches focused, ticket-numbered, and easy to apply. Upload patches to Meta Trac when that is the project surface; use GitHub PRs only for projects that document GitHub as the contribution path.
- After attaching a patch to Trac, always leave a comment summarizing what was uploaded and how it was tested; attachment alone may not notify reviewers.
- For contributor-day work, choose tasks with clear scope, setup requirements, and a path to useful output: reproduction, refreshed patch, docs improvement, testing notes, screenshots, or triage.
- For docs work, improve the canonical handbook or project docs and preserve contributor-friendly clarity, not just implementation detail.

## Git, SVN, And Patch Discipline

- Meta projects are historically stored in SVN and mirrored to Git; contributors can often work locally in Git and submit patch files to Trac.
- Keep `trunk` clean. Branch per ticket, update `trunk`, keep the working branch current, and generate diffs against `trunk` with `--no-ext-diff` when the handbook workflow applies.
- Name patch files with the ticket number and sequence when needed, such as `986.diff`, `986.1.diff`, or `986.2.diff`.
- Apply patches from a fresh branch and from the directory where paths line up; inspect patch paths before applying.
- For SVN commit access, follow the current SVN password flow. Do not share SVN passwords; generated SVN credentials are separate from the main WordPress.org account password.
- WordPress.org SVN access depends on role. Most contributors should contribute through Trac patches or documented GitHub PRs unless they have explicit commit access.

## GitHub And Administration Rules

- Requests for WordPress GitHub organization changes should go through Meta Trac unless current official docs say otherwise.
- Repository creation/moves, adding organization users, and adding GitHub apps require WordPress organization owner permissions.
- Evaluate GitHub apps sparingly because apps can affect private repositories and noisy workflows at WordPress scale.
- Do not promise access, merges, repository moves, Slack channel creation, or app installation; route requests to the documented Meta process and owners.

## Testing And Review Focus

Meta changes should be checked for:

- Correct project/component and tracker selection.
- WordPress.org production behavior and deployment constraints.
- Privacy and moderation data exposure: profiles, badges, attendees, organizers, applicants, support/forum data, translations, and internal notes.
- Cache invalidation, search/indexing behavior, directory listings, redirects, navigation, and multisite/global site impact.
- Accessibility, i18n, responsive behavior, and public UI consistency across WordPress.org properties.
- Permission checks, nonce usage, escaping, sanitization, rate limits, spam/abuse handling, and auditability.
- Clear testing notes for local environment, manual browser flow, screenshots/video for UI, and any untested production-only behavior.

## Ticket Comment Shape

Use concise comments:

```text
Reproduced on: [environment]
Issue: [actual behavior]
Expected: [expected behavior]
Patch/PR: [what changed and attachment/PR link]
Testing: [commands and manual checks]
Notes: [cache/privacy/deployment/access concerns]
```
