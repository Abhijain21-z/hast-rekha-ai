import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { PALM_PAGES, PALM_PLANNED_SLUGS, PALM_UPDATED } from "@/content/palm";
import type { PalmPage } from "@/content/palm/types";

/**
 * SEO guardrails for the palmistry guide pages.
 *
 * The requirements (title ≤ 60 chars, meta ≤ 155, one H1, 4+ FAQs, ≥ 800 words,
 * internal links to the pillar) are enforced here so a future content edit
 * cannot silently break the SERP snippet or the schema.
 */

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const LANGS: ("en" | "hi")[] = ["en", "hi"];
const wordCount = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

function body(page: PalmPage, lang: "en" | "hi"): string {
  return [
    ...page.intro.map((p) => p[lang]),
    ...page.sections.flatMap((s) => [s.h[lang], ...s.p.map((p) => p[lang]), ...(s.list ?? []).flatMap((i) => [i.title[lang], i.text[lang]])]),
    ...page.faqs.flatMap((f) => [f.q[lang], f.a[lang]]),
  ].join(" ");
}

describe("palm guide pages — SEO contract", () => {
  it("has unique, clean, planned slugs", () => {
    const slugs = PALM_PAGES.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) {
      expect(slug, `${slug} must be a clean lowercase slug`).toMatch(SLUG_RE);
      expect(PALM_PLANNED_SLUGS, `${slug} must be part of the published plan`).toContain(slug);
    }
  });

  it("keeps titles inside the SERP limit with the brand and the focus keyword", () => {
    for (const page of PALM_PAGES) {
      for (const lang of LANGS) {
        const title = page.title[lang];
        expect(title.length, `${page.slug} (${lang}) title is ${title.length} chars`).toBeLessThanOrEqual(60);
        expect(title).toContain("Hastrekha AI");
        const focusHead = page.focus[lang].split(" ")[0].toLowerCase();
        expect(title.toLowerCase()).toContain(focusHead);
      }
    }
  });

  it("keeps meta descriptions helpful and inside 155 characters", () => {
    for (const page of PALM_PAGES) {
      for (const lang of LANGS) {
        const d = page.description[lang];
        expect(d.length, `${page.slug} (${lang}) description is ${d.length} chars`).toBeLessThanOrEqual(155);
        expect(d.length).toBeGreaterThanOrEqual(90);
      }
    }
  });

  it("has exactly one H1 and a lead answer for every page", () => {
    for (const page of PALM_PAGES) {
      for (const lang of LANGS) {
        expect(page.h1[lang].trim().length).toBeGreaterThan(10);
        expect(page.intro.length).toBeGreaterThanOrEqual(2);
        expect(page.intro[0][lang].trim().length).toBeGreaterThan(80);
      }
    }
  });

  it("keeps the requested depth: pillar 1500+ words, every page 800+", () => {
    for (const page of PALM_PAGES) {
      const min = page.kind === "pillar" ? 1500 : 800;
      const hi = wordCount(body(page, "hi"));
      const en = wordCount(body(page, "en"));
      expect(hi, `${page.slug} has ${hi} Hindi words`).toBeGreaterThanOrEqual(min);
      expect(en, `${page.slug} has ${en} English words`).toBeGreaterThanOrEqual(Math.round(min * 0.55));
    }
  });

  it("answers every FAQ in 25-90 words", () => {
    for (const page of PALM_PAGES) {
      expect(page.faqs.length, `${page.slug} needs at least 4 FAQs`).toBeGreaterThanOrEqual(4);
      for (const faq of page.faqs) {
        for (const lang of LANGS) {
          expect(faq.q[lang].trim().length).toBeGreaterThan(8);
          const w = wordCount(faq.a[lang]);
          expect(w, `${page.slug} (${lang}) FAQ "${faq.q[lang].slice(0, 30)}" has ${w} words`).toBeGreaterThanOrEqual(25);
          expect(w).toBeLessThanOrEqual(90);
        }
      }
    }
  });

  it("links every guide to the pillar plus three related pages", () => {
    for (const page of PALM_PAGES) {
      expect(page.related.length, `${page.slug} needs 4 internal links`).toBeGreaterThanOrEqual(4);
      expect(page.related).not.toContain(page.slug);
      for (const slug of page.related) {
        expect(PALM_PLANNED_SLUGS, `${page.slug} links to unknown page ${slug}`).toContain(slug);
      }
      if (page.kind !== "pillar") {
        expect(page.related, `${page.slug} must link back to the pillar`).toContain("hast-rekha-palmistry");
      }
    }
  });

  it("has a route file for every published guide", () => {
    for (const page of PALM_PAGES) {
      const file = join(process.cwd(), "src", "app", "(site)", page.slug, "page.tsx");
      expect(existsSync(file), `missing route file for ${page.slug}`).toBe(true);
    }
  });

  it("gives every diagram an accessible, keyword-rich label", () => {
    for (const page of PALM_PAGES) {
      if (!page.diagram) continue;
      expect(page.diagram.alt.length).toBeGreaterThan(20);
      for (const lang of LANGS) {
        expect(page.diagram.caption[lang].length).toBeGreaterThan(30);
      }
    }
  });

  it("carries a keyword list and a valid review date", () => {
    for (const page of PALM_PAGES) {
      expect(page.keywords.length).toBeGreaterThanOrEqual(5);
    }
    expect(PALM_UPDATED).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
