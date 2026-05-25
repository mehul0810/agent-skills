# System Requirements

This document outlines the dependencies and compatibility requirements for the WP Expert skill pack.

## Operating System

The skills work on any modern operating system:

- **macOS**: 10.14+ (Mojave+)
- **Linux**: Any modern distribution with Bash 4.0+
- **Windows**: WSL2 (Windows Subsystem for Linux) with Bash

## Required Tools

### Core Requirements

| Tool | Min Version | Why It's Needed | Optional? |
|------|-------------|-----------------|-----------|
| **bash** | 4.0+ | Script execution | No |
| **git** | 2.0+ | Repository cloning and commits | No |
| **python3** | 3.7+ | Future validation scripts | Yes (for v1.1+) |

### Validation Scripts

The helper scripts use these tools (all are standard Unix utilities):

| Tool | Min Version | Used By | Optional? |
|------|-------------|---------|-----------|
| **find** | Standard | Context discovery | No |
| **grep** | Standard | Pattern matching | No |
| **rg** (ripgrep) | 11.0+ | Fast file searching | Yes* |
| **sed** | Standard | Text processing | Yes |
| **awk** | Standard | Text processing | Yes |
| **wc** | Standard | Line counting | No |

*Note: If `rg` is not installed, scripts fall back to `grep` automatically (slower but functional).

### WordPress Project Context

When using the skills in a WordPress project, optional tools improve functionality:

| Tool | Min Version | Used For | Optional? |
|------|-------------|----------|-----------|
| **php** | 7.2+ | PHP linting, WP-CLI checks | Yes |
| **composer** | 2.0+ | Dependency validation | Yes |
| **npm** | 6.0+ | JavaScript dependency checks | Yes |
| **wp-cli** | 2.0+ | WordPress database/config probes | Yes |
| **phpcs** | 3.0+ | Code standards validation | Yes |
| **phpstan** | 0.12+ | Static PHP analysis | Yes |
| **node** | 14.0+ | JavaScript validation | Yes |

## Installation Requirements

### For Claude Code / Codex

- **Storage**: Approximately 5MB for all skills and references
- **Directory permissions**: Write access to `~/.claude/` and/or `~/.codex/` directories
- **Bash permission**: Execute permission on helper scripts
- **Git access**: Ability to clone and pull from GitHub

Verify setup:
```bash
# Check directories exist and are writable
test -d ~/.claude && echo "✓ Claude Code directory found"
test -d ~/.codex && echo "✓ Codex directory found"

# Check Bash version
bash --version | head -1
```

### Global Installation

To install the skills globally, you need:

1. Clone the repository:
   ```bash
   git clone https://github.com/mehul0810/wp-expert-codex-skill.git
   cd wp-expert-codex-skill
   ```

2. Run the installer:
   ```bash
   bash scripts/install-global-skill-links.sh
   ```

3. The installer requires:
   - Bash with `set -euo pipefail` support
   - `mkdir -p` for directory creation
   - `ln -s` for symlink creation
   - Write access to skill directories

## Network Requirements

- **GitHub access**: To clone and pull the skill repository
- **No external API calls**: The skills themselves don't require internet access once installed
- **Optional**: WordPress.org/VIP documentation links for reference (human-readable only)

## Claude Code Integration

### Version Compatibility

| Feature | Claude Code Version | Status |
|---------|-------------------|--------|
| Skill discovery | 0.1.0+ | ✓ Full support |
| Skill invocation | 0.1.0+ | ✓ Full support |
| Reference access | 0.1.0+ | ✓ Full support |
| Custom SKILL.md | 0.1.0+ | ✓ Full support |
| Skills sync on restart | 0.1.0+ | ✓ Full support |

### Known Compatibility Notes

- **Restart required**: After installing skills, restart Claude Code for changes to take effect
- **Symlinks**: Skills are installed as symlinks, so updating the repo updates all Claude Code sessions
- **Settings inheritance**: Claude Code reads both global (~/.claude/) and project-level (.claude/) skills

## Codex Integration

### Version Compatibility

The skills are compatible with Codex/Agent SDK versions:

| Feature | Codex Version | Status |
|---------|---------------|--------|
| SKILL.md format | 0.1.0+ | ✓ Full support |
| Skill discovery | 0.1.0+ | ✓ Full support |
| Reference loading | 0.1.0+ | ✓ Full support |
| OpenAI agents | 0.4.0+ | ✓ Full support |

## WordPress Compatibility

### Core Versions Supported

The guidance in the skills applies to:

- **WordPress 6.0+** (latest stable releases)
- **Classic Editor**: All WordPress versions
- **Block Editor**: WordPress 5.0+
- **FSE/Site Editor**: WordPress 6.0+
- **WooCommerce**: 7.0+ (guidance applicable, specific features vary)

### PHP Version Guidance

The skills recommend minimum PHP versions based on:

- **WordPress minimum requirement**: 5.2.4+ (check current [WordPress.org requirements](https://wordpress.org/about/requirements/))
- **Plugin/theme requirements**: Follow WordPress.org minimum standards
- **VIP platforms**: Follow VIP's stated PHP version requirements
- **Development environment**: Use the project's existing requirements

Typical guidance:
```
WordPress 6.0+: PHP 7.4+
WordPress 5.9-5.9: PHP 7.2+
Older WordPress: Migrate first, don't add features
```

Check current standards: https://wordpress.org/support/article/requirements/

## Node.js & npm Versions

For WordPress projects using npm:

| Use Case | Min Node | Min npm | Typical Choice |
|----------|----------|---------|--------|
| Block development | 14.0 | 6.0 | 18 LTS |
| React/WordPress apps | 14.0 | 6.0 | 18 LTS |
| Build tooling | 12.0 | 6.0 | 18 LTS |
| Modern tooling | 16.0 | 7.0 | 20 LTS |

Current Node.js LTS: Check [nodejs.org](https://nodejs.org/)

## Composer Versions

For WordPress projects using Composer:

| Use Case | Min Composer | Typical Choice |
|----------|--------------|--------|
| WordPress.org plugins | 2.0 | 2.5+ |
| Enterprise projects | 2.0 | Latest (2.x) |
| Monorepos | 2.2 | Latest (2.x) |

## Browser Requirements

The skills don't have browser requirements (they're for server-side engineering).

For the **WordPress they help build**:
- Modern browsers: Chrome, Firefox, Safari, Edge (latest versions)
- Block Editor: Requires modern JavaScript support
- Legacy support: Follow project's stated browser support matrix

## Database Requirements

No specific database version is required by the skills.

For **WordPress projects** the skills help with:
- **MySQL**: 5.7+ (WordPress 6.0+)
- **MariaDB**: 10.1+ (WordPress 6.0+)
- **PostgreSQL**: Via plugins only (skills assume MySQL/MariaDB)

Check current [WordPress database requirements](https://wordpress.org/support/article/requirements/).

## Disk Space

| Component | Size | Notes |
|-----------|------|-------|
| Skill files | ~2MB | Lightweight references |
| Git history | ~3MB | Including .git folder |
| Helper scripts | <100KB | Minimal overhead |
| **Total** | **~5MB** | Does not include WordPress projects |

## Environment Variables

Optional configuration:

```bash
# Override default Codex home directory
export CODEX_HOME=~/.codex

# Override default Claude home directory
export CLAUDE_HOME=~/.claude

# Use with installer to install to custom locations
bash scripts/install-global-skill-links.sh
```

## Troubleshooting

### Scripts won't run
```bash
# Make sure scripts are executable
chmod +x wp-expert/scripts/*.sh
chmod +x wp-contributor/scripts/*.sh

# Test Bash version (need 4.0+)
bash --version
```

### rg not found errors
```bash
# Install ripgrep for faster searching (optional, scripts fall back to grep)
# macOS
brew install ripgrep

# Ubuntu/Debian
apt-get install ripgrep

# Or continue using grep (just slower)
```

### Symlink permission denied
```bash
# Check write permissions to skill directories
ls -ld ~/.claude/skills
ls -ld ~/.codex/skills

# If needed, recreate directories
mkdir -p ~/.claude/skills
mkdir -p ~/.codex/skills
```

### Claude Code doesn't see the skills
```bash
# Restart Claude Code application completely

# Verify symlinks are in place
ls -la ~/.claude/skills/wp-expert/SKILL.md
ls -la ~/.claude/skills/wp-contributor/SKILL.md

# If symlinks are broken, reinstall
bash /path/to/repo/scripts/install-global-skill-links.sh --force
```

## Platform-Specific Notes

### macOS
- Use Homebrew to install optional tools: `brew install ripgrep composer`
- Bash 3.x ships by default (old!), use `brew install bash` for modern version
- Git included with Xcode or install via Homebrew

### Linux
- Most tools available via package manager
- Ubuntu/Debian: `apt-get install git ripgrep composer npm php`
- RHEL/CentOS: `yum install git php npm composer`
- Ensure Bash 4.0+: `apt-get install bash`

### Windows (WSL2)
- Install WSL2 first: https://learn.microsoft.com/en-us/windows/wsl/install
- In WSL terminal: `apt-get update && apt-get install git ripgrep php composer npm`
- Windows paths are accessible as `/mnt/c/` in WSL

## Version Tracking

Check installed skill version:
```bash
# View skill version file
cat ~/.claude/skills/wp-expert/../../VERSION

# Or check directly in repo
cat /path/to/skill-repo/VERSION
```

## Getting Help

- **Installation issues**: See [README.md](README.md)
- **Using the skills**: See [QUICK_REFERENCE.md](QUICK_REFERENCE.md)
- **Contributing**: See [CONTRIBUTING.md](CONTRIBUTING.md)
- **Upgrading**: See [UPGRADE.md](UPGRADE.md)
