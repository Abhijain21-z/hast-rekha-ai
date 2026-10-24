/**
 * Strength scoring (a transparent, deterministic "ṣaḍbala-lite").
 *
 * Classical ṣaḍbala is a six-fold weighted score. Full computation needs
 * arc-second-level ascendant and house cusps, which a whole-sign engine does not
 * have. This module keeps the same six *ideas* — place, direction, time,
 * motion, nature and aspect — as an auditable 0–100 score so predictions can
 * prioritise genuinely strong planets instead of every planet equally.
 */
import { DIGNITY_LABELS, DIG_BALA_HOUSE, PLANET_NAMES, signAt } from "./data";
import type { Bi } from "../i18n";
import type { Graha, HouseInfo, PlanetPosition, PlanetStrength, SignInfo } from "./types";

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

const DIGNITY_POINTS: Record<string, number> = {
  exalted: 30,
  moolatrikona: 25,
  own: 20,
  friend: 10,
  neutral: 0,
  enemy: -10,
  debilitated: -25,
};

const AVASTHA_POINTS: Record<string, number> = {
  bala: 2,
  kumara: 5,
  yuva: 8,
  vriddha: 1,
  mrita: -6,
};

export const HOUSE_MEANING: Record<number, Bi> = {
  1: { en: "body, personality and direction of life", hi: "शरीर, व्यक्तित्व और जीवन-दिशा" },
  2: { en: "wealth, speech and family resources", hi: "धन, वाणी और कुटुंब" },
  3: { en: "courage, siblings and communication", hi: "साहस, भाई-बहन और संवाद" },
  4: { en: "home, mother and inner peace", hi: "घर, माता और मानसिक शांति" },
  5: { en: "intelligence, children and purva punya", hi: "बुद्धि, संतान और पूर्व पुण्य" },
  6: { en: "service, health and competition", hi: "सेवा, स्वास्थ्य और प्रतिस्पर्धा" },
  7: { en: "marriage, partnership and public dealings", hi: "विवाह, साझेदारी और जन-व्यवहार" },
  8: { en: "transformation, inheritance and occult", hi: "रूपांतरण, विरासत और गूढ़ विद्या" },
  9: { en: "fortune, dharma and the father", hi: "भाग्य, धर्म और पिता" },
  10: { en: "career, status and karma", hi: "करियर, पद और कर्म" },
  11: { en: "gains, networks and fulfilled desires", hi: "लाभ, नेटवर्क और इच्छापूर्ति" },
  12: { en: "expenses, foreign lands and liberation", hi: "व्यय, विदेश और मोक्ष" },
};

function housePoints(house: number): number {
  if (house === 1 || house === 4 || house === 7 || house === 10) return 8;
  if (house === 5 || house === 9) return 10;
  if (house === 3 || house === 6 || house === 11) return 4;
  if (house === 8 || house === 12) return -8;
  return 0;
}

export function buildStrengths(planets: PlanetPosition[]): PlanetStrength[] {
  return planets.map((p) => {
    const factors: { label: Bi; points: number }[] = [];
    const add = (label: Bi, points: number) => {
      if (points !== 0) factors.push({ label, points });
    };

    add(DIGNITY_LABELS[p.dignity], DIGNITY_POINTS[p.dignity] ?? 0);
    add(
      { en: `House ${p.house} — ${HOUSE_MEANING[p.house]?.en ?? ""}`, hi: `भाव ${p.house} — ${HOUSE_MEANING[p.house]?.hi ?? ""}` },
      housePoints(p.house),
    );
    if (p.key !== "rahu" && p.key !== "ketu") {
      add({ en: "Retrograde (high cheṣṭā bala)", hi: "वक्री (उच्च चेष्टा बल)" }, p.retrograde ? 5 : 0);
    }
    if (p.combust) add({ en: "Combust with the Sun", hi: "सूर्य से अस्त" }, -12);
    if (p.vargottama) add({ en: "Vargottama (same sign in D1 and D9)", hi: "वर्गोत्तम (D1 और D9 में एक ही राशि)" }, 8);
    if (DIG_BALA_HOUSE[p.key] === p.house) {
      add({ en: "Directional strength (dig bala)", hi: "दिग्बल" }, 8);
    }
    add(
      {
        en: `Āvasthā: ${p.avastha}`,
        hi: `अवस्था: ${p.avastha}`,
      },
      AVASTHA_POINTS[p.avastha] ?? 0,
    );

    const score = Math.round(
      clamp(50 + factors.reduce((sum, f) => sum + f.points, 0), 5, 98),
    );

    return {
      key: p.key,
      name: PLANET_NAMES[p.key],
      score,
      grade: gradeOf(score),
      dignity: p.dignity,
      factors,
      houseNote: {
        en: `House ${p.house}: ${HOUSE_MEANING[p.house]?.en ?? ""}`,
        hi: `भाव ${p.house}: ${HOUSE_MEANING[p.house]?.hi ?? ""}`,
      },
    };
  });
}

function gradeOf(score: number): Bi {
  if (score >= 80) return { en: "Very strong", hi: "अति बलवान" };
  if (score >= 65) return { en: "Strong", hi: "बलवान" };
  if (score >= 45) return { en: "Moderate", hi: "मध्यम" };
  if (score >= 30) return { en: "Weak", hi: "कमज़ोर" };
  return { en: "Very weak", hi: "अति कमज़ोर" };
}

/** Whole-sign houses from the lagna, with occupants. */
export function buildHouseBase(lagnaSign: number, planetSigns: { key: Graha; sign: number }[]): HouseInfo[] {
  return Array.from({ length: 12 }, (_, i) => {
    const sign = (lagnaSign + i) % 12;
    const occupants = planetSigns.filter((p) => p.sign === sign).map((p) => p.key);
    const signInfo: SignInfo = signAt(sign);
    return {
      house: i + 1,
      sign,
      lord: signInfo.lord,
      occupants,
      strength: 50,
      signName: signInfo.name,
    };
  });
}

/** Fill house strength from occupancy + the house lord's planetary strength. */
export function applyHouseStrength(houses: HouseInfo[], strengths: PlanetStrength[]): HouseInfo[] {
  const byGraha = new Map(strengths.map((s) => [s.key, s.score]));
  return houses.map((h) => {
    const occupantScore = h.occupants.reduce((sum, key) => sum + (byGraha.get(key) ?? 50), 0);
    const occupancy = h.occupants.length ? occupantScore / h.occupants.length : 50;
    const lordScore = byGraha.get(h.lord) ?? 50;
    const strength = Math.round(clamp(50 + (occupancy - 50) * 0.35 + (lordScore - 50) * 0.4, 10, 95));
    return { ...h, strength };
  });
}
