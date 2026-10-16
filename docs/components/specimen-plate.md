---
name: specimen-plate
status: stable
tokens:
  - border.focus.offset
  - border.focus.width
  - border.width.hairline
  - color.border.default
  - color.border.strong
  - color.focus.ring
  - color.ornament.muted
  - color.ornament.rest
  - color.ornament.strong
  - color.surface.hover
  - color.surface.raised
  - color.text.muted
  - color.text.primary
  - color.text.secondary
  - font.family.mono
  - font.size.label
  - font.tracking.ui
  - motion.duration.base
  - motion.duration.fast
  - motion.duration.plate
  - motion.duration.pulse
  - motion.easing.enter
  - motion.easing.pulse
  - motion.easing.standard
  - radius.pill
  - radius.round
  - size.column.card
  - size.mark.tick
  - size.ornament.sm
  - size.target.touch
  - space.inset.md
  - space.inset.sm
  - space.stack.sm
---

# Specimen plate

A CSS-only phyllotaxis seed head (Vogel's model: seed n at angle n × 137.508° and radius √n) that pulses outward from the centre, framed with registration ticks and captioned as Plate 0.

## When to use

- Once, beside the statement on a home page or a product's landing page.
- As the only decorative graphic on that page, and the only looping motion on the site.

## When not to use

- On article, index or 404 pages.
- As a loading indicator or to represent data.
- Without its pause control.

## Markup

Generate the seeds in a Hugo partial (`{{ range seq 233 }}<i style="--n: {{ . }}"></i>{{ end }}`):

```html preview
<figure class="cx-plate-frame">
  <label class="cx-plate__pause">
    <input class="cx-visually-hidden" type="checkbox" aria-label="Pause animation">
    <svg class="cx-icon" data-when="running" aria-hidden="true" focusable="false"><use href="#cx-icon-pause"></use></svg>
    <svg class="cx-icon" data-when="paused" aria-hidden="true" focusable="false"><use href="#cx-icon-play"></use></svg>
    <span class="cx-tooltip" aria-hidden="true"><span data-when="running">Pause animation</span><span data-when="paused">Play animation</span></span>
  </label>
  <div class="cx-plate" aria-hidden="true" style="--count: 233">
    <i style="--n: 1"></i><i style="--n: 2"></i><!-- … through 233 -->
  </div>
  <figcaption>Plate 0 <span class="cx-sep" aria-hidden="true">|</span> Vogel's model <span class="cx-sep" aria-hidden="true">|</span> 233 seeds at 137.508°</figcaption>
</figure>
```

## Do

- Use a Fibonacci count (89, 144, 233) so the spiral arms close cleanly.
- Keep the caption factual: model, count and angle.
- Let the draw-in run once on load (`motion.duration.plate`, staggered linearly), then the pulse: every seed scales 1 → 1.5 → 1 over `motion.duration.pulse` with `motion.easing.pulse`, its phase offset by its radius (√n / √count), so a wave travels from the centre to the rim.
- Keep the pause control. It is a native checkbox inside a pill (`radius.pill`), so it pauses the pulse with CSS alone (`:has(:checked)`), with or without JavaScript. It appears when the plate is hovered or focused, and is always visible on touch screens.

## Don't

- Don't rotate the plate, speed the pulse up, or make it react to the pointer.
- Don't add a second looping animation anywhere on the page.
- Don't put text or links inside the plate.

## Accessibility

- The seeds are `aria-hidden`; the caption is the only text.
- WCAG 2.2.2 (Pause, Stop, Hide): the pulse runs longer than five seconds, so the pause control is always reachable by keyboard (Tab, then Space) and is named "Pause animation"; its checked state means paused.
- Under `prefers-reduced-motion: reduce` the plate renders fully drawn and still, and the pause control is removed because there is nothing to pause.
- Seeds use `color.ornament.rest` (3:1 on the page) with accent and muted seeds marking two spiral arms.
