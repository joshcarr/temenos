// The Plate image grammar: today's sky → a small set of forms and one line.
// Pure and seeded, so the same Plate always draws the same image.
// See docs/m1-proposal.md for the rules in prose.

import type { BodyPosition, Figure } from '../astro/ephemeris';
import { ELEMENT, type AspectId, type MoonPhase, aspectBetween, signOfLon } from '../astro/sky';
import { makeRng } from '../plate/rng';

export type Shape = 'triangle' | 'square' | 'circle' | 'arrow';
const FORM: Record<'fire' | 'earth' | 'water' | 'air', Shape> = { fire: 'triangle', earth: 'square', water: 'circle', air: 'arrow' };

export const DEFAULT_COLOURS: Record<string, string> = {
  sun: '#e3a92b', moon: '#a9bccf', mercury: '#5f8a6e', venus: '#c4506a', mars: '#d2472f', jupiter: '#3a55a4',
  saturn: '#7a6a58', uranus: '#2aa89c', neptune: '#6f5b9a', pluto: '#6e2230', chiron: '#c08a3e',
};

export interface Form {
  label: string; // "Uranus", "natal Venus"
  shape: Shape;
  d: string; // SVG path
  colour: string;
  role: 'figure' | 'natal' | 'cast';
  relation?: AspectId;
  cx: number;
  cy: number;
}

export interface ImageSpec {
  size: number;
  session: 'dawn' | 'dusk';
  ground: string;
  ink: string; // colour of the line
  moon: { cx: number; cy: number; r: number; lit: string; dark: string; litPath: string };
  band: { y: number; colour: string };
  forms: Form[];
  overlaps: { a: number; b: number; colour: string }[]; // indices into forms: draw b clipped to a
  axes: { x1: number; y1: number; x2: number; y2: number }[];
  hatches: { d: string }[];
  line: { d: string; arrow: string };
  mark: { shape: Shape; colour: string };
}

export interface ImageInput {
  seed: string;
  session: 'dawn' | 'dusk';
  figure: Figure;
  bodies: Pick<BodyPosition, 'figure' | 'lon'>[];
  phase: MoonPhase;
  season?: { point: string; lon: number; type: AspectId };
  colours: Record<string, string>;
}

const S = 360;
const rad = Math.PI / 180;
const f1 = (n: number) => Math.round(n * 10) / 10;

function polygon(points: [number, number][]): string {
  return 'M' + points.map(([x, y]) => `${f1(x)} ${f1(y)}`).join(' L') + ' Z';
}

/** A form's outline, slightly wobbled by hand. */
function shapePath(shape: Shape, cx: number, cy: number, size: number, rotation: number, wobble: () => number): string {
  let local: [number, number][];
  switch (shape) {
    case 'triangle':
      local = [-90, 30, 150].map((a) => [Math.cos(a * rad) * size * 0.62, Math.sin(a * rad) * size * 0.62]);
      break;
    case 'square': {
      const h = size * 0.43;
      local = [[-h, -h], [h, -h], [h, h], [-h, h]];
      break;
    }
    case 'circle':
      local = Array.from({ length: 40 }, (_, i) => [Math.cos(i * 9 * rad) * size * 0.5, Math.sin(i * 9 * rad) * size * 0.5]);
      break;
    case 'arrow': {
      const L = size * 1.35, w = size * 0.2, hw = size * 0.62, hl = size * 0.46;
      local = [[-L / 2, -w / 2], [L / 2 - hl, -w / 2], [L / 2 - hl, -hw / 2], [L / 2, 0], [L / 2 - hl, hw / 2], [L / 2 - hl, w / 2], [-L / 2, w / 2]];
      break;
    }
  }
  const c = Math.cos(rotation * rad), s = Math.sin(rotation * rad);
  const jit = shape === 'circle' ? size * 0.008 : size * 0.025;
  return polygon(local.map(([x, y]) => [cx + x * c - y * s + wobble() * jit, cy + x * s + y * c + wobble() * jit]));
}

/** The lit part of a Moon disc for a given phase. Waxing is lit from the right. */
export function moonLitPath(cx: number, cy: number, r: number, illumination: number, waxing: boolean): string {
  if (illumination < 0.01) return '';
  const top = `${f1(cx)} ${f1(cy - r)}`, bottom = `${f1(cx)} ${f1(cy + r)}`;
  const rx = f1(Math.abs(1 - 2 * illumination) * r);
  const outerSweep = waxing ? 1 : 0; // outer limb on the lit side
  const innerSweep = illumination > 0.5 ? outerSweep : 1 - outerSweep; // gibbous bulges past the middle
  return `M${top} A${r} ${r} 0 0 ${outerSweep} ${bottom} A${rx} ${r} 0 0 ${innerSweep} ${top} Z`;
}

export function mix(a: string, b: string, darken = 0.82): string {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [x, y] = [p(a), p(b)];
  return '#' + x.map((v, i) => Math.round(((v + y[i]) / 2) * darken).toString(16).padStart(2, '0')).join('');
}

/** A smooth path through points (Catmull-Rom as cubic Béziers). */
function smooth(pts: [number, number][]): string {
  let d = `M${f1(pts[0][0])} ${f1(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${f1(c1[0])} ${f1(c1[1])}, ${f1(c2[0])} ${f1(c2[1])}, ${f1(p2[0])} ${f1(p2[1])}`;
  }
  return d;
}

/** A point on the card's edge, t in [0,1) clockwise from the top-left corner. */
function edgePoint(t: number): [number, number] {
  const u = (((t % 1) + 1) % 1) * 4;
  const side = Math.floor(u), k = u - side;
  if (side === 0) return [k * S, 0];
  if (side === 1) return [S, k * S];
  if (side === 2) return [S - k * S, S];
  return [0, S - k * S];
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export function composeImage(input: ImageInput): ImageSpec {
  const rng = makeRng(`${input.seed}:image`);
  const wobble = () => rng.range(-1, 1);
  const dusk = input.session === 'dusk';
  const colour = (f: string) => input.colours[f.toLowerCase()] ?? DEFAULT_COLOURS[f.toLowerCase()] ?? '#888888';
  const shapeFor = (lon: number) => FORM[ELEMENT[signOfLon(lon)]];

  const ground = dusk ? '#232633' : '#efe7d6';
  const ink = dusk ? '#f3ecde' : '#23252f';

  // Ground: the Moon's phase sets how much of the field is lit.
  const moonR = S * 0.34;
  const moonCx = S * rng.range(0.56, 0.7), moonCy = S * rng.range(0.34, 0.44);
  const moon = {
    cx: moonCx, cy: moonCy, r: moonR,
    lit: dusk ? '#d8d1c1' : '#faf6ec',
    dark: dusk ? '#2c3041' : '#dfd4bd',
    litPath: moonLitPath(moonCx, moonCy, moonR, input.phase.illumination, input.phase.waxing),
  };
  const band = { y: S * rng.range(0.78, 0.84), colour: dusk ? '#2f3a4d' : '#d8c7a2' };

  // The figure of the day: its sign's element gives the form.
  const fig = input.bodies.find((b) => b.figure === input.figure)!;
  const figSize = S * 0.3;
  const fx = S * rng.range(0.3, 0.38), fy = S * rng.range(0.52, 0.6);
  const figShape = shapeFor(fig.lon);
  const toMoon = Math.atan2(moonCy - fy, moonCx - fx) / rad;
  const figRot = figShape === 'arrow' ? toMoon + rng.range(-12, 12) : rng.range(-12, 12);
  const forms: Form[] = [{
    label: input.figure, shape: figShape, colour: colour(input.figure), role: 'figure', cx: fx, cy: fy,
    d: shapePath(figShape, fx, fy, figSize, figRot, wobble),
  }];
  const overlaps: ImageSpec['overlaps'] = [];
  const axes: ImageSpec['axes'] = [];
  const hatches: ImageSpec['hatches'] = [];

  // The cast: the natal point of an active season first, then the tightest aspects to the figure.
  const partners: { label: string; key: string; lon: number; type: AspectId; role: 'natal' | 'cast' }[] = [];
  if (input.season) partners.push({ label: `natal ${input.season.point}`, key: input.season.point, lon: input.season.lon, type: input.season.type, role: 'natal' });
  const aspects = input.bodies
    .filter((b) => b.figure !== input.figure)
    .map((b) => ({ b, hit: aspectBetween(fig.lon, b.lon) }))
    .filter((x) => x.hit)
    .sort((x, y) => x.hit!.orb - y.hit!.orb);
  for (const { b, hit } of aspects) {
    if (partners.length >= 3) break;
    partners.push({ label: b.figure, key: b.figure, lon: b.lon, type: hit!.type, role: 'cast' });
  }

  const baseAngles = [rng.range(-60, -20), rng.range(120, 160), rng.range(200, 240)];
  partners.forEach((p, i) => {
    const size = figSize * (p.role === 'natal' ? 0.72 : 0.5);
    const shape = p.key === 'ASC' || p.key === 'MC' ? 'circle' : shapeFor(p.lon);
    const pc = colour(p.key === 'ASC' || p.key === 'MC' ? 'moon' : p.key);
    const ang = baseAngles[i] * rad;
    let cx = fx, cy = fy;
    switch (p.type) {
      case 'conjunction': cx += Math.cos(ang) * figSize * 0.42; cy += Math.sin(ang) * figSize * 0.42; break;
      case 'sextile': cx += Math.cos(ang) * (figSize + size) * 0.5; cy += Math.sin(ang) * (figSize + size) * 0.5; break;
      case 'square': {
        const perp = (figRot + 90) * rad;
        cx += Math.cos(perp) * (figSize + size) * 0.62; cy += Math.sin(perp) * (figSize + size) * 0.62;
        break;
      }
      case 'trine': break; // nests inside the figure
      case 'opposition': cx = S - fx + rng.range(-10, 10); cy = S - fy - S * 0.12; break;
    }
    cx = clamp(cx, size * 0.5, S - size * 0.5);
    cy = clamp(cy, size * 0.5, S - size * 0.5);
    const rot = shape === 'arrow' ? (p.type === 'conjunction' ? figRot + rng.range(55, 80) : rng.range(0, 360)) : rng.range(-15, 15);
    const form: Form = {
      label: p.label, shape, colour: pc, role: p.role, relation: p.type, cx, cy,
      d: shapePath(shape, cx, cy, p.type === 'trine' ? figSize * 0.34 : size, rot, wobble),
    };
    forms.push(form);
    const idx = forms.length - 1;
    if (p.type === 'conjunction') overlaps.push({ a: 0, b: idx, colour: mix(forms[0].colour, pc) });
    if (p.type === 'opposition') {
      const dx = cx - fx, dy = cy - fy;
      axes.push({ x1: fx - dx * 0.25, y1: fy - dy * 0.25, x2: cx + dx * 0.25, y2: cy + dy * 0.25 });
    }
    if (p.type === 'square') {
      const mx = (fx + cx) / 2, my = (fy + cy) / 2;
      const a = Math.atan2(cy - fy, cx - fx);
      const h = 7;
      const lines = [-1, 0, 1].map((k) => {
        const ox = mx + Math.cos(a) * k * 6, oy = my + Math.sin(a) * k * 6;
        return `M${f1(ox - Math.sin(a) * h)} ${f1(oy + Math.cos(a) * h)} L${f1(ox + Math.sin(a) * h)} ${f1(oy - Math.cos(a) * h)}`;
      });
      hatches.push({ d: lines.join(' ') });
    }
  });
  // Nested (trine) forms draw on top of the figure; everything else underneath.
  const order = forms.map((_, i) => i).sort((a, b) => {
    const rank = (i: number) => (forms[i].relation === 'trine' ? 2 : i === 0 ? 1 : 0);
    return rank(a) - rank(b);
  });
  const sortedForms = order.map((i) => forms[i]);
  const remap = new Map(order.map((old, neu) => [old, neu]));

  // The line: enters where the Moon sits on the zodiac, visits the cast,
  // loops once round the figure, and leaves on the far side.
  const moonLon = input.bodies.find((b) => b.figure === 'Moon')?.lon ?? 0;
  const t0 = moonLon / 360;
  const start = edgePoint(t0);
  const end = edgePoint(t0 + 0.5 + rng.range(-0.06, 0.06));
  const pts: [number, number][] = [start];
  for (const f of forms.slice(1)) pts.push([f.cx + rng.range(-12, 12), f.cy + rng.range(-12, 12)]);
  const loopR = figSize * 0.78;
  const a0 = Math.atan2(pts[pts.length - 1][1] - fy, pts[pts.length - 1][0] - fx);
  for (let k = 0; k < 5; k++) {
    const a = a0 + (k * 2 * Math.PI) / 5 + rng.range(-0.2, 0.2);
    const r = loopR * rng.range(0.85, 1.15);
    pts.push([clamp(fx + Math.cos(a) * r, 8, S - 8), clamp(fy + Math.sin(a) * r, 8, S - 8)]);
  }
  pts.push(end);
  const d = smooth(pts);
  const [ex, ey] = end;
  const [px, py] = pts[pts.length - 2];
  const ang = Math.atan2(ey - py, ex - px);
  const back = (da: number): string => `${f1(ex - Math.cos(ang + da) * 12)} ${f1(ey - Math.sin(ang + da) * 12)}`;
  const arrow = `M${back(0.45)} L${f1(ex)} ${f1(ey)} L${back(-0.45)}`;

  return {
    size: S,
    session: input.session,
    ground,
    ink,
    moon,
    band,
    forms: sortedForms,
    overlaps: overlaps.map((o) => ({ a: remap.get(o.a)!, b: remap.get(o.b)!, colour: o.colour })),
    axes,
    hatches,
    line: { d, arrow },
    mark: { shape: figShape, colour: forms[0].colour },
  };
}
