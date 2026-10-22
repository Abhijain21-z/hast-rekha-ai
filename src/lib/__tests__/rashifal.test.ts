import { describe, expect, it } from "vitest";
import {
  addDaysToKey,
  formatRashifalWeek,
  istDateKey,
  rashifalFor,
  weekStartKey,
} from "@/lib/rashifal";

describe("rashifal engine", () => {
  const now = new Date("2026-10-22T10:00:00+05:30");

  it("uses the India calendar date, including around UTC midnight", () => {
    expect(istDateKey(now)).toBe("2026-10-22");
    expect(istDateKey(new Date("2026-10-21T20:00:00Z"))).toBe("2026-10-22");
    expect(addDaysToKey("2026-10-22", 1)).toBe("2026-10-23");
    expect(weekStartKey("2026-10-22")).toBe("2026-10-19");
  });

  it("produces today, tomorrow and the current week deterministically", () => {
    const today = rashifalFor(3, "today", now);
    const tomorrow = rashifalFor(3, "tomorrow", now);
    const week = rashifalFor(3, "week", now);

    expect(today.dateKey).toBe("2026-10-22");
    expect(tomorrow.dateKey).toBe("2026-10-23");
    expect(week.weekStartKey).toBe("2026-10-19");
    expect(week.weekEndKey).toBe("2026-10-25");
    expect(today.message).not.toEqual(tomorrow.message);
    expect(week.message.en.length).toBeGreaterThan(20);
    expect(formatRashifalWeek("2026-10-19", "2026-10-25", "en")).toContain("2026");
    expect(rashifalFor(3, "today", now)).toEqual(today);

    const monday = rashifalFor(3, "week", new Date("2026-10-19T10:00:00+05:30"));
    const sunday = rashifalFor(3, "week", new Date("2026-10-25T10:00:00+05:30"));
    expect(sunday.message).toEqual(monday.message);
    expect(sunday.scores).toEqual(monday.scores);
  });

  it("keeps every life-area score in a readable range", () => {
    for (const period of ["today", "tomorrow", "week"] as const) {
      const result = rashifalFor(7, period, now);
      for (const score of Object.values(result.scores)) {
        expect(score).toBeGreaterThanOrEqual(58);
        expect(score).toBeLessThanOrEqual(95);
      }
      expect(result.luckyNumber).toBeGreaterThanOrEqual(1);
      expect(result.luckyNumber).toBeLessThanOrEqual(9);
    }
  });
});
