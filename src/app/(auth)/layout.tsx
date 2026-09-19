import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { LangToggle } from "@/components/layout/Navbar";

export default async function AuthLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");
  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="flex items-center justify-between px-5 py-5 sm:px-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Home
        </Link>
        <LangToggle />
      </div>
      <div className="mandala-bg flex flex-1 items-center justify-center px-4 pb-16">{children}</div>
    </div>
  );
}
