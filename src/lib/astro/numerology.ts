/**
 * Numerology layer: mūlāṅka (psychic), bhāgyāṅka (destiny), nāmāṅka (name),
 * the Chaldean letter values and the Lo Shu grid.
 *
 * These are traditional, deterministic mappings. They are presented as
 * supportive colour to the Vedic chart, not as a replacement for it.
 */
import { PLANET_NAMES } from "./data";
import type { NumerologyInfo } from "./types";

const CHALDEAN: Record<string, number> = {
  A: 1, I: 1, J: 1, Q: 1, Y: 1,
  B: 2, K: 2, R: 2,
  C: 3, G: 3, L: 3, S: 3,
  D: 4, M: 4, T: 4,
  E: 5, H: 5, N: 5, X: 5,
  U: 6, V: 6, W: 6,
  O: 7, Z: 7,
  F: 8, P: 8,
};

export function reduceToDigit(n: number): number {
  let value = Math.abs(Math.trunc(n));
  while (value > 9) {
    value = String(value)
      .split("")
      .reduce((sum, digit) => sum + Number(digit), 0);
  }
  return value;
}

const LORD_BY_NUMBER: Record<number, string> = {
  1: "sun",
  2: "moon",
  3: "jupiter",
  4: "rahu",
  5: "mercury",
  6: "venus",
  7: "ketu",
  8: "saturn",
  9: "mars",
};

const COLORS: Record<number, { en: string; hi: string }[]> = {
  1: [{ en: "golden yellow", hi: "सुनहरा पीला" }, { en: "orange", hi: "नारंगी" }],
  2: [{ en: "white", hi: "सफ़ेद" }, { en: "cream", hi: "क्रीम" }],
  3: [{ en: "saffron", hi: "केसरिया" }, { en: "yellow", hi: "पीला" }],
  4: [{ en: "blue", hi: "नीला" }, { en: "grey", hi: "धूसर" }],
  5: [{ en: "green", hi: "हरा" }, { en: "light green", hi: "हल्का हरा" }],
  6: [{ en: "white", hi: "सफ़ेद" }, { en: "pastel blue", hi: "हल्का नीला" }],
  7: [{ en: "sea green", hi: "समुद्री हरा" }, { en: "light grey", hi: "हल्का धूसर" }],
  8: [{ en: "dark blue", hi: "गहरा नीला" }, { en: "black", hi: "काला" }],
  9: [{ en: "red", hi: "लाल" }, { en: "coral", hi: "कोरल" }],
};

const DAYS: Record<number, { en: string; hi: string }[]> = {
  1: [{ en: "Sunday", hi: "रविवार" }],
  2: [{ en: "Monday", hi: "सोमवार" }],
  3: [{ en: "Thursday", hi: "गुरुवार" }],
  4: [{ en: "Saturday", hi: "शनिवार" }],
  5: [{ en: "Wednesday", hi: "बुधवार" }],
  6: [{ en: "Friday", hi: "शुक्रवार" }],
  7: [{ en: "Monday", hi: "सोमवार" }, { en: "Wednesday", hi: "बुधवार" }],
  8: [{ en: "Saturday", hi: "शनिवार" }],
  9: [{ en: "Tuesday", hi: "मंगलवार" }],
};

function nameNumber(name: string): number {
  const sum = name
    .toUpperCase()
    .replace(/[^A-Z]/g, "")
    .split("")
    .reduce((total, letter) => total + (CHALDEAN[letter] ?? 0), 0);
  return reduceToDigit(sum);
}

export function buildNumerology(input: { date: string; fullName?: string }): NumerologyInfo {
  const [y, m, d] = input.date.split("-").map(Number);
  const day = d || 1;
  const mulank = reduceToDigit(day);
  const digitSum = `${String(day).padStart(2, "0")}${String(m || 1).padStart(2, "0")}${y || 2000}`
    .split("")
    .reduce((sum, digit) => sum + Number(digit), 0);
  const bhagyank = reduceToDigit(digitSum);
  const namank = nameNumber(input.fullName ?? "");

  const luckyNumbers = Array.from(new Set([mulank, bhagyank, reduceToDigit(mulank + bhagyank)]));
  const counts = Array.from({ length: 9 }, (_, i) => {
    const digit = i + 1;
    const count = `${String(day).padStart(2, "0")}${String(m || 1).padStart(2, "0")}${y || 2000}`
      .split("")
      .filter((c) => c === String(digit)).length;
    return { number: digit, count };
  });

  const lord = LORD_BY_NUMBER[mulank] ?? "sun";
  const destinyLord = LORD_BY_NUMBER[bhagyank] ?? "sun";

  return {
    mulank,
    bhagyank,
    namank,
    mulankLord: {
      en: `${PLANET_NAMES[lord as keyof typeof PLANET_NAMES].en} (${lord})`,
      hi: `${PLANET_NAMES[lord as keyof typeof PLANET_NAMES].hi}`,
    },
    bhagyankLord: {
      en: `${PLANET_NAMES[destinyLord as keyof typeof PLANET_NAMES].en} (${destinyLord})`,
      hi: `${PLANET_NAMES[destinyLord as keyof typeof PLANET_NAMES].hi}`,
    },
    luckyNumbers,
    luckyColors: COLORS[mulank] ?? COLORS[1],
    luckyDays: DAYS[mulank] ?? DAYS[1],
    loShu: counts,
    missing: counts.filter((c) => c.count === 0).map((c) => c.number),
    note: {
      en: `Mūlāṅka ${mulank} (${PLANET_NAMES[lord as keyof typeof PLANET_NAMES].en}) and bhāgyāṅka ${bhagyank} (${PLANET_NAMES[destinyLord as keyof typeof PLANET_NAMES].en}). The missing Lo Shu numbers (${counts.filter((c) => c.count === 0).map((c) => c.number).join(", ") || "none"}) show habits worth consciously building.`,
      hi: `मूलांक ${mulank} (${PLANET_NAMES[lord as keyof typeof PLANET_NAMES].hi}) और भाग्यांक ${bhagyank} (${PLANET_NAMES[destinyLord as keyof typeof PLANET_NAMES].hi})। लो शू ग्रिड में अनुपस्थित अंक (${counts.filter((c) => c.count === 0).map((c) => c.number).join(", ") || "कोई नहीं"}) ऐसी आदतें दर्शाते हैं जिन्हें सचेत रूप से विकसित करना चाहिए।`,
    },
  };
}
