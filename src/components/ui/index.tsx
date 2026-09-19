"use client";

import { forwardRef, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, X } from "lucide-react";

export function cn(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

/* ---------- Button ---------- */
type Variant = "gold" | "ghost" | "outline" | "danger" | "subtle";
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: ReactNode;
}
const variantClass: Record<Variant, string> = {
  gold: "btn-gold",
  ghost: "text-slate-200 hover:bg-white/8 hover:text-white",
  outline: "border border-gold-400/40 text-gold-300 hover:bg-gold-400/10 hover:border-gold-400/70",
  danger: "border border-rose-400/30 text-rose-300 hover:bg-rose-500/15",
  subtle: "bg-white/6 text-slate-100 hover:bg-white/12 border border-white/8",
};
const sizeClass = { sm: "px-3 py-1.5 text-xs gap-1.5", md: "px-5 py-2.5 text-sm gap-2", lg: "px-7 py-3.5 text-base gap-2.5" };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "gold", size = "md", loading, icon, className, children, disabled, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center rounded-full font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60",
        variantClass[variant],
        sizeClass[size],
        className,
      )}
      {...rest}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}
      {children}
    </button>
  );
});

/* ---------- Inputs ---------- */
export function Label({ children, hint }: { children: ReactNode; hint?: string }) {
  return (
    <label className="mb-1.5 flex items-baseline justify-between text-sm font-medium text-slate-200">
      <span>{children}</span>
      {hint && <span className="text-xs font-normal text-slate-400">{hint}</span>}
    </label>
  );
}
export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input({ className, ...rest }, ref) {
  return <input ref={ref} className={cn("input-dark", className)} {...rest} />;
});
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(function Textarea({ className, ...rest }, ref) {
  return <textarea ref={ref} className={cn("input-dark min-h-[110px] resize-y", className)} {...rest} />;
});
export function Select({ className, children, ...rest }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn("input-dark appearance-none bg-cosmic-900", className)} {...rest}>
      {children}
    </select>
  );
}
export function ErrorText({ children }: { children?: ReactNode }) {
  if (!children) return null;
  return <p className="mt-1.5 text-xs text-rose-300">{children}</p>;
}

/* ---------- Card ---------- */
export function Card({ children, className, strong }: { children: ReactNode; className?: string; strong?: boolean }) {
  return <div className={cn(strong ? "glass-strong" : "glass", "rounded-3xl", className)}>{children}</div>;
}

export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border border-gold-400/30 bg-gold-400/10 px-3 py-1 text-xs font-medium text-gold-300", className)}>
      {children}
    </span>
  );
}

/* ---------- Section heading with reveal ---------- */
export function SectionHeading({ eyebrow, title, sub, align = "center" }: { eyebrow?: string; title: string; sub?: string; align?: "center" | "left" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn("mb-10 md:mb-14", align === "center" ? "text-center mx-auto max-w-2xl" : "text-left")}
    >
      {eyebrow && <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-gold-400/90">{eyebrow}</p>}
      <h2 className="font-display text-3xl font-semibold leading-tight text-white md:text-4xl lg:text-5xl">{title}</h2>
      {sub && <p className="mt-4 text-base text-slate-300/90 md:text-lg">{sub}</p>}
    </motion.div>
  );
}

/* ---------- Skeleton & Spinner ---------- */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton", className)} />;
}
export function Spinner({ className }: { className?: string }) {
  return <Loader2 className={cn("h-5 w-5 animate-spin text-gold-400", className)} />;
}

/* ---------- Modal ---------- */
export function Modal({ open, onClose, title, children, wide }: { open: boolean; onClose: () => void; title?: string; children: ReactNode; wide?: boolean }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className={cn(
              "glass-strong max-h-[92vh] w-full overflow-y-auto rounded-t-3xl p-6 shadow-2xl sm:rounded-3xl",
              wide ? "sm:max-w-3xl" : "sm:max-w-lg",
            )}
          >
            <div className="mb-4 flex items-center justify-between">
              {title ? <h3 className="font-display text-xl text-white">{title}</h3> : <span />}
              <button onClick={onClose} className="rounded-full p-2 text-slate-400 hover:bg-white/10 hover:text-white" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------- Empty state ---------- */
export function EmptyState({ icon, title, sub, action }: { icon: ReactNode; title: string; sub: string; action?: ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass flex flex-col items-center rounded-3xl px-6 py-14 text-center">
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-gold-400/30 bg-gold-400/10 text-gold-300 gold-glow">{icon}</div>
      <h3 className="font-display text-xl text-white">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-slate-400">{sub}</p>
      {action && <div className="mt-6">{action}</div>}
    </motion.div>
  );
}

/* ---------- Avatar (initials) ---------- */
export function Avatar({ name, size = 40 }: { name: string; size?: number }) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const hue = [...name].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full font-semibold text-white ring-2 ring-gold-400/40"
      style={{ width: size, height: size, fontSize: size * 0.38, background: `linear-gradient(135deg, hsl(${hue} 60% 45%), hsl(${(hue + 50) % 360} 70% 35%))` }}
    >
      {initials}
    </div>
  );
}
