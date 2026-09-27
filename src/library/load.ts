// The library, bundled into the app at build time.
import { type Library, buildLibrary } from '.';

const files = import.meta.glob('/library/**/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

export const library: Library = buildLibrary(
  Object.fromEntries(Object.entries(files).filter(([p]) => !p.endsWith('README.md'))),
);
