import { mkdirSync, writeFileSync } from "fs";

const out = "public/images";
mkdirSync(out, { recursive: true });

const stars = (n, w, h, seed = 1) => {
  let s = "";
  let r = seed;
  const rnd = () => (r = (r * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < n; i++) {
    const x = (rnd() * w).toFixed(1);
    const y = (rnd() * h).toFixed(1);
    const rad = (rnd() * 1.6 + 0.4).toFixed(2);
    const o = (rnd() * 0.7 + 0.25).toFixed(2);
    s += `<circle cx="${x}" cy="${y}" r="${rad}" fill="#f5c242" opacity="${o}"/>`;
  }
  return s;
};

const BG = (w, h, id, c1 = "#0b0620", c2 = "#1a0f38", c3 = "#060314") =>
  `<defs><radialGradient id="${id}" cx="50%" cy="38%" r="80%">
    <stop offset="0%" stop-color="${c2}"/><stop offset="55%" stop-color="${c1}"/><stop offset="100%" stop-color="${c3}"/>
  </radialGradient>
  <linearGradient id="${id}g" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#f8d678"/><stop offset="50%" stop-color="#f5c242"/><stop offset="100%" stop-color="#b8860b"/>
  </linearGradient></defs>
  <rect width="${w}" height="${h}" fill="url(#${id})"/>`;

const wrap = (w, h, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`;

// ---- ganesh (600x600) ----
{
  const w = 600, h = 600;
  const body = BG(w, h, "gan") + stars(60, w, h, 7) + `
  <g transform="translate(300,300)">
    <circle r="240" fill="none" stroke="#f5c242" stroke-width="2" opacity="0.35"/>
    <circle r="225" fill="none" stroke="#f5c242" stroke-width="1" opacity="0.2" stroke-dasharray="4 8"/>
    <g fill="url(#gang)" stroke="#7a5a10" stroke-width="2">
      <ellipse cx="0" cy="60" rx="120" ry="140"/>
      <circle cx="0" cy="-70" r="78"/>
      <path d="M-78,-95 Q-130,-140 -100,-185 Q-60,-150 -50,-100 Z"/>
      <path d="M78,-95 Q130,-140 100,-185 Q60,-150 50,-100 Z"/>
      <path d="M-20,-145 Q0,-190 20,-145 Q12,-120 0,-118 Q-12,-120 -20,-145 Z"/>
    </g>
    <g fill="#0b0620">
      <circle cx="-28" cy="-80" r="9"/><circle cx="28" cy="-80" r="9"/>
      <circle cx="-28" cy="-80" r="4" fill="#f5c242"/><circle cx="28" cy="-80" r="4" fill="#f5c242"/>
      <path d="M0,-64 Q0,-40 18,-30" fill="none" stroke="#0b0620" stroke-width="6" stroke-linecap="round"/>
      <path d="M-40,-55 Q-25,-42 0,-46 Q25,-42 40,-55" fill="none" stroke="#0b0620" stroke-width="5" stroke-linecap="round"/>
      <path d="M0,-34 L0,20" stroke="#0b0620" stroke-width="4"/>
    </g>
    <path d="M-120,40 Q-160,60 -150,110 Q-100,100 -90,60 Z" fill="url(#gang)" stroke="#7a5a10" stroke-width="2"/>
    <path d="M120,40 Q160,60 150,110 Q100,100 90,60 Z" fill="url(#gang)" stroke="#7a5a10" stroke-width="2"/>
    <circle cx="-160" cy="118" r="26" fill="url(#gang)" stroke="#7a5a10" stroke-width="2"/>
    <text x="0" y="270" text-anchor="middle" font-family="serif" font-size="44" fill="#f5c242">ॐ</text>
  </g>`;
  writeFileSync(`${out}/ganesh.svg`, wrap(w, h, body));
}

// ---- surya (600x600) ----
{
  const w = 600, h = 600;
  let rays = "";
  for (let i = 0; i < 24; i++) {
    const a = (i * 15 * Math.PI) / 180;
    const r1 = i % 2 ? 150 : 130, r2 = i % 2 ? 215 : 250;
    rays += `<line x1="${(300 + Math.cos(a) * r1).toFixed(1)}" y1="${(300 + Math.sin(a) * r1).toFixed(1)}" x2="${(300 + Math.cos(a) * r2).toFixed(1)}" y2="${(300 + Math.sin(a) * r2).toFixed(1)}" stroke="#f5c242" stroke-width="${i % 2 ? 2 : 4}" opacity="${i % 2 ? 0.5 : 0.8}"/>`;
  }
  const body = BG(w, h, "sur", "#2a1608", "#1a0f38", "#0a0500") + stars(50, w, h, 11) + rays + `
  <circle cx="300" cy="300" r="120" fill="url(#surg)"/>
  <circle cx="300" cy="300" r="120" fill="none" stroke="#fff3c4" stroke-width="3" opacity="0.8"/>
  <g stroke="#7a4a08" stroke-width="4" fill="none" stroke-linecap="round">
    <path d="M255,285 Q265,270 280,283"/><path d="M320,283 Q335,270 345,285"/>
    <path d="M262,330 Q300,355 338,330"/>
  </g>
  <circle cx="300" cy="300" r="175" fill="none" stroke="#f5c242" stroke-width="1.5" opacity="0.4" stroke-dasharray="2 10"/>`;
  writeFileSync(`${out}/surya.svg`, wrap(w, h, body));
}

// ---- hand-glow (transparent, golden hand outline, 500x700) ----
{
  const w = 500, h = 700;
  const palm = `
  <g fill="none" stroke="url(#hgG)" stroke-linecap="round">
    <path d="M250,640 C160,640 120,560 118,480 L112,360 C110,330 140,325 148,352 L165,410 C170,420 182,418 180,405 L165,250 C160,215 195,208 202,242 L220,350 C226,360 238,358 236,345 L220,160 C216,120 255,115 261,155 L278,340 C284,350 295,349 296,338 L292,120 C290,80 330,80 332,120 L336,345 C338,356 350,356 354,344 L378,220 C386,185 420,195 410,230 L375,420 C370,440 380,448 392,432 L420,390 C438,365 465,385 450,412 L400,510 C365,595 320,640 250,640 Z" stroke-width="7"/>
    <path d="M160,470 Q250,430 350,455" stroke-width="3.5" opacity="0.9"/>
    <path d="M155,520 Q250,495 345,510" stroke-width="3.5" opacity="0.9"/>
    <path d="M230,560 Q280,520 330,545" stroke-width="3.5" opacity="0.9"/>
  </g>`;
  const body = `<defs>
    <linearGradient id="hgG" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#fff0b8"/><stop offset="60%" stop-color="#f5c242"/><stop offset="100%" stop-color="#c8901c"/>
    </linearGradient>
    <filter id="glow"><feGaussianBlur stdDeviation="9" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <rect width="${w}" height="${h}" fill="none"/>
  <g filter="url(#glow)">${palm}</g>`;
  writeFileSync(`${out}/hand-glow.svg`, wrap(w, h, body));
}

// ---- golden-hand (800x1200 hero) ----
{
  const w = 800, h = 1200;
  const body = BG(w, h, "gh", "#12082e", "#241452", "#070318") + stars(120, w, h, 3) + `
  <circle cx="400" cy="560" r="430" fill="none" stroke="#f5c242" stroke-width="1.5" opacity="0.3"/>
  <circle cx="400" cy="560" r="400" fill="none" stroke="#f5c242" stroke-width="1" opacity="0.2" stroke-dasharray="3 12"/>
  <g transform="translate(120,220) scale(1.15)">
    <g fill="none" stroke="url(#ghg)" stroke-linecap="round">
      <path d="M250,640 C160,640 120,560 118,480 L112,360 C110,330 140,325 148,352 L165,410 C170,420 182,418 180,405 L165,250 C160,215 195,208 202,242 L220,350 C226,360 238,358 236,345 L220,160 C216,120 255,115 261,155 L278,340 C284,350 295,349 296,338 L292,120 C290,80 330,80 332,120 L336,345 C338,356 350,356 354,344 L378,220 C386,185 420,195 410,230 L375,420 C370,440 380,448 392,432 L420,390 C438,365 465,385 450,412 L400,510 C365,595 320,640 250,640 Z" stroke-width="7"/>
      <path d="M160,470 Q250,430 350,455" stroke-width="3.5"/>
      <path d="M155,520 Q250,495 345,510" stroke-width="3.5"/>
      <path d="M230,560 Q280,520 330,545" stroke-width="3.5"/>
    </g>
    <circle cx="250" cy="490" r="6" fill="#f5c242"/><circle cx="300" cy="500" r="5" fill="#f5c242"/>
  </g>
  <text x="400" y="1130" text-anchor="middle" font-family="serif" font-size="52" fill="url(#ghg)">ॐ</text>`;
  writeFileSync(`${out}/golden-hand.svg`, wrap(w, h, body));
}

// ---- cosmic-palm (800x800) ----
{
  const w = 800, h = 800;
  let zodiac = "";
  for (let i = 0; i < 12; i++) {
    const a = ((i * 30 - 90) * Math.PI) / 180;
    const x = (400 + Math.cos(a) * 300).toFixed(1), y = (400 + Math.sin(a) * 300).toFixed(1);
    zodiac += `<circle cx="${x}" cy="${y}" r="34" fill="#1a0f38" stroke="#f5c242" stroke-width="1.5"/>
    <text x="${x}" y="${+y + 10}" text-anchor="middle" font-size="26" fill="#f5c242" font-family="serif">${["मेष","वृष","मिथुन","कर्क","सिंह","कन्या","तुला","वृश्चिक","धनु","मकर","कुम्भ","मीन"][i]}</text>`;
  }
  const body = BG(w, h, "cp", "#100726", "#221040", "#050210") + stars(90, w, h, 5) + `
  <circle cx="400" cy="400" r="300" fill="none" stroke="#f5c242" stroke-width="1.5" opacity="0.4"/>
  ${zodiac}
  <g transform="translate(280,240) scale(0.42)" fill="none" stroke="url(#cpg)" stroke-linecap="round">
    <path d="M250,640 C160,640 120,560 118,480 L112,360 C110,330 140,325 148,352 L165,410 C170,420 182,418 180,405 L165,250 C160,215 195,208 202,242 L220,350 C226,360 238,358 236,345 L220,160 C216,120 255,115 261,155 L278,340 C284,350 295,349 296,338 L292,120 C290,80 330,80 332,120 L336,345 C338,356 350,356 354,344 L378,220 C386,185 420,195 410,230 L375,420 C370,440 380,448 392,432 L420,390 C438,365 465,385 450,412 L400,510 C365,595 320,640 250,640 Z" stroke-width="9"/>
    <path d="M160,470 Q250,430 350,455" stroke-width="4"/>
    <path d="M155,520 Q250,495 345,510" stroke-width="4"/>
  </g>`;
  writeFileSync(`${out}/cosmic-palm.svg`, wrap(w, h, body));
}

// ---- blog images (1200x675) ----
const blogBg = (id) => BG(1200, 675, id, "#0e0626", "#1e1040", "#050210") + stars(70, 1200, 675, 9) +
  `<circle cx="600" cy="337" r="290" fill="none" stroke="#f5c242" stroke-width="1.2" opacity="0.25"/>
   <circle cx="600" cy="337" r="260" fill="none" stroke="#f5c242" stroke-width="0.8" opacity="0.15" stroke-dasharray="3 10"/>`;

const hand = (tx, ty, s) => `
  <g transform="translate(${tx},${ty}) scale(${s})" fill="none" stroke="url(#bg)" stroke-linecap="round">
    <path d="M250,640 C160,640 120,560 118,480 L112,360 C110,330 140,325 148,352 L165,410 C170,420 182,418 180,405 L165,250 C160,215 195,208 202,242 L220,350 C226,360 238,358 236,345 L220,160 C216,120 255,115 261,155 L278,340 C284,350 295,349 296,338 L292,120 C290,80 330,80 332,120 L336,345 C338,356 350,356 354,344 L378,220 C386,185 420,195 410,230 L375,420 C370,440 380,448 392,432 L420,390 C438,365 465,385 450,412 L400,510 C365,595 320,640 250,640 Z" stroke-width="8"/>
    <path d="M160,470 Q250,430 350,455" stroke-width="4"/>
    <path d="M155,520 Q250,495 345,510" stroke-width="4"/>
  </g>`;

{
  let planets = "";
  for (let i = 0; i < 9; i++) {
    const a = ((i * 40 - 90) * Math.PI) / 180;
    planets += `<circle cx="${(600 + Math.cos(a) * 220).toFixed(1)}" cy="${(337 + Math.sin(a) * 220).toFixed(1)}" r="${14 + (i % 3) * 6}" fill="url(#bg)" opacity="0.9"/>`;
  }
  const body = blogBg("b1") + planets + `<text x="600" y="370" text-anchor="middle" font-family="serif" font-size="120" fill="url(#bg)" opacity="0.95">ॐ</text>`;
  writeFileSync(`${out}/blog-graha.svg`, wrap(1200, 675, body));
}
{
  const body = blogBg("b2") + hand(330, 60, 0.85) +
    `<g stroke="#f5c242" stroke-width="3" fill="none" opacity="0.85">
      <path d="M430,470 L430,300 M430,300 L410,270 M430,300 L450,270"/>
      <path d="M470,470 L470,260 M470,260 L450,230 M470,260 L490,230"/>
    </g>`;
  writeFileSync(`${out}/blog-palm.svg`, wrap(1200, 675, body));
}
{
  let gems = "";
  const cols = ["#c0392b", "#1e5aa8", "#27ae60", "#f1c40f", "#8e44ad", "#e67e22", "#16a085", "#e74c8b", "#34495e", "#d4ac0d"];
  cols.forEach((c, i) => {
    const x = 180 + (i % 5) * 180, y = i < 5 ? 300 : 470;
    gems += `<g transform="translate(${x},${y}) rotate(45)"><rect x="-34" y="-34" width="68" height="68" rx="10" fill="${c}" stroke="#f8d678" stroke-width="3"/><rect x="-20" y="-20" width="24" height="24" rx="5" fill="#ffffff" opacity="0.35"/></g>`;
  });
  const body = blogBg("b3") + gems;
  writeFileSync(`${out}/blog-ratna.svg`, wrap(1200, 675, body));
}
{
  const body = blogBg("b4") + `
  <text x="600" y="300" text-anchor="middle" font-family="serif" font-size="150" fill="url(#bg)">ॐ</text>
  <text x="600" y="480" text-anchor="middle" font-family="serif" font-size="56" fill="#f5c242" opacity="0.9">॥ मंत्र ॥</text>`;
  writeFileSync(`${out}/blog-upay.svg`, wrap(1200, 675, body));
}
{
  let ring = "";
  const signs = ["♈","♉","♊","♋","♌","♍","♎","♏","♐","♑","♒","♓"];
  for (let i = 0; i < 12; i++) {
    const a = ((i * 30 - 90) * Math.PI) / 180;
    const x = (600 + Math.cos(a) * 230).toFixed(1), y = (337 + Math.sin(a) * 230).toFixed(1);
    ring += `<circle cx="${x}" cy="${y}" r="30" fill="#1a0f38" stroke="#f5c242" stroke-width="1.5"/>
    <text x="${x}" y="${+y + 10}" text-anchor="middle" font-size="26" fill="#f5c242">${signs[i]}</text>`;
  }
  const body = blogBg("b5") + ring + `<circle cx="600" cy="337" r="60" fill="url(#bg)" opacity="0.95"/><text x="600" y="355" text-anchor="middle" font-size="48" fill="#1a0f38">☉</text>`;
  writeFileSync(`${out}/blog-rashi.svg`, wrap(1200, 675, body));
}

console.log("done");
