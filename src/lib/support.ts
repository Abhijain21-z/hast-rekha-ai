import { PLAN_PRICES, type PaidPlan } from "./plans";

/**
 * Direct WhatsApp help for a dropped or stuck payment.
 *
 * The number is the owner's support line. Keep it in one place so both the
 * paywall and the return page send the same prefilled message.
 */
const SUPPORT_WHATSAPP = (process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP || "919522333669").replace(/\D/g, "");
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.hastrekhaai.online").replace(/\/$/, "");

export type SupportPlan = PaidPlan;

const PLAN_LABEL: Record<PaidPlan, string> = {
  pro: "Pro report",
  diwali: "Pro report + Diwali Puja PDF",
  bundle: "Pro report + Dhandayak book",
  ultra: "Ultra Pro",
  membership: "30-day membership",
};

export interface PaymentHelpDetails {
  readingId?: string | null;
  plan?: SupportPlan | null;
  amount?: number | null;
  orderId?: string | null;
  phone?: string | null;
  /** What the visitor was doing when the payment failed. */
  issue?: "checkout_closed" | "not_unlocked" | "return_page";
}

export function supportWhatsAppNumber() {
  return SUPPORT_WHATSAPP;
}

/** Used when a Pro reader has used all 50 included AI Panditji chat minutes. */
export function chatQuotaHelpUrl() {
  const text = [
    "Namaste Hast Rekha AI team 🙏",
    "Mere Pro plan ke 50 AI Panditji chat minutes poore ho gaye hain.",
    "Aage chat ke liye 10 coins per minute lagte hain.",
    "Kripya batayein ki aur chat coins kaise le sakta hoon.",
  ].join("\n");
  return `https://wa.me/${SUPPORT_WHATSAPP}?text=${encodeURIComponent(text)}`;
}

export function paymentHelpUrl(details: PaymentHelpDetails = {}) {
  const planLabel = details.plan
    ? `${PLAN_LABEL[details.plan]} (₹${PLAN_PRICES[details.plan]})`
    : "";
  const issue =
    details.issue === "not_unlocked" || details.issue === "return_page"
      ? "Payment ke baad report unlock nahi hui."
      : "Payment checkout complete nahi hua / payment drop ho gaya.";

  const lines = [
    "Namaste Hast Rekha AI team 🙏",
    "Mera payment safaltapoorvak nahi ho paya, lekin meri premium kundali/report taiyar hai.",
    issue,
    planLabel ? `Plan: ${planLabel}` : "",
    typeof details.amount === "number" ? `Amount: ₹${details.amount}` : "",
    details.readingId ? `Reading: ${SITE_URL}/reading/${details.readingId}` : "",
    details.orderId ? `Order ID: ${details.orderId}` : "",
    details.phone ? `Mera WhatsApp number: ${details.phone}` : "",
    "Kripya meri premium kundali/report unlock karne me madad karein. Main abhi pay karna chahta hoon.",
  ].filter(Boolean);

  return `https://wa.me/${SUPPORT_WHATSAPP}?text=${encodeURIComponent(lines.join("\n"))}`;
}
