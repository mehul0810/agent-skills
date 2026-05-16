# Runtime And Toolchain Version Policy

Use this whenever choosing, reviewing, or changing minimum versions for PHP, Node.js, npm, Composer, WordPress, MySQL/MariaDB, browsers, GitHub Actions, build tools, CI images, package managers, or any other runtime/tool.

## Current Official Anchors

- PHP supported versions: https://www.php.net/supported-versions.php
- Node.js releases: https://nodejs.org/en/about/previous-releases
- Node.js release schedule: https://github.com/nodejs/release#release-schedule
- WordPress requirements: https://wordpress.org/about/requirements/
- WordPress hosting server environment: https://make.wordpress.org/hosting/handbook/server-environment/
- Composer requirements: https://github.com/composer/composer#requirements
- npm support policy: https://github.com/npm/cli/wiki/Support-Policy
- MySQL Innovation and LTS releases: https://dev.mysql.com/doc/refman/9.7/en/mysql-releases.html
- MariaDB maintenance policy: https://mariadb.org/about/#maintenance-policy

## Core Rule

When setting a new minimum version, choose the lowest version that is all of the following:

- Stable/GA or LTS for production use, not alpha, beta, RC, nightly, odd-numbered short-lived Node current, or experimental unless the task explicitly targets that channel.
- Actively maintained by the upstream project for bug and security fixes, not end-of-life.
- Compatible with the target WordPress version, hosting/VIP platform, dependencies, CI image, and deployment environment.
- Supported by required dependencies and tooling without forcing insecure or abandoned versions.
- Realistic for the client/site fleet, with a documented migration path if current production is below the target.

Prefer active bug-fix support over security-only maintenance when choosing a new baseline. Security-only or maintenance-only versions may be temporarily supported for existing sites, but do not choose them as the default minimum for new enterprise work unless platform compatibility leaves no active stable option.

## Drift-Aware Workflow

1. Read existing constraints first: `composer.json`, `package.json`, `.nvmrc`, `.node-version`, `.tool-versions`, `engines`, `platform.php`, CI matrices, Dockerfiles, VIP/platform docs, README, plugin headers, and deployment configs.
2. Check official lifecycle pages for the runtime/tool before changing minimums. Do not rely on memory for PHP/Node/database/tool EOL dates.
3. Identify the project type: public plugin/theme, private enterprise site, VIP application, monorepo package, build-only tool, or production runtime.
4. For new projects and major refactors, raise the minimum to the lowest active stable supported version.
5. For existing/public projects with lower minimums, do not silently break backward compatibility. Flag EOL/minimum-version risk and propose a migration or next-major release plan.
6. For CI, test the declared minimum plus the highest supported stable version when practical.
7. For dependency ranges, avoid broad ranges that allow EOL runtimes or unsupported tool majors.
8. Record the source checked and date-sensitive assumption in PR notes, planning docs, or the estimate when version choice affects scope.

## Runtime-Specific Guidance

PHP:

- Use official PHP supported versions as the lifecycle source.
- For new WordPress enterprise work, do not choose an EOL PHP version or a version that only survives through unofficial OS/vendor backports.
- If WordPress core recommends a lower PHP version than the active PHP branch, prefer the lowest active PHP version that is stable for the target WordPress release and extensions.
- Set Composer `config.platform.php` only when intentionally matching production; do not let it hide an unsupported runtime.
- If a plugin must keep a lower public minimum, separate source compatibility from CI support and document the EOL risk.

Node.js and npm:

- Production/build pipelines should use Active LTS by default. Maintenance LTS is acceptable for existing projects until migration, but not as a new baseline when an Active LTS is available.
- Avoid odd-numbered Node current releases for production CI/build baselines.
- Do not use EOL Node versions in GitHub Actions, Dockerfiles, local instructions, or package `engines`.
- Use the npm version bundled with the selected supported Node unless the project has a verified reason to pin/upgrade npm. npm advises latest npm, but legacy npm support is tied to maintained Node lines.

Composer:

- Use latest Composer 2 for active PHP baselines unless the project has a platform constraint that requires Composer 2.2 LTS.
- Do not use Composer 1 for new work.
- Validate `composer.lock` after changing PHP/platform constraints.

Databases:

- Prefer WordPress.org recommended database baselines and the hosting platform's supported versions.
- For MySQL, prefer LTS releases for stable production environments over Innovation releases unless the project explicitly accepts faster upgrade cycles.
- For MariaDB, prefer maintained LTS branches with enough support runway.
- Do not set new minimums to MySQL/MariaDB branches that are EOL or already in extended/vendor-only support unless the platform mandates them and the risk is documented.

Other Tools:

- For GitHub Actions actions, use maintained major versions and check deprecation notices.
- For Docker images, use supported base OS tags and avoid stale `latest` ambiguity in production pipelines.
- For browsers/Browserslist, target supported browser ranges aligned to analytics and accessibility requirements; avoid supporting obsolete browsers by default.
- For PHP/JS libraries, use stable maintained major versions; avoid abandoned packages and unsupported transitive runtimes.

## Enterprise Output Expectations

When version choices matter, report:

- Current project constraints discovered.
- Official lifecycle sources checked.
- Recommended minimum and why it is the lowest stable actively supported option.
- Compatibility impact on WordPress, dependencies, hosting/VIP, CI, and users.
- Migration plan for environments below the target.
- Tests or CI matrix proving the minimum works.

## Review Checklist

- Does any declared minimum point to an EOL PHP, Node, database, Composer, npm, OS, action, or tool version?
- Are CI examples, Dockerfiles, docs, and package manifests aligned to the same supported baseline?
- Does the repo test the declared minimum instead of only testing the developer's latest local version?
- Are public-plugin backward compatibility implications handled with a major-version or deprecation plan?
- Are official lifecycle docs cited or checked for version-sensitive decisions?
