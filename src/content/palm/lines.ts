import type { PalmPage } from "./types";

const PILLAR_LINK = "hast-rekha-palmistry";

/**
 * Line guides. Same shape as the pillar page: rule-based classical meaning
 * first, everyday usefulness right after, and never a guarantee or a scare.
 */
export const LINE_PAGES: PalmPage[] = [
  {
    slug: "life-line",
    kind: "line",
    focus: { en: "Life line in palm", hi: "जीवन रेखा (Jeevan Rekha)" },
    title: {
      en: "Life Line in Palm — Jeevan Rekha Guide Hindi | Hastrekha AI",
      hi: "जीवन रेखा (Life Line) — Hath Ki Rekha Guide | Hastrekha AI",
    },
    description: {
      en: "Life rekha in palm ka matlab: types of lifeline, cut in lifeline aur hast rekha se aayu kaise pata kare — simple Hindi me. Free AI reading bhi pao.",
      hi: "जीवन रेखा का मतलब: types of lifeline in palmistry, cut in lifeline ka asar और हस्तरेखा से आयु कैसे पता करें — आसान हिंदी में। फ्री AI reading भी पाएँ।",
    },
    h1: {
      en: "Jeevan Rekha (Life Line) — Where It Is And What It Says",
      hi: "जीवन रेखा (Life Line) — कहाँ होती है और क्या बताती है",
    },
    crumb: { en: "Life Line (Jeevan Rekha)", hi: "जीवन रेखा (Life Line)" },
    intro: [
      {
        en: "Jeevan rekha, or the life line in palm, is the deep curve that wraps around the base of your thumb and runs towards the wrist. It is the first line beginners learn to spot — and the one most often misread, because it does not tell you how long you will live.",
        hi: "जीवन रेखा (life line in palm) वह गहरी घुमावदार लकीर है जो अंगूठे के मूल के चारों ओर से घूमकर कलाई की ओर जाती है। नए पाठक सबसे पहले इसे ही पहचानना सीखते हैं — और सबसे ज़्यादा इसी को ग़लत पढ़ते हैं, क्योंकि यह आपकी उम्र की तारीख़ नहीं बताती।",
      },
      {
        en: "What the life line actually shows is vitality: how much energy you carry, how you recover from stress, and where big chapters of change begin. Read it with the mount of Venus (the pad inside the curve) and the head line, and the reading becomes much more useful.",
        hi: "जीवन रेखा असल में जीवन-शक्ति बताती है: आपके अंदर कितनी ऊर्जा है, तनाव से कैसे उबरते हैं, और बदलाव के बड़े दौर कहाँ से शुरू होते हैं। इसे शुक्र पर्वत (रेखा के अंदर की गद्दी) और मस्तिष्क रेखा के साथ पढ़ें, तब रीडिंग कहीं ज़्यादा काम की बनती है।",
      },
      {
        en: "This guide walks through the position, every common type of life line — long, short, broken, chained and branched — the classical reading of a cut in the lifeline, and the honest answer to 'hast rekha se aayu kaise pata kare'.",
        hi: "इस गाइड में आप देखेंगे: रेखा कहाँ होती है, हर सामान्य प्रकार — लंबी, छोटी, टूटी, जंज़ीर जैसी और शाखाओं वाली, जीवन रेखा में कट का शास्त्रीय अर्थ, और 'हस्तरेखा से आयु कैसे पता करें' का ईमानदार जवाब।",
      },
    ],
    diagram: {
      line: "life",
      alt: "jeevan rekha palm reading diagram — life line showing thumb ke base se wrist tak",
      caption: {
        en: "The gold curve is the life line: it starts between the thumb and index finger and sweeps around the mount of Venus towards the wrist.",
        hi: "सुनहरी घुमावदार रेखा ही जीवन रेखा है: यह अंगूठे और तर्जनी के बीच से शुरू होकर शुक्र पर्वत के चारों ओर कलाई की ओर जाती है।",
      },
    },
    sections: [
      {
        h: { en: "Where is the life line? (महिला के हाथ में जीवन रेखा कौन सी होती है)", hi: "जीवन रेखा कहाँ होती है? (महिला के हाथ में कौन सी होती है)" },
        p: [
          {
            en: "Place your palm up. The life line begins on the fleshy edge between your thumb and index finger and curves down around the ball of the thumb. In both men's and women's hands the position is identical — there is no separate 'female life line'.",
            hi: "हथेली ऊपर की ओर रखें। जीवन रेखा अंगूठे और तर्जनी के बीच वाले मांसल किनारे से शुरू होकर अंगूठे की गद्दी के चारों ओर नीचे जाती है। पुरुष और महिला — दोनों के हाथ में इसका स्थान एक ही होता है; कोई अलग 'महिला जीवन रेखा' नहीं होती।",
          },
          {
            en: "Some hands show one clear curve, some show a second parallel line inside it (a 'sister line', read as extra support in hard phases). If your life line seems to start joined with the head line, classical texts read it as a careful, family-minded start to life.",
            hi: "कुछ हाथों में एक साफ़ घुमाव दिखता है, कुछ में उसके अंदर दूसरी समांतर रेखा भी होती है (इसे 'सहायक रेखा' मानते हैं, मुश्किल दौर में सहारा)। अगर जीवन रेखा मस्तिष्क रेखा से जुड़कर शुरू हो, तो शास्त्र इसे सतर्क और परिवार-केंद्रित शुरुआत मानते हैं।",
          },
        ],
      },
      {
        h: { en: "Types of lifeline in palmistry", hi: "Types of lifeline — कितनी तरह की होती है" },
        p: [
          {
            en: "Depth, colour and continuity matter more than length. A line that is deep and unbroken suggests steady energy; a thin, chained one suggests energy that comes in waves. Judges of palmistry also look at how far the curve goes before it fades.",
            hi: "लंबाई से ज़्यादा गहराई, रंग और निरंतरता मायने रखती है। गहरी और बिना टूटी रेखा स्थिर ऊर्जा बताती है; पतली और जंज़ीर जैसी रेखा ऊर्जा के उतार-चढ़ाव वाले दौर बताती है। यह भी देखा जाता है कि घुमाव ख़त्म होने से पहले कितनी दूर तक जाता है।",
          },
        ],
        list: [
          { title: { en: "Long, deep curve", hi: "लंबी और गहरी" }, text: { en: "Classical reading: strong stamina, quick recovery, a long working life.", hi: "शास्त्रीय अर्थ: मज़बूत सहनशक्ति, जल्दी रिकवरी, लंबा कामकाजी जीवन।" } },
          { title: { en: "Short but deep", hi: "छोटी पर गहरी" }, text: { en: "Focused energy: strong in bursts, needs rest between big efforts.", hi: "केंद्रित ऊर्जा: बड़े प्रयासों में तेज़, बीच में आराम ज़रूरी।" } },
          { title: { en: "Chained or islanded", hi: "जंज़ीर या द्वीप जैसी" }, text: { en: "Phases of low energy — usually read alongside diet, sleep and stress habits.", hi: "कम ऊर्जा के दौर — साथ में खान-पान, नींद और तनाव की आदतें देखें।" } },
          { title: { en: "Broken with an overlap", hi: "टूटी पर ओवरलैप वाली" }, text: { en: "A change of chapter, not an end: jobs, cities or lifestyle shifts.", hi: "जीवन का अध्याय बदलना, अंत नहीं: नौकरी, शहर या जीवनशैली का बदलाव।" } },
          { title: { en: "Branches going up", hi: "ऊपर जाती शाखाएँ" }, text: { en: "Efforts that add up — opportunities created by your own work.", hi: "आपके प्रयास से बने अवसर, जो जुड़कर बड़ा फल देते हैं।" } },
          { title: { en: "Travel lines crossing it", hi: "यात्रा रेखाएँ काटती हुई" }, text: { en: "Movement, migration and work away from the birth place.", hi: "गमन, पलायन और जन्म-स्थान से दूर काम।" } },
        ],
      },
      {
        h: { en: "Cut in lifeline palmistry — जीवन रेखा में कट का मतलब", hi: "Cut in lifeline — जीवन रेखा में कट का असली मतलब" },
        p: [
          {
            en: "A cut means the line pauses and restarts. Classical books read it as an interruption in routine — a change of job, city, health routine or family setup — not as a calamity. What matters is the line after the cut: if a new line overlaps and continues cleanly, the phase is rebuilt well.",
            hi: "कट का मतलब है कि रेखा रुककर फिर शुरू होती है। शास्त्रों में इसे दिनचर्या में रुकावट माना जाता है — नौकरी, शहर, सेहत की आदत या परिवार की व्यवस्था बदलना — कोई आपदा नहीं। असली बात कट के बाद की रेखा है: अगर नई रेखा ओवरलैप करके साफ़ चलती है, तो वह दौर अच्छी तरह सँभल जाता है।",
          },
          {
            en: "If the break sits under the mount of Jupiter, the change usually arrives through ambition or a new responsibility; under the Moon, through travel or people outside the family. Always read the nearby head and heart lines before saying anything about a break.",
            hi: "अगर कट गुरु पर्वत के नीचे है तो बदलाव महत्वाकांक्षा या नई ज़िम्मेदारी से आता है; चंद्र पर्वत के नीचे है तो यात्रा या परिवार से बाहर के लोगों से। किसी भी टूटन के बारे में कुछ कहने से पहले पास की मस्तिष्क और हृदय रेखा ज़रूर पढ़ें।",
          },
        ],
      },
      {
        h: { en: "Hast rekha se aayu kaise pata kare? (हस्तरेखा से आयु कैसे पता करें)", hi: "हस्तरेखा से आयु कैसे पता करें? (ईमानदार तरीक़ा)" },
        p: [
          {
            en: "Traditional teachers measured age by dropping a scale from the base of the index finger to the life line — every crossing point marked a decade. It is a useful exercise for learning to read proportions, but as a prediction of how long you will live it is unreliable, and no honest palmist today uses it that way.",
            hi: "पुराने शिक्षक उम्र नापने के लिए तर्जनी के मूल से जीवन रेखा तक एक पैमाना गिराते थे — जहाँ-जहाँ रेखा मिलती, वहाँ एक दशक माना जाता। सीखने के लिए यह अभ्यास ठीक है, पर 'कितनी उम्र मिलेगी' यह बताने के लिए यह भरोसेमंद नहीं है, और आज कोई ईमानदार पामिस्ट इसे इस तरह नहीं पढ़ता।",
          },
          {
            en: "What you can use safely: the faint vertical lines rising from the life line or wrist are read as 'active years' — energy pushed into work, projects and responsibilities. Count them as a map of effort, not a countdown.",
            hi: "जो सुरक्षित तरीक़े से काम आता है: जीवन रेखा या कलाई से ऊपर उठती हल्की खड़ी रेखाएँ 'सक्रिय वर्ष' मानी जाती हैं — यानी काम, प्रोजेक्ट और ज़िम्मेदारी में लगी ऊर्जा। इन्हें प्रयास के नक्शे की तरह पढ़ें, उलटी गिनती की तरह नहीं।",
          },
        ],
      },
      {
        h: { en: "Life line and health — क्या सावधानी रखें", hi: "जीवन रेखा और सेहत — क्या सावधानी रखें" },
        p: [
          {
            en: "A chained life line is often linked in classical texts with low stamina, and some readers connect islands with phases of illness. Treat that as a reminder to check sleep, food and stress — never as a diagnosis.",
            hi: "जंज़ीर जैसी जीवन रेखा को शास्त्रों में अक्सर कम सहनशक्ति से जोड़ा जाता है, और द्वीप चिह्न को कुछ पाठक बीमारी के दौर से जोड़ते हैं। इसे नींद, खान-पान और तनाव जाँचने का इशारा मानें — किसी बीमारी का पता कभी न मानें।",
          },
          {
            en: "If a health worry is real, the answer is a doctor. A palm reading can nudge you to book the appointment; it cannot replace it.",
            hi: "अगर सेहत की चिंता वाक़ई है, तो जवाब डॉक्टर है। हस्तरेखा आपको अपॉइंटमेंट लेने का इशारा दे सकती है, उसकी जगह नहीं ले सकती।",
          },
        ],
      },
      {
        h: { en: "Read your own life line in three steps", hi: "अपनी जीवन रेखा खुद पढ़ें — तीन कदम" },
        p: [
          {
            en: "First, note where the curve starts and ends. Second, count the breaks and check whether a parallel line covers each break. Third, look for branches — up for effort, down for travel — and match all of it with the mount of Venus and the head line.",
            hi: "पहला: रेखा कहाँ से शुरू और कहाँ ख़त्म होती है, लिख लें। दूसरा: कितनी टूटन हैं और हर टूटन को कोई समांतर रेखा सँभालती है या नहीं। तीसरा: शाखाएँ देखें — ऊपर की शाखा प्रयास, नीचे की यात्रा — और यह सब शुक्र पर्वत तथा मस्तिष्क रेखा से मिलाकर पढ़ें।",
          },
          {
            en: "Do this once, then again after six months with a new photo. Watching your own line change is the fastest way to learn what it really represents.",
            hi: "एक बार ऐसा करें, फिर छह महीने बाद नई फ़ोटो के साथ दोबारा। अपनी ही रेखा को बदलते देखना सबसे तेज़ तरीक़ा है यह समझने का कि यह असल में किस चीज़ का संकेत है।",
          },
        ],
      },
    ],
    faqs: [
      {
        q: { en: "How do you find the age from a life line?", hi: "हस्तरेखा से आयु कैसे पता करें?" },
        a: {
          en: "Traditional palmists drop a scale from the base of the index finger to the life line and count each crossing as a decade. It is a good drawing exercise, but the life line does not fix how long you will live, so use it for reading energy phases, not for a life span.",
          hi: "पुराने पामिस्ट तर्जनी के मूल से जीवन रेखा तक पैमाना गिराकर हर कटान को एक दशक मानते हैं। यह अभ्यास ठीक है, पर जीवन रेखा आपकी उम्र तय नहीं करती — इसे ऊर्जा के दौर पढ़ने के लिए इस्तेमाल करें, जीवन-काल बताने के लिए नहीं।",
        },
      },
      {
        q: { en: "What does a cut in the lifeline mean?", hi: "जीवन रेखा में कट का क्या मतलब है?" },
        a: {
          en: "A cut means a break in routine: change of place, work, health habits or family arrangement. If a second line overlaps the gap, the phase rebuilds well. It never means a short life, and honest readers avoid saying anything dramatic about a single break.",
          hi: "कट का मतलब दिनचर्या में रुकावट है: जगह, काम, सेहत की आदतें या परिवार की व्यवस्था बदलना। अगर दूसरी रेखा उस गैप को ढक दे, तो वह दौर अच्छी तरह सँभल जाता है। इसका मतलब छोटी उम्र कभी नहीं, और ईमानदार पाठक एक टूटन पर कोई डरावनी बात नहीं कहते।",
        },
      },
      {
        q: { en: "महिला के हाथ में जीवन रेखा कौन सी होती है?", hi: "महिला के हाथ में जीवन रेखा कौन सी होती है?" },
        a: {
          en: "Same line, same place: the curve around the base of the thumb. Indian practice usually reads the active hand for the present and the passive hand for inherited patterns, so for many women the main life line is read on the right hand and confirmed on the left.",
          hi: "वही रेखा, वही जगह: अंगूठे के मूल के चारों ओर का घुमाव। भारतीय परंपरा में सक्रिय हाथ से वर्तमान और निष्क्रिय हाथ से मिला स्वभाव देखा जाता है, इसलिए कई महिलाओं में मुख्य जीवन रेखा दाएँ हाथ पर पढ़ी जाती है और बाएँ से मिलाई जाती है।",
        },
      },
      {
        q: { en: "Does a short life line mean a short life?", hi: "छोटी जीवन रेखा का मतलब छोटी उम्र है क्या?" },
        a: {
          en: "No. A short, deep line is read as focused energy — strong effort in phases with rest needed in between. Life span is not written in the palm line; no classical text promises that, and claims like this are usually made to create fear.",
          hi: "नहीं। छोटी पर गहरी रेखा केंद्रित ऊर्जा बताती है — दौरों में तेज़ प्रयास और बीच में आराम की ज़रूरत। जीवन-काल हथेली की रेखा में तय नहीं होता; शास्त्र भी ऐसा दावा नहीं करते, और ऐसी बातें डर बनाने के लिए कही जाती हैं।",
        },
      },
      {
        q: { en: "Which lines should I read with the life line?", hi: "जीवन रेखा के साथ कौन सी रेखाएँ देखनी चाहिए?" },
        a: {
          en: "Three: the head line (how you decide), the mount of Venus inside the curve (physical energy and family life) and the fate line (career direction). Reading these together is what keeps a life-line reading realistic instead of dramatic.",
          hi: "तीन: मस्तिष्क रेखा (निर्णय कैसे लेते हैं), घुमाव के अंदर का शुक्र पर्वत (शारीरिक ऊर्जा और पारिवारिक जीवन) और भाग्य रेखा (करियर की दिशा)। इन्हें साथ पढ़ने से ही जीवन रेखा की रीडिंग नाटकीय नहीं, व्यावहारिक बनती है।",
        },
      },
    ],
    related: [PILLAR_LINK, "heart-line", "fate-line", "health-line"],
    keywords: ["jeevan rekha", "life line in palm", "life rekha in palm", "types of lifeline in palmistry", "cut in lifeline palmistry", "हस्तरेखा से आयु कैसे पता करें", "महिला के हाथ में जीवन रेखा"],
  },
  {
    slug: "heart-line",
    kind: "line",
    focus: { en: "Heart line in palmistry", hi: "हृदय रेखा (Heart Line)" },
    title: {
      en: "Heart Line Palmistry — Hriday Rekha Guide | Hastrekha AI",
      hi: "हृदय रेखा (Heart Line) — Prem Aur Rishta | Hastrekha AI",
    },
    description: {
      en: "What is heart line in palmistry aur hriday rekha chhoti ho to kya hota hai — prem, shaadi aur rishton ka matlab simple Hindi me. Free AI palm reading.",
      hi: "Heart line in palmistry क्या है और हृदय रेखा छोटी हो तो क्या होता है — प्रेम, शादी और रिश्तों का मतलब आसान हिंदी में। फ्री AI palm reading भी पाएँ।",
    },
    h1: {
      en: "Hriday Rekha (Heart Line) — The Line Of Love And Connection",
      hi: "हृदय रेखा (Heart Line) — प्यार, भावना और रिश्तों की रेखा",
    },
    crumb: { en: "Heart Line (Hriday Rekha)", hi: "हृदय रेखा (Heart Line)" },
    intro: [
      {
        en: "The heart line in palmistry is the horizontal line in the upper part of your palm, running under the fingers. It describes your emotional style — how you express affection, how quickly you commit, and how you behave when a relationship is tested.",
        hi: "Heart line in palmistry यानी हृदय रेखा हथेली के ऊपरी हिस्से में उंगलियों के नीचे चलने वाली आड़ी रेखा है। यह आपकी भावनाओं का तरीक़ा बताती है — प्यार कैसे जताते हैं, कितनी जल्दी जुड़ते हैं, और रिश्ता परखा जाए तो आप कैसा व्यवहार करते हैं।",
      },
      {
        en: "In Indian haste rekha, this line pairs with the mount of Venus and the moon mount; Western palmistry pairs it with the head line. Either way, the most useful reading comes from comparing the two hands — what you inherited versus what you have made of it.",
        hi: "भारतीय हस्तरेखा में यह रेखा शुक्र और चंद्र पर्वत के साथ पढ़ी जाती है; पश्चिमी पामिस्ट्री इसे मस्तिष्क रेखा के साथ जोड़ती है। दोनों तरीक़ों में सबसे काम की बात यह है कि दोनों हाथों की तुलना करें — क्या विरासत में मिला और क्या आपने अपने प्रयास से बनाया।",
      },
      {
        en: "Below: where the line sits, what a short or long heart line means, what a break or chain shows, and how readers judge timing for marriage and serious relationships.",
        hi: "नीचे: रेखा कहाँ होती है, छोटी या लंबी हृदय रेखा का मतलब क्या है, टूटी या जंज़ीर जैसी रेखा क्या दिखाती है, और विवाह तथा गंभीर रिश्तों का समय पाठक कैसे देखते हैं।",
      },
    ],
    diagram: {
      line: "heart",
      alt: "hriday rekha palm reading diagram — heart line placement on the palm",
      caption: {
        en: "The heart line sits at the top of the palm, between the fingers and the head line. Its ending decides how it is read: on the index finger, under Saturn, or curving to the pinky.",
        hi: "हृदय रेखा हथेली के ऊपरी हिस्से में, उंगलियों और मस्तिष्क रेखा के बीच होती है। इसका अंत तय करता है कि इसे कैसे पढ़ें: तर्जनी तक, शनि के नीचे, या कनिष्ठा की ओर मुड़ी हुई।",
      },
    },
    sections: [
      {
        h: { en: "Where is the heart line and how do you spot it?", hi: "हृदय रेखा कहाँ होती है और कैसे पहचानें?" },
        p: [
          {
            en: "Look at the top third of your palm. The line closest to the fingers, crossing the hand sideways, is the heart line. It usually begins on the outer edge under the little finger and travels towards the index finger or middle finger. Occasionally it starts away from the edge — classical texts call that a strong need for freedom in relationships.",
            hi: "हथेली के ऊपरी तिहाई हिस्से को देखें। उंगलियों के सबसे करीब, हाथ को आड़े में काटती रेखा हृदय रेखा है। यह आमतौर पर कनिष्ठा के नीचे बाहरी किनारे से शुरू होकर तर्जनी या मध्यमा की ओर जाती है। कभी-कभी यह किनारे से नहीं, थोड़ा अंदर से शुरू होती है — शास्त्र इसे रिश्तों में स्वतंत्रता की ज़्यादा ज़रूरत मानते हैं।",
          },
          {
            en: "A note that saves confusion: the life line curves, the head line is in the middle, and the heart line is horizontal above both. If you can remember that triangle, you have found the three lines that matter most in any hast rekha reading.",
            hi: "उलझन बचाने वाली बात: जीवन रेखा घूमती है, मस्तिष्क रेखा बीच में होती है, और हृदय रेखा इन दोनों के ऊपर आड़ी चलती है। यह त्रिकोण याद रह जाए तो हस्तरेखा की वे तीन रेखाएँ आप जान गए जो सबसे ज़्यादा मायने रखती हैं।",
          },
        ],
      },
      {
        h: { en: "हृदय रेखा छोटी हो तो क्या होगा? (Short heart line meaning)", hi: "हृदय रेखा छोटी हो तो क्या होगा?" },
        p: [
          {
            en: "A short heart line that ends under the middle or index finger is read as practical love: such people show affection through actions — arranging things, solving problems, providing — more than through long emotional conversations. It is not 'less love'.",
            hi: "छोटी हृदय रेखा जो मध्यमा या तर्जनी के नीचे ख़त्म हो जाए, व्यावहारिक प्रेम मानी जाती है: ऐसे लोग भावना दिखाने के बजाय काम से जताते हैं — व्यवस्था बनाना, समस्या हल करना, सहारा देना। इसका मतलब 'कम प्यार' कभी नहीं।",
          },
          {
            en: "If the short line is also faint, classical readers suggest the person warms up slowly and opens up only after trust is established. If it is short and deep, the feelings are intense but private — a common pattern in people who do not post about their relationships.",
            hi: "अगर छोटी रेखा हल्की भी हो, तो शास्त्र कहते हैं कि व्यक्ति धीरे-धीरे खुलता है और भरोसा बनने के बाद ही दिल की बात कहता है। अगर रेखा छोटी पर गहरी हो, तो भावना तीव्र पर निजी रहती है — यह उन लोगों में आम है जो रिश्तों की चर्चा सबके सामने नहीं करते।",
          },
          {
            en: "A long heart line reaching the index finger usually reads as warm, expressive and family-oriented; one that curves up between the index and middle finger is the balanced classic — affection with good judgement.",
            hi: "तर्जनी तक पहुँचने वाली लंबी हृदय रेखा स्नेही, अभिव्यक्त करने वाला और परिवार-केंद्रित स्वभाव बताती है; तर्जनी और मध्यमा के बीच ऊपर मुड़ने वाली रेखा संतुलित मानी जाती है — प्यार के साथ समझदारी।",
          },
        ],
      },
      {
        h: { en: "Broken, chained and branched heart lines", hi: "टूटी, जंज़ीर जैसी और शाखाओं वाली हृदय रेखा" },
        p: [
          {
            en: "A single clean break is read as a major emotional chapter — a relationship that changes you, a long-distance phase, or a decision to start over. Several small breaks suggest a person who has had to rebuild trust more than once.",
            hi: "एक साफ़ टूटन को भावनाओं का बड़ा अध्याय माना जाता है — ऐसा रिश्ता जो आपको बदल दे, लंबे समय का अलगाव, या नई शुरुआत का फ़ैसला। कई छोटी टूटनें उस इंसान को दिखाती हैं जिसने एक से ज़्यादा बार भरोसा फिर से बनाना सीखा।",
          },
          {
            en: "A chained line (many small loops) points to emotional ups and downs, often linked with sensitivity. An island right under the ring finger is read as a period of doubt in love — temporary, and usually followed by a clearer phase.",
            hi: "जंज़ीर जैसी रेखा (कई छोटे छल्ले) भावनाओं के उतार-चढ़ाव दिखाती है, अक्सर संवेदनशील स्वभाव के साथ। अनामिका के ठीक नीचे बना द्वीप प्रेम में संदेह के दौर का संकेत माना जाता है — यह अस्थायी होता है और इसके बाद साफ़ दौर आता है।",
          },
          {
            en: "Branches that rise towards the mount of Jupiter show generous love — giving without keeping score. Branches that drop down and touch the head line mean feelings and logic run very close: such people analyse what they feel before they act on it.",
            hi: "गुरु पर्वत की ओर उठती शाखाएँ उदार प्रेम दिखाती हैं — बिना हिसाब रखे देना। नीचे की ओर जाकर मस्तिष्क रेखा को छूती शाखाएँ बताती हैं कि भावना और तर्क एक-दूसरे के बहुत करीब चलते हैं: ऐसे लोग पहले महसूस करते हैं, फिर सोचते हैं, तब कदम उठाते हैं।",
          },
        ],
      },
      {
        h: { en: "Heart line aur shaadi — how readers judge timing", hi: "हृदय रेखा और शादी — समय कैसे देखा जाता है" },
        p: [
          {
            en: "Timing is read from the marriage lines on the outer edge under the little finger, not from the heart line alone. The heart line tells the style; the marriage line tells the chapter. Read together, they explain why two people marry at the same age but live very differently.",
            hi: "समय कनिष्ठा के नीचे बाहरी किनारे की विवाह रेखाओं से देखा जाता है, सिर्फ़ हृदय रेखा से नहीं। हृदय रेखा तरीक़ा बताती है; विवाह रेखा अध्याय बताती है। दोनों साथ पढ़ें तो समझ आता है कि एक ही उम्र में शादी करने वाले दो लोग इतना अलग क्यों जीते हैं।",
          },
          {
            en: "One practical use: if the heart line is strong but the marriage lines look light, the person is usually ready for love earlier than the actual event. That gap is normal and not a sign of anything bad.",
            hi: "एक काम की बात: अगर हृदय रेखा मज़बूत है पर विवाह रेखाएँ हल्की दिखती हैं, तो अक्सर इंसान प्यार के लिए तैयार जल्दी हो जाता है, घटना बाद में होती है। यह अंतर स्वाभाविक है, कोई बुरा संकेत नहीं।",
          },
        ],
      },
      {
        h: { en: "Heart line ke chinh — signs that change the reading", hi: "हृदय रेखा के चिह्न — जो मतलब बदल देते हैं" },
        p: [
          {
            en: "A cross on the heart line is read as a lesson in love; a star as an unusually strong emotional bond; a small square as protection — meaning a difficult phase that gets contained. A fork at the very end (two tips) is common and shows a person who can love deeply while staying independent.",
            hi: "हृदय रेखा पर क्रॉस प्रेम का सबक बताता है; तारा असामान्य रूप से गहरा भावनात्मक जुड़ाव; छोटा चौकोर सुरक्षा — यानी मुश्किल दौर जो सीमित रह जाता है। रेखा के अंत में दो शाखाएँ (फ़ोर्क) आम है और उस इंसान को दिखाती हैं जो गहरा प्यार करते हुए भी अपनी स्वतंत्रता बनाए रखता है।",
          },
          {
            en: "Remember that a sign only modifies the line it sits on. A cross on a deep, clear heart line means something very different from a cross on a chained one.",
            hi: "याद रखें, कोई भी चिह्न सिर्फ़ उसी रेखा का मतलब बदलता है जिस पर वह बैठा है। गहरी और साफ़ हृदय रेखा पर क्रॉस का मतलब कुछ और होता है, जंज़ीर जैसी रेखा पर क्रॉस का कुछ और।",
          },
        ],
      },
      {
        h: { en: "Reading both hands (what most guides skip)", hi: "दोनों हाथ पढ़ें — यही असली तरीक़ा है" },
        p: [
          {
            en: "Compare the heart line on your passive hand with the one on your active hand. A line that is more balanced on the active hand shows emotional growth you have actually earned; a line that looks rougher there often means current stress, not destiny.",
            hi: "निष्क्रिय हाथ की हृदय रेखा को सक्रिय हाथ की रेखा से मिलाएँ। अगर सक्रिय हाथ पर रेखा ज़्यादा संतुलित है, तो यह आपने अपने प्रयास से पाया है; अगर वहीं रेखा ज़्यादा उलझी दिखे तो यह अक्सर वर्तमान तनाव है, भाग्य नहीं।",
          },
          {
            en: "This comparison is the fastest way to separate 'who I am' from 'what I am going through' — and it is exactly what a full AI palm reading does when it studies both hands from your photo.",
            hi: "यह तुलना सबसे तेज़ तरीक़ा है 'मैं कौन हूँ' और 'मैं किस दौर से गुज़र रहा हूँ' को अलग करने का — और पूरी AI palm reading भी आपकी फ़ोटो से दोनों हाथ पढ़ते हुए यही करती है।",
          },
        ],
      },
    ],
    faqs: [
      {
        q: { en: "हृदय रेखा छोटी हो तो क्या होगा?", hi: "हृदय रेखा छोटी हो तो क्या होगा?" },
        a: {
          en: "A short heart line ending under the middle or index finger means practical love: affection shown by doing things rather than saying them. Short and deep means intense but private feelings. Nothing bad happens — it only changes the style of expressing love.",
          hi: "छोटी हृदय रेखा जो मध्यमा या तर्जनी के नीचे ख़त्म हो, व्यावहारिक प्रेम बताती है: भावना कहने से ज़्यादा करके दिखाना। छोटी और गहरी रेखा तीव्र पर निजी भावना का संकेत है। इसमें कोई बुरी बात नहीं, बस प्यार जताने का अंदाज़ अलग होता है।",
        },
      },
      {
        q: { en: "What is heart line in palmistry actually about?", hi: "Heart line in palmistry असल में किस बारे में बताती है?" },
        a: {
          en: "Your emotional style: how quickly you attach, how you show affection, how you handle conflict and what you need to feel secure. It is about patterns of feeling, not about whether you will marry or when.",
          hi: "यह आपकी भावनाओं का तरीक़ा बताती है: कितनी जल्दी जुड़ते हैं, स्नेह कैसे दिखाते हैं, टकराव कैसे सँभालते हैं और सुरक्षित महसूस करने के लिए क्या चाहिए। यह भावना के पैटर्न बताती है, यह नहीं कि शादी होगी या कब।",
        },
      },
      {
        q: { en: "Is a broken heart line a bad sign?", hi: "टूटी हृदय रेखा बुरा संकेत है क्या?" },
        a: {
          en: "No. A break is read as a chapter of change and rebuilding in relationships, not bad luck. If the line continues cleanly after the break, the phase settles well. Several small breaks usually mean the person has grown wiser through experience.",
          hi: "नहीं। टूटन को रिश्तों में बदलाव और नई शुरुआत का अध्याय माना जाता है, बुरा भाग्य नहीं। कट के बाद रेखा साफ़ चले तो दौर अच्छी तरह बैठ जाता है। कई छोटी टूटनें आमतौर पर बताती हैं कि व्यक्ति अपने अनुभवों से समझदार बना है।",
        },
      },
      {
        q: { en: "Can the heart line tell when I will find love?", hi: "क्या हृदय रेखा बताती है प्यार कब मिलेगा?" },
        a: {
          en: "The heart line shows the style of love, not the calendar. For timing, readers look at the marriage lines on the outer edge under the little finger, and at the period of dasha in the kundli. Both are indications and can shift with your choices.",
          hi: "हृदय रेखा प्यार का तरीक़ा बताती है, तारीख़ नहीं। समय के लिए पाठक कनिष्ठा के नीचे बाहरी किनारे की विवाह रेखाएँ और कुंडली की दशा देखते हैं। दोनों संकेत हैं और आपके फ़ैसलों से बदल सकते हैं।",
        },
      },
      {
        q: { en: "Which hand should I use for the heart line?", hi: "हृदय रेखा किस हाथ पर पढ़ें?" },
        a: {
          en: "Read the active hand (the writing hand) for how you actually behave now, and the passive hand for what you inherited from family and early life. The difference between the two tells the story of your emotional growth.",
          hi: "सक्रिय हाथ (जिससे लिखते हैं) पर पढ़ें कि आप अब असल में कैसा व्यवहार करते हैं, और निष्क्रिय हाथ पर कि परिवार और शुरुआती जीवन से क्या मिला। दोनों का अंतर आपकी भावनात्मक यात्रा की कहानी कहता है।",
        },
      },
    ],
    related: [PILLAR_LINK, "marriage-line", "life-line", "fate-line"],
    keywords: ["heart line", "what is heart line in palmistry", "hriday rekha", "हृदय रेखा छोटी हो तो क्या होगा", "short heart line meaning", "broken heart line palmistry"],
  },
  {
    slug: "fate-line",
    kind: "line",
    focus: { en: "Fate line palmistry", hi: "भाग्य रेखा (Fate Line)" },
    title: {
      en: "Fate Line Palmistry — Bhagya Rekha Guide | Hastrekha AI",
      hi: "भाग्य रेखा (Fate Line) — Kismat Ki Rekha | Hastrekha AI",
    },
    description: {
      en: "Palm reading fate line meaning: bhagya rekha kahan hoti hai, types of fate line aur bhagya khulne ke sanket kya hain — simple Hindi me. Free AI reading.",
      hi: "Fate line palm reading meaning: भाग्य रेखा कहाँ होती है, types of fate line और भाग्य खुलने के संकेत क्या हैं — आसान हिंदी में। फ्री AI reading भी पाएँ।",
    },
    h1: {
      en: "Bhagya Rekha (Fate Line) — Kismat Aur Career Ki Rekha",
      hi: "भाग्य रेखा (Fate Line) — किस्मत, करियर और दिशा की रेखा",
    },
    crumb: { en: "Fate Line (Bhagya Rekha)", hi: "भाग्य रेखा (Fate Line)" },
    intro: [
      {
        en: "Palm reading fate line meaning is simpler than it sounds: the fate line (bhagya rekha) is the vertical line rising from near the wrist towards the middle finger, and it describes your sense of direction — how much of your life you build by choice, and where duty pulls you.",
        hi: "Fate line का मतलब सोचने से आसान है: भाग्य रेखा वह खड़ी रेखा है जो कलाई के पास से उठकर मध्यमा की ओर जाती है। यह आपकी दिशा-बोध बताती है — आप अपना जीवन कितना अपने चुनाव से बनाते हैं, और कर्तव्य आपको कहाँ खींचता है।",
      },
      {
        en: "It is not a lottery line. Hands with a faint fate line are extremely common and are read as people who carve their own track rather than following an inherited one. A deep line usually belongs to someone with a strong sense of purpose early in life.",
        hi: "यह लॉटरी की रेखा नहीं है। हल्की भाग्य रेखा बहुत आम है और ऐसे लोगों को दिखाती है जो विरासत में मिला रास्ता नहीं, अपना रास्ता बनाते हैं। गहरी रेखा आमतौर पर उस इंसान की होती है जिसे शुरुआत से ही अपने मक़सद की साफ़ समझ रहती है।",
      },
      {
        en: "Read on for the position, types of fate line, what a broken or branched line says, and the honest reading of the popular question — भाग्य खुलने के संकेत क्या हैं?",
        hi: "आगे पढ़ें: रेखा कहाँ होती है, types of fate line, टूटी या शाखाओं वाली रेखा का अर्थ, और इस लोकप्रिय सवाल का ईमानदार जवाब — भाग्य खुलने के संकेत क्या हैं?",
      },
    ],
    diagram: {
      line: "fate",
      alt: "bhagya rekha palm reading diagram — fate line from wrist to middle finger",
      caption: {
        en: "The fate line rises from the wrist area and travels up the centre of the palm, usually ending under the middle finger (Saturn).",
        hi: "भाग्य रेखा कलाई के पास से उठकर हथेली के बीच से ऊपर जाती है और आमतौर पर मध्यमा (शनि) के नीचे ख़त्म होती है।",
      },
    },
    sections: [
      {
        h: { en: "हस्तरेखा में भाग्य रेखा कौन सी होती है?", hi: "हस्तरेखा में भाग्य रेखा कौन सी होती है?" },
        p: [
          {
            en: "It is the faint-to-deep vertical line in the middle of your palm, different from the life line (which curves around the thumb) and the head line (which crosses sideways). Many hands show it starting from the life line instead of the wrist — classical texts read that as a career shaped by family circumstances in the early years.",
            hi: "यह हथेली के बीच में खड़ी चलने वाली रेखा है — हल्की से गहरी तक। इसे जीवन रेखा (जो अंगूठे के चारों ओर घूमती है) और मस्तिष्क रेखा (जो आड़ी चलती है) से अलग पहचानें। कई हाथों में यह कलाई के बजाय जीवन रेखा से निकलती दिखती है — शास्त्र इसे शुरुआती वर्षों में परिवार की परिस्थितियों से बने करियर का संकेत मानते हैं।",
          },
          {
            en: "If you cannot see any line in the centre, do not worry: that pattern is read as self-made progress, where direction gets decided by experience rather than a plan.",
            hi: "अगर बीच में कोई रेखा न दिखे तो चिंता न करें: इस बनावट को स्वयं बनी प्रगति माना जाता है, जहाँ दिशा योजना से नहीं, अनुभव से तय होती है।",
          },
        ],
      },
      {
        h: { en: "Types of fate line in palmistry", hi: "Types of fate line — कितनी तरह की होती है" },
        p: [
          {
            en: "Read the fate line from the bottom up: where it starts explains the foundation, where it ends explains the direction, and every break in between is a turning point rather than a failure.",
            hi: "भाग्य रेखा को नीचे से ऊपर पढ़ें: शुरुआत बताती है नींव कैसी है, अंत बताता है दिशा क्या है, और बीच की हर टूटन एक मोड़ है — असफलता नहीं।",
          },
        ],
        list: [
          { title: { en: "Wrist to middle finger", hi: "कलाई से मध्यमा तक" }, text: { en: "A clear, planned path with strong self-belief from an early age.", hi: "साफ़ और नियोजित रास्ता, शुरुआत से ही अपने पर भरोसा।" } },
          { title: { en: "Starting from the life line", hi: "जीवन रेखा से शुरू" }, text: { en: "Career shaped by family expectations; direction becomes personal later.", hi: "करियर परिवार की अपेक्षाओं से बना; दिशा बाद में अपनी बनती है।" } },
          { title: { en: "Faint or fragmented", hi: "हल्की या टुकड़ों में" }, text: { en: "Self-made route — several small attempts add up to a career.", hi: "स्वयं बना रास्ता — कई छोटे प्रयास जुड़कर करियर बनाते हैं।" } },
          { title: { en: "Double fate line", hi: "दोहरी भाग्य रेखा" }, text: { en: "Two directions running together: a job plus a side business is common.", hi: "दो दिशाएँ साथ चलती हैं: नौकरी के साथ साइड बिज़नेस आम है।" } },
          { title: { en: "Ending at the heart line", hi: "हृदय रेखा पर ख़त्म" }, text: { en: "Emotional decisions shape the career path more than logic does.", hi: "करियर की दिशा में भावनात्मक फ़ैसले, तर्क से ज़्यादा असर डालते हैं।" } },
          { title: { en: "Ending at the head line", hi: "मस्तिष्क रेखा पर ख़त्म" }, text: { en: "Study, skill and planning take over the direction mid-life.", hi: "बीच उम्र में पढ़ाई, कौशल और योजना दिशा सँभाल लेती है।" } },
        ],
      },
      {
        h: { en: "Tooti bhagya rekha — ध्यान से पढ़ें", hi: "टूटी भाग्य रेखा — ध्यान से पढ़ें" },
        p: [
          {
            en: "A break in the fate line is read as a change of track: a job switch, a new city, a business idea that replaces an old one. When the new segment leans slightly forward, the change is taken by choice; when it shifts towards the moon side, it usually arrives through people or travel.",
            hi: "भाग्य रेखा में टूटन रास्ता बदलने का संकेत है: नौकरी बदलना, नया शहर, पुराने काम की जगह नया काम। अगर नया हिस्सा थोड़ा आगे की ओर झुका हो तो बदलाव अपनी मर्ज़ी से होता है; चंद्र की ओर खिसका हो तो अक्सर लोगों या यात्रा के ज़रिए आता है।",
          },
          {
            en: "Two overlapping segments mean a transition handled well — the person prepares before jumping. A gap with nothing continuing for a while suggests a pause worth using for skill building.",
            hi: "दो ओवरलैप करते हिस्से अच्छी तरह सँभाले गए बदलाव को दिखाते हैं — व्यक्ति कूदने से पहले तैयारी करता है। अगर कुछ समय तक आगे कोई रेखा ही न चले, तो यह ठहराव कौशल बढ़ाने के लिए इस्तेमाल करने लायक़ है।",
          },
        ],
      },
      {
        h: { en: "भाग्य खुलने के संकेत क्या हैं? (और क्या नहीं)", hi: "भाग्य खुलने के संकेत क्या हैं? (और क्या नहीं)" },
        p: [
          {
            en: "In classical reading, 'bhagya khulna' is not a sudden miracle. It is shown as the fate line deepening, gaining a parallel support line, or finally crossing the head line — which readers describe as a period when effort starts converting into recognition.",
            hi: "शास्त्रों में 'भाग्य खुलना' कोई अचानक चमत्कार नहीं है। यह इस तरह दिखता है: भाग्य रेखा गहरी होना, साथ में समांतर सहायक रेखा आना, या मस्तिष्क रेखा को पार कर जाना — पाठक इसे ऐसा दौर मानते हैं जब मेहनत पहचान में बदलने लगती है।",
          },
          {
            en: "What it is not: a guarantee of money, a promise of promotion, or a fixed date. Anyone who sells certainties from a single line is overselling. The useful part is the timing hint — the age markers along the fate line — plus the reminder to keep the skills ready before the phase arrives.",
            hi: "और क्या नहीं है: पैसे की गारंटी, प्रमोशन का वादा, या तय तारीख़। एक ही रेखा से पक्की बात बेचने वाला बढ़ा-चढ़ा कर कह रहा होता है। काम की बात है समय का संकेत — भाग्य रेखा पर लगे उम्र के निशान — और यह याद दिलाना कि उस दौर से पहले कौशल तैयार रहे।",
          },
        ],
      },
      {
        h: { en: "Fate line, career and business", hi: "भाग्य रेखा, नौकरी और व्यापार" },
        p: [
          {
            en: "A strong fate line with a strong sun line is the classic 'name and position' combination — people notice the work. A fate line that leans towards the mercury mount favours business, negotiation and communication-heavy work.",
            hi: "मज़बूत भाग्य रेखा के साथ मज़बूत सूर्य रेखा 'नाम और पद' वाला शास्त्रीय योग माना जाता है — काम की तारीफ़ होती है। भाग्य रेखा बुध पर्वत की ओर झुकी हो तो व्यापार, मोल-भाव और बातचीत वाला काम अनुकूल रहता है।",
          },
          {
            en: "If the fate line rises from the life line, many readers suggest the early career follows the family's direction and the switch to personal choice comes around the Saturn return. Nothing here forces a decision — it only tells you when the ground is easier to move.",
            hi: "अगर भाग्य रेखा जीवन रेखा से निकलती हो, तो कई पाठक मानते हैं कि शुरुआती करियर परिवार की दिशा में चलता है और अपनी पसंद वाला मोड़ बीस के उत्तरार्ध में आता है। यह कुछ भी तय नहीं करता — बस बताता है कि ज़मीन कब ज़्यादा आसान रहती है।",
          },
        ],
      },
      {
        h: { en: "How to see your own fate line clearly", hi: "अपनी भाग्य रेखा साफ़ कैसे देखें" },
        p: [
          {
            en: "Photograph the palm straight-on in daylight, then zoom into the middle band between the head line and the wrist. Because the fate line is lighter than the big three, most beginners miss it — shade the photo for a second and the line usually appears.",
            hi: "दिन की रोशनी में हथेली की सीधी फ़ोटो लें, फिर मस्तिष्क रेखा और कलाई के बीच के बीच वाले हिस्से को ज़ूम करें। भाग्य रेखा तीन बड़ी रेखाओं से हल्की होती है, इसलिए नए पाठक इसे चूक जाते हैं — फ़ोटो पर एक सेकंड के लिए शेड करें, रेखा अक्सर दिख जाती है।",
          },
          {
            en: "Compare both palms afterwards. A fate line that is clearer on the active hand is often read as direction that got stronger with your own effort — a good sign to keep going.",
            hi: "इसके बाद दोनों हथेलियों की तुलना करें। सक्रिय हाथ पर ज़्यादा साफ़ भाग्य रेखा को अक्सर 'अपने प्रयास से मज़बूत हुई दिशा' माना जाता है — आगे बढ़ते रहने का अच्छा संकेत।",
          },
        ],
      },
    ],
    faqs: [
      {
        q: { en: "हस्तरेखा में भाग्य रेखा कौन सी होती है?", hi: "हस्तरेखा में भाग्य रेखा कौन सी होती है?" },
        a: {
          en: "The vertical line in the centre of your palm, rising from near the wrist towards the middle finger. It is lighter than the life, head and heart lines, which is why beginners often miss it. If you cannot see one clearly, read the sun line and the Saturn mount instead.",
          hi: "हथेली के बीच में खड़ी चलने वाली रेखा, जो कलाई के पास से उठकर मध्यमा की ओर जाती है। यह जीवन, मस्तिष्क और हृदय रेखा से हल्की होती है, इसलिए नए पाठक इसे चूक जाते हैं। साफ़ न दिखे तो सूर्य रेखा और शनि पर्वत देखें।",
        },
      },
      {
        q: { en: "भाग्य खुलने के संकेत क्या हैं?", hi: "भाग्य खुलने के संकेत क्या हैं?" },
        a: {
          en: "The fate line deepening, a parallel support line appearing beside it, or the line finally crossing the head line. Readers describe these as phases when consistent effort starts turning into recognition, promotion or a business finally finding its market — not as sudden luck.",
          hi: "भाग्य रेखा का गहरा होना, उसके साथ समांतर सहायक रेखा आना, या रेखा का मस्तिष्क रेखा को पार कर जाना। पाठक इन्हें ऐसा दौर मानते हैं जब लगातार मेहनत पहचान, प्रमोशन या व्यापार के बाज़ार मिलने में बदलने लगती है — अचानक भाग्य नहीं।",
        },
      },
      {
        q: { en: "Does a broken fate line mean bad luck?", hi: "टूटी भाग्य रेखा का मतलब बुरा भाग्य है?" },
        a: {
          en: "It means a change of track — a new job, city, course or responsibility. When a fresh segment overlaps the break, the transition is usually managed well. Many successful professionals have two or three clear breaks in the fate line.",
          hi: "इसका मतलब रास्ता बदलना है — नई नौकरी, शहर, कोर्स या ज़िम्मेदारी। अगर टूटन के बाद नया हिस्सा ओवरलैप करता हो, तो बदलाव आमतौर पर अच्छी तरह सँभल जाता है। कई सफल लोगों की भाग्य रेखा में दो-तीन साफ़ टूटनें मिलती हैं।",
        },
      },
      {
        q: { en: "At what age does the fate line start?", hi: "भाग्य रेखा किस उम्र से शुरू मानी जाती है?" },
        a: {
          en: "Traditionally the wrist end is read as the early twenties and the point where it crosses the head line as roughly the mid-thirties, with Saturn's mount as later life. These are rough markers used to sequence changes, not exact dates.",
          hi: "परंपरा में कलाई वाला सिरा शुरुआती बीस के दशक को और मस्तिष्क रेखा को काटने वाला बिंदु लगभग तीस के मध्य को बताता है; शनि पर्वत के नीचे का हिस्सा बाद के जीवन को। ये बदलावों का क्रम समझने के मोटे निशान हैं, तय तारीख़ें नहीं।",
        },
      },
      {
        q: { en: "Which line shows government job or business?", hi: "सरकारी नौकरी या व्यापार कौन सी रेखा बताती है?" },
        a: {
          en: "Two lines decide it together: the fate line's direction and the Saturn or Mercury mount under it. Saturn leaning suggests structure, rules and government or institutional work; Mercury leaning suggests business, sales and independent work. Read both before concluding anything.",
          hi: "दो रेखाएँ मिलकर तय करती हैं: भाग्य रेखा की दिशा और उसके नीचे का शनि या बुध पर्वत। शनि की ओर झुकाव व्यवस्था, नियम और सरकारी या संस्थागत काम बताता है; बुध की ओर झुकाव व्यापार, बिक्री और स्वतंत्र काम। कोई नतीजा निकालने से पहले दोनों पढ़ें।",
        },
      },
    ],
    related: [PILLAR_LINK, "money-line", "career-line", "sun-line"],
    keywords: ["palm reading fate line meaning", "fate line", "bhagya rekha", "types of fate line in palmistry", "हस्तरेखा में भाग्य रेखा", "भाग्य खुलने के संकेत"],
  },
  {
    slug: "career-line",
    kind: "line",
    focus: { en: "Career line in palmistry", hi: "करियर रेखा (Career Line)" },
    title: {
      en: "Career Line Palmistry — Success Line in Hand | Hastrekha AI",
      hi: "करियर रेखा (Career Line) — Naukri Ya Vyapar | Hastrekha AI",
    },
    description: {
      en: "Career line in palmistry aur success line in hand: vyapar wali line kaun si hai, sarkari naukri ki rekha kahan hoti hai — simple Hindi me, free AI reading.",
      hi: "Career line in palmistry और success line: हाथ में व्यापार वाली लाइन कौन सी है, सरकारी नौकरी की रेखा कहाँ होती है — आसान हिंदी में, फ्री AI reading के साथ।",
    },
    h1: {
      en: "Career Line (Karm Rekha) — Job, Business Or Government Service",
      hi: "करियर रेखा (Career Line) — नौकरी, व्यापार या सरकारी सेवा",
    },
    crumb: { en: "Career Line", hi: "करियर रेखा (Career Line)" },
    intro: [
      {
        en: "Career line in palmistry is not one single line but a combination: the fate line that carries your direction, the sun line that shows recognition, and the branches that lean towards Saturn (structure, rules, service) or Mercury (business, trade, communication).",
        hi: "Career line in palmistry कोई एक अकेली रेखा नहीं है — यह तीन चीज़ों का मेल है: भाग्य रेखा जो दिशा बताती है, सूर्य रेखा जो पहचान दिखाती है, और वे शाखाएँ जो शनि (व्यवस्था, नियम, सेवा) या बुध (व्यापार, बातचीत, कारोबार) की ओर झुकती हैं।",
      },
      {
        en: "That is why honest readers never say 'your hand says government job'. They look at where the fate line ends, how strong the Saturn and Jupiter mounts are, and whether a business line rises from the head line towards Mercury.",
        hi: "इसीलिए ईमानदार पाठक कभी यह नहीं कहते कि 'आपके हाथ में सरकारी नौकरी लिखी है'। वे देखते हैं कि भाग्य रेखा कहाँ ख़त्म होती है, शनि और गुरु पर्वत कितने भरे हैं, और मस्तिष्क रेखा से बुध की ओर कोई व्यापार रेखा उठती है या नहीं।",
      },
      {
        en: "This guide answers the three questions readers ask us most: हाथ में व्यापार वाली लाइन कौन सी होती है, सरकारी नौकरी की रेखा कहाँ होती है, and what a broken or double career line really means.",
        hi: "इस गाइड में वे तीन सवाल हैं जो पाठक हमसे सबसे ज़्यादा पूछते हैं: हाथ में व्यापार वाली लाइन कौन सी होती है, सरकारी नौकरी की रेखा कहाँ होती है, और टूटी या दोहरी करियर रेखा का असल मतलब क्या है।",
      },
    ],
    diagram: {
      line: "sun",
      alt: "career line in palmistry diagram — success line and fate line placement on hatheli",
      caption: {
        en: "The diagram marks the sun line — the classical 'success line'. A career reading uses it together with the fate line, the Saturn mount and the branches leaning to Mercury.",
        hi: "चित्र में सूर्य रेखा दिखाई गई है — शास्त्र की 'success line'। करियर की रीडिंग इसे भाग्य रेखा, शनि पर्वत और बुध की ओर जाती शाखाओं के साथ पढ़ती है।",
      },
    },
    sections: [
      {
        h: { en: "Where is the career line on the hand?", hi: "करियर रेखा हाथ में कहाँ होती है?" },
        p: [
          {
            en: "There is no separate 'career line' in classical drawings. Readers use the sun (Apollo) line, which rises from the lower palm towards the ring finger, and the fate line in the centre. When the sun line is clear and unbroken, work tends to get noticed; when it is faint, recognition usually arrives late but often lasts longer.",
            hi: "शास्त्रीय चित्रों में 'करियर रेखा' नाम की अलग रेखा नहीं होती। पाठक सूर्य (अपोलो) रेखा देखते हैं, जो हथेली के निचले हिस्से से उठकर अनामिका की ओर जाती है, और बीच की भाग्य रेखा। सूर्य रेखा साफ़ और बिना टूटन वाली हो तो काम की तारीफ़ जल्दी होती है; हल्की हो तो पहचान देर से आती है, पर अक्सर टिकाऊ होती है।",
          },
          {
            en: "Also check the mount of Saturn under the middle finger — a firm, well-padded mount is read as a temperament suited to structure: government service, banking, teaching, defence, administration. A padded Mercury mount under the little finger points the other way: trade, sales, agencies, communication.",
            hi: "मध्यमा के नीचे शनि पर्वत भी देखें — भरा और स्थिर पर्वत ऐसा स्वभाव बताता है जिसे व्यवस्था सूट करती है: सरकारी सेवा, बैंक, शिक्षण, रक्षा, प्रशासन। कनिष्ठा के नीचे भरा बुध पर्वत इससे उलट दिशा दिखाता है: व्यापार, बिक्री, एजेंसी, संवाद।",
          },
        ],
      },
      {
        h: { en: "हाथ में व्यापार वाली लाइन कौन सी होती है?", hi: "हाथ में व्यापार वाली लाइन कौन सी होती है?" },
        p: [
          {
            en: "The business combination is a fate line that slants towards Mercury, a clear line from the head line to the mount of Mercury, and a strong Mercury mount. Often there is also a branch of the fate line that splits towards the little finger — traditionally read as income from trade, brokerage or independent work.",
            hi: "व्यापार का योग बनता है जब भाग्य रेखा बुध की ओर झुकी हो, मस्तिष्क रेखा से बुध पर्वत तक एक साफ़ रेखा जाती हो, और बुध पर्वत भरा हो। अक्सर भाग्य रेखा से एक शाखा कनिष्ठा की ओर भी फूटती है — परंपरा में इसे व्यापार, दलाली या स्वतंत्र काम से होने वाली आय माना जाता है।",
          },
          {
            en: "One caution: a strong Mercury mount also belongs to good communicators and salespeople in jobs. Trade versus job is decided by both the line and how the person actually behaves — palmistry shows inclination, not a fixed appointment letter.",
            hi: "एक सावधानी: भरा बुध पर्वत नौकरी में अच्छे संवादकर्ताओं और सेल्स वालों का भी होता है। व्यापार और नौकरी का फ़र्क़ रेखा के साथ इंसान के असली व्यवहार से तय होता है — हस्तरेखा झुकाव बताती है, पक्का नियुक्ति-पत्र नहीं।",
          },
        ],
      },
      {
        h: { en: "हस्तरेखा में सरकारी नौकरी की कौन सी रेखा होती है?", hi: "हस्तरेखा में सरकारी नौकरी की कौन सी रेखा होती है?" },
        p: [
          {
            en: "Readers look for three signs together: a fate line that ends under the middle finger (Saturn), a firm Saturn mount, and a well-formed Jupiter mount under the index finger — the classical marker of ambition plus discipline. A square or triangle on the fate line is also traditionally linked with secure, rules-based careers.",
            hi: "पाठक तीन संकेत साथ देखते हैं: भाग्य रेखा जो मध्यमा (शनि) के नीचे ख़त्म हो, भरा हुआ शनि पर्वत, और तर्जनी के नीचे सुडौल गुरु पर्वत — महत्वाकांक्षा और अनुशासन का शास्त्रीय योग। भाग्य रेखा पर बना चौकोर या त्रिभुज भी परंपरा में सुरक्षित, नियम-आधारित करियर से जोड़ा जाता है।",
          },
          {
            en: "Just as important: a fate line that begins at the life line often means the first job arrives through family circumstances or guidance, and the switch to a career of your own choosing usually comes a few years later.",
            hi: "इतना ही ज़रूरी: जीवन रेखा से निकलने वाली भाग्य रेखा अक्सर यह बताती है कि पहली नौकरी परिवार की परिस्थिति या सलाह से मिलती है, और अपनी पसंद का करियर कुछ साल बाद शुरू होता है।",
          },
        ],
      },
      {
        h: { en: "Types of career line — कैसी रेखा क्या कहती है", hi: "करियर रेखा के प्रकार — कैसी रेखा क्या कहती है" },
        p: [
          {
            en: "Read the sun and fate lines together, bottom to top, and treat every change as a chapter rather than a verdict.",
            hi: "सूर्य और भाग्य रेखा को नीचे से ऊपर तक साथ पढ़ें, और हर बदलाव को फ़ैसला नहीं, एक अध्याय मानें।",
          },
        ],
        list: [
          { title: { en: "Clear and deep", hi: "साफ़ और गहरी" }, text: { en: "Consistent, visible progress; recognition follows the work.", hi: "लगातार और दिखने वाली प्रगति; पहचान काम के पीछे आती है।" } },
          { title: { en: "Faint", hi: "हल्की" }, text: { en: "Quiet progress, often in support or specialised roles.", hi: "शांत प्रगति, अक्सर सहयोग या विशेषज्ञ वाली भूमिकाओं में।" } },
          { title: { en: "Broken, overlapping", hi: "टूटी और ओवरलैप" }, text: { en: "A change of company, city or field — usually prepared before jumping.", hi: "कंपनी, शहर या क्षेत्र बदलना — कूदने से पहले अक्सर तैयारी होती है।" } },
          { title: { en: "Double line", hi: "दोहरी रेखा" }, text: { en: "Two income tracks side by side: job plus side work is common.", hi: "दो कमाई के रास्ते साथ: नौकरी के साथ साइड वर्क आम है।" } },
          { title: { en: "Leaning to Mercury", hi: "बुध की ओर झुकी" }, text: { en: "Trade, sales, negotiation, independent business.", hi: "व्यापार, बिक्री, मोल-भाव, स्वतंत्र कारोबार।" } },
          { title: { en: "Crossing the head line", hi: "मस्तिष्क रेखा को काटती" }, text: { en: "Skill and study take over the direction in mid-life.", hi: "बीच उम्र में कौशल और पढ़ाई दिशा सँभाल लेते हैं।" } },
        ],
      },
      {
        h: { en: "Career line and age: when change usually arrives", hi: "करियर रेखा और उम्र: बदलाव कब आता है" },
        p: [
          {
            en: "The wrist end of the fate line is read as the early twenties, the point where it meets the head line as around the mid-thirties, and the Saturn mount as the later years. A break between those markers is read as a transition inside that phase — a new company, a new city or a completely new skill.",
            hi: "भाग्य रेखा का कलाई वाला सिरा शुरुआती बीस के दशक को, मस्तिष्क रेखा से मिलने वाला बिंदु लगभग तीस के मध्य को और शनि पर्वत बाद के वर्षों को बताता है। इन निशानों के बीच आई टूटन उसी दौर के भीतर बदलाव मानी जाती है — नई कंपनी, नया शहर या बिल्कुल नया हुनर।",
          },
          {
            en: "Use these as rough markers, not appointments. Their real value is planning: if a change looks likely around a phase, keep savings and skills ready so the transition is a choice rather than a shock.",
            hi: "इन्हें तय तारीख़ नहीं, मोटे निशान मानें। असली फ़ायदा योजना बनाने में है: अगर किसी दौर में बदलाव की संभावना दिखे, तो बचत और हुनर तैयार रखें, ताकि वह बदलाव मजबूरी न लगे।",
          },
        ],
      },
      {
        h: { en: "Which lines should be read with the career line?", hi: "करियर रेखा के साथ और कौन सी रेखाएँ पढ़ें?" },
        p: [
          {
            en: "Three at minimum: the head line, because it shows whether the person plans or improvises; the sun line, for visibility and reputation; and the mercury mount, for negotiation strength. A strong career line with a weak head line often means good opportunities handled too quickly.",
            hi: "कम से कम तीन: मस्तिष्क रेखा, क्योंकि वह बताती है कि इंसान योजना बनाता है या तुरंत निर्णय लेता है; सूर्य रेखा, जो पहचान और प्रतिष्ठा दिखाती है; और बुध पर्वत, जो मोल-भाव की ताक़त बताता है। मज़बूत करियर रेखा के साथ कमज़ोर मस्तिष्क रेखा अक्सर यह कहती है कि अच्छे मौक़े जल्दबाज़ी में हाथ से निकल जाते हैं।",
          },
          {
            en: "If all of this is read for you at once — from a palm photo — the report also orders the twelve life areas, so career is compared against health, money and relationships instead of being seen alone.",
            hi: "अगर यह सब एक साथ पढ़ा जाए — हथेली की फ़ोटो से — तो रिपोर्ट बारहों जीवन-क्षेत्रों का क्रम भी बताती है, जिससे करियर को सेहत, धन और रिश्तों के मुक़ाबले देखा जाता है, अकेले नहीं।",
          },
        ],
      },
    ],
    faqs: [
      {
        q: { en: "Which line in the hand shows business?", hi: "हाथ में व्यापार वाली लाइन कौन सी होती है?" },
        a: {
          en: "A fate line leaning towards the little finger, a clear line from the head line up to the Mercury mount, and a well-padded Mercury mount. Read together they show a temperament suited to trade, sales or independent work rather than fixed-salary roles.",
          hi: "कनिष्ठा की ओर झुकी भाग्य रेखा, मस्तिष्क रेखा से बुध पर्वत तक जाती साफ़ रेखा, और भरा हुआ बुध पर्वत। तीनों साथ पढ़ने पर व्यापार, बिक्री या स्वतंत्र काम का अनुकूल स्वभाव दिखता है, तय वेतन वाली नौकरी का नहीं।",
        },
      },
      {
        q: { en: "Which palm line indicates a government job?", hi: "हस्तरेखा में सरकारी नौकरी की कौन सी रेखा होती है?" },
        a: {
          en: "A fate line ending under the middle finger, a firm Saturn mount and a balanced Jupiter mount. A square or triangle on the fate line is also traditionally linked with stable, rules-based service. It shows suitability, not a guaranteed posting.",
          hi: "मध्यमा के नीचे ख़त्म होती भाग्य रेखा, भरा शनि पर्वत और संतुलित गुरु पर्वत। भाग्य रेखा पर चौकोर या त्रिभुज भी स्थिर, नियम-आधारित सेवा से जुड़ा माना जाता है। यह अनुकूलता बताता है, नौकरी की गारंटी नहीं।",
        },
      },
      {
        q: { en: "What is a success line in hand palmistry?", hi: "Success line in hand palmistry क्या होती है?" },
        a: {
          en: "The sun line rising towards the ring finger is called the success line. A clear one is read as work that gets noticed — awards, promotions, public appreciation. A faint or missing one simply means recognition comes through the quality of the work, not through publicity.",
          hi: "अनामिका की ओर उठती सूर्य रेखा को success line कहते हैं। साफ़ रेखा का मतलब है काम की तारीफ़ और पहचान — सम्मान, प्रमोशन, सराहना। हल्की या न दिखने वाली रेखा का मतलब बस यह है कि पहचान काम की गुणवत्ता से आती है, दिखावे से नहीं।",
        },
      },
      {
        q: { en: "Is a broken career line a warning?", hi: "टूटी करियर रेखा कोई चेतावनी है?" },
        a: {
          en: "No. A break is a change of track — a new employer, field or city. If a fresh line overlaps the gap, the move was usually planned and lands well. Most working professionals show two or three such breaks across a career.",
          hi: "नहीं। टूटन का मतलब रास्ता बदलना है — नया नियोक्ता, क्षेत्र या शहर। अगर टूटन के बाद नई रेखा ओवरलैप करे, तो बदलाव आमतौर पर योजना के साथ होता है और अच्छा बैठता है। ज़्यादातर कामकाजी लोगों की करियर रेखा में दो-तीन ऐसी टूटनें मिलती हैं।",
        },
      },
      {
        q: { en: "Can the career line tell me the exact year of a job change?", hi: "क्या करियर रेखा नौकरी बदलने का साल बता सकती है?" },
        a: {
          en: "No, and anyone promising an exact year from a single line is overselling. The line shows the order and rough phase of changes. For timing, readers combine it with the dasha running in your kundli — still an indication, not a fixed date.",
          hi: "नहीं, और जो कोई एक रेखा से पक्का साल बताए वह बढ़ा-चढ़ा कर कह रहा होता है। रेखा बदलावों का क्रम और मोटा दौर बताती है। समय के लिए पाठक इसे कुंडली की चल रही दशा से जोड़ते हैं — वह भी संकेत है, तय तारीख़ नहीं।",
        },
      },
    ],
    related: [PILLAR_LINK, "fate-line", "money-line", "sun-line"],
    keywords: ["career line in palmistry", "success line in hand palmistry", "हाथ में व्यापार वाली लाइन", "हस्तरेखा में सरकारी नौकरी की रेखा", "career line palm reading", "karm rekha"],
  },
];
