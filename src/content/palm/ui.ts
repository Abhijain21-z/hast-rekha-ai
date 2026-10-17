import type { Bi } from "@/lib/i18n";

/**
 * Interface copy for the palm-guide pages.
 *
 * Kept next to the article content instead of the global dictionary: the guide
 * pages are one self-contained unit, and `L()` from LanguageProvider reads any
 * `Bi` value, so nothing else in the app has to know about these strings.
 */
export const PALM_UI = {
  breadcrumbHome: { en: "Home", hi: "होम" } as Bi,
  breadcrumbGuides: { en: "Palmistry guides", hi: "हस्तरेखा गाइड" } as Bi,
  faqTitle: { en: "Frequently asked questions", hi: "अक्सर पूछे जाने वाले सवाल" } as Bi,
  faqSub: {
    en: "Short, direct answers — the same questions readers ask us every day.",
    hi: "छोटे और सीधे जवाब — यही सवाल पाठक रोज़ पूछते हैं।",
  } as Bi,
  relatedTitle: { en: "Read next", hi: "आगे पढ़ें" } as Bi,
  relatedSub: { en: "Hand-picked guides on the same topic.", hi: "इसी विषय की चुनी हुई गाइड।" } as Bi,
  pillarLink: { en: "Hast Rekha Palmistry — complete guide", hi: "हस्तरेखा पामिस्ट्री — पूरी गाइड" } as Bi,
  ctaTitle: { en: "Want your own hand read?", hi: "अपनी हथेली पढ़वानी है?" } as Bi,
  ctaSub: {
    en: "Upload a photo of your palm and get a free AI reading — Rashi, Nakshatra and every major line, in Hindi and English.",
    hi: "अपनी हथेली की फ़ोटो अपलोड करें और AI से मुफ़्त रीडिंग पाएँ — राशि, नक्षत्र और हाथ की हर प्रमुख रेखा, हिंदी और English में।",
  } as Bi,
  cta: {
    en: "Upload palm photo — free reading",
    hi: "हथेली की फ़ोटो अपलोड करें — फ्री रीडिंग",
  } as Bi,
  ctaNoPhoto: {
    en: "No photo? Enter birth details instead",
    hi: "फ़ोटो नहीं है? जन्म विवरण डालकर शुरू करें",
  } as Bi,
  disclaimer: {
    en: "Hast rekha is a traditional belief and entertainment guide — please do not use it as medical, legal or financial advice.",
    hi: "हस्तरेखा एक पारंपरिक विश्वास और मनोरंजन आधारित मार्गदर्शन है — इसे चिकित्सा, कानूनी या वित्तीय सलाह की जगह न लें।",
  } as Bi,
  updated: { en: "Updated", hi: "अद्यतन" } as Bi,
  readingTime: { en: "min read", hi: "मिनट पढ़ें" } as Bi,
  tldr: { en: "In short", hi: "छोटे में" } as Bi,
  diagramTitle: { en: "Palm diagram", hi: "हथेली का चित्र" } as Bi,
  legendAll: {
    en: "The nine lines this guide covers — tap a guide below to go deeper.",
    hi: "इस गाइड में शामिल नौ रेखाएँ — किसी भी रेखा पर नीचे टैप करके विस्तार से पढ़ें।",
  } as Bi,
  index: {
    en: "Hast Rekha AI publishes free, rule-based palmistry guides — every page shows the classical meaning first, then what it means for your everyday life.",
    hi: "हस्तरेखा AI मुफ़्त और नियम-आधारित हस्तरेखा गाइड प्रकाशित करता है — हर पेज पहले शास्त्रीय अर्थ बताता है, फिर आपकी रोज़मर्रा की ज़िंदगी के लिए उसका मतलब।",
  } as Bi,
};

/** Footer links for the four most-read line guides (keyword-rich, natural). */
export const PALM_FOOTER_LINKS: { slug: string; label: Bi }[] = [
  { slug: "hast-rekha-palmistry", label: { en: "Hast Rekha Palmistry", hi: "हस्तरेखा पामिस्ट्री" } },
  { slug: "life-line", label: { en: "Life Line (Jeevan Rekha)", hi: "जीवन रेखा (Life Line)" } },
  { slug: "heart-line", label: { en: "Heart Line (Hriday Rekha)", hi: "हृदय रेखा (Heart Line)" } },
  { slug: "fate-line", label: { en: "Fate Line (Bhagya Rekha)", hi: "भाग्य रेखा (Fate Line)" } },
  { slug: "marriage-line", label: { en: "Marriage Line (Vivah Rekha)", hi: "विवाह रेखा (Marriage Line)" } },
  { slug: "money-line", label: { en: "Money Line (Dhan Rekha)", hi: "धन रेखा (Money Line)" } },
  { slug: "learn-palmistry", label: { en: "Learn Palmistry", hi: "हस्तरेखा पढ़ना सीखें" } },
];
