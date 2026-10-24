/**
 * Rule-based Vedic astrology engine.
 *
 * The base chart (rashi, nakshatra, lagna, tithi, yoga) is kept as a small,
 * stable surface for existing callers. The full calculation set — nine-graha
 * positions, whole-sign houses, strengths, aspects, pañcāṅga, sixteen vargas,
 * Vimśottarī daśā, yogas, gochara and numerology — is attached as
 * `result.advanced` by the engine in `lib/astro`.
 *
 * No external API is required — everything is computed locally with the MIT
 * `astronomia` library (VSOP87B + Meeus).
 */
import {
  ascendantLongitude,
  degreeInSign,
  getEphemeris,
  lahiriAyanamsa,
  nakshatraOf,
  norm360,
  padaOf,
  rashiOf,
  westernSunSign,
} from "./astro/ephemeris";
import { buildAdvanced } from "./astro";
import type { AdvancedChart, ChartInput } from "./astro/types";

export type { ChartInput } from "./astro/types";

export interface AstroResult {
  engine: "astronomia";
  julianDay: number;
  ayanamsa: number;
  obliquity: number;
  siderealTime: number; // GAST in degrees
  tropical: { sun: number; moon: number; ascendant: number };
  sidereal: { sun: number; moon: number; ascendant: number };
  sunSignWestern: number; // 0 = Aries … 11 = Pisces (date-range mapping)
  sunSignVedic: number;
  moonRashi: number;
  moonDegree: number; // degree inside the rashi
  nakshatra: number; // 0 = Ashwini … 26 = Revati
  nakshatraDegree: number;
  pada: number; // 1-4
  lagna: number;
  lagnaDegree: number;
  tithi: number; // 1-30
  paksha: "shukla" | "krishna";
  yoga: number; // 0-26
  weekday: number; // 0 = Sunday
  moonPhase: number; // illuminated fraction 0-1
  /**
   * Marital status entered on the form. Optional so readings created before this
   * field existed keep working; stored inside `result` (JSONB) to avoid a DB
   * migration on the live database.
   */
  married?: boolean;
  /**
   * The full advanced calculation set. Present on every new reading; older
   * readings are hydrated server-side when opened. Plain JSON only.
   */
  advanced?: AdvancedChart;
}

export { ascendantLongitude, lahiriAyanamsa, norm360, westernSunSign };
export { formatDegree } from "./format-degree";

const NAK_SPAN = 360 / 27; // 13°20'

export interface ComputeOptions {
  /** Used for nāmāṅka (Chaldean name number) and personalised copy. */
  fullName?: string;
  /** Set false for lightweight jobs that only need the base chart. */
  advanced?: boolean;
  /** Injected clock for deterministic tests. */
  now?: Date;
}

export function computeChart(input: ChartInput, options: ComputeOptions = {}): AstroResult {
  const eph = getEphemeris(input);
  const [y, mo, d] = input.date.split("-").map(Number);

  const tithi = Math.min(30, Math.floor(eph.elongation / 12) + 1);

  const result: AstroResult = {
    engine: "astronomia",
    julianDay: round(eph.jd, 5),
    ayanamsa: round(eph.ayanamsa, 4),
    obliquity: round(eph.obliquity, 4),
    siderealTime: round(eph.gast, 4),
    tropical: {
      sun: round(eph.sunTropical, 4),
      moon: round(eph.moonTropical, 4),
      ascendant: round(eph.ascTropical, 4),
    },
    sidereal: {
      sun: round(eph.sunSidereal, 4),
      moon: round(eph.moonSidereal, 4),
      ascendant: round(eph.ascSidereal, 4),
    },
    sunSignWestern: westernSunSign(mo, d),
    sunSignVedic: Math.floor(eph.sunSidereal / 30),
    moonRashi: rashiOf(eph.moonSidereal),
    moonDegree: round(degreeInSign(eph.moonSidereal), 2),
    nakshatra: nakshatraOf(eph.moonSidereal),
    nakshatraDegree: round(eph.moonSidereal % NAK_SPAN, 2),
    pada: padaOf(eph.moonSidereal),
    lagna: rashiOf(eph.ascSidereal),
    lagnaDegree: round(degreeInSign(eph.ascSidereal), 2),
    tithi,
    paksha: tithi <= 15 ? "shukla" : "krishna",
    yoga: Math.floor(norm360(eph.moonSidereal + eph.sunSidereal) / NAK_SPAN) % 27,
    weekday: eph.weekday,
    moonPhase: round((1 - Math.cos((eph.elongation * Math.PI) / 180)) / 2, 3),
  };

  if (options.advanced !== false) {
    try {
      result.advanced = buildAdvanced(input, { fullName: options.fullName, now: options.now });
    } catch (error) {
      // The base chart is still a valid reading; never fail a saved reading
      // because an optional advanced subsystem could not compute.
      console.error("[astro] advanced chart failed:", error instanceof Error ? error.message : error);
    }
  }

  return result;
}

function round(n: number, p: number) {
  const f = 10 ** p;
  return Math.round(n * f) / f;
}
