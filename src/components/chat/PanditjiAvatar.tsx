"use client";

import { useId } from "react";
import { cn } from "@/components/ui";

/**
 * Hand-drawn SVG mascot for "Hastrekha Panditji".
 *
 * Deliberately an illustration rather than a photo: it stays crisp at 32px in
 * the chat header and at 260px on the home page, needs no network request, and
 * cannot be mistaken for a real person's portrait. The "AI" label lives next to
 * the character everywhere it is used.
 */
export default function PanditjiAvatar({
  size = 120,
  className,
  decorative = false,
}: {
  size?: number;
  className?: string;
  decorative?: boolean;
}) {
  const raw = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const id = (name: string) => `panditji-${raw}-${name}`;

  return (
    <svg
      viewBox="0 0 240 240"
      width={size}
      height={size}
      className={cn("select-none", className)}
      role={decorative ? undefined : "img"}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : "Hastrekha Panditji"}
      xmlns="http://www.w3.org/2000/svg"
    >
      {!decorative && <title>Hastrekha Panditji</title>}
      <defs>
        <radialGradient id={id("bg")} cx="50%" cy="38%" r="72%">
          <stop offset="0%" stopColor="#3b2166" />
          <stop offset="58%" stopColor="#1b0e35" />
          <stop offset="100%" stopColor="#0b0618" />
        </radialGradient>
        <radialGradient id={id("halo")} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.36" />
          <stop offset="55%" stopColor="#f59e0b" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={id("gold")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="42%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
        <linearGradient id={id("turban")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="45%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#c2410c" />
        </linearGradient>
        <linearGradient id={id("skin")} x1="0" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor="#f6c997" />
          <stop offset="55%" stopColor="#e8b07a" />
          <stop offset="100%" stopColor="#cc8a55" />
        </linearGradient>
        <linearGradient id={id("beard")} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#fffdf7" />
          <stop offset="55%" stopColor="#f3eedf" />
          <stop offset="100%" stopColor="#dcd2bd" />
        </linearGradient>
        <linearGradient id={id("kurta")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fbf1d8" />
          <stop offset="55%" stopColor="#efdcb5" />
          <stop offset="100%" stopColor="#d8bd86" />
        </linearGradient>
      </defs>

      {/* cosmic badge + golden aura */}
      <circle cx="120" cy="120" r="118" fill={`url(#${id("bg")})`} />
      <circle cx="120" cy="108" r="66" fill={`url(#${id("halo")})`} />
      <circle cx="120" cy="120" r="113" fill="none" stroke={`url(#${id("gold")})`} strokeWidth="2" opacity="0.7" />
      <circle
        cx="120"
        cy="120"
        r="104"
        fill="none"
        stroke="#fbbf24"
        strokeWidth="1"
        strokeDasharray="1 8"
        strokeLinecap="round"
        opacity="0.38"
      />

      {/* sky details */}
      <path
        d="M46 54l2.6 6.3 6.3 2.6-6.3 2.6L46 72l-2.6-6.5-6.3-2.6 6.3-2.6z"
        fill="#fde68a"
        opacity="0.78"
      />
      <path d="M191 66l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#fbbf24" opacity="0.62" />
      <path d="M191 31a13 13 0 1 0 0 26 10 10 0 1 1 0-26" fill="#fde68a" opacity="0.5" />
      <circle cx="53" cy="170" r="2" fill="#fde68a" opacity="0.65" />
      <circle cx="188" cy="158" r="2.2" fill="#fde68a" opacity="0.6" />

      {/* shoulders / kurta */}
      <path
        d="M52 236c2-40 20-64 46-73h44c26 9 44 33 46 73z"
        fill={`url(#${id("kurta")})`}
        stroke="#c99a45"
        strokeWidth="1.4"
      />
      <path d="M98 163l22 21 22-21-8-5-14 14-14-14z" fill="#e7c98e" opacity="0.9" />
      <path d="M120 184v52" stroke="#d8b267" strokeWidth="2" opacity="0.5" />

      {/* neck + ears */}
      <rect x="106" y="139" width="28" height="29" rx="11" fill={`url(#${id("skin")})`} />
      <ellipse cx="84" cy="108" rx="8.5" ry="11" fill={`url(#${id("skin")})`} />
      <ellipse cx="156" cy="108" rx="8.5" ry="11" fill={`url(#${id("skin")})`} />
      <circle cx="84" cy="119" r="3.2" fill={`url(#${id("gold")})`} stroke="#b45309" strokeWidth="0.9" />
      <circle cx="156" cy="119" r="3.2" fill={`url(#${id("gold")})`} stroke="#b45309" strokeWidth="0.9" />

      {/* face */}
      <ellipse
        cx="120"
        cy="108"
        rx="36"
        ry="40"
        fill={`url(#${id("skin")})`}
        stroke="#c98b58"
        strokeWidth="1.1"
      />
      <ellipse cx="99" cy="119" rx="7" ry="4" fill="#e88f72" opacity="0.3" />
      <ellipse cx="141" cy="119" rx="7" ry="4" fill="#e88f72" opacity="0.3" />

      {/* beard + moustache + mouth */}
      <path
        d="M84 108c-2 38 12 60 36 66 24-6 38-28 36-66-6 19-14 29-36 29s-30-10-36-29z"
        fill={`url(#${id("beard")})`}
        stroke="#d8cfb8"
        strokeWidth="1.1"
      />
      <path d="M100 148c8 7 14 9 20 9s12-2 20-9" stroke="#e3dac6" strokeWidth="1.4" fill="none" opacity="0.85" />
      <path d="M112 137q8 6 16 0" stroke="#7c3a1d" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path
        d="M104 127c6-7 13-6 16-1 3-5 10-6 16 1-6 5-11 5-16 1-5 4-10 4-16-1z"
        fill="#fbf7ed"
        stroke="#e2d9c7"
        strokeWidth="0.8"
      />

      {/* nose + eyes + brows */}
      <path
        d="M120 104c-3 7-4 11-2 14 2 2 5 2 6-1"
        stroke="#c98552"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <path d="M100 105q6-5 12 0" stroke="#4a2b16" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <path d="M128 105q6-5 12 0" stroke="#4a2b16" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <path d="M97 94q8-6 17-1" stroke="#f5f1e6" strokeWidth="3.6" fill="none" strokeLinecap="round" />
      <path d="M126 93q9-5 17 1" stroke="#f5f1e6" strokeWidth="3.6" fill="none" strokeLinecap="round" />

      {/* tilak */}
      <rect x="117" y="80" width="2.6" height="15" rx="1.3" fill="#dc2626" />
      <rect x="121" y="80" width="2.6" height="15" rx="1.3" fill="#f97316" />
      <circle cx="120" cy="76" r="2.4" fill="#dc2626" />

      {/* turban */}
      <path
        d="M80 88c-2-32 14-53 40-53s42 21 40 53c-10-8-22-12-40-12s-30 4-40 12z"
        fill={`url(#${id("turban")})`}
        stroke="#b45309"
        strokeWidth="1.2"
      />
      <path
        d="M88 66c14-8 26-10 32-10 8 0 20 4 32 12"
        stroke="#b45309"
        strokeWidth="2"
        fill="none"
        opacity="0.4"
      />
      <path
        d="M86 76c14-8 26-10 34-10 10 0 22 4 34 12"
        stroke="#b45309"
        strokeWidth="2"
        fill="none"
        opacity="0.3"
      />
      <path
        d="M80 86c12-8 25-12 40-12s28 4 40 12l-2 8c-12-8-25-12-38-12s-26 4-38 12z"
        fill={`url(#${id("gold")})`}
        stroke="#b45309"
        strokeWidth="1"
      />
      <circle cx="120" cy="82" r="5" fill="#b91c1c" stroke="#fde68a" strokeWidth="1.6" />
      <circle cx="118.5" cy="80.5" r="1.2" fill="#fecaca" opacity="0.9" />

      {/* rudraksha mala */}
      <path d="M98 158q22 16 44 0" stroke="#d4a24c" strokeWidth="2" fill="none" opacity="0.85" />
      <circle cx="106" cy="164" r="3.2" fill="#7c4a2d" stroke="#fbbf24" strokeWidth="0.8" />
      <circle cx="120" cy="168" r="3.4" fill="#7c4a2d" stroke="#fbbf24" strokeWidth="0.8" />
      <circle cx="134" cy="164" r="3.2" fill="#7c4a2d" stroke="#fbbf24" strokeWidth="0.8" />

      {/* folded hands */}
      <path
        d="M100 228c-9-11-7-27 4-36l11 6c-7 7-9 16-5 28z"
        fill={`url(#${id("skin")})`}
        stroke="#c98b58"
        strokeWidth="1.2"
      />
      <path
        d="M140 228c9-11 7-27-4-36l-11 6c7 7 9 16 5 28z"
        fill={`url(#${id("skin")})`}
        stroke="#c98b58"
        strokeWidth="1.2"
      />
      <path d="M107 204l4 2M104 213l4 2M133 204l-4 2M136 213l-4 2" stroke="#c98b58" strokeWidth="1.2" strokeLinecap="round" opacity="0.75" />
      <path d="M104 222q16 6 32 0" stroke="#d4a24c" strokeWidth="2" fill="none" opacity="0.7" />
    </svg>
  );
}
