"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Users, Plus, Pencil, Trash2, Sparkles, MapPin, ShieldCheck, Crown } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { Avatar, Button, EmptyState, ErrorText, Input, Label, Modal, Select } from "@/components/ui";
import type { City } from "@/lib/cities";
import { useCitySearch } from "@/lib/use-city-search";
import { formatDate, formatTime12, tzLabel, type ProfileDTO } from "@/lib/dto";
import { RELATIONS, type Relation } from "@/lib/validation";

type FormState = { name: string; relation: Relation; birthDate: string; birthTime: string; placeName: string; latitude: string; longitude: string; tzOffset: string; consent: boolean };
const empty: FormState = { name: "", relation: "self", birthDate: "", birthTime: "12:00", placeName: "", latitude: "", longitude: "", tzOffset: "5.5", consent: false };

export default function ProfilesManager({
  initial,
  limit,
  membershipActive,
}: {
  initial: ProfileDTO[];
  limit: number;
  membershipActive: boolean;
}) {
  const { t, lang, cl, L } = useLang();
  const { toast } = useToast();
  const [items, setItems] = useState(initial);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ProfileDTO | null>(null);
  const [form, setForm] = useState<FormState>(empty);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [showSug, setShowSug] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [limitOpen, setLimitOpen] = useState(false);

  const { results: suggestions, ensure: ensureCityData } = useCitySearch(form.placeName, showSug);

  function openNew() {
    if (items.length >= limit) {
      setLimitOpen(true);
      return;
    }
    setEditing(null);
    setForm(empty);
    setError("");
    setOpen(true);
  }
  function openEdit(p: ProfileDTO) {
    setEditing(p);
    setForm({ name: p.name, relation: p.relation as Relation, birthDate: p.birthDate, birthTime: p.birthTime, placeName: p.placeName, latitude: String(p.latitude), longitude: String(p.longitude), tzOffset: String(p.tzOffset), consent: Boolean(p.consentAt) });
    setError("");
    setOpen(true);
  }
  function chooseCity(c: City) {
    setForm((f) => ({ ...f, placeName: `${c.name}, ${c.region}`, latitude: String(c.lat), longitude: String(c.lng), tzOffset: String(c.tz) }));
    setShowSug(false);
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return setError(t.form.errName);
    if (!form.birthDate) return setError(t.form.errDate);
    if (!form.placeName.trim() || form.latitude === "" || form.longitude === "") return setError(t.form.errPlace);
    if (!form.consent) {
      return setError(
        L({
          en: "Please confirm that you have permission to save this person's details.",
          hi: "कृपया पुष्टि करें कि आपके पास इस व्यक्ति की जानकारी सहेजने की अनुमति है।",
        }),
      );
    }
    setBusy(true);
    setError("");
    const payload = {
      name: form.name,
      relation: form.relation,
      birthDate: form.birthDate,
      birthTime: form.birthTime,
      placeName: form.placeName,
      latitude: Number(form.latitude),
      longitude: Number(form.longitude),
      tzOffset: Number(form.tzOffset) || 5.5,
      consent: true,
    };

    if (editing) {
      const prev = editing;
      const optimistic: ProfileDTO = { ...prev, ...payload, consentAt: prev.consentAt ?? new Date().toISOString(), updatedAt: new Date().toISOString() };
      setItems((all) => all.map((x) => (x.id === prev.id ? optimistic : x)));
      setOpen(false);
      const res = await fetch(`/api/profiles/${prev.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (res.ok) {
        const { profile } = (await res.json()) as { profile: ProfileDTO };
        setItems((all) => all.map((x) => (x.id === prev.id ? profile : x)));
        toast(t.dash.updated);
      } else {
        setItems((all) => all.map((x) => (x.id === prev.id ? prev : x)));
        toast(t.common.error, "error");
      }
    } else {
      const tempId = `temp-${Date.now()}`;
      const optimistic: ProfileDTO = { id: tempId, ...payload, consentAt: new Date().toISOString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      setItems((all) => [optimistic, ...all]);
      setOpen(false);
      const res = await fetch("/api/profiles", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (res.ok) {
        const { profile } = (await res.json()) as { profile: ProfileDTO };
        setItems((all) => all.map((x) => (x.id === tempId ? profile : x)));
        toast(t.dash.saved);
      } else {
        const data = (await res.json().catch(() => ({}))) as { code?: string };
        setItems((all) => all.filter((x) => x.id !== tempId));
        if (data.code === "profile_limit") {
          setLimitOpen(true);
        } else if (data.code === "consent_required") {
          setError(L({ en: "Consent is required to save a profile.", hi: "प्रोफ़ाइल सहेजने के लिए सहमति ज़रूरी है।" }));
          setOpen(true);
        } else {
          toast(t.common.error, "error");
        }
      }
    }
    setBusy(false);
  }

  async function confirmDelete() {
    if (!deleteId) return;
    const id = deleteId;
    const snapshot = items;
    setItems((all) => all.filter((x) => x.id !== id));
    setDeleteId(null);
    const res = await fetch(`/api/profiles/${id}`, { method: "DELETE" });
    if (!res.ok) {
      setItems(snapshot);
      toast(t.common.error, "error");
    } else toast(t.dash.deleted, "info");
  }

  const readingHref = (p: ProfileDTO) =>
    `/reading?${new URLSearchParams({ name: p.name, dob: p.birthDate, tob: p.birthTime, place: p.placeName, lat: String(p.latitude), lng: String(p.longitude), tz: String(p.tzOffset) })}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400/90">✦ Parivar</p>
          <h1 className="mt-2 font-display text-3xl text-white sm:text-4xl">{t.dash.profiles}</h1>
          <p className="mt-1 text-sm text-slate-400">
            {items.length} / {limit} {t.dash.results} ·{" "}
            {membershipActive
              ? L({ en: "Membership limit", hi: "मेंबरशिप सीमा" })
              : L({ en: "Free limit — membership raises it to 5", hi: "फ्री सीमा — मेंबरशिप से 5 तक" })}
          </p>
        </div>
        <Button onClick={openNew} icon={<Plus className="h-4 w-4" />} className="self-start">{t.dash.addProfile}</Button>
      </div>

      {items.length === 0 ? (
        <EmptyState icon={<Users className="h-8 w-8" />} title={t.dash.noProfilesTitle} sub={t.dash.noProfilesSub} action={<Button onClick={openNew} icon={<Plus className="h-4 w-4" />}>{t.dash.addProfile}</Button>} />
      ) : (
        <motion.ul layout className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence initial={false}>
            {items.map((p) => (
              <motion.li key={p.id} layout initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass flex flex-col rounded-3xl p-5 transition hover:border-gold-400/40">
                <div className="flex items-center gap-3">
                  <Avatar name={p.name} size={46} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-lg text-white">{p.name}</p>
                    <span className="rounded-full bg-gold-400/10 px-2.5 py-0.5 text-xs text-gold-200">{t.dash.relations[p.relation as Relation] ?? p.relation}</span>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(p)} className="rounded-full p-2 text-slate-400 hover:bg-white/10 hover:text-white" title={t.dash.edit}><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => setDeleteId(p.id)} className="rounded-full p-2 text-slate-400 hover:bg-rose-500/15 hover:text-rose-300" title={t.dash.delete}><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
                <div className="mt-4 space-y-1 text-xs text-slate-400">
                  <p>{formatDate(p.birthDate, cl)} · {formatTime12(p.birthTime)}</p>
                  <p className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {p.placeName} · {tzLabel(p.tzOffset)}</p>
                </div>
                <Link href={readingHref(p)} className="btn-gold mt-5 inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-xs">
                  <Sparkles className="h-3.5 w-3.5" /> {t.dash.generate}
                </Link>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? t.dash.editProfile : t.dash.addProfile}>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>{t.form.fullName}</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={t.form.fullNamePh} />
            </div>
            <div>
              <Label>{t.dash.relation}</Label>
              <Select value={form.relation} onChange={(e) => setForm({ ...form, relation: e.target.value as Relation })}>
                {RELATIONS.map((r) => <option key={r} value={r}>{t.dash.relations[r]}</option>)}
              </Select>
            </div>
            <div>
              <Label>{t.form.dob}</Label>
              <Input type="date" value={form.birthDate} onChange={(e) => setForm({ ...form, birthDate: e.target.value })} />
            </div>
            <div>
              <Label>{t.form.tob}</Label>
              <Input type="time" value={form.birthTime} onChange={(e) => setForm({ ...form, birthTime: e.target.value })} />
            </div>
          </div>
          <div className="relative">
            <Label hint={t.form.placeHint}>{t.form.place}</Label>
            <Input value={form.placeName} onChange={(e) => { setForm({ ...form, placeName: e.target.value, latitude: "", longitude: "" }); setShowSug(true); ensureCityData(); }} onFocus={() => { setShowSug(true); ensureCityData(); }} onBlur={() => setTimeout(() => setShowSug(false), 150)} placeholder={t.form.placePh} autoComplete="off" />
            {suggestions.length > 0 && (
              <ul className="glass-strong absolute z-20 mt-2 max-h-52 w-full overflow-auto rounded-2xl p-1.5 shadow-2xl">
                {suggestions.map((c) => (
                  <li key={`${c.name}-${c.region}`}>
                    <button type="button" onMouseDown={() => chooseCity(c)} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm hover:bg-white/8">
                      <MapPin className="h-3.5 w-3.5 text-gold-300" /> <span className="text-white">{c.name}</span> <span className="text-xs text-slate-400">{c.region}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {form.latitude && form.longitude && (
              <p className="mt-2 text-xs text-gold-200">{t.form.coords}: {Number(form.latitude).toFixed(3)}, {Number(form.longitude).toFixed(3)} · {tzLabel(Number(form.tzOffset))}</p>
            )}
          </div>
          <label className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3 text-xs leading-relaxed text-slate-300">
            <input
              type="checkbox"
              checked={form.consent}
              onChange={(e) => setForm({ ...form, consent: e.target.checked })}
              className="mt-0.5 h-4 w-4 shrink-0 accent-[#f5c242]"
            />
            <span className="flex items-start gap-1.5">
              <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-300" />
              <span>
                {L({
                  en: "I confirm I have this person's permission to save their birth details. I accept the",
                  hi: "मैं पुष्टि करता/करती हूँ कि मेरे पास इस व्यक्ति की जन्म जानकारी सहेजने की अनुमति है। मैं स्वीकार करता/करती हूँ",
                })}{" "}
                <Link href="/privacy-policy" onClick={(e) => e.stopPropagation()} className="font-medium text-gold-300 underline underline-offset-4 hover:text-gold-200">
                  {L({ en: "Privacy Policy", hi: "गोपनीयता नीति" })}
                </Link>{" "}
                {L({ en: "and", hi: "और" })}{" "}
                <Link href="/terms" onClick={(e) => e.stopPropagation()} className="font-medium text-gold-300 underline underline-offset-4 hover:text-gold-200">
                  {L({ en: "Terms", hi: "नियम" })}
                </Link>
                .
              </span>
            </span>
          </label>
          <ErrorText>{error}</ErrorText>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>{t.dash.cancel}</Button>
            <Button type="submit" loading={busy}>{t.dash.save}</Button>
          </div>
        </form>
      </Modal>

      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title={t.dash.delete}>
        <p className="text-sm text-slate-300">{t.dash.confirmDelete.replace("reading", "profile")}</p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setDeleteId(null)}>{t.dash.cancel}</Button>
          <Button variant="danger" onClick={confirmDelete} icon={<Trash2 className="h-4 w-4" />}>{t.dash.delete}</Button>
        </div>
      </Modal>

      <Modal
        open={limitOpen}
        onClose={() => setLimitOpen(false)}
        title={
          membershipActive
            ? L({ en: "All membership profiles are in use", hi: "मेंबरशिप की सभी प्रोफ़ाइल उपयोग में हैं" })
            : L({ en: "Profile limit reached", hi: "प्रोफ़ाइल सीमा पूरी" })
        }
      >
        <div className="text-center">
          <Crown className="mx-auto h-8 w-8 text-gold-300" />
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            {membershipActive
              ? L({
                  en: `Your membership pass includes ${limit} saved family profiles, and all ${limit} are in use. Delete one you no longer need to add someone else — you can still create readings without saving a profile.`,
                  hi: `आपके मेंबरशिप पास में ${limit} पारिवारिक प्रोफ़ाइल सहेजने की सुविधा है, और सभी ${limit} उपयोग में हैं। किसी और को जोड़ने के लिए जिस प्रोफ़ाइल की ज़रूरत नहीं, उसे हटा दें — प्रोफ़ाइल सहेजे बिना भी रीडिंग बना सकते हैं।`,
                })
              : L({
                  en: `Free accounts can save ${limit} profiles. A membership pass raises the limit to 5 and unlocks 30 Pro reports in 30 days.`,
                  hi: `फ्री खाते ${limit} प्रोफ़ाइल सहेज सकते हैं। मेंबरशिप पास सीमा 5 कर देता है और 30 दिनों में 10 प्रो रिपोर्ट देता है।`,
                })}
          </p>
          {!membershipActive && (
            <Link href="/membership" className="btn-gold mt-5 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm">
              <Crown className="h-4 w-4" /> {L({ en: "See membership", hi: "मेंबरशिप देखें" })}
            </Link>
          )}
        </div>
        <div className="mt-5 flex justify-center">
          <Button variant="ghost" onClick={() => setLimitOpen(false)}>{t.dash.cancel}</Button>
        </div>
      </Modal>
    </div>
  );
}
