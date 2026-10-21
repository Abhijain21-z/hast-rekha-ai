const LOCALES: Record<string, string> = {
  en: "en-IN",
  hi: "hi-IN",
};

/** Date + time in IST, e.g. "21 Oct 2026, 10:45 pm IST". */
export function formatReviewDateTime(value: string | Date | null | undefined, lang = "en") {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  try {
    return new Intl.DateTimeFormat(LOCALES[lang] ?? lang, {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
      timeZoneName: "short",
    }).format(date);
  } catch {
    return date.toISOString();
  }
}
