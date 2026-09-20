"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LayoutDashboard, BookOpen, PlusCircle, Users, Settings, LogOut, Menu, X, Sparkles, Home } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import { LangToggle } from "@/components/layout/Navbar";
import { Avatar, cn } from "@/components/ui";

export interface ShellUser { name: string; email: string; preferredLang: string }

export default function DashboardShell({ user, children }: { user: ShellUser; children: ReactNode }) {
  const { t } = useLang();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  const nav = [
    { href: "/dashboard", label: t.dash.overview, icon: LayoutDashboard, exact: true },
    { href: "/dashboard/readings", label: t.dash.readings, icon: BookOpen },
    { href: "/reading", label: t.dash.newReading, icon: PlusCircle },
    { href: "/dashboard/profiles", label: t.dash.profiles, icon: Users },
    { href: "/dashboard/settings", label: t.dash.settings, icon: Settings },
  ];

  const isActive = (href: string, exact?: boolean) => (exact ? pathname === href : pathname.startsWith(href));

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  const Sidebar = (
    <div className="flex h-full flex-col">
      <Link href="/" className="flex items-center gap-2.5 px-5 pt-6">
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold-400/50 bg-gradient-to-br from-mystic-700 to-cosmic-900 text-gold-300 gold-glow"><Sparkles className="h-5 w-5" /></span>
        <span className="flex flex-col leading-none">
          <span className="font-display text-base font-semibold text-white">{t.brand}</span>
          <span className="text-[9px] uppercase tracking-[0.25em] text-gold-400/80">{t.nav.dashboard}</span>
        </span>
      </Link>

      <nav className="mt-8 flex-1 space-y-1 px-3">
        {nav.map((n) => {
          const active = isActive(n.href, n.exact);
          return (
            <Link
              key={n.href}
              href={n.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-all",
                active ? "bg-gradient-to-r from-gold-400/20 to-transparent text-gold-200" : "text-slate-300 hover:bg-white/5 hover:text-white",
              )}
            >
              {active && <motion.span layoutId="active-pill" className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-gold-400" />}
              <n.icon className={cn("h-4.5 w-4.5 h-[18px] w-[18px]", active ? "text-gold-300" : "text-slate-400 group-hover:text-gold-200")} />
              {n.label}
            </Link>
          );
        })}
        <Link href="/" className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-slate-400 hover:bg-white/5 hover:text-white">
          <Home className="h-[18px] w-[18px]" /> {t.nav.home}
        </Link>
      </nav>

      <div className="border-t border-white/8 p-4">
        <div className="mb-3 flex justify-center"><LangToggle /></div>
        <div className="glass flex items-center gap-3 rounded-2xl p-3">
          <Avatar name={user.name} size={38} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">{user.name}</p>
            <p className="truncate text-xs text-slate-400">{user.email}</p>
          </div>
          <button onClick={logout} className="rounded-full p-2 text-slate-400 hover:bg-rose-500/15 hover:text-rose-300" title={t.nav.logout}>
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Desktop sidebar */}
      <aside className="glass-strong fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-white/8 lg:block">{Sidebar}</aside>

      {/* Mobile top bar */}
      <div className="glass-strong sticky top-0 z-40 flex items-center justify-between px-4 py-3 lg:hidden">
        <Link href="/" className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-gold-300" />
          <span className="font-display text-base text-white">{t.brand}</span>
        </Link>
        <div className="flex items-center gap-2">
          <LangToggle compact />
          <button onClick={() => setOpen(true)} className="rounded-full p-2 text-slate-200 hover:bg-white/10" aria-label="Menu"><Menu className="h-6 w-6" /></button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm lg:hidden" />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="glass-strong fixed inset-y-0 left-0 z-50 w-72 lg:hidden">
              <button onClick={() => setOpen(false)} className="absolute right-3 top-4 rounded-full p-2 text-slate-300 hover:bg-white/10" aria-label="Close"><X className="h-5 w-5" /></button>
              {Sidebar}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="lg:pl-64">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10">{children}</div>
      </main>
    </div>
  );
}
