/**
 * Yoga and doṣa detection.
 *
 * Each rule is deliberately classical and explainable: the `description` states
 * exactly which planets and houses formed it, so the report never asks the
 * reader to trust a black box. Only combinations that are actually present are
 * returned.
 */
import { BENEFICS, MALEFICS, SAPTA_GRAHA } from "./types";
import type { Graha, HouseInfo, PlanetPosition, YogaResult } from "./types";
import { PLANET_NAMES, SIGNS, signAt } from "./data";
import { hasAspect } from "./aspects";

export interface YogaContext {
  planets: PlanetPosition[];
  houses: HouseInfo[];
  lagnaSign: number;
}

const STRONG_DIGNITIES = ["exalted", "moolatrikona", "own"];

function make(
  key: string,
  name: { en: string; hi: string },
  type: "benefic" | "challenging",
  strength: number,
  houses: number[],
  description: { en: string; hi: string },
): YogaResult {
  return { key, name, type, strength: Math.round(Math.min(95, Math.max(20, strength))), houses, description };
}

export function buildYogas(ctx: YogaContext): YogaResult[] {
  const { planets, houses, lagnaSign } = ctx;
  const p = (key: Graha) => planets.find((x) => x.key === key)!;
  const lordOf = (house: number): Graha => signAt(houses[house - 1].sign).lord;
  const houseFromMoon = (key: Graha) => ((p(key).sign - p("moon").sign + 12) % 12) + 1;
  const houseFrom = (key: Graha, referenceSign: number) => ((p(key).sign - referenceSign + 12) % 12) + 1;
  const inKendra = (h: number) => [1, 4, 7, 10].includes(h);
  const inTrikona = (h: number) => [1, 5, 9].includes(h);
  const isBenefic = (key: Graha) => BENEFICS.includes(key);
  const isMalefic = (key: Graha) => MALEFICS.includes(key);
  const name = (key: Graha) => PLANET_NAMES[key];

  const out: YogaResult[] = [];
  const push = (y: YogaResult | null) => {
    if (y) out.push(y);
  };

  /* ---------- benefic combinations ---------- */

  // Gajakesari: Jupiter in a kendra from the Moon.
  if (inKendra(houseFromMoon("jupiter"))) {
    const strong = STRONG_DIGNITIES.includes(p("jupiter").dignity);
    push(
      make(
        "gajakesari",
        { en: "Gajakesari Yoga", hi: "गजकेसरी योग" },
        "benefic",
        strong ? 92 : 78,
        [p("jupiter").house, p("moon").house],
        {
          en: `Jupiter sits in the ${ordinal(houseFromMoon("jupiter"))} house from the Moon, giving lasting reputation, wise judgement and help from respected people.`,
          hi: `गुरु चंद्रमा से ${ordinalHi(houseFromMoon("jupiter"))} भाव में हैं — यश, विवेक और सम्मानित लोगों का सहयोग मिलता है।`,
        },
      ),
    );
  }

  // Budhaditya: Sun + Mercury in one sign.
  if (p("sun").sign === p("mercury").sign) {
    push(
      make(
        "budhaditya",
        { en: "Budhaditya Yoga", hi: "बुधादित्य योग" },
        "benefic",
        p("mercury").combust ? 58 : 82,
        [p("sun").house],
        {
          en: `Sun and Mercury share ${SIGNS[p("sun").sign].name.en}, sharpening analysis, speech and administrative skill.${p("mercury").combust ? " Mercury is combust, so the gift shows after practice rather than instantly." : ""}`,
          hi: `सूर्य और बुध ${SIGNS[p("sun").sign].name.hi} में साथ हैं — विश्लेषण, वाणी और प्रशासनिक कौशल तीव्र होता है।${p("mercury").combust ? " बुध अस्त है, इसलिए यह गुण अभ्यास से निखरता है।" : ""}`,
        },
      ),
    );
  }

  // Chandra-Mangala: Moon + Mars conjunct or in mutual 7th aspect.
  if (
    p("moon").sign === p("mars").sign ||
    (hasAspect("moon", p("moon").house, p("mars").house) && hasAspect("mars", p("mars").house, p("moon").house))
  ) {
    push(
      make(
        "chandra-mangala",
        { en: "Chandra-Mangala Yoga", hi: "चंद्र-मंगल योग" },
        "benefic",
        76,
        [p("moon").house, p("mars").house],
        {
          en: "Moon and Mars combine, giving earning drive, courage in money matters and a quick, enterprising mind.",
          hi: "चंद्र और मंगल का संयोग — धन कमाने की लगन, आर्थिक साहस और तेज़ व्यावसायिक बुद्धि देता है।",
        },
      ),
    );
  }

  // Pancha Mahapurusha: a strong planet in a kendra from the lagna.
  const mahapurusha: { key: Graha; yoga: string; en: string; hi: string }[] = [
    { key: "mars", yoga: "ruchaka", en: "Ruchaka Yoga", hi: "रुचक योग" },
    { key: "mercury", yoga: "bhadra", en: "Bhadra Yoga", hi: "भद्र योग" },
    { key: "jupiter", yoga: "hamsa", en: "Hamsa Yoga", hi: "हंस योग" },
    { key: "venus", yoga: "malavya", en: "Malavya Yoga", hi: "मालव्य योग" },
    { key: "saturn", yoga: "sasa", en: "Sasa Yoga", hi: "शश योग" },
  ];
  for (const m of mahapurusha) {
    const planet = p(m.key);
    if (inKendra(planet.house) && STRONG_DIGNITIES.includes(planet.dignity)) {
      push(
        make(
          m.yoga,
          { en: m.en, hi: m.hi },
          "benefic",
          90,
          [planet.house],
          {
            en: `${name(m.key).en} is ${planet.dignity} in the ${ordinal(planet.house)} house — a Pancha Mahapurusha yoga of natural authority and durable success in its own field.`,
            hi: `${name(m.key).hi} ${ordinalHi(planet.house)} भाव में ${planet.dignity === "exalted" ? "उच्च" : planet.dignity === "own" ? "स्वग्रही" : "मूलत्रिकोण"} है — पंच महापुरुष योग, स्वाभाविक अधिकार और अपने क्षेत्र में स्थायी सफलता।`,
          },
        ),
      );
    }
  }

  // Saraswati: Jupiter, Venus and Mercury in kendra / trikona / 2nd.
  const saraswatiHouses = [1, 2, 4, 5, 7, 9, 10];
  if (["jupiter", "venus", "mercury"].every((k) => saraswatiHouses.includes(p(k as Graha).house))) {
    const jupStrong = STRONG_DIGNITIES.includes(p("jupiter").dignity) || p("jupiter").dignity === "friend";
    if (jupStrong) {
      push(
        make(
          "saraswati",
          { en: "Saraswati Yoga", hi: "सरस्वती योग" },
          "benefic",
          84,
          [p("jupiter").house, p("venus").house, p("mercury").house],
          {
            en: "Jupiter, Venus and Mercury occupy supportive houses together — learning, art, writing and teaching become a real source of income.",
            hi: "गुरु, शुक्र और बुध सहायक भावों में हैं — विद्या, कला, लेखन और शिक्षण आय का वास्तविक स्रोत बनते हैं।",
          },
        ),
      );
    }
  }

  // Lakshmi: 9th lord strong and in a kendra / trikona.
  const ninthLord = lordOf(9);
  if (
    p(ninthLord).house &&
    (inKendra(p(ninthLord).house) || inTrikona(p(ninthLord).house)) &&
    STRONG_DIGNITIES.includes(p(ninthLord).dignity)
  ) {
    push(
      make(
        "lakshmi",
        { en: "Lakshmi Yoga", hi: "लक्ष्मी योग" },
        "benefic",
        86,
        [p(ninthLord).house, 9],
        {
          en: `The 9th lord ${name(ninthLord).en} is strong in the ${ordinal(p(ninthLord).house)} house — fortune, patronage and steady prosperity follow effort.`,
          hi: `भाग्येश ${name(ninthLord).hi} ${ordinalHi(p(ninthLord).house)} भाव में बलवान है — परिश्रम के साथ भाग्य, आश्रय और स्थिर समृद्धि मिलती है।`,
        },
      ),
    );
  }

  // Raja yoga: a kendra lord conjunct a trikona lord.
  const kendraLords = [1, 4, 7, 10].map(lordOf);
  const trikonaLords = [1, 5, 9].map(lordOf);
  let raja: { a: Graha; b: Graha } | null = null;
  for (const a of kendraLords) {
    for (const b of trikonaLords) {
      if (a === b) continue;
      if (p(a).sign === p(b).sign) raja = { a, b };
    }
  }
  if (raja) {
    push(
      make(
        "raja",
        { en: "Raja Yoga", hi: "राज योग" },
        "benefic",
        88,
        [p(raja.a).house, p(raja.b).house],
        {
          en: `Kendra lord ${name(raja.a).en} joins trikona lord ${name(raja.b).en} in ${SIGNS[p(raja.a).sign].name.en} — authority, promotion and recognition arrive when the daśā supports it.`,
          hi: `केंद्रेश ${name(raja.a).hi} और त्रिकोणेश ${name(raja.b).hi} ${SIGNS[p(raja.a).sign].name.hi} में मिलते हैं — दशा के सहयोग से पद, प्रतिष्ठा और मान-सम्मान मिलता है।`,
        },
      ),
    );
  }

  // Dhana yoga: lords of 2, 5, 9, 11 conjunct.
  const dhanaLords = [2, 5, 9, 11].map((h) => ({ h, lord: lordOf(h) }));
  let dhana: { a: (typeof dhanaLords)[number]; b: (typeof dhanaLords)[number] } | null = null;
  for (let i = 0; i < dhanaLords.length; i++) {
    for (let j = i + 1; j < dhanaLords.length; j++) {
      if (dhanaLords[i].lord !== dhanaLords[j].lord && p(dhanaLords[i].lord).sign === p(dhanaLords[j].lord).sign) {
        dhana = { a: dhanaLords[i], b: dhanaLords[j] };
      }
    }
  }
  if (dhana) {
    push(
      make(
        "dhana",
        { en: "Dhana Yoga", hi: "धन योग" },
        "benefic",
        80,
        [dhana.a.h, dhana.b.h],
        {
          en: `Lords of the ${ordinal(dhana.a.h)} and ${ordinal(dhana.b.h)} houses meet in one sign — income grows through networks, family resources and timely opportunities.`,
          hi: `${ordinalHi(dhana.a.h)} और ${ordinalHi(dhana.b.h)} भावों के स्वामी एक राशि में मिलते हैं — नेटवर्क, कुटुंब और सही अवसर से आय बढ़ती है।`,
        },
      ),
    );
  }

  // Amala: only benefics in the 10th from lagna or Moon.
  const tenthFromLagna = planets.filter((x) => x.house === 10);
  const tenthFromMoonSign = planets.filter((x) => houseFromMoon(x.key) === 10);
  for (const set of [tenthFromLagna, tenthFromMoonSign]) {
    if (set.length > 0 && set.every((x) => isBenefic(x.key))) {
      push(
        make(
          "amala",
          { en: "Amala Yoga", hi: "अमल योग" },
          "benefic",
          74,
          [10],
          {
            en: "Only benefics occupy the 10th from the lagna or Moon — a clean public reputation and ethical career growth.",
            hi: "लग्न या चंद्रमा से दशम भाव में केवल शुभ ग्रह हैं — स्वच्छ छवि और नैतिक करियर वृद्धि।",
          },
        ),
      );
      break;
    }
  }

  // Adhi: three or more benefics in the 6th, 7th, 8th from the Moon.
  const adhi = planets.filter((x) => isBenefic(x.key) && [6, 7, 8].includes(houseFromMoon(x.key)));
  if (adhi.length >= 3) {
    push(
      make(
        "adhi",
        { en: "Adhi Yoga", hi: "अधि योग" },
        "benefic",
        78,
        adhi.map((x) => x.house),
        {
          en: "Three or more benefics fall in the 6th–8th from the Moon — leadership, comfort and protection in a crisis.",
          hi: "चंद्रमा से छठे-आठवें भाव में तीन या अधिक शुभ ग्रह — नेतृत्व, सुख और संकट में रक्षा।",
        },
      ),
    );
  }

  // Shubha Kartari: benefics on both sides of the lagna.
  const second = planets.filter((x) => x.house === 2);
  const twelfth = planets.filter((x) => x.house === 12);
  if (second.length && twelfth.length && second.every((x) => isBenefic(x.key)) && twelfth.every((x) => isBenefic(x.key))) {
    push(
      make(
        "shubha-kartari",
        { en: "Shubha Kartari Yoga", hi: "शुभ कर्तरी योग" },
        "benefic",
        72,
        [2, 12],
        {
          en: "Benefics flank the lagna in the 2nd and 12th — a protective scissors that softens difficulties.",
          hi: "दूसरे और बारहवें भाव में शुभ ग्रह लग्न की रक्षा करते हैं — कठिनाइयाँ कम होती हैं।",
        },
      ),
    );
  }

  // Vipreet Raja: a 6/8/12 lord placed in another 6/8/12 house.
  const dusthana = [6, 8, 12];
  const vipreet = dusthana
    .map((h) => lordOf(h))
    .filter((lord) => dusthana.includes(p(lord).house));
  if (vipreet.length > 0) {
    push(
      make(
        "vipreet-raja",
        { en: "Vipreet Raja Yoga", hi: "विपरीत राज योग" },
        "benefic",
        70,
        vipreet.map((l) => p(l).house),
        {
          en: `A lord of the 6th, 8th or 12th sits in another difficult house — early obstacles convert into unexpected advantage and resilience.`,
          hi: `छठे, आठवें या बारहवें भाव का स्वामी किसी अन्य कठिन भाव में है — शुरुआती बाधाएँ बाद में असामान्य लाभ और दृढ़ता में बदलती हैं।`,
        },
      ),
    );
  }

  // Neecha Bhanga: debilitated planet with cancellation.
  for (const planet of planets) {
    if (planet.dignity !== "debilitated") continue;
    const dispositor = signAt(planet.sign).lord;
    const exaltLord = SIGN_LORD_FOR_EXALTATION[planet.key];
    const cancelled =
      inKendra(houseFrom(dispositor, lagnaSign)) ||
      inKendra(houseFromMoon(dispositor)) ||
      (exaltLord && (inKendra(houseFrom(exaltLord, lagnaSign)) || inKendra(houseFromMoon(exaltLord))));
    if (cancelled) {
      push(
        make(
          "neecha-bhanga",
          { en: "Neecha Bhanga Raja Yoga", hi: "नीच भंग राज योग" },
          "benefic",
          68,
          [planet.house],
          {
            en: `${name(planet.key).en} is debilitated but its cancellation is active — an early weakness turns into a distinctive strength later in life.`,
            hi: `${name(planet.key).hi} नीच है, परंतु नीच भंग सक्रिय है — शुरुआती कमज़ोरी जीवन में विशिष्ट शक्ति बन जाती है।`,
          },
        ),
      );
      break;
    }
  }

  /* ---------- challenging combinations ---------- */

  // Mangal dosha (Kuja dosha) from the lagna or the Moon.
  const mangalHouses = [1, 2, 4, 7, 8, 12];
  const fromLagna = mangalHouses.includes(p("mars").house);
  const fromMoon = mangalHouses.includes(houseFromMoon("mars"));
  if (fromLagna || fromMoon) {
    push(
      make(
        "mangal-dosha",
        { en: "Mangal Dosha (Kuja Dosha)", hi: "मंगल दोष (कुज दोष)" },
        "challenging",
        fromLagna && fromMoon ? 70 : 55,
        [p("mars").house, p("moon").house],
        {
          en: `Mars occupies the ${ordinal(p("mars").house)} house from the lagna${fromMoon ? ` and the ${ordinal(houseFromMoon("mars"))} from the Moon` : ""}. Passion runs hot in relationships; patience and clear communication matter more than matching charts alone.`,
          hi: `मंगल लग्न से ${ordinalHi(p("mars").house)} भाव में${fromMoon ? ` और चंद्रमा से ${ordinalHi(houseFromMoon("mars"))} भाव में` : ""} है। रिश्तों में भावना प्रबल रहती है; धैर्य और खुला संवाद सबसे ज़रूरी है।`,
        },
      ),
    );
  }

  // Kaal Sarp: all seven physical planets on one side of the Rahu–Ketu axis.
  const rahu = p("rahu");
  const arc = (lon: number) => (((lon - rahu.longitude) % 360) + 360) % 360;
  const sides = SAPTA_GRAHA.map((k) => arc(p(k).longitude) < 180);
  if (sides.every((s) => s === sides[0])) {
    push(
      make(
        "kaal-sarp",
        { en: "Kaal Sarp Dosha", hi: "काल सर्प दोष" },
        "challenging",
        62,
        [rahu.house, p("ketu").house],
        {
          en: "Every physical planet lies on one side of the Rahu–Ketu axis. Progress can feel delayed until the nodal daśā, after which the same intensity becomes focused achievement.",
          hi: "सभी भौतिक ग्रह राहु-केतु अक्ष के एक ही ओर हैं। प्रगति में देरी महसूस हो सकती है, पर राहु-केतु दशा के बाद यही तीव्रता केंद्रित सफलता बनती है।",
        },
      ),
    );
  }

  // Kemadruma: an isolated Moon.
  const moonSign = p("moon").sign;
  const around = planets.filter(
    (x) => x.key !== "sun" && x.key !== "rahu" && x.key !== "ketu" && x.key !== "moon" && x.sign === moonSign,
  );
  const secondFromMoon = planets.filter((x) => x.key !== "moon" && houseFromMoon(x.key) === 2);
  const twelfthFromMoon = planets.filter((x) => x.key !== "moon" && houseFromMoon(x.key) === 12);
  const kendraFromMoon = planets.filter((x) => x.key !== "moon" && inKendra(houseFromMoon(x.key)));
  if (around.length === 0 && secondFromMoon.length === 0 && twelfthFromMoon.length === 0 && kendraFromMoon.length === 0) {
    push(
      make(
        "kemadruma",
        { en: "Kemadruma Yoga", hi: "केमद्रुम योग" },
        "challenging",
        52,
        [p("moon").house],
        {
          en: "The Moon stands alone with no planet in the 2nd, 12th or a kendra from it. Emotional self-reliance is high; building a steady support circle is the real remedy.",
          hi: "चंद्रमा अकेला है — दूसरे, बारहवें या केंद्र में कोई ग्रह नहीं। भावनात्मक आत्मनिर्भरता अधिक है; स्थिर सहयोग-वृत्त बनाना सच्चा उपाय है।",
        },
      ),
    );
  }

  // Guru Chandal: Jupiter with Rahu or Ketu.
  if (p("jupiter").sign === p("rahu").sign || p("jupiter").sign === p("ketu").sign) {
    push(
      make(
        "guru-chandal",
        { en: "Guru Chandal Yoga", hi: "गुरु चांडाल योग" },
        "challenging",
        58,
        [p("jupiter").house],
        {
          en: "Jupiter shares a sign with a node — unconventional beliefs and shortcut gurus can mislead. Verify teachers and avoid guaranteed-return schemes.",
          hi: "गुरु राहु या केतु के साथ है — अपरंपरागत विचार और शॉर्टकट गुरु भ्रमित कर सकते हैं। गुरु को परखें और गारंटीड रिटर्न के लालच से बचें।",
        },
      ),
    );
  }

  // Grahan dosha: a luminary with a node.
  if (
    p("sun").sign === p("rahu").sign ||
    p("sun").sign === p("ketu").sign ||
    p("moon").sign === p("rahu").sign ||
    p("moon").sign === p("ketu").sign
  ) {
    push(
      make(
        "grahan",
        { en: "Grahan Dosha", hi: "ग्रहण दोष" },
        "challenging",
        55,
        [p("sun").house, p("moon").house],
        {
          en: "A node eclipses the Sun or Moon — confidence or mood can swing around eclipses and nodal periods. Regular routine and grounding practices help.",
          hi: "राहु या केतु सूर्य/चंद्रमा के साथ है — ग्रहण काल और राहु-केतु दशा में आत्मविश्वास या मन बदल सकता है। नियमित दिनचर्या और ग्राउंडिंग सहायक है।",
        },
      ),
    );
  }

  // Shakat: Moon in the 6th, 8th or 12th from Jupiter.
  if ([6, 8, 12].includes(houseFromMoon("jupiter"))) {
    push(
      make(
        "shakat",
        { en: "Shakat Yoga", hi: "शकट योग" },
        "challenging",
        50,
        [p("moon").house, p("jupiter").house],
        {
          en: "The Moon and Jupiter are in a 6/8/12 relationship — moods and opportunities can move in opposite directions. A fixed monthly plan smooths the cycle.",
          hi: "चंद्रमा और गुरु 6/8/12 संबंध में हैं — मन और अवसर विपरीत दिशा में चल सकते हैं। निश्चित मासिक योजना इस चक्र को संतुलित करती है।",
        },
      ),
    );
  }

  // Papa Kartari: malefics on both sides of the lagna.
  const papaSecond = planets.filter((x) => x.house === 2);
  const papaTwelfth = planets.filter((x) => x.house === 12);
  if (papaSecond.length && papaTwelfth.length && papaSecond.every((x) => isMalefic(x.key)) && papaTwelfth.every((x) => isMalefic(x.key))) {
    push(
      make(
        "papa-kartari",
        { en: "Papa Kartari Yoga", hi: "पाप कर्तरी योग" },
        "challenging",
        54,
        [2, 12],
        {
          en: "Malefics squeeze the lagna from the 2nd and 12th — resources and energy feel tight at times. Small, consistent buffers and disciplined sleep protect you.",
          hi: "दूसरे और बारहवें भाव के पाप ग्रह लग्न को दबाते हैं — कभी-कभी संसाधन और ऊर्जा तंग लगती है। छोटे नियमित बचत और अनुशासित नींद रक्षा करते हैं।",
        },
      ),
    );
  }

  // Pitra dosha: affliction to the 9th house / 9th lord.
  const ninth = p(ninthLord);
  if (
    [p("sun").house, p("saturn").house, p("rahu").house].includes(9) ||
    (ninth && (ninth.sign === p("saturn").sign || ninth.sign === p("rahu").sign))
  ) {
    push(
      make(
        "pitra",
        { en: "Pitra Dosha", hi: "पितृ दोष" },
        "challenging",
        56,
        [9, p(ninthLord).house],
        {
          en: "The 9th house or its lord is touched by Saturn, Rahu or the Sun — ancestral obligations and father-related duties need conscious attention.",
          hi: "नवम भाव या उसका स्वामी शनि, राहु या सूर्य से प्रभावित है — पैतृक दायित्वों और पिता से जुड़े विषयों पर सचेत ध्यान दें।",
        },
      ),
    );
  }

  return out;
}

/** Lord of the sign in which each planet is exalted — used for neecha-bhanga. */
const SIGN_LORD_FOR_EXALTATION: Partial<Record<Graha, Graha>> = {
  sun: "mars", // Aries
  moon: "venus", // Taurus
  mars: "saturn", // Capricorn
  mercury: "mercury", // Virgo
  jupiter: "moon", // Cancer
  venus: "jupiter", // Pisces
  saturn: "venus", // Libra
};

const ORDINALS = ["", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th"];
const ORDINALS_HI = ["", "पहले", "दूसरे", "तीसरे", "चौथे", "पाँचवें", "छठे", "सातवें", "आठवें", "नौवें", "दसवें", "ग्यारहवें", "बारहवें"];

export const ordinal = (n: number) => ORDINALS[n] ?? `${n}th`;
export const ordinalHi = (n: number) => ORDINALS_HI[n] ?? `${n}वें`;
