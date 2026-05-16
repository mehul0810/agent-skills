# Meta Workflow

Use this for WordPress.org, WordCamp.org, Make sites, developer.wordpress.org, directories, profiles, badges, and project infrastructure maintained by the Meta team.

## Scope

The Meta team works on WordPress.org, WordCamp.org, Make WordPress, and affiliated community/project websites. Common project areas include developer.wordpress.org, global.wordpress.org, jobs.wordpress.net, WordCamp.org, WordPress.org navigation/content, the Plugin Directory, Theme Directory, Pattern Directory, Learn WordPress, profile badges, and contributor infrastructure.

## Source Of Truth

- Start with the Meta Handbook and project pages.
- Use Meta Trac for WordPress.org site issues unless a project-specific GitHub repository is documented as the correct surface.
- Confirm the component before filing, triaging, or moving issues.
- Ask in `#meta` when the owning project, environment, or deployment path is unclear.

## Local Environment

The Meta handbook currently recommends VVV with the WordPress Meta Environment addon, and notes dockerized environments for some WordPress.org sections. Treat environment setup as project-specific and verify current instructions for the exact component.

Before implementation, identify:

- Project path or repository.
- Production site affected.
- Component owner and deployment path.
- Data model and privacy risk.
- Whether the change touches public directory behavior, profile data, WordCamp data, translations, search, or cached content.

## Implementation Rules

- Keep WordPress.org production behavior and historical data compatibility front and center.
- Avoid assumptions from client WordPress projects; Meta code often has project-specific deployment and data constraints.
- Do not expose private profile, event, attendee, applicant, organizer, or moderation data.
- Favor small patches with screenshots or reproduction notes for UI changes.
- Include cache invalidation and migration notes when changing directories, profiles, search, or content indexing.

## Ticket Comment Shape

Use concise comments:

```text
Reproduced on: [environment]
Issue: [actual behavior]
Expected: [expected behavior]
Patch/PR: [what changed]
Testing: [commands and manual checks]
Notes: [cache/privacy/deployment concerns]
```
