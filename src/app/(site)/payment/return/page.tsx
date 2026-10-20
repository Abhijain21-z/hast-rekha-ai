import type { Metadata } from "next";
import PaymentReturnClient from "./PaymentReturnClient";

export const metadata: Metadata = {
  title: "Payment status | Hastrekha AI",
  // Never index a per-order status page.
  robots: { index: false, follow: false },
};

/**
 * Cashfree returns the visitor here with `?order_id=...` after checkout. The
 * client component verifies the order server-side and unlocks the reading when
 * Cashfree confirms it is PAID.
 */
export default async function PaymentReturnPage({ searchParams }: { searchParams: Promise<{ order_id?: string }> }) {
  const params = await searchParams;
  const orderId = typeof params.order_id === "string" ? params.order_id : "";
  return <PaymentReturnClient orderId={orderId} />;
}
