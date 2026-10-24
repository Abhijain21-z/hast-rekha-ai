import { DIWALI_2026, DIWALI_FAQS } from "@/content/diwali";
import { SITE_URL } from "@/lib/site";

/**
 * Article + FAQ + breadcrumb schema for the Diwali 2026 hub. Kept as a server
 * component so the JSON-LD is part of the first HTML response.
 */
export default function DiwaliJsonLd() {
  const url = `${SITE_URL}/diwali-2026`;

  const graph = [
    {
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Hast Rekha AI", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Diwali 2026 Rashifal", item: url },
      ],
    },
    {
      "@type": "Article",
      "@id": `${url}#article`,
      headline: "Diwali 2026 Rashifal — 8 November, 12 Rashiyon Ka Fal",
      description:
        "Diwali 2026 date, Lakshmi Puja muhurat, 12 rashiyon ka Diwali rashifal, hath ki rekha se dhan aur career ke sanket, aur traditional upay.",
      inLanguage: "hi-IN",
      mainEntityOfPage: url,
      datePublished: DIWALI_2026.updatedISO,
      dateModified: DIWALI_2026.updatedISO,
      author: { "@type": "Organization", name: "Hast Rekha AI", url: SITE_URL },
      publisher: { "@type": "Organization", name: "Hast Rekha AI", url: SITE_URL },
      about: {
        "@type": "Event",
        name: "Diwali 2026",
        startDate: DIWALI_2026.dateISO,
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        location: { "@type": "Country", name: "India" },
      },
    },
    {
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: DIWALI_FAQS.map((f) => ({
        "@type": "Question",
        name: f.q.hi,
        acceptedAnswer: { "@type": "Answer", text: f.a.hi },
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
