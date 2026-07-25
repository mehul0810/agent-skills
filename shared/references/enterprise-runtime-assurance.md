# Enterprise Runtime Assurance

Use this only when plugin, theme, or site work has material compatibility, supply-chain, production-operations, recovery, or post-release risk. It supplements the normal code-quality gate; it is not mandatory ceremony for an isolated low-risk change.

## Select The Assurance Level

Use `baseline` for ordinary maintained WordPress work:

- Reproducible locked dependencies and a clean production package.
- Declared supported runtimes and the affected compatibility checks.
- Bounded, redacted failure evidence and a reversible rollout.
- Existing repository validation plus the smallest changed-boundary proof.

Use `elevated` when any of these apply:

- Public distribution, paid/commercial delivery, VIP/enterprise hosting, regulated or sensitive data, customer procurement, or contractual support.
- Custom tables or migrations, public APIs/hooks, authentication, payments, uploads, webhooks, external providers, background queues, multisite/network scope, or high traffic.
- A release artifact assembled by automation or by more than one dependency/build ecosystem.
- A production path whose failure affects revenue, publishing, access, data integrity, privacy, or recovery objectives.

Record the selected level and reason. Do not claim compliance, attestation, compatibility, recovery, or monitoring that was not verified.

## Compatibility Contract

Use an existing `TESTING.md` or `RELEASE.md` matrix when it is authoritative; create `COMPATIBILITY.md` only when the matrix is material and otherwise has no durable owner.

Define only applicable dimensions:

- Minimum and latest supported WordPress, PHP, database, Node/build, and browser ranges.
- Single site and multisite/network activation; object cache present/absent; cron or queue runner behavior.
- Block editor, Site Editor, classic editor, REST, WP-CLI, locale, RTL, timezone, and translated/long-content states.
- Required PHP extensions, companion plugins, licensed blocks/themes, hosting/VIP constraints, and third-party API versions.
- Upgrade paths from supported released versions, including production data and rollback expectations.

Each supported cell needs an evidence path or an explicit accepted gap. Do not test only the developer's current environment, and do not advertise a support range broader than the maintained proof.

## Supply-Chain Contract

Official anchors:

- GitHub artifact attestations: https://docs.github.com/en/actions/how-tos/secure-your-work/use-artifact-attestations/use-artifact-attestations
- SPDX specifications: https://spdx.dev/use/specifications/
- OWASP Software Component Verification Standard: https://scvs.owasp.org/

Baseline:

- Review manifests and lockfiles, direct/runtime versus development dependencies, package sources, maintained status, known vulnerability signals, and license compatibility.
- Build from a clean checkout with locked installs; inspect the exact ZIP/artifact; record its SHA-256 digest.
- Exclude secrets, local configuration, unnecessary source maps, tests/fixtures with sensitive data, and development-only packages.
- Keep release workflows least-privileged, pin or deliberately review third-party actions, and avoid privileged execution of untrusted fork code.

Elevated:

- Generate a machine-readable SPDX or CycloneDX SBOM for the production artifact when customers, procurement, regulation, dependency volume, or incident response justifies it.
- Record component version, source, license, support status, and artifact relationship; do not mistake an unreviewed inventory for a security pass.
- Generate build provenance or an artifact attestation when the hosting/repository plan supports it and the trust model benefits. Verify the digest, signer identity, and attestation rather than merely uploading metadata.
- Define vulnerability-monitoring ownership, remediation expectations, dependency exception expiry, and how a compromised or abandoned component is removed.

Do not add hosted automation solely for a badge. Prefer local deterministic generation and verify the release artifact in the existing owner-approved release workflow when hosted provenance is justified.

## Operations And Recovery Contract

For elevated production paths, define:

- Critical workflows and signals: availability, latency, error rate, cache behavior, database time, queue depth/age/failure, external dependency status, and data-integrity indicators.
- Observation window after deployment, expected baseline, warning/rollback thresholds, monitoring owner, and exact escalation path.
- Structured redacted events, request/correlation identifiers, bounded retention, and operator-visible failure/retry state.
- Reversible mitigation: feature flag, integration disable, queue pause, batch reduction, code rollback, cache/search recovery, or manual fallback.
- RPO/RTO and restore-drill expectations when persistent or business-critical data is affected.

A green deployment is not an operational pass. Close the release observation only after the defined window has evidence or an authorized proof gap.

## Adaptive Repo Contracts

Create or update only when a real durable gap exists:

- `.github/SECURITY.md` or `SECURITY.md`: disclosure path, supported versions, trust boundaries, and sensitive-report handling.
- `COMPATIBILITY.md`: supported matrix, exceptions, and evidence owner.
- `OPERATIONS.md` or `RUNBOOK.md`: critical workflows, signals, thresholds, recovery, contacts/roles, and proof cadence.

Use existing equivalents rather than duplicate files. Record owner, evidence source, and last-verified condition for volatile contracts; update or supersede stale guidance through the repo workflow.

## Output

Report assurance level, triggered risks, compatibility evidence, artifact/SBOM/provenance status, operational window and rollback signals, adaptive docs changed, accepted gaps, and owner-only decisions.
