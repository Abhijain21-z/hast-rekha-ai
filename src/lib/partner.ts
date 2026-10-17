/**
 * "Life partner" prediction for unmarried readers — the pro-only section that
 * answers the questions people actually ask: name syllable, nature, looks,
 * money, business-or-job, direction, when and how they meet, and how to
 * recognise them.
 *
 * Rule-based and deterministic: the birth nakshatra gives the name syllables,
 * the classical 7th-house rule gives the partner's rashi, and everything else
 * is picked deterministically from the reading seed. No AI, no randomness
 * between renders.
 * Content lives in src/content/partner.json.
 */
import partnerJson from "@/content/partner.json";
import type { Bi } from "./i18n";
import type { AstroResult } from "./astrology";
import { rashiAt } from "./content";

interface PartnerContent {
  note: Bi;
  nameHint: Bi;
  age: Bi[];
  nature: Bi[];
  looks: Bi[];
  wealth: Bi[];
  career: Bi[];
  direction: Bi[];
  meeting: Bi[];
  recognition: Bi[];
}
const C = partnerJson as PartnerContent;

/**
 * Naming syllables (one per pada) for the 27 nakshatras, Ashwini → Revati.
 * Index matches `AstroResult.nakshatra`.
 */
const SYLLABLES: { dev: string[]; rom: string[] }[] = [
  { dev: ["चू", "चे", "चो", "ला"], rom: ["Chu", "Che", "Cho", "La"] }, // Ashwini
  { dev: ["ली", "लू", "ले", "लो"], rom: ["Li", "Lu", "Le", "Lo"] }, // Bharani
  { dev: ["अ", "ई", "उ", "ए"], rom: ["A", "I", "U", "E"] }, // Krittika
  { dev: ["ओ", "वा", "वी", "वू"], rom: ["O", "Va", "Vi", "Vu"] }, // Rohini
  { dev: ["वे", "वो", "का", "की"], rom: ["Ve", "Vo", "Ka", "Ki"] }, // Mrigashira
  { dev: ["कू", "घ", "ङ", "छ"], rom: ["Ku", "Gha", "Na", "Chha"] }, // Ardra
  { dev: ["के", "को", "हा", "ही"], rom: ["Ke", "Ko", "Ha", "Hi"] }, // Punarvasu
  { dev: ["हू", "हे", "हो", "डा"], rom: ["Hu", "He", "Ho", "Da"] }, // Pushya
  { dev: ["डी", "डू", "डे", "डो"], rom: ["Di", "Du", "De", "Do"] }, // Ashlesha
  { dev: ["मा", "मी", "मू", "मे"], rom: ["Ma", "Mi", "Mu", "Me"] }, // Magha
  { dev: ["मो", "टा", "टी", "टू"], rom: ["Mo", "Ta", "Ti", "Tu"] }, // Purva Phalguni
  { dev: ["टे", "टो", "पा", "पी"], rom: ["Te", "To", "Pa", "Pi"] }, // Uttara Phalguni
  { dev: ["पू", "ष", "ण", "ठ"], rom: ["Pu", "Sha", "Na", "Tha"] }, // Hasta
  { dev: ["पे", "पो", "रा", "री"], rom: ["Pe", "Po", "Ra", "Ri"] }, // Chitra
  { dev: ["रू", "रे", "रो", "ता"], rom: ["Ru", "Re", "Ro", "Ta"] }, // Swati
  { dev: ["ती", "तू", "ते", "तो"], rom: ["Ti", "Tu", "Te", "To"] }, // Vishakha
  { dev: ["ना", "नी", "नू", "ने"], rom: ["Na", "Ni", "Nu", "Ne"] }, // Anuradha
  { dev: ["नो", "या", "यी", "यू"], rom: ["No", "Ya", "Yi", "Yu"] }, // Jyeshtha
  { dev: ["ये", "यो", "भा", "भी"], rom: ["Ye", "Yo", "Bha", "Bhi"] }, // Mula
  { dev: ["भू", "धा", "फा", "ढा"], rom: ["Bhu", "Dha", "Pha", "Dha"] }, // Purva Ashadha
  { dev: ["भे", "भो", "जा", "जी"], rom: ["Bhe", "Bho", "Ja", "Ji"] }, // Uttara Ashadha
  { dev: ["खी", "खू", "खे", "खो"], rom: ["Khi", "Khu", "Khe", "Kho"] }, // Shravana
  { dev: ["गा", "गी", "गू", "गे"], rom: ["Ga", "Gi", "Gu", "Ge"] }, // Dhanishta
  { dev: ["गो", "सा", "सी", "सू"], rom: ["Go", "Sa", "Si", "Su"] }, // Shatabhisha
  { dev: ["से", "सो", "दा", "दी"], rom: ["Se", "So", "Da", "Di"] }, // Purva Bhadrapada
  { dev: ["दू", "थ", "झ", "ञ"], rom: ["Du", "Tha", "Jha", "Na"] }, // Uttara Bhadrapada
  { dev: ["दे", "दो", "च", "ची"], rom: ["De", "Do", "Cha", "Chi"] }, // Revati
];

export interface PartnerReport {
  nakshatraIndex: number;
  syllablesDev: string[];
  syllablesRom: string[];
  nameHint: Bi;
  rashiNote: Bi;
  age: Bi;
  nature: Bi;
  looks: Bi;
  wealth: Bi;
  career: Bi;
  direction: Bi;
  meeting: Bi;
  recognition: Bi;
  note: Bi;
}

/** Deterministic picking: same reading ⇒ same partner prediction, every render. */
function picker(seed: number) {
  const iseed = (Math.floor(seed) >>> 0) || 7;
  const rng = (n: number) => {
    let a = (iseed ^ (n * 2246822519)) >>> 0;
    a = Math.imul(a ^ (a >>> 15), 2654435761) >>> 0;
    a = Math.imul(a ^ (a >>> 13), 3266489917) >>> 0;
    return ((a ^ (a >>> 16)) >>> 0) / 4294967296;
  };
  return <T>(arr: T[], n: number) => arr[Math.floor(rng(n) * arr.length) % arr.length];
}

export function buildPartnerReport({ result, seed }: { result: AstroResult; seed: number }): PartnerReport {
  const pick = picker(seed);
  const nakIdx = ((Math.trunc(result.nakshatra) % 27) + 27) % 27;
  const syl = SYLLABLES[nakIdx] ?? SYLLABLES[0];

  const yourRashi = rashiAt(result.moonRashi);
  // Classical rule: the spouse is read from the 7th house / 7th sign.
  const partnerRashi = rashiAt(result.moonRashi + 6);

  return {
    nakshatraIndex: nakIdx,
    syllablesDev: syl.dev,
    syllablesRom: syl.rom,
    nameHint: C.nameHint,
    rashiNote: {
      en: `By the classical seventh-house rule your partner is likely to be of ${partnerRashi.short.en} rashi — the seventh from your ${yourRashi.short.en} — with a ${partnerRashi.element.en} temperament.`,
      hi: `शास्त्रीय सप्तम-भाव नियम से आपके जीवनसाथी की राशि ${partnerRashi.short.hi} (आपकी ${yourRashi.short.hi} से सातवीं) हो सकती है, जिनका स्वभाव ${partnerRashi.element.hi} प्रकृति का होगा।`,
    },
    age: pick(C.age, 1),
    nature: pick(C.nature, 2),
    looks: pick(C.looks, 3),
    wealth: pick(C.wealth, 4),
    career: pick(C.career, 5),
    direction: pick(C.direction, 6),
    meeting: pick(C.meeting, 7),
    recognition: pick(C.recognition, 8),
    note: C.note,
  };
}

/** Languages written in Devanagari get the Devanagari syllables. */
export function prefersDevanagari(cl: string): boolean {
  return ["hi", "mr", "sa", "ne"].includes(cl);
}
