/**
 * Discount codes. Client-safe: codes, percentages and copy only.
 *
 * The server never trusts a client-sent price — it re-resolves the code with
 * `findCoupon()` and recomputes the amount before creating the order.
 */

export interface Coupon {
  code: string;
  percentOff: number;
  label: { en: string; hi: string };
  /** Optional ISO timestamp; the code stops working after it. */
  endsAt?: string;
}

export const COUPONS: Record<string, Coupon> = {
  SAVE50: {
    code: "SAVE50",
    percentOff: 50,
    label: { en: "50% off on any plan", hi: "किसी भी प्लान पर 50% छूट" },
    endsAt: process.env.NEXT_PUBLIC_SAVE50_ENDS_AT || undefined,
  },
};

/** Case-insensitive lookup; returns null for unknown or expired codes. */
export function findCoupon(input: unknown): Coupon | null {
  if (typeof input !== "string") return null;
  const code = input.trim().toUpperCase();
  if (!code) return null;
  const coupon = COUPONS[code];
  if (!coupon) return null;
  if (coupon.endsAt) {
    const end = Date.parse(coupon.endsAt);
    if (Number.isFinite(end) && Date.now() > end) return null;
  }
  return coupon;
}

/** Final payable amount after the discount, never below ₹1. */
export function couponPrice(price: number, coupon: Coupon | null): number {
  if (!coupon) return price;
  return Math.max(1, Math.round(price * (1 - coupon.percentOff / 100)));
}

/** localStorage key the popup writes and the paywall reads. */
export const COUPON_STORAGE_KEY = "hr-coupon";
