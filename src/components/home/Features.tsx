"use client";

import { motion } from "framer-motion";
import { Orbit, Hand, Languages, Zap, Sun, Heart, type LucideIcon } from "lucide-react";
import featuresJson from "@/content/features.json";
import { useLang } from "@/components/providers/LanguageProvider";
import { SectionHeading } from "@/components/ui";
import type { Bi } from "@/lib/i18n";

const ICONS: Record<string, LucideIcon> = { Orbit, Hand, Languages, Zap, Sun, Heart };
const FEATURES = featuresJson as { icon: string; title: Bi; desc: Bi }[];

export default function Features() {
  const { t, L } = useLang();
  return (
    <section id="features" className="relative scroll-mt-20 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="✦ Features" title={t.features.title} sub={t.features.sub} />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => {
            const Icon = ICONS[f.icon] ?? Orbit;
            return (
              <motion.div
                key={f.icon}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: (i % 3) * 0.1 }}
                whileHover={{ y: -6 }}
                className="glass group relative overflow-hidden rounded-3xl p-7 transition-colors hover:border-gold-400/40"
              >
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-mystic-600/20 blur-2xl transition-opacity group-hover:opacity-100 opacity-0" />
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-gold-400/30 bg-gradient-to-br from-gold-400/20 to-mystic-600/20 text-gold-300 transition-transform group-hover:scale-110">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-display text-lg text-white">{L(f.title)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{L(f.desc)}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
