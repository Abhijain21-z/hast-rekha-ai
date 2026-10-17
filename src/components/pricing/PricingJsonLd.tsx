import { PRICING_FAQS } from "@/content/pricing-faq";
import { SITE_URL } from "@/lib/site";

/**
 * Structured data for /pricing: the breadcrumb trail and the FAQPage that the
 * visible PricingFaq block mirrors. Rendered on the server so the markup is in
 * the first HTML response.
 */
export default function PricingJsonLd({ lang }: { lang: "hi" | "en" }) {
  const url = `${SITE_URL}/pricing`;

  const graph: Record<string, unknown>[] = [
    {
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Hast Rekha AI", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: lang === "hi" ? "मूल्य" : "Pricing", item: url },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      inLanguage: lang === "hi" ? "hi-IN" : "en-IN",
      mainEntity: PRICING_FAQS.map((f) => ({
        "@type": "Question",
        name: f.q[lang],
        acceptedAnswer: { "@type": "Answer", text: f.a[lang] },
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
