/**
 * Ṣoḍaśavarga — the sixteen divisional charts of Parāśara.
 *
 * Every varga maps a sidereal longitude to a sign using the classical rule for
 * that division. The ascendant is divided the same way, so each chart is a
 * complete whole-sign chart (houses counted from the varga lagna).
 */
import { norm360 } from "./ephemeris";
import type { Bi } from "../i18n";
import type { Graha, VargaChart } from "./types";

export interface VargaDef {
  key: string;
  division: number;
  name: Bi;
  purpose: Bi;
  sign: (sidereal: number) => number;
}

const partOf = (degree: number, divisions: number) => Math.min(divisions - 1, Math.floor(degree / (30 / divisions)));

/** D2 Horā — Sun's or Moon's half. Odd signs start Leo, even signs start Cancer. */
function horaSign(sidereal: number): number {
  const lon = norm360(sidereal);
  const sign = Math.floor(lon / 30);
  const degree = lon % 30;
  const odd = sign % 2 === 0;
  if (odd) return degree < 15 ? 4 : 3;
  return degree < 15 ? 3 : 4;
}

/** D30 Trimśāṃśa — unequal divisions with fixed lords. */
function trimsamsaSign(sidereal: number): number {
  const lon = norm360(sidereal);
  const sign = Math.floor(lon / 30);
  const d = lon % 30;
  const odd = sign % 2 === 0;
  if (odd) {
    if (d < 5) return 0; // Mars — Aries
    if (d < 10) return 10; // Saturn — Aquarius
    if (d < 18) return 8; // Jupiter — Sagittarius
    if (d < 25) return 2; // Mercury — Gemini
    return 6; // Venus — Libra
  }
  if (d < 5) return 1; // Venus — Taurus
  if (d < 12) return 5; // Mercury — Virgo
  if (d < 20) return 11; // Jupiter — Pisces
  if (d < 25) return 9; // Saturn — Capricorn
  return 7; // Mars — Scorpio
}

const signOf = (sidereal: number) => Math.floor(norm360(sidereal) / 30);
const degreeOf = (sidereal: number) => norm360(sidereal) % 30;

const movableStart = (sign: number) => [0, 4, 8][sign % 3];

export const VARGAS: VargaDef[] = [
  {
    key: "D1",
    division: 1,
    name: { en: "Rashi (D1)", hi: "राशि (D1)" },
    purpose: { en: "The body, personality and the whole life", hi: "शरीर, व्यक्तित्व और पूरा जीवन" },
    sign: signOf,
  },
  {
    key: "D2",
    division: 2,
    name: { en: "Hora (D2)", hi: "होरा (D2)" },
    purpose: { en: "Wealth and sustenance", hi: "धन और पोषण" },
    sign: horaSign,
  },
  {
    key: "D3",
    division: 3,
    name: { en: "Drekkana (D3)", hi: "द्रेक्काण (D3)" },
    purpose: { en: "Siblings, courage and co-borns", hi: "भाई-बहन, साहस" },
    sign: (lon) => (signOf(lon) + partOf(degreeOf(lon), 3) * 4) % 12,
  },
  {
    key: "D4",
    division: 4,
    name: { en: "Chaturthamsa (D4)", hi: "चतुर्थांश (D4)" },
    purpose: { en: "Home, property and inner comfort", hi: "घर, संपत्ति और सुख" },
    sign: (lon) => (signOf(lon) + partOf(degreeOf(lon), 4) * 3) % 12,
  },
  {
    key: "D7",
    division: 7,
    name: { en: "Saptamsa (D7)", hi: "सप्तांश (D7)" },
    purpose: { en: "Children and creative legacy", hi: "संतान और सृजन" },
    sign: (lon) => {
      const sign = signOf(lon);
      const start = sign % 2 === 0 ? sign : sign + 6;
      return (start + partOf(degreeOf(lon), 7)) % 12;
    },
  },
  {
    key: "D9",
    division: 9,
    name: { en: "Navamsa (D9)", hi: "नवांश (D9)" },
    purpose: { en: "Marriage, dharma and inner strength", hi: "विवाह, धर्म और आंतरिक बल" },
    sign: (lon) => (signOf(lon) * 9 + partOf(degreeOf(lon), 9)) % 12,
  },
  {
    key: "D10",
    division: 10,
    name: { en: "Dasamsa (D10)", hi: "दशांश (D10)" },
    purpose: { en: "Career, status and public action", hi: "करियर, पद और सार्वजनिक कर्म" },
    sign: (lon) => {
      const sign = signOf(lon);
      const start = sign % 2 === 0 ? sign : sign + 8;
      return (start + partOf(degreeOf(lon), 10)) % 12;
    },
  },
  {
    key: "D12",
    division: 12,
    name: { en: "Dwadasamsa (D12)", hi: "द्वादशांश (D12)" },
    purpose: { en: "Parents and inherited roots", hi: "माता-पिता और पैतृक जड़ें" },
    sign: (lon) => (signOf(lon) + partOf(degreeOf(lon), 12)) % 12,
  },
  {
    key: "D16",
    division: 16,
    name: { en: "Shodasamsa (D16)", hi: "षोडशांश (D16)" },
    purpose: { en: "Vehicles, comforts and happiness", hi: "वाहन, सुख-सुविधा" },
    sign: (lon) => (movableStart(signOf(lon)) + partOf(degreeOf(lon), 16)) % 12,
  },
  {
    key: "D20",
    division: 20,
    name: { en: "Vimsamsa (D20)", hi: "विंशांश (D20)" },
    purpose: { en: "Spiritual practice and devotion", hi: "साधना और भक्ति" },
    sign: (lon) => {
      const start = [0, 8, 4][signOf(lon) % 3];
      return (start + partOf(degreeOf(lon), 20)) % 12;
    },
  },
  {
    key: "D24",
    division: 24,
    name: { en: "Chaturvimsamsa (D24)", hi: "चतुर्विंशांश (D24)" },
    purpose: { en: "Learning, education and intellect", hi: "विद्या, शिक्षा और बुद्धि" },
    sign: (lon) => {
      const start = signOf(lon) % 2 === 0 ? 4 : 3;
      return (start + partOf(degreeOf(lon), 24)) % 12;
    },
  },
  {
    key: "D27",
    division: 27,
    name: { en: "Bhamsa (D27)", hi: "भांश (D27)" },
    purpose: { en: "Strengths, weaknesses and stamina", hi: "बल, कमज़ोरी और सहनशक्ति" },
    sign: (lon) => {
      const start = [0, 3, 6, 9][signOf(lon) % 4];
      return (start + partOf(degreeOf(lon), 27)) % 12;
    },
  },
  {
    key: "D30",
    division: 30,
    name: { en: "Trimsamsa (D30)", hi: "त्रिंशांश (D30)" },
    purpose: { en: "Misfortunes, health and hidden tests", hi: "कष्ट, स्वास्थ्य और छिपी परीक्षाएँ" },
    sign: trimsamsaSign,
  },
  {
    key: "D40",
    division: 40,
    name: { en: "Khavedamsa (D40)", hi: "खवेदांश (D40)" },
    purpose: { en: "Maternal legacy and auspiciousness", hi: "मातृकुल और शुभता" },
    sign: (lon) => {
      const start = signOf(lon) % 2 === 0 ? 0 : 6;
      return (start + partOf(degreeOf(lon), 40)) % 12;
    },
  },
  {
    key: "D45",
    division: 45,
    name: { en: "Akshavedamsa (D45)", hi: "अक्षवेदांश (D45)" },
    purpose: { en: "Paternal legacy and conduct", hi: "पितृकुल और आचरण" },
    sign: (lon) => (movableStart(signOf(lon)) + partOf(degreeOf(lon), 45)) % 12,
  },
  {
    key: "D60",
    division: 60,
    name: { en: "Shashtiamsa (D60)", hi: "षष्ट्यंश (D60)" },
    purpose: { en: "The finest karma of the chart", hi: "कुंडली का सूक्ष्मतम कर्म" },
    sign: (lon) => (signOf(lon) + Math.min(59, Math.floor(degreeOf(lon) * 2))) % 12,
  },
];

/** Build all sixteen varga charts from sidereal longitudes. */
export function buildVargas(ascendant: number, planets: { key: Graha; longitude: number }[]): VargaChart[] {
  return VARGAS.map((def) => {
    const lagna = def.sign(ascendant);
    const signs: Record<string, number> = {};
    for (const p of planets) signs[p.key] = def.sign(p.longitude);
    return {
      key: def.key,
      name: def.name,
      purpose: def.purpose,
      lagna,
      planets: signs as Record<Graha, number>,
      houses: Array.from({ length: 12 }, (_, i) => (lagna + i) % 12),
    };
  });
}

/** D9 sign of one longitude — used for vargottama detection. */
export const navamsaSign = (sidereal: number) => (VARGAS.find((v) => v.key === "D9") ?? VARGAS[5]).sign(sidereal);
