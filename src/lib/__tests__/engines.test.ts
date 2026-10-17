import { describe, it, expect } from "vitest";
import {
  computeChart,
  westernSunSign,
  lahiriAyanamsa,
  ascendantLongitude,
  norm360,
  formatDegree,
  type ChartInput,
} from "@/lib/astrology";
import { buildPalmReport, AREAS } from "@/lib/palm";
import { buildPremiumReport, upiDeepLink, PREMIUM_PRICE } from "@/lib/premium";

const BIRTH: ChartInput = {
  date: "1990-05-15",
  time: "10:30",
  latitude: 28.6139,
  longitude: 77.209,
  tzOffset: 5.5,
};

const FIXED_NOW = new Date("2026-01-01T00:00:00.000Z");

describe("astrology engine", () => {
  it("is deterministic for the same input", () => {
    expect(computeChart(BIRTH)).toEqual(computeChart(BIRTH));
  });

  it("produces in-range Vedic values", () => {
    const c = computeChart(BIRTH);
    expect(c.engine).toBe("astronomia");
    expect(c.moonRashi).toBeGreaterThanOrEqual(0);
    expect(c.moonRashi).toBeLessThanOrEqual(11);
    expect(c.nakshatra).toBeGreaterThanOrEqual(0);
    expect(c.nakshatra).toBeLessThanOrEqual(26);
    expect(c.pada).toBeGreaterThanOrEqual(1);
    expect(c.pada).toBeLessThanOrEqual(4);
    expect(c.tithi).toBeGreaterThanOrEqual(1);
    expect(c.tithi).toBeLessThanOrEqual(30);
    expect(c.yoga).toBeGreaterThanOrEqual(0);
    expect(c.yoga).toBeLessThanOrEqual(26);
    expect(c.lagna).toBeGreaterThanOrEqual(0);
    expect(c.lagna).toBeLessThanOrEqual(11);
    expect(c.moonPhase).toBeGreaterThanOrEqual(0);
    expect(c.moonPhase).toBeLessThanOrEqual(1);
    // Lahiri ayanamsa is ~24 degrees in the modern era.
    expect(c.ayanamsa).toBeGreaterThan(23);
    expect(c.ayanamsa).toBeLessThan(25);
  });

  it("keeps paksha consistent with tithi", () => {
    for (const t of ["06:00", "12:00", "18:00", "23:30"]) {
      const c = computeChart({ ...BIRTH, time: t });
      expect(c.paksha).toBe(c.tithi <= 15 ? "shukla" : "krishna");
    }
  });

  it("rejects an invalid date", () => {
    expect(() => computeChart({ ...BIRTH, date: "not-a-date" })).toThrow();
  });

  it("maps western sun signs from the date table", () => {
    expect(westernSunSign(5, 15)).toBe(1); // Taurus
    expect(westernSunSign(1, 10)).toBe(9); // Capricorn
    expect(westernSunSign(3, 25)).toBe(0); // Aries
  });

  it("advances the ayanamsa over time", () => {
    expect(lahiriAyanamsa(2451545.0 + 36525)).toBeGreaterThan(lahiriAyanamsa(2451545.0));
  });

  it("keeps helpers normalised", () => {
    expect(norm360(-10)).toBeCloseTo(350, 6);
    expect(norm360(370)).toBeCloseTo(10, 6);
    expect(ascendantLongitude(0, 0, 23.44)).toBeGreaterThanOrEqual(0);
    expect(ascendantLongitude(0, 0, 23.44)).toBeLessThan(360);
    expect(formatDegree(12.5)).toBe("12°30'");
  });
});

describe("palm report engine", () => {
  const input = () => ({
    fullName: "Aarav Sharma",
    birthDate: "1990-05-15",
    birthTime: "10:30",
    result: computeChart(BIRTH),
    now: FIXED_NOW,
  });

  it("is deterministic for the same person", () => {
    expect(buildPalmReport(input())).toEqual(buildPalmReport(input()));
  });

  it("covers every area with a clamped score", () => {
    const r = buildPalmReport(input());
    expect(Object.keys(r.scores).sort()).toEqual([...AREAS].sort());
    for (const area of AREAS) {
      expect(r.scores[area]).toBeGreaterThanOrEqual(56);
      expect(r.scores[area]).toBeLessThanOrEqual(97);
    }
  });

  it("returns populated report sections", () => {
    const r = buildPalmReport(input());
    expect(r.seed).toBeGreaterThan(0);
    expect(r.lines.length).toBeGreaterThan(0);
    expect(r.mounts.length).toBeGreaterThan(0);
    expect(r.sections.length).toBeGreaterThan(0);
    expect(r.graph.length).toBeGreaterThan(0);
    expect(r.decades.length).toBeGreaterThan(0);
    expect(r.age).toBe(35); // 2026 - 1990 - 1 (birthday not yet reached)
  });

  it("gives different people different readings", () => {
    const a = buildPalmReport(input());
    const b = buildPalmReport({ ...input(), fullName: "Meera Iyer" });
    expect(a.seed).not.toBe(b.seed);
  });

  it("folds the palm image into the seed", () => {
    const plain = buildPalmReport(input());
    const withImage = buildPalmReport({ ...input(), palmImage: "data:image/png;base64,AAAA" });
    expect(withImage.seed).not.toBe(plain.seed);
  });
});

describe("premium report engine", () => {
  it("builds a deterministic 5-year window starting next calendar year", () => {
    const args = {
      result: computeChart(BIRTH),
      seed: 123456,
      fullName: "Aarav Sharma",
      birthYear: 1990,
      now: FIXED_NOW,
    };
    const a = buildPremiumReport(args);
    const b = buildPremiumReport(args);
    expect(a).toEqual(b);
    expect(a.years).toHaveLength(5);
    expect(a.years[0].calendarYear).toBe(2027);
    expect(a.years[4].calendarYear).toBe(2031);
  });

  it("encodes the UPI deep link with the correct amount", () => {
    const link = upiDeepLink("abcdefgh-1234-5678");
    expect(link.startsWith("upi://pay?")).toBe(true);
    expect(link).toContain(`am=${PREMIUM_PRICE.toFixed(2)}`);
    expect(link).toContain("cu=INR");
    expect(link).toContain("9522333669%40jio");
  });
});
