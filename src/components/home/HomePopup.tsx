"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, X } from "lucide-react";

export default function HomePopup() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const dismissed = sessionStorage.getItem("hr-popup-dismissed");
    if (!dismissed) {
      const timer = setTimeout(() => setOpen(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  function yes() {
    sessionStorage.setItem("hr-popup-dismissed", "1");
    setOpen(false);
    window.dispatchEvent(new Event("hr:home-popup-closed"));
    router.push("/reading");
  }

  function no() {
    sessionStorage.setItem("hr-popup-dismissed", "1");
    setOpen(false);
    window.dispatchEvent(new Event("hr:home-popup-closed"));
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="relative max-w-md w-full rounded-3xl border border-gold-400/40 bg-gradient-to-br from-cosmic-900/95 via-[#1a1030]/95 to-mystic-900/80 p-8 shadow-2xl shadow-gold-400/20">
        <button onClick={no} className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:text-white hover:bg-white/5" aria-label="बंद करें">
          <X className="h-5 w-5" />
        </button>
        <div className="flex flex-col items-center text-center gap-4">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gold-400/15 text-gold-300 ring-1 ring-gold-400/30">
            <Sparkles className="h-6 w-6" />
          </span>
          <h2 className="font-display text-xl font-semibold text-white leading-snug">
            क्या आप देखना चाहते हैं कि आपकी <span className="text-gold-300">हस्तरेखा</span> और <span className="text-gold-300">कुंडली</span> आपके <span className="text-gold-200">भविष्य</span> के बारे में क्या कहती हैं?
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            अपनी हथेली का फोटो अपलोड करें और अपनी कुंडली, 12 जीवन-क्षेत्र और भविष्य की भविष्यवाणी देखें — <span className="text-emerald-300 font-medium">पूरी तरह निःशुल्क</span>।
          </p>
          <div className="mt-2 flex gap-3">
            <button onClick={yes} className="btn-gold rounded-full px-6 py-2.5 text-sm font-semibold shadow-lg shadow-gold-400/20">
              हाँ, दिखाएँ
            </button>
            <button onClick={no} className="rounded-full border border-white/15 px-6 py-2.5 text-sm text-slate-200 hover:border-white/30 hover:text-white transition bg-white/[0.03]">
              नहीं, अभी नहीं
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
