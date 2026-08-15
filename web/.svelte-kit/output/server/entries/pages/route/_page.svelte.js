import { a as attr, a6 as stringify } from "../../../chunks/index.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    $$renderer2.push(`<div class="mx-auto max-w-lg px-4 py-8"><div class="mb-6 flex items-center justify-between"><a${attr("href", `/approach?from=${stringify(new URLSearchParams(window.location.search).get("fromStopNo"))}&to=${stringify(new URLSearchParams(window.location.search).get("toStopNo"))}`)} class="text-sm text-blue-600 hover:underline">← 接近情報に戻る</a> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> `);
    {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<p class="text-gray-500">読み込み中...</p>`);
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
export {
  _page as default
};
