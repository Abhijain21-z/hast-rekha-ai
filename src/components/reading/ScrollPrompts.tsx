"use client";

import { useEffect, useRef, useState } from "react";
import { BookOpen, Check, Crown, FileText } from "lucide-react";
import { useLang } from "@/components/providers/LanguageProvider";
import { Button, Modal } from "@/components/ui";
import { ULTRA_PRICE } from "@/lib/flags";
import { PREMIUM_PRICE } from "@/lib/premium";
import { UPAY_BOOK_URL } from "@/components/upay/UpayBookPromo";
import { ProPaywallModal, type ProPlan } from "./ProPaywall";

/** Fill `{placeholders}` in a translated template. */
function tpl(text: string, vars: Record<string, string | number>) {
  return text.replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? ""));
}

/**
 * Scroll-triggered asks while the visitor reads the prediction:
 *
 * - after every 4th scroll — "download the complete PDF?" → ₹51 Pro paywall
 *   (stops as soon as the report is unlocked);
 * - once, after the 6th scroll — the Dhandayak book → SuperProfile buy link,
 *   with the Ultra Pro alternative (prediction + book) for unpaid visitors.
 *
 * One "scroll" = one continuous finger-swipe / mouse-wheel gesture. A burst of
 * scroll events counts once; bursts are separated by BURST_GAP_MS of silence.
 * Counts pause while any popup or paywall is open.
 */
const BURST_GAP_MS = 380;
const PDF_EVERY = 4;
const BOOK_AT = 6;

/** Any open app modal (all Modal overlays share this z-layer) pauses counting. */
function anyModalOpen() {
  return !!document.querySelector('[class*="z-[9"]');
}

export default function ScrollPrompts({
  readingId,
  unlocked,
  ultra,
  onUnlocked,
}: {
  readingId: string;
  unlocked: boolean;
  ultra: boolean;
  onUnlocked: () => void;
}) {
  const { t } = useLang();
  const [askPdf, setAskPdf] = useState(false);
  const [askBook, setAskBook] = useState(false);
  const [payPlan, setPayPlan] = useState<ProPlan | null>(null);

  // Live reading state for the scroll listener, which is bound only once.
  const latest = useRef({ unlocked, ultra });
  useEffect(() => {
    latest.current = { unlocked, ultra };
  }, [unlocked, ultra]);

  const asked = useRef({ book: false });
  const counter = useRef({ gestures: 0, inBurst: false, timer: 0 });

  useEffect(() => {
    const c = counter.current;
    const a = asked.current;
    function onScroll() {
      if (!c.inBurst) {
        c.inBurst = true;
        // Ignore bursts that happen under an open popup/paywall.
        if (!anyModalOpen()) {
          c.gestures += 1;
          const n = c.gestures;
          if (n >= BOOK_AT && !a.book && !latest.current.ultra) {
            a.book = true;
            setAskBook(true);
          } else if (n % PDF_EVERY === 0 && !latest.current.unlocked) {
            setAskPdf(true);
          }
        }
      }
      window.clearTimeout(c.timer);
      c.timer = window.setTimeout(() => {
        c.inBurst = false;
      }, BURST_GAP_MS);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(c.timer);
    };
  }, []);

  return (
    <>
      {/* The ₹51 / ₹351 paywall, opened by both asks */}
      <ProPaywallModal
        key={payPlan ?? "closed"}
        open={payPlan !== null}
        onClose={() => setPayPlan(null)}
        readingId={readingId}
        defaultPlan={payPlan ?? "pro"}
        onUnlocked={() => {
          setPayPlan(null);
          onUnlocked();
        }}
      />

      {/* Every 4th scroll — offer the complete PDF */}
      <Modal open={askPdf} onClose={() => setAskPdf(false)} title={t.asks.pdfTitle}>
        <p className="text-sm leading-relaxed text-slate-300">{tpl(t.asks.pdfSub, { p: PREMIUM_PRICE })}</p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <Button
            className="w-full sm:flex-1"
            icon={<FileText className="h-4 w-4" />}
            onClick={() => {
              setAskPdf(false);
              setPayPlan("pro");
            }}
          >
            {t.asks.pdfYes}
          </Button>
          <Button variant="ghost" className="w-full sm:flex-1" onClick={() => setAskPdf(false)}>
            {t.asks.pdfNo}
          </Button>
        </div>
      </Modal>

      {/* 6th scroll — the Dhandayak book, asked once per visit */}
      <Modal open={askBook} onClose={() => setAskBook(false)} title={t.asks.bookTitle} wide>
        <p className="text-sm leading-relaxed text-slate-300">{t.asks.bookSub}</p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {[t.asks.bookB1, t.asks.bookB2, t.asks.bookB3, t.asks.bookB4, t.asks.bookB5, t.asks.bookB6].map((line) => (
            <li key={line} className="flex items-start gap-2 text-sm leading-relaxed text-slate-100">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" />
              <span>{line}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-center text-sm font-semibold text-gold-300">{t.asks.bookAll}</p>
        <div className="mt-5 flex flex-col gap-2">
          <a
            href={UPAY_BOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setAskBook(false)}
            className="btn-gold inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium"
          >
            <BookOpen className="h-4 w-4" /> {t.asks.bookYes}
          </a>
          {!unlocked && (
            <Button
              variant="outline"
              className="w-full"
              icon={<Crown className="h-4 w-4" />}
              onClick={() => {
                setAskBook(false);
                setPayPlan("ultra");
              }}
            >
              {tpl(t.asks.bookUltra, { p: ULTRA_PRICE })}
            </Button>
          )}
          <Button variant="ghost" className="w-full" onClick={() => setAskBook(false)}>
            {t.asks.bookNo}
          </Button>
        </div>
      </Modal>
    </>
  );
}
