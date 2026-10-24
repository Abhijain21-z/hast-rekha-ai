/**
 * Shared, JSON-serialisable types for the advanced Vedic calculation engine.
 *
 * Everything here is stored inside `readings.result.advanced` (JSONB), so it
 * must survive `JSON.stringify`/`parse` unchanged — no Date objects, no class
 * instances, no functions.
 */
import type { Bi } from "../i18n";

export interface ChartInput {
  /** YYYY-MM-DD local date. */
  date: string;
  /** HH:MM local 24h time. */
  time: string;
  latitude: number;
  longitude: number;
  /** Hours east of UTC, e.g. 5.5 for IST. */
  tzOffset: number;
}

export const GRAHAS = ["sun", "moon", "mars", "mercury", "jupiter", "venus", "saturn", "rahu", "ketu"] as const;
export type Graha = (typeof GRAHAS)[number];

/** The seven physical grahas, used wherever Rahu/Ketu must be excluded. */
export const SAPTA_GRAHA: readonly Graha[] = ["sun", "moon", "mars", "mercury", "jupiter", "venus", "saturn"];

export const BENEFICS: readonly Graha[] = ["jupiter", "venus", "mercury", "moon"];
export const MALEFICS: readonly Graha[] = ["sun", "mars", "saturn", "rahu", "ketu"];

export type Element = "fire" | "earth" | "air" | "water";
export type Quality = "movable" | "fixed" | "dual";

export type Dignity =
  | "exalted"
  | "moolatrikona"
  | "own"
  | "friend"
  | "neutral"
  | "enemy"
  | "debilitated";

export interface SignInfo {
  index: number;
  key: string;
  name: Bi;
  lord: Graha;
  element: Element;
  quality: Quality;
}

export interface NakshatraInfo {
  index: number;
  key: string;
  name: Bi;
  lord: Graha;
}

export interface PlanetPosition {
  key: Graha;
  name: Bi;
  /** Sidereal (Lahiri) longitude, 0–360. */
  longitude: number;
  tropicalLongitude: number;
  sign: number;
  degreeInSign: number;
  nakshatra: number;
  pada: number;
  /** Degrees traversed inside the nakshatra, 0–13°20′. */
  nakshatraDegree: number;
  house: number;
  retrograde: boolean;
  /** Degrees per day; negative when retrograde. */
  speed: number;
  dignity: Dignity;
  dignityLabel: Bi;
  combust: boolean;
  gandanta: boolean;
  vargottama: boolean;
  avastha: "bala" | "kumara" | "yuva" | "vriddha" | "mrita";
}

export interface HouseInfo {
  house: number;
  sign: number;
  lord: Graha;
  occupants: Graha[];
  /** 0–100, from occupancy + lord strength. */
  strength: number;
  /** Sign name, for the UI. */
  signName: Bi;
}

export interface AspectInfo {
  from: Graha;
  /** Houses counted from the aspecting planet's own house. */
  toHouse: number;
  label: Bi;
}

export interface PanchangInfo {
  tithi: number;
  tithiName: Bi;
  paksha: "shukla" | "krishna";
  nakshatra: number;
  nakshatraName: Bi;
  yoga: number;
  yogaName: Bi;
  karana: number;
  karanaName: Bi;
  vara: number;
  varaName: Bi;
  hora: Graha;
  horaName: Bi;
  sunrise: string | null;
  sunset: string | null;
  /** Birth happened between sunrise and sunset (approximate, ±3 min). */
  dayBirth: boolean;
  /** Illuminated fraction of the Moon, 0–1. */
  moonPhase: number;
  lunarMonth: Bi;
  samvat: number;
  ritu: Bi;
}

export interface VargaChart {
  key: string;
  name: Bi;
  /** What this division is read for. */
  purpose: Bi;
  /** Sign occupied by the varga ascendant. */
  lagna: number;
  /** Varga sign for each graha. */
  planets: Record<Graha, number>;
  /** Varga sign in each whole-sign house, 1–12. */
  houses: number[];
}

export interface DashaPeriod {
  lord: Graha;
  lordName: Bi;
  start: string;
  end: string;
  years: number;
  current: boolean;
}

export interface DashaInfo {
  system: "vimshottari";
  moonNakshatra: number;
  moonLord: Graha;
  balanceAtBirth: { lord: Graha; years: number; days: number };
  mahadashas: DashaPeriod[];
  current: {
    maha: DashaPeriod;
    antar: DashaPeriod;
    pratyantar: DashaPeriod;
  } | null;
  upcoming: DashaPeriod[];
}

export interface YogaResult {
  key: string;
  name: Bi;
  type: "benefic" | "challenging";
  /** 0–100, how strongly the combination is formed. */
  strength: number;
  houses: number[];
  description: Bi;
}

export interface PlanetStrength {
  key: Graha;
  name: Bi;
  score: number;
  grade: Bi;
  dignity: Dignity;
  factors: { label: Bi; points: number }[];
  /** House-based functional note. */
  houseNote: Bi;
}

export interface TransitPlanet {
  key: Graha;
  name: Bi;
  sign: number;
  signName: Bi;
  degreeInSign: number;
  retrograde: boolean;
  houseFromMoon: number;
  houseFromLagna: number;
  favorable: boolean;
  note: Bi;
}

export interface TransitInfo {
  asOf: string;
  planets: TransitPlanet[];
  sadeSati: {
    active: boolean;
    phase: "rising" | "peak" | "setting" | "none";
    note: Bi;
  };
  highlights: Bi[];
  jupiterReturn: boolean;
  saturnReturn: boolean;
}

export interface NumerologyInfo {
  mulank: number;
  bhagyank: number;
  namank: number;
  mulankLord: Bi;
  bhagyankLord: Bi;
  luckyNumbers: number[];
  luckyColors: Bi[];
  luckyDays: Bi[];
  loShu: { number: number; count: number }[];
  missing: number[];
  note: Bi;
}

export interface AdvancedChart {
  version: string;
  engine: "astronomia-vsop87";
  ayanamsa: number;
  planets: PlanetPosition[];
  houses: HouseInfo[];
  lagna: {
    longitude: number;
    sign: number;
    degreeInSign: number;
    nakshatra: number;
    pada: number;
    lord: Graha;
  };
  aspects: AspectInfo[];
  panchang: PanchangInfo;
  vargas: VargaChart[];
  dasha: DashaInfo;
  yogas: YogaResult[];
  strengths: PlanetStrength[];
  transits: TransitInfo;
  numerology: NumerologyInfo;
  /** IDs + versions of every registered calculation that produced this chart. */
  calculations: { id: string; version: string; category: string }[];
}
