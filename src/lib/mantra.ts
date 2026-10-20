/**
 * Pro-only, rashi-wise "gupt mantra" and "gupt prayog".
 *
 * The free reading already shows a single lucky mantra (rashi.lucky.mantra).
 * This module deliberately uses the fuller graha beej mantra of the Moon-sign
 * lord, plus the traditional Lakshmi wealth beej and a personal sankalp built
 * from the visitor's name, rashi and nakshatra. Nothing here is rendered until
 * the Pro paywall is unlocked.
 */
import type { AstroResult } from "./astrology";
import { nakshatraAt, rashiAt } from "./content";
import type { Bi } from "./i18n";

type LordKey = "surya" | "chandra" | "mangal" | "budh" | "guru" | "shukra" | "shani";

interface LordRule {
  day: Bi;
  direction: Bi;
  colour: Bi;
  offering: Bi;
  daan: Bi;
}

const LORD_RULES: Record<LordKey, LordRule> = {
  surya: {
    day: { en: "Sunday", hi: "रविवार" },
    direction: { en: "East", hi: "पूर्व" },
    colour: { en: "Red or copper", hi: "लाल या ताँबा" },
    offering: { en: "jaggery and wheat", hi: "गुड़ और गेहूँ" },
    daan: { en: "wheat, jaggery or a copper vessel", hi: "गेहूँ, गुड़ या ताँबे का पात्र" },
  },
  chandra: {
    day: { en: "Monday", hi: "सोमवार" },
    direction: { en: "North", hi: "उत्तर" },
    colour: { en: "White", hi: "सफ़ेद" },
    offering: { en: "raw milk and rice", hi: "कच्चा दूध और चावल" },
    daan: { en: "rice, milk or white cloth", hi: "चावल, दूध या सफ़ेद वस्त्र" },
  },
  mangal: {
    day: { en: "Tuesday", hi: "मंगलवार" },
    direction: { en: "South", hi: "दक्षिण" },
    colour: { en: "Red", hi: "लाल" },
    offering: { en: "red flowers and masoor dal", hi: "लाल फूल और मसूर दाल" },
    daan: { en: "masoor dal, copper or red cloth", hi: "मसूर दाल, ताँबा या लाल वस्त्र" },
  },
  budh: {
    day: { en: "Wednesday", hi: "बुधवार" },
    direction: { en: "North", hi: "उत्तर" },
    colour: { en: "Green", hi: "हरा" },
    offering: { en: "moong dal and fresh green durva", hi: "मूँग दाल और हरी दूर्वा" },
    daan: { en: "moong dal, something green or a book", hi: "मूँग दाल, हरी वस्तु या पुस्तक" },
  },
  guru: {
    day: { en: "Thursday", hi: "गुरुवार" },
    direction: { en: "North-East", hi: "उत्तर-पूर्व" },
    colour: { en: "Yellow", hi: "पीला" },
    offering: { en: "turmeric, chana dal and banana", hi: "हल्दी, चने की दाल और केला" },
    daan: { en: "chana dal, turmeric or yellow cloth", hi: "चने की दाल, हल्दी या पीला वस्त्र" },
  },
  shukra: {
    day: { en: "Friday", hi: "शुक्रवार" },
    direction: { en: "South-East", hi: "दक्षिण-पूर्व" },
    colour: { en: "White", hi: "सफ़ेद" },
    offering: { en: "white flowers, sugar and rice", hi: "सफ़ेद फूल, चीनी और चावल" },
    daan: { en: "rice, sugar, perfume or white cloth", hi: "चावल, चीनी, इत्र या सफ़ेद वस्त्र" },
  },
  shani: {
    day: { en: "Saturday", hi: "शनिवार" },
    direction: { en: "West", hi: "पश्चिम" },
    colour: { en: "Dark blue or black", hi: "गहरा नीला या काला" },
    offering: { en: "mustard oil, black sesame and a lamp", hi: "सरसों तेल, काले तिल और दीपक" },
    daan: { en: "black sesame, mustard oil or black cloth", hi: "काले तिल, सरसों तेल या काला वस्त्र" },
  },
};

const RASHI_LORD: Record<string, LordKey> = {
  mesha: "mangal",
  vrishabha: "shukra",
  mithuna: "budh",
  karka: "chandra",
  simha: "surya",
  kanya: "budh",
  tula: "shukra",
  vrishchika: "mangal",
  dhanu: "guru",
  makara: "shani",
  kumbha: "shani",
  meena: "guru",
};

/** Full navagraha beej mantras — deeper than the short lucky mantras shown free. */
const LORD_BEEJ: Record<LordKey, string> = {
  surya: "ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः",
  chandra: "ॐ श्रां श्रीं श्रौं सः चन्द्राय नमः",
  mangal: "ॐ क्रां क्रीं क्रौं सः भौमाय नमः",
  budh: "ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः",
  guru: "ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः",
  shukra: "ॐ द्रां द्रीं द्रौं सः शुक्राय नमः",
  shani: "ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः",
};

export interface MantraReport {
  rashiName: Bi;
  rashiLord: Bi;
  nakshatraName: Bi;
  pada: number;
  beej: string;
  beejMeaning: Bi;
  dhanBeej: string;
  dhanMeaning: Bi;
  seedChips: string[];
  sankalp: Bi;
  startDay: Bi;
  direction: Bi;
  colour: Bi;
  offering: Bi;
  daan: Bi;
  count: Bi;
  practiceDays: number;
  steps: Bi[];
  disclaimer: Bi;
}

export function buildMantraReport({ fullName, result }: { fullName: string; result: AstroResult }): MantraReport {
  const rashi = rashiAt(result.moonRashi);
  const nak = nakshatraAt(result.nakshatra);
  const lordKey = RASHI_LORD[rashi.key] ?? "surya";
  const rule = LORD_RULES[lordKey];
  const beej = LORD_BEEJ[lordKey];
  const name = fullName.trim() || "साधक";
  const nameEn = fullName.trim() || "seeker";
  const practiceDays = 21;
  const rashiCount = 108;
  const dhanCount = 21;

  const sankalp: Bi = {
    hi: `मैं ${name}, ${rashi.short.hi} राशि और ${nak.name.hi} नक्षत्र (चरण ${result.pada}) का जातक, धन-प्राप्ति, स्थिरता और समृद्धि के लिए यह संकल्प लेता हूँ।`,
    en: `I, ${nameEn}, born in ${rashi.short.en} Moon sign and ${nak.name.en} nakshatra (pada ${result.pada}), take this sankalp for wealth, stability and prosperity.`,
  };

  const steps: Bi[] = [
    {
      hi: `${rule.day.hi} की सुबह स्नान करके ${rule.direction.hi} दिशा की ओर मुँह करके बैठें।`,
      en: `On ${rule.day.en} morning, bathe and sit facing ${rule.direction.en}.`,
    },
    {
      hi: `सामने घी का दीपक जलाएँ और ${rule.offering.hi} अर्पित करें।`,
      en: `Light a ghee lamp in front of you and offer ${rule.offering.en}.`,
    },
    {
      hi: `ऊपर लिखा संकल्प बोलकर “${beej}” का ${rashiCount} बार जप करें।`,
      en: `Recite the sankalp above, then chant “${beej}” ${rashiCount} times.`,
    },
    {
      hi: `इसके बाद “ॐ श्रीं ह्रीं क्लीं” का ${dhanCount} बार जप करें।`,
      en: `Then chant “ॐ श्रीं ह्रीं क्लीं” ${dhanCount} times.`,
    },
    {
      hi: `जप के बाद ${rule.daan.hi} का दान करें या किसी ज़रूरतमंद को ${rule.offering.hi} दें।`,
      en: `After the japa, donate ${rule.daan.en} or give ${rule.offering.en} to someone in need.`,
    },
    {
      hi: `यह विधि ${practiceDays} दिन तक रोज़ करें; बीच में न छोड़ें और जो मिले उसका आभार व्यक्त करें।`,
      en: `Do this daily for ${practiceDays} days without a break, and express gratitude for what you receive.`,
    },
    {
      hi: `इस मंत्र और प्रयोग को गुप्त रखें — इसे दूसरों को दिखाएँ नहीं।`,
      en: `Keep this mantra and practice private — do not display it to others.`,
    },
  ];

  return {
    rashiName: rashi.short,
    rashiLord: rashi.lord,
    nakshatraName: nak.name,
    pada: result.pada,
    beej,
    beejMeaning: {
      hi: `यह आपकी राशि के स्वामी ${rashi.lord.hi} का पूर्ण बीज मंत्र है, जो आपकी राशि के अनुसार चुना गया है।`,
      en: `This is the full beej mantra of your Moon-sign lord ${rashi.lord.en}, chosen for your rashi.`,
    },
    dhanBeej: "ॐ श्रीं ह्रीं क्लीं",
    dhanMeaning: {
      hi: "“श्रीं” महालक्ष्मी, “ह्रीं” शक्ति और “क्लीं” आकर्षण का बीज है — परंपरा में यह धन-प्रवाह और समृद्धि के लिए जपा जाता है।",
      en: "“Shreem” is Lakshmi, “Hreem” is Shakti and “Kleem” is attraction — traditionally chanted for steady income and prosperity.",
    },
    seedChips: ["श्रीं", "ह्रीं", "क्लीं"],
    sankalp,
    startDay: rule.day,
    direction: rule.direction,
    colour: rule.colour,
    offering: rule.offering,
    daan: rule.daan,
    count: {
      hi: `राशि-बीज ${rashiCount} + धन-बीज ${dhanCount}`,
      en: `${rashiCount} rashi beej + ${dhanCount} wealth beej`,
    },
    practiceDays,
    steps,
    disclaimer: {
      hi: "यह एक पारंपरिक आध्यात्मिक उपाय है, धन-प्राप्ति की गारंटी नहीं। पैसे से जुड़े निर्णय अपने विवेक से लें।",
      en: "This is a traditional spiritual practice, not a guarantee of financial results. Keep your own judgement for money decisions.",
    },
  };
}
