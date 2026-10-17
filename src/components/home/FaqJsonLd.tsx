import { FAQS } from "@/content/faq";

/**
 * FAQPage structured data built from the same list the home page renders, so
 * search engines always see the questions with their answers.
 */
export default function FaqJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q.hi,
      acceptedAnswer: { "@type": "Answer", text: f.a.hi },
    })),
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
