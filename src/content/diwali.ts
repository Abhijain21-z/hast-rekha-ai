import type { Bi } from "@/lib/i18n";

/**
 * Diwali 2026 hub content. The date and muhurat are sourced from the published
 * Drik Panchang values for New Delhi; other cities shift with local sunset, so
 * the page tells readers to confirm with their local panchang.
 */
export const DIWALI_2026 = {
  dateISO: "2026-11-08",
  date: {
    hi: "रविवार, 8 नवंबर 2026",
    en: "Sunday, 8 November 2026",
  } satisfies Bi,
  tithi: {
    hi: "कार्तिक अमावस्या — 8 नवंबर सुबह 11:27 से 9 नवंबर दोपहर 12:31 तक",
    en: "Kartik Amavasya — 11:27 AM on 8 Nov to 12:31 PM on 9 Nov",
  } satisfies Bi,
  muhurat: {
    hi: "दिल्ली में लक्ष्मी पूजा शाम 5:54 – 7:50 बजे",
    en: "Lakshmi Puja in Delhi: 5:54 – 7:50 PM IST",
  } satisfies Bi,
  pradosh: {
    hi: "प्रदोष काल शाम 5:31 – 8:09 बजे • वृषभ लग्न शाम 5:54 – 7:50 बजे",
    en: "Pradosh Kaal 5:31 – 8:09 PM • Vrishabha Lagna 5:54 – 7:50 PM",
  } satisfies Bi,
  dhanteras: {
    hi: "धनतेरस: शुक्रवार, 6 नवंबर 2026",
    en: "Dhanteras: Friday, 6 November 2026",
  } satisfies Bi,
  updatedISO: "2026-10-24",
};

export interface DiwaliRashiLine {
  key: string;
  line: Bi;
}

/** One Diwali-specific line per Moon sign, keyed to src/content/rashis.json. */
export const DIWALI_RASHIFAL: DiwaliRashiLine[] = [
  {
    key: "mesha",
    line: {
      hi: "दिवाली के बाद काम के नए अवसर खुलेंगे। बड़े खर्च से पहले बजट बनाएं और जल्दबाजी में निवेश न करें।",
      en: "New work opportunities open after Diwali. Set a budget before big spends and avoid impulsive investments.",
    },
  },
  {
    key: "vrishabha",
    line: {
      hi: "धन, संपत्ति और पारिवारिक सुख में वृद्धि का संकेत। घर या जमीन से जुड़े निर्णय परिवार से चर्चा करके लें।",
      en: "Money, property and family comfort improve. Discuss home or land decisions with the family.",
    },
  },
  {
    key: "mithuna",
    line: {
      hi: "संपर्क और संवाद से नए अवसर मिलेंगे। व्यापार में दो प्रस्तावों की तुलना करें, जल्दी में हामी न भरें।",
      en: "Networking and communication bring opportunities. Compare two business proposals before saying yes.",
    },
  },
  {
    key: "karka",
    line: {
      hi: "घर, मां और पारिवारिक शांति पर ध्यान रहेगा। घर की सजावट या मरम्मत पर खर्च संतुलित रखें।",
      en: "Focus on home, mother and family peace. Keep spending on home decor or repairs balanced.",
    },
  },
  {
    key: "simha",
    line: {
      hi: "करियर में पहचान और नेतृत्व का अवसर। आत्मविश्वास अच्छा है, पर दूसरों की बात अनसुनी न करें।",
      en: "Recognition and leadership opportunities at work. Confidence is high, but do not ignore others.",
    },
  },
  {
    key: "kanya",
    line: {
      hi: "स्वास्थ्य और काम में सुधार। पुराने बिल, उधार या अधूरे काम निपटाने का अच्छा समय है।",
      en: "Health and work improve. A good time to clear old bills, debts or pending tasks.",
    },
  },
  {
    key: "tula",
    line: {
      hi: "रिश्तों में मधुरता और साझेदारी में लाभ। नए ग्राहक या सहयोगी मिल सकते हैं; संतुलन बनाए रखें।",
      en: "Harmony in relationships and gains through partnership. New clients or collaborators may appear; keep balance.",
    },
  },
  {
    key: "vrishchika",
    line: {
      hi: "मन की इच्छा पूरी होने का योग। छिपा हुआ धन या पारिवारिक संपत्ति से जुड़ी खुशखबरी संभव।",
      en: "A heartfelt wish may be fulfilled. Hidden money or family property could bring good news.",
    },
  },
  {
    key: "dhanu",
    line: {
      hi: "यात्रा, पढ़ाई या दूर के लोगों से लाभ। नए अनुभव के लिए दिवाली के बाद योजना बनाएं।",
      en: "Gains from travel, study or people far away. Plan a new experience after Diwali.",
    },
  },
  {
    key: "makara",
    line: {
      hi: "करियर में स्थिरता और मेहनत का फल। प्रमोशन, नया कॉन्ट्रैक्ट या जिम्मेदारी बढ़ने का संकेत।",
      en: "Stability at work and rewards for effort. Promotion, a new contract or added responsibility is indicated.",
    },
  },
  {
    key: "kumbha",
    line: {
      hi: "नए विचार, तकनीक और सामाजिक संपर्क से लाभ। दोस्तों या ऑनलाइन नेटवर्क से मदद मिलेगी।",
      en: "Gains from new ideas, technology and social networks. Friends or online networks will help.",
    },
  },
  {
    key: "meena",
    line: {
      hi: "आध्यात्मिक और रचनात्मक ऊर्जा प्रबल। स्वास्थ्य, नींद और मानसिक शांति का ध्यान रखें।",
      en: "Spiritual and creative energy is strong. Take care of health, sleep and mental peace.",
    },
  },
];

export const DIWALI_FAQS: { q: Bi; a: Bi }[] = [
  {
    q: {
      hi: "दिवाली 2026 कब है?",
      en: "When is Diwali in 2026?",
    },
    a: {
      hi: "दिवाली 2026 रविवार, 8 नवंबर को है। कार्तिक अमावस्या 8 नवंबर 2026 को सुबह 11:27 से 9 नवंबर दोपहर 12:31 तक रहेगी।",
      en: "Diwali 2026 is on Sunday, 8 November. Kartik Amavasya runs from 11:27 AM on 8 November to 12:31 PM on 9 November.",
    },
  },
  {
    q: {
      hi: "लक्ष्मी पूजा का शुभ मुहूर्त क्या है?",
      en: "What is the Lakshmi Puja muhurat?",
    },
    a: {
      hi: "दिल्ली में लक्ष्मी पूजा का शुभ मुहूर्त शाम 5:54 से 7:50 बजे तक है। हर शहर में सूर्यास्त के अनुसार समय बदलता है, इसलिए अपने स्थानीय पंचांग से पुष्टि करें।",
      en: "In Delhi, the Lakshmi Puja muhurat is 5:54–7:50 PM. Timings shift with local sunset, so confirm with your local panchang.",
    },
  },
  {
    q: {
      hi: "दिवाली 2026 में कौन सी राशि के लिए क्या संकेत हैं?",
      en: "What does Diwali 2026 indicate for each rashi?",
    },
    a: {
      hi: "हर राशि के लिए दिवाली का संकेत अलग है — मेष में नई शुरुआत, वृषभ में धन-संपत्ति, मिथुन में संवाद से लाभ और मीन में आध्यात्मिक ऊर्जा प्रबल दिखती है। ऊपर अपनी राशि की पंक्ति पढ़ें; विस्तृत फल के लिए व्यक्तिगत कुंडली जरूरी है।",
      en: "Each sign has a different indication — new starts for Aries, money and property for Taurus, gains through communication for Gemini, and strong spiritual energy for Pisces. Read your sign above; a personal chart is needed for specifics.",
    },
  },
  {
    q: {
      hi: "क्या हस्तरेखा से दिवाली का फल पता चल सकता है?",
      en: "Can palmistry predict Diwali results?",
    },
    a: {
      hi: "हस्तरेखा स्वभाव, प्रवृत्ति और जीवन के ढर्रे के संकेत देती है — तय घटनाएं नहीं। दिवाली के फल को राशि, कुंडली और वर्तमान समय के साथ मिलाकर देखना बेहतर है।",
      en: "Palmistry shows temperament, tendencies and life patterns, not fixed events. Read the Diwali indication together with your rashi, kundli and current timing.",
    },
  },
  {
    q: {
      hi: "दिवाली पर कौन से पारंपरिक उपाय करें?",
      en: "Which traditional Diwali remedies can I do?",
    },
    a: {
      hi: "घर की सफाई, लक्ष्मी-गणेश पूजा, दीपदान, जरूरतमंदों को दान और जुए-सट्टे से बचाव — ये पारंपरिक अभ्यास हैं। इन्हें सकारात्मक आदत के रूप में करें, किसी चमत्कार की गारंटी न समझें।",
      en: "Clean the home, worship Lakshmi-Ganesha, light diyas, donate to those in need and avoid gambling — these are traditional practices. Treat them as positive habits, not guaranteed miracles.",
    },
  },
  {
    q: {
      hi: "क्या राशिफल और हस्तरेखा रीडिंग फ्री है?",
      en: "Is the rashifal and palm reading free?",
    },
    a: {
      hi: "राशिफल और बेसिक हस्तरेखा रीडिंग फ्री है। विस्तृत प्रो रिपोर्ट ₹51 की है, जिसमें 5 साल का रोडमैप, जीवनसाथी संकेत और उपाय शामिल हैं।",
      en: "The rashifal and basic palm reading are free. The detailed Pro report is ₹51 and includes a five-year roadmap, life-partner indications and remedies.",
    },
  },
];
