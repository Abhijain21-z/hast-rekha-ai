import { SITE_URL } from "@/lib/site";
import type { Bi } from "@/lib/i18n";
import type { PalmPage } from "@/content/palm/types";

/**
 * Structured data for a palm-guide page: breadcrumbs, the FAQ block, and an
 * Article for the pillar/guide/comparison pages. Rendered on the server so the
 * markup is in the first HTML response.
 */
export default function PalmJsonLd({
  page,
  lang,
  updated,
  relatedTitle,
}: {
  page: PalmPage;
  lang: "hi" | "en";
  /** ISO date the guides were last reviewed. */
  updated: string;
  /** Human label of the pillar page, used in the breadcrumb trail. */
  relatedTitle: Bi;
}) {
  const url = `${SITE_URL}/${page.slug}`;
  const showArticle = page.kind !== "line";

  const graph: Record<string, unknown>[] = [
    {
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement:
        page.kind === "pillar"
          ? [
              { "@type": "ListItem", position: 1, name: "Hast Rekha AI", item: SITE_URL },
              { "@type": "ListItem", position: 2, name: page.crumb[lang], item: url },
            ]
          : [
              { "@type": "ListItem", position: 1, name: "Hast Rekha AI", item: SITE_URL },
              { "@type": "ListItem", position: 2, name: relatedTitle[lang], item: `${SITE_URL}/hast-rekha-palmistry` },
              { "@type": "ListItem", position: 3, name: page.crumb[lang], item: url },
            ],
    },
    {
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: page.faqs.map((f) => ({
        "@type": "Question",
        name: f.q[lang],
        acceptedAnswer: { "@type": "Answer", text: f.a[lang] },
      })),
    },
  ];

  if (showArticle) {
    graph.push({
      "@type": "Article",
      "@id": `${url}#article`,
      headline: page.h1[lang],
      description: page.description[lang],
      inLanguage: lang === "hi" ? "hi-IN" : "en-IN",
      mainEntityOfPage: url,
      datePublished: updated,
      dateModified: updated,
      author: { "@type": "Organization", name: "Hast Rekha AI", url: SITE_URL },
      publisher: { "@type": "Organization", name: "Hast Rekha AI", url: SITE_URL },
      about: { "@type": "Thing", name: page.focus[lang] },
    });
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }) }}
    />
  );
}
