import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Briefcase, CalendarDays, CheckCircle2, Coins, Heart, Sparkles, Sun } from "lucide-react";
import DiwaliJsonLd from "@/components/festival/DiwaliJsonLd";
import DiwaliPujaPromo from "@/components/offers/DiwaliPujaPromo";
import ShareRow from "@/components/layout/ShareRow";
import { DIWALI_2026, DIWALI_FAQS, DIWALI_RASHIFAL } from "@/content/diwali";
import { RASHIS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Diwali 2026 Rashifal — 8 Nov, 12 Rashiyon Ka Fal | Hast Rekha AI",
  description:
    "Diwali 2026 Sunday, 8 November ko hai. Lakshmi Puja muhurat, 12 rashiyon ka Diwali rashifal, hath ki rekha se dhan aur career ke sanket, aur traditional upay — Hindi me free.",
  keywords: [
    "diwali 2026 rashifal",
    "diwali rashifal 2026",
    "8 november 2026 diwali",
    "lakshmi puja muhurat 2026",
    "diwali 2026 date",
    "diwali upay",
    "rashi rashifal diwali",
    "hast rekha diwali",
  ],
  alternates: { canonical: "/diwali-2026" },
  openGraph: {
    type: "article",
    url: "/diwali-2026",
    siteName: "Hast Rekha AI",
    title: "Diwali 2026 Rashifal — 8 November, 12 Rashiyon Ka Fal",
    description:
      "Diwali 2026 date, Lakshmi Puja muhurat, 12 rashiyon ka rashifal aur hath ki rekha se dhan-career ke sanket.",
    images: [{ url: "/images/hand.png", width: 832, height: 1216, alt: "Diwali 2026 rashifal — golden palm" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Diwali 2026 Rashifal — 8 November, 12 Rashiyon Ka Fal",
    description: "Diwali 2026 date, muhurat, 12 rashiyon ka rashifal aur hast rekha ke sanket.",
    images: ["/images/hand.png"],
  },
};

const PALM_LINKS = [
  { href: "/money-line", icon: Coins, title: "धन रेखा", text: "हथेली पर धन रेखा कहां है और अधिक धन के संकेत क्या हैं।" },
  { href: "/fate-line", icon: Sparkles, title: "भाग्य रेखा", text: "किस्मत की रेखा मजबूत हो तो करियर में क्या बदलता है।" },
  { href: "/career-line", icon: Briefcase, title: "करियर रेखा", text: "नौकरी या व्यापार — हथेली किस दिशा का संकेत देती है।" },
  { href: "/heart-line", icon: Heart, title: "हृदय रेखा", text: "रिश्तों, प्रेम और विवाह के भावनात्मक संकेत।" },
];

const UPAY = [
  "दिवाली से पहले घर की सफाई करें और पूजा स्थान को व्यवस्थित रखें।",
  "लक्ष्मी-गणेश की पूजा प्रदोष काल में करें; दीपक घर के मुख्य द्वार पर रखें।",
  "जरूरतमंदों को अनाज, कपड़ा या दक्षिणा दान करें — मन में संकल्प स्पष्ट रखें।",
  "जुआ, सट्टा और जल्दी पैसा बनाने के लालच से बचें; बजट बनाकर खर्च करें।",
  "पुराने बिल, उधार और अधूरे काम दिवाली से पहले निपटाएं।",
];

export default function Diwali2026Page() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      <DiwaliJsonLd />

      <nav aria-label="Breadcrumb" className="text-xs text-slate-400">
        <Link href="/" className="hover:text-gold-300">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-200">Diwali 2026</span>
      </nav>

      <header className="mt-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400/90">✦ Diwali 2026 Special</p>
        <h1 className="mt-3 max-w-4xl font-display text-4xl leading-tight text-white sm:text-5xl">
          Diwali 2026 Rashifal: 8 November, 12 राशियों का फल
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-relaxed text-slate-200 sm:text-lg">
          Diwali 2026 रविवार, <strong className="text-gold-200">8 नवंबर</strong> को है। इस पेज पर लक्ष्मी पूजा का
          शुभ मुहूर्त, हर राशि का दिवाली संकेत, हथेली की रेखाओं से धन-करियर के संकेत और पारंपरिक उपाय — सब एक जगह।
          राशिफल सामान्य संकेत है; अपना व्यक्तिगत फल जानने के लिए जन्म विवरण से कुंडली देखें।
        </p>

        <div className="mt-6">
          <ShareRow
            path="/diwali-2026"
            text="Diwali 2026 Rashifal — 8 November, 12 rashiyon ka fal, Lakshmi Puja muhurat aur upay. Hast Rekha AI"
          />
        </div>

        <dl className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: CalendarDays, label: "Diwali 2026", value: DIWALI_2026.date.hi },
            { icon: Sun, label: "Lakshmi Puja", value: DIWALI_2026.muhurat.hi },
            { icon: Sparkles, label: "Pradosh Kaal", value: DIWALI_2026.pradosh.hi },
            { icon: CheckCircle2, label: "Dhanteras", value: DIWALI_2026.dhanteras.hi },
          ].map((item) => (
            <div key={item.label} className="glass rounded-2xl p-4">
              <dt className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-300/90">
                <item.icon className="h-4 w-4" /> {item.label}
              </dt>
              <dd className="mt-2 text-sm leading-relaxed text-slate-100">{item.value}</dd>
            </div>
          ))}
        </dl>
      </header>

      <section className="mt-12">
        <DiwaliPujaPromo />
      </section>

      <section id="rashifal" className="mt-16 scroll-mt-28">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-400/90">12 Rashiyan</p>
            <h2 className="mt-2 font-display text-3xl text-white sm:text-4xl">दिवाली 2026 में आपकी राशि क्या कहती है?</h2>
          </div>
          <Link href="/rashifal" className="inline-flex items-center gap-1.5 text-sm text-gold-200 hover:text-gold-100">
            आज का राशिफल <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {RASHIS.map((r) => {
            const entry = DIWALI_RASHIFAL.find((d) => d.key === r.key);
            return (
              <article key={r.key} className="glass flex flex-col rounded-3xl p-5">
                <div className="flex items-start gap-3">
                  <span className="font-display text-4xl text-gold-300 drop-shadow-[0_0_12px_rgba(245,194,66,0.45)]">{r.symbol}</span>
                  <div>
                    <h3 className="font-display text-lg text-white">{r.short.hi} <span className="text-sm text-slate-400">({r.short.en})</span></h3>
                    <p className="text-xs text-slate-500">{r.dates} • {r.element.hi} • {r.lord.hi}</p>
                  </div>
                </div>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-300">{entry?.line.hi}</p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  <Link href={`/rashi/${r.key}`} className="rounded-full border border-gold-400/35 bg-gold-400/10 px-3 py-1.5 text-gold-200 transition hover:border-gold-400/60">
                    राशि विस्तार
                  </Link>
                  <Link href={`/rashifal?sign=${r.key}`} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-slate-300 transition hover:border-gold-400/40 hover:text-white">
                    आज का राशिफल
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mt-16">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-400/90">Hast Rekha</p>
        <h2 className="mt-2 font-display text-3xl text-white sm:text-4xl">दिवाली पर हथेली से क्या देखें?</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">
          हस्तरेखा जन्म के समय की तारीख, समय और स्थान से बनी कुंडली के साथ पढ़ी जाए तो धन, करियर और रिश्तों की
          प्रवृत्ति साफ दिखती है। नीचे चार मुख्य रेखाओं की गाइड हैं — पहले सामान्य संकेत समझें, फिर अपनी कुंडली से
          व्यक्तिगत फल देखें।
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {PALM_LINKS.map((item) => (
            <Link key={item.href} href={item.href} className="glass group rounded-2xl p-5 transition hover:border-gold-400/40">
              <p className="flex items-center gap-2 font-display text-lg text-gold-200">
                <item.icon className="h-4 w-4" /> {item.title}
                <ArrowRight className="ml-auto h-4 w-4 transition group-hover:translate-x-1" />
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">{item.text}</p>
            </Link>
          ))}
        </div>
        <div className="mt-5">
          <Link href="/reading" className="btn-gold inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm">
            अपनी हस्तरेखा + कुंडली फ्री देखें <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="mt-16 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="glass-strong rounded-3xl p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-400/90">Muhurat</p>
          <h2 className="mt-2 font-display text-2xl text-white sm:text-3xl">दिवाली 2026 पूजा मुहूर्त</h2>
          <dl className="mt-5 space-y-3 text-sm">
            {[
              ["दिवाली", DIWALI_2026.date.hi],
              ["कार्तिक अमावस्या", DIWALI_2026.tithi.hi],
              ["लक्ष्मी पूजा (दिल्ली)", DIWALI_2026.muhurat.hi],
              ["प्रदोष काल / वृषभ लग्न", DIWALI_2026.pradosh.hi],
              ["धनतेरस", DIWALI_2026.dhanteras.hi],
            ].map(([label, value]) => (
              <div key={label} className="flex flex-col gap-1 border-b border-white/8 pb-3 last:border-0 last:pb-0 sm:flex-row sm:justify-between sm:gap-6">
                <dt className="shrink-0 text-slate-400">{label}</dt>
                <dd className="text-slate-100 sm:text-right">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-xs leading-relaxed text-slate-500">
            समय नई दिल्ली के लिए हैं। सूर्यास्त के अनुसार हर शहर में मुहूर्त बदलता है — पूजा से पहले अपने स्थानीय
            पंचांग से पुष्टि करें।
          </p>
        </div>

        <div className="glass rounded-3xl p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-400/90">Upay</p>
          <h2 className="mt-2 font-display text-2xl text-white sm:text-3xl">दिवाली के 5 पारंपरिक उपाय</h2>
          <ul className="mt-5 space-y-3 text-sm leading-relaxed text-slate-200">
            {UPAY.map((item) => (
              <li key={item} className="flex gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <Link href="/upay" className="mt-5 inline-flex items-center gap-1.5 text-sm text-gold-200 hover:text-gold-100">
            विस्तृत उपाय देखें <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="mt-4 text-xs leading-relaxed text-slate-500">
            उपाय पारंपरिक अभ्यास हैं, किसी परिणाम की गारंटी नहीं। इन्हें सकारात्मक आदत और संकल्प के रूप में करें।
          </p>
        </div>
      </section>

      <section id="faq" className="mt-16 scroll-mt-28">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-400/90">FAQ</p>
        <h2 className="mt-2 font-display text-3xl text-white sm:text-4xl">दिवाली 2026 से जुड़े सवाल</h2>
        <div className="mt-6 space-y-3">
          {DIWALI_FAQS.map((f) => (
            <details key={f.q.hi} className="glass group rounded-2xl p-5">
              <summary className="cursor-pointer list-none font-medium text-white marker:hidden">
                <span className="flex items-start justify-between gap-4">
                  {f.q.hi}
                  <span className="mt-1 text-gold-300 transition group-open:rotate-45">+</span>
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">{f.a.hi}</p>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">{f.a.en}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-[2rem] border border-gold-400/25 bg-gradient-to-r from-gold-400/12 via-mystic-700/20 to-cosmic-900/40 p-7 text-center sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-300/90">Personal Reading</p>
        <h2 className="mt-3 font-display text-3xl text-white">दिवाली 2026 का फल अपनी कुंडली से जानें</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">
          राशिफल हर राशि के लिए सामान्य होता है। जन्म तारीख, समय और स्थान से बनी आपकी कुंडली बताती है कि दिवाली के
          बाद धन, करियर और रिश्तों में क्या बदल सकता है — फ्री रीडिंग में राशि, नक्षत्र, लग्न और 12 क्षेत्र शामिल हैं।
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link href="/reading" className="btn-gold inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm">
            फ्री रीडिंग शुरू करें <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/pricing" className="inline-flex items-center gap-2 rounded-full border border-gold-400/40 px-6 py-3 text-sm text-gold-200 transition hover:border-gold-400/70 hover:text-gold-100">
            ₹51 Pro रिपोर्ट देखें
          </Link>
        </div>
      </section>

      <div className="mt-10 flex justify-center">
        <ShareRow
          path="/diwali-2026"
          text="Diwali 2026 Rashifal — 8 November, 12 rashiyon ka fal, muhurat aur upay. Hast Rekha AI"
        />
      </div>

      <p className="mt-12 text-center text-xs leading-relaxed text-slate-500">
        यह पेज मनोरंजन और आत्म-चिंतन के लिए है। यह चिकित्सा, कानूनी या वित्तीय सलाह नहीं है।
      </p>
    </div>
  );
}
