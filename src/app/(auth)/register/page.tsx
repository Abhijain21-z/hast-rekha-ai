import { Suspense } from "react";
import AuthForm from "@/components/auth/AuthForm";
import { Spinner } from "@/components/ui";

export const metadata = { title: "Create Account — Hast Rekha AI" };

export default function RegisterPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <AuthForm mode="register" />
    </Suspense>
  );
}
