"use client";

import { useCallback, useMemo, useState } from "react";
import type { City } from "./cities";

type CitiesModule = typeof import("./cities");

/**
 * Lazily loads the (large) city dataset the first time a visitor actually
 * searches for a place, then answers searches from it.
 *
 * `ensure()` must be called from a focus/typing handler — nothing is downloaded
 * until then, so pages that merely render the form stay light.
 */
export function useCitySearch(query: string, enabled: boolean, limit = 8) {
  const [mod, setMod] = useState<CitiesModule | null>(null);

  const ensure = useCallback(() => {
    if (mod) return;
    import("./cities").then(setMod).catch(() => {});
  }, [mod]);

  const results: City[] = useMemo(
    () => (mod && enabled ? mod.searchCities(query, limit) : []),
    [mod, enabled, query, limit],
  );

  return { results, ensure };
}
