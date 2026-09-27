<script lang="ts">
  import type { Plate } from '../plate/types';
  import PlateImage from './PlateImage.svelte';

  let { plate, label, onDone }: { plate: Plate; label: string; onDone: (landed: boolean[]) => void } = $props();
  let marks = $state(plate.prompts.map(() => false));
</script>

<section class="landed">
  <div class="head">
    <div class="thumb"><PlateImage spec={plate.image} uid="landed" /></div>
    <div>
      <div class="label">{label}</div>
      <h2 class="serif">Did it land?</h2>
      <p>Tap any prompt that opened something.</p>
    </div>
  </div>
  {#each plate.prompts as p, i}
    <button class="row" class:on={marks[i]} aria-pressed={marks[i]} onclick={() => (marks[i] = !marks[i])}>
      <span class="box">{marks[i] ? '✓' : ''}</span>
      <span class="serif">{p.text}</span>
    </button>
  {/each}
  <div class="actions">
    <button class="pill" onclick={() => onDone(plate.prompts.map(() => false))}>Skip</button>
    <button class="pill solid" onclick={() => onDone($state.snapshot(marks))}>Done</button>
  </div>
</section>

<style>
  .landed { margin-top: 18px; }
  .head { display: flex; gap: 14px; align-items: center; margin-bottom: 12px; }
  .thumb { width: 84px; flex: none; }
  h2 { font-weight: 400; font-size: 24px; margin-top: 2px; }
  .head p { font-size: 13px; color: var(--dim); margin-top: 2px; }
  .row { display: flex; gap: 12px; width: 100%; text-align: left; padding: 14px 0; border-bottom: 1px solid var(--rule); font-size: 17px; line-height: 1.35; align-items: flex-start; }
  .box { flex: none; width: 22px; height: 22px; border: 1.5px solid var(--dim); border-radius: 4px; display: grid; place-items: center; font-size: 14px; margin-top: 1px; }
  .row.on .box { background: var(--fg); color: var(--bg); border-color: var(--fg); }
  .row:not(.on) .serif { color: var(--dim); }
  .actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 18px; }
</style>
