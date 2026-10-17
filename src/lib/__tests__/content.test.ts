import { describe, it, expect } from "vitest";
import { computeChart } from "@/lib/astrology";
import { CONTENT_LOCALES } from "@/content/locales";

/** Record every `{ en, hi, <lang> }` value whose `<lang>` text still equals the English source. */
function collectUntranslated(value: unknown, path: string, out: string[], lang: string): void {
  if (Array.isArray(value)) {
    value.forEach((v, i) => collectUntranslated(v, `${path}[${i}]`, out, lang));
    return;
  }
  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    if (typeof obj.en === "string" && obj[lang] === obj.en) out.push(`${path} (string)`);
    if (Array.isArray(obj.en) && Array.isArray(obj[lang])) {
      (obj.en as string[]).forEach((s, i) => {
        if ((obj[lang] as string[])[i] === s) out.push(`${path}[${i}] (array)`);
      });
    }
    for (const [k, v] of Object.entries(obj)) collectUntranslated(v, path ? `${path}.${k}` : k, out, lang);
  }
}
import {
  RASHIS,
  NAKSHATRAS,
  PANCHANG,
  DAILY,
  compatibility,
  dailyHoroscope,
  analysePalm,
  hashString,
  rashiAt,
  nakshatraAt,
  tithiName,
} from "@/lib/content";
import { CITIES, searchCities } from "@/lib/cities";

describe("content engine", () => {
  it("loads the core reference data", () => {
    expect(RASHIS).toHaveLength(12);
    expect(CITIES.length).toBeGreaterThan(100);
  });

  it("wraps rashi / nakshatra lookups", () => {
    expect(rashiAt(12).key).toBe(rashiAt(0).key);
    expect(rashiAt(-1).key).toBe(rashiAt(11).key);
    expect(nakshatraAt(27).key).toBe(nakshatraAt(0).key);
    expect(nakshatraAt(-1).key).toBe(nakshatraAt(26).key);
  });

  it("keeps hashString deterministic", () => {
    expect(hashString("anything")).toBe(hashString("anything"));
    expect(hashString("a")).not.toBe(hashString("b"));
  });

  it("keeps compatibility scores in range and symmetric", () => {
    for (let a = 0; a < 12; a++) {
      for (let b = 0; b < 12; b++) {
        const r = compatibility(a, b);
        expect(r.score).toBeGreaterThanOrEqual(35);
        expect(r.score).toBeLessThanOrEqual(98);
        expect(r.band).toBeGreaterThanOrEqual(0);
        expect(r.band).toBeLessThanOrEqual(3);
        expect(compatibility(b, a).score).toBe(r.score);
      }
    }
  });

  it("searches cities case-insensitively", () => {
    expect(searchCities("")).toEqual([]);
    expect(searchCities("DEL").length).toBeGreaterThan(0);
    expect(searchCities("delhi").length).toBeGreaterThan(0);
    expect(searchCities("a").length).toBeLessThanOrEqual(8);
  });

  it("produces a deterministic daily horoscope", () => {
    const date = new Date("2026-06-01T00:00:00.000Z");
    const a = dailyHoroscope(3, date);
    const b = dailyHoroscope(3, date);
    expect(a).toEqual(b);
    expect(a.luckyNumber).toBeGreaterThanOrEqual(1);
    expect(a.luckyNumber).toBeLessThanOrEqual(9);
    expect(a.date).toBe("2026-06-01");
    expect(a.message.en.length).toBeGreaterThan(0);
  });

  it("names tithis in both languages", () => {
    expect(tithiName(1, "en")).not.toBe("");
    expect(tithiName(1, "hi")).not.toBe("");
    expect(tithiName(15, "en")).not.toBe(tithiName(14, "en"));
  });

  it("analyses a palm deterministically from a seed", () => {
    const chart = computeChart({ date: "1990-05-15", time: "10:30", latitude: 28.6, longitude: 77.2, tzOffset: 5.5 });
    const a = analysePalm("seed-1", "Aarav Sharma", chart);
    const b = analysePalm("seed-1", "Aarav Sharma", chart);
    expect(a).toEqual(b);
    expect(a.lines.length).toBeGreaterThan(0);
    expect(a.summary.en).toContain("Aarav");
    expect(analysePalm("seed-2", "Aarav Sharma", chart).summary.en).toBeTruthy();
  });
});

describe("content localization", () => {
  it("serves Marathi content with an English fallback", () => {
    expect(tithiName(1, "mr")).toBe("प्रतिपदा");
    expect(NAKSHATRAS[0].name.mr).toBe("अश्विनी");
    expect(DAILY.messages[0].mr).toContain("संवाद");
    // English stays available for every localized value.
    expect(tithiName(1, "en")).toBe("Pratipada");
  });

  it("resolves per-path overrides before the shared translation", () => {
    // Same English word "Brahma": the yoga is ब्रह्म, the deity is ब्रह्मा.
    expect((PANCHANG.yogas as Record<string, string[]>).mr[24]).toBe("ब्रह्म");
    expect(NAKSHATRAS[3].deity.mr).toBe("ब्रह्मा");
  });

  it("leaves Hindi untouched by the overlays", () => {
    expect(tithiName(1, "hi")).toBe("प्रतिपदा");
    expect(NAKSHATRAS[0].name.hi).toBe("अश्विनी");
  });

  it("has no untranslated strings left in any overlay language's horoscope core", () => {
    // A missing overlay entry still resolves (to English) so the UI never breaks,
    // but it silently degrades the translation. This guards against regressions.
    for (const code of Object.keys(CONTENT_LOCALES)) {
      const missing: string[] = [];
      collectUntranslated(RASHIS, "rashis", missing, code);
      collectUntranslated(NAKSHATRAS, "nakshatras", missing, code);
      collectUntranslated(PANCHANG, "panchang", missing, code);
      collectUntranslated(DAILY, "daily", missing, code);
      expect(missing, `untranslated "${code}" strings`).toEqual([]);
    }
  });
});

describe("city autocomplete dataset", () => {
  const INDIA_REGIONS = [
    "Andaman & Nicobar, India",
    "Andhra Pradesh, India",
    "Arunachal Pradesh, India",
    "Assam, India",
    "Bihar, India",
    "Chandigarh, India",
    "Chhattisgarh, India",
    "Dadra & Nagar Haveli, India",
    "Daman & Diu, India",
    "Delhi, India",
    "Goa, India",
    "Gujarat, India",
    "Haryana, India",
    "Himachal Pradesh, India",
    "Jammu & Kashmir, India",
    "Jharkhand, India",
    "Karnataka, India",
    "Kerala, India",
    "Ladakh, India",
    "Lakshadweep, India",
    "Madhya Pradesh, India",
    "Maharashtra, India",
    "Manipur, India",
    "Meghalaya, India",
    "Mizoram, India",
    "Nagaland, India",
    "Odisha, India",
    "Puducherry, India",
    "Punjab, India",
    "Rajasthan, India",
    "Sikkim, India",
    "Tamil Nadu, India",
    "Telangana, India",
    "Tripura, India",
    "Uttar Pradesh, India",
    "Uttarakhand, India",
    "West Bengal, India",
  ];

  it("has no duplicate rows and only sane coordinates", () => {
    const seen = new Set<string>();
    for (const c of CITIES) {
      expect(Math.abs(c.lat), `${c.name} latitude`).toBeLessThanOrEqual(90);
      expect(Math.abs(c.lng), `${c.name} longitude`).toBeLessThanOrEqual(180);
      expect(Number.isFinite(c.tz), `${c.name} timezone`).toBe(true);
      const key = `${c.name}|${c.region}`.toLowerCase();
      expect(seen.has(key), `duplicate city row ${key}`).toBe(false);
      seen.add(key);
    }
  });

  it("covers every Indian state and union territory", () => {
    const regions = new Set(CITIES.map((c) => c.region));
    const missing = INDIA_REGIONS.filter((r) => !regions.has(r));
    expect(missing, `missing states/UTs: ${missing.join(", ")}`).toEqual([]);
  });

  it("finds every Indian district, not just the big metros", () => {
    for (const district of ["Betul", "Chhindwara", "Khandwa", "Shivpuri", "Barwani"]) {
      expect(searchCities(district).some((c) => c.name === district), `${district} not found`).toBe(true);
    }
  });
});
