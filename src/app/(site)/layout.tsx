import type { ReactNode } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getCurrentUser } from "@/lib/auth";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  return (
    <>
      <Navbar user={user ? { name: user.name, email: user.email } : null} />
      <main className="pt-[106px]">{children}</main>
      <Footer />
    </>
  );
}
