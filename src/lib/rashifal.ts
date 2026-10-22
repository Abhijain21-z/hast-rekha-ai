import weeklyJson from "@/content/weekly.json";
import { localize } from "@/content/locales";
import {
  DAILY,
  RASHIS,
  dailyHoroscope,
  hashString,
  rashiAt,
  type PredictionKey,
} from "./content";
import type { Bi, Lang } from "./i18n";

const WEEKLY = localize(weeklyJson, "weekly") as {
  messages: Bi[];
  themes: Bi[];
  remedies: Bi[];
};

export const IST_TIME_ZONE = "Asia/Kolkata";

export type RashifalPeriod = "today" | "tomorrow" | "week";

export const RASHIFAL_PERIODS: { key: RashifalPeriod; label: Bi }[] = [
  { key: "today", label: { en: "Today", hi: "आज" } },
  { key: "tomorrow", label: { en: "Tomorrow", hi: "कल" } },
  { key: "week", label: { en: "This Week", hi: "इस हफ़्ते" } },
];

export interface Rashifal {
  period: RashifalPeriod;
  dateKey: string;
  weekStartKey: string | null;
  weekEndKey: string | null;
  message: Bi;
  mood: Bi;
  luckyNumber: number;
  luckyColor: Bi;
  luckyDay: Bi;
  scores: Record<PredictionKey, number>;
  focus: Bi;
  remedy: Bi;
}

const LOCALES: Record<string, string> = {
  hi: "hi-IN",
  en: "en-IN",
  mr: "mr-IN",
  te: "te-IN",
  gu: "gu-IN",
};

function localeFor(lang: Lang): string {
  return LOCALES[lang] ?? "en-IN";
}

/** The calendar date in India, not the server's local date. */
export function istDateKey(date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: IST_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

export function addDaysToKey(key: string, days: number): string {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day + days)).toISOString().slice(0, 10);
}

export function dayOfYearFromKey(key: string): number {
  const [year, month, day] = key.split("-").map(Number);
  return Math.floor((Date.UTC(year, month - 1, day) - Date.UTC(year, 0, 0)) / 86400000);
}

/** Monday-based week, matching the usual Hindi weekly rashifal. */
export function weekStartKey(key: string): string {
  const weekday = new Date(`${key}T00:00:00Z`).getUTCDay(); // 0 = Sunday
  return addDaysToKey(key, -((weekday + 6) % 7));
}

export function formatRashifalDate(
  key: string,
  lang: Lang,
  opts: { weekday?: boolean; year?: boolean } = {},
): string {
  const date = new Date(`${key}T12:00:00+05:30`);
  return new Intl.DateTimeFormat(localeFor(lang), {
    weekday: opts.weekday ? "long" : undefined,
    day: "numeric",
    month: "short",
    year: opts.year ? "numeric" : undefined,
    timeZone: IST_TIME_ZONE,
  }).format(date);
}

export function formatRashifalWeek(startKey: string, endKey: string, lang: Lang): string {
  const fmt = new Intl.DateTimeFormat(localeFor(lang), {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: IST_TIME_ZONE,
  });
  return `${fmt.format(new Date(`${startKey}T12:00:00+05:30`))} – ${fmt.format(new Date(`${endKey}T12:00:00+05:30`))}`;
}

export function rashiIndexFromKey(key?: string | null): number {
  const index = RASHIS.findIndex((r) => r.key === key);
  return index >= 0 ? index : 0;
}

/**
 * Rule-based daily, tomorrow and weekly rashifal. Same inputs always produce
 * the same result, so the reading page and the public rashifal page agree.
 */
export function rashifalFor(
  rashiIndex: number,
  period: RashifalPeriod = "today",
  now = new Date(),
): Rashifal {
  const todayKey = istDateKey(now);
  const targetKey = period === "tomorrow" ? addDaysToKey(todayKey, 1) : todayKey;
  const rashi = rashiAt(rashiIndex);
  const monday = weekStartKey(targetKey);
  const sunday = addDaysToKey(monday, 6);
  // Anchor the weekly content to Monday, so it never changes mid-week.
  const weekIndex = Math.floor((dayOfYearFromKey(monday) - 1) / 7);

  // Passing noon IST keeps the legacy dailyHoroscope UTC date equal to targetKey.
  const daily = dailyHoroscope(rashiIndex, new Date(`${targetKey}T12:00:00+05:30`));

  const message =
    period === "week"
      ? WEEKLY.messages[(weekIndex * 5 + rashiIndex * 7) % WEEKLY.messages.length]
      : daily.message;

  const mood =
    period === "week"
      ? DAILY.moods[(weekIndex + rashiIndex * 3) % DAILY.moods.length]
      : daily.mood;

  const seed = period === "week" ? `${monday}:week` : targetKey;
  const scores = Object.fromEntries(
    (["career", "love", "health", "finance"] as PredictionKey[]).map((area) => [
      area,
      58 + (hashString(`${seed}:${rashiIndex}:${area}`) % 38),
    ]),
  ) as Record<PredictionKey, number>;
  const contentIndex = period === "week" ? weekIndex : dayOfYearFromKey(targetKey);

  return {
    period,
    dateKey: targetKey,
    weekStartKey: period === "week" ? monday : null,
    weekEndKey: period === "week" ? sunday : null,
    message,
    mood,
    luckyNumber:
      period === "week"
        ? ((weekIndex + rashiIndex * rashi.lucky.number) % 9) + 1
        : daily.luckyNumber,
    luckyColor: rashi.lucky.color,
    luckyDay: rashi.lucky.day,
    scores,
    focus: WEEKLY.themes[(contentIndex + rashiIndex) % WEEKLY.themes.length],
    remedy: WEEKLY.remedies[(contentIndex * 3 + rashiIndex * 5) % WEEKLY.remedies.length],
  };
}
