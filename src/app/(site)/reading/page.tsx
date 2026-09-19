import { Suspense } from "react";
import ReadingForm from "@/components/reading/ReadingForm";
import { Spinner } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth";

export const metadata = { title: "Get Your Reading — Hast Rekha AI" };

export default async function ReadingPage() {
  const user = await getCurrentUser();
  return (
    <Suspense fallback={<div className="flex min-h-[60vh] items-center justify-center"><Spinner /></div>}>
      <ReadingForm loggedIn={!!user} />
    </Suspense>
  );
}
