"use client";

import { useLang } from "@/components/providers/LanguageProvider";
import type { Bi } from "@/lib/i18n";
import type { PalmLineKey } from "@/content/palm/types";

/**
 * A light, schematic hand used on every line guide.
 *
 * Photographs of palms look different for every reader, so the guides use one
 * clean diagram: the page's own line is drawn in gold, the other classical
 * lines stay faint underneath, and the label spells the line out in the
 * visitor's language ("jeevan rekha palm reading diagram" reads the aria-label).
 */

interface LineDef {
  d: string;
  label: Bi;
  /** Where the label sits, plus its anchor. */
  x: number;
  y: number;
  anchor?: "start" | "middle" | "end";
}

const LINES: Record<PalmLineKey, LineDef> = {
  heart: {
    d: "M70,172 C104,157 142,151 176,160",
    label: { en: "Heart line", hi: "हृदय रेखा" },
    x: 74,
    y: 146,
  },
  head: {
    d: "M72,196 C102,187 140,183 172,190",
    label: { en: "Head line", hi: "मस्तिष्क रेखा" },
    x: 74,
    y: 212,
  },
  life: {
    d: "M74,182 C58,205 62,238 82,262 C94,276 106,287 114,297",
    label: { en: "Life line", hi: "जीवन रेखा" },
    x: 62,
    y: 310,
  },
  fate: {
    d: "M122,276 C122,240 123,200 124,150",
    label: { en: "Fate line", hi: "भाग्य रेखा" },
    x: 126,
    y: 142,
    anchor: "start",
  },
  sun: {
    d: "M152,268 C153,238 153,205 154,158",
    label: { en: "Sun line", hi: "सूर्य रेखा" },
    x: 158,
    y: 150,
    anchor: "start",
  },
  money: {
    d: "M152,232 C160,221 166,210 172,197",
    label: { en: "Money line", hi: "धन रेखा" },
    x: 176,
    y: 214,
    anchor: "start",
  },
  marriage: {
    d: "M170,138 L194,136 M170,149 L192,147",
    label: { en: "Marriage line", hi: "विवाह रेखा" },
    x: 196,
    y: 128,
    anchor: "end",
  },
  children: {
    d: "M176,137 L176,147 M182,142 L182,150 M188,141 L188,149",
    label: { en: "Children line", hi: "पुत्र रेखा" },
    x: 190,
    y: 162,
    anchor: "end",
  },
  health: {
    d: "M164,258 C156,232 152,212 150,192",
    label: { en: "Health line", hi: "स्वास्थ्य रेखा" },
    x: 150,
    y: 240,
    anchor: "end",
  },
};

/** Order used by the numbers in the "all lines" diagram. */
export const LINE_ORDER: PalmLineKey[] = ["life", "head", "heart", "fate", "sun", "money", "marriage", "health", "children"];

export const LINE_LABELS: Record<PalmLineKey, Bi> = Object.fromEntries(
  Object.entries(LINES).map(([k, v]) => [k, v.label]),
) as Record<PalmLineKey, Bi>;

export default function PalmDiagram({ line, alt, numbers = false }: { line: PalmLineKey | "all"; alt: string; numbers?: boolean }) {
  const { L } = useLang();
  const shown: PalmLineKey[] = line === "all" ? LINE_ORDER : [line];

  return (
    <svg viewBox="0 0 260 330" role="img" aria-label={alt} className="mx-auto h-auto w-full max-w-[260px]">
      {/* palm outline, fingers and thumb — faint scaffolding */}
      <g className="text-white/25" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M64,110 C62,100 70,94 82,94 L170,94 C182,94 190,100 188,112 L182,268 C181,292 158,306 124,306 C90,306 66,292 65,268 Z" />
        <rect x="78" y="16" width="26" height="82" rx="13" />
        <rect x="106" y="8" width="26" height="90" rx="13" />
        <rect x="134" y="18" width="26" height="80" rx="13" />
        <rect x="162" y="34" width="24" height="64" rx="12" />
        <rect x="34" y="150" width="26" height="72" rx="13" transform="rotate(-32 47 186)" />
        <path d="M92,306 L92,326 M156,306 L156,326" />
      </g>

      {/* the classical lines: the page's own line is gold, the rest stay quiet */}
      {(["life", "head", "heart", "fate", "sun", "money", "marriage", "health", "children"] as PalmLineKey[]).map((key) => {
        const isFocus = shown.includes(key);
        const def = LINES[key];
        return (
          <path
            key={key}
            d={def.d}
            fill="none"
            stroke="currentColor"
            strokeWidth={isFocus ? 3.4 : 1.6}
            strokeLinecap="round"
            strokeDasharray={isFocus || numbers ? undefined : "3 5"}
            className={isFocus ? "text-gold-300" : "text-white/20"}
          />
        );
      })}

      {/* labels: the line's name, or 1-9 when the whole hand is shown */}
      {(line === "all" || numbers ? LINE_ORDER : shown).map((key) => {
        const def = LINES[key];
        const idx = LINE_ORDER.indexOf(key) + 1;
        const text = numbers || line === "all" ? String(idx) : L(def.label);
        return (
          <text
            key={key}
            x={def.x}
            y={def.y}
            textAnchor={def.anchor ?? "start"}
            className={numbers || line === "all" ? "fill-gold-300" : "fill-gold-200"}
            fontSize="12"
            fontWeight="600"
          >
            {text}
          </text>
        );
      })}
    </svg>
  );
}
