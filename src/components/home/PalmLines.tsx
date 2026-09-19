"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Hand, Mountain } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import { SectionHeading, cn } from "@/components/ui";
import PalmSvg, { PALM_LINES } from "@/components/palm/PalmSvg";
import { ANATOMY } from "@/lib/palm";

export default function PalmLines() {
  const { t, L } = useLang();
  const [active, setActive] = useState<string>("life");
  const [tab, setTab] = useState<"lines" | "mounts">("lines");

  const line = ANATOMY.lines.find((l) => l.key === active);
  const mount = ANATOMY.mounts.find((m) => m.key === active);
  const item = line ?? mount;
  const color = PALM_LINES.find((l) => l.key === active)?.color ?? "#c084fc";

  return (
    <section id="palm-lines" className="relative scroll-mt-28 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow={t.palmSection.eyebrow} title={t.palmSection.title} sub={t.palmSection.sub} />

        <div className="grid items-start gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            animate={{ y: [0, -10, 0] }}
            className="relative mx-auto w-full max-w-[340px]"
          >
            <div className="absolute -inset-4 rounded-[2.6rem] bg-gold-400/15 blur-3xl" />
            <div className="relative aspect-[280/440] overflow-hidden rounded-[2rem] border border-gold-400/40 gold-glow">
              <Image src="/images/palm-planets.png" alt={t.palmSection.title} fill sizes="340px" className="object-cover object-top" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-cosmic-950/50 via-transparent to-cosmic-950/20" />
              <PalmSvg
                overlay
                active={active}
                onSelect={(k) => { setActive(k); setTab(ANATOMY.mounts.some((m) => m.key === k) ? "mounts" : "lines"); }}
                className="absolute inset-0 h-full w-full"
              />
            </div>
            <p className="mt-3 text-center text-[11px] text-slate-400">{t.palmSection.tap}</p>
          </motion.div>

          <div>
            <div className="mb-4 flex rounded-full border border-white/10 bg-white/5 p-1 text-xs">
              {(["lines", "mounts"] as const).map((k) => (
                <button key={k} onClick={() => { setTab(k); setActive(k === "lines" ? "life" : "venus"); }} className={cn("flex flex-1 items-center justify-center gap-1.5 rounded-full px-4 py-2 transition", tab === k ? "bg-gold-400 text-cosmic-900" : "text-slate-300")}>
                  {k === "lines" ? <Hand className="h-3.5 w-3.5" /> : <Mountain className="h-3.5 w-3.5" />} {k === "lines" ? t.palmSection.lines : t.palmSection.mounts}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {(tab === "lines" ? ANATOMY.lines : ANATOMY.mounts).map((x) => {
                const c = PALM_LINES.find((l) => l.key === x.key)?.color ?? "#c084fc";
                const on = active === x.key;
                return (
                  <button key={x.key} onClick={() => setActive(x.key)} className={cn("flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition", on ? "border-gold-400/70 bg-gold-400/15 text-white" : "border-white/10 bg-white/5 text-slate-300 hover:border-white/30")}>
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: c, boxShadow: on ? `0 0 8px ${c}` : undefined }} />
                    {L(x.name)}
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              {item && (
                <motion.div key={active} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="glass mt-5 rounded-3xl p-6">
                  <div className="flex items-center gap-3">
                    <span className="h-3 w-3 rounded-full" style={{ background: color, boxShadow: `0 0 12px ${color}` }} />
                    <h3 className="font-display text-2xl text-white">{L(item.name)}</h3>
                  </div>
                  {line && (
                    <p className="mt-4 text-sm text-slate-300"><span className="font-semibold text-gold-300">{t.palmSection.where}: </span>{L(line.location)}</p>
                  )}
                  <p className="mt-2 text-sm text-slate-300"><span className="font-semibold text-gold-300">{t.palmSection.means}: </span>{L(item.meaning)}</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {item.variants.map((v) => (
                      <div key={v.label.en} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                        <p className="text-xs font-semibold text-gold-200">{L(v.label)}</p>
                        <p className="mt-1.5 text-xs leading-relaxed text-slate-400">{L(v.text)}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
