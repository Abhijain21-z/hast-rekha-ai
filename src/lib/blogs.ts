import blogsJson from "@/content/blogs.json";
import extraJson from "@/content/blogs-extra.json";
import type { Bi } from "./i18n";

export type BlogCat = "palm" | "graha" | "ratna" | "upay" | "rashi";

export interface Blog {
  slug: string;
  cat: BlogCat;
  title: Bi;
  excerpt: Bi;
  tags: { en: string[]; hi: string[] };
  date: string;
  mins: number;
  intro: Bi[];
  sections: { h: Bi; p: Bi[] }[];
  extra?: { h: Bi; p: Bi[] };
  tip: Bi;
}

const EXTRA = extraJson as Record<string, { h: Bi; p: Bi[] }>;

export const BLOGS: Blog[] = (blogsJson as Blog[]).map((b) => ({ ...b, extra: EXTRA[b.slug], mins: b.mins + 3 }));

export const CAT_META: Record<BlogCat, { label: Bi; image: string }> = {
  palm: { label: { en: "Hast Rekha", hi: "हस्तरेखा" }, image: "/images/blog-palm.svg" },
  graha: { label: { en: "Navagraha", hi: "नवग्रह" }, image: "/images/blog-graha.svg" },
  ratna: { label: { en: "Ratna", hi: "रत्न" }, image: "/images/blog-ratna.svg" },
  upay: { label: { en: "Upay & Mantra", hi: "उपाय व मंत्र" }, image: "/images/blog-upay.svg" },
  rashi: { label: { en: "Rashi & Nakshatra", hi: "राशि व नक्षत्र" }, image: "/images/blog-rashi.svg" },
};

export function getBlog(slug: string) {
  return BLOGS.find((b) => b.slug === slug);
}

export function searchBlogs(query: string, cat: BlogCat | "all"): Blog[] {
  const q = query.trim().toLowerCase();
  return BLOGS.filter((b) => {
    if (cat !== "all" && b.cat !== cat) return false;
    if (!q) return true;
    const hay = [
      b.title.en, b.title.hi, b.excerpt.en, b.excerpt.hi,
      ...b.tags.en, ...b.tags.hi,
      ...b.sections.flatMap((s) => [s.h.en, s.h.hi, ...s.p.flatMap((p) => [p.en, p.hi])]),
      b.extra ? [b.extra.h.en, b.extra.h.hi, ...b.extra.p.flatMap((p) => [p.en, p.hi])] : [],
    ].join(" ").toLowerCase();
    return q.split(/\s+/).every((w) => hay.includes(w));
  });
}

export function relatedBlogs(blog: Blog, n = 3) {
  const same = BLOGS.filter((b) => b.slug !== blog.slug && b.cat === blog.cat);
  const others = BLOGS.filter((b) => b.slug !== blog.slug && b.cat !== blog.cat);
  return [...same, ...others].slice(0, n);
}
