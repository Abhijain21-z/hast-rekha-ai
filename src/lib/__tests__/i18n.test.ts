import { describe, it, expect } from "vitest";
import { dictionaries, pick, type Bi } from "@/lib/i18n";
import { LANGS, OVERRIDES, deepMerge, FULL_CONTENT_LANGS } from "@/lib/lang-overrides";

/** Collect every leaf key path so we can compare dictionary shapes. */
function keyPaths(value: unknown, prefix = ""): string[] {
  if (value === null || typeof value !== "object") return [prefix];
  return Object.entries(value as Record<string, unknown>).flatMap(([k, v]) =>
    keyPaths(v, prefix ? `${prefix}.${k}` : k),
  );
}

describe("i18n", () => {
  it("picks the right language string", () => {
    const v: Bi = { en: "hello", hi: "नमस्ते" };
    expect(pick("en", v)).toBe("hello");
    expect(pick("hi", v)).toBe("नमस्ते");
    expect(pick("en", null)).toBe("");
    expect(pick("en", undefined)).toBe("");
  });

  it("keeps Hindi in sync with the English key set", () => {
    expect(keyPaths(dictionaries.hi).sort()).toEqual(keyPaths(dictionaries.en).sort());
  });

  it("resolves every configured language to a complete dictionary", () => {
    const base = keyPaths(dictionaries.en).sort();
    for (const meta of LANGS) {
      const dict = dictionaries[meta.code];
      expect(dict, `missing dictionary for "${meta.code}"`).toBeTruthy();
      expect(keyPaths(dict).sort(), `incomplete dictionary for "${meta.code}"`).toEqual(base);
    }
  });

  it("merges overrides without dropping base keys", () => {
    const base = keyPaths(dictionaries.en).sort();
    for (const [code, patch] of Object.entries(OVERRIDES)) {
      const merged = deepMerge(dictionaries.en, patch);
      expect(keyPaths(merged).sort(), `override "${code}" broke the shape`).toEqual(base);
    }
  });

  it("marks exactly the non-full languages as beta", () => {
    const full = FULL_CONTENT_LANGS as readonly string[];
    for (const meta of LANGS) {
      expect(Boolean(meta.beta), `beta flag for "${meta.code}"`).toBe(!full.includes(meta.code));
    }
  });

  it("falls back to English when a language has no content key", () => {
    const bilingual: Bi = { en: "Wealth", hi: "धन" };
    expect(pick("mr", bilingual)).toBe("Wealth");
    expect(pick("hi", bilingual)).toBe("धन");

    const extended: Bi = { en: "Wealth", hi: "धन", mr: "संपत्ती" };
    expect(pick("mr", extended)).toBe("संपत्ती");
  });
});
