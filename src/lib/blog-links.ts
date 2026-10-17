import { palmLinks } from "@/content/palm";
import type { Bi } from "@/lib/i18n";
import type { Blog, BlogCat } from "./blogs";

/**
 * Internal promotion links for a blog article.
 *
 * Palm blogs resolve to the palmistry guide pages (pillar + the two most
 * relevant line guides), everything else points at the category hubs. Guide
 * slugs are resolved through `palmLinks`, which drops pages that are not
 * published yet — a blog can never ship a dead link.
 */

const PALM_GUIDES: Record<string, string[]> = {
  "hast-rekha-shastra-kya-hai": ["hast-rekha-palmistry", "which-hand-to-read", "learn-palmistry"],
  "jeevan-rekha-ke-rahasya": ["life-line", "health-line", "hast-rekha-palmistry"],
  "hridaya-rekha-prem-vivah": ["heart-line", "marriage-line", "hast-rekha-palmistry"],
  "mastishk-rekha-se-career": ["career-line", "fate-line", "hast-rekha-palmistry"],
  "bhagya-rekha-dhan-lakshmi": ["fate-line", "money-line", "hast-rekha-palmistry"],
  "hatheli-ke-shubh-chinh": ["palm-signs", "hast-rekha-palmistry", "money-line"],
  "ai-palmistry-future": ["hast-rekha-palmistry", "best-palmistry-india", "palmistry-vs-astrology"],
  "numerology-palm-combo": ["palmistry-vs-astrology", "hast-rekha-palmistry", "fate-line"],
  "left-hand-right-hand": ["which-hand-to-read", "hast-rekha-palmistry", "learn-palmistry"],
  "marriage-line-timing": ["marriage-line", "heart-line", "hast-rekha-palmistry"],
  "money-lines-palm": ["money-line", "fate-line", "hast-rekha-palmistry"],
  "life-line-longevity-myth": ["life-line", "health-line", "hast-rekha-palmistry"],
  "mercury-line-career": ["career-line", "money-line", "hast-rekha-palmistry"],
  "palm-reading-guide-beginners": ["learn-palmistry", "which-hand-to-read", "hast-rekha-palmistry"],
  "simian-line-rare-mark": ["palm-signs", "learn-palmistry", "hast-rekha-palmistry"],
  "heart-line-relationship-style": ["heart-line", "marriage-line", "hast-rekha-palmistry"],
};

/** Category hubs used when a blog has no matching palmistry guide yet. */
const CAT_HUBS: Record<BlogCat, { href: string; label: Bi }[]> = {
  palm: [],
  graha: [
    { href: "/rashi", label: { en: "Explore the 12 Rashis", hi: "12 राशियाँ देखें" } },
    { href: "/upay", label: { en: "Tantra Upay guide", hi: "तंत्र उपाय गाइड" } },
  ],
  ratna: [
    { href: "/upay", label: { en: "Tantra Upay guide", hi: "तंत्र उपाय गाइड" } },
    { href: "/rashi", label: { en: "Explore the 12 Rashis", hi: "12 राशियाँ देखें" } },
  ],
  upay: [
    { href: "/upay", label: { en: "Tantra Upay guide", hi: "तंत्र उपाय गाइड" } },
    { href: "/rashi", label: { en: "Explore the 12 Rashis", hi: "12 राशियाँ देखें" } },
  ],
  rashi: [
    { href: "/rashi", label: { en: "Explore the 12 Rashis", hi: "12 राशियाँ देखें" } },
    { href: "/upay", label: { en: "Tantra Upay guide", hi: "तंत्र उपाय गाइड" } },
  ],
};

/** Resolve the in-article promotion links for one blog. */
export function blogDeepLinks(blog: Blog): { href: string; label: Bi }[] {
  if (blog.cat !== "palm") return CAT_HUBS[blog.cat];
  return palmLinks(PALM_GUIDES[blog.slug] ?? ["hast-rekha-palmistry"]).map((l) => ({
    href: `/${l.slug}`,
    label: l.label,
  }));
}
