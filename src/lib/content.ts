/**
 * Typed accessors for the local JSON content database in `src/content`.
 * Edit the JSON files to change predictions — no code changes required.
 */
import rashisJson from "@/content/rashis.json";
import nakshatrasJson from "@/content/nakshatras.json";
import panchangJson from "@/content/panchang.json";
import palmistryJson from "@/content/palmistry.json";
import dailyJson from "@/content/daily.json";
import { byLang, type Bi, type Lang } from "./i18n";
import { localize } from "@/content/locales";
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
// The city autocomplete list lives in `./cities` so pages can load it lazily.

export const RASHIS = localize(rashisJson, "rashis") as Rashi[];
export const NAKSHATRAS = localize(nakshatrasJson, "nakshatras") as Nakshatra[];
export const PANCHANG = localize(panchangJson, "panchang") as {
  tithis: { en: string[]; hi: string[] };
  paksha: { shukla: Bi; krishna: Bi };
  yogas: { en: string[]; hi: string[] };
  weekdays: { en: string[]; hi: string[] };
};
export const PALMISTRY = localize(palmistryJson, "palmistry") as {
  intro: Bi;
  lines: PalmLine[];
  summaryTemplates: Bi[];
  tips: { en: string[]; hi: string[] };
};
export const DAILY = localize(dailyJson, "daily") as { messages: Bi[]; moods: Bi[] };

export const rashiAt = (i: number) => RASHIS[((i % 12) + 12) % 12];
export const nakshatraAt = (i: number) => NAKSHATRAS[((i % 27) + 27) % 27];

export function tithiName(tithi: number, lang: Lang): string {
  const list = byLang<string[]>(PANCHANG.tithis, lang);
  if (tithi === 15) return list[14];
  if (tithi === 30) return list[15];
  return list[(tithi - 1) % 15];
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
