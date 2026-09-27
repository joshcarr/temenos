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

All inside the 1′ bar. The planet gaps are astronomy-engine's own error: it truncates VSOP87, while Swiss Ephemeris follows JPL DE431 to milliarcseconds.

**Result against astro.com (your natal chart, 26 Sept 2026).** All eleven figures, Chiron included, match to the arcsecond: 0″ gap on every one. The Ascendant, MC and cusps 2, 3, 11 and 12 match within 20″, and astro.com only prints cusps to the whole arcminute, so that's rounding on their side. The local-time conversion produced the same Universal Time astro.com shows. M0 is done.

---

## M1-1. Front end: Vite + TypeScript + Svelte 5

Approved 26 Sept 2026. The full rationale is in `docs/m1-proposal.md`. In short, Svelte's built-in `draw` transition walks an SVG line along its own length, which is the draw ritual, and the runtime compiles down to a few kilobytes. Preact would have meant hand-rolling the animation; plain web components meant more code for six screens.

## M1-2. Name: Temenos

Kept. It names what the app is for: an enclosure where the inner work happens.

## M1-3. Two places: birthplace for the chart, home for the clock

**Problem.** You were born in Princeton and live in Portland. The natal chart must be cast for Princeton, but Dawn, Dusk, "today" and "Yesterday's Dusk" all run on Portland time.

**Effect on you.** At 10pm in Portland the app still shows Dusk for the right date, not tomorrow's Dawn on Eastern time. The Moon phase and sign in the header are for your evening, not New Jersey's.

**Why.** Onboarding asks for birthplace once and home once, both picked from the same bundled city list. The home zone is used for every clock decision; the birthplace only for the natal chart. Rejected: using the phone's current time zone. It would shift Plates while you travel, which is arguably right, so the phone's zone can override home later if you want that.

Dawn is before 2pm and Dusk after 5pm, as the brief says. Between 2 and 5pm the app offers whichever you haven't drawn today, and Dusk if you've drawn neither.

## M1-4. Birth place from a bundled city list

**Problem.** Coordinates and time zones are easy to get wrong and hard to notice when wrong.

**Effect on you.** You type "Princeton" or "Portland" and pick from a short list. It works offline.

**Why.** A list of about 25,000 cities with population over 15,000 (GeoNames, CC BY 4.0) carries coordinates and IANA zone names, is around 1 MB, and is only loaded during onboarding. Rejected: an online geocoder (breaks offline, sends your birthplace to a third party) and typing coordinates (you asked not to).

## M1-5. The page mark sits directly under the image

**Problem.** The page mark is the first thing you copy onto paper, but in the mockup it came after the reading, the prompts and the myth.

**Effect on you.** Draw the Plate, copy the mark while the image is on screen, then read down.

**Why.** It belongs next to the image it comes from. Your call, from the mockup review.

## M1-6. Prompts built from each figure's images and myths, after the hand-written ones

**Problem.** Wild cards must never repeat, and nothing else may repeat inside 30 days. At two Plates a day that's about 730 wild cards a year, and a long season can bring the same figure up every other session. No hand-written pool lasts.

**Effect on you.** You see the hand-written prompts first. Only when a figure's pool for the month is spent do you meet lines like "A plumb line is the answer. Write the question," built from that figure's own images and myths. They stay in the figure's world rather than going generic.

**Why.** Ten templates across each figure's eight images give 80 wild cards per figure, 880 in all, before M2's voices start writing new ones. Rejected: allowing wild cards to repeat after a year (the brief says never), and waiting for M2 (the offline Plate has to stand on its own). A test draws two months of Plates twice a day and checks every rule.

## M1-7. "Did it land?" ships now, not in M4

**Problem.** Weighting from landed marks is M4, but it can only weigh what was recorded.

**Effect on you.** From the first morning, opening the app asks about the last Plate, one tap per prompt, skippable. It never asks about a Plate drawn in the last four hours, since you may still be writing.

**Why.** It costs one small screen, and by M4 there will be weeks of your own marks to learn from instead of none. The weighting code is already in and already gentle: landed marks raise a family, figure, voice or lens by a quarter; unmarked ones lower it a little; nothing goes below 40% of normal.

## M1-8. Hosting on Cloudflare Pages from the git repo

**Problem.** The app has to reach your phone, update itself when I push, and keep working offline.

**Effect on you.** One-time setup in the Cloudflare dashboard. After that every push deploys, and the installed app picks up the new version the next time you open it.

**Why.** It's what the brief names, it's free at this size, and M2's `/api/plate` function will live in the same project. The build fetches nothing at runtime: the ephemeris, fonts and library are all bundled and precached (about 3 MB, once).

## M1-9. A tenth voice: the Nun at the Edge of the Sea

**Problem.** The council leaned masculine (two of nine voices drew on women, neither a teacher of practice), and nobody taught staying with discomfort in the body, without a story. The Grief Walker works with endings, not the moment-to-moment urge to escape.

**Effect on you.** About one Plate in seven now arrives in her voice, most often on Saturn, Chiron, the Moon, Pluto and Neptune days. Her readings end in a small practice: pause before the reaction, feel the heat without the story, breathe in the hurt and out some ease. She can be pinned in Settings, since every figure has a reading in her voice.

**Why.** Voices are content, so this cost no code: one persona sheet, eleven readings and eleven affinity weights. She is written in the spirit of Pema Chödrön and the Tibetan tradition she teaches in. Like the others, she is not Chödrön, never claims to be, and never quotes her books, which are in copyright. Rejected: a voice only for M2 (she'd never appear offline) and readings for a few figures only (she couldn't be pinned).

## M1-10. Balancing the council

**Problem.** Offline, a voice can only speak where a figure has a reading in it. The Grief Walker and the Mountain Hand had two readings each, so over six simulated months they led 1% and 3% of Plates, while the Tavern Mystic led 22%.

**Effect on you.** You'll meet every voice regularly. Each of the original nine now has six readings spread across different figures and lenses; the Nun has eleven so she can be pinned. In the same simulation every voice now leads between 5% and 18% of Plates.

**Why.** Twenty-one new readings, each placed where the voice fits the figure (the Grief Walker on the Sun's setting and the sea's losses, the Mountain Hand on Chiron's trail injury and Uranus's split snag). Rejected: forcing an even split in code. Affinity weights and your "did it land?" marks should keep shaping who speaks, and your real seasons will shift the mix more than any tuning against a made-up chart.
