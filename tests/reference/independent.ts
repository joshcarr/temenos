// Independent reference calculations used only by tests.
// Planets come from astronomy-engine (VSOP87 + its own lunar and Pluto models,
// MIT licensed, no shared code with Swiss Ephemeris). Houses are worked by hand
// from first principles so a bug in how we call swe_houses can't hide.

import * as A from 'astronomy-engine';
import type { Figure } from '../../src/astro/ephemeris';

const rad = Math.PI / 180;
const deg = 180 / Math.PI;
const n360 = (d: number) => ((d % 360) + 360) % 360;

const BODY: Partial<Record<Figure, A.Body>> = {
  Mercury: A.Body.Mercury, Venus: A.Body.Venus, Mars: A.Body.Mars, Jupiter: A.Body.Jupiter,
  Saturn: A.Body.Saturn, Uranus: A.Body.Uranus, Neptune: A.Body.Neptune, Pluto: A.Body.Pluto,
};

/** Apparent geocentric longitude on the true ecliptic of date. No Chiron. */
export function refLongitude(figure: Figure, utc: Date): number {
  if (figure === 'Sun') return A.SunPosition(utc).elon;
  if (figure === 'Moon') {
    // EclipticGeoMoon is geometric; add nutation in longitude to match "apparent".
    const t = A.MakeTime(utc);
    return n360(A.EclipticGeoMoon(utc).lon + A.e_tilt(t).dpsi / 3600);
  }
  const body = BODY[figure];
  if (!body) throw new Error(`no independent reference for ${figure}`);
  return A.Ecliptic(A.GeoVector(body, utc, true)).elon;
}

export interface RefAngles {
  armc: number;
  eps: number;
  asc: number;
  mc: number;
  cusps: number[]; // 1..12
}

/** Ascendant, MC and Placidus cusps, derived by hand. */
export function refPlacidus(utc: Date, lat: number, lon: number): RefAngles {
  const t = A.MakeTime(utc);
  const eps = A.e_tilt(t).tobl; // true obliquity, degrees
  const armc = n360(A.SiderealTime(utc) * 15 + lon);
  const e = eps * rad;
  const phi = lat * rad;
  const R = armc * rad;

  const mc = n360(Math.atan2(Math.sin(R), Math.cos(R) * Math.cos(e)) * deg);
  const asc = n360(Math.atan2(Math.cos(R), -(Math.sin(R) * Math.cos(e) + Math.tan(phi) * Math.sin(e))) * deg);

  // Ecliptic longitude of the point on the ecliptic with right ascension a.
  const lonFromRa = (a: number) => n360(Math.atan2(Math.sin(a * rad), Math.cos(a * rad) * Math.cos(e)) * deg);
  const decOf = (l: number) => Math.asin(Math.sin(e) * Math.sin(l * rad));

  // A Placidus cusp is the ecliptic point whose hour angle is a fixed fraction
  // of its own diurnal (above horizon) or nocturnal (below) semi-arc.
  const cusp = (fraction: number, below: boolean) => {
    let a = armc + (below ? 180 - 90 * fraction : 90 * fraction);
    for (let i = 0; i < 50; i++) {
      const ad = Math.asin(Math.tan(phi) * Math.tan(decOf(lonFromRa(a)))) * deg; // ascensional difference
      const next = below
        ? armc + 180 - fraction * (90 - ad)
        : armc + fraction * (90 + ad);
      if (Math.abs(next - a) < 1e-9) break;
      a = next;
    }
    return lonFromRa(a);
  };

  const cusps: number[] = [];
  cusps[10] = mc;
  cusps[11] = cusp(1 / 3, false);
  cusps[12] = cusp(2 / 3, false);
  cusps[1] = asc;
  cusps[2] = cusp(2 / 3, true);
  cusps[3] = cusp(1 / 3, true);
  for (const h of [4, 5, 6, 7, 8, 9]) cusps[h] = n360(cusps[h <= 6 ? h + 6 : h - 6] + 180);
  return { armc, eps, asc, mc, cusps };
}
