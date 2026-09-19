"use client";

import { motion } from "framer-motion";

type Star = [number, number, number]; // x, y, size
interface Constellation { key: string; name: { en: string; hi: string }; stars: Star[]; edges: [number, number][] }

const CONSTELLATIONS: Constellation[] = [
  { key: "orion", name: { en: "Orion", hi: "मृगशिरा / कालपुरुष" }, stars: [[20, 10, 3], [80, 14, 3], [42, 46, 2.4], [50, 50, 2.4], [58, 54, 2.4], [16, 92, 3], [84, 96, 3.2], [50, 72, 1.6]], edges: [[0, 2], [1, 4], [2, 3], [3, 4], [2, 5], [4, 6], [3, 7]] },
  { key: "ursa", name: { en: "Ursa Major (Saptarishi)", hi: "सप्तर्षि" }, stars: [[5, 60, 2.6], [22, 52, 2.6], [40, 58, 2.4], [56, 50, 2.4], [70, 30, 2.6], [88, 34, 2.6], [78, 64, 2.6]], edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 3]] },
  { key: "cassiopeia", name: { en: "Cassiopeia", hi: "शर्मिष्ठा" }, stars: [[4, 40, 2.6], [26, 20, 2.8], [50, 44, 2.6], [72, 24, 2.8], [96, 52, 2.6]], edges: [[0, 1], [1, 2], [2, 3], [3, 4]] },
  { key: "scorpius", name: { en: "Scorpius", hi: "वृश्चिक" }, stars: [[10, 10, 2.6], [22, 24, 3.2], [30, 40, 2.4], [34, 58, 2.4], [42, 74, 2.4], [56, 86, 2.4], [72, 90, 2.4], [86, 80, 2.6], [92, 66, 2.8], [6, 26, 2.2]], edges: [[0, 1], [9, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8]] },
  { key: "leo", name: { en: "Leo", hi: "सिंह" }, stars: [[10, 70, 3], [28, 62, 2.4], [40, 40, 2.6], [30, 20, 2.4], [48, 12, 2.4], [60, 24, 2.4], [82, 30, 2.4], [92, 68, 3], [64, 74, 2.4]], edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 2], [5, 6], [6, 7], [7, 8], [8, 1]] },
  { key: "cygnus", name: { en: "Cygnus", hi: "हंस" }, stars: [[50, 6, 3], [50, 34, 2.4], [50, 60, 2.4], [50, 92, 2.6], [12, 44, 2.4], [88, 40, 2.4]], edges: [[0, 1], [1, 2], [2, 3], [4, 1], [1, 5]] },
];

export function Constellation({ name, className, delay = 0 }: { name: string; className?: string; delay?: number }) {
  const c = CONSTELLATIONS.find((x) => x.key === name) ?? CONSTELLATIONS[0];
  return (
    <motion.div
      aria-hidden
      className={className}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, delay }}
    >
      <motion.svg viewBox="-5 -5 110 110" className="h-full w-full overflow-visible" animate={{ y: [0, -8, 0] }} transition={{ duration: 9 + delay * 3, repeat: Infinity, ease: "easeInOut" }}>
        {c.edges.map(([a, b], i) => (
          <motion.line
            key={i}
            x1={c.stars[a][0]} y1={c.stars[a][1]} x2={c.stars[b][0]} y2={c.stars[b][1]}
            stroke="rgba(245,194,66,0.45)" strokeWidth="0.6"
            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
            transition={{ duration: 0.8, delay: delay + 0.3 + i * 0.15 }}
          />
        ))}
        {c.stars.map(([x, y, s], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r={s * 1.8} fill="rgba(245,194,66,0.12)" />
            <motion.circle cx={x} cy={y} r={s} fill="#fff4cf" animate={{ opacity: [0.5, 1, 0.5], r: [s, s * 1.25, s] }} transition={{ duration: 2.5 + (i % 3), repeat: Infinity, delay: i * 0.3 }} />
          </g>
        ))}
        <text x="50" y="112" textAnchor="middle" fontSize="6" fill="rgba(249,220,140,0.65)" fontFamily="Noto Sans Devanagari, Poppins, sans-serif">
          {c.name.hi} · {c.name.en}
        </text>
      </motion.svg>
    </motion.div>
  );
}

/** Decorative constellations for the empty spaces around the home page. */
export default function ConstellationBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <Constellation name="orion" className="absolute left-[3%] top-[18%] hidden w-40 opacity-80 lg:block" />
      <Constellation name="ursa" className="absolute right-[4%] top-[30%] hidden w-48 opacity-80 lg:block" delay={0.2} />
      <Constellation name="cassiopeia" className="absolute left-[6%] top-[46%] w-32 opacity-70 md:w-40" delay={0.1} />
      <Constellation name="scorpius" className="absolute right-[6%] top-[58%] hidden w-36 opacity-70 md:block" delay={0.3} />
      <Constellation name="leo" className="absolute left-[8%] top-[72%] hidden w-44 opacity-70 lg:block" delay={0.2} />
      <Constellation name="cygnus" className="absolute right-[10%] top-[84%] w-28 opacity-70 md:w-36" delay={0.15} />
    </div>
  );
}
