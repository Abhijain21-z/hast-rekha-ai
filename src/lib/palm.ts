/**
 * Rule-based Hast Rekha (palmistry) report engine.
 *
 * Deterministic: the same person (name + birth data + palm image fingerprint)
 * always receives the same reading. Content lives in src/content/palm-*.json
 * and can be edited without touching this file.
 */
import anatomyJson from "@/content/palm-anatomy.json";
import signsJson from "@/content/palm-signs.json";
import sectionsJson from "@/content/palm-sections.json";
import pastJson from "@/content/past.json";
import type { AstroResult } from "./astrology";
import type { Bi, Lang } from "./i18n";
import { hashString, nakshatraAt, rashiAt } from "./content";

export type Area = "career" | "love" | "health" | "wealth" | "family" | "spirituality" | "travel" | "fame";
export const AREAS: Area[] = ["career", "love", "health", "wealth", "family", "spirituality", "travel", "fame"];
export type Element = "Fire" | "Earth" | "Air" | "Water";
type Variant = { label: Bi; text: Bi };

export interface LineDef { key: string; area: Area; name: Bi; location: Bi; meaning: Bi; variants: Variant[] }
export interface MountDef { key: string; area: Area; name: Bi; meaning: Bi; variants: Variant[] }
interface Anatomy {
  lines: LineDef[];
  mounts: MountDef[];
  shapes: Record<Element, { name: Bi; text: Bi }>;
  fingers: Variant[];
  knuckles: Variant[];
  thumb: Variant[];
}
interface Signs { positive: { key: string; name: Bi; text: Bi }[]; caution: { key: string; name: Bi; text: Bi; remedy: Bi }[] }
export type Visual = "radar" | "meter" | "range" | "bars" | "graph";
export interface SectionDef { key: string; icon: string; area: Area | null; visual: Visual; title: Bi; variants: Bi[][] }
interface Sections { sections: SectionDef[]; elementNotes: Record<string, Record<Element, Bi>>; suggestions: Bi[] }
interface Past { always: Bi[]; optional: Bi[] }

export const ANATOMY = anatomyJson as Anatomy;
const SIGNS = signsJson as Signs;
const SECTIONS = sectionsJson as Sections;
const PAST = pastJson as Past;

export interface PalmReport {
  seed: number;
  element: Element;
  age: number;
  birthYear: number;
  lifePath: number;
  shape: { name: Bi; text: Bi };
  lines: { def: LineDef; variant: Variant; strength: number }[];
  mounts: { def: MountDef; variant: Variant; strength: number }[];
  fingers: Variant;
  knuckles: Variant;
  thumb: Variant;
  signs: { key: string; name: Bi; text: Bi }[];
  cautions: { key: string; name: Bi; text: Bi; remedy: Bi }[];
  scores: Record<Area, number>;
  timing: {
    moneyStart: [number, number];
    peak1: [number, number];
    peak2: [number, number];
    marriage: [number, number];
    travelAges: number[];
    luckyAges: number[];
    turning: { age: number; label: Bi }[];
  };
  vars: Record<Lang, Record<string, string>>;
  sections: { def: SectionDef; paragraphs: Bi[] }[];
  suggestions: Bi[];
  past: Bi[];
  graph: { age: number; value: number }[];
  decades: { label: string; value: number }[];
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));
const gauss = (x: number, s: number) => Math.exp(-(x * x) / (2 * s * s));

function lifePathNumber(date: string) {
  let n = date.replace(/\D/g, "").split("").reduce((a, c) => a + Number(c), 0);
  while (n > 9) n = String(n).split("").reduce((a, c) => a + Number(c), 0);
  return n || 9;
}

const BASE_SCORES: Record<Element, Record<Area, number>> = {
  Fire: { career: 84, love: 74, health: 78, wealth: 76, family: 72, spirituality: 70, travel: 82, fame: 86 },
  Earth: { career: 82, love: 78, health: 80, wealth: 88, family: 84, spirituality: 68, travel: 64, fame: 72 },
  Air: { career: 80, love: 80, health: 72, wealth: 74, family: 74, spirituality: 76, travel: 86, fame: 78 },
  Water: { career: 74, love: 88, health: 70, wealth: 72, family: 86, spirituality: 90, travel: 72, fame: 74 },
};

const MARRIAGE: Record<Element, [number, number][]> = {
  Fire: [[24, 27], [26, 29]],
  Earth: [[25, 28], [27, 30]],
  Air: [[26, 29], [28, 31]],
  Water: [[23, 26], [25, 28]],
};
const MONEY_START: [number, number][] = [[21, 23], [23, 25], [25, 27]];
const PEAK1: [number, number][] = [[32, 36], [34, 38], [36, 40]];
const PEAK2: [number, number][] = [[44, 50], [46, 52], [48, 54]];
const TURNING: { age: number; label: Bi }[] = [
  { age: 29, label: { en: "Saturn return", hi: "शनि पुनरागमन" } },
  { age: 36, label: { en: "Jupiter cycle", hi: "गुरु चक्र" } },
  { age: 42, label: { en: "Mid-life rise", hi: "मध्य-जीवन उत्थान" } },
  { age: 48, label: { en: "Jupiter cycle", hi: "गुरु चक्र" } },
  { age: 58, label: { en: "Second Saturn return", hi: "द्वितीय शनि पुनरागमन" } },
  { age: 66, label: { en: "Wisdom phase", hi: "ज्ञान काल" } },
  { age: 72, label: { en: "Jupiter cycle", hi: "गुरु चक्र" } },
];

function fill(t: Bi, vars: Record<Lang, Record<string, string>>): Bi {
  const rep = (s: string, lang: Lang) => s.replace(/\{(\w+)\}/g, (_, k: string) => vars[lang][k] ?? `{${k}}`);
  return { en: rep(t.en, "en"), hi: rep(t.hi, "hi") };
}

export interface PalmInput {
  fullName: string;
  birthDate: string;
  birthTime: string;
  palmImage?: string | null;
  result: AstroResult;
  now?: Date;
}

export function buildPalmReport(input: PalmInput): PalmReport {
  const { fullName, birthDate, birthTime, result } = input;
  const now = input.now ?? new Date();
  const palmSeed = input.palmImage ? hashString(input.palmImage.slice(0, 4000) + input.palmImage.length) : 0;
  const seed = hashString(`${fullName.trim().toLowerCase()}|${birthDate}|${birthTime}|${palmSeed}`);
  const rng = mulberry32(seed);

  const rashi = rashiAt(result.moonRashi);
  const nak = nakshatraAt(result.nakshatra);
  const lagna = rashiAt(result.lagna);
  const element = (rashi.element.en as Element) || "Earth";
  const birthYear = Number(birthDate.slice(0, 4)) || now.getUTCFullYear();
  const birthMonth = Number(birthDate.slice(5, 7)) || 1;
  const age = Math.max(0, now.getUTCFullYear() - birthYear - (now.getUTCMonth() + 1 < birthMonth ? 1 : 0));
  const lifePath = lifePathNumber(birthDate);

  // ---- scores -------------------------------------------------------------
  const scores = {} as Record<Area, number>;
  for (const a of AREAS) scores[a] = clamp(Math.round(BASE_SCORES[element][a] + (rng() - 0.5) * 14), 56, 97);

  // ---- timing -------------------------------------------------------------
  const idx = Math.floor(rng() * 3);
  const moneyStart = MONEY_START[element === "Earth" ? Math.min(idx, 1) : idx];
  const peak1 = PEAK1[idx];
  const peak2 = PEAK2[idx];
  const marriage = MARRIAGE[element][Math.floor(rng() * 2)];
  const travelPool = [[19, 23], [27, 33], [38, 45]];
  const travelAges = travelPool.map(([a, b]) => a + Math.floor(rng() * (b - a + 1))).filter((_, i) => i !== (rng() < 0.5 ? 0 : 2));

  const luckySet = new Set<number>();
  for (let a = lifePath; a <= 84; a += 9) luckySet.add(a);
  [12, 24, 36, 48, 60, 72].forEach((a) => luckySet.add(a));
  const allLucky = [...luckySet].sort((a, b) => a - b);
  let luckyAges = allLucky.filter((a) => a >= age - 1).slice(0, 4);
  if (luckyAges.length < 4) luckyAges = allLucky.slice(-4);
  let turning = TURNING.filter((t) => t.age >= age - 1).slice(0, 2);
  if (turning.length < 2) turning = TURNING.slice(-2);

  // ---- placeholders -------------------------------------------------------
  const yr = (a: number) => birthYear + a;
  const range = (lang: Lang, [a, b]: [number, number]) => (lang === "hi" ? `${a}–${b} वर्ष (${yr(a)}–${yr(b)})` : `age ${a}–${b} (${yr(a)}–${yr(b)})`);
  const turn = (lang: Lang, t: { age: number; label: Bi }) => (lang === "hi" ? `${t.age}–${t.age + 1} वर्ष (${yr(t.age)}–${yr(t.age + 1)}, ${t.label.hi})` : `age ${t.age}–${t.age + 1} (${yr(t.age)}–${yr(t.age + 1)}, ${t.label.en})`);
  const vars: Record<Lang, Record<string, string>> = { en: {}, hi: {} };
  const shape = ANATOMY.shapes[element];
  for (const lang of ["en", "hi"] as const) {
    vars[lang] = {
      name: fullName.trim().split(/\s+/)[0],
      rashi: rashi.short[lang],
      element: rashi.element[lang],
      lord: rashi.lord[lang],
      nakshatra: nak.name[lang],
      lagna: lagna.short[lang],
      shape: shape.name[lang],
      gem: rashi.lucky.gem[lang],
      color: rashi.lucky.color[lang],
      day: rashi.lucky.day[lang],
      mantra: rashi.lucky.mantra,
      moneyStart: range(lang, moneyStart),
      peak1: range(lang, peak1),
      peak2: range(lang, peak2),
      marriage: range(lang, marriage),
      travelYears: travelAges.map((a) => `${yr(a)}`).join(lang === "hi" ? " व " : " & "),
      luckyYears: luckyAges.map((a) => `${yr(a)}`).join(", "),
      turning1: turn(lang, turning[0]),
      turning2: turn(lang, turning[1]),
      t1: String(age >= 30 ? 22 : age >= 20 ? 15 : 8),
      t2: String(age >= 30 ? 27 : age >= 20 ? 19 : 12),
    };
  }

  // ---- palm anatomy -------------------------------------------------------
  const lines = ANATOMY.lines.map((def) => {
    const strength = clamp(Math.round(0.55 * scores[def.area] + 45 * rng()), 52, 98);
    return { def, variant: def.variants[strength >= 72 ? 0 : 1], strength };
  });
  const mounts = ANATOMY.mounts.map((def) => {
    const strength = clamp(Math.round(0.5 * scores[def.area] + 50 * rng()), 50, 98);
    return { def, variant: def.variants[strength >= 70 ? 0 : 1], strength };
  });
  const fingers = ANATOMY.fingers[element === "Air" || element === "Water" ? (rng() < 0.7 ? 0 : 1) : rng() < 0.6 ? 2 : 1];
  const knuckles = ANATOMY.knuckles[rng() < 0.55 ? 0 : 1];
  const thumb = ANATOMY.thumb[scores.career >= 82 ? 0 : rng() < 0.5 ? 1 : 2];

  const shuffled = [...SIGNS.positive].sort(() => rng() - 0.5);
  const signs = shuffled.slice(0, 3);
  if (!signs.some((s) => s.key === "square")) signs[2] = SIGNS.positive.find((s) => s.key === "square")!;
  const cautions = [...SIGNS.caution].sort(() => rng() - 0.5).slice(0, rng() < 0.5 ? 1 : 2);

  // ---- sections -----------------------------------------------------------
  const sections = SECTIONS.sections.map((def) => {
    const v = def.variants[Math.floor(rng() * def.variants.length)];
    const paragraphs = v.map((p) => fill(p, vars));
    const note = SECTIONS.elementNotes[def.key]?.[element];
    if (note) paragraphs.push(fill(note, vars));
    return { def, paragraphs };
  });
  const suggestions = SECTIONS.suggestions.map((s) => fill(s, vars));

  // ---- past ---------------------------------------------------------------
  const optional = [...PAST.optional].sort(() => rng() - 0.5).slice(0, 3);
  const past = [...PAST.always, ...optional].map((p) => fill(p, vars));

  // ---- graph --------------------------------------------------------------
  const mid = ([a, b]: [number, number]) => (a + b) / 2;
  const graph: { age: number; value: number }[] = [];
  for (let a = 0; a <= 80; a += 2) {
    let v = 40 + a * 0.55 - Math.max(0, a - 58) * 0.45;
    for (const l of allLucky) v += 11 * gauss(a - l, 2.6);
    v += 9 * gauss(a - mid(peak1), 3.5) + 11 * gauss(a - mid(peak2), 3.5);
    v -= 7 * gauss(a - 29, 2.2) + 4 * gauss(a - 42, 1.8);
    v += (rng() - 0.5) * 4;
    graph.push({ age: a, value: Math.round(clamp(v, 15, 98)) });
  }
  const decadeFactor = [0.45, 0.72, 0.92, 1, 0.9];
  const decades = ["20s", "30s", "40s", "50s", "60s"].map((label, i) => {
    const slice = graph.filter((g) => g.age >= 20 + i * 10 && g.age < 30 + i * 10);
    const avg = slice.reduce((s, g) => s + g.value, 0) / Math.max(1, slice.length);
    return { label, value: Math.round(clamp(0.45 * avg + 0.55 * scores.wealth * decadeFactor[i] + (rng() - 0.5) * 6, 20, 98)) };
  });

  return {
    seed, element, age, birthYear, lifePath, shape, lines, mounts, fingers, knuckles, thumb, signs, cautions, scores,
    timing: { moneyStart, peak1, peak2, marriage, travelAges, luckyAges, turning },
    vars, sections, suggestions, past, graph, decades,
  };
}
