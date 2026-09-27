<script lang="ts">
  import type { Place, Profile } from '../store/db';
  import CityPicker from './CityPicker.svelte';

  let { existing, onDone, onCancel }: { existing?: Profile; onDone: (p: Profile) => void; onCancel?: () => void } = $props();

  let date = $state(existing?.birth.date ?? '');
  let time = $state(existing?.birth.time ?? '');
  let birthPlace = $state<Place | undefined>(existing?.birth.place);
  let home = $state<Place | undefined>(existing?.home);
  const ready = $derived(!!date && !!time && !!birthPlace && !!home);

  function submit() {
    if (!ready) return;
    onDone({
      birth: { date, time, place: $state.snapshot(birthPlace)! },
      home: $state.snapshot(home)!,
      createdAt: existing?.createdAt ?? new Date().toISOString(),
    });
  }
</script>

<main>
  <h1 class="serif">Temenos</h1>
  <p class="intro serif">A Plate of prompts each morning and evening, drawn from your chart and today's sky. Read it, then pick up the pen.</p>

  <label><span class="label">Date of birth</span><input type="date" bind:value={date} /></label>
  <label><span class="label">Time of birth, as on the certificate</span><input type="time" bind:value={time} /></label>
  <div class="field"><span class="label">Where you were born</span><CityPicker bind:value={birthPlace} placeholder="Town or city" /></div>
  <div class="field">
    <span class="label">Where you live now</span>
    <CityPicker bind:value={home} placeholder="Town or city" />
    <small>This sets the clock for Dawn and Dusk.</small>
  </div>

  <p class="privacy">All of this stays on this phone. Nothing is sent anywhere.</p>
  <div class="actions">
    {#if onCancel}<button class="pill" onclick={onCancel}>Cancel</button>{/if}
    <button class="pill solid" disabled={!ready} onclick={submit}>{existing ? 'Save' : 'Begin'}</button>
  </div>
</main>

<style>
  h1 { font-weight: 400; font-size: 40px; margin-top: 20px; }
  .intro { font-size: 19px; line-height: 1.5; color: var(--dim); margin: 10px 0 28px; }
  label, .field { display: block; margin-top: 18px; }
  .label { display: block; margin-bottom: 8px; }
  small { display: block; margin-top: 6px; font-size: 13px; color: var(--faint); }
  .privacy { margin-top: 28px; font-size: 13px; color: var(--dim); }
  .actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 18px; }
</style>
