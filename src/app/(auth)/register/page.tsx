import { Suspense } from "react";
import type { Metadata } from "next";
import AuthForm from "@/components/auth/AuthForm";
import { Spinner } from "@/components/ui";

// Not in robots.txt (it is linked in the navbar) — noindex keeps it out of search.
export const metadata: Metadata = {
  title: "Create Account — Hast Rekha AI",
  description: "Create a free Hast Rekha AI account to save your palmistry and kundli readings.",
  alternates: { canonical: "/register" },
  robots: { index: false, follow: true },
};

export default function RegisterPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <AuthForm mode="register" />
    </Suspense>
  );
}
