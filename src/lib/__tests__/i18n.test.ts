import { describe, it, expect } from "vitest";
import { dictionaries, pick, byLang, type Bi } from "@/lib/i18n";
import { LANGS, OVERRIDES, deepMerge } from "@/lib/lang-overrides";
import { CONTENT_LANGS, CONTENT_LOCALES, localize } from "@/content/locales";

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

  it("keeps Hindi and English out of beta and every overlay language registered", () => {
    for (const meta of LANGS) {
      if (meta.code === "hi" || meta.code === "en") {
        expect(Boolean(meta.beta), `"${meta.code}" must not be beta`).toBe(false);
      }
    }
    for (const code of Object.keys(CONTENT_LOCALES)) {
      expect(LANGS.some((l) => l.code === code), `overlay "${code}" is not a registered language`).toBe(true);
    }
  });

  it("falls back to English when a language has no content key", () => {
    const bilingual: Bi = { en: "Wealth", hi: "धन" };
    expect(pick("mr", bilingual)).toBe("Wealth");
    expect(pick("hi", bilingual)).toBe("धन");

    const extended: Bi = { en: "Wealth", hi: "धन", mr: "संपत्ती" };
    expect(pick("mr", extended)).toBe("संपत्ती");
  });

  it("indexes by language with a fallback instead of returning undefined", () => {
    expect(byLang<string>({ en: "Hand", hi: "हाथ" }, "mr")).toBe("Hand");
    expect(byLang<string>({ en: "Hand", hi: "हाथ", mr: "हात" }, "mr")).toBe("हात");
    expect(byLang<string[]>({ en: ["a"], hi: ["क"] }, "te")).toEqual(["a"]);
    expect(byLang<string>(null, "en")).toBeUndefined();
  });

  it("localizes content into every overlay language with an English fallback", () => {
    const source = {
      name: { en: "Ashwini", hi: "अश्विनी" },
      traits: { en: ["Hand", "Untranslated"], hi: ["हाथ", "अनूदित"] },
    };
    const out = localize(source, "demo") as typeof source & { name: Record<string, string>; traits: Record<string, string[]> };
    expect(out.name.mr).toBe("अश्विनी");
    expect(out.traits.mr[0]).toBe("हात");
    // Unknown English strings keep the source text — never undefined.
    expect(out.traits.mr[1]).toBe("Untranslated");
    expect(CONTENT_LANGS).toContain("mr");
  });
});
