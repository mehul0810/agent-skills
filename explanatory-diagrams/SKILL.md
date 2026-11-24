---
name: explanatory-diagrams
description: Create or repair an editable diagram when a reader needs to trace a relationship, decision, or change of state. Use for documentation, architecture explainers, and editorial graphics; not for ordinary copy edits, decorative art, or graph-based engineering assurance.
---

# Explanatory Diagrams

Start with the question the reader should be able to answer by pointing at the drawing. Keep the supplied facts, audience, destination, size and requested editable format. If a sentence or table answers the question better and no diagram was requested, use that instead.

**Find the picture in the subject.** Trace one real example, preferably the fork, exception or handoff readers confuse. For alternatives, change how the reader finds the answer: a timeline shows *when*, a lane shows *who*, a state transition shows *what can happen next*. Different colors on the same boxes are not different explanations. Use a familiar layout if it wins; keep the existing visual language and limit a requested repair to the defect.

**Give every mark a meaning.** For a consequential connection, read it aloud as "source, verb or condition, destination" and locate the evidence. An arrow for "points to" may run opposite to "creates." A boundary is not an actor. Don't join alternatives in a sequence or imply a return path. When nothing changes, put that condition *inside its current state* or on a labeled self-loop, not next to the arrow that advances it. Put the advancing condition on its own edge. Omit or label an unverified relation; distinguish planned from shipped without relying on color.

**Deliver an artifact, not a drawing prescription.** Keep requested Mermaid, SVG, or native diagram objects editable in their actual destination. For an unconstrained, static web graphic, local SVG with live text is sufficient; don't add a renderer, hosted service, or remote font by default. Provide the decisive relationships in accessible text alongside a published image, including conditions and the exception. A screenshot or SVG export is not a native editable board.

**Read the result as a stranger.** Trace an ordinary path and an exception in the render. Does the visible arrow tip actually reach its destination border or port after marker offsets? Does its label have only one plausible connection? At delivery size and narrow width, inspect crossings, clipping and type size. Recompose rather than just shrinking a wide canvas. Use shape, labels or line patterns as well as color. Report what was rendered and checked, where the source lives, and anything unresolved. A correct drawing does not prove the depicted system ran.
