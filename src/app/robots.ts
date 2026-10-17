import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // /login and /register are intentionally NOT disallowed: they are linked in
      // the navbar, so a robots.txt block just makes Search Console report
      // "Blocked by robots.txt". They carry `robots: noindex` instead.
      { userAgent: "*", allow: "/", disallow: ["/dashboard", "/api/"] },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
