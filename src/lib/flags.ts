/**
 * Feature flags.
 *
 * BOOK_PROMO gates the "धनदायक तांत्रिक प्रयोग" affiliate book recommendation
 * (reading-page card, /upay page + navbar "उपाय" link, and the promo section
 * inside every blog) plus the ₹51 print gate.
 *
 * Kept OFF during Google AdSense review: paid "money-attracting" remedy claims
 * risk being flagged as get-rich-quick / unreliable claims. After AdSense
 * approval, flip this to `true` to re-enable everything at once. When you turn
 * it back on, keep the claims soft and add a "परिणाम की गारंटी नहीं" disclaimer.
 */
export const BOOK_PROMO = false;
