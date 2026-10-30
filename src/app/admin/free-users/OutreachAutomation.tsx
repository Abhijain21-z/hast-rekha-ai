"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Loader2,
  RefreshCw,
  Send,
  Sheet,
} from "lucide-react";

interface Stats {
  total: number;
  optedIn: number;
  sent: number;
  pending: number;
}

interface LastSync {
  startedAt: string;
  finishedAt: string | null;
  rowCount: number;
  status: string;
  error: string | null;
}

function ist(iso: string | null): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

export default function OutreachAutomation({
  adminKey,
  stats,
  lastSync,
  sheetUrl,
  sheetConfigured,
}: {
  adminKey: string;
  stats: Stats;
  lastSync: LastSync | null;
  sheetUrl: string;
  sheetConfigured: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<"sync" | "send" | "dry" | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function call(label: "sync" | "send" | "dry", url: string, init?: RequestInit) {
    setBusy(label);
    setMessage(null);
    setError(null);
    try {
      const res = await fetch(url, {
        ...init,
        headers: {
          ...(init?.headers ?? {}),
          "x-admin-key": adminKey,
          "Cache-Control": "no-store",
        },
      });
      const data = (await res.json().catch(() => null)) as
        | (Record<string, unknown> & { error?: string; configured?: boolean })
        | null;
      if (!res.ok) {
        throw new Error(data?.error || `Request failed (${res.status})`);
      }
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
      return null;
    } finally {
      setBusy(null);
    }
  }

  async function syncSheet() {
    const data = await call("sync", "/api/admin/sync-free-users", { method: "POST" });
    if (!data) return;
    if (data.ok) {
      setMessage(`Google Sheet updated — ${data.rowCount ?? 0} rows.`);
    } else if (data.configured === false) {
      setError("Google Sheet webhook abhi connect nahi hai. Setup steps follow karein.");
    } else {
      setError(String(data.error || "Sheet sync failed."));
    }
    router.refresh();
  }

  async function sendWhatsApp(dryRun: boolean) {
    const url = `/api/whatsapp/follow-up-pro?limit=50${dryRun ? "&dryRun=1" : ""}`;
    const data = await call(dryRun ? "dry" : "send", url);
    if (!data) return;

    if (dryRun) {
      setMessage(`Dry run: ${data.total ?? 0} eligible readers. Koi message nahi bheja.`);
    } else {
      const errors = Number(data.errors ?? 0);
      setMessage(
        `WhatsApp: ${data.sent ?? 0} sent, ${errors} errors, ${data.skipped ?? 0} skipped.`,
      );
      if (errors > 0) setError("Kuch messages fail hue — details Vercel logs me hain.");
    }
    router.refresh();
  }

  return (
    <section className="mb-6 rounded-3xl border border-gold-400/25 bg-gradient-to-br from-gold-400/[0.08] via-cosmic-900/80 to-mystic-700/20 p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold-300/90">
            <Sheet className="h-4 w-4" /> Automatic outreach
          </p>
          <h2 className="mt-2 font-display text-xl text-white">Google Sheet + WhatsApp</h2>
          <p className="mt-1 max-w-2xl text-xs leading-relaxed text-slate-300">
            रोज़ सुबह 9 बजे (IST) पूरा free-user data Google Sheet में sync होता है और अगले
            eligible readers को approved WhatsApp template जाता है. नीचे से manual run भी कर सकते हैं.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void syncSheet()}
            disabled={busy !== null}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-xs font-medium text-slate-100 transition hover:border-gold-400/50 hover:text-gold-200 disabled:opacity-50"
          >
            {busy === "sync" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Sheet sync
          </button>
          <button
            type="button"
            onClick={() => void sendWhatsApp(true)}
            disabled={busy !== null}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-medium text-slate-100 transition hover:border-white/30 disabled:opacity-50"
          >
            {busy === "dry" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            Dry run
          </button>
          <button
            type="button"
            onClick={() => void sendWhatsApp(false)}
            disabled={busy !== null}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-emerald-900/30 transition hover:bg-emerald-400 disabled:opacity-50"
          >
            {busy === "send" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            WhatsApp bhejein (50)
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MiniStat label="कुल फ्री यूज़र" value={stats.total} />
        <MiniStat label="मार्केटिंग सहमति" value={stats.optedIn} />
        <MiniStat label="भेज दिया" value={stats.sent} />
        <MiniStat label="बाकी" value={stats.pending} />
      </div>

      <div className="mt-4 flex flex-col gap-2 rounded-2xl border border-white/10 bg-cosmic-950/50 p-3 text-xs text-slate-300 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-400">Google Sheet:</span>
          {sheetConfigured ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/15 px-2 py-0.5 text-emerald-300">
              <CheckCircle2 className="h-3 w-3" /> connected
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/15 px-2 py-0.5 text-amber-300">
              <AlertCircle className="h-3 w-3" /> setup pending
            </span>
          )}
          {lastSync && (
            <span className="text-slate-400">
              Last sync: {ist(lastSync.finishedAt || lastSync.startedAt)} · {lastSync.rowCount} rows ·{" "}
              <span className={lastSync.status === "success" ? "text-emerald-300" : "text-rose-300"}>
                {lastSync.status}
              </span>
            </span>
          )}
          {!lastSync && <span className="text-slate-500">abhi tak koi sync nahi</span>}
        </div>

        {sheetUrl && (
          <a
            href={sheetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-gold-300 hover:text-gold-200"
          >
            Sheet kholein <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>

      {message && (
        <p className="mt-3 flex items-start gap-2 rounded-xl bg-emerald-400/10 px-3 py-2 text-xs text-emerald-200">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> {message}
        </p>
      )}
      {error && (
        <p className="mt-3 flex items-start gap-2 rounded-xl bg-rose-400/10 px-3 py-2 text-xs text-rose-200">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
        </p>
      )}
    </section>
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-cosmic-900/60 px-3 py-2.5">
      <p className="text-[10px] uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-0.5 font-display text-xl text-white">{value}</p>
    </div>
  );
}
