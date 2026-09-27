<script lang="ts" module>
  type Row = [string, string, string, number, number, string];
  // One copy of the city list, shared by every picker on the page.
  let citiesP: Promise<Row[]> | undefined;
  const cities = () => (citiesP ??= fetch('/cities.json').then((r) => r.json()));
</script>

<script lang="ts">
  import type { Place } from '../store/db';

  let { value = $bindable(), placeholder }: { value?: Place; placeholder: string } = $props();

  let query = $state(value ? label(value) : '');
  let results = $state<Place[]>([]);
  let manual = $state(false);
  let lat = $state(value ? String(value.lat) : '');
  let lon = $state(value ? String(value.lon) : '');
  let zone = $state(value?.zone ?? Intl.DateTimeFormat().resolvedOptions().timeZone);
  const zones = Intl.supportedValuesOf('timeZone');
  const countries = new Intl.DisplayNames(['en'], { type: 'region' });

  function label(p: Place) {
    return [p.name, p.admin, p.country === 'US' ? '' : countries.of(p.country) ?? p.country].filter(Boolean).join(', ');
  }
  const fold = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

  async function search(q: string) {
    query = q;
    value = undefined;
    if (q.trim().length < 2) return (results = []);
    const rows = await cities();
    const [name, ...rest] = fold(q).split(',').map((s) => s.trim());
    const hint = rest.join(' ');
    const found: Place[] = [];
    for (const [n, admin, country, la, lo, z] of rows) {
      const fn = fold(n);
      if (!fn.startsWith(name)) continue;
      if (hint && !fold(`${admin} ${country} ${countries.of(country) ?? ''}`).includes(hint)) continue;
      found.push({ name: n, admin, country, lat: la, lon: lo, zone: z });
      if (found.length >= 8) break; // rows are sorted by population
    }
    results = found;
  }

  function choose(p: Place) {
    value = p;
    query = label(p);
    results = [];
  }

  $effect(() => {
    if (!manual) return;
    const la = parseFloat(lat), lo = parseFloat(lon);
    value = isFinite(la) && isFinite(lo) && Math.abs(la) <= 90 && Math.abs(lo) <= 180
      ? { name: `${la.toFixed(2)}, ${lo.toFixed(2)}`, admin: '', country: '', lat: la, lon: lo, zone }
      : undefined;
  });
</script>

{#if !manual}
  <input type="search" autocomplete="off" {placeholder} value={query} oninput={(e) => search(e.currentTarget.value)} />
  {#if results.length}
    <ul>
      {#each results as r}
        <li><button onclick={() => choose(r)}>{label(r)} <small>{r.zone.replace(/_/g, ' ')}</small></button></li>
      {/each}
    </ul>
  {/if}
  <button class="alt" onclick={() => (manual = true)}>Not listed? Enter coordinates</button>
{:else}
  <div class="grid">
    <input inputmode="decimal" placeholder="Latitude, e.g. 40.35" bind:value={lat} />
    <input inputmode="decimal" placeholder="Longitude, west negative" bind:value={lon} />
  </div>
  <select bind:value={zone}>{#each zones as z}<option value={z}>{z.replace(/_/g, ' ')}</option>{/each}</select>
  <button class="alt" onclick={() => { manual = false; value = undefined; }}>Search by name instead</button>
{/if}

<style>
  ul { list-style: none; margin-top: 6px; border: 1px solid var(--rule); border-radius: 6px; overflow: hidden; }
  li button { width: 100%; text-align: left; padding: 12px; font-size: 16px; border-bottom: 1px solid var(--rule); }
  li:last-child button { border-bottom: none; }
  small { color: var(--faint); font-size: 12px; margin-left: 6px; }
  .alt { margin-top: 8px; font-size: 13px; color: var(--dim); text-decoration: underline; text-underline-offset: 3px; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px; }
</style>
