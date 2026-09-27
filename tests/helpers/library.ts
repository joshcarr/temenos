import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { buildLibrary } from '../../src/library';

const root = new URL('../../library/', import.meta.url).pathname;

function walk(dir: string, out: Record<string, string> = {}): Record<string, string> {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (name.endsWith('.md') && name !== 'README.md') out[`library/${p.slice(root.length)}`] = readFileSync(p, 'utf8');
  }
  return out;
}

export const loadLibrary = () => buildLibrary(walk(root));
