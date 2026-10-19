---
name: site-footer
status: stable
tokens:
  - border.width.hairline
  - color.border.subtle
  - color.link.hover
  - color.ornament.rest
  - color.surface.raised
  - color.text.muted
  - color.text.secondary
  - font.family.mono
  - font.family.ornament
  - font.line-height.display
  - font.line-height.ui
  - font.size.label
  - font.size.small
  - font.tracking.label
  - font.weight.ui
  - size.column.sidebar
  - size.measure.caption
  - size.ornament.sm
  - size.target.min
  - space.gutter.grid
  - space.inline.lg
  - space.inline.xs
  - space.inset.md
  - space.inset.xl
  - space.section.lg
  - space.stack.lg
  - space.stack.sm
---

# Site footer

The closing band of every page: a knitted ornament band, grouped links, a colophon and the legal line.

## When to use

- On every page, below `<main>`.
- To repeat the primary nav and add secondary destinations (RSS, recent work, source code).

## When not to use

- For content a reader needs to finish the page. Put it in `<main>`.
- For newsletter sign-ups or promotional blocks.

## Markup

```html preview
<footer class="cx-footer">
  <span class="cx-band" aria-hidden="true"></span>
  <div class="cx-container">
    <div class="cx-footer__grid">
      <div>
        <h2>Pages</h2>
        <ul>
          <li><a href="/work/">Work</a></li>
          <li><a href="/writing/">Writing</a></li>
          <li><a href="/about/">About</a></li>
          <li><a href="/index.xml"><svg class="cx-icon cx-icon--sm" aria-hidden="true" focusable="false"><use href="#cx-icon-rss"></use></svg>RSS feed</a></li>
        </ul>
      </div>
      <div>
        <h2>Colophon</h2>
        <p>Set in National Park and JetBrains Mono, with ornaments from Yarndings 12. Built with Hugo.</p>
      </div>
    </div>
  </div>
  <div class="cx-container">
    <div class="cx-footer__base">
      <span>© 2026 Liam Marshall</span>
      <a class="cx-version" href="https://github.com/Aitrien/brand-codex/blob/main/CHANGELOG.md" aria-label="Version 1.6.0: view changelog">Codex v1.6.0<svg class="cx-icon cx-icon--sm" aria-hidden="true" focusable="false"><use href="#cx-icon-arrow-outward"></use></svg><span class="cx-tooltip cx-tooltip--above" aria-hidden="true">View changelog</span></a>
      <a href="#top">Back to top<svg class="cx-icon cx-icon--sm" aria-hidden="true" focusable="false"><use href="#cx-icon-arrow-upward"></use></svg></a>
    </div>
  </div>
</footer>
```

## Do

- Keep two to four columns; the grid wraps on its own.
- Use the footer band as the page's single ornament when the page has no other.
- On a backdrop page, let the footer sit on the frost: `cx-backdrop-page` removes its raised surface, and the bottom fade starts above it.
- Put the codex version in the base row on sites that consume it, as a `cx-version` link to the changelog (`changelog` in `package.json`, also served in `dist/tokens.json`). Its tooltip opens above (`cx-tooltip--above`) because it sits at the bottom of the page.

## Don't

- Don't add a second ornament band elsewhere on the same page.
- Don't put social icons in place of text links. Name each destination.
- Mark links that leave the site with `arrow-outward` after the text; the only other footer icons are `rss` and `arrow-upward`.

## Accessibility

- `<footer>` is the page's contentinfo landmark; column headings are `<h2>` so they appear in the headings list.
- The band is `aria-hidden="true"` and has no text alternative because it carries no meaning.
- Links are at least 24px tall (`size.target.min`).
- Pairs: `color.text.secondary` on `color.surface.raised` (7:1); `color.text.muted` on `color.surface.raised` (4.5:1, labels only). On a backdrop page the frost is measured as `color.surface.base`; the contour lines beneath it are not part of the check.
