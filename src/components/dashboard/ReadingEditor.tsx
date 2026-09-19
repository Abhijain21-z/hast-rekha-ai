"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Star, Trash2, Save, ChevronDown, Hand, NotebookPen } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { Button, Input, Label, Modal, Textarea, cn } from "@/components/ui";
import PalmUpload from "@/components/reading/PalmUpload";
import type { ReadingDTO } from "@/lib/dto";

export default function ReadingEditor({ reading }: { reading: ReadingDTO }) {
  const { t } = useLang();
  const { toast } = useToast();
  const router = useRouter();
  const [title, setTitle] = useState(reading.title);
  const [notes, setNotes] = useState(reading.notes ?? "");
  const [fav, setFav] = useState(reading.isFavorite);
  const [palm, setPalm] = useState<string | null>(reading.palmImage);
  const [hand, setHand] = useState<"left" | "right">(reading.palmHand === "left" ? "left" : "right");
  const [open, setOpen] = useState(!reading.palmImage);
  const [saving, setSaving] = useState(false);
  const [savingPalm, setSavingPalm] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function patch(body: Record<string, unknown>) {
    const res = await fetch(`/api/readings/${reading.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (!res.ok) throw new Error();
  }

  async function toggleFav() {
    const next = !fav;
    setFav(next);
    try {
      await patch({ isFavorite: next });
    } catch {
      setFav(!next);
      toast(t.common.error, "error");
    }
  }

  async function saveMeta() {
    setSaving(true);
    try {
      await patch({ title, notes });
      toast(t.dash.saved);
      router.refresh();
    } catch {
      toast(t.common.error, "error");
    } finally {
      setSaving(false);
    }
  }

  async function savePalm() {
    setSavingPalm(true);
    try {
      await patch({ palmImage: palm, palmHand: palm ? hand : null });
      toast(t.dash.updated);
      router.refresh();
    } catch {
      toast(t.common.error, "error");
    } finally {
      setSavingPalm(false);
    }
  }

  async function remove() {
    setDeleting(true);
    const res = await fetch(`/api/readings/${reading.id}`, { method: "DELETE" });
    if (res.ok) {
      toast(t.dash.deleted, "info");
      router.push("/dashboard/readings");
      router.refresh();
    } else {
      setDeleting(false);
      toast(t.common.error, "error");
    }
  }

  const palmDirty = palm !== reading.palmImage || (palm && hand !== (reading.palmHand ?? "right"));

  return (
    <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 lg:px-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Link href="/dashboard/readings" className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white">
          <ArrowLeft className="h-4 w-4" /> {t.dash.readings}
        </Link>
        <div className="flex items-center gap-2">
          <button onClick={toggleFav} className={cn("inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition", fav ? "border-gold-400/50 bg-gold-400/15 text-gold-200" : "border-white/15 text-slate-300 hover:border-gold-400/40")}>
            <Star className={cn("h-4 w-4", fav && "fill-gold-400 text-gold-400")} /> {fav ? t.dash.unfavorite : t.dash.favorite}
          </button>
          <Button variant="danger" size="md" onClick={() => setConfirm(true)} icon={<Trash2 className="h-4 w-4" />}>{t.dash.delete}</Button>
        </div>
      </div>

      <div className="glass rounded-3xl">
        <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center gap-3 px-6 py-4 text-left">
          <NotebookPen className="h-5 w-5 text-gold-300" />
          <span className="font-display text-lg text-white">{t.dash.edit}: {t.dash.title} · {t.dash.notes} · {t.dash.palmSection}</span>
          <ChevronDown className={cn("ml-auto h-5 w-5 text-slate-400 transition-transform", open && "rotate-180")} />
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="grid gap-6 border-t border-white/8 p-6 lg:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <Label>{t.dash.title}</Label>
                    <Input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} />
                  </div>
                  <div>
                    <Label>{t.dash.notes}</Label>
                    <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={t.dash.notesPh} className="min-h-[150px]" maxLength={5000} />
                  </div>
                  <Button onClick={saveMeta} loading={saving} icon={<Save className="h-4 w-4" />}>{saving ? t.dash.saving : t.dash.save}</Button>
                </div>
                <div>
                  <Label>{t.dash.palmSection}</Label>
                  <PalmUpload value={palm} onChange={setPalm} hand={hand} onHandChange={setHand} compact />
                  {palmDirty && (
                    <Button onClick={savePalm} loading={savingPalm} className="mt-3" variant="outline" icon={<Hand className="h-4 w-4" />}>{savingPalm ? t.dash.saving : t.dash.save}</Button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Modal open={confirm} onClose={() => setConfirm(false)} title={t.dash.delete}>
        <p className="text-sm text-slate-300">{t.dash.confirmDelete}</p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setConfirm(false)}>{t.dash.cancel}</Button>
          <Button variant="danger" loading={deleting} onClick={remove} icon={<Trash2 className="h-4 w-4" />}>{t.dash.delete}</Button>
        </div>
      </Modal>
    </div>
  );
}
