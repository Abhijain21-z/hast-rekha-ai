/**
 * City autocomplete dataset.
 *
 * Kept out of `content.ts` on purpose: the list is large (several thousand
 * districts and towns), so the reading form and the profile editor load this
 * module lazily with `useCitySearch` instead of shipping it in the first JS
 * bundle of every page that touches `content.ts`.
 */
import citiesJson from "@/content/cities.json";

export interface City {
  name: string;
  region: string;
  lat: number;
  lng: number;
  tz: number;
}

export const CITIES: City[] = (citiesJson as [string, string, number, number, number][]).map(
  ([name, region, lat, lng, tz]) => ({ name, region, lat, lng, tz }),
);

/** Prefix matches first, then anything whose city or region contains the query. */
export function searchCities(q: string, limit = 8): City[] {
  const s = q.trim().toLowerCase();
  if (!s) return [];
  const starts = CITIES.filter((c) => c.name.toLowerCase().startsWith(s));
  const contains = CITIES.filter(
    (c) => !c.name.toLowerCase().startsWith(s) && (c.name.toLowerCase().includes(s) || c.region.toLowerCase().includes(s)),
  );
  return [...starts, ...contains].slice(0, limit);
}
