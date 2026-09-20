"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";

export const UPAY_BOOK_URL =
  "https://superprofile.bio/vp/💰-धनदायक-तांत्रिक-प्रयोग-अटका-धन--कर्ज-मुक्ति-व-व्यापार-वृद्धि-गुप्त-खजाना";

const PARAS = [
  "आपकी हस्तरेखा में धन संबंधी परेशानी, रिश्तों में तनाव, नौकरी में रुकावट या व्यापार में नुकसान जैसे संकेत दिखाई दे रहे हैं। लेकिन घबराने की जरूरत नहीं है।",
  "हस्तरेखा केवल संकेत देती है, लेकिन हर संकेत से जुड़े उपायों को यहाँ विस्तार से बताना संभव नहीं। इसी वजह से हमने एक ऐसी विशेष गुप्त पुस्तक तैयार की है, जिसमें धन, स्वास्थ्य, विवाह, नौकरी, व्यवसाय, समृद्धि और जीवन की अनेक समस्याओं से जुड़े पारंपरिक उपायों और विधियों का विस्तृत संकलन किया गया है।",
  "इस पुस्तक में आपको ऐसे अनेक उपायों के बारे में जानने को मिलेगा, जिनका उल्लेख पारंपरिक ज्ञान और मान्यताओं में मिलता है।",
  "हो सकता है, इस पुस्तक के आखिरी पन्ने तक पहुँचते-पहुँचते आपके मन से भी यही आवाज़ निकले—“काश, यह किताब मुझे पहले मिल गई होती…” 🔱",
];

const EXTRA = [
  "यह गुप्त पुस्तक आपके सामने आई है — इसका तात्पर्य है कि ब्रह्मांड भी चाहता है कि अब आपके जीवन से सभी समस्याएँ समाप्त हों। कई लोग इस पुस्तक को ignore कर देंगे, क्योंकि यह पुस्तक पाना सबके भाग्य में नहीं होता।",
  "धन-संबंधी तांत्रिक प्रयोग, साधना-विधियाँ और नियम — अटका हुआ धन, कर्ज मुक्ति और व्यापार वृद्धि के पारंपरिक उपायों का विशेष संकलन।",
];

export default function UpayBookPromo({ extra = false }: { extra?: boolean }) {
  const { L } = useLang();
  const paras = extra ? [...PARAS, ...EXTRA] : PARAS;
  return (
    <motion.a
      href={UPAY_BOOK_URL}
      target="_blank"
      rel="noopener noreferrer sponsored"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5 }}
      className="group mt-6 block overflow-hidden rounded-3xl border border-gold-400/40 bg-gradient-to-br from-red-950/60 via-cosmic-800/80 to-mystic-700/40 gold-glow transition hover:border-gold-400/70"
    >
      <div className="grid gap-6 p-6 sm:p-8 md:grid-cols-[1fr_240px] md:items-center">
        <div>
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-gold-300">
            <Sparkles className="h-3.5 w-3.5" /> गुप्त रहस्य · विशेष पुस्तक
          </p>
          <h3 className="mt-3 font-display text-2xl text-white sm:text-3xl">धनदायक तांत्रिक प्रयोग — गुप्त खजाना</h3>
          <div className="mt-4 space-y-3">
            {paras.map((p, i) => (
              <p key={i} className="text-sm leading-relaxed text-slate-200">{p}</p>
            ))}
          </div>
          <p className="mt-3 text-sm leading-relaxed font-semibold text-gold-200">तो अगर आप अपनी समस्या से जुड़े इन पारंपरिक उपायों के बारे में विस्तार से जानना चाहते हैं, तो इस विशेष पुस्तक को अभी जरूर देखें।</p>
          <span className="btn-gold mt-5 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm">
            अभी देखें और जानें →
          </span>
        </div>
        <div className="relative mx-auto w-full max-w-[240px]">
          <div className="absolute -inset-3 rounded-3xl bg-gold-400/20 blur-2xl transition group-hover:bg-gold-400/30" />
          <Image
            src="/images/upay-book.webp"
            alt="धनदायक तांत्रिक प्रयोग — गुप्त खजाना पुस्तक"
            width={480}
            height={720}
            className="relative rounded-2xl border border-gold-400/40 shadow-2xl transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </div>
    </motion.a>
  );
}
