"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Save, KeyRound, LogOut, Languages } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { Avatar, Button, Card, Input, Label, cn } from "@/components/ui";
import type { Lang } from "@/lib/i18n";

interface Props { user: { name: string; email: string; preferredLang: string; createdAt: string } }

export default function SettingsForm({ user }: Props) {
  const { t, lang, setLang } = useLang();
  const { toast } = useToast();
  const router = useRouter();
  const [name, setName] = useState(user.name);
  const [pref, setPref] = useState<Lang>(user.preferredLang === "hi" ? "hi" : "en");
  const [saving, setSaving] = useState(false);
  const [cur, setCur] = useState("");
  const [nw, setNw] = useState("");
  const [pwBusy, setPwBusy] = useState(false);
  const [pwErr, setPwErr] = useState("");

  async function saveProfile(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/auth/me", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, preferredLang: pref }) });
    setSaving(false);
    if (res.ok) {
      setLang(pref);
      toast(t.dash.saved);
      router.refresh();
    } else toast(t.common.error, "error");
  }

  async function changePw(e: FormEvent) {
    e.preventDefault();
    setPwErr("");
    if (nw.length < 6) return setPwErr(t.auth.errShort);
    setPwBusy(true);
    const res = await fetch("/api/auth/me", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ currentPassword: cur, newPassword: nw }) });
    setPwBusy(false);
    if (res.ok) {
      toast(t.dash.passwordChanged);
      setCur("");
      setNw("");
    } else setPwErr(t.auth.errInvalid);
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400/90">✦ {t.dash.settings}</p>
        <h1 className="mt-2 font-display text-3xl text-white sm:text-4xl">{t.dash.settingsTitle}</h1>
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <Avatar name={name || user.name} size={56} />
            <div>
              <p className="font-display text-xl text-white">{name || user.name}</p>
              <p className="text-sm text-slate-400">{user.email}</p>
            </div>
          </div>
          <form onSubmit={saveProfile} className="mt-6 space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>{t.dash.name}</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} minLength={2} required />
              </div>
              <div>
                <Label>{t.dash.email}</Label>
                <Input value={user.email} disabled className="opacity-60" />
              </div>
            </div>
            <div>
              <Label>{t.dash.language}</Label>
              <div className="flex gap-2">
                {(["en", "hi"] as const).map((l) => (
                  <button key={l} type="button" onClick={() => setPref(l)} className={cn("inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm transition", pref === l ? "border-gold-400/60 bg-gold-400/15 text-gold-100" : "border-white/10 text-slate-300 hover:border-white/25")}>
                    <Languages className="h-4 w-4" /> {l === "en" ? "English" : "हिंदी"}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-slate-500">{lang === "hi" ? "वर्तमान: हिंदी" : "Current: English"}</p>
            </div>
            <Button type="submit" loading={saving} icon={<Save className="h-4 w-4" />}>{saving ? t.dash.saving : t.dash.save}</Button>
          </form>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="p-6">
          <p className="flex items-center gap-2 font-display text-lg text-white"><KeyRound className="h-5 w-5 text-gold-300" /> {t.dash.changePassword}</p>
          <form onSubmit={changePw} className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <Label>{t.dash.currentPassword}</Label>
              <Input type="password" value={cur} onChange={(e) => setCur(e.target.value)} required autoComplete="current-password" />
            </div>
            <div>
              <Label>{t.dash.newPassword}</Label>
              <Input type="password" value={nw} onChange={(e) => setNw(e.target.value)} required minLength={6} autoComplete="new-password" />
            </div>
            {pwErr && <p className="text-xs text-rose-300 sm:col-span-2">{pwErr}</p>}
            <div className="sm:col-span-2">
              <Button type="submit" variant="outline" loading={pwBusy}>{t.dash.changePassword}</Button>
            </div>
          </form>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Card className="flex flex-col items-start justify-between gap-4 border-rose-400/20 p-6 sm:flex-row sm:items-center">
          <div>
            <p className="font-display text-lg text-white">{t.dash.dangerZone}</p>
            <p className="text-xs text-slate-400">{t.dash.memberSince}: {new Date(user.createdAt).toLocaleDateString(lang === "hi" ? "hi-IN" : "en-IN", { dateStyle: "long" })}</p>
          </div>
          <Button variant="danger" onClick={logout} icon={<LogOut className="h-4 w-4" />}>{t.dash.logoutAll}</Button>
        </Card>
      </motion.div>
    </div>
  );
}
