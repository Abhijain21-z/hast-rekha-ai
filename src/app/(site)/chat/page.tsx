import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { ArrowRight, Crown, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";
import AstrologyChat from "@/components/chat/AstrologyChat";
import PanditjiAvatar from "@/components/chat/PanditjiAvatar";
import { getChatConfig } from "@/lib/ai-chat";
import { PREMIUM_PRICE } from "@/lib/premium";
import { SITE_URL } from "@/lib/site";

export type ChatSearchParams = Promise<Record<string, string | string[] | undefined>>;

const OG_IMAGE = "/images/hand.png";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: ChatSearchParams;
}): Promise<Metadata> {
  const sp = await searchParams;
  const en = sp.lang === "en";
  const url = `${SITE_URL}/chat`;
  const canonical = en ? `${url}?lang=en` : url;

  const title = en
    ? "AI Astrologer Chat — Ask About Your Kundli & Rashifal | Hast Rekha AI"
    : "AI ज्योतिषी चैट — अपनी कुंडली और राशिफल से जुड़े सवाल पूछें | हस्त रेखा AI";
  const description = en
    ? "Chat with Hast Rekha AI's Vedic astrology guide. Ask about your Moon sign, career, love, rashifal or a simple remedy — answers use the chart in your free reading."
    : "हस्त रेखा AI के वैदिक ज्योतिषी से चैट करें। अपनी चंद्र राशि, करियर, प्रेम, राशिफल या आसान उपाय के बारे में पूछें — उत्तर आपकी मुफ़्त रीडिंग की कुंडली से मिलते हैं।";

  return {
    title,
    description,
    keywords: [
      "AI astrologer",
      "AI jyotishi",
      "kundli chat",
      "rashifal chat",
      "vedic astrology chat",
      "hast rekha ai chat",
      "एआई ज्योतिषी",
      "कुंडली चैट",
    ],
    alternates: {
      canonical,
      languages: {
        "hi-IN": url,
        "en-IN": `${url}?lang=en`,
        "x-default": url,
      },
    },
    openGraph: {
      type: "website",
      url: canonical,
      title,
      description,
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Hast Rekha AI — AI Astrologer Chat" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE],
    },
  };
}

const UI = {
  eyebrow: { en: "AI Jyotishi · Vedic guidance", hi: "AI ज्योतिषी · वैदिक मार्गदर्शन" },
  h1: { en: "Chat with Hastrekha Panditji", hi: "हस्तरेखा पंडितजी से चैट करें" },
  sub: {
    en: "A calm, private chat for the questions that a general rashifal cannot answer. If you open it from your report, Panditji reads your Moon sign, Nakshatra and Lagna — not a generic sun-sign feed.",
    hi: "वे सवाल जो सामान्य राशिफल का जवाब नहीं देता, उनके लिए एक शांत, निजी चैट। रिपोर्ट से खोलें तो पंडितजी आपकी चंद्र राशि, नक्षत्र और लग्न पढ़ते हैं — कोई सामान्य सूर्य-राशि वाला राशिफल नहीं।",
  },
  readingCta: { en: "Start a free reading first", hi: "पहले मुफ़्त रीडिंग शुरू करें" },
  planTitle: { en: "Chat pricing", hi: "चैट शुल्क" },
  freePlan: { en: "Free / guest", hi: "फ्री / गेस्ट" },
  freePlanValue: { en: "50 free coins", hi: "50 मुफ़्त कॉइन" },
  freePlanNote: {
    en: "10 coins per message. About 5 free messages; no payment or card needed.",
    hi: "हर मैसेज पर 10 कॉइन। लगभग 5 मुफ़्त मैसेज; कोई भुगतान या कार्ड नहीं।",
  },
  proPlan: { en: "Pro plan", hi: "प्रो प्लान" },
  proPlanValue: { en: "50 messages", hi: "50 मैसेज" },
  proPlanNote: {
    en: `50 chat messages included with the ₹${PREMIUM_PRICE} Pro report, along with the 5-year roadmap and PDF.`,
    hi: `₹${PREMIUM_PRICE} की Pro रिपोर्ट के साथ 50 चैट मैसेज, 5 साल के रोडमैप और PDF सहित।`,
  },
  planSeparate: {
    en: "Pro messages are used first. Coins are charged only after them.",
    hi: "पहले प्रो मैसेज इस्तेमाल होते हैं। उनके बाद ही कॉइन कटते हैं।",
  },
  planCta: { en: "See Pro plan", hi: "प्रो प्लान देखें" },
  sideTitle: { en: "What you can ask", hi: "आप क्या पूछ सकते हैं" },
  questions: [
    { en: "What does my Moon sign say about my career?", hi: "मेरी चंद्र राशि करियर के बारे में क्या कहती है?" },
    { en: "How can I handle a difficult phase this week?", hi: "इस हफ़्ते कठिन दौर को कैसे संभालूँ?" },
    { en: "Which simple upay fits my chart?", hi: "मेरी कुंडली के लिए कौन सा आसान उपाय सही है?" },
    { en: "What should I keep in mind for love?", hi: "प्रेम के बारे में मुझे क्या ध्यान रखना चाहिए?" },
  ],
  privacyTitle: { en: "Private by design", hi: "निजता पहले" },
  privacy: [
    { en: "No name, birth date, phone or palm photo is sent to the AI provider.", hi: "AI provider को नाम, जन्म तिथि, फ़ोन या हथेली की फ़ोटो नहीं भेजी जाती।" },
    { en: "Only a short chart summary and your question are used to answer.", hi: "उत्तर देने के लिए सिर्फ़ छोटा कुंडली सारांश और आपका सवाल इस्तेमाल होता है।" },
    { en: "Chat is not stored in our database; refresh to clear it.", hi: "चैट हमारे database में सहेजी नहीं जाती; refresh करने पर मिट जाती है।" },
  ],
  safetyTitle: { en: "A guide, not a guarantee", hi: "मार्गदर्शक, गारंटी नहीं" },
  safety: {
    en: "AI replies can be wrong. This chat does not replace medical, legal, financial or mental-health advice, and it will not predict death or guarantee outcomes. Use it for reflection and entertainment.",
    hi: "AI के उत्तर गलत भी हो सकते हैं। यह चैट चिकित्सा, कानूनी, वित्तीय या मानसिक स्वास्थ्य सलाह का विकल्प नहीं है, और मृत्यु की भविष्यवाणी या परिणामों की गारंटी नहीं देती। इसे आत्मचिंतन और मनोरंजन के लिए उपयोग करें।",
  },
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function ChatPage({ searchParams }: { searchParams: ChatSearchParams }) {
  const sp = await searchParams;
  const raw = typeof sp.reading === "string" ? sp.reading.trim() : "";
  const readingId = UUID.test(raw) ? raw : undefined;
  const cookieLang = (await cookies()).get("hr_lang")?.value;
  const en = sp.lang === "en" || (sp.lang !== "hi" && cookieLang === "en");
  const L = (v: { en: string; hi: string }) => (en ? v.en : v.hi);

  return (
    <div className="relative">
      <section className="mx-auto max-w-4xl px-4 pt-16 text-center sm:px-6 lg:px-8">
        <div className="mx-auto mb-5 flex justify-center">
          <div className="relative">
            <div className="absolute inset-2 rounded-full bg-gold-400/20 blur-2xl" />
            <PanditjiAvatar size={124} className="relative drop-shadow-[0_14px_38px_rgba(251,191,36,0.22)]" />
          </div>
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400/90">
          {L(UI.eyebrow)}
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-white sm:text-5xl">
          {L(UI.h1)}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-300/90">{L(UI.sub)}</p>
        {!readingId && (
          <Link
            href="/reading"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-gold-400/40 bg-gold-400/10 px-5 py-2.5 text-sm text-gold-200 transition hover:border-gold-400/70 hover:bg-gold-400/15"
          >
            <Sparkles className="h-4 w-4" /> {L(UI.readingCta)} <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </section>

      <section className="mx-auto mt-10 max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid items-start gap-6 lg:grid-cols-[1.55fr_0.75fr]">
          <AstrologyChat readingId={readingId} configured={getChatConfig().configured} />

          <aside className="space-y-5">
            <div className="rounded-3xl border border-gold-400/30 bg-gradient-to-br from-gold-400/12 via-cosmic-900/60 to-mystic-700/20 p-5 sm:p-6">
              <p className="flex items-center gap-2 text-sm font-semibold text-white">
                <Crown className="h-4 w-4 text-gold-300" /> {L(UI.planTitle)}
              </p>
              <div className="mt-4 space-y-3">
                <div className="rounded-2xl border border-emerald-300/20 bg-emerald-400/[0.06] p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-emerald-200">
                      {L(UI.freePlan)}
                    </span>
                    <span className="text-sm font-semibold text-white">{L(UI.freePlanValue)}</span>
                  </div>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-400">{L(UI.freePlanNote)}</p>
                </div>
                <div className="rounded-2xl border border-gold-400/25 bg-gold-400/[0.07] p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gold-200">
                      {L(UI.proPlan)}
                    </span>
                    <span className="text-sm font-semibold text-white">{L(UI.proPlanValue)}</span>
                  </div>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-400">{L(UI.proPlanNote)}</p>
                </div>
              </div>
              <p className="mt-3 text-[11px] leading-relaxed text-slate-400">{L(UI.planSeparate)}</p>
              <Link
                href="/pricing"
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full border border-gold-400/40 bg-gold-400/10 px-4 py-2.5 text-sm text-gold-200 transition hover:border-gold-400/70 hover:bg-gold-400/15"
              >
                {L(UI.planCta)} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="glass rounded-3xl p-5 sm:p-6">
              <p className="flex items-center gap-2 text-sm font-semibold text-white">
                <MessageCircle className="h-4 w-4 text-gold-300" /> {L(UI.sideTitle)}
              </p>
              <ul className="mt-4 space-y-3">
                {UI.questions.map((q) => (
                  <li key={q.en} className="flex items-start gap-2 text-sm leading-relaxed text-slate-300">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-400/80" />
                    {L(q)}
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass rounded-3xl p-5 sm:p-6">
              <p className="flex items-center gap-2 text-sm font-semibold text-white">
                <ShieldCheck className="h-4 w-4 text-emerald-300" /> {L(UI.privacyTitle)}
              </p>
              <ul className="mt-4 space-y-3">
                {UI.privacy.map((item) => (
                  <li key={item.en} className="text-xs leading-relaxed text-slate-400">
                    {L(item)}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-rose-400/20 bg-rose-400/[0.05] p-5 sm:p-6">
              <p className="text-sm font-semibold text-rose-200">{L(UI.safetyTitle)}</p>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">{L(UI.safety)}</p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
