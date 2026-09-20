import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Mail, Send, IndianRupee, Clock } from "lucide-react";
import legal from "@/content/legal.json";
import { dictionaries, pick, type Bi, type Lang } from "@/lib/i18n";
import ContactPageForm from "@/components/legal/ContactPageForm";

export const metadata: Metadata = { title: "Contact Us — Hast Rekha AI | संपर्क करें" };

const ICONS = [Mail, IndianRupee, Clock];

export default async function ContactPage() {
  const store = await cookies();
  const lang: Lang = store.get("hr_lang")?.value === "en" ? "en" : "hi";
  const t = dictionaries[lang];
  const L = (v: Bi) => pick(lang, v);
  const contact = legal.contact as { title: Bi; intro: Bi; channels: { label: Bi; value: Bi | string }[] };

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400/90">✦ {t.nav.contact}</p>
      <h1 className="mt-3 font-display text-4xl text-white sm:text-5xl">{L(contact.title)}</h1>
      <p className="mt-4 max-w-2xl text-slate-300">{L(contact.intro)}</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-3">
          {contact.channels.map((c, i) => {
            const Icon = ICONS[i] ?? Mail;
            return (
              <div key={i} className="glass flex items-center gap-4 rounded-2xl p-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-gold-400/30 bg-gold-400/10 text-gold-300"><Icon className="h-5 w-5" /></span>
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500">{L(c.label)}</p>
                  <p className="font-medium text-white">{typeof c.value === "string" ? c.value : L(c.value)}</p>
                </div>
              </div>
            );
          })}
          <div className="glass rounded-2xl p-4 text-xs leading-relaxed text-slate-400">
            {t.footer.disclaimer}
          </div>
        </div>
        <ContactPageForm />
      </div>
    </div>
  );
}
