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

/** Wall-clock parts of an instant in a zone. */
export function localParts(utc: Date, zone: string): LocalDateTime & { weekday: number } {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: zone, hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric',
    hour: 'numeric', minute: 'numeric', second: 'numeric', weekday: 'short',
  });
  const p: Record<string, string> = {};
  for (const part of fmt.formatToParts(utc)) p[part.type] = part.value;
  const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(p.weekday);
  return { year: +p.year, month: +p.month, day: +p.day, hour: +p.hour, minute: +p.minute, second: +p.second, weekday };
}

/** "2026-09-26" for the local calendar date of an instant in a zone. */
export function localDateKey(utc: Date, zone: string): string {
  const p = localParts(utc, zone);
  return `${p.year}-${String(p.month).padStart(2, '0')}-${String(p.day).padStart(2, '0')}`;
}

/** The date key one calendar day before `key`. */
export function previousDateKey(key: string): string {
  const [y, m, d] = key.split('-').map(Number);
  const t = new Date(Date.UTC(y, m - 1, d - 1));
  return t.toISOString().slice(0, 10);
}

/** Whole days from date key a to date key b. */
export function daysBetween(a: string, b: string): number {
  const ms = (k: string) => Date.UTC(+k.slice(0, 4), +k.slice(5, 7) - 1, +k.slice(8, 10));
  return Math.round((ms(b) - ms(a)) / 86400000);
}
