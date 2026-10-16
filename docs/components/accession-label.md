---
name: accession-label
status: stable
tokens:
  - border.width.hairline
  - color.border.default
  - color.border.subtle
  - color.link.rest
  - color.ornament.muted
  - color.status.success.text
  - color.status.warning.text
  - color.surface.raised
  - color.text.accent
  - color.text.muted
  - color.text.primary
  - font.family.mono
  - font.line-height.ui
  - font.size.label
  - font.tracking.label
  - font.tracking.ui
  - font.weight.ui
  - radius.round
  - size.mark.tick
  - space.inline.sm
  - space.inline.xs
  - space.inset.md
  - space.inset.sm
  - space.stack.sm
  - space.stack.xs
---

# Accession label

The system's signature: a herbarium-style label that gives an entry its catalogue number and key facts, framed by registration ticks.

## When to use

- At the top of a project case study (full label) and on a 404 ("No. — / Not in collection").
- In compact form (`.cx-id`) on project cards, post rows and post meta lines.
- Wherever an entry needs a stable, citable identifier.

## When not to use

- For decorative badges or skill lists; use `tag`.
- For more than six fields. Move the rest into the prose.
- On pages that are not catalogued entries (home, indexes).

## Catalogue numbers

`LM-{collection}-{sequence}`, with the sequence zero-padded to three digits and never reused.

| Collection | Code | Example |
|---|---|---|
| Work (projects, case studies) | `W` | `LM-W-004` |
| Writing (posts) | `P` | `LM-P-031` |

Store the number in front matter (`accession: LM-W-004`) rather than deriving it from the date or slug, so it survives renames.

## Markup

```html preview
<dl class="cx-label" aria-label="Accession label">
  <div class="cx-label__id"><dt>No.</dt><dd>LM-W-001</dd></div>
  <div><dt>Filed</dt><dd><time datetime="2026-03-14">2026-03-14</time></dd></div>
  <div><dt>Role</dt><dd>Sole engineer</dd></div>
  <div><dt>Stack</dt><dd>React <span class="cx-sep" aria-hidden="true">|</span> WebGL <span class="cx-sep" aria-hidden="true">|</span> Vite</dd></div>
  <div><dt>Status</dt><dd><span class="cx-status cx-status--live">Live</span></dd></div>
</dl>

<!-- Compact form -->
<p class="cx-id"><span class="cx-id__no">LM-P-031</span><time datetime="2026-10-02">2026-10-02</time><span>6 min read</span></p>
```

## Do

- Put the number first, then the date, then everything else.
- Use ISO dates (`2026-03-14`) in tabular figures.
- Separate items inside a field with `cx-sep` (a hidden "|"). The compact form adds its own "|" between items.
- Use `cx-status--live`, `--building` or `--archived`; each pairs a dot with a word.

## Don't

- Don't use more than one full label per page.
- Don't put links to unrelated pages in the label; it describes the entry.
- Don't recolour the ticks or use them on other components except the specimen plate.

## Accessibility

- `<dl>` with `<dt>`/`<dd>` pairs is read as name–value pairs. Give the list `aria-label="Accession label"`.
- Status is a word plus a dot, never colour alone.
- The ticks are a background on a pseudo-element and are invisible to assistive tech.
- Pairs: `color.text.accent` on `color.surface.raised` (4.5:1); `color.text.muted` on `color.surface.raised` (4.5:1); `color.status.*.text` on `color.surface.raised` (4.5:1).
