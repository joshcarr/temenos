// What the Plate needs to know about a moment of sky: Moon phase, aspects,
// and which slow transits are touching the natal chart (the "seasons").

import { type BodyPosition, type Chart, type Figure, type Sign, SIGNS, norm360 } from './ephemeris';

export const signOfLon = (lon: number): Sign => SIGNS[Math.floor(norm360(lon) / 30)];

export const ASPECTS = [
  { id: 'conjunction', angle: 0, orb: 8 },
  { id: 'sextile', angle: 60, orb: 4 },
  { id: 'square', angle: 90, orb: 6 },
  { id: 'trine', angle: 120, orb: 6 },
  { id: 'opposition', angle: 180, orb: 8 },
] as const;
export type AspectId = (typeof ASPECTS)[number]['id'];

export interface Aspect {
  a: string;
  b: string;
  type: AspectId;
  orb: number; // degrees from exact
}

/** The smallest angle between two longitudes, 0..180. */
export const separation = (a: number, b: number) => Math.abs(((a - b + 540) % 360) - 180);

export function aspectBetween(lonA: number, lonB: number, orbScale = 1): { type: AspectId; orb: number } | null {
  const sep = separation(lonA, lonB);
  let best: { type: AspectId; orb: number } | null = null;
  for (const asp of ASPECTS) {
    const orb = Math.abs(sep - asp.angle);
    if (orb <= asp.orb * orbScale && (!best || orb < best.orb)) best = { type: asp.id, orb };
  }
  return best;
}

export function skyAspects(bodies: BodyPosition[]): Aspect[] {
  const out: Aspect[] = [];
  for (let i = 0; i < bodies.length; i++) {
    for (let j = i + 1; j < bodies.length; j++) {
      const hit = aspectBetween(bodies[i].lon, bodies[j].lon);
      if (hit) out.push({ a: bodies[i].figure, b: bodies[j].figure, ...hit });
    }
  }
  return out.sort((x, y) => x.orb - y.orb);
}

export type PhaseName =
  | 'New Moon' | 'Waxing Crescent' | 'First Quarter' | 'Waxing Gibbous'
  | 'Full Moon' | 'Waning Gibbous' | 'Last Quarter' | 'Waning Crescent';

export interface MoonPhase {
  name: PhaseName;
  angle: number; // Moon − Sun, 0..360
  illumination: number; // 0..1
  waxing: boolean;
}

export function moonPhase(sunLon: number, moonLon: number): MoonPhase {
  const angle = norm360(moonLon - sunLon);
  const illumination = (1 - Math.cos((angle * Math.PI) / 180)) / 2;
  const names: PhaseName[] = [
    'New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous',
    'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent',
  ];
  // Principal phases get a ±12° window (about a day); the rest fill between.
  const principal = [0, 90, 180, 270].find((p) => separation(angle, p) <= 12);
  const name = principal !== undefined ? names[principal / 45] : names[Math.floor(angle / 90) * 2 + 1];
  return { name, angle, illumination, waxing: angle < 180 };
}

// Slow movers whose contacts with the natal chart become seasons.
export const SEASON_MOVERS: Figure[] = ['Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto', 'Chiron'];
export const NATAL_POINTS = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'ASC', 'MC'] as const;
export type NatalPoint = (typeof NATAL_POINTS)[number];

// A season is active while the transit is within this orb. Jupiter moves
// fastest, so its seasons are shorter. M3 replaces this with dated arcs.
const SEASON_ORB: Partial<Record<Figure, number>> = { Jupiter: 1, Saturn: 1.5, Chiron: 1.5, Uranus: 1.5, Neptune: 1.5, Pluto: 1.5 };
const SEASON_ASPECTS: AspectId[] = ['conjunction', 'square', 'opposition', 'trine', 'sextile'];

export interface Season {
  mover: Figure;
  point: NatalPoint;
  type: AspectId;
  orb: number;
  name: string; // "Uranus on your Venus"
}

const pointLabel = (p: NatalPoint) => (p === 'ASC' ? 'Ascendant' : p);
const RELATION: Record<AspectId, string> = {
  conjunction: 'on', opposition: 'opposite', square: 'square', trine: 'trine', sextile: 'sextile',
};

export function natalPoints(natal: Chart): Record<NatalPoint, number> {
  const pts = {} as Record<NatalPoint, number>;
  for (const b of natal.bodies) if ((NATAL_POINTS as readonly string[]).includes(b.figure)) pts[b.figure as NatalPoint] = b.lon;
  pts.ASC = natal.houses!.asc;
  pts.MC = natal.houses!.mc;
  return pts;
}

export function activeSeasons(sky: Chart, natal: Chart): Season[] {
  const pts = natalPoints(natal);
  const out: Season[] = [];
  for (const b of sky.bodies) {
    if (!SEASON_MOVERS.includes(b.figure)) continue;
    for (const point of NATAL_POINTS) {
      const sep = separation(b.lon, pts[point]);
      for (const type of SEASON_ASPECTS) {
        const asp = ASPECTS.find((a) => a.id === type)!;
        const orb = Math.abs(sep - asp.angle);
        if (orb <= SEASON_ORB[b.figure]!) {
          out.push({ mover: b.figure, point, type, orb, name: `${b.figure} ${RELATION[type]} your ${pointLabel(point)}` });
        }
      }
    }
  }
  // Hard aspects and conjunctions first, then by closeness.
  const rank = (s: Season) => (['conjunction', 'opposition', 'square'].includes(s.type) ? 0 : 1);
  return out.sort((x, y) => rank(x) - rank(y) || x.orb - y.orb);
}

export const ELEMENT: Record<Sign, 'fire' | 'earth' | 'air' | 'water'> = {
  Aries: 'fire', Leo: 'fire', Sagittarius: 'fire',
  Taurus: 'earth', Virgo: 'earth', Capricorn: 'earth',
  Gemini: 'air', Libra: 'air', Aquarius: 'air',
  Cancer: 'water', Scorpio: 'water', Pisces: 'water',
};

// Traditional rulers, with the modern co-rulers for the last three signs.
export const RULERS: Record<Sign, Figure[]> = {
  Aries: ['Mars'], Taurus: ['Venus'], Gemini: ['Mercury'], Cancer: ['Moon'], Leo: ['Sun'], Virgo: ['Mercury'],
  Libra: ['Venus'], Scorpio: ['Mars', 'Pluto'], Sagittarius: ['Jupiter'], Capricorn: ['Saturn'],
  Aquarius: ['Saturn', 'Uranus'], Pisces: ['Jupiter', 'Neptune'],
};

// Sunday Sun, Monday Moon ... Saturday Saturn.
export const DAY_RULERS: Figure[] = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
