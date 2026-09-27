<script lang="ts">
  import { onMount } from 'svelte';
  import { type Chart, castChart } from '../astro/ephemeris';
  import { moonPhase, activeSeasons } from '../astro/sky';
  import { localDateKey, localParts, localToUtc, previousDateKey } from '../astro/time';
  import { library } from '../library/load';
  import { composePlate, defaultSession, type PlateSettings } from '../plate/compose';
  import type { Plate, Session } from '../plate/types';
  import { DEFAULT_SETTINGS, type Profile, allPlates, getProfile, getSettings, persist, saveProfile, savePlate, saveSettings } from '../store/db';
  import Landed from './Landed.svelte';
  import MoonGlyph from './MoonGlyph.svelte';
  import MythView from './MythView.svelte';
  import Onboarding from './Onboarding.svelte';
  import PlateView from './PlateView.svelte';
  import Settings from './Settings.svelte';

  let loaded = $state(false);
  let profile = $state<Profile | undefined>();
  let settings = $state<PlateSettings>(DEFAULT_SETTINGS);
  let plates = $state<Plate[]>([]);
  let view = $state<'home' | 'myth' | 'settings' | 'onboarding'>('home');
  let mythId = $state<string | undefined>();
  let session = $state<Session>('dawn');
  let busy = $state(false);
  let animateId = $state<string | null>(null);
  let now = $state(new Date());
  let natal: Chart | undefined;
  let skyNow = $state<{ phase: string; sign: string; illumination: number; waxing: boolean; season?: string } | undefined>();

  const zone = $derived(profile?.home.zone ?? Intl.DateTimeFormat().resolvedOptions().timeZone);
  const today = $derived(localDateKey(now, zone));
  const hour = $derived(localParts(now, zone).hour);
  const plateId = $derived(session === 'yesterdays-dusk' ? `${previousDateKey(today)}:yesterdays-dusk` : `${today}:${session}`);
  const current = $derived(plates.find((p) => p.id === plateId));
  const sessions = $derived<Session[]>(hour < 14 ? ['dawn', 'dusk', 'yesterdays-dusk'] : ['dawn', 'dusk']);
  const toAsk = $derived(
    // Only ask at a later sitting: a Plate drawn in the last few hours is still being written.
    current ? undefined : [...plates]
      .filter((p) => p.id !== plateId && !p.landedAsked && !p.fallow && now.getTime() - Date.parse(p.drawnAt) > 4 * 3600_000)
      .sort((a, b) => (a.drawnAt < b.drawnAt ? 1 : -1))[0],
  );

  $effect(() => {
    document.documentElement.classList.toggle('dawn', session === 'dawn');
  });

  async function castNatal(p: Profile) {
    const [y, m, d] = p.birth.date.split('-').map(Number);
    const [hh, mm] = p.birth.time.split(':').map(Number);
    const utc = localToUtc({ year: y, month: m, day: d, hour: hh, minute: mm }, p.birth.place.zone);
    return castChart(utc, { lat: p.birth.place.lat, lon: p.birth.place.lon });
  }

  async function refreshSky() {
    if (!natal) return;
    const sky = await castChart(now);
    const sun = sky.bodies[0], moon = sky.bodies[1];
    const ph = moonPhase(sun.lon, moon.lon);
    skyNow = { phase: ph.name, sign: moon.sign, illumination: ph.illumination, waxing: ph.waxing, season: activeSeasons(sky, natal)[0]?.name };
  }

  function chooseSession() {
    const k = localDateKey(now, zone);
    session = defaultSession(localParts(now, zone).hour, {
      dawn: plates.some((p) => p.id === `${k}:dawn`),
      dusk: plates.some((p) => p.id === `${k}:dusk`),
    });
  }

  onMount(async () => {
    [profile, settings, plates] = await Promise.all([getProfile(), getSettings(), allPlates()]);
    if (profile) {
      natal = await castNatal(profile);
      chooseSession();
      refreshSky();
    } else view = 'onboarding';
    loaded = true;
    // Coming back to the app later in the day should land on the right session.
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState !== 'visible' || !profile) return;
      const before = today;
      now = new Date();
      if (localDateKey(now, zone) !== before) chooseSession();
      refreshSky();
    });
  });

  async function draw(redraw = false) {
    if (!profile || !natal || busy) return;
    busy = true;
    try {
      now = new Date();
      const isYesterday = session === 'yesterdays-dusk';
      const dateKey = isYesterday ? previousDateKey(today) : today;
      const utc = isYesterday
        ? localToUtc({ year: +dateKey.slice(0, 4), month: +dateKey.slice(5, 7), day: +dateKey.slice(8, 10), hour: 21, minute: 0 }, zone)
        : now;
      const sky = await castChart(utc);
      const history = plates.filter((p) => p.id !== plateId);
      const plate = composePlate({
        lib: library, sky, natal, dateKey, weekday: localParts(utc, zone).weekday,
        session, redraws: redraw ? 1 : 0, history, settings: $state.snapshot(settings),
      });
      await savePlate(plate);
      plates = [...history, plate];
      animateId = `${plate.id}:${plate.redraws}`;
      window.scrollTo({ top: 0 });
    } finally {
      busy = false;
    }
  }

  async function markLanded(p: Plate, landed: boolean[]) {
    const updated = { ...$state.snapshot(p), landed, landedAsked: true } as Plate;
    await savePlate(updated);
    plates = plates.map((x) => (x.id === p.id ? updated : x));
  }

  async function finishOnboarding(p: Profile) {
    await saveProfile(p);
    persist();
    profile = p;
    natal = await castNatal(p);
    now = new Date();
    chooseSession();
    refreshSky();
    view = 'home';
  }

  const sessionLabel: Record<Session, string> = { dawn: 'Dawn', dusk: 'Dusk', 'yesterdays-dusk': "Yesterday's Dusk" };
  const fmtDate = (k: string) =>
    new Date(`${k}T12:00:00Z`).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' });
</script>

{#if !loaded}
  <main></main>
{:else if view === 'onboarding'}
  <Onboarding existing={profile} onDone={finishOnboarding} onCancel={profile ? () => (view = 'settings') : undefined} />
{:else if view === 'settings'}
  <Settings
    {settings}
    voices={library.voices}
    onChange={async (s) => { settings = s; await saveSettings(s); }}
    onEditProfile={() => (view = 'onboarding')}
    onBack={() => (view = 'home')}
  />
{:else if view === 'myth' && mythId && library.myths[mythId]}
  <MythView myth={library.myths[mythId]} onBack={() => (view = 'home')} />
{:else}
  <main>
    <div class="top">
      <div class="date">{fmtDate(current?.dateKey ?? (session === 'yesterdays-dusk' ? previousDateKey(today) : today))}</div>
      <div class="toggle" role="tablist">
        {#each sessions as s}
          <button role="tab" aria-selected={session === s} class:on={session === s} onclick={() => (session = s)}>{sessionLabel[s]}</button>
        {/each}
      </div>
      <button class="gear" aria-label="Settings" onclick={() => (view = 'settings')}>
        <svg width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="10" r="3" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M10 1.5v3M10 15.5v3M1.5 10h3M15.5 10h3M4 4l2.1 2.1M13.9 13.9 16 16M4 16l2.1-2.1M13.9 6.1 16 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
      </button>
    </div>

    {#if current}
      <PlateView
        plate={current}
        lib={library}
        animate={animateId === `${current.id}:${current.redraws}`}
        onRedraw={() => draw(true)}
        onMyth={(id) => { mythId = id; view = 'myth'; window.scrollTo({ top: 0 }); }}
      />
    {:else}
      {#if skyNow}
        <div class="sky">
          <span><MoonGlyph illumination={skyNow.illumination} waxing={skyNow.waxing} /> {skyNow.phase} in {skyNow.sign}</span>
          {#if skyNow.season}<span class="season">Season · {skyNow.season}</span>{/if}
        </div>
      {/if}
      {#if toAsk}
        {#key toAsk.id}
          <Landed plate={toAsk} label={`${fmtDate(toAsk.dateKey)} · ${sessionLabel[toAsk.session]}`} onDone={(l) => markLanded(toAsk!, l)} />
        {/key}
      {:else}
        <button class="draw" onclick={() => draw()} disabled={busy}>
          <span class="ring"></span>
          <span class="serif">{busy ? 'Drawing…' : 'Tap to draw'}</span>
        </button>
      {/if}
    {/if}
  </main>
{/if}

<style>
  .top { display: flex; align-items: center; gap: 10px; }
  .date { font-size: 12px; font-weight: 500; letter-spacing: .14em; text-transform: uppercase; color: var(--dim); white-space: nowrap; }
  .toggle { margin-left: auto; display: flex; border: 1px solid var(--rule); border-radius: 999px; padding: 2px; }
  .toggle button { font-size: 12px; letter-spacing: .04em; padding: 5px 10px; border-radius: 999px; color: var(--dim); white-space: nowrap; }
  .toggle button.on { background: var(--fg); color: var(--bg); font-weight: 500; }
  .gear { color: var(--dim); padding: 4px; display: flex; }
  .sky { display: flex; gap: 14px; flex-wrap: wrap; margin-top: 12px; font-size: 13px; }
  .season { color: var(--accent); }
  .draw {
    margin-top: 18px; width: 100%; aspect-ratio: 1; border: 1px dashed var(--rule); border-radius: 4px;
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 22px; color: var(--dim); font-size: 20px;
  }
  .ring { width: 88px; height: 88px; border-radius: 50%; border: 1.5px solid var(--dim); animation: breathe 5s ease-in-out infinite; }
  @keyframes breathe { 50% { transform: scale(1.08); opacity: .6; } }
</style>
