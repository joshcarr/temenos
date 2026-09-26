# Temenos

A personal web app that draws a fresh Plate of journaling prompts each morning and evening from a birth chart, today's sky, myth and a cast of archetypal voices. The answers go on paper.

The brief is in `docs/temenos-build-brief.md`, the research behind it in `docs/research.md`, and the reasoning behind each design choice in `DECISIONS.md`.

## Status

M0 (chart math) is done: the natal chart matches astro.com to the arcsecond for all eleven figures. Next is M1, pending review of `docs/m1-proposal.md`.

## Development

Node 22 or later.

```sh
npm install
npm test          # ephemeris, houses and time-zone tests
npm run typecheck
npm run measure   # worst-case gap against the independent references, over 400 charts
```

### Checking a chart against astro.com

1. Create `birth.local.json` in the repo root (gitignored, never committed):

   ```json
   { "date": "1980-03-14", "time": "06:45", "zone": "Europe/London",
     "lat": 51.5074, "lon": -0.1278, "place": "London" }
   ```

   `zone` is an IANA time-zone name. Longitude is negative west of Greenwich.

2. Optionally create `astrocom.local.json` with the positions astro.com shows (Extended Chart Selection → chart drawing and data):

   ```json
   { "Sun": "23°Pis41'02\"", "Moon": "5 Leo 12'40", "ASC": "18cp03", "MC": "27°Sco55'" }
   ```

3. `npm run chart` prints the chart in astro.com notation, with the gap in arcseconds next to anything you pasted.

## Layout

```
docs/        brief and research
src/astro/   ephemeris engine wrapper, time zones, notation
tests/       vitest suites; tests/reference holds the independent calculations
scripts/     chart printer and accuracy measurement
```
