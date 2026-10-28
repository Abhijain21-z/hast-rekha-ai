"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { MapPin, Sparkles, Clock, CalendarDays, UserRound, LogIn, Phone } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import { Button, Input, Label, ErrorText, cn } from "@/components/ui";
import PalmUpload from "./PalmUpload";
import CalculatingOverlay from "./CalculatingOverlay";
import FloatingBtn from "./FloatingBtn";
import type { City } from "@/lib/cities";
import { useCitySearch } from "@/lib/use-city-search";
import { tzLabel } from "@/lib/dto";
import { FOCUS_OPTIONS, isFocusKey } from "@/lib/focus";

interface Props { loggedIn: boolean }

export default function ReadingForm({ loggedIn }: Props) {
  const { t, L } = useLang();
  const router = useRouter();
  const params = useSearchParams();

  const [fullName, setFullName] = useState(params.get("name") ?? "");
  const [whatsappPhone, setWhatsappPhone] = useState("");
  const [dailyRashifal, setDailyRashifal] = useState(true);
  const [birthDate, setBirthDate] = useState(params.get("dob") ?? "");
  const [birthTime, setBirthTime] = useState(params.get("tob") ?? "");
  const [timeUnknown, setTimeUnknown] = useState(false);
  const [gender, setGender] = useState<"" | "male" | "female" | "trans">("");
  const [married, setMarried] = useState<"" | "yes" | "no">("");
  const [focus, setFocus] = useState(() => {
    const fromUrl = params.get("focus");
    return isFocusKey(fromUrl) ? fromUrl : "";
  });
  const [consent, setConsent] = useState(false);
  const [placeQuery, setPlaceQuery] = useState(params.get("place") ?? "");
  const [city, setCity] = useState<City | null>(() => {
    const lat = params.get("lat"), lng = params.get("lng");
    if (lat && lng) return { name: params.get("place") ?? "", region: "", lat: Number(lat), lng: Number(lng), tz: Number(params.get("tz") ?? 5.5) };
    return null;
  });
  const [showSug, setShowSug] = useState(false);
  const [manual, setManual] = useState(false);
  const [lat, setLat] = useState(city ? String(city.lat) : "");
  const [lng, setLng] = useState(city ? String(city.lng) : "");
  const [tz, setTz] = useState(city ? String(city.tz) : "5.5");
  const [palm, setPalm] = useState<string | null>(null);
  const [hand, setHand] = useState<"left" | "right">("right");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [progress, setProgress] = useState<number | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);



  /** Animate 1 → 99% over ~7s; jump to 100% once the server has answered, then navigate. */
  function runProgress(request: Promise<string>) {
    const DURATION = 7200;
    const start = performance.now();
    let resultId: string | null = null;
    let failed = false;
    setProgress(1);
    request.then((id) => { resultId = id; }).catch(() => { failed = true; });
    const tick = () => {
      if (failed) {
        setProgress(null);
        setSubmitting(false);
        setServerError(t.form.errGeneric);
        return;
      }
      const tt = Math.min(1, (performance.now() - start) / DURATION);
      const eased = 1 - Math.pow(1 - tt, 2.4);
      setProgress(Math.max(1, Math.round(eased * 99)));
      if (tt >= 1 && resultId) {
        setProgress(100);
        const id = resultId;
        window.setTimeout(() => router.push(loggedIn ? `/dashboard/readings/${id}` : `/reading/${id}`), 700);
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }

  const cityLabel = city ? `${city.name}${city.region ? ", " + city.region : ""}` : "";
  const searching = !!placeQuery.trim() && placeQuery !== cityLabel;
  const { results: suggestions, ensure: ensureCityData } = useCitySearch(placeQuery, searching);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => { if (boxRef.current && !boxRef.current.contains(e.target as Node)) setShowSug(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  function chooseCity(c: City) {
    setCity(c);
    setPlaceQuery(`${c.name}, ${c.region}`);
    setLat(String(c.lat));
    setLng(String(c.lng));
    setTz(String(c.tz));
    setShowSug(false);
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    const cleanName = fullName.trim();
    if (cleanName.length < 2 || cleanName.length > 80) errs.fullName = t.form.errName;
    const waDigits = whatsappPhone.replace(/\D/g, "");
    if (!waDigits) errs.whatsappPhone = t.form.errWhatsappRequired;
    else if (!/^[6-9]\d{9}$/.test(waDigits)) errs.whatsappPhone = t.form.errWhatsapp;
    if (!gender) errs.gender = t.form.errGender;
    if (!married) errs.married = t.form.errMarried;
    if (!consent) errs.consent = t.form.errConsent;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) errs.birthDate = t.form.errDate;
    let latN = Number(lat), lngN = Number(lng);
    let tzN = tz.trim() === "" ? 5.5 : Number(tz);
    if (!Number.isFinite(tzN)) tzN = 5.5;
    // Free-text places are accepted: if no lat/lng are known, fall back to Delhi (28.61, 77.21, IST).
    // Users who need exact coordinates can open "manual coords" and set them.
    const place = placeQuery.trim();
    const hasCoords = lat !== "" && lng !== "" && !Number.isNaN(latN) && !Number.isNaN(lngN);
    if (!place) {
      errs.place = t.form.errPlace;
    } else if (!hasCoords) {
      latN = 28.6139;
      lngN = 77.209;
      setLat(String(latN));
      setLng(String(lngN));
      setTz(String(tzN));
    }
    setErrors(errs);
    if (Object.keys(errs).length) {
      // Put the cursor on the first missing field instead of leaving the visitor
      // at the bottom of a long form with only a small inline error.
      if (errs.fullName) document.getElementById("full-name")?.focus();
      else if (errs.whatsappPhone) document.getElementById("wa-phone")?.focus();
      else if (errs.gender) document.getElementById("gender-male")?.focus();
      else if (errs.married) document.getElementById("married-yes")?.focus();
      else if (errs.consent) document.getElementById("consent")?.focus();
      return;
    }

    if (waDigits) window.localStorage.setItem("hr-whatsapp", waDigits);
    else window.localStorage.removeItem("hr-whatsapp");

    setSubmitting(true);
    setServerError("");
    const request = fetch("/api/readings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: cleanName,
        birthDate,
        birthTime: timeUnknown || !birthTime ? "12:00" : birthTime,
        timeUnknown: timeUnknown || !birthTime,
        placeName: placeQuery.trim(),
        latitude: latN,
        longitude: lngN,
        tzOffset: tzN,
        palmImage: palm,
        palmHand: palm ? hand : null,
        gender,
        married: married === "yes",
        focus: focus || null,
        whatsappPhone: waDigits,
        dailyRashifalOptIn: dailyRashifal,
      }),
    }).then(async (res) => {
      if (!res.ok) throw new Error("request failed");
      const data = (await res.json()) as { id: string };
      return data.id;
    });
    runProgress(request);
    // Hide floating button after form is submitted
    window.dispatchEvent(new Event("hr-form-submitted"));
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 relative">
      {/* Background video — muted, looping, low opacity, smooth performance */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover opacity-[0.08] pointer-events-none select-none z-0"
        aria-hidden="true"
      >
        <source src="/assets/krsn.mp4" type="video/mp4" />
      </video>
      <div className="relative z-10">
      <CalculatingOverlay progress={progress} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400/90">✦ Kundli</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-white md:text-5xl">{t.form.title}</h1>
        <p className="mt-3 text-slate-300">{t.form.sub}</p>
        {!loggedIn && (
          <Link href="/login?next=/reading" className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs text-slate-300 hover:border-gold-400/50 hover:text-gold-200">
            <LogIn className="h-3.5 w-3.5" /> {t.form.guestNote}
          </Link>
        )}
      </motion.div>

      <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="glass-strong space-y-5 rounded-3xl p-6 sm:p-8">
          <div>
            <Label htmlFor="full-name">
              {t.form.fullName} <span className="text-rose-300" aria-hidden="true">*</span>
            </Label>
            <div className="relative">
              <UserRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <Input
                id="full-name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={t.form.fullNamePh}
                className="pl-10"
                autoComplete="name"
                required
                minLength={2}
                maxLength={80}
                aria-required="true"
                aria-invalid={!!errors.fullName}
              />
            </div>
            <ErrorText>{errors.fullName}</ErrorText>
          </div>

          <div>
            <Label htmlFor="wa-phone">
              {t.form.whatsapp} <span className="text-rose-300" aria-hidden="true">*</span>
            </Label>
            <div className="relative">
              <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <Input
                id="wa-phone"
                value={whatsappPhone}
                onChange={(e) => setWhatsappPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder={t.pro.cfPhonePh}
                className="pl-10"
                inputMode="numeric"
                autoComplete="tel"
                maxLength={10}
                required
                aria-required="true"
                aria-invalid={!!errors.whatsappPhone}
              />
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{t.form.whatsappHint}</p>
            <label
              htmlFor="daily-rashifal"
              className="mt-3 flex cursor-pointer items-start gap-2.5 rounded-xl border border-gold-400/15 bg-gold-400/[0.04] p-3"
            >
              <input
                id="daily-rashifal"
                type="checkbox"
                checked={dailyRashifal}
                onChange={(e) => setDailyRashifal(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-[#f5c242]"
              />
              <span className="text-xs leading-relaxed">
                <span className="font-medium text-slate-200">{t.form.dailyWhatsapp}</span>
                {/* Note removed — kept only for reference: हफ़्ते में दो तय दिन, सुबह 9 बजे — दिन आपके opt-in पर तय होते हैं ताकि messages पूरे हफ़्ते में बँट जाएँ। कभी भी STOP लिखकर बंद कर सकते हैं। वैकल्पिक। */}
              </span>
            </label>
            <ErrorText>{errors.whatsappPhone}</ErrorText>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="dob">{t.form.dob}</Label>
              <div className="relative">
                <CalendarDays className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <Input id="dob" type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="pl-10" max="2100-12-31" min="1800-01-01" />
              </div>
              <ErrorText>{errors.birthDate}</ErrorText>
            </div>
            <div>
              <Label htmlFor="tob">{t.form.tob}</Label>
              <div className="relative">
                <Clock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <Input id="tob" type="time" value={timeUnknown ? "12:00" : birthTime} disabled={timeUnknown} onChange={(e) => setBirthTime(e.target.value)} className="pl-10 disabled:opacity-50" />
              </div>
            </div>
          </div>
          <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-400">
            <input type="checkbox" checked={timeUnknown} onChange={(e) => setTimeUnknown(e.target.checked)} className="h-4 w-4 accent-[#f5c242]" />
            {t.form.unknownTime}
          </label>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label>
                {t.form.gender} <span className="text-rose-300" aria-hidden="true">*</span>
              </Label>
              <div className="grid grid-cols-3 gap-2" role="group" aria-label={t.form.gender}>
                {([
                  { value: "male", label: t.form.male },
                  { value: "female", label: t.form.female },
                  { value: "trans", label: t.form.trans },
                ] as const).map((option) => (
                  <button
                    key={option.value}
                    id={`gender-${option.value}`}
                    type="button"
                    aria-pressed={gender === option.value}
                    onClick={() => {
                      setGender(option.value);
                      // Palmistry convention: men read the right hand, women
                      // the left. The selector stays editable for exceptions.
                      if (option.value === "male") setHand("right");
                      else if (option.value === "female") setHand("left");
                    }}
                    className={cn(
                      "rounded-xl border px-2 py-2.5 text-sm transition",
                      gender === option.value
                        ? "border-gold-400/70 bg-gold-400/15 text-gold-100"
                        : "border-white/25 bg-white/[0.06] text-slate-300 hover:border-gold-400/50 hover:text-white",
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <ErrorText>{errors.gender}</ErrorText>
            </div>
            <div>
              <Label>
                {t.form.married} <span className="text-rose-300" aria-hidden="true">*</span>
              </Label>
              <div className="grid grid-cols-2 gap-2" role="group" aria-label={t.form.married}>
                {([
                  { value: "yes", label: t.form.marriedYes },
                  { value: "no", label: t.form.marriedNo },
                ] as const).map((option) => (
                  <button
                    key={option.value}
                    id={`married-${option.value}`}
                    type="button"
                    aria-pressed={married === option.value}
                    onClick={() => setMarried(option.value)}
                    className={cn(
                      "rounded-xl border px-3 py-2.5 text-sm transition",
                      married === option.value
                        ? "border-gold-400/70 bg-gold-400/15 text-gold-100"
                        : "border-white/25 bg-white/[0.06] text-slate-300 hover:border-gold-400/50 hover:text-white",
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <ErrorText>{errors.married}</ErrorText>
            </div>
          </div>

          <div>
            <Label htmlFor="focus" hint={t.form.focusHint}>{t.form.focus}</Label>
            <select
              id="focus"
              value={focus}
              onChange={(e) => setFocus(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-white/25 bg-white/[0.05] px-3.5 py-3 text-sm text-slate-100 outline-none transition focus:border-gold-400/80 focus:ring-2 focus:ring-gold-400/30"
            >
              <option value="">{t.form.focusPlaceholder}</option>
              {FOCUS_OPTIONS.map((option) => (
                <option key={option.key} value={option.key} className="bg-cosmic-900 text-slate-100">
                  {L(option.label)}
                </option>
              ))}
            </select>
          </div>

          <div ref={boxRef} className="relative">
            <Label htmlFor="place" hint={t.form.placeHint}>{t.form.place}</Label>
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <Input
                id="place"
                value={placeQuery}
                onChange={(e) => { setPlaceQuery(e.target.value); setCity(null); setShowSug(true); ensureCityData(); }}
                onFocus={() => { setShowSug(true); ensureCityData(); }}
                placeholder={t.form.placePh}
                className="pl-10"
                autoComplete="off"
              />
            </div>
            <AnimatePresence>
              {showSug && suggestions.length > 0 && (
                <motion.ul initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="glass-strong absolute z-20 mt-2 max-h-64 w-full overflow-auto rounded-2xl p-1.5 shadow-2xl">
                  {suggestions.map((c) => (
                    <li key={`${c.name}-${c.region}`}>
                      <button type="button" onClick={() => chooseCity(c)} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-white/8">
                        <MapPin className="h-4 w-4 text-gold-300" />
                        <span className="text-sm text-white">{c.name}</span>
                        <span className="text-xs text-slate-400">{c.region}</span>
                        <span className="ml-auto text-xs text-slate-500">{tzLabel(c.tz)}</span>
                      </button>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
            <ErrorText>{errors.place}</ErrorText>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
              {lat && lng && !manual && (
                <span className="rounded-full border border-gold-400/30 bg-gold-400/10 px-3 py-1 text-gold-200">
                  {t.form.coords}: {Number(lat).toFixed(3)}, {Number(lng).toFixed(3)} · {t.form.tz} {tzLabel(Number(tz))}
                </span>
              )}
              <button type="button" onClick={() => setManual((m) => !m)} className="text-slate-400 underline-offset-2 hover:text-gold-300 hover:underline">
                {t.form.manualCoords}
              </button>
            </div>
            <AnimatePresence>
              {manual && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="mt-3 grid grid-cols-3 gap-3">
                    <div><Label>Lat</Label><Input type="number" step="0.0001" value={lat} onChange={(e) => setLat(e.target.value)} placeholder="28.61" /></div>
                    <div><Label>Lng</Label><Input type="number" step="0.0001" value={lng} onChange={(e) => setLng(e.target.value)} placeholder="77.20" /></div>
                    <div><Label>UTC±</Label><Input type="number" step="0.25" value={tz} onChange={(e) => setTz(e.target.value)} placeholder="5.5" /></div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="flex flex-col gap-6">
          <div id="palm" className="glass-strong rounded-3xl p-6 sm:p-8">
            <Label hint={t.common.optional}>{t.form.palm}</Label>
            <PalmUpload value={palm} onChange={setPalm} hand={hand} onHandChange={setHand} />
          </div>

          <div className="glass rounded-3xl p-6">
            <label htmlFor="consent" className="flex cursor-pointer items-start gap-2.5 text-[12.5px] leading-relaxed text-slate-300">
              <input
                id="consent"
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                required
                aria-required="true"
                aria-invalid={!!errors.consent}
                className="mt-0.5 h-4 w-4 shrink-0 accent-[#f5c242]"
              />
              <span>
                {L({ en: "I accept the ", hi: "मैं " })}
                <Link href="/privacy-policy" className="font-medium text-gold-300 underline underline-offset-2 hover:text-gold-200">
                  privacy policy
                </Link>
                {L({ en: " and ", hi: " and " })}
                <Link href="/terms" className="font-medium text-gold-300 underline underline-offset-2 hover:text-gold-200">
                  terms and conditions
                </Link>
                {L({ en: "", hi: " accept करता हूँ" })}
              </span>
            </label>
            <ErrorText>{errors.consent}</ErrorText>

            <Button type="submit" size="lg" loading={submitting} className={cn("mt-4 w-full")} icon={<Sparkles className="h-5 w-5" />}>
              {submitting ? t.form.calculating : t.form.submit}
            </Button>
            {serverError && <ErrorText>{serverError}</ErrorText>}
            <p className="mt-4 text-center text-xs text-slate-500">{t.result.disclaimer}</p>
          </div>
        </motion.div>
      </form>
      <FloatingBtn />
      </div>
    </div>
  );
}
