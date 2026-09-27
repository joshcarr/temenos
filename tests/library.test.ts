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
