import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, Clock, Lightbulb, Sparkles } from "lucide-react";
import { cookies } from "next/headers";
import { CAT_META, getBlog, relatedBlogs } from "@/lib/blogs";
import { dictionaries, pick, type Lang } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const blog = getBlog(slug);
  if (!blog) return { title: "Blog — Hast Rekha AI" };
  return {
    title: `${blog.title.hi} | ${blog.title.en}`,
    description: `${blog.excerpt.hi} ${blog.excerpt.en}`,
    keywords: [...blog.tags.hi, ...blog.tags.en].join(", "),
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

  return (
    <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> {t.blog.back}
      </Link>

      <div className="mt-6 relative aspect-[16/8] overflow-hidden rounded-[2rem] border border-gold-400/30 gold-glow">
        <Image src={CAT_META[blog.cat].image} alt={L(blog.title)} fill priority sizes="(max-width:896px) 100vw, 896px" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-cosmic-950/90 via-cosmic-950/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
          <span className="rounded-full border border-gold-400/40 bg-cosmic-950/70 px-3 py-1 text-[11px] text-gold-200 backdrop-blur">{L(CAT_META[blog.cat].label)}</span>
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
          <span key={tag} className="rounded-full bg-white/6 px-3 py-1 text-[11px] text-slate-300">#{tag}</span>
        ))}
      </div>

      <div className="mt-8 space-y-4">
        {blog.intro.map((p, i) => (
          <p key={i} className="text-base leading-relaxed text-slate-100 sm:text-lg sm:leading-8">{L(p)}</p>
        ))}
      </div>

      <div className="mt-10 space-y-10">
        {blog.sections.map((s, i) => (
          <section key={i}>
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
        ))}
      </div>

      {blog.extra && (
        <section className="mt-10">
          <h2 className="flex items-center gap-3 font-display text-xl text-white sm:text-2xl">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gold-400/15 font-display text-sm text-gold-300">{blog.sections.length + 1}</span>
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
      </div>

      <h3 className="mt-14 font-display text-2xl text-white">{t.blog.related}</h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {related.map((r) => (
          <Link key={r.slug} href={`/blog/${r.slug}`} className="glass group overflow-hidden rounded-2xl transition hover:border-gold-400/50">
            <div className="relative aspect-[16/9]">
              <Image src={CAT_META[r.cat].image} alt={L(r.title)} fill sizes="300px" className="object-cover transition-transform group-hover:scale-105" />
            </div>
            <p className="p-3 font-display text-sm leading-snug text-white group-hover:text-gold-200">{L(r.title)}</p>
          </Link>
        ))}
      </div>
    </article>
  );
}
