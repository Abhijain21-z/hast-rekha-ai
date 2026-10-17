/**
 * Theme is CSS-variable driven: `html[data-theme="light"]` re-declares the
 * Tailwind palette tokens, which flips the whole site without per-component
 * changes. Dark is the default and the fallback.
 */
export type Theme = "dark" | "light";

export const THEME_COOKIE = "hr_theme";
export const DEFAULT_THEME: Theme = "dark";

export function isTheme(value: unknown): value is Theme {
  return value === "dark" || value === "light";
}

/** Reads the theme the server rendered with, so a toggle can start in sync. */
export function currentTheme(): Theme {
  if (typeof document === "undefined") return DEFAULT_THEME;
  return isTheme(document.documentElement.dataset.theme) ? (document.documentElement.dataset.theme as Theme) : DEFAULT_THEME;
}

const listeners = new Set<() => void>();

/** Stable subscribe callback for useSyncExternalStore. */
export function subscribeTheme(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Applies a theme instantly and remembers it (cookie for SSR, localStorage for fast reads). */
export function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
  try {
    document.cookie = `${THEME_COOKIE}=${theme}; path=/; max-age=31536000; samesite=lax`;
  } catch {
    /* cookie blocked — the theme still applies for this page view */
  }
  try {
    localStorage.setItem(THEME_COOKIE, theme);
  } catch {
    /* storage blocked — ignore */
  }
  listeners.forEach((l) => l());
}
