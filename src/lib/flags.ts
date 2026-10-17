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
 * - `"coming-soon"` — the paywall shows the full offer (anchor price, perks,
 *   close button) but the pay button only reports that payment options are
 *   being set up. Nothing is charged and nothing unlocks.
 * - `"upi"` — shows the UPI QR + reference-number (UTR) form and unlocks the
 *   reading (premium roadmap + PDF printing, or the book too for Ultra Pro)
 *   once a reference is submitted.
 *
 * Flip this to `"upi"` to start collecting, or swap the pay panel for a
 * gateway panel when one is available.
 */
export const PRO_PAY_MODE: "coming-soon" | "upi" = "coming-soon";

/**
 * One-time price of the Ultra Pro plan, in INR: everything in Pro plus the
 * "धनदायक तांत्रिक प्रयोग" book.
 *
 * The book link itself never sits in the client bundle — it lives in the
 * server-only `ULTRA_BOOK_URL` environment variable and is handed out by
 * /api/readings/[id]/book only when that reading is Ultra-unlocked.
 */
export const ULTRA_PRICE = 351;
