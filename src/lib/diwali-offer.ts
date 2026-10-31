import type { Bi } from "./i18n";

/**
 * Copy for the Diwali Puja PDF. From 2026-10-31 the PDF is included with every
 * report plan — the ₹51 Pro report now carries it as a Diwali gift. The actual
 * Drive URL is deliberately not in this file: it lives server-side in
 * `diwali-pdf-url.ts` and is handed out by /api/readings/[id]/diwali-puja only
 * after Pro is unlocked.
 */
export const DIWALI_OFFER = {
  badge: { en: "Included with Pro", hi: "प्रो में शामिल" } satisfies Bi,
  promoBadge: { en: "Pro gift · ₹51", hi: "प्रो गिफ्ट · ₹51" } satisfies Bi,
  eyebrow: { en: "Diwali 2026", hi: "दिवाली 2026" } satisfies Bi,
  title: { en: "Sampurn Diwali Puja PDF", hi: "संपूर्ण दिवाली पूजा PDF" } satisfies Bi,
  sub: {
    en: "The complete traditional vidhi in one PDF — samagri list, Lakshmi-Ganesh puja steps, muhurat, mantras, aarti and visarjan. Now included free with the ₹51 Pro report.",
    hi: "एक PDF में पूरी पारंपरिक विधि — सामग्री सूची, लक्ष्मी-गणेश पूजा क्रम, मुहूर्त, मंत्र, आरती और विसर्जन। अब ₹51 की प्रो रिपोर्ट के साथ मुफ़्त शामिल।",
  } satisfies Bi,
  promoSub: {
    en: "The complete traditional vidhi in one PDF — samagri list, Lakshmi-Ganesh puja steps, muhurat, mantras, aarti and visarjan. This Diwali, it comes free with every ₹51 Pro report.",
    hi: "एक PDF में पूरी पारंपरिक विधि — सामग्री सूची, लक्ष्मी-गणेश पूजा क्रम, मुहूर्त, मंत्र, आरती और विसर्जन। इस दिवाली, हर ₹51 की प्रो रिपोर्ट के साथ मुफ़्त।",
  } satisfies Bi,
  bullets: [
    { en: "Step-by-step puja vidhi", hi: "चरण-दर-चरण पूजा विधि" },
    { en: "Complete samagri checklist", hi: "पूरी सामग्री सूची" },
    { en: "Mantras, aarti & visarjan", hi: "मंत्र, आरती व विसर्जन" },
  ] satisfies Bi[],
  cta: { en: "Unlock Pro — ₹51", hi: "प्रो अनलॉक करें — ₹51" } satisfies Bi,
  promoCta: { en: "Get Pro + PDF — ₹51", hi: "प्रो + PDF लें — ₹51" } satisfies Bi,
  ctaFree: { en: "Start free reading", hi: "मुफ़्त रीडिंग शुरू करें" } satisfies Bi,
  ctaPricing: { en: "See the Pro plans", hi: "प्रो प्लान देखें" } satisfies Bi,
  locked: {
    en: "The Diwali Puja PDF is included with Pro (₹51). Unlock Pro to open it.",
    hi: "दिवाली पूजा PDF प्रो (₹51) में शामिल है। खोलने के लिए प्रो अनलॉक करें।",
  } satisfies Bi,
  download: { en: "Open the Diwali Puja PDF", hi: "दिवाली पूजा PDF खोलें" } satisfies Bi,
  opening: { en: "Opening…", hi: "खुल रहा है…" } satisfies Bi,
  private: {
    en: "Private link — unlocked only for this report.",
    hi: "प्राइवेट लिंक — सिर्फ़ इसी रिपोर्ट के लिए अनलॉक।",
  } satisfies Bi,
  soon: {
    en: "The PDF link is being added right now. Your Pro report is already saved.",
    hi: "PDF का लिंक अभी जोड़ा जा रहा है। आपकी प्रो रिपोर्ट सुरक्षित है।",
  } satisfies Bi,
  error: {
    en: "Could not fetch the PDF link just now — please try again in a moment.",
    hi: "PDF लिंक अभी नहीं मिल सका — कृपया थोड़ी देर बाद प्रयास करें।",
  } satisfies Bi,
} as const;
