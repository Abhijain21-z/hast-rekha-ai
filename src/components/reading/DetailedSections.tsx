"use client";

import { motion } from "framer-motion";
import { UserRound, Heart, Gem, Coins, Briefcase, Activity, Plane, Users, Sparkles, Landmark, Flame, type LucideIcon } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import type { PalmReport } from "@/lib/palm";
import type { Rashi } from "@/lib/content";
import { AgeRange, DecadeBars, LifeGraph, Meter, RadarChart, Tilt } from "./ReportCharts";

const ICONS: Record<string, LucideIcon> = { UserRound, Heart, Gem, Coins, Briefcase, Activity, Plane, Users, Sparkles, Landmark, Flame };
const AREA_COLORS: Record<string, string> = { career: "#fbbf24", love: "#fb7185", health: "#34d399", wealth: "#f5c242", family: "#60a5fa", spirituality: "#c084fc", travel: "#22d3ee", fame: "#f97316" };
const RASHI_KEY: Record<string, "career" | "love" | "health" | "finance"> = { career: "career", love: "love", health: "health", wealth: "finance" };

export default function DetailedSections({ report, rashi }: { report: PalmReport; rashi: Rashi }) {
  const { t, L } = useLang();
  const { timing, birthYear, age } = report;
  const yr = (a: number) => birthYear + a;
  const rangeLabel = (r: [number, number]) => `${r[0]}–${r[1]} · ${yr(r[0])}–${yr(r[1])}`;

  const radarData = (["career", "love", "health", "wealth", "family", "spirituality", "travel", "fame"] as const).map((a) => ({ label: t.report.areas[a], value: report.scores[a] }));

  return (
    <section id="sec-detailed" className="scroll-mt-28">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400/90">✦ {t.report.section} 4</p>
        <h2 className="mt-2 font-display text-3xl text-white">{t.report.detailed}</h2>
        <p className="mt-1 text-sm text-slate-400">{t.report.detailedSub}</p>
      </div>

      <div className="space-y-6">
        {report.sections.map(({ def, paragraphs }, idx) => {
          const Icon = ICONS[def.icon] ?? Sparkles;
          const color = def.area ? AREA_COLORS[def.area] : "#f5c242";
          const rashiKey = RASHI_KEY[def.key];
          return (
            <motion.div key={def.key} initial={{ opacity: 0, y: 40, rotateX: 10 }} whileInView={{ opacity: 1, y: 0, rotateX: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.65, ease: "easeOut" }} style={{ transformPerspective: 1200 }}>
              <Tilt max={3}>
                <div className="glass relative overflow-hidden rounded-3xl p-6 sm:p-8">
                  <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full blur-3xl" style={{ background: `${color}22` }} />
                  <div className="relative grid gap-6 lg:grid-cols-[1.35fr_0.85fr]">
                    <div>
                      <div className="flex items-center gap-4">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border" style={{ borderColor: `${color}55`, background: `${color}1f`, color }}>
                          <Icon className="h-5 w-5" />
                        </span>
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500">{t.report.section} 4.{idx + 1}</p>
                          <h3 className="font-display text-xl text-white sm:text-2xl">{L(def.title)}</h3>
                        </div>
                      </div>
                      <div className="mt-5 space-y-3">
                        {paragraphs.map((p, i) => (
                          <motion.p key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 + i * 0.08 }} className="text-sm leading-relaxed text-slate-200 sm:text-[15px]">
                            {L(p)}
                          </motion.p>
                        ))}
                        {rashiKey && (
                          <div className="mt-4 rounded-2xl border border-gold-400/20 bg-gold-400/5 p-4">
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-gold-300">{t.report.byRashi} · {rashi.symbol} {L(rashi.short)}</p>
                            <p className="mt-1.5 text-sm leading-relaxed text-slate-200">{L(rashi.predictions[rashiKey])}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Visual per section */}
                    <div className="flex flex-col justify-center rounded-2xl border border-white/8 bg-black/20 p-4">
                      {def.visual === "radar" && <RadarChart data={radarData} />}
                      {def.visual === "meter" && def.area && (
                        <div className="space-y-4">
                          <Meter value={report.scores[def.area]} label={t.report.areas[def.area]} color={color} />
                          {def.key === "travel" && (
                            <div className="flex flex-wrap gap-2 pt-1">
                              {timing.travelAges.map((a) => (
                                <span key={a} className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-100">✈ {yr(a)} · {a} {t.report.age}</span>
                              ))}
                            </div>
                          )}
                          {def.key === "career" && <AgeRange nowLabel={t.report.now} currentAge={age} birthYear={birthYear} ranges={[{ from: timing.peak1[0], to: timing.peak1[1], label: `${t.report.peak} 1` }, { from: timing.peak2[0], to: timing.peak2[1], label: `${t.report.peak} 2`, color: "linear-gradient(90deg,#f5c242,#fbeab8)" }]} />}
                          {(def.key === "health" || def.key === "family" || def.key === "spirituality" || def.key === "wealth" || def.key === "love") && (
                            <div className="grid grid-cols-2 gap-3 pt-1">
                              {report.mounts.filter((m) => m.def.area === def.area).slice(0, 2).map((m) => (
                                <div key={m.def.key} className="rounded-xl bg-white/5 p-3">
                                  <p className="text-[10px] text-slate-400">{L(m.def.name)}</p>
                                  <p className="font-display text-lg text-white">{m.strength}%</p>
                                </div>
                              ))}
                              {report.lines.filter((l) => l.def.area === def.area).slice(0, 2).map((l) => (
                                <div key={l.def.key} className="rounded-xl bg-white/5 p-3">
                                  <p className="text-[10px] text-slate-400">{L(l.def.name)}</p>
                                  <p className="font-display text-lg text-white">{l.strength}%</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                      {def.visual === "range" && (
                        <div>
                          <p className="text-xs text-slate-400">{t.report.marriageWindow}</p>
                          <p className="font-display text-2xl text-gold-300">{rangeLabel(timing.marriage)}</p>
                          <AgeRange nowLabel={t.report.now} currentAge={age} birthYear={birthYear} ranges={[{ from: timing.marriage[0], to: timing.marriage[1], label: "♥", color: "linear-gradient(90deg,#fb7185,#f5c242)" }]} />
                        </div>
                      )}
                      {def.visual === "bars" && (
                        <div>
                          <p className="mb-2 text-xs text-slate-400">{t.report.wealthDecades}</p>
                          <DecadeBars data={report.decades} ageLabel={t.report.age} />
                          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[11px]">
                            <div className="rounded-xl bg-white/5 p-2"><p className="text-slate-400">{t.report.moneyStart}</p><p className="text-gold-200">{rangeLabel(timing.moneyStart)}</p></div>
                            <div className="rounded-xl bg-white/5 p-2"><p className="text-slate-400">{t.report.peak} 1</p><p className="text-gold-200">{rangeLabel(timing.peak1)}</p></div>
                            <div className="rounded-xl bg-white/5 p-2"><p className="text-slate-400">{t.report.peak} 2</p><p className="text-gold-200">{rangeLabel(timing.peak2)}</p></div>
                          </div>
                        </div>
                      )}
                      {def.visual === "graph" && (
                        <div>
                          <LifeGraph points={report.graph} luckyAges={timing.luckyAges} turning={timing.turning.map((tp) => ({ age: tp.age, label: L(tp.label) }))} currentAge={age} birthYear={birthYear} nowLabel={t.report.now} ageLabel={t.report.age} />
                          <div className="mt-3 flex flex-wrap gap-2">
                            {timing.luckyAges.map((a) => (
                              <span key={a} className="rounded-full border border-gold-400/40 bg-gold-400/10 px-3 py-1 text-xs text-gold-100">★ {yr(a)}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Tilt>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
