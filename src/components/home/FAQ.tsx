"use client";

import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import { SectionHeading } from "@/components/ui";
import { FAQS } from "@/content/faq";

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
          sub={
            c === "hi"
              ? "हर सवाल का जवाब नीचे ही लिखा है — कीमत, PDF, फ़ोटो, भाषा, सुरक्षा, भुगतान और भविष्यवाणी से जुड़े सारे सवाल।"
              : "Every answer is written right below its question — pricing, PDF, photo, languages, privacy, payment and accuracy."
          }
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
