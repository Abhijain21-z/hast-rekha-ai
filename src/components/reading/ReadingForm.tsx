"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { MapPin, Sparkles, Clock, CalendarDays, UserRound, LogIn } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import { Button, Input, Label, ErrorText, cn } from "@/components/ui";
import PalmUpload from "./PalmUpload";
import CalculatingOverlay from "./CalculatingOverlay";
import { searchCities, type City } from "@/lib/content";
import { tzLabel } from "@/lib/dto";

interface Props { loggedIn: boolean }

export default function ReadingForm({ loggedIn }: Props) {
  const { t } = useLang();
  const router = useRouter();
  const params = useSearchParams();

  const [fullName, setFullName] = useState(params.get("name") ?? "");
  const [birthDate, setBirthDate] = useState(params.get("dob") ?? "");
  const [birthTime, setBirthTime] = useState(params.get("tob") ?? "");
  const [timeUnknown, setTimeUnknown] = useState(false);
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

  const suggestions = useMemo(() => (city && placeQuery === `${city.name}${city.region ? ", " + city.region : ""}` ? [] : searchCities(placeQuery)), [placeQuery, city]);

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
    if (!fullName.trim()) errs.fullName = t.form.errName;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) errs.birthDate = t.form.errDate;
    const latN = Number(lat), lngN = Number(lng), tzN = Number(tz);
    // Free-text places are accepted: if no lat/lng are known, fall back to Delhi (28.61, 77.21, IST).
    // Users who need exact coordinates can open "manual coords" and set them.
    const place = placeQuery.trim();
    const hasCoords = lat !== "" && lng !== "" && !Number.isNaN(latN) && !Number.isNaN(lngN);
    if (!place) {
      errs.place = t.form.errPlace;
    } else if (!hasCoords) {
      setLat("28.6139");
      setLng("77.209");
      setTz(tz || "5.5");
    }
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSubmitting(true);
    setServerError("");
    const request = fetch("/api/readings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: fullName.trim(),
        birthDate,
        birthTime: timeUnknown || !birthTime ? "12:00" : birthTime,
        timeUnknown: timeUnknown || !birthTime,
        placeName: placeQuery.trim(),
        latitude: latN,
        longitude: lngN,
        tzOffset: Number.isNaN(tzN) ? 5.5 : tzN,
        palmImage: palm,
        palmHand: palm ? hand : null,
      }),
    }).then(async (res) => {
      if (!res.ok) throw new Error("request failed");
      const data = (await res.json()) as { id: string };
      return data.id;
    });
    runProgress(request);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <CalculatingOverlay progress={progress} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400/90">✦ Kundli</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-white md:text-5xl">{t.form.title}</h1>
        <p className="mt-3 text-slate-300">{t.form.sub}</p>
        {!loggedIn && (
          <Link href="/login?next=/reading" className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-300 hover:border-gold-400/40 hover:text-gold-200">
            <LogIn className="h-3.5 w-3.5" /> {t.form.guestNote}
          </Link>
        )}
      </motion.div>

      <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="glass-strong space-y-5 rounded-3xl p-6 sm:p-8">
          <div>
            <Label>{t.form.fullName}</Label>
            <div className="relative">
              <UserRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder={t.form.fullNamePh} className="pl-10" autoComplete="name" />
            </div>
            <ErrorText>{errors.fullName}</ErrorText>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label>{t.form.dob}</Label>
              <div className="relative">
                <CalendarDays className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <Input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="pl-10" max="2100-12-31" min="1800-01-01" />
              </div>
              <ErrorText>{errors.birthDate}</ErrorText>
            </div>
            <div>
              <Label>{t.form.tob}</Label>
              <div className="relative">
                <Clock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <Input type="time" value={timeUnknown ? "12:00" : birthTime} disabled={timeUnknown} onChange={(e) => setBirthTime(e.target.value)} className="pl-10 disabled:opacity-50" />
              </div>
            </div>
          </div>
          <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-400">
            <input type="checkbox" checked={timeUnknown} onChange={(e) => setTimeUnknown(e.target.checked)} className="h-4 w-4 accent-[#f5c242]" />
            {t.form.unknownTime}
          </label>

          <div ref={boxRef} className="relative">
            <Label hint={t.form.placeHint}>{t.form.place}</Label>
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <Input
                value={placeQuery}
                onChange={(e) => { setPlaceQuery(e.target.value); setCity(null); setShowSug(true); }}
                onFocus={() => setShowSug(true)}
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
                        <span className="ml-auto text-[10px] text-slate-500">{tzLabel(c.tz)}</span>
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
            <Button type="submit" size="lg" loading={submitting} className={cn("w-full")} icon={<Sparkles className="h-5 w-5" />}>
              {submitting ? t.form.calculating : t.form.submit}
            </Button>
            {serverError && <ErrorText>{serverError}</ErrorText>}
            <p className="mt-4 text-center text-[11px] text-slate-500">{t.result.disclaimer}</p>
          </div>
        </motion.div>
      </form>
    </div>
  );
}
