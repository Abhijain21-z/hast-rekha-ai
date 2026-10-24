import type { Bi } from "@/lib/i18n";

/**
 * Long-form, per-rashi copy for /rashi/[sign].
 *
 * The JSON file already holds dates, traits, lucky factors and the four
 * prediction blocks. These intros add the human context search engines need:
 * element, ruling planet, strengths and the shadow side of the sign. Each
 * intro is unique so the 12 pages do not read like one swapped template.
 */
export const RASHI_GUIDE_UPDATED = "2026-10-24";

export interface RashiGuide {
  key: string;
  intro: Bi;
  shadow: Bi;
}

export const RASHI_GUIDES: RashiGuide[] = [
  {
    key: "mesha",
    intro: {
      hi: "मेष राशि अग्नि तत्व की पहली राशि है और इसका स्वामी मंगल है। 21 मार्च से 19 अप्रैल के बीच जन्मे लोग साहस, ऊर्जा और पहल करने की क्षमता के लिए जाने जाते हैं। आप जब किसी काम में उतरते हैं तो पूरी ताकत लगाते हैं, इसलिए नई शुरुआत में आप अक्सर आगे रहते हैं।\n\nमेष का मन तेज चलता है, पर उतनी ही तेजी से भटक भी सकता है। धैर्य और दूसरों की गति का सम्मान आपके लिए सबसे बड़ा सबक है। करियर में आपको स्वतंत्रता और चुनौती चाहिए; रिश्तों में सीधी बात और स्पष्टता पसंद है।",
      en: "Aries is the first fire sign, ruled by Mars. People born between 21 March and 19 April are known for courage, energy and the ability to start things. When you commit, you give it your full force, which is why you often lead in new beginnings.\n\nYour mind moves fast, but it can wander just as quickly. Patience and respect for other people's pace are your biggest lessons. You need independence and challenge at work, and directness and clarity in relationships.",
    },
    shadow: {
      hi: "जल्दबाजी और गुस्सा आपके फैसलों को बिगाड़ सकते हैं; बड़े कदम से पहले एक रात रुक जाएं।",
      en: "Impatience and anger can spoil your decisions; sleep on big moves before acting.",
    },
  },
  {
    key: "vrishabha",
    intro: {
      hi: "वृषभ राशि पृथ्वी तत्व की राशि है और इसका स्वामी शुक्र है। 20 अप्रैल से 20 मई के बीच जन्मे लोग स्थिरता, सौंदर्य और भरोसे के लिए जाने जाते हैं। आप जल्दी में निर्णय नहीं लेते; पहले सुविधा, सुरक्षा और दीर्घकालिक लाभ देखते हैं।\n\nयही स्थिरता आपकी ताकत है, पर कभी-कभी जिद बन जाती है। बदलाव को दुश्मन न समझें—धीरे-धीरे कदम बढ़ाना आपके लिए सबसे अच्छा रास्ता है। धन और संपत्ति के मामले में आपकी पकड़ मजबूत होती है, और रिश्तों में आप वफादारी को सबसे ऊपर रखते हैं।",
      en: "Taurus is an earth sign ruled by Venus. People born between 20 April and 20 May are known for stability, beauty and trust. You do not rush decisions; you first look at comfort, security and long-term gain.\n\nThat steadiness is your strength, but it can turn into stubbornness. Do not treat change as an enemy—small, steady steps suit you best. You have a strong grip on money and property, and you place loyalty above all in relationships.",
    },
    shadow: {
      hi: "बदलाव से बचने की कोशिश अवसर छीन सकती है; लचीलापन आपकी स्थिरता को और मजबूत बनाता है।",
      en: "Avoiding change can cost you opportunities; flexibility makes your stability stronger.",
    },
  },
  {
    key: "mithuna",
    intro: {
      hi: "मिथुन राशि वायु तत्व की राशि है और इसका स्वामी बुध है। 21 मई से 20 जून के बीच जन्मे लोग जिज्ञासा, संवाद और तेज बुद्धि के लिए जाने जाते हैं। आप एक साथ कई विचारों को पकड़ सकते हैं और नई जानकारी से जल्दी जुड़ते हैं।\n\nआपकी सबसे बड़ी ताकत है लोगों से जुड़ाव, और सबसे बड़ी चुनौती है एक जगह टिकना। शुरुआत करने से ज्यादा जरूरी है उसे पूरा करना। करियर में संचार, लेखन, बिक्री, मीडिया और शिक्षा आपके लिए अच्छे क्षेत्र हैं; रिश्तों में आपको मानसिक साथी चाहिए।",
      en: "Gemini is an air sign ruled by Mercury. People born between 21 May and 20 June are known for curiosity, communication and quick intelligence. You can hold several ideas at once and connect with new information fast.\n\nYour greatest strength is connecting with people; your biggest challenge is staying put. Finishing matters more than starting. Communication, writing, sales, media and teaching suit your career, and you need a mental companion in relationships.",
    },
    shadow: {
      hi: "एक साथ कई काम शुरू करके आधे-अधूरे छोड़ देना आपकी ऊर्जा बिखेरता है; एक समय पर एक लक्ष्य चुनें।",
      en: "Starting many things and leaving them half-done scatters your energy; choose one goal at a time.",
    },
  },
  {
    key: "karka",
    intro: {
      hi: "कर्क राशि जल तत्व की राशि है और इसका स्वामी चंद्रमा है। 21 जून से 22 जुलाई के बीच जन्मे लोग भावुकता, देखभाल और गहरी स्मृति के लिए जाने जाते हैं। आप अपनों के लिए बहुत कुछ करते हैं और घर-परिवार को सुरक्षा का केंद्र मानते हैं।\n\nआपका मन चंद्रमा की तरह बदलता है, इसलिए मूड के उतार-चढ़ाव को पहचानना जरूरी है। सीमाएं बनाना सीखें, वरना दूसरों की भावनाएं आप पर भारी पड़ सकती हैं। करियर में देखभाल, शिक्षा, स्वास्थ्य, खाद्य और रचनात्मक काम अच्छे हैं; रिश्तों में भावनात्मक सुरक्षा सबसे जरूरी है।",
      en: "Cancer is a water sign ruled by the Moon. People born between 21 June and 22 July are known for emotion, care and deep memory. You do a lot for your people and treat home and family as your safety centre.\n\nYour mood shifts like the Moon, so recognising emotional swings matters. Learn to set boundaries, or other people's feelings can weigh you down. Care, teaching, health, food and creative work suit your career, and emotional safety is essential in relationships.",
    },
    shadow: {
      hi: "दूसरों की भावनाओं को अपनी भावनाओं से अलग करना सीखें; हर बात दिल पर न लें।",
      en: "Learn to separate others' feelings from your own; do not take everything to heart.",
    },
  },
  {
    key: "simha",
    intro: {
      hi: "सिंह राशि अग्नि तत्व की राशि है और इसका स्वामी सूर्य है। 23 जुलाई से 22 अगस्त के बीच जन्मे लोग आत्मविश्वास, नेतृत्व और गरिमा के लिए जाने जाते हैं। आप मंच पर आने से नहीं डरते और जब दिल से नेतृत्व करते हैं तो लोग आपके पीछे चलते हैं।\n\nआपकी चुनौती है अपनी पहचान को दूसरों की तारीफ से जोड़ना। सच्चा आत्मसम्मान वह है जो बिना प्रशंसा के भी टिके। करियर में प्रबंधन, प्रशासन, मनोरंजन, शिक्षा और उद्यमिता अच्छे हैं; रिश्तों में आपको सम्मान और वफादारी चाहिए।",
      en: "Leo is a fire sign ruled by the Sun. People born between 23 July and 22 August are known for confidence, leadership and dignity. You are not afraid of the stage, and when you lead from the heart, people follow.\n\nYour challenge is tying your identity to others' praise. True self-respect holds up without applause. Management, administration, entertainment, teaching and entrepreneurship suit your career, and you need respect and loyalty in relationships.",
    },
    shadow: {
      hi: "प्रशंसा के बिना भी अपनी कीमत पहचानें; अहंकार और आत्मसम्मान में फर्क रखें।",
      en: "Recognise your worth without praise; know the difference between ego and self-respect.",
    },
  },
  {
    key: "kanya",
    intro: {
      hi: "कन्या राशि पृथ्वी तत्व की राशि है और इसका स्वामी बुध है। 23 अगस्त से 22 सितंबर के बीच जन्मे लोग विश्लेषण, सेवा और सूक्ष्मता के लिए जाने जाते हैं। आप चीजों को बारीकी से देखते हैं और सुधार की जगह तुरंत पकड़ लेते हैं।\n\nयही गुण कभी-कभी अत्यधिक आलोचना बन जाता है—खुद पर भी और दूसरों पर भी। 'अच्छा' और 'सही' में फर्क करें। करियर में विश्लेषण, स्वास्थ्य, संपादन, लेखा, शिक्षा और सेवा अच्छे हैं; रिश्तों में आपको भरोसा और छोटे-छोटे प्रयासों की कद्र चाहिए।",
      en: "Virgo is an earth sign ruled by Mercury. People born between 23 August and 22 September are known for analysis, service and attention to detail. You see things closely and spot the gap that needs fixing.\n\nThat gift can become excessive criticism—of yourself and others. Learn the difference between good and perfect. Analysis, health, editing, accounts, teaching and service suit your career, and you need trust and appreciation of small efforts in relationships.",
    },
    shadow: {
      hi: "हर चीज में कमी ढूंढ़ने की आदत खुशी को कम कर देती है; कभी-कभी 'अच्छा है' कहना काफी होता है।",
      en: "The habit of finding a flaw everywhere reduces joy; sometimes 'good enough' is enough.",
    },
  },
  {
    key: "tula",
    intro: {
      hi: "तुला राशि वायु तत्व की राशि है और इसका स्वामी शुक्र है। 23 सितंबर से 22 अक्टूबर के बीच जन्मे लोग संतुलन, सौंदर्य और रिश्तों के लिए जाने जाते हैं। आप दो पक्षों को समझने की कोशिश करते हैं और माहौल में सामंजस्य रखना पसंद करते हैं।\n\nसमझौता आपकी ताकत है, पर अपनी जरूरतें भूल जाना कमजोरी। 'ना' कहना भी संतुलन का हिस्सा है। करियर में कानून, डिजाइन, कला, साझेदारी, बिक्री और सलाह अच्छे हैं; रिश्तों में आपको बराबरी और सुंदरता दोनों चाहिए।",
      en: "Libra is an air sign ruled by Venus. People born between 23 September and 22 October are known for balance, beauty and relationships. You try to understand both sides and prefer harmony in your environment.\n\nCompromise is your strength, but forgetting your own needs is the weakness. Saying no is part of balance too. Law, design, art, partnership, sales and counselling suit your career, and you need equality and beauty in relationships.",
    },
    shadow: {
      hi: "दूसरों को खुश करने के चक्कर में अपनी पसंद भूल जाना आपको असंतुलित करता है; पहले खुद से पूछें।",
      en: "Forgetting your own preference while pleasing others unbalances you; ask yourself first.",
    },
  },
  {
    key: "vrishchika",
    intro: {
      hi: "वृश्चिक राशि जल तत्व की राशि है और इसका स्वामी मंगल है। 23 अक्टूबर से 21 नवंबर के बीच जन्मे लोग गहराई, रहस्य और दृढ़ संकल्प के लिए जाने जाते हैं। आप सतही बातों से जल्दी बोर होते हैं और जो ठान लेते हैं, उसे पूरा करने की ताकत रखते हैं।\n\nआपकी भावनाएं तीव्र होती हैं, इसलिए भरोसा टूटने पर आप जल्दी बंद हो जाते हैं। क्षमा और पारदर्शिता आपके रिश्तों को हल्का बनाती है। करियर में शोध, चिकित्सा, जांच, वित्त, मनोविज्ञान और गोपनीय काम अच्छे हैं; रिश्तों में आपको गहरा, वफादार और ईमानदार साथी चाहिए।",
      en: "Scorpio is a water sign ruled by Mars. People born between 23 October and 21 November are known for depth, mystery and determination. You get bored with the surface and have the strength to finish what you commit to.\n\nYour emotions run intense, so you close off quickly when trust breaks. Forgiveness and transparency lighten your relationships. Research, medicine, investigation, finance, psychology and confidential work suit your career, and you need a deep, loyal and honest partner.",
    },
    shadow: {
      hi: "संदेह और बदले की भावना रिश्तों को भारी बना सकते हैं; भरोसा करना भी ताकत है।",
      en: "Suspicion and revenge can weigh relationships down; trust is also strength.",
    },
  },
  {
    key: "dhanu",
    intro: {
      hi: "धनु राशि अग्नि तत्व की राशि है और इसका स्वामी बृहस्पति है। 22 नवंबर से 21 दिसंबर के बीच जन्मे लोग आशावाद, स्वतंत्रता और सीखने की ललक के लिए जाने जाते हैं। आप बड़े सपने देखते हैं और अनुभव से सीखना पसंद करते हैं।\n\nआपकी चुनौती है विवरण और निरंतरता। बड़ा लक्ष्य तय करके उसे छोटे कदमों में बांटें। करियर में शिक्षा, यात्रा, प्रकाशन, कानून, विदेशी काम और सलाह अच्छे हैं; रिश्तों में आपको स्वतंत्रता और ईमानदारी चाहिए।",
      en: "Sagittarius is a fire sign ruled by Jupiter. People born between 22 November and 21 December are known for optimism, freedom and a hunger to learn. You dream big and prefer learning through experience.\n\nYour challenge is detail and consistency. Set the big goal and break it into small steps. Teaching, travel, publishing, law, international work and counselling suit your career, and you need freedom and honesty in relationships.",
    },
    shadow: {
      hi: "बड़े वादे और छोटी तैयारी के बीच का फासला आपको भरोसे पर भारी बना सकता है; पहले योजना बनाएं।",
      en: "The gap between big promises and small preparation can hurt trust; plan first.",
    },
  },
  {
    key: "makara",
    intro: {
      hi: "मकर राशि पृथ्वी तत्व की राशि है और इसका स्वामी शनि है। 22 दिसंबर से 19 जनवरी के बीच जन्मे लोग अनुशासन, जिम्मेदारी और दीर्घकालिक सोच के लिए जाने जाते हैं। आप परिणाम के लिए धैर्य से मेहनत करते हैं और जल्दी बने वैभव पर भरोसा नहीं करते।\n\nआपकी चुनौती है खुद को सिर्फ काम से पहचानना। आराम और आनंद भी जरूरी है। करियर में प्रशासन, वित्त, इंजीनियरिंग, रियल एस्टेट, कानून और प्रबंधन अच्छे हैं; रिश्तों में आपको स्थिरता और समय चाहिए—आप धीरे खुलते हैं, पर वफादार रहते हैं।",
      en: "Capricorn is an earth sign ruled by Saturn. People born between 22 December and 19 January are known for discipline, responsibility and long-term thinking. You work patiently for results and do not trust quick wealth.\n\nYour challenge is identifying only with work. Rest and joy matter too. Administration, finance, engineering, real estate, law and management suit your career, and you need stability and time in relationships—you open up slowly but stay loyal.",
    },
    shadow: {
      hi: "सिर्फ काम और नतीजों में उलझकर रिश्तों और सेहत को नजरअंदाज न करें; आराम भी उत्पादकता है।",
      en: "Do not ignore relationships and health while chasing work and results; rest is productive too.",
    },
  },
  {
    key: "kumbha",
    intro: {
      hi: "कुंभ राशि वायु तत्व की राशि है और इसका स्वामी शनि है। 20 जनवरी से 18 फरवरी के बीच जन्मे लोग मौलिकता, सामाजिक सोच और स्वतंत्र विचार के लिए जाने जाते हैं। आप पुरानी परंपरा से ज्यादा नए विचार और समाधान पसंद करते हैं।\n\nआपकी चुनौती है भावनाओं को दूर से देखना—कभी-कभी लोग आपको ठंडा समझते हैं। जुड़ाव दिखाना कमजोरी नहीं है। करियर में तकनीक, विज्ञान, सामाजिक कार्य, शोध, डिजाइन और सामुदायिक परियोजनाएं अच्छी हैं; रिश्तों में आपको दोस्ती और बौद्धिक साथ चाहिए।",
      en: "Aquarius is an air sign ruled by Saturn. People born between 20 January and 18 February are known for originality, social thinking and independent ideas. You prefer new ideas and solutions over old tradition.\n\nYour challenge is viewing emotions from a distance—sometimes people read you as cold. Showing connection is not weakness. Technology, science, social work, research, design and community projects suit your career, and you need friendship and intellectual companionship in relationships.",
    },
    shadow: {
      hi: "भावनाओं को तर्क से दूर रखना अकेलापन ला सकता है; जुड़ाव दिखाएं।",
      en: "Keeping emotions away from logic can bring loneliness; show connection.",
    },
  },
  {
    key: "meena",
    intro: {
      hi: "मीन राशि जल तत्व की राशि है और इसका स्वामी बृहस्पति है। 19 फरवरी से 20 मार्च के बीच जन्मे लोग करुणा, कल्पना और आध्यात्मिक झुकाव के लिए जाने जाते हैं। आप दूसरों की भावनाएं जल्दी पकड़ लेते हैं और कला, संगीत या सेवा में गहराई ला सकते हैं।\n\nआपकी चुनौती है सीमाएं बनाना, क्योंकि दूसरों का दुख आपको जल्दी प्रभावित करता है। स्पष्टता और जमीन से जुड़े कदम आपको सुरक्षित रखते हैं। करियर में कला, चिकित्सा, परामर्श, आध्यात्मिक कार्य, संगीत और सेवा अच्छे हैं; रिश्तों में आपको कोमलता और भावनात्मक समझ चाहिए।",
      en: "Pisces is a water sign ruled by Jupiter. People born between 19 February and 20 March are known for compassion, imagination and spiritual inclination. You sense other people's feelings quickly and can bring depth to art, music or service.\n\nYour challenge is boundaries, because others' pain affects you easily. Clarity and grounded steps keep you safe. Art, healing, counselling, spiritual work, music and service suit your career, and you need tenderness and emotional understanding in relationships.",
    },
    shadow: {
      hi: "हर किसी की समस्या अपने ऊपर लेना आपको थका देता है; सहानुभूति और सीमा दोनों जरूरी हैं।",
      en: "Taking on everyone's problems exhausts you; empathy and boundaries are both necessary.",
    },
  },
];

export const rashiGuideByKey = (key: string) => RASHI_GUIDES.find((g) => g.key === key);
