"use client";

import { motion } from "framer-motion";
import { cn } from "@/components/ui";

export const PALM_LINES: { key: string; d: string; color: string; width: number; dashed?: boolean }[] = [
  { key: "life", d: "M104 286 C 68 330, 86 386, 140 418", color: "#f5c242", width: 3 },
  { key: "head", d: "M102 292 C 140 300, 184 312, 226 330", color: "#60a5fa", width: 2.6 },
  { key: "heart", d: "M238 284 C 200 268, 160 268, 116 280", color: "#fb7185", width: 2.6 },
  { key: "fate", d: "M170 418 C 168 370, 166 320, 160 262", color: "#c084fc", width: 2.2 },
  { key: "sun", d: "M202 356 C 200 320, 198 290, 196 262", color: "#fbbf24", width: 1.9 },
  { key: "mercury", d: "M144 404 C 176 364, 208 320, 230 276", color: "#34d399", width: 1.9 },
  { key: "money", d: "M188 262 v 12 M195 260 v 13 M202 262 v 11", color: "#f9dc8c", width: 1.7 },
  { key: "marriage", d: "M236 262 h 13 M236 271 h 10", color: "#f472b6", width: 2 },
  { key: "travel", d: "M242 350 h -18 M244 368 h -15 M242 384 h -12", color: "#22d3ee", width: 1.9 },
  { key: "health", d: "M132 410 C 160 376, 192 338, 224 300", color: "#a3e635", width: 1.4, dashed: true },
];

export const PALM_MOUNTS: { key: string; cx: number; cy: number; r: number }[] = [
  { key: "venus", cx: 98, cy: 340, r: 34 },
  { key: "jupiter", cx: 118, cy: 262, r: 16 },
  { key: "saturn", cx: 156, cy: 258, r: 16 },
  { key: "sun", cx: 196, cy: 260, r: 16 },
  { key: "mercury", cx: 228, cy: 266, r: 14 },
  { key: "mars", cx: 232, cy: 312, r: 14 },
  { key: "moon", cx: 212, cy: 378, r: 26 },
];

const HAND_PATH =
  "M118 420 C 100 380, 92 350, 66 306 L 26 256 Q 14 240 22 228 Q 32 216 44 226 L 70 266 C 78 262, 90 258, 102 250 L 96 124 Q 94 104 110 102 Q 128 100 130 120 L 136 246 L 134 92 Q 134 68 154 68 Q 174 68 174 90 L 176 246 L 178 112 Q 180 92 198 94 Q 216 96 216 116 L 214 248 L 220 168 Q 222 150 236 152 Q 250 154 250 172 L 246 250 C 250 262, 250 320, 246 380 Q 240 420 232 420 Z";

interface Props {
  active?: string | null;
  onSelect?: (key: string) => void;
  strengths?: Record<string, number>;
  className?: string;
  showMounts?: boolean;
  animate?: boolean;
  /** Draw only interactive highlight lines/mounts, meant to sit on top of a palm photo. */
  overlay?: boolean;
}

export default function PalmSvg({ active, onSelect, strengths, className, showMounts = true, animate = true, overlay = false }: Props) {
  const isActive = (key: string) => active === key;
  return (
    <svg viewBox="0 0 280 440" className={cn("h-auto w-full", className)} role="img" aria-label="Palm diagram">
      <defs>
        <linearGradient id="palmFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b2a6b" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#1a0f38" stopOpacity="0.85" />
        </linearGradient>
        <filter id="palmGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3.2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="palmGlowBig" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {!overlay && (
        <motion.path
          d={HAND_PATH}
          fill="url(#palmFill)"
          stroke="rgba(245,194,66,0.55)"
          strokeWidth="2"
          initial={animate ? { pathLength: 0, fillOpacity: 0 } : undefined}
          whileInView={animate ? { pathLength: 1, fillOpacity: 1 } : undefined}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease: "easeInOut" }}
        />
      )}

      {showMounts &&
        PALM_MOUNTS.map((m) => {
          const s = strengths?.[m.key];
          const on = isActive(m.key);
          if (overlay && !on && s === undefined) return null;
          const fillOpacity = on ? 0.38 : overlay ? 0.06 + (s ? (s / 100) * 0.16 : 0) : 0.12;
          const strokeOpacity = on ? 1 : overlay ? 0.2 + (s ? (s / 100) * 0.3 : 0) : 0.45;
          return (
            <g key={m.key} onClick={() => onSelect?.(m.key)} className={cn(onSelect && "cursor-pointer")}>
              <circle
                cx={m.cx} cy={m.cy} r={m.r}
                fill={`rgba(245,194,66,${fillOpacity})`}
                stroke={on ? "#f5c242" : "rgba(192,132,252,0.7)"}
                strokeDasharray={on ? undefined : "3 3"}
                strokeWidth={on ? 2 : 1}
                filter={on ? "url(#palmGlow)" : undefined}
                className="transition-all duration-300"
              />
              {s !== undefined && overlay && <circle cx={m.cx} cy={m.cy} r={Math.max(3, (m.r - 4) * (s / 100))} fill="rgba(245,194,66,0.30)" />}
            </g>
          );
        })}

      {PALM_LINES.map((l, i) => {
        const on = isActive(l.key);
        const s = strengths?.[l.key];
        if (overlay && !on && s === undefined) return null;
        const width = l.width * (s !== undefined ? 0.7 + s / 150 : 1) * (on ? 1.5 : 1);
        const opacity = on ? 1 : overlay ? (s !== undefined ? 0.35 + (s / 100) * 0.5 : 0) : 1;
        return (
          <g key={l.key} onClick={() => onSelect?.(l.key)} className={cn(onSelect && "cursor-pointer")}>
            {/* wide invisible hit area */}
            <path d={l.d} stroke="transparent" strokeWidth="18" fill="none" />
            <motion.path
              d={l.d}
              fill="none"
              stroke={l.color}
              strokeWidth={width}
              strokeLinecap="round"
              strokeDasharray={l.dashed ? "4 4" : undefined}
              filter={on ? "url(#palmGlowBig)" : overlay && s !== undefined ? "url(#palmGlow)" : undefined}
              initial={overlay ? { opacity: 0 } : animate ? { pathLength: 0, opacity: 0 } : undefined}
              whileInView={overlay ? { opacity } : animate ? { pathLength: 1, opacity } : undefined}
              viewport={{ once: true }}
              transition={overlay ? { duration: 0.35 } : { duration: 1.1, delay: 0.5 + i * 0.12, ease: "easeOut" }}
              animate={on && overlay ? { opacity: [0.75, 1, 0.75] } : undefined}
              style={overlay && !on ? undefined : { opacity: active && !on && !overlay ? 0.25 : undefined }}
            />
          </g>
        );
      })}
    </svg>
  );
}
