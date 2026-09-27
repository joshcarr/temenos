// Composes a Plate from the library, today's sky and the history of past Plates.
// Pure: the same inputs and seed always give the same Plate.

import type { Chart, Figure } from '../astro/ephemeris';
import { DAY_RULERS, RULERS, activeSeasons, moonPhase, natalPoints } from '../astro/sky';
import { daysBetween, previousDateKey } from '../astro/time';
import { composeImage } from '../image/grammar';
import type { Library } from '../library';
import { LENSES, type Lens, type Tagged } from '../library/parse';
import { generatedFigurePrompts, generatedWildcards } from './generated';
import { type Rng, makeRng } from './rng';
import type { Plate, PlatePrompt, Session } from './types';

export interface PlateSettings {
  lens: Lens | 'auto';
  voice: string | 'auto';
}

export interface ComposeInput {
  lib: Library;
  sky: Chart;
  natal: Chart;
  dateKey: string;
  weekday: number; // 0 = Sunday, in the home zone
  session: Session;
  redraws: number;
  history: Plate[]; // earlier Plates, any order; the current session's own Plate excluded
  settings: PlateSettings;
}

export const DAWN_THRESHOLD = 'What did you dream? If nothing, what image were you holding as you woke?';

export const DUSK_THRESHOLDS = [
  'One word for the day.',
  'What was the weather inside you today?',
  'If today were a colour, which one? Where did it deepen?',
  'What image from today is still hanging around?',
  'Name the texture of today: rough, smooth, knotted, loose?',
  'Which animal was closest to you today, in spirit?',
];

export const YESTERDAY_THRESHOLDS = [
  "What looks different about yesterday now that you've slept on it?",
  'Which part of yesterday came with you into the morning?',
  'One word for yesterday, chosen now, in daylight.',
  'What did the night do with yesterday?',
];

const lower = (f: Figure) => f.toLowerCase();

/** Weight from "did it land?" marks: gently up for landed, gently down otherwise, never to zero. */
export function landedFactor(history: Plate[], matches: (p: Plate, promptIndex: number) => boolean): number {
  let yes = 0;
  let no = 0;
  for (const p of history) {
    if (!p.landedAsked || !p.landed) continue;
    p.landed.forEach((hit, i) => {
      if (matches(p, i)) hit ? yes++ : no++;
    });
  }
  return Math.min(2.5, Math.max(0.4, 1 + 0.25 * yes - 0.08 * no));
}

/** The set of prompt texts used within `days` before `dateKey` (Infinity = ever). */
function usedPrompts(history: Plate[], dateKey: string, days: number, kind?: string): Set<string> {
  const out = new Set<string>();
  for (const p of history) {
    if (daysBetween(p.dateKey, dateKey) > days) continue;
    for (const pr of p.prompts) if (!kind || pr.kind === kind) out.add(pr.text);
  }
  return out;
}

const fitsLens = (t: Tagged, lens: Lens) => !t.lens || t.lens === lens;

/** Picks from a pool, avoiding used texts; relaxes the lens before allowing a repeat. */
function pickFresh(rng: Rng, pool: Tagged[], lens: Lens, used: Set<string>): string | undefined {
  const tiers = [
    pool.filter((t) => fitsLens(t, lens) && !used.has(t.text)),
    pool.filter((t) => !used.has(t.text)),
  ];
  for (const tier of tiers) if (tier.length) return rng.pick(tier).text;
  return undefined;
}

export function yesterdayFraming(text: string): string {
  return text
    .replace(/\btomorrow\b/g, '\u0000').replace(/\bTomorrow\b/g, '\u0001')
    .replace(/\btoday's\b/g, "yesterday's").replace(/\bToday's\b/g, "Yesterday's")
    .replace(/\btoday\b/g, 'yesterday').replace(/\bToday\b/g, 'Yesterday')
    .replace(/\btonight\b/g, 'last night').replace(/\bTonight\b/g, 'Last night')
    .replace(/\u0000/g, 'today').replace(/\u0001/g, 'Today');
}

export function composePlate(input: ComposeInput): Plate {
  const { lib, sky, natal, dateKey, session, redraws, history, settings } = input;
  const seed = `${dateKey}:${session}:${redraws}`;
  const rng = makeRng(seed);
  const sessionType = session === 'dawn' ? 'dawn' : 'dusk';
  const sorted = [...history].sort((a, b) => (a.drawnAt < b.drawnAt ? 1 : -1)); // newest first

  // --- the sky ---
  const sun = sky.bodies.find((b) => b.figure === 'Sun')!;
  const moon = sky.bodies.find((b) => b.figure === 'Moon')!;
  const phase = moonPhase(sun.lon, moon.lon);
  const seasons = activeSeasons(sky, natal);

  // --- figure of the day ---
  const available = sky.bodies.map((b) => b.figure).filter((f) => lib.figures[lower(f)]);
  const prev1 = previousDateKey(dateKey);
  const prev2 = previousDateKey(prev1);
  const figuresOn = (k: string) => new Set(history.filter((p) => p.dateKey === k).map((p) => p.figure));
  const seasonWeight = new Map<Figure, number>();
  seasons.slice(0, 2).forEach((s, i) => seasonWeight.set(s.mover, Math.max(seasonWeight.get(s.mover) ?? 0, i === 0 ? 6 : 3)));
  const moonRulers = RULERS[moon.sign];
  const lastFigure = sorted[0]?.figure;
  const figure = rng.fork('figure').weighted(available, (f) => {
    const id = lower(f);
    let w = 1 + (seasonWeight.get(f) ?? 0);
    if (DAY_RULERS[input.weekday] === f) w += 1.5;
    if (moonRulers.includes(f)) w += 1.5 / moonRulers.length;
    const threeRunning = figuresOn(prev1).has(id) && figuresOn(prev2).has(id);
    if (threeRunning && !seasonWeight.has(f)) return 0;
    if (lastFigure === id && !seasonWeight.has(f)) w *= 0.5;
    return w * landedFactor(history, (p) => p.figure === id);
  });
  const fig = lib.figures[lower(figure)];
  const figBody = sky.bodies.find((b) => b.figure === figure)!;
  const season = seasons.find((s) => s.mover === figure);

  // --- lens and voice (offline, a voice comes with its reading) ---
  const pinnedLens = settings.lens !== 'auto' ? settings.lens : undefined;
  let lens: Lens = pinnedLens ?? rng.fork('lens').weighted(LENSES, (l) => landedFactor(history, (p) => p.lens === l));
  const lastVoice = sorted[0]?.voice;
  const pinnedVoice = settings.voice !== 'auto' ? fig.readings.filter((r) => r.voice === settings.voice) : [];
  const lensMatches = fig.readings.filter((r) => r.lens === lens);
  const readingPool = pinnedVoice.length ? pinnedVoice : lensMatches.length ? lensMatches : fig.readings;
  const reading = rng.fork('voice').weighted(readingPool, (r) => {
    let w = (fig.voices[r.voice] ?? 0.5) * landedFactor(history, (p) => p.voice === r.voice);
    if (r.voice === lastVoice) w *= 0.5;
    if (pinnedLens && r.lens !== pinnedLens) w *= 0.2;
    return w;
  });
  if (!pinnedLens || pinnedVoice.length) lens = reading.lens;

  // --- prompts ---
  const used30 = usedPrompts(history, dateKey, 30);
  const wildEver = usedPrompts(history, dateKey, Infinity, 'wild');
  const frame = (t: string) => (session === 'yesterdays-dusk' ? yesterdayFraming(t) : t);

  const lastSame = sorted.find((p) => (p.session === 'dawn' ? 'dawn' : 'dusk') === sessionType);
  const thresholdPool = session === 'dawn' ? [DAWN_THRESHOLD] : session === 'dusk' ? DUSK_THRESHOLDS : YESTERDAY_THRESHOLDS;
  const lastThreshold = lastSame?.prompts.find((p) => p.kind === 'threshold')?.text;
  const threshold = rng.fork('threshold').pick(thresholdPool.length > 1 ? thresholdPool.filter((t) => t !== lastThreshold) : thresholdPool);

  const families = lib.anchors[sessionType];
  const lastFamily = sorted
    .filter((p) => (p.session === 'dawn' ? 'dawn' : 'dusk') === sessionType)
    .map((p) => p.prompts.find((x) => x.kind === 'anchor')?.family)
    .find(Boolean);
  const daysSinceFamily = (id: string) => {
    const p = sorted.find((h) => h.prompts.some((x) => x.kind === 'anchor' && x.family === id));
    return p ? daysBetween(p.dateKey, dateKey) : Infinity;
  };
  const family = rng.fork('anchor').weighted(families, (f) => {
    if (f.id === lastFamily && families.length > 1) return 0;
    const since = daysSinceFamily(f.id);
    let w = since === Infinity ? 1.5 : Math.min(since, 10) / 7;
    if (f.kin.includes(fig.id)) w *= 2;
    return w * landedFactor(history, (p, i) => p.prompts[i]?.family === f.id);
  });
  const anchorText =
    pickFresh(rng.fork('anchor-text'), family.recuts[fig.id] ?? [], lens, used30) ??
    pickFresh(rng.fork('anchor-kin'), family.kin.flatMap((k) => family.recuts[k] ?? []), lens, used30) ??
    pickFresh(rng.fork('anchor-any'), Object.values(family.recuts).flat(), lens, used30) ??
    family.original;

  const figureText =
    pickFresh(rng.fork('figure-text'), fig.prompts[lens].map((text) => ({ text })), lens, used30) ??
    pickFresh(rng.fork('figure-gen'), generatedFigurePrompts(fig).filter((t) => t.lens === lens), lens, used30) ??
    pickFresh(rng.fork('figure-any'), LENSES.flatMap((l) => fig.prompts[l].map((text) => ({ text, lens: l }))), lens, used30) ??
    rng.fork('figure-repeat').pick(fig.prompts[lens]);

  const wildText =
    pickFresh(rng.fork('wild'), fig.wildcards, lens, wildEver) ??
    pickFresh(rng.fork('wild-gen'), generatedWildcards(fig), lens, wildEver) ??
    pickFresh(rng.fork('wild-any'), Object.values(lib.figures).flatMap((f) => [...f.wildcards, ...generatedWildcards(f)]), lens, wildEver) ??
    rng.fork('wild-repeat').pick(fig.wildcards).text;

  // --- fallow Plates: about once every week or two, never two within a week ---
  const lastFallow = sorted.find((p) => p.fallow);
  const fallowAllowed = history.length >= 4 && (!lastFallow || daysBetween(lastFallow.dateKey, dateKey) >= 7);
  const fallowRoll = rng.fork('fallow').next();
  const fallow: Plate['fallow'] = fallowAllowed && fallowRoll < 0.1 ? (fallowRoll < 0.04 ? 'copy-image' : 'one-prompt') : false;

  let prompts: PlatePrompt[] = [
    { kind: 'threshold', text: frame(threshold) },
    { kind: 'anchor', text: frame(anchorText), family: family.id },
    { kind: 'figure', text: frame(figureText) },
    { kind: 'wild', text: frame(wildText) },
  ];
  if (fallow === 'one-prompt') prompts = [prompts[2]];
  if (fallow === 'copy-image') prompts = [{ kind: 'figure', text: 'Write nothing today. Copy the image into your notebook, slowly.' }];

  // --- the myth thread ---
  const recentMyths = new Set(history.filter((p) => daysBetween(p.dateKey, dateKey) <= 14).map((p) => p.myth));
  const withRetelling = fig.myths.filter((m) => lib.myths[m.id]);
  const mythPool = withRetelling.filter((m) => !recentMyths.has(m.id));
  const myth = (mythPool.length ? rng.fork('myth').pick(mythPool) : withRetelling.length ? rng.fork('myth').pick(withRetelling) : undefined)?.id;

  // --- the sky line under the figure's name ---
  const signImage = lib.signs[figBody.sign.toLowerCase()]?.image;
  const parts = [`${figure} in ${figBody.sign}${figBody.speed < 0 ? ', retrograde' : ''}`];
  if (season) parts.push(season.name.replace(`${figure} `, ''));
  else if (signImage) parts.push(signImage);
  const skyLine = parts.join(', ') + '.';

  const epithet = rng.fork('epithet').pick(fig.epithets);
  const natalPts = natalPoints(natal);

  return {
    id: `${dateKey}:${session}`,
    dateKey,
    session,
    drawnAt: new Date().toISOString(),
    redraws,
    seed,
    sky: {
      utc: sky.utc.toISOString(),
      moon: { phase: phase.name, sign: moon.sign, illumination: phase.illumination, waxing: phase.waxing },
      bodies: sky.bodies.map((b) => ({ figure: b.figure, lon: b.lon, speed: b.speed, sign: b.sign })),
    },
    season: seasons[0] && { name: seasons[0].name, mover: seasons[0].mover, point: seasons[0].point, type: seasons[0].type },
    figure: fig.id,
    epithet,
    lens,
    voice: reading.voice,
    skyLine,
    reading: reading.text,
    prompts,
    fallow,
    myth,
    image: composeImage({
      seed,
      session: sessionType,
      figure,
      bodies: sky.bodies,
      phase,
      season: season && { point: season.point, lon: natalPts[season.point], type: season.type },
      colours: Object.fromEntries(Object.values(lib.figures).map((f) => [f.id, f.colour])),
    }),
  };
}

/** Which session to offer on opening, by local hour in the home zone. */
export function defaultSession(hour: number, drawnToday: { dawn: boolean; dusk: boolean }): Session {
  if (hour < 14) return 'dawn';
  if (hour >= 17) return 'dusk';
  if (!drawnToday.dawn && drawnToday.dusk) return 'dawn';
  return 'dusk';
}
