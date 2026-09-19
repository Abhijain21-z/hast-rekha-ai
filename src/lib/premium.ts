/**
 * Premium 5-year roadmap builder — deterministic per reading.
 * Content lives in src/content/premium.json.
 */
import premiumJson from "@/content/premium.json";
import type { Bi, Lang } from "./i18n";
import type { PalmReport } from "./palm";
import { hashString, rashiAt } from "./content";
import type { AstroResult } from "./astrology";

interface YearBlock { theme: Bi; events: Bi; mistakes: Bi; upay: Bi; stotra: Bi }
interface PremiumContent {
  title: Bi;
  sub: Bi;
  perks: Bi[];
  fields: Record<string, Bi>;
  years: YearBlock[];
  gemVidhi: Bi;
  fingers: string[];
  fingersHi: string[];
  metals: string[];
  metalsHi: string[];
  months: string[];
  monthsHi: string[];
  closing: Bi;
}
const C = premiumJson as PremiumContent;

export const UPI_ID = "9522333669@jio";
export const UPI_PAYEE_NAME = "Hast Rekha AI";
export const PREMIUM_PRICE = 51;

export interface PremiumYear {
  calendarYear: number;
  ageRange: [number, number];
  theme: Bi;
  events: Bi;
  mistakes: Bi;
  upay: Bi;
  stotra: Bi;
}
export interface PremiumReport {
  years: PremiumYear[];
  fieldNote: Bi;
  gemNote: Bi;
  closing: Bi;
}

function fill(t: Bi, vars: Record<Lang, Record<string, string>>): Bi {
  const rep = (s: string, lang: Lang) => s.replace(/\{(\w+)\}/g, (_, k: string) => vars[lang][k] ?? "");
  return { en: rep(t.en, "en"), hi: rep(t.hi, "hi") };
}

export function upiDeepLink(readingId: string) {
  const params = new URLSearchParams({
    pa: UPI_ID,
    pn: UPI_PAYEE_NAME,
    am: PREMIUM_PRICE.toFixed(2),
    cu: "INR",
    tn: `Premium 5-Year Report ${readingId.slice(0, 8)}`,
  });
  return `upi://pay?${params.toString()}`;
}

export function buildPremiumReport(input: { result: AstroResult; seed: number; fullName: string; birthYear: number; now?: Date }): PremiumReport {
  const { result, seed, birthYear } = input;
  const now = input.now ?? new Date();
  const startYear = now.getUTCFullYear() + 1;
  const startAge = startYear - birthYear;
  const rashi = rashiAt(result.moonRashi);
  const element = rashi.element.en;
  const iseed = (Math.floor(seed) >>> 0) || 7;
  const rng = (n: number) => {
    let a = (iseed ^ (n * 2654435761)) >>> 0;
    a = Math.imul(a ^ (a >>> 15), 2246822519) >>> 0;
    a = Math.imul(a ^ (a >>> 13), 3266489917) >>> 0;
    return ((a ^ (a >>> 16)) >>> 0) / 4294967296;
  };

  const years: PremiumYear[] = [];
  for (let i = 0; i < 5; i++) {
    // rotate themes so each year of the window has a distinct flavour
    const block = C.years[(i + (iseed % C.years.length)) % C.years.length];
    const monthIdx = Math.floor(rng(i + 11) * 12);
    const vars: Record<Lang, Record<string, string>> = {
      en: { month: C.months[monthIdx] },
      hi: { month: C.monthsHi[monthIdx] },
    };
    years.push({
      calendarYear: startYear + i,
      ageRange: [startAge + i, startAge + i + 1],
      theme: block.theme,
      events: fill(block.events, vars),
      mistakes: block.mistakes,
      upay: block.upay,
      stotra: block.stotra,
    });
  }

  const fingerIdx = iseed % 5;
  const metalIdx = Math.floor(rng(21) * 3);
  const gemVars: Record<Lang, Record<string, string>> = {
    en: { gem: rashi.lucky.gem.en, metal: C.metals[metalIdx], finger: C.fingers[fingerIdx], day: rashi.lucky.day.en, mantra: rashi.lucky.mantra },
    hi: { gem: rashi.lucky.gem.hi, metal: C.metalsHi[metalIdx], finger: C.fingersHi[fingerIdx], day: rashi.lucky.day.hi, mantra: rashi.lucky.mantra },
  };

  return {
    years,
    fieldNote: {
      en: `According to your ${rashi.element.en} nature, the best fields for you are: ${C.fields[element].en}.`,
      hi: `आपकी ${rashi.element.hi} प्रकृति के अनुसार आपके लिए सर्वोत्तम क्षेत्र हैं: ${C.fields[element].hi}।`,
    },
    gemNote: fill(C.gemVidhi, gemVars),
    closing: C.closing,
  };
}

export const PREMIUM_PERKS = C.perks;
export const PREMIUM_SEED = hashString;
