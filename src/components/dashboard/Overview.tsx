"use client";

import Link from "next/link";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { BookOpen, Star, Users, CalendarDays, PlusCircle, ArrowRight, Sparkles, Hand } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import { Card, EmptyState, cn } from "@/components/ui";
import { dailyHoroscope, nakshatraAt, rashiAt } from "@/lib/content";
import { formatDate, type ReadingSummaryDTO } from "@/lib/dto";

interface Props {
  userName: string;
  memberSince: string;
  stats: { readings: number; favorites: number; profiles: number };
  recent: ReadingSummaryDTO[];
}

export default function Overview({ userName, memberSince, stats, recent }: Props) {
  const { t, L, lang, cl } = useLang();
  const primary = recent.find((r) => r.isFavorite) ?? recent[0];
  const daily = useMemo(() => (primary ? dailyHoroscope(primary.result.moonRashi) : null), [primary]);
  const rashi = primary ? rashiAt(primary.result.moonRashi) : null;

  const cards = [
    { label: t.dash.totalReadings, value: stats.readings, icon: BookOpen },
    { label: t.dash.favorites, value: stats.favorites, icon: Star },
    { label: t.dash.profilesCount, value: stats.profiles, icon: Users },
    { label: t.dash.memberSince, value: formatDate(memberSince.slice(0, 10), cl), icon: CalendarDays, small: true },
  ];

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400/90">✦ {t.dash.overview}</p>
          <h1 className="mt-2 font-display text-3xl text-white sm:text-4xl">{t.dash.welcome}, {userName.split(" ")[0]} 🙏</h1>
          <p className="mt-1 text-sm text-slate-400">{t.dash.welcomeSub}</p>
        </div>
        <Link href="/reading" className="btn-gold inline-flex items-center gap-2 self-start rounded-full px-5 py-2.5 text-sm sm:self-auto">
          <PlusCircle className="h-4 w-4" /> {t.dash.newReading}
        </Link>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c, i) => (
          <motion.div key={c.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}>
            <Card className="flex items-center gap-4 p-5">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gold-400/25 bg-gold-400/10 text-gold-300"><c.icon className="h-5 w-5" /></span>
              <div>
                <p className={cn("font-display text-white", c.small ? "text-base" : "text-3xl")}>{c.value}</p>
                <p className="text-xs text-slate-400">{c.label}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2">
          <Card strong className="relative h-full overflow-hidden p-6">
            <div className="mandala-bg pointer-events-none absolute inset-0 opacity-50" />
            <div className="relative">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold-300"><Sparkles className="h-3.5 w-3.5" /> {t.dash.today}</p>
              {daily && rashi && primary ? (
                <>
                  <div className="mt-3 flex items-center gap-4">
                    <span className="font-display text-6xl text-gold-300 drop-shadow-[0_0_16px_rgba(245,194,66,0.5)]">{rashi.symbol}</span>
                    <div>
                      <p className="font-display text-2xl text-white">{L(rashi.name)}</p>
                      <p className="text-xs text-slate-400">{t.dash.todayFor} {primary.fullName} · {daily.date}</p>
                    </div>
                  </div>
                  <p className="mt-5 text-base leading-relaxed text-slate-100">{L(daily.message)}</p>
                  <div className="mt-5 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-white/8 px-3 py-1 text-slate-200">{t.dash.mood}: {L(daily.mood)}</span>
                    <span className="rounded-full bg-white/8 px-3 py-1 text-slate-200">{t.dash.luckyNumber}: {daily.luckyNumber}</span>
                    <span className="rounded-full bg-white/8 px-3 py-1 text-slate-200">{t.dash.luckyColor}: {L(daily.luckyColor)}</span>
                  </div>
                </>
              ) : (
                <p className="mt-4 text-sm text-slate-400">{t.dash.noReadingsSub}</p>
              )}
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card className="h-full p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-gold-300">{t.dash.quick}</p>
            <div className="mt-4 space-y-2">
              {[
                { href: "/reading", label: t.dash.newReading, icon: PlusCircle },
                { href: "/dashboard/profiles", label: t.dash.addProfile, icon: Users },
                { href: "/rashi#compatibility", label: t.rashiPage.compat, icon: Star },
                { href: "/reading#palm", label: t.footer.palmGuide, icon: Hand },
              ].map((q) => (
                <Link key={q.href} href={q.href} className="flex items-center gap-3 rounded-2xl border border-white/8 px-4 py-3 text-sm text-slate-200 transition hover:border-gold-400/40 hover:bg-white/5">
                  <q.icon className="h-4 w-4 text-gold-300" /> {q.label} <ArrowRight className="ml-auto h-4 w-4 text-slate-500" />
                </Link>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl text-white">{t.dash.recent}</h2>
          <Link href="/dashboard/readings" className="text-sm text-gold-300 hover:text-gold-200">{t.dash.viewAll} →</Link>
        </div>
        {recent.length === 0 ? (
          <EmptyState icon={<BookOpen className="h-8 w-8" />} title={t.dash.noReadingsTitle} sub={t.dash.noReadingsSub} action={<Link href="/reading" className="btn-gold rounded-full px-5 py-2.5 text-sm">{t.dash.create}</Link>} />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {recent.map((r, i) => {
              const rs = rashiAt(r.result.moonRashi);
              const nk = nakshatraAt(r.result.nakshatra);
              return (
                <motion.div key={r.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.05 }}>
                  <Link href={`/dashboard/readings/${r.id}`} className="glass flex items-center gap-4 rounded-2xl p-4 transition hover:border-gold-400/40">
                    <span className="font-display text-4xl text-gold-300">{rs.symbol}</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-white">{r.title}</p>
                      <p className="truncate text-xs text-slate-400">{r.fullName} · {L(rs.short)} · {L(nk.name)}</p>
                      <p className="text-xs text-slate-500">{formatDate(r.birthDate, cl)} · {r.placeName.split(",")[0]}</p>
                    </div>
                    {r.isFavorite && <Star className="h-4 w-4 fill-gold-400 text-gold-400" />}
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
