"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { dictionaries, pick, type Bi, type Dict, type Lang } from "@/lib/i18n";
import { CONTENT_LANGS } from "@/content/locales";

interface LangCtx {
  lang: Lang;
  /** Language code to read authored content with (a full content language, or hi/en). */
  cl: Lang;
  t: Dict;
  setLang: (l: Lang) => void;
  toggle: () => void;
  L: (v: Bi | undefined | null) => string;
}

const Ctx = createContext<LangCtx | null>(null);

export function LanguageProvider({ children, initial = "hi" }: { children: ReactNode; initial?: Lang }) {
  const [lang, setLangState] = useState<Lang>(initial in dictionaries ? initial : "hi");

  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dataset.lang = lang;
    root.dir = lang === "ur" ? "rtl" : "ltr";
    document.cookie = `hr_lang=${lang}; path=/; max-age=31536000; samesite=lax`;
  }, [lang]);

  const setLang = useCallback((l: Lang) => setLangState(l in dictionaries ? l : "en"), []);
  const toggle = useCallback(() => setLangState((p) => (p === "hi" ? "en" : "hi")), []);

  // Full content languages read their own content; others fall back to hi/en.
  const cl: Lang = CONTENT_LANGS.includes(lang) ? lang : lang === "hi" ? "hi" : "en";
  const L = useCallback((v: Bi | undefined | null) => pick(cl, v), [cl]);

  const value = useMemo<LangCtx>(() => ({ lang, cl, t: dictionaries[lang] ?? dictionaries.en, setLang, toggle, L }), [lang, cl, setLang, toggle, L]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLang(): LangCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLang must be used inside LanguageProvider");
  return ctx;
}
