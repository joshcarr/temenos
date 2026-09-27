import { describe, expect, it } from 'vitest';
import { castChart } from '../src/astro/ephemeris';
import { moonPhase } from '../src/astro/sky';
import { localParts, localToUtc } from '../src/astro/time';
import { moonLitPath } from '../src/image/grammar';
import { DAWN_THRESHOLD, composePlate, defaultSession, yesterdayFraming } from '../src/plate/compose';
import type { Plate, Session } from '../src/plate/types';
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
