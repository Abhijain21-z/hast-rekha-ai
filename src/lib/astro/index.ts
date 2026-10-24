/**
 * Advanced Vedic chart builder.
 *
 * One call turns birth data into the complete, JSON-serialisable chart stored
 * in `readings.result.advanced`. Everything downstream — the report sections,
 * the premium year notes, the AI jyotishi prompt — reads this object instead of
 * recomputing astronomy.
 *
 * Order matters: positions → lagna → houses → strengths → aspects → pañcāṅga →
 * vargas → daśā → yogas → transits → numerology.
 */
import { getEphemeris, degreeInSign, nakshatraOf, padaOf, rashiOf } from "./ephemeris";
import { buildPanchang } from "./panchang";
import { buildVargas, navamsaSign } from "./vargas";
import { buildDasha } from "./dasha";
import { buildYogas } from "./yogas";
import { applyHouseStrength, buildHouseBase, buildStrengths } from "./strength";
import { buildAspects } from "./aspects";
import { buildTransits, type NatalReference } from "./transits";
import { buildNumerology } from "./numerology";
import { avasthaOf, dignityOf, isCombust, isGandanta } from "./dignity";
import { DIGNITY_LABELS, PLANET_NAMES, SIGNS, nakshatraAt } from "./data";
import { ASTRO_ENGINE_VERSION, calculationStamp } from "./registry";
import { GRAHAS, type AdvancedChart, type ChartInput, type Graha, type PlanetPosition } from "./types";

const NAK_SPAN = 360 / 27;

const round = (n: number, places: number) => {
  const factor = 10 ** places;
  return Math.round(n * factor) / factor;
};

export interface BuildOptions {
  /** Used for nāmāṅka (Chaldean name number). */
  fullName?: string;
  /** Injecting the clock keeps tests deterministic. */
  now?: Date;
}

/** Complete advanced chart for one birth moment. */
export function buildAdvanced(input: ChartInput, options: BuildOptions = {}): AdvancedChart {
  const eph = getEphemeris(input);
  const lagnaSign = rashiOf(eph.ascSidereal);
  const byKey = new Map(eph.planets.map((p) => [p.key, p]));
  const sunLongitude = byKey.get("sun")?.sidereal ?? 0;

  const planets: PlanetPosition[] = GRAHAS.map((key) => {
    const raw = byKey.get(key);
    if (!raw) throw new Error(`Missing ephemeris for ${key}`);
    const longitude = raw.sidereal;
    const sign = rashiOf(longitude);
    const degree = degreeInSign(longitude);
    const dignity = dignityOf(key, sign, degree);
    return {
      key,
      name: PLANET_NAMES[key],
      longitude: round(longitude, 4),
      tropicalLongitude: round(raw.tropical, 4),
      sign,
      degreeInSign: round(degree, 2),
      nakshatra: nakshatraOf(longitude),
      pada: padaOf(longitude),
      nakshatraDegree: round(longitude % NAK_SPAN, 2),
      house: ((sign - lagnaSign + 12) % 12) + 1,
      retrograde: raw.retrograde,
      speed: round(raw.speed, 4),
      dignity,
      dignityLabel: DIGNITY_LABELS[dignity],
      combust: isCombust(key, longitude, sunLongitude, raw.retrograde),
      gandanta: isGandanta(sign, degree),
      vargottama: navamsaSign(longitude) === sign,
      avastha: avasthaOf(sign, degree),
    };
  });

  const planetSigns = planets.map((p) => ({ key: p.key, sign: p.sign }));
  const strengths = buildStrengths(planets);
  const houses = applyHouseStrength(buildHouseBase(lagnaSign, planetSigns), strengths);
  const chartPlanets = planets.map((p) => ({ key: p.key, longitude: p.longitude }));

  const natal: NatalReference = {
    moonSign: signOf(planets, "moon"),
    lagnaSign,
    sunSign: signOf(planets, "sun"),
    jupiterSign: signOf(planets, "jupiter"),
    saturnSign: signOf(planets, "saturn"),
  };

  return {
    version: ASTRO_ENGINE_VERSION,
    engine: "astronomia-vsop87",
    ayanamsa: round(eph.ayanamsa, 4),
    planets,
    houses,
    lagna: {
      longitude: round(eph.ascSidereal, 4),
      sign: lagnaSign,
      degreeInSign: round(degreeInSign(eph.ascSidereal), 2),
      nakshatra: nakshatraOf(eph.ascSidereal),
      pada: padaOf(eph.ascSidereal),
      lord: SIGNS[lagnaSign].lord,
    },
    aspects: buildAspects(planets),
    panchang: buildPanchang(eph),
    vargas: buildVargas(eph.ascSidereal, chartPlanets),
    dasha: buildDasha(eph, input.date, options.now ?? new Date()),
    yogas: buildYogas({ planets, houses, lagnaSign }),
    strengths,
    transits: buildTransits(natal, options.now ?? new Date()),
    numerology: buildNumerology({ date: input.date, fullName: options.fullName }),
    calculations: calculationStamp(),
  };
}

function signOf(planets: PlanetPosition[], key: Graha): number {
  return planets.find((p) => p.key === key)?.sign ?? 0;
}

/** Convenience for UI copy: "Rohini, pada 2". */
export function nakshatraLabel(longitude: number): string {
  const index = nakshatraOf(longitude);
  return `${nakshatraAt(index).name.en} · pada ${padaOf(longitude)}`;
}

export { SIGNS };
