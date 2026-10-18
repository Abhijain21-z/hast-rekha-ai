import type { NextConfig } from "next";

/**
 * Legacy URLs Google still has from earlier crawls (Search Console reports them
 * as "Duplicate without user-selected canonical", "Not found (404)" or
 * "Excluded by 'noindex'"). Each one 308-redirects to the closest live page, so
 * the old URL never dead-ends and the next crawl consolidates it.
 *
 * - The "how it works" section lives on the home page (`#how-it-works`).
 * - `/rashi/<sign>` was a per-sign URL before the hub moved to `?sign=`;
 *   `RASHI_SIGNS` mirrors the keys in src/content/rashis.json, `RASHI_ALIASES`
 *   covers the colloquial spellings, and `desh-shani` (removed Shani-transit
 *   page) points at the sade-sati article.
 * - `/blog/life-line-meaning-palmistry` is an old English slug of the life-line
 *   post; it lives on as /blog/jeevan-rekha-ke-rahasya.
 *
 * Redirects run after the filesystem, so a real route added later (e.g. real
 * /rashi/<sign> landing pages) always wins over these entries.
 */
const RASHI_SIGNS = [
  "mesha",
  "vrishabha",
  "mithuna",
  "karka",
  "simha",
  "kanya",
  "tula",
  "vrishchika",
  "dhanu",
  "makara",
  "kumbha",
  "meena",
];

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
      ...RASHI_SIGNS.map((sign) => ({
        source: `/rashi/${sign}`,
        destination: `/rashi?sign=${sign}`,
        permanent: true,
      })),
      ...Object.entries(RASHI_ALIASES).map(([alias, sign]) => ({
        source: `/rashi/${alias}`,
        destination: `/rashi?sign=${sign}`,
        permanent: true,
      })),
      { source: "/rashi/desh-shani", destination: "/blog/sade-sati-upay", permanent: true },
      { source: "/blog/life-line-meaning-palmistry", destination: "/blog/jeevan-rekha-ke-rahasya", permanent: true },
    ];
  },
};

export default nextConfig;
