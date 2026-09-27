// Prepares generated static assets in public/ (gitignored):
//   public/wasm/     the Swiss Ephemeris engine and its ephemeris files
//   public/cities.json  places with population ≥ 5,000 (GeoNames via all-the-cities, CC BY 4.0),
//                       each with its IANA time zone
import { copyFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

mkdirSync('public/wasm', { recursive: true });
for (const f of ['swisseph.wasm', 'swisseph.data']) copyFileSync(`node_modules/swisseph-wasm/wasm/${f}`, `public/wasm/${f}`);

if (!existsSync('public/cities.json')) {
  const cities: { name: string; country: string; adminCode: string; population: number; loc: { coordinates: [number, number] } }[] = require('all-the-cities');
  const tzlookup: (lat: number, lon: number) => string = require('@photostructure/tz-lookup');
  const rows = cities
    .filter((c) => c.population >= 5000)
    .sort((a, b) => b.population - a.population)
    .map((c) => {
      const [lon, lat] = c.loc.coordinates;
      return [c.name, /^[A-Z]{2,3}$/.test(c.adminCode) ? c.adminCode : '', c.country, +lat.toFixed(4), +lon.toFixed(4), tzlookup(lat, lon)];
    });
  writeFileSync('public/cities.json', JSON.stringify(rows));
  console.log(`cities.json: ${rows.length} places`);
}
