import type { Bi } from "@/lib/i18n";
import type { PalmLineKey, PalmPage } from "./types";
import { PILLAR } from "./pillar";
import { LINE_PAGES } from "./lines";
import { EXTRA_LINE_PAGES } from "./lines-extra";
import { MORE_LINE_PAGES } from "./lines-more";
import { GUIDE_PAGES } from "./guides";
import { GUIDE_EXTRA_PAGES } from "./guides-extra";

export type { PalmPage, PalmFaq, PalmSection, PalmKind, PalmLineKey } from "./types";

/**
 * Content hub for the SEO guide pages.
 *
 * One module owns the registry so the dynamic route, the sitemap, the footer
 * and the internal-link blocks all read from the same list — a new page can
 * never go live on one surface and be missing on another.
 */

/** The full publishing plan (slugs), used by the SEO test to validate links. */
export const PALM_PLANNED_SLUGS = [
  "hast-rekha-palmistry",
  "life-line",
  "heart-line",
  "fate-line",
  "career-line",
  "money-line",
  "marriage-line",
  "sun-line",
  "health-line",
  "children-line",
  "which-hand-to-read",
  "palm-signs",
  "learn-palmistry",
  "books",
  "palmistry-vs-astrology",
  "best-palmistry-india",
];

/** Pages that exist today, in the order they appear in listings. */
export const PALM_PAGES: PalmPage[] = [
  PILLAR,
  ...LINE_PAGES,
  ...EXTRA_LINE_PAGES,
  ...MORE_LINE_PAGES,
  ...GUIDE_PAGES,
  ...GUIDE_EXTRA_PAGES,
];

/** ISO date the guides were last reviewed — shown to readers and in schema. */
export const PALM_UPDATED = "2026-10-17";

/** Human-readable version of {@link PALM_UPDATED}. */
export const PALM_UPDATED_LABEL = "17 Oct 2026";

const BY_SLUG = new Map(PALM_PAGES.map((p) => [p.slug, p]));

export function palmPageBySlug(slug: string): PalmPage | undefined {
  return BY_SLUG.get(slug);
}

/** A resolved internal link: slug plus the label to render as the anchor. */
export interface PalmLink {
  slug: string;
  label: Bi;
}

/**
 * Resolve slugs to links, skipping anything not published yet, so a guide can
 * mention a future page without ever shipping a dead link.
 */
export function palmLinks(slugs: string[]): PalmLink[] {
  return slugs.flatMap((slug) => {
    const page = BY_SLUG.get(slug);
    return page ? [{ slug, label: page.crumb }] : [];
  });
}

/** The pillar link — always the first internal link on a guide page. */
export const PILLAR_LINK: PalmLink | undefined = palmLinks(["hast-rekha-palmistry"])[0];

/** Line guides in classical order, used by the "all lines" diagram legend. */
const LINE_ORDER: PalmLineKey[] = ["life", "head", "heart", "fate", "sun", "money", "marriage", "health", "children"];

export const LINE_GUIDE_LINKS: PalmLink[] = LINE_ORDER.flatMap((key) => {
  const line = PALM_PAGES.find((p) => p.diagram?.line === key && p.kind === "line");
  return line ? [{ slug: line.slug, label: line.crumb }] : [];
});
