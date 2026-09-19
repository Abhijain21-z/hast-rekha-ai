import type { BirthProfile, Reading } from "@/db/schema";
import type { AstroResult } from "./astrology";

export interface ReadingDTO {
  id: string;
  userId: string | null;
  title: string;
  fullName: string;
  birthDate: string;
  birthTime: string;
  timeUnknown: boolean;
  placeName: string;
  latitude: number;
  longitude: number;
  tzOffset: number;
  result: AstroResult;
  palmImage: string | null;
  palmHand: string | null;
  notes: string | null;
  isFavorite: boolean;
  premium: boolean;
  premiumUtr: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Same as ReadingDTO but without the (potentially large) palm image — for lists. */
export type ReadingSummaryDTO = Omit<ReadingDTO, "palmImage"> & { hasPalm: boolean };

export interface ProfileDTO {
  id: string;
  name: string;
  relation: string;
  birthDate: string;
  birthTime: string;
  placeName: string;
  latitude: number;
  longitude: number;
  tzOffset: number;
  createdAt: string;
  updatedAt: string;
}

export const toReadingDTO = (r: Reading): ReadingDTO => ({
  ...r,
  createdAt: r.createdAt.toISOString(),
  updatedAt: r.updatedAt.toISOString(),
});

export const toReadingSummary = (r: Reading): ReadingSummaryDTO => {
  const { palmImage, ...rest } = r;
  return { ...rest, hasPalm: !!palmImage, createdAt: r.createdAt.toISOString(), updatedAt: r.updatedAt.toISOString() };
};

export const toProfileDTO = (p: BirthProfile): ProfileDTO => ({
  ...p,
  createdAt: p.createdAt.toISOString(),
  updatedAt: p.updatedAt.toISOString(),
});

export function formatDate(iso: string, lang: "en" | "hi" = "en") {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(y, (m || 1) - 1, d || 1));
  return date.toLocaleDateString(lang === "hi" ? "hi-IN" : "en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}

export function formatTime12(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hr = h % 12 === 0 ? 12 : h % 12;
  return `${hr}:${String(m).padStart(2, "0")} ${suffix}`;
}

export function tzLabel(tz: number) {
  const sign = tz >= 0 ? "+" : "-";
  const abs = Math.abs(tz);
  const h = Math.floor(abs);
  const m = Math.round((abs - h) * 60);
  return `UTC${sign}${h}:${String(m).padStart(2, "0")}`;
}
