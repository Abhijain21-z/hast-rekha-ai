import { createHmac } from "crypto";
import { describe, expect, it } from "vitest";
import { verifyCashfreeSignature } from "../cashfree";

const SECRET = "test_secret_key";
const BODY = '{"type":"PAYMENT_SUCCESS_WEBHOOK","data":{"order":{"order_id":"hr_pro_123"},"payment":{"payment_status":"SUCCESS"}}}';
const TIMESTAMP = "1789999999";
const SIGNATURE = createHmac("sha256", SECRET).update(TIMESTAMP + BODY).digest("base64");

describe("verifyCashfreeSignature", () => {
  it("accepts a signature built from the raw body and timestamp", () => {
    expect(verifyCashfreeSignature({ rawBody: BODY, timestamp: TIMESTAMP, signature: SIGNATURE, secret: SECRET })).toBe(true);
  });

  it("rejects a tampered body", () => {
    const tampered = BODY.replace("hr_pro_123", "hr_pro_999");
    expect(verifyCashfreeSignature({ rawBody: tampered, timestamp: TIMESTAMP, signature: SIGNATURE, secret: SECRET })).toBe(false);
  });

  it("rejects a wrong secret, missing timestamp or malformed signature", () => {
    expect(verifyCashfreeSignature({ rawBody: BODY, timestamp: TIMESTAMP, signature: SIGNATURE, secret: "other" })).toBe(false);
    expect(verifyCashfreeSignature({ rawBody: BODY, timestamp: null, signature: SIGNATURE, secret: SECRET })).toBe(false);
    expect(verifyCashfreeSignature({ rawBody: BODY, timestamp: TIMESTAMP, signature: "short", secret: SECRET })).toBe(false);
    expect(verifyCashfreeSignature({ rawBody: BODY, timestamp: TIMESTAMP, signature: null, secret: SECRET })).toBe(false);
  });
});
