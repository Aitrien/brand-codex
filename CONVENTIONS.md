# Conventions

These rules are the contract between this repo and everything that consumes it. The validator (`npm run validate`) enforces the naming rules; CI runs it on every push and PR.

## Token format

Tokens use the [Design Tokens Community Group (DTCG)](https://www.designtokens.org/) format: every token is an object with `$value` and `$type`, and **should** have a `$description` saying when to use it. The description is not decoration. The MCP server serves it to AI assistants, so write it as a usage rule.

```json
{
  "color": {
    "accent": {
      "$value": "{color.blue.600}",
      "$type": "color",
      "$description": "Primary actions and links. Never for large backgrounds."
    }
  }
}
```

## Two tiers

| Tier | Purpose | Example | Consumers use it? |
|---|---|---|---|
| **Primitive** | The raw palette and scales | `color.blue.600`, `size.4` | No. Only semantic tokens reference these |
| **Semantic** | Meaning, referenced by sites and components | `color.accent`, `space.md` | Yes |

Primitives live under a `primitive` group in each file and are marked `"$extensions": { "codex.tier": "primitive" }`. Changing a primitive's value is fine; consumers only see it through semantic tokens.

## Naming

- Path segments are lowercase `kebab-case` or plain integers: `color.text.muted`, `color.blue.600`.
- Order: **category → role → variant → state**. `color.surface.raised`, `color.accent.hover`.
- No raw values in names (`color.blue-2d55c8` ✗).
- Max depth 4 segments.

Categories and their planned files:

| File | Category prefix | Covers |
|---|---|---|
| `tokens/color.json` | `color` | palette primitives, text, surface, border, accent, status |
| `tokens/typography.json` | `font` | families, size scale, weights, line heights |
| `tokens/space.json` | `space` | spacing scale (4px base) |
| `tokens/radius.json` | `radius` | corner radii |
| `tokens/motion.json` | `motion` | durations, easings |

## Generated names

| Platform | Pattern | Example |
|---|---|---|
| CSS custom property | `--cx-` + path joined by `-` | `--cx-color-text-muted` |
| SCSS variable | `$cx-` + same | `$cx-color-text-muted` |
| JS | camelCase path | `tokens.color.text.muted` |

The `cx` prefix keeps tokens from colliding with a consuming site's own variables.

## Versioning (semver)

| Change | Bump |
|---|---|
| Rename or remove a semantic token | **major** |
| Add a token, add a component doc | minor |
| Change a value, fix a description | patch |

Consumers pin to a tag. Never move or delete a published tag.

## Files

- `dist/` is generated. It is committed only by the release workflow, because Hugo Modules fetch the tagged commit as-is.
- One component per file in `docs/components/`, following `_template.md`.
