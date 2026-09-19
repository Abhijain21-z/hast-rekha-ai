import { mkdirSync, writeFileSync } from "fs";

const out = "public/images/rishis";
mkdirSync(out, { recursive: true });

/** deterministic starfield */
const stars = (n, w, h, seed = 1) => {
  let s = "";
  let r = seed;
  const rnd = () => (r = (r * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < n; i++) {
    s += `<circle cx="${(rnd() * w).toFixed(1)}" cy="${(rnd() * h).toFixed(1)}" r="${(rnd() * 1.3 + 0.3).toFixed(2)}" fill="#f8d678" opacity="${(rnd() * 0.6 + 0.2).toFixed(2)}"/>`;
  }
  return s;
};

/**
 * A rishi: seated silhouette in profile-free bust form — head, tilak, long beard,
 * matted jata crown, rudraksha mala, folded hands. Distinct per-rishi accents below.
 */
const bust = (accent) => `
  <g transform="translate(300,318)">
    <!-- jata crown (matted hair coils) -->
    <g fill="${accent}" opacity="0.9">
      <circle cx="0" cy="-140" r="42"/>
      <circle cx="-38" cy="-118" r="26"/><circle cx="38" cy="-118" r="26"/>
      <circle cx="-20" cy="-166" r="20"/><circle cx="20" cy="-166" r="20"/>
      <circle cx="0" cy="-186" r="15"/>
    </g>
    <!-- head + neck -->
    <path d="M-46,-104 q46,-34 92,0 q6,52 -10,74 q-36,22 -72,0 q-16,-22 -10,-74 Z" fill="#e8b98a"/>
    <path d="M-30,-40 h60 v34 q-30,16 -60,0 Z" fill="#d9a476"/>
    <!-- beard -->
    <path d="M-46,-46 q10,96 46,120 q36,-24 46,-120 q-14,42 -46,50 q-32,-8 -46,-50 Z" fill="#efe6da" opacity="0.95"/>
    <!-- face features -->
    <g fill="#5a3a22">
      <ellipse cx="-17" cy="-88" rx="6" ry="3.4"/>
      <ellipse cx="17" cy="-88" rx="6" ry="3.4"/>
    </g>
    <path d="M-13,-70 q13,9 26,0" fill="none" stroke="#7a4a2a" stroke-width="3" stroke-linecap="round"/>
    <!-- tilak -->
    <path d="M0,-118 v30" stroke="${accent}" stroke-width="5" stroke-linecap="round"/>
    <circle cx="0" cy="-124" r="4.5" fill="${accent}"/>
    <!-- rudraksha mala -->
    <g fill="#8a5a2b">
      ${Array.from({ length: 13 }, (_, i) => {
        const a = (i / 13) * Math.PI;
        const x = -Math.cos(a) * 78;
        const y = 34 + Math.sin(a) * 62;
        return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="7.5"/>`;
      }).join("")}
      <circle cx="0" cy="96" r="11" fill="#a9702f"/>
    </g>
    <!-- shoulders / robe -->
    <path d="M-150,230 q150,-130 300,0 q-40,26 -300,0 Z" fill="#1a1038" opacity="0.98"/>
    <path d="M-118,230 q118,-108 236,0" fill="none" stroke="${accent}" stroke-width="4" opacity="0.7"/>
    <!-- folded hands -->
    <g fill="#e8b98a">
      <path d="M-44,150 q44,-30 88,0 q-10,40 -44,44 q-34,-4 -44,-44 Z"/>
    </g>
    <path d="M-44,150 q44,-30 88,0" fill="none" stroke="#c99566" stroke-width="3"/>
  </g>`;

const wrap = (w, h, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`;

const medallion = ({ id, accent, glow, glyph, seed, caption }) => {
  const w = 600, h = 700;
  const body = `<defs>
    <radialGradient id="${id}bg" cx="50%" cy="34%" r="76%">
      <stop offset="0%" stop-color="#241452"/><stop offset="58%" stop-color="#12083a"/><stop offset="100%" stop-color="#06030f"/>
    </radialGradient>
    <radialGradient id="${id}glow" cx="50%" cy="40%" r="55%">
      <stop offset="0%" stop-color="${glow}" stop-opacity="0.55"/><stop offset="100%" stop-color="${glow}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="${id}ring" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#fff0b8"/><stop offset="55%" stop-color="#f5c242"/><stop offset="100%" stop-color="#a9791a"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#${id}bg)"/>
  ${stars(70, w, h, seed)}
  <rect width="${w}" height="${h}" fill="url(#${id}glow)"/>
  <!-- halo rings -->
  <circle cx="300" cy="318" r="252" fill="none" stroke="url(#${id}ring)" stroke-width="3" opacity="0.85"/>
  <circle cx="300" cy="318" r="268" fill="none" stroke="url(#${id}ring)" stroke-width="1.2" opacity="0.4"/>
  <circle cx="300" cy="318" r="232" fill="none" stroke="#f5c242" stroke-width="1" opacity="0.25" stroke-dasharray="3 12"/>
  ${bust(accent)}
  <!-- attribute glyph badge -->
  <g transform="translate(300,606)">
    <circle r="46" fill="#0b0620" stroke="url(#${id}ring)" stroke-width="2.5"/>
    <text x="0" y="16" text-anchor="middle" font-family="'Segoe UI Symbol','Noto Sans Symbols',serif" font-size="46" fill="#f8d678">${glyph}</text>
  </g>
  <text x="300" y="686" text-anchor="middle" font-family="serif" font-size="26" fill="#f5c242" opacity="0.85">${caption}</text>`;
  return wrap(w, h, body);
};

const RISHIS = [
  { file: "agastya", accent: "#f5c242", glow: "#f5c242", glyph: "❋", seed: 21, caption: "अगस्त्य" },
  { file: "vashistha", accent: "#e8cf9a", glow: "#ffd982", glyph: "☸", seed: 31, caption: "वशिष्ठ" },
  { file: "vishwamitra", accent: "#ffb45a", glow: "#ff9a3c", glyph: "☀", seed: 41, caption: "विश्वामित्र" },
  { file: "jamadagni", accent: "#d98a4a", glow: "#ff7a2a", glyph: "⚔", seed: 51, caption: "जमदग्नि" },
  { file: "gautama", accent: "#a9d4ff", glow: "#5aa8ff", glyph: "⚖", seed: 61, caption: "गौतम" },
  { file: "bharadwaja", accent: "#9ee6a8", glow: "#4ddc6a", glyph: "❦", seed: 71, caption: "भरद्वाज" },
  { file: "atri", accent: "#c9a9ff", glow: "#9a5aff", glyph: "✦", seed: 81, caption: "अत्रि" },
  { file: "kashyapa", accent: "#f2b8d0", glow: "#ff7ac0", glyph: "☾", seed: 91, caption: "कश्यप" },
];

for (const r of RISHIS) writeFileSync(`${out}/${r.file}.svg`, medallion(r));

console.log(`done — ${RISHIS.length} rishi medallions`);
