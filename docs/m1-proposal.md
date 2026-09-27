# M1 proposal: structure, stack and the Plate image grammar

For review before any UI code. Once agreed, the stack choice moves into `DECISIONS.md`.

## Stack: Vite + TypeScript + Svelte 5

**Problem.** Six screens (Onboarding, Plate, Archive, Mandala, Sky, Settings), a lot of SVG, and motion that has to feel hand-made: the line walks, forms settle, text arrives.

**Effect on you.** The draw ritual is the part you touch twice a day. It has to start fast on a cold open and animate smoothly on the phone.

**Why Svelte.** Its built-in `draw` transition animates an SVG path along its own length, which is "take the line for a walk" with no animation library. Svelte compiles away, so the shipped runtime is a few kilobytes, and the SVG for the image and mandala lives in the same file as its logic.

Rejected:
- *Preact.* Just as small, but we'd hand-roll every stroke and settle animation or pull in a motion library.
- *Plain web components.* No dependency at all, but six screens of manual re-rendering and shadow-DOM styling is more code for you to read later, for no gain.

## File structure

```
library/                  the hand-editable text, all ours
  figures/saturn.md       frontmatter (epithets, core, gift, shadow, echo, colours, voice affinity)
                          + prompt pools per lens in YAML
  anchors/dawn-*.yaml     one file per anchor family: original prompt, kin figures,
  anchors/dusk-*.yaml       re-cuts keyed by figure and lens
  myths/*.md              300–500 word retellings, culture of origin in frontmatter
  voices/*.md             persona sheets (used by M2's prompt, and to label offline Plates)
  signs.yaml  houses.yaml  aspects.yaml
  long-weather.md
src/
  astro/                  ephemeris, time zones, aspects, Moon phase, (M3) transits
  plate/
    rng.ts                seeded PRNG: date + dawn/dusk + redraw count
    select.ts             figure, anchor, voice, lens, fallow-Plate choice
    weights.ts            anti-staleness and "landed" weighting
    compose.ts            Plate = selections + library text, pure and reproducible
  image/
    grammar.ts            sky → list of shapes, colours, relations, line (pure data)
    PlateImage.svelte     renders the shape list, animates the draw
  store/db.ts             IndexedDB: birth data, Plates, landed marks, settings, notes
  ui/                     screens and small components
functions/api/plate.ts    M2 only: Cloudflare Pages Function
public/                   manifest, icons, service worker
tests/
```

`compose` and `grammar` are pure functions of (chart, sky, seed, history). That's what lets the Archive re-render any past Plate exactly, and it lets M2 swap in voiced text without touching selection.

## The Plate image grammar, first sketch

A square card. Everything below comes from the sky at the Plate's moment, plus a seed for the small wobbles.

**Ground (Moon phase).** Paper by day, ink at night, then a lit field laid over it whose share of the card follows the Moon's illumination: a sliver at the crescent, the whole field at full. Waxing lights from the right, waning from the left.

**The figure of the day** is the largest form, near a point one-third across (Bauhaus asymmetry rather than dead centre). Its shape comes from the element of the sign it's in: fire a triangle, earth a square, water a circle, air an arrow. Its colour is the planet's own.

**Supporting cast.** The two or three figures making the tightest aspects to the day's figure, drawn smaller in their own element shapes and colours, placed by relation:
- conjunction overlaps it, and the overlap takes a third colour (Albers: the mixture looks different on each ground);
- opposition sits across an axis drawn through the figure;
- square meets it at a right angle, with a short tension hatch at the corner;
- trine nests inside or around it;
- sextile sits beside it, edges touching.

**Colour.** Each planet gets one flat gouache colour: Sun cadmium yellow, Moon pale silver-blue, Mercury slate green, Venus rose madder, Mars vermilion, Jupiter ultramarine, Saturn lead grey-brown, Uranus electric teal, Neptune sea violet, Pluto oxblood, Chiron ochre. Albers-style nesting means a colour is always shown on at least one other colour, never alone on paper.

**The line.** One continuous Klee line enters from the card's edge nearest the Moon's sign position, passes through each figure in order of aspect tightness, loops once around the day's figure, and exits. During an active season it also passes through the season's planet. Its wobble is seeded, so the same Plate always walks the same way. It's the first thing drawn when you tap, and the rest settles after it.

**Texture.** An SVG turbulence filter for paper grain and a slightly uneven fill edge. No gradients.

**The page mark** takes three things: the figure's glyph, the Moon-phase glyph, and the single simplest element of the image (usually the day's figure's shape with the line's entry arrow), drawn at the size of a thumbnail so it's quick to copy.

Kept deliberately to three to five forms and one line, so you can copy it roughly in under a minute.

## Open questions for you

1. The name. "Temenos" works. Two others to consider: *Plate & Pen*, plain and describes the ritual; *Hortus*, the enclosed garden, a softer cousin of temenos.
2. Birth place in onboarding: type coordinates, or pick from a bundled list of about 25,000 cities (around 1 MB, works offline)? I'd bundle the list.
