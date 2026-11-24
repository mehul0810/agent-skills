# Research Token Discipline

Use this reference when a WordPress task needs web research, current documentation, broad repo exploration, third-party API docs, process guidance, or careful reasoning under a limited context budget.

## Goal

Get enough evidence to make a correct decision without loading unnecessary files, pages, references, or speculation. Prefer the smallest reliable source set that can answer the actual question.

## Default Research Order

1. Define the decision: what must be answered, changed, verified, or ruled out.
2. Check local truth first: `git status`, `rg`, focused file reads, package scripts, config files, tests, docs, and existing conventions.
3. Use skill references selectively. Load only the router entry needed for the current task.
4. Use web search only when facts are drift-prone, official docs are needed, a URL was supplied, or local context is insufficient.
5. Stop researching when the answer is supported by enough primary evidence; spend remaining budget on implementation and validation.

## Search Budget Defaults

| Situation | Default budget | Source preference |
| --- | --- | --- |
| Local code behavior | No web by default | Repository code, tests, docs, config, command output |
| WordPress current rules | 1-3 official pages | Developer Resources, Make handbooks, Core/Gutenberg/Meta repos, WP-CLI docs |
| VIP or enterprise platform behavior | 1-3 official pages | WP VIP docs, platform docs, repo policy docs |
| Third-party API integration | 1-4 official docs | Provider docs, SDK source, OpenAPI schema, changelog; ask user if not findable |
| Product/theme/plugin-specific behavior | 1-3 official docs | Vendor docs, changelog, source repo, WordPress.org listing |
| High-stakes security/legal/financial/current facts | Verify current primary sources | Official documentation, advisories, standards, or authoritative source |

## Web Search Discipline

- Prefer direct official URLs when known. Otherwise search with precise terms and domain filters.
- Favor primary sources: WordPress handbooks, source repos, vendor docs, standards, changelogs, release notes, API specs, and code.
- Avoid SEO blogs, outdated tutorials, and generic snippets for authoritative decisions unless the task is explicitly comparative research.
- Open only the pages needed. Use in-page search, headings, and targeted excerpts instead of reading entire doc sets.
- Use the [official WordPress Agent Skills catalog](https://make.wordpress.org/ai/handbook/projects/agent-skills/) as a lookup index for an unfamiliar WordPress surface. Read only the relevant upstream skill and verify version-sensitive claims against the owning handbook, release notes, or source. Lookup does not require installing or running the skill.
- Record version, date, branch, or product edition when it changes the recommendation.
- If official docs cannot be found for an API or product, ask the user for documentation instead of guessing.

## Repo Exploration Discipline

- Start with `rg --files`, `rg`, `git diff --stat`, `git status --short --branch`, and small `sed -n` reads.
- Do not dump large files, entire directories, vendor code, build output, lockfiles, or generated assets unless they are the source of truth.
- When searching for behavior, find entry points first: hooks, routes, blocks, templates, package scripts, service registration, tests, and CI jobs.
- If literal search is too noisy for a code shape, use an already available [`ast-grep`](https://ast-grep.github.io/reference/cli/run) locally in search-only mode for the relevant language and paths. Confirm matches in context; when the tool or language support is unavailable, use focused `rg` and file reads. Do not install tooling just for the lookup.
- Reuse already gathered context inside the same turn; do not re-open the same files or pages unless something changed.

## Reasoning Discipline

- Plan before substantial work, but keep the plan proportional to the risk.
- Ask: will this source or reference change the implementation decision? If not, skip it.
- Prefer one clear recommended path over listing every possible implementation.
- Separate confirmed facts from inference. Label uncertainty when evidence is incomplete.
- Choose the implementation that is performant, secure, scalable, maintainable, and easiest for admins and visitors when multiple paths are valid.

## Validation Discipline

- Do not say work is done until the relevant evidence is checked: diff, syntax, tests, build, smoke test, docs, or official-source verification.
- Use the cheapest reliable validation first, then escalate when the risk justifies it.
- Report only meaningful validation results and explicit gaps. Avoid verbose command transcripts.
- If validation cannot be run, state the blocker and the best lower-confidence check that was completed.

## Output Discipline

- Keep final answers decision-oriented: what changed, why it is correct, validation, risks, and next steps only when useful.
- Cite web sources when web research informed the answer.
- Avoid pasting long source text. Summarize and link to the source.
- For reviews, prioritize findings with evidence over summaries.
