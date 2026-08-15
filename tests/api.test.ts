import { describe, expect, test } from "bun:test";
import app from "../src/index";

describe("API バリデーション", () => {
  test("q 無しの /api/stops は 400", async () => {
    const res = await app.request("/api/stops");
    expect(res.status).toBe(400);
    const body = (await res.json()) as { error: { code: string } };
    expect(body.error.code).toBe("MISSING_QUERY");
  });

  test("不正な from/to の /api/approach は 400", async () => {
    const res = await app.request("/api/approach?from=abc&to=19002");
    expect(res.status).toBe(400);
    const body = (await res.json()) as { error: { code: string } };
    expect(body.error.code).toBe("INVALID_STOP_CODE");
  });

  test("必須パラメータ欠落の /api/route は 400", async () => {
    const res = await app.request("/api/route?routeno=19250");
    expect(res.status).toBe(400);
    const body = (await res.json()) as { error: { code: string } };
    expect(body.error.code).toBe("MISSING_PARAM");
  });

  test("/health は 200", async () => {
    const res = await app.request("/health");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });
});
