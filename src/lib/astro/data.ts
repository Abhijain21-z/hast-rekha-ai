/**
 * Classical reference data used by the Vedic engine.
 *
 * Sources kept deliberately readable so an astrologer can audit the tables:
 *   - Bṛhat Parāśara Horā Śāstra (signs, lords, dignities, Viṃśottarī)
 *   - Sūrya Siddhānta (nakṣatra sequence, tithi/yoga/karaṇa)
 *   - standard Lahiri (Chitrapakṣa) ayanāṃśa
 *
 * Every label is bilingual because the site serves Hindi and English readers.
 */
import type { Bi } from "../i18n";
import type { Dignity, Graha, NakshatraInfo, SignInfo } from "./types";

export const PLANET_NAMES: Record<Graha, Bi> = {
  sun: { en: "Sun", hi: "सूर्य" },
  moon: { en: "Moon", hi: "चंद्र" },
  mars: { en: "Mars", hi: "मंगल" },
  mercury: { en: "Mercury", hi: "बुध" },
  jupiter: { en: "Jupiter", hi: "गुरु" },
  venus: { en: "Venus", hi: "शुक्र" },
  saturn: { en: "Saturn", hi: "शनि" },
  rahu: { en: "Rahu", hi: "राहु" },
  ketu: { en: "Ketu", hi: "केतु" },
};

export const PLANET_SANSKRIT: Record<Graha, Bi> = {
  sun: { en: "Surya", hi: "सूर्य" },
  moon: { en: "Chandra", hi: "चंद्र" },
  mars: { en: "Mangal", hi: "मंगल" },
  mercury: { en: "Budh", hi: "बुध" },
  jupiter: { en: "Guru", hi: "गुरु" },
  venus: { en: "Shukra", hi: "शुक्र" },
  saturn: { en: "Shani", hi: "शनि" },
  rahu: { en: "Rahu", hi: "राहु" },
  ketu: { en: "Ketu", hi: "केतु" },
};

export const SIGNS: SignInfo[] = [
  { index: 0, key: "aries", name: { en: "Aries", hi: "मेष" }, lord: "mars", element: "fire", quality: "movable" },
  { index: 1, key: "taurus", name: { en: "Taurus", hi: "वृषभ" }, lord: "venus", element: "earth", quality: "fixed" },
  { index: 2, key: "gemini", name: { en: "Gemini", hi: "मिथुन" }, lord: "mercury", element: "air", quality: "dual" },
  { index: 3, key: "cancer", name: { en: "Cancer", hi: "कर्क" }, lord: "moon", element: "water", quality: "movable" },
  { index: 4, key: "leo", name: { en: "Leo", hi: "सिंह" }, lord: "sun", element: "fire", quality: "fixed" },
  { index: 5, key: "virgo", name: { en: "Virgo", hi: "कन्या" }, lord: "mercury", element: "earth", quality: "dual" },
  { index: 6, key: "libra", name: { en: "Libra", hi: "तुला" }, lord: "venus", element: "air", quality: "movable" },
  { index: 7, key: "scorpio", name: { en: "Scorpio", hi: "वृश्चिक" }, lord: "mars", element: "water", quality: "fixed" },
  { index: 8, key: "sagittarius", name: { en: "Sagittarius", hi: "धनु" }, lord: "jupiter", element: "fire", quality: "dual" },
  { index: 9, key: "capricorn", name: { en: "Capricorn", hi: "मकर" }, lord: "saturn", element: "earth", quality: "movable" },
  { index: 10, key: "aquarius", name: { en: "Aquarius", hi: "कुम्भ" }, lord: "saturn", element: "air", quality: "fixed" },
  { index: 11, key: "pisces", name: { en: "Pisces", hi: "मीन" }, lord: "jupiter", element: "water", quality: "dual" },
];

export const signAt = (index: number): SignInfo => SIGNS[((index % 12) + 12) % 12];

export const NAKSHATRAS: NakshatraInfo[] = [
  { index: 0, key: "ashwini", name: { en: "Ashwini", hi: "अश्विनी" }, lord: "ketu" },
  { index: 1, key: "bharani", name: { en: "Bharani", hi: "भरणी" }, lord: "venus" },
  { index: 2, key: "krittika", name: { en: "Krittika", hi: "कृत्तिका" }, lord: "sun" },
  { index: 3, key: "rohini", name: { en: "Rohini", hi: "रोहिणी" }, lord: "moon" },
  { index: 4, key: "mrigashira", name: { en: "Mrigashira", hi: "मृगशिरा" }, lord: "mars" },
  { index: 5, key: "ardra", name: { en: "Ardra", hi: "आर्द्रा" }, lord: "rahu" },
  { index: 6, key: "punarvasu", name: { en: "Punarvasu", hi: "पुनर्वसु" }, lord: "jupiter" },
  { index: 7, key: "pushya", name: { en: "Pushya", hi: "पुष्य" }, lord: "saturn" },
  { index: 8, key: "ashlesha", name: { en: "Ashlesha", hi: "आश्लेषा" }, lord: "mercury" },
  { index: 9, key: "magha", name: { en: "Magha", hi: "मघा" }, lord: "ketu" },
  { index: 10, key: "purva-phalguni", name: { en: "Purva Phalguni", hi: "पूर्वा फाल्गुनी" }, lord: "venus" },
  { index: 11, key: "uttara-phalguni", name: { en: "Uttara Phalguni", hi: "उत्तरा फाल्गुनी" }, lord: "sun" },
  { index: 12, key: "hasta", name: { en: "Hasta", hi: "हस्त" }, lord: "moon" },
  { index: 13, key: "chitra", name: { en: "Chitra", hi: "चित्रा" }, lord: "mars" },
  { index: 14, key: "swati", name: { en: "Swati", hi: "स्वाति" }, lord: "rahu" },
  { index: 15, key: "vishakha", name: { en: "Vishakha", hi: "विशाखा" }, lord: "jupiter" },
  { index: 16, key: "anuradha", name: { en: "Anuradha", hi: "अनुराधा" }, lord: "saturn" },
  { index: 17, key: "jyeshtha", name: { en: "Jyeshtha", hi: "ज्येष्ठा" }, lord: "mercury" },
  { index: 18, key: "mula", name: { en: "Mula", hi: "मूल" }, lord: "ketu" },
  { index: 19, key: "purva-ashadha", name: { en: "Purva Ashadha", hi: "पूर्वाषाढ़ा" }, lord: "venus" },
  { index: 20, key: "uttara-ashadha", name: { en: "Uttara Ashadha", hi: "उत्तराषाढ़ा" }, lord: "sun" },
  { index: 21, key: "shravana", name: { en: "Shravana", hi: "श्रवण" }, lord: "moon" },
  { index: 22, key: "dhanishta", name: { en: "Dhanishta", hi: "धनिष्ठा" }, lord: "mars" },
  { index: 23, key: "shatabhisha", name: { en: "Shatabhisha", hi: "शतभिषा" }, lord: "rahu" },
  { index: 24, key: "purva-bhadrapada", name: { en: "Purva Bhadrapada", hi: "पूर्वा भाद्रपद" }, lord: "jupiter" },
  { index: 25, key: "uttara-bhadrapada", name: { en: "Uttara Bhadrapada", hi: "उत्तरा भाद्रपद" }, lord: "saturn" },
  { index: 26, key: "revati", name: { en: "Revati", hi: "रेवती" }, lord: "mercury" },
];

export const nakshatraAt = (index: number): NakshatraInfo => NAKSHATRAS[((index % 27) + 27) % 27];

/** Viṃśottarī order and years — total is exactly 120. */
export const DASHA_ORDER: Graha[] = ["ketu", "venus", "sun", "moon", "mars", "rahu", "jupiter", "saturn", "mercury"];
export const DASHA_YEARS: Record<Graha, number> = {
  ketu: 7,
  venus: 20,
  sun: 6,
  moon: 10,
  mars: 7,
  rahu: 18,
  jupiter: 16,
  saturn: 19,
  mercury: 17,
};

export interface DignityRule {
  exaltation: number;
  debilitation: number;
  own: number[];
  moolatrikona?: { sign: number; from: number; to: number };
}

export const DIGNITY_RULES: Record<Graha, DignityRule> = {
  sun: { exaltation: 0, debilitation: 6, own: [4], moolatrikona: { sign: 4, from: 0, to: 20 } },
  moon: { exaltation: 1, debilitation: 7, own: [3], moolatrikona: { sign: 1, from: 4, to: 30 } },
  mars: { exaltation: 9, debilitation: 3, own: [0, 7], moolatrikona: { sign: 0, from: 0, to: 12 } },
  mercury: { exaltation: 5, debilitation: 11, own: [2, 5], moolatrikona: { sign: 5, from: 16, to: 20 } },
  jupiter: { exaltation: 3, debilitation: 9, own: [8, 11], moolatrikona: { sign: 8, from: 0, to: 10 } },
  venus: { exaltation: 11, debilitation: 5, own: [1, 6], moolatrikona: { sign: 6, from: 0, to: 15 } },
  saturn: { exaltation: 6, debilitation: 0, own: [9, 10], moolatrikona: { sign: 10, from: 0, to: 20 } },
  // Rahu/Ketu own-sign and exaltation conventions differ by school. These are
  // the most widely used (Rahu: Taurus exalted, Scorpio debilitated).
  rahu: { exaltation: 1, debilitation: 7, own: [10] },
  ketu: { exaltation: 7, debilitation: 1, own: [7] },
};

/** Natural friendships (Parāśara). Missing entries are neutral. */
export const FRIENDS: Record<Graha, Graha[]> = {
  sun: ["moon", "mars", "jupiter"],
  moon: ["sun", "mercury"],
  mars: ["sun", "moon", "jupiter"],
  mercury: ["sun", "venus"],
  jupiter: ["sun", "moon", "mars"],
  venus: ["mercury", "saturn"],
  saturn: ["mercury", "venus"],
  rahu: ["venus", "saturn", "mercury"],
  ketu: ["mars", "venus", "saturn"],
};

export const ENEMIES: Record<Graha, Graha[]> = {
  sun: ["venus", "saturn"],
  moon: [],
  mars: ["mercury"],
  mercury: ["moon"],
  jupiter: ["mercury", "venus"],
  venus: ["sun", "moon"],
  saturn: ["sun", "moon", "mars"],
  rahu: ["sun", "moon", "mars"],
  ketu: ["sun", "moon"],
};

export const DIGNITY_LABELS: Record<Dignity, Bi> = {
  exalted: { en: "Exalted (uccha)", hi: "उच्च" },
  moolatrikona: { en: "Moolatrikona", hi: "मूलत्रिकोण" },
  own: { en: "Own sign (swakshetra)", hi: "स्वग्रही" },
  friend: { en: "Friendly sign", hi: "मित्र राशि" },
  neutral: { en: "Neutral sign", hi: "सम राशि" },
  enemy: { en: "Enemy sign", hi: "शत्रु राशि" },
  debilitated: { en: "Debilitated (neecha)", hi: "नीच" },
};

/** Combustion orbs in degrees (retrograde Mercury/Venus have a tighter orb). */
export const COMBUSTION_ORB: Partial<Record<Graha, number>> = {
  moon: 12,
  mars: 17,
  mercury: 14,
  jupiter: 11,
  venus: 10,
  saturn: 15,
};

/** Houses of directional strength (dig bala). */
export const DIG_BALA_HOUSE: Partial<Record<Graha, number>> = {
  sun: 10,
  mars: 10,
  jupiter: 1,
  mercury: 1,
  moon: 4,
  venus: 4,
  saturn: 7,
};

export const TITHI_NAMES: Bi[] = [
  { en: "Pratipada", hi: "प्रतिपदा" },
  { en: "Dwitiya", hi: "द्वितीया" },
  { en: "Tritiya", hi: "तृतीया" },
  { en: "Chaturthi", hi: "चतुर्थी" },
  { en: "Panchami", hi: "पंचमी" },
  { en: "Shashthi", hi: "षष्ठी" },
  { en: "Saptami", hi: "सप्तमी" },
  { en: "Ashtami", hi: "अष्टमी" },
  { en: "Navami", hi: "नवमी" },
  { en: "Dashami", hi: "दशमी" },
  { en: "Ekadashi", hi: "एकादशी" },
  { en: "Dwadashi", hi: "द्वादशी" },
  { en: "Trayodashi", hi: "त्रयोदशी" },
  { en: "Chaturdashi", hi: "चतुर्दशी" },
  { en: "Purnima", hi: "पूर्णिमा" },
  { en: "Pratipada", hi: "प्रतिपदा" },
  { en: "Dwitiya", hi: "द्वितीया" },
  { en: "Tritiya", hi: "तृतीया" },
  { en: "Chaturthi", hi: "चतुर्थी" },
  { en: "Panchami", hi: "पंचमी" },
  { en: "Shashthi", hi: "षष्ठी" },
  { en: "Saptami", hi: "सप्तमी" },
  { en: "Ashtami", hi: "अष्टमी" },
  { en: "Navami", hi: "नवमी" },
  { en: "Dashami", hi: "दशमी" },
  { en: "Ekadashi", hi: "एकादशी" },
  { en: "Dwadashi", hi: "द्वादशी" },
  { en: "Trayodashi", hi: "त्रयोदशी" },
  { en: "Chaturdashi", hi: "चतुर्दशी" },
  { en: "Amavasya", hi: "अमावस्या" },
];

export const YOGA_NAMES: Bi[] = [
  { en: "Vishkambha", hi: "विष्कम्भ" },
  { en: "Priti", hi: "प्रीति" },
  { en: "Ayushman", hi: "आयुष्मान" },
  { en: "Saubhagya", hi: "सौभाग्य" },
  { en: "Shobhana", hi: "शोभन" },
  { en: "Atiganda", hi: "अतिगण्ड" },
  { en: "Sukarma", hi: "सुकर्मा" },
  { en: "Dhriti", hi: "धृति" },
  { en: "Shula", hi: "शूल" },
  { en: "Ganda", hi: "गण्ड" },
  { en: "Vriddhi", hi: "वृद्धि" },
  { en: "Dhruva", hi: "ध्रुव" },
  { en: "Vyaghata", hi: "व्याघात" },
  { en: "Harshana", hi: "हर्षण" },
  { en: "Vajra", hi: "वज्र" },
  { en: "Siddhi", hi: "सिद्धि" },
  { en: "Vyatipata", hi: "व्यतीपात" },
  { en: "Variyana", hi: "वरीयान" },
  { en: "Parigha", hi: "परिघ" },
  { en: "Shiva", hi: "शिव" },
  { en: "Siddha", hi: "सिद्ध" },
  { en: "Sadhya", hi: "साध्य" },
  { en: "Shubha", hi: "शुभ" },
  { en: "Shukla", hi: "शुक्ल" },
  { en: "Brahma", hi: "ब्रह्म" },
  { en: "Indra", hi: "इन्द्र" },
  { en: "Vaidhriti", hi: "वैधृति" },
];

const KARANA_CYCLE: Bi[] = [
  { en: "Bava", hi: "बव" },
  { en: "Balava", hi: "बालव" },
  { en: "Kaulava", hi: "कौलव" },
  { en: "Taitila", hi: "तैतिल" },
  { en: "Gara", hi: "गर" },
  { en: "Vanija", hi: "वणिज" },
  { en: "Vishti", hi: "विष्टि" },
];

export function karanaName(index: number): Bi {
  if (index <= 0) return { en: "Kimstughna", hi: "किंस्तुघ्न" };
  if (index >= 57) {
    const fixed: Bi[] = [
      { en: "Shakuni", hi: "शकुनि" },
      { en: "Chatushpada", hi: "चतुष्पद" },
      { en: "Naga", hi: "नाग" },
    ];
    return fixed[index - 57] ?? KARANA_CYCLE[index % 7];
  }
  return KARANA_CYCLE[(index - 1) % 7];
}

export const VARA_NAMES: Bi[] = [
  { en: "Sunday (Ravivara)", hi: "रविवार" },
  { en: "Monday (Somavara)", hi: "सोमवार" },
  { en: "Tuesday (Mangalavara)", hi: "मंगलवार" },
  { en: "Wednesday (Budhavara)", hi: "बुधवार" },
  { en: "Thursday (Guruvara)", hi: "गुरुवार" },
  { en: "Friday (Shukravara)", hi: "शुक्रवार" },
  { en: "Saturday (Shanivara)", hi: "शनिवार" },
];

/** Weekday lords, used for the first hora after sunrise. */
export const VARA_LORDS: Graha[] = ["sun", "moon", "mars", "mercury", "jupiter", "venus", "saturn"];

/** Chaldean order used by the planetary hours. */
export const HORA_ORDER: Graha[] = ["saturn", "jupiter", "mars", "sun", "venus", "mercury", "moon"];

export const LUNAR_MONTHS: Bi[] = [
  { en: "Chaitra", hi: "चैत्र" },
  { en: "Vaishakha", hi: "वैशाख" },
  { en: "Jyeshtha", hi: "ज्येष्ठ" },
  { en: "Ashadha", hi: "आषाढ़" },
  { en: "Shravana", hi: "श्रावण" },
  { en: "Bhadrapada", hi: "भाद्रपद" },
  { en: "Ashwina", hi: "आश्विन" },
  { en: "Kartika", hi: "कार्तिक" },
  { en: "Margashirsha", hi: "मार्गशीर्ष" },
  { en: "Pausha", hi: "पौष" },
  { en: "Magha", hi: "माघ" },
  { en: "Phalguna", hi: "फाल्गुन" },
];

export const RITUS: Bi[] = [
  { en: "Vasanta (spring)", hi: "वसंत" },
  { en: "Grishma (summer)", hi: "ग्रीष्म" },
  { en: "Varsha (monsoon)", hi: "वर्षा" },
  { en: "Sharad (autumn)", hi: "शरद" },
  { en: "Hemanta (pre-winter)", hi: "हेमंत" },
  { en: "Shishira (winter)", hi: "शिशिर" },
];
