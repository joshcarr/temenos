<script lang="ts">
  import type { Shape } from '../image/grammar';
  import MoonGlyph from './MoonGlyph.svelte';

  let { glyph, shape, illumination, waxing }: { glyph: string; shape: Shape; illumination: number; waxing: boolean } = $props();

  const shapes: Record<Shape, string> = {
    triangle: 'M20 6 L33 30 L7 30 Z',
    square: 'M8 8 H32 V32 H8 Z',
    circle: 'M20 7 A13 13 0 1 1 19.99 7 Z',
    arrow: 'M8 30 L28 10 M18 10 H28 V20',
  };
</script>

<div class="mark">
  <div class="glyphs" aria-label="Page mark">
    <span class="glyph">{glyph + "\uFE0E"}</span>
    <MoonGlyph {illumination} {waxing} size={30} />
    <svg width="38" height="38" viewBox="0 0 40 40" aria-hidden="true">
      <path d={shapes[shape]} fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  </div>
  <p>Copy this to the top of your page. It ties the paper to this Plate.</p>
</div>

<style>
  .mark { display: flex; gap: 16px; align-items: center; margin-top: 14px; }
  .glyphs { flex: none; display: flex; gap: 14px; align-items: center; padding: 10px 14px; border: 1px dashed var(--dim); border-radius: 4px; color: var(--fg); }
  .glyph { font-family: 'Apple Symbols', 'Segoe UI Symbol', 'DejaVu Sans', serif; font-size: 30px; line-height: 1; }
  p { font-size: 13px; line-height: 1.45; color: var(--dim); }
</style>
