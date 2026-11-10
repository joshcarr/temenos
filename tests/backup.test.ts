import { describe, expect, it } from 'vitest';
import { backupFileName, makeBackup, parseBackup, platesToRestore } from '../src/store/backup';
import type { Plate } from '../src/plate/types';

const plate = (id: string, drawnAt: string, extra: Partial<Plate> = {}) =>
  ({ id, dateKey: id.slice(0, 10), session: 'dawn', drawnAt, ...extra }) as Plate;

describe('backup', () => {
  it('round-trips through JSON, oldest Plate first', () => {
    const b = makeBackup({ plates: [plate('2026-11-02:dawn', '2026-11-02T15:00:00Z'), plate('2026-11-01:dawn', '2026-11-01T15:00:00Z')] }, new Date('2026-11-10T16:00:00Z'));
    expect(backupFileName(b)).toBe('temenos-backup-2026-11-10.json');
    const back = parseBackup(JSON.stringify(b));
    expect(back.plates.map((p) => p.id)).toEqual(['2026-11-01:dawn', '2026-11-02:dawn']);
  });

  it('refuses files that are not backups', () => {
    expect(() => parseBackup('not json')).toThrow("isn't a Temenos backup");
    expect(() => parseBackup('{"app":"other"}')).toThrow("isn't a Temenos backup");
    expect(() => parseBackup('{"app":"temenos","version":2,"plates":[]}')).toThrow('newer version');
    expect(() => parseBackup('{"app":"temenos","version":1,"plates":[{"id":1}]}')).toThrow('damaged');
  });

  it('adds missing Plates and keeps the ones already on the phone', () => {
    const local = [plate('a', '1'), plate('b', '2', { landedAsked: true, landed: [true] })];
    const backup = [plate('a', '1', { landedAsked: true }), plate('b', '2', { landedAsked: true, landed: [false] }), plate('c', '3')];
    // 'a' gains the marks only the backup has; 'b' keeps its own marks; 'c' is new.
    expect(platesToRestore(local, backup).map((p) => p.id)).toEqual(['a', 'c']);
  });
});
