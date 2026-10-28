import type { Bi } from "./i18n";

/**
 * Copy for the ₹99 Diwali Puja PDF add-on. The actual Drive URL is deliberately
 * not in this file: it lives server-side in `diwali-pdf-url.ts` and is handed
 * out by /api/readings/[id]/diwali-puja only after the add-on is unlocked.
 */
export const DIWALI_OFFER = {
  badge: { en: "₹99 add-on", hi: "₹99 ऐड-ऑन" } satisfies Bi,
  promoBadge: { en: "₹99 · Pro + PDF", hi: "₹99 · प्रो + PDF" } satisfies Bi,
  eyebrow: { en: "Diwali 2026", hi: "दिवाली 2026" } satisfies Bi,
  title: { en: "Sampurn Diwali Puja PDF", hi: "संपूर्ण दिवाली पूजा PDF" } satisfies Bi,
  sub: {
    en: "The complete traditional vidhi in one PDF — samagri list, Lakshmi-Ganesh puja steps, muhurat, mantras, aarti and visarjan. Add it to any report for ₹99.",
    hi: "एक PDF में पूरी पारंपरिक विधि — सामग्री सूची, लक्ष्मी-गणेश पूजा क्रम, मुहूर्त, मंत्र, आरती और विसर्जन। किसी भी रिपोर्ट के साथ ₹99 में जोड़ें।",
  } satisfies Bi,
  promoSub: {
    en: "The complete traditional vidhi in one PDF — samagri list, Lakshmi-Ganesh puja steps, muhurat, mantras, aarti and visarjan. On a locked report, ₹99 includes the Pro report plus this PDF; if Pro is already unlocked, add the PDF to that report for ₹99.",
    hi: "एक PDF में पूरी पारंपरिक विधि — सामग्री सूची, लक्ष्मी-गणेश पूजा क्रम, मुहूर्त, मंत्र, आरती और विसर्जन। लॉक रिपोर्ट पर ₹99 में प्रो रिपोर्ट और यह PDF दोनों मिलते हैं; प्रो पहले से अनलॉक हो तो यह PDF ₹99 में उसी रिपोर्ट में जोड़ें।",
  } satisfies Bi,
  bullets: [
    { en: "Step-by-step puja vidhi", hi: "चरण-दर-चरण पूजा विधि" },
    { en: "Complete samagri checklist", hi: "पूरी सामग्री सूची" },
    { en: "Mantras, aarti & visarjan", hi: "मंत्र, आरती व विसर्जन" },
  ] satisfies Bi[],
  cta: { en: "Add the PDF — ₹99", hi: "PDF जोड़ें — ₹99" } satisfies Bi,
  promoCta: { en: "Get Pro + PDF — ₹99", hi: "प्रो + PDF लें — ₹99" } satisfies Bi,
  ctaFree: { en: "Start free reading", hi: "मुफ़्त रीडिंग शुरू करें" } satisfies Bi,
  ctaPricing: { en: "See the ₹99 Diwali offer", hi: "₹99 दिवाली ऑफ़र देखें" } satisfies Bi,
  locked: {
    en: "Add the ₹99 Diwali Puja PDF to this report.",
    hi: "इस रिपोर्ट में ₹99 का दिवाली पूजा PDF जोड़ें।",
  } satisfies Bi,
  download: { en: "Open the Diwali Puja PDF", hi: "दिवाली पूजा PDF खोलें" } satisfies Bi,
  opening: { en: "Opening…", hi: "खुल रहा है…" } satisfies Bi,
  private: {
    en: "Private link — unlocked only for this report.",
    hi: "प्राइवेट लिंक — सिर्फ़ इसी रिपोर्ट के लिए अनलॉक।",
  } satisfies Bi,
  soon: {
    en: "The PDF link is being added right now. Your add-on is already saved.",
    hi: "PDF का लिंक अभी जोड़ा जा रहा है। आपका ऐड-ऑन सुरक्षित है।",
  } satisfies Bi,
  error: {
    en: "Could not fetch the PDF link just now — please try again in a moment.",
    hi: "PDF लिंक अभी नहीं मिल सका — कृपया थोड़ी देर बाद प्रयास करें।",
  } satisfies Bi,
} as const;
