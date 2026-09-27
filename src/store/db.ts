// Everything personal stays on the phone, in IndexedDB.
import { type IDBPDatabase, openDB } from 'idb';
import type { PlateSettings } from '../plate/compose';
import type { Plate } from '../plate/types';

export interface Place {
  name: string;
  admin: string;
  country: string;
  lat: number;
  lon: number;
  zone: string;
}

export interface Profile {
  birth: { date: string; time: string; place: Place };
  home: Place;
  createdAt: string;
}

let dbp: Promise<IDBPDatabase> | undefined;
const db = () =>
  (dbp ??= openDB('temenos', 1, {
    upgrade(d) {
      d.createObjectStore('kv');
      d.createObjectStore('plates', { keyPath: 'id' });
    },
  }));

export const getProfile = async () => (await db()).get('kv', 'profile') as Promise<Profile | undefined>;
export const saveProfile = async (p: Profile) => (await db()).put('kv', p, 'profile');

export const DEFAULT_SETTINGS: PlateSettings = { lens: 'auto', voice: 'auto' };
export const getSettings = async () => ({ ...DEFAULT_SETTINGS, ...((await (await db()).get('kv', 'settings')) ?? {}) }) as PlateSettings;
export const saveSettings = async (s: PlateSettings) => (await db()).put('kv', plain(s), 'settings');

export const allPlates = async () => (await db()).getAll('plates') as Promise<Plate[]>;
export const getPlate = async (id: string) => (await db()).get('plates', id) as Promise<Plate | undefined>;
export const savePlate = async (p: Plate) => (await db()).put('plates', JSON.parse(JSON.stringify(p)));

/** Ask the browser not to evict our data (matters on iOS). */
export async function persist() {
  try {
    if (navigator.storage?.persist && !(await navigator.storage.persisted())) await navigator.storage.persist();
  } catch {
    /* not supported */
  }
}

function plain<T>(v: T): T {
  return JSON.parse(JSON.stringify(v));
}
