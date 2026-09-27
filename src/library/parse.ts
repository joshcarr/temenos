// Parses the hand-editable markdown in /library into typed data.
// The formats are described in library/README.md. The parser is forgiving:
// unknown sections are ignored, so you can add notes to any file.

export const LENSES = ['synchronicity', 'imaginal', 'trickster'] as const;
export type Lens = (typeof LENSES)[number];

export interface Tagged {
  text: string;
  lens?: Lens; // only used under this lens; undefined = any lens
}

export interface FigureEntry {
  id: string;
  name: string;
  glyph: string;
  epithets: string[];
  colour: string;
  voices: Record<string, number>;
  core: string;
  gift: string;
  shadow: string;
  echo: string;
  myths: { id: string; line: string; culture: string }[];
  images: string;
  readings: { voice: string; lens: Lens; text: string }[];
  prompts: Record<Lens, string[]>;
  wildcards: Tagged[];
}

export interface AnchorFamily {
  id: string;
  session: 'dawn' | 'dusk';
  original: string;
  kin: string[];
  recuts: Record<string, Tagged[]>; // figure id → re-cuts
}

export interface Myth {
  id: string;
  title: string;
  culture: string;
  figures: string[];
  body: string;
}

export interface Voice {
  id: string;
  name: string;
  spirit: string;
  group: string;
  persona: string;
}

export interface SignEntry {
  id: string;
  name: string;
  element: 'fire' | 'earth' | 'air' | 'water';
  modality: 'cardinal' | 'fixed' | 'mutable';
  rulers: string[];
  image: string;
}

/** Tiny YAML subset: `key: value`, `key: [a, b]`, one level of nested maps, # comments. */
export function parseFrontmatter(src: string): { data: Record<string, unknown>; body: string } {
  const m = src.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) return { data: {}, body: src };
  const data: Record<string, unknown> = {};
  let nested: Record<string, unknown> | null = null;
  for (const raw of m[1].split('\n')) {
    const line = raw.replace(/\s+#.*$/, '').replace(/^#.*$/, '');
    if (!line.trim()) continue;
    const indented = /^\s+/.test(line);
    const kv = line.trim().match(/^([\w-]+):\s*(.*)$/);
    if (!kv) continue;
    const [, key, rawVal] = kv;
    const val = parseScalar(rawVal);
    if (indented && nested) nested[key] = val;
    else if (rawVal === '') data[key] = nested = {};
    else {
      data[key] = val;
      nested = null;
    }
  }
  return { data, body: src.slice(m[0].length) };
}

function parseScalar(v: string): unknown {
  v = v.trim();
  if (v.startsWith('[') && v.endsWith(']')) {
    return v.slice(1, -1).split(',').map((s) => unquote(s.trim())).filter(Boolean);
  }
  if (/^-?\d+(\.\d+)?$/.test(v)) return Number(v);
  return unquote(v);
}

const unquote = (s: string) => s.replace(/^["'](.*)["']$/, '$1');

interface Section {
  h2: string;
  h3?: string;
  lines: string[];
}

/** Groups body lines under their ## and ### headings. */
function sections(body: string): Section[] {
  const out: Section[] = [];
  let cur: Section | null = null;
  let h2 = '';
  for (const line of body.split('\n')) {
    const two = line.match(/^## (.+)$/);
    const three = line.match(/^### (.+)$/);
    if (two) {
      h2 = two[1].trim();
      cur = { h2, lines: [] };
      out.push(cur);
    } else if (three) {
      cur = { h2, h3: three[1].trim(), lines: [] };
      out.push(cur);
    } else if (cur) cur.lines.push(line);
  }
  return out;
}

const prose = (lines: string[]) => lines.join('\n').trim().replace(/\n{2,}/g, '\n\n');

function bullets(lines: string[]): string[] {
  return lines.filter((l) => /^\s*- /.test(l)).map((l) => l.replace(/^\s*- /, '').trim());
}

function tagged(line: string): Tagged {
  const m = line.match(/^\[(\w+)\]\s*(.*)$/);
  if (m && (LENSES as readonly string[]).includes(m[1])) return { lens: m[1] as Lens, text: m[2] };
  return { text: line };
}

export function parseFigure(src: string): FigureEntry {
  const { data, body } = parseFrontmatter(src);
  const secs = sections(body);
  const get = (h2: string) => prose(secs.find((s) => s.h2 === h2 && !s.h3)?.lines ?? []);
  const prompts = { synchronicity: [], imaginal: [], trickster: [] } as Record<Lens, string[]>;
  const readings: FigureEntry['readings'] = [];
  for (const s of secs) {
    if (s.h2 === 'Figure prompts' && s.h3 && s.h3 in prompts) prompts[s.h3 as Lens] = bullets(s.lines);
    if (s.h2 === 'Readings' && s.h3) {
      const [voice, lens] = s.h3.split('·').map((x) => x.trim());
      readings.push({ voice, lens: lens as Lens, text: prose(s.lines) });
    }
  }
  const myths = bullets(secs.find((s) => s.h2 === 'Myths')?.lines ?? []).map((b) => {
    const m = b.match(/^([\w-]+):\s*(.*?)\s*\(([^)]+)\)\s*$/);
    return m ? { id: m[1], line: m[2], culture: m[3] } : { id: '', line: b, culture: '' };
  });
  return {
    id: String(data.id),
    name: String(data.name),
    glyph: String(data.glyph ?? ''),
    epithets: (data.epithets as string[]) ?? [],
    colour: String(data.colour ?? '#888'),
    voices: (data.voices as Record<string, number>) ?? {},
    core: get('Core'),
    gift: get('Gift'),
    shadow: get('Shadow'),
    echo: get('Jungian echo'),
    myths,
    images: get('Images'),
    readings,
    prompts,
    wildcards: bullets(secs.find((s) => s.h2 === 'Wild cards')?.lines ?? []).map(tagged),
  };
}

export function parseAnchors(src: string, session: 'dawn' | 'dusk'): AnchorFamily[] {
  const fams: AnchorFamily[] = [];
  for (const s of sections(src)) {
    if (!s.h3) {
      const original = s.lines.find((l) => l.startsWith('original:'))?.replace('original:', '').trim() ?? '';
      const kin = (s.lines.find((l) => l.startsWith('kin:'))?.replace('kin:', '') ?? '').split(',').map((k) => k.trim()).filter(Boolean);
      fams.push({ id: s.h2, session, original, kin, recuts: {} });
    } else {
      const fam = fams.find((f) => f.id === s.h2);
      if (fam) fam.recuts[s.h3] = bullets(s.lines).map(tagged);
    }
  }
  return fams;
}

export function parseMyth(src: string): Myth {
  const { data, body } = parseFrontmatter(src);
  const title = body.match(/^# (.+)$/m)?.[1].trim() ?? String(data.title ?? data.id);
  return {
    id: String(data.id),
    title,
    culture: String(data.culture ?? ''),
    figures: (data.figures as string[]) ?? [],
    body: body.replace(/^# .+\n/m, '').trim(),
  };
}

export function parseVoices(src: string): Voice[] {
  return sections(src)
    .filter((s) => s.h3)
    .map((s) => {
      const meta = (k: string) => s.lines.find((l) => l.startsWith(`${k}:`))?.replace(`${k}:`, '').trim() ?? '';
      return {
        id: s.h3!.split('·')[0].trim(),
        name: meta('name'),
        spirit: meta('spirit'),
        group: s.h2,
        persona: prose(s.lines.filter((l) => !/^(name|spirit):/.test(l))),
      };
    });
}

export function parseSigns(src: string): SignEntry[] {
  return sections(src)
    .filter((s) => !s.h3)
    .map((s) => {
      const meta = (k: string) => s.lines.find((l) => l.startsWith(`${k}:`))?.replace(`${k}:`, '').trim() ?? '';
      return {
        id: s.h2.toLowerCase(),
        name: s.h2,
        element: meta('element') as SignEntry['element'],
        modality: meta('modality') as SignEntry['modality'],
        rulers: meta('rulers').split(',').map((r) => r.trim()).filter(Boolean),
        image: meta('image'),
      };
    });
}
