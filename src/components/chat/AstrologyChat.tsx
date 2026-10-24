"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Loader2, MessageCircle, Send, Sparkles } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import { Button, Input, cn } from "@/components/ui";

type Role = "user" | "assistant";
interface Message {
  role: Role;
  content: string;
}

const UI = {
  eyebrow: { en: "Ask the AI Jyotishi", hi: "AI ज्योतिषी से पूछें" },
  title: { en: "Your personal astrology chat", hi: "आपकी निजी ज्योतिष चर्चा" },
  sub: {
    en: "Ask about your rashifal, career, love, remedies or the chart in your report.",
    hi: "अपने राशिफल, करियर, प्रेम, उपाय या रिपोर्ट की कुंडली के बारे में पूछें।",
  },
  withReading: {
    en: "Connected to this reading's Moon sign, Nakshatra and Lagna.",
    hi: "इस रीडिंग की चंद्र राशि, नक्षत्र और लग्न से जुड़ा हुआ।",
  },
  greeting: {
    en: "Namaste 🙏 I am your AI Jyotishi. Ask me anything about your chart, today's rashifal, career, relationships or a simple remedy. I answer from the details in your report — not from guesswork.",
    hi: "नमस्ते 🙏 मैं आपका AI ज्योतिषी हूँ। अपनी कुंडली, आज के राशिफल, करियर, रिश्तों या किसी आसान उपाय के बारे में पूछें। मैं आपकी रिपोर्ट के विवरण से उत्तर देता हूँ — अंदाज़े से नहीं।",
  },
  genericGreeting: {
    en: "Namaste 🙏 I am Hast Rekha AI's Jyotishi. Ask me about your rashi, career, love or a traditional remedy. For a personalised answer, start a free reading and open this chat from your report.",
    hi: "नमस्ते 🙏 मैं हस्त रेखा AI का ज्योतिषी हूँ। अपनी राशि, करियर, प्रेम या पारंपरिक उपाय के बारे में पूछें। व्यक्तिगत उत्तर के लिए मुफ़्त रीडिंग बनाएँ और रिपोर्ट से यह चैट खोलें।",
  },
  placeholder: { en: "Ask about your chart…", hi: "अपनी कुंडली के बारे में पूछें…" },
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
  rateLimited: {
    en: "You have asked a lot in a short time. Please wait a few minutes and try again.",
    hi: "आपने कम समय में बहुत सवाल पूछे हैं। कृपया कुछ मिनट रुककर फिर कोशिश करें।",
  },
  failed: {
    en: "Could not get a reply just now. Please try again in a moment.",
    hi: "अभी उत्तर नहीं मिल सका। कृपया थोड़ी देर बाद फिर कोशिश करें।",
  },
  newReading: { en: "Open your reading first", hi: "पहले अपनी रीडिंग खोलें" },
};

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
  const listRef = useRef<HTMLDivElement>(null);
  // The greeting is rendered outside the message history, so switching
  // language updates it without touching the conversation.
  const greeting = L(readingId ? UI.greeting : UI.genericGreeting);

  useEffect(() => {
    const node = listRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [messages, sending]);

  async function sendMessage(text: string) {
    const content = text.trim();
    if (!content || sending || !configured) return;

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
        setConfigured(false);
        setError(L(UI.notConfigured));
        return;
      }
      if (res.status === 429) {
        setError(L(UI.rateLimited));
        return;
      }
      if (!res.ok) {
        setError(L(UI.failed));
        return;
      }

      const data = (await res.json()) as { reply?: string };
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

  return (
    <section
      className={cn(
        "overflow-hidden rounded-[2rem] border border-gold-400/25 bg-cosmic-950/80 shadow-2xl shadow-black/30 backdrop-blur-md",
        className,
      )}
    >
      <div className="border-b border-white/10 bg-gradient-to-r from-gold-400/12 via-mystic-600/15 to-transparent px-4 py-4 sm:px-6">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-gold-400/35 bg-gold-400/10">
            <Sparkles className="h-5 w-5 text-gold-300" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gold-300/90">
              {L(UI.eyebrow)}
            </p>
            <h2 className="font-display text-xl text-white sm:text-2xl">{L(UI.title)}</h2>
            <p className="mt-1 text-xs leading-relaxed text-slate-400">{L(UI.sub)}</p>
            {readingId && <p className="mt-1 text-[11px] text-gold-200/80">{L(UI.withReading)}</p>}
          </div>
          <span className="hidden rounded-full border border-emerald-300/25 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-200 sm:inline">
            AI
          </span>
        </div>
      </div>

      <div
        ref={listRef}
        className="max-h-[460px] min-h-[340px] space-y-4 overflow-y-auto p-4 sm:p-6"
        aria-live="polite"
        aria-label={L(UI.title)}
      >
        <div className="flex justify-start gap-2.5">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold-400/30 bg-gold-400/10">
            <Sparkles className="h-3.5 w-3.5 text-gold-300" />
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
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold-400/30 bg-gold-400/10">
                <Sparkles className="h-3.5 w-3.5 text-gold-300" />
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

      {messages.length === 0 && (
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

        <div className="mt-3 flex items-start gap-2 text-[11px] leading-relaxed text-slate-500">
          <MessageCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-300/70" />
          <p>{L(UI.privacy)}</p>
        </div>
        <p className="mt-2 text-center text-[11px] italic text-slate-500">{L(UI.disclaimer)}</p>
      </div>
    </section>
  );
}
