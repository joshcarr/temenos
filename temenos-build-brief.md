# Build Brief: Temenos (working name)

A personal, playful web app that gives me a fresh set of journaling prompts each morning and evening, drawn from my birth chart, today's sky, myth, and a cast of archetypal voices. I write the answers on paper in my own notebook. The app is the thing I read before I pick up the pen.

One user: me. It lives on my iPhone home screen.

Read `docs/research.md` before you start. It's a research report on Jung, psychological astrology and archetypal cosmology, and it's the conceptual source for the ideas here. Where this brief and the report disagree, this brief wins.

---

## 1. Why this exists

I kept a morning and evening journaling practice with two fixed sets of prompts (listed in section 4). They were good prompts, but they went stale. I started skipping the mornings and doing the evening prompts the next day. Too often the evening pages turned into a recap of what happened rather than reflection on it.

This app fixes that by giving me a different small set of prompts every session, shaped by a daily "figure" from the sky and delivered with a short reading, an image and a myth. It should feel a little like drawing a card: a moment of surprise that shakes me out of the rut. It isn't tarot and it isn't fortune telling. It never predicts anything.

The chart and the sky are a symbol set for imagination, in the spirit of Jung's active imagination and Hillman's idea of returning "a mess in the human to a myth in the gods."

"Temenos" is the Greek word Jung used for a sacred enclosure, the protected space where psychic work happens. It's a placeholder; suggest others if one strikes you.

## 2. How to explain your decisions to me

When you propose or justify a design decision, use Tom Greever's framework from *Articulating Design Decisions*. For each meaningful choice, answer:

1. What problem does this solve?
2. How does it affect me, the user? (Usually: on my phone, notebook open, early morning or late evening, sometimes the next morning looking back at yesterday.)
3. Why is this the best solution, and what did you consider and reject?

Keep them short. Log them in `DECISIONS.md`.

## 3. The core loop: the daily Plate

Each session produces one **Plate**, named after the teaching plates in Paul Klee's notebooks and Blake's illuminated plates. The Plate is what I read before writing.

### Dawn or Dusk

- The app defaults to **Dawn** before 2pm and **Dusk** after 5pm, with a toggle to switch.
- In the morning there's also **Yesterday's Dusk**: the evening prompts reframed for looking back after a night's sleep. I often journal the evening this way, and the app should treat it as a normal, respected mode, not a missed one. Its prompts use past-day framing and include things like "What looks different about yesterday now that you've slept on it?"

### What's on a Plate

In this order, top to bottom:

1. **The header.** Date, Dawn or Dusk, Moon phase and sign, and the name of any active season (a slow transit touching my chart).
2. **The image.** A generative figure composed from today's sky (see section 9). It draws itself when the Plate is revealed.
3. **The figure of the day.** One planetary figure, chosen by the selection rules in section 5, with its epithet (e.g. *Saturn, the Stonemason*).
4. **The reading.** 80 to 150 words in one of the voices (section 7), through the current lens (section 6). It connects the figure to today's sky and to one myth, and it ends by turning toward the page.
5. **The prompts.** Four, never more:
   - **Threshold.** A short standing opener. Dawn always starts with the dream: "What did you dream? If nothing, what image were you holding as you woke?" Dusk starts with something like "One word for the day" or "What was the weather inside you today?"
   - **Anchor.** One of my original prompt families (section 4), re-cut through today's figure.
   - **Figure.** A prompt that comes from the figure, its myth or the active season.
   - **Wild card.** An odd, surprising or koan-like question in the voice. This is the one that shakes me up.
6. **The myth thread.** A pointer to one myth ("Inanna's descent", "Philemon and Baucis") that I can tap to read in a short retelling of 300 to 500 words.
7. **The page mark.** A small glyph for me to copy by hand at the top of my notebook page: the figure's planetary symbol, the Moon phase, and one simple mark taken from the day's image. It links the paper page back to the Plate.

### The draw ritual

- I tap to draw. The Plate composes itself: the line walks, colors settle, text arrives as if written.
- **One redraw per session.** "The sky allows one refusal." After that, the Plate stands.
- Nothing to type. No text entry anywhere in the core loop.

### Did it land?

The next time I open the app, before drawing, it shows yesterday's (or the last) Plate for a moment and asks which prompts landed, with one tap per prompt. I can skip it. This is the reflective-depth signal (section 10) and it feeds the anti-staleness weighting.

## 4. My original prompts, and how they get re-cut

These are the prompts I used. They're the **anchor families**. Keep their spirit, rotate them, and re-cut them through the day's figure so they never read the same way twice. The examples show the kind of change I want; write many more.

The dusk rule: **ask for the image, the figure, the feeling or the pattern, not the chronology.** Every dusk prompt should resist becoming "list what happened."

### Dawn

| Original | Kin figures | Example re-cuts |
|---|---|---|
| What did I dream? | Moon, Neptune | (Standing threshold.) "Pick one object from a dream and let it speak for three lines." |
| Three things I'm grateful for | Venus, Jupiter | "Three things you're grateful for, and one thing you love that you've never thanked." / "What's beautiful in this room that you'd stopped seeing?" |
| Looking forward to | Jupiter | "What door today would you like to open a crack?" |
| What under my control would make today incredible? | Mars, Saturn | "The Stonemason's question: what's one thing today that's yours to shape, and what will you let the weather have?" |
| If I lived more consciously / freely / courageously I would: | Uranus, Mars | "If the part of you that wants to break the pattern got one hour today, what would it do?" |
| I am | Sun | "Finish 'I am' three times: as yourself, as today's figure, as an animal." |
| Most important thing to focus on | Mars, Saturn | "The Stonemason sets one stone a day. Which stone?" |

### Dusk

| Original | Kin figures | Example re-cuts |
|---|---|---|
| Three wins | Sun, Mars | "Three wins, and which inner figure earned each one." |
| One thing I learned | Mercury, Jupiter | "What did today teach you that you didn't ask to learn?" |
| Favorite thing of my day | Venus | "Where did delight find you today, and did you let it in?" |
| Short story of a moment today | Mercury, Moon | "Tell one moment as a fable in three sentences, starting 'Once...'. Who was the helper?" |
| One thing I could have done to make today better, and how can I apply it tomorrow? | Saturn, Chiron | "Where did you miss the mark, and what would a kind elder say about it?" |
| Am I resisting something? What? | Saturn, Pluto | "Is something being resisted? Draw it as a creature. What does it guard?" |
| What could I do tomorrow that is high leverage (high upside, low downside)? | Jupiter | "What small act tomorrow would the Tavern Mystic buy a round for?" |

## 5. Selection and anti-staleness

This is the heart of the app. The whole reason it exists is that fixed prompts went stale.

**Choosing the figure of the day.** A weighted random pick from:
- planets in an active season (the strongest weight);
- the traditional ruler of the day of the week (Sunday Sun, Monday Moon, Tuesday Mars, Wednesday Mercury, Thursday Jupiter, Friday Venus, Saturday Saturn), as a light seasoning;
- the Moon's current sign ruler;
- a random draw from all eleven figures (Sun through Pluto, plus Chiron) so anyone can show up.

Avoid the same figure three days running unless an active season is driving it. Continuity within a season is a thread, not staleness.

**Choosing the anchor.** Rotate through the seven families for Dawn or Dusk so each comes round about weekly. Never the same anchor family two sessions running. Prefer families whose kin figures match today's figure.

**Rules against repetition.**
- No exact prompt repeats within 30 days.
- Wild cards never repeat.
- "Landed" marks gently raise the weight of that family, figure, voice and lens. Unmarked or skipped prompts lower weight a little, but never to zero.
- About once every week or two, draw a **fallow Plate**: just the image, the reading and one prompt, or the instruction "write nothing today; copy the image into your notebook." Surprise is part of the medicine.

## 6. Lenses

A setting that changes how the Plate frames the relation between sky and psyche. The chart stays the same.

| Lens | Stance | Sample framing |
|---|---|---|
| **Synchronicity** | Jung and Tarnas. The sky and the psyche rhyme, meaningfully but not causally. | "Saturn is crossing your Moon. What in you is being asked to grow up?" |
| **Imaginal** | Hillman. The planets are figures in the psyche; the sky is only a way of naming them. | "The Old King has come to visit the Child. What does he bring her?" |
| **Trickster** | Mercurius. It's a game of chance and symbol, and the play is the point. | "The dice came up Saturn and Moon. Make something of it." |

I can pin a lens, or set it to "let the day choose."

## 7. The voices

The reading on each Plate is spoken by one voice. These are original characters inspired by particular writers and thinkers. They are *not* those people and never claim to be. They never quote copyrighted work (Oliver, Ginsberg, Snyder and modern Hafiz translations are all in copyright). Blake is public domain, but even he should speak in new lines. Write each voice's persona so they stay consistent and clearly distinct.

**The Elders**

- **The Old Man at the Lake** (in the spirit of Jung). Swiss, carves stone, keeps a tower by the water. Takes images more seriously than explanations; asks what the figure wants, not what it means. Comfortable with paradox, occasionally gruff, laughs at himself. Reaches for alchemy and dreams.
- **The Mythographer** (in the spirit of Joseph Campbell). A generous teacher who can't hear a story without remembering three others from other continents. Points to thresholds and helpers. Doesn't force everything into a hero's journey.
- **The Fairy-Tale Reader** (in the spirit of Marie-Louise von Franz and Fraser Boa). Dry, practical, impatient with spiritual fluff. Reads the day as a fairy tale and asks which character I'm being. Always wants to know the dream.
- **The Grief Walker** (in the spirit of Stephen Jenkinson). Unhurried, oratorical, a bit ornery. Treats grief as a skill of love and endings as teachers. Handles death as a subject with dignity, never as a prediction.

**The Poets**

- **The Engraver** (in the spirit of William Blake). Visionary, fierce, speaks in contraries and aphorisms. Gives the planet a mythic name and a body.
- **The Howler** (in the spirit of Allen Ginsberg). Breathless catalogues, candid, funny, holy about ordinary things.
- **The Mountain Hand** (in the spirit of Gary Snyder). Plain words, backcountry, work with the hands, Zen. Brings the planet down to a trail, a woodpile, a tool.
- **The Pond Walker** (in the spirit of Mary Oliver). Attention as prayer. Small creatures, morning walks. Gentle, then asks the one question that isn't gentle at all.
- **The Tavern Mystic** (in the spirit of Hafiz). Playful, teasing, drunk on the divine. Treats the ego as a lovable fool.

By default the voice is "let the sky choose," with a figure-to-voice affinity table you write (the Grief Walker for Pluto, the Mountain Hand for Saturn, the Tavern Mystic for Jupiter, and so on), plus some randomness. I can pin a voice.

### Rules for every generated word

- This is a reflective practice for Josh, not a reading of his fate.
- Never predict events, outcomes, health, death, relationships or money.
- Never tell him who he is or what to do. Offer images, myths and questions.
- No flattery, no "you are special," no chosen-one talk.
- Write original lines. Never quote copyrighted poems or books.
- Dusk prompts ask for image, figure, feeling or pattern, not a recap.
- Keep it short. The reading is a doorway, not an essay.

## 8. The library

Write our own. No licensed text. Draw on public-domain myth from many cultures and credit the culture each myth comes from. Store everything as structured data (JSON or markdown with frontmatter) in its own folder so I can edit it by hand.

- **Figures (11):** Sun through Pluto, plus Chiron. For each: name and epithets, core, gift, shadow, Jungian echo, myths from several cultures, images, and a pool of figure prompts and wild cards for each lens.
- **Anchor re-cuts:** for each of the 14 anchor families, a pool of re-cut prompts keyed by figure and lens.
- **Signs (12), houses (12), major aspects (5):** short, image-rich descriptions used to flavor readings and the image.
- **Myths:** retellings of 300 to 500 words each, in plain vivid prose, with the culture of origin named. Start with around 30.
- **Long weather:** see section 11.

Here's the tone I want, for Saturn:

> **Saturn: the Old King, the Stonemason**
> **Core:** Limit, form, time. The weight that makes a thing real.
> **Gift:** Patience, craft, authority you earned, the bones of a life.
> **Shadow:** The inner critic. Fear dressed as prudence. The wall built too early.
> **Jungian echo:** The senex. Liz Greene's Saturn as the place the shadow is most defended. Lead, the alchemical *prima materia*.
> **Myths:** Kronos swallowing his children for fear of being replaced (Greek). The Saturnalia, when the old king's golden age returned for a week and masters served their servants (Roman). The *nigredo*, the blackening where the work begins (alchemical).
> **A figure prompt (Imaginal):** If the stern one in you kept a workshop, what would be on the bench?
> **A wild card (Trickster):** Name one rule you follow that nobody gave you. Break it on paper.

Draft Saturn, Moon and Mercury in full (including anchor re-cuts), show me, and we'll tune the voice before you write the rest.

## 9. Visual direction

Draw on three wells without copying any single one:

- **Paul Klee's notebooks** (*The Thinking Eye*, *The Nature of Nature*, the *Pedagogical Sketchbook*). Taking a line for a walk; active and passive lines; arrows as force and direction; growth diagrams; rhythm grids; hand-drawn, a little wobbly, alive. This is the spirit of the drawing.
- **Black Mountain College.** Josef Albers's lesson that color is relative, the same color changes on a different ground; Anni Albers's weaving, grid and thread; Buckminster Fuller's geodesic geometry and the sphere subdivided into triangles.
- **Bauhaus.** Primary forms and primary colors (Kandinsky's 1923 questionnaire paired the triangle with yellow, the square with red and the circle with blue), an honest grid, geometric sans type, asymmetric layouts.

Keep the warmth of a paper field notebook underneath: warm off-white paper by day, a deep ink ground at night, pencil-and-gouache texture rather than glossy gradients.

Take principles and generative rules from these artists. Don't reproduce their specific works.

### The generative Plate image

The image should be a visual fingerprint of the day, built from the sky by rules you design. A starting grammar:
- **Element → form.** Fire: triangle. Earth: square. Water: circle. Air: Klee's arrow or a walking line.
- **Figure → color.** Give each planet a color, and let them interact the way Albers taught: nested fields where each color shifts the one it sits on.
- **Aspect → relation.** Conjunction overlaps. Opposition faces across an axis. Square meets at a right angle under tension. Trine nests. Sextile sits adjacent.
- **Moon phase → ground.** The ground tone and how much of the form is lit.
- **The line.** A single Klee line that walks through the figures, tracing the day's figure and its season.

Same date and time of day always produce the same image. Keep it simple enough to copy roughly by hand, since the page mark comes from it.

### The Mandala

A secondary screen: my natal chart as a Klee-and-Fuller mandala. Planets as the element forms above, aspects as drawn lines and arrows, the outer ring subdivided geodesically. Tap a figure to read its card from the library. It's for browsing and wonder; the Plate is the main event.

### The Sky

Another secondary screen: my active seasons (slow transits to my chart) drawn as woven bands across a timeline, in the manner of Anni Albers, with start, peak and end dates. Plus the long weather below it.

### Type and motion

A geometric sans for headings and UI (e.g. Jost), and a warm serif for the reading (e.g. Newsreader or Source Serif). Motion is slow and hand-made: the line walks, forms settle, text arrives as if written. Respect `prefers-reduced-motion`.

## 10. Reflective depth

This is the one measure of success.

- The "did it land?" tap from section 3, one per prompt, asked the next time I open the app.
- A quiet **Archive** screen: past Plates in a grid of their images. Tap one to see its prompts and which landed.
- A simple look-back: which families, figures, voices and lenses land most often for me.
- No streaks, badges, reminders or notifications. The app never nudges me to come back.

## 11. The long weather

Shown on the Sky screen, and occasionally woven into a reading. The outer-planet mutual aspects in effect now, computed from the ephemeris, and our place in the precession of the ages.

Be poetic and creative, and hold both grief and wonder:
- No apocalypse, no golden age about to arrive, no chosen generation.
- The ages are very slow seasons. Jung dated the Aquarian dawn anywhere from 2000 to 2200 depending on where you start counting; treat that uncertainty as a gift. We live in a long dusk that is also a long dawn.
- An outer-planet aspect is a mood in the weather of the world, not a cause of events.
- A sentence or two for each current aspect, and one short paragraph on the age.

## 12. Build path

Stop at the end of each milestone, deploy, and tell me what to try on my phone.

**M0: Chart math spike (do this first, half a day).**
Choose and verify the calculation approach before any UI. Options:
- A Swiss Ephemeris WASM build. Most accurate, includes Chiron. AGPL is fine for a personal, undistributed app; note it in `DECISIONS.md`.
- `astronomy-engine` (MIT) plus hand-written Ascendant/MC/Placidus math and a separate source for Chiron.

Done when: a test with my birth data (I'll provide date, time and place) matches astro.com to within 1 arcminute for planets and a few arcminutes for house cusps.

**M1: Shell and the offline Plate.**
- Installable PWA: web manifest, `apple-touch-icon`, `display: standalone`, iOS safe areas, service worker so everything works offline.
- One-time onboarding with birth data.
- The full Plate from the library alone, with no AI: figure selection, anchor rotation, prompts, myth thread, page mark, the generative image, Dawn / Dusk / Yesterday's Dusk, one redraw.
- Library drafts for Saturn, Moon and Mercury, reviewed with me first; then the rest.

Done when: I can draw a Plate every morning and evening on my phone, offline, and the prompts don't repeat. **This is the first version I'll actually use.**

**M2: The voices.**
- A Cloudflare Pages Function at `/api/plate` that calls the Anthropic Messages API with a current Claude Sonnet model. The key lives as a Cloudflare secret. Protect the endpoint with a passphrase entered once, or put the site behind Cloudflare Access; tell me which and why.
- The app sends: today's figure, lens, voice, the chosen library prompts, the relevant chart excerpt, active seasons, and the last 30 days of prompts (so it can avoid echoing them). The model returns JSON: the reading, the four prompts rewritten in voice, and a myth pick from the library.
- If the network fails, fall back quietly to the offline Plate.

Done when: Plates arrive in distinct voices through each lens, and still work in airplane mode.

**M3: The Sky and seasons.**
- Transit engine for Jupiter through Pluto plus Chiron, in major aspects to my Sun, Moon, Mercury, Venus, Mars, Ascendant and MC, with start, exact and end dates.
- Seasons feed figure selection and the Plate header.
- The Sky screen with woven season bands and the long weather.

**M4: Mandala, Archive and depth.**
- The Mandala screen and library cards.
- "Did it land?", the Archive grid, the look-back, and weighting from landed marks.
- Export and import: all Plates as markdown with YAML frontmatter (Obsidian-friendly), plus a JSON backup.
- A tiny "note to the builder" button anywhere in the app that saves an idea to a list, included in exports.

**Then stop.** I'll live with it for a few weeks before we build more.

## 13. Technical notes

- **Hosting:** Cloudflare Pages for the static app, a Pages Function for the API.
- **Front end:** Light and static. Vite + TypeScript, with plain web components or a small framework like Preact or Svelte. Justify the choice with the three questions in section 2.
- **Storage:** IndexedDB for Plate history, landed marks and settings. Birth data stays on the device; only the per-Plate context in M2 goes to the API.
- **Determinism:** seed randomness from date + Dawn/Dusk + redraw count, so a Plate is reproducible and the Archive can re-render it exactly.
- **iOS:** test as an installed home-screen app, not only in Safari. Check safe areas, status bar, and that storage survives restarts. Nudge me to export occasionally and gently.
- **Repo:** `README.md` with dev and deploy steps, `DECISIONS.md`, and the library in its own folder.

## 14. Parking lot

Don't build these yet, and don't paint us into a corner:

- **The Council:** a live conversation with the day's figure in its voice, for days I want to go deeper than the page.
- Photographing my notebook page and attaching it to the Plate.
- A printable monthly booklet of Plates, for pasting into the notebook.
- A Jungian typology reflection compared against the chart's element balance.
- Progressions and returns as longer life chapters.
- A "mantic moment" mode that casts the sky for right now when I bring a question, the way Jung treated the I Ching.
- Guided active-imagination audio.

## 15. Your first task

1. Read `docs/research.md` and this brief.
2. Ask me for my birth date, time and place.
3. Do M0. Report your calculation approach with the three-question rationale and the test results against astro.com.
4. Propose the file structure, the stack for M1, and a first sketch of the Plate image grammar before writing UI code.
