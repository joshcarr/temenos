import { norm360 } from './ephemeris';

const ABBR = ['Ari', 'Tau', 'Gem', 'Can', 'Leo', 'Vir', 'Lib', 'Sco', 'Sag', 'Cap', 'Aqu', 'Pis'];

/** 283.5104 → "13°Cap30'37"" in the style astro.com prints. */
export function formatLon(lon: number): string {
  let sec = Math.round(norm360(lon) * 3600) % (360 * 3600);
  const sign = Math.floor(sec / (30 * 3600));
  sec -= sign * 30 * 3600;
  const d = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return `${String(d).padStart(2, ' ')}°${ABBR[sign]}${String(m).padStart(2, '0')}'${String(s).padStart(2, '0')}"`;
}

/** Smallest signed difference a − b on the circle, in arcminutes. */
export function arcminDiff(a: number, b: number): number {
  let d = (a - b) % 360;
  if (d > 180) d -= 360;
  if (d < -180) d += 360;
  return d * 60;
}

// Sign names as astro.com and other sites abbreviate them.
const SIGN_KEYS: [number, string[]][] = [
  [0, ['ar', 'ari', 'aries']], [1, ['ta', 'tau', 'taurus']], [2, ['ge', 'gem', 'gemini']],
  [3, ['cn', 'can', 'cancer']], [4, ['le', 'leo']], [5, ['vi', 'vir', 'virgo']],
  [6, ['li', 'lib', 'libra']], [7, ['sc', 'sco', 'scorpio']], [8, ['sa', 'sg', 'sag', 'sagittarius']],
  [9, ['cp', 'cap', 'capricorn']], [10, ['aq', 'aqu', 'aquarius']], [11, ['pi', 'pis', 'pisces']],
];

/** Parses "13°Cap30'37"", "13 Capricorn 30'37", "13cp30". Returns degrees [0, 360). */
export function parseLon(text: string): number {
  const m = text.trim().match(/^(\d{1,2})\s*°?\s*([A-Za-z]+)\s*(\d{1,2})\s*['′]?\s*(\d{1,2}(?:\.\d+)?)?/);
  if (!m) throw new Error(`can't read position "${text}"`);
  const entry = SIGN_KEYS.find(([, keys]) => keys.includes(m[2].toLowerCase()));
  if (!entry) throw new Error(`unknown sign in "${text}"`);
  return entry[0] * 30 + Number(m[1]) + Number(m[3]) / 60 + Number(m[4] ?? 0) / 3600;
}
