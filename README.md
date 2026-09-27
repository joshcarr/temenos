# Temenos

A personal web app that draws a fresh Plate of journaling prompts each morning and evening from a birth chart, today's sky, myth and a cast of archetypal voices. The answers go on paper.

The brief is in `docs/temenos-build-brief.md`, the research behind it in `docs/research.md`, and the reasoning behind each design choice in `DECISIONS.md`.

## Status

M1 is built: the installable, offline Plate with all eleven figures, 308 anchor re-cuts, 30 myths and nine voices. Next is M2 (the voices, through the API).

## Development

Node 22 or later.

```sh
npm install
npm run dev       # the app at http://localhost:5173
npm test          # ephemeris, houses, library and Plate rules
npm run typecheck
npm run check     # Svelte components
npm run build     # production build in dist/
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

## Deploying to Cloudflare Pages

One-time setup:

1. In the Cloudflare dashboard, go to **Workers & Pages → Create → Pages → Connect to Git** and pick `joshcarr/temenos`.
2. Production branch: `main`. Framework preset: **None**. Build command: `npm run build`. Build output directory: `dist`.
3. Save and deploy. The site appears at `https://temenos.pages.dev` (or a similar name Cloudflare assigns).

Every push to `main` deploys. Other branches get preview URLs.

## Installing on the iPhone

Open the site in Safari, tap **Share → Add to Home Screen**, then open Temenos from the home screen and go through onboarding once. Draw one Plate while online so everything is cached; after that it works in airplane mode.

## Layout

```
docs/          brief, research, M1 proposal
library/       everything the Plate says, as hand-editable markdown (see library/README.md)
src/astro/     ephemeris engine, time zones, Moon phase, aspects, seasons
src/plate/     Plate composition, selection and anti-staleness rules, seeded randomness
src/image/     the image grammar: sky → forms, colours and the walking line
src/ui/        Svelte screens
src/store/     IndexedDB: profile, settings, Plates
scripts/       asset preparation, chart printer, accuracy measurement
tests/         vitest suites; tests/reference holds the independent calculations
```
