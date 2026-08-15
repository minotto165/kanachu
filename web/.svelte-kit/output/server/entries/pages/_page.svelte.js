import { a as attr, b as ensure_array_like, e as escape_html } from "../../chunks/index.js";
import "@sveltejs/kit/internal";
import "../../chunks/exports.js";
import "../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../chunks/root.js";
import "../../chunks/state.svelte.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const kana = ["あ", "か", "さ", "た", "な", "は", "ま", "や", "ら", "わ"];
    let fromQuery = "";
    let toQuery = "";
    $$renderer2.push(`<div class="mx-auto max-w-lg px-4 py-8"><h1 class="mb-1 text-2xl font-bold">神奈中バスロケ</h1> <p class="mb-6 text-sm text-gray-500">非公式クライアント。バスが今どこにいるか確認できます</p> <div class="mb-6 space-y-4"><div><label class="mb-1 block text-sm font-medium" for="from">乗車バス停</label> <input id="from"${attr("value", fromQuery)} placeholder="バス停名を入力" class="w-full rounded-lg border border-gray-300 px-3 py-2"/> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> <div><label class="mb-1 block text-sm font-medium" for="to">降車バス停</label> <input id="to"${attr("value", toQuery)} placeholder="バス停名を入力" class="w-full rounded-lg border border-gray-300 px-3 py-2"/> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> <button type="button" class="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-700">検索する</button> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> <div><p class="mb-2 text-sm text-gray-500">50音で探す（乗車バス停）</p> <div class="flex flex-wrap gap-1.5"><!--[-->`);
    const each_array_2 = ensure_array_like(kana);
    for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
      let k = each_array_2[$$index_2];
      $$renderer2.push(`<button type="button" class="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-100">${escape_html(k)}</button>`);
    }
    $$renderer2.push(`<!--]--></div></div></div>`);
  });
}
export {
  _page as default
};
