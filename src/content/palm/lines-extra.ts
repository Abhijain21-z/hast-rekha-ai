import type { PalmPage } from "./types";

const PILLAR_LINK = "hast-rekha-palmistry";

/**
 * Second batch of line guides (money and marriage). Kept in its own module so
 * the line pages can be written in reviewable batches without touching the
 * ones already published.
 */
export const EXTRA_LINE_PAGES: PalmPage[] = [
  {
    slug: "money-line",
    kind: "line",
    focus: { en: "Dhan rekha in palmistry", hi: "धन रेखा (Money Line)" },
    title: {
      en: "Dhan Rekha — Money Line in Palmistry | Hastrekha AI",
      hi: "धन रेखा (Money Line) — Paise Wali Rekha | Hastrekha AI",
    },
    description: {
      en: "Dhan rekha in palmistry aur hast rekha for money: haath me paise wali rekha kahan hoti hai, money line ke types aur lucky signs — free AI reading.",
      hi: "धन रेखा का मतलब: हाथ में पैसे वाली रेखा कहाँ होती है, dhan rekha ke types और पैसे से जुड़े lucky signs — आसान हिंदी में, फ्री AI reading के साथ।",
    },
    h1: {
      en: "Dhan Rekha (Money Line) — Where It Sits And What It Says",
      hi: "धन रेखा (Money Line) — हाथ में पैसे वाली रेखा कहाँ होती है",
    },
    crumb: { en: "Money Line (Dhan Rekha)", hi: "धन रेखा (Money Line)" },
    intro: [
      {
        en: "Dhan rekha in palmistry is the light line rising towards the mount of Mercury under the little finger, or a branch that leaves the fate line and bends that way. It is read about how money arrives, not how much will arrive.",
        hi: "धन रेखा (dhan rekha) वह हल्की रेखा है जो कनिष्ठा के नीचे बुध पर्वत की ओर उठती है, या फिर भाग्य रेखा से निकलकर उसी ओर मुड़ जाती है। इसे इस बात का संकेत माना जाता है कि पैसा किस रास्ते से आता है — कितना आएगा, यह रेखा नहीं बताती।",
      },
      {
        en: "Hast rekha for money never uses a single line. Readers combine the money line with the fate line (direction), the sun line (recognition), the Jupiter mount (ambition) and the small spending lines that cut across the lower palm.",
        hi: "हस्तरेखा में पैसे का हिसाब कभी एक रेखा से नहीं बनता। पाठक धन रेखा को भाग्य रेखा (दिशा), सूर्य रेखा (पहचान), गुरु पर्वत (महत्वाकांक्षा) और हथेली के निचले हिस्से को काटती छोटी खर्च रेखाओं के साथ पढ़ते हैं।",
      },
      {
        en: "Below: exactly where to look, the six common money-line types, what it means when the line is missing, the classical lucky signs, and the honest limits of money reading.",
        hi: "आगे: रेखा ठीक कहाँ देखनी है, छह आम प्रकार, रेखा न होने का मतलब, शास्त्र के शुभ चिह्न, और धन से जुड़ी रीडिंग की ईमानदार सीमाएँ।",
      },
    ],
    diagram: {
      line: "money",
      alt: "dhan rekha money line palmistry diagram — paise wali rekha under the little finger",
      caption: {
        en: "The money line branches upward towards the Mercury mount — usually from the fate line or sun line, sometimes as its own short stroke.",
        hi: "धन रेखा बुध पर्वत की ओर ऊपर निकलती है — आमतौर पर भाग्य रेखा या सूर्य रेखा से, कभी अपनी छोटी अलग लकीर के रूप में।",
      },
    },
    sections: [
      {
        h: { en: "हाथ में पैसे वाली रेखा कहाँ होती है?", hi: "हाथ में पैसे वाली रेखा कहाँ होती है?" },
        p: [
          {
            en: "Look at the area between the centre of the palm and the base of the little finger. A short line climbing towards the Mercury mount is the money line. On many hands it is not a separate line at all but a branch of the fate line that leans that way — which is read the same way.",
            hi: "हथेली के बीच और कनिष्ठा के मूल के बीच वाला हिस्सा देखें। बुध पर्वत की ओर चढ़ती छोटी रेखा ही धन रेखा है। कई हाथों में यह अलग रेखा नहीं, भाग्य रेखा से निकलकर उसी ओर झुकी शाखा होती है — और उसका अर्थ भी वही होता है।",
          },
          {
            en: "If you cannot find it with your eyes, photograph the palm and zoom in on that band; light strokes show up far better in a photo than under room light. Reading a pale line incorrectly is the most common reason people think they have 'no money line'.",
            hi: "अगर आँख से न दिखे तो हथेली की फ़ोटो लेकर उसी हिस्से को ज़ूम करें; हल्की लकीरें फ़ोटो में कमरे की रोशनी से कहीं ज़्यादा साफ़ दिखती हैं। हल्की रेखा को ग़लत पढ़ना ही सबसे बड़ा कारण है कि लोगों को लगता है उनकी कोई धन रेखा ही नहीं है।",
          },
        ],
      },
      {
        h: { en: "Money line ke types — कैसी रेखा क्या कहती है", hi: "धन रेखा के प्रकार — कैसी रेखा क्या कहती है" },
        p: [
          {
            en: "Read the line's starting point, direction and cleanliness. A line that begins clearly and rises without breaks is read as steady earning; one that starts thin and thickens upward is read as income that grows with age and experience.",
            hi: "रेखा का शुरुआती बिंदु, दिशा और सफ़ाई देखें। साफ़ शुरू होकर बिना टूटन ऊपर जाती रेखा स्थिर कमाई का संकेत है; पतली शुरू होकर ऊपर मोटी होती रेखा यह बताती है कि कमाई उम्र और अनुभव के साथ बढ़ती है।",
          },
        ],
        list: [
          { title: { en: "Clear single branch", hi: "साफ़ अकेली शाखा" }, text: { en: "One main source of income, usually dependable and long-running.", hi: "आय का एक मुख्य स्रोत, आमतौर पर भरोसेमंद और लंबा।" } },
          { title: { en: "Two or three branches", hi: "दो-तीन शाखाएँ" }, text: { en: "Multiple income streams — job plus freelance or rent is common.", hi: "कई आय स्रोत — नौकरी के साथ फ्रीलांस या किराया आम है।" } },
          { title: { en: "Forked at the end", hi: "अंत में दो शाखाएँ" }, text: { en: "Income that splits between work and family duty.", hi: "कमाई का एक हिस्सा काम और दूसरा परिवार की ज़िम्मेदारी में।" } },
          { title: { en: "Thin, dotted", hi: "पतली, टुकड़ों में" }, text: { en: "Earnings in phases — project work and informal income.", hi: "दौरों में कमाई — प्रोजेक्ट वर्क और अनियमित आय।" } },
          { title: { en: "Rising from the fate line", hi: "भाग्य रेखा से उठती" }, text: { en: "Money follows the career direction; growth is steady but gradual.", hi: "पैसा करियर की दिशा के साथ आता है; बढ़त स्थिर पर धीमी।" } },
          { title: { en: "Reaching the head line", hi: "मस्तिष्क रेखा तक पहुँचती" }, text: { en: "Income directly linked to skills, study and clever planning.", hi: "कमाई सीधे हुनर, पढ़ाई और योजना से जुड़ी होती है।" } },
        ],
      },
      {
        h: { en: "पैसे वाली रेखा न हो तो क्या होता है?", hi: "पैसे वाली रेखा न हो तो क्या होता है?" },
        p: [
          {
            en: "Nothing dramatic. Many financially comfortable hands show no separate money line — on those palms the income story sits in a strong fate line, a well-formed Mercury mount and clear head and heart lines. Classical palmistry reads a missing money line as 'earning through effort and direction', not poverty.",
            hi: "कुछ भी नाटकीय नहीं। बहुत से आर्थिक रूप से सहज हाथों में अलग धन रेखा नहीं होती — उन हथेलियों में कमाई की कहानी मज़बूत भाग्य रेखा, सुडौल बुध पर्वत और साफ़ मस्तिष्क तथा हृदय रेखा में बैठी होती है। शास्त्र इसे 'मेहनत और दिशा से कमाई' मानते हैं, गरीबी नहीं।",
          },
          {
            en: "The reverse is also true: a clear money line does not promise wealth. A palm can show an easy income route and a habit of loose spending — which is exactly why the lines below matter.",
            hi: "उलटी बात भी सच है: साफ़ धन रेखा धन की गारंटी नहीं है। हथेली में आय का आसान रास्ता भी दिख सकता है और पैसा फिसल जाने की आदत भी — इसीलिए नीचे दी बातें मायने रखती हैं।",
          },
        ],
      },
      {
        h: { en: "Hast rekha for money — और कौन से संकेत देखें", hi: "Hast rekha for money — और कौन से संकेत देखें" },
        p: [
          {
            en: "Four companions to the money line: a deep, unbroken fate line (steady stream), a visible sun line (paid recognition), a full Jupiter mount (ambition to earn more), and a firm thumb base — the Venus mount — which tradition links with family assets and property rather than salary.",
            hi: "धन रेखा के चार साथी: गहरी और बिना टूटन वाली भाग्य रेखा (स्थिर धारा), दिखने वाली सूर्य रेखा (काम की कीमत मिलना), भरा गुरु पर्वत (ज़्यादा कमाने की महत्वाकांक्षा), और मज़बूत अंगूठे का मूल — शुक्र पर्वत — जिसे परंपरा वेतन के बजाय परिवार की संपत्ति से जोड़ती है।",
          },
          {
            en: "The classical lucky signs are the fish sign (machhli chinh) at the base of the thumb, a triangle on the fate line, and a grain or rice-stalk pattern near the heart line. Treat them as encouragement, not as a promise of sudden wealth.",
            hi: "शास्त्र के शुभ चिह्न हैं: अंगूठे के मूल पर मछली चिह्न, भाग्य रेखा पर त्रिभुज, और हृदय रेखा के पास धान की बालियों जैसा चिह्न। इन्हें प्रोत्साहन मानें, अचानक अमीर बनने का वादा नहीं।",
          },
        ],
      },
      {
        h: { en: "Spending lines: पैसा आने से ज़्यादा बाहर जाने का सवाल", hi: "खर्च रेखाएँ: पैसा बाहर जाने का सवाल" },
        p: [
          {
            en: "Short lines that cut across the lower palm from the outer edge towards the life line are read as spending lines — money moving out through travel, family, gadgets or lending. Several of them plus a weak fate line is the classic 'earning well, saving little' pattern.",
            hi: "हथेली के निचले हिस्से में बाहरी किनारे से जीवन रेखा की ओर जाती छोटी रेखाएँ खर्च रेखाएँ कहलाती हैं — पैसा यात्रा, परिवार, गैजेट या कर्ज़ देने में बाहर जाना। ये कई हों और भाग्य रेखा कमज़ोर हो, तो यह 'कमाई ठीक, बचत कम' वाला शास्त्रीय पैटर्न माना जाता है।",
          },
          {
            en: "This is the most genuinely useful part of a money reading: it turns the question from 'how much will I earn' to 'where does my money actually go' — something you can change this month with a budget.",
            hi: "धन की रीडिंग का सबसे उपयोगी हिस्सा यही है: सवाल 'कितना कमाऊँगा' से बदलकर 'पैसा असल में कहाँ जाता है' हो जाता है — और यह वह चीज़ है जिसे आप इसी महीने बजट बनाकर बदल सकते हैं।",
          },
        ],
      },
      {
        h: { en: "धन रेखा और समय: कमाई का दौर", hi: "धन रेखा और समय: कमाई का दौर" },
        p: [
          {
            en: "Readers treat the lower part of the money line as the early earning years and the upper reach near the Mercury mount as the later, more settled phase. When the line thickens as it rises, income usually rises with responsibility rather than with age alone.",
            hi: "पाठक धन रेखा के निचले हिस्से को शुरुआती कमाई के वर्ष मानते हैं और बुध पर्वत के पास वाले हिस्से को बाद का, ज़्यादा स्थिर दौर। अगर रेखा ऊपर जाते हुए मोटी होती है, तो कमाई उम्र के साथ नहीं, ज़िम्मेदारी के साथ बढ़ती है।",
          },
          {
            en: "No line dates a payday. If you want a practical timeline, put the reading next to your actual savings rate — the plan will beat the prediction every time.",
            hi: "कोई रेखा तनख़्वाह की तारीख़ नहीं बताती। अगर व्यावहारिक समय-सारिणी चाहिए, तो रीडिंग को अपनी असली बचत दर के सामने रखकर देखें — योजना हमेशा भविष्यवाणी से आगे निकलती है।",
          },
        ],
      },
      {
        h: { en: "Reading your own money line in one minute", hi: "एक मिनट में अपनी धन रेखा पढ़ें" },
        p: [
          {
            en: "Note the starting point (fate line or independent), the number of branches, and whether the line rises or fades. Then compare the active and passive hands: a stronger line on the active hand means the earning ability has improved through your own decisions — training, a switch, or better budgeting.",
            hi: "शुरुआती बिंदु (भाग्य रेखा से या अलग), शाखाओं की संख्या, और रेखा ऊपर बढ़ती है या फीकी पड़ती है — यह तीन चीज़ें नोट करें। फिर सक्रिय और निष्क्रिय हाथ की तुलना करें: सक्रिय हाथ पर ज़्यादा मज़बूत रेखा का मतलब है कि कमाने की क्षमता आपके अपने फ़ैसलों से सुधरी है — नई ट्रेनिंग, बदलाव, या बेहतर बजट।",
          },
          {
            en: "A full AI palm reading does this comparison for both hands from one photo and places money against the other eleven life areas, so you can see whether the money line is being helped or held back by everything around it.",
            hi: "पूरी AI palm reading एक ही फ़ोटो से दोनों हाथों की तुलना करती है और धन को बाक़ी ग्यारह जीवन-क्षेत्रों के सामने रखती है, जिससे दिखता है कि धन रेखा को आसपास की चीज़ें सहारा दे रही हैं या रोक रही हैं।",
          },
        ],
      },
    ],
    faqs: [
      {
        q: { en: "Where is the money line on the hand?", hi: "हाथ में पैसे वाली रेखा कहाँ होती है?" },
        a: {
          en: "Between the centre of the palm and the base of the little finger, rising towards the Mercury mount. Often it is a branch of the fate line rather than a separate stroke. Photograph the palm and zoom in — pale lines are easy to miss in room light.",
          hi: "हथेली के बीच और कनिष्ठा के मूल के बीच, बुध पर्वत की ओर उठती रेखा। कई बार यह अलग रेखा नहीं, भाग्य रेखा की शाखा होती है। हथेली की फ़ोटो लेकर ज़ूम करें — हल्की रेखाएँ कमरे की रोशनी में आसानी से छूट जाती हैं।",
        },
      },
      {
        q: { en: "What if I do not have a money line?", hi: "अगर धन रेखा न हो तो क्या मतलब है?" },
        a: {
          en: "It normally means income follows your main career direction rather than a side route: a strong fate line and Mercury mount carry the story. Many well-settled hands have no separate money line, so its absence is not a negative sign at all.",
          hi: "आमतौर पर इसका मतलब है कि कमाई किसी साइड रास्ते से नहीं, आपके मुख्य करियर की दिशा से आती है: मज़बूत भाग्य रेखा और बुध पर्वत ही कहानी सँभालते हैं। कई सुखी-संपन्न हाथों में अलग धन रेखा नहीं होती, इसलिए इसका न होना कोई नकारात्मक संकेत नहीं है।",
        },
      },
      {
        q: { en: "Does the money line show lottery or sudden money?", hi: "क्या धन रेखा लॉटरी या अचानक धन दिखाती है?" },
        a: {
          en: "No, and classical texts never promise a windfall from any line. What readers describe as sudden money is usually the result of a phase change — a promotion, a sale, an inheritance or a shift in the market — all of which need preparation. Treat gambling advice from any palmist as a red flag.",
          hi: "नहीं, और शास्त्र किसी भी रेखा से अचानक धन का वादा नहीं करते। पाठक जिसे 'अचानक धन' कहते हैं वह अक्सर एक दौर बदलने का नतीजा होता है — प्रमोशन, बिक्री, विरासत या बाज़ार का बदलाव — और इन सबकी तैयारी पहले से करनी पड़ती है। किसी भी पामिस्ट की जुआ या सट्टा वाली सलाह को लाल झंडा मानें।",
        },
      },
      {
        q: { en: "Which hand should I read for money?", hi: "पैसे के लिए कौन सा हाथ पढ़ें?" },
        a: {
          en: "The active hand shows your current earning behaviour; the passive hand shows the pattern you started with. A money line that is clearer on the active hand is read as earning ability that has improved with your own effort — the most encouraging sign in a money reading.",
          hi: "सक्रिय हाथ वर्तमान कमाई का व्यवहार दिखाता है; निष्क्रिय हाथ वह पैटर्न जो शुरुआत में मिला था। सक्रिय हाथ पर ज़्यादा साफ़ धन रेखा को 'अपने प्रयास से सुधरी कमाने की क्षमता' माना जाता है — धन की रीडिंग में सबसे उत्साहजनक संकेत।",
        },
      },
      {
        q: { en: "Are fish signs and triangles really lucky for money?", hi: "मछली चिह्न और त्रिभुज पैसे के लिए शुभ हैं?" },
        a: {
          en: "In Indian palmistry the fish sign on the Venus mount, a triangle on the fate line and grain signs near the heart line are all read as favourable money indications. They are encouragement inside a whole reading, not a receipt for future wealth — no single sign works alone.",
          hi: "भारतीय हस्तरेखा में शुक्र पर्वत पर मछली चिह्न, भाग्य रेखा पर त्रिभुज और हृदय रेखा के पास धान जैसे चिह्न धन के अच्छे संकेत माने जाते हैं। ये पूरी रीडिंग के भीतर प्रोत्साहन हैं, भविष्य के धन की रसीद नहीं — कोई भी चिह्न अकेले काम नहीं करता।",
        },
      },
    ],
    related: [PILLAR_LINK, "fate-line", "career-line", "sun-line"],
    keywords: ["dhan rekha in palmistry", "hast rekha for money", "हाथ में पैसे वाली रेखा", "money line palmistry", "dhan rekha meaning", "lucky signs in hand"],
  },
  {
    slug: "marriage-line",
    kind: "line",
    focus: { en: "Vivah rekha palm reading", hi: "विवाह रेखा (Marriage Line)" },
    title: {
      en: "Vivah Rekha — Marriage Line Palmistry | Hastrekha AI",
      hi: "विवाह रेखा (Marriage Line) — Shaadi Ki Rekha | Hastrekha AI",
    },
    description: {
      en: "Palm reading vivah rekha: marriage line kahan hoti hai, best marriage line kaisi hoti hai aur vivah ki 2 rekha ho to kya hota hai — free AI palm reading.",
      hi: "Vivah rekha palm reading: शादी की रेखा कहाँ होती है, best marriage line कैसी होती है और 2 रेखाएँ हों तो क्या होगा — आसान हिंदी में। फ्री AI reading।",
    },
    h1: {
      en: "Vivah Rekha (Marriage Line) — Shaadi, Love And What To Check",
      hi: "विवाह रेखा (Marriage Line) — शादी और साथी की रेखा",
    },
    crumb: { en: "Marriage Line (Vivah Rekha)", hi: "विवाह रेखा (Marriage Line)" },
    intro: [
      {
        en: "Palm reading vivah rekha starts on the outer edge of the hand, under the little finger: the short horizontal lines there are the marriage lines. They describe the chapters of partnership in your life — not a fixed wedding date.",
        hi: "Vivah rekha की शुरुआत हाथ के बाहरी किनारे पर, कनिष्ठा के नीचे से होती है: वहाँ दिखने वाली छोटी आड़ी रेखाएँ ही विवाह रेखाएँ हैं। ये आपके जीवन में साथ के अध्याय बताती हैं — शादी की तय तारीख़ नहीं।",
      },
      {
        en: "In Indian practice the marriage line is always read with the heart line (emotional style), the children lines on the same edge, and the dasha running in the kundli. One line on its own can easily mislead, which is why honest readers ask for both hands.",
        hi: "भारतीय परंपरा में विवाह रेखा को हमेशा हृदय रेखा (भावनाओं का तरीक़ा), उसी किनारे की संतान रेखाओं और कुंडली की चल रही दशा के साथ पढ़ा जाता है। अकेली एक रेखा आसानी से भ्रमित करती है, इसीलिए ईमानदार पाठक दोनों हाथ देखते हैं।",
      },
      {
        en: "This page covers the position, the signs of a strong marriage line, the traditional reading of two marriage lines, the so-called divorce line, and how timing is actually judged.",
        hi: "इस पेज में आप पढ़ेंगे: रेखा कहाँ होती है, मज़बूत विवाह रेखा की पहचान, विवाह की दो रेखाओं का शास्त्रीय अर्थ, तथाकथित डिवोर्स लाइन, और शादी का समय असल में कैसे देखा जाता है।",
      },
    ],
    diagram: {
      line: "marriage",
      alt: "vivah rekha marriage line palmistry diagram — shaadi ki rekha under the little finger",
      caption: {
        en: "Marriage lines sit on the edge of the palm below the little finger, between the heart line and the base of the finger. Count the clear ones, then read their depth and direction.",
        hi: "विवाह रेखाएँ कनिष्ठा के नीचे हथेली के बाहरी किनारे पर, हृदय रेखा और उंगली के मूल के बीच होती हैं। साफ़ रेखाएँ गिनें, फिर उनकी गहराई और दिशा पढ़ें।",
      },
    },
    sections: [
      {
        h: { en: "विवाह रेखा कहाँ होती है?", hi: "विवाह रेखा कहाँ होती है?" },
        p: [
          {
            en: "Place your palm sideways and look at the fleshy edge below the little finger. The short horizontal strokes there — usually one to three — are the marriage lines. They sit above the heart line's end and below the base of the little finger.",
            hi: "हथेली को किनारे की ओर करके कनिष्ठा के नीचे का मांसल किनारा देखें। वहाँ दिखती छोटी आड़ी लकीरें — आमतौर पर एक से तीन — विवाह रेखाएँ हैं। ये हृदय रेखा के अंत से ऊपर और कनिष्ठा के मूल से नीचे होती हैं।",
          },
          {
            en: "If the edge looks crowded, pull the skin slightly with your other hand to separate the strokes — the same trick works for photographs. A line that appears only when the skin is stretched is treated as a minor one, not a main chapter.",
            hi: "अगर किनारा भीड़भाड़ वाला लगे, तो दूसरे हाथ से त्वचा को हल्का खींचकर लकीरें अलग करें — फ़ोटो में भी यही तरीक़ा काम करता है। जो रेखा सिर्फ़ त्वचा खींचने पर दिखे, उसे मुख्य अध्याय नहीं, हल्का संकेत माना जाता है।",
          },
        ],
      },
      {
        h: { en: "Best marriage line palmistry: कैसी रेखा शुभ मानी जाती है", hi: "Best marriage line palmistry: कैसी रेखा शुभ मानी जाती है" },
        p: [
          {
            en: "A clear, moderately deep line that rises slightly upwards towards the little finger is considered the strongest indication — a partnership that adds to your life. A line that is deep but short is read as an intense, private bond; a light, long one as a friendly, companionable marriage.",
            hi: "साफ़, मध्यम गहरी और कनिष्ठा की ओर हल्की ऊपर उठती रेखा सबसे मज़बूत संकेत मानी जाती है — ऐसा साथ जो जीवन में जोड़ता है। गहरी पर छोटी रेखा तीव्र और निजी जुड़ाव बताती है; हल्की पर लंबी रेखा मित्रवत, साथ निभाने वाले रिश्ते का संकेत है।",
          },
          {
            en: "What weakens the reading: a line that bends down sharply at the end, an island in the middle, or several crossing strokes. None of these is a verdict — they show turbulence that the rest of the hand (a strong heart line, a steady head line) can often absorb.",
            hi: "कमज़ोर संकेत: अंत में तेज़ नीचे मुड़ती रेखा, बीच में द्वीप, या कई काटती लकीरें। इनमें से कोई भी फ़ैसला नहीं है — ये बदलाव का दौर दिखाते हैं, जिसे हाथ की बाक़ी बनावट (मज़बूत हृदय रेखा, स्थिर मस्तिष्क रेखा) अक्सर सँभाल लेती है।",
          },
        ],
      },
      {
        h: { en: "यदि विवाह की 2 रेखाएं हो तो क्या होगा?", hi: "यदि विवाह की 2 रेखाएं हो तो क्या होगा?" },
        p: [
          {
            en: "The classical reading is simple: two clear lines mean two significant partnerships in a lifetime. When one is light and the other deep, readers treat the light one as an early attachment or a serious relationship that did not become marriage, and the deep one as the marriage itself.",
            hi: "शास्त्रीय अर्थ सीधा है: दो साफ़ रेखाएँ जीवन में दो गंभीर साथ का संकेत देती हैं। जब एक हल्की और दूसरी गहरी हो, तो पाठक हल्की को शुरुआती लगाव या ऐसा गंभीर रिश्ता मानते हैं जो शादी तक नहीं पहुँचा, और गहरी को शादी।",
          },
          {
            en: "What it does not mean: two marriages for certain, or a broken home. Plenty of people with two lines marry once and stay married — the second line then represents a relationship that changed their life: a mentor, a business partner, or a deep friendship that shaped them.",
            hi: "और क्या नहीं मतलब: पक्का दो शादियाँ, या टूटा घर। दो रेखाओं वाले बहुत से लोग एक ही शादी करते हैं और निभाते हैं — तब दूसरी रेखा ऐसे रिश्ते का संकेत बनती है जिसने जीवन बदला: कोई मार्गदर्शक, व्यापारिक साथी, या गहरी मित्रता।",
          },
        ],
      },
      {
        h: { en: "Divorce line in palmistry — असल मतलब", hi: "Divorce line in palmistry — असल मतलब" },
        p: [
          {
            en: "A marriage line that breaks and then resumes, or one with a downward fork at its end, is traditionally linked with a separation or a long period of living apart. Readers describe it as relationship turbulence, not a written verdict, and never use it to scare anyone.",
            hi: "टूटकर फिर शुरू होती विवाह रेखा, या अंत में नीचे की ओर निकलती शाखा, परंपरा में अलगाव या लंबे समय तक दूरी से जोड़ी जाती है। पाठक इसे रिश्ते का उतार-चढ़ाव मानते हैं, लिखा हुआ फ़ैसला नहीं, और इसे किसी को डराने के लिए कभी इस्तेमाल नहीं करते।",
          },
          {
            en: "Two practical checks before believing any such reading: is the heart line healthy on both hands, and is the read line actually a clear marriage line rather than a children line or a minor skin crease? Most 'divorce line' claims collapse at this step.",
            hi: "ऐसी किसी भी रीडिंग पर भरोसा करने से पहले दो जाँच: दोनों हाथों में हृदय रेखा ठीक है या नहीं, और जिसे विवाह रेखा कहा जा रहा है वह वाक़ई विवाह रेखा है या संतान रेखा या कोई हल्की त्वचा-लकीर। 'डिवोर्स लाइन' के ज़्यादातर दावे इसी कदम पर टूट जाते हैं।",
          },
        ],
      },
      {
        h: { en: "शादी कब होगी? समय असल में कैसे देखा जाता है", hi: "शादी कब होगी? समय असल में कैसे देखा जाता है" },
        p: [
          {
            en: "Timing is judged by dropping a mental scale from the base of the little finger towards the heart line: the upper third is read as the early twenties, the middle as the late twenties, and the lower part as the thirties and beyond. A line closest to the heart line usually indicates a later, steadier marriage.",
            hi: "समय नापने के लिए कनिष्ठा के मूल से हृदय रेखा की ओर एक कल्पित पैमाना गिराते हैं: ऊपरी तिहाई शुरुआती बीस का दशक, बीच का हिस्सा बीस के अंत का, और निचला हिस्सा तीस के दशक और उसके बाद। हृदय रेखा के सबसे करीब वाली रेखा अक्सर देर से और स्थिर होने वाली शादी बताती है।",
          },
          {
            en: "Combine that with the dasha running in your kundli and you get a phase, not a date. Anyone quoting a marriage month from the palm alone is guessing confidently.",
            hi: "इसे कुंडली की चल रही दशा से मिलाएँ तो एक दौर मिलता है, तारीख़ नहीं। जो कोई सिर्फ़ हथेली से शादी का महीना बता दे, वह आत्मविश्वास से अंदाज़ा भर लगा रहा है।",
          },
        ],
      },
      {
        h: { en: "प्रेम विवाह या अरेंज? हाथ क्या दिखाता है", hi: "प्रेम विवाह या अरेंज? हाथ क्या दिखाता है" },
        p: [
          {
            en: "A marriage line that curves up towards the index finger (the Jupiter mount) is read as love marriage or a relationship you chose yourself. A straight line ending under the middle finger is read as a considered, family-supported match. A line bending towards the Mercury side suggests a partner met through work, college or social circles.",
            hi: "तर्जनी (गुरु पर्वत) की ओर ऊपर मुड़ती विवाह रेखा प्रेम विवाह या अपनी पसंद के रिश्ते का संकेत है। मध्यमा के नीचे सीधी ख़त्म होती रेखा सोच-समझकर और परिवार के सहयोग से हुए रिश्ते की ओर इशारा करती है। बुध की ओर मुड़ी रेखा कहती है कि साथी काम, कॉलेज या सामाजिक दायरे से मिला।",
          },
          {
            en: "All three are tendencies. Families, choices and timing still decide the outcome — the palm only describes the way the person is likely to walk into that decision.",
            hi: "तीनों झुकाव हैं। नतीजा अब भी परिवार, फ़ैसले और समय तय करते हैं — हथेली बस यह बताती है कि इंसान उस फ़ैसले तक जाने वाले रास्ते पर कैसे चलेगा।",
          },
        ],
      },
      {
        h: { en: "Partner prediction: जीवनसाथी के बारे में क्या पढ़ा जा सकता है", hi: "Partner prediction: जीवनसाथी के बारे में क्या पढ़ा जा सकता है" },
        p: [
          {
            en: "For an unmarried reader, the useful questions are practical: which directions or family backgrounds repeat in the reading, whether the partner's nature is calm or expressive, and whether the couple is likely to work together or in different fields. Palm lines, mounts and the seventh house of the kundli are read together for this.",
            hi: "अविवाहित पाठक के लिए काम के सवाल व्यावहारिक होते हैं: साथी की दिशा या पारिवारिक पृष्ठभूमि कैसी बार-बार दिखती है, स्वभाव शांत है या अभिव्यक्त करने वाला, और दोनों साथ काम करेंगे या अलग-अलग क्षेत्रों में। इसके लिए हाथ की रेखाएँ, पर्वत और कुंडली का सप्तम भाव साथ पढ़े जाते हैं।",
          },
          {
            en: "Hastrekha AI's ₹51 Pro report collects exactly this: the likely name syllable, nature, looks, direction, business-versus-job tendency and how the meeting is likely to happen — presented as indications to plan around, never as certainties.",
            hi: "हस्तरेखा AI की ₹51 वाली प्रो रिपोर्ट यही सब इकट्ठा करती है: नाम का संभावित अक्षर, स्वभाव, रूप, दिशा, नौकरी या व्यापार की प्रवृत्ति और मुलाक़ात कैसे हो सकती है — यह सब संकेत के रूप में, पक्की बात के रूप में कभी नहीं।",
          },
        ],
      },
    ],
    faqs: [
      {
        q: { en: "यदि विवाह की 2 रेखाएं हो तो क्या होगा?", hi: "यदि विवाह की 2 रेखाएं हो तो क्या होगा?" },
        a: {
          en: "Two clear marriage lines are read as two significant partnerships in life. If one is light and one deep, the light one usually means an early serious relationship that did not end in marriage. It does not mean two marriages are certain — plenty of such people marry once.",
          hi: "दो साफ़ विवाह रेखाएँ जीवन में दो गंभीर साथ मानी जाती हैं। एक हल्की और एक गहरी हो तो हल्की आमतौर पर शुरुआती गंभीर रिश्ता बताती है जो शादी तक नहीं पहुँचा। इसका मतलब पक्की दो शादियाँ नहीं — ऐसे बहुत से लोग एक ही शादी करते हैं।",
        },
      },
      {
        q: { en: "What does the best marriage line look like?", hi: "Best marriage line कैसी होती है?" },
        a: {
          en: "A clear, moderately deep line rising slightly towards the little finger is considered strongest. Depth shows emotional investment, and the upward lift shows a partnership that adds to your life. A long light line suggests a friendly marriage; a short deep one an intense private bond.",
          hi: "साफ़, मध्यम गहरी और कनिष्ठा की ओर हल्की उठती रेखा सबसे मज़बूत मानी जाती है। गहराई भावनात्मक जुड़ाव दिखाती है और ऊपर उठाव यह कि साथ जीवन में जोड़ता है। लंबी हल्की रेखा मित्रवत शादी बताती है; छोटी गहरी तीव्र और निजी जुड़ाव।",
        },
      },
      {
        q: { en: "Where is the divorce line on the hand?", hi: "Divorce line हाथ में कहाँ होती है?" },
        a: {
          en: "It is not a separate line but a pattern inside the marriage line: a break that restarts, a downward fork at the end, or an island in the middle. Readers treat it as turbulence or a period of distance, and always re-check it against the heart line before saying anything.",
          hi: "यह अलग रेखा नहीं, विवाह रेखा के भीतर का पैटर्न है: टूटकर फिर शुरू होना, अंत में नीचे की ओर शाखा, या बीच में द्वीप। पाठक इसे उतार-चढ़ाव या दूरी का दौर मानते हैं, और कुछ कहने से पहले हृदय रेखा से ज़रूर मिलाते हैं।",
        },
      },
      {
        q: { en: "Which palm line tells when I will get married?", hi: "शादी कब होगी, यह कौन सी रेखा बताती है?" },
        a: {
          en: "The marriage line's position gives the phase: the upper third of the edge is the early twenties, the middle the late twenties, and the part nearest the heart line the thirties onward. Combined with the dasha in your kundli it gives a period, not an exact month.",
          hi: "विवाह रेखा की जगह दौर बताती है: किनारे का ऊपरी तिहाई शुरुआती बीस का दशक, बीच का हिस्सा बीस के अंत का, और हृदय रेखा के सबसे करीब वाला हिस्सा तीस के बाद का। कुंडली की दशा के साथ मिलाने पर एक दौर मिलता है, सटीक महीना नहीं।",
        },
      },
      {
        q: { en: "Which hand should be read for marriage?", hi: "शादी के लिए कौन सा हाथ देखें?" },
        a: {
          en: "Read the active hand for what is actually happening now and the passive hand for the pattern you began with. The two are compared, and the reading is confirmed with the heart line and the kundli. Never judge a marriage question from one hand alone.",
          hi: "सक्रिय हाथ से वर्तमान स्थिति और निष्क्रिय हाथ से शुरुआती पैटर्न देखें। दोनों की तुलना की जाती है और रीडिंग को हृदय रेखा तथा कुंडली से मिलाया जाता है। शादी का सवाल कभी एक ही हाथ से तय न करें।",
        },
      },
    ],
    related: [PILLAR_LINK, "heart-line", "children-line", "fate-line"],
    keywords: ["palm reading vivah rekha", "marriage line palmistry", "best marriage line palmistry", "divorce line in palmistry", "यदि विवाह की 2 रेखाएं हो", "shaadi ki rekha"],
  },
];
