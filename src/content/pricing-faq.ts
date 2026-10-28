import type { Bi } from "@/lib/i18n";

/**
 * FAQ content for the /pricing page.
 *
 * Kept next to the other pricing UI so the visible FAQ block, the FAQPage
 * structured data and any future edit all read from one list. Answers state the
 * current reality plainly: the core reading is free, paid plans run through
 * Cashfree (with a manual UPI fallback), the membership is a 30-day pass, and
 * nothing is a guarantee.
 */

export interface PricingFaqItem {
  q: Bi;
  a: Bi;
}

export const PRICING_FAQS: PricingFaqItem[] = [
  {
    q: {
      en: "Is the reading on Hast Rekha AI really free?",
      hi: "क्या हस्तरेखा AI की रीडिंग सच में फ्री है?",
    },
    a: {
      en: "The core reading is free: Rashi, Nakshatra, Lagna, the palm-line analysis, all 12 life-area predictions and charts — no login, no card, no trial timer. The free report is complete for those sections and is read on screen. The ₹51 Pro report is an optional upgrade that adds the five-year roadmap, the partner report, upay and a printable PDF; printing is a Pro feature. See the free reading first, then decide.",
      hi: "मूल रीडिंग फ्री है: राशि, नक्षत्र, लग्न, हाथ की रेखाओं का विश्लेषण, सभी 12 जीवन-क्षेत्रों की भविष्यवाणियाँ और ग्राफ़ — बिना लॉगिन, बिना कार्ड। इन हिस्सों के लिए फ्री रिपोर्ट पूरी है और स्क्रीन पर पढ़ी जाती है। ₹51 की प्रो रिपोर्ट वैकल्पिक अपग्रेड है, जिसमें पाँच साल का रोडमैप, जीवनसाथी रिपोर्ट, उपाय और प्रिंट करने योग्य PDF जुड़ती है; प्रिंटिंग प्रो सुविधा है। पहले फ्री रीडिंग देखें, फिर तय करें।",
    },
  },
  {
    q: {
      en: "What does the ₹51 premium report include?",
      hi: "₹51 की प्रीमियम रिपोर्ट में क्या मिलता है?",
    },
    a: {
      en: "The ₹51 Pro report adds the next five years year by year, the full future-life-partner prediction if you are unmarried (name syllable, nature, looks, money, business or job, direction and how you meet), the mistakes to avoid each year, the right business or field of work, year-wise upay and stotra, ratna vidhi, and a PDF download of the full report.",
      hi: "₹51 की प्रो रिपोर्ट में अगले पाँच वर्षों की साल-दर-साल भविष्यवाणी, अविवाहित हों तो होने वाले जीवनसाथी की पूरी भविष्यवाणी (नाम-अक्षर, स्वभाव, रूप, धन, बिज़नेस या जॉब, दिशा और मुलाक़ात कैसे होगी), हर वर्ष किन गलतियों से बचना है, सही व्यवसाय या कार्य-क्षेत्र, वर्ष-वार उपाय व स्तोत्र, रत्न विधि और पूरी रिपोर्ट का PDF डाउनलोड मिलता है।",
    },
  },
  {
    q: {
      en: "Can I buy the paid report right now?",
      hi: "क्या पेड रिपोर्ट अभी ख़रीदी जा सकती है?",
    },
    a: {
      en: "Yes — secure checkout is live through Cashfree. Open any report and tap the Pro button: you can pay by UPI, card or net banking. Pro is ₹51, Pro + Diwali PDF is ₹99, Pro + Dhandayak book is ₹199, and the 30-day membership is ₹1,000. A manual UPI QR stays available as a fallback. The report unlocks as soon as the payment is confirmed.",
      hi: "हाँ — Cashfree से सुरक्षित चेकआउट चालू है। कोई भी रिपोर्ट खोलकर प्रो बटन दबाएँ: UPI, कार्ड या नेट बैंकिंग से भुगतान कर सकते हैं। प्रो ₹51, प्रो + दिवाली PDF ₹99, प्रो + धनदायक पुस्तक ₹199, और 30-दिन मेंबरशिप ₹1,000 है। मैन्युअल UPI QR आपातकालीन विकल्प के रूप में उपलब्ध रहता है। भुगतान की पुष्टि होते ही रिपोर्ट अनलॉक हो जाती है।",
    },
  },
  {
    q: {
      en: "What is different in the ₹351 Ultra Pro plan?",
      hi: "₹351 वाले अल्ट्रा प्रो प्लान में अलग क्या है?",
    },
    a: {
      en: "Ultra Pro (₹351) includes everything in the Pro report plus access to the Dhandayak (also called Gupt Khazana) book. It is the original book plan, kept for existing buyers; new visitors usually see the ₹199 Pro + book bundle, which delivers the same report and book. The book link appears only on a paid, unlocked report page. All report plans are one-time, per report — no subscription.",
      hi: "अल्ट्रा प्रो (₹351) में पूरी प्रो रिपोर्ट के साथ धनदायक (गुप्त खज़ाना) पुस्तक की एक्सेस मिलती है। यह मूल पुस्तक प्लान है, मौजूदा खरीदारों के लिए रखा गया; नए विज़िटर को आमतौर पर ₹199 का प्रो + पुस्तक बंडल दिखता है, जिसमें वही रिपोर्ट और पुस्तक मिलती है। पुस्तक का लिंक सिर्फ़ भुगतान वाली अनलॉक रिपोर्ट पर दिखता है। सभी रिपोर्ट प्लान एक बार के हैं, प्रति रिपोर्ट — कोई सब्सक्रिप्शन नहीं।",
    },
  },
  {
    q: {
      en: "How does the report unlock after payment?",
      hi: "भुगतान के बाद रिपोर्ट unlock कैसे होती है?",
    },
    a: {
      en: "Cashfree confirms the payment and the report unlocks on the same page — usually within seconds. If the gateway window closes before confirmation, the return page re-checks the order and shows the result; you can also reopen the report from your account. No separate app or email is needed, and the report keeps its own private page so you can return to it with the link.",
      hi: "Cashfree भुगतान की पुष्टि करता है और रिपोर्ट उसी पेज पर अनलॉक हो जाती है — आमतौर पर कुछ सेकंड में। अगर पुष्टि से पहले गेटवे विंडो बंद हो जाए, तो रिटर्न पेज ऑर्डर दोबारा जाँचकर परिणाम दिखाता है; आप अकाउंट से भी रिपोर्ट दोबारा खोल सकते हैं। कोई अलग ऐप या ईमेल ज़रूरी नहीं, और रिपोर्ट का अपना निजी पेज रहता है जिसे आप लिंक से फिर खोल सकते हैं।",
    },
  },
  {
    q: {
      en: "Where does the 20% seva contribution go?",
      hi: "20% की सेवा राशि कहाँ जाती है?",
    },
    a: {
      en: "20% of what you pay for a paid plan — Pro (₹51), Pro + book (₹199), Pro + Diwali PDF (₹99) or the ₹1,000 membership — is set aside for animal welfare and greenery: feed for cows, monkeys and stray animals, and tree planting. It comes out of the plan price, so you pay nothing extra, and the free reading is unaffected. This is a voluntary commitment by the site owner, not a separate charity collection.",
      hi: "पेड प्लान — प्रो (₹51), प्रो + पुस्तक (₹199), प्रो + दिवाली PDF (₹99) या ₹1,000 की मेंबरशिप — में दी गई राशि का 20% बेज़ुबान जानवरों की सेवा और हरियाली के लिए अलग रखा जाता है: गाय, बंदर और आवारा जानवरों का भोजन, और पेड़-पौधे लगाना। यह प्लान की कीमत में से जाता है, आपको अलग से कुछ नहीं देना है, और फ्री रीडिंग पर इसका कोई असर नहीं। यह साइट मालिक की स्वैच्छिक प्रतिबद्धता है, अलग से कोई चैरिटी वसूली नहीं।",
    },
  },
  {
    q: {
      en: "Are the report's predictions guarantees?",
      hi: "क्या रिपोर्ट की भविष्यवाणियाँ गारंटी हैं?",
    },
    a: {
      en: "No. This is rule-based guidance from traditional astrology and palmistry, meant for reflection and entertainment. No astrological calculation can guarantee the future, and the report is not medical, legal or financial advice. Treat the predictions as a well-organised second opinion; for big decisions, consult a qualified professional.",
      hi: "नहीं। यह पारंपरिक ज्योतिष और हस्तरेखा पर आधारित, नियम-आधारित मार्गदर्शन है — मनोरंजन और आत्म-चिंतन के लिए। कोई भी ज्योतिषीय गणना भविष्य की 100% गारंटी नहीं दे सकती, और यह रिपोर्ट चिकित्सा, कानूनी या वित्तीय सलाह नहीं है। भविष्यवाणियों को एक सुव्यवस्थित दूसरी राय मानें; बड़े फ़ैसलों के लिए योग्य पेशेवर से सलाह लें।",
    },
  },
];

/** Interface copy for the pricing FAQ block and its internal links. */
export const PRICING_FAQ_UI = {
  breadcrumbHome: { en: "Home", hi: "होम" } as Bi,
  breadcrumbPricing: { en: "Pricing", hi: "मूल्य" } as Bi,
  faqTitle: { en: "Pricing questions, answered straight", hi: "मूल्य से जुड़े सवाल — सीधे जवाब" } as Bi,
  faqSub: {
    en: "What is free, what the paid plans add, and how payment works — without the fine-print games.",
    hi: "क्या फ्री है, पेड प्लान क्या जोड़ते हैं और भुगतान कैसे करें — बिना छोटे अक्षरों वाले खेल के।",
  } as Bi,
  guidesTitle: { en: "Check us before you pay", hi: "पैसे देने से पहले ख़ुद जाँचें" } as Bi,
  guidesSub: {
    en: "Every guide on this site is free. Learn the lines first, then judge the reading with your own eyes.",
    hi: "इस साइट की हर गाइड फ्री है। पहले रेखाएँ समझें, फिर रीडिंग को अपनी आँखों से जाँचें।",
  } as Bi,
};

export interface PricingGuideLink {
  href: string;
  label: Bi;
}

export const PRICING_GUIDE_LINKS: PricingGuideLink[] = [
  {
    href: "/hast-rekha-palmistry",
    label: { en: "Hast Rekha Palmistry — the complete guide", hi: "हस्तरेखा पामिस्ट्री — पूरी गाइड" },
  },
  {
    href: "/learn-palmistry",
    label: { en: "Learn palmistry — 7-step beginner course", hi: "हस्तरेखा पढ़ना सीखें — 7 कदम का कोर्स" },
  },
  {
    href: "/books",
    label: { en: "Palmistry books — the honest reading list", hi: "हस्तरेखा किताबें — ईमानदार सूची" },
  },
];
