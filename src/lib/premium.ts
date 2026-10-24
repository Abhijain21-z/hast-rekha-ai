/**
 * Premium 5-year roadmap builder — deterministic per reading.
 * Content lives in src/content/premium.json.
 */
import premiumJson from "@/content/premium.json";
import type { Bi, Lang } from "./i18n";
import type { PalmReport } from "./palm";
import { hashString, rashiAt } from "./content";
import type { AstroResult } from "./astrology";
import { PDF_PRICE, ULTRA_PRICE } from "./flags";

interface YearBlock { theme: Bi; events: Bi; mistakes: Bi; upay: Bi; stotra: Bi }
interface PremiumContent {
  title: Bi;
  sub: Bi;
  perks: Bi[];
  book: BookCopy;
  bookPerks: Bi[];
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

/**
 * One-line flavour for each mahadasha lord, used in the five-year roadmap.
 * Deliberately practical rather than fatalistic.
 */
const DASHA_THEME: Record<string, Bi> = {
  sun: { en: "visibility, authority and a test of ego", hi: "पहचान, अधिकार और अहं की परीक्षा" },
  moon: { en: "emotional life, home and public connect", hi: "भावनात्मक जीवन, घर और जन-संपर्क" },
  mars: { en: "effort, property and decisive action", hi: "परिश्रम, संपत्ति और निर्णायक कदम" },
  mercury: { en: "learning, trade and communication", hi: "अध्ययन, व्यापार और संवाद" },
  jupiter: { en: "guidance, expansion and dharma", hi: "मार्गदर्शन, विस्तार और धर्म" },
  venus: { en: "relationships, comfort and creative income", hi: "रिश्ते, सुख और सृजनात्मक आय" },
  saturn: { en: "structure, patience and long-term building", hi: "संरचना, धैर्य और दीर्घकालिक निर्माण" },
  rahu: { en: "ambition, foreign links and unconventional paths", hi: "महत्वाकांक्षा, विदेश संबंध और अपरंपरागत राह" },
  ketu: { en: "detachment, research and inner work", hi: "वैराग्य, शोध और आंतरिक साधना" },
};

export const UPI_ID = "9522333669@jio";
export const UPI_PAYEE_NAME = "Hast Rekha AI";
/** Single source of truth for the ₹51 price — defined in `flags.ts`. */
export const PREMIUM_PRICE = PDF_PRICE;

/** Copy shown on the Ultra Pro book card. */
export interface BookCopy {
  title: Bi;
  sub: Bi;
  cta: Bi;
  opening: Bi;
  private: Bi;
  soon: Bi;
  err: Bi;
}

export interface PremiumYear {
  calendarYear: number;
  ageRange: [number, number];
  theme: Bi;
  events: Bi;
  mistakes: Bi;
  upay: Bi;
  stotra: Bi;
  /** Mahadasha context from the advanced chart, when available. */
  dashaNote?: Bi;
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

export function upiDeepLink(readingId: string, amount: number = PREMIUM_PRICE) {
  const plan = amount >= ULTRA_PRICE ? "Ultra Pro" : "Pro Report";
  const params = new URLSearchParams({
    pa: UPI_ID,
    pn: UPI_PAYEE_NAME,
    am: amount.toFixed(2),
    cu: "INR",
    tn: `${plan} ${readingId.slice(0, 8)}`,
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
    const calendarYear = startYear + i;
    const maha = result.advanced?.dasha.mahadashas.find(
      (p) => Number(p.start.slice(0, 4)) <= calendarYear && Number(p.end.slice(0, 4)) >= calendarYear,
    );
    const theme = maha ? DASHA_THEME[maha.lord] : undefined;
    years.push({
      calendarYear,
      ageRange: [startAge + i, startAge + i + 1],
      theme: block.theme,
      events: fill(block.events, vars),
      mistakes: block.mistakes,
      upay: block.upay,
      stotra: block.stotra,
      dashaNote: maha && theme
        ? {
            en: `${maha.lordName.en} mahadasha (${maha.start.slice(0, 4)}–${maha.end.slice(0, 4)}) runs through this year — a period of ${theme.en}.`,
            hi: `${maha.lordName.hi} महादशा (${maha.start.slice(0, 4)}–${maha.end.slice(0, 4)}) इस वर्ष चल रही है — ${theme.hi} का काल।`,
          }
        : undefined,
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
/** The two extra lines Ultra Pro adds on top of `PREMIUM_PERKS`. */
export const BOOK_PERKS = C.bookPerks;
export const BOOK_COPY = C.book;
export const PREMIUM_SEED = hashString;
