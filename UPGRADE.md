# Upgrade Guide

Instructions for upgrading to new versions of the WP Expert skill pack.

## Checking Your Current Version

To see which version you have installed:

```bash
# Check the version file
cat ~/.claude/skills/../../VERSION

# Or check in the repo
cat /path/to/skill-repo/VERSION
```

## Before Upgrading

1. **Backup your current setup** (optional but recommended):
   ```bash
   cp -r ~/.claude/skills ~/.claude/skills.backup
   ```

2. **Check the changelog** for breaking changes:
   ```bash
   cat /path/to/skill-repo/CHANGELOG.md
   ```

3. **Read this guide** to understand what changes are coming

---

## Upgrading to 1.1.0 (When Released)

### What's New

- 🎉 New references for WooCommerce patterns
- 🎉 Advanced multisite admin patterns
- 🎉 Enhanced discoverability with reference tags
- 🔧 Validation test suite enhancements

### What's Breaking

**None** - This is a minor version, fully backward compatible.

### How to Upgrade

#### Option 1: Update via Git (Recommended)

```bash
cd /path/to/agent-skills
git pull origin main
bash scripts/install-global-skill-links.sh
```

#### Option 2: Reinstall Completely

```bash
# If you cloned the repo:
cd /path/to/agent-skills
git pull origin main
bash scripts/install-global-skill-links.sh --force

# If you downloaded a ZIP:
cd agent-skills-main
bash scripts/install-global-skill-links.sh --force
```

### After Upgrading

1. **Restart Claude Code** to load the new version
2. **Verify installation**:
   ```bash
   bash /path/to/repo/scripts/validate-references.sh
   ```
3. **Check version**:
   ```bash
   cat ~/.claude/skills/wp-expert/../../VERSION
   ```

---

## Major Version Upgrade: 1.0.x → 2.0.0 (Future)

Future major versions may include breaking changes. When released, detailed migration notes will be provided here.

---

## Troubleshooting Upgrades

### Skills not appearing after upgrade

**Problem**: You updated the repo but Claude Code still shows old version.

**Solution**:
1. Completely restart Claude Code (not just reload)
2. Verify symlinks:
   ```bash
   ls -la ~/.claude/skills/wp-expert/SKILL.md
   ```
3. Reinstall if symlinks are broken:
   ```bash
   bash /path/to/repo/scripts/install-global-skill-links.sh --force
   ```

### Conflicting old skill directories

**Problem**: You have both old and new skill versions installed somehow.

**Solution**:
```bash
# Remove old copies
rm -rf ~/.claude/skills/wp-expert
rm -rf ~/.claude/skills/wp-contributor
rm -rf ~/.codex/skills/wp-expert
rm -rf ~/.codex/skills/wp-contributor

# Reinstall cleanly
bash /path/to/repo/scripts/install-global-skill-links.sh
```

### Validation script shows errors

**Problem**: After upgrading, validation shows missing files.

**Solution**:
1. Check if all references exist:
   ```bash
   bash /path/to/repo/scripts/validate-references.sh
   ```

2. Reinst all if you see errors:
   ```bash
   cd /path/to/repo
   git status
   git pull origin main
   bash scripts/install-global-skill-links.sh --force
   ```

---

## Version Compatibility Matrix

| Your Version | Latest Version | Status | Action |
|---|---|---|---|
| 1.0.0 | 1.0.0 | ✓ Current | No action needed |
| 1.0.0 | 1.1.0 (planned) | 📦 Update available | See upgrade instructions |
| <1.0.0 | 1.0.0 | ⚠️ Old version | Upgrade recommended |

---

## Manual Installation (Advanced)

If you prefer not to use Git:

### Step 1: Download Latest Version

Visit [GitHub Releases](https://github.com/mehul0810/agent-skills/releases) and download the latest ZIP.

### Step 2: Extract and Install

```bash
# Extract the ZIP
unzip agent-skills-main.zip
cd agent-skills-main

# Install globally
bash scripts/install-global-skill-links.sh --force

# Verify
bash scripts/validate-references.sh
```

### Step 3: Restart Claude Code

Completely restart Claude Code to load the new version.

---

## Keeping Skills Up to Date

### Auto-Update via Git

Keep a regular schedule to check for updates:

```bash
# Navigate to skill repo
cd /path/to/agent-skills

# Check for updates
git fetch origin
git status

# If behind, pull and reinstall
git pull origin main
bash scripts/install-global-skill-links.sh
```

### Check for New Versions

```bash
# See what version you have
cat VERSION

# See recent changes
git log --oneline -10

# See what's new since your version
git log --oneline v1.0.0..origin/main
```

---

## Support & Issues

If you encounter upgrade issues:

1. **Check the troubleshooting section** above
2. **Run the validation script**:
   ```bash
   bash /path/to/repo/scripts/validate-references.sh --help
   ```
3. **Check recent commits** for known issues:
   ```bash
   git log --oneline -20
   ```
4. **Open a GitHub issue** with:
   - Your current version
   - The error message
   - The output of `validate-references.sh`

---

## Release Schedule

- **1.0.0**: Released 2026-05-25 (initial stable release)
- **1.1.0**: Planned (WooCommerce, multisite, improved discoverability)
- **1.2.0**: Planned (additional enterprise patterns)
- **2.0.0**: Future (potential restructuring based on usage)

---

## FAQ

### Q: Do I need to restart Claude Code after upgrading?
**A**: Yes, always restart completely (not just reload). Symlinks update instantly, but Claude Code needs to reload the skill metadata.

### Q: Will upgrading break my existing projects?
**A**: No. Minor version upgrades (1.0 → 1.1) are fully backward compatible. Breaking changes only happen in major versions (1.0 → 2.0).

### Q: Should I reinstall with `--force`?
**A**: No, unless you're seeing errors. Regular installs (`bash scripts/install-global-skill-links.sh`) are smart enough to update broken symlinks without `--force`.

### Q: Can I use both Codex and Claude Code?
**A**: Yes. The installer puts skills in both `~/.codex/skills/` and `~/.claude/skills/`. Both use the same symlinks.

### Q: What if I want to keep the old version?
**A**: You can, but we recommend upgrading. The old version symlinks continue to work, but you lose new features and fixes. See the troubleshooting section if you need to revert.

### Q: How long is each version supported?
**A**: Currently, we support the latest version. When 1.1.0 is released, both 1.0.0 and 1.1.0 will be maintained. 1.0.0 enters maintenance-only after 1.2.0 is released.

---

## Next Steps

- ✅ Verify upgrade: `bash scripts/validate-references.sh`
- ✅ Restart Claude Code
- ✅ Check [QUICK_REFERENCE.md](QUICK_REFERENCE.md) to get started
- ✅ Review [CHANGELOG.md](CHANGELOG.md) for new features

Happy coding! 🚀
