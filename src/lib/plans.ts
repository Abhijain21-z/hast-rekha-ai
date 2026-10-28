/**
 * The paid plan catalogue. Client-safe: prices and limits only, no database.
 *
 * Every plan is a one-time payment for a digital product. The membership is a
 * 30-day pass, not an auto-renewing subscription, so there is nothing to
 * cancel — access simply ends on the expiry date.
 */
import {
  BUNDLE_PRICE,
  DIWALI_PRICE,
  MEMBERSHIP_PRICE,
  PDF_PRICE,
  ULTRA_PRICE,
} from "./flags";

export {
  FREE_PROFILE_LIMIT,
  MEMBERSHIP_DAYS,
  MEMBERSHIP_PROFILE_LIMIT,
  MEMBERSHIP_REPORT_LIMIT,
} from "./flags";

export type PaidPlan = "pro" | "diwali" | "bundle" | "ultra" | "membership";
export type ReportPlan = Exclude<PaidPlan, "membership">;

export const PLAN_PRICES: Record<PaidPlan, number> = {
  pro: PDF_PRICE,
  diwali: DIWALI_PRICE,
  bundle: BUNDLE_PRICE,
  ultra: ULTRA_PRICE,
  membership: MEMBERSHIP_PRICE,
};

export const REPORT_PLANS: readonly ReportPlan[] = ["pro", "diwali", "bundle", "ultra"];

export function isPaidPlan(value: unknown): value is PaidPlan {
  return typeof value === "string" && value in PLAN_PRICES;
}

export function isReportPlan(value: unknown): value is ReportPlan {
  return typeof value === "string" && (REPORT_PLANS as readonly string[]).includes(value);
}

/** Plans that unlock the full Pro report (the membership unlocks it per new reading). */
export function includesProReport(plan: PaidPlan): boolean {
  return plan !== "membership";
}

/** Plans that unlock the Dhandayak book. */
export function includesBook(plan: PaidPlan): boolean {
  return plan === "bundle" || plan === "ultra";
}

/** Plans that unlock the Diwali Puja PDF. */
export function includesDiwaliPdf(plan: PaidPlan): boolean {
  return plan === "diwali";
}
