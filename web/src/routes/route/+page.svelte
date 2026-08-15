<script lang="ts">
  import { onMount } from 'svelte';
  import { getApproach, getRoute } from '$lib/api';
  import type { ApproachBus, ApproachInfo, RouteInfo } from '$lib/types';

  let route = $state<RouteInfo | null>(null);
  let approach = $state<ApproachInfo | null>(null);
  let error = $state('');
  let lastUpdated = $state<Date | null>(null);

  function load() {
    const p = new URLSearchParams(window.location.search);
    const params = {
      routeno: p.get('routeno') ?? '',
      fromStopNo: p.get('fromStopNo') ?? '',
      toStopNo: p.get('toStopNo') ?? '',
      routeName: p.get('routeName') ?? '',
      keikaName: p.get('keikaName') ?? '',
      lastStopName: p.get('lastStopName') ?? '',
    };
    getRoute(params)
      .then((d) => {
        route = d;
        lastUpdated = new Date();
        error = '';
      })
      .catch((e) => (error = (e as Error).message));
    const from = Number(params.fromStopNo);
    const to = Number(params.toStopNo);
    if (from && to) {
      getApproach(from, to)
        .then((d) => (approach = d))
        .catch(() => {});
    }
  }

  onMount(() => {
    load();
    const id = setInterval(load, 30000);
    return () => clearInterval(id);
  });

  function fmt(d: Date) {
    return d.toLocaleTimeString('ja-JP');
  }

  function busLabel(bus: ApproachBus) {
    if (bus.etaMinutes !== null) return `あと${bus.etaMinutes}分`;
    const m = bus.statusText.match(/(\d{1,2}:\d{2})発予定/);
    return m ? `${m[1]}発予定` : '';
  }

  // 接近中のバス(運行中)を、ルート図の「次の通過バス停」の位置にマップする
  // approachingStops の先頭 = バスが次に通るバス停 = 現在位置の目安
  const busMarkers = $derived.by(() => {
    const map = new Map<string, ApproachBus[]>();
    if (!approach) return map;
    for (const bus of approach.buses) {
      if (bus.etaMinutes === null) continue; // 未発バスは現在位置が無い
      const next = bus.approachingStops[0]?.replace(/\s*（.*?着予定）/, '').trim();
      if (!next) continue;
      const arr = map.get(next) ?? [];
      arr.push(bus);
      map.set(next, arr);
    }
    return map;
  });

  // 未発バス(現在位置なし)は乗車バス停に発予定バッジとして表示
  const notDeparted = $derived.by(() => {
    if (!approach) return [];
    return approach.buses.filter((b) => b.etaMinutes === null);
  });
</script>

<div class="mx-auto max-w-lg px-4 py-8">
  <div class="mb-6 flex items-center justify-between">
    <a
      href="/approach?from={new URLSearchParams(window.location.search).get('fromStopNo')}&to={new URLSearchParams(window.location.search).get('toStopNo')}"
      class="text-sm text-blue-600 hover:underline"
    >
      ← 接近情報に戻る
    </a>
    {#if lastUpdated}
      <button
        type="button"
        onclick={load}
        class="text-xs text-gray-500 hover:underline"
      >
        🔄 {fmt(lastUpdated)} 更新
      </button>
    {/if}
  </div>

  {#if error}
    <p class="text-red-600">{error}</p>
  {:else if route}
    <h1 class="mb-1 text-xl font-bold">
      {route.route}系統 {route.destination}行き
    </h1>
    {#if route.via}
      <p class="mb-4 text-sm text-gray-500">{route.via}経由</p>
    {/if}

    {@const hasAnyBus =
      route.stops.some((s) => s.busesHere.length > 0) ||
      busMarkers.size > 0 ||
      notDeparted.length > 0}
    {#if !hasAnyBus}
      <p class="mb-3 rounded-lg bg-gray-50 px-3 py-2 text-center text-sm text-gray-500">
        現在この区間を運行中のバスはいません
      </p>
    {/if}

    <div class="rounded-xl border border-gray-200 bg-white p-4">
      <ol>
        {#each route.stops as stop, i (i)}
          {@const hasBus = stop.busesHere.length > 0}
          {@const busesNearby = busMarkers.get(stop.name) ?? []}
          <li class="relative flex items-start gap-3 pb-4 last:pb-0">
            {#if i < route.stops.length - 1}
              <span
                class="absolute left-[11px] top-6 h-full w-0.5 {hasBus || busesNearby.length > 0
                  ? 'bg-amber-300'
                  : 'bg-gray-200'}"
              ></span>
            {/if}
            <span
              class="mt-1.5 h-3 w-3 shrink-0 rounded-full {hasBus
                ? 'bg-blue-500'
                : busesNearby.length > 0
                  ? 'bg-amber-400'
                  : stop.type === 'departure'
                    ? 'bg-green-500'
                    : stop.type === 'destination'
                      ? 'bg-red-500'
                      : 'bg-gray-300'}"
            ></span>
            <div class="min-w-0 flex-1">
              <p class="{hasBus || busesNearby.length > 0 ? 'font-bold' : ''}">{stop.name}</p>
              <div class="flex flex-wrap gap-1.5">
                {#if stop.type === 'departure'}
                  <span class="rounded bg-green-100 px-1.5 py-0.5 text-xs text-green-700">乗車</span>
                {:else if stop.type === 'destination'}
                  <span class="rounded bg-red-100 px-1.5 py-0.5 text-xs text-red-700">降車</span>
                {/if}
                {#each busesNearby as b (b.vehicle + b.routePath)}
                  <span
                    class="rounded bg-amber-100 px-1.5 py-0.5 text-xs font-medium text-amber-700"
                    title={b.statusText}
                  >
                    🚌 {b.vehicle} {busLabel(b)}
                  </span>
                {/each}
                {#if stop.type === 'departure'}
                  {#each notDeparted as b (b.vehicle + b.routePath)}
                    <span
                      class="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500"
                      title={b.statusText}
                    >
                      🚌 {b.vehicle} {busLabel(b)}
                    </span>
                  {/each}
                {/if}
                {#each stop.busesHere as v (v)}
                  <span class="rounded bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-700">
                    🚌 {v}
                  </span>
                {/each}
              </div>
            </div>
          </li>
        {/each}
      </ol>
    </div>
    <p class="mt-3 text-center text-xs text-gray-400">30秒ごとに自動更新</p>
  {:else}
    <p class="text-gray-500">読み込み中...</p>
  {/if}
</div>
