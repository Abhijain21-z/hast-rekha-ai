import { SITE_URL } from "./site";
import { BUNDLE_PRICE, DIWALI_PRICE, PDF_PRICE } from "./flags";

/**
 * Pro-plan follow-up copy shared by the owner's one-tap WhatsApp page and the
 * automated (template-based) sender.
 *
 * The text is deliberately plain: prices, what each plan includes, one link.
 * Keep it free of secrets so it can also be built on the client.
 */

/** Where the message sends readers. UTM tags keep the click source visible. */
export function proFollowUpUrl(): string {
  const url = new URL("/pricing", SITE_URL);
  url.searchParams.set("utm_source", "whatsapp");
  url.searchParams.set("utm_medium", "followup");
  url.searchParams.set("utm_campaign", "pro_followup");
  return url.toString();
}

/** Plain-text message used for the owner's one-tap wa.me links. */
export function buildProFollowUpMessage(name: string): string {
  const firstName = (name || "").trim().split(/\s+/)[0] || "जी";
  const link = proFollowUpUrl();

  return [
    `नमस्ते ${firstName} जी 🙏`,
    "",
    "आपकी फ्री हस्तरेखा रिपोर्ट तैयार है। अब आप अपनी पूरी ज़िंदगी की जानकारी ले सकते हैं।",
    "",
    `🔱 PRO Plan — ₹${PDF_PRICE} (एक बार)`,
    "• 5 साल की विस्तृत भविष्यवाणी",
    "• जीवनसाथी / पार्टनर विश्लेषण",
    "• आपके लिए व्यक्तिगत उपाय",
    "• पूरी PDF रिपोर्ट डाउनलोड",
    "• 200 AI पंडितजी चैट टोकन",
    "",
    `📚 ₹${BUNDLE_PRICE} Plan — Pro + पुस्तक`,
    "• Pro की सभी सुविधाएँ",
    "• 900+ तंत्र-मंत्र-साधना पुस्तकें (रुद्रयामल तंत्र, रावण संहिता, शाबर मंत्र, भैरव सिद्धि...)",
    "",
    `🎁 ₹${DIWALI_PRICE} Plan — Pro + दिवाली पूजा PDF`,
    "",
    `पूरी जानकारी और पेमेंट के लिए यहाँ देखें 👉 ${link}`,
    "",
    "मैसेज बंद करने के लिए STOP लिखें।",
  ].join("\n");
}

/** `wa.me` deep link that opens WhatsApp with the message pre-filled. */
export function buildWhatsAppChatUrl(phone: string, message: string): string {
  const digits = (phone || "").replace(/\D/g, "");
  const ten = digits.length > 10 ? digits.slice(-10) : digits;
  const intl = ten.length === 10 ? `91${ten}` : digits;
  return `https://wa.me/${intl}?text=${encodeURIComponent(message)}`;
}
