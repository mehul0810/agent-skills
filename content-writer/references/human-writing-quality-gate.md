# Human Writing Quality Gate

Use this reference only for public-facing copy, voice-preserving edits, or explicit requests to detect generic AI-writing patterns. Load it after facts and product claims are verified. Do not load it for research, code, routine GitHub text, release metadata, or unchanged technical documentation.

## Select One Mode

- **Draft:** Write from the approved brief and evidence. Apply this gate once after the factual and intent review.
- **Edit:** Read the whole draft, identify its purpose and a few voice signals, then make the minimum effective edit. Return the revised draft and a concise change summary.
- **Detect:** Do not rewrite, score, or guess whether AI wrote the text. Report only observed patterns as `pattern | quoted evidence | effect | short fix`.

Do not silently switch modes. Detection is evidence gathering, not an authorship classifier.

## Preserve Before Polishing

Keep the writer's meaning, vocabulary, cadence, confidence, humor, technical precision, and useful irregularity. Preserve:

- verified facts, limitations, sources, product-status language, and intentional uncertainty;
- primary search intent, important entities, descriptive anchors, accessibility meaning, and conversion action;
- strong sentences and rhetorical devices that serve the audience.

Never invent a claim, statistic, quotation, example, opinion, transition, or customer outcome to make prose sound stronger. Ask or flag the gap when meaning is unclear.

## Pattern Review

Correct a pattern only when it weakens the text:

- **Empty setup:** throat-clearing, faux-insight framing, self-answered rhetorical questions, or delayed conclusions.
- **Unsupported authority:** vague experts, studies, consensus, superlatives, or importance claims without named evidence.
- **Abstract language:** inflated nouns, weak verb phrases, generic benefits, or human actions assigned to systems without a clear mechanism.
- **Mechanical variation:** synonym cycling, repeated sentence templates, artificial symmetry, stacked fragments, or uniform paragraph rhythm.
- **Decorative structure:** dramatic reveals, excessive emphasis, unnecessary headings, emoji decoration, or lists that obscure a simpler explanation.
- **Redundant closure:** summaries that merely repeat the draft or metaphorical endings that replace a concrete takeaway.

Prefer direct subjects, specific mechanisms, named evidence, and concrete outcomes already supported by the source material.

Do not maintain a universal banned-word or punctuation list. A contrast, fragment, colon, technical term, or dash may be correct when it improves meaning or preserves the writer's voice. Repetition may be clearer than forced synonyms.

## Evaluation

Before returning an edit, mark each check internally as pass or fail:

1. The purpose, audience, meaning, and requested action remain intact.
2. No facts, claims, sources, examples, or product capabilities were invented.
3. Distinctive voice survived; strong human sentences were left alone.
4. Edits are proportional to the actual problem rather than a wholesale rewrite.
5. Unsupported authority, filler, abstraction, and robotic repetition were removed or flagged.
6. Search intent, entities, accessibility, and useful technical precision remain intact.
7. Intentional rhetoric was judged in context rather than rejected mechanically.
8. The result sounds natural when read aloud and ends on a concrete point or next action.

Fix failed checks once. If uncertainty remains, surface the disputed passage and assumption instead of repeatedly rewriting it.

## Source Note

This gate adapts the evidence-led detection, voice-preservation, and minimum-edit concepts from [`petergyang/no-ai-slop`](https://github.com/petergyang/no-ai-slop) under its MIT license. The rules here are contextual rather than blanket style bans.
