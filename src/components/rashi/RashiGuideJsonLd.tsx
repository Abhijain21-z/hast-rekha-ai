import { RASHI_GUIDE_UPDATED } from "@/content/rashi-guides";
import type { Rashi } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

export interface RashiFaqItem {
  q: string;
  a: string;
}

/**
 * Article + FAQ + breadcrumb schema for an evergreen /rashi/[sign] page.
 * The FAQ answers are the same strings rendered visibly below the page body.
 */
export default function RashiGuideJsonLd({ rashi, faqs }: { rashi: Rashi; faqs: RashiFaqItem[] }) {
  const url = `${SITE_URL}/rashi/${rashi.key}`;

  const graph = [
    {
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Hast Rekha AI", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "12 Rashiyan", item: `${SITE_URL}/rashi` },
        { "@type": "ListItem", position: 3, name: `${rashi.short.hi} Rashi`, item: url },
      ],
    },
    {
      "@type": "Article",
      "@id": `${url}#article`,
      headline: `${rashi.short.hi} राशि (${rashi.short.en}) — स्वभाव, प्रेम, करियर और भाग्य`,
      description: `${rashi.short.hi} rashi ka swabhav, love, career, health, finance, lucky color-number aur rashi milan — Hindi aur English mein.`,
      inLanguage: "hi-IN",
      mainEntityOfPage: url,
      datePublished: RASHI_GUIDE_UPDATED,
      dateModified: RASHI_GUIDE_UPDATED,
      author: { "@type": "Organization", name: "Hast Rekha AI", url: SITE_URL },
      publisher: { "@type": "Organization", name: "Hast Rekha AI", url: SITE_URL },
      about: {
        "@type": "Thing",
        name: `${rashi.short.hi} Rashi (${rashi.short.en})`,
        description: `${rashi.dates} • ${rashi.element.hi} • ${rashi.lord.hi}`,
      },
    },
    {
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }) }}
    />
  );
}
