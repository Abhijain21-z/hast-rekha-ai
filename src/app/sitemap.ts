import type { MetadataRoute } from "next";
import { BLOGS } from "@/lib/blogs";
import { PALM_PAGES, PALM_UPDATED } from "@/content/palm";
import { BOOK_PROMO } from "@/lib/flags";
import { SITE_URL } from "@/lib/site";

const BASE = SITE_URL;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPages = [
    "", "/rashi", "/reading", "/pricing", "/blog", "/reviews", ...(BOOK_PROMO ? ["/upay"] : []), "/about", "/contact", "/privacy-policy", "/terms", "/disclaimer", "/login", "/register",
  ].map((p) => ({
    url: `${BASE}${p}`,
    lastModified: now,
    changeFrequency: (p === "" || p === "/blog" ? "daily" : "weekly") as MetadataRoute.Sitemap[number]["changeFrequency"],
    priority: p === "" ? 1 : p === "/reading" || p === "/blog" ? 0.9 : 0.7,
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
  return [...staticPages, ...palmPages, ...blogPages];
}
