"use client";

import { useEffect, useState } from "react";

interface Star { x: number; y: number; s: number; d: number; o: number }

export default function StarField() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const count = window.innerWidth < 640 ? 70 : 140;
    setStars(
      Array.from({ length: count }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        s: Math.random() * 2 + 0.6,
        d: Math.random() * 6,
        o: Math.random() * 0.6 + 0.3,
      })),
    );
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute -left-40 top-[-10%] h-[520px] w-[520px] rounded-full bg-mystic-600/25 blur-[140px] animate-float" />
      <div className="absolute -right-40 top-[30%] h-[460px] w-[460px] rounded-full bg-gold-500/10 blur-[140px] animate-float [animation-delay:-3s]" />
      <div className="absolute bottom-[-10%] left-[30%] h-[420px] w-[420px] rounded-full bg-mystic-700/25 blur-[140px] animate-float [animation-delay:-5s]" />
      {stars.map((st, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            left: `${st.x}%`,
            top: `${st.y}%`,
            width: st.s,
            height: st.s,
            opacity: st.o,
            animationDelay: `${st.d}s`,
            animationDuration: `${3 + (st.d % 4)}s`,
            boxShadow: st.s > 2 ? "0 0 6px rgba(255,255,255,0.8)" : undefined,
          }}
        />
      ))}
    </div>
  );
}
