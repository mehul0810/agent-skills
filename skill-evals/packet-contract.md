# Blind Evaluation Packets

Author `input.json` separately from `criteria.md`. Input permits only `id`, `request`, and an explicit `artifacts` filename array. Place raw evaluator artifacts under `artifacts/`; never put scoring keys, implementation rationale, suspected defects or prior results there. Semantic blindness still requires author review: a schema cannot detect answer hints embedded in a valid request.

Run `node scripts/build-eval-packet.mjs build CASE OUTPUT` into a new directory. It copies only the request and allowlisted regular artifacts, excluding adjacent scoring files, symlinks and path escapes. It records exact Git revision and hashes. Freeze the manifest SHA-256 outside the packet in the durable review before dispatch. `node scripts/build-eval-packet.mjs verify OUTPUT` checks contents against the manifest; compare the externally frozen manifest hash as well, since rewriting both content and manifest otherwise changes the packet identity.

Give the fresh evaluator only the packet, owning skill and authorized runtime access. Keep criteria and implementer source outside the packet. Log loaded references, exposure, candidate identity and exact evidence limits. Filesystem separation is an instruction boundary, not an OS sandbox. After dispatch, changed input/manifest starts a new attempt; never repair the evidence in place. Freeze candidate screenshots independently before scoring; distinguish decision, rendered, interaction and native-author gates.

Existing mixed Markdown scenarios remain author-side specifications. Do not mechanically strip their Required/Forbidden paragraphs to create evaluator inputs. Write explicit input records and review their payload before dispatch. Historical contaminated attempts stay excluded.
