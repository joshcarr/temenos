import { describe, expect, it } from 'vitest';
import { castChart, engine, FIGURES } from '../src/astro/ephemeris';
import { arcminDiff } from '../src/astro/format';
import { localToUtc } from '../src/astro/time';
import { refLongitude, refPlacidus } from './reference/independent';

const within = (actual: number, expected: number, arcmin: number) =>
  expect(Math.abs(arcminDiff(actual, expected))).toBeLessThan(arcmin);

describe('Swiss Ephemeris against published textbook values (Meeus, Astronomical Algorithms)', () => {
  it('Sun, example 25.b: 1992 Oct 13 0h TD, apparent λ = 199°54′21.818″', async () => {
    const swe = await engine();
    const { longitude: lon } = swe.calc(2448908.5, swe.SE_SUN, swe.SEFLG_SWIEPH);
    within(lon, 199 + 54 / 60 + 21.818 / 3600, 0.05); // 3 arcseconds
  });

  it('Moon, example 47.a: 1992 Apr 12 0h TD, apparent λ = 133.167265°', async () => {
    const swe = await engine();
    const { longitude: lon } = swe.calc(2448724.5, swe.SE_MOON, swe.SEFLG_SWIEPH);
    within(lon, 133.167265, 0.25); // Meeus's truncated lunar series is good to ~10″
  });

  it('apparent sidereal time, example 12.a: 1987 Apr 10 0h UT = 13h10m46.1351s', async () => {
    const swe = await engine();
    const hours = swe.sidtime(2446895.5);
    expect(Math.abs(hours - (13 + 10 / 60 + 46.1351 / 3600)) * 3600).toBeLessThan(0.05); // seconds of time
  });
});

describe('planets against an independent engine (astronomy-engine)', () => {
  const dates = [
    '1901-03-04T05:06:00Z', '1938-11-20T22:15:00Z', '1955-07-01T12:00:00Z', '1969-07-20T20:17:00Z',
    '1977-01-15T08:30:00Z', '1984-09-09T03:45:00Z', '1999-08-11T11:03:00Z', '2012-12-21T11:11:00Z',
    '2026-09-26T07:00:00Z', '2049-05-05T18:00:00Z',
  ];
  for (const iso of dates) {
    it(`agrees within 1′ at ${iso}`, async () => {
      const utc = new Date(iso);
      const chart = await castChart(utc);
      for (const b of chart.bodies) {
        if (b.figure === 'Chiron') continue;
        // Moon tolerance is 1′ too; astronomy-engine's lunar model is the loosest of the two.
        within(b.lon, refLongitude(b.figure, utc), 1);
      }
    });
  }

  it('returns all eleven figures including Chiron', async () => {
    const chart = await castChart(new Date('2000-01-01T12:00:00Z'));
    expect(chart.bodies.map((b) => b.figure)).toEqual([...FIGURES]);
    const chiron = chart.bodies.find((b) => b.figure === 'Chiron')!;
    // Chiron was in early Sagittarius at the start of 2000.
    expect(chiron.sign).toBe('Sagittarius');
  });
});

describe('Placidus houses against a hand-worked calculation', () => {
  const places = [
    { name: 'London', lat: 51.5074, lon: -0.1278 },
    { name: 'New York', lat: 40.7128, lon: -74.006 },
    { name: 'Sydney', lat: -33.8688, lon: 151.2093 },
    { name: 'Quito', lat: -0.1807, lon: -78.4678 },
    { name: 'Reykjavik', lat: 64.1466, lon: -21.9426 },
  ];
  const times = ['1962-02-14T03:20:00Z', '1979-06-30T17:45:00Z', '1994-10-02T09:05:00Z', '2026-09-26T21:40:00Z'];
  for (const p of places) {
    for (const iso of times) {
      it(`${p.name} at ${iso}`, async () => {
        const utc = new Date(iso);
        const chart = await castChart(utc, p);
        const ref = refPlacidus(utc, p.lat, p.lon);
        const h = chart.houses!;
        within(h.armc, ref.armc, 0.05);
        within(h.asc, ref.asc, 0.1);
        within(h.mc, ref.mc, 0.1);
        for (let c = 1; c <= 12; c++) within(h.cusps[c], ref.cusps[c], 0.1);
      });
    }
  }
});

describe('local birth time to UTC', () => {
  it('London in British Summer Time', () => {
    expect(localToUtc({ year: 1985, month: 7, day: 4, hour: 14, minute: 30 }, 'Europe/London').toISOString())
      .toBe('1985-07-04T13:30:00.000Z');
  });
  it('London during British Double Summer Time (1944)', () => {
    expect(localToUtc({ year: 1944, month: 6, day: 6, hour: 6, minute: 30 }, 'Europe/London').toISOString())
      .toBe('1944-06-06T04:30:00.000Z');
  });
  it('New York in winter', () => {
    expect(localToUtc({ year: 1975, month: 1, day: 10, hour: 23, minute: 5 }, 'America/New_York').toISOString())
      .toBe('1975-01-11T04:05:00.000Z');
  });
  it('Sydney in daylight time (southern summer)', () => {
    expect(localToUtc({ year: 1990, month: 12, day: 25, hour: 9, minute: 0 }, 'Australia/Sydney').toISOString())
      .toBe('1990-12-24T22:00:00.000Z');
  });
  it('explicit offset overrides the zone', () => {
    expect(localToUtc({ year: 1900, month: 1, day: 1, hour: 12, minute: 0 }, 'UTC', -300).toISOString())
      .toBe('1900-01-01T17:00:00.000Z');
  });
});

describe('reading and writing astro.com notation', () => {
  it('round-trips', async () => {
    const { formatLon, parseLon } = await import('../src/astro/format');
    for (const lon of [0, 13.5104, 283.5102, 359.99]) within(parseLon(formatLon(lon)), lon, 0.02);
    within(parseLon('13 Capricorn 30\'37'), 283.5103, 0.02);
    within(parseLon('2cp33'), 272.55, 0.01);
  });
});
