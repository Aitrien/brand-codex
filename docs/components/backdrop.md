---
name: backdrop
status: stable
tokens:
  - border.focus.offset
  - border.focus.width
  - border.width.contour
  - color.backdrop.grain
  - color.backdrop.saturation
  - color.backdrop.tint
  - color.focus.ring
  - color.surface.base
  - color.text.primary
  - color.text.secondary
  - motion.duration.drift
  - motion.duration.fast
  - motion.duration.plate
  - motion.easing.standard
  - radius.pill
  - size.backdrop.blur
  - size.backdrop.fade
  - size.target.touch
---

# Backdrop

The contour survey drawn full-bleed behind every page, under a grainy frost. The page's own surface fades out over its first and last `size.backdrop.fade`, so the frost shows behind the header and footer and reading happens on the plain surface.

## When to use

- On every page of a site built from the system, in all six templates (`templates.md`), 404 included.
- Once per page: one `cx-backdrop`, the first child of `<body class="cx-backdrop-page">`.
- With the backdrop pause control in the header (`site-header.md`), because the terrain drifts.

## When not to use

- On the same page as the specimen plate: one contour field per page. The showcase, which documents both, is the only exception.
- Inside a component or as a section background. The frost is one layer for the whole page.
- Behind layouts that need the plain surface from the very top, such as a full-screen app or a print stylesheet.

## Markup

The build writes the backdrop to `dist/backdrop.html` (the contours at time zero, sliced to cover the viewport). In Hugo, inline it first in `<body>` and load `dist/plate.js`, which drifts it:

```html preview
<body class="cx-backdrop-page">
  {{ (resources.Get "brand-codex/backdrop.html").Content | safeHTML }}
  <!-- <div class="cx-backdrop" aria-hidden="true" data-plate-seed="3"><svg class="cx-plate__map" preserveAspectRatio="xMidYMid slice" …>…</svg></div> -->
  <a class="cx-skip-link" href="#main">Skip to content</a>
  <header class="cx-header"><!-- site-header.md, with the backdrop pause control --></header>
  <main id="main"><!-- the template --></main>
  <footer class="cx-footer"><!-- site-footer.md --></footer>
  <script src="{{ (resources.Get "brand-codex/plate.js" | minify | fingerprint).RelPermalink }}" defer></script>
</body>
```

From the bottom up: the canvas (`color.surface.base`), the contours (`border.width.contour`, index contours twice that), the frost (`color.backdrop.tint` of the surface, `size.backdrop.blur`, `color.backdrop.saturation`), the grain (`color.backdrop.grain`, overlay-blended), then the page, whose surface is solid between the two fades.

## Do

- Load `dist/plate.js` on every page that has the backdrop. It starts the drift and reveals the header's pause control; without it the contours stay still and the control stays hidden.
- Let the header and footer sit on the frost. `cx-backdrop-page` removes their surfaces, and the header scrolls away with the page instead of sticking, because with no surface it would sit on top of the text below.
- Tune the look through the backdrop tokens only. The validator measures header and footer text over an index contour after every change (`codex.frost` on `color.backdrop.tint`), in both themes.
- Keep the opening statement inside the top fade, so it is the one piece of content that sits on the frost.

## Don't

- Don't give sections, panels or cards a frosted background of their own.
- Don't position `<body>` or give it a `z-index`. The backdrop paints at `z-index: -1` in the root stacking context, under the page's own surface.
- Don't raise `color.backdrop.grain` until the noise competes with text, or lower `color.backdrop.tint` below what the frost check allows.
- Don't put text, links or controls in the backdrop.

## Accessibility

- The backdrop is `aria-hidden` and carries no information.
- WCAG 2.2.2 (Pause, Stop, Hide): the drift runs longer than five seconds, so the header's pause control (a native checkbox named "Pause background animation"; checked means paused) stops it. It ships `hidden`; the script reveals it when the drift starts. The drift also stops off screen and in hidden tabs.
- Under `prefers-reduced-motion: reduce` the contours never move and the pause control stays hidden.
- Reading text below the top fade sits on `color.surface.base`, so the declared pairs apply. Header and footer text sits on the frost: the validator models its worst case (an index contour directly under the text) and requires `color.text.primary`, `color.text.secondary` and the link colours at 7:1, and `color.text.muted` and `color.text.accent` at 4.5:1, in both themes (`dist/contrast.md`). On a short page the two fades meet, so this covers its content too.
- Without `backdrop-filter` support the frost becomes the plain surface, so contrast never depends on the blur.
