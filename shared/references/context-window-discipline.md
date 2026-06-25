# Context Window Discipline

Use this reference when the active conversation is large, the task may drift because of old chat history, or the user asks about compaction, fresh threads, continuity, or token usage.

## Decision Rule

- Continuity-sensitive task: ask the user to compact the current thread when context is high. Use this for the same issue, PR, release train, product heartbeat, in-progress implementation, or unresolved decision chain.
- New or unrelated task: recommend a fresh thread instead of compacting. Rehydrate from source of truth: repo files, Git status, issues/PRs, docs, and current runtime evidence.
- Unclear task: prefer compact only when important decisions exist only in the current chat. Otherwise prefer fresh thread plus source-of-truth rehydration.

## What Compact Means

- Compact preserves a summarized version of prior context so the same work can continue with fewer stale details.
- Compact is not a substitute for verification. Re-check repo/GitHub/runtime facts before acting on branch, release, issue, PR, or production-sensitive assumptions.
- Ask for compact before starting substantial continuation work when the context is high and the current thread contains unresolved task state.

## What Fresh Thread Means

- Fresh thread gives the cleanest token reset and lowest drift risk.
- Use fresh threads for unrelated tasks, broad new planning, independent implementation, or worker delegation.
- Do not carry old chat assumptions into a fresh thread unless they are durable in repo docs, issues/PRs, commits, or explicit handoff notes.

## Product Orchestration Rules

- Portfolio/product control threads should stay high-level. Do not let them absorb implementation logs, CI noise, or large code-reading output.
- For product heartbeats, compact the product thread when continuing the same release train and context is high; create or use bounded worker threads for implementation/evidence work.
- For a new product or unrelated product initiative, prefer a fresh worker/product thread and rehydrate from the source-of-truth hierarchy.
- Before asking the owner to compact, complete cheap source-of-truth checks that do not depend on old chat history; then state why compact is better than a fresh thread.

## Status Phrase

Use one concise line when relevant:

`Context decision: Compact|Fresh thread|Continue - <reason>`
