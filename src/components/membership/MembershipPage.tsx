"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CalendarDays, Check, Clock3, Crown, Bookmark, Loader2, ShieldCheck, Sparkles, Users } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import { Button, Input, Label } from "@/components/ui";
import { CASHFREE_ENABLED, CASHFREE_MODE, MEMBERSHIP_PRICE } from "@/lib/flags";
import { MEMBERSHIP_PROFILE_LIMIT, MEMBERSHIP_REPORT_LIMIT } from "@/lib/plans";
import { getCashfree } from "@/lib/cashfree-client";

export interface MembershipView {
  active: boolean;
  until: string | null;
  daysLeft: number;
  reportsUsed: number;
  reportsLeft: number;
}

const BENEFITS = [
  {
    icon: Crown,
    title: { en: "30 Pro reports in 30 days", hi: "30 दिनों में 30 प्रो रिपोर्ट" },
    body: {
      en: "Every new reading is unlocked automatically until the fair-use cap. Buy individual reports any time if you need more.",
      hi: "फेयर-यूज़ सीमा तक हर नई रीडिंग अपने आप अनलॉक। ज़्यादा चाहिए तो अलग से रिपोर्ट खरीद सकते हैं।",
    },
  },
  {
    icon: Users,
    title: { en: "5 saved family profiles", hi: "5 सहेजी पारिवारिक प्रोफ़ाइल" },
    body: {
      en: "Save your own details and up to four family members, with their consent. Generate their readings in one tap.",
      hi: "अपनी जानकारी और सहमति के साथ चार परिवारजनों तक की प्रोफ़ाइल सहेजें। एक टैप में रीडिंग बनाएँ।",
    },
  },
  {
    icon: Bookmark,
    title: { en: "Every report stays saved", hi: "हर रिपोर्ट सहेजी रहती है" },
    body: {
      en: "Unlocked reports and family readings remain in your dashboard after the pass ends, so you can keep reading what you already paid for.",
      hi: "पास ख़त्म होने के बाद भी अनलॉक रिपोर्ट और पारिवारिक रीडिंग आपके डैशबोर्ड में रहती हैं — जो एक बार लिया, उसे पढ़ते रह सकते हैं।",
    },
  },
  {
    icon: CalendarDays,
    title: { en: "30-day pass, not a subscription", hi: "30-दिन का पास, सब्सक्रिप्शन नहीं" },
    body: {
      en: "Pay once. Access ends on the expiry date by itself — there is no auto-renewal and nothing to cancel.",
      hi: "एक बार भुगतान। एक्सेस अपनी तारीख पर ख़त्म हो जाता है — कोई ऑटो-रिन्यूअल नहीं, कुछ रद्द करने की ज़रूरत नहीं।",
    },
  },
  {
    icon: ShieldCheck,
    title: { en: "Fair use, clearly stated", hi: "फेयर-यूज़, साफ़ शब्दों में" },
    body: {
      en: `At most ${MEMBERSHIP_REPORT_LIMIT} Pro reports per rolling 30 days and ${MEMBERSHIP_PROFILE_LIMIT} saved profiles. This keeps the pass fair for everyone.`,
      hi: `लगातार 30 दिनों में अधिकतम ${MEMBERSHIP_REPORT_LIMIT} प्रो रिपोर्ट और ${MEMBERSHIP_PROFILE_LIMIT} सहेजी प्रोफ़ाइल। इससे पास सबके लिए न्यायसंगत रहता है।`,
    },
  },
];

function formatDate(iso: string | null) {
  if (!iso) return "";
  const date = new Date(iso);
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function MembershipPage({
  signedIn,
  status,
}: {
  signedIn: boolean;
  status: MembershipView | null;
}) {
  const { L } = useLang();
  const router = useRouter();
  const [phone, setPhone] = useState(() => {
    if (typeof window === "undefined") return "";
    const saved = window.localStorage.getItem("hr-whatsapp");
    return saved && /^[6-9]\d{9}$/.test(saved) ? saved : "";
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function pay() {
    setError("");
    setDone(false);
    const digits = phone.replace(/\D/g, "");
    if (!/^[6-9]\d{9}$/.test(digits)) {
      setError(L({ en: "Enter a valid 10-digit mobile number.", hi: "सही 10 अंकों का मोबाइल नंबर डालें।" }));
      return;
    }
    if (!CASHFREE_ENABLED) {
      setError(
        L({
          en: "Membership checkout opens with the payment gateway. Please check back shortly.",
          hi: "मेंबरशिप चेकआउट पेमेंट गेटवे के साथ खुलेगा। कृपया थोड़ी देर बाद देखें।",
        }),
      );
      return;
    }

    setBusy(true);
    try {
      window.localStorage.setItem("hr-whatsapp", digits);
      const res = await fetch("/api/payments/cashfree/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "membership", phone: digits }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        paymentSessionId?: string;
        orderId?: string;
        error?: string;
      };
      if (!res.ok || !data.paymentSessionId || !data.orderId) {
        setError(data.error || L({ en: "Could not start the payment. Please try again.", hi: "भुगतान शुरू नहीं हो सका। कृपया दोबारा कोशिश करें।" }));
        return;
      }

      const cashfree = await getCashfree(CASHFREE_MODE);
      const result = await cashfree.checkout({ paymentSessionId: data.paymentSessionId, redirectTarget: "_self" });
      if (result.redirect) return; // The return page verifies and shows the result.
      if (result.error) {
        setError(L({ en: "Payment was not completed. You can try again whenever you are ready.", hi: "भुगतान पूरा नहीं हुआ। जब चाहें दोबारा कोशिश कर सकते हैं।" }));
        return;
      }
      if (result.paymentDetails) {
        const verified = (await fetch(`/api/payments/cashfree/verify?order_id=${encodeURIComponent(data.orderId)}`)
          .then((r) => r.json().catch(() => null))
          .catch(() => null)) as { status?: string } | null;
        if (verified?.status === "PAID") {
          setDone(true);
          router.refresh();
        } else {
          setError(
            L({
              en: "Payment received — confirmation is taking a moment. Refresh this page in a minute.",
              hi: "भुगतान मिल गया — पुष्टि हो रही है। एक मिनट बाद यह पेज रीफ़्रेश करें।",
            }),
          );
        }
      }
    } catch {
      setError(L({ en: "Could not start the payment. Please try again.", hi: "भुगतान शुरू नहीं हो सका। कृपया दोबारा कोशिश करें।" }));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative overflow-hidden py-16 sm:py-20">
      <div className="mandala-bg pointer-events-none absolute inset-0 opacity-30" />
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400/90">✦ {L({ en: "Membership", hi: "मेंबरशिप" })}</p>
          <h1 className="mt-3 font-display text-3xl text-white sm:text-4xl lg:text-5xl">
            {L({ en: "One pass for the whole family", hi: "पूरे परिवार के लिए एक पास" })}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
            {L({
              en: "A 30-day pass with 30 Pro reports and 5 saved profiles. Pay once — access ends on its own, with no auto-renewal.",
              hi: "30-दिन का पास — 10 प्रो रिपोर्ट और 5 सहेजी प्रोफ़ाइल। एक बार भुगतान — एक्सेस अपने आप ख़त्म, कोई ऑटो-रिन्यूअल नहीं।",
            })}
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="glass rounded-[2rem] p-6 sm:p-8">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-300">{L({ en: "30-day pass", hi: "30-दिन पास" })}</p>
                <p className="mt-2 font-display text-5xl gold-text">₹{MEMBERSHIP_PRICE}</p>
                <p className="mt-1 text-xs text-slate-400">{L({ en: "one-time · not auto-renewing", hi: "एक बार · ऑटो-रिन्यू नहीं" })}</p>
              </div>
              <span className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200">
                {L({ en: `${MEMBERSHIP_REPORT_LIMIT} reports · ${MEMBERSHIP_PROFILE_LIMIT} profiles`, hi: `${MEMBERSHIP_REPORT_LIMIT} रिपोर्ट · ${MEMBERSHIP_PROFILE_LIMIT} प्रोफ़ाइल` })}
              </span>
            </div>

            <ul className="mt-6 space-y-4">
              {BENEFITS.map((benefit) => (
                <li key={benefit.title.en} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-gold-400/25 bg-gold-400/10 text-gold-300">
                    <benefit.icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-medium text-white">{L(benefit.title)}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-slate-300">{L(benefit.body)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-strong h-fit rounded-[2rem] border border-gold-400/30 p-6 sm:p-8">
            {done ? (
              <div className="text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300">
                  <Check className="h-7 w-7" />
                </span>
                <h2 className="mt-4 font-display text-2xl text-white">{L({ en: "Membership active", hi: "मेंबरशिप सक्रिय" })}</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  {L({ en: "Your pass is saved. Open a new reading and it will unlock automatically.", hi: "आपका पास सहेजा गया। नई रीडिंग खोलें, वह अपने आप अनलॉक होगी।" })}
                </p>
                <Link href="/reading" className="btn-gold mt-5 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm">
                  <Sparkles className="h-4 w-4" /> {L({ en: "Start a reading", hi: "रीडिंग शुरू करें" })}
                </Link>
              </div>
            ) : !signedIn ? (
              <div className="text-center">
                <Crown className="mx-auto h-9 w-9 text-gold-300" />
                <h2 className="mt-3 font-display text-2xl text-white">{L({ en: "Sign in to continue", hi: "जारी रखने के लिए साइन इन करें" })}</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  {L({
                    en: "Membership belongs to your account, so we can apply the pass and keep your family profiles together.",
                    hi: "मेंबरशिप आपके खाते से जुड़ी है, ताकि पास लागू हो सके और पारिवारिक प्रोफ़ाइल एक जगह रहें।",
                  })}
                </p>
                <Link href="/login?next=/membership" className="btn-gold mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm">
                  {L({ en: "Sign in", hi: "साइन इन" })}
                </Link>
                <Link href="/register?next=/membership" className="mt-3 inline-flex w-full items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm text-slate-200 hover:border-gold-400/50">
                  {L({ en: "Create an account", hi: "खाता बनाएँ" })}
                </Link>
              </div>
            ) : (
              <div>
                {status?.active ? (
                  <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-4">
                    <p className="flex items-center gap-2 text-sm font-semibold text-emerald-200">
                      <Clock3 className="h-4 w-4" /> {L({ en: "Membership active", hi: "मेंबरशिप सक्रिय" })}
                    </p>
                    <p className="mt-1 text-sm text-slate-200">
                      {L({ en: `${status.daysLeft} days left · until ${formatDate(status.until)}`, hi: `${status.daysLeft} दिन बाकी · ${formatDate(status.until)} तक` })}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {L({
                        en: `${status.reportsUsed} of ${MEMBERSHIP_REPORT_LIMIT} reports used in the last 30 days.`,
                        hi: `पिछले 30 दिनों में ${MEMBERSHIP_REPORT_LIMIT} में से ${status.reportsUsed} रिपोर्ट उपयोग हुईं।`,
                      })}
                    </p>
                  </div>
                ) : (
                  <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-relaxed text-slate-300">
                    {L({
                      en: "No active pass on this account. Buy one below and it starts immediately.",
                      hi: "इस खाते पर कोई सक्रिय पास नहीं। नीचे खरीदें और तुरंत शुरू हो जाएगा।",
                    })}
                  </p>
                )}

                <div className="mt-5">
                  <Label htmlFor="membership-phone">{L({ en: "Mobile number for the receipt", hi: "रसीद के लिए मोबाइल नंबर" })}</Label>
                  <Input
                    id="membership-phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="98765 43210"
                    inputMode="numeric"
                    autoComplete="tel"
                    maxLength={10}
                  />
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                    {L({ en: "Cashfree uses this for the payment receipt. No marketing message is sent without consent.", hi: "Cashfree इसका उपयोग भुगतान रसीद के लिए करता है। बिना सहमति कोई मार्केटिंग संदेश नहीं भेजा जाता।" })}
                  </p>
                </div>

                {error && <p className="mt-3 rounded-xl border border-rose-400/30 bg-rose-400/10 px-3 py-2 text-xs leading-relaxed text-rose-200">{error}</p>}

                <Button className="mt-4 w-full" size="lg" loading={busy} onClick={pay} icon={busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Crown className="h-4 w-4" />}>
                  {busy
                    ? L({ en: "Opening secure checkout…", hi: "सुरक्षित चेकआउट खुल रहा है…" })
                    : L({ en: `Buy 30-day pass — ₹${MEMBERSHIP_PRICE}`, hi: `30-दिन पास खरीदें — ₹${MEMBERSHIP_PRICE}` })}
                </Button>
                <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-slate-500">
                  <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-300" />
                  {L({
                    en: "Secure Cashfree checkout. The pass is added after payment is confirmed; buying again extends it from the current expiry.",
                    hi: "सुरक्षित Cashfree चेकआउट। भुगतान की पुष्टि के बाद पास जुड़ता है; दोबारा खरीदने पर मौजूदा समाप्ति से आगे बढ़ता है।",
                  })}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-center text-xs leading-relaxed text-slate-400">
          {L({
            en: "Membership is a 30-day pass, not a recurring subscription. It does not auto-renew. Reports bought separately stay yours after the pass ends.",
            hi: "मेंबरशिप 30-दिन का पास है, आवर्ती सब्सक्रिप्शन नहीं। यह अपने आप रिन्यू नहीं होता। अलग से खरीदी रिपोर्ट पास ख़त्म होने के बाद भी आपकी रहती हैं।",
          })}
        </div>
      </div>
    </div>
  );
}
