"use client";

import { useMemo, useState } from "react";
import { Check, Copy, Download, MessageCircle, Search } from "lucide-react";
import { buildProFollowUpMessage, buildWhatsAppChatUrl } from "@/lib/outreach";

export interface FreeReader {
  id: string;
  name: string;
  phone: string;
  createdAt: string | null;
  marketingOptIn: boolean;
  followupSentAt: string | null;
}

type Filter = "pending" | "all" | "sent";

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const day = String(d.getUTCDate()).padStart(2, "0");
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  return `${day}/${month}/${d.getUTCFullYear()}`;
}

export default function OutreachTable({
  readers,
  adminKey,
}: {
  readers: FreeReader[];
  adminKey: string;
}) {
  const [filter, setFilter] = useState<Filter>("pending");
  const [query, setQuery] = useState("");
  const [sent, setSent] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(readers.filter((r) => r.followupSentAt).map((r) => [r.id, true])),
  );
  const [copied, setCopied] = useState<string | null>(null);

  const stats = useMemo(() => {
    const total = readers.length;
    const done = readers.filter((r) => sent[r.id]).length;
    const optedIn = readers.filter((r) => r.marketingOptIn).length;
    return { total, done, pending: total - done, optedIn };
  }, [readers, sent]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return readers.filter((r) => {
      if (filter === "pending" && sent[r.id]) return false;
      if (filter === "sent" && !sent[r.id]) return false;
      if (!q) return true;
      return r.name.toLowerCase().includes(q) || r.phone.includes(q);
    });
  }, [readers, sent, filter, query]);

  async function markSent(id: string) {
    setSent((prev) => ({ ...prev, [id]: true }));
    try {
      await fetch("/api/admin/mark-followup", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
        body: JSON.stringify({ id }),
      });
    } catch {
      // The owner still sent the message; the badge is only a convenience.
    }
  }

  async function copyPhone(reader: FreeReader) {
    try {
      await navigator.clipboard.writeText(reader.phone);
      setCopied(reader.id);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      setCopied(null);
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="mb-6">
        <p className="text-xs uppercase tracking-[0.2em] text-gold-300/80">Owner dashboard</p>
        <h1 className="mt-2 font-display text-2xl text-white sm:text-3xl">
          फ्री यूज़र्स — WhatsApp फॉलो-अप
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300">
          नीचे हर वो यूज़र है जिसने रीडिंग ली पर Pro नहीं खरीदा। हरे बटन पर क्लिक करें — WhatsApp
          खुलेगा और प्लान की पूरी जानकारी + लिंक पहले से लिखा होगा। सिर्फ़ <b>Send</b> दबाना है।
        </p>
      </header>

      <section className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="कुल फ्री यूज़र" value={stats.total} tone="slate" />
        <Stat label="मैसेज बाकी" value={stats.pending} tone="gold" />
        <Stat label="भेज दिया" value={stats.done} tone="emerald" />
        <Stat label="मार्केटिंग सहमति" value={stats.optedIn} tone="mystic" />
      </section>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["pending", "बाकी"],
              ["sent", "भेजे गए"],
              ["all", "सभी"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              className={`rounded-full border px-4 py-1.5 text-xs transition ${
                filter === value
                  ? "border-gold-400/60 bg-gold-400/15 text-gold-100"
                  : "border-white/10 text-slate-300 hover:border-white/25"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="नाम या नंबर खोजें"
              className="w-full rounded-full border border-white/15 bg-cosmic-900/70 py-2 pl-9 pr-3 text-sm text-white placeholder:text-slate-500 focus:border-gold-400/60 focus:outline-none"
            />
          </div>
          <a
            href={`/api/admin/export-free-users?format=csv&key=${encodeURIComponent(adminKey)}`}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs text-slate-200 transition hover:border-gold-400/50 hover:text-gold-200"
          >
            <Download className="h-4 w-4" /> CSV
          </a>
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center text-sm text-slate-300">
          {readers.length === 0
            ? "अभी कोई फ्री यूज़र सेव नहीं हुआ है।"
            : "इस फ़िल्टर में कोई यूज़र नहीं है।"}
        </div>
      ) : (
        <ul className="space-y-3">
          {visible.map((reader) => {
            const message = buildProFollowUpMessage(reader.name);
            const waUrl = buildWhatsAppChatUrl(reader.phone, message);
            const isSent = Boolean(sent[reader.id]);
            return (
              <li
                key={reader.id}
                className="glass flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate font-display text-base text-white">{reader.name}</p>
                    {isSent && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/15 px-2 py-0.5 text-[10px] text-emerald-300">
                        <Check className="h-3 w-3" /> भेज दिया
                      </span>
                    )}
                    {!reader.marketingOptIn && (
                      <span className="rounded-full bg-rose-400/15 px-2 py-0.5 text-[10px] text-rose-300">
                        सहमति नहीं
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-slate-300">
                    +91 {reader.phone}
                    <span className="mx-2 text-slate-600">•</span>
                    <span className="text-slate-400">{formatDate(reader.createdAt)}</span>
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => copyPhone(reader)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-2 text-xs text-slate-300 transition hover:border-white/30"
                    aria-label="नंबर कॉपी करें"
                  >
                    {copied === reader.id ? (
                      <Check className="h-4 w-4 text-emerald-300" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => void markSent(reader.id)}
                    className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-emerald-900/30 transition hover:bg-emerald-400"
                  >
                    <MessageCircle className="h-4 w-4" /> WhatsApp
                  </a>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "slate" | "gold" | "emerald" | "mystic";
}) {
  const toneClass = {
    slate: "text-slate-100 border-white/10",
    gold: "text-gold-200 border-gold-400/40",
    emerald: "text-emerald-300 border-emerald-400/40",
    mystic: "text-mystic-300 border-mystic-400/40",
  }[tone];

  return (
    <div className={`glass rounded-2xl border p-4 ${toneClass}`}>
      <p className="font-display text-2xl leading-none">{value}</p>
      <p className="mt-1 text-[11px] text-slate-400">{label}</p>
    </div>
  );
}
