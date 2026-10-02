import { describe, expect, it } from 'vitest';
import { castChart } from '../src/astro/ephemeris';
import { moonPhase } from '../src/astro/sky';
import { localParts, localToUtc } from '../src/astro/time';
import { moonLitPath } from '../src/image/grammar';
import { DAWN_THRESHOLD, composePlate, defaultSession, yesterdayFraming } from '../src/plate/compose';
import type { Plate, Session } from '../src/plate/types';
import { makeDeck } from '../src/plate/deck';
import { makeRng } from '../src/plate/rng';
import { loadLibrary } from './helpers/library';

const lib = loadLibrary();
// A made-up natal chart; real birth data never lives in the repo.
const natalP = castChart(localToUtc({ year: 1980, month: 3, day: 14, hour: 6, minute: 45 }, 'Europe/London'), { lat: 51.5074, lon: -0.1278 });
const HOME = 'America/Los_Angeles';
const settings = { lens: 'auto', voice: 'auto' } as const;

async function draw(dateKey: string, session: Session, history: Plate[], redraws = 0) {
  const [y, m, d] = dateKey.split('-').map(Number);
  const utc = localToUtc({ year: y, month: m, day: d, hour: session === 'dawn' ? 7 : 21, minute: 0 }, HOME);
  const sky = await castChart(utc);
  return composePlate({ lib, sky, natal: await natalP, dateKey, weekday: localParts(utc, HOME).weekday, session, redraws, history, settings });
}

const addDays = (k: string, n: number) => new Date(Date.parse(k) + n * 86400000).toISOString().slice(0, 10);

describe('makeDeck', () => {
  const dealMany = (cards: string[], n: number, opts: Parameters<typeof makeDeck<string>>[3] = {}) => {
    const past: string[] = [];
    for (let i = 0; i < n; i++) past.push(makeDeck(cards, (c) => c, past, opts).deal(makeRng(`deck:${i}`)));
    return past;
  };
  it('deals every card once before any card twice', () => {
    const cards = ['a', 'b', 'c', 'd', 'e'];
    const past = dealMany(cards, 15);
    for (let c = 0; c < 3; c++) expect(new Set(past.slice(c * 5, c * 5 + 5)).size).toBe(5);
  });
  it('gives a card with three copies about three turns in every cycle, and holds back recent cards across a reshuffle', () => {
    const cards = 'abcdefghijk'.split(''); // eleven, like the figures
    const past = dealMany(cards, 390, { copies: (c) => (c === 'a' ? 3 : 1), gap: 2 });
    expect(past.filter((x) => x === 'a').length / past.length).toBeCloseTo(3 / 13, 1);
    past.forEach((x, i) => expect(past.slice(Math.max(0, i - 2), i)).not.toContain(x));
  });
});

describe('composePlate', () => {
  it('is reproducible from date, session and redraw count', async () => {
    const a = await draw('2026-09-26', 'dusk', []);
    const b = await draw('2026-09-26', 'dusk', []);
    expect({ ...a, drawnAt: '' }).toEqual({ ...b, drawnAt: '' });
    const c = await draw('2026-09-26', 'dusk', [], 1);
    expect(c.seed).not.toBe(a.seed);
  });

  it('puts four prompts in order, dawn starting with the dream', async () => {
    const p = await draw('2026-09-27', 'dawn', []);
    expect(p.prompts.map((x) => x.kind)).toEqual(['threshold', 'anchor', 'figure', 'wild']);
    expect(p.prompts[0].text).toBe(DAWN_THRESHOLD);
    expect(p.reading.split(/\s+/).length).toBeLessThanOrEqual(150);
  });

  it('two months of twice-daily Plates: no repeats inside 30 days, wild cards never, no anchor family twice running', async () => {
    const history: Plate[] = [];
    let day = '2026-10-01';
    for (let i = 0; i < 60; i++) {
      for (const session of ['dawn', 'dusk'] as const) history.push(await draw(day, session, history));
      day = addDays(day, 1);
    }
    const wild = new Set<string>();
    const lastFamily: Record<string, string | undefined> = {};
    const figuresByDay = new Map<string, Set<string>>();
    for (const [i, p] of history.entries()) {
      for (const pr of p.prompts) {
        if (pr.kind === 'wild') {
          expect(wild.has(pr.text), `wild card repeated: ${pr.text}`).toBe(false);
          wild.add(pr.text);
        }
        if (pr.kind === 'threshold' || p.fallow === 'copy-image') continue;
        const earlier = history.slice(0, i).filter((q) => Date.parse(p.dateKey) - Date.parse(q.dateKey) <= 30 * 86400000);
        const isOriginal = lib.anchors[p.session === 'dawn' ? 'dawn' : 'dusk'].some((f) => f.original === pr.text);
        if (!isOriginal) expect(earlier.some((q) => q.prompts.some((x) => x.text === pr.text)), `repeat within 30 days: ${pr.text}`).toBe(false);
      }
      const fam = p.prompts.find((x) => x.kind === 'anchor')?.family;
      if (fam) {
        expect(fam, `${p.id} repeats its family`).not.toBe(lastFamily[p.session]);
        lastFamily[p.session] = fam;
      }
      if (!figuresByDay.has(p.dateKey)) figuresByDay.set(p.dateKey, new Set());
      figuresByDay.get(p.dateKey)!.add(p.figure);
    }
    const fallows = history.filter((p) => p.fallow).length;
    expect(fallows).toBeGreaterThanOrEqual(2);
    expect(fallows).toBeLessThanOrEqual(12);
  }, 30000);

  it('deals like a deck: the first week has no repeated reading, myth or anchor family, and no figure back within two Plates', async () => {
    const history: Plate[] = [];
    let day = '2026-09-26';
    for (let i = 0; i < 6; i++) {
      for (const session of ['dawn', 'dusk'] as const) history.push(await draw(day, session, history));
      day = addDays(day, 1);
    }
    const unique = (xs: (string | undefined)[]) => new Set(xs).size === xs.length;
    expect(unique(history.map((p) => p.reading)), 'reading repeated').toBe(true);
    expect(unique(history.map((p) => p.myth)), 'myth repeated').toBe(true);
    for (const s of ['dawn', 'dusk']) {
      expect(unique(history.filter((p) => p.session === s).map((p) => p.prompts.find((x) => x.kind === 'anchor')?.family)), `${s} family repeated`).toBe(true);
    }
    history.forEach((p, i) => {
      expect(history.slice(Math.max(0, i - 2), i).map((q) => q.figure), `${p.id} figure back too soon`).not.toContain(p.figure);
    });
    // All three lenses turn up, and none three times running.
    expect(new Set(history.map((p) => p.lens)).size).toBe(3);
    history.slice(2).forEach((p, i) => expect(p.lens === history[i].lens && p.lens === history[i + 1].lens, `${p.id} lens three running`).toBe(false));
  }, 30000);

  it('deals every reading for a figure before repeating one', async () => {
    const history: Plate[] = [];
    let day = '2026-10-01';
    for (let i = 0; i < 60; i++) {
      for (const session of ['dawn', 'dusk'] as const) history.push(await draw(day, session, history));
      day = addDays(day, 1);
    }
    for (const fig of Object.values(lib.figures)) {
      const seen = history.filter((p) => p.figure === fig.id).map((p) => p.reading);
      const firstCycle = seen.slice(0, fig.readings.length);
      expect(new Set(firstCycle).size, `${fig.id} repeated a reading early`).toBe(firstCycle.length);
    }
  }, 30000);

  it('reframes for Yesterday\'s Dusk', () => {
    expect(yesterdayFraming("What did today teach you? Tomorrow's stone: which one for tomorrow?"))
      .toBe("What did yesterday teach you? Today's stone: which one for today?");
  });
});

describe('sessions and the Moon', () => {
  it('Dawn before 2pm, Dusk after 5pm, and the undrawn one in between', () => {
    expect(defaultSession(7, { dawn: false, dusk: false })).toBe('dawn');
    expect(defaultSession(20, { dawn: true, dusk: false })).toBe('dusk');
    expect(defaultSession(15, { dawn: false, dusk: false })).toBe('dusk');
    expect(defaultSession(15, { dawn: false, dusk: true })).toBe('dawn');
  });
  it('names the phases', () => {
    expect(moonPhase(0, 3).name).toBe('New Moon');
    expect(moonPhase(0, 183).name).toBe('Full Moon');
    expect(moonPhase(0, 45).name).toBe('Waxing Crescent');
    expect(moonPhase(0, 300).name).toBe('Waning Crescent');
  });
  it('draws nothing lit at new Moon', () => {
    expect(moonLitPath(100, 100, 50, 0, true)).toBe('');
  });
});
