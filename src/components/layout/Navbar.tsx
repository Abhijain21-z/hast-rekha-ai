"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Sparkles, LayoutDashboard, LogOut, Globe, ChevronDown } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import { LANGS } from "@/lib/lang-overrides";
import { Avatar, cn } from "@/components/ui";

export type NavUser = { name: string; email: string } | null;

export function LangToggle({ compact }: { compact?: boolean }) {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onDoc = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);
  const current = LANGS.find((l) => l.code === lang) ?? LANGS[0];
  return (
    <div ref={ref} className={cn("relative", compact && "scale-95")}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-100 transition hover:border-gold-400/50"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <Globe className="h-3.5 w-3.5 text-gold-300" />
        <span className="max-w-[72px] truncate">{current.native}</span>
        <ChevronDown className={cn("h-3 w-3 text-slate-400 transition-transform", open && "rotate-180")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            role="listbox"
            className="glass-strong absolute right-0 z-[80] mt-2 max-h-80 w-44 overflow-auto rounded-2xl p-1.5 shadow-2xl"
          >
            {LANGS.map((l) => (
              <li key={l.code}>
                <button
                  role="option"
                  aria-selected={lang === l.code}
                  onClick={() => { setLang(l.code); setOpen(false); }}
                  className={cn("flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition", lang === l.code ? "bg-gold-400/20 text-gold-100" : "text-slate-200 hover:bg-white/8")}
                >
                  <span>{l.native}</span>
                  <span className="text-xs text-slate-500">{l.english}</span>
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Logo({ className }: { className?: string }) {
  const { t } = useLang();
  return (
    <Link href="/" className={cn("group flex items-center gap-2.5", className)}>
      <span className="relative flex h-10 w-10 items-center justify-center rounded-full border border-gold-400/50 bg-gradient-to-br from-mystic-700 to-cosmic-900 text-gold-300 gold-glow transition-transform group-hover:rotate-12">
        <Sparkles className="h-5 w-5" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-lg font-semibold tracking-wide text-white">{t.brand}</span>
        <span className="hidden text-xs uppercase tracking-[0.25em] text-gold-400/80 xl:block">{t.tagline}</span>
      </span>
    </Link>
  );
}

export default function Navbar({ user }: { user: NavUser }) {
  const { t } = useLang();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const home = pathname === "/";
  const links = [
    { href: "/", label: t.nav.home },
    { href: home ? "#features" : "/#features", label: t.nav.features },
    { href: home ? "#how-it-works" : "/#how-it-works", label: t.nav.how },
    { href: home ? "#reviews" : "/#reviews", label: t.nav.reviews },
    { href: "/rashi", label: t.nav.rashi },
    { href: "/blog", label: t.nav.blog },
    { href: "/about", label: t.nav.about },
    { href: "/contact", label: t.nav.contact },
  ];

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.refresh();
    router.push("/");
  }

  return (
    <header className={cn("fixed inset-x-0 top-0 z-50 transition-all duration-300", scrolled || open ? "glass-strong shadow-lg shadow-black/30" : "bg-cosmic-950/40 backdrop-blur-sm")}>
      {/* Top language bar — always visible so users can switch the whole site's language */}
      <div className="border-b border-gold-400/20 bg-gradient-to-r from-mystic-700/40 via-cosmic-800/60 to-mystic-700/40">
        <div className="mx-auto flex h-[34px] max-w-7xl items-center justify-center gap-3 px-4 text-xs sm:justify-between sm:px-6 lg:px-8">
          <span className="hidden text-gold-200/90 sm:inline">ॐ श्री गणेशाय नमः · {t.tagline}</span>
          <div className="flex items-center gap-2">
            <Globe className="h-3.5 w-3.5 text-gold-300" />
            <span className="text-slate-200">{t.top.choose}:</span>
            <LangToggle compact />
          </div>
        </div>
      </div>
      <nav className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={cn(
                  "rounded-full px-2.5 py-2 text-[13px] text-slate-300 transition-colors hover:bg-white/6 hover:text-white xl:px-3.5 xl:text-sm",
                  pathname === l.href && l.href !== "/" && "text-gold-300",
                )}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2.5 lg:flex xl:gap-3">
          {user ? (
            <>
              <Link href="/dashboard" className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1 pl-1 pr-4 text-sm text-slate-100 hover:bg-white/10">
                <Avatar name={user.name} size={30} />
                <span className="max-w-[120px] truncate">{user.name.split(" ")[0]}</span>
              </Link>
              <Link href="/reading" className="btn-gold rounded-full px-5 py-2.5 text-sm">
                {t.nav.getReading}
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="rounded-full px-4 py-2 text-sm text-slate-200 hover:text-white">
                {t.nav.login}
              </Link>
              <Link href="/reading" className="btn-gold rounded-full px-5 py-2.5 text-sm">
                {t.nav.getReading}
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <button onClick={() => setOpen((o) => !o)} className="rounded-full p-2 text-slate-200 hover:bg-white/10" aria-label="Menu">
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-white/10 lg:hidden"
          >
            <div className="space-y-1 px-4 py-4">
              {links.map((l, i) => (
                <motion.div key={l.href} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                  <Link href={l.href} onClick={() => setOpen(false)} className="block rounded-xl px-4 py-3 text-base text-slate-200 hover:bg-white/6">
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              <div className="mt-3 flex flex-col gap-2 border-t border-white/10 pt-4">
                {user ? (
                  <>
                    <Link href="/dashboard" className="flex items-center gap-2 rounded-xl px-4 py-3 text-slate-100 hover:bg-white/6">
                      <LayoutDashboard className="h-4 w-4 text-gold-300" /> {t.nav.dashboard}
                    </Link>
                    <button onClick={logout} className="flex items-center gap-2 rounded-xl px-4 py-3 text-left text-slate-300 hover:bg-white/6">
                      <LogOut className="h-4 w-4" /> {t.nav.logout}
                    </button>
                  </>
                ) : (
                  <Link href="/login" className="rounded-xl px-4 py-3 text-slate-100 hover:bg-white/6">
                    {t.nav.login} / {t.nav.register}
                  </Link>
                )}
                <Link href="/reading" className="btn-gold rounded-full px-5 py-3 text-center text-sm">
                  {t.nav.getReading}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
