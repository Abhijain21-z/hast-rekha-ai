"use client";

import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import { Button, Input, Label, Textarea } from "@/components/ui";

export default function ContactPageForm() {
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
