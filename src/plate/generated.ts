// Prompts built from a figure's own images and myths, used once the hand-written
// pools for the last 30 days (or, for wild cards, ever) are spent.
// Wild cards never repeat, and at two Plates a day no written pool lasts a year.

import type { FigureEntry, Tagged } from '../library/parse';

/** "A plumb line. A drystone wall." → ["a plumb line", "a drystone wall"] */
export function imageList(fig: FigureEntry): string[] {
  return fig.images
    .split(/\.\s+|\.$/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => s[0].toLowerCase() + s.slice(1));
}

const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

const WILD_TEMPLATES: ((image: string, fig: FigureEntry, epithet: string) => string)[] = [
  (i) => `${cap(i)} has been left on your doorstep. Write the note that came with it.`,
  (i) => `Draw ${i} with your eyes closed. What did your hand get right?`,
  (i) => `${cap(i)} is the answer. Write the question.`,
  (i) => `Give ${i} a voice and let it complain about you for three lines.`,
  (i) => `Hide ${i} somewhere inside a sentence about your week.`,
  (i) => `If "${i}" were a verb, what would it mean? Use it three times.`,
  (i, _f, e) => `${cap(e)} leaves ${i} on your pillow. What's it for?`,
  (i) => `Trade one worry for ${i}. Describe the exchange.`,
  (i) => `Write a four-line poem in which ${i} is the only thing that stays still.`,
  (i) => `What would ${i} say about the way you spend your mornings?`,
];

export function generatedWildcards(fig: FigureEntry): Tagged[] {
  const out: Tagged[] = [];
  const images = imageList(fig);
  WILD_TEMPLATES.forEach((t, ti) => images.forEach((img, ii) => {
    const epithet = fig.epithets[(ti + ii) % fig.epithets.length];
    out.push({ text: t(img, fig, epithet), lens: 'trickster' });
  }));
  return out;
}

export function generatedFigurePrompts(fig: FigureEntry): Tagged[] {
  const out: Tagged[] = [];
  for (const m of fig.myths) {
    const story = m.line.replace(/\.$/, '');
    out.push({ text: `${story} (${m.culture}). Which figure in that story are you closest to this week?`, lens: 'imaginal' });
    out.push({ text: `${story}. Where does this story touch your life right now, even a little?`, lens: 'synchronicity' });
    out.push({ text: `Retell this in three lines, set in your kitchen: ${story[0].toLowerCase() + story.slice(1)}.`, lens: 'trickster' });
  }
  for (const img of imageList(fig)) {
    out.push({ text: `Place ${img} on the table in front of you. What does it want from you?`, lens: 'imaginal' });
    out.push({ text: `Where has there been something like ${img} in your life lately?`, lens: 'synchronicity' });
    out.push({ text: `Describe your mood as if it were ${img}. Be exact.`, lens: 'trickster' });
  }
  return out;
}
