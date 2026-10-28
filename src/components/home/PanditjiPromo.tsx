"use client";

import Link from "next/link";
import { ArrowRight, Crown, MessageCircle, Sparkles } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import PanditjiAvatar from "@/components/chat/PanditjiAvatar";

const UI = {
  eyebrow: { en: "AI Jyotishi · Vedic guidance", hi: "AI ज्योतिषी · वैदिक मार्गदर्शन" },
  title: { en: "Hastrekha Panditji", hi: "हस्तरेखा पंडितजी" },
  sub: {
    en: "Click to chat with Panditji",
    hi: "Panditji se chat karne ke liye click karein",
  },
  body: {
    en: "Ask about your kundli, career, love or a simple upay. Panditji reads your Moon sign, Nakshatra and Lagna — in Hindi or English.",
    hi: "अपनी कुंडली, करियर, प्रेम या आसान उपाय के बारे में पूछें। पंडितजी आपकी चंद्र राशि, नक्षत्र और लग्न पढ़ते हैं — हिंदी या English में।",
  },
  cta: { en: "Chat with Panditji", hi: "पंडितजी से बात करें" },
  reading: { en: "Start a free reading", hi: "मुफ़्त रीडिंग शुरू करें" },
  free: { en: "50 free coins on signup", hi: "साइनअप पर 50 मुफ़्त कॉइन" },
  pro: { en: "Pro: 200 AI tokens", hi: "प्रो: 200 AI टोकन" },
  ai: { en: "AI-powered · private", hi: "AI-powered · निजी" },
  bubble: { en: "Namaste 🙏 Ask me anything", hi: "नमस्ते 🙏 कुछ भी पूछें" },
};

export default function PanditjiPromo() {
  const { L } = useLang();

  return (
    <section className="relative py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-gold-400/35 bg-gradient-to-br from-gold-400/14 via-cosmic-900/85 to-mystic-700/25 p-6 shadow-2xl shadow-black/30 sm:p-10">
          <div className="mandala-bg pointer-events-none absolute inset-0 opacity-50" />
          <div className="pointer-events-none absolute -left-16 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-gold-400/15 blur-3xl" />
          <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-mystic-500/20 blur-3xl" />

          <div className="relative grid items-center gap-8 md:grid-cols-[0.82fr_1.18fr]">
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-[8%] animate-pulse rounded-full bg-gold-400/20 blur-2xl" />
                <PanditjiAvatar size={248} className="relative drop-shadow-[0_18px_45px_rgba(251,191,36,0.22)]" />
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-gold-400/40 bg-cosmic-950/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-200 shadow-lg">
                  {L(UI.ai)}
                </span>
              </div>
            </div>

            <div className="text-center md:text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400/90">
                ✦ {L(UI.eyebrow)}
              </p>
              <h2 className="mt-2 font-display text-3xl font-semibold text-white sm:text-4xl">
                {L(UI.title)}
              </h2>
              <p className="mt-3 text-lg font-semibold text-gold-200">{L(UI.sub)}</p>
              <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-slate-300 md:mx-0">
                {L(UI.body)}
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center md:justify-start">
                <Link href="/chat" className="btn-gold inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm">
                  <MessageCircle className="h-4 w-4" /> {L(UI.cta)} <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/reading"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm text-slate-100 transition hover:border-gold-400/50 hover:text-gold-200"
                >
                  <Sparkles className="h-4 w-4" /> {L(UI.reading)}
                </Link>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-slate-400 md:justify-start">
                <span className="inline-flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-300" /> {L(UI.free)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Crown className="h-3.5 w-3.5 text-gold-300" /> {L(UI.pro)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MessageCircle className="h-3.5 w-3.5 text-mystic-300" /> {L(UI.bubble)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
