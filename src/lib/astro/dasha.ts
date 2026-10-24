/**
 * Viṃśottarī daśā — the 120-year cycle used by almost every Vedic astrologer.
 *
 * The Moon's nakṣatra fixes the starting mahādaśā and how much of it was already
 * spent at birth. Sub-periods (antardaśā, pratyantardaśā) are proportional
 * divisions of the parent period, so the whole tree is reproducible from the
 * Moon's longitude alone.
 */
import { DASHA_ORDER, DASHA_YEARS, PLANET_NAMES, nakshatraAt } from "./data";
import type { DashaInfo, DashaPeriod, Graha } from "./types";

const NAK_SPAN = 360 / 27;
const YEAR_DAYS = 365.2425;

const addYears = (date: Date, years: number) => new Date(date.getTime() + years * YEAR_DAYS * 86400000);
const iso = (d: Date) => d.toISOString().slice(0, 10);

interface Period {
  lord: Graha;
  start: Date;
  end: Date;
  years: number;
  nominalStart: Date;
}

function period(lord: Graha, start: Date, years: number, nominalStart: Date): Period {
  return { lord, start, end: addYears(start, years), years, nominalStart };
}

function toDto(p: Period, now: Date): DashaPeriod {
  return {
    lord: p.lord,
    lordName: PLANET_NAMES[p.lord],
    start: iso(p.start),
    end: iso(p.end),
    years: Math.round(p.years * 100) / 100,
    current: now >= p.start && now < p.end,
  };
}

export function buildDasha(eph: { moonSidereal: number }, birthDate: string, now = new Date()): DashaInfo {
  const moon = ((eph.moonSidereal % 360) + 360) % 360;
  const nak = Math.floor(moon / NAK_SPAN) % 27;
  const traversed = (moon % NAK_SPAN) / NAK_SPAN;
  const startLord = DASHA_ORDER[nak % 9];
  const lordYears = DASHA_YEARS[startLord];
  const elapsed = traversed * lordYears;
  const balance = lordYears - elapsed;

  const birth = new Date(`${birthDate}T00:00:00.000Z`);
  const nominalStart = addYears(birth, -elapsed);

  // Build enough mahādaśās to cover 120 years from birth.
  const limit = addYears(birth, 120);
  const mahas: Period[] = [];
  let cursor = nominalStart;
  for (let i = 0; i < 16 && cursor < limit; i++) {
    const lord = DASHA_ORDER[(DASHA_ORDER.indexOf(startLord) + i) % 9];
    const years = DASHA_YEARS[lord];
    const start = cursor;
    const end = addYears(start, years);
    mahas.push({
      lord,
      start: start < birth ? birth : start,
      end: end > limit ? limit : end,
      years,
      nominalStart: start,
    });
    cursor = end;
  }

  const currentMaha = mahas.find((m) => now >= m.start && now < m.end) ?? null;

  let antar: Period | null = null;
  let pratyantar: Period | null = null;

  if (currentMaha) {
    const index = DASHA_ORDER.indexOf(currentMaha.lord);
    let aCursor = currentMaha.nominalStart;
    const antars: Period[] = [];
    for (let i = 0; i < 9; i++) {
      const lord = DASHA_ORDER[(index + i) % 9];
      const years = (currentMaha.years * DASHA_YEARS[lord]) / 120;
      const start = aCursor;
      antars.push({ lord, start, end: addYears(start, years), years, nominalStart: start });
      aCursor = addYears(start, years);
    }
    const found = antars.find((a) => now >= a.start && now < a.end) ?? antars[antars.length - 1];
    antar = found;

    const aIndex = DASHA_ORDER.indexOf(found.lord);
    let pCursor = found.start;
    for (let i = 0; i < 9; i++) {
      const lord = DASHA_ORDER[(aIndex + i) % 9];
      const years = (found.years * DASHA_YEARS[lord]) / 120;
      const start = pCursor;
      const end = addYears(start, years);
      if (now >= start && now < end) {
        pratyantar = { lord, start, end, years, nominalStart: start };
        break;
      }
      pCursor = end;
    }
    pratyantar ??= { lord: found.lord, start: found.start, end: found.end, years: found.years, nominalStart: found.start };
  }

  const currentIndex = currentMaha ? mahas.indexOf(currentMaha) : -1;
  const upcoming = currentIndex >= 0 ? mahas.slice(currentIndex + 1, currentIndex + 4).map((m) => toDto(m, now)) : [];

  return {
    system: "vimshottari",
    moonNakshatra: nak,
    moonLord: nakshatraAt(nak).lord,
    balanceAtBirth: {
      lord: startLord,
      years: Math.round(balance * 100) / 100,
      days: Math.round(balance * YEAR_DAYS),
    },
    mahadashas: mahas.map((m) => toDto(m, now)),
    current:
      currentMaha && antar && pratyantar
        ? { maha: toDto(currentMaha, now), antar: toDto(antar, now), pratyantar: toDto(pratyantar, now) }
        : null,
    upcoming,
  };
}

/**
 * Human-readable daśā line for reports and the AI prompt, e.g.
 * "Shani mahadasha (2019–2038) · Budh antardasha (2026–2028)".
 */
export function dashaSummary(dasha: DashaInfo): string {
  if (!dasha.current) return "Vimshottari dasha outside the 120-year window";
  const { maha, antar, pratyantar } = dasha.current;
  return `${maha.lordName.en} mahadasha (${maha.start}–${maha.end}) · ${antar.lordName.en} antardasha (${antar.start}–${antar.end}) · ${pratyantar.lordName.en} pratyantardasha (${pratyantar.start}–${pratyantar.end})`;
}
