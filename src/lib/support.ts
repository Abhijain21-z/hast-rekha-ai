import { PDF_PRICE, ULTRA_PRICE } from "./flags";

/**
 * Direct WhatsApp help for a dropped or stuck payment.
 *
 * The number is the owner's support line. Keep it in one place so both the
 * paywall and the return page send the same prefilled message.
 */
const SUPPORT_WHATSAPP = (process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP || "919522333669").replace(/\D/g, "");
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.hastrekhaai.online").replace(/\/$/, "");

export type SupportPlan = "pro" | "ultra";

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

export function paymentHelpUrl(details: PaymentHelpDetails = {}) {
  const planLabel =
    details.plan === "ultra"
      ? `Ultra Pro (₹${ULTRA_PRICE})`
      : details.plan === "pro"
        ? `Pro (₹${PDF_PRICE})`
        : "";
  const issue =
    details.issue === "not_unlocked" || details.issue === "return_page"
      ? "Payment ke baad report unlock nahi hui."
      : "Payment checkout complete nahi hua / payment drop ho gaya.";

  const lines = [
    "Namaste Hast Rekha AI team 🙏",
    "Mujhe payment me technical problem aa rahi hai.",
    issue,
    planLabel ? `Plan: ${planLabel}` : "",
    typeof details.amount === "number" ? `Amount: ₹${details.amount}` : "",
    details.readingId ? `Reading: ${SITE_URL}/reading/${details.readingId}` : "",
    details.orderId ? `Order ID: ${details.orderId}` : "",
    details.phone ? `Mera WhatsApp number: ${details.phone}` : "",
    "Kripya payment QR/link bhejkar madad karein. Main abhi pay karna chahta hoon.",
  ].filter(Boolean);

  return `https://wa.me/${SUPPORT_WHATSAPP}?text=${encodeURIComponent(lines.join("\n"))}`;
}
