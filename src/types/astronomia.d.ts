declare module "astronomia" {
  export const julian: {
    CalendarGregorianToJD(year: number, month: number, day: number): number;
    JDToCalendar(jd: number): { year: number; month: number; day: number };
  };
  export const base: {
    J2000Century(jd: number): number;
    pmod(x: number, y: number): number;
  };
  export const moonposition: {
    position(jde: number): { lon: number; lat: number; range: number };
  };
  export const solar: {
    apparentLongitude(T: number): number;
    trueLongitude(T: number): { lon: number; ano: number };
  };
  export const sidereal: {
    mean(jd: number): number;
    apparent(jd: number): number;
  };
  export const nutation: {
    nutation(jde: number): [number, number];
    meanObliquity(jde: number): number;
    trueObliquity(jde: number): number;
  };
}

/** A VSOP87 series: periodic terms for longitude (L), latitude (B) and radius (R). */
interface Vsop87Series {
  L: Record<string, number[][]>;
  B: Record<string, number[][]>;
  R: Record<string, number[][]>;
  name: string;
  type: string;
}

declare module "astronomia/planetposition" {
  export interface PlanetCoord {
    lon: number;
    lat: number;
    range: number;
  }
  export class Planet {
    constructor(data: Vsop87Series);
    name: string;
    /** Heliocentric ecliptic position of date, radians / AU. */
    position(jde: number): PlanetCoord;
  }
  const planetposition: { Planet: typeof Planet };
  export default planetposition;
}

declare module "astronomia/data/vsop87Bmercury" {
  const data: Vsop87Series;
  export default data;
}
declare module "astronomia/data/vsop87Bvenus" {
  const data: Vsop87Series;
  export default data;
}
declare module "astronomia/data/vsop87Bearth" {
  const data: Vsop87Series;
  export default data;
}
declare module "astronomia/data/vsop87Bmars" {
  const data: Vsop87Series;
  export default data;
}
declare module "astronomia/data/vsop87Bjupiter" {
  const data: Vsop87Series;
  export default data;
}
declare module "astronomia/data/vsop87Bsaturn" {
  const data: Vsop87Series;
  export default data;
}
declare module "astronomia/data/vsop87Buranus" {
  const data: Vsop87Series;
  export default data;
}
declare module "astronomia/data/vsop87Bneptune" {
  const data: Vsop87Series;
  export default data;
}
