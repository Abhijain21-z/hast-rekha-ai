"use client";

import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import { SectionHeading } from "@/components/ui";

type QA = { q: { en: string; hi: string }; a: { en: string; hi: string } };

// Plain, easy answers shown directly under each question — no dropdown, so the
// visitor never has to tap to read. Kept bilingual inline (en/hi).
const FAQS: QA[] = [
  {
    q: { en: "What does this website do?", hi: "यह वेबसाइट क्या करती है?" },
    a: {
      en: "You enter your name, birth date, time and place. We instantly make a full reading of your hand lines and your kundli — Rashi, Nakshatra, Lagna, life predictions and lucky years — in Hindi and English.",
      hi: "आप अपना नाम, जन्म तारीख, समय और जगह डालते हैं। हम तुरंत आपके हाथ की रेखाओं और कुंडली की पूरी रीडिंग बनाते हैं — राशि, नक्षत्र, लग्न, जीवन की भविष्यवाणियाँ और शुभ वर्ष — हिंदी और अंग्रेज़ी में।",
    },
  },
  {
    q: { en: "Is it free?", hi: "क्या यह निःशुल्क है?" },
    a: {
      en: "Yes. The full reading is completely free. Only the optional 5-year premium report costs ₹51, one time.",
      hi: "हाँ। पूरी रीडिंग बिल्कुल निःशुल्क है। सिर्फ़ वैकल्पिक 5-वर्षीय प्रीमियम रिपोर्ट का एक बार ₹51 लगता है।",
    },
  },
  {
    q: { en: "Do I have to upload a photo of my hand?", hi: "क्या हाथ की फ़ोटो डालना ज़रूरी है?" },
    a: {
      en: "No, it is optional. You get a complete reading from your birth details alone. If you add a palm photo, the hand-line part becomes more detailed.",
      hi: "नहीं, यह वैकल्पिक है। सिर्फ़ जन्म विवरण से भी पूरी रीडिंग मिल जाती है। अगर आप हथेली की फ़ोटो जोड़ते हैं तो हस्तरेखा वाला हिस्सा और विस्तृत हो जाता है।",
    },
  },
  {
    q: { en: "What if I don't know my exact birth time?", hi: "अगर मुझे सही जन्म समय नहीं पता तो?" },
    a: {
      en: "No problem. Just tick 'time unknown' and we use 12:00 noon. Your Rashi, Nakshatra and most predictions still work fine.",
      hi: "कोई बात नहीं। बस 'समय ज्ञात नहीं' चुनें, हम दोपहर 12:00 बजे का उपयोग करते हैं। आपकी राशि, नक्षत्र और ज़्यादातर भविष्यवाणियाँ फिर भी सही रहती हैं।",
    },
  },
  {
    q: { en: "What is in the ₹51 premium report?", hi: "₹51 प्रीमियम रिपोर्ट में क्या मिलता है?" },
    a: {
      en: "A year-by-year 5-year roadmap: what is likely to happen, mistakes to avoid, a simple remedy and a mantra for each year. You can download it as a PDF and keep it.",
      hi: "साल-दर-साल 5-वर्षीय रोडमैप: क्या होने की संभावना है, किन गलतियों से बचें, हर साल के लिए एक सरल उपाय और एक मंत्र। आप इसे PDF में डाउनलोड करके रख सकते हैं।",
    },
  },
  {
    q: { en: "How do I download the PDF?", hi: "PDF कैसे डाउनलोड करूँ?" },
    a: {
      en: "On your reading page, tap the Print button and choose 'Save as PDF'. The premium report has its own 'Print Full' button after you unlock it.",
      hi: "अपनी रीडिंग पेज पर प्रिंट बटन दबाएँ और 'Save as PDF' चुनें। प्रीमियम रिपोर्ट अनलॉक करने के बाद उसका अपना 'Print Full' बटन होता है।",
    },
  },
  {
    q: { en: "Is my data safe?", hi: "क्या मेरा डेटा सुरक्षित है?" },
    a: {
      en: "Yes. Your birth details are used only to make your reading. We do not sell your data to anyone.",
      hi: "हाँ। आपके जन्म विवरण का उपयोग केवल आपकी रीडिंग बनाने के लिए होता है। हम आपका डेटा किसी को नहीं बेचते।",
    },
  },
  {
    q: { en: "Is this real astrology or just an AI guess?", hi: "क्या यह असली ज्योतिष है या सिर्फ़ AI का अंदाज़ा?" },
    a: {
      en: "The predictions are built on classical rules and real astronomical calculations — not a random AI guess. AI was only used to help build and design the website itself.",
      hi: "भविष्यवाणियाँ शास्त्रीय नियमों और वास्तविक खगोलीय गणनाओं पर बनी हैं — किसी रैंडम AI अंदाज़े पर नहीं। AI का उपयोग केवल वेबसाइट बनाने और डिज़ाइन में मदद के लिए हुआ है।",
    },
  },
];

const fade = { initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-40px" } };

export default function FAQ() {
  const { lang } = useLang();
  const c: "en" | "hi" = lang === "en" ? "en" : "hi";

  return (
    <section id="faq" className="relative scroll-mt-20 py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="✦ FAQ"
          title={c === "hi" ? "अक्सर पूछे जाने वाले सवाल" : "Frequently Asked Questions"}
          sub={c === "hi" ? "छोटे और आसान जवाब — जो भी पूछना चाहते थे।" : "Short, simple answers to what you were wondering."}
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {FAQS.map((f, i) => (
            <motion.div
              key={f.q.en}
              {...fade}
              transition={{ duration: 0.4, delay: (i % 2) * 0.06 }}
              className="glass rounded-3xl p-6"
            >
              <h3 className="flex items-start gap-2.5 font-display text-lg leading-snug text-gold-200">
                <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-gold-300" />
                {f.q[c]}
              </h3>
              <p className="mt-3 pl-[1.9rem] text-sm leading-relaxed text-slate-300">{f.a[c]}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
