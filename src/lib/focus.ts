import type { Area } from "./palm";
import type { Bi } from "./i18n";

/**
 * The reader's main life concern. The reading form asks for it once, and the
 * result page shows that area first so the answer they came for is not buried
 * under a generic report.
 */
export const FOCUS_OPTIONS: { key: string; area: Area; label: Bi }[] = [
  { key: "career", area: "career", label: { en: "Career / job", hi: "करियर / नौकरी" } },
  { key: "marriage", area: "love", label: { en: "Marriage / relationship", hi: "विवाह / रिश्ता" } },
  { key: "money", area: "wealth", label: { en: "Money / debt", hi: "धन / कर्ज़" } },
  { key: "health", area: "health", label: { en: "Health", hi: "स्वास्थ्य" } },
  { key: "family", area: "family", label: { en: "Family", hi: "परिवार" } },
  { key: "love", area: "love", label: { en: "Love life", hi: "प्रेम जीवन" } },
  { key: "spirituality", area: "spirituality", label: { en: "Peace / spirituality", hi: "शांति / आध्यात्म" } },
  { key: "travel", area: "travel", label: { en: "Foreign travel", hi: "विदेश यात्रा" } },
  { key: "fame", area: "fame", label: { en: "Recognition / fame", hi: "पहचान / यश" } },
];

export type FocusKey = (typeof FOCUS_OPTIONS)[number]["key"];

const FOCUS_KEYS = new Set(FOCUS_OPTIONS.map((option) => option.key));

export function isFocusKey(value: unknown): value is FocusKey {
  return typeof value === "string" && FOCUS_KEYS.has(value);
}

export function focusOption(key: string | null | undefined) {
  return FOCUS_OPTIONS.find((option) => option.key === key) ?? null;
}

export function focusArea(key: string | null | undefined): Area | null {
  return focusOption(key)?.area ?? null;
}

/** Readings store the focus in the existing `notes` column as `focus:<key>`. */
export function encodeFocus(key: string | null | undefined): string | null {
  return isFocusKey(key) ? `focus:${key}` : null;
}

export function parseFocus(notes: string | null | undefined): FocusKey | null {
  if (typeof notes !== "string") return null;
  const match = notes.match(/(?:^|\s)focus:([a-z]+)(?:\s|$)/);
  return match && isFocusKey(match[1]) ? match[1] : null;
}
