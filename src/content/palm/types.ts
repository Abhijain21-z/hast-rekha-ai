import type { Bi } from "@/lib/i18n";

/** Which palm line a diagram should highlight. */
export type PalmLineKey =
  | "life"
  | "heart"
  | "head"
  | "fate"
  | "sun"
  | "money"
  | "marriage"
  | "health"
  | "children";

/** Page families — used for schema type and internal linking weight. */
export type PalmKind = "pillar" | "line" | "guide" | "compare";

export interface PalmSection {
  /** H2 — carries the secondary keyword or a Hindi question. */
  h: Bi;
  /** Body paragraphs, written for a beginner reader. */
  p: Bi[];
  /** Optional sub-points rendered as a small list under the paragraphs. */
  list?: { title: Bi; text: Bi }[];
}

export interface PalmFaq {
  q: Bi;
  /** 40-60 words, answer first, no guarantees. */
  a: Bi;
}

export interface PalmPage {
  /** Clean, lowercase, hyphenated URL slug. */
  slug: string;
  kind: PalmKind;
  /** The keyword this page targets (kept in one place for audits). */
  focus: Bi;
  /** <title>, focus keyword first, brand last, max 60 chars. */
  title: Bi;
  /** Meta description, max 155 chars. */
  description: Bi;
  /** The single H1. */
  h1: Bi;
  /** Short label used in breadcrumbs and link lists. */
  crumb: Bi;
  /** Opening paragraphs — the focus keyword appears inside the first 100 words. */
  intro: Bi[];
  /** Optional schematic hand diagram with the line highlighted. */
  diagram?: {
    line: PalmLineKey | "all";
    /** Single romanised alt text — image search reads it in both languages. */
    alt: string;
    caption: Bi;
  };
  sections: PalmSection[];
  faqs: PalmFaq[];
  /** Slugs of pillar + related pages, linked with descriptive anchors. */
  related: string[];
  /** Light, honest keyword list for the meta keywords tag. */
  keywords: string[];
}
