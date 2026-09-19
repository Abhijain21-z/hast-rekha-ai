"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Music, VolumeX } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import { AmbientEngine } from "@/lib/ambient-audio";
import { cn } from "@/components/ui";

const PREF_KEY = "hr_music";

export default function AmbientMusic() {
  const { t } = useLang();
  const engineRef = useRef<AmbientEngine | null>(null);
  const [playing, setPlaying] = useState(false);
  const [armed, setArmed] = useState(false); // waiting for first user gesture
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    const engine = new AmbientEngine();
    engineRef.current = engine;
    if (!engine.supported) {
      setSupported(false);
      return;
    }
    if (localStorage.getItem(PREF_KEY) === "off") return;

    let cancelled = false;
    const tryStart = async () => {
      const ok = await engine.start();
      if (cancelled) return;
      if (ok) {
        setPlaying(true);
        setArmed(false);
        detach();
      }
    };
    const events: (keyof DocumentEventMap)[] = ["pointerdown", "keydown", "touchend"];
    const handler = () => void tryStart();
    const detach = () => events.forEach((e) => document.removeEventListener(e, handler));
    // Autoplay is usually blocked until the first gesture: arm listeners, and also try immediately.
    events.forEach((e) => document.addEventListener(e, handler, { passive: true }));
    setArmed(true);
    void tryStart();

    return () => {
      cancelled = true;
      detach();
      void engine.stop();
    };
  }, []);

  async function toggle() {
    const engine = engineRef.current;
    if (!engine) return;
    if (playing) {
      await engine.stop();
      setPlaying(false);
      localStorage.setItem(PREF_KEY, "off");
    } else {
      const ok = await engine.start();
      if (ok) {
        setPlaying(true);
        setArmed(false);
        localStorage.setItem(PREF_KEY, "on");
      }
    }
  }

  if (!supported) return null;

  return (
    <div className="no-print fixed bottom-4 left-4 z-[60] flex items-center gap-2 sm:bottom-6 sm:left-6">
      <button
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? t.top.musicOff : t.top.musicOn}
        title={playing ? t.top.musicOff : t.top.musicOn}
        className={cn(
          "glass-strong relative flex h-12 w-12 items-center justify-center rounded-full text-gold-300 shadow-xl transition hover:scale-105",
          playing && "gold-border gold-glow",
        )}
      >
        {playing ? (
          <span className="flex h-4 items-end gap-[3px]" aria-hidden>
            {[0, 1, 2, 3].map((i) => (
              <motion.span
                key={i}
                className="w-[3px] rounded-full bg-gold-300"
                animate={{ height: ["30%", "100%", "45%", "85%", "30%"] }}
                transition={{ duration: 1.1 + i * 0.15, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 }}
              />
            ))}
          </span>
        ) : (
          <VolumeX className="h-5 w-5 text-slate-400" />
        )}
        {armed && !playing && <span className="absolute inset-0 animate-ping rounded-full border border-gold-400/50" />}
      </button>
      <AnimatePresence>
        {armed && !playing && (
          <motion.span initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="glass rounded-full px-3 py-1.5 text-[11px] text-gold-200">
            <Music className="mr-1 inline h-3 w-3" /> {t.top.tapMusic}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
