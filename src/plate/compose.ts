// Composes a Plate from the library, today's sky and the history of past Plates.
// Pure: the same inputs and seed always give the same Plate.

import type { Chart, Figure } from '../astro/ephemeris';
import { DAY_RULERS, RULERS, activeSeasons, moonPhase, natalPoints } from '../astro/sky';
import { daysBetween } from '../astro/time';
import { composeImage } from '../image/grammar';
import type { Library } from '../library';
import { LENSES, type Lens, type Tagged } from '../library/parse';
import { makeDeck } from './deck';
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
  'What sound from today would you keep in a jar?',
  'Where did the light fall today that you noticed?',
  'What did your hands do most today?',
  'Which door did today leave open?',
];

export const YESTERDAY_THRESHOLDS = [
  "What looks different about yesterday now that you've slept on it?",
  'Which part of yesterday came with you into the morning?',
  'One word for yesterday, chosen now, in daylight.',
  'What did the night do with yesterday?',
  'If yesterday left something on the doorstep, what was it?',
  'Which hour of yesterday would you walk back into, and why that one?',
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
  const chrono = [...history].sort((a, b) => (a.drawnAt < b.drawnAt ? -1 : a.drawnAt > b.drawnAt ? 1 : 0)); // oldest first
  const sameType = (p: Plate) => (p.session === 'dawn' ? 'dawn' : 'dusk') === sessionType;

  // --- the sky ---
  const sun = sky.bodies.find((b) => b.figure === 'Sun')!;
  const moon = sky.bodies.find((b) => b.figure === 'Moon')!;
  const phase = moonPhase(sun.lon, moon.lon);
  const seasons = activeSeasons(sky, natal);

  // --- figure of the day ---
  // Dealt from a deck: every figure once a cycle, an active season's mover two or
  // three times, and nobody back within two Plates of their last turn. The day's
  // ruler and the Moon's sign decide who tends to come up first.
  const available = sky.bodies.map((b) => b.figure).filter((f) => lib.figures[lower(f)]);
  const seasonCopies = new Map<Figure, number>();
  seasons.slice(0, 2).forEach((s, i) => seasonCopies.set(s.mover, Math.max(seasonCopies.get(s.mover) ?? 1, i === 0 ? 3 : 2)));
  const moonRulers = RULERS[moon.sign];
  const figureDeck = makeDeck(available, lower, chrono.map((p) => p.figure), { copies: (f) => seasonCopies.get(f) ?? 1, gap: 2 });
  const figure = figureDeck.deal(rng.fork('figure'), (f) => {
    let w = 1;
    if (DAY_RULERS[input.weekday] === f) w += 1.5;
    if (moonRulers.includes(f)) w += 1.5 / moonRulers.length;
    return w * landedFactor(history, (p) => p.figure === lower(f));
  });
  const fig = lib.figures[lower(figure)];
  const figBody = sky.bodies.find((b) => b.figure === figure)!;
  const season = seasons.find((s) => s.mover === figure);

  // --- lens and voice (offline, a voice comes with its reading) ---
  // Lenses and voices are dealt like the figures, and each figure deals out all
  // its readings before any comes back. The lens deck says which lens to try for;
  // when this figure has nothing fresh in it, the reading's own lens wins.
  const pinnedLens = settings.lens !== 'auto' ? settings.lens : undefined;
  const lensDeck = makeDeck(LENSES, (l) => l, chrono.map((p) => p.lens), { gap: 1 });
  let lens: Lens = pinnedLens ?? lensDeck.deal(rng.fork('lens'), (l) => landedFactor(history, (p) => p.lens === l));
  const voiceDeck = makeDeck(Object.keys(lib.voices), (v) => v, chrono.map((p) => p.voice), { gap: 2 });
  const pinnedVoice = settings.voice !== 'auto' ? fig.readings.filter((r) => r.voice === settings.voice) : [];
  const pinnedLensMatches = pinnedLens ? fig.readings.filter((r) => r.lens === pinnedLens) : [];
  const readingPool = pinnedVoice.length ? pinnedVoice : pinnedLensMatches.length ? pinnedLensMatches : fig.readings;
  const readingDeck = makeDeck(readingPool, (r) => r.text, chrono.filter((p) => p.figure === fig.id).map((p) => p.reading));
  const reading = readingDeck.deal(rng.fork('voice'), (r) => {
    let w = (fig.voices[r.voice] ?? 0.5) * landedFactor(history, (p) => p.voice === r.voice);
    if (r.lens !== lens) w *= pinnedLens ? 0.2 : 0.1;
    if (!voiceDeck.left(r.voice)) w *= 0.25;
    if (voiceDeck.recent(r.voice)) w *= 0.1;
    return w;
  });
  if (!pinnedLens || pinnedVoice.length) lens = reading.lens;

  // --- prompts ---
  const frame = (t: string) => (session === 'yesterdays-dusk' ? yesterdayFraming(t) : t);
  const used30 = usedPrompts(history, dateKey, 30);
  const wildEver = usedPrompts(history, dateKey, Infinity, 'wild');

  // The dawn threshold is always the dream. The others, and the anchor families,
  // are dealt so each comes round once before any comes round again.
  const thresholdPool = session === 'dawn' ? [DAWN_THRESHOLD] : session === 'dusk' ? DUSK_THRESHOLDS : YESTERDAY_THRESHOLDS;
  const pastThresholds = chrono.flatMap((p) => p.prompts.filter((x) => x.kind === 'threshold').map((x) => x.text));
  const threshold = makeDeck(thresholdPool, frame, pastThresholds, { gap: 2 }).deal(rng.fork('threshold'));

  const families = lib.anchors[sessionType];
  const pastFamilies = chrono.filter(sameType).flatMap((p) => p.prompts.filter((x) => x.kind === 'anchor').map((x) => x.family ?? ''));
  const family = makeDeck(families, (f) => f.id, pastFamilies, { gap: 2 }).deal(rng.fork('anchor'), (f) =>
    (f.kin.includes(fig.id) ? 2 : 1) * landedFactor(history, (p, i) => p.prompts[i]?.family === f.id));
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
  const lastFallow = chrono.filter((p) => p.fallow).at(-1);
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
  // Each figure deals out all its retold myths before any comes back. A myth shared
  // with another figure counts as dealt whichever figure brought it.
  const withRetelling = fig.myths.filter((m) => lib.myths[m.id]);
  const pastMyths = chrono.map((p) => p.myth ?? '');
  const myth = withRetelling.length ? makeDeck(withRetelling, (m) => m.id, pastMyths, { gap: 1 }).deal(rng.fork('myth')).id : undefined;

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
