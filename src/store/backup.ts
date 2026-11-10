// A backup is everything on the phone, as one JSON file the user keeps.
import type { PlateSettings } from '../plate/compose';
import type { Plate } from '../plate/types';
import type { Profile } from './db';

export interface Backup {
  app: 'temenos';
  version: 1;
  exportedAt: string;
  profile?: Profile;
  settings?: PlateSettings;
  plates: Plate[];
}

export function makeBackup(data: { profile?: Profile; settings?: PlateSettings; plates: Plate[] }, now = new Date()): Backup {
  const plates = [...data.plates].sort((a, b) => (a.drawnAt < b.drawnAt ? -1 : a.drawnAt > b.drawnAt ? 1 : 0));
  return { app: 'temenos', version: 1, exportedAt: now.toISOString(), profile: data.profile, settings: data.settings, plates };
}

export const backupFileName = (b: Backup) => `temenos-backup-${b.exportedAt.slice(0, 10)}.json`;

/** Read a backup file, or throw an error whose message can be shown as is. */
export function parseBackup(text: string): Backup {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("That file isn't a Temenos backup.");
  }
  const b = data as Partial<Backup>;
  if (!b || typeof b !== 'object' || b.app !== 'temenos') throw new Error("That file isn't a Temenos backup.");
  if (b.version !== 1) throw new Error('That backup comes from a newer version of Temenos. Update the app and try again.');
  if (!Array.isArray(b.plates) || !b.plates.every((p) => p && typeof p.id === 'string' && typeof p.dateKey === 'string' && typeof p.drawnAt === 'string'))
    throw new Error('That backup is damaged: its Plates are unreadable.');
  return b as Backup;
}

/**
 * Plates to write when restoring. A Plate already on the phone stays, unless only
 * the backup's copy carries "did it land?" marks.
 */
export function platesToRestore(local: Plate[], backup: Plate[]): Plate[] {
  const have = new Map(local.map((p) => [p.id, p]));
  return backup.filter((p) => {
    const mine = have.get(p.id);
    return !mine || (!mine.landedAsked && !!p.landedAsked);
  });
}
