<script lang="ts">
  import type { Library } from '../library';
  import type { Plate } from '../plate/types';
  import MoonGlyph from './MoonGlyph.svelte';
  import PageMark from './PageMark.svelte';
  import PlateImage from './PlateImage.svelte';

  let { plate, lib, animate, onRedraw, onMyth }: {
    plate: Plate; lib: Library; animate: boolean; onRedraw: () => void; onMyth: (id: string) => void;
  } = $props();

  const fig = $derived(lib.figures[plate.figure]);
  const voice = $derived(lib.voices[plate.voice]?.name ?? plate.voice.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ').replace(/^(?!The )/, 'The '));
  const myth = $derived(plate.myth ? lib.myths[plate.myth] : undefined);
  const lensName = $derived(plate.lens[0].toUpperCase() + plate.lens.slice(1));
  const kindLabel = { threshold: 'Threshold', anchor: 'Anchor', figure: 'Figure', wild: 'Wild card' } as const;
  const familyOriginal = (id?: string) =>
    [...lib.anchors.dawn, ...lib.anchors.dusk].find((f) => f.id === id && f.session === (plate.session === 'dawn' ? 'dawn' : 'dusk'))?.original;

  // Text arrives after the image has drawn itself.
  const delay = (i: number) => (animate ? `animation-delay: ${2.6 + i * 0.35}s` : 'animation: none');
</script>

<div class="plate" class:animate style="--accent: {fig.colour}">
  <div class="sky">
    <span><MoonGlyph illumination={plate.sky.moon.illumination} waxing={plate.sky.moon.waxing} /> {plate.sky.moon.phase} in {plate.sky.moon.sign}</span>
    {#if plate.season}<span class="season">Season · {plate.season.name}</span>{/if}
  </div>

  <div class="image">
    {#key `${plate.id}:${plate.redraws}`}
      <PlateImage spec={plate.image} {animate} uid={plate.seed.replace(/[^\w]/g, '')} />
    {/key}
  </div>

  <div class="rise" style={delay(0)}>
    <PageMark glyph={fig.glyph} shape={plate.image.mark.shape} illumination={plate.sky.moon.illumination} waxing={plate.sky.moon.waxing} />
  </div>

  <div class="figure rise" style={delay(1)}>
    <h1>{fig.name}, <em>{plate.epithet}</em></h1>
    <div class="skyline">{plate.skyLine}</div>
    <div class="meta">Voice <b>{voice}</b> &nbsp;·&nbsp; Lens <b>{lensName}</b></div>
  </div>

  <p class="reading written" style={delay(2)}>{plate.reading}</p>

  {#if plate.fallow}
    <div class="fallow rise" style={delay(3)}>A fallow Plate. The sky asks for less today.</div>
  {/if}

  <section class="prompts">
    {#each plate.prompts as p, i}
      <div class="prompt rise" class:wild={p.kind === 'wild'} style={delay(3 + i)}>
        <div class="label">
          {kindLabel[p.kind]}
          {#if p.kind === 'anchor' && familyOriginal(p.family)}<i>· {familyOriginal(p.family)}</i>{/if}
        </div>
        <p class="serif">{p.text}</p>
      </div>
    {/each}
  </section>

  {#if myth}
    <button class="myth rise" style={delay(8)} onclick={() => onMyth(myth.id)}>
      <div>
        <div class="t serif">{myth.title}</div>
        <div class="s">{myth.culture} · a {Math.max(1, Math.round(myth.body.split(/\s+/).length / 180))}-minute retelling</div>
      </div>
      <svg width="24" height="24" viewBox="0 0 24 24"><path d="M4 12 H19 M13 6 L19 12 L13 18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" /></svg>
    </button>
  {/if}

  <div class="redraw rise" style={delay(9)}>
    {#if plate.redraws === 0}
      <button class="pill" onclick={onRedraw}>Redraw</button>
      <small class="serif">The sky allows one refusal.</small>
    {:else}
      <small class="serif">This Plate stands.</small>
    {/if}
  </div>
</div>

<style>
  .sky { display: flex; gap: 14px; flex-wrap: wrap; margin-top: 12px; font-size: 13px; }
  .season { color: var(--accent); }
  .image { margin-top: 16px; }
  .figure { margin-top: 22px; }
  h1 { font-weight: 500; font-size: 28px; line-height: 1.15; }
  h1 em { font-family: var(--serif); font-weight: 400; color: color-mix(in oklab, var(--accent) 72%, var(--fg)); }
  .skyline { margin-top: 6px; font-family: var(--serif); font-style: italic; font-size: 15px; color: var(--dim); }
  .meta { margin-top: 8px; font-size: 12px; letter-spacing: .1em; text-transform: uppercase; color: var(--dim); }
  .meta b { font-weight: 500; color: var(--fg); }
  .reading { margin-top: 16px; font-family: var(--serif); font-size: 18.5px; line-height: 1.55; }
  .fallow { margin-top: 18px; font-family: var(--serif); font-style: italic; color: var(--dim); }
  .prompts { margin-top: 28px; border-top: 1px solid var(--rule); }
  .prompt { padding: 18px 0; border-bottom: 1px solid var(--rule); }
  .prompt .label i { font-style: normal; text-transform: none; letter-spacing: .02em; color: var(--faint); }
  .prompt p { margin-top: 6px; font-size: 19.5px; line-height: 1.42; }
  .prompt.wild p { font-style: italic; }
  .myth { margin-top: 26px; width: 100%; text-align: left; display: flex; justify-content: space-between; align-items: center; padding: 16px 18px; background: var(--card); border-radius: 4px; }
  .myth .t { font-size: 20px; }
  .myth .s { margin-top: 3px; font-size: 12px; color: var(--dim); letter-spacing: .04em; }
  .redraw { margin-top: 34px; text-align: center; }
  .redraw small { display: block; margin-top: 8px; font-size: 13px; color: var(--faint); font-style: italic; }
  .animate .rise { animation: settle .9s ease-out both; }
  .animate .written { animation: write 2.4s ease-out both; }
</style>
