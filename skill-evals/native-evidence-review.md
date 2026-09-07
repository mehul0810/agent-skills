# Native Evidence Reduction Review

Scope: own dependency-free agent-harness log utility plus skill context guidance. No Headroom dependency, proxy, memory store, model setting change, automatic policy writer or global tool interception.

Independent reviewer `/root/evidence_review` inspected source/tests and skill scenarios, not behavior baselines or audit scripts. Initial review found that malformed UTF-16 surrogates could collide under UTF-8 hashing; the implementation now rejects ill-formed strings and tests lone surrogates against the literal replacement character.

Policy cases: late omitted fatal must remain partial and requires retrieval; expired/missing/mismatched originals fail closed; scope matching is identity verification, not authentication; untrusted instructions stay data; no token-savings claim from bytes alone. Original retention, authorization, independent expected metadata and retrieval wiring remain caller responsibilities. Eight native tests cover repetitive/rare failures, clipping, identity/expiry/tampering, opaque text, malformed/oversized inputs, dense/empty data, byte budgets and malformed Unicode.

Consumer pins remain unchanged. The API is available in the harness source; existing installed consumers must explicitly adopt a compatible pin before using it. No live Codex traffic or product runtime was altered. Actual task-token savings and latency benefit remain unmeasured.

Final independent re-review: PASS, no remaining findings in scope, 8/8 evidence tests on Node 24.18.0. Full current harness check: 26 tests plus examples and self-contract validation passed. Policy/source evaluation does not substitute for a real consumer integration benchmark.
