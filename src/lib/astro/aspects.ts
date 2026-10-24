/**
 * Vedic whole-sign aspects (dṛṣṭi).
 *
 * Every graha casts a full aspect on the 7th house from itself. Mars, Jupiter
 * and Saturn add their special aspects; Rahu and Ketu are given the 5/7/9
 * aspects used by the majority of modern Vedic schools.
 */
import type { AspectInfo, Graha, PlanetPosition } from "./types";

export const ASPECT_OFFSETS: Record<Graha, number[]> = {
  sun: [7],
  moon: [7],
  mars: [4, 7, 8],
  mercury: [7],
  jupiter: [5, 7, 9],
  venus: [7],
  saturn: [3, 7, 10],
  rahu: [5, 7, 9],
  ketu: [5, 7, 9],
};

const houseAfter = (fromHouse: number, offset: number) => ((fromHouse - 1 + offset - 1) % 12) + 1;

/** True when `from` aspects `toHouse` (whole-sign). */
export function hasAspect(from: Graha, fromHouse: number, toHouse: number): boolean {
  return ASPECT_OFFSETS[from].some((offset) => houseAfter(fromHouse, offset) === toHouse);
}

export function buildAspects(planets: PlanetPosition[]): AspectInfo[] {
  const out: AspectInfo[] = [];
  for (const p of planets) {
    for (const offset of ASPECT_OFFSETS[p.key]) {
      out.push({
        from: p.key,
        toHouse: houseAfter(p.house, offset),
        label:
          offset === 7
            ? { en: "7th (full) aspect", hi: "सप्तम पूर्ण दृष्टि" }
            : offset === 4
              ? { en: "4th aspect (Mars special)", hi: "चतुर्थ दृष्टि (मंगल विशेष)" }
              : offset === 8
                ? { en: "8th aspect (Mars special)", hi: "अष्टम दृष्टि (मंगल विशेष)" }
                : offset === 5
                  ? { en: "5th aspect (Jupiter special)", hi: "पंचम दृष्टि (गुरु विशेष)" }
                  : offset === 9
                    ? { en: "9th aspect (Jupiter special)", hi: "नवम दृष्टि (गुरु विशेष)" }
                    : offset === 3
                      ? { en: "3rd aspect (Saturn special)", hi: "तृतीय दृष्टि (शनि विशेष)" }
                      : { en: "10th aspect (Saturn special)", hi: "दशम दृष्टि (शनि विशेष)" },
      });
    }
  }
  return out;
}
