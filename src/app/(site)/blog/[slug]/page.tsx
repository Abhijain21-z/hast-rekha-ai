import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, Clock, Lightbulb, Sparkles } from "lucide-react";
import { cookies } from "next/headers";
import BlogJsonLd from "@/components/blog/BlogJsonLd";
import { blogImage, blogInlineImage, CAT_META, getBlog, relatedBlogs } from "@/lib/blogs";
import { blogDeepLinks } from "@/lib/blog-links";
import { dictionaries, pick, type Lang } from "@/lib/i18n";
import { BOOK_PROMO } from "@/lib/flags";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const blog = getBlog(slug);
  if (!blog) return { title: "Blog — Hast Rekha AI" };
  const title = `${blog.title.hi} | ${blog.title.en}`;
  const description = `${blog.excerpt.hi} ${blog.excerpt.en}`;
  const image = blogImage(blog);
  return {
    title,
    description,
    keywords: [...blog.tags.hi, ...blog.tags.en].join(", "),
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      type: "article",
      title,
      description,
      url: `/blog/${slug}`,
      images: [{ url: image, width: 1200, height: 675, alt: blog.title.hi }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = getBlog(slug);
  if (!blog) notFound();
  const store = await cookies();
  const lang: Lang = store.get("hr_lang")?.value === "en" ? "en" : "hi";
  const t = dictionaries[lang];
  const L = (v: { en: string; hi: string }) => pick(lang, v);
  const cl = lang === "hi" ? "hi" : "en";
  const related = relatedBlogs(blog);
  const deepLinks = blogDeepLinks(blog);
  // Hide the affiliate book-promo section while it's disabled (AdSense review).
  const sections = BOOK_PROMO
    ? blog.sections
    : blog.sections.filter((s) => !/धनदायक तांत्रिक|Dhandayak Tantrik/i.test(`${s.h?.hi ?? ""} ${s.h?.en ?? ""}`));

  return (
    <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <BlogJsonLd blog={blog} lang={cl} />
      <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> {t.blog.back}
      </Link>

      <div className="mt-6 relative aspect-[16/9] overflow-hidden rounded-[2rem] border border-gold-400/30 gold-glow">
        <Image src={blogImage(blog)} alt={L(blog.title)} fill priority sizes="(max-width:896px) 100vw, 896px" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-cosmic-950/90 via-cosmic-950/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
          <span className="rounded-full border border-gold-400/40 bg-cosmic-950/70 px-3 py-1 text-xs text-gold-200 backdrop-blur">{L(CAT_META[blog.cat].label)}</span>
          <h1 className="mt-3 font-display text-2xl leading-tight text-white sm:text-4xl">{L(blog.title)}</h1>
          <p className="mt-2 flex items-center gap-3 text-xs text-slate-300">
            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {blog.mins} {t.blog.minRead}</span>
            <span>·</span>
            <span>{new Date(blog.date).toLocaleDateString(lang === "hi" ? "hi-IN" : "en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {blog.tags[cl].map((tag) => (
          <span key={tag} className="rounded-full bg-white/6 px-3 py-1 text-xs text-slate-300">#{tag}</span>
        ))}
      </div>

      <div className="mt-8 space-y-4">
        {blog.intro.map((p, i) => (
          <p key={i} className="text-base leading-relaxed text-slate-100 sm:text-lg sm:leading-8">{L(p)}</p>
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-4 rounded-3xl border border-gold-400/30 bg-gradient-to-r from-gold-400/12 to-mystic-700/20 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="flex items-center gap-2 font-display text-lg text-white">
            <Sparkles className="h-4 w-4 shrink-0 text-gold-300" /> {t.blog.promoTitle}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-slate-300">{t.blog.promoSub}</p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Link href="/reading" className="btn-gold inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm">
            {t.blog.promoFree} <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/pricing" className="inline-flex items-center gap-2 rounded-full border border-gold-400/40 px-5 py-2.5 text-sm text-gold-200 transition hover:border-gold-400/70 hover:text-gold-100">
            {t.blog.promoPro}
          </Link>
        </div>
      </div>

      <div className="mt-10 space-y-10">
        {sections.map((s, i) => (
          <Fragment key={i}>
            <section>
              <h2 className="flex items-center gap-3 font-display text-xl text-white sm:text-2xl">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gold-400/15 font-display text-sm text-gold-300">{i + 1}</span>
                {L(s.h)}
              </h2>
              <div className="mt-3 space-y-3">
                {s.p.map((p, j) => (
                  <p key={j} className="text-sm leading-relaxed text-slate-200 sm:text-base sm:leading-7">{L(p)}</p>
                ))}
              </div>
            </section>
            {i === 1 && (
              <figure className="overflow-hidden rounded-3xl border border-white/10">
                <Image
                  src={blogInlineImage(blog)}
                  alt={`${L(blog.title)} ${lang === "hi" ? "— चित्र" : "— illustration"}`}
                  width={800}
                  height={450}
                  sizes="(max-width:896px) 100vw, 896px"
                  className="h-auto w-full"
                />
              </figure>
            )}
          </Fragment>
        ))}
      </div>

      {blog.extra && (
        <section className="mt-10">
          <h2 className="flex items-center gap-3 font-display text-xl text-white sm:text-2xl">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gold-400/15 font-display text-sm text-gold-300">{sections.length + 1}</span>
            {L(blog.extra.h)}
          </h2>
          <div className="mt-3 space-y-3">
            {blog.extra.p.map((p, j) => (
              <p key={j} className="text-sm leading-relaxed text-slate-200 sm:text-base sm:leading-7">{L(p)}</p>
            ))}
          </div>
        </section>
      )}

      <div className="mt-10 rounded-2xl border border-gold-400/30 bg-gold-400/10 p-5">
        <p className="flex items-center gap-2 text-sm font-semibold text-gold-200"><Lightbulb className="h-4 w-4" /> {t.blog.tip}</p>
        <p className="mt-2 text-sm leading-relaxed text-gold-50">{L(blog.tip)}</p>
      </div>

      <div className="mt-12 flex flex-col items-center gap-3 rounded-3xl border border-mystic-500/30 bg-gradient-to-r from-mystic-700/25 to-gold-400/10 px-6 py-8 text-center">
        <Sparkles className="h-6 w-6 text-gold-300" />
        <p className="font-display text-xl text-white">{t.blog.cta}</p>
        <Link href="/reading" className="btn-gold mt-2 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm">
          {t.blog.ctaBtn} <ArrowRight className="h-4 w-4" />
        </Link>
        <Link href="/pricing" className="inline-flex items-center gap-1.5 text-sm text-gold-200 underline decoration-gold-400/40 underline-offset-4 transition hover:text-gold-100">
          {t.blog.promoPro}
        </Link>
        {deepLinks.length > 0 && (
          <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-t border-white/10 pt-4 text-sm">
            <span className="text-slate-400">{t.blog.promoDeep}:</span>
            {deepLinks.map((d) => (
              <Link key={d.href} href={d.href} className="text-gold-200 transition hover:text-gold-100">
                {L(d.label)}
              </Link>
            ))}
          </div>
        )}
      </div>

      <h3 className="mt-14 font-display text-2xl text-white">{t.blog.related}</h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {related.map((r) => (
          <Link key={r.slug} href={`/blog/${r.slug}`} className="glass group overflow-hidden rounded-2xl transition hover:border-gold-400/50">
            <div className="relative aspect-[16/9]">
              <Image src={blogImage(r)} alt={L(r.title)} fill sizes="300px" className="object-cover transition-transform group-hover:scale-105" />
            </div>
            <p className="p-3 font-display text-sm leading-snug text-white group-hover:text-gold-200">{L(r.title)}</p>
          </Link>
        ))}
      </div>
    </article>
  );
}
