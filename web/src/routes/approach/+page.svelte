<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { getApproach } from '$lib/api';
  import type { ApproachBus, ApproachInfo } from '$lib/types';

  let info = $state<ApproachInfo | null>(null);
  let error = $state('');
  let loading = $state(true);

  const from = Number(new URLSearchParams(window.location.search).get('from'));
  const to = Number(new URLSearchParams(window.location.search).get('to'));

  async function load() {
    if (!from || !to) {
      error = 'バス停が指定されていません';
      loading = false;
      return;
    }
    try {
      info = await getApproach(from, to);
    } catch (e) {
      error = (e as Error).message;
    }
    loading = false;
  }

  onMount(load);

  function openRoute(bus: ApproachBus) {
    const m = bus.routePath.match(/routeno=(\d+)/);
    if (!m) return;
    const q = new URLSearchParams({
      routeno: m[1],
      fromStopNo: String(from),
      toStopNo: String(to),
      routeName: bus.route,
      keikaName: bus.via,
      lastStopName: bus.destination,
    });
    goto(`/route?${q}`);
  }
</script>

<div class="mx-auto max-w-lg px-4 py-8">
  <div class="mb-6">
    <a href="/" class="text-sm text-blue-600 hover:underline">← 検索に戻る</a>
  </div>

  {#if loading}
    <p class="text-gray-500">読み込み中...</p>
  {:else if error}
    <p class="text-red-600">{error}</p>
  {:else if info && info.buses.length === 0}
    <p class="text-gray-500">現在接近中のバスはありません</p>
  {:else if info}
    <h1 class="mb-4 text-xl font-bold">接近情報</h1>
    <p class="mb-4 text-sm text-gray-500">
      {info.buses.length}台接近中
    </p>
    <div class="space-y-3">
      {#each info.buses as bus (bus.routePath + bus.vehicle)}
        <button
          type="button"
          onclick={() => openRoute(bus)}
          class="block w-full rounded-xl border border-gray-200 bg-white p-4 text-left shadow-sm hover:border-blue-400 hover:shadow"
        >
          <div class="mb-1 flex items-baseline justify-between">
            <span class="text-lg font-bold">{bus.route}</span>
            <span class="text-sm text-gray-600">
              {#if bus.etaMinutes !== null}
                <span class="text-xl font-bold text-blue-600">{bus.etaMinutes}</span>分後
              {:else}
                {@const dep = bus.statusText.match(/(\d{1,2}:\d{2})発予定/)?.[1] ?? ''}
                <span class="text-base font-semibold text-gray-500">{dep}発予定</span>
              {/if}
            </span>
          </div>
          <div class="mb-1 text-sm">
            <span class="text-gray-800">{bus.destination}行き</span>
            {#if bus.via}
              <span class="ml-1 text-xs text-gray-500">({bus.via}経由)</span>
            {/if}
          </div>
          {#if bus.statusText}
            <div class="mb-1 text-xs text-gray-500">{bus.statusText}</div>
          {/if}
          <div class="flex items-center justify-between text-xs text-gray-500">
            <span>🚌 {bus.vehicle}{bus.mark}</span>
            <span>現金 {bus.fare.cash}円 / IC {bus.fare.ic}円</span>
          </div>
        </button>
      {/each}
    </div>
  {/if}
</div>
