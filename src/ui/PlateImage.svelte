<script lang="ts">
  import { onMount } from 'svelte';
  import { draw, fade, scale } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import type { ImageSpec } from '../image/grammar';

  let { spec, animate = false, uid = 'p' }: { spec: ImageSpec; animate?: boolean; uid?: string } = $props();

  const reduced = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const motion = animate && !reduced;
  let shown = $state(!motion);
  onMount(() => {
    if (motion) requestAnimationFrame(() => (shown = true));
  });

  // The line walks first; the field and forms settle in after it.
  const t = (delay: number, duration: number) => ({ delay: motion ? delay : 0, duration: motion ? duration : 0 });
</script>

<svg viewBox="0 0 {spec.size} {spec.size}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Today's Plate image">
  <defs>
    <filter id="{uid}-grain" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="7" result="n" />
      <feColorMatrix type="saturate" values="0" in="n" result="g" />
      <feComponentTransfer in="g" result="a"><feFuncA type="linear" slope={spec.session === 'dusk' ? 0.16 : 0.22} /></feComponentTransfer>
      <feComposite in="a" in2="SourceGraphic" operator="in" />
    </filter>
    <filter id="{uid}-edge"><feTurbulence type="fractalNoise" baseFrequency=".05" numOctaves="2" seed="9" /><feDisplacementMap in="SourceGraphic" scale="3" /></filter>
    {#each spec.overlaps as o, i}
      <clipPath id="{uid}-clip-{i}"><path d={spec.forms[o.a].d} /></clipPath>
    {/each}
  </defs>

  <rect width={spec.size} height={spec.size} fill={spec.ground} />
  {#if shown}
    <g in:fade={t(900, 1400)}>
      <circle cx={spec.moon.cx} cy={spec.moon.cy} r={spec.moon.r} fill={spec.moon.dark} filter="url(#{uid}-edge)" />
      {#if spec.moon.litPath}<path d={spec.moon.litPath} fill={spec.moon.lit} filter="url(#{uid}-edge)" />{/if}
      <rect x="0" y={spec.band.y} width={spec.size} height={spec.size - spec.band.y} fill={spec.band.colour} filter="url(#{uid}-edge)" />
    </g>
    {#each spec.axes as a}
      <line x1={a.x1} y1={a.y1} x2={a.x2} y2={a.y2} stroke={spec.ink} stroke-width="1.2" stroke-dasharray="3 5" opacity=".7" in:fade={t(1600, 800)} />
    {/each}
    {#each spec.forms as f, i}
      <g in:scale={{ ...t(1500 + i * 260, 900), start: 0.85, opacity: 0, easing: cubicOut }} style="transform-origin: {f.cx}px {f.cy}px">
        <path d={f.d} fill={f.colour} filter="url(#{uid}-edge)" />
      </g>
    {/each}
    {#each spec.overlaps as o, i}
      <path d={spec.forms[o.b].d} fill={o.colour} clip-path="url(#{uid}-clip-{i})" filter="url(#{uid}-edge)" in:fade={t(2400, 900)} />
    {/each}
    {#each spec.hatches as h}
      <path d={h.d} stroke={spec.ink} stroke-width="1.6" stroke-linecap="round" fill="none" in:fade={t(2600, 600)} />
    {/each}
    <path d={spec.line.d} fill="none" stroke={spec.ink} stroke-width="2" stroke-linecap="round" in:draw={t(0, 2600)} />
    <path d={spec.line.arrow} fill="none" stroke={spec.ink} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" in:fade={t(2500, 400)} />
  {/if}
  <rect width={spec.size} height={spec.size} fill="#fff" filter="url(#{uid}-grain)" pointer-events="none" />
</svg>

<style>
  svg { display: block; width: 100%; height: auto; border-radius: 4px; }
</style>
