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
    // 乗車バス停より手前のバスも表示するため、接近情報も取得
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

  // ルート図内に居ない接近バス(乗車バス停より手前 or 別系統)
  const outsideBuses = $derived.by(() => {
    if (!approach || !route) return [];
    const onRoute = new Set(route.stops.flatMap((s) => s.busesHere));
    return approach.buses.filter((b) => !onRoute.has(b.vehicle));
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

    {#if outsideBuses.length > 0}
      <div class="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3">
        <p class="mb-2 text-sm font-medium text-amber-800">🚌 乗車バス停より手前のバス</p>
        <div class="space-y-2">
          {#each outsideBuses as bus (bus.vehicle)}
            <div class="text-xs">
              <span class="font-semibold text-amber-800">{bus.vehicle}</span>
              <span class="ml-1 text-amber-700">{bus.statusText}</span>
              {#if bus.approachingStops.length > 0}
                <div class="mt-0.5 text-amber-600">
                  📍 {bus.approachingStops.join(' → ')}
                </div>
              {/if}
            </div>
          {/each}
        </div>
      </div>
    {/if}

    <div class="rounded-xl border border-gray-200 bg-white p-4">
      <ol>
        {#each route.stops as stop, i (i)}
          {@const hasBus = stop.busesHere.length > 0}
          <li class="relative flex items-start gap-3 pb-4 last:pb-0">
            {#if i < route.stops.length - 1}
              <span
                class="absolute left-[11px] top-6 h-full w-0.5 {hasBus ? 'bg-blue-400' : 'bg-gray-200'}"
              ></span>
            {/if}
            <span
              class="mt-1.5 h-3 w-3 shrink-0 rounded-full {hasBus
                ? 'bg-blue-500'
                : stop.type === 'departure'
                  ? 'bg-green-500'
                  : stop.type === 'destination'
                    ? 'bg-red-500'
                    : 'bg-gray-300'}"
            ></span>
            <div class="min-w-0 flex-1">
              <p class="{hasBus ? 'font-bold text-blue-700' : ''}">{stop.name}</p>
              <div class="flex gap-1.5">
                {#if stop.type === 'departure'}
                  <span class="rounded bg-green-100 px-1.5 py-0.5 text-xs text-green-700">乗車</span>
                {:else if stop.type === 'destination'}
                  <span class="rounded bg-red-100 px-1.5 py-0.5 text-xs text-red-700">降車</span>
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
