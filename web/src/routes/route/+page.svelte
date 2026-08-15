<script lang="ts">
  import { onMount } from 'svelte';
  import { getApproach, getRoute } from '$lib/api';
  import type { ApproachBus, RouteInfo } from '$lib/types';

  // URL: /route?vehicle=ま96&from=22072&to=22001&routeno=22042
  const p = new URLSearchParams(window.location.search);
  const vehicle = p.get('vehicle') ?? '';
  const from = Number(p.get('from'));
  const to = Number(p.get('to'));
  const routeno = p.get('routeno') ?? '';

  let route = $state<RouteInfo | null>(null);
  let bus = $state<ApproachBus | null>(null);
  let notFound = $state(false);
  let error = $state('');
  let lastUpdated = $state<Date | null>(null);

  async function load() {
    if (!vehicle || !from || !to || !routeno) {
      error = '車両が指定されていません';
      return;
    }
    try {
      // 1. approach から該当車両を解決(車番+系統で一意に特定)
      const info = await getApproach(from, to);
      const found =
        info.buses.find(
          (b) => b.vehicle === vehicle && b.routePath.includes(`routeno=${routeno}`),
        ) ?? null;
      bus = found;
      notFound = !found;
      if (!found) {
        route = null;
        return;
      }
      // 2. 車両の系統情報からルート図を取得
      const r = await getRoute({
        routeno,
        fromStopNo: String(from),
        toStopNo: String(to),
        routeName: found.route,
        keikaName: found.via,
        lastStopName: found.destination,
      });
      route = r;
      lastUpdated = new Date();
      error = '';
    } catch (e) {
      error = (e as Error).message;
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

  // 接近中マーカーの位置(ルート外のときのみ): approachingStops の先頭 = 次の通過バス停
  const markerStop = $derived.by(() => {
    if (!bus || !route) return null;
    const onRoute = route.stops.some((s) => s.busesHere.includes(bus!.vehicle));
    if (onRoute) return null; // ルート内は busesHere(青)で表示済み
    if (bus.etaMinutes === null) return null; // 未発バスは位置なし
    return bus.approachingStops[0]?.replace(/\s*（.*?着予定）/, '').trim() ?? null;
  });
</script>

<div class="mx-auto max-w-lg px-4 py-8">
  <div class="mb-6 flex items-center justify-between">
    <a
      href="/approach?from={from}&to={to}"
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
  {:else if notFound}
    <h1 class="mb-2 text-xl font-bold">🚌 {vehicle}</h1>
    <p class="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-600">
      この車両は現在この区間に接近していません
    </p>
  {:else if bus && route}
    <h1 class="mb-1 text-xl font-bold">🚌 {bus.vehicle}</h1>
    <p class="text-sm text-gray-800">
      {bus.route} {bus.destination}行き
      {#if bus.via}<span class="text-gray-500">({bus.via}経由)</span>{/if}
      <span class="ml-1 text-xs text-gray-400">現金 {bus.fare.cash}円 / IC {bus.fare.ic}円</span>
    </p>
    <p class="mb-4 text-sm text-blue-600">
      {bus.etaMinutes !== null
        ? `運行中 ・乗車バス停まであと${bus.etaMinutes}分`
        : bus.statusText}
    </p>

    <div class="rounded-xl border border-gray-200 bg-white p-4">
      <ol>
        {#each route.stops as stop, i (i)}
          {@const hasBus = stop.busesHere.includes(bus.vehicle)}
          {@const isMarker = markerStop === stop.name}
          <li class="relative flex items-start gap-3 pb-4 last:pb-0">
            {#if i < route.stops.length - 1}
              <span
                class="absolute left-[11px] top-6 h-full w-0.5 {hasBus || isMarker
                  ? 'bg-amber-300'
                  : 'bg-gray-200'}"
              ></span>
            {/if}
            <span
              class="mt-1.5 h-3 w-3 shrink-0 rounded-full {hasBus
                ? 'bg-blue-500'
                : isMarker
                  ? 'bg-amber-400'
                  : stop.type === 'departure'
                    ? 'bg-green-500'
                    : stop.type === 'destination'
                      ? 'bg-red-500'
                      : 'bg-gray-300'}"
            ></span>
            <div class="min-w-0 flex-1">
              <p class="{hasBus || isMarker ? 'font-bold' : ''}">{stop.name}</p>
              <div class="flex flex-wrap gap-1.5">
                {#if stop.type === 'departure'}
                  <span class="rounded bg-green-100 px-1.5 py-0.5 text-xs text-green-700">乗車</span>
                {:else if stop.type === 'destination'}
                  <span class="rounded bg-red-100 px-1.5 py-0.5 text-xs text-red-700">降車</span>
                {/if}
                {#if hasBus}
                  <span class="rounded bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-700">
                    🚌 {bus.vehicle}
                  </span>
                {/if}
                {#if isMarker}
                  <span class="rounded bg-amber-100 px-1.5 py-0.5 text-xs font-medium text-amber-700">
                    🚌 {bus.vehicle}
                  </span>
                {/if}
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
