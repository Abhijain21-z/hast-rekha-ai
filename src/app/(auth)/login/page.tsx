import { Suspense } from "react";
import type { Metadata } from "next";
import AuthForm from "@/components/auth/AuthForm";
import { Spinner } from "@/components/ui";

// Not in robots.txt (it is linked in the navbar) — noindex keeps it out of search.
export const metadata: Metadata = {
  title: "Login — Hast Rekha AI",
  description: "Log in to Hast Rekha AI to view your saved readings and Pro reports.",
  alternates: { canonical: "/login" },
  robots: { index: false, follow: true },
};

export default function LoginPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <AuthForm mode="login" />
    </Suspense>
  );
}
