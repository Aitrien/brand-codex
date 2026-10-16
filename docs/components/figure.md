---
name: figure
status: stable
tokens:
  - border.width.hairline
  - color.border.default
  - color.surface.raised
  - color.text.accent
  - color.text.secondary
  - font.family.mono
  - font.line-height.ui
  - font.size.label
  - font.size.small
  - font.tracking.label
  - font.weight.ui
  - size.column.card
  - size.container.breakout
  - size.measure.caption
  - size.measure.prose
  - space.inline.md
  - space.stack.lg
  - space.stack.sm
  - space.stack.xs
---

# Figure and caption

A framed image or diagram with a numbered plate label and a caption.

## When to use

- For screenshots, diagrams and charts in posts and case studies.
- For the hero image of a case study ("Plate 1").

## When not to use

- For decorative images; omit them.
- For code; use `code-block`. For tabular data; use `data-table`.

## Markup

```html preview
<figure class="cx-figure cx-figure--breakout cx-figure--diagram">
  <div class="cx-figure__frame">
    <svg viewBox="0 0 720 200" role="img" aria-labelledby="fig-pipeline"><title id="fig-pipeline">Tokens flow from JSON through the validator to CSS and the MCP server</title><!-- … --></svg>
  </div>
  <figcaption><span class="cx-figure__plate">Plate 2</span>One build feeds both consumers.</figcaption>
</figure>
```

## Do

- Number plates in order of appearance on the page, starting at 1. Plate 0 is reserved for the specimen plate.
- Write captions that say what to notice, not what the image is.
- Use `cx-figure--diagram` for SVG with text, so it scrolls instead of shrinking text below 12px on phones.
- Colour SVG through classes that use `color.*` tokens, never `fill="#…"`; diagrams then follow the theme.
- Use `color.data.1` to `color.data.5` in order for chart series, and label series directly.

## Don't

- Don't put text inside raster images.
- Don't stretch figures wider than `size.container.breakout`.

## Accessibility

- Informative images need `alt`, or `role="img"` with a `<title>` for SVG. The caption doesn't replace alt text.
- The plate number is plain text inside `<figcaption>`.
- Pairs: `color.text.secondary` caption on `color.surface.base` (7:1); `color.text.accent` plate label (4.5:1); data series on `color.surface.raised` (3:1).
