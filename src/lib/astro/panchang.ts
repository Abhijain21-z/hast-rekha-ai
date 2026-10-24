/**
 * Pañcāṅga: the five limbs of the Vedic day (tithi, vāra, nakṣatra, yoga,
 * karaṇa) plus sunrise/sunset, the planetary hour (horā), lunar month, season
 * and Vikram Samvat.
 *
 * Sunrise uses Cooper's declination equation + the standard equation of time,
 * accurate to roughly ±3 minutes — enough for horā and day/night classification,
 * and labelled as approximate in the UI.
 */
import { norm360, type Ephemeris } from "./ephemeris";
import {
  HORA_ORDER,
  LUNAR_MONTHS,
  PLANET_NAMES,
  RITUS,
  TITHI_NAMES,
  VARA_LORDS,
  VARA_NAMES,
  YOGA_NAMES,
  karanaName,
  nakshatraAt,
  signAt,
} from "./data";
import type { Graha, PanchangInfo } from "./types";

const NAK_SPAN = 360 / 27;

function dayOfYear(y: number, m: number, d: number): number {
  const start = Date.UTC(y, 0, 1);
  const now = Date.UTC(y, m - 1, d);
  return Math.floor((now - start) / 86400000) + 1;
}

export interface SunTimes {
  sunrise: number | null; // local decimal hours
  sunset: number | null;
}

/** Approximate sunrise/sunset in local clock time for a date + place. */
export function sunTimes(input: { date: string; latitude: number; longitude: number; tzOffset: number }): SunTimes {
  const [y, m, d] = input.date.split("-").map(Number);
  if (!y || !m || !d) return { sunrise: null, sunset: null };
  const n = dayOfYear(y, m, d);
  const decl = (23.45 * Math.sin(((360 / 365) * (284 + n) * Math.PI) / 180) * Math.PI) / 180;
  const phi = (input.latitude * Math.PI) / 180;
  const cosH = -Math.tan(phi) * Math.tan(decl);
  if (cosH < -1 || cosH > 1) return { sunrise: null, sunset: null }; // polar day/night
  const H = (Math.acos(cosH) * 180) / Math.PI;

  const B = ((360 / 364) * (n - 81) * Math.PI) / 180;
  const eot = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B); // minutes
  const noon = 12 + input.tzOffset - input.longitude / 15 - eot / 60;

  return { sunrise: noon - H / 15, sunset: noon + H / 15 };
}

const hhmm = (hours: number | null): string | null => {
  if (hours === null || !Number.isFinite(hours)) return null;
  const total = Math.round(((hours % 24) + 24) % 24 * 60);
  const h = Math.floor(total / 60) % 24;
  const min = total % 60;
  return `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
};

function horaAt(
  input: { time: string; date: string; weekday: number },
  sunrise: number | null,
  sunset: number | null,
): Graha {
  const [hh, mm] = (input.time || "12:00").split(":").map(Number);
  const t = (hh || 0) + (mm || 0) / 60;
  const startIdx = HORA_ORDER.indexOf(VARA_LORDS[input.weekday]);
  if (sunrise === null || sunset === null || sunset <= sunrise) {
    // No reliable sunrise (high latitude): fall back to equal 60-minute horas
    // starting at local midnight, which still gives a stable ruling planet.
    const idx = Math.floor(t);
    return HORA_ORDER[(startIdx + idx) % 7];
  }
  if (t >= sunrise && t < sunset) {
    const idx = Math.min(11, Math.floor(((t - sunrise) / (sunset - sunrise)) * 12));
    return HORA_ORDER[(startIdx + idx) % 7];
  }
  const nightLength = 24 - (sunset - sunrise);
  const fromSunset = t >= sunset ? t - sunset : t + 24 - sunset;
  const idx = Math.min(11, Math.floor((fromSunset / nightLength) * 12));
  return HORA_ORDER[(startIdx + 12 + idx) % 7];
}

export function buildPanchang(eph: Ephemeris): PanchangInfo {
  const { input, elongation, weekday } = eph;
  const tithi = Math.min(30, Math.floor(elongation / 12) + 1);
  const paksha: "shukla" | "krishna" = tithi <= 15 ? "shukla" : "krishna";
  const moonNak = Math.floor(norm360(eph.moonSidereal) / NAK_SPAN) % 27;
  const yoga = Math.floor(norm360(eph.moonSidereal + eph.sunSidereal) / NAK_SPAN) % 27;
  const karana = Math.min(59, Math.floor(elongation / 6));

  const [y, m, d] = input.date.split("-").map(Number);
  const { sunrise, sunset } = sunTimes(input);
  const sunSign = Math.floor(norm360(eph.sunSidereal) / 30);
  const lunarMonthIndex = (sunSign + 1) % 12;
  const samvat = (m > 3 || (m === 3 && d >= 22) ? y + 57 : y + 56);
  const hora = horaAt({ time: input.time, date: input.date, weekday }, sunrise, sunset);

  return {
    tithi,
    tithiName: TITHI_NAMES[tithi - 1],
    paksha,
    nakshatra: moonNak,
    nakshatraName: nakshatraAt(moonNak).name,
    yoga,
    yogaName: YOGA_NAMES[yoga],
    karana,
    karanaName: karanaName(karana),
    vara: weekday,
    varaName: VARA_NAMES[weekday],
    hora,
    horaName: PLANET_NAMES[hora],
    sunrise: hhmm(sunrise),
    sunset: hhmm(sunset),
    dayBirth:
      sunrise !== null && sunset !== null
        ? (Number(input.time.split(":")[0]) + Number(input.time.split(":")[1] || 0) / 60) >= sunrise &&
          (Number(input.time.split(":")[0]) + Number(input.time.split(":")[1] || 0) / 60) < sunset
        : true,
    moonPhase: Math.round(((1 - Math.cos((elongation * Math.PI) / 180)) / 2) * 1000) / 1000,
    lunarMonth: LUNAR_MONTHS[lunarMonthIndex] ?? LUNAR_MONTHS[0],
    samvat,
    ritu: RITUS[Math.floor(lunarMonthIndex / 2)] ?? RITUS[0],
  };
}

/** Nakshatra name for any sidereal longitude — shared by the report UI. */
export function nakshatraNameAt(longitude: number) {
  const index = Math.floor(norm360(longitude) / NAK_SPAN) % 27;
  return nakshatraAt(index).name;
}

/** Sign name for any sidereal longitude. */
export function signNameAt(longitude: number) {
  return signAt(Math.floor(norm360(longitude) / 30)).name;
}
