"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Star, Trash2, Pencil, Check, X, Hand, BookOpen, ArrowRight, PlusCircle } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { Button, EmptyState, Input, Modal, cn } from "@/components/ui";
import { nakshatraAt, rashiAt } from "@/lib/content";
import { formatDate, type ReadingSummaryDTO } from "@/lib/dto";

export default function ReadingsManager({ initial }: { initial: ReadingSummaryDTO[] }) {
  const { t, L, lang, cl } = useLang();
  const { toast } = useToast();
  const [items, setItems] = useState(initial);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "fav">("all");
  const [editing, setEditing] = useState<{ id: string; title: string } | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((r) => (filter === "fav" ? r.isFavorite : true) && (!q || r.title.toLowerCase().includes(q) || r.fullName.toLowerCase().includes(q) || r.placeName.toLowerCase().includes(q)));
  }, [items, query, filter]);

  async function toggleFavorite(r: ReadingSummaryDTO) {
    const next = !r.isFavorite;
    setItems((all) => all.map((x) => (x.id === r.id ? { ...x, isFavorite: next } : x)));
    const res = await fetch(`/api/readings/${r.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isFavorite: next }) });
    if (!res.ok) {
      setItems((all) => all.map((x) => (x.id === r.id ? { ...x, isFavorite: !next } : x)));
      toast(t.common.error, "error");
    }
  }

  async function saveTitle() {
    if (!editing) return;
    const { id, title } = editing;
    const prev = items.find((x) => x.id === id)?.title ?? "";
    if (!title.trim() || title.trim() === prev) return setEditing(null);
    setItems((all) => all.map((x) => (x.id === id ? { ...x, title: title.trim() } : x)));
    setEditing(null);
    const res = await fetch(`/api/readings/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: title.trim() }) });
    if (!res.ok) {
      setItems((all) => all.map((x) => (x.id === id ? { ...x, title: prev } : x)));
      toast(t.common.error, "error");
    } else toast(t.dash.updated);
  }

  async function confirmDelete() {
    if (!deleteId) return;
    const id = deleteId;
    const snapshot = items;
    setDeleting(true);
    setItems((all) => all.filter((x) => x.id !== id));
    setDeleteId(null);
    const res = await fetch(`/api/readings/${id}`, { method: "DELETE" });
    setDeleting(false);
    if (!res.ok) {
      setItems(snapshot);
      toast(t.common.error, "error");
    } else toast(t.dash.deleted, "info");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400/90">✦ Kundli</p>
          <h1 className="mt-2 font-display text-3xl text-white sm:text-4xl">{t.dash.readings}</h1>
          <p className="mt-1 text-sm text-slate-400">{items.length} {t.dash.results}</p>
        </div>
        <Link href="/reading" className="btn-gold inline-flex items-center gap-2 self-start rounded-full px-5 py-2.5 text-sm">
          <PlusCircle className="h-4 w-4" /> {t.dash.newReading}
        </Link>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t.dash.search} className="pl-10" />
        </div>
        <div className="flex rounded-full border border-white/10 bg-white/5 p-1 text-xs">
          {(["all", "fav"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={cn("rounded-full px-4 py-2 transition", filter === f ? "bg-gold-400 text-cosmic-900" : "text-slate-300")}>
              {f === "all" ? t.dash.allReadings : t.dash.onlyFav}
            </button>
          ))}
        </div>
      </div>

      {items.length === 0 ? (
        <EmptyState icon={<BookOpen className="h-8 w-8" />} title={t.dash.noReadingsTitle} sub={t.dash.noReadingsSub} action={<Link href="/reading" className="btn-gold rounded-full px-5 py-2.5 text-sm">{t.dash.create}</Link>} />
      ) : visible.length === 0 ? (
        <p className="glass rounded-2xl p-8 text-center text-sm text-slate-400">{t.dash.noResults}</p>
      ) : (
        <motion.ul layout className="grid gap-3 md:grid-cols-2">
          <AnimatePresence initial={false}>
            {visible.map((r) => {
              const rs = rashiAt(r.result.moonRashi);
              const nk = nakshatraAt(r.result.nakshatra);
              const lg = rashiAt(r.result.lagna);
              const isEditing = editing?.id === r.id;
              return (
                <motion.li key={r.id} layout initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95, height: 0 }} className="glass group relative overflow-hidden rounded-3xl p-5 transition hover:border-gold-400/40">
                  <div className="flex items-start gap-4">
                    <span className="font-display text-5xl leading-none text-gold-300 drop-shadow-[0_0_12px_rgba(245,194,66,0.45)]">{rs.symbol}</span>
                    <div className="min-w-0 flex-1">
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <Input autoFocus value={editing.title} onChange={(e) => setEditing({ id: r.id, title: e.target.value })} onKeyDown={(e) => { if (e.key === "Enter") saveTitle(); if (e.key === "Escape") setEditing(null); }} className="py-1.5 text-sm" />
                          <button onClick={saveTitle} className="rounded-full bg-emerald-500/20 p-2 text-emerald-300"><Check className="h-4 w-4" /></button>
                          <button onClick={() => setEditing(null)} className="rounded-full bg-white/10 p-2 text-slate-300"><X className="h-4 w-4" /></button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Link href={`/dashboard/readings/${r.id}`} className="truncate font-display text-lg text-white hover:text-gold-200">{r.title}</Link>
                          <button onClick={() => setEditing({ id: r.id, title: r.title })} className="rounded-full p-1.5 text-slate-500 opacity-0 transition hover:bg-white/10 hover:text-white group-hover:opacity-100" title={t.dash.edit}><Pencil className="h-3.5 w-3.5" /></button>
                        </div>
                      )}
                      <p className="mt-0.5 truncate text-sm text-slate-300">{r.fullName}</p>
                      <p className="text-xs text-slate-500">{formatDate(r.birthDate, cl)} · {r.timeUnknown ? "~12:00" : r.birthTime} · {r.placeName.split(",")[0]}</p>
                      <div className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
                        <span className="rounded-full bg-white/6 px-2.5 py-1 text-slate-200">☽ {L(rs.short)}</span>
                        <span className="rounded-full bg-white/6 px-2.5 py-1 text-slate-200">✦ {L(nk.name)}</span>
                        <span className="rounded-full bg-white/6 px-2.5 py-1 text-slate-200">↑ {L(lg.short)}</span>
                        {r.hasPalm && <span className="inline-flex items-center gap-1 rounded-full bg-gold-400/10 px-2.5 py-1 text-gold-200"><Hand className="h-3 w-3" /> Palm</span>}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-white/8 pt-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => toggleFavorite(r)} className={cn("rounded-full p-2 transition hover:bg-white/10", r.isFavorite ? "text-gold-400" : "text-slate-500 hover:text-gold-300")} title={r.isFavorite ? t.dash.unfavorite : t.dash.favorite}>
                        <Star className={cn("h-4 w-4", r.isFavorite && "fill-gold-400")} />
                      </button>
                      <button onClick={() => setDeleteId(r.id)} className="rounded-full p-2 text-slate-500 transition hover:bg-rose-500/15 hover:text-rose-300" title={t.dash.delete}>
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <Link href={`/dashboard/readings/${r.id}`} className="inline-flex items-center gap-1.5 text-sm text-gold-300 hover:text-gold-200">
                      {t.dash.open} <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </motion.ul>
      )}

      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title={t.dash.delete}>
        <p className="text-sm text-slate-300">{t.dash.confirmDelete}</p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setDeleteId(null)}>{t.dash.cancel}</Button>
          <Button variant="danger" loading={deleting} onClick={confirmDelete} icon={<Trash2 className="h-4 w-4" />}>{t.dash.delete}</Button>
        </div>
      </Modal>
    </div>
  );
}
