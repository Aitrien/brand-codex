// Shared token tooling for brand-codex: load, flatten, resolve, validate, contrast.
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
export const PREFIX = 'cx';

/** Category prefix each token file may define (CONVENTIONS.md). */
export const FILE_CATEGORY = {
  'color.json': 'color',
  'typography.json': 'font',
  'space.json': 'space',
  'size.json': 'size',
  'radius.json': 'radius',
  'border.json': 'border',
  'motion.json': 'motion',
};

const SEGMENT = /^(?:[a-z][a-z0-9]*(?:-[a-z0-9]+)*|[0-9]+)$/;
const MAX_DEPTH = 4;
const ALIAS = /^\{([^{}]+)\}$/;

/** Load every token file and flatten into a Map(path -> token). */
export function loadTokens(dir = join(ROOT, 'tokens')) {
  const tokens = new Map();
  const errors = [];
  for (const file of readdirSync(dir).filter((f) => f.endsWith('.json')).sort()) {
    const json = JSON.parse(readFileSync(join(dir, file), 'utf8'));
    walk(json, [], undefined, file);
  }
  function walk(node, path, inheritedType, file) {
    const type = node.$type ?? inheritedType;
    if ('$value' in node) {
      const p = path.join('.');
      if (tokens.has(p)) errors.push(`${p}: defined twice`);
      tokens.set(p, {
        path: p,
        segments: path,
        file,
        type,
        value: node.$value,
        description: node.$description,
        deprecated: node.$deprecated,
        extensions: node.$extensions ?? {},
        tier: path[0] === 'primitive' ? 'primitive' : 'semantic',
      });
      return;
    }
    for (const [k, v] of Object.entries(node)) {
      if (k.startsWith('$')) continue;
      if (v && typeof v === 'object' && !Array.isArray(v)) walk(v, [...path, k], type, file);
      else errors.push(`${[...path, k].join('.')}: not a token or group`);
    }
  }
  return { tokens, errors };
}

export const isAlias = (v) => typeof v === 'string' && ALIAS.test(v);
export const aliasTarget = (v) => v.match(ALIAS)[1];

/** Follow aliases to a raw $value. */
export function resolve(tokens, value, seen = []) {
  if (!isAlias(value)) return value;
  const target = aliasTarget(value);
  if (seen.includes(target)) throw new Error(`alias cycle: ${[...seen, target].join(' -> ')}`);
  const t = tokens.get(target);
  if (!t) throw new Error(`unresolved alias {${target}}`);
  return resolve(tokens, t.value, [...seen, target]);
}

/** Resolved value of a token in a mode ('light' | 'dark'). */
export function resolveIn(tokens, path, mode = 'light') {
  const t = tokens.get(path);
  if (!t) throw new Error(`unknown token ${path}`);
  const dark = t.extensions['codex.modes']?.dark;
  return resolve(tokens, mode === 'dark' && dark ? dark : t.value);
}

export const cssVar = (path) => `--${PREFIX}-${path.replace(/\./g, '-')}`;

// ------------------------------------------------------------------ value shapes (DTCG 2025.10)
const isNum = (n) => typeof n === 'number' && Number.isFinite(n);
const SHAPES = {
  color: (v) => v && v.colorSpace === 'srgb' && Array.isArray(v.components) && v.components.length === 3 &&
    v.components.every((c) => isNum(c) && c >= 0 && c <= 1) && (!v.hex || /^#[0-9a-f]{6}$/.test(v.hex)),
  dimension: (v) => v && isNum(v.value) && ['px', 'rem'].includes(v.unit),
  duration: (v) => v && isNum(v.value) && ['ms', 's'].includes(v.unit),
  cubicBezier: (v) => Array.isArray(v) && v.length === 4 && v.every(isNum) && v[0] >= 0 && v[0] <= 1 && v[2] >= 0 && v[2] <= 1,
  fontFamily: (v) => typeof v === 'string' || (Array.isArray(v) && v.length > 0 && v.every((s) => typeof s === 'string')),
  fontWeight: (v) => isNum(v) && v >= 1 && v <= 1000,
  number: isNum,
};

/** Validate naming rules, tiers, descriptions, aliases, modes and value shapes. */
export function validate(tokens) {
  const errors = [];
  for (const t of tokens.values()) {
    const { path, segments } = t;
    const depth = segments.length;
    // Naming: kebab-case or integers, max 4 segments counting the `primitive` group.
    segments.forEach((s) => { if (!SEGMENT.test(s)) errors.push(`${path}: segment "${s}" is not kebab-case or an integer`); });
    if (depth > MAX_DEPTH) errors.push(`${path}: ${depth} segments (max ${MAX_DEPTH})`);
    if (/[0-9a-f]{6}/i.test(path)) errors.push(`${path}: raw value in name`);
    // Category matches file.
    const category = FILE_CATEGORY[t.file];
    const cat = t.tier === 'primitive' ? segments[1] : segments[0];
    const okCat = t.file === 'size.json' && t.tier === 'primitive' ? cat === 'size' : cat === category;
    if (!okCat) errors.push(`${path}: category "${cat}" does not belong in ${t.file} (expected "${category}")`);
    // Type and shape.
    if (!t.type) { errors.push(`${path}: no $type`); continue; }
    if (!SHAPES[t.type]) errors.push(`${path}: unsupported $type ${t.type}`);
    // Tiers.
    if (t.tier === 'primitive') {
      if (t.extensions['codex.tier'] !== 'primitive') errors.push(`${path}: primitive without $extensions["codex.tier"] = "primitive"`);
      if (isAlias(t.value)) errors.push(`${path}: primitives must hold raw values, not aliases`);
    } else {
      if (!t.description || t.description.length < 12) errors.push(`${path}: semantic token needs a usage-rule $description`);
      if (!isAlias(t.value)) errors.push(`${path}: semantic tokens must reference a primitive`);
      else if (!aliasTarget(t.value).startsWith('primitive.')) errors.push(`${path}: semantic tokens must reference primitives, not {${aliasTarget(t.value)}}`);
    }
    // Resolution and shape.
    try {
      const v = resolve(tokens, t.value);
      if (SHAPES[t.type] && !SHAPES[t.type](v)) errors.push(`${path}: $value does not match DTCG ${t.type} shape`);
      const target = isAlias(t.value) ? tokens.get(aliasTarget(t.value)) : null;
      if (target && target.type !== t.type) errors.push(`${path}: type ${t.type} aliases ${target.path} of type ${target.type}`);
    } catch (e) { errors.push(`${path}: ${e.message}`); }
    // Modes.
    const dark = t.extensions['codex.modes']?.dark;
    if (dark !== undefined) {
      if (!isAlias(dark) || !tokens.has(aliasTarget(dark))) errors.push(`${path}: codex.modes.dark must alias an existing token`);
      else if (tokens.get(aliasTarget(dark)).type !== t.type) errors.push(`${path}: dark alias type mismatch`);
    }
    if (t.tier === 'semantic' && t.type === 'color' && dark === undefined) errors.push(`${path}: semantic colour has no codex.modes.dark`);
    // Deprecation (DTCG $deprecated): a semantic token kept for one more major, with a reason.
    if (t.deprecated !== undefined) {
      if (t.tier === 'primitive') errors.push(`${path}: deprecate the semantic token, not the primitive`);
      if (typeof t.deprecated !== 'string' || t.deprecated.length < 12) errors.push(`${path}: $deprecated must be a sentence saying why and when it goes`);
    }
    // Pairs.
    for (const pair of t.extensions['codex.pairsWith'] ?? []) {
      if (!tokens.has(pair.token)) errors.push(`${path}: pairsWith unknown token ${pair.token}`);
      if (!isNum(pair.min)) errors.push(`${path}: pairsWith ${pair.token} needs a numeric min`);
    }
  }
  return errors;
}

// ------------------------------------------------------------------ contrast (WCAG 2.x)
export const hexOf = (c) => c.hex ?? '#' + c.components.map((x) => Math.round(x * 255).toString(16).padStart(2, '0')).join('');
function luminance(c) {
  const [r, g, b] = c.components.map((x) => (x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
export function ratio(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** Every declared pair, measured in both modes. */
export function contrastReport(tokens) {
  const rows = [];
  for (const t of tokens.values()) {
    for (const pair of t.extensions['codex.pairsWith'] ?? []) {
      const r = {};
      for (const mode of ['light', 'dark']) {
        const fg = resolveIn(tokens, t.path, mode);
        const bg = resolveIn(tokens, pair.token, mode);
        r[mode] = { ratio: ratio(fg, bg), fg: hexOf(fg), bg: hexOf(bg) };
      }
      rows.push({ fg: t.path, bg: pair.token, min: pair.min, ...r, pass: r.light.ratio >= pair.min && r.dark.ratio >= pair.min });
    }
  }
  return rows;
}

// ------------------------------------------------------------------ frost (docs/components/backdrop.md)
// Header and footer text on a backdrop page sits on the frost, not on a token surface. Model its worst case: an
// index contour (twice border.width.contour) directly under the text, blurred by size.backdrop.blur (CSS blur() is
// a Gaussian with that standard deviation, so the line's peak coverage is erf(w / (2√2 σ))), then
// color.backdrop.tint of the page surface laid over it. The grain is overlay-blended noise, neutral on average, and
// the saturation boost is left out (it shifts hue far more than luminance).
const erf = (x) => { // Abramowitz and Stegun 7.1.26
  const t = 1 / (1 + 0.3275911 * Math.abs(x));
  const y = 1 - ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
  return Math.sign(x) * y;
};
const px = (v) => (v.unit === 'rem' ? v.value * 16 : v.value);
const mixColor = (a, b, t) => ({ colorSpace: 'srgb', components: a.components.map((x, i) => x * t + b.components[i] * (1 - t)) });

export function frostReport(tokens) {
  const tint = tokens.get('color.backdrop.tint');
  const spec = tint?.extensions['codex.frost'];
  if (!spec) return [];
  const share = resolve(tokens, tint.value) / 100;
  const sigma = px(resolve(tokens, tokens.get('size.backdrop.blur').value));
  const width = 2 * px(resolve(tokens, tokens.get('border.width.contour').value));
  const coverage = sigma > 0 ? erf(width / (2 * Math.SQRT2 * sigma)) : 1;
  return spec.pairs.map((pair) => {
    const r = {};
    for (const mode of ['light', 'dark']) {
      const surface = resolveIn(tokens, spec.surface, mode);
      const frost = mixColor(surface, mixColor(resolveIn(tokens, spec.line, mode), surface, coverage), share);
      const fg = resolveIn(tokens, pair.token, mode);
      r[mode] = { ratio: ratio(fg, frost), fg: hexOf(fg), bg: hexOf(frost) };
    }
    return { fg: pair.token, bg: 'frost', min: pair.min, coverage, ...r, pass: r.light.ratio >= pair.min && r.dark.ratio >= pair.min };
  });
}
