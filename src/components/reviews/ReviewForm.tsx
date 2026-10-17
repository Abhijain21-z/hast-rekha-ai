"use client";

import { useState, type FormEvent } from "react";
import { Send, Star } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { Button, Input, Label, Textarea, cn } from "@/components/ui";

export type InterfaceRating = "great" | "good" | "okay" | "poor";

export interface ReviewRow {
  id?: string;
  name: string;
  rating: number;
  text: string;
  interfaceRating?: InterfaceRating | string | null;
  agrees?: boolean | null;
  createdAt?: string;
}

/**
 * The 4-question review survey shown after a prediction (and from the home
 * page). One component so both entry points save the exact same shape.
 */
export default function ReviewForm({
  defaultName = "",
  onSaved,
  submitLabel,
}: {
  defaultName?: string;
  onSaved?: (review: ReviewRow) => void;
  submitLabel?: string;
}) {
  const { t, lang } = useLang();
  const { toast } = useToast();
  const [name, setName] = useState(defaultName);
  const [iface, setIface] = useState<InterfaceRating | "">("");
  const [agrees, setAgrees] = useState<boolean | null>(null);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const ifaceOptions: { key: InterfaceRating; label: string }[] = [
    { key: "great", label: t.reviews.ifGreat },
    { key: "good", label: t.reviews.ifGood },
    { key: "okay", label: t.reviews.ifOkay },
    { key: "poor", label: t.reviews.ifPoor },
  ];

  async function submit(e: FormEvent) {
    e.preventDefault();
    setErr("");
    if (name.trim().length < 2) return setErr(t.reviews.errName);
    if (text.trim().length < 10) return setErr(t.reviews.errText);
    setBusy(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          rating,
          text: text.trim(),
          interfaceRating: iface || undefined,
          agrees,
          lang,
        }),
      });
      if (!res.ok) throw new Error(res.status === 503 ? t.reviews.errSave : "failed");
      const { review } = (await res.json()) as { review: ReviewRow };
      toast(t.reviews.saved);
      setName(defaultName);
      setIface("");
      setAgrees(null);
      setRating(5);
      setText("");
      onSaved?.(review);
    } catch (e) {
      setErr(e instanceof Error && e.message !== "failed" ? e.message : t.common.error);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <Label>{t.reviews.yourName}</Label>
        <Input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Priya Sharma" maxLength={80} />
      </div>

      {/* Q1 — interface */}
      <div>
        <Label>{t.reviews.qInterface}</Label>
        <div className="flex flex-wrap gap-2">
          {ifaceOptions.map((o) => (
            <button
              type="button"
              key={o.key}
              onClick={() => setIface(iface === o.key ? "" : o.key)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm transition",
                iface === o.key ? "border-gold-400/70 bg-gold-400/15 text-gold-200" : "border-white/10 text-slate-300 hover:border-white/30",
              )}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      {/* Q2 — agreement with the prediction */}
      <div>
        <Label>{t.reviews.qAgree}</Label>
        <div className="flex flex-wrap gap-2">
          {([
            { value: true, label: t.reviews.agreeYes, on: "border-emerald-400/60 bg-emerald-400/15 text-emerald-200" },
            { value: false, label: t.reviews.agreeNo, on: "border-rose-400/60 bg-rose-400/15 text-rose-100" },
          ] as const).map((o) => (
            <button
              type="button"
              key={String(o.value)}
              onClick={() => setAgrees(agrees === o.value ? null : o.value)}
              className={cn("rounded-full border px-4 py-1.5 text-sm transition", agrees === o.value ? o.on : "border-white/10 text-slate-300 hover:border-white/30")}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      {/* Q3 — free text */}
      <div>
        <Label>{t.reviews.qText}</Label>
        <Textarea required value={text} onChange={(e) => setText(e.target.value)} placeholder={t.reviews.qTextPh} maxLength={1200} />
      </div>

      {/* Q4 — stars */}
      <div>
        <Label>{t.reviews.qStars}</Label>
        <div className="flex gap-1.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <button type="button" key={s} onClick={() => setRating(s)} aria-label={`${s} stars`}>
              <Star className={cn("h-7 w-7 transition", s <= rating ? "fill-gold-400 text-gold-400" : "text-slate-600 hover:text-slate-400")} />
            </button>
          ))}
        </div>
      </div>

      {err && <p className="text-xs text-rose-300">{err}</p>}

      <div className="flex justify-end">
        <Button type="submit" loading={busy} icon={<Send className="h-4 w-4" />}>
          {submitLabel ?? t.reviews.submit}
        </Button>
      </div>
    </form>
  );
}
