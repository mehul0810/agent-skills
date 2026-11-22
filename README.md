# Agent Skills

Give your coding agent a specific job: build a WordPress plugin, draw how a system works, test a native Apple app, or improve a playable game. [Choose a skill by outcome](#skills) or [see a worked example](examples/decision-flow/README.md). These are instructions and resources, not an always-running agent or permission to publish, deploy, or release.

## Quick Start

Use one kept checkout for Codex, Claude Code, and optionally Antigravity. Codex and Claude links need Git and Bash. Reading or syncing an existing Antigravity manifest also needs Python 3 (standard library only). You do not need npm to install skills.

1. Clone the repository into a location you intend to keep. The installer makes symlinks to this checkout, so moving or deleting it breaks them.

   ```bash
   git clone https://github.com/mehul0810/agent-skills.git
   cd agent-skills
   ```

2. Install one skill, or install all skills. The command always targets **both** `${CODEX_HOME:-$HOME/.codex}/skills` and `${CLAUDE_HOME:-$HOME/.claude}/skills`, even if you use only one host. It also links `shared/` and `templates/` in both roots. Review the installer before running it.

   ```bash
   # One skill (replace the name with one from the catalog below).
   bash scripts/install-global-skill-links.sh wp-plugin-expert

   # Or install every public skill. Also refreshes an already registered Antigravity checkout.
   bash scripts/install-global-skill-links.sh
   ```

3. Check the corresponding links on disk. The selected check covers the named skills, shared resources, templates, and stale links in both roots. With no names, it expects the whole pack.

   ```bash
   # After the one-skill example:
   bash scripts/check-global-skill-links.sh wp-plugin-expert

   # After installing all skills:
   bash scripts/check-global-skill-links.sh
   ```

4. Start a new session in your host and ask for a task, for example: “Use the wp-plugin-expert skill to review this plugin's REST permission checks. Report findings with file locations; do not change code.” Give the agent access to the relevant project and review its evidence before acting.

The check confirms filesystem links, not that a host discovered or used a skill. If it is not available, confirm the correct host home, restart the host, and inspect the skill and shared links. This repository does not install custom slash commands. Invocation and discovery depend on the host; explicitly name a skill if automatic selection is uncertain. Native host loading and task results require separate observation.

### Global Symlink Installer

The installer selects top-level `<name>/SKILL.md` files committed in this checkout's `HEAD`, validates the selected skills, and links rather than copies them. It does not follow skill-directory or skill-file symlinks, descend into nested repos, or install untracked drafts. Existing real files and directories in the host link roots are preserved; a conflict stops installation. Inspect an incorrect symlink and its target before using `--force` to repoint it.

Global design defaults are separate and opt-in: `bash scripts/install-global-skill-links.sh --design-defaults` appends the marked policy to `${CODEX_HOME:-$HOME/.codex}/AGENTS.md` when safe. Ordinary installs do not edit that policy. `--check-design-defaults` checks its on-disk state without writing. The checker’s `--health` mode expects the full pack **and** these optional defaults; it is not a success check for a selected install or an ordinary install without that policy.

### Antigravity

Run these commands **from the shared Git checkout you intend to keep**. Antigravity reads the skills there directly; there is no second copy or symlink tree.

```bash
# First time only: register this checkout in ~/.gemini/config/skills.json.
bash scripts/install-global-skill-links.sh --antigravity

# After updating the checkout: sync new and retired public skill names.
bash scripts/install-global-skill-links.sh

# Verify this checkout's full allowlist on disk without making changes.
bash scripts/install-global-skill-links.sh --check-antigravity
```

A plain run leaves an unregistered Antigravity configuration alone. Once registered, the installer manages only `include_only` for this checkout's entry. A full run replaces that list with the current public catalog. A named run adds only those names to the existing selection and drops retired names; use a named run for a subset, or Antigravity's `exclude` for lasting exceptions on full runs. Other entries, inherits, and exclusions are preserved. No parent directory, sibling repository, or private agent pack is registered. A malformed manifest or duplicate entries for this checkout must be fixed manually; `--force` does not bypass that check.

To verify **discovery**, open **Customizations > Installed > Skills & Rules** in Antigravity. Look for the skill with the Global badge sourced from `~/.gemini/config/skills.json`. The on-disk check verifies the list, not host discovery or execution. See [Google's discovery guide](https://antigravity.google/docs/customization-discovery#check-what-antigravity-loaded).

## Skills

Choose the narrowest skill for the result you need. Open its `SKILL.md` for scope and routed references.

| Skill | Use it for |
| --- | --- |
| [wp-expert](wp-expert/SKILL.md) | Route an ambiguous WordPress engineering task to a specialist. |
| [wp-plugin-expert](wp-plugin-expert/SKILL.md) | Build, debug, review, test, or package a WordPress plugin. |
| [wp-theme-expert](wp-theme-expert/SKILL.md) | Build or improve a WordPress theme, templates, or block-theme presentation. |
| [wp-site-expert](wp-site-expert/SKILL.md) | Improve a WordPress site's pages, journeys, content, or editor-managed experience. |
| [wp-quality-reviewer](wp-quality-reviewer/SKILL.md) | Review and fix focused WordPress security, performance, maintainability, or accessibility risks. |
| [wp-product-orchestrator](wp-product-orchestrator/SKILL.md) | Coordinate one WordPress product's backlog, implementation, and release readiness. |
| [wp-portfolio-cto](wp-portfolio-cto/SKILL.md) | Resolve cross-product WordPress governance and release conflicts. |
| [wp-service-business-development](wp-service-business-development/SKILL.md) | Qualify WordPress service opportunities and prepare scopes or estimates. |
| [wp-contributor](wp-contributor/SKILL.md) | Contribute to WordPress Core, Gutenberg, Meta, or related projects. |
| [wp-product-docs-writer](wp-product-docs-writer/SKILL.md) | Write evidence-backed product readmes, changelogs, and release documentation. |
| [behavior-validator](behavior-validator/SKILL.md) | Independently check observable behavior against a specific contract. |
| [loop-steward](loop-steward/SKILL.md) | Review and manage policy-eligible control-plane changes, not routine WordPress implementation. |
| [content-writer](content-writer/SKILL.md) | Research, draft, or improve useful search-oriented content. |
| [explanatory-diagrams](explanatory-diagrams/SKILL.md) | Draw or repair an editable diagram so readers can trace a relationship, branch, or exception. |
| [product-video-producer](product-video-producer/SKILL.md) | Create intros, motion graphics, creator/avatar videos, product demos, walkthroughs and social cutdowns. |
| [game-development](game-development/SKILL.md) | Build and verify playable games. |
| [apple-app-development](apple-app-development/SKILL.md) | Build, debug, or review native Apple-platform apps. |

### Try A Task

These prompts are starting points, not promises of a particular result. Give the agent the relevant files, environment, constraints, and permission for the requested work.

- “Use wp-theme-expert to improve this block theme's mobile navigation. Preserve the existing design and show what you checked.” Expected: a scoped change with responsive evidence and any untested states.
- “Use wp-quality-reviewer to review this plugin's REST endpoints for authorization problems. Do not edit files.” Expected: prioritized, evidence-backed findings or an explicit statement that none were found.
- “Use wp-product-docs-writer to draft release notes from this candidate diff. Separate shipped changes from plans and do not publish.” Expected: a reviewable draft grounded in the supplied revision.
- For a small source-owned decision diagram and its limits, see the [decision-flow example](examples/decision-flow/README.md). This is a repository example, not an installed skill path.

## Source Of Truth

For current behavior, consult the relevant `SKILL.md`, its routed references, and repository instructions, schemas, and scripts. [QUICK_REFERENCE.md](QUICK_REFERENCE.md) is a convenience index; [EXAMPLES.md](EXAMPLES.md), [PLANNING_REPORT.md](PLANNING_REPORT.md), and older changelog entries are non-normative. Verify live product and ecosystem facts at their owning source.

The shared [project subagent routing reference](shared/references/project-subagent-routing.md) defaults to the current model, subject to explicit owner constraints and verified capability exceptions. It does not configure a host or grant delegation authority.

## Product Repo Autonomy Kit

The optional starter kit installs missing guidance into a WordPress plugin or theme repository without overwriting repo-owned guidance:

```bash
bash /path/to/agent-skills/scripts/install-product-agent-kit.sh /path/to/product-repo
```

Use `--check` to audit drift or `--stage-update` to prepare reviewable candidates. Review the [template](templates/product-repo/) and script before use. It does not authorize deployment or release.

## Validation And Limits

Repository contributors should follow [TESTING.md](TESTING.md). The aggregate uses Node.js 24 and Python 3.11 or newer; its checks are separate from installing skills for use. Scenario decisions, rendered results, native editing, runtime activation, and user outcomes are different evidence classes. See the [evaluation protocol](skill-evals/README.md). No identical-quality or token-saving guarantee across models is established.

[package-lock.json](package-lock.json) pins this repository's harness dependency; newer harness source does not automatically upgrade it. See [migration evidence](skill-evals/execution-reliability-2026-09-25.md) for the recorded runtime-proof limits.

## Repository Map

Start here for skills. The public harness is for maintainers validating contracts; the private companion repos are not required to install or use this collection.

| Repository | Responsibility |
| --- | --- |
| [agent-skills](https://github.com/mehul0810/agent-skills) | Reusable specialist behavior, references, templates, and evaluations. |
| [agent-harness](https://github.com/mehul0810/agent-harness) | Deterministic validation, context planning, and evidence contracts. |
| [agent-loop](https://github.com/mehul0810/agent-loop) | Live-state checks, bounded work selection, and advisory workflow output. |
| [agent-book](https://github.com/mehul0810/agent-book) | Compact decisions and evidence pointers, not live product truth. |
| [agent-decide](https://github.com/mehul0810/agent-decide) | Shadow-only typed routing and evaluation, without automatic execution or promotion. |

Product-specific implementation and release truth remain in each product repository. See the [nine-repository design review](skill-evals/public-skills-review-2026-11-22.md) for the tradeoffs, [CONTRIBUTING.md](CONTRIBUTING.md) for development, and [TESTING.md](TESTING.md) for validation.
