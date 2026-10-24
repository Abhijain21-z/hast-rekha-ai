import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Activity, ArrowRight, Briefcase, CalendarDays, CheckCircle2, Coins, Heart, Sparkles, Star } from "lucide-react";
import RashiGuideJsonLd, { type RashiFaqItem } from "@/components/rashi/RashiGuideJsonLd";
import ShareRow from "@/components/layout/ShareRow";
import { RASHIS, compatibility } from "@/lib/content";
import { RASHI_GUIDES, rashiGuideByKey, type RashiGuide } from "@/content/rashi-guides";
import { SITE_URL } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return RASHIS.map((r) => ({ sign: r.key }));
}

export async function generateMetadata({ params }: { params: Promise<{ sign: string }> }): Promise<Metadata> {
  const { sign } = await params;
  const r = RASHIS.find((x) => x.key === sign);
  if (!r) return { title: "Rashi not found | Hast Rekha AI", robots: { index: false } };

  const title = `${r.short.hi} राशि (${r.short.en}) — स्वभाव, प्रेम, करियर | Hast Rekha AI`;
  const description = `${r.short.hi} राशि का पूरा परिचय — स्वभाव, करियर, प्रेम, धन, स्वास्थ्य, शुभ रंग-अंक, रत्न और राशि मिलान। ${r.dates}। हिंदी में पढ़ें।`;

  return {
    title,
    description,
    keywords: [
      `${r.short.hi} rashi`,
      `${r.short.en} rashi`,
      `${r.key} rashifal`,
      `${r.short.hi} swabhav`,
      `${r.short.hi} rashi love`,
      `${r.short.hi} rashi career`,
      `${r.short.hi} rashi compatible`,
      `aaj ka ${r.short.hi} rashifal`,
    ],
    alternates: { canonical: `/rashi/${r.key}` },
    openGraph: {
      type: "article",
      url: `${SITE_URL}/rashi/${r.key}`,
      siteName: "Hast Rekha AI",
      title: `${r.short.hi} राशि (${r.short.en}) — स्वभाव, प्रेम और करियर`,
      description,
      images: [{ url: "/images/hand.png", width: 832, height: 1216, alt: `${r.short.hi} rashi` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${r.short.hi} राशि (${r.short.en}) — स्वभाव, प्रेम, करियर`,
      description,
      images: ["/images/hand.png"],
    },
  };
}

function buildFaqs(r: (typeof RASHIS)[number], guide: RashiGuide): RashiFaqItem[] {
  return [
    {
      q: `${r.short.hi} राशि की खास पहचान क्या है?`,
      a: `${r.short.hi} राशि ${r.element.hi} तत्व की राशि है और इसका स्वामी ${r.lord.hi} है। ${r.dates} के बीच जन्मे लोग ${r.traits.hi.slice(0, 3).join(", ")} जैसे गुणों के लिए जाने जाते हैं।`,
    },
    {
      q: `${r.short.hi} राशि के लिए शुभ रंग, अंक, दिन और रत्न क्या हैं?`,
      a: `शुभ रंग ${r.lucky.color.hi}, शुभ अंक ${r.lucky.number}, शुभ दिन ${r.lucky.day.hi} और शुभ रत्न ${r.lucky.gem.hi} माना जाता है। मंत्र: ${r.lucky.mantra}।`,
    },
    {
      q: `${r.short.hi} राशि का प्रेम और विवाह कैसा रहता है?`,
      a: r.predictions.love.hi,
    },
    {
      q: `${r.short.hi} राशि के करियर के लिए कौन सा क्षेत्र अच्छा है?`,
      a: r.predictions.career.hi,
    },
    {
      q: `${r.short.hi} राशि की कमजोरी या सावधानी क्या है?`,
      a: guide.shadow.hi,
    },
  ];
}

const BAND_LABEL = ["चुनौतीपूर्ण", "सामान्य", "अच्छा", "उत्कृष्ट"];
const BAND_CLASS = [
  "border-rose-400/25 bg-rose-400/10 text-rose-200",
  "border-slate-400/25 bg-slate-400/10 text-slate-200",
  "border-sky-400/25 bg-sky-400/10 text-sky-200",
  "border-emerald-400/25 bg-emerald-400/10 text-emerald-200",
];

export default async function RashiDetailPage({ params }: { params: Promise<{ sign: string }> }) {
  const { sign } = await params;
  const r = RASHIS.find((x) => x.key === sign);
  const guide = rashiGuideByKey(sign);
  if (!r || !guide) notFound();

  const index = RASHIS.findIndex((x) => x.key === r.key);
  const faqs = buildFaqs(r, guide);
  const matches = RASHIS.map((other, i) => ({ other, i, ...compatibility(index, i) }))
    .filter((m) => m.i !== index)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
      <RashiGuideJsonLd rashi={r} faqs={faqs} />

      <nav aria-label="Breadcrumb" className="text-xs text-slate-400">
        <Link href="/" className="hover:text-gold-300">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/rashi" className="hover:text-gold-300">Rashi</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-200">{r.short.hi}</span>
      </nav>

      <header className="mt-8">
        <div className="flex items-start gap-4">
          <span className="font-display text-6xl leading-none text-gold-300 drop-shadow-[0_0_18px_rgba(245,194,66,0.45)]">{r.symbol}</span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-400/90">✦ Rashi Guide</p>
            <h1 className="mt-2 font-display text-4xl leading-tight text-white sm:text-5xl">
              {r.short.hi} राशि <span className="text-gold-200">({r.short.en})</span>
            </h1>
            <p className="mt-2 text-sm text-slate-400">{r.dates} • {r.element.hi} तत्व • स्वामी {r.lord.hi} • {r.quality.hi}</p>
          </div>
        </div>

        <p className="mt-6 max-w-3xl text-base leading-relaxed text-slate-200 sm:text-lg">
          {r.short.hi} राशि का स्वभाव, प्रेम, करियर, धन और स्वास्थ्य — साथ में शुभ रंग, अंक, रत्न और राशि मिलान।
          नीचे दिए संकेत सामान्य हैं; अपनी जन्म कुंडली से व्यक्तिगत फल ज्यादा सटीक मिलता है।
        </p>

        <div className="mt-5">
          <ShareRow path={`/rashi/${r.key}`} text={`${r.short.hi} राशि (${r.short.en}) — स्वभाव, प्रेम और करियर। Hast Rekha AI`} />
        </div>

        <dl className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: CalendarDays, label: "जन्म अवधि", value: r.dates },
            { icon: Sparkles, label: "तत्व", value: r.element.hi },
            { icon: Star, label: "स्वामी ग्रह", value: r.lord.hi },
            { icon: CheckCircle2, label: "शुभ रंग", value: r.lucky.color.hi },
            { icon: CheckCircle2, label: "शुभ अंक", value: String(r.lucky.number) },
            { icon: CheckCircle2, label: "शुभ रत्न", value: r.lucky.gem.hi },
          ].map((item) => (
            <div key={item.label} className="glass rounded-2xl p-4">
              <dt className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-300/90">
                <item.icon className="h-4 w-4" /> {item.label}
              </dt>
              <dd className="mt-1.5 text-sm text-slate-100">{item.value}</dd>
            </div>
          ))}
        </dl>
      </header>

      <section className="mt-14">
        <h2 className="font-display text-3xl text-white">स्वभाव और व्यक्तित्व</h2>
        {guide.intro.hi.split("\n\n").map((p) => (
          <p key={p.slice(0, 30)} className="mt-4 text-sm leading-relaxed text-slate-300 sm:text-base">{p}</p>
        ))}

        <div className="mt-6 flex flex-wrap gap-2">
          {r.traits.hi.map((trait) => (
            <span key={trait} className="rounded-full border border-gold-400/25 bg-gold-400/10 px-3 py-1 text-sm text-gold-100">{trait}</span>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-rose-400/20 bg-rose-400/8 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-200/90">सावधानी</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-200">{guide.shadow.hi}</p>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="font-display text-3xl text-white">करियर, धन, प्रेम और स्वास्थ्य</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {[
            { key: "career", label: "करियर", icon: Briefcase, text: r.predictions.career.hi },
            { key: "finance", label: "धन", icon: Coins, text: r.predictions.finance.hi },
            { key: "love", label: "प्रेम और विवाह", icon: Heart, text: r.predictions.love.hi },
            { key: "health", label: "स्वास्थ्य", icon: Activity, text: r.predictions.health.hi },
          ].map((item) => (
            <article key={item.key} className="glass rounded-2xl p-5">
              <p className="flex items-center gap-2 font-display text-lg text-gold-200">
                <item.icon className="h-4 w-4" /> {item.label}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="font-display text-3xl text-white">शुभ संकेत और मंत्र</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["शुभ दिन", r.lucky.day.hi],
            ["शुभ रंग", r.lucky.color.hi],
            ["शुभ अंक", String(r.lucky.number)],
            ["शुभ रत्न", r.lucky.gem.hi],
          ].map(([label, value]) => (
            <div key={label} className="glass rounded-2xl p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-300/90">{label}</p>
              <p className="mt-1.5 text-lg text-white">{value}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
          <span className="font-semibold text-gold-200">मंत्र:</span> {r.lucky.mantra}
        </p>
      </section>

      <section className="mt-14">
        <h2 className="font-display text-3xl text-white">राशि मिलान — किन राशियों से बनेगी अच्छी जोड़ी?</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          तत्व, स्वामी ग्रह और राशि अक्ष के आधार पर यह सामान्य मिलान है। विवाह के लिए कुंडली मिलान (गुण मिलान) जरूर कराएं।
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {matches.map((m) => (
            <Link key={m.other.key} href={`/rashi/${m.other.key}`} className="glass rounded-2xl p-4 transition hover:border-gold-400/40">
              <div className="flex items-center justify-between gap-3">
                <p className="font-display text-lg text-white">{m.other.short.hi} <span className="text-sm text-slate-400">({m.other.short.en})</span></p>
                <span className={`rounded-full border px-2.5 py-1 text-xs ${BAND_CLASS[m.band]}`}>{m.score}%</span>
              </div>
              <p className="mt-2 text-xs text-slate-400">{BAND_LABEL[m.band]}</p>
            </Link>
          ))}
        </div>
      </section>

      <section id="faq" className="mt-14 scroll-mt-28">
        <h2 className="font-display text-3xl text-white">{r.short.hi} राशि से जुड़े सवाल</h2>
        <div className="mt-5 space-y-3">
          {faqs.map((f) => (
            <details key={f.q} className="glass group rounded-2xl p-5">
              <summary className="cursor-pointer list-none font-medium text-white marker:hidden">
                <span className="flex items-start justify-between gap-4">
                  {f.q}
                  <span className="mt-1 text-gold-300 transition group-open:rotate-45">+</span>
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-14 rounded-[2rem] border border-gold-400/25 bg-gradient-to-r from-gold-400/12 via-mystic-700/20 to-cosmic-900/40 p-7 text-center sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-300/90">Personal Reading</p>
        <h2 className="mt-3 font-display text-3xl text-white">{r.short.hi} राशि से आगे अपनी कुंडली देखें</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">
          राशि सिर्फ सूर्य का संकेत है। जन्म तारीख, समय और स्थान से बनी कुंडली बताती है कि आपके लिए करियर, धन और
          रिश्तों में क्या खास है — फ्री रीडिंग में राशि, नक्षत्र, लग्न और 12 जीवन क्षेत्र शामिल हैं।
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link href="/reading" className="btn-gold inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm">
            फ्री रीडिंग शुरू करें <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href={`/rashifal?sign=${r.key}`} className="inline-flex items-center gap-2 rounded-full border border-gold-400/40 px-6 py-3 text-sm text-gold-200 transition hover:border-gold-400/70 hover:text-gold-100">
            आज का राशिफल
          </Link>
          <Link href="/diwali-2026" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm text-slate-200 transition hover:border-gold-400/40 hover:text-white">
            Diwali 2026
          </Link>
        </div>
      </section>

      <section className="mt-10 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
        {RASHIS.filter((x) => x.key !== r.key).map((x) => (
          <Link key={x.key} href={`/rashi/${x.key}`} className="rounded-full border border-white/10 px-3 py-1.5 transition hover:border-gold-400/40 hover:text-white">
            {x.symbol} {x.short.hi}
          </Link>
        ))}
      </section>

      <div className="mt-10 flex justify-center">
        <ShareRow path={`/rashi/${r.key}`} text={`${r.short.hi} राशि (${r.short.en}) — स्वभाव, प्रेम और करियर। Hast Rekha AI`} />
      </div>

      <p className="mt-12 text-center text-xs leading-relaxed text-slate-500">
        यह पेज मनोरंजन और आत्म-चिंतन के लिए है। यह चिकित्सा, कानूनी या वित्तीय सलाह नहीं है।
      </p>
    </div>
  );
}
