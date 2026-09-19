"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { animate, motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/components/ui";

/* ---------- Count-up number ---------- */
export function CountUp({ to, suffix = "", duration = 1.4, className }: { to: number; suffix?: string; duration?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration, ease: "easeOut", onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [inView, to, duration]);
  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {v}
      {suffix}
    </span>
  );
}

/* ---------- 3D tilt wrapper ---------- */
export function Tilt({ children, className, max = 7 }: { children: ReactNode; className?: string; max?: number }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rx = useSpring(useTransform(y, [-0.5, 0.5], [max, -max]), { stiffness: 150, damping: 18 });
  const ry = useSpring(useTransform(x, [-0.5, 0.5], [-max, max]), { stiffness: 150, damping: 18 });
  return (
    <motion.div
      className={className}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - r.left) / r.width - 0.5);
        y.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/* ---------- Circular gauge ---------- */
export function Gauge({ value, label, size = 110, color = "#f5c242" }: { value: number; label: string; size?: number; color?: string }) {
  const r = 40;
  const C = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox="0 0 100 100" className="-rotate-90">
          <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
          <motion.circle
            cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
            strokeDasharray={C}
            initial={{ strokeDashoffset: C }}
            whileInView={{ strokeDashoffset: C * (1 - value / 100) }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            style={{ filter: `drop-shadow(0 0 6px ${color}88)` }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-display text-xl font-semibold text-white">
          <CountUp to={value} />
        </div>
      </div>
      <p className="mt-1 text-xs text-slate-300">{label}</p>
    </div>
  );
}

/* ---------- Horizontal meter ---------- */
export function Meter({ value, label, color = "#f5c242" }: { value: number; label?: string; color?: string }) {
  return (
    <div>
      {label && (
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="text-slate-300">{label}</span>
          <span className="font-semibold text-white"><CountUp to={value} suffix="%" /></span>
        </div>
      )}
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
        <motion.div className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${color}99, ${color})`, boxShadow: `0 0 10px ${color}66` }} initial={{ width: 0 }} whileInView={{ width: `${value}%` }} viewport={{ once: true }} transition={{ duration: 1.2, ease: "easeOut" }} />
      </div>
    </div>
  );
}

/* ---------- Radar chart ---------- */
export function RadarChart({ data }: { data: { label: string; value: number }[] }) {
  const cx = 150, cy = 150, R = 100, n = data.length;
  const pt = (i: number, v: number) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    return [cx + R * (v / 100) * Math.cos(a), cy + R * (v / 100) * Math.sin(a)] as const;
  };
  const poly = data.map((d, i) => pt(i, d.value).join(",")).join(" ");
  return (
    <svg viewBox="0 0 300 300" className="mx-auto h-auto w-full max-w-[340px]">
      {[20, 40, 60, 80, 100].map((lvl) => (
        <polygon key={lvl} points={data.map((_, i) => pt(i, lvl).join(",")).join(" ")} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      ))}
      {data.map((_, i) => {
        const [x, y] = pt(i, 100);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(255,255,255,0.08)" />;
      })}
      <motion.g initial={{ scale: 0, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1.1, ease: "easeOut" }} style={{ transformOrigin: "150px 150px" }}>
        <polygon points={poly} fill="rgba(245,194,66,0.22)" stroke="#f5c242" strokeWidth="2" style={{ filter: "drop-shadow(0 0 8px rgba(245,194,66,0.6))" }} />
        {data.map((d, i) => {
          const [x, y] = pt(i, d.value);
          return <circle key={i} cx={x} cy={y} r="4" fill="#fff4cf" stroke="#f5c242" strokeWidth="2" />;
        })}
      </motion.g>
      {data.map((d, i) => {
        const [x, y] = pt(i, 122);
        return (
          <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fontSize="11" fill="#e9e4f5" fontFamily="Noto Sans Devanagari, Poppins, sans-serif">
            {d.label} {d.value}
          </text>
        );
      })}
    </svg>
  );
}

/* ---------- Life journey graph ---------- */
interface LifeGraphProps {
  points: { age: number; value: number }[];
  luckyAges: number[];
  turning: { age: number; label: string }[];
  currentAge: number;
  birthYear: number;
  nowLabel: string;
  ageLabel: string;
}
export function LifeGraph({ points, luckyAges, turning, currentAge, birthYear, nowLabel, ageLabel }: LifeGraphProps) {
  const W = 680, H = 280, ml = 34, mr = 16, mt = 24, mb = 44;
  const x = (age: number) => ml + (age / 80) * (W - ml - mr);
  const y = (v: number) => mt + (1 - v / 100) * (H - mt - mb);
  const d = points.map((p, i) => `${i === 0 ? "M" : "L"}${x(p.age).toFixed(1)} ${y(p.value).toFixed(1)}`).join(" ");
  const area = `${d} L${x(80)} ${y(0)} L${x(0)} ${y(0)} Z`;
  const valueAt = (age: number) => {
    const p = points.reduce((a, b) => (Math.abs(b.age - age) < Math.abs(a.age - age) ? b : a));
    return p.value;
  };
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full">
      <defs>
        <linearGradient id="lgArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f5c242" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#a855f7" stopOpacity="0.02" />
        </linearGradient>
        <linearGradient id="lgLine" x1="0" x2="1">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="60%" stopColor="#f5c242" />
          <stop offset="100%" stopColor="#fbeab8" />
        </linearGradient>
      </defs>
      {[0, 25, 50, 75, 100].map((v) => (
        <g key={v}>
          <line x1={ml} x2={W - mr} y1={y(v)} y2={y(v)} stroke="rgba(255,255,255,0.06)" />
          <text x={ml - 6} y={y(v)} textAnchor="end" dominantBaseline="middle" fontSize="10" fill="rgba(233,228,245,0.5)">{v}</text>
        </g>
      ))}
      {[0, 10, 20, 30, 40, 50, 60, 70, 80].map((a) => (
        <g key={a}>
          <text x={x(a)} y={H - mb + 16} textAnchor="middle" fontSize="10" fill="rgba(233,228,245,0.7)">{a}</text>
          <text x={x(a)} y={H - mb + 30} textAnchor="middle" fontSize="9" fill="rgba(233,228,245,0.4)">{birthYear + a}</text>
        </g>
      ))}
      <text x={W - mr} y={H - 2} textAnchor="end" fontSize="10" fill="rgba(249,220,140,0.7)">{ageLabel} →</text>

      <motion.path d={area} fill="url(#lgArea)" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1.2, delay: 0.8 }} />
      <motion.path d={d} fill="none" stroke="url(#lgLine)" strokeWidth="3" strokeLinecap="round" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 2.2, ease: "easeInOut" }} style={{ filter: "drop-shadow(0 0 6px rgba(245,194,66,0.6))" }} />

      {turning.map((tp, i) => (
        <motion.g key={tp.age} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 1.6 + i * 0.2 }}>
          <line x1={x(tp.age)} x2={x(tp.age)} y1={y(valueAt(tp.age))} y2={mt} stroke="rgba(192,132,252,0.5)" strokeDasharray="3 3" />
          <rect x={x(tp.age) - 34} y={mt - 18} width="68" height="16" rx="8" fill="rgba(124,58,237,0.6)" />
          <text x={x(tp.age)} y={mt - 7} textAnchor="middle" fontSize="9" fill="#fff">{tp.label}</text>
        </motion.g>
      ))}

      {luckyAges.map((a, i) => (
        <motion.g key={a} initial={{ scale: 0, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ type: "spring", delay: 1.4 + i * 0.15 }} style={{ transformOrigin: `${x(a)}px ${y(valueAt(a))}px` }}>
          <circle cx={x(a)} cy={y(valueAt(a))} r="12" fill="rgba(245,194,66,0.25)" />
          <text x={x(a)} y={y(valueAt(a)) + 1} textAnchor="middle" dominantBaseline="middle" fontSize="14" fill="#fff4cf">★</text>
          <text x={x(a)} y={y(valueAt(a)) - 16} textAnchor="middle" fontSize="10" fill="#f9dc8c" fontWeight="600">{birthYear + a}</text>
        </motion.g>
      ))}

      {currentAge >= 0 && currentAge <= 80 && (
        <motion.g initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 2.2 }}>
          <line x1={x(currentAge)} x2={x(currentAge)} y1={mt} y2={H - mb} stroke="#fff" strokeDasharray="4 4" strokeOpacity="0.7" />
          <circle cx={x(currentAge)} cy={y(valueAt(currentAge))} r="6" fill="#fff" stroke="#f5c242" strokeWidth="2">
            <animate attributeName="r" values="5;8;5" dur="2s" repeatCount="indefinite" />
          </circle>
          <text x={x(currentAge) + 6} y={H - mb - 6} fontSize="10" fill="#fff">{nowLabel} · {currentAge}</text>
        </motion.g>
      )}
    </svg>
  );
}

/* ---------- 3D-style decade bars ---------- */
export function DecadeBars({ data, ageLabel }: { data: { label: string; value: number }[]; ageLabel: string }) {
  return (
    <div className="perspective-1000">
      <div className="preserve-3d flex h-52 items-end justify-around gap-3 px-2" style={{ transform: "rotateX(14deg)" }}>
        {data.map((d, i) => (
          <div key={d.label} className="flex h-full w-full max-w-[64px] flex-col items-center justify-end">
            <span className="mb-1 text-xs font-semibold text-gold-200"><CountUp to={d.value} /></span>
            <motion.div
              className="relative w-full rounded-t-xl"
              style={{ background: "linear-gradient(180deg, #f9dc8c 0%, #d4a12a 45%, #7c3aed 100%)", boxShadow: "0 12px 30px -8px rgba(245,194,66,0.5), inset -8px 0 14px rgba(0,0,0,0.35)" }}
              initial={{ height: 0 }}
              whileInView={{ height: `${Math.max(6, d.value)}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: i * 0.12, ease: "easeOut" }}
            >
              <span className="absolute -top-2 left-0 h-4 w-full rounded-[50%] bg-[#fbeab8]" />
            </motion.div>
            <span className="mt-2 text-[11px] text-slate-300">{d.label}</span>
          </div>
        ))}
      </div>
      <p className="mt-1 text-center text-[10px] text-slate-500">{ageLabel}</p>
    </div>
  );
}

/* ---------- Age range timeline ---------- */
export function AgeRange({ ranges, currentAge, birthYear, min = 15, max = 65, nowLabel }: { ranges: { from: number; to: number; label: string; color?: string }[]; currentAge: number; birthYear: number; min?: number; max?: number; nowLabel: string }) {
  const pct = (a: number) => `${((Math.min(max, Math.max(min, a)) - min) / (max - min)) * 100}%`;
  return (
    <div className="pt-6">
      <div className="relative h-3 w-full rounded-full bg-white/10">
        {ranges.map((r, i) => (
          <motion.div key={r.label} className="absolute top-0 h-full rounded-full" style={{ left: pct(r.from), background: r.color ?? "linear-gradient(90deg,#a855f7,#f5c242)", boxShadow: "0 0 12px rgba(245,194,66,0.5)" }} initial={{ width: 0 }} whileInView={{ width: `calc(${pct(r.to)} - ${pct(r.from)})` }} viewport={{ once: true }} transition={{ duration: 1, delay: i * 0.2 }}>
            <span className="absolute -top-6 left-0 whitespace-nowrap text-[10px] text-gold-200">{r.label}</span>
          </motion.div>
        ))}
        {currentAge >= min && currentAge <= max && (
          <div className="absolute -top-1.5 h-6 w-0.5 bg-white" style={{ left: pct(currentAge) }}>
            <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] text-white">{nowLabel}</span>
          </div>
        )}
      </div>
      <div className="mt-6 flex justify-between text-[10px] text-slate-500">
        {[min, 25, 35, 45, 55, max].map((a) => (
          <span key={a}>{a}<br />{birthYear + a}</span>
        ))}
      </div>
    </div>
  );
}
