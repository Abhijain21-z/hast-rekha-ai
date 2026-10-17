import type { PalmPage } from "./types";

const PILLAR_LINK = "hast-rekha-palmistry";

/**
 * Third batch of line guides (sun, health and children lines).
 *
 * Written in the same house style as the first two batches: classical meaning
 * first, then the everyday reading, an honest note on limits, and FAQs that
 * mirror the questions readers actually ask.
 */
export const MORE_LINE_PAGES: PalmPage[] = [
  {
    slug: "sun-line",
    kind: "line",
    focus: { en: "Sun line (Surya Rekha) palmistry", hi: "सूर्य रेखा (Sun Line)" },
    title: {
      en: "Sun Line (Surya Rekha) — Fame And Success | Hastrekha AI",
      hi: "सूर्य रेखा (Sun Line) — Fame Ki Rekha | Hastrekha AI",
    },
    description: {
      en: "Sun line palmistry: surya rekha kahan hoti hai, fame ki rekha ke types, tooti sun line ka matlab aur success ke signs — free AI palm reading ke saath.",
      hi: "सूर्य रेखा (sun line) का मतलब: हाथ में fame ki rekha कहाँ होती है, सूर्य रेखा के प्रकार, टूटी सूर्य रेखा का अर्थ — आसान हिंदी में, फ्री AI reading के साथ।",
    },
    h1: {
      en: "Sun Line (Surya Rekha) — The Line Of Fame And Recognition",
      hi: "सूर्य रेखा (Sun Line) — हाथ में Fame और पहचान की रेखा",
    },
    crumb: { en: "Sun Line (Surya Rekha)", hi: "सूर्य रेखा (Sun Line)" },
    intro: [
      {
        en: "The sun line (surya rekha) is the vertical line that climbs towards the ring finger, over the mount of Sun. Indian palmistry also calls it the fame line: it is read about how recognition, appreciation and reputation arrive in a life — not as a promise of stardom.",
        hi: "सूर्य रेखा (sun line) वह रेखा है जो अनामिका के नीचे, सूर्य पर्वत पर से ऊपर की ओर चढ़ती है। इसे fame ki rekha या कीर्ति रेखा भी कहा जाता है — यह बताती है कि पहचान, तारीफ़ और नाम किस रास्ते से आते हैं, स्टार बनने का वादा यह कभी नहीं करती।",
      },
      {
        en: "On most hands the sun line is thin and partial. Readers judge it together with the sun mount itself, the fate line (direction of career), the Saturn mount (discipline) and the ring finger's length — a short line on a full mount usually reads stronger than a long line on a flat one.",
        hi: "ज़्यादातर हाथों में सूर्य रेखा पतली और आधी-अधूरी होती है। पाठक इसे सूर्य पर्वत, भाग्य रेखा (करियर की दिशा), शनि पर्वत (अनुशासन) और अनामिका की लंबाई के साथ पढ़ते हैं — भरे पर्वत पर छोटी रेखा अक्सर चपटे पर्वत की लंबी रेखा से ज़्यादा मज़बूत मानी जाती है।",
      },
      {
        en: "This page covers where the line sits, the six common forms, what a broken or doubled sun line traditionally means, why it is missing on many successful hands, and how to read your own in a minute.",
        hi: "इस पेज में आप पढ़ेंगे: रेखा ठीक कहाँ होती है, छह आम रूप, टूटी या दोहरी सूर्य रेखा का पारंपरिक अर्थ, कई कामयाब हाथों में यह क्यों नहीं होती, और एक मिनट में अपनी सूर्य रेखा कैसे पढ़ें।",
      },
    ],
    diagram: {
      line: "sun",
      alt: "surya rekha sun line palmistry diagram — fame ki rekha below the ring finger",
      caption: {
        en: "The sun line rises towards the ring finger from the lower palm — often branching off the fate line, sometimes starting near the heart line and climbing alone.",
        hi: "सूर्य रेखा हथेली के निचले हिस्से से अनामिका की ओर उठती है — अक्सर भाग्य रेखा से निकलकर, कभी हृदय रेखा के पास से अकेली चढ़ती हुई।",
      },
    },
    sections: [
      {
        h: { en: "सूर्य रेखा कहाँ होती है?", hi: "सूर्य रेखा कहाँ होती है?" },
        p: [
          {
            en: "Look at the column under the ring finger. A fine vertical line in that band, between the heart line and the base of the finger, is the sun line. It rarely runs the full height; on most palms it shows as one or two short strokes, or as a branch that leaves the fate line and leans towards the ring finger.",
            hi: "अनामिका के नीचे वाला हिस्सा देखें। हृदय रेखा और उंगली के मूल के बीच, उस पट्टी में दिखने वाली महीन खड़ी लकीर सूर्य रेखा है। यह पूरी ऊँचाई तक कम ही जाती है; ज़्यादातर हथेलियों में यह एक-दो छोटी लकीरों में, या भाग्य रेखा से निकलकर अनामिका की ओर झुकी शाखा के रूप में दिखती है।",
          },
          {
            en: "If you cannot see it, do not strain your eyes — photograph the palm in daylight and zoom into that column. Pale strokes that vanish under room light often appear clearly in a photo, and this is exactly how an AI palm reading finds them too.",
            hi: "अगर दिखाई न दे तो आँखें न दबाएँ — दिन की रोशनी में हथेली की फ़ोटो लें और उसी पट्टी को ज़ूम करें। कमरे की रोशनी में गायब होने वाली हल्की लकीरें फ़ोटो में अक्सर साफ़ दिखती हैं, और AI palm reading भी यही करती है।",
          },
        ],
      },
      {
        h: { en: "Fame ki rekha ke types — कैसी रेखा क्या कहती है", hi: "Fame ki rekha ke types — कैसी रेखा क्या कहती है" },
        p: [
          {
            en: "Read the starting point, the number of strokes and how cleanly the line rises. Classical readers treat a line that grows clearer with height as recognition that builds slowly and then stays; a line that fades near the top is read as fame that is earned and then enjoyed privately.",
            hi: "रेखा कहाँ से शुरू होती है, कितनी लकीरें हैं और कितनी सफ़ाई से ऊपर जाती है — यह देखें। परंपरा में ऊपर जाते हुए साफ़ होती रेखा को धीरे-धीरे बनने वाली और टिकने वाली पहचान माना जाता है; ऊपर फीकी पड़ती रेखा ऐसी पहचान बताती है जो कमाकर निजी जीवन में ही enjoy की जाती है।",
          },
        ],
        list: [
          { title: { en: "Rising from the fate line", hi: "भाग्य रेखा से उठती" }, text: { en: "Recognition comes through your main career — the most common and steady form.", hi: "पहचान आपके मुख्य करियर के ज़रिए मिलती है — सबसे आम और स्थिर रूप।" } },
          { title: { en: "Deep single line", hi: "गहरी अकेली रेखा" }, text: { en: "A clear public identity; people remember the name and the work together.", hi: "साफ़ सार्वजनिक पहचान; लोग नाम और काम दोनों एक साथ याद रखते हैं।" } },
          { title: { en: "Two or three strokes", hi: "दो-तीन लकीरें" }, text: { en: "Recognition across more than one field — work plus a side passion or community.", hi: "एक से ज़्यादा क्षेत्रों में पहचान — काम के साथ कोई शौक़ या समाज सेवा।" } },
          { title: { en: "Short, near the heart line", hi: "छोटी, हृदय रेखा के पास" }, text: { en: "Appreciation mainly among family, friends and a close circle.", hi: "तारीफ़ मुख्यतः परिवार, दोस्तों और करीबी दायरे में।" } },
          { title: { en: "Reaching the mount", hi: "पर्वत तक पहुँचती" }, text: { en: "Recognition that becomes a lasting reputation in later years.", hi: "पहचान जो आगे के वर्षों में टिकी हुई साख बन जाती है।" } },
          { title: { en: "Wavy or chain-like", hi: "लहरदार या ज़ंजीर जैसी" }, text: { en: "Recognition in phases — praise and silence taking turns; consistency is the lesson.", hi: "दौरों में पहचान — तारीफ़ और ठहराव बारी-बारी; निरंतरता ही सीख है।" } },
        ],
      },
      {
        h: { en: "टूटी या दो सूर्य रेखा का क्या मतलब है?", hi: "टूटी या दो सूर्य रेखा का क्या मतलब है?" },
        p: [
          {
            en: "A break in the sun line is traditionally read as a phase boundary, not a failure: a change of field, city or audience after which recognition has to be rebuilt. When a new stroke starts right after the break, the reading is 'recognition returns in a new form' — many teachers, coaches and creators show exactly this pattern.",
            hi: "सूर्य रेखा में टूटन को परंपरा में दौर बदलने का संकेत माना जाता है, असफलता नहीं: क्षेत्र, शहर या दर्शक बदलने के बाद पहचान फिर से बनानी पड़ती है। टूटन के तुरंत बाद नई लकीर शुरू हो तो अर्थ है 'पहचान नए रूप में लौटती है' — अध्यापकों, कोचों और creators में यह पैटर्न आम बताया जाता है।",
          },
          {
            en: "Two parallel sun lines are read as two audiences or two streams of appreciation — for example, a professional reputation plus a separate creative identity. An island on the line suggests a period where the person felt unrecognised despite working hard; readers look at the fate line to judge whether that phase was about effort or about the wrong platform.",
            hi: "दो समानांतर सूर्य रेखाएँ दो दर्शकों या तारीफ़ की दो धाराओं का संकेत हैं — जैसे पेशेवर साख के साथ अलग रचनात्मक पहचान। रेखा पर द्वीप (island) ऐसे दौर की ओर इशारा करता है जब मेहनत के बावजूद पहचान नहीं मिली; पाठक फिर भाग्य रेखा देखकर तय करते हैं कि वह दौर मेहनत की वजह से था या ग़लत मंच की वजह से।",
          },
        ],
      },
      {
        h: { en: "Sun line और karma: पहचान किस क्षेत्र में मिलेगी", hi: "Sun line और karma: पहचान किस क्षेत्र में मिलेगी" },
        p: [
          {
            en: "The old texts tie the sun line to art, teaching, performance and any work done in front of people. Modern readers widen that: approval of work — engineering praised in review, a shop loved by its lane, a blog that gets quoted. Read the mounts beside the line: a strong Mercury mount points to communication, Jupiter to leadership, Venus to beauty and service.",
            hi: "पुराने ग्रंथ सूर्य रेखा को कला, शिक्षा, मंच और लोगों के सामने किए जाने वाले काम से जोड़ते हैं। आधुनिक पाठक इसे व्यापक करते हैं: काम की सराहना — तारीफ़ पाने वाला इंजीनियर, मोहल्ले का चहेता दुकानदार, उद्धृत होने वाला ब्लॉग। रेखा के पास के पर्वत देखें: मज़बूत बुध पर्वत बोलने-लिखने की कला बताता है, गुरु पर्वत नेतृत्व, शुक्र पर्वत सुंदरता और सेवा।",
          },
          {
            en: "What the sun line never shows is the size of the stage. A modest line with a steady career and a happy circle is a complete reading; the line measures the direction of appreciation, not the loudness of it.",
            hi: "सूर्य रेखा कभी मंच का आकार नहीं बताती। स्थिर करियर और खुशहाल दायरे के साथ मामूली सूर्य रेखा भी पूरी रीडिंग है; यह रेखा तारीफ़ की दिशा नापती है, उसकी गूँज नहीं।",
          },
        ],
      },
      {
        h: { en: "सूर्य रेखा न हो तो क्या होता है?", hi: "सूर्य रेखा न हो तो क्या होता है?" },
        p: [
          {
            en: "Nothing bad. The sun line is the most frequently absent of all the major lines — a large share of hands simply do not show it clearly. Classical reading says such hands find satisfaction in the work itself rather than in being seen: quiet proficiency, family respect, work that speaks through results.",
            hi: "कुछ भी बुरा नहीं। सूर्य रेखा सबसे ज़्यादा गायब रहने वाली प्रमुख रेखा है — बहुत बड़ा हिस्सा ऐसे हाथों का है जिनमें यह साफ़ नहीं दिखती। शास्त्र कहता है ऐसे हाथ काम की तारीफ़ से ज़्यादा काम के भीतर संतोष पाते हैं: शांत निपुणता, परिवार में इज़्ज़त, और नतीजों से बोलने वाला काम।",
          },
          {
            en: "Also remember the reverse: a strong sun line with a weak fate line often reads as someone who is liked and praised but has not yet found the direction to convert that goodwill into steady work. Recognition without a channel stays a compliment.",
            hi: "उलटी बात भी याद रखें: मज़बूत सूर्य रेखा के साथ कमज़ोर भाग्य रेखा अक्सर ऐसे व्यक्ति की होती है जिसे लोग पसंद करते और सराहते हैं, पर अभी वह दिशा नहीं मिली जहाँ यह सराहना स्थिर काम में बदले। बिना रास्ते की तारीफ़ सिर्फ़ तारीफ़ रह जाती है।",
          },
        ],
      },
      {
        h: { en: "एक मिनट में अपनी सूर्य रेखा पढ़ें", hi: "एक मिनट में अपनी सूर्य रेखा पढ़ें" },
        p: [
          {
            en: "Start with the fate line: is there a clear direction of work? Then look at the sun column for strokes, breaks and their height. Finally compare both hands — a sun line that is stronger on the active hand is one of the most encouraging signs in palmistry, because it says the recognition grew through the person's own choices rather than birth setup.",
            hi: "शुरुआत भाग्य रेखा से करें: काम की साफ़ दिशा है या नहीं? फिर सूर्य की पट्टी में लकीरें, टूटन और उनकी ऊँचाई देखें। अंत में दोनों हाथ मिलाएँ — सक्रिय हाथ पर ज़्यादा मज़बूत सूर्य रेखा हस्तरेखा के सबसे उत्साहजनक संकेतों में एक है, क्योंकि इसका मतलब है कि पहचान जन्म की बनावट से नहीं, इंसान के अपने फ़ैसलों से बढ़ी है।",
          },
          {
            en: "A complete AI palm reading does this cross-check for you: it lines up the sun line with the fate line, the mounts and the other eleven life areas from one photo of your palm, and explains the result in plain Hindi or English.",
            hi: "पूरी AI palm reading यह तुलना आपके लिए कर देती है: हथेली की एक फ़ोटो से सूर्य रेखा को भाग्य रेखा, पर्वतों और बाक़ी ग्यारह जीवन-क्षेत्रों के साथ मिलाकर देखती है, और नतीजा आसान हिंदी या English में समझाती है।",
          },
        ],
      },
    ],
    faqs: [
      {
        q: { en: "Where is the sun line on the hand?", hi: "हाथ में सूर्य रेखा कहाँ होती है?" },
        a: {
          en: "In the column below the ring finger, between the heart line and the base of the finger, rising towards the mount of Sun. It is often short or split, and on many hands it appears as a branch of the fate line. Photograph the palm and zoom into that column to see it clearly.",
          hi: "अनामिका के नीचे वाली पट्टी में, हृदय रेखा और उंगली के मूल के बीच, सूर्य पर्वत की ओर उठती रेखा। यह अक्सर छोटी या टूटी होती है, और कई हाथों में भाग्य रेखा की शाखा के रूप में दिखती है। साफ़ देखने के लिए हथेली की फ़ोटो लेकर उसी हिस्से को ज़ूम करें।",
        },
      },
      {
        q: { en: "What does a broken sun line mean?", hi: "सूर्य रेखा टूटी हो तो क्या मतलब है?" },
        a: {
          en: "A break is read as a phase boundary rather than a bad sign: a change of field, city or audience after which recognition is rebuilt. If a fresh stroke starts right after the break, the classical reading is that appreciation returns in a new form — a fresh start, not an ending.",
          hi: "टूटन को बुरा संकेत नहीं, दौर बदलने का संकेत माना जाता है: क्षेत्र, शहर या दर्शक बदलने के बाद पहचान फिर से बनती है। टूटन के तुरंत बाद नई लकीर शुरू हो तो शास्त्रीय अर्थ है कि सराहना नए रूप में लौटती है — नई शुरुआत, अंत नहीं।",
        },
      },
      {
        q: { en: "What if there is no sun line on my palm?", hi: "सूर्य रेखा न हो तो क्या मतलब है?" },
        a: {
          en: "It means the reading of recognition sits in other features — the fate line, the mounts and the ring finger. Many people with calm, respected careers have no visible sun line. Classical reading links its absence with satisfaction taken from the work itself rather than from public praise.",
          hi: "इसका मतलब है कि पहचान की कहानी हाथ की दूसरी बनावटों में है — भाग्य रेखा, पर्वत और अनामिका। बहुत से शांत और इज़्ज़तदार करियर वाले लोगों में सूर्य रेखा दिखती ही नहीं। शास्त्र इसके न होने को सार्वजनिक तारीफ़ के बजाय काम से मिलने वाले संतोष से जोड़ता है।",
        },
      },
      {
        q: { en: "What is the difference between the sun line and the fate line?", hi: "सूर्य रेखा और भाग्य रेखा में क्या फर्क है?" },
        a: {
          en: "The fate line shows the direction of your career — where the work goes; the sun line shows how that work is received — recognition and reputation. That is why readers check them together: a strong fate line with a weak sun line often means solid work with little public visibility, and the opposite means praise without a stable channel.",
          hi: "भाग्य रेखा करियर की दिशा बताती है — काम किस ओर जाता है; सूर्य रेखा बताती है कि वह काम कैसे receive होता है — पहचान और साख। इसीलिए पाठक दोनों साथ देखते हैं: मज़बूत भाग्य रेखा के साथ कमज़ोर सूर्य रेखा अक्सर ठोस काम पर कम सार्वजनिक पहचान बताती है, और उलटा — बिना स्थिर रास्ते की तारीफ़।",
        },
      },
      {
        q: { en: "Can the sun line predict fame or money?", hi: "क्या सूर्य रेखा नाम या पैसा दिला सकती है?" },
        a: {
          en: "No line gives anything by itself. The sun line describes the route through which appreciation tends to arrive, while money is read from the dhan rekha and the fate line. Treat any palmist who promises fame or a fixed sum from one line as unreliable — consistent work and direction remain the deciding factors.",
          hi: "कोई रेखा अकेले कुछ नहीं देती। सूर्य रेखा बताती है कि सराहना किस रास्ते से आती है, और पैसा धन रेखा तथा भाग्य रेखा से पढ़ा जाता है। जो पामिस्ट एक रेखा से नाम या तय रकम का वादा करे, उसे भरोसेमंद न मानें — निरंतर काम और दिशा ही अंतिम निर्णायक हैं।",
        },
      },
    ],
    related: [PILLAR_LINK, "money-line", "fate-line", "palm-signs"],
    keywords: ["sun line palmistry", "surya rekha in palmistry", "हाथ में सूर्य रेखा", "fame ki rekha", "sun line meaning in hindi", "सूर्य रेखा फेम"],
  },
  {
    slug: "health-line",
    kind: "line",
    focus: { en: "Health line in palmistry", hi: "स्वास्थ्य रेखा (Health Line)" },
    title: {
      en: "Health Line Palmistry — Sehat Rekha Meaning | Hastrekha AI",
      hi: "स्वास्थ्य रेखा (Health Line) — Sehat Ki Rekha | Hastrekha AI",
    },
    description: {
      en: "Health line palmistry: sehat ki rekha kahan hoti hai, iske types, tooti ya chain jaisi line ka matlab aur jeevan rekha se fark — free AI palm reading.",
      hi: "स्वास्थ्य रेखा (health line) का मतलब: हाथ में sehat ki rekha कहाँ होती है, इसके प्रकार, टूटी या ज़ंजीर जैसी रेखा, जीवन रेखा से फर्क — आसान हिंदी में।",
    },
    h1: {
      en: "Health Line Palmistry — The Sehat Rekha On The Palm",
      hi: "स्वास्थ्य रेखा (Health Line) — हाथ में Sehat Ki Rekha कहाँ है",
    },
    crumb: { en: "Health Line (Swasthya Rekha)", hi: "स्वास्थ्य रेखा (Health Line)" },
    intro: [
      {
        en: "The health line — also called the Mercury line or liver line in old texts — is the line that rises diagonally from near the wrist or the life line towards the mount of Mercury, under the little finger. Palmistry reads it as the body's energy pattern: how you pace yourself, recover and handle daily strain.",
        hi: "स्वास्थ्य रेखा (health line) — पुराने ग्रंथों में इसे बुध रेखा या यकृत रेखा भी कहा जाता है — वह रेखा है जो कलाई के पास या जीवन रेखा से तिरछी होकर बुध पर्वत (कनिष्ठा के नीचे) की ओर उठती है। हस्तरेखा इसे शरीर की ऊर्जा का पैटर्न मानती है: आप अपनी ताक़त कैसे बाँटते हैं, कैसे recover करते हैं और रोज़ का दबाव कैसे उठाते हैं।",
      },
      {
        en: "Two honest rules first: the health line is not a medical report, and no line diagnoses a disease. Classic reading uses it for one practical question — is this hand's energy steady and self-managed, or does it burn hot and then need forced rest? Anything beyond that belongs to a doctor.",
        hi: "शुरुआत में दो ईमानदार नियम: स्वास्थ्य रेखा कोई मेडिकल रिपोर्ट नहीं है, और कोई रेखा बीमारी नहीं बताती। शास्त्र इससे एक ही व्यावहारिक सवाल पूछता है — इस हाथ की ऊर्जा स्थिर और सँभली हुई है, या बहुत ज़ोर लगाकर चलती है और फिर मजबूरी में आराम माँगती है? इससे आगे की हर बात डॉक्टर का काम है।",
      },
      {
        en: "Below: where the line sits, the five classical forms, what a break or a chain pattern traditionally means, how it differs from the life line and the fate line, and what a missing health line actually indicates.",
        hi: "आगे: रेखा कहाँ होती है, पाँच शास्त्रीय रूप, टूटन या ज़ंजीर जैसा पैटर्न पारंपरिक रूप से क्या बताता है, यह जीवन रेखा और भाग्य रेखा से कैसे अलग है, और स्वास्थ्य रेखा न होने का असल मतलब क्या है।",
      },
    ],
    diagram: {
      line: "health",
      alt: "health line palmistry diagram — swasthya rekha from the wrist towards the Mercury mount",
      caption: {
        en: "The health line climbs diagonally from the lower palm towards the mount of Mercury below the little finger — brushing the life line on many hands.",
        hi: "स्वास्थ्य रेखा हथेली के निचले हिस्से से तिरछी ऊपर, कनिष्ठा के नीचे बुध पर्वत की ओर चढ़ती है — कई हाथों में जीवन रेखा को छूती हुई।",
      },
    },
    sections: [
      {
        h: { en: "स्वास्थ्य रेखा कहाँ होती है?", hi: "स्वास्थ्य रेखा कहाँ होती है?" },
        p: [
          {
            en: "Start at the wrist, below the little finger, and follow the diagonal band up towards the Mercury mount. The line that travels through this band — sometimes starting from the life line itself, sometimes from the wrist edge — is the health line. It is usually thinner than the major lines, which is why it needs good light or a photograph.",
            hi: "कलाई से, कनिष्ठा के नीचे से शुरू करके तिरछी पट्टी को बुध पर्वत की ओर ऊपर ले जाएँ। इस पट्टी से गुज़रने वाली रेखा — कभी जीवन रेखा से निकलती, कभी कलाई के किनारे से — स्वास्थ्य रेखा है। यह आमतौर पर मुख्य रेखाओं से पतली होती है, इसीलिए इसे अच्छी रोशनी या फ़ोटो चाहिए।",
          },
          {
            en: "A common confusion: the health line is often mixed up with a strong travel line or with the upper section of the fate line. Before reading it, check that your stroke actually points towards the little finger side of the palm, not towards the middle finger.",
            hi: "एक आम भ्रम: स्वास्थ्य रेखा को अक्सर मज़बूत यात्रा रेखा या भाग्य रेखा के ऊपरी हिस्से से मिला दिया जाता है। पढ़ने से पहले जाँचें कि आपकी लकीर असल में हथेली के कनिष्ठा वाले किनारे की ओर जाती है, मध्यमा की ओर नहीं।",
          },
        ],
      },
      {
        h: { en: "Health line ke types — कैसी रेखा क्या बताती है", hi: "Health line ke types — कैसी रेखा क्या बताती है" },
        p: [
          {
            en: "The classical method reads five things: where the line starts, how deep it runs, whether it touches the life line, how it ends, and whether other lines repair it. A clean line that does not cut the life line is read as energy that runs parallel to life's duties without eating into them.",
            hi: "शास्त्रीय तरीक़ा पाँच बातें देखता है: रेखा कहाँ से शुरू होती है, कितनी गहरी चलती है, जीवन रेखा को छूती है या नहीं, कहाँ ख़त्म होती है, और बाक़ी रेखाएँ इसे कितना सँभालती हैं। जीवन रेखा को काटे बिना चलने वाली साफ़ रेखा ऐसी ऊर्जा बताती है जो जीवन के कामों के साथ-साथ चलती है, उन्हें खाती नहीं।",
          },
        ],
        list: [
          { title: { en: "Clear, unbroken line", hi: "साफ़, बिना टूटन वाली" }, text: { en: "Steady energy and a stable daily routine — the most balanced form.", hi: "स्थिर ऊर्जा और स्थिर दिनचर्या — सबसे संतुलित रूप।" } },
          { title: { en: "Chain or islands", hi: "ज़ंजीर या द्वीप" }, text: { en: "Recovering energy in phases; the reading asks for rest before the body demands it.", hi: "ऊर्जा दौरों में बनती है; रीडिंग शरीर के माँगने से पहले आराम की सलाह देती है।" } },
          { title: { en: "Touching the life line", hi: "जीवन रेखा को छूती" }, text: { en: "A period where workload and health compete; pacing becomes the life skill.", hi: "ऐसा दौर जब काम और सेहत आमने-सामने हैं; सही पेसिंग ही सबसे बड़ा हुनर बन जाता है।" } },
          { title: { en: "Rising but fading early", hi: "उठती पर जल्दी फीकी" }, text: { en: "Energy that is spent early in the day — more useful in the morning routine.", hi: "ऊर्जा दिन में जल्दी खर्च हो जाती है — सुबह की दिनचर्या ज़्यादा उपयोगी रहेगी।" } },
          { title: { en: "Multiple fine lines", hi: "कई महीन रेखाएँ" }, text: { en: "A sensitive system — traditional reading links it with worry and suggests calm routines.", hi: "संवेदनशील प्रकृति — परंपरा इसे चिंता से जोड़ती है और शांत दिनचर्या की ओर इशारा करती है।" } },
        ],
      },
      {
        h: { en: "टूटी स्वास्थ्य रेखा या ज़ंजीर जैसा पैटर्न", hi: "टूटी स्वास्थ्य रेखा या ज़ंजीर जैसा पैटर्न" },
        p: [
          {
            en: "Classical reading treats a break as a chapter of poor pace — a phase of overwork, travel or recovery — not as a verdict about the body. A line that resumes clearly after the break is read positively: the strength returned. A chain pattern is read as energy that fluctuates, which traditionally points at diet, sleep and workload before anything else.",
            hi: "शास्त्र टूटन को ग़लत पेसिंग के दौर के रूप में पढ़ता है — ज़्यादा काम, सफ़र या recovery का दौर — शरीर पर फ़ैसला नहीं। टूटन के बाद साफ़ शुरू होती रेखा सकारात्मक मानी जाती है: ताक़त लौट आई। ज़ंजीर जैसा पैटर्न घटती-बढ़ती ऊर्जा बताता है, जिसका पारंपरिक अर्थ है कि पहले खान-पान, नींद और काम का बोझ देखें।",
          },
          {
            en: "The honest framing that experienced readers keep: palmistry describes habits and tendencies, and habits are the one part of health a person can edit this week. Use a difficult-looking pattern as a nudge to fix sleep, not as a reason for fear.",
            hi: "अनुभवी पाठकों का ईमानदार नज़रिया यही है: हस्तरेखा आदतें और प्रवृत्तियाँ बताती है, और आदतें ही सेहत का वह हिस्सा हैं जिसे इंसान इसी हफ़्ते बदल सकता है। कठिन दिखने वाले पैटर्न को नींद सुधारने का इशारा मानें, डर की वजह नहीं।",
          },
        ],
      },
      {
        h: { en: "स्वास्थ्य रेखा और जीवन रेखा: फर्क क्या है", hi: "स्वास्थ्य रेखा और जीवन रेखा: फर्क क्या है" },
        p: [
          {
            en: "The life line is the long curve that wraps the thumb — classical hands read it as the general vitality and the shape of a life's journey. The health line is the diagonal towards the little finger and is read as the day-to-day energy pattern: schedule, stress, recovery. One describes the road, the other describes the fuel.",
            hi: "जीवन रेखा अंगूठे को घेरती लंबी वक्र रेखा है — शास्त्र इसे सामान्य जीवन-शक्ति और जीवन-यात्रा का आकार मानता है। स्वास्थ्य रेखा कनिष्ठा की ओर जाती तिरछी रेखा है और इसे रोज़मर्रा की ऊर्जा का पैटर्न माना जाता है: दिनचर्या, तनाव, recovery। एक सड़क बताती है, दूसरी ईंधन।",
          },
          {
            en: "In practice readers also glance at the fate line: a healthy health line with a heavily broken fate line often means the person is physically fine but emotionally loaded by work changes. The body line stays clean; the strain sits in the career line.",
            hi: "व्यवहार में पाठक भाग्य रेखा भी देखते हैं: सेहत की रेखा ठीक हो पर भाग्य रेखा बहुत टूटी हो, तो अक्सर मतलब है कि शरीर ठीक है पर काम के बदलावों ने मन पर बोझ डाला है। शरीर की रेखा साफ़ रहती है; थकान करियर रेखा में बैठती है।",
          },
        ],
      },
      {
        h: { en: "स्वास्थ्य रेखा न हो तो क्या मतलब है?", hi: "स्वास्थ्य रेखा न हो तो क्या मतलब है?" },
        p: [
          {
            en: "It is genuinely common for healthy hands to show no clear health line. Old texts read it as energy without friction: the body does not send visible signals because the routine already suits it. Readers do not treat the absence as a bad sign — in fact many teachers call a hand without a health line 'an easy hand to live in'.",
            hi: "स्वस्थ हाथों में साफ़ स्वास्थ्य रेखा न होना वाक़ई आम है। पुराने ग्रंथ इसे बिना रगड़ की ऊर्जा मानते हैं: शरीर कोई दिखने वाला संकेत नहीं भेजता क्योंकि दिनचर्या उसे सूट करती है। पाठक इसके न होने को बुरा संकेत नहीं मानते — बहुत से शिक्षक तो ऐसे हाथ को 'जीने में आसान हाथ' कहते हैं।",
          },
          {
            en: "What deserves attention instead: on a hand with no health line, a heavily chained life line or a crowded, dull Mercury mount is what readers cross-check — and even then the advice stays the same: water, sleep, walk, checkup.",
            hi: "इसके बदले क्या देखें: जिस हाथ में स्वास्थ्य रेखा न हो, वहाँ ज़ंजीर जैसी जीवन रेखा या भरा-भरा और फीका बुध पर्वत पाठक cross-check करते हैं — और तब भी सलाह वही रहती है: पानी, नींद, चहलक़दमी, जाँच।",
          },
        ],
      },
      {
        h: { en: "एक मिनट में अपनी स्वास्थ्य रेखा पढ़ें", hi: "एक मिनट में अपनी स्वास्थ्य रेखा पढ़ें" },
        p: [
          {
            en: "Mark the starting point (wrist, life line, or mid-palm), then walk your eye up: does the line stay single and clear, or split into chain links? Note whether it crosses the life line — if it does, classical reading asks you to protect sleep first. Then compare both hands: the passive hand shows your born energy pattern, the active hand shows what your routine has done to it.",
            hi: "शुरुआती बिंदु चिह्नित करें (कलाई, जीवन रेखा, या हथेली के बीच), फिर नज़र ऊपर ले जाएँ: रेखा अकेली और साफ़ रहती है या ज़ंजीर जैसी टूटती है? देखें कि यह जीवन रेखा को काटती है या नहीं — अगर काटती है तो शास्त्रीय पढ़ाई पहले नींद सुधारने को कहती है। फिर दोनों हाथ मिलाएँ: निष्क्रिय हाथ जन्म का ऊर्जा-पैटर्न दिखाता है, सक्रिय हाथ बताता है कि आपकी दिनचर्या ने उसका क्या किया।",
          },
          {
            en: "An AI palm reading reads the health line as part of the full twelve-area report — energy, routine, career load and family duties together — and unlike a single-line guess it flags honest limits: what is habit, and what simply needs a doctor's visit.",
            hi: "AI palm reading स्वास्थ्य रेखा को पूरी बारह-क्षेत्रों वाली रिपोर्ट का हिस्सा बनाकर पढ़ती है — ऊर्जा, दिनचर्या, करियर का बोझ और परिवार की ज़िम्मेदारियाँ एक साथ — और अकेली रेखा के अंदाज़े से अलग, यह ईमानदार सीमाएँ भी बताती है: क्या आदत का सवाल है, और कब डॉक्टर के पास जाना ही सही है।",
          },
        ],
      },
    ],
    faqs: [
      {
        q: { en: "Where is the health line on the palm?", hi: "हथेली में स्वास्थ्य रेखा कहाँ होती है?" },
        a: {
          en: "It runs diagonally from the lower palm — near the wrist or branching from the life line — up towards the mount of Mercury below the little finger. On many hands it is faint, so a daylight photo zoomed into that diagonal band shows it far better than room light.",
          hi: "यह हथेली के निचले हिस्से — कलाई के पास या जीवन रेखा से निकलकर — से तिरछी ऊपर बुध पर्वत (कनिष्ठा के नीचे) की ओर जाती है। कई हाथों में यह हल्की होती है, इसलिए दिन की रोशनी में ली गई फ़ोटो उस तिरछी पट्टी को ज़ूम करके देखना कमरे की रोशनी से कहीं बेहतर है।",
        },
      },
      {
        q: { en: "What does a broken health line mean?", hi: "स्वास्थ्य रेखा टूटी हो तो क्या मतलब है?" },
        a: {
          en: "Classical reading treats a break as a phase of strain — overwork, travel or recovery — not as a diagnosis. A line that restarts clearly after the break traditionally shows returning strength. A chained, islanded line points at fluctuating energy, and the practical advice is always the same: sleep, food and workload.",
          hi: "शास्त्र टूटन को तनाव के दौर के रूप में पढ़ता है — ज़्यादा काम, सफ़र या recovery — कोई निदान नहीं। टूटन के बाद साफ़ शुरू होती रेखा पारंपरिक रूप से लौटती ताक़त दिखाती है। ज़ंजीर जैसी रेखा घटती-बढ़ती ऊर्जा की ओर इशारा करती है, और व्यावहारिक सलाह हमेशा वही रहती है: नींद, खाना और काम का बोझ।",
        },
      },
      {
        q: { en: "Does the health line show illness?", hi: "क्या स्वास्थ्य रेखा बीमारी बताती है?" },
        a: {
          en: "No. No palm line diagnoses anything, and any reader who names a disease from the hand is overstepping. The health line is traditionally used to describe energy patterns and daily pacing. For anything medical, the correct step is a licensed doctor — palmistry is a traditional, entertainment-based guide, not a health check.",
          hi: "नहीं। कोई हस्तरेखा किसी बीमारी का निदान नहीं करती, और हाथ से रोग का नाम बता देने वाला पाठक अपनी हद से आगे जा रहा है। स्वास्थ्य रेखा परंपरा में ऊर्जा के पैटर्न और दिनचर्या बताने के लिए है। किसी भी मेडिकल बात के लिए सही कदम योग्य डॉक्टर के पास जाना है — हस्तरेखा एक पारंपरिक, मनोरंजन आधारित मार्गदर्शन है, हेल्थ चेकअप नहीं।",
        },
      },
      {
        q: { en: "What if there is no health line on the hand?", hi: "स्वास्थ्य रेखा न हो तो क्या होता है?" },
        a: {
          en: "It usually means the hand carries its energy without visible friction — the classical reading is a routine that already suits the person. Many healthy hands show no health line at all. Its absence is never read as illness, and readers simply continue with the life line, fate line and mounts.",
          hi: "आमतौर पर इसका मतलब है कि हाथ बिना दिखने वाली रगड़ के ही अपनी ऊर्जा चलाता है — शास्त्रीय अर्थ: ऐसी दिनचर्या जो व्यक्ति को सूट करती है। बहुत से स्वस्थ हाथों में स्वास्थ्य रेखा दिखती ही नहीं। इसके न होने को कभी बीमारी नहीं माना जाता, पाठक आगे जीवन रेखा, भाग्य रेखा और पर्वतों से पढ़ाई पूरी करते हैं।",
        },
      },
      {
        q: { en: "Health line vs life line — what is the difference?", hi: "स्वास्थ्य रेखा और जीवन रेखा में क्या फर्क है?" },
        a: {
          en: "The life line is the long curve around the thumb, read for overall vitality and the arc of life events. The health line is the diagonal towards the little-finger side, read for day-to-day energy, stress and recovery. Where they touch or cross, traditional reading looks at periods when workload and wellbeing had to be rebalanced.",
          hi: "जीवन रेखा अंगूठे को घेरती लंबी वक्र रेखा है, जिसे सामान्य जीवन-शक्ति और जीवन-घटनाओं के लिए पढ़ा जाता है। स्वास्थ्य रेखा कनिष्ठा की ओर जाती तिरछी रेखा है, जो रोज़ की ऊर्जा, तनाव और recovery बताती है। जहाँ ये छूती या काटती हैं, वहाँ परंपरा ऐसे दौर देखती है जब काम और सेहत को फिर से संतुलित करना पड़ा।",
        },
      },
    ],
    related: [PILLAR_LINK, "life-line", "sun-line", "palm-signs"],
    keywords: ["health line palmistry", "स्वास्थ्य रेखा", "sehat ki rekha", "health line meaning in hindi", "mercury line palmistry", "swasthya rekha in hand"],
  },
  {
    slug: "children-line",
    kind: "line",
    focus: { en: "Children line in palmistry", hi: "संतान रेखा (Children Line)" },
    title: {
      en: "Children Line In Palmistry — Santan Rekha | Hastrekha AI",
      hi: "संतान रेखा (Children Line) — Bachcha Rekha | Hastrekha AI",
    },
    description: {
      en: "Children line in palmistry: santan rekha kahan hoti hai, kitne bachche honge kaise dekha jata hai aur beta ya beti ka sach — honest Hindi guide, free AI.",
      hi: "संतान रेखा (children line) का मतलब: हाथ में सन्तान रेखा कहाँ होती है, बच्चों की संख्या कैसे देखी जाती है और बेटा-बेटी का सच क्या है — ईमानदार हिंदी गाइड।",
    },
    h1: {
      en: "Children Line In Palmistry — The Santan Rekha On The Hand",
      hi: "संतान रेखा (Children Line) — हाथ में Santan Ki Rekha कहाँ है",
    },
    crumb: { en: "Children Line (Santan Rekha)", hi: "संतान रेखा (Children Line)" },
    intro: [
      {
        en: "The children line (santan rekha) is the set of fine vertical strokes on the outer edge of the palm below the little finger, standing on the marriage line like small posts. Classical Indian palmistry reads them for the chapters of parenthood — how many, the spacing, and the nature of each bond.",
        hi: "संतान रेखा (santan rekha) हथेली के बाहरी किनारे पर, कनिष्ठा के नीचे दिखने वाली महीन खड़ी लकीरें हैं, जो विवाह रेखा पर छोटे खंभों की तरह खड़ी होती हैं। शास्त्रीय भारतीय हस्तरेखा इन्हें माता-पिता बनने के अध्यायों के लिए पढ़ती है — संख्या, अंतर, और हर रिश्ते की प्रकृति।",
      },
      {
        en: "This is also the most misread line in popular palmistry. Old books count strokes and announce a number; modern honest readers do the opposite — they read the lines for pattern and mood, and say plainly that family size is not written on any hand as a guarantee.",
        hi: "यह लोकप्रिय हस्तरेखा में सबसे ज़्यादा ग़लत पढ़ी जाने वाली रेखा भी है। पुरानी किताबें लकीरें गिनकर संख्या बता देती हैं; आज के ईमानदार पाठक उलटा करते हैं — रेखाओं से पैटर्न और माहौल पढ़ते हैं, और सीधे कहते हैं कि संतान की संख्या किसी हाथ पर गारंटी के रूप में नहीं लिखी होती।",
      },
      {
        en: "Below: exactly where the lines sit, how classical counting works, why the boy-or-girl claim fails, the five common patterns and what each traditionally says about the parent-child bond.",
        hi: "आगे: रेखाएँ ठीक कहाँ होती हैं, शास्त्रीय गिनती कैसे होती है, बेटा-बेटी का दावा क्यों नहीं टिकता, पाँच आम पैटर्न, और हर पैटर्न माता-पिता और संतान के रिश्ते के बारे में पारंपरिक रूप से क्या कहता है।",
      },
    ],
    diagram: {
      line: "children",
      alt: "santan rekha children line palmistry diagram — bachchon ki rekha under the little finger",
      caption: {
        en: "Children lines are the fine vertical strokes standing on the marriage line, on the edge below the little finger. Count only the clear ones and read their length and depth.",
        hi: "संतान रेखाएँ विवाह रेखा पर खड़ी महीन खड़ी लकीरें हैं, कनिष्ठा के नीचे वाले किनारे पर। सिर्फ़ साफ़ दिखने वाली रेखाएँ गिनें और उनकी लंबाई तथा गहराई पढ़ें।",
      },
    },
    sections: [
      {
        h: { en: "संतान रेखा कहाँ होती है?", hi: "संतान रेखा कहाँ होती है?" },
        p: [
          {
            en: "Turn the palm sideways and look at the edge below the little finger, just under the marriage line. Short vertical strokes rising from it are the children lines. On a photograph, zoom into that edge: they are among the finest marks on the hand and are usually invisible at arm's length.",
            hi: "हथेली को किनारे की ओर मोड़कर कनिष्ठा के नीचे वाला किनारा देखें, विवाह रेखा के ठीक नीचे। उससे ऊपर उठती छोटी खड़ी लकीरें संतान रेखाएँ हैं। फ़ोटो में उसी किनारे को ज़ूम करें: ये हाथ की सबसे महीन रेखाओं में हैं और सामान्य दूरी से दिखती ही नहीं।",
          },
          {
            en: "Two cautions before you count. First, skin creases at the edge are not lines — a crease vanishes when you gently stretch the skin, a children line stays. Second, some hands show the pattern not on the marriage line but floating slightly above it; readers accept both, but never mix them with the marriage lines themselves.",
            hi: "गिनने से पहले दो सावधानियाँ। पहली, किनारे की त्वचा-सिलवटें रेखाएँ नहीं हैं — त्वचा हल्की खींचने पर सिलवट गायब हो जाती है, संतान रेखा बनी रहती है। दूसरी, कुछ हाथों में यह पैटर्न विवाह रेखा पर नहीं, उससे थोड़ा ऊपर दिखता है; पाठक दोनों मानते हैं, पर इन्हें विवाह रेखाओं से कभी नहीं मिलाते।",
          },
        ],
      },
      {
        h: { en: "कितने बच्चे होंगे? शास्त्र की गिनती असल में कैसी है", hi: "कितने बच्चे होंगे? शास्त्र की गिनती असल में कैसी है" },
        p: [
          {
            en: "The classical rule is simple to state: stand the clear vertical strokes on the marriage line, count the distinct ones, and read the deepest stroke as the strongest bond. Traditional books then assign a number. The honest part usually gets left out: those same books were written before family planning, and every teacher worth listening to today treats the count as a tendency, never as a forecast of your family.",
            hi: "शास्त्रीय नियम कहना आसान है: विवाह रेखा पर खड़ी साफ़ लकीरें गिनें और सबसे गहरी लकीर को सबसे मज़बूत बंधन मानें। पुरानी किताबें इससे संख्या निकाल देती हैं। पर जो बात अक्सर छूट जाती है: वे किताबें परिवार-नियोजन से पहले लिखी गईं, और आज सुनने लायक हर शिक्षक इस गिनती को प्रवृत्ति मानता है, आपके परिवार का पूर्वानुमान कभी नहीं।",
          },
          {
            en: "What the count is actually good for: seeing rhythm. Lines close together are read as children in a short span; lines that fade and restart suggest gaps due to career, health or personal timing. Neither pattern is better — they simply describe how the family chapter is paced.",
            hi: "गिनती असल में किस काम की है: लय देखने के। एक-दूसरे के बहुत करीब की रेखाएँ कम समय के अंतर में संतान का संकेत देती हैं; फीकी पड़कर फिर शुरू होती रेखाएँ करियर, सेहत या निजी समय की वजह से अंतर बताती हैं। कोई पैटर्न दूसरे से बेहतर नहीं — ये बस बताते हैं कि परिवार का अध्याय किस लय में चला।",
          },
        ],
      },
      {
        h: { en: "बेटा या बेटी: संतान रेखा से लिंग नहीं तय होता", hi: "बेटा या बेटी: संतान रेखा से लिंग नहीं तय होता" },
        p: [
          {
            en: "Many old books claim deep lines mean sons and light lines mean daughters. There is no reliable basis for this, and rivers of ink have been spilled on the contradictions: the same pattern is described differently by different schools. Any reader who confidently announces the gender of an unborn child from the hand is guessing, and you should say so.",
            hi: "कई पुरानी किताबें कहती हैं गहरी रेखा बेटा और हल्की रेखा बेटी बताती है। इसका कोई भरोसेमंद आधार नहीं है, और इसी पर स्याही की नदियाँ बही हैं: एक जैसे पैटर्न को अलग-अलग परंपराएँ अलग-अलग बताती हैं। जो पाठक हथेली से होने वाले बच्चे का लिंग पक्के तौर पर बता दे, वह अनुमान लगा रहा है — और यह सीधे कह देना चाहिए।",
          },
          {
            en: "What decent teachers do read instead: the quality of the bond. A long clear line is traditionally read as a child who stays close; a short deep one as a strong but independent nature; a forked or bent line as a bond with busy phases that always returns.",
            hi: "अच्छे शिक्षक इसके बजाय रिश्ते की गुणवत्ता पढ़ते हैं। लंबी साफ़ रेखा परंपरा में ऐसी संतान का संकेत है जो करीब रहती है; छोटी गहरी रेखा मज़बूत पर स्वतंत्र स्वभाव बताती है; काँटे जैसी या मुड़ी रेखा ऐसा बंधन दिखाती है जिसमें व्यस्त दौर आते हैं पर लौटा हमेशा जाता है।",
          },
        ],
      },
      {
        h: { en: "संतान रेखा के पाँच आम पैटर्न", hi: "संतान रेखा के पाँच आम पैटर्न" },
        p: [
          {
            en: "Pattern reading is more useful than counting, because it speaks about relationships rather than arithmetic. These are the five forms classical reading describes, with the everyday meaning teachers attach to them.",
            hi: "गिनती से ज़्यादा उपयोगी पैटर्न पढ़ना है, क्योंकि यह बात रिश्तों की करता है, जोड़-घटाव की नहीं। शास्त्र ये पाँच रूप बताता है, और शिक्षक इनका रोज़मर्रा का अर्थ इस तरह बताते हैं।",
          },
        ],
        list: [
          { title: { en: "Two clear lines", hi: "दो साफ़ रेखाएँ" }, text: { en: "Traditionally read as two children or two strong child-figures in life, with different natures.", hi: "परंपरा में दो संतान या जीवन में बच्चों जैसे दो मज़बूत रिश्ते — दोनों स्वभाव अलग।" } },
          { title: { en: "One deep, one faint", hi: "एक गहरी, एक हल्की" }, text: { en: "One close bond for sure; the faint line is read as a bond that may or may not grow into full form.", hi: "एक बंधन पक्का और करीबी; हल्की रेखा ऐसा रिश्ता जो पूरी शक्ल में आ भी सकता है और नहीं भी।" } },
          { title: { en: "Very short strokes", hi: "बहुत छोटी लकीरें" }, text: { en: "Bonds that play out in short, bright chapters — guests, students, nephews and nieces.", hi: "छोटे पर चमकदार अध्यायों में निभने वाले रिश्ते — मेहमान, छात्र-छात्राएँ, भतीजे-भाँजे।" } },
          { title: { en: "Wavy line", hi: "लहरदार रेखा" }, text: { en: "An energetic, restless child is the traditional image — the parent's job is steady ground.", hi: "परंपरा में ऊर्जावान और बेचैन संतान का चित्र — माता-पिता का काम ठोस ज़मीन देना है।" } },
          { title: { en: "Line turning towards the palm", hi: "हथेली की ओर मुड़ती रेखा" }, text: { en: "A child who returns home in phases; the bond leans on communication, not distance.", hi: "ऐसी संतान जो दौरों में घर लौटती है; बंधन दूरी पर नहीं, बातचीत पर टिकता है।" } },
        ],
      },
      {
        h: { en: "संतान रेखा और विवाह रेखा का रिश्ता", hi: "संतान रेखा और विवाह रेखा का रिश्ता" },
        p: [
          {
            en: "The children lines stand on the marriage line, so readers always read the pair: which life chapter does the child light up? A child line rising from the first marriage line is read as a bond from that chapter; lines that float between two marriage lines are read with more caution, and honest readers say the placement cannot answer questions the rest of the hand does not confirm.",
            hi: "संतान रेखाएँ विवाह रेखा पर ही खड़ी होती हैं, इसलिए पाठक जोड़ी में पढ़ते हैं: संतान जीवन के किस अध्याय में आती है? पहली विवाह रेखा से उठती संतान रेखा उसी अध्याय का बंधन बताती है; दो विवाह रेखाओं के बीच तैरती रेखाओं को ज़्यादा सतर्कता से पढ़ा जाता है, और ईमानदार पाठक मानते हैं कि जगह भर से वे सवाल तय नहीं होते जिन्हें हाथ की बाक़ी बनावट न पुष्ट करे।",
          },
          {
            en: "Family-planning reality also matters in modern reading: adoption, chosen families and stepchildren all sit in these lines for contemporary readers, because the classical count never distinguished them. The bond is the subject; the biology is not.",
            hi: "आज की पढ़ाई में परिवार की असलियत भी मायने रखती है: गोद लेना, चुने हुए परिवार और सौतेले रिश्ते — आधुनिक पाठक इन सबको इन्हीं रेखाओं में पढ़ते हैं, क्योंकि शास्त्रीय गिनती ने इनमें कभी फर्क नहीं किया। विषय बंधन है; जीव-विज्ञान नहीं।",
          },
        ],
      },
      {
        h: { en: "एक मिनट में अपनी संतान रेखा पढ़ें", hi: "एक मिनट में अपनी संतान रेखा पढ़ें" },
        p: [
          {
            en: "Photograph the outer edge in daylight, stretch the skin slightly, and zoom. Count only strokes that survive the stretch. Note their length, depth and where each stands on the marriage line. Then read the pattern into words — close-set or spaced, deep or light — and hold the count loosely.",
            hi: "दिन की रोशनी में बाहरी किनारे की फ़ोटो लें, त्वचा हल्की खींचें और ज़ूम करें। सिर्फ़ वही लकीरें गिनें जो खींचने पर भी बनी रहें। उनकी लंबाई, गहराई और विवाह रेखा पर उनकी जगह नोट करें। फिर पैटर्न को शब्दों में पढ़ें — पास-पास या दूर-दूर, गहरी या हल्की — और गिनती को हल्के हाथ से पकड़ें।",
          },
          {
            en: "A full AI palm reading reads the children lines together with the marriage line, the heart line and the family signs on the Venus mount, and presents the result as traits and tendencies with the honest caveat that no hand measures a family. Free, from one palm photo.",
            hi: "पूरी AI palm reading संतान रेखाओं को विवाह रेखा, हृदय रेखा और शुक्र पर्वत के पारिवारिक चिह्नों के साथ पढ़ती है, और नतीजा स्वभाव व प्रवृत्ति के रूप में देती है — इस ईमानदार चेतावनी के साथ कि कोई हाथ परिवार नापता नहीं। एक हथेली की फ़ोटो से, फ्री।",
          },
        ],
      },
    ],
    faqs: [
      {
        q: { en: "Where are children lines on the hand?", hi: "हाथ में संतान रेखा कहाँ होती है?" },
        a: {
          en: "On the outer edge of the palm below the little finger, standing vertically on the marriage line. They are among the finest marks on the hand — photograph the edge in daylight, stretch the skin slightly and zoom, because skin creases vanish on stretching while real lines stay.",
          hi: "हथेली के बाहरी किनारे पर, कनिष्ठा के नीचे, विवाह रेखा पर खड़ी महीन लकीरें। ये हाथ की सबसे बारीक रेखाओं में हैं — दिन की रोशनी में किनारे की फ़ोटो लें, त्वचा हल्की खींचकर ज़ूम करें, क्योंकि सिलवटें खींचने पर गायब हो जाती हैं और असली रेखाएँ रहती हैं।",
        },
      },
      {
        q: { en: "Can palmistry tell how many children I will have?", hi: "क्या हस्तरेखा बता सकती है कि कितने बच्चे होंगे?" },
        a: {
          en: "Traditional reading counts the clear strokes on the marriage line, but honest readers treat that as a tendency, not a forecast. Family size depends on health, choices and planning — things no line controls. Use the count to read the rhythm of the family chapter, never as a number you can rely on.",
          hi: "परंपरा विवाह रेखा पर साफ़ लकीरें गिनती है, पर ईमानदार पाठक इसे प्रवृत्ति मानते हैं, पूर्वानुमान नहीं। परिवार का आकार सेहत, फ़ैसलों और योजना पर निर्भर है — जिन्हें कोई रेखा नियंत्रित नहीं करती। गिनती से परिवार के अध्याय की लय पढ़ें, भरोसेमंद संख्या कभी नहीं।",
        },
      },
      {
        q: { en: "Can the children line tell if it will be a boy or a girl?", hi: "क्या संतान रेखा से बेटा या बेटी पता चलता है?" },
        a: {
          en: "No. The claim that deep lines mean sons and light lines mean daughters has no reliable basis, and old books contradict each other on it. A reader who announces the gender of an unborn child from the palm is guessing. Palmistry is best used for the nature of the bond, not for biology.",
          hi: "नहीं। गहरी रेखा बेटा और हल्की रेखा बेटी — इस दावे का कोई भरोसेमंद आधार नहीं है, और पुरानी किताबें इसमें एक-दूसरे से उलटी बातें कहती हैं। जो पाठक हथेली से होने वाले बच्चे का लिंग बता दे, वह अनुमान लगा रहा है। हस्तरेखा रिश्ते की प्रकृति के लिए बेहतर है, जीव-विज्ञान के लिए नहीं।",
        },
      },
      {
        q: { en: "What if there are no children lines on my palm?", hi: "संतान रेखा न हो तो क्या मतलब है?" },
        a: {
          en: "It means the reading should not lean on these fine strokes at all. Plenty of parents have hands with no visible children lines, and plenty of people with clear lines choose not to have children. Readers then use the marriage line, the Venus mount and the whole hand to talk about family bonds.",
          hi: "इसका मतलब है कि इन बारीक रेखाओं पर रीडिंग टिकानी ही नहीं चाहिए। बहुत से माता-पिता के हाथों में संतान रेखाएँ साफ़ नहीं दिखतीं, और बहुत से साफ़ रेखा वाले लोग संतान न करने का फ़ैसला लेते हैं। पाठक फिर विवाह रेखा, शुक्र पर्वत और पूरे हाथ से पारिवारिक बातें पढ़ते हैं।",
        },
      },
      {
        q: { en: "Which hand should be read for children lines?", hi: "संतान रेखा के लिए कौन सा हाथ देखें?" },
        a: {
          en: "Read the active hand for what is happening in your family life now and the passive hand for the original pattern. Where the two agree, readers speak with more confidence; where they differ, they describe a change — usually a bond that has grown or a chapter that is still forming.",
          hi: "सक्रिय हाथ से वर्तमान पारिवारिक जीवन और निष्क्रिय हाथ से शुरुआती पैटर्न देखें। जहाँ दोनों मिलते हैं, पाठक ज़्यादा भरोसे से बोलते हैं; जहाँ अंतर है, वहाँ बदलाव दिखता है — आमतौर पर ऐसा बंधन जो गहरा हुआ है या अध्याय जो अभी बन रहा है।",
        },
      },
    ],
    related: [PILLAR_LINK, "marriage-line", "health-line", "palm-signs"],
    keywords: ["children line in palmistry", "संतान रेखा", "santan rekha", "how many children palmistry", "bachchon ki rekha in hand", "कितने बच्चे होंगे हाथ देखकर"],
  },
];
