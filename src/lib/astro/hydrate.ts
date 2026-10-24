/**
 * Server-side hydration for saved readings.
 *
 * Readings created before the advanced engine have no `result.advanced`; the
 * report page fills it in on the fly instead of running a database backfill.
 * Transits are always refreshed for today so a saved reading never shows a
 * stale gochara snapshot.
 */
import type { AstroResult } from "../astrology";
import { buildAdvanced } from "./index";
import { buildTransits } from "./transits";
import { ASTRO_ENGINE_VERSION } from "./registry";
import type { AdvancedChart, ChartInput, Graha } from "./types";

export interface ReadingWithBirth {
  fullName: string;
  birthDate: string;
  birthTime: string;
  latitude: number;
  longitude: number;
  tzOffset: number;
  result: AstroResult;
}

/** Birth data columns → the engine's input shape. */
export function chartInputOf(reading: {
  birthDate: string;
  birthTime: string;
  latitude: number;
  longitude: number;
  tzOffset: number;
}): ChartInput {
  return {
    date: reading.birthDate,
    time: reading.birthTime || "12:00",
    latitude: reading.latitude,
    longitude: reading.longitude,
    tzOffset: reading.tzOffset,
  };
}

/** Recompute only the date-dependent layer of an existing chart. */
export function refreshTransits(chart: AdvancedChart, now = new Date()): AdvancedChart {
  const byKey = new Map(chart.planets.map((p) => [p.key, p]));
  const signOf = (key: Graha) => byKey.get(key)?.sign ?? 0;
  const transits = buildTransits(
    {
      moonSign: signOf("moon"),
      lagnaSign: chart.lagna.sign,
      sunSign: signOf("sun"),
      jupiterSign: signOf("jupiter"),
      saturnSign: signOf("saturn"),
    },
    now,
  );
  return { ...chart, transits };
}

/**
 * Guarantee `result.advanced` exists and its transits are current.
 * Returns the original result untouched if the birth data cannot be computed.
 */
export function ensureAdvanced(reading: ReadingWithBirth, now = new Date()): AstroResult {
  const existing = reading.result.advanced;
  if (existing && existing.version === ASTRO_ENGINE_VERSION && Array.isArray(existing.planets) && existing.planets.length === 9) {
    return { ...reading.result, advanced: refreshTransits(existing, now) };
  }
  try {
    return {
      ...reading.result,
      advanced: buildAdvanced(chartInputOf(reading), { fullName: reading.fullName, now }),
    };
  } catch (error) {
    console.error("[astro] advanced hydration failed:", error instanceof Error ? error.message : error);
    return reading.result;
  }
}
