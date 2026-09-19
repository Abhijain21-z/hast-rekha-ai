/**
 * Rule-based Vedic astrology engine.
 *
 * Uses the open-source `astronomia` library (Meeus algorithms) for planetary
 * positions and sidereal time, then applies standard Vedic formulas:
 *   - Lahiri ayanamsa to convert tropical → sidereal longitudes
 *   - Rashi   = floor(siderealMoon / 30)
 *   - Nakshatra = floor(siderealMoon / 13°20')
 *   - Lagna   = ecliptic longitude of the eastern horizon (from LST + latitude)
 *   - Tithi   = floor((Moon − Sun) / 12) + 1, Yoga = floor((Moon + Sun) / 13°20')
 *
 * No external API is required — everything is computed locally.
 */
import { julian, moonposition, solar, sidereal, nutation, base } from "astronomia";

export interface ChartInput {
  date: string; // YYYY-MM-DD local date
  time: string; // HH:MM local time (24h)
  latitude: number;
  longitude: number; // east positive
  tzOffset: number; // hours east of UTC, e.g. 5.5 for IST
}

export interface AstroResult {
  engine: "astronomia";
  julianDay: number;
  ayanamsa: number;
  obliquity: number;
  siderealTime: number; // GAST in degrees
  tropical: { sun: number; moon: number; ascendant: number };
  sidereal: { sun: number; moon: number; ascendant: number };
  sunSignWestern: number; // 0 = Aries … 11 = Pisces (date-range mapping)
  sunSignVedic: number;
  moonRashi: number;
  moonDegree: number; // degree inside the rashi
  nakshatra: number; // 0 = Ashwini … 26 = Revati
  nakshatraDegree: number;
  pada: number; // 1-4
  lagna: number;
  lagnaDegree: number;
  tithi: number; // 1-30
  paksha: "shukla" | "krishna";
  yoga: number; // 0-26
  weekday: number; // 0 = Sunday
  moonPhase: number; // illuminated fraction 0-1
}

const DEG = 180 / Math.PI;
const NAK_SPAN = 360 / 27; // 13°20'

export const norm360 = (d: number) => ((d % 360) + 360) % 360;

/** Lahiri (Chitrapaksha) ayanamsa — linear approximation around J2000 (≈ ±1'). */
export function lahiriAyanamsa(jd: number): number {
  const years = (jd - 2451545.0) / 365.25;
  return 23.85313 + years * 0.0139691;
}

/** Western (tropical) sun sign from the standard date-range table. 0 = Aries. */
export function westernSunSign(month: number, day: number): number {
  const signAtMonthStart = [9, 10, 11, 0, 1, 2, 3, 4, 5, 6, 7, 8];
  const nextSignStartsOn = [20, 19, 21, 20, 21, 21, 23, 23, 23, 23, 22, 22];
  const m = Math.min(Math.max(month - 1, 0), 11);
  return day >= nextSignStartsOn[m] ? (signAtMonthStart[m] + 1) % 12 : signAtMonthStart[m];
}

/** Ecliptic longitude of the ascendant for a given RAMC, geographic latitude and obliquity (all degrees). */
export function ascendantLongitude(ramcDeg: number, latDeg: number, epsDeg: number): number {
  const ramc = ramcDeg / DEG;
  const phi = latDeg / DEG;
  const eps = epsDeg / DEG;
  const y = Math.cos(ramc);
  const x = -(Math.sin(ramc) * Math.cos(eps) + Math.tan(phi) * Math.sin(eps));
  return norm360(Math.atan2(y, x) * DEG);
}

export function computeChart(input: ChartInput): AstroResult {
  const [y, mo, d] = input.date.split("-").map(Number);
  const [hh, mm] = (input.time || "12:00").split(":").map(Number);
  if (!y || !mo || !d) throw new Error("Invalid birth date");

  const utHours = (hh || 0) + (mm || 0) / 60 - input.tzOffset;
  const jd = julian.CalendarGregorianToJD(y, mo, d + utHours / 24);
  const T = base.J2000Century(jd);

  const moon = moonposition.position(jd);
  const moonTrop = norm360(moon.lon * DEG);
  const sunTrop = norm360(solar.apparentLongitude(T) * DEG);

  const [, deltaEps] = nutation.nutation(jd);
  const obliquity = (nutation.meanObliquity(jd) + deltaEps) * DEG;
  const gast = norm360(sidereal.apparent(jd) / 240); // seconds of time → degrees
  const ramc = norm360(gast + input.longitude);
  const ascTrop = ascendantLongitude(ramc, input.latitude, obliquity);

  const ayanamsa = lahiriAyanamsa(jd);
  const moonSid = norm360(moonTrop - ayanamsa);
  const sunSid = norm360(sunTrop - ayanamsa);
  const ascSid = norm360(ascTrop - ayanamsa);

  const nakshatra = Math.floor(moonSid / NAK_SPAN);
  const nakshatraDegree = moonSid - nakshatra * NAK_SPAN;
  const pada = Math.min(4, Math.floor(nakshatraDegree / (NAK_SPAN / 4)) + 1);

  const elongation = norm360(moonTrop - sunTrop);
  const tithi = Math.min(30, Math.floor(elongation / 12) + 1);
  const yoga = Math.floor(norm360(moonSid + sunSid) / NAK_SPAN) % 27;
  const weekday = new Date(Date.UTC(y, mo - 1, d)).getUTCDay();

  return {
    engine: "astronomia",
    julianDay: round(jd, 5),
    ayanamsa: round(ayanamsa, 4),
    obliquity: round(obliquity, 4),
    siderealTime: round(gast, 4),
    tropical: { sun: round(sunTrop, 4), moon: round(moonTrop, 4), ascendant: round(ascTrop, 4) },
    sidereal: { sun: round(sunSid, 4), moon: round(moonSid, 4), ascendant: round(ascSid, 4) },
    sunSignWestern: westernSunSign(mo, d),
    sunSignVedic: Math.floor(sunSid / 30),
    moonRashi: Math.floor(moonSid / 30),
    moonDegree: round(moonSid % 30, 2),
    nakshatra,
    nakshatraDegree: round(nakshatraDegree, 2),
    pada,
    lagna: Math.floor(ascSid / 30),
    lagnaDegree: round(ascSid % 30, 2),
    tithi,
    paksha: tithi <= 15 ? "shukla" : "krishna",
    yoga,
    weekday,
    moonPhase: round((1 - Math.cos(elongation / DEG)) / 2, 3),
  };
}

function round(n: number, p: number) {
  const f = 10 ** p;
  return Math.round(n * f) / f;
}

/** Format a degree value as D°MM' */
export function formatDegree(deg: number): string {
  const d = Math.floor(deg);
  const m = Math.round((deg - d) * 60);
  return `${d}°${String(m).padStart(2, "0")}'`;
}
