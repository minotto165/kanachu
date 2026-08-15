import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { fetchApproach, fetchRoute, fetchStops, UpstreamError } from "./client";
import type { RouteQuery } from "./types";

const app = new Hono();

app.get("/api/stops", async (c) => {
  const q = c.req.query("q")?.trim() ?? "";
  if (!q) return c.json({ error: { code: "MISSING_QUERY", message: "q パラメータは必須です" } }, 400);
  try {
    const stops = await fetchStops(q);
    return c.json({ query: q, stops });
  } catch (e) {
    if (e instanceof UpstreamError) return c.json({ error: { code: "UPSTREAM_ERROR", message: e.message } }, 502);
    throw e;
  }
});

app.get("/api/approach", async (c) => {
  const from = Number(c.req.query("from"));
  const to = Number(c.req.query("to"));
  if (!Number.isInteger(from) || !Number.isInteger(to) || from <= 0 || to <= 0) {
    return c.json({ error: { code: "INVALID_STOP_CODE", message: "from / to は正の整数のバス停コードを指定してください" } }, 400);
  }
  try {
    const data = await fetchApproach(from, to);
    if (data.buses.length === 0) {
      return c.json({ error: { code: "NOT_FOUND", message: "該当する運行バスが見つかりません" } }, 404);
    }
    return c.json(data);
  } catch (e) {
    if (e instanceof UpstreamError) return c.json({ error: { code: "UPSTREAM_ERROR", message: e.message } }, 502);
    throw e;
  }
});

app.get("/api/route", async (c) => {
  const q: RouteQuery = {
    routeno: c.req.query("routeno") ?? "",
    fromStopNo: c.req.query("fromStopNo") ?? "",
    toStopNo: c.req.query("toStopNo") ?? "",
    routeName: c.req.query("routeName") ?? "",
    keikaName: c.req.query("keikaName") ?? "",
    lastStopName: c.req.query("lastStopName") ?? "",
    fromStopRPS: c.req.query("fromStopRPS") ?? "1",
    toStopRPS: c.req.query("toStopRPS") ?? "2",
  };
  if (!q.routeno || !q.fromStopNo || !q.toStopNo || !q.routeName || !q.lastStopName) {
    return c.json({ error: { code: "MISSING_PARAM", message: "routeno / fromStopNo / toStopNo / routeName / lastStopName は必須です" } }, 400);
  }
  try {
    const data = await fetchRoute(q);
    return c.json(data);
  } catch (e) {
    if (e instanceof UpstreamError) return c.json({ error: { code: "UPSTREAM_ERROR", message: e.message } }, 502);
    throw e;
  }
});

app.get("/health", (c) => c.json({ ok: true }));

// 存在しない API パスは JSON 404(SPA fallback に落とさない)
app.get("/api/*", (c) => c.json({ error: { code: "NOT_FOUND", message: "Not found" } }, 404));

// ---- SPA 静的配信 (web/ のビルド成果物) ----
// /api と /health より後に定義するので、API ルートが優先される
app.get("/_app/*", serveStatic({ root: "./web-build" }));
app.get("/favicon.png", serveStatic({ path: "./web-build/favicon.png" }));
app.get("*", serveStatic({ path: "./web-build/200.html" }));

export default app;
