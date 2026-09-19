/**
 * Typed accessors for the local JSON content database in `src/content`.
 * Edit the JSON files to change predictions — no code changes required.
 */
import rashisJson from "@/content/rashis.json";
import nakshatrasJson from "@/content/nakshatras.json";
import panchangJson from "@/content/panchang.json";
import palmistryJson from "@/content/palmistry.json";
import dailyJson from "@/content/daily.json";
import citiesJson from "@/content/cities.json";
import type { Bi, Lang } from "./i18n";
import type { AstroResult } from "./astrology";

export type PredictionKey = "career" | "love" | "health" | "finance";
export interface Rashi {
  key: string;
  symbol: string;
  name: Bi;
  short: Bi;
  dates: string;
  element: Bi;
  lord: Bi;
  quality: Bi;
  traits: { en: string[]; hi: string[] };
  lucky: { color: Bi; number: number; day: Bi; gem: Bi; mantra: string };
  predictions: Record<PredictionKey, Bi>;
}
export interface Nakshatra { key: string; name: Bi; lord: Bi; deity: Bi; symbol: Bi; trait: Bi }
export interface PalmLine { key: string; name: Bi; location: Bi; meaning: Bi; variants: { label: Bi; text: Bi }[] }
export interface City { name: string; region: string; lat: number; lng: number; tz: number }

export const RASHIS = rashisJson as Rashi[];
export const NAKSHATRAS = nakshatrasJson as Nakshatra[];
export const PANCHANG = panchangJson as {
  tithis: { en: string[]; hi: string[] };
  paksha: { shukla: Bi; krishna: Bi };
  yogas: { en: string[]; hi: string[] };
  weekdays: { en: string[]; hi: string[] };
};
export const PALMISTRY = palmistryJson as {
  intro: Bi;
  lines: PalmLine[];
  summaryTemplates: Bi[];
  tips: { en: string[]; hi: string[] };
};
export const DAILY = dailyJson as { messages: Bi[]; moods: Bi[] };
export const CITIES: City[] = (citiesJson as [string, string, number, number, number][]).map(
  ([name, region, lat, lng, tz]) => ({ name, region, lat, lng, tz }),
);

export const rashiAt = (i: number) => RASHIS[((i % 12) + 12) % 12];
export const nakshatraAt = (i: number) => NAKSHATRAS[((i % 27) + 27) % 27];

export function tithiName(tithi: number, lang: Lang): string {
  const list = PANCHANG.tithis[lang === "hi" ? "hi" : "en"];
  if (tithi === 15) return list[14];
  if (tithi === 30) return list[15];
  return list[(tithi - 1) % 15];
}

export function searchCities(q: string, limit = 8): City[] {
  const s = q.trim().toLowerCase();
  if (!s) return [];
  const starts = CITIES.filter((c) => c.name.toLowerCase().startsWith(s));
  const contains = CITIES.filter(
    (c) => !c.name.toLowerCase().startsWith(s) && (c.name.toLowerCase().includes(s) || c.region.toLowerCase().includes(s)),
  );
  return [...starts, ...contains].slice(0, limit);
}

/** Small deterministic hash so palm "variants" are stable for the same person. */
export function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export interface PalmAnalysis {
  lines: { line: PalmLine; variant: { label: Bi; text: Bi } }[];
  summary: Bi;
}

export function analysePalm(seed: string, fullName: string, result: AstroResult): PalmAnalysis {
  const h = hashString(seed);
  const rashi = rashiAt(result.moonRashi);
  const lines = PALMISTRY.lines.map((line, i) => {
    const idx = (h >>> (i * 3)) % line.variants.length;
    return { line, variant: line.variants[idx] };
  });
  const tpl = PALMISTRY.summaryTemplates[h % PALMISTRY.summaryTemplates.length];
  const fill = (lang: Lang) => {
    const c = lang === "hi" ? "hi" : "en";
    return tpl[c]
      .replace("{name}", fullName.split(" ")[0])
      .replace("{rashi}", rashi.short[c])
      .replace("{element}", rashi.element[c]);
  };
  return { lines, summary: { en: fill("en"), hi: fill("hi") } };
}

export interface DailyHoroscope { message: Bi; mood: Bi; luckyNumber: number; luckyColor: Bi; date: string }

export function dailyHoroscope(rashiIndex: number, date = new Date()): DailyHoroscope {
  const start = Date.UTC(date.getUTCFullYear(), 0, 0);
  const dayOfYear = Math.floor((Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) - start) / 86400000);
  const rashi = rashiAt(rashiIndex);
  const msgIdx = (dayOfYear * 7 + rashiIndex * 5) % DAILY.messages.length;
  const moodIdx = (dayOfYear + rashiIndex * 3) % DAILY.moods.length;
  return {
    message: DAILY.messages[msgIdx],
    mood: DAILY.moods[moodIdx],
    luckyNumber: ((dayOfYear + rashiIndex * rashi.lucky.number) % 9) + 1,
    luckyColor: rashi.lucky.color,
    date: date.toISOString().slice(0, 10),
  };
}

const ELEMENT_INDEX: Record<string, number> = { Fire: 0, Earth: 1, Air: 2, Water: 3 };
// Fire, Earth, Air, Water
const ELEMENT_MATRIX = [
  [88, 58, 84, 52],
  [58, 86, 54, 84],
  [84, 54, 86, 58],
  [52, 84, 58, 90],
];

/** Rule-based Rashi compatibility (element harmony + lordship + axis). Returns 0-100. */
export function compatibility(a: number, b: number): { score: number; band: number } {
  const ra = rashiAt(a);
  const rb = rashiAt(b);
  let score = ELEMENT_MATRIX[ELEMENT_INDEX[ra.element.en]][ELEMENT_INDEX[rb.element.en]];
  if (ra.lord.en === rb.lord.en) score += 4;
  const diff = Math.abs(a - b) % 12;
  if (diff === 6) score += 4; // 7th-house axis: natural partners
  if (diff === 5 || diff === 7) score -= 6; // 6/8 axis: friction
  if (diff === 0) score -= 2;
  score = Math.max(35, Math.min(98, score));
  const band = score >= 85 ? 3 : score >= 72 ? 2 : score >= 58 ? 1 : 0;
  return { score, band };
}
