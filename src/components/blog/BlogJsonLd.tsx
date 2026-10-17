import { blogImage, CAT_META, type Blog } from "@/lib/blogs";
import { SITE_URL } from "@/lib/site";

/**
 * Structured data for one blog article: BlogPosting plus its breadcrumb trail.
 * Rendered on the server so the markup is in the first HTML response.
 */
export default function BlogJsonLd({ blog, lang }: { blog: Blog; lang: "hi" | "en" }) {
  const url = `${SITE_URL}/blog/${blog.slug}`;

  const graph = [
    {
      "@type": "BlogPosting",
      "@id": `${url}#article`,
      headline: blog.title[lang],
      description: blog.excerpt[lang],
      image: `${SITE_URL}${blogImage(blog)}`,
      inLanguage: lang === "hi" ? "hi-IN" : "en-IN",
      articleSection: CAT_META[blog.cat].label[lang],
      keywords: [...blog.tags.hi, ...blog.tags.en].join(", "),
      datePublished: blog.date,
      dateModified: blog.date,
      timeRequired: `PT${blog.mins}M`,
      author: { "@type": "Organization", name: "Hastrekha AI", url: SITE_URL },
      publisher: { "@type": "Organization", name: "Hastrekha AI", url: SITE_URL },
      mainEntityOfPage: url,
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Hastrekha AI", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
        { "@type": "ListItem", position: 3, name: blog.title[lang], item: url },
      ],
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }) }}
    />
  );
}
