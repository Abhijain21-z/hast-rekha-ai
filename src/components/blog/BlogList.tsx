"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Clock, ArrowRight } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import { Input, cn } from "@/components/ui";
import { BLOGS, CAT_META, searchBlogs, type BlogCat } from "@/lib/blogs";

const CATS: (BlogCat | "all")[] = ["all", "palm", "graha", "ratna", "upay", "rashi"];

export default function BlogList() {
  const { t, L, lang, cl } = useLang();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<BlogCat | "all">("all");
  const results = useMemo(() => searchBlogs(q, cat), [q, cat]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400/90">{t.blog.eyebrow}</p>
        <h1 className="mt-3 font-display text-4xl text-white sm:text-5xl">{t.blog.title}</h1>
        <p className="mx-auto mt-3 max-w-2xl text-slate-300">{t.blog.sub}</p>
      </motion.div>

      <div className="sticky top-[110px] z-30 mt-8 -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="glass-strong flex flex-col gap-3 rounded-3xl p-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.blog.search} className="pl-10" />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {CATS.map((c) => (
              <button key={c} onClick={() => setCat(c)} className={cn("rounded-full border px-3.5 py-1.5 text-xs transition", cat === c ? "border-gold-400/70 bg-gold-400/20 text-gold-100" : "border-white/10 text-slate-300 hover:border-white/30")}>
                {c === "all" ? t.blog.all : L(CAT_META[c].label)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-6 text-xs text-slate-500">{results.length} {t.blog.results}</p>

      {results.length === 0 ? (
        <p className="glass mt-4 rounded-2xl p-10 text-center text-sm text-slate-400">{t.blog.none}</p>
      ) : (
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((b, i) => (
            <motion.article key={b.slug} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}>
              <Link href={`/blog/${b.slug}`} className="glass group flex h-full flex-col overflow-hidden rounded-3xl transition hover:border-gold-400/50">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image src={CAT_META[b.cat].image} alt={L(b.title)} fill sizes="(max-width:640px) 100vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-cosmic-950/80 via-transparent to-transparent" />
                  <span className="absolute left-3 top-3 rounded-full border border-gold-400/40 bg-cosmic-950/70 px-3 py-1 text-[11px] text-gold-200 backdrop-blur">{L(CAT_META[b.cat].label)}</span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h2 className="font-display text-lg leading-snug text-white group-hover:text-gold-200">{L(b.title)}</h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400">{L(b.excerpt)}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {b.tags[cl].slice(0, 3).map((tag) => (
                      <span key={tag} className="rounded-full bg-white/6 px-2.5 py-0.5 text-[10px] text-slate-300">#{tag}</span>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-white/8 pt-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {b.mins} {t.blog.minRead} · {new Date(b.date).toLocaleDateString(lang === "hi" ? "hi-IN" : "en-IN", { month: "short", year: "numeric" })}</span>
                    <span className="inline-flex items-center gap-1 text-gold-300">{t.blog.read} <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" /></span>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      )}

      {results.length === BLOGS.length && (
        <div className="mt-10 flex flex-wrap gap-2">
          {BLOGS.flatMap((b) => b.tags[cl]).slice(0, 24).map((tag, i) => (
            <button key={`${tag}-${i}`} onClick={() => setQ(tag.split(" ")[0])} className="rounded-full border border-white/10 px-3 py-1 text-[11px] text-slate-400 transition hover:border-gold-400/40 hover:text-gold-200">#{tag}</button>
          ))}
        </div>
      )}
    </div>
  );
}
