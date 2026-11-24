# Maintainer Briefs

## Receipts

All records name the same ZIP digest and commit. A static review describes a cross-account denial; the only passing runtime test checks the installed version. In a second report the runtime test instead supplies the actor, request, resource, boundary, expected denial, observed denial and captured artifact. Does it matter which record is listed first? Neither artifact was independently inspected.

## Latency

The written target is p95 request latency at or below 500 ms. The summary says 490 ms; the attached candidate distribution says p95 1,200 ms. The runner reports five repetitions, but not request count or variation. A different run used matching setups with 200 requests per candidate, five repetitions, recorded variance and a p95 of 430 ms against a 460 ms baseline. No p99 claim was requested.

## Outcomes

A laboratory gate uses a 250 ms maximum. The same workload measures 180 to 180 ms in A, 180 to 300 ms in B and 180 to 160 ms in C. A maintainer calls all three optimizations because the validation process itself exited zero. Decide how each report should be written.

## Legacy

A changed legacy file goes from 9,240 to 9,230 logical lines and keeps four oversized methods. Its largest changed method grows from 110 to 135 lines. The only approval is for a different file. A second candidate leaves all three measures flat, includes a candidate-bound measurement, and has no defect. A third candidate changes a storage contract and supplies observed expand, backfill, repeat-run and rollback evidence, with cleanup deferred; no fixed finding exists.

## Capacity

Candidate A is a high-volume, single-owner synchronous service. It has measured request headroom, saturation, storage and failure results, and no background work or tenant partition. Candidate B instead has a shared queue serving multiple tenants and presents A's explanation without any queue or fairness measurements.

## Callbacks

One external callback changes order state and can request costly processing. Another only returns a fixed public status; it has no downstream call, secret, privileged operation or variable-cost work. No authorization matrix or work-limit evidence was supplied for either. State what each would need for a packaged technical pass.

## Changed Code

An established plugin adds a parser. The repo checker measures a new method above its documented hard limit; a public caller depends on the parser's existing error behavior. There is no duplication finding or explicit refactor request. A separate change updates one label, stays within limits, and has no behavior change.
