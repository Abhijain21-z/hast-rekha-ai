import { readFileSync, writeFileSync } from "fs";

const p = "src/content/legal.json";
const legal = JSON.parse(readFileSync(p, "utf8"));
const sections = legal.privacy.sections || legal.privacy.body;

// 1) Replace the misleading "no third-party cookies" cookie paragraph.
const cookieSec = sections.find((s) => /cookie/i.test((s.h?.en || s.h || "")));
cookieSec.p = [
  {
    en: "We use a first-party session cookie to keep you logged in and a language cookie to remember your Hindi/English choice — both are essential.",
    hi: "हम आपको लॉगिन रखने हेतु प्रथम-पक्ष सत्र कुकी और आपकी हिंदी/अंग्रेज़ी पसंद याद रखने हेतु भाषा कुकी उपयोग करते हैं — दोनों आवश्यक हैं।",
  },
  {
    en: "We also serve advertising through Google AdSense. Google and its third-party vendors use cookies (including the DoubleClick cookie) to serve ads based on your prior visits to this and other websites. You may opt out of personalised advertising by visiting Google Ads Settings (https://adssettings.google.com) or www.aboutads.info. Third-party vendors and ad networks may also use cookies on this site.",
    hi: "हम Google AdSense के माध्यम से विज्ञापन भी दिखाते हैं। Google और उसके तृतीय-पक्ष वेंडर कुकीज़ (DoubleClick कुकी सहित) का उपयोग करके आपकी इस व अन्य वेबसाइटों की पिछली विज़िट के आधार पर विज्ञापन दिखाते हैं। आप वैयक्तिकृत विज्ञापन से बाहर निकलने (opt-out) हेतु Google Ads Settings (https://adssettings.google.com) या www.aboutads.info पर जा सकते हैं। इस साइट पर तृतीय-पक्ष वेंडर व विज्ञापन नेटवर्क भी कुकीज़ उपयोग कर सकते हैं।",
  },
];

// 2) Add a dedicated Advertising section if not already present.
if (!sections.some((s) => /advertis|विज्ञापन/i.test((s.h?.en || s.h || "")))) {
  sections.push({
    h: { en: "Advertising", hi: "विज्ञापन" },
    p: [
      {
        en: "This site is monetised in part through Google AdSense. Third-party advertising cookies enable Google and its partners to show ads relevant to you. No personally identifiable information is passed to advertisers. We do not knowingly collect data from children under 13, and ads are not targeted to minors.",
        hi: "यह साइट आंशिक रूप से Google AdSense के माध्यम से मॉनिटाइज़ की जाती है। तृतीय-पक्ष विज्ञापन कुकीज़ Google व उसके साझेदारों को आपके लिए प्रासंगिक विज्ञापन दिखाने में सक्षम बनाती हैं। किसी भी विज्ञापनदाता को व्यक्तिगत पहचान योग्य जानकारी नहीं दी जाती। हम 13 वर्ष से कम आयु के बच्चों का डेटा जानबूझकर एकत्र नहीं करते, और विज्ञापन नाबालिगों को लक्षित नहीं किए जाते।",
      },
    ],
  });
}

writeFileSync(p, JSON.stringify(legal, null, 1));
console.log("Privacy policy updated: cookie disclosure + advertising section. Sections now:", sections.map((s) => s.h?.en).join(", "));
