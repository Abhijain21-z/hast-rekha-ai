import type { Metadata } from "next";
import UpayBookPromo from "@/components/upay/UpayBookPromo";

export const metadata: Metadata = {
  title: "उपाय — धनदायक तांत्रिक प्रयोग गुप्त पुस्तक | Upay — Hast Rekha AI",
  description:
    "धन, कर्ज मुक्ति, व्यापार वृद्धि, नौकरी, विवाह और जीवन की समस्याओं से जुड़े पारंपरिक तांत्रिक प्रयोग और साधना-विधियों का विशेष संकलन — गुप्त खजाना पुस्तक।",
  keywords: ["उपाय", "upay", "तांत्रिक प्रयोग", "धन प्राप्ति उपाय", "कर्ज मुक्ति", "व्यापार वृद्धि", "साधना विधि", "गुप्त खजाना", "tantrik prayog", "dhan prapti upay"],
};

const PROBLEMS = [
  { t: "अटका हुआ धन", d: "किसी से धन वापस नहीं मिल रहा, धन आते ही निकल जाता है, बचत नहीं हो पा रही।" },
  { t: "कर्ज का बोझ", d: "कर्ज बढ़ता जा रहा है, उधारी चुकाने का समय नहीं निकल रहा, महंगाई बर्दाश्त से बाहर है।" },
  { t: "व्यापार में नुकसान", d: "दुकान या व्यवसाय से लाभ नहीं, साझेदारी में धोखा, काम में बार-बार रुकावट।" },
  { t: "नौकरी में रुकावट", d: "मेहनत के बावजूद प्रमोशन नहीं, नौकरी जाने का डर, अच्छा अवसर नहीं मिल रहा।" },
  { t: "रिश्तों में तनाव", d: "घर में कलह, विवाह में बाधा, परिवार में मतभेद और मन शांत नहीं रहता।" },
  { t: "समृद्धि में कमी", d: "घर में सुख-शांति और ऐश्वर्य की कमी, प्रयास पूरे होते हुए भी फल नहीं मिलता।" },
];

export default function UpayPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400/90">✦ प्राचीन ज्ञान का खजाना</p>
        <h1 className="mt-3 font-display text-4xl text-white sm:text-5xl">उपाय — धनदायक तांत्रिक प्रयोग</h1>
        <p className="mx-auto mt-4 max-w-2xl text-slate-300">
          जीवन की समस्याओं के संकेत हस्तरेखा और कुंडली देती है — लेकिन हर संकेत से जुड़े समाधान ग्रंथों और पारंपरिक ज्ञान में छिपे हैं। इसी खोज में बनी है यह विशेष गुप्त पुस्तक।
        </p>
      </div>

      <UpayBookPromo extra />

      <section className="mt-14">
        <h2 className="font-display text-3xl text-white">किन समस्याओं के लिए यह पुस्तक है?</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {PROBLEMS.map((p) => (
            <div key={p.t} className="glass rounded-3xl p-6">
              <h3 className="font-display text-xl text-gold-200">{p.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="glass-strong mt-12 rounded-3xl p-6 sm:p-8">
        <h2 className="font-display text-2xl text-white">इस पुस्तक में क्या है?</h2>
        <ul className="mt-5 space-y-3 text-sm leading-relaxed text-slate-200">
          <li className="flex gap-3"><span className="text-gold-300">💰</span> धन से जुड़े गुप्त तांत्रिक प्रयोग — अटका धन वापस पाने और धन-वृद्धि के पारंपरिक उपाय</li>
          <li className="flex gap-3"><span className="text-gold-300">🕯️</span> साधना-विधियाँ और नियम — कब, कैसे और किस दिशा में साधना करें, पूरी विधि सहित</li>
          <li className="flex gap-3"><span className="text-gold-300">🔯</span> प्राचीन प्रयोगों में छिपे वास्तविक रहस्य — पीढ़ियों से संजोए गए पारंपरिक उपाय</li>
          <li className="flex gap-3"><span className="text-gold-300">🧰</span> जीवन में समृद्धि के विशेष उपाय — घर, व्यापार और व्यक्तिगत जीवन के लिए</li>
        </ul>
      </section>

      <section className="mt-12 rounded-3xl border border-gold-400/30 bg-gold-400/5 p-6 text-center sm:p-8">
        <p className="text-lg leading-relaxed text-gold-100">
          “यह गुप्त पुस्तक आपके सामने आई है — इसका तात्पर्य है कि ब्रह्मांड भी चाहता है कि अब आपके जीवन से सभी समस्याएँ समाप्त हों।”
        </p>
        <p className="mt-3 text-sm text-slate-300">कई लोग इस पुस्तक को ignore कर देंगे, क्योंकि यह पुस्तक पाना सबके भाग्य में नहीं होता। 🔱</p>
      </section>
    </div>
  );
}
