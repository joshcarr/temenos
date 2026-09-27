import { readdirSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { LENSES, parseAnchors, parseFigure, parseFrontmatter } from '../src/library/parse';

const read = (p: string) => readFileSync(new URL(`../library/${p}`, import.meta.url), 'utf8');
const figureFiles = readdirSync(new URL('../library/figures', import.meta.url)).filter((f) => f.endsWith('.md'));

describe('frontmatter', () => {
  it('reads scalars, lists, nested maps and strips comments', () => {
    const { data } = parseFrontmatter('---\nid: x\ncolour: "#abc"   # grey\ntags: [a, b]\nvoices:\n  one: 3\n  two: 1\n---\nbody');
    expect(data).toEqual({ id: 'x', colour: '#abc', tags: ['a', 'b'], voices: { one: 3, two: 1 } });
  });
});

describe.each(figureFiles)('figure %s', (file) => {
  const f = parseFigure(read(`figures/${file}`));
  it('has identity and the four essentials', () => {
    expect(f.id).toBe(file.replace('.md', ''));
    expect(f.epithets.length).toBeGreaterThan(0);
    expect(f.colour).toMatch(/^#[0-9a-f]{6}$/i);
    for (const s of [f.core, f.gift, f.shadow, f.echo]) expect(s.length).toBeGreaterThan(10);
  });
  it('has prompts under every lens, readings and wild cards', () => {
    for (const lens of LENSES) expect(f.prompts[lens].length).toBeGreaterThanOrEqual(3);
    expect(f.readings.length).toBeGreaterThanOrEqual(3);
    for (const r of f.readings) expect(LENSES).toContain(r.lens);
    expect(f.wildcards.length).toBeGreaterThanOrEqual(6);
    expect(f.myths.every((m) => m.id && m.culture)).toBe(true);
  });
  it('keeps readings to a doorway, not an essay', () => {
    for (const r of f.readings) {
      const words = r.text.split(/\s+/).length;
      expect(words, `${f.id} ${r.voice}`).toBeGreaterThanOrEqual(50);
      expect(words, `${f.id} ${r.voice}`).toBeLessThanOrEqual(130);
    }
  });
});

describe.each(['dawn', 'dusk'] as const)('%s anchors', (session) => {
  const fams = parseAnchors(read(`anchors/${session}.md`), session);
  it('has the seven families with originals and kin', () => {
    expect(fams).toHaveLength(7);
    for (const f of fams) {
      expect(f.original.length).toBeGreaterThan(3);
      expect(f.kin.length).toBeGreaterThan(0);
    }
  });
  it('has re-cuts for every figure in the library', () => {
    for (const fam of fams) for (const fig of figureFiles.map((x) => x.replace('.md', ''))) {
      expect(fam.recuts[fig]?.length ?? 0, `${fam.id} × ${fig}`).toBeGreaterThanOrEqual(1);
    }
  });
});

describe('voices and signs', () => {
  it('has all ten voices, and every figure affinity names a real voice', async () => {
    const { loadLibrary } = await import('./helpers/library');
    const lib = loadLibrary();
    expect(Object.keys(lib.voices)).toHaveLength(10);
    for (const v of Object.values(lib.voices)) expect(v.name && v.spirit && v.persona).toBeTruthy();
    for (const f of Object.values(lib.figures)) {
      for (const v of Object.keys(f.voices)) expect(lib.voices[v], `${f.id} → ${v}`).toBeDefined();
      for (const r of f.readings) expect(lib.voices[r.voice], `${f.id} reading → ${r.voice}`).toBeDefined();
    }
    expect(Object.keys(lib.signs)).toHaveLength(12);
  });
});

describe('myths', () => {
  it('are 300–500 word retellings that credit a culture and link to real figures', async () => {
    const { loadLibrary } = await import('./helpers/library');
    const lib = loadLibrary();
    expect(Object.keys(lib.myths).length).toBeGreaterThanOrEqual(30);
    for (const m of Object.values(lib.myths)) {
      const words = m.body.split(/\s+/).length;
      expect(words, m.id).toBeGreaterThanOrEqual(300);
      expect(words, m.id).toBeLessThanOrEqual(500);
      expect(m.culture, m.id).toBeTruthy();
      for (const f of m.figures) expect(lib.figures[f]?.myths.some((x) => x.id === m.id), `${m.id} ↔ ${f}`).toBe(true);
    }
    for (const f of Object.values(lib.figures)) {
      expect(f.myths.filter((x) => lib.myths[x.id]).length, `${f.id} retellings`).toBeGreaterThanOrEqual(2);
    }
  });
});

describe('voice coverage', () => {
  it('every voice with a reading can be pinned: each has an affinity on the figures it reads for', async () => {
    const { loadLibrary } = await import('./helpers/library');
    const lib = loadLibrary();
    for (const f of Object.values(lib.figures)) for (const r of f.readings) {
      expect(f.voices[r.voice], `${f.id} reads in ${r.voice} but gives it no weight`).toBeGreaterThan(0);
    }
  });
});
