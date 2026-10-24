import type { Bi } from "./i18n";

/**
 * Copy for the Diwali Puja PDF Pro bonus. The actual Drive URL is deliberately
 * not in this file: it lives server-side in `diwali-pdf-url.ts` and is handed
 * out by /api/readings/[id]/diwali-puja only after a Pro unlock.
 */
export const DIWALI_OFFER = {
  badge: { en: "Pro bonus", hi: "प्रो बोनस" } satisfies Bi,
  eyebrow: { en: "Diwali 2026 · Pro exclusive", hi: "दिवाली 2026 · सिर्फ़ प्रो के लिए" } satisfies Bi,
  title: { en: "Sampurn Diwali Puja PDF", hi: "संपूर्ण दिवाली पूजा PDF" } satisfies Bi,
  sub: {
    en: "The complete traditional vidhi in one PDF — samagri list, Lakshmi-Ganesh puja steps, muhurat, mantras, aarti and visarjan. Free with Pro.",
    hi: "एक PDF में पूरी पारंपरिक विधि — सामग्री सूची, लक्ष्मी-गणेश पूजा क्रम, मुहूर्त, मंत्र, आरती और विसर्जन। प्रो के साथ मुफ़्त।",
  } satisfies Bi,
  bullets: [
    { en: "Step-by-step puja vidhi", hi: "चरण-दर-चरण पूजा विधि" },
    { en: "Complete samagri checklist", hi: "पूरी सामग्री सूची" },
    { en: "Mantras, aarti & visarjan", hi: "मंत्र, आरती व विसर्जन" },
  ] satisfies Bi[],
  cta: { en: "Get Pro & unlock the PDF", hi: "प्रो लें और PDF अनलॉक करें" } satisfies Bi,
  ctaFree: { en: "Start free reading", hi: "मुफ़्त रीडिंग शुरू करें" } satisfies Bi,
  ctaPricing: { en: "See Pro plan", hi: "प्रो प्लान देखें" } satisfies Bi,
  locked: {
    en: "The download button appears on your Pro-unlocked report.",
    hi: "डाउनलोड बटन आपकी प्रो-अनलॉक रिपोर्ट पर दिखेगा।",
  } satisfies Bi,
  download: { en: "Open the Diwali Puja PDF", hi: "दिवाली पूजा PDF खोलें" } satisfies Bi,
  opening: { en: "Opening…", hi: "खुल रहा है…" } satisfies Bi,
  private: {
    en: "Private Pro link — fetched server-side, not stored in the page source.",
    hi: "प्रो-प्राइवेट लिंक — सर्वर से मिलता है, पेज सोर्स में नहीं रहता।",
  } satisfies Bi,
  soon: {
    en: "The PDF link is being added right now. Your Pro unlock is already saved.",
    hi: "PDF का लिंक अभी जोड़ा जा रहा है। आपका प्रो अनलॉक सुरक्षित है।",
  } satisfies Bi,
  error: {
    en: "Could not fetch the PDF link just now — please try again in a moment.",
    hi: "PDF लिंक अभी नहीं मिल सका — कृपया थोड़ी देर बाद प्रयास करें।",
  } satisfies Bi,
} as const;
