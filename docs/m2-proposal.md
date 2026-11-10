# M2 proposal: the voices

For review before any function code. Once agreed, each decision moves into `DECISIONS.md`.

## What 19 days taught us

You use every part of the Plate and none of it stands out from the rest, so M2 shouldn't change the structure. Since the deck change, repeats have mostly gone. The oblique prompts are the ones that surprise you. The Tavern Mystic and the Howler sit right on the line between character and costume, and they work because they come up between quieter voices. The Mountain Hand is a favourite. Nothing has crossed a line.

Your real rhythm is Yesterday's Dusk followed straight away by Dawn, in one morning sitting. The Dusk habit hasn't formed, and the app won't push it (the brief rules out nudges). M2 should make that two-Plate morning work well.

One thing to watch: a model playing the Tavern Mystic or the Howler will lean harder into their tics than the hand-written readings do. Their persona sheets get a line about restraint before the audition.

## The decisions

### M2-1. Back up first

**Problem.** Nineteen days of Plates and landed marks exist only in IndexedDB on your phone. M2 adds fields to every Plate, and iOS sometimes clears storage for home-screen apps.

**Effect on you.** A "Back up" button in Settings saves a JSON file to Files or AirDrop. It also gives me your landed marks to tune against.

**Why.** It's a small job, and the M4 Obsidian export can build on it later. Rejected: waiting for M4. The data matters more now than the export format does.

### M2-2. One passphrase per person, not Cloudflare Access

**Problem.** `/api/plate` spends money on your API key, so a stranger who found the URL shouldn't be able to use it. And it won't only be you: a trusted friend already has the app, and others have asked. With one shared passphrase you couldn't see who is calling, couldn't cut off one person, and if it leaked, you'd have to re-send a new one to everyone.

**Effect on you.** You type your passphrase once in Settings and never see it again. To share voiced Plates with someone, you add their name and a passphrase to the list and send them the passphrase. A friend without one still gets offline Plates, which work well. You can see what each person's calls cost, and remove anyone by deleting their line.

**How.** The function keeps a list of names with hashed passphrases (a Cloudflare secret, or KV if the list grows). Each call is logged with the person's name and its cost, never its content. Each person can make ten calls a day, which covers a daily practice with redraws and stops a leaked passphrase from running up the bill. The monthly spend cap on the key stays as the backstop. A wrong or revoked passphrase gets a 401 that Settings can show.

**Why not Cloudflare Access.** On iOS an app on the home screen keeps its own cookies, separate from Safari. Access's login redirect works badly inside it, and when the login expires, calls start getting a login page back. The app would then quietly fall back to offline Plates, possibly for days before anyone noticed, and that would happen to your friends too. Rejected as well: a single shared passphrase, which costs only an hour less to build and can't do any of the above.

**What changes when other people use it.**

- *Their Plates pass through your accounts.* Their birth data stays on their phone, as yours does, but each voiced Plate's context (chart positions, selections, recent prompts) goes through your Cloudflare function and your API key. Nothing is stored. Tell them that in a sentence when you share it.
- *The licence.* Swiss Ephemeris is AGPL (M0-1), so anyone using the app is entitled to its source. The repo is public, which covers that. If it ever goes private, people using the app need the source some other way.
- *The writing is tuned to you.* Nothing in the code or library uses your name, and the system prompt takes the name from each person's own profile. But affinity weights, and anything we tune from your landed marks, follow your practice. Each friend's marks only adjust their own phone.
- *Where this stops.* This is meant for a handful of trusted friends. More than that is a different product, with accounts, a privacy policy and either a real budget or each person bringing their own key. That belongs in the parking lot.

### M2-3. Voicing starts when you open the app, not when you tap draw

**Problem.** A call takes about 4 to 10 seconds. You'd wait 10 seconds, but you shouldn't have to.

**Effect on you.** Most mornings the text is ready before you tap. On a slow morning the image draws, the line keeps walking (slowly retracing its path) until the words arrive, and the text then appears as if written. After 8 seconds the offline text appears instead. There's no spinner.

**How.** The Plate is chosen on the phone (figure, lens, voice, prompts, myth), and that choice is fixed by its seed and your history, so it's known before you tap. As soon as the "did it land?" screen is answered or skipped, the app composes the Plate it would draw and sends it to be voiced. Before 2pm it voices both Yesterday's Dusk and Dawn, because that's how you use it. If you switch sessions, the voiced text for the other one waits for you. A redraw makes a new call at the moment you tap, since you've used it twice in 19 days.

**Why wait for "did it land?"** Your marks shift the weights, so composing before you answer could voice a different Plate from the one you then draw.

Rejected: calling only on draw (the full wait every time), and voicing the next Plate ahead of time in the background (iOS doesn't run home-screen apps in the background, and history would change in between).

### M2-4. What the model writes

| Part | M2 behaviour |
|---|---|
| Dawn threshold (the dream) | Unchanged. It's the ritual. |
| Dusk and Yesterday's Dusk thresholds | Unchanged. |
| Anchor | Lightly voiced. The family's question must still be recognisable as your original prompt. |
| Figure prompt | Free, in the voice, through the lens. |
| Wild card | Free. This is where the model can do what templates can't. |
| Reading | 80 to 150 words, in the voice, through the lens, toward the myth. |

Yesterday's Dusk framing comes from the model rather than a find-and-replace, which reads more naturally. The find-and-replace stays for offline Plates.

A fallow Plate voices only its reading.

### M2-5. The myth stays dealt, and the model writes toward it

**Problem.** The deck keeps myths from repeating. Now the prompts are voiced too, so they also need to tie back to the myth.

**Effect on you.** The reading names the myth and turns it toward the page. At least one of the figure prompt and the wild card takes an image from the myth. Tapping the myth thread then feels like following the Plate's own thread.

**How.** The model gets the full retelling of the dealt myth, not only its title. A local check confirms that the reading mentions it, and if not, the Plate falls back to offline text.

**A bigger library.** Five myths per figure lasts a long season, but it can wear thin. I'd take every figure to eight (about 33 new retellings), add theme tags to each myth (descent, theft, return, trickery, a vow, a wound), and let the deck prefer myths whose tags match the anchor family. Writing them is library work, separate from the API, and can happen alongside it.

Rejected: letting the model choose the myth. It would drift toward the famous ones and undo what the deck does.

### M2-6. The model knows what lands

**Problem.** The landed marks only nudge weights on the phone. The model writing the prompts never sees them.

**Effect on you.** The request includes a line or two, computed on the phone from your marks, like "lately: image and creature prompts land; gratitude re-cuts less so; the Mountain Hand's prompts land often." The model leans toward what works without copying it.

**Why.** It brings part of M4 forward at almost no cost. The line only appears once enough Plates have been marked, so one week of marks can't over-steer it.

### M2-7. Continuity, lightly

**Problem.** Every Plate stands alone. A thread across days could deepen the practice, but it could also feel like being watched.

**Effect on you.** The model sees your last three Plates (figure, voice, myth, and which prompts landed) and any running season. It may make one callback when it fits, such as "the Stonemason was here two days ago; now Mercury comes to collect the tools," and most Plates won't have one. When you draw Yesterday's Dusk and Dawn together, Dawn knows what Dusk just asked.

**One limit.** The app never sees your notebook, so the model can't know what you wrote. It's told never to claim it does ("you wrote that…", "you've been feeling…"). That rule is what stops continuity from feeling like being watched.

### M2-8. The model's words are saved with the Plate

Today the dice are seeded, so the app could rebuild any past Plate exactly from its date. A model writes something different every time it's asked, so it can't. Instead, the Plate saves the exact words the model wrote, plus which model wrote them. The Archive shows what you actually read that morning. Nothing on screen tells a voiced Plate from an offline one.

### M2-9. Guardrails

- The response is schema-checked JSON (structured outputs), with word counts checked on the phone.
- Wild cards are checked against every wild card you've had. Any repeat or near-repeat is swapped for the offline wild card.
- The rules from the brief (no predictions, no telling you who you are, no flattery, no quoting copyrighted work, Dusk asks for image not chronology) go in the system prompt word for word.
- Any failure (network, timeout, bad JSON, a refusal, a check that fails) gives you the offline Plate quietly.
- Only the Plate's context goes over the wire: chart positions, the selections, recent prompts and the landed summary. Your birth date, time and place stay on the phone.

## Which model

At two or three calls a day, cost hardly matters. Each call sends about 10,000 tokens (persona, figure card, myth, 30 days of prompts) and gets about 600 back.

| Model | Rough cost per call | Per month |
|---|---|---|
| Claude Sonnet 5.5 (the brief's pick) | about 2.5¢ | about $2 |
| Claude Opus 5.5 | about 5¢ | about $4 |
| GLM-5.2 via OpenRouter (strongest open-weight creative writer I found) | about 0.6¢ | about 50¢ |

Prompt caching cuts the Claude figures further, since the persona and rules don't change between calls.

So the question is which model writes the voices best, and that should be decided by reading, not from a leaderboard. Creative-writing benchmarks still put the open-weight models behind the top closed ones, and the leaderboards disagree with each other.

**OpenRouter** is a single API and key that reaches hundreds of models from many providers, billed at each provider's list price plus a fee of about 5.5% when you buy credits. It's the easiest way to try open models. The costs are a second company handling your Plate context, privacy terms that vary by underlying provider, and an extra hop.

**The audition.** It runs in two rounds so the reading stays manageable. In round one, a script composes 8 Plates (a spread of voices and lenses, one fallow, one Yesterday's Dusk) and voices each with six models: Sonnet 5.5, Opus 5.5, OpenAI's and Google's current flagships, GLM-5.2 and Kimi K2.6, all through OpenRouter so one key reaches them. You read them with the model names hidden and keep three. In round two, those three voice 30 Plates, set beside the hand-written reading for the same figure. You pick a model, and we also see whether voiced text beats the library at all. If nothing does, M2 ships as a smaller change. Both rounds together cost a few dollars.

Proposed default if you'd rather skip the audition: Sonnet 5.5, as the brief says. The function sits behind a thin interface, so changing models later means changing one file.

## Build order

1. Backup button (M2-1).
2. Restraint lines for the louder voices, the myth tags, and the audition script. You read the results.
3. The Pages Function: per-person passphrases and daily caps, schema, caching, a spend log per person.
4. Voicing on open, the walking-line loading state, the fallback and saved words.
5. Landed summary and continuity.
6. Myth library to eight per figure, in parallel with steps 3 to 5.

**Done when** Plates arrive in distinct voices through each lens, are usually ready before you tap, tie back to their myth, and still work in airplane mode.

## Questions for you

1. Is the six-model, two-round audition the right size, or would you rather read fewer?
2. What monthly spend cap should the key have? I'd say $10.
3. Should eight myths per figure be the target, or would you rather it grew more slowly, a few at a time as you notice gaps?
