import type { PalmPage } from "./types";

const PILLAR_LINK = "hast-rekha-palmistry";

/**
 * Practical guides, first batch: which hand to read, the signs on the palm,
 * and a beginner's course for learning palmistry.
 *
 * These pages do not focus on one line — they explain the method around the
 * lines, and link back to the pillar plus the line guides for depth.
 */
export const GUIDE_PAGES: PalmPage[] = [
  {
    slug: "which-hand-to-read",
    kind: "guide",
    focus: { en: "Which hand to read in palmistry", hi: "कौन सा हाथ पढ़ें (Which Hand To Read)" },
    title: {
      en: "Which Hand To Read? Active And Passive | Hastrekha AI",
      hi: "कौन सा हाथ पढ़ें (Which Hand To Read) | Hastrekha AI",
    },
    description: {
      en: "Which hand to read in palmistry: left ya right hand ka matlab, left-handed ka rule, dono haathon ki tulna aur photo kis hath ki leni hai — easy guide.",
      hi: "कौन सा हाथ पढ़ें: हस्तरेखा में left hand पढ़ें या right, left-handed लोगों का नियम, दोनों हाथों की तुलना और फ़ोटो किस हाथ की लें — आसान गाइड।",
    },
    h1: {
      en: "Which Hand To Read — Left, Right, Or Both Together",
      hi: "कौन सा हाथ पढ़ें? Left, Right और दोनों की तुलना",
    },
    crumb: { en: "Which Hand To Read", hi: "कौन सा हाथ पढ़ें" },
    intro: [
      {
        en: "Which hand to read in palmistry is the first question every beginner asks — and the useful answer is that you read both, with different jobs. The active hand (the one you write with) is read for what is happening now and where your choices are taking you. The passive hand is read for the pattern you were born into.",
        hi: "\"कौन सा हाथ पढ़ें\" — यह पहला सवाल हर नए पाठक का होता है, और काम का जवाब यह है: दोनों हाथ पढ़ें, पर अलग-अलग काम के लिए। सक्रिय हाथ (जिससे आप लिखते हैं) से पढ़ा जाता है कि अभी क्या हो रहा है और आपके फ़ैसले कहाँ ले जा रहे हैं। निष्क्रिय हाथ से वह पैटर्न पढ़ा जाता है जो जन्म से मिला।",
      },
      {
        en: "The left-right rule is often repeated wrongly as 'males this way, females that way'. Classical Indian texts did use fixed sides, but modern readers replaced that with one clean logic: active hand equals present and personal effort, passive hand equals inheritance and early conditioning. That single rule covers every reader correctly, whatever their dominant hand is.",
        hi: "लेफ्ट-राइट का नियम अक्सर ग़लत तरीक़े से दोहराया जाता है — \"पुरुषों का एक हाथ, महिलाओं का दूसरा\"। शास्त्र में तय पक्ष थे, पर आधुनिक पाठकों ने उनकी जगह एक साफ़ तर्क रख दिया: सक्रिय हाथ यानी वर्तमान और व्यक्तिगत प्रयास, निष्क्रिय हाथ यानी विरासत और शुरुआती संस्कार। यह एक नियम हर पाठक पर लागू होता है, चाहे वह किसी भी हाथ से काम करता हो।",
      },
      {
        en: "Below: the active-passive rule in detail, how left-handed readers change the picture, how to compare the two hands line by line, the old gender convention explained honestly, common mistakes, and which hand to photograph for an AI reading.",
        hi: "आगे: सक्रिय-निष्क्रिय नियम विस्तार से, left-handed लोगों की तस्वीर कैसे बदलती है, दोनों हाथों की रेखा-दर-रेखा तुलना, पुरानी लिंग-परंपरा का ईमानदार मतलब, आम गलतियाँ, और AI reading के लिए फ़ोटो किस हाथ की लेनी है।",
      },
    ],
    sections: [
      {
        h: { en: "हस्तरेखा में कौन सा हाथ पढ़ा जाता है?", hi: "हस्तरेखा में कौन सा हाथ पढ़ा जाता है?" },
        p: [
          {
            en: "Short answer: both. The reading is a comparison, not a lookup. You look at the same feature — say the life line or the mount of Venus — on both palms, and the difference between them carries the message. Where the two hands match, the trait is settled and sturdy. Where the active hand is stronger, the person has improved that area through their own effort.",
            hi: "छोटा जवाब: दोनों। रीडिंग एक तुलना है, कोई शब्दकोश नहीं। आप वही चीज़ — जैसे जीवन रेखा या शुक्र पर्वत — दोनों हथेलियों पर देखते हैं, और दोनों के बीच का अंतर ही संदेश देता है। जहाँ दोनों हाथ मिलते हैं, वह गुण पक्का और टिकाऊ माना जाता है। जहाँ सक्रिय हाथ मज़बूत है, वहाँ व्यक्ति ने उस क्षेत्र को अपने प्रयास से सुधारा है।",
          },
          {
            en: "The reverse difference is just as useful: a line that is bright on the passive hand and faded on the active one is read as an ability that exists but has not been exercised — a talent waiting for use. This comparison is the single most valuable habit a beginner can build, and it is why honest readers ask for both palms.",
            hi: "उलटा अंतर भी उतना ही काम का है: निष्क्रिय हाथ पर चमकती और सक्रिय हाथ पर फीकी रेखा ऐसी क्षमता बताती है जो मौजूद है पर इस्तेमाल नहीं हुई — यानी इस्तेमाल का इंतज़ार करती प्रतिभा। यह तुलना ही नए पाठक की सबसे कीमती आदत है, और इसीलिए ईमानदार पाठक दोनों हथेलियाँ माँगते हैं।",
          },
        ],
      },
      {
        h: { en: "Left hand aur right hand: किसका क्या मतलब है", hi: "Left hand aur right hand: किसका क्या मतलब है" },
        p: [
          {
            en: "The rule maps cleanly once you stop asking 'left or right' and start asking 'which hand is active'. People are born with roughly the same palm; life writes on the working hand. Everything a teacher needs follows from that.",
            hi: "नियम तभी साफ़ हो जाता है जब सवाल \"left या right\" की जगह \"कौन सा हाथ सक्रिय है\" बन जाए। जन्म के समय दोनों हथेलियाँ लगभग एक जैसी होती हैं; ज़िंदगी काम करने वाले हाथ पर लिखती है। इसी से हर ज़रूरी बात निकल आती है।",
          },
        ],
        list: [
          { title: { en: "Right-handed reader", hi: "दाएँ हाथ से काम करने वाले" }, text: { en: "Left palm is passive (born pattern), right palm is active (present life and choices).", hi: "बायाँ हाथ निष्क्रिय (जन्म का पैटर्न), दायाँ हाथ सक्रिय (वर्तमान जीवन और फ़ैसले)।" } },
          { title: { en: "Left-handed reader", hi: "बाएँ हाथ से काम करने वाले" }, text: { en: "The roles flip: right palm is passive, left palm is active. Same logic, mirrored.", hi: "भूमिकाएँ बदल जाती हैं: दायाँ निष्क्रिय, बायाँ सक्रिय। तर्क वही, दिशा उलटी।" } },
          { title: { en: "Trained both hands", hi: "दोनों हाथों का अभ्यास" }, text: { en: "Readers treat the hand you use for fine work — writing, cooking, tools — as the active one.", hi: "जिस हाथ से बारीक काम होता है — लिखना, पकाना, औज़ार — उसे सक्रिय माना जाता है।" } },
          { title: { en: "Temporary switch", hi: "अस्थायी बदलाव" }, text: { en: "After injury or training a new habit, the newly used hand becomes the present-life record.", hi: "चोट या नई आदत के बाद, नया इस्तेमाल होने वाला हाथ ही वर्तमान जीवन का रिकॉर्ड बन जाता है।" } },
        ],
      },
      {
        h: { en: "दोनों हाथों की तुलना: बदलाव कैसे पढ़ें", hi: "दोनों हाथों की तुलना: बदलाव कैसे पढ़ें" },
        p: [
          {
            en: "Pick one feature at a time and compare like with like: the life line's depth, the head line's slope, the heart line's end, the fate line's start. A stronger line on the active hand is growth — the person has worked on that area. A fading line on the active hand is the pattern asking for attention, not a punishment. Identical lines on both hands mean the trait is deeply settled.",
            hi: "एक बार में एक चीज़ लें और समान की समान से तुलना करें: जीवन रेखा की गहराई, मस्तिष्क रेखा का ढलान, हृदय रेखा का अंत, भाग्य रेखा की शुरुआत। सक्रिय हाथ पर मज़बूत रेखा बढ़त है — व्यक्ति ने उस क्षेत्र पर काम किया। सक्रिय हाथ पर फीकी पड़ती रेखा ध्यान माँगता पैटर्न है, सज़ा नहीं। दोनों हाथों पर एक जैसी रेखाएँ बताती हैं कि वह गुण गहराई से जमा है।",
          },
          {
            en: "Old teachers gave one more rule: compare direction before you compare depth. A line that rises higher on the active hand is progress in that area even if it is thinner; a line that drops lower is strain, even if it looks dark. Direction is ambition or fatigue; depth is the amount of energy in the trait.",
            hi: "पुराने शिक्षक एक और नियम बताते हैं: गहराई से पहले दिशा की तुलना करो। सक्रिय हाथ पर ज़्यादा ऊपर उठती रेखा पतली होने पर भी उस क्षेत्र में प्रगति है; और नीचे गिरती रेखा गहरी दिखने पर भी थकान है। दिशा महत्वाकांक्षा या थकान बताती है; गहराई उस गुण में लगी ऊर्जा।",
          },
        ],
      },
      {
        h: { en: "पुरानी परंपरा: पुरुष और महिला के लिए अलग हाथ?", hi: "पुरानी परंपरा: पुरुष और महिला के लिए अलग हाथ?" },
        p: [
          {
            en: "You will still meet the claim that women should show the right hand and men the left, or vice versa depending on which old book is quoted. That convention comes from an era when hands were read during fixed social roles, and the books do not even agree among themselves. The active-passive rule replaced it precisely because it needs no gender.",
            hi: "आज भी यह दावा मिलेगा कि महिलाएँ दायाँ हाथ दिखाएँ और पुरुष बायाँ, या पुरानी किताब के हिसाब से उलटा। यह परंपरा उस दौर की है जब पढ़ाई तय सामाजिक भूमिकाओं के हिसाब से होती थी, और किताबें आपसमें भी सहमत नहीं हैं। सक्रिय-निष्क्रिय नियम ने इसे इसलिए बदला क्योंकि इसमें लिंग की ज़रूरत ही नहीं पड़ती।",
          },
          {
            en: "For an honest reading, the practical sequence is fixed: first the active lion's share of attention, then the passive hand for contrast, then any kundli details if the reader also does astrology. Anyone who refuses to look at both hands for a gender reason is following ritual, not reading.",
            hi: "ईमानदार रीडिंग का क्रम तय है: पहले सक्रिय हाथ पर पूरा ध्यान, फिर तुलना के लिए निष्क्रिय हाथ, और अगर पाठक ज्योतिष भी करता है तो कुंडली की बातें। जो कोई सिर्फ़ लिंग के नाम पर दोनों हाथ देखने से मना करे, वह पढ़ाई नहीं, रस्म निभा रहा है।",
          },
        ],
      },
      {
        h: { en: "आम गलतियाँ जो पहला निष्कर्ष बिगाड़ देती हैं", hi: "आम गलतियाँ जो पहला निष्कर्ष बिगाड़ देती हैं" },
        p: [
          {
            en: "Reading one hand and calling it done is the classic mistake — half the message lives in the difference. The second is comparing left with right at different times of day or under different light, where a pale line on one palm looks absent next to a clear one. Photograph both in the same light, then compare.",
            hi: "एक ही हाथ पढ़कर निपटा देना सबसे बड़ी ग़लती है — आधा संदेश तो दोनों के अंतर में ही है। दूसरी ग़लती है अलग-अलग समय या अलग रोशनी में बाएँ-दाएँ की तुलना, जहाँ एक हथेली की हल्की रेखा दूसरी की साफ़ रेखा के सामने गायब लगने लगती है। दोनों की फ़ोटो एक ही रोशनी में लें, फिर तुलना करें।",
          },
          {
            en: "The third mistake is reading the passive hand's lines as current facts. The born pattern is background, not news. A soft, wide-open passive hand with a hard-working active hand describes a person who entered life easy and built discipline — two true statements, one story.",
            hi: "तीसरी ग़लती है निष्क्रिय हाथ की रेखाओं को वर्तमान तथ्य मान लेना। जन्म का पैटर्न पृष्ठभूमि है, ताज़ा ख़बर नहीं। नरम और खुली निष्क्रिय हथेली के साथ मेहनती सक्रिय हथेली ऐसे इंसान का चित्र है जो आसान शुरुआत लेकर आया और अनुशासन खड़ा कर गया — दो सच, एक कहानी।",
          },
        ],
      },
      {
        h: { en: "AI reading के लिए फ़ोटो: किस हाथ की लेनी है?", hi: "AI reading के लिए फ़ोटो: किस हाथ की लेनी है?" },
        p: [
          {
            en: "For studio-quality readings you would normally show both palms. For a photo-based AI reading, one clear palm photo is enough to start: open the active hand fully, fingers relaxed, light coming from behind the camera, palm filling the frame. The reading engine reads the lines, mounts and signs from that image.",
            hi: "पूरी पढ़ाई के लिए आमतौर पर दोनों हथेलियाँ दिखाई जाती हैं। पर फ़ोटो-आधारित AI reading शुरू करने के लिए एक साफ़ फ़ोटो काफ़ी है: सक्रिय हाथ पूरा खोलें, उंगलियाँ ढीली रखें, रोशनी कैमरे के पीछे से आए, और हथेली फ़्रेम भर दे। रीडिंग इंजन उसी तस्वीर से रेखाएँ, पर्वत और चिह्न पढ़ लेता है।",
          },
          {
            en: "If your training is already serious, read this page beside the learn-palmistry course and the sign guide — the method of comparison you just read is the same one every deeper page assumes. Then upload a palm photo and let the AI do the two-hand arithmetic for you.",
            hi: "अगर आपकी पढ़ाई गंभीर है, तो इस पेज को learn-palmistry कोर्स और चिह्नों वाली गाइड के साथ पढ़ें — अभी जो तुलना का तरीक़ा समझा, हर आगे का पेज उसी को मानकर लिखा गया है। फिर हथेली की फ़ोटो अपलोड करें और दोनों हाथों का हिसाब AI से करवाएँ।",
          },
        ],
      },
    ],
    faqs: [
      {
        q: { en: "Which hand should I read in palmistry?", hi: "हस्तरेखा में कौन सा हाथ पढ़ना चाहिए?" },
        a: {
          en: "Read both: the active hand — the one you write with — shows your present life and choices, while the passive hand shows the born pattern. The interesting message is the difference between them. Where the two agree, the trait is settled; where the active hand is stronger, the person has grown that area by effort.",
          hi: "दोनों पढ़ें: सक्रिय हाथ — जिससे आप लिखते हैं — वर्तमान जीवन और फ़ैसले दिखाता है, और निष्क्रिय हाथ जन्म का पैटर्न। असली संदेश दोनों के अंतर में है। जहाँ दोनों मिलते हैं, वह गुण जमा हुआ है; जहाँ सक्रिय हाथ मज़बूत है, वहाँ व्यक्ति ने उस क्षेत्र को खुद बढ़ाया है।",
        },
      },
      {
        q: { en: "I am left-handed — which hand is my active hand?", hi: "मैं left-handed हूँ — मेरा सक्रिय हाथ कौन सा है?" },
        a: {
          en: "For a left-handed person the roles simply flip: the left palm is the active hand and the right palm is the passive one. The logic is identical — active hand equals present life and personal effort, passive hand equals early conditioning. The reading mirrors itself; nothing else changes.",
          hi: "बाएँ हाथ से काम करने वालों में भूमिकाएँ बस उलट जाती हैं: बायाँ हाथ सक्रिय और दायाँ निष्क्रिय। तर्क वही रहता है — सक्रिय हाथ वर्तमान जीवन और व्यक्तिगत प्रयास, निष्क्रिय हाथ शुरुआती संस्कार। पढ़ाई दर्पण की तरह उलट जाती है, बाक़ी कुछ नहीं बदलता।",
        },
      },
      {
        q: { en: "Why do palmists ask for both hands?", hi: "पाठक दोनों हाथ क्यों माँगते हैं?" },
        a: {
          en: "Because a single hand only gives half the sentence. The passive hand shows where you started; the active hand shows where you have taken it. Comparing the same line across both palms tells the reader what has changed and what is naturally settled — something one palm alone can never show, however deep its lines look.",
          hi: "क्योंकि एक हाथ से आधा वाक्य ही मिलता है। निष्क्रिय हाथ बताता है कि शुरुआत कहाँ से हुई; सक्रिय हाथ बताता है कि उसे कहाँ तक पहुँचाया। दोनों हथेलियों पर एक ही रेखा की तुलना से पता चलता है कि क्या बदला और क्या स्वाभाविक रूप से जमा है — इतना एक अकेली हथेली कभी नहीं दिखा सकती।",
        },
      },
      {
        q: { en: "Do men and women have different hand-reading rules?", hi: "क्या पुरुष और महिला के लिए अलग नियम हैं?" },
        a: {
          en: "Old texts used fixed sides by gender, but those books disagree with each other and came from a rigid social era. Modern reading uses the active-passive rule instead, which needs no gender at all. For any honest palmistry question, both palms are read and compared — no reader worth trusting refuses a hand for gender reasons.",
          hi: "पुराने ग्रंथ लिंग के हिसाब से तय पक्ष बताते थे, पर वे किताबें आपस में उलटी बातें कहती हैं और कठोर सामाजिक दौर की हैं। आज की पढ़ाई सक्रिय-निष्क्रिय नियम चलाती है, जिसमें लिंग की ज़रूरत ही नहीं। किसी भी ईमानदार सवाल में दोनों हथेलियाँ पढ़ी और मिलाई जाती हैं — लिंग के नाम पर हाथ मना करने वाले पाठक पर भरोसा न करें।",
        },
      },
      {
        q: { en: "Which hand's photo should I upload for an AI palm reading?", hi: "AI reading के लिए किस हाथ की फ़ोटो भेजें?" },
        a: {
          en: "One clear photo of your active palm is enough to start: open the hand fully, fingers relaxed, light behind the camera and the palm filling the frame. If you can, add the passive hand too — the engine reads both and compares, and the comparison is where the reading gets personal.",
          hi: "शुरू करने के लिए सक्रिय हथेली की एक साफ़ फ़ोटो काफ़ी है: हाथ पूरा खोलें, उंगलियाँ ढीली, रोशनी कैमरे के पीछे, और हथेली पूरा फ़्रेम भरे। हो सके तो निष्क्रिय हाथ भी भेजें — इंजन दोनों पढ़कर मिलाता है, और तुलना से ही रीडिंग व्यक्तिगत बनती है।",
        },
      },
    ],
    related: [PILLAR_LINK, "learn-palmistry", "palm-signs", "life-line"],
    keywords: ["which hand to read palmistry", "कौन सा हाथ पढ़ें", "left or right hand palmistry", "active and passive hand", "hath kaun sa dekhen", "left handed palmistry rule"],
  },
  {
    slug: "palm-signs",
    kind: "guide",
    focus: { en: "Palm signs and lucky marks", hi: "हाथ के शुभ चिह्न (Palm Signs)" },
    title: {
      en: "Palm Signs — Lucky Marks On The Hand | Hastrekha AI",
      hi: "हाथ के शुभ चिह्न (Palm Signs) — Chinh | Hastrekha AI",
    },
    description: {
      en: "Palm signs aur hath ke shubh chinh: machhli chinh, taara, tribhuj, dwip aur unka asli matlab — bina dar ke, honest Hindi guide with free AI reading.",
      hi: "हाथ के शुभ चिह्न (palm signs): मछली चिह्न, तारा, त्रिभुज, द्वीप, वर्ग और उनका असली मतलब — बिना डराए, ईमानदार हिंदी गाइड, फ्री AI reading के साथ।",
    },
    h1: {
      en: "Palm Signs — The Lucky Marks On The Hand And What They Mean",
      hi: "हाथ के शुभ चिह्न — Palm Signs और उनका असली मतलब",
    },
    crumb: { en: "Palm Signs (Shubh Chinh)", hi: "हाथ के शुभ चिह्न" },
    intro: [
      {
        en: "Palm signs are the marks that sit on or beside the lines — a star, a triangle, a fish, a square, a small island. Classical palmistry reads signs like punctuation inside the sentence of a line: they change how the line speaks, and on their own they say nothing at all.",
        hi: "Palm signs वे चिह्न हैं जो रेखाओं पर या उनके पास बैठते हैं — तारा, त्रिभुज, मछली, वर्ग, छोटा द्वीप। शास्त्रीय हस्तरेखा इन्हें रेखा के वाक्य में विराम-चिह्न की तरह पढ़ती है: ये रेखा का लहजा बदलते हैं, और अकेले में कुछ नहीं कहते।",
      },
      {
        en: "Popular palmistry lists dozens of 'lucky marks', often with fear attached to the awkward ones. This page takes the honest route: the signs most traditions agree on, what each means in everyday life, what is pure superstition, and how to actually find marks on your own palm without straining your eyes.",
        hi: "लोकप्रिय हस्तरेखा में \"शुभ चिह्नों\" की लंबी सूचियाँ मिलती हैं, और डरावने चिह्नों के साथ डर भी बेचा जाता है। यह पेज ईमानदार रास्ता लेता है: वे चिह्न जिन पर ज़्यादातर परंपराएँ सहमत हैं, हर चिह्न का रोज़मर्रा का मतलब, क्या सिर्फ़ अंधविश्वास है, और आँखें दबाए बिना अपने हाथ के चिह्न कैसे ढूँढ़ें।",
      },
      {
        en: "One rule before the list: a sign sits on a line, a mount or a plain patch of skin, and its meaning changes with the address. The same star on the Jupiter mount and on the Saturn mount is read completely differently.",
        hi: "सूची से पहले एक नियम: हर चिह्न किसी रेखा, पर्वत या खाली हिस्से पर बैठा होता है, और उसका मतलब उसके पते के साथ बदलता है। वही तारा गुरु पर्वत पर और शनि पर्वत पर बिल्कुल अलग पढ़ा जाता है।",
      },
    ],
    diagram: {
      line: "all",
      alt: "palm signs diagram — hath ke shubh chinh machhli taara tribhuj aur unki jagah hast rekha me",
      caption: {
        en: "Signs live on the lines and the mounts — the numbered guides below take you line by line through the whole hand, so every mark gets its correct address.",
        hi: "चिह्न रेखाओं और पर्वतों पर ही रहते हैं — नीचे दी गई गाइड आपको पूरे हाथ की रेखा-दर-रेखा पढ़ाती हैं, जिससे हर चिह्न को उसका सही पता मिल जाए।",
      },
    },
    sections: [
      {
        h: { en: "Palm signs kya hote hain aur kahan milte hain", hi: "Palm signs kya hote hain aur kahan milte hain" },
        p: [
          {
            en: "Every mark on the palm lives at one of three addresses: on a line, on a mount (the fleshy rises under the fingers and around the thumb), or on the plain between them. The sign's own shape gives the flavour; the address gives the subject. A star on the mount of Jupiter is read about ambition and leadership; the same star near the wrist is read about journey and property.",
            hi: "हथेली का हर निशान तीन पतों में से एक पर रहता है: किसी रेखा पर, किसी पर्वत पर (उंगलियों के नीचे और अंगूठे के आसपास के उभरे हिस्से), या बीच के खाली हिस्से पर। चिह्न की शक्ल उसका स्वाद बताती है; पता उसका विषय। गुरु पर्वत पर तारा महत्वाकांक्षा और नेतृत्व के बारे में पढ़ा जाता है; वही तारा कलाई के पास यात्रा और संपत्ति के बारे में।",
          },
          {
            en: "Your first task is not interpretation but finding: signs are smaller than lines and often paler. Daylight, a clean lens and a zoom are the actual tools. Under a photo, marks that were invisible to the naked eye — a small triangle, a rice-grain pattern — usually show up within a minute.",
            hi: "पहला काम अर्थ निकालना नहीं, ढूँढ़ना है: चिह्न रेखाओं से छोटे और अक्सर हल्के होते हैं। दिन की रोशनी, साफ़ लेंस और ज़ूम ही असली औज़ार हैं। फ़ोटो में वे निशान भी मिल जाते हैं जो खुली आँख से नहीं दिखते — छोटा त्रिभुज, धान जैसा पैटर्न — और यह सब एक मिनट के भीतर।",
          },
        ],
      },
      {
        h: { en: "सबसे प्रसिद्ध शुभ चिह्न: मछली, तारा, त्रिभुज", hi: "सबसे प्रसिद्ध शुभ चिह्न: मछली, तारा, त्रिभुज" },
        p: [
          {
            en: "The fish sign (machhli chinh) on the mount of Venus — the thumb base — is the most repeated blessing in Indian palmistry: it is read as the mark of steady prosperity, family happiness and, in older language, 'a full kitchen'. Families in business keep an eye out for it on the next generation's palms.",
            hi: "शुक्र पर्वत — अंगूठे का मूल — पर बनने वाला मछली चिह्न भारतीय हस्तरेखा का सबसे दोहराया गया आशीर्वाद है: इसे स्थिर समृद्धि, पारिवारिक सुख और पुरानी भाषा में \"भरी रसोई\" का चिह्न माना जाता है। कारोबारी परिवार अगली पीढ़ी की हथेलियों पर इसे खास नज़र से देखते हैं।",
          },
          {
            en: "The star (taara) and the triangle (tribhuj) are the working signs: a star on a line usually marks an event worth noticing — a breakthrough, a sudden responsibility — and a triangle sitting on a line is read as success that had support, protection or planning behind it. Both are neutral in themselves; only the address decides whether the context is career, money or love.",
            hi: "तारा और त्रिभुज काम के चिह्न हैं: रेखा पर बना तारा आमतौर पर ऐसी घटना का संकेत है जो ध्यान देने लायक हो — बड़ा मोड़, अचानक ज़िम्मेदारी — और रेखा पर बैठा त्रिभुज ऐसी सफलता का, जिसके पीछे सहारा, सुरक्षा या योजना रही हो। दोनों चिह्न अपने आप में तटस्थ हैं; करियर, धन या प्रेम का माहौल पता तय करता है।",
          },
        ],
      },
      {
        h: { en: "चिह्नों का मतलब: मछली से वर्ग तक", hi: "चिह्नों का मतलब: मछली से वर्ग तक" },
        p: [
          {
            en: "These are the marks the classical schools most agree on, with the everyday reading teachers attach to them. None of them works alone — read each one as a word, and the line it sits on as the sentence.",
            hi: "ये वे चिह्न हैं जिन पर शास्त्रीय परंपराएँ सबसे ज़्यादा सहमत हैं, साथ में शिक्षकों का रोज़मर्रा का अर्थ। इनमें से कोई अकेले काम नहीं करता — हर चिह्न को एक शब्द मानें और जिस रेखा पर बैठा है उसे वाक्य।",
          },
        ],
        list: [
          { title: { en: "Fish (machhli)", hi: "मछली चिह्न" }, text: { en: "On the Venus mount: steady earning, family prosperity, inherited goodwill.", hi: "शुक्र पर्वत पर: स्थिर कमाई, पारिवारिक समृद्धि, विरासत में मिली साख।" } },
          { title: { en: "Star (taara)", hi: "तारा" }, text: { en: "On a mount: sudden recognition there; on a line: a turning-point event.", hi: "पर्वत पर: उस क्षेत्र में अचानक पहचान; रेखा पर: मोड़ देने वाली घटना।" } },
          { title: { en: "Triangle (tribhuj)", hi: "त्रिभुज" }, text: { en: "Planned success — gains that came with caution, training or guidance.", hi: "योजना से मिली सफलता — सोच-समझकर, ट्रेनिंग या मार्गदर्शन से।" } },
          { title: { en: "Square (varg)", hi: "वर्ग" }, text: { en: "A protective sign: a difficult period that is contained and safely crossed.", hi: "रक्षक चिह्न: मुश्किल दौर जो सीमित रहता है और सुरक्षित पार होता है।" } },
          { title: { en: "Island (dwip)", hi: "द्वीप" }, text: { en: "A stretched phase inside a line — slow progress, rest needed, nothing dramatic.", hi: "रेखा के भीतर खिंचा हुआ दौर — धीमी प्रगति, आराम की ज़रूरत, कोई नाटक नहीं।" } },
          { title: { en: "Rice grain", hi: "धान जैसा चिह्न" }, text: { en: "On the heart line or Venus mount: money and warmth arriving through family.", hi: "हृदय रेखा या शुक्र पर्वत पर: परिवार के रास्ते धन और अपनापन।" } },
        ],
      },
      {
        h: { en: "अशुभ चिह्न? सच्चाई डर से बड़ी है", hi: "अशुभ चिह्न? सच्चाई डर से बड़ी है" },
        p: [
          {
            en: "Crosses, grilles and dots are the signs popular books use to frighten readers. Honest classical sources are far calmer: a cross on a mount is read as effort that is blocked until the person changes method; a grille as scattered energy; a dot as a small phase of pause. None of them is a punishment, and none is permanent.",
            hi: "क्रॉस, जाली और बिंदु वे चिह्न हैं जिनसे लोकप्रिय किताबें डराती हैं। ईमानदार शास्त्रीय स्रोत कहीं ज़्यादा शांत हैं: पर्वत पर क्रॉस का मतलब है प्रयास जो तरीक़ा बदलने तक रुका है; जाली का मतलब बिखरी ऊर्जा; बिंदु का मतलब ठहराव का छोटा दौर। इनमें कोई सज़ा नहीं और कोई बात स्थायी नहीं।",
          },
          {
            en: "The practical test for any fear-selling reader is simple: if a sign is used to make you buy a remedy, a stone or an expensive puja on the spot, the reading is commerce, not palmistry. Good readers describe tendencies and hand you back the pen — your habits write the next chapter.",
            hi: "डर बेचने वाले पाठक की पहचान आसान है: अगर कोई चिह्न दिखाकर तुरंत कोई उपाय, रत्न या महँगी पूजा खरीदवाई जा रही हो, तो वह पढ़ाई नहीं, दुकान है। अच्छे पाठक प्रवृत्ति बताकर क़लम आपके हाथ में लौटा देते हैं — अगला अध्याय आपकी आदतें लिखती हैं।",
          },
        ],
      },
      {
        h: { en: "पर्वतों के चिह्न: पते से अर्थ बदलता है", hi: "पर्वतों के चिह्न: पते से अर्थ बदलता है" },
        p: [
          {
            en: "Learn the addresses and signs stop being confusing. Jupiter (under the index finger) is ambition and authority; Saturn (middle) is discipline and duty; Apollo or Sun (ring) is recognition and creativity; Mercury (little finger) is speech, trade and skill; Venus (thumb base) is family, love and wealth; Moon (opposite edge) is imagination and travel; Mars (below Mercury) is courage and conflict.",
            hi: "पते याद कर लें और चिह्न उलझन बनना बंद कर देते हैं। गुरु (तर्जनी के नीचे) महत्वाकांक्षा और अधिकार; शनि (मध्यमा) अनुशासन और कर्तव्य; सूर्य (अनामिका) पहचान और रचनात्मकता; बुध (कनिष्ठा) वाणी, व्यापार और हुनर; शुक्र (अंगूठे का मूल) परिवार, प्रेम और धन; चंद्र (उलटा किनारा) कल्पना और यात्रा; मंगल (बुध के नीचे) साहस और संघर्ष।",
          },
          {
            en: "So: a star on Jupiter asks about ambition, not marriage. A triangle on Saturn speaks of duty handled with planning. A fish on Venus is about home and wealth together. When a sign and its mount point to the same life area as the line it touches, classical reading treats it as confirmation — signs, lines and mounts agreeing is the strongest statement a palm can make.",
            hi: "यानी: गुरु पर तारा महत्वाकांक्षा का सवाल है, शादी का नहीं। शनि पर त्रिभुज योजना से सँभाले गए कर्तव्य की बात कहता है। शुक्र पर मछली घर और धन दोनों की बात करती है। जब चिह्न और उसका पर्वत उसी जीवन-क्षेत्र की ओर इशारा करें जिसकी ओर वह छू रही रेखा करती है, तो शास्त्र इसे पुष्टि मानता है — चिह्न, रेखा और पर्वत का एक साथ सहमत होना हथेली का सबसे मज़बूत बयान है।",
          },
        ],
      },
      {
        h: { en: "अपने हाथ के चिह्न कैसे ढूँढ़ें", hi: "अपने हाथ के चिह्न कैसे ढूँढ़ें" },
        p: [
          {
            en: "Find a window with daylight, rest the palm open, and photograph it from directly above — not at an angle. Take a second photo of the thumb side and a third of the little-finger edge; that is where most signs hide. Then zoom slowly through the image, mount by mount, before you look at the lines at all.",
            hi: "दिन की रोशनी वाली खिड़की चुनें, हथेली खुली रखें और ठीक ऊपर से फ़ोटो लें — तिरछे से नहीं। दूसरी फ़ोटो अंगूठे वाले किनारे की और तीसरी कनिष्ठा के किनारे की लें; ज़्यादातर चिह्न वहीं छिपे रहते हैं। फिर रेखाओं से पहले, पर्वत-दर-पर्वत ज़ूम करते हुए तस्वीर देखें।",
          },
          {
            en: "An AI palm reading automates this sweep: it scans the full palm photo, notes the signs it can identify with reasonable confidence, and reports each one with its address and a plain-language meaning — without the fear marketing that marks usually arrive with. Comparing your own findings with the AI list is a genuinely good way to train your eye.",
            hi: "AI palm reading यह पूरा सर्वे अपने आप कर लेती है: हथेली की पूरी फ़ोटो स्कैन करके जो चिह्न भरोसे से पहचाने जा सकते हैं उन्हें नोट करती है, और हर चिह्न का पता तथा आसान भाषा में अर्थ बताती है — उस डर वाली मार्केटिंग के बिना जो चिह्नों के साथ आमतौर पर बेची जाती है। अपने निष्कर्षों को AI की सूची से मिलाना आँख को प्रशिक्षित करने का बहुत अच्छा तरीक़ा है।",
          },
        ],
      },
    ],
    faqs: [
      {
        q: { en: "Which signs on the palm are considered lucky?", hi: "हाथ में कौन से चिह्न शुभ माने जाते हैं?" },
        a: {
          en: "The fish sign on the Venus mount, a triangle on the fate line, a star on the Jupiter mount and rice-grain marks near the heart line are the most widely agreed lucky signs. Each is read inside its context — a sign alone says nothing, and its address on a mount or line decides the meaning.",
          hi: "शुक्र पर्वत पर मछली चिह्न, भाग्य रेखा पर त्रिभुज, गुरु पर्वत पर तारा और हृदय रेखा के पास धान जैसे चिह्न सबसे मान्य शुभ चिह्न हैं। हर चिह्न अपने माहौल में पढ़ा जाता है — अकेला चिह्न कुछ नहीं कहता, और उसका पता यानी पर्वत या रेखा ही अर्थ तय करता है।",
        },
      },
      {
        q: { en: "What does the fish sign (machhli chinh) mean?", hi: "मछली चिह्न का क्या मतलब है?" },
        a: {
          en: "It sits on the mount of Venus, the thumb base, and is traditionally read as steady prosperity, family happiness and the ability to hold wealth without waste. It is one of the oldest blessings in Indian palmistry. Treat it as encouragement, not a guarantee — earning and saving habits still do the real work.",
          hi: "यह शुक्र पर्वत — अंगूठे के मूल — पर बनता है और परंपरा में इसे स्थिर समृद्धि, पारिवारिक सुख और धन को बचाकर रख पाने की क्षमता माना जाता है। यह भारतीय हस्तरेखा के सबसे पुराने आशीर्वादों में है। इसे प्रोत्साहन मानें, गारंटी नहीं — असली काम कमाने और बचाने की आदतें ही करती हैं।",
        },
      },
      {
        q: { en: "Are crosses and dots on the palm bad signs?", hi: "क्रॉस और बिंदु अशुभ चिह्न हैं?" },
        a: {
          en: "They are not verdicts. A cross is traditionally read as effort that stays blocked until the method changes; a dot as a short pause; a grille as scattered energy. Fear around these marks is mostly sold, not read. Any reader who instantly prescribes a remedy for a mark is running a shop, not a reading.",
          hi: "ये कोई फ़ैसले नहीं हैं। क्रॉस का पारंपरिक अर्थ है प्रयास जो तरीक़ा बदलने तक रुका है; बिंदु का अर्थ छोटा ठहराव; जाली का अर्थ बिखरी ऊर्जा। इन चिह्नों के आसपास का डर ज़्यादातर बेचा जाता है, पढ़ा नहीं जाता। जो पाठक चिह्न देखते ही उपाय लिख दे, वह दुकान चला रहा है, पढ़ाई नहीं।",
        },
      },
      {
        q: { en: "How do I find signs on my own palm?", hi: "अपने हाथ के चिह्न कैसे ढूँढ़ूँ?" },
        a: {
          en: "Use daylight and a camera. Photograph the palm from directly above, then take angled shots of the thumb side and the little-finger edge where signs hide. Zoom through the image mount by mount before reading the lines. Marks invisible to the eye usually appear within one minute on a photo.",
          hi: "दिन की रोशनी और कैमरा इस्तेमाल करें। हथेली की फ़ोटो ठीक ऊपर से लें, फिर अंगूठे वाले किनारे और कनिष्ठा के किनारे की तिरछी तस्वीरें लें जहाँ चिह्न छिपते हैं। रेखाएँ पढ़ने से पहले पर्वत-दर-पर्वत ज़ूम करके देखें। आँख से न दिखने वाले निशान फ़ोटो में एक मिनट में दिख जाते हैं।",
        },
      },
      {
        q: { en: "Do palm signs change over time?", hi: "हाथ के चिह्न बदलते हैं क्या?" },
        a: {
          en: "Readers describe lines as more changeable and signs as slower — but nothing on the palm is frozen. Signs are traditionally said to form around phases and can soften as habits change. Read them as the current punctuation of your hand, re-check after a year, and let behaviour, not worry, do the editing.",
          hi: "पाठक रेखाओं को ज़्यादा बदलने वाला और चिह्नों को धीमा मानते हैं — पर हथेली पर कुछ भी जमा हुआ नहीं है। परंपरा कहती है चिह्न दौरों के साथ बनते हैं और आदतें बदलने पर हल्के पड़ सकते हैं। इन्हें अपने हाथ का वर्तमान विराम-चिह्न मानें, साल भर बाद फिर देखें, और बदलाव आदतों से होने दें, चिंता से नहीं।",
        },
      },
    ],
    related: [PILLAR_LINK, "money-line", "learn-palmistry", "which-hand-to-read"],
    keywords: ["palm signs", "हाथ के शुभ चिह्न", "machhli chinh in hand", "lucky signs in palmistry", "palmistry marks meaning", "hath ke chinh"],
  },
  {
    slug: "learn-palmistry",
    kind: "guide",
    focus: { en: "Learn palmistry for beginners", hi: "हस्तरेखा पढ़ना सीखें (Learn Palmistry)" },
    title: {
      en: "Learn Palmistry For Beginners — Step By Step | Hastrekha AI",
      hi: "हस्तरेखा पढ़ना सीखें (Learn Palmistry) | Hastrekha AI",
    },
    description: {
      en: "Learn palmistry step by step: beginners ke liye 7 kadam, kaunsi lines pehle seekhni hain, galtiyan, practice ka tarika aur free guides — Hastrekha AI.",
      hi: "हस्तरेखा पढ़ना सीखें — beginner के लिए 7 कदम: पहले क्या सीखें, कौन सी ग़लतियाँ बचाएँ, अभ्यास कैसे करें और हर रेखा की फ्री गाइड — आसान हिंदी में।",
    },
    h1: {
      en: "Learn Palmistry — A Beginner's Course In Seven Steps",
      hi: "हस्तरेखा पढ़ना सीखें — Beginner से शुरुआत के 7 कदम",
    },
    crumb: { en: "Learn Palmistry", hi: "हस्तरेखा पढ़ना सीखें" },
    intro: [
      {
        en: "Learn palmistry the way it is actually taught: one layer at a time. First the hand's landscape — mounts, fingers, which hand is active. Then the major lines, one by one. Then signs, and finally the skill that separates readers from reciters: comparing two hands and telling a single coherent story.",
        hi: "हस्तरेखा उसी तरह सीखें जैसे असल में सिखाई जाती है: एक-एक परत। पहले हाथ का नक़्शा — पर्वत, उंगलियाँ, कौन सा हाथ सक्रिय है। फिर बड़ी रेखाएँ, एक-एक करके। उसके बाद चिह्न, और अंत में वह हुनर जो पाठक को रटने वाले से अलग करता है: दोनों हाथ मिलाकर एक जुड़ी हुई कहानी कहना।",
      },
      {
        en: "This page is the free course outline that used to cost a coaching fee: the exact seven-step order, the five beginner mistakes that ruin readings, a ten-minute daily practice, and pointers into the deeper guides on this site for every step.",
        hi: "यह पेज वही फ्री कोर्स-खाका है जिसके लिए कोचिंग फ़ीस दी जाती थी: सीखने का सही सात-कदमी क्रम, वे पाँच शुरुआती ग़लतियाँ जो रीडिंग बिगाड़ देती हैं, रोज़ का दस मिनट का अभ्यास, और हर कदम के लिए इस साइट की गहरी गाइडों के रास्ते।",
      },
      {
        en: "One promise from the start: this course teaches you to read patterns and describe tendencies honestly. It will not teach you to predict dates, lottery numbers or the gender of unborn children — no honest palmistry course does.",
        hi: "शुरुआत में एक वादा: यह कोर्स आपको पैटर्न पढ़ना और प्रवृत्तियाँ ईमानदारी से बताना सिखाएगा। यह तारीख़ें, लॉटरी नंबर या होने वाले बच्चे का लिंग बताना नहीं सिखाएगा — कोई ईमानदार कोर्स नहीं सिखाता।",
      },
    ],
    diagram: {
      line: "all",
      alt: "learn palmistry diagram — hast rekha sikhne ke liye poori hatheli ki lines ka naksha",
      caption: {
        en: "The learning map: nine lines, seven mounts, two hands. The numbered list under the diagram links every guide, so you can study one feature at a time.",
        hi: "सीखने का नक़्शा: नौ रेखाएँ, सात पर्वत, दो हाथ। चित्र के नीचे दी सूची हर गाइड से जोड़ती है, इसलिए एक बार में एक ही चीज़ पढ़ें।",
      },
    },
    sections: [
      {
        h: { en: "शुरुआत: हस्तरेखा सीखने का सही क्रम", hi: "शुरुआत: हस्तरेखा सीखने का सही क्रम" },
        p: [
          {
            en: "Beginners usually start with the life line and then jump randomly — which is why most of them stop feeling lost. The traditional order is deliberate: landscape first, then lines, then signs, then synthesis. Landscape means the mounts and the two hands; you cannot understand why a line matters until you know what ground it sits on.",
            hi: "नए लोग आमतौर पर जीवन रेखा से शुरू करके फिर इधर-उधर कूदते हैं — इसीलिए ज़्यादातर को लगता है कि सब उलझ गया। शास्त्रीय क्रम सोच-समझकर बना है: पहले नक़्शा, फिर रेखाएँ, फिर चिह्न, फिर जोड़ाई। नक़्शे का मतलब है पर्वत और दोनों हाथ; जब तक पता न चले कि रेखा किस ज़मीन पर बैठी है, उसका महत्व समझ नहीं आएगा।",
          },
          {
            en: "Spend your first week only on landscape and hands. It feels slow and then saves months: every later lesson becomes a variation of 'this line on this mount, stronger on this hand'.",
            hi: "पहला हफ़्ता सिर्फ़ नक़्शे और हाथों पर लगाएँ। धीमा लगेगा, पर महीने बचा देगा: आगे का हर पाठ \"यह रेखा इस पर्वत पर, इस हाथ पर ज़्यादा मज़बूत\" का ही रूप होगा।",
          },
        ],
      },
      {
        h: { en: "Step 1–3: हथेली, उंगलियाँ और पर्वत पहचानें", hi: "Step 1–3: हथेली, उंगलियाँ और पर्वत पहचानें" },
        p: [
          {
            en: "Start by classifying, not by judging. Palm shape (square or long), finger lengths, and the textures of the skin are the first vocabulary of a reader. Then learn the seven mounts and their subjects — that single chart upgrades every line you will ever read.",
            hi: "शुरुआत वर्गीकरण से करें, फ़ैसले से नहीं। हथेली का आकार (चौकोर या लंबी), उंगलियों की लंबाई और त्वचा की बनावट — यही पाठक की पहली शब्दावली है। फिर सात पर्वत और उनके विषय सीखें — यह एक चार्ट आगे आने वाली हर रेखा को बेहतर बना देगा।",
          },
        ],
        list: [
          { title: { en: "Step 1 — The hands", hi: "Step 1 — दोनों हाथ" }, text: { en: "Fix the active-passive rule first: one shows the present, one shows the start.", hi: "पहले सक्रिय-निष्क्रिय नियम तय करें: एक वर्तमान दिखाता है, एक शुरुआत।" } },
          { title: { en: "Step 2 — Palm shape", hi: "Step 2 — हथेली का आकार" }, text: { en: "Square palms read practical, long palms read idea-first — a quick temperament scan.", hi: "चौकोर हथेली व्यावहारिक, लंबी हथेली विचार-प्रधान — स्वभाव की तेज़ झलक।" } },
          { title: { en: "Step 3 — The seven mounts", hi: "Step 3 — सात पर्वत" }, text: { en: "Jupiter, Saturn, Apollo, Mercury, Venus, Moon, Mars — the addresses of the hand.", hi: "गुरु, शनि, सूर्य, बुध, शुक्र, चंद्र, मंगल — हथेली के पते।" } },
        ],
      },
      {
        h: { en: "Step 4–5: मुख्य रेखाएँ एक-एक करके", hi: "Step 4–5: मुख्य रेखाएँ एक-एक करके" },
        p: [
          {
            en: "Take the big four first — life, head, heart, fate — and let each live alone for a week. Learn one line's starting points, its normal course and its three classic variations before touching the next. Depth, direction and breaks are the only three questions you ask in this phase.",
            hi: "पहले बड़ी चार रेखाएँ लें — जीवन, मस्तिष्क, हृदय, भाग्य — और हर एक को अलग-अलग एक हफ़्ता दें। अगली रेखा छूने से पहले एक रेखा की शुरुआतें, सामान्य चाल और तीन शास्त्रीय विविधताएँ सीखें। इस दौर में सिर्फ़ तीन सवाल पूछने हैं: गहराई, दिशा, टूटन।",
          },
          {
            en: "Then the working lines: money, marriage, sun, health, children. For each one this site already has a dedicated guide with diagrams — use the numbered list under the palm diagram above as your syllabus, and keep one notebook page per line with your own hand drawn in it.",
            hi: "फिर काम की रेखाएँ: धन, विवाह, सूर्य, स्वास्थ्य, संतान। इनमें से हर एक की अलग गाइड और चित्र इस साइट पर मौजूद हैं — ऊपर हथेली के चित्र के नीचे दी सूची को अपना सिलेबस मानें, और हर रेखा के लिए एक कॉपी का पन्ना रखें जिस पर अपना हाथ बना हो।",
          },
        ],
      },
      {
        h: { en: "Step 6–7: चिह्न और दोनों हाथों की तुलना", hi: "Step 6–7: चिह्न और दोनों हाथों की तुलना" },
        p: [
          {
            en: "Signs come late because they are punctuation: stars, triangles, islands, crosses. Learn them only inside a line you already know, otherwise every mark will look special. Then the graduation step — holding both hands and describing the difference as one story about the person.",
            hi: "चिह्न देर से आते हैं क्योंकि वे विराम-चिह्न हैं: तारे, त्रिभुज, द्वीप, क्रॉस। इन्हें सिर्फ़ उसी रेखा के भीतर सीखें जो आपको आती है, वरना हर निशान ख़ास लगने लगेगा। फिर आख़िरी कदम — दोनों हाथ सामने रखकर उनके फर्क को इंसान के बारे में एक जुड़ी हुई कहानी में कहना।",
          },
          {
            en: "That last step is the whole skill. A reader who can say 'the born pattern was soft, the working hand built discipline' has read the person; one who recites nine lines from the active palm has read only half a hand.",
            hi: "यही आख़िरी कदम पूरा हुनर है। जो पाठक कह सके कि \"जन्म का पैटर्न नरम था, काम करने वाले हाथ ने अनुशासन खड़ा किया\" उसने इंसान पढ़ा; और जो सक्रिय हथेली से नौ रेखाएँ रटकर सुना दे, उसने आधा हाथ पढ़ा।",
          },
        ],
      },
      {
        h: { en: "नई शुरुआत में आम 5 गलतियाँ", hi: "नई शुरुआत में आम 5 गलतियाँ" },
        p: [
          {
            en: "Every self-taught beginner steps on the same five stones. Knowing them in advance is most of the course.",
            hi: "हर ख़ुद सीखने वाला शुरुआती इन्हीं पाँच पत्थरों पर ठोकर खाता है। पहले से जान लेना तो आधा कोर्स है।",
          },
        ],
        list: [
          { title: { en: "Jumping to judgment", hi: "तुरंत नतीजा निकालना" }, text: { en: "One bad-looking line is not a verdict; read three features before concluding anything.", hi: "एक खराब दिखती रेखा फ़ैसला नहीं; कोई भी निष्कर्ष तीन चीज़ें पढ़कर निकालें।" } },
          { title: { en: "Ignoring the passive hand", hi: "निष्क्रिय हाथ छोड़ना" }, text: { en: "Half the message lives there — a lesson readers learn late and beginners never guess.", hi: "आधा संदेश वहीं है — पाठक इसे देर से सीखते हैं, नए लोग अंदाज़ा भी नहीं करते।" } },
          { title: { en: "Reading in bad light", hi: "खराब रोशनी में पढ़ना" }, text: { en: "Room light hides half the fine lines; a phone photo in daylight shows them all.", hi: "कमरे की रोशनी आधी महीन रेखाएँ छिपा देती है; दिन की रोशनी में फ़ोन की फ़ोटो सब दिखा देती है।" } },
          { title: { en: "Collecting books, not hours", hi: "किताबें जमा करना, घंटे नहीं" }, text: { en: "Ten photos a week taught more hands than ten books a month. Practise more than you read.", hi: "हफ़्ते में दस फ़ोटो की प्रैक्टिस महीने में दस किताबों से ज़्यादा सिखाती है। पढ़ने से ज़्यादा अभ्यास करें।" } },
          { title: { en: "Predicting to impress", hi: "इम्प्रेस करने के लिए भविष्यवाणी" }, text: { en: "Guarantees collapse trust. Describe patterns, name tendencies, hand the decisions back.", hi: "गारंटी से भरोसा टूटता है। पैटर्न बताएँ, प्रवृत्ति कहें, फ़ैसले लौटा दें।" } },
        ],
      },
      {
        h: { en: "अभ्यास का तरीका: रोज़ के दस मिनट", hi: "अभ्यास का तरीका: रोज़ के दस मिनट" },
        p: [
          {
            en: "The ten-minute drill: one palm photo a day, one feature a day. Monday the life line on your own hand, Tuesday the head line on a friend's photo, and so on until all nine lines are done — then loop. Write two sentences per photo: what you see, and what you honestly cannot yet tell.",
            hi: "दस मिनट की ड्रिल: रोज़ एक हथेली की फ़ोटो, रोज़ एक चीज़। सोमवार अपने हाथ की जीवन रेखा, मंगलवार दोस्त की फ़ोटो पर मस्तिष्क रेखा — इसी तरह नौ रेखाएँ पूरी करें, फिर चक्र दोहराएँ। हर फ़ोटो पर दो वाक्य लिखें: क्या दिखा, और क्या अभी ईमानदारी से नहीं दिखा।",
          },
          {
            en: "For structure, pair the drill with the free guides: start at the complete palmistry guide, then go line by line, and use the AI reading as a sparring partner — upload a palm, compare its twelve-area report with your own notes, and study where the two disagree. That disagreement is your syllabus.",
            hi: "क्रम के लिए ड्रिल को फ्री गाइडों के साथ जोड़ें: पूरी हस्तरेखा गाइड से शुरू करें, फिर रेखा-दर-रेखा चलें, और AI reading को अभ्यास-साथी बनाएँ — हथेली अपलोड करें, उसकी बारह-क्षेत्रों वाली रिपोर्ट को अपने नोट्स से मिलाएँ, और जहाँ दोनों में फर्क हो वहीं रुककर पढ़ें। वही फर्क आपका सिलेबस है।",
          },
        ],
      },
    ],
    faqs: [
      {
        q: { en: "How long does it take to learn palmistry?", hi: "हस्तरेखा सीखने में कितना समय लगता है?" },
        a: {
          en: "Basic fluency — reading the four major lines and both hands without props — usually takes three to six months of ten-minute daily practice. Deeper work like signs and synthesis keeps growing for years, as with any traditional craft. The pace depends on photos read, not books collected.",
          hi: "बुनियादी पकड़ — चार बड़ी रेखाएँ और दोनों हाथ बिना सहारे पढ़ना — आमतौर पर रोज़ के दस मिनट के साथ तीन से छह महीने में आती है। चिह्न और जोड़ाई जैसी गहरी बातें सालों में बढ़ती हैं, किसी भी पारंपरिक हुनर की तरह। रफ़्तार किताबों से नहीं, पढ़ी गई फ़ोटो से तय होती है।",
        },
      },
      {
        q: { en: "Which line should a beginner learn first?", hi: "शुरुआत में सबसे पहले कौन सी रेखा सीखें?" },
        a: {
          en: "Start with the landscape — the two hands, palm shape and the seven mounts. Then take the four major lines one per week: life, head, heart, fate. Each line gets studied for its starting point, depth, direction and breaks before the next one. Random jumping is why most beginners feel lost.",
          hi: "पहले नक़्शा सीखें — दोनों हाथ, हथेली का आकार और सात पर्वत। फिर चार बड़ी रेखाएँ हफ़्ते-हफ़्ते लें: जीवन, मस्तिष्क, हृदय, भाग्य। अगली रेखा से पहले हर रेखा की शुरुआत, गहराई, दिशा और टूटन पढ़ें। इधर-उधर कूदना ही नए लोगों की सबसे बड़ी उलझन है।",
        },
      },
      {
        q: { en: "Can I learn palmistry for free?", hi: "क्या हस्तरेखा फ्री में सीख सकते हैं?" },
        a: {
          en: "Yes. This site's guides — the complete palmistry guide plus one page per line — cover everything in the beginner-to-intermediate syllabus, and they are free. Add a daily photo practice and the free AI reading for cross-checking, and you have a complete self-study kit without paying a coaching fee.",
          hi: "हाँ। इस साइट की गाइडें — पूरी हस्तरेखा गाइड और हर रेखा का एक पेज — शुरुआती से मध्यम स्तर का पूरा सिलेबस कवर करती हैं, और फ्री हैं। इनके साथ रोज़ की फ़ोटो प्रैक्टिस और मिलान के लिए फ्री AI reading जोड़ लें, तो कोचिंग फ़ीस के बिना पूरा सेल्फ़-स्टडी किट तैयार है।",
        },
      },
      {
        q: { en: "Which books are best for learning palmistry?", hi: "सीखने के लिए कौन सी किताबें अच्छी हैं?" },
        a: {
          en: "The English classics are reliable starting points: Cheiro's language-of-the-hand work and William Benham's Laws of Scientific Hand Reading. In Hindi, the traditional hast-samudrik shastra books carry the Indian reading of mounts and signs. Read one book slowly, and practise more than you read.",
          hi: "अंग्रेज़ी की क्लासिक सबसे भरोसेमंद शुरुआत हैं: Cheiro की हाथ की भाषा वाली किताब और William Benham की The Laws of Scientific Hand Reading। हिंदी में पारंपरिक हस्त-सामुद्रिक शास्त्र की किताबों में पर्वत और चिह्नों की भारतीय पढ़ाई मिलती है। एक किताब धीरे-धीरे पढ़ें, और पढ़ने से ज़्यादा अभ्यास करें।",
        },
      },
      {
        q: { en: "How do I practise palmistry without real people around?", hi: "लोगों के बिना अभ्यास कैसे करें?" },
        a: {
          en: "Photographs and the AI reading. Collect palm photos from family and friends, and use public figures' open photographs. Upload a palm to the AI reading, write your own two-sentence reading first, then compare with the twelve-area report and note the disagreements — that gap between your note and the report is your daily lesson.",
          hi: "फ़ोटो और AI reading से। परिवार और दोस्तों की हथेली की फ़ोटो जमा करें, और सार्वजनिक हस्तियों की खुली तस्वीरें इस्तेमाल करें। पहले अपनी दो वाक्यों की रीडिंग लिखें, फिर हथेली AI reading में अपलोड करके बारह-क्षेत्रों वाली रिपोर्ट से मिलाएँ और फर्क नोट करें — आपके नोट और रिपोर्ट के बीच का यही अंतर रोज़ का पाठ है।",
        },
      },
    ],
    related: [PILLAR_LINK, "books", "which-hand-to-read", "palm-signs"],
    keywords: ["learn palmistry", "हस्तरेखा पढ़ना सीखें", "palmistry for beginners", "hastrekha sikhne ka tarika", "palm reading practice", "free palmistry course"],
  },
];
