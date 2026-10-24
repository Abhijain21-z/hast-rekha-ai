"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { LogIn, UserPlus, Sparkles, Mail, Lock, UserRound, Gift, X } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import { Button, Input, Label, ErrorText } from "@/components/ui";
import { normalizeReferralCode, readReferralCookie } from "@/lib/referral-code";

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const { t, L, lang } = useLang();
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/dashboard";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [referralCode, setReferralCode] = useState<string | null>(() =>
    normalizeReferralCode(params.get("ref") ?? params.get("referral")),
  );

  // The code may have been captured on an earlier page and stored in a cookie.
  // Read it after mount so server/client markup stays identical.
  useEffect(() => {
    if (mode !== "register" || referralCode) return;
    const stored = readReferralCookie();
    // Cookies are only available after mount, so this cannot be a lazy initial
    // value without a server/client markup mismatch on the applied-code chip.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored) setReferralCode(stored);
  }, [mode, referralCode]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          mode === "login" ? { email, password } : { name, email, password, lang, referralCode: referralCode ?? undefined },
        ),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error === "exists" ? t.auth.errExists : data.error === "short_password" ? t.auth.errShort : t.auth.errInvalid);
        setBusy(false);
        return;
      }
      router.push(next);
      router.refresh();
    } catch {
      setError(t.common.error);
      setBusy(false);
    }
  }

  const isLogin = mode === "login";

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="glass-strong w-full max-w-md rounded-3xl p-7 sm:p-9">
      <Link href="/" className="mb-6 flex items-center gap-2">
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold-400/50 bg-gradient-to-br from-mystic-700 to-cosmic-900 text-gold-300 gold-glow"><Sparkles className="h-5 w-5" /></span>
        <span className="font-display text-lg text-white">{t.brand}</span>
      </Link>
      <h1 className="font-display text-3xl text-white">{isLogin ? t.auth.loginTitle : t.auth.registerTitle}</h1>
      <p className="mt-1 text-sm text-slate-400">{isLogin ? t.auth.loginSub : t.auth.registerSub}</p>

      {!isLogin && referralCode && (
        <div className="mt-5 flex items-start gap-2 rounded-2xl border border-gold-400/30 bg-gold-400/10 px-3.5 py-3 text-xs text-gold-100">
          <Gift className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" />
          <span className="flex-1 leading-relaxed">
            {L({
              en: `Referral code ${referralCode} applied. Your friend gets 50 tokens after you create your account.`,
              hi: `रेफरल कोड ${referralCode} लग गया। आपका अकाउंट बनते ही आपके दोस्त को 50 टोकन मिल जाएँगे।`,
            })}
          </span>
          <button
            type="button"
            onClick={() => setReferralCode(null)}
            className="rounded-full p-1 text-gold-300/70 hover:bg-white/10 hover:text-white"
            aria-label="Remove referral code"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <form onSubmit={submit} className="mt-7 space-y-4">
        {!isLogin && (
          <div>
            <Label>{t.auth.name}</Label>
            <div className="relative">
              <UserRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <Input required value={name} onChange={(e) => setName(e.target.value)} className="pl-10" placeholder="Aarav Sharma" autoComplete="name" />
            </div>
          </div>
        )}
        <div>
          <Label>{t.auth.email}</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <Input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" placeholder="you@example.com" autoComplete="email" />
          </div>
        </div>
        <div>
          <Label>{t.auth.password}</Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <Input required type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10" placeholder="••••••••" autoComplete={isLogin ? "current-password" : "new-password"} />
          </div>
        </div>
        <ErrorText>{error}</ErrorText>
        <Button type="submit" size="lg" loading={busy} className="w-full" icon={isLogin ? <LogIn className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}>
          {busy ? t.auth.working : isLogin ? t.auth.login : t.auth.register}
        </Button>
      </form>

      {isLogin && (
        <button
          type="button"
          onClick={() => { setEmail("demo@hastrekha.ai"); setPassword("demo1234"); }}
          className="mt-4 w-full rounded-2xl border border-dashed border-gold-400/30 bg-gold-400/5 px-4 py-3 text-left text-xs text-slate-300 hover:bg-gold-400/10"
        >
          <span className="font-semibold text-gold-300">{t.auth.demo}</span> — demo@hastrekha.ai / demo1234
          <span className="mt-0.5 block text-xs text-slate-500">{t.auth.demoFill} →</span>
        </button>
      )}

      <p className="mt-6 text-center text-sm text-slate-400">
        {isLogin ? t.auth.noAccount : t.auth.haveAccount}{" "}
        <Link href={`${isLogin ? "/register" : "/login"}?next=${encodeURIComponent(next)}`} className="font-medium text-gold-300 hover:text-gold-200">
          {isLogin ? t.auth.register : t.auth.login}
        </Link>
      </p>
    </motion.div>
  );
}
