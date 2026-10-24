import { COMBUSTION_ORB, DIGNITY_RULES, ENEMIES, FRIENDS, SIGNS } from "./data";
import type { Dignity, Graha } from "./types";

/** Natural dignity of a graha at a given sidereal sign + degree inside it. */
export function dignityOf(planet: Graha, sign: number, degreeInSign: number): Dignity {
  const rule = DIGNITY_RULES[planet];
  if (sign === rule.exaltation) return "exalted";
  if (sign === rule.debilitation) return "debilitated";
  const mt = rule.moolatrikona;
  if (mt && sign === mt.sign && degreeInSign >= mt.from && degreeInSign <= mt.to) return "moolatrikona";
  if (rule.own.includes(sign)) return "own";

  const lord = SIGNS[((sign % 12) + 12) % 12].lord;
  if (lord === planet) return "own";
  if (FRIENDS[planet].includes(lord)) return "friend";
  if (ENEMIES[planet].includes(lord)) return "enemy";
  return "neutral";
}

/** Shortest angular separation, 0–180°. */
export function angularSeparation(a: number, b: number): number {
  const d = Math.abs((((a - b) % 360) + 360) % 360);
  return d > 180 ? 360 - d : d;
}

/** Is the graha inside the Sun's combustion orb? */
export function isCombust(planet: Graha, planetLongitude: number, sunLongitude: number, retrograde: boolean): boolean {
  if (planet === "sun" || planet === "rahu" || planet === "ketu") return false;
  const base = COMBUSTION_ORB[planet];
  if (base === undefined) return false;
  const orb = retrograde && (planet === "mercury" || planet === "venus") ? base - 2 : base;
  return angularSeparation(planetLongitude, sunLongitude) <= orb;
}

/** Gandanta: the water→fire junction (last 3°20′ of a water sign, first 3°20′ of a fire sign). */
export function isGandanta(sign: number, degreeInSign: number): boolean {
  const water = [3, 7, 11];
  const fire = [0, 4, 8];
  return (water.includes(sign) && degreeInSign >= 26.6667) || (fire.includes(sign) && degreeInSign <= 3.3334);
}

const AVASTHA_ORDER = ["bala", "kumara", "yuva", "vriddha", "mrita"] as const;

/**
 * Planetary age-state (āvasthā) by degree. Odd signs run forward, even signs run
 * backward, exactly as in Parāśara's treatment.
 */
export function avasthaOf(sign: number, degreeInSign: number): (typeof AVASTHA_ORDER)[number] {
  const step = Math.min(4, Math.floor(degreeInSign / 6));
  return sign % 2 === 0 ? AVASTHA_ORDER[step] : AVASTHA_ORDER[4 - step];
}
