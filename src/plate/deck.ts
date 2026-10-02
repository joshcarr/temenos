// Dealing without replacement, rebuilt each time from the history of past Plates,
// so nothing new needs storing. Every card comes round once a cycle (or `copies`
// times) before any card comes round again, and a card dealt in the last `gap`
// draws waits its turn even across a reshuffle.

import type { Rng } from './rng';

export interface DeckOptions<T> {
  copies?: (card: T) => number; // per cycle; default 1
  gap?: number; // how many of the latest draws must pass before a card returns
}

export interface Deck<T> {
  /** Copies of this card still to come this cycle. */
  left(card: T): number;
  /** Dealt within the last `gap` draws. */
  recent(card: T): boolean;
  /** A weighted draw from what's left, as a shuffled deck would deal it. */
  deal(rng: Rng, weight?: (card: T) => number): T;
}

/** `past` is every earlier draw's key, oldest first; keys not in this deck are ignored. */
export function makeDeck<T>(cards: readonly T[], key: (card: T) => string, past: readonly string[], opts: DeckOptions<T> = {}): Deck<T> {
  const copies = (c: T) => Math.max(1, opts.copies?.(c) ?? 1);
  const full = () => new Map(cards.map((c) => [key(c), copies(c)]));
  const drawn = past.filter((k) => cards.some((c) => key(c) === k));
  let left = full();
  for (const k of drawn) {
    left.set(k, left.get(k)! - 1);
    if ([...left.values()].every((n) => n <= 0)) left = full();
  }
  const recentKeys = new Set(opts.gap ? drawn.slice(-opts.gap) : []);
  const leftOf = (c: T) => Math.max(0, left.get(key(c)) ?? 0);
  const recent = (c: T) => recentKeys.has(key(c));

  return {
    left: leftOf,
    recent,
    deal(rng, weight = () => 1) {
      // Fresh and not recent; then anything not recent (the next cycle starts early);
      // then fresh even if recent; then anything.
      const tiers = [
        cards.filter((c) => leftOf(c) > 0 && !recent(c)),
        cards.filter((c) => !recent(c)),
        cards.filter((c) => leftOf(c) > 0),
        [...cards],
      ];
      for (const tier of tiers) {
        const w = (c: T) => Math.max(1, leftOf(c)) * Math.max(0, weight(c));
        if (tier.some((c) => w(c) > 0)) return rng.weighted(tier, w);
      }
      return rng.pick(cards);
    },
  };
}
