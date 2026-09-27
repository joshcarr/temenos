// Seeded randomness, so a Plate is reproducible from its seed.

/** FNV-1a hash of a string to a 32-bit seed. */
export function hashSeed(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

export interface Rng {
  next(): number; // [0, 1)
  range(min: number, max: number): number;
  pick<T>(items: readonly T[]): T;
  weighted<T>(items: readonly T[], weight: (t: T) => number): T;
  fork(label: string): Rng;
}

/** mulberry32: small, fast, good enough for choosing prompts and wobbling lines. */
export function makeRng(seed: string | number): Rng {
  const base = typeof seed === 'number' ? seed : hashSeed(seed);
  let a = base;
  const next = () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const rng: Rng = {
    next,
    range: (min, max) => min + next() * (max - min),
    pick: (items) => items[Math.floor(next() * items.length)],
    weighted(items, weight) {
      const ws = items.map((i) => Math.max(0, weight(i)));
      const total = ws.reduce((s, w) => s + w, 0);
      if (total <= 0) return items[Math.floor(next() * items.length)];
      let r = next() * total;
      for (let i = 0; i < items.length; i++) {
        r -= ws[i];
        if (r < 0) return items[i];
      }
      return items[items.length - 1];
    },
    // Independent streams per decision, so adding a new choice later doesn't
    // reshuffle every earlier one.
    fork: (label) => makeRng(hashSeed(`${base}:${label}`)),
  };
  return rng;
}
