import {
  type AnchorFamily, type FigureEntry, type Myth, type SignEntry, type Voice,
  parseAnchors, parseFigure, parseMyth, parseSigns, parseVoices,
} from './parse';

export interface Library {
  figures: Record<string, FigureEntry>;
  anchors: { dawn: AnchorFamily[]; dusk: AnchorFamily[] };
  myths: Record<string, Myth>;
  voices: Record<string, Voice>;
  signs: Record<string, SignEntry>;
}

/** Builds the library from raw files keyed by their path under /library. */
export function buildLibrary(files: Record<string, string>): Library {
  const lib: Library = { figures: {}, anchors: { dawn: [], dusk: [] }, myths: {}, voices: {}, signs: {} };
  for (const [path, src] of Object.entries(files)) {
    const p = path.replace(/^.*library\//, '');
    if (p.startsWith('figures/')) {
      const f = parseFigure(src);
      lib.figures[f.id] = f;
    } else if (p === 'anchors/dawn.md') lib.anchors.dawn = parseAnchors(src, 'dawn');
    else if (p === 'anchors/dusk.md') lib.anchors.dusk = parseAnchors(src, 'dusk');
    else if (p.startsWith('myths/')) {
      const m = parseMyth(src);
      lib.myths[m.id] = m;
    } else if (p === 'voices.md') for (const v of parseVoices(src)) lib.voices[v.id] = v;
    else if (p === 'signs.md') for (const s of parseSigns(src)) lib.signs[s.id] = s;
  }
  return lib;
}
