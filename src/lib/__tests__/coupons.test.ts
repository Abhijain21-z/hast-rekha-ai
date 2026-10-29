import { describe, expect, it } from "vitest";
import { couponPrice, findCoupon } from "../coupons";

describe("findCoupon", () => {
  it("accepts SAVE50 in any casing and with spaces", () => {
    expect(findCoupon("SAVE50")?.percentOff).toBe(50);
    expect(findCoupon(" save50 ")?.code).toBe("SAVE50");
  });

  it("rejects unknown, empty and non-string input", () => {
    expect(findCoupon("FREE100")).toBeNull();
    expect(findCoupon("")).toBeNull();
    expect(findCoupon(null)).toBeNull();
    expect(findCoupon(50)).toBeNull();
  });
});

describe("couponPrice", () => {
  it("halves every plan price", () => {
    expect(couponPrice(51, findCoupon("SAVE50"))).toBe(26);
    expect(couponPrice(199, findCoupon("SAVE50"))).toBe(100);
    expect(couponPrice(1000, findCoupon("SAVE50"))).toBe(500);
  });

  it("returns the list price without a coupon", () => {
    expect(couponPrice(199, null)).toBe(199);
  });

  it("never drops below ₹1", () => {
    expect(couponPrice(1, { code: "X", percentOff: 100, label: { en: "", hi: "" } })).toBe(1);
  });
});
