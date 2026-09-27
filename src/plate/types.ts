import type { Figure, Sign } from '../astro/ephemeris';
import type { AspectId, NatalPoint, PhaseName } from '../astro/sky';
import type { ImageSpec } from '../image/grammar';
import type { Lens } from '../library/parse';

export type Session = 'dawn' | 'dusk' | 'yesterdays-dusk';
export type PromptKind = 'threshold' | 'anchor' | 'figure' | 'wild';

export interface PlatePrompt {
  kind: PromptKind;
  text: string;
  family?: string; // anchor family id
}

export interface PlateSky {
  utc: string;
  moon: { phase: PhaseName; sign: Sign; illumination: number; waxing: boolean };
  bodies: { figure: Figure; lon: number; speed: number; sign: Sign }[];
}

export interface PlateSeason {
  name: string;
  mover: Figure;
  point: NatalPoint;
  type: AspectId;
}

export interface Plate {
  id: string; // `${dateKey}:${session}`
  dateKey: string; // local calendar date the Plate belongs to
  session: Session;
  drawnAt: string;
  redraws: number;
  seed: string;
  sky: PlateSky;
  season?: PlateSeason;
  figure: string; // library id, e.g. 'saturn'
  epithet: string;
  lens: Lens;
  voice: string;
  skyLine: string;
  reading: string;
  prompts: PlatePrompt[];
  fallow: false | 'one-prompt' | 'copy-image';
  myth?: string;
  image: ImageSpec;
  landed?: boolean[]; // one per prompt, set by "did it land?"
  landedAsked?: boolean;
}
