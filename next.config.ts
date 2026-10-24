import type { NextConfig } from "next";

/**
 * Legacy URLs Google still has from earlier crawls (Search Console reports them
 * as "Duplicate without user-selected canonical", "Not found (404)" or
 * "Excluded by 'noindex'"). Each one 308-redirects to the closest live page, so
 * the old URL never dead-ends and the next crawl consolidates it.
 *
 * - The "how it works" section lives on the home page (`#how-it-works`).
 * - `/rashi/<sign>` is now a real 12-page landing set, so the old redirects for
 *   those exact sign keys were removed. Colloquial aliases (`/rashi/mesh`,
 *   `/rashi/singh`, ...) still redirect to the canonical sign page.
 * - `/rashi/desh-shani` (removed Shani-transit page) points at the sade-sati
 *   article.
 * - `/blog/life-line-meaning-palmistry` is an old English slug of the life-line
 *   post; it lives on as /blog/jeevan-rekha-ke-rahasya.
 *
 * Redirects run before the filesystem in Next.js, so a real route cannot win
 * over a redirect with the same source. That is why the 12 exact-sign entries
 * are intentionally absent here.
 */
const RASHI_ALIASES: Record<string, string> = {
  mesh: "mesha",
  vrish: "vrishabha",
  mithun: "mithuna",
  kark: "karka",
  singh: "simha",
  makar: "makara",
  meen: "meena",
};

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/how-it-works", destination: "/#how-it-works", permanent: true },
      ...Object.entries(RASHI_ALIASES).map(([alias, sign]) => ({
        source: `/rashi/${alias}`,
        destination: `/rashi/${sign}`,
        permanent: true,
      })),
      { source: "/rashi/desh-shani", destination: "/blog/sade-sati-upay", permanent: true },
      { source: "/blog/life-line-meaning-palmistry", destination: "/blog/jeevan-rekha-ke-rahasya", permanent: true },
    ];
  },
};

export default nextConfig;
