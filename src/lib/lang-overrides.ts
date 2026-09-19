import type { Dict } from "./i18n";

/**
 * Extra language shells. Hindi and English are fully translated in i18n.ts;
 * these languages localise the visible UI chrome (navigation, hero, main
 * headings) and gracefully fall back to English for the rest of the copy,
 * while all astrological content stays available in Hindi ⇄ English.
 */
export type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] };

export interface LangMeta {
  code: string;
  native: string;
  english: string;
  dir?: "rtl";
  font?: string;
}

export const LANGS: LangMeta[] = [
  { code: "hi", native: "हिन्दी", english: "Hindi", font: "Noto Sans Devanagari" },
  { code: "en", native: "English", english: "English" },
  { code: "mr", native: "मराठी", english: "Marathi", font: "Noto Sans Devanagari" },
  { code: "sa", native: "संस्कृतम्", english: "Sanskrit", font: "Noto Sans Devanagari" },
  { code: "gu", native: "ગુજરાતી", english: "Gujarati", font: "Noto Sans Gujarati" },
  { code: "pa", native: "ਪੰਜਾਬੀ", english: "Punjabi", font: "Noto Sans Gurmukhi" },
  { code: "bn", native: "বাংলা", english: "Bengali", font: "Noto Sans Bengali" },
  { code: "or", native: "ଓଡ଼ିଆ", english: "Odia", font: "Noto Sans Oriya" },
  { code: "te", native: "తెలుగు", english: "Telugu", font: "Noto Sans Telugu" },
  { code: "kn", native: "ಕನ್ನಡ", english: "Kannada", font: "Noto Sans Kannada" },
  { code: "ml", native: "മലയാളം", english: "Malayalam", font: "Noto Sans Malayalam" },
  { code: "ta", native: "தமிழ்", english: "Tamil", font: "Noto Sans Tamil" },
  { code: "ur", native: "اردو", english: "Urdu", dir: "rtl", font: "Noto Nastaliq Urdu" },
];

export const OVERRIDES: Record<string, DeepPartial<Dict>> = {
  mr: {
    nav: { home: "मुख्यपृष्ठ", features: "वैशिष्ट्ये", how: "कसे कार्य करते", reviews: "अभिप्राय", rashi: "राशी", blog: "ब्लॉग", about: "आमच्याबद्दल", contact: "संपर्क", login: "लॉगिन", dashboard: "डॅशबोर्ड", getReading: "वाचन मिळवा", logout: "लॉगआउट" },
    hero: { title1: "स्वागत आहे आपले", title2: "हस्तरेखा AI च्या जगात", sub: "आपल्या हाताच्या रेषा आपल्या भविष्याबद्दल काय सांगतात ते जाणा — राशी, नक्षत्र, लग्न आणि हस्तरेखा विश्लेषण, त्वरित व मोफत.", cta: "माझे वाचन मिळवा", cta2: "१२ राशी पहा" },
    top: { choose: "भाषा निवडा" },
    pricing: { title: "सोपी, प्रामाणिक किंमत" },
    blog: { title: "हस्तरेखा ज्ञान ब्लॉग" },
  },
  sa: {
    nav: { home: "गृहम्", features: "विशेषताः", how: "कथं कार्यति", reviews: "समीक्षाः", rashi: "राशयः", blog: "लेखाः", about: "अस्माकं विषये", contact: "सम्पर्कः", login: "प्रवेशः", dashboard: "फलकम्", getReading: "पठनं प्राप्नुवन्तु", logout: "निर्गमः" },
    hero: { title1: "स्वागतम् भवताम्", title2: "हस्तरेखा AI लोकेश", sub: "भवतः हस्तरेखाः भविष्यं किं वदन्ति जानीयात् — राशिः, नक्षत्रम्, लग्नं हस्तरेखाविश्लेषणं च, तत्क्षणं निःशुल्कं च।", cta: "मम पठनं प्राप्नुवन्तु", cta2: "द्वादश राशयः" },
    top: { choose: "भाषां वृणोतु" },
    pricing: { title: "सरलं सत्यं मूल्यम्" },
    blog: { title: "हस्तरेखा ज्ञान लेखाः" },
  },
  gu: {
    nav: { home: "હોમ", features: "વિશેષતાઓ", how: "કેવી રીતે કામ કરે", reviews: "સમીક્ષાઓ", rashi: "રાશિ", blog: "બ્લોગ", about: "અમારા વિશે", contact: "સંપર્ક", login: "લૉગિન", dashboard: "ડૅશબોર્ડ", getReading: "રિડિંગ મેળવો", logout: "લૉગઆઉટ" },
    hero: { title1: "આપનું સ્વાગત છે", title2: "હસ્તરેખા AI ની દુનિયામાં", sub: "જાણો તમારી હથેળીની રેખાઓ ભવિષ્ય વિશે શું કહે છે — રાશિ, નક્ષત્ર, લગ્ન અને હસ્તરેખા વિશ્લેષણ, તરત અને મફત.", cta: "મારું રિડિંગ મેળવો", cta2: "૧૨ રાશિ જુઓ" },
    top: { choose: "ભાષા પસંદ કરો" },
    pricing: { title: "સરળ, પ્રામાણિક કિંમત" },
    blog: { title: "હસ્તરેખા જ્ઞાન બ્લોગ" },
  },
  pa: {
    nav: { home: "ਹੋਮ", features: "ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ", how: "ਕਿਵੇਂ ਕੰਮ ਕਰਦਾ", reviews: "ਸਮੀਖਿਆਵਾਂ", rashi: "ਰਾਸ਼ੀ", blog: "ਬਲੌਗ", about: "ਸਾਡੇ ਬਾਰੇ", contact: "ਸੰਪਰਕ", login: "ਲੌਗਇਨ", dashboard: "ਡੈਸ਼ਬੋਰਡ", getReading: "ਰੀਡਿੰਗ ਲਵੋ", logout: "ਲੌਗਆਉਟ" },
    hero: { title1: "ਜੀ ਆਇਆਂ ਨੂੰ", title2: "ਹਸਤ ਰੇਖਾ AI ਦੀ ਦੁਨੀਆ ਵਿੱਚ", sub: "ਜਾਣੋ ਤੁਹਾਡੀ ਹਥੇਲੀ ਦੀਆਂ ਰੇਖਾਵਾਂ ਭਵਿੱਖ ਬਾਰੇ ਕੀ ਕਹਿੰਦੀਆਂ ਹਨ — ਰਾਸ਼ੀ, ਨੱਖਸ਼ਤਰ, ਲਗਨ ਅਤੇ ਹਸਤ ਰੇਖਾ ਵਿਸ਼ਲੇਸ਼ਣ, ਤੁਰੰਤ ਅਤੇ ਮੁਫ਼ਤ।", cta: "ਮੇਰੀ ਰੀਡਿੰਗ ਲਵੋ", cta2: "12 ਰਾਸ਼ੀਆਂ ਵੇਖੋ" },
    top: { choose: "ਭਾਸ਼ਾ ਚੁਣੋ" },
    pricing: { title: "ਸੌਖੀ, ਇਮਾਨਦਾਰ ਕੀਮਤ" },
    blog: { title: "ਹਸਤ ਰੇਖਾ ਗਿਆਨ ਬਲੌਗ" },
  },
  bn: {
    nav: { home: "হোম", features: "বৈশিষ্ট্য", how: "যেভাবে কাজ করে", reviews: "মতামত", rashi: "রাশি", blog: "ব্লগ", about: "আমাদের সম্পর্কে", contact: "যোগাযোগ", login: "লগইন", dashboard: "ড্যাশবোর্ড", getReading: "রিডিং নিন", logout: "লগআউট" },
    hero: { title1: "স্বাগতম আপনাকে", title2: "হস্তরেখা AI-এর জগতে", sub: "জানুন আপনার হাতের রেখা ভবিষ্যৎ সম্পর্কে কী বলে — রাশি, নক্ষত্র, লগ্ন ও হস্তরেখা বিশ্লেষণ, তাৎক্ষণিক ও বিনামূল্যে।", cta: "আমার রিডিং নিন", cta2: "১২টি রাশি দেখুন" },
    top: { choose: "ভাষা বেছে নিন" },
    pricing: { title: "সহজ, সৎ মূল্য" },
    blog: { title: "হস্তরেখা জ্ঞান ব্লগ" },
  },
  or: {
    nav: { home: "ହୋମ", features: "ବୈଶିଷ୍ଟ୍ୟ", how: "କିପରି କାମ କରେ", reviews: "ସମୀକ୍ଷା", rashi: "ରାଶି", blog: "ବ୍ଲଗ", about: "ଆମ ବିଷୟରେ", contact: "ଯୋଗାଯୋଗ", login: "ଲଗଇନ", dashboard: "ଡ୍ୟାସବୋର୍ଡ", getReading: "ରିଡିଙ୍ଗ ନିଅନ୍ତୁ", logout: "ଲଗଆଉଟ" },
    hero: { title1: "ସ୍ୱାଗତ ଆପଣଙ୍କୁ", title2: "ହସ୍ତରେଖା AI ର ଜଗତରେ", sub: "ଜାଣନ୍ତୁ ଆପଣଙ୍କ ହାତର ରେଖା ଭବିଷ୍ୟତ ବିଷୟରେ କ'ଣ କହେ — ରାଶି, ନକ୍ଷତ୍ର, ଲଗ୍ନ ଓ ହସ୍ତରେଖା ବିଶ୍ଳେଷଣ, ତତ୍କ୍ଷଣାତ ଓ ମାଗଣା।", cta: "ମୋ ରିଡିଙ୍ଗ ନିଅନ୍ତୁ", cta2: "୧୨ ରାଶି ଦେଖନ୍ତୁ" },
    top: { choose: "ଭାଷା ବାଛନ୍ତୁ" },
    pricing: { title: "ସରଳ, ସତ ମୂଲ୍ୟ" },
    blog: { title: "ହସ୍ତରେଖା ଜ୍ଞାନ ବ୍ଲଗ" },
  },
  te: {
    nav: { home: "హోమ్", features: "ఫీచర్లు", how: "ఎలా పనిచేస్తుంది", reviews: "సమీక్షలు", rashi: "రాశి", blog: "బ్లాగ్", about: "మా గురించి", contact: "సంప్రదింపు", login: "లాగిన్", dashboard: "డాష్‌బోర్డ్", getReading: "రీడింగ్ పొందండి", logout: "లాగ్‌అవుట్" },
    hero: { title1: "స్వాగతం", title2: "హస్తరేఖ AI ప్రపంచానికి", sub: "మీ అరచేతి రేఖలు భవిష్యత్తు గురించి ఏమి చెబుతున్నాయో తెలుసుకోండి — రాశి, నక్షత్రం, లగ్నం మరియు హస్తరేఖ విశ్లేషణ, వెంటనే మరియు ఉచితంగా.", cta: "నా రీడింగ్ పొందండి", cta2: "12 రాశులు చూడండి" },
    top: { choose: "భాషను ఎంచుకోండి" },
    pricing: { title: "సరళమైన, నిజాయితీ ధర" },
    blog: { title: "హస్తరేఖ జ్ఞాన బ్లాగ్" },
  },
  kn: {
    nav: { home: "ಹೋಮ್", features: "ವೈಶಿಷ್ಟ್ಯಗಳು", how: "ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ", reviews: "ವಿಮರ್ಶೆಗಳು", rashi: "ರಾಶಿ", blog: "ಬ್ಲಾಗ್", about: "ನಮ್ಮ ಬಗ್ಗೆ", contact: "ಸಂಪರ್ಕ", login: "ಲಾಗಿನ್", dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್", getReading: "ರೀಡಿಂಗ್ ಪಡೆಯಿರಿ", logout: "ಲಾಗ್‌ಔಟ್" },
    hero: { title1: "ಸುಸ್ವಾಗತ", title2: "ಹಸ್ತರೇಖೆ AI ಜಗತ್ತಿಗೆ", sub: "ನಿಮ್ಮ ಅಂಗೈಯ ರೇಖೆಗಳು ಭವಿಷ್ಯದ ಬಗ್ಗೆ ಏನು ಹೇಳುತ್ತವೆ ಎಂದು ತಿಳಿಯಿರಿ — ರಾಶಿ, ನಕ್ಷತ್ರ, ಲಗ್ನ ಮತ್ತು ಹಸ್ತರೇಖೆ ವಿಶ್ಲೇಷಣೆ, ತಕ್ಷಣ ಮತ್ತು ಉಚಿತ.", cta: "ನನ್ನ ರೀಡಿಂಗ್ ಪಡೆಯಿರಿ", cta2: "12 ರಾಶಿಗಳು ನೋಡಿ" },
    top: { choose: "ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ" },
    pricing: { title: "ಸರಳ, ಪ್ರಾಮಾಣಿಕ ಬೆಲೆ" },
    blog: { title: "ಹಸ್ತರೇಖೆ ಜ್ಞಾನ ಬ್ಲಾಗ್" },
  },
  ml: {
    nav: { home: "ഹോം", features: "സവിശേഷതകൾ", how: "എങ്ങനെ പ്രവർത്തിക്കുന്നു", reviews: "അഭിപ്രായങ്ങൾ", rashi: "രാശി", blog: "ബ്ലോഗ്", about: "ഞങ്ങളെക്കുറിച്ച്", contact: "ബന്ധപ്പെടുക", login: "ലോഗിൻ", dashboard: "ഡാഷ്‌ബോർഡ്", getReading: "റീഡിങ് നേടുക", logout: "ലോഗ്ഔട്ട്" },
    hero: { title1: "സ്വാഗതം", title2: "ഹസ്തരേഖ AI ലോകത്തേക്ക്", sub: "നിങ്ങളുടെ കൈവരകൾ ഭാവിയെക്കുറിച്ച് എന്തു പറയുന്നു എന്ന് അറിയൂ — രാശി, നക്ഷത്രം, ലഗ്നം, ഹസ്തരേഖാ വിശകലനം, ഉടനടി, സൗജന്യമായി.", cta: "എന്റെ റീഡിങ് നേടുക", cta2: "12 രാശികൾ കാണുക" },
    top: { choose: "ഭാഷ തിരഞ്ഞെടുക്കുക" },
    pricing: { title: "ലളിതമായ, സത്യസന്ധമായ വില" },
    blog: { title: "ഹസ്തരേഖ ജ്ഞാന ബ്ലോഗ്" },
  },
  ta: {
    nav: { home: "முகப்பு", features: "அம்சங்கள்", how: "எப்படி செயல்படுகிறது", reviews: "விமர்சனங்கள்", rashi: "ராசி", blog: "வலைப்பதிவு", about: "எங்களைப் பற்றி", contact: "தொடர்பு", login: "உள்நுழைவு", dashboard: "டாஷ்போர்டு", getReading: "வாசிப்பு பெறுங்கள்", logout: "வெளியேறு" },
    hero: { title1: "வரவேற்கிறோம்", title2: "ஹஸ்தரேகா AI உலகில்", sub: "உங்கள் உள்ளங்கை கோடுகள் எதிர்காலம் பற்றி என்ன சொல்கின்றன என்று அறியுங்கள் — ராசி, நட்சத்திரம், லக்னம் மற்றும் கைரேகை பகுப்பாய்வு, உடனடியாக, இலவசமாக.", cta: "எனது வாசிப்பைப் பெறவும்", cta2: "12 ராசிகள் காண்க" },
    top: { choose: "மொழியைத் தேர்ந்தெடுக்கவும்" },
    pricing: { title: "எளிய, நேர்மையான விலை" },
    blog: { title: "ஹஸ்தரேகா ஞான வலைப்பதிவு" },
  },
  ur: {
    nav: { home: "ہوم", features: "خصوصیات", how: "کیسے کام کرتا ہے", reviews: "تبصرے", rashi: "راشی", blog: "بلاگ", about: "ہمارے بارے میں", contact: "رابطہ", login: "لاگ ان", dashboard: "ڈیش بورڈ", getReading: "ریڈنگ حاصل کریں", logout: "لاگ آؤٹ" },
    hero: { title1: "خوش آمدید", title2: "ہست ریکھا AI کی دنیا میں", sub: "جانیں آپ کی ہتھیلی کی لکیریں مستقبل کے بارے میں کیا کہتی ہیں — راشی، نکشتر، لگن اور ہتھیلی کا تجزیہ، فوراً اور مفت۔", cta: "میری ریڈنگ حاصل کریں", cta2: "12 راشیاں دیکھیں" },
    top: { choose: "زبان منتخب کریں" },
    pricing: { title: "سادہ، ایماندار قیمت" },
    blog: { title: "ہست ریکھا علم بلاگ" },
  },
};

export function deepMerge<T>(base: T, patch: DeepPartial<T> | undefined): T {
  if (!patch) return base;
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const [k, v] of Object.entries(patch as Record<string, unknown>)) {
    const cur = (base as Record<string, unknown>)[k];
    if (v && typeof v === "object" && !Array.isArray(v) && cur && typeof cur === "object" && !Array.isArray(cur)) {
      out[k] = deepMerge(cur as Record<string, unknown>, v as DeepPartial<Record<string, unknown>>);
    } else if (v !== undefined) {
      out[k] = v;
    }
  }
  return out as T;
}
