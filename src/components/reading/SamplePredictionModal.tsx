"use client";

import { useState } from "react";
import { Briefcase, Crown, Gem, Heart, Sparkles, TrendingUp } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import { Modal } from "@/components/ui";
import { ProPaywallModal } from "./ProPaywall";

/**
 * A detailed, realistic sample of the Pro report. Shown from the free reading
 * page ("Sample prediction dekhein") so the reader can see exactly how deep the
 * paid analysis goes before buying. Deliberately labelled as a sample: the real
 * report is generated from the reader's own birth chart and palm.
 */

const YEARS: { year: string; en: string; hi: string; tone: "gold" | "rose" | "emerald" }[] = [
  {
    year: "2026",
    tone: "emerald",
    en: "A year of effort and skill-building. A job change now is premature — finish the course or certification you started. October brings a helpful mentor.",
    hi: "परिश्रम और कौशल सीखने का वर्ष। अभी नौकरी बदलना जल्दबाज़ी होगी — जो कोर्स या सर्टिफिकेशन शुरू किया है उसे पूरा करें। अक्टूबर में एक सहायक गुरु/मेंटर मिलेगा।",
  },
  {
    year: "2027",
    tone: "gold",
    en: "The breakthrough year. March–July is the strongest window for a promotion, a new offer or a business expansion. Keep your documents ready in February.",
    hi: "बड़ी सफलता का वर्ष। मार्च–जुलाई प्रमोशन, नई नौकरी या व्यापार विस्तार के लिए सबसे मजबूत समय है। फरवरी में अपने दस्तावेज़ तैयार रखें।",
  },
  {
    year: "2028",
    tone: "gold",
    en: "Income can nearly double. This is the right year to plan a property purchase or a long-term investment — avoid quick-money schemes.",
    hi: "आय लगभग दोगुनी हो सकती है। संपत्ति खरीदने या दीर्घकालिक निवेश की योजना के लिए यह सही वर्ष है — जल्दी पैसा कमाने वाली योजनाओं से बचें।",
  },
  {
    year: "2029",
    tone: "rose",
    en: "Stability after growth. Build your team, document your processes and keep risk low. A family responsibility increases.",
    hi: "विकास के बाद स्थिरता। अपनी टीम बनाएँ, काम की प्रक्रियाएँ लिखित रखें और जोखिम कम रखें। परिवार की ज़िम्मेदारी बढ़ेगी।",
  },
  {
    year: "2030",
    tone: "gold",
    en: "Leadership year. Starting your own venture or taking a senior role is favoured. Choose partners carefully in the first half.",
    hi: "नेतृत्व का वर्ष। अपना काम शुरू करना या वरिष्ठ पद लेना शुभ है। पहले छह महीनों में साझेदार चुनते समय सावधानी रखें।",
  },
];

const SAMPLE_COPY = {
  badge: { en: "Sample Pro prediction", hi: "सैंपल प्रो भविष्यवाणी" },
  title: { en: "What a Pro report actually looks like", hi: "प्रो रिपोर्ट असल में कैसी दिखती है" },
  sub: {
    en: "This is a sample. Your own report is built from your birth chart, moon sign and palm — with your name and exact timelines.",
    hi: "यह एक सैंपल है। आपकी असली रिपोर्ट आपकी कुंडली, चंद्र राशि और हस्तरेखा से बनती है — आपके नाम और सटीक समय-सीमा के साथ।",
  },
  career: { en: "Career & money — 5-year roadmap", hi: "करियर और धन — 5 वर्षीय रोडमैप" },
  love: { en: "Love & marriage", hi: "प्रेम और विवाह" },
  loveText: {
    en: "Venus in the 7th house with a friendly Jupiter aspect points to a caring, family-oriented partner. The strongest marriage window is 2027–2028; a relationship started in 2026 stabilises after the first year.",
    hi: "सप्तम भाव में शुक्र और गुरु की मैत्रीपूर्ण दृष्टि देखभाल करने वाले, परिवार-प्रेमी साथी की ओर संकेत करती है। विवाह का सबसे मजबूत समय 2027–2028 है; 2026 में शुरू हुआ रिश्ता पहले वर्ष के बाद स्थिर होता है।",
  },
  health: { en: "Health & energy", hi: "स्वास्थ्य और ऊर्जा" },
  healthText: {
    en: "Saturn's influence asks you to protect the knees and joints. A 20-minute morning walk, warm water and a calcium-rich diet keep energy steady through the year. Avoid late-night screens in the monsoon months.",
    hi: "शनि का प्रभाव घुटनों और जोड़ों की सुरक्षा मांगता है। सुबह 20 मिनट की सैर, गुनगुना पानी और कैल्शियम युक्त भोजन पूरे वर्ष ऊर्जा स्थिर रखते हैं। बरसात के महीनों में देर रात स्क्रीन से बचें।",
  },
  upay: { en: "Your personal upay", hi: "आपका व्यक्तिगत उपाय" },
  upayText: {
    en: "Friday: offer white flowers to Maa Lakshmi and light a ghee diya at the main entrance. Wear silver on the right hand. Recite the Shukra mantra 11 times on Fridays — “Om Shum Shukraya Namah”.",
    hi: "शुक्रवार: माँ लक्ष्मी को सफेद फूल चढ़ाएँ और मुख्य द्वार पर घी का दीपक जलाएँ। दाहिने हाथ में चाँदी पहनें। शुक्रवार को 11 बार शुक्र मंत्र बोलें — “ॐ शुं शुक्राय नमः”।",
  },
  disclaimer: {
    en: "Sample only. Your real Pro report uses your own chart, name and palm — the years, timings and remedies will be personal to you.",
    hi: "केवल सैंपल। आपकी असली प्रो रिपोर्ट आपकी कुंडली, नाम और हस्तरेखा से बनेगी — वर्ष, समय और उपाय आपके अपने होंगे।",
  },
  cta: { en: "Get my Pro report — ₹51", hi: "मेरी प्रो रिपोर्ट लें — ₹51" },
  bonus: { en: "Diwali Puja PDF free with Pro", hi: "प्रो के साथ दिवाली पूजा PDF मुफ़्त" },
} as const;

const TONE_CLASS: Record<"gold" | "rose" | "emerald", string> = {
  gold: "border-gold-400/35 bg-gold-400/[0.07] text-gold-100",
  rose: "border-rose-400/30 bg-rose-400/[0.06] text-rose-100",
  emerald: "border-emerald-400/30 bg-emerald-400/[0.06] text-emerald-100",
};

export default function SamplePredictionModal({
  open,
  onClose,
  readingId,
  onUnlocked,
}: {
  open: boolean;
  onClose: () => void;
  readingId: string;
  onUnlocked: () => void;
}) {
  const { L } = useLang();
  const [payOpen, setPayOpen] = useState(false);

  return (
    <>
      <Modal open={open} onClose={onClose} wide title={L(SAMPLE_COPY.title)}>
        <p className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-gold-300">
          <Sparkles className="h-4 w-4" /> {L(SAMPLE_COPY.badge)}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-slate-300">{L(SAMPLE_COPY.sub)}</p>

        <div className="mt-5 rounded-2xl border border-gold-400/25 bg-gradient-to-br from-gold-400/[0.08] via-cosmic-900/60 to-mystic-700/20 p-4 sm:p-5">
          <p className="flex items-center gap-2 font-display text-lg text-gold-200">
            <Briefcase className="h-5 w-5" /> {L(SAMPLE_COPY.career)}
          </p>
          <div className="mt-3 space-y-2">
            {YEARS.map((y) => (
              <div key={y.year} className={`rounded-xl border px-3 py-2.5 text-sm leading-relaxed ${TONE_CLASS[y.tone]}`}>
                <span className="mr-2 font-display text-base font-semibold">{y.year}</span>
                {L({ en: y.en, hi: y.hi })}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-rose-400/25 bg-rose-400/[0.05] p-4">
            <p className="flex items-center gap-2 text-sm font-semibold text-rose-200">
              <Heart className="h-4 w-4" /> {L(SAMPLE_COPY.love)}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-200">{L(SAMPLE_COPY.loveText)}</p>
          </div>
          <div className="rounded-2xl border border-emerald-400/25 bg-emerald-400/[0.05] p-4">
            <p className="flex items-center gap-2 text-sm font-semibold text-emerald-200">
              <TrendingUp className="h-4 w-4" /> {L(SAMPLE_COPY.health)}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-200">{L(SAMPLE_COPY.healthText)}</p>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-gold-400/25 bg-gold-400/[0.06] p-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-gold-200">
            <Gem className="h-4 w-4" /> {L(SAMPLE_COPY.upay)}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-200">{L(SAMPLE_COPY.upayText)}</p>
        </div>

        <p className="mt-4 text-xs italic leading-relaxed text-slate-400">{L(SAMPLE_COPY.disclaimer)}</p>

        <button
          type="button"
          onClick={() => setPayOpen(true)}
          className="btn-gold mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold"
        >
          <Crown className="h-4 w-4" /> {L(SAMPLE_COPY.cta)}
        </button>
        <p className="mt-2 text-center text-[11px] text-gold-200/80">🎁 {L(SAMPLE_COPY.bonus)}</p>
      </Modal>

      <ProPaywallModal
        key={payOpen ? "sample-pay" : "sample-closed"}
        open={payOpen}
        onClose={() => setPayOpen(false)}
        readingId={readingId}
        defaultPlan="pro"
        onUnlocked={() => {
          setPayOpen(false);
          onClose();
          onUnlocked();
        }}
      />
    </>
  );
}
