/**
 * Per-language overlays for the astrological content in `src/content`.
 *
 * Each overlay is a flat map from the English source string to that language's
 * translation, plus optional path overrides (e.g. `"nakshatras[3].deity"`) for
 * the rare word that needs a different translation in different places (the
 * yoga "Brahma" is ब्रह्म, the deity Brahma is ब्रह्मा).
 *
 * `localize()` fills the language key on every `{ en, hi }` value at load time,
 * falling back to the English source, so the UI can index content by the active
 * language without ever hitting `undefined`.
 */
import mr from "./mr.json";
import te from "./te.json";
import gu from "./gu.json";

export const CONTENT_LOCALES: Record<string, Record<string, string>> = {
  mr: mr as Record<string, string>,
  te: te as Record<string, string>,
  gu: gu as Record<string, string>,
};

/** Language codes that have a content overlay. Hindi and English are the baseline. */
export const CONTENT_LANGS: string[] = ["en", "hi", ...Object.keys(CONTENT_LOCALES)];

interface Localised {
  [key: string]: unknown;
}

function translate(code: string, path: string, en: string): string {
  const map = CONTENT_LOCALES[code];
  return map[path] ?? map[en] ?? en;
}

/**
 * Walk a content tree and add every overlay language as a key on each
 * `{ en, hi }` value (string or array shaped). `path` is only used for the
 * per-path override lookup.
 */
export function localize<T>(value: T, root = ""): T {
  if (Array.isArray(value)) {
    return value.map((v, i) => localize(v, `${root}[${i}]`)) as unknown as T;
  }
  if (value && typeof value === "object") {
    const src = value as Localised;
    const out: Localised = {};
    for (const [key, v] of Object.entries(src)) {
      out[key] = localize(v, root ? `${root}.${key}` : key);
    }
    const codes = Object.keys(CONTENT_LOCALES);
    if (typeof out.en === "string" && typeof out.hi === "string") {
      for (const code of codes) {
        if (out[code] === undefined) out[code] = translate(code, root, out.en);
      }
    } else if (Array.isArray(out.en) && Array.isArray(out.hi)) {
      for (const code of codes) {
        if (out[code] === undefined) {
          out[code] = (out.en as string[]).map((s, i) => translate(code, `${root}.en[${i}]`, s));
        }
      }
    }
    return out as T;
  }
  return value;
}
