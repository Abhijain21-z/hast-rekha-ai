import { describe, it, expect } from "vitest";
import { computeChart, type ChartInput } from "@/lib/astrology";
import { ensureAdvanced } from "@/lib/astro/hydrate";
import { ASTRO_ENGINE_VERSION } from "@/lib/astro/registry";
import { buildPalmReport } from "@/lib/palm";

const BIRTH: ChartInput = {
  date: "1990-05-15",
  time: "10:30",
  latitude: 28.6139,
  longitude: 77.209,
  tzOffset: 5.5,
};

const FIXED_NOW = new Date("2026-01-01T00:00:00.000Z");

/** One computed chart, reused by the read-only assertions below. */
const CHART = computeChart(BIRTH, { fullName: "Test Sharma", now: FIXED_NOW });
const ADV = CHART.advanced!;

describe("advanced Vedic chart", () => {
  it("is deterministic for the same input and clock", () => {
    const again = computeChart(BIRTH, { fullName: "Test Sharma", now: FIXED_NOW });
    expect(again.advanced).toEqual(ADV);
  });

  it("computes nine grahas in valid signs, houses and nakshatras", () => {
    expect(ADV.planets).toHaveLength(9);
    expect(ADV.planets.map((p) => p.key).sort()).toEqual(
      ["jupiter", "ketu", "mars", "mercury", "moon", "rahu", "saturn", "sun", "venus"],
    );
    for (const planet of ADV.planets) {
      expect(planet.sign).toBeGreaterThanOrEqual(0);
      expect(planet.sign).toBeLessThanOrEqual(11);
      expect(planet.degreeInSign).toBeGreaterThanOrEqual(0);
      expect(planet.degreeInSign).toBeLessThan(30);
      expect(planet.house).toBeGreaterThanOrEqual(1);
      expect(planet.house).toBeLessThanOrEqual(12);
      expect(planet.nakshatra).toBeGreaterThanOrEqual(0);
      expect(planet.nakshatra).toBeLessThanOrEqual(26);
      expect(planet.pada).toBeGreaterThanOrEqual(1);
      expect(planet.pada).toBeLessThanOrEqual(4);
    }
  });

  it("builds twelve whole-sign houses and sixteen vargas", () => {
    expect(ADV.houses).toHaveLength(12);
    expect(ADV.houses.map((h) => h.house)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    expect(ADV.houses[0].sign).toBe(ADV.lagna.sign);
    for (const house of ADV.houses) {
      expect(house.strength).toBeGreaterThanOrEqual(0);
      expect(house.strength).toBeLessThanOrEqual(100);
    }

    expect(ADV.vargas).toHaveLength(16);
    for (const varga of ADV.vargas) {
      expect(Object.keys(varga.planets)).toHaveLength(9);
      expect(varga.houses).toHaveLength(12);
      expect(varga.purpose.en.length).toBeGreaterThan(0);
      expect(varga.purpose.hi.length).toBeGreaterThan(0);
    }
    expect(ADV.vargas.some((v) => v.key === "D1")).toBe(true);
    expect(ADV.vargas.some((v) => v.key === "D9")).toBe(true);
  });

  it("produces a Vimshottari dasha sequence and a running period", () => {
    expect(ADV.dasha.mahadashas.length).toBeGreaterThanOrEqual(9);
    expect(ADV.dasha.current).not.toBeNull();
    const current = ADV.dasha.current!;
    expect(current.maha.start <= current.maha.end).toBe(true);
    expect(current.maha.start <= current.antar.end).toBe(true);
    expect(current.pratyantar.lord).toBeTruthy();
    expect(ADV.dasha.balanceAtBirth.years).toBeGreaterThan(0);
  });

  it("lists only yogas that met their conditions, with bilingual copy", () => {
    for (const yoga of ADV.yogas) {
      expect(yoga.key.length).toBeGreaterThan(0);
      expect(yoga.name.en.length).toBeGreaterThan(0);
      expect(yoga.name.hi.length).toBeGreaterThan(0);
      expect(yoga.description.en.length).toBeGreaterThan(0);
      expect(yoga.houses.length).toBeGreaterThan(0);
      expect(yoga.strength).toBeGreaterThanOrEqual(0);
      expect(yoga.strength).toBeLessThanOrEqual(100);
    }
  });

  it("uses the IST calendar day for gochara", () => {
    expect(ADV.transits.asOf).toBe("2026-01-01");
    expect(ADV.transits.planets).toHaveLength(9);
    for (const transit of ADV.transits.planets) {
      expect(transit.houseFromMoon).toBeGreaterThanOrEqual(1);
      expect(transit.houseFromMoon).toBeLessThanOrEqual(12);
    }
    expect(ADV.transits.sadeSati.note.en.length).toBeGreaterThan(0);
  });

  it("derives numerology from the birth date and name", () => {
    expect(ADV.numerology.mulank).toBeGreaterThanOrEqual(1);
    expect(ADV.numerology.mulank).toBeLessThanOrEqual(9);
    expect(ADV.numerology.bhagyank).toBeGreaterThanOrEqual(1);
    expect(ADV.numerology.bhagyank).toBeLessThanOrEqual(9);
    expect(ADV.numerology.namank).toBeGreaterThanOrEqual(1);
    expect(ADV.numerology.namank).toBeLessThanOrEqual(9);
    expect(ADV.numerology.luckyNumbers.length).toBeGreaterThan(0);
  });

  it("records every calculation in the registry stamp", () => {
    expect(ADV.version).toBe(ASTRO_ENGINE_VERSION);
    expect(ADV.calculations.length).toBeGreaterThanOrEqual(10);
    for (const entry of ADV.calculations) {
      expect(entry.id.length).toBeGreaterThan(0);
      expect(entry.version.length).toBeGreaterThan(0);
    }
  });

  it("hydrates older readings and refreshes transits without recomputing the natal chart", () => {
    const base = computeChart(BIRTH, { advanced: false });
    expect(base.advanced).toBeUndefined();

    const row = {
      fullName: "Test Sharma",
      birthDate: BIRTH.date,
      birthTime: BIRTH.time,
      latitude: BIRTH.latitude,
      longitude: BIRTH.longitude,
      tzOffset: BIRTH.tzOffset,
      result: base,
    };

    const hydrated = ensureAdvanced(row, FIXED_NOW);
    expect(hydrated.advanced?.planets).toHaveLength(9);
    expect(hydrated.advanced?.transits.asOf).toBe("2026-01-01");

    const later = ensureAdvanced(
      { ...row, result: { ...base, advanced: hydrated.advanced } },
      new Date("2026-03-01T00:00:00.000Z"),
    );
    expect(later.advanced?.transits.asOf).toBe("2026-03-01");
    // Natal positions are saved data; only the date-dependent layer moves.
    expect(later.advanced?.planets).toEqual(hydrated.advanced?.planets);
  });
});

describe("advanced palmistry details", () => {
  const base = computeChart(BIRTH, { advanced: false });
  const input = {
    fullName: "Test Sharma",
    birthDate: BIRTH.date,
    birthTime: BIRTH.time,
    result: base,
    now: FIXED_NOW,
  };

  it("is deterministic and keeps the existing report stable", () => {
    const first = buildPalmReport(input);
    const second = buildPalmReport(input);
    expect(second).toEqual(first);
    expect(first.lines).toHaveLength(10);
    expect(first.mounts).toHaveLength(7);
  });

  it("adds eight minor lines and five finger readings", () => {
    const { details } = buildPalmReport(input);
    expect(details.minorLines).toHaveLength(8);
    expect(details.fingers).toHaveLength(5);

    for (const item of [...details.minorLines, ...details.fingers]) {
      expect(item.def.name.en.length).toBeGreaterThan(0);
      expect(item.def.name.hi.length).toBeGreaterThan(0);
      expect(item.variant.label.en.length).toBeGreaterThan(0);
      expect(item.variant.text.en.length).toBeGreaterThan(80);
      expect(item.variant.text.hi.length).toBeGreaterThan(40);
      expect(item.strength).toBeGreaterThanOrEqual(50);
      expect(item.strength).toBeLessThanOrEqual(98);
    }
  });

  it("reads skin and nails", () => {
    const { details } = buildPalmReport(input);
    expect(details.skin.label.en.length).toBeGreaterThan(0);
    expect(details.skin.text.hi.length).toBeGreaterThan(20);
    expect(details.nails.label.en.length).toBeGreaterThan(0);
    expect(details.nails.text.hi.length).toBeGreaterThan(20);
  });

  it("ranks the three fullest mounts from the existing mount set", () => {
    const report = buildPalmReport(input);
    const { dominantMounts } = report.details;
    expect(dominantMounts).toHaveLength(3);
    const byKey = new Map(report.mounts.map((m) => [m.def.key, m.strength]));
    for (const mount of dominantMounts) {
      expect(mount.strength).toBe(byKey.get(mount.def.key));
    }
    expect(dominantMounts[0].strength).toBeGreaterThanOrEqual(dominantMounts[1].strength);
    expect(dominantMounts[1].strength).toBeGreaterThanOrEqual(dominantMounts[2].strength);
  });

  it("maps each timing band onto a real major line", () => {
    const report = buildPalmReport(input);
    const lineKeys = new Set(report.lines.map((l) => l.def.key));
    expect(report.details.timing.length).toBeGreaterThanOrEqual(7);
    for (const band of report.details.timing) {
      expect(lineKeys.has(band.def.key)).toBe(true);
      expect(band.start).toBeGreaterThanOrEqual(0);
      expect(band.peak).toBeGreaterThanOrEqual(band.start);
      expect(band.peak).toBeLessThanOrEqual(band.end);
      expect(band.note.en.length).toBeGreaterThan(0);
      expect(band.note.hi.length).toBeGreaterThan(0);
    }
  });
});
