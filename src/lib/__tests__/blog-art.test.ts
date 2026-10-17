import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { BLOG_ART } from "@/lib/blog-art";
import { blogDeepLinks } from "@/lib/blog-links";
import { BLOGS, blogImage, blogInlineImage, CAT_META, type Blog } from "@/lib/blogs";

/**
 * Guardrails for the per-blog artwork and the internal promotion links.
 *
 * Every published blog must ship a title-matched hero and an in-article
 * illustration, both real SVG files on disk, and every deep link rendered in
 * the article must point at a route folder that actually exists — so a new
 * blog (or a renamed slug) can never publish a broken image or a dead link.
 */

const PUBLIC_DIR = join(process.cwd(), "public");
const SITE_DIR = join(process.cwd(), "src", "app", "(site)");

describe("blog artwork", () => {
  it("has a hero and an inline illustration for every published blog", () => {
    for (const blog of BLOGS) {
      const art = BLOG_ART[blog.slug];
      expect(art, `${blog.slug} is missing from the art map`).toBeTruthy();
      expect(blogImage(blog)).toBe(`/images/blog/${blog.slug}.svg`);
      expect(blogInlineImage(blog)).toBe(`/images/blog/${blog.slug}-inline.svg`);
    }
  });

  it("keeps the art map free of orphan slugs", () => {
    const slugs = new Set(BLOGS.map((b) => b.slug));
    for (const key of Object.keys(BLOG_ART)) {
      expect(slugs.has(key), `${key} has art but is not a published blog`).toBe(true);
    }
  });

  it("ships real SVG files with a matching viewBox and no scripts", () => {
    for (const blog of BLOGS) {
      for (const rel of [blogImage(blog), blogInlineImage(blog)]) {
        const file = join(PUBLIC_DIR, rel.replace(/^\//, ""));
        expect(existsSync(file), `${rel} does not exist`).toBe(true);
        const svg = readFileSync(file, "utf8");
        expect(svg.startsWith("<svg"), `${rel} is not an SVG`).toBe(true);
        expect(svg).toContain("viewBox=");
        expect(svg).not.toContain("<script");
      }
    }
  });

  it("falls back to the category illustration when a blog has no art yet", () => {
    const fresh = { slug: "not-published-yet", cat: "graha" } as Blog;
    expect(blogImage(fresh)).toBe(CAT_META.graha.image);
    expect(blogInlineImage(fresh)).toBe(CAT_META.graha.image);
  });
});

describe("blog promotion links", () => {
  it("resolves at least one internal link for every blog", () => {
    for (const blog of BLOGS) {
      const links = blogDeepLinks(blog);
      expect(links.length, `${blog.slug} has no deep links`).toBeGreaterThan(0);
      const hrefs = links.map((l) => l.href);
      expect(new Set(hrefs).size).toBe(hrefs.length);
    }
  });

  it("only links to routes that exist on disk", () => {
    for (const blog of BLOGS) {
      for (const link of blogDeepLinks(blog)) {
        expect(link.href.startsWith("/")).toBe(true);
        const page = join(SITE_DIR, link.href.replace(/^\//, ""), "page.tsx");
        expect(existsSync(page), `${blog.slug} links to missing route ${link.href}`).toBe(true);
      }
    }
  });

  it("sends every palm blog to the pillar or a line guide", () => {
    for (const blog of BLOGS.filter((b) => b.cat === "palm")) {
      const hrefs = blogDeepLinks(blog).map((l) => l.href);
      expect(hrefs.some((h) => h.startsWith("/hast-rekha") || h.endsWith("-line"))).toBe(true);
    }
  });
});
