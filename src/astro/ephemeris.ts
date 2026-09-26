// The chart engine: Swiss Ephemeris compiled to WebAssembly (swisseph-wasm).
// See DECISIONS.md, "M0: chart math", for why this engine.

import SwissEph from 'swisseph-wasm';

export const FIGURES = [
  'Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto', 'Chiron',
] as const;
export type Figure = (typeof FIGURES)[number];

const SE_ID: Record<Figure, number> = {
  Sun: 0, Moon: 1, Mercury: 2, Venus: 3, Mars: 4, Jupiter: 5, Saturn: 6, Uranus: 7, Neptune: 8, Pluto: 9, Chiron: 15,
};

export const SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
] as const;
export type Sign = (typeof SIGNS)[number];

export interface BodyPosition {
  figure: Figure;
  lon: number; // tropical ecliptic longitude of date, degrees [0, 360)
  lat: number;
  speed: number; // degrees per day; negative = retrograde
  sign: Sign;
  degInSign: number;
  house?: number; // 1-12, only on natal charts
}

export interface Houses {
  system: 'Placidus';
  cusps: number[]; // index 1..12; index 0 unused
  asc: number;
  mc: number;
  armc: number;
}

export interface Chart {
  utc: Date;
  jdUt: number;
  bodies: BodyPosition[];
  houses?: Houses;
}

let swePromise: Promise<SwissEph> | undefined;

/** The WASM module is ~2.7 MB with its ephemeris files; load it once. */
export function engine(): Promise<SwissEph> {
  swePromise ??= (async () => {
    const swe = new SwissEph();
    await swe.initSwissEph();
    return swe;
  })();
  return swePromise;
}

export const norm360 = (d: number) => ((d % 360) + 360) % 360;

export function signOf(lon: number): { sign: Sign; degInSign: number } {
  const l = norm360(lon);
  return { sign: SIGNS[Math.floor(l / 30)], degInSign: l % 30 };
}

export function julianDayUt(swe: SwissEph, utc: Date): number {
  const h = utc.getUTCHours() + utc.getUTCMinutes() / 60 + (utc.getUTCSeconds() + utc.getUTCMilliseconds() / 1000) / 3600;
  return swe.julday(utc.getUTCFullYear(), utc.getUTCMonth() + 1, utc.getUTCDate(), h);
}

/** House number (1-12) for a longitude, given Placidus cusps. */
export function houseOf(lon: number, cusps: number[]): number {
  for (let h = 1; h <= 12; h++) {
    const start = cusps[h];
    const end = cusps[h === 12 ? 1 : h + 1];
    const span = norm360(end - start);
    if (norm360(lon - start) < span) return h;
  }
  return 12;
}

/**
 * Positions for the eleven figures at `utc`. With a place, also Placidus
 * houses. Longitudes are geocentric, tropical, apparent (the astro.com default).
 */
export async function castChart(utc: Date, place?: { lat: number; lon: number }): Promise<Chart> {
  const swe = await engine();
  const jdUt = julianDayUt(swe, utc);
  const flags = swe.SEFLG_SWIEPH | swe.SEFLG_SPEED;

  let houses: Houses | undefined;
  if (place) {
    const { cusps, ascmc } = swe.houses(jdUt, place.lat, place.lon, 'P');
    houses = { system: 'Placidus', cusps: Array.from(cusps), asc: ascmc[0], mc: ascmc[1], armc: ascmc[2] };
  }

  const bodies = FIGURES.map((figure): BodyPosition => {
    const r = swe.calc_ut(jdUt, SE_ID[figure], flags);
    const lon = norm360(r[0]);
    return {
      figure,
      lon,
      lat: r[1],
      speed: r[3],
      ...signOf(lon),
      ...(houses ? { house: houseOf(lon, houses.cusps) } : {}),
    };
  });

  return { utc, jdUt, bodies, houses };
}
