import { Suspense } from "react";
import AuthForm from "@/components/auth/AuthForm";
import { Spinner } from "@/components/ui";

export const metadata = { title: "Login — Hast Rekha AI" };

export default function LoginPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <AuthForm mode="login" />
    </Suspense>
  );
}
