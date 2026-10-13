// Validates tokens/*.json against CONVENTIONS.md.
// Phase 0: parse check + naming rules. Phase 1 adds reference and contrast checks.
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const DIR = new URL("../tokens/", import.meta.url);
const SEGMENT = /^([a-z][a-z0-9]*(-[a-z0-9]+)*|[0-9]+)$/;
const MAX_DEPTH = 4;
const errors = [];
const warnings = [];
let count = 0;

function walk(node, path, file) {
  if (node && typeof node === "object" && "$value" in node) {
    count++;
    const name = path.join(".");
    if (!node.$type) errors.push(`${file}: ${name} is missing $type`);
    if (!node.$description) warnings.push(`${file}: ${name} has no $description`);
    const semanticDepth = path[0] === "primitive" ? path.length - 1 : path.length;
    if (semanticDepth > MAX_DEPTH) errors.push(`${file}: ${name} is deeper than ${MAX_DEPTH} segments`);
    return;
  }
  for (const [key, child] of Object.entries(node ?? {})) {
    if (key.startsWith("$")) continue;
    if (!SEGMENT.test(key)) errors.push(`${file}: "${[...path, key].join(".")}" segment "${key}" must be lowercase kebab-case or an integer`);
    walk(child, [...path, key], file);
  }
}

let files = [];
try {
  files = (await readdir(DIR)).filter((f) => f.endsWith(".json"));
} catch {
  console.log("No tokens/ directory yet. Nothing to validate.");
  process.exit(0);
}

for (const file of files) {
  try {
    walk(JSON.parse(await readFile(join(DIR.pathname, file), "utf8")), [], file);
  } catch (e) {
    errors.push(`${file}: invalid JSON (${e.message})`);
  }
}

warnings.forEach((w) => console.warn(`warn  ${w}`));
errors.forEach((e) => console.error(`error ${e}`));
console.log(`${files.length} file(s), ${count} token(s), ${errors.length} error(s), ${warnings.length} warning(s)`);
process.exit(errors.length ? 1 : 0);
