# Readability And Clarity

Use this reference for public content, documentation-like marketing copy, UX copy, or an explicit readability, comprehension, accessibility, or localization review. It complements organic-search and enterprise writing; it is not an authorship detector or a universal reading-score gate.

## Audience And Task Calibration

- Define the audience, task, consequence of misunderstanding, language/locale, channel or device, prior knowledge, and required action before editing.
- Prefer familiar concrete words, active voice, direct subjects, and one idea per sentence or paragraph when that improves comprehension. Keep necessary technical terms and define them at first use.
- Put the answer or action early. Use meaningful headings, logical H1-H2-H3 structure, and short scannable sections. Lists and tables are useful only when they reduce cognitive load; heading levels are not visual sizing tools.

## Plain Language And Structure

- Remove throat-clearing, noun stacks, passive or nominalized abstractions, duplicate introductions, unexplained jargon, and filler when they delay the reader's goal.
- Use progressive disclosure: summary or decision first, then mechanism, conditions, examples, and deeper detail. Do not flatten security, legal, technical, or compatibility nuance to make prose shorter.
- Link text must work when read out of context and describe its destination; avoid `click here`. Preserve exact numbers, dates, units, code, placeholders, warnings, and required terminology.

## Accessibility And Localization

- Expand an acronym or initialism at first use, explain unusual terms, use semantic headings, preserve list/table relationships, set the language of the page and relevant parts, and provide meaningful alt text or text equivalents for media.
- Avoid idioms, culture-bound metaphors, ambiguous pronouns, all-caps emphasis, and concatenated UI strings that break translation. Preserve placeholders and flag locale-specific review for translation, RTL, number, date, and plural conventions.
- When copy is delivered through WordPress UI, route implementation defects to `wp-site-expert`; content review still checks the words, hierarchy, labels, errors, and recovery instructions.

## Reading-Level Diagnostic

- Use a language-appropriate readability metric as a before/after signal, not a universal pass/fail rule or an SEO ranking proxy. WCAG 2.2 Success Criterion 3.1.5 is Level AAA and permits a simpler version or supplementary content for complex text.
- Pair the metric with a human comprehension check: can the target reader find the answer, explain it, perform the next action, and identify conditions or warnings? Inspect each substantial language rather than assuming one score represents a multilingual page.
- If a score conflicts with meaning, audience, voice, or required precision, preserve the meaning and document the exception instead of gaming the metric.

## Complex Or High-Stakes Content

- Precision, limitations, warnings, consent, and escalation outrank brevity for security, legal, medical, financial, privacy, compatibility, and release content. Use a layered plain-language summary plus a detailed procedure, definitions, examples, and human or domain review.
- Never simplify away a condition, risk, or failure path. Flag unresolved ambiguity and keep the source-backed qualification visible.

## Compact Review Receipt

Return: audience/task/language; key clarity findings; structural or terminology changes; metric and comprehension evidence; accessibility/localization notes; preserved constraints; and unresolved decisions or review needs.

## Official Anchors

- [WCAG 2.2](https://www.w3.org/TR/WCAG22/), [Understanding Readable](https://www.w3.org/WAI/WCAG21/Understanding/readable), and [Understanding Reading Level](https://www.w3.org/WAI/WCAG21/Understanding/reading-level.html)
- [ONS plain-language guidance](https://service-manual.ons.gov.uk/content/writing-for-users/plain-language)
- [UK Home Office heading guidance](https://design.homeoffice.gov.uk/accessibility/page-structure/headings)
- [Google AI features and your website](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)

## Explain For The Reader

- Record what the reader knows, what needs explanation and likely misconceptions; a job title alone is not a knowledge assessment. Label assumptions when reader research is absent.
- Translate features through the smallest useful sequence: what it does, why it matters, what to do and important limitations. Do not force all four into every sentence. Put concrete examples beside unfamiliar ideas; analogies must preserve the mechanism.
- Prefer familiar equivalent terms, define necessary jargon where it matters, and keep terminology consistent. Preserve verified interface labels so readers can find controls. Omit unnecessary acronyms instead of teaching them; never invent simpler product names or capabilities.
- Procedures need prerequisite, verified location, action, expected result and recovery. Distinguish optional from required steps; warnings precede risky actions. Unknown labels, permissions or results are evidence gaps, not permission to invent a walkthrough.
- Use coherent paragraphs and varied sentence rhythm, not compulsory one-sentence paragraphs. Headings should explain the path when scanned alone. Lists serve sets/steps; tables serve comparisons. If UI needs excessive explanation, route the confusing interaction to its owner instead of expanding a writing task into code changes.

## Numbers And Comprehension

- Supply units, timeframe, denominator/comparison baseline and scope when needed to interpret a number. Explain percentages with concrete equivalents where helpful; distinguish relative changes from percentage points.
- Example: a measured duration changing from 4 seconds to 2 seconds is a 50% reduction in that duration, not proof every page is twice as fast. Never invent missing measurements.
- Keep eligibility, costs, risks and uncertainty beside the claim/action. Preserve distinctions between can, usually, will and guaranteed; brevity must not remove conditions.
- Ask a representative reader to explain the main point, identify the next action and name the key condition/risk. An independent agent can flag likely confusion, but does not prove non-technical users understood the text. Record actual reader evidence or mark comprehension unverified. Never fabricate a readability score.

Reviewed 2026-09-08: [GOV.UK interface writing](https://www.gov.uk/service-manual/design/writing-for-user-interfaces), [W3C cognitive clear-content guidance](https://www.w3.org/WAI/WCAG2/supplemental/objectives/o3-clear-content/) and [CDC communication index](https://www.cdc.gov/ccindex/tool/how-to-use.html). W3C cognitive guidance is supplemental, not an additional WCAG conformance requirement; adapt CDC communication principles without imposing its health-material score on all writing.
