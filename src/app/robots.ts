import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://hastrekhaai.online";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/dashboard", "/api/", "/login", "/register"] },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
