import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { RASHIS } from "@/lib/content";
import { RASHI_GUIDES } from "@/content/rashi-guides";

/**
 * Guardrails for the 12 evergreen /rashi/[sign] pages. A missing guide would
 * render a 404, and a duplicate intro would make the set look templated, so
 * both are checked before the pages can ship.
 */
describe("per-rashi guides", () => {
  it("covers every rashi exactly once", () => {
    expect(RASHI_GUIDES).toHaveLength(12);
    expect(RASHI_GUIDES.map((g) => g.key).sort()).toEqual(RASHIS.map((r) => r.key).sort());
    expect(new Set(RASHI_GUIDES.map((g) => g.key)).size).toBe(12);
  });

  it("has a substantive, unique intro and shadow for every sign", () => {
    const seen = new Set<string>();
    for (const guide of RASHI_GUIDES) {
      for (const lang of ["hi", "en"] as const) {
        const words = guide.intro[lang].trim().split(/\s+/).filter(Boolean);
        expect(words.length, `${guide.key} ${lang} intro`).toBeGreaterThanOrEqual(60);
        expect(guide.shadow[lang].trim().length, `${guide.key} ${lang} shadow`).toBeGreaterThan(20);
      }
      expect(seen.has(guide.intro.hi), `${guide.key} intro is duplicated`).toBe(false);
      seen.add(guide.intro.hi);
    }
  });

  it("ships the dynamic route and its schema component", () => {
    const root = process.cwd();
    expect(existsSync(join(root, "src", "app", "(site)", "rashi", "[sign]", "page.tsx"))).toBe(true);
    expect(existsSync(join(root, "src", "components", "rashi", "RashiGuideJsonLd.tsx"))).toBe(true);
  });
});
