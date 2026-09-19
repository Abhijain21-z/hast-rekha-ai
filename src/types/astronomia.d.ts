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
