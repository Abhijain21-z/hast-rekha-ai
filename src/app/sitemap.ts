import type { MetadataRoute } from "next";
import { BLOGS } from "@/lib/blogs";
import { PALM_PAGES, PALM_UPDATED } from "@/content/palm";
import { RASHIS } from "@/lib/content";
import { BOOK_PROMO } from "@/lib/flags";
import { SITE_URL } from "@/lib/site";

const BASE = SITE_URL;
const STATIC_UPDATED = new Date("2026-10-24T00:00:00+05:30");

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  // /login and /register are deliberately noindex, so they must not be in the
  // sitemap (Google reports indexable/noindex conflicts as crawl noise).
  const staticPages = [
    "", "/rashifal", "/chat", "/rashi", "/reading", "/pricing", "/diwali-2026", "/blog", "/reviews", ...(BOOK_PROMO ? ["/upay"] : []), "/about", "/contact", "/privacy-policy", "/terms", "/refund-policy", "/disclaimer",
  ].map((p) => ({
    url: `${BASE}${p}`,
    lastModified: p === "" || p === "/blog" || p === "/rashifal" || p === "/diwali-2026" ? now : STATIC_UPDATED,
    changeFrequency: (p === "" || p === "/blog" || p === "/rashifal" || p === "/diwali-2026" ? "daily" : "weekly") as MetadataRoute.Sitemap[number]["changeFrequency"],
    priority: p === "" ? 1 : p === "/diwali-2026" ? 0.95 : p === "/reading" || p === "/blog" || p === "/rashifal" ? 0.9 : 0.7,
  }));
  const blogPages = BLOGS.map((b) => ({
    url: `${BASE}/blog/${b.slug}`,
    lastModified: new Date(b.date),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));
  // Palmistry guides: hreflang points at the same URL plus its ?lang=en twin.
  const palmPages = PALM_PAGES.map((p) => ({
    url: `${BASE}/${p.slug}`,
    lastModified: new Date(PALM_UPDATED),
    changeFrequency: "monthly" as const,
    priority: p.kind === "pillar" ? 0.9 : 0.8,
    alternates: {
      languages: {
        hi: `${BASE}/${p.slug}`,
        en: `${BASE}/${p.slug}?lang=en`,
      },
    },
  }));
  // Evergreen per-sign guides. These target "mesh rashi", "aries rashi" and
  // "[sign] swabhav" queries that the single /rashi hub cannot rank for.
  const rashiPages = RASHIS.map((r) => ({
    url: `${BASE}/rashi/${r.key}`,
    lastModified: STATIC_UPDATED,
    changeFrequency: "monthly" as const,
    priority: 0.82,
  }));
  return [...staticPages, ...rashiPages, ...palmPages, ...blogPages];
}
