// Converting a local civil birth time to UTC.
//
// Birth data is entered the way it's written on a birth certificate: a local
// date, a local clock time, and a place. The place gives us an IANA time zone,
// and Intl knows that zone's historical offsets (including wartime and
// double-summer time), so we don't hand-maintain any tables.

export interface LocalDateTime {
  year: number;
  month: number; // 1-12
  day: number;
  hour: number;
  minute: number;
  second?: number;
}

/** Offset of `zone` from UTC at the instant `utcMs`, in minutes (east positive). */
export function zoneOffsetMinutes(zone: string, utcMs: number): number {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: zone,
    hourCycle: 'h23',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  });
  const parts: Record<string, number> = {};
  for (const p of fmt.formatToParts(new Date(utcMs))) {
    if (p.type !== 'literal') parts[p.type] = Number(p.value);
  }
  const asUtc = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
  return Math.round((asUtc - Math.floor(utcMs / 1000) * 1000) / 60000);
}

/**
 * Local wall-clock time in `zone` → UTC Date.
 * Pass `offsetMinutes` to override the zone (e.g. when a chart source records
 * local mean time or a known offset the tz database disagrees with).
 */
export function localToUtc(local: LocalDateTime, zone: string, offsetMinutes?: number): Date {
  const naive = Date.UTC(local.year, local.month - 1, local.day, local.hour, local.minute, local.second ?? 0);
  if (offsetMinutes !== undefined) return new Date(naive - offsetMinutes * 60000);
  // Two passes settle the offset, including near DST transitions.
  let guess = naive;
  for (let i = 0; i < 3; i++) guess = naive - zoneOffsetMinutes(zone, guess) * 60000;
  return new Date(guess);
}
