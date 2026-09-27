<script lang="ts">
  import { moonLitPath } from '../image/grammar';
  let { illumination, waxing, size = 14 }: { illumination: number; waxing: boolean; size?: number } = $props();
</script>

<svg width={size} height={size} viewBox="0 0 20 20" aria-hidden="true">
  <circle cx="10" cy="10" r="8.5" fill="var(--moon-dark)" />
  {#if illumination > 0.01}<path d={moonLitPath(10, 10, 8.5, illumination, waxing)} fill="var(--moon-lit)" />{/if}
  <circle cx="10" cy="10" r="8.5" fill="none" stroke="currentColor" stroke-width="1.5" />
</svg>

<style>svg { display: inline-block; vertical-align: -2px; }</style>
