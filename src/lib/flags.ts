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
