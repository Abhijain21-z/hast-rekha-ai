/**
 * Feature flags.
 *
 * BOOK_PROMO gates the "धनदायक तांत्रिक प्रयोग" affiliate book recommendation
 * (reading-page card, /upay page + navbar "उपाय" link, and the promo section
 * inside every blog).
 *
 * PDF_PAID gates the ₹51 "Download Complete PDF" flow (the button under every
 * prediction section, the paywall popup, and the gated print/PDF route).
 * Free visitors keep the whole on-screen reading; only the PDF download is paid.
 */
export const BOOK_PROMO = true;
export const PDF_PAID = true;

/** One-time price of the complete PDF report, in INR. */
export const PDF_PRICE = 51;

/**
 * Anchor price rendered struck through right next to PDF_PRICE, so the offer
 * reads "₹901 → ₹51". Purely presentational — nothing is ever charged ₹901.
 */
export const PDF_PRICE_ANCHOR = 901;

/**
 * How the ₹51 Pro gate collects payment.
 *
 * - `"upi"` — shows the UPI QR + UPI ID with a one-tap confirm unlock for the
 *   ₹51 Pro report (no UTR), and the reference-number (UTR) form for the ₹351
 *   Ultra Pro plan so the book link is only issued against a payment reference.
 * - `"coming-soon"` — the paywall shows the full offer (anchor price, perks,
 *   close button) but the pay button only reports that payment options are
 *   being set up. Nothing is charged and nothing unlocks.
 *
 * UPI is live. When a payment gateway (e.g. Cashfree) goes live, swap the pay
 * panel for a gateway panel and retire this flag branch.
 */
export const PRO_PAY_MODE: "coming-soon" | "upi" = "upi";

/**
 * Cashfree payment gateway — the primary checkout (UPI, cards, net banking).
 * The manual UPI QR + UTR panel stays underneath as a fallback.
 *
 * `NEXT_PUBLIC_*` because the paywall renders the gateway button on the client;
 * the server keys (CASHFREE_APP_ID / CASHFREE_SECRET_KEY) stay server-only.
 */
export const CASHFREE_ENABLED = process.env.NEXT_PUBLIC_CASHFREE_ENABLED === "1";
export const CASHFREE_MODE: "production" | "sandbox" =
  process.env.NEXT_PUBLIC_CASHFREE_MODE === "sandbox" ? "sandbox" : "production";

/**
 * Manual UPI collection (the direct Jio ID) for report unlocks is on hold while
 * the gateway handles payments. It is disabled whenever Cashfree is live, both
 * in the paywall UI and in the server-side unlock route, so a paid report can
 * never be opened by a hand-made "I have paid" request. Turning the gateway off
 * brings the manual fallback back for emergencies.
 */
export const MANUAL_UPI_ENABLED = !CASHFREE_ENABLED;

/**
 * One-time price of the Ultra Pro plan, in INR: everything in Pro plus the
 * "धनदायक तांत्रिक प्रयोग" book.
 *
 * The book link itself never sits in the client bundle — it lives in the
 * server-only `ULTRA_BOOK_URL` environment variable and is handed out by
 * /api/readings/[id]/book only when that reading is Ultra-unlocked.
 */
export const ULTRA_PRICE = 351;

/** ₹99 add-on: the complete Diwali Puja PDF (Pro report + PDF). */
export const DIWALI_PRICE = 99;

/** ₹199 launch bundle: Pro report + the Dhandayak book. */
export const BUNDLE_PRICE = 199;

/**
 * Show the ₹199 bundle instead of the ₹351 Ultra Pro card. The two offers
 * overlap, so only one is shown at a time; existing Ultra buyers keep access.
 */
export const BUNDLE_TEST = true;

/** ₹1,000 membership: a 30-day pass, not an auto-renewing subscription. */
export const MEMBERSHIP_PRICE = 1000;
export const MEMBERSHIP_DAYS = 30;
/** Fair use: at most this many Pro reports in a rolling 30-day window. */
export const MEMBERSHIP_REPORT_LIMIT = 30;
/** Saved profiles: self + four consented family members. */
export const MEMBERSHIP_PROFILE_LIMIT = 5;
/** Free accounts can keep a small family list; membership raises the cap. */
export const FREE_PROFILE_LIMIT = 2;
