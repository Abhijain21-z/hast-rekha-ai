"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowRight, Coins, Crown, Loader2, MessageCircle, Send, Sparkles } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import { Button, Input, cn } from "@/components/ui";
import { chatQuotaHelpUrl } from "@/lib/support";
import {
  affordableMinutes,
  chatNeedsCoins,
  type ChatBillingSummary,
} from "@/lib/chat-billing-rules";
import PanditjiAvatar from "./PanditjiAvatar";

type Role = "user" | "assistant";
interface Message {
  role: Role;
  content: string;
}

const UI = {
  eyebrow: { en: "AI Jyotishi · Vedic guidance", hi: "AI ज्योतिषी · वैदिक मार्गदर्शन" },
  title: { en: "Hastrekha Panditji", hi: "हस्तरेखा पंडितजी" },
  sub: {
    en: "Ask about your rashifal, career, love, remedies or the chart in your report.",
    hi: "अपने राशिफल, करियर, प्रेम, उपाय या रिपोर्ट की कुंडली के बारे में पूछें।",
  },
  withReading: {
    en: "Connected to this reading's Moon sign, Nakshatra and Lagna.",
    hi: "इस रीडिंग की चंद्र राशि, नक्षत्र और लग्न से जुड़ा हुआ।",
  },
  greeting: {
    en: "Namaste 🙏 I am Hastrekha Panditji, your AI Jyotishi. Ask me anything about your chart, today's rashifal, career, relationships or a simple remedy. I answer from the details in your report — not from guesswork.",
    hi: "नमस्ते 🙏 मैं हस्तरेखा पंडितजी हूँ, आपका AI ज्योतिषी। अपनी कुंडली, आज के राशिफल, करियर, रिश्तों या किसी आसान उपाय के बारे में पूछें। मैं आपकी रिपोर्ट के विवरण से उत्तर देता हूँ — अंदाज़े से नहीं।",
  },
  genericGreeting: {
    en: "Namaste 🙏 I am Hastrekha Panditji, your AI Jyotishi. Ask me about your rashi, career, love or a traditional remedy. For a personalised answer, start a free reading and open this chat from your report.",
    hi: "नमस्ते 🙏 मैं हस्तरेखा पंडितजी हूँ, आपका AI ज्योतिषी। अपनी राशि, करियर, प्रेम या पारंपरिक उपाय के बारे में पूछें। व्यक्तिगत उत्तर के लिए मुफ़्त रीडिंग बनाएँ और रिपोर्ट से यह चैट खोलें।",
  },
  placeholder: { en: "Ask Panditji about your chart…", hi: "पंडितजी से अपनी कुंडली के बारे में पूछें…" },
  send: { en: "Send", hi: "भेजें" },
  thinking: { en: "Reading your chart…", hi: "आपकी कुंडली देखी जा रही है…" },
  suggestions: [
    { en: "What does my Moon sign say about my career?", hi: "मेरी चंद्र राशि करियर के बारे में क्या कहती है?" },
    { en: "Which simple remedy suits me?", hi: "मेरे लिए कौन सा आसान उपाय सही है?" },
    { en: "What should I focus on this week?", hi: "इस हफ़्ते मुझे किस पर ध्यान देना चाहिए?" },
  ],
  privacy: {
    en: "Your question and a limited chart summary are sent to our AI provider. Your name, birth date/time/place, phone and palm photo are not sent. Chat is not saved in our database.",
    hi: "आपका सवाल और सीमित कुंडली सारांश हमारे AI provider को भेजा जाता है। नाम, जन्म तिथि/समय/स्थान, फ़ोन और हथेली की फ़ोटो नहीं भेजी जाती। चैट हमारे database में सहेजी नहीं जाती।",
  },
  disclaimer: {
    en: "AI guidance for reflection and entertainment only. It can be wrong. No medical, legal or financial advice.",
    hi: "AI मार्गदर्शन केवल आत्मचिंतन और मनोरंजन के लिए। यह गलत भी हो सकता है। चिकित्सा, कानूनी या वित्तीय सलाह नहीं।",
  },
  notConfigured: {
    en: "The AI chat is being configured right now. Please use your free reading and rashifal until it is switched on.",
    hi: "AI चैट अभी configure हो रही है। चालू होने तक अपनी मुफ़्त रीडिंग और राशिफल देखें।",
  },
  billingUnavailable: {
    en: "The coin meter is busy right now. Please try again in a moment.",
    hi: "कॉइन मीटर अभी व्यस्त है। कृपया थोड़ी देर बाद फिर कोशिश करें।",
  },
  rateLimited: {
    en: "You have asked a lot in a short time. Please wait a few minutes and try again.",
    hi: "आपने कम समय में बहुत सवाल पूछे हैं। कृपया कुछ मिनट रुककर फिर कोशिश करें।",
  },
  failed: {
    en: "Could not get a reply just now. Please try again in a moment.",
    hi: "अभी उत्तर नहीं मिल सका। कृपया थोड़ी देर बाद फिर कोशिश करें।",
  },
  checking: { en: "Checking your coin balance…", hi: "आपका कॉइन बैलेंस देखा जा रहा है…" },
  freePlan: { en: "Free", hi: "फ्री" },
  proPlan: { en: "Pro", hi: "प्रो" },
  activeMinute: { en: "This minute is active", hi: "यह मिनट चालू है" },
  coinsLine: {
    en: "{n} coins · 10 coins per started minute",
    hi: "{n} कॉइन · हर शुरू हुए मिनट पर 10 कॉइन",
  },
  minutesAffordable: {
    en: "About {n} min left",
    hi: "लगभग {n} मिनट बाकी",
  },
  proLeft: {
    en: "{n} of 50 Pro minutes left",
    hi: "50 में से {n} प्रो मिनट बाकी",
  },
  proDone: {
    en: "50 Pro minutes complete · now 10 coins/min",
    hi: "50 प्रो मिनट पूरे · अब 10 कॉइन/मिनट",
  },
  outOfCoinsTitle: { en: "Your chat coins are used up", hi: "आपके चैट कॉइन पूरे हो गए" },
  proMinutesTitle: { en: "Your 50 Pro minutes are complete", hi: "आपके 50 प्रो मिनट पूरे हो गए" },
  outOfCoinsSignedIn: {
    en: "Chat costs 10 coins per started minute. Your balance and usage are in the dashboard — if you run out, message our team and we will help.",
    hi: "चैट पर हर शुरू हुए मिनट के 10 कॉइन लगते हैं। आपका बैलेंस और उपयोग डैशबोर्ड में है — कॉइन ख़त्म हों तो हमारी टीम को संदेश भेजें, हम मदद करेंगे।",
  },
  outOfCoinsGuest: {
    en: "Chat costs 10 coins per started minute. Create a free account and get 50 welcome coins — no card needed.",
    hi: "चैट पर हर शुरू हुए मिनट के 10 कॉइन लगते हैं। मुफ़्त अकाउंट बनाएँ और 50 वेलकम कॉइन पाएँ — कार्ड की ज़रूरत नहीं।",
  },
  outOfCoinsPro: {
    en: "Your 50 included Pro minutes are done. Every new minute costs 10 coins. Check your balance in the dashboard, or message our team.",
    hi: "आपके 50 शामिल प्रो मिनट पूरे हो गए। हर नए मिनट पर 10 कॉइन लगेंगे। डैशबोर्ड में अपना बैलेंस देखें, या हमारी टीम को संदेश भेजें।",
  },
  walletCta: { en: "Open coin wallet", hi: "कॉइन वॉलेट खोलें" },
  registerCta: { en: "Create account · +50 coins", hi: "अकाउंट बनाएँ · +50 कॉइन" },
  supportCta: { en: "Chat with our team", hi: "हमारी टीम से बात करें" },
  proCta: { en: "See the Pro plan", hi: "प्रो प्लान देखें" },
  minuteNote: {
    en: "10 coins per started minute. A session ends after 2 idle minutes, so you are never charged while away.",
    hi: "हर शुरू हुए मिनट पर 10 कॉइन। 2 मिनट निष्क्रिय रहने पर सत्र बंद हो जाता है, इसलिए दूर रहने पर कॉइन नहीं कटते।",
  },
  newReading: { en: "Open your reading first", hi: "पहले अपनी रीडिंग खोलें" },
};

function publishCoins(billing: ChatBillingSummary | null) {
  if (!billing || typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("hr:coins", { detail: { balance: billing.coins } }));
}

export default function AstrologyChat({
  readingId,
  className,
  configured: initialConfigured = true,
}: {
  readingId?: string;
  className?: string;
  /** Server-side env check, so the input is not a dead end before launch. */
  configured?: boolean;
}) {
  const { L } = useLang();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [configured, setConfigured] = useState(initialConfigured);
  const [error, setError] = useState("");
  const [billing, setBilling] = useState<ChatBillingSummary | null>(null);
  const [billingLoading, setBillingLoading] = useState(true);
  const [blocked, setBlocked] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const listRef = useRef<HTMLDivElement>(null);
  // The greeting is rendered outside the message history, so switching
  // language updates it without touching the conversation.
  const greeting = L(readingId ? UI.greeting : UI.genericGreeting);
  const needsCoins = blocked || chatNeedsCoins(billing, now);

  const loadBilling = useCallback(
    async (signal?: AbortSignal) => {
      const query = readingId ? `?readingId=${encodeURIComponent(readingId)}` : "";
      try {
        const res = await fetch(`/api/chat/quota${query}`, {
          cache: "no-store",
          signal,
        });
        if (!res.ok) return;
        const data = (await res.json().catch(() => null)) as { billing?: ChatBillingSummary } | null;
        if (data?.billing) {
          setBilling(data.billing);
          publishCoins(data.billing);
          setBlocked(false);
        }
      } catch {
        /* the meter stays hidden; the send path still enforces the limit */
      } finally {
        setBillingLoading(false);
      }
    },
    [readingId],
  );

  useEffect(() => {
    const node = listRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [messages, sending]);

  useEffect(() => {
    const controller = new AbortController();
    // Billing is loaded from the server after mount; every setState inside
    // loadBilling runs after an await, never during the effect body.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadBilling(controller.signal);
    const onFocus = () => void loadBilling();
    window.addEventListener("focus", onFocus);
    return () => {
      controller.abort();
      window.removeEventListener("focus", onFocus);
    };
  }, [loadBilling]);

  // Keeps the "out of coins" state fresh after an idle session expires without
  // needing another server round trip.
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 15_000);
    return () => window.clearInterval(timer);
  }, []);

  async function sendMessage(text: string) {
    const content = text.trim();
    if (!content || sending || !configured || needsCoins) return;

    const next: Message[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setError("");
    setSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ readingId, messages: next.slice(-12) }),
      });

      if (res.status === 503) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        if (data?.error === "chat_billing_unavailable") {
          setError(L(UI.billingUnavailable));
        } else {
          setConfigured(false);
          setError(L(UI.notConfigured));
        }
        return;
      }
      if (res.status === 429) {
        setError(L(UI.rateLimited));
        return;
      }
      if (res.status === 402) {
        const data = (await res.json().catch(() => null)) as {
          billing?: ChatBillingSummary;
        } | null;
        if (data?.billing) {
          setBilling(data.billing);
          publishCoins(data.billing);
        }
        setBlocked(true);
        // Remove the optimistic bubble: the server did not answer this one.
        setMessages((current) => (current.length ? current.slice(0, -1) : current));
        return;
      }
      if (!res.ok) {
        setError(L(UI.failed));
        return;
      }

      const data = (await res.json()) as {
        reply?: string;
        billing?: ChatBillingSummary;
      };
      if (data.billing) {
        setBilling(data.billing);
        publishCoins(data.billing);
        setBlocked(false);
      }
      if (!data.reply) {
        setError(L(UI.failed));
        return;
      }
      setMessages((current) => [...current, { role: "assistant", content: data.reply as string }]);
    } catch {
      setError(L(UI.failed));
    } finally {
      setSending(false);
    }
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    void sendMessage(input);
  }

  const pro = billing?.plan === "pro";
  const includedLeft = billing?.includedMinutesLeft ?? 0;
  const showProBar = pro && billing !== null;
  const proDone = pro && includedLeft <= 0;

  return (
    <section
      className={cn(
        "overflow-hidden rounded-[2rem] border border-gold-400/25 bg-cosmic-950/80 shadow-2xl shadow-black/30 backdrop-blur-md",
        className,
      )}
    >
      <div className="border-b border-white/10 bg-gradient-to-r from-gold-400/12 via-mystic-600/15 to-transparent px-4 py-4 sm:px-6">
        <div className="flex items-start gap-3">
          <span className="shrink-0">
            <PanditjiAvatar size={48} decorative className="drop-shadow-[0_6px_18px_rgba(251,191,36,0.25)]" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gold-300/90">
              ✦ {L(UI.eyebrow)}
            </p>
            <h2 className="font-display text-xl text-white sm:text-2xl">{L(UI.title)}</h2>
            <p className="mt-1 text-xs leading-relaxed text-slate-400">{L(UI.sub)}</p>
            {readingId && <p className="mt-1 text-[11px] text-gold-200/80">{L(UI.withReading)}</p>}
          </div>
          <span className="hidden rounded-full border border-emerald-300/25 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-200 sm:inline">
            AI
          </span>
        </div>

        {billing && (
          <div className="mt-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-semibold uppercase tracking-wider",
                  pro
                    ? "border-gold-400/35 bg-gold-400/10 text-gold-200"
                    : "border-emerald-300/25 bg-emerald-400/10 text-emerald-200",
                )}
              >
                {pro ? <Crown className="h-3 w-3" /> : <Sparkles className="h-3 w-3" />}
                {L(pro ? UI.proPlan : UI.freePlan)}
              </span>
              <span className={cn(proDone && billing.coins < 10 ? "font-semibold text-rose-200" : "text-slate-300")}>
                {pro ? (
                  includedLeft > 0 ? (
                    L(UI.proLeft).replace("{n}", String(includedLeft))
                  ) : (
                    L(UI.proDone)
                  )
                ) : (
                  L(UI.coinsLine).replace("{n}", String(billing.coins))
                )}
              </span>
            </div>

            {showProBar ? (
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-gold-500 via-gold-300 to-gold-200 transition-all duration-500"
                  style={{ width: `${Math.round((includedLeft / 50) * 100)}%` }}
                />
              </div>
            ) : (
              <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-slate-500">
                <Coins className="h-3 w-3 text-gold-300/80" />
                {L(UI.minutesAffordable).replace(
                  "{n}",
                  String(affordableMinutes(billing)),
                )}
              </div>
            )}

            {billing.sessionActive && billing.sessionBilledMinutes > 0 && (
              <p className="mt-1.5 inline-flex items-center gap-1.5 text-[10px] font-medium text-emerald-200/90">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" />
                {L(UI.activeMinute)}
              </p>
            )}
          </div>
        )}
        {!billing && billingLoading && (
          <p className="mt-3 text-[11px] text-slate-500">{L(UI.checking)}</p>
        )}
      </div>

      <div
        ref={listRef}
        className="max-h-[460px] min-h-[340px] space-y-4 overflow-y-auto p-4 sm:p-6"
        aria-live="polite"
        aria-label={L(UI.title)}
      >
        <div className="flex justify-start gap-2.5">
          <span className="mt-0.5 shrink-0">
            <PanditjiAvatar size={32} decorative />
          </span>
          <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-bl-md border border-white/8 bg-white/[0.055] px-4 py-3 text-sm leading-relaxed text-slate-100">
            {greeting}
          </div>
        </div>

        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={cn("flex gap-2.5", message.role === "user" ? "justify-end" : "justify-start")}
          >
            {message.role === "assistant" && (
              <span className="mt-0.5 shrink-0">
                <PanditjiAvatar size={32} decorative />
              </span>
            )}
            <div
              className={cn(
                "max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed",
                message.role === "user"
                  ? "rounded-br-md bg-gold-400/20 text-gold-50"
                  : "rounded-bl-md border border-white/8 bg-white/[0.055] text-slate-100",
              )}
            >
              {message.content}
            </div>
          </div>
        ))}

        {sending && (
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-gold-400/30 bg-gold-400/10">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-gold-300" />
            </span>
            <span className="rounded-2xl rounded-bl-md border border-white/8 bg-white/[0.055] px-4 py-3 text-sm text-slate-300">
              {L(UI.thinking)}
            </span>
          </div>
        )}
      </div>

      {messages.length === 0 && !needsCoins && (
        <div className="flex flex-wrap gap-2 px-4 pb-1 sm:px-6">
          {UI.suggestions.map((suggestion) => (
            <button
              key={suggestion.en}
              type="button"
              onClick={() => void sendMessage(L(suggestion))}
              disabled={sending || !configured}
              className="rounded-full border border-gold-400/25 bg-gold-400/[0.06] px-3 py-1.5 text-left text-xs text-gold-100 transition hover:border-gold-400/50 hover:bg-gold-400/10 disabled:opacity-50"
            >
              {L(suggestion)}
            </button>
          ))}
        </div>
      )}

      <div className="border-t border-white/10 p-4 sm:p-6">
        {needsCoins ? (
          <div className="rounded-2xl border border-gold-400/30 bg-gradient-to-br from-gold-400/12 via-cosmic-900/60 to-mystic-700/20 p-4 sm:p-5">
            <p className="flex items-center gap-2 font-display text-lg text-white">
              <Coins className="h-5 w-5 text-gold-300" />
              {L(proDone ? UI.proMinutesTitle : UI.outOfCoinsTitle)}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-slate-300">
              {L(
                proDone
                  ? UI.outOfCoinsPro
                  : billing?.signedIn
                    ? UI.outOfCoinsSignedIn
                    : UI.outOfCoinsGuest,
              )}
            </p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <Link
                href={billing?.signedIn ? "/dashboard#wallet" : "/register"}
                className="btn-gold inline-flex flex-1 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold"
              >
                <Coins className="h-4 w-4" />
                {L(billing?.signedIn ? UI.walletCta : UI.registerCta)}
                <ArrowRight className="h-4 w-4" />
              </Link>
              {proDone ? (
                <a
                  href={chatQuotaHelpUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm text-slate-200 transition hover:bg-white/10"
                >
                  <MessageCircle className="h-4 w-4" /> {L(UI.supportCta)}
                </a>
              ) : (
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm text-slate-200 transition hover:bg-white/10"
                >
                  <Crown className="h-4 w-4 text-gold-300" /> {L(UI.proCta)}
                </Link>
              )}
            </div>
          </div>
        ) : (
          <>
            {error && (
              <p className="mb-3 rounded-xl border border-rose-400/20 bg-rose-400/[0.06] px-3 py-2 text-xs leading-relaxed text-rose-200">
                {error}
              </p>
            )}
            <form onSubmit={submit} className="flex items-end gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value.slice(0, 1000))}
                placeholder={configured ? L(UI.placeholder) : L(UI.notConfigured)}
                disabled={!configured || sending}
                maxLength={1000}
                aria-label={L(UI.placeholder)}
                className="min-h-[46px] flex-1"
              />
              <Button
                type="submit"
                loading={sending}
                disabled={!configured || sending || !input.trim()}
                icon={!sending ? <Send className="h-4 w-4" /> : undefined}
                aria-label={L(UI.send)}
                className="h-[46px] shrink-0 px-5"
              >
                <span className="hidden sm:inline">{L(UI.send)}</span>
              </Button>
            </form>
            <p className="mt-2 text-[10px] leading-relaxed text-gold-200/70">{L(UI.minuteNote)}</p>
          </>
        )}

        <div className="mt-3 flex items-start gap-2 text-[11px] leading-relaxed text-slate-500">
          <MessageCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-300/70" />
          <p>{L(UI.privacy)}</p>
        </div>
        <p className="mt-2 text-center text-[11px] italic text-slate-500">{L(UI.disclaimer)}</p>
      </div>
    </section>
  );
}
