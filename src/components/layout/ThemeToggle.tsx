"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import { DEFAULT_THEME, applyTheme, currentTheme, subscribeTheme } from "@/lib/theme";

/** Light/dark switch for the whole site. Dark is the default. */
export default function ThemeToggle({ compact }: { compact?: boolean }) {
  const { t } = useLang();
  // The live theme IS an external store (the data-theme attribute), so read it
  // through useSyncExternalStore: correct on the server, updates on toggle, and
  // no setState-in-effect.
  const theme = useSyncExternalStore(subscribeTheme, currentTheme, () => DEFAULT_THEME);
  const isLight = theme === "light";
  const label = isLight ? t.top.themeToDark : t.top.themeToLight;

  return (
    <button
      type="button"
      onClick={() => applyTheme(isLight ? "dark" : "light")}
      title={label}
      aria-label={label}
      className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-semibold text-slate-100 transition hover:border-gold-400/50"
    >
      {isLight ? <Moon className="h-3.5 w-3.5 text-gold-300" /> : <Sun className="h-3.5 w-3.5 text-gold-300" />}
      {!compact && <span className="hidden sm:inline">{label}</span>}
    </button>
  );
}
