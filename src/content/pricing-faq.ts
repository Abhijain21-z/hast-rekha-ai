import type { Bi } from "@/lib/i18n";

/**
 * FAQ content for the /pricing page.
 *
 * Kept next to the other pricing UI so the visible FAQ block, the FAQPage
 * structured data and any future edit all read from one list. Answers state the
 * current reality plainly: the reading is free, premium payment runs on UPI
 * (QR + one-tap confirm; UTR only for the Ultra book), and nothing is a
 * guarantee.
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
      en: "Yes. Rashi, Nakshatra, Lagna, the palm-line analysis, 12 life-area predictions, charts and printing are all free — no login, no card, no trial timer. Nothing is cut from the free report. The ₹51 premium simply adds a five-year roadmap on top; see your complete free report first, then decide.",
      hi: "हाँ। राशि, नक्षत्र, लग्न, हाथ की रेखाओं का विश्लेषण, 12 जीवन-क्षेत्रों की भविष्यवाणियाँ, ग्राफ़ और प्रिंट — सब फ्री है, बिना लॉगिन और बिना कार्ड। फ्री रिपोर्ट में कोई कटौती नहीं की जाती। ₹51 का प्रीमियम उसके ऊपर पाँच साल का रोडमैप जोड़ता है; पहले पूरी फ्री रिपोर्ट देखें, फिर तय करें।",
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
      en: "Yes — UPI payment is open now. Open any report page and tap the premium button: you will see a UPI QR code and the official UPI ID. Pay ₹51 (Pro) or ₹351 (Ultra Pro) from any UPI app, confirm on the same page, and the report unlocks right there. More payment options are being added, but UPI works today.",
      hi: "हाँ — UPI भुगतान अब खुल चुका है। किसी भी रिपोर्ट पेज पर प्रीमियम बटन दबाएँ: UPI QR कोड और आधिकारिक UPI ID दिखेंगी। किसी भी UPI ऐप से ₹51 (प्रो) या ₹351 (अल्ट्रा प्रो) भेजें, उसी पेज पर पुष्टि करें — रिपोर्ट वहीं तुरंत अनलॉक हो जाती है। और भुगतान विकल्प जुड़ रहे हैं, पर UPI आज से चालू है।",
    },
  },
  {
    q: {
      en: "What is different in the ₹351 Ultra Pro plan?",
      hi: "₹351 वाले अल्ट्रा प्रो प्लान में अलग क्या है?",
    },
    a: {
      en: "Ultra Pro (₹351) includes everything in the ₹51 Pro report plus access to the Dhandayak (also called Gupt Khazana) book. The book download link appears only on an Ultra-unlocked report page, so it is never shared outside a paid unlock. Both plans are one-time, per report — no subscription.",
      hi: "अल्ट्रा प्रो (₹351) में ₹51 वाली पूरी प्रो रिपोर्ट के साथ धनदायक (गुप्त खज़ाना) पुस्तक की एक्सेस मिलती है। पुस्तक का डाउनलोड लिंक सिर्फ़ अल्ट्रा-अनलॉक रिपोर्ट पेज पर दिखता है, इसलिए वह कभी बिना भुगतान के नहीं बाँटा जाता। दोनों प्लान एक बार के हैं, प्रति रिपोर्ट — कोई सब्सक्रिप्शन नहीं।",
    },
  },
  {
    q: {
      en: "How does the report unlock after payment?",
      hi: "भुगतान के बाद रिपोर्ट unlock कैसे होती है?",
    },
    a: {
      en: "For the ₹51 Pro report, tap “I have paid” on the report page right after the UPI transfer — it unlocks on the spot. Ultra Pro (₹351) additionally asks for your UPI reference number (UTR) so the book link can be issued safely. No separate app, email or WhatsApp needed; the report keeps its own private page, so you can open it again any time on any device with the link.",
      hi: "₹51 वाली प्रो रिपोर्ट के लिए UPI ट्रांसफ़र के तुरंत बाद रिपोर्ट पेज पर “मैंने भेज दिए” दबाएँ — वहीं अनलॉक हो जाती है। अल्ट्रा प्रो (₹351) में इसके साथ आपका UPI रेफ़रेंस नंबर (UTR) भी माँगा जाता है, ताकि पुस्तक का लिंक सुरक्षित तरीके से जारी हो सके। कोई अलग ऐप, ईमेल या WhatsApp ज़रूरी नहीं; रिपोर्ट का अपना निजी पेज रहता है, जिसे आप लिंक के साथ किसी भी डिवाइस पर बाद में फिर खोल सकते हैं।",
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
