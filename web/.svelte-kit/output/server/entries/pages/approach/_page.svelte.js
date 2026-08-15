import "clsx";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../../chunks/root.js";
import "../../../chunks/state.svelte.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    Number(new URLSearchParams(window.location.search).get("from"));
    Number(new URLSearchParams(window.location.search).get("to"));
    $$renderer2.push(`<div class="mx-auto max-w-lg px-4 py-8"><div class="mb-6"><a href="/" class="text-sm text-blue-600 hover:underline">← 検索に戻る</a></div> `);
    {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="text-gray-500">読み込み中...</p>`);
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
export {
  _page as default
};
