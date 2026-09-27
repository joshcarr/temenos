<script lang="ts">
  import { LENSES, type Voice } from '../library/parse';
  import type { PlateSettings } from '../plate/compose';

  let { settings, voices, onChange, onEditProfile, onBack }: {
    settings: PlateSettings; voices: Record<string, Voice>;
    onChange: (s: PlateSettings) => void; onEditProfile: () => void; onBack: () => void;
  } = $props();

  const lensInfo: Record<string, string> = {
    synchronicity: 'The sky and the psyche rhyme, meaningfully but not causally.',
    imaginal: 'The planets are figures in the psyche; the sky only names them.',
    trickster: 'A game of chance and symbol. The play is the point.',
  };
  const groups = $derived(Object.values(voices).reduce<Record<string, Voice[]>>((g, v) => ((g[v.group] ??= []).push(v), g), {}));
</script>

<main>
  <button class="back" onclick={onBack}>← Back</button>

  <h2 class="label">Lens</h2>
  <div class="opts">
    <button class:on={settings.lens === 'auto'} onclick={() => onChange({ ...settings, lens: 'auto' })}>Let the day choose</button>
    {#each LENSES as l}
      <button class:on={settings.lens === l} onclick={() => onChange({ ...settings, lens: l })}>
        <b>{l[0].toUpperCase() + l.slice(1)}</b><span>{lensInfo[l]}</span>
      </button>
    {/each}
  </div>

  <h2 class="label">Voice</h2>
  <div class="opts">
    <button class:on={settings.voice === 'auto'} onclick={() => onChange({ ...settings, voice: 'auto' })}>Let the sky choose</button>
    {#each Object.entries(groups) as [group, vs]}
      <div class="group">{group}</div>
      {#each vs as v}
        <button class:on={settings.voice === v.id} onclick={() => onChange({ ...settings, voice: v.id })}>
          <b>{v.name}</b><span>In the spirit of {v.spirit}</span>
        </button>
      {/each}
    {/each}
  </div>

  <h2 class="label">You</h2>
  <div class="opts"><button onclick={onEditProfile}>Change birth details or home</button></div>

  <h2 class="label">What is this, really?</h2>
  <p class="about serif">
    Temenos uses your chart and the sky as a symbol set for imagination, in the spirit of Jung's active imagination. It never predicts anything.
    Controlled tests have not found that astrology works as a predictive science, and Jung's own statistical experiment came out at chance.
    He concluded the meaning lay in the meeting of observer and symbol. That's the stance here: images, myths and questions, and the answers are yours.
  </p>
</main>

<style>
  .back { font-size: 14px; color: var(--dim); padding: 6px 0; }
  h2 { margin: 28px 0 10px; }
  .opts { border-top: 1px solid var(--rule); }
  .opts button { width: 100%; text-align: left; padding: 13px 0 13px 28px; border-bottom: 1px solid var(--rule); font-size: 16px; position: relative; }
  .opts button::before { content: ''; position: absolute; left: 2px; top: 17px; width: 12px; height: 12px; border-radius: 50%; border: 1.5px solid var(--dim); }
  .opts button.on::before { background: var(--fg); border-color: var(--fg); }
  .opts b { font-weight: 500; display: block; }
  .opts span { display: block; font-size: 13px; color: var(--dim); margin-top: 2px; }
  .group { font-size: 11px; letter-spacing: .14em; text-transform: uppercase; color: var(--faint); padding: 14px 0 4px; }
  .about { font-size: 16px; line-height: 1.55; color: var(--dim); }
</style>
