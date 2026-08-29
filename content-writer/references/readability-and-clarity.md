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
