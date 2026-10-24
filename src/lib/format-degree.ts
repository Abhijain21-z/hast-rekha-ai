/**
 * Degree formatting with no dependencies.
 *
 * This lives outside `astrology.ts` on purpose: `ReadingResult` is a client
 * component, and importing the astrology engine there would pull the whole
 * VSOP87 ephemeris into the browser bundle.
 */
export function formatDegree(deg: number): string {
  const safe = Number.isFinite(deg) ? deg : 0;
  const d = Math.floor(safe);
  const m = Math.round((safe - d) * 60);
  return `${d}°${String(m).padStart(2, "0")}'`;
}
