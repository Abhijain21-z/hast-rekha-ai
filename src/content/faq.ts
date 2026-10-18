import type { Bi } from "@/lib/i18n";

/**
 * Home-page FAQ.
 *
 * Kept as plain data (no JSX) so the same list feeds both the on-page cards and
 * the FAQPage structured data — one source, no drift. Every question carries its
 * own answer inline; nothing is hidden behind a tap.
 */
export interface FaqItem {
  q: Bi;
  a: Bi;
}

export const FAQS: FaqItem[] = [
  {
    q: { en: "What does this website do?", hi: "यह वेबसाइट क्या करती है?" },
    a: {
      en: "You enter your name, birth date, time and place. We instantly make a full reading of your hand lines and your kundli — Rashi, Nakshatra, Lagna, life predictions and lucky years — in Hindi and English.",
      hi: "आप अपना नाम, जन्म तारीख, समय और जगह डालते हैं। हम तुरंत आपके हाथ की रेखाओं और कुंडली की पूरी रीडिंग बनाते हैं — राशि, नक्षत्र, लग्न, जीवन की भविष्यवाणियाँ और शुभ वर्ष — हिंदी और अंग्रेज़ी में।",
    },
  },
  {
    q: { en: "Is it free?", hi: "क्या यह निःशुल्क है?" },
    a: {
      en: "Yes — absolutely free. The whole reading on screen, Rashi, Nakshatra, Lagna, palm analysis, charts, print and language switching cost nothing, with no card and no login. Only the optional 5-year premium report (and a PDF of it) costs ₹51, one time.",
      hi: "हाँ — बिल्कुल फ्री। स्क्रीन पर दिखने वाली पूरी रीडिंग, राशि, नक्षत्र, लग्न, हस्तरेखा विश्लेषण, ग्राफ़, प्रिंट और भाषा बदलना — सब कुछ मुफ़्त, न कार्ड न लॉगिन। सिर्फ़ वैकल्पिक 5-वर्षीय प्रीमियम रिपोर्ट (और उसकी PDF) का एक बार ₹51 लगता है।",
    },
  },
  {
    q: { en: "Do I need to register or log in?", hi: "क्या रजिस्टर या लॉगिन करना ज़रूरी है?" },
    a: {
      en: "No. You get the complete reading instantly without any account. An account is only useful if you want to save your reports and open them again later.",
      hi: "नहीं। बिना किसी अकाउंट के आपको तुरंत पूरी रीडिंग मिल जाती है। अकाउंट सिर्फ़ इसलिए है कि आप अपनी रिपोर्ट सहेजकर बाद में दोबारा खोल सकें।",
    },
  },
  {
    q: { en: "How long does a reading take?", hi: "रीडिंग बनने में कितना समय लगता है?" },
    a: {
      en: "A few seconds — usually under a minute. The astronomy and the palm rules are calculated right in your browser, so there is no waiting for a server queue.",
      hi: "कुछ ही सेकंड — आमतौर पर 1 मिनट से भी कम। ज्योतिष गणना और हस्तरेखा नियम आपके ही ब्राउज़र में होते हैं, इसलिए किसी लाइन में इंतज़ार नहीं करना पड़ता।",
    },
  },
  {
    q: { en: "Do I have to upload a photo of my hand?", hi: "क्या हाथ की फ़ोटो डालना ज़रूरी है?" },
    a: {
      en: "No, it is optional. Birth details alone give you the complete reading. If you add a palm photo, the hand-line part (lines, mounts, marks) becomes more detailed.",
      hi: "नहीं, यह वैकल्पिक है। सिर्फ़ जन्म विवरण से भी पूरी रीडिंग मिल जाती है। अगर आप हथेली की फ़ोटो जोड़ते हैं तो हस्तरेखा वाला हिस्सा (रेखाएँ, पर्वत, चिह्न) और विस्तृत हो जाता है।",
    },
  },
  {
    q: { en: "What if I don't know my exact birth time?", hi: "अगर मुझे सही जन्म समय नहीं पता तो?" },
    a: {
      en: "No problem. Tick 'time unknown' and we use 12:00 noon. Your Rashi, Nakshatra and most predictions still work fine — only the Lagna and a few dasha timings get softer.",
      hi: "कोई बात नहीं। 'समय ज्ञात नहीं' चुनें, हम दोपहर 12:00 बजे का उपयोग करते हैं। आपकी राशि, नक्षत्र और ज़्यादातर भविष्यवाणियाँ फिर भी सही रहती हैं — बस लग्न और कुछ दशा-समय थोड़े ढीले रहते हैं।",
    },
  },
  {
    q: { en: "Can I use it on a mobile phone?", hi: "क्या मैं मोबाइल पर इस्तेमाल कर सकता हूँ?" },
    a: {
      en: "Yes, the whole site is built for phones first. Tap 'Install app' in the top bar and it opens like a normal app from your home screen — no Play Store needed.",
      hi: "हाँ, पूरी वेबसाइट पहले मोबाइल के लिए बनी है। ऊपर 'ऐप इंस्टॉल करें' दबाएँ और यह आपके होम स्क्रीन से असली ऐप की तरह खुलने लगेगी — Play Store की ज़रूरत नहीं।",
    },
  },
  {
    q: { en: "Can I make kundlis for my family too?", hi: "क्या मैं परिवार के लोगों की कुंडली भी बना सकता हूँ?" },
    a: {
      en: "Yes. You can create as many readings as you like — parents, spouse, children, friends — and save each one as a separate profile with its own name and birth details.",
      hi: "हाँ। जितनी चाहें रीडिंग बना सकते हैं — माता-पिता, जीवनसाथी, बच्चे, दोस्त — और हर एक को अलग प्रोफ़ाइल के रूप में सहेज सकते हैं।",
    },
  },
  {
    q: { en: "Is my palm photo or birth data safe?", hi: "क्या मेरी हथेली की फ़ोटो या जन्म विवरण सुरक्षित है?" },
    a: {
      en: "Your photo is first shrunk on your own phone, then used only to build your reading — never sold or shown to anyone else. Your birth details are used only for your kundli, and you can save a report without the photo at all.",
      hi: "आपकी फ़ोटो पहले आपके ही फ़ोन में छोटी की जाती है, फिर सिर्फ़ आपकी रीडिंग बनाने के लिए उपयोग होती है — किसी को बेची या दिखाई नहीं जाती। जन्म विवरण सिर्फ़ आपकी कुंडली के लिए लगता है, और आप फ़ोटो के बिना भी रिपोर्ट सेव कर सकते हैं।",
    },
  },
  {
    q: { en: "Which languages are supported?", hi: "किस भाषा में रिपोर्ट मिलती है?" },
    a: {
      en: "Hindi and English everywhere — switch any time from the top bar. Marathi, Telugu and Gujarati are being added right now.",
      hi: "हर जगह हिंदी और अंग्रेज़ी — ऊपर से कभी भी भाषा बदल सकते हैं। मराठी, तेलुगु और गुजराती अभी जोड़ी जा रही हैं।",
    },
  },
  {
    q: { en: "What is in the ₹51 premium report?", hi: "₹51 प्रीमियम रिपोर्ट में क्या मिलता है?" },
    a: {
      en: "A year-by-year 5-year roadmap: what is likely to happen, the mistakes to avoid, a simple remedy and a mantra for each year, the right field of work, gemstone method — plus the full PDF. If you are unmarried, it also predicts your future life partner: name syllable, nature, looks, money, business or job, direction and how the meeting happens.",
      hi: "साल-दर-साल 5-वर्षीय रोडमैप: क्या होने की संभावना है, किन गलतियों से बचें, हर साल के लिए सरल उपाय और मंत्र, सही कार्य-क्षेत्र, रत्न विधि — और पूरी PDF। अगर आप अविवाहित हैं तो इसमें होने वाले जीवनसाथी की भविष्यवाणी भी मिलती है: नाम-अक्षर, स्वभाव, रूप, धन, बिज़नेस या जॉब, दिशा और मुलाक़ात कैसे होगी।",
    },
  },
  {
    q: { en: "Is the ₹51 report compulsory?", hi: "क्या ₹51 रिपोर्ट लेना ज़रूरी है?" },
    a: {
      en: "Not at all. Everything you see on screen — the full reading, all 12 life areas, palm analysis, charts and printing — stays free forever. ₹51 is only for readers who want the 5-year roadmap and the PDF.",
      hi: "बिल्कुल नहीं। स्क्रीन पर दिखने वाली हर चीज़ — पूरी रीडिंग, सभी 12 जीवन-क्षेत्र, हस्तरेखा विश्लेषण, ग्राफ़ और प्रिंटिंग — हमेशा मुफ़्त रहती है। ₹51 सिर्फ़ उनके लिए है जिन्हें 5 साल का रोडमैप और PDF चाहिए।",
    },
  },
  {
    q: { en: "How do I pay for the premium report?", hi: "प्रीमियम रिपोर्ट का भुगतान कैसे करें?" },
    a: {
      en: "The report page shows a UPI QR code and UPI id. Pay ₹51 (or ₹351 for Ultra Pro) from any UPI app — GPay, PhonePe, Paytm, BHIM — and confirm on the same page: the report unlocks immediately. (Ultra Pro asks for the payment reference number for the book.)",
      hi: "रिपोर्ट पेज पर UPI QR कोड और UPI आईडी दिखती है। किसी भी UPI ऐप — GPay, PhonePe, Paytm, BHIM — से ₹51 (या अल्ट्रा प्रो के ₹351) भेजें और उसी पेज पर पुष्टि करें: रिपोर्ट तुरंत अनलॉक हो जाती है। (अल्ट्रा प्रो में पुस्तक के लिए भुगतान का रेफ़रेंस नंबर माँगा जाता है।)",
    },
  },
  {
    q: { en: "What is the ₹351 Ultra Pro plan?", hi: "₹351 का अल्ट्रा प्रो प्लान क्या है?" },
    a: {
      en: "Ultra Pro includes everything in Pro — the 5-year roadmap, partner prediction and PDF — plus full access to the 'धनदायक तांत्रिक प्रयोग — गुप्त खजाना' book. The book link unlocks only on an Ultra Pro report; nobody else can see it.",
      hi: "अल्ट्रा प्रो में प्रो की हर चीज़ — 5-वर्षीय रोडमैप, जीवनसाथी भविष्यवाणी और PDF — के साथ 'धनदायक तांत्रिक प्रयोग — गुप्त खजाना' पुस्तक की पूरी एक्सेस मिलती है। पुस्तक का लिंक सिर्फ़ अल्ट्रा प्रो रिपोर्ट पर खुलता है, किसी और को नहीं दिखता।",
    },
  },
  {
    q: { en: "How do I download the PDF?", hi: "PDF कैसे डाउनलोड करूँ?" },
    a: {
      en: "On your reading page tap 'Download Complete PDF' (or the small download lines between sections) and choose 'Save as PDF' in the print window. After unlocking, the premium report has its own 'Print Full Report' button too.",
      hi: "अपनी रीडिंग पेज पर 'पूरी PDF डाउनलोड करें' दबाएँ (या सेक्शन के बीच दिखने वाली छोटी डाउनलोड पट्टी) और प्रिंट विंडो में 'Save as PDF' चुनें। अनलॉक करने के बाद प्रीमियम रिपोर्ट का अपना 'पूरी रिपोर्ट प्रिंट करें' बटन भी होता है।",
    },
  },
  {
    q: { en: "Can I save or share my report?", hi: "क्या रिपोर्ट सेव या शेयर कर सकते हैं?" },
    a: {
      en: "Yes. Use the share button to send the report link on WhatsApp (it copies the link too), save it as a PDF for yourself, or keep the reading in your account and open it any time.",
      hi: "हाँ। शेयर बटन से रिपोर्ट का लिंक WhatsApp पर भेजें (लिंक कॉपी भी हो जाता है), PDF के रूप में अपने पास रखें, या अकाउंट में सेव करके कभी भी दोबारा खोलें।",
    },
  },
  {
    q: { en: "Is this real astrology or just an AI guess?", hi: "क्या यह असली ज्योतिष है या सिर्फ़ AI का अंदाज़ा?" },
    a: {
      en: "The predictions are built on classical palmistry and Vedic rules plus real astronomical calculations (Lahiri ayanamsa) — not a random AI guess. AI was used only as a helping hand to build and design the website.",
      hi: "भविष्यवाणियाँ शास्त्रीय हस्तरेखा और वैदिक नियमों तथा वास्तविक खगोलीय गणना (लाहिड़ी अयनांश) पर बनी हैं — किसी रैंडम AI अंदाज़े पर नहीं। AI का उपयोग केवल वेबसाइट बनाने और डिज़ाइन में मदद के लिए हुआ है।",
    },
  },
  {
    q: { en: "Is the prediction 100% accurate?", hi: "क्या भविष्यवाणी 100% सही होती है?" },
    a: {
      en: "Palmistry and astrology show possibilities and timings, not guarantees. Our method follows the classical rules faithfully, but please take it as guidance for your decisions — it is not a substitute for a doctor, lawyer or financial adviser.",
      hi: "हस्तरेखा और ज्योतिष संभावनाएँ और समय बताते हैं, गारंटी नहीं। हमारी विधि शास्त्रीय नियमों का ईमानदारी से पालन करती है, पर इसे अपने निर्णयों के लिए मार्गदर्शन मानें — यह डॉक्टर, वकील या वित्तीय सलाहकार का विकल्प नहीं है।",
    },
  },
  {
    q: { en: "Do I still need to visit an astrologer?", hi: "क्या मुझे इसके लिए ज्योतिषी के पास जाना पड़ेगा?" },
    a: {
      en: "Most everyday questions — nature, career direction, marriage timing, money years, remedies — are answered here for free. For deep personal consultation (muhurat, detailed kundli matching, muhurta for a wedding) an experienced astrologer is still the better choice.",
      hi: "रोज़ के ज़्यादातर सवाल — स्वभाव, करियर की दिशा, विवाह का समय, धन के वर्ष, उपाय — यहीं मुफ़्त में हल हो जाते हैं। गहरी व्यक्तिगत परामर्श (मुहूर्त, विस्तृत कुंडली मिलान, शादी का मुहूर्त) के लिए अनुभवी ज्योतिषी से मिलना अच्छा ही रहता है।",
    },
  },
  {
    q: { en: "Can I get a refund?", hi: "पैसे वापस मिल सकते हैं?" },
    a: {
      en: "The amount is very small and the report is delivered instantly, so we do not run a refund process — but if something went wrong with your payment or unlock, write to us from the Contact page and we will fix it.",
      hi: "रकम बहुत छोटी है और रिपोर्ट तुरंत मिल जाती है, इसलिए रिफ़ंड की प्रक्रिया नहीं है — पर अगर भुगतान या अनलॉक में कोई दिक्कत हुई हो तो संपर्क पेज से हमें लिखें, हम ठीक कर देंगे।",
    },
  },
  {
    q: { en: "Who made this website?", hi: "यह वेबसाइट किसने बनाई है?" },
    a: {
      en: "Hast Rekha AI is made by our Founder Sachin Jain and our CEO Abhishek Jain, with AI tools used as a helping hand for building and design.",
      hi: "हस्तरेखा AI को हमारे संस्थापक (Founder) सचिन जैन और हमारे सीईओ (CEO) अभिषेक जैन ने बनाया है, जिसमें बनाने और डिज़ाइन में AI टूल्स की मदद ली गई है।",
    },
  },
];
