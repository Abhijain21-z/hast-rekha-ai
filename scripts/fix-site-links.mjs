/**
 * Normalise hardcoded site links inside the JSON content files to the canonical
 * www host (Vercel 308-redirects the apex, so apex links in article copy split
 * our ranking signals). Content is UTF-8 Devanagari, so this edits the raw text
 * instead of parse/stringify, keeping formatting and escapes byte-identical.
 */
import { readFileSync, writeFileSync } from "node:fs";

const files = ["src/content/blogs.json", "src/content/legal.json"];
const APEX = /https?:\/\/(?:www\.)?hastrekhaai\.online/gi;
const CANON = "https://www.hastrekhaai.online";

for (const f of files) {
  const before = readFileSync(f, "utf8");
  const after = before.replace(APEX, CANON);
  const n = (before.match(APEX) ?? []).length;
  if (n) writeFileSync(f, after, "utf8");
  console.log(`${f}: ${n} link(s) -> ${CANON}`);
}
