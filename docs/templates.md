# Page templates

Content hierarchy for the six page types. Every template keeps the full site header (Work, Writing, About, theme toggle) and the footer. Every `<h2>` section heading carries a heading anchor.

| Template | Order | Dominant | Secondary |
|---|---|---|---|
| **Home** | Header → statement (eyebrow, display h1, lede, primary + secondary button) beside the specimen plate → selected work (2–3 project cards) → recent writing (5 post rows) → capabilities table → footer | Statement and selected work | Writing rows, capabilities |
| **Project index** | Header → page head (h1 "Work", entry count, one-line intro) → tag filter → project cards or ledger, newest first → footer | The list of projects | Filter and intro |
| **Case study** | Header → back link "← All work" → accession label → h1 and lede → hero figure (Plate 1) → article layout: TOC + prose (Problem, Constraints, Approach, Outcome with a data table, What I'd change) → pagination → footer | Title and hero, then prose | Label, TOC |
| **Writing list** | Header → page head (h1 "Writing", description, RSS link) → tag filter → post rows grouped by year → pagination → footer | Post titles | Numbers, dates, tags |
| **Blog post** | Header → back link "← All writing" → meta line (`cx-id`: number, date, reading time) → h1 and lede → article layout: TOC (when three or more h2s) + prose with figures, code blocks and callouts → end mark → "Filed under" tags → pagination → footer | The prose column | Meta, TOC |
| **404** | Header → sprout ornament (lg) → accession label "No. — / Not in collection" → h1 "Page not found" → the requested path in mono → three links: Home, Work, Writing → footer | Heading and the routes out | Ornament, path |

## Catalogue numbers

- Work: `LM-W-001` onward. Writing: `LM-P-001` onward. Zero-padded, never reused, stored in front matter as `accession`.
- They appear on cards, post rows, post meta lines and case-study labels.

## Hugo front matter

```yaml
title: Interactive WebGL globe
accession: LM-W-001
date: 2026-03-14
summary: A React app that renders live routes on a 3D globe.
role: Sole engineer
stack: [React, WebGL, Vite]
status: live        # live | building | archived
tags: [react, webgl, a11y]
```
