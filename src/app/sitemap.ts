import type { MetadataRoute } from "next";
import { BLOGS } from "@/lib/blogs";
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
  return [...staticPages, ...blogPages];
}
