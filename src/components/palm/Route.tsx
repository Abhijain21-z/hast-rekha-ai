import type { Metadata } from "next";
import { cookies } from "next/headers";
import PalmArticle from "@/components/palm/PalmArticle";
import PalmJsonLd from "@/components/palm/PalmJsonLd";
import {
  LINE_GUIDE_LINKS,
  PALM_PAGES,
  PALM_UPDATED,
  PALM_UPDATED_LABEL,
  palmLinks,
  palmPageBySlug,
} from "@/content/palm";
import { PALM_UI } from "@/content/palm/ui";
import { SITE_URL } from "@/lib/site";

/**
 * Shared server logic for the palmistry guide routes.
 *
 * Every guide gets its own folder under app/(site) so that a URL which is not
 * published returns Next's real 404 instead of a soft 404 page, while the
 * content, metadata, schema and hreflang stay in one place here.
 */

export type PalmSearchParams = Promise<Record<string, string | string[] | undefined>>;

const OG_IMAGE = "/images/hand.png";

/** Build the `generateMetadata` function for one guide slug. */
export function palmGuideMetadata(slug: string) {
  return async function generateMetadata({ searchParams }: { searchParams: PalmSearchParams }): Promise<Metadata> {
    const page = palmPageBySlug(slug);
    if (!page) return { title: "Page not found | Hastrekha AI" };

    const sp = await searchParams;
    const en = sp.lang === "en";
    const lang: "hi" | "en" = en ? "en" : "hi";
    const url = `${SITE_URL}/${page.slug}`;
    const canonical = en ? `${url}?lang=en` : url;
    const title = page.title[lang];
    const description = page.description[lang];

    return {
      title,
      description,
      keywords: page.keywords,
      alternates: {
        canonical,
        languages: {
          "hi-IN": url,
          "en-IN": `${url}?lang=en`,
          "x-default": url,
        },
      },
      openGraph: {
        type: "article",
        url: canonical,
        siteName: "Hastrekha AI",
        title,
        description,
        locale: lang === "hi" ? "hi_IN" : "en_IN",
        images: [{ url: OG_IMAGE, alt: `${page.focus[lang]} — hatheli ka diagram` }],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [OG_IMAGE],
      },
      robots: { index: true, follow: true },
    };
  };
}

/** The page body for one guide slug. */
export async function PalmGuide({ slug, searchParams }: { slug: string; searchParams: PalmSearchParams }) {
  const page = palmPageBySlug(slug);
  if (!page) return null;

  const sp = await searchParams;
  const pinnedLang: "hi" | "en" | undefined = sp.lang === "en" ? "en" : undefined;

  // Match the structured data to the language this response is served in.
  const cookieLang = (await cookies()).get("hr_lang")?.value;
  const jsonLang: "hi" | "en" = pinnedLang ?? (cookieLang === "en" ? "en" : "hi");

  const related = palmLinks(page.related);
  const legend = page.kind === "pillar" ? LINE_GUIDE_LINKS : undefined;

  return (
    <>
      <PalmJsonLd page={page} lang={jsonLang} updated={PALM_UPDATED} relatedTitle={PALM_UI.breadcrumbGuides} />
      <PalmArticle
        page={page}
        related={related}
        legend={legend}
        updated={PALM_UPDATED_LABEL}
        pinnedLang={pinnedLang}
      />
    </>
  );
}

/** Slugs that currently have a route on disk — used by the SEO test. */
export const PUBLISHED_PALM_SLUGS = PALM_PAGES.map((p) => p.slug);
