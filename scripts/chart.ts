// Prints a natal chart in astro.com's notation so the two can be compared by eye.
// If astrocom.local.json exists (positions copied from astro.com), prints the gaps too.
//
//   npm run chart                  uses birth.local.json
//   npm run chart -- other.json
//
// birth.local.json (gitignored):
//   { "date": "1975-01-10", "time": "23:05", "zone": "America/New_York",
//     "lat": 40.7128, "lon": -74.006, "place": "New York, NY" }
// Add "offsetMinutes": -300 to override the zone's offset.

import { existsSync, readFileSync } from 'node:fs';
import { castChart } from '../src/astro/ephemeris';
import { arcminDiff, formatLon, parseLon } from '../src/astro/format';
import { localToUtc } from '../src/astro/time';

const file = process.argv[2] ?? 'birth.local.json';
const birth = JSON.parse(readFileSync(file, 'utf8'));
const [year, month, day] = birth.date.split('-').map(Number);
const [hour, minute, second = 0] = birth.time.split(':').map(Number);
const utc = localToUtc({ year, month, day, hour, minute, second }, birth.zone, birth.offsetMinutes);
const chart = await castChart(utc, { lat: birth.lat, lon: birth.lon });
const astro: Record<string, string> = existsSync('astrocom.local.json')
  ? JSON.parse(readFileSync('astrocom.local.json', 'utf8'))
  : {};

console.log(`${birth.place ?? ''}  ${birth.date} ${birth.time} ${birth.zone} → ${utc.toISOString()} UT`);
console.log(`lat ${birth.lat}  lon ${birth.lon}  Placidus\n`);

const row = (name: string, lon: number, extra = '') => {
  let gap = '';
  if (astro[name]) {
    const d = arcminDiff(lon, parseLon(astro[name]));
    gap = `   astro.com ${astro[name].padEnd(12)} Δ ${(d * 60).toFixed(0).padStart(4)}″ ${Math.abs(d) <= 1 ? '✓' : '✗'}`;
  }
  console.log(`${name.padEnd(8)} ${formatLon(lon)}${extra}${gap}`);
};

for (const b of chart.bodies) row(b.figure, b.lon, `${b.speed < 0 ? ' R' : '  '}  h${String(b.house).padEnd(2)}`);
console.log('');
const h = chart.houses!;
row('ASC', h.asc);
row('MC', h.mc);
for (const c of [2, 3, 11, 12]) row(`House ${c}`, h.cusps[c]);
