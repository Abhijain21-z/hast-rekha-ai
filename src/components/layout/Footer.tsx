"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Globe, MessageCircle, Share2, Mail, Send, Sparkles } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import { Button, Input, Textarea, Label, SectionHeading } from "@/components/ui";
import { DonateButton } from "@/components/reading/DonateModal";

function ContactForm() {
  const { t } = useLang();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function submit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error();
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={submit} className="glass-strong rounded-3xl p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>{t.contact.name}</Label>
          <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Aarav Sharma" />
        </div>
        <div>
          <Label>{t.contact.email}</Label>
          <Input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
        </div>
      </div>
      <div className="mt-4">
        <Label>{t.contact.message}</Label>
        <Textarea required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="…" />
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-4">
        <Button type="submit" loading={status === "sending"} icon={<Send className="h-4 w-4" />}>
          {status === "sending" ? t.contact.sending : t.contact.send}
        </Button>
        {status === "sent" && <p className="text-sm text-emerald-300">{t.contact.sent}</p>}
        {status === "error" && <p className="text-sm text-rose-300">{t.contact.error}</p>}
      </div>
    </form>
  );
}

export default function Footer() {
  const { t } = useLang();
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-24 border-t border-white/8">
      <section id="contact" className="mx-auto max-w-7xl scroll-mt-24 px-4 pt-20 sm:px-6 lg:px-8">
        <div className="grid items-start gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading align="left" eyebrow="✉" title={t.contact.title} sub={t.contact.sub} />
            <div className="hidden lg:block">
              <div className="flex items-center gap-3 text-slate-300">
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-gold-400/40 text-gold-300">
                  <Sparkles className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm">abhijain.technical@gmail.com</p>
                  <p className="text-xs text-slate-500">+91 9522333669 · Mon–Sat, 10am–6pm IST</p>
                </div>
              </div>
              <div className="mt-4"><DonateButton /></div>
            </div>
          </div>
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <ContactForm />
          </motion.div>
        </div>
      </section>

      <div className="mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="section-divider" />
        <div className="grid gap-10 py-14 md:grid-cols-4">
          <div className="md:col-span-2">
            <p className="font-display text-2xl text-white">{t.brand}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.25em] text-gold-400/80">{t.tagline}</p>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-slate-400">{t.footer.disclaimer}</p>
            <div className="mt-6 flex gap-3">
              {[Globe, MessageCircle, Share2, Mail].map((Icon, i) => (
                <a key={i} href="#" aria-label="social" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-slate-300 transition hover:border-gold-400/50 hover:text-gold-300">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold-300">{t.footer.quick}</p>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link href="/" className="hover:text-white">{t.nav.home}</Link></li>
              <li><Link href="/#features" className="hover:text-white">{t.nav.features}</Link></li>
              <li><Link href="/#pricing" className="hover:text-white">{t.pricing.title}</Link></li>
              <li><Link href="/blog" className="hover:text-white">{t.nav.blog}</Link></li>
              <li><Link href="/rashi" className="hover:text-white">{t.nav.rashi}</Link></li>
            </ul>
          </div>
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold-300">{t.footer.resources}</p>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link href="/reading" className="hover:text-white">{t.nav.getReading}</Link></li>
              <li><Link href="/rashi#compatibility" className="hover:text-white">{t.rashiPage.compat}</Link></li>
              <li><Link href="/about" className="hover:text-white">{t.nav.about}</Link></li>
              <li><Link href="/contact" className="hover:text-white">{t.nav.contact}</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/disclaimer" className="hover:text-white">Disclaimer</Link></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/8 py-6 text-xs text-slate-500 sm:flex-row">
          <p>© {year} {t.brand}. {t.footer.rights}</p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <Link href="/privacy-policy" className="hover:text-gold-300">Privacy Policy</Link>
            <Link href="/disclaimer" className="hover:text-gold-300">Disclaimer</Link>
            <Link href="/about" className="hover:text-gold-300">About</Link>
            <Link href="/contact" className="hover:text-gold-300">Contact</Link>
          </div>
          <p>{t.footer.made}</p>
        </div>
      </div>
    </footer>
  );
}
