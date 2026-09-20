"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useLang } from "@/components/providers/LanguageProvider";

/**
 * Navagraha mandala: Shri Ganesh · glowing palm · Surya Dev inside a golden circle,
 * with the nine grahas orbiting outside on two rings (CSS-driven, GPU-friendly).
 */
interface Planet {
  i: number; // index into t.navagraha.planets
  size: number;
  orbit: 0 | 1; // 0 = inner ring, 1 = outer ring
  angle: number; // starting angle in degrees
  bg: string;
  glow?: string;
  ring?: boolean;
  glyph?: string;
}

const PLANETS: Planet[] = [
  { i: 0, size: 46, orbit: 1, angle: 270, bg: "radial-gradient(circle at 35% 35%, #fff8d0, #ffb300 40%, #ff6a00 72%, #a33200)", glow: "0 0 34px 10px rgba(255,170,0,.55)" },
  { i: 1, size: 30, orbit: 0, angle: 20, bg: "radial-gradient(circle at 30% 30%, #ffffff, #cfd3dc 45%, #8a8f9c 80%), radial-gradient(circle at 62% 58%, #9aa0ad 0 12%, transparent 13%), radial-gradient(circle at 40% 70%, #a4aab8 0 9%, transparent 10%)" },
  { i: 2, size: 30, orbit: 0, angle: 200, bg: "radial-gradient(circle at 35% 35%, #ffb28f, #e2542a 50%, #7a1f08)" },
  { i: 3, size: 24, orbit: 0, angle: 110, bg: "radial-gradient(circle at 35% 35%, #efe6d6, #a9a08f 50%, #5c554a)" },
  { i: 4, size: 54, orbit: 1, angle: 40, bg: "repeating-linear-gradient(172deg, #efdcbb 0 5px, #c9a97c 5px 9px, #a97d52 9px 12px, #e6d2b0 12px 18px, #b8895b 18px 21px)", glyph: "●" },
  { i: 5, size: 34, orbit: 0, angle: 300, bg: "radial-gradient(circle at 35% 35%, #fff6d8, #e6bf7a 50%, #8c6a2b)" },
  { i: 6, size: 40, orbit: 1, angle: 120, bg: "radial-gradient(circle at 35% 35%, #f3e6bd, #cdb47a 50%, #7d6538)", ring: true },
  { i: 7, size: 28, orbit: 1, angle: 190, bg: "radial-gradient(circle at 35% 35%, #7d4fb8, #3a1c66 55%, #0f0620)", glow: "0 0 18px 4px rgba(150,90,255,.45)", glyph: "☊" },
  { i: 8, size: 28, orbit: 1, angle: 330, bg: "radial-gradient(circle at 35% 35%, #b26a3a, #5a2d12 55%, #120806)", glow: "0 0 18px 4px rgba(255,120,40,.35)", glyph: "☋" },
];

const ORBIT_RADIUS = ["34%", "45.5%"]; // % of container size from the centre
const ORBIT_DURATION = [48, 84]; // seconds per revolution

/** Saturn drawn as an SVG so its ring correctly passes behind AND in front of the globe. */
function SaturnGlobe({ size }: { size: number }) {
  const W = size * 2.3;
  const H = W * 0.62;
  return (
    <svg width={W} height={H} viewBox="-1.15 -0.65 2.3 1.3" className="overflow-visible drop-shadow-[0_0_10px_rgba(233,217,167,0.45)]">
      <defs>
        <radialGradient id="saturnBody" cx="35%" cy="32%" r="80%">
          <stop offset="0%" stopColor="#f6ead0" />
          <stop offset="45%" stopColor="#d8bd85" />
          <stop offset="80%" stopColor="#a07f4c" />
          <stop offset="100%" stopColor="#5f4a26" />
        </radialGradient>
        <linearGradient id="saturnRing" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#b99b63" />
          <stop offset="50%" stopColor="#f0e0b0" />
          <stop offset="100%" stopColor="#b99b63" />
        </linearGradient>
        <clipPath id="saturnFront">
          <rect x="-1.15" y="-0.02" width="2.3" height="0.7" />
        </clipPath>
      </defs>
      {/* ring behind the globe */}
      <g transform="rotate(-18)">
        <ellipse rx="0.98" ry="0.27" fill="none" stroke="url(#saturnRing)" strokeWidth="0.13" opacity="0.85" />
        <ellipse rx="0.76" ry="0.20" fill="none" stroke="#c9b079" strokeWidth="0.045" opacity="0.65" />
      </g>
      {/* globe */}
      <circle r="0.44" fill="url(#saturnBody)" />
      <ellipse rx="0.44" ry="0.10" cy="-0.12" fill="#e8d3a2" opacity="0.28" />
      <ellipse rx="0.44" ry="0.07" cy="0.10" fill="#8a6c3c" opacity="0.30" />
      {/* ring in front of the globe (lower half only) */}
      <g transform="rotate(-18)" clipPath="url(#saturnFront)">
        <ellipse rx="0.98" ry="0.27" fill="none" stroke="url(#saturnRing)" strokeWidth="0.13" opacity="0.95" />
        <ellipse rx="0.76" ry="0.20" fill="none" stroke="#d8bd85" strokeWidth="0.045" opacity="0.8" />
      </g>
    </svg>
  );
}

const CENTER_IMAGES = [
  { src: "/images/ganesh.png", label: (t: ReturnType<typeof useLang>["t"]) => t.navagraha.ganesh },
  { src: "/images/hand.png", label: (t: ReturnType<typeof useLang>["t"]) => t.navagraha.hand },
  { src: "/images/surya.jpg", label: (t: ReturnType<typeof useLang>["t"]) => t.navagraha.surya },
];

export default function Navagraha() {
  const { t } = useLang();
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % CENTER_IMAGES.length), 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[560px] select-none">
      {/* orbit rings */}
      {ORBIT_RADIUS.map((r, i) => (
        <div
          key={i}
          className="pointer-events-none absolute rounded-full border border-dashed border-gold-400/20"
          style={{ inset: `calc(50% - ${r})` }}
        />
      ))}
      <div className="pointer-events-none absolute rounded-full border border-mystic-500/20" style={{ inset: "calc(50% - 40%)" }} />

      {/* planets */}
      {PLANETS.map((p) => {
        const dur = ORBIT_DURATION[p.orbit];
        const delay = -(p.angle / 360) * dur;
        return (
          <div key={p.i} className="absolute inset-0" style={{ animation: `orbit ${dur}s linear infinite`, animationDelay: `${delay}s` }}>
            <div
              className="absolute left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
              style={{ top: `calc(50% - ${ORBIT_RADIUS[p.orbit]})`, animation: `orbit-reverse ${dur}s linear infinite`, animationDelay: `${delay}s` }}
            >
              {p.ring ? (
                <SaturnGlobe size={p.size} />
              ) : (
                <div className="relative" style={{ width: p.size, height: p.size }}>
                  <div className="planet h-full w-full" style={{ background: p.bg, boxShadow: p.glow ? `${p.glow}, inset -6px -6px 12px rgba(0,0,0,.65)` : undefined }} />
                  {p.glyph && p.i > 6 && (
                    <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-xs font-bold text-white/80">{p.glyph}</span>
                  )}
                  {p.i === 4 && <span className="pointer-events-none absolute left-[58%] top-[54%] h-[9px] w-[13px] rounded-[50%] bg-[#b8462a]/80 blur-[0.3px]" />}
                </div>
              )}
              <span className="mt-1 whitespace-nowrap text-xs font-medium tracking-wide text-gold-200/90 drop-shadow">{t.navagraha.planets[p.i]}</span>
            </div>
          </div>
        );
      })}

      {/* central mandala */}
      <div className="absolute inset-[23%]">
        <div className="absolute -inset-[3px] rounded-full bg-[conic-gradient(from_0deg,#f5c242,#7c3aed,#f5c242,#a855f7,#f5c242)] opacity-80" style={{ animation: "halo-spin 24s linear infinite" }} />
        {/* sun-like radiant interior: warm golden core glowing outward */}
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_45%,#fff3c4_0%,#ffd76a_18%,#f5a623_38%,#b8641a_58%,#3a1c08_82%,#1a0d04_100%)] shadow-[0_0_90px_-8px_rgba(255,170,0,0.85)]" />
        <div className="pointer-events-none absolute inset-0 rounded-full opacity-60" style={{ animation: "sun-breathe 6s ease-in-out infinite", background: "radial-gradient(circle at 50% 42%, rgba(255,240,180,0.85) 0%, rgba(255,200,80,0.35) 40%, transparent 70%)" }} />
        <div className="mandala-bg absolute inset-0 rounded-full opacity-40" />
        <span className="absolute left-1/2 top-[3%] -translate-x-1/2 font-display text-lg text-gold-300 drop-shadow-[0_0_10px_rgba(245,194,66,0.8)]">ॐ</span>

        <div className="absolute inset-0 flex items-center justify-center px-[4%]">
          {/* single rotating image: one at a time, 2s each, zoom-out on change */}
          <div className="relative w-[46%]">
            {[0, 1].map((i) => (
              <span key={i} className="pointer-events-none absolute inset-[6%] rounded-full border border-gold-400/50" style={{ animation: `ring-pulse 3.2s ease-out ${i * 1.6}s infinite` }} />
            ))}
            <div className="relative aspect-square" style={{ animation: "hand-float 6s ease-in-out infinite" }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={idx}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.25 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <div className="relative aspect-square overflow-hidden rounded-full">
                    <Image src={CENTER_IMAGES[idx].src} alt={CENTER_IMAGES[idx].label(t)} fill sizes="260px" className="mask-fade object-cover" priority />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            <p className="-mt-1 text-center text-xs text-gold-200/90">{CENTER_IMAGES[idx].label(t)}</p>
          </div>
        </div>
      </div>

      <p className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs uppercase tracking-[0.3em] text-gold-400/70">{t.navagraha.title}</p>
    </div>
  );
}
