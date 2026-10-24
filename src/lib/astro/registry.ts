/**
 * The calculation registry.
 *
 * Every number the report shows comes from one of these entries. The list is
 * exported (and stored in each generated chart) so the engine can be audited,
 * versioned and expanded without hunting through the codebase — the "app
 * memory" for astrological methods.
 */
import type { Bi } from "../i18n";
import { VARGAS } from "./vargas";

export const ASTRO_ENGINE_VERSION = "1.0.0";

export type CalcCategory =
  | "ephemeris"
  | "position"
  | "house"
  | "panchang"
  | "varga"
  | "dasha"
  | "yoga"
  | "strength"
  | "aspect"
  | "transit"
  | "numerology";

export interface CalculationMeta {
  id: string;
  version: string;
  category: CalcCategory;
  title: Bi;
  source: string;
  description: Bi;
}

const BASE: CalculationMeta[] = [
  {
    id: "ephemeris.vsop87",
    version: "1.0.0",
    category: "ephemeris",
    title: { en: "VSOP87 planetary longitudes", hi: "VSOP87 ग्रह देशांतर" },
    source: "Bretagnon & Francou (1988), VSOP87B via astronomia (MIT)",
    description: {
      en: "Heliocentric series for Mercury–Neptune converted to geocentric ecliptic longitude with light-time correction.",
      hi: "बुध से नेपच्यून तक की सौर-केंद्रित श्रेणी, प्रकाश-समय सुधार के साथ भू-केंद्रित क्रांतिवृत्त देशांतर में।",
    },
  },
  {
    id: "ephemeris.moon",
    version: "1.0.0",
    category: "ephemeris",
    title: { en: "Lunar longitude (ELP2000)", hi: "चंद्र देशांतर (ELP2000)" },
    source: "Meeus, Astronomical Algorithms (1998), ch. 47",
    description: { en: "Apparent geocentric longitude of the Moon.", hi: "चंद्रमा का स्पष्ट भू-केंद्रित देशांतर।" },
  },
  {
    id: "ephemeris.sun",
    version: "1.0.0",
    category: "ephemeris",
    title: { en: "Apparent solar longitude", hi: "स्पष्ट सूर्य देशांतर" },
    source: "Meeus, Astronomical Algorithms (1998), ch. 25",
    description: { en: "True geometric Sun with aberration and nutation.", hi: "विक्षेपण और अयनांश-चलन सहित वास्तविक सूर्य।" },
  },
  {
    id: "ephemeris.ayanamsa",
    version: "1.0.0",
    category: "ephemeris",
    title: { en: "Lahiri ayanāṃśa", hi: "लाहिरी अयनांश" },
    source: "Chitrapaksha / Lahiri, linear J2000 fit",
    description: {
      en: "Tropical-to-sidereal conversion accurate to about one arc-minute around 2000.",
      hi: "2000 के आसपास लगभग एक कला तक सटीक सायन-निरयन रूपांतरण।",
    },
  },
  {
    id: "position.nine-grahas",
    version: "1.0.0",
    category: "position",
    title: { en: "Nine graha positions", hi: "नवग्रह स्थिति" },
    source: "Parāśara, BPHS ch. 3; standard mean node",
    description: {
      en: "Sidereal longitude, sign, degree, nakṣatra, pada, house, speed and retrogression for all nine grahas.",
      hi: "नौ ग्रहों का निरयन देशांतर, राशि, अंश, नक्षत्र, पाद, भाव, गति और वक्रता।",
    },
  },
  {
    id: "position.dignity",
    version: "1.0.0",
    category: "position",
    title: { en: "Exaltation, moolatrikona and friendship", hi: "उच्च, मूलत्रिकोण और मैत्री" },
    source: "BPHS ch. 3; Phaladeepika ch. 2",
    description: { en: "Natural dignity from the classical exaltation, own-sign and friendship tables.", hi: "शास्त्रीय उच्च, स्वराशि और मैत्री तालिकाओं से स्वाभाविक बल।" },
  },
  {
    id: "position.combustion",
    version: "1.0.0",
    category: "position",
    title: { en: "Combustion orbs", hi: "अस्त कक्षा" },
    source: "Phaladeepika; standard orbs",
    description: { en: "Planet close to the Sun loses visible strength; tighter orbs for retrograde Mercury and Venus.", hi: "सूर्य के निकट ग्रह का बल घटता है; वक्री बुध-शुक्र के लिए कक्षा कम।" },
  },
  {
    id: "position.avastha",
    version: "1.0.0",
    category: "position",
    title: { en: "Planetary avasthā", hi: "ग्रह अवस्था" },
    source: "BPHS ch. 45",
    description: { en: "Bāla, kumāra, yuvā, vṛddha and mṛta states by degree, reversed in even signs.", hi: "अंश के अनुसार बाल, कुमार, युवा, वृद्ध और मृत अवस्था, सम राशि में उलटी।" },
  },
  {
    id: "position.gandanta",
    version: "1.0.0",
    category: "position",
    title: { en: "Gandānta junction", hi: "गंडांत संधि" },
    source: "Classical nakṣatra literature",
    description: { en: "Last 3°20′ of water signs and first 3°20′ of fire signs — sensitive transition degrees.", hi: "जल राशियों के अंतिम 3°20′ और अग्नि राशियों के प्रथम 3°20′ — संवेदनशील संधि अंश।" },
  },
  {
    id: "house.whole-sign",
    version: "1.0.0",
    category: "house",
    title: { en: "Whole-sign bhavas", hi: "राशि-आधारित भाव" },
    source: "Parāśara whole-sign system",
    description: { en: "Twelve houses counted from the lagna sign, with occupants and lords.", hi: "लग्न राशि से बारह भाव, ग्रहों और स्वामियों सहित।" },
  },
  {
    id: "house.dig-bala",
    version: "1.0.0",
    category: "house",
    title: { en: "Directional strength", hi: "दिग्बल" },
    source: "BPHS ch. 27",
    description: { en: "Jupiter/Mercury in the 1st, Sun/Mars in the 10th, Saturn in the 7th, Moon/Venus in the 4th.", hi: "गुरु/बुध प्रथम, सूर्य/मंगल दशम, शनि सप्तम, चंद्र/शुक्र चतुर्थ में बलवान।" },
  },
  {
    id: "panchang.tithi",
    version: "1.0.0",
    category: "panchang",
    title: { en: "Tithi and pakṣa", hi: "तिथि और पक्ष" },
    source: "Sūrya Siddhānta",
    description: { en: "Moon–Sun elongation divided into 12° steps, with śukla/kṛṣṇa pakṣa.", hi: "चंद्र-सूर्य अंतर को 12° चरणों में विभाजित कर तिथि और पक्ष।" },
  },
  {
    id: "panchang.yoga",
    version: "1.0.0",
    category: "panchang",
    title: { en: "Nitya yoga", hi: "नित्य योग" },
    source: "Sūrya Siddhānta",
    description: { en: "Sun + Moon longitude divided into 27 nakṣatra-length steps.", hi: "सूर्य + चंद्र देशांतर को 27 नक्षत्र-लंबाई चरणों में विभाजित।" },
  },
  {
    id: "panchang.karana",
    version: "1.0.0",
    category: "panchang",
    title: { en: "Karaṇa", hi: "करण" },
    source: "Sūrya Siddhānta",
    description: { en: "Half-tithi, with the seven movable and four fixed karaṇas.", hi: "अर्ध-तिथि, सात चर और चार स्थिर करणों सहित।" },
  },
  {
    id: "panchang.sunrise",
    version: "1.0.0",
    category: "panchang",
    title: { en: "Sunrise and sunset", hi: "सूर्योदय और सूर्यास्त" },
    source: "Cooper's declination + equation of time (NOAA)",
    description: { en: "Approximate local sunrise/sunset to about ±3 minutes, used for horā and day/night birth.", hi: "स्थानीय सूर्योदय/सूर्यास्त लगभग ±3 मिनट, होरा और दिन/रात जन्म के लिए।" },
  },
  {
    id: "panchang.hora",
    version: "1.0.0",
    category: "panchang",
    title: { en: "Planetary hour (horā)", hi: "ग्रह होरा" },
    source: "Classical horā sequence (Chaldean order)",
    description: { en: "The ruling planet of the birth hour, continuing through the night.", hi: "जन्म घंटे का स्वामी ग्रह, रात्रि तक क्रम में।" },
  },
  {
    id: "panchang.lunar-month",
    version: "1.0.0",
    category: "panchang",
    title: { en: "Lunar month, season and Samvat", hi: "चांद्र मास, ऋतु और संवत" },
    source: "Traditional pañcāṅga",
    description: { en: "Month from the Sun's sidereal sign, six ṛtus and Vikram Samvat.", hi: "सूर्य की निरयन राशि से मास, छह ऋतुएँ और विक्रम संवत।" },
  },
  {
    id: "aspect.drishti",
    version: "1.0.0",
    category: "aspect",
    title: { en: "Whole-sign dṛṣṭi", hi: "राशि दृष्टि" },
    source: "BPHS ch. 26",
    description: { en: "7th aspect for all; Mars 4/8, Jupiter 5/9, Saturn 3/10, nodes 5/7/9.", hi: "सबका सप्तम; मंगल 4/8, गुरु 5/9, शनि 3/10, राहु-केतु 5/7/9।" },
  },
  {
    id: "dasha.vimshottari",
    version: "1.0.0",
    category: "dasha",
    title: { en: "Viṃśottarī mahādaśā", hi: "विंशोत्तरी महादशा" },
    source: "BPHS ch. 46",
    description: { en: "120-year cycle from the Moon's nakṣatra, with the balance at birth.", hi: "चंद्र नक्षत्र से 120 वर्षीय चक्र, जन्म समय के शेष सहित।" },
  },
  {
    id: "dasha.antardasha",
    version: "1.0.0",
    category: "dasha",
    title: { en: "Antardaśā (bhukti)", hi: "अंतर्दशा (भुक्ति)" },
    source: "BPHS ch. 46",
    description: { en: "Nine proportional sub-periods inside the running mahādaśā.", hi: "चालू महादशा के भीतर नौ आनुपातिक उप-काल।" },
  },
  {
    id: "dasha.pratyantardasha",
    version: "1.0.0",
    category: "dasha",
    title: { en: "Pratyantardaśā", hi: "प्रत्यंतर्दशा" },
    source: "BPHS ch. 46",
    description: { en: "Third-level periods for month-level timing.", hi: "माह-स्तरीय समय के लिए तृतीय स्तर की दशाएँ।" },
  },
  {
    id: "strength.shadbala-lite",
    version: "1.0.0",
    category: "strength",
    title: { en: "Six-fold strength score", hi: "षड्बल-लघु अंक" },
    source: "BPHS ch. 27, adapted for whole-sign charts",
    description: { en: "Auditable 0–100 score combining dignity, house, direction, motion, combustion and avasthā.", hi: "स्थान, भाव, दिशा, गति, अस्त और अवस्था मिलाकर 0–100 पारदर्शी अंक।" },
  },
  {
    id: "strength.bhava",
    version: "1.0.0",
    category: "strength",
    title: { en: "House strength", hi: "भाव बल" },
    source: "BPHS bhāva bala, simplified",
    description: { en: "Occupant and lord strength combined into a house-level score.", hi: "भाव में बैठे ग्रह और भावेश के बल से भाव-स्तरीय अंक।" },
  },
  {
    id: "transit.gochara",
    version: "1.0.0",
    category: "transit",
    title: { en: "Gochara from the Moon", hi: "चंद्र से गोचर" },
    source: "Phaladeepika ch. 26; standard gochara table",
    description: { en: "Today's transits counted from the natal Moon, with classical favourable houses.", hi: "जन्म चंद्रमा से आज का गोचर, शास्त्रीय शुभ भावों सहित।" },
  },
  {
    id: "transit.sade-sati",
    version: "1.0.0",
    category: "transit",
    title: { en: "Sade Sati", hi: "साढ़े साती" },
    source: "Classical Saturn transit doctrine",
    description: { en: "Saturn through the 12th, 1st and 2nd from the natal Moon, with phase.", hi: "जन्म चंद्रमा से 12वें, पहले और दूसरे भाव में शनि, चरण सहित।" },
  },
  {
    id: "transit.returns",
    version: "1.0.0",
    category: "transit",
    title: { en: "Jupiter and Saturn returns", hi: "गुरु और शनि की वापसी" },
    source: "Standard transit doctrine",
    description: { en: "Flags the 12-year Jupiter and 29.5-year Saturn returns.", hi: "12 वर्षीय गुरु और 29.5 वर्षीय शनि वापसी।" },
  },
  {
    id: "numerology.mulank",
    version: "1.0.0",
    category: "numerology",
    title: { en: "Mūlāṅka (psychic number)", hi: "मूलांक" },
    source: "Traditional Indian numerology",
    description: { en: "Birth day reduced to 1–9, with its ruling planet.", hi: "जन्म तिथि को 1–9 तक घटाकर, स्वामी ग्रह सहित।" },
  },
  {
    id: "numerology.bhagyank",
    version: "1.0.0",
    category: "numerology",
    title: { en: "Bhāgyāṅka (destiny number)", hi: "भाग्यांक" },
    source: "Traditional Indian numerology",
    description: { en: "Full birth date reduced to 1–9, with its ruling planet.", hi: "पूरी जन्म तिथि को 1–9 तक घटाकर, स्वामी ग्रह सहित।" },
  },
  {
    id: "numerology.namank",
    version: "1.0.0",
    category: "numerology",
    title: { en: "Nāmāṅka (Chaldean name number)", hi: "नामांक (कैल्डियन)" },
    source: "Chaldean letter-value table",
    description: { en: "Name letters converted with Chaldean values and reduced.", hi: "नाम के अक्षरों को कैल्डियन मान से जोड़कर घटाना।" },
  },
  {
    id: "numerology.loshu",
    version: "1.0.0",
    category: "numerology",
    title: { en: "Lo Shu grid", hi: "लो शू ग्रिड" },
    source: "Chinese–Indian numerological synthesis",
    description: { en: "Digit frequency in the birth date and the missing-number profile.", hi: "जन्म तिथि में अंकों की आवृत्ति और अनुपस्थित अंक।" },
  },
];

export const YOGA_CATALOGUE: { key: string; title: Bi; type: "benefic" | "challenging"; source: string }[] = [
  { key: "gajakesari", title: { en: "Gajakesari Yoga", hi: "गजकेसरी योग" }, type: "benefic", source: "BPHS ch. 36" },
  { key: "budhaditya", title: { en: "Budhaditya Yoga", hi: "बुधादित्य योग" }, type: "benefic", source: "Saravali" },
  { key: "chandra-mangala", title: { en: "Chandra-Mangala Yoga", hi: "चंद्र-मंगल योग" }, type: "benefic", source: "Saravali" },
  { key: "ruchaka", title: { en: "Ruchaka Yoga", hi: "रुचक योग" }, type: "benefic", source: "BPHS ch. 36 (Pancha Mahapurusha)" },
  { key: "bhadra", title: { en: "Bhadra Yoga", hi: "भद्र योग" }, type: "benefic", source: "BPHS ch. 36 (Pancha Mahapurusha)" },
  { key: "hamsa", title: { en: "Hamsa Yoga", hi: "हंस योग" }, type: "benefic", source: "BPHS ch. 36 (Pancha Mahapurusha)" },
  { key: "malavya", title: { en: "Malavya Yoga", hi: "मालव्य योग" }, type: "benefic", source: "BPHS ch. 36 (Pancha Mahapurusha)" },
  { key: "sasa", title: { en: "Sasa Yoga", hi: "शश योग" }, type: "benefic", source: "BPHS ch. 36 (Pancha Mahapurusha)" },
  { key: "saraswati", title: { en: "Saraswati Yoga", hi: "सरस्वती योग" }, type: "benefic", source: "Phaladeepika ch. 6" },
  { key: "lakshmi", title: { en: "Lakshmi Yoga", hi: "लक्ष्मी योग" }, type: "benefic", source: "Saravali" },
  { key: "raja", title: { en: "Raja Yoga", hi: "राज योग" }, type: "benefic", source: "BPHS ch. 39" },
  { key: "dhana", title: { en: "Dhana Yoga", hi: "धन योग" }, type: "benefic", source: "BPHS ch. 39" },
  { key: "amala", title: { en: "Amala Yoga", hi: "अमल योग" }, type: "benefic", source: "Phaladeepika ch. 6" },
  { key: "adhi", title: { en: "Adhi Yoga", hi: "अधि योग" }, type: "benefic", source: "BPHS ch. 36" },
  { key: "shubha-kartari", title: { en: "Shubha Kartari Yoga", hi: "शुभ कर्तरी योग" }, type: "benefic", source: "Classical kartari doctrine" },
  { key: "vipreet-raja", title: { en: "Vipreet Raja Yoga", hi: "विपरीत राज योग" }, type: "benefic", source: "Uttara Kalamrita" },
  { key: "neecha-bhanga", title: { en: "Neecha Bhanga Raja Yoga", hi: "नीच भंग राज योग" }, type: "benefic", source: "BPHS ch. 39" },
  { key: "mangal-dosha", title: { en: "Mangal Dosha", hi: "मंगल दोष" }, type: "challenging", source: "Classical marriage matching" },
  { key: "kaal-sarp", title: { en: "Kaal Sarp Dosha", hi: "काल सर्प दोष" }, type: "challenging", source: "Nodal doctrine" },
  { key: "kemadruma", title: { en: "Kemadruma Yoga", hi: "केमद्रुम योग" }, type: "challenging", source: "BPHS ch. 36" },
  { key: "guru-chandal", title: { en: "Guru Chandal Yoga", hi: "गुरु चांडाल योग" }, type: "challenging", source: "Nodal doctrine" },
  { key: "grahan", title: { en: "Grahan Dosha", hi: "ग्रहण दोष" }, type: "challenging", source: "Nodal doctrine" },
  { key: "shakat", title: { en: "Shakat Yoga", hi: "शकट योग" }, type: "challenging", source: "BPHS ch. 36" },
  { key: "papa-kartari", title: { en: "Papa Kartari Yoga", hi: "पाप कर्तरी योग" }, type: "challenging", source: "Classical kartari doctrine" },
  { key: "pitra", title: { en: "Pitra Dosha", hi: "पितृ दोष" }, type: "challenging", source: "Traditional dharma literature" },
];

export const CALCULATIONS: CalculationMeta[] = [
  ...BASE,
  ...VARGAS.map<CalculationMeta>((v) => ({
    id: `varga.${v.key.toLowerCase()}`,
    version: "1.0.0",
    category: "varga",
    title: v.name,
    source: "BPHS ch. 6 (Ṣoḍaśavarga)",
    description: v.purpose,
  })),
  ...YOGA_CATALOGUE.map<CalculationMeta>((y) => ({
    id: `yoga.${y.key}`,
    version: "1.0.0",
    category: "yoga",
    title: y.title,
    source: y.source,
    description:
      y.type === "benefic"
        ? { en: "Auspicious planetary combination, evaluated from the whole-sign chart.", hi: "शुभ ग्रह-संयोग, राशि-आधारित कुंडली से।" }
        : { en: "A challenging combination, presented with a practical remedy rather than fear.", hi: "कठिन ग्रह-संयोग, भय के बजाय व्यावहारिक उपाय के साथ।" },
  })),
];

/** Registry entries grouped for an on-page "what we calculate" panel. */
export function calculationsByCategory(): { category: CalcCategory; items: CalculationMeta[] }[] {
  const order: CalcCategory[] = [
    "ephemeris",
    "position",
    "house",
    "aspect",
    "panchang",
    "varga",
    "dasha",
    "yoga",
    "strength",
    "transit",
    "numerology",
  ];
  return order
    .map((category) => ({ category, items: CALCULATIONS.filter((c) => c.category === category) }))
    .filter((group) => group.items.length > 0);
}

/** Compact stamp stored inside every chart. */
export const calculationStamp = () =>
  CALCULATIONS.map((c) => ({ id: c.id, version: c.version, category: c.category }));
