<script lang="ts">
  import type { Myth } from '../library/parse';
  let { myth, onBack }: { myth: Myth; onBack: () => void } = $props();
</script>

<main>
  <button class="back" onclick={onBack}>← Back to the Plate</button>
  <div class="label" style="margin-top: 24px">{myth.culture}</div>
  <h1 class="serif">{myth.title}</h1>
  {#each myth.body.split(/\n\s*\n/) as para}
    <p class="serif">{para}</p>
  {/each}
  <button class="back end" onclick={onBack}>← Back to the Plate</button>
</main>

<style>
  .back { font-size: 14px; color: var(--dim); padding: 6px 0; }
  .end { margin-top: 28px; }
  h1 { font-weight: 400; font-size: 32px; line-height: 1.15; margin: 6px 0 18px; }
  p { font-size: 19px; line-height: 1.6; margin-top: 14px; }
</style>
