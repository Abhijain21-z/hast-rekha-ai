import { Suspense } from "react";
import AuthForm from "@/components/auth/AuthForm";
import { Spinner } from "@/components/ui";

// Not in robots.txt (it is linked in the navbar) — noindex keeps it out of search.
export const metadata = { title: "Create Account — Hast Rekha AI", robots: { index: false, follow: true } };

export default function RegisterPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <AuthForm mode="register" />
    </Suspense>
  );
}
