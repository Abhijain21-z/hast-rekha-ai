/**
 * Precise sidereal ephemeris.
 *
 * Planetary longitudes come from the full VSOP87B theory shipped with the MIT
 * `astronomia` package (Mercury–Neptune), the Moon from Meeus' ELP2000
 * truncation, and the Sun from Meeus' apparent solar longitude. Geocentric
 * positions are built from heliocentric rectangular coordinates with a
 * light-time correction, then converted to the Lahiri (Chitrapaksha) sidereal
 * zodiac used by Vedic astrology.
 *
 * Results are deterministic and cached in-process, keyed by birth data.
 */
import { base, julian, moonposition, nutation, sidereal, solar } from "astronomia";
import planetposition from "astronomia/planetposition";
import earthSeries from "astronomia/data/vsop87Bearth";
import mercurySeries from "astronomia/data/vsop87Bmercury";
import venusSeries from "astronomia/data/vsop87Bvenus";
import marsSeries from "astronomia/data/vsop87Bmars";
import jupiterSeries from "astronomia/data/vsop87Bjupiter";
import saturnSeries from "astronomia/data/vsop87Bsaturn";
import type { ChartInput, Graha } from "./types";

const DEG = 180 / Math.PI;
const NAK_SPAN = 360 / 27;

type Series = Vsop87Series;

const EARTH = new planetposition.Planet(earthSeries as unknown as Series);

const PLANETS: Record<"mercury" | "venus" | "mars" | "jupiter" | "saturn", InstanceType<typeof planetposition.Planet>> = {
  mercury: new planetposition.Planet(mercurySeries as unknown as Series),
  venus: new planetposition.Planet(venusSeries as unknown as Series),
  mars: new planetposition.Planet(marsSeries as unknown as Series),
  jupiter: new planetposition.Planet(jupiterSeries as unknown as Series),
  saturn: new planetposition.Planet(saturnSeries as unknown as Series),
};

export const norm360 = (d: number) => ((d % 360) + 360) % 360;

/** Signed difference normalised to (−180, 180]. */
export const norm180 = (d: number) => {
  const x = norm360(d);
  return x > 180 ? x - 360 : x;
};

/** Lahiri (Chitrapaksha) ayanāṃśa — linear approximation around J2000 (≈ ±1′). */
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

/** Ecliptic longitude of the ascendant for a given RAMC, latitude and obliquity (degrees). */
export function ascendantLongitude(ramcDeg: number, latDeg: number, epsDeg: number): number {
  const ramc = ramcDeg / DEG;
  const phi = latDeg / DEG;
  const eps = epsDeg / DEG;
  const y = Math.cos(ramc);
  const x = -(Math.sin(ramc) * Math.cos(eps) + Math.tan(phi) * Math.sin(eps));
  return norm360(Math.atan2(y, x) * DEG);
}

interface Rect {
  x: number;
  y: number;
  z: number;
}

function toRect(p: { lon: number; lat: number; range: number }): Rect {
  const cl = Math.cos(p.lat);
  return {
    x: p.range * cl * Math.cos(p.lon),
    y: p.range * cl * Math.sin(p.lon),
    z: p.range * Math.sin(p.lat),
  };
}

/** Light-time corrected geocentric ecliptic position (radians / AU). */
function geocentric(
  earth: Rect,
  planet: InstanceType<typeof planetposition.Planet>,
  jde: number,
): { lon: number; lat: number; range: number } {
  let tau = 0;
  let out = { lon: 0, lat: 0, range: 1 };
  for (let pass = 0; pass < 2; pass++) {
    const p = toRect(planet.position(jde - tau));
    const x = p.x - earth.x;
    const y = p.y - earth.y;
    const z = p.z - earth.z;
    const range = Math.hypot(x, y, z);
    out = { lon: Math.atan2(y, x), lat: Math.atan2(z, Math.hypot(x, y)), range };
    tau = range * 0.0057755183; // AU → light-days
  }
  return out;
}

/** Mean lunar node (Rahu), radians, referred to the mean equinox of date. */
function meanNode(jde: number): number {
  const T = base.J2000Century(jde);
  return (
    125.0445479 -
    1934.1362891 * T +
    0.0020754 * T * T +
    (T * T * T) / 467441 -
    (T * T * T * T) / 60616000
  ) / DEG;
}

export interface RawPlanet {
  key: Graha;
  tropical: number;
  sidereal: number;
  speed: number;
  retrograde: boolean;
}

export interface Ephemeris {
  input: ChartInput;
  jd: number;
  ayanamsa: number;
  obliquity: number;
  gast: number;
  ascTropical: number;
  ascSidereal: number;
  sunTropical: number;
  sunSidereal: number;
  moonTropical: number;
  moonSidereal: number;
  /** Moon − Sun elongation, 0–360 (tithi driver). */
  elongation: number;
  planets: RawPlanet[];
  weekday: number;
}

const CACHE_LIMIT = 256;
const cache = new Map<string, Ephemeris>();
const cacheKey = (i: ChartInput) =>
  `${i.date}|${i.time}|${i.latitude.toFixed(4)}|${i.longitude.toFixed(4)}|${i.tzOffset}`;

/** Cached ephemeris for one birth moment. */
export function getEphemeris(input: ChartInput): Ephemeris {
  const key = cacheKey(input);
  const hit = cache.get(key);
  if (hit) return hit;
  const value = computeEphemeris(input);
  if (cache.size >= CACHE_LIMIT) {
    const oldest = cache.keys().next().value;
    if (oldest !== undefined) cache.delete(oldest);
  }
  cache.set(key, value);
  return value;
}

export function computeEphemeris(input: ChartInput): Ephemeris {
  const [y, mo, d] = input.date.split("-").map(Number);
  const [hh, mm] = (input.time || "12:00").split(":").map(Number);
  if (!y || !mo || !d) throw new Error("Invalid birth date");

  const utHours = (hh || 0) + (mm || 0) / 60 - input.tzOffset;
  const jd = julian.CalendarGregorianToJD(y, mo, d + utHours / 24);
  const T = base.J2000Century(jd);

  const [dpsi] = nutation.nutation(jd);
  const nut = dpsi * DEG;
  const [, deltaEps] = nutation.nutation(jd);
  const obliquity = (nutation.meanObliquity(jd) + deltaEps) * DEG;  const gast = norm360(sidereal.apparent(jd) / 240);
  const ramc = norm360(gast + input.longitude);

  const ayanamsa = lahiriAyanamsa(jd);
  const earth = toRect(EARTH.position(jd));

  const sunTropical = norm360(solar.apparentLongitude(T) * DEG);
  const sunTNext = norm360(solar.apparentLongitude(T + 0.5 / 36525) * DEG);
  const sunTPrev = norm360(solar.apparentLongitude(T - 0.5 / 36525) * DEG);
  const sunSpeed = norm180(sunTNext - sunTPrev);

  const moonNow = moonposition.position(jd);
  const moonTropical = norm360(moonNow.lon * DEG);
  const moonSpeed = norm180(
    (moonposition.position(jd + 0.5).lon - moonposition.position(jd - 0.5).lon) * DEG,
  );

  const planets: RawPlanet[] = [
    { key: "sun", tropical: sunTropical, sidereal: norm360(sunTropical - ayanamsa), speed: round(sunSpeed, 5), retrograde: false },
    { key: "moon", tropical: moonTropical, sidereal: norm360(moonTropical - ayanamsa), speed: round(moonSpeed, 5), retrograde: false },
  ];

  (["mercury", "venus", "mars", "jupiter", "saturn"] as const).forEach((key) => {
    const now = geocentric(earth, PLANETS[key], jd);
    const next = geocentric(earth, PLANETS[key], jd + 0.5);
    const prev = geocentric(earth, PLANETS[key], jd - 0.5);
    const tropical = norm360(now.lon * DEG + nut);
    const speed = norm180((next.lon - prev.lon) * DEG);
    planets.push({
      key,
      tropical,
      sidereal: norm360(tropical - ayanamsa),
      speed: round(speed, 5),
      retrograde: speed < 0,
    });
  });

  const nodeNow = norm360(meanNode(jd) * DEG + nut);
  const nodeSpeed = norm180((meanNode(jd + 0.5) - meanNode(jd - 0.5)) * DEG);
  planets.push({
    key: "rahu",
    tropical: nodeNow,
    sidereal: norm360(nodeNow - ayanamsa),
    speed: round(nodeSpeed, 5),
    retrograde: true,
  });
  planets.push({
    key: "ketu",
    tropical: norm360(nodeNow + 180),
    sidereal: norm360(nodeNow + 180 - ayanamsa),
    speed: round(nodeSpeed, 5),
    retrograde: true,
  });

  const ascTropical = ascendantLongitude(ramc, input.latitude, obliquity);
  const elongation = norm360(moonTropical - sunTropical);

  const result: Ephemeris = {
    input,
    jd,
    ayanamsa,
    obliquity,
    gast,
    ascTropical,
    ascSidereal: norm360(ascTropical - ayanamsa),
    sunTropical,
    sunSidereal: norm360(sunTropical - ayanamsa),
    moonTropical,
    moonSidereal: norm360(moonTropical - ayanamsa),
    elongation,
    planets,
    weekday: new Date(Date.UTC(y, mo - 1, d)).getUTCDay(),
  };
  return result;
}

/** Rashi index of a sidereal longitude. */
export const rashiOf = (sidereal: number) => Math.floor(norm360(sidereal) / 30);
/** Degree inside the rashi. */
export const degreeInSign = (sidereal: number) => norm360(sidereal) % 30;
/** Nakshatra index. */
export const nakshatraOf = (sidereal: number) => Math.floor(norm360(sidereal) / NAK_SPAN) % 27;
/** Pada 1–4 inside the nakshatra. */
export const padaOf = (sidereal: number) =>
  Math.min(4, Math.floor((norm360(sidereal) % NAK_SPAN) / (NAK_SPAN / 4)) + 1);

function round(n: number, p: number) {
  const f = 10 ** p;
  return Math.round(n * f) / f;
}
