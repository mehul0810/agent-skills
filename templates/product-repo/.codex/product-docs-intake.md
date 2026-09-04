# Product Contract Intake

Use this only when a durable project decision is missing. Inspect code, runtime, GitHub, and existing docs first; do not generate placeholder policy.

Ask at most three unresolved questions in one brief. For each, include the recommended answer, evidence, implementation impact, and safe default.

Select only documents that change future work:

| Contract | Create or update when | Minimum evidence |
|---|---|---|
| `AGENTS.md` | Workflow, authority, branch, validation, or environment rules are missing | Repo policy, commands, branch/release flow |
| `PRODUCT.md` | Users, value, principles, claims, or product non-goals are unclear | Shipped product, roadmap, owner decisions |
| `ARCHITECTURE.md` or ADR | Ownership, public/data contracts, dependencies, migrations, or rollback are material | Code/runtime graph and chosen decision |
| `DESIGN.md` | Repeated UI, editor, responsive, accessibility, or brand decisions need one contract | Existing product UI, tokens, states, proof |
| `CONTENT.md` | IA, page purpose, editable ownership, claims, search, or publishing rules can drift | Current content/runtime and business intent |
| `TESTING.md` | Commands, fixtures, proof environments, golden workflows, or known gaps are unclear | Working local commands and runtime proof |
| `RELEASE.md` | Version, branch, package, approval, publish, rollback, or reconciliation is unclear | Current release workflow and live repository state |
| `COMPATIBILITY.md`, `SECURITY.md`, `OPERATIONS.md` | Exposure makes runtime support, disclosure, or recovery a durable concern | Supported matrix, trust boundaries, or operational signals |

Write concise facts with owner/source and revalidation trigger for volatile policy. Create the smallest focused issue or docs change, validate links and commands, and continue the original work only after blocking graph edges are closed.
