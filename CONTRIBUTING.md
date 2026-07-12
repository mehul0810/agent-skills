# Contributing to WP Expert Skill Pack

Thank you for your interest in improving the WP Expert skill pack! This document explains how to contribute improvements, report issues, and maintain the skills.

## Code of Conduct

Be respectful, helpful, and constructive. We're building tools for professional WordPress engineers.

## Types of Contributions

### 1. Bug Reports & Issues

If you find a bug or inaccuracy:

1. **Check existing issues** on GitHub to avoid duplicates
2. **Describe the problem clearly**: What was expected vs. what happened
3. **Provide context**: Which reference? Which skill? What was the task?
4. **Include evidence**: File paths, line numbers, commands run, or screenshots

### 2. New References or Expansions

To add a new reference or expand an existing one:

#### Step 1: Identify the Gap
- Use the reference routing map (`reference-routing-map.md`) to find the right place
- Check if the content already exists in another reference
- Ensure the addition fills a real use case, not speculative coverage

#### Step 2: Create or Expand the Reference
- **File naming**: Use kebab-case, all lowercase (e.g., `new-topic.md`)
- **File location**: Place in the correct skill's `references/` directory
  - `wp-expert/references/` for WordPress engineering guidance
  - `wp-contributor/references/` for contribution workflows
  - `shared/references/` for content used by both skills
- **File size**: Keep individual references between 50-300 lines for token efficiency
- **Format**: Markdown with clear headings and practical examples

#### Step 3: Reference Structure

Use this template for new references:

```markdown
# Topic Title

Brief one-sentence description of when to use this.

## When to Load This

- What problem does it solve?
- When is it the primary reference?
- What are common supporting references?

## Core Pattern/Guidance

### Section 1
Details and patterns.

### Section 2
More guidance with examples.

## Common Pitfalls

- What breaks most often?
- What does production tell us?

## Related References

- Link to related `reference-name.md`
- Mention in `reference-routing-map.md`
```

#### Step 4: Update the Routing Map

Add your new reference to `references/reference-routing-map.md`:

```markdown
| Task signal | Primary reference | Common supporting references |
| --- | --- | --- |
| Your task type | `your-topic.md` | `supporting.md`, `also-helpful.md` |
```

#### Step 5: Update the SKILL.md

Add your reference to the appropriate skill's `SKILL.md`:
- Add to the "Reference Router" section (lines 41-54 in wp-expert/SKILL.md)
- Update the description of that router category if needed

#### Step 6: Submit & Review

1. Create a branch: `git checkout -b add-reference/your-topic`
2. Make changes following guidelines above
3. Test: Run `bash scripts/validate-references.sh` (see Validation section)
4. Commit with clear message:
   ```
   git commit -m "Add new-topic reference guidance
   
   - Explain the content added
   - Mention which reference map entries were updated
   
   Co-Authored-By: Your Name <your.email@example.com>"
   ```
5. Submit for review

### 3. Helper Scripts

To add or improve a helper script:

#### Script Requirements
- Use `#!/usr/bin/env bash` shebang
- Follow shellcheck standards (`bash -n` should pass)
- Include usage/help documentation
- Keep scope narrow: discovery, validation, or light transformation only
- No destructive operations (no deletes, no resets, no writes)

#### Script Template

```bash
#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'USAGE'
Usage: bash script-name.sh [options] path/to/repo

Options:
  --help    Show this message

Description:
  What does this script do?
  
Examples:
  bash script-name.sh .
  bash script-name.sh /path/to/wordpress-project
USAGE
}

# Parse arguments
if [ "${1:-}" = "--help" ] || [ "${1:-}" = "-h" ]; then
  usage
  exit 0
fi

# Your implementation here
```

### 4. Agent Configuration & Integration

To improve agent YAML configuration:

- Files: `wp-expert/agents/openai.yaml` and `wp-contributor/agents/openai.yaml`
- These control display names, descriptions, and default prompts
- Keep descriptions under 160 characters for UI display
- Test by restarting Claude Code after changes

### 5. Documentation Improvements

For README, UPGRADE, or other docs:

1. Ensure changes are accurate and reflect current tools/versions
2. Include external links with dates (e.g., "as of 2026-05")
3. Update the relevant version in `VERSION` file
4. Run through README to ensure consistency

## Development Workflow

### Setting Up
```bash
# Clone the repo
git clone https://github.com/mehul0810/agent-skills.git
cd agent-skills

# Install globally for local testing
bash scripts/install-global-skill-links.sh --force

# Restart Claude Code to load the updated skills
```

### Making Changes
```bash
# Create a feature branch
git checkout -b feature/your-change-name

# Make changes following guidelines above

# Validate (run scripts, check syntax)
bash scripts/validate-references.sh

# Commit with descriptive message
git commit -m "Add/fix: your change

- Detailed explanation
- What problem it solves

Co-Authored-By: Your Name <email>"

# Push and create a pull request
git push origin feature/your-change-name
```

### Commit Message Format

Use conventional commits:

```
type: short description (50 chars max)

Longer explanation of the change.
- What was changed
- Why it was changed
- Any breaking changes

Co-Authored-By: Name <email>
```

Commit types:
- `feat`: New reference, guide, or feature
- `fix`: Bug fix or correction
- `docs`: Documentation updates (README, guides)
- `refactor`: Reorganizing existing content
- `test`: Adding or updating validation scripts
- `chore`: Maintenance, tooling, version updates

## Validation Checklist

Before submitting:

- [ ] Reference file is properly named (kebab-case)
- [ ] File placed in correct directory (wp-expert/, wp-contributor/, or shared/)
- [ ] No shell script syntax errors: `bash -n scripts/your-script.sh`
- [ ] No broken links or file references
- [ ] Reference added to `reference-routing-map.md`
- [ ] Reference added to the appropriate skill's `SKILL.md`
- [ ] Commit message is clear and follows convention
- [ ] No secret keys, credentials, or PII included

Run validation:
```bash
bash scripts/validate-references.sh
```

## Release Process

When releasing a new version:

1. **Update VERSION**: Increment following semantic versioning
2. **Update CHANGELOG.md**: Document all changes in the new version
3. **Create a git tag**: `git tag -a v1.0.1 -m "Release 1.0.1"`
4. **Push changes and tag**: `git push origin main && git push origin v1.0.1`
5. **Notify users**: Update documentation with new version availability

### Semantic Versioning

- `1.0.0`: Major version (breaking changes to SKILL.md interfaces)
- `1.1.0`: Minor version (new references, new scripts, improvements)
- `1.0.1`: Patch version (bug fixes, corrections, clarifications)

## Questions?

If you have questions about contributing:

1. Check [README.md](README.md) for general usage
2. Check [PLANNING_REPORT.md](PLANNING_REPORT.md) for design decisions
3. Review existing references for style and patterns
4. Open a GitHub discussion if unsure

---

Thank you for making WordPress engineering better! 🚀
