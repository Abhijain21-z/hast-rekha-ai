/**
 * Gochara (transits) from the natal Moon, plus Sade Sati and Jupiter/Saturn
 * returns. Positions are recomputed once per day and cached, so a reading page
 * never pays for an ephemeris it already has.
 */
import { getEphemeris } from "./ephemeris";
import { PLANET_NAMES, SIGNS } from "./data";
import type { Graha, TransitInfo, TransitPlanet } from "./types";

/** Classical favourable houses counted from the natal Moon. */
const FAVOURABLE: Record<Graha, number[]> = {
  sun: [3, 6, 10, 11],
  moon: [1, 3, 6, 7, 10, 11],
  mars: [3, 6, 11],
  mercury: [2, 4, 6, 8, 10, 11],
  jupiter: [2, 5, 7, 9, 11],
  venus: [1, 2, 3, 4, 5, 8, 9, 11, 12],
  saturn: [3, 6, 11],
  rahu: [3, 6, 11],
  ketu: [3, 6, 11],
};

const HOUSE_THEME: Record<number, { en: string; hi: string }> = {
  1: { en: "self and health", hi: "स्वयं और स्वास्थ्य" },
  2: { en: "money and family", hi: "धन और परिवार" },
  3: { en: "effort and siblings", hi: "परिश्रम और भाई-बहन" },
  4: { en: "home and peace of mind", hi: "घर और मानसिक शांति" },
  5: { en: "children, study and creativity", hi: "संतान, अध्ययन और सृजन" },
  6: { en: "health, service and rivals", hi: "स्वास्थ्य, सेवा और प्रतिद्वंद्वी" },
  7: { en: "marriage and partnership", hi: "विवाह और साझेदारी" },
  8: { en: "change, inheritance and secrets", hi: "परिवर्तन, विरासत और रहस्य" },
  9: { en: "fortune, dharma and travel", hi: "भाग्य, धर्म और यात्रा" },
  10: { en: "career and public status", hi: "करियर और प्रतिष्ठा" },
  11: { en: "gains and networks", hi: "लाभ और नेटवर्क" },
  12: { en: "expenses, rest and foreign lands", hi: "व्यय, विश्राम और विदेश" },
};

const houseFrom = (sign: number, reference: number) => ((sign - reference + 12) % 12) + 1;

const cache = new Map<string, TransitInfo>();
const CACHE_LIMIT = 128;

export interface NatalReference {
  moonSign: number;
  lagnaSign: number;
  sunSign: number;
  jupiterSign: number;
  saturnSign: number;
}

/** The site's audience is in India, so "today" means the IST calendar day. */
const IST_OFFSET = 5.5;

export function buildTransits(natal: NatalReference, now = new Date()): TransitInfo {
  const local = new Date(now.getTime() + IST_OFFSET * 3_600_000);
  const date = local.toISOString().slice(0, 10);
  const key = `${date}|${natal.moonSign}|${natal.lagnaSign}|${natal.jupiterSign}|${natal.saturnSign}`;
  const hit = cache.get(key);
  if (hit) return hit;

  // Midday IST gives a stable daily snapshot (the Moon moves ~0.5°/hour).
  const eph = getEphemeris({ date, time: "12:00", latitude: 0, longitude: 0, tzOffset: IST_OFFSET });

  const planets: TransitPlanet[] = eph.planets
    .filter((p) => ["sun", "moon", "mars", "mercury", "jupiter", "venus", "saturn", "rahu", "ketu"].includes(p.key))
    .map((p) => {
      const sign = Math.floor(p.sidereal / 30);
      const fromMoon = houseFrom(sign, natal.moonSign);
      const favourable = FAVOURABLE[p.key].includes(fromMoon);
      const theme = HOUSE_THEME[fromMoon];
      return {
        key: p.key,
        name: PLANET_NAMES[p.key],
        sign,
        signName: SIGNS[sign].name,
        degreeInSign: Math.round((p.sidereal % 30) * 100) / 100,
        retrograde: p.retrograde,
        houseFromMoon: fromMoon,
        houseFromLagna: houseFrom(sign, natal.lagnaSign),
        favorable: favourable,
        note: favourable
          ? {
              en: `Supportive gochara through your ${ordinalEn(fromMoon)} from the Moon (${theme.en}).`,
              hi: `चंद्रमा से ${ordinalHi(fromMoon)} भाव में शुभ गोचर (${theme.hi})।`,
            }
          : {
              en: `Testing gochara through your ${ordinalEn(fromMoon)} from the Moon (${theme.en}).`,
              hi: `चंद्रमा से ${ordinalHi(fromMoon)} भाव में परीक्षा का गोचर (${theme.hi})।`,
            },
      };
    });

  const saturn = planets.find((p) => p.key === "saturn")!;
  const jupiter = planets.find((p) => p.key === "jupiter")!;

  const sadeSati = (() => {
    if (saturn.houseFromMoon === 12) {
      return {
        active: true,
        phase: "rising" as const,
        note: {
          en: "Sade Sati, first phase: Saturn transits the 12th from your Moon. Expenses and sleep need discipline; keep commitments small and regular.",
          hi: "साढ़े साती, पहला चरण: शनि चंद्रमा से बारहवें भाव में है। व्यय और नींद पर अनुशासन रखें; छोटे नियमित संकल्प लें।",
        },
      };
    }
    if (saturn.houseFromMoon === 1) {
      return {
        active: true,
        phase: "peak" as const,
        note: {
          en: "Sade Sati, peak phase: Saturn crosses the Moon. Energy and confidence are tested — simplify, sleep well and avoid impulsive exits.",
          hi: "साढ़े साती, मध्य चरण: शनि चंद्रमा पर है। ऊर्जा और आत्मविश्वास की परीक्षा — सरलता, नींद और जल्दबाज़ी से बचाव ज़रूरी है।",
        },
      };
    }
    if (saturn.houseFromMoon === 2) {
      return {
        active: true,
        phase: "setting" as const,
        note: {
          en: "Sade Sati, final phase: Saturn transits the 2nd from your Moon. Family and finances stabilise as old obligations are cleared.",
          hi: "साढ़े साती, अंतिम चरण: शनि चंद्रमा से दूसरे भाव में है। पुराने दायित्व पूरे होते ही परिवार और धन स्थिर होते हैं।",
        },
      };
    }
    return {
      active: false,
      phase: "none" as const,
      note: {
        en: "Sade Sati is not active; Saturn is outside the 12th, 1st and 2nd from your Moon.",
        hi: "साढ़े साती सक्रिय नहीं है; शनि चंद्रमा से बारहवें, पहले या दूसरे भाव में नहीं है।",
      },
    };
  })();

  const highlights: { en: string; hi: string }[] = [];
  highlights.push({
    en: `Saturn is in ${SIGNS[saturn.sign].name.en}, the ${ordinalEn(saturn.houseFromMoon)} from your Moon.`,
    hi: `शनि ${SIGNS[saturn.sign].name.hi} में, आपके चंद्रमा से ${ordinalHi(saturn.houseFromMoon)} भाव में है।`,
  });
  highlights.push({
    en: `Jupiter is in ${SIGNS[jupiter.sign].name.en}, the ${ordinalEn(jupiter.houseFromMoon)} from your Moon — ${jupiter.favorable ? "a supportive period for expansion" : "growth needs patience and planning"}.`,
    hi: `गुरु ${SIGNS[jupiter.sign].name.hi} में, चंद्रमा से ${ordinalHi(jupiter.houseFromMoon)} भाव में — ${jupiter.favorable ? "विस्तार के लिए सहायक समय" : "वृद्धि के लिए धैर्य और योजना ज़रूरी"}.`,
  });
  if (sadeSati.active) highlights.push(sadeSati.note);

  const jupiterReturn = jupiter.sign === natal.jupiterSign;
  const saturnReturn = saturn.sign === natal.saturnSign;
  if (jupiterReturn) {
    highlights.push({
      en: "Jupiter has returned to its birth sign — a 12-year growth checkpoint and a good year to start something durable.",
      hi: "गुरु अपनी जन्म राशि में लौटा है — 12 वर्षीय विकास का पड़ाव, कुछ टिकाऊ शुरू करने का अच्छा वर्ष।",
    });
  }
  if (saturnReturn) {
    highlights.push({
      en: "Saturn has returned to its birth sign — a maturity checkpoint that rewards structure and long-term thinking.",
      hi: "शनि अपनी जन्म राशि में लौटा है — परिपक्वता का पड़ाव, संरचना और दीर्घकालिक सोच का फल देता है।",
    });
  }

  const result: TransitInfo = {
    asOf: date,
    planets,
    sadeSati,
    highlights,
    jupiterReturn,
    saturnReturn,
  };
  if (cache.size >= CACHE_LIMIT) {
    const oldest = cache.keys().next().value;
    if (oldest !== undefined) cache.delete(oldest);
  }
  cache.set(key, result);
  return result;
}

const EN = ["", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th"];
const HI = ["", "पहले", "दूसरे", "तीसरे", "चौथे", "पाँचवें", "छठे", "सातवें", "आठवें", "नौवें", "दसवें", "ग्यारहवें", "बारहवें"];
export const ordinalEn = (n: number) => EN[n] ?? `${n}th`;
export const ordinalHi = (n: number) => HI[n] ?? `${n}वें`;
