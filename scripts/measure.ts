// Prints the worst disagreement between our engine and the independent references.
import { castChart } from '../src/astro/ephemeris';
import { arcminDiff } from '../src/astro/format';
import { refLongitude, refPlacidus } from '../tests/reference/independent';

let worstPlanet = { d: 0, what: '' };
const perBody: Record<string, number> = {};
let worstHouse = { d: 0, what: '' };
const start = Date.UTC(1900, 0, 1), end = Date.UTC(2050, 0, 1);
for (let i = 0; i < 400; i++) {
  const utc = new Date(start + ((end - start) * i) / 400 + i * 3_600_017);
  const lat = -60 + ((i * 37) % 125), lon = -180 + ((i * 53) % 360);
  const chart = await castChart(utc, { lat, lon });
  for (const b of chart.bodies) {
    if (b.figure === 'Chiron') continue;
    const d = Math.abs(arcminDiff(b.lon, refLongitude(b.figure, utc)));
    perBody[b.figure] = Math.max(perBody[b.figure] ?? 0, d * 60);
    if (d > worstPlanet.d) worstPlanet = { d, what: `${b.figure} ${utc.toISOString()}` };
  }
  const ref = refPlacidus(utc, lat, lon);
  for (let c = 1; c <= 12; c++) {
    const d = Math.abs(arcminDiff(chart.houses!.cusps[c], ref.cusps[c]));
    if (d > worstHouse.d) worstHouse = { d, what: `cusp ${c} lat ${lat} ${utc.toISOString()}` };
  }
}
console.log(`400 charts, 1900-2050, latitudes -60..64`);
console.log(`worst planet gap: ${(worstPlanet.d * 60).toFixed(1)}″ (${worstPlanet.what})`);
console.log('per body (″):', Object.entries(perBody).map(([k, v]) => `${k} ${v.toFixed(1)}`).join(', '));
console.log(`worst cusp gap:   ${(worstHouse.d * 60).toFixed(2)}″ (${worstHouse.what})`);
