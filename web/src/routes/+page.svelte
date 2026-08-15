<script lang="ts">
  import { goto } from '$app/navigation';
  import { searchStops } from '$lib/api';
  import type { Stop } from '$lib/types';

  const kana = ['あ', 'か', 'さ', 'た', 'な', 'は', 'ま', 'や', 'ら', 'わ'];

  let fromQuery = $state('');
  let toQuery = $state('');
  let fromStops = $state<Stop[]>([]);
  let toStops = $state<Stop[]>([]);
  let selectedFrom = $state<Stop | null>(null);
  let selectedTo = $state<Stop | null>(null);
  let fromOpen = $state(false);
  let toOpen = $state(false);
  let error = $state('');

  let timer: ReturnType<typeof setTimeout> | undefined;

  function onInput(kind: 'from' | 'to') {
    const q = kind === 'from' ? fromQuery : toQuery;
    clearTimeout(timer);
    if (kind === 'from') {
      selectedFrom = null;
      fromOpen = true;
    } else {
      selectedTo = null;
      toOpen = true;
    }
    if (!q.trim()) {
      if (kind === 'from') fromStops = [];
      else toStops = [];
      return;
    }
    timer = setTimeout(async () => {
      try {
        const res = await searchStops(q.trim());
        if (kind === 'from') fromStops = res.stops;
        else toStops = res.stops;
      } catch {
        error = '検索に失敗しました';
      }
    }, 200);
  }

  function select(kind: 'from' | 'to', stop: Stop) {
    if (kind === 'from') {
      selectedFrom = stop;
      fromQuery = stop.name;
      fromStops = [];
      fromOpen = false;
    } else {
      selectedTo = stop;
      toQuery = stop.name;
      toStops = [];
      toOpen = false;
    }
  }

  function searchKana(k: string) {
    fromQuery = k;
    selectedFrom = null;
    fromOpen = true;
    searchStops(k).then((r) => (fromStops = r.stops)).catch(() => (error = '検索に失敗しました'));
  }

  function search() {
    if (!selectedFrom || !selectedTo) {
      error = '乗車・降車バス停を両方選んでください';
      return;
    }
    error = '';
    goto(`/approach?from=${selectedFrom.code}&to=${selectedTo.code}`);
  }
</script>

<div class="mx-auto max-w-lg px-4 py-8">
  <h1 class="mb-1 text-2xl font-bold">神奈中バスロケ</h1>
  <p class="mb-6 text-sm text-gray-500">非公式クライアント。バスが今どこにいるか確認できます</p>

  <div class="mb-6 space-y-4">
    <div>
      <label class="mb-1 block text-sm font-medium" for="from">乗車バス停</label>
      <input
        id="from"
        bind:value={fromQuery}
        oninput={() => onInput('from')}
        onfocus={() => (fromOpen = true)}
        onblur={() => setTimeout(() => (fromOpen = false), 150)}
        placeholder="バス停名を入力"
        class="w-full rounded-lg border border-gray-300 px-3 py-2"
      />
      {#if fromOpen && fromStops.length > 0}
        <ul class="mt-1 max-h-48 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow">
          {#each fromStops as stop (stop.code)}
            <li>
              <button
                type="button"
                onmousedown={(e) => e.preventDefault()}
                onclick={() => select('from', stop)}
                class="block w-full px-3 py-2 text-left hover:bg-blue-50"
              >
                <span class="font-medium">{stop.name}</span>
                <span class="ml-2 text-xs text-gray-500">{stop.city}</span>
              </button>
            </li>
          {/each}
        </ul>
      {/if}
    </div>

    <div>
      <label class="mb-1 block text-sm font-medium" for="to">降車バス停</label>
      <input
        id="to"
        bind:value={toQuery}
        oninput={() => onInput('to')}
        onfocus={() => (toOpen = true)}
        onblur={() => setTimeout(() => (toOpen = false), 150)}
        placeholder="バス停名を入力"
        class="w-full rounded-lg border border-gray-300 px-3 py-2"
      />
      {#if toOpen && toStops.length > 0}
        <ul class="mt-1 max-h-48 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow">
          {#each toStops as stop (stop.code)}
            <li>
              <button
                type="button"
                onmousedown={(e) => e.preventDefault()}
                onclick={() => select('to', stop)}
                class="block w-full px-3 py-2 text-left hover:bg-blue-50"
              >
                <span class="font-medium">{stop.name}</span>
                <span class="ml-2 text-xs text-gray-500">{stop.city}</span>
              </button>
            </li>
          {/each}
        </ul>
      {/if}
    </div>

    <button
      type="button"
      onclick={search}
      class="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-700"
    >
      検索する
    </button>
    {#if error}
      <p class="text-sm text-red-600">{error}</p>
    {/if}
  </div>

  <div>
    <p class="mb-2 text-sm text-gray-500">50音で探す（乗車バス停）</p>
    <div class="flex flex-wrap gap-1.5">
      {#each kana as k}
        <button
          type="button"
          onclick={() => searchKana(k)}
          class="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-100"
        >
          {k}
        </button>
      {/each}
    </div>
  </div>
</div>
