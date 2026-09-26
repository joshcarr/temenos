# Decisions

Each entry answers Greever's three questions: what problem it solves, how it affects you (phone in hand, notebook open), and why it beats the alternatives.

---

## M0-1. Chart engine: Swiss Ephemeris compiled to WebAssembly

**Problem.** The Plate needs accurate positions for eleven figures (Sun through Pluto plus Chiron) and Placidus houses, computed on the phone with no network.

**Effect on you.** Your chart and today's sky come from the same engine and data files astro.com uses, so a position you look up there will match what the Plate is built from. The engine plus its ephemeris files is a 2.7 MB download, fetched once and cached by the service worker. After that it works in airplane mode.

**Why this one.** We use the `swisseph-wasm` package (Swiss Ephemeris 2.10.03). It bundles `sepl_18`, `semo_18` and `seas_18`, the planet, Moon and asteroid files for 1800–2400 AD, so Chiron works with no extra plumbing.

Rejected:
- *astronomy-engine plus hand-written houses plus a separate Chiron source.* Its planets drift up to about 20″ from Swiss Ephemeris (measured, see M0-4), which is fine, but Chiron would need its own orbital model, and Chiron's orbit is perturbed enough by Saturn that fixed elements go stale within years. Two engines to keep in agreement for no gain. We still use astronomy-engine, as an independent check in the tests.
- *`@swisseph/browser`.* Smaller, but it ships no `.se1` data files, so Chiron would mean fetching and mounting them ourselves.
- *`sweph-wasm`.* A 110 MB package. Too heavy for a home-screen app.

**Licence.** Swiss Ephemeris is AGPL-3.0 (the wrapper is GPL-3.0-or-later). That's fine for a personal app nobody else uses. The AGPL's network clause means that if the app is ever offered to other people, its source has to be offered to them too, or you buy Astrodienst's professional licence (CHF 700 at time of writing). Keeping the repo is enough to comply for now.

## M0-2. Tropical zodiac, Placidus houses, apparent geocentric positions

**Problem.** "Matches astro.com" only means something if we compute the same thing astro.com shows by default.

**Effect on you.** Your chart here looks like the chart you already know from astro.com.

**Why.** These are astro.com's defaults and the conventions of the psychological-astrology lineage in the research report (Greene, Tarnas). Whole Sign and sidereal remain one-line changes in `castChart` if you ever want a toggle. Placidus breaks down above the Arctic Circle; if that ever matters we fall back to Porphyry.

## M0-3. Birth time → UTC through the IANA time-zone database

**Problem.** A birth certificate records local clock time. Historical offsets (wartime, double summer time, local mean time before standard time) are the most common source of wrong charts.

**Effect on you.** You enter the time as written on the certificate and the place. You never have to work out an offset yourself.

**Why.** The browser's `Intl` API carries the full tz database, including Britain's 1944 double summer time (tested). It's built in, so it costs nothing to ship. For the rare case where a source records a time the database disagrees with, the birth record takes an explicit `offsetMinutes` override. Rejected: a bundled tz library (duplicates what the platform already has) and asking you for a UTC offset (easy to get wrong, and the error is silent).

## M0-4. How the math is verified

**Problem.** The M0 bar is 1′ for planets and a few arcminutes for house cusps against astro.com. This build container can't reach astro.com or JPL Horizons, so the final comparison needs your numbers.

**Effect on you.** One copy-paste from astro.com into a local file, then `npm run chart` prints both charts side by side with the gap on every line.

**Why.** Three checks run without the network, each independent of how we call the engine:

| Check | Reference | Worst gap |
|---|---|---|
| Sun, Meeus example 25.b | Published textbook value | under 3″ |
| Moon, Meeus example 47.a | Published textbook value | under 15″ (Meeus's series is truncated) |
| Sidereal time, Meeus example 12.a | Published textbook value | under 0.05 s |
| Sun–Pluto, 400 charts 1900–2050 | astronomy-engine (MIT, separate theory) | Moon 28″, Venus 20″, rest ≤ 18″ |
| Asc, MC, all 12 Placidus cusps, 400 charts, latitudes −60° to 64° | Hand-written Placidus from first principles | 0.6″ |

All inside the 1′ bar. The planet gaps are astronomy-engine's own error: it truncates VSOP87, while Swiss Ephemeris follows JPL DE431 to milliarcseconds. Chiron has no independent source offline, so your astro.com paste is its test.
