# Changelog

Every release of brand-codex, newest first. Versions follow the rules in `CONVENTIONS.md`: renaming or removing a semantic token is major, adding tokens, components or icons is minor, and changing a value or fixing a description is a patch. `npm run build` fails if the version in `package.json` has no entry here.

## [1.6.0] - 2026-10-16

### Added
- `CHANGELOG.md`, linked from every version number in the showcase (hero eyebrow, accession label, footers).
- Version link pattern (`cx-version`): the version number is a link to this file, with a "View changelog" tooltip and the `arrow-outward` icon because it leaves the site.
- `cx-tooltip--above` modifier for tooltips near the bottom of the page.
- Build check: the build stops if `CHANGELOG.md` has no entry for the current version.
- `dist/tokens.js`: the tokens as an ES module (`version`, `changelog`, `tokens`), exported as `@aitrien/brand-codex/tokens.js`.
- MIT `LICENSE` for the code, tokens and docs. Fonts and icons keep their own licences.

### Changed
- Header lede: "page templates for connected applications".
- The repo's `hugo.toml` now mounts `fonts/` at `static/fonts` as well as `dist/` at `assets/brand-codex`, so a site only needs the import line.

## [1.5.1] - 2026-10-15

### Changed
- Replaced the sample blockquote. It had reused a line from a reference site without attribution; it now carries an attributed quotation with its source in `<cite>`.
- `cite` inside blockquote footers is set upright, matching the mono label voice.

### Added
- Attribution rules in `prose.md` and the README: quote only with a named person and a traceable source; never copy wording from reference sites into sample content.

## [1.5.0] - 2026-10-15

### Added
- Full ornament catalogue: all 80 non-emoji Yarndings 12 glyphs, named and grouped (botanical, frost, stitch, diamond, mark) in `font.family.ornament` → `codex.glyphs`, with `roles` for the system's own ornaments and a `forbidden` set.
- Validator rules for the catalogue: kebab-case names, known groups, no shared glyphs, no forbidden glyphs.
- Showcase glyph section generated from the tokens.

### Fixed
- The footer ornament band stopped short on wide screens. It now covers more than an 8K display.

## [1.4.1] - 2026-10-15

### Fixed
- Specimen plate seeds now grow and shrink around their own centres. They were anchored at one corner because the centring transform was applied before the pulse scale.

## [1.4.0] - 2026-10-15

### Added
- Specimen plate pulse: seeds scale 1 → 1.5 → 1 with a phase offset by radius, so a wave travels from the centre outward.
- `motion.duration.pulse` and `motion.easing.pulse` tokens.
- Pause control for the plate: a native checkbox styled as an icon-only pill, so it works without JavaScript; `pause` and `play` icons.
- Tooltips on `<label>` controls.

### Changed
- Motion principle: state changes animate, plus the plate's pausable pulse; reduced motion stops it and removes the control.

## [1.3.1] - 2026-10-15

### Changed
- The current nav item is highlighted with `color.surface.highlight` instead of an underline; hover uses `color.surface.hover`.
- Heading anchors sit in a 44px round target, like the theme toggle.
- `radius.pill` covers buttons and icon-only controls.

## [1.3.0] - 2026-10-15

### Added
- Tooltip component, with `color.surface.inverse` and `color.text.inverse`.
- `ash.850` primitive for raised surfaces in dark mode.
- `dist/showcase.standalone.html`, a complete document for opening locally.

### Changed
- Theme toggle: an icon-only circle that shows the action ("Switch to dark theme"). Clicking flips the visible theme; returning to the system theme clears the stored choice.
- Copy button and theme toggle are pills; `radius.control` is square.
- Dark surfaces: page `ash.900`, raised `ash.850`, sunken `ash.950`, hover `ash.800` (slightly darkened so secondary text keeps 7:1).

### Removed
- `theme-auto` icon.

### Fixed
- The inline icon sprite could render as an empty box above the header outside the publishing host.
- Icons blocked hover on the controls that contain them.

## [1.2.0] - 2026-10-15

### Added
- `radius.pill` token; `cx-button` is pill-shaped.
- Heading anchor component, on every major section heading.

### Changed
- `radius.control` is square.

## [1.1.0] - 2026-10-15

### Added
- Material Symbols (Sharp, weight 300) as a self-hosted SVG sprite with `icons/manifest.json`; build fails on unknown icon references.
- Icon component and `size.icon.*` tokens.
- Separator component (`cx-sep`): a muted pipe hidden from screen readers.

### Changed
- Separators are "|" instead of "·".
- Button arrows, pagination, theme toggle, copy button, callout titles, TOC chevron and footer links use icons.

### Fixed
- Table row headers no longer take the uppercase column-header style.

## [1.0.0] - 2026-10-14

### Added
- DTCG tokens: colour, typography, space, size, radius, border and motion, with primitive and semantic tiers, dark mode via `codex.modes` and contrast pairs via `codex.pairsWith`.
- Component docs, Chroma syntax mapping, README principles and the showcase page.
- `npm run validate`, `build` and `audit`.

[1.6.0]: https://github.com/Aitrien/brand-codex/blob/main/CHANGELOG.md#160---2026-10-16
[1.5.1]: https://github.com/Aitrien/brand-codex/blob/main/CHANGELOG.md#151---2026-10-15
[1.5.0]: https://github.com/Aitrien/brand-codex/blob/main/CHANGELOG.md#150---2026-10-15
[1.4.1]: https://github.com/Aitrien/brand-codex/blob/main/CHANGELOG.md#141---2026-10-15
[1.4.0]: https://github.com/Aitrien/brand-codex/blob/main/CHANGELOG.md#140---2026-10-15
[1.3.1]: https://github.com/Aitrien/brand-codex/blob/main/CHANGELOG.md#131---2026-10-15
[1.3.0]: https://github.com/Aitrien/brand-codex/blob/main/CHANGELOG.md#130---2026-10-15
[1.2.0]: https://github.com/Aitrien/brand-codex/blob/main/CHANGELOG.md#120---2026-10-15
[1.1.0]: https://github.com/Aitrien/brand-codex/blob/main/CHANGELOG.md#110---2026-10-15
[1.0.0]: https://github.com/Aitrien/brand-codex/blob/main/CHANGELOG.md#100---2026-10-14
