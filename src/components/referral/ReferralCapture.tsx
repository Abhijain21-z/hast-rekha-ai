"use client";

import { useEffect } from "react";
import { REFERRAL_COOKIE, REFERRAL_COOKIE_DAYS, normalizeReferralCode } from "@/lib/referral-code";

/**
 * Any page can carry ?ref=CODE. Store it for 60 days so the visitor can browse,
 * create a reading, and still attribute the signup correctly.
 */
export default function ReferralCapture() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = normalizeReferralCode(params.get("ref") ?? params.get("referral"));
    if (!code) return;

    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${REFERRAL_COOKIE}=${encodeURIComponent(code)}; Path=/; Max-Age=${
      REFERRAL_COOKIE_DAYS * 86400
    }; SameSite=Lax${secure}`;
  }, []);

  return null;
}
