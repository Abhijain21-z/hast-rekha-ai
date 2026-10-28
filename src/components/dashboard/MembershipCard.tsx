"use client";

import Link from "next/link";
import { CalendarDays, Check, Crown } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import { Card, cn } from "@/components/ui";
import { MEMBERSHIP_PRICE } from "@/lib/flags";

export interface MembershipCardData {
  active: boolean;
  daysLeft: number;
  reportsUsed: number;
  reportsLeft: number;
  reportLimit: number;
  profileLimit: number;
  until: string | null;
}

export default function MembershipCard({ data }: { data: MembershipCardData }) {
  const { L } = useLang();
  const usedPercent = Math.min(100, Math.round((data.reportsUsed / Math.max(1, data.reportLimit)) * 100));

  if (!data.active) {
    return (
      <Card className="relative overflow-hidden p-6">
        <div className="mandala-bg pointer-events-none absolute inset-0 opacity-30" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold-300">
              <Crown className="h-3.5 w-3.5" /> {L({ en: "Membership", hi: "मेंबरशिप" })}
            </p>
            <p className="mt-2 font-display text-xl text-white">
              {L({ en: `30 Pro reports in 30 days · ₹${MEMBERSHIP_PRICE}`, hi: `30 दिनों में 30 प्रो रिपोर्ट · ₹${MEMBERSHIP_PRICE}` })}
            </p>
            <p className="mt-1 text-sm text-slate-400">
              {L({
                en: "For family readings — 5 profiles, automatic unlocks, and a pass that simply expires.",
                hi: "परिवार की रीडिंग के लिए — 5 प्रोफ़ाइल, अपने आप अनलॉक, और समय पर ख़त्म होने वाला पास।",
              })}
            </p>
          </div>
          <Link href="/membership" className="shrink-0 rounded-full border border-gold-400/50 bg-gold-400/10 px-5 py-2.5 text-sm font-medium text-gold-100 transition hover:border-gold-400/80 hover:bg-gold-400/20">
            {L({ en: "See membership", hi: "मेंबरशिप देखें" })}
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden border-emerald-400/30 p-6">
      <div className="mandala-bg pointer-events-none absolute inset-0 opacity-30" />
      <div className="relative">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-300">
            <Check className="h-3.5 w-3.5" /> {L({ en: "Membership active", hi: "मेंबरशिप सक्रिय" })}
          </p>
          <Link href="/membership" className="text-xs font-medium text-gold-200 underline-offset-4 hover:underline">
            {L({ en: "Manage", hi: "प्रबंधित करें" })}
          </Link>
        </div>
        <p className="mt-2 flex items-center gap-2 font-display text-xl text-white">
          <CalendarDays className="h-5 w-5 text-emerald-300" />
          {L({ en: `${data.daysLeft} days left`, hi: `${data.daysLeft} दिन बाकी` })}
        </p>
        <p className="mt-1 text-xs text-slate-400">
          {L({
            en: `${data.reportsUsed} of ${data.reportLimit} reports used · ${data.profileLimit} profiles available`,
            hi: `${data.reportLimit} में से ${data.reportsUsed} रिपोर्ट उपयोग · ${data.profileLimit} प्रोफ़ाइल उपलब्ध`,
          })}
        </p>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className={cn("h-full rounded-full transition-all", data.reportsLeft > 0 ? "bg-emerald-400" : "bg-rose-400")}
            style={{ width: `${usedPercent}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-slate-500">
          {L({
            en: "The pass expires on its own — there is no auto-renewal and nothing to cancel.",
            hi: "पास अपने आप ख़त्म होता है — कोई ऑटो-रिन्यूअल नहीं, कुछ रद्द करने की ज़रूरत नहीं।",
          })}
        </p>
      </div>
    </Card>
  );
}
