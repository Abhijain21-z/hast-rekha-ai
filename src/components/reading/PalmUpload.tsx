"use client";

import { useCallback, useRef, useState, type DragEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Hand, ImagePlus, Trash2, Loader2 } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import { cn } from "@/components/ui";

export async function downscaleImage(file: File, max = 900, quality = 0.82): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = reject;
      i.src = url;
    });
    const scale = Math.min(1, max / Math.max(img.width, img.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(img.width * scale));
    canvas.height = Math.max(1, Math.round(img.height * scale));
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("canvas");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", quality);
  } finally {
    URL.revokeObjectURL(url);
  }
}

interface Props {
  value: string | null;
  onChange: (dataUrl: string | null) => void;
  hand: "left" | "right";
  onHandChange: (h: "left" | "right") => void;
  compact?: boolean;
}

export default function PalmUpload({ value, onChange, hand, onHandChange, compact }: Props) {
  const { t } = useLang();
  const [drag, setDrag] = useState(false);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file?: File | null) => {
      if (!file || !file.type.startsWith("image/")) return;
      setBusy(true);
      try {
        onChange(await downscaleImage(file));
      } finally {
        setBusy(false);
      }
    },
    [onChange],
  );

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDrag(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  return (
    <div>
      <AnimatePresence mode="wait">
        {value ? (
          <motion.div key="preview" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="relative overflow-hidden rounded-2xl border border-gold-400/30">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="Palm preview" className={cn("w-full object-cover", compact ? "max-h-56" : "max-h-80")} />
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/80 to-transparent p-3">
              <span className="inline-flex items-center gap-1.5 text-xs text-gold-200"><Hand className="h-3.5 w-3.5" /> {hand === "left" ? t.form.left : t.form.right}</span>
              <button type="button" onClick={() => onChange(null)} className="inline-flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 text-xs text-rose-200 hover:bg-rose-500/30">
                <Trash2 className="h-3.5 w-3.5" /> {t.form.remove}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="drop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 text-center transition-all",
              compact ? "py-8" : "py-12",
              drag ? "border-gold-400 bg-gold-400/10 scale-[1.01]" : "border-white/15 bg-white/[0.03] hover:border-gold-400/50 hover:bg-white/[0.05]",
            )}
          >
            {busy ? (
              <Loader2 className="h-8 w-8 animate-spin text-gold-300" />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-gold-400/30 bg-gold-400/10 text-gold-300">
                <ImagePlus className="h-6 w-6" />
              </div>
            )}
            <p className="mt-4 text-sm font-medium text-slate-200">{t.form.palmDrop}</p>
            <p className="mt-1 text-xs text-slate-400">
              {t.form.palmOr} <span className="text-gold-300 underline">{t.form.palmBrowse}</span>
            </p>
            <p className="mt-3 text-xs text-slate-500">{t.form.palmHint}</p>
          </motion.div>
        )}
      </AnimatePresence>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />

      <div className="mt-3 flex items-center gap-3">
        <span className="text-xs text-slate-400">{t.form.hand}</span>
        <div className="flex rounded-full border border-white/10 bg-white/5 p-0.5 text-xs">
          {(["left", "right"] as const).map((h) => (
            <button key={h} type="button" onClick={() => onHandChange(h)} className={cn("rounded-full px-3 py-1 transition", hand === h ? "bg-gold-400 text-cosmic-900" : "text-slate-300")}>
              {h === "left" ? t.form.left : t.form.right}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
