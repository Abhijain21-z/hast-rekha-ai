import { Suspense } from "react";
import RashiExplorer from "@/components/rashi/RashiExplorer";
import { Spinner } from "@/components/ui";

export const metadata = { title: "12 Rashis — Hast Rekha AI" };

export default function RashiPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[60vh] items-center justify-center"><Spinner /></div>}>
      <RashiExplorer />
    </Suspense>
  );
}
