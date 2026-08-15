import iconv from "iconv-lite";
import * as cheerio from "cheerio";
import type { ApproachBus, ApproachInfo, RouteInfo, RouteQuery, RouteStop, Stop } from "./types";

export const BASE_URL = "https://real.kanachu.jp";

export class UpstreamError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UpstreamError";
  }
}

/** 神奈中サイトから取得し、指定エンコーディングで文字列化する */
async function fetchText(path: string, encoding: "shift_jis" | "utf-8"): Promise<string> {
  const res = await fetch(BASE_URL + path, {
    headers: { "User-Agent": "kanachu-api (https://github.com/minotto165/kanachu)" },
  });
  if (!res.ok) throw new UpstreamError(`kanachu returned HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  return iconv.decode(buf, encoding);
}

/** 日本語文字列を Shift_JIS の URL エンコードにする */
export function sjisUrlEncode(str: string): string {
  const buf = iconv.encode(str, "shift_jis");
  return Array.from(buf)
    .map((b) => "%" + b.toString(16).toUpperCase().padStart(2, "0"))
    .join("");
}

// ---------- stoplist: バス停検索 ----------

export function parseStoplist(text: string): Stop[] {
  const stops: Stop[] = [];
  for (const line of text.split(/\r?\n/)) {
    const m = line.trim().match(/^(.+)\((.+)\),(\d+)$/);
    if (m) stops.push({ name: m[1] ?? "", city: m[2] ?? "", code: Number(m[3] ?? 0) });
  }
  return stops;
}

export async function fetchStops(query: string): Promise<Stop[]> {
  const path = `/pc/stoplist?fromToCd=1&q=${encodeURIComponent(query)}&w=-1`;
  const text = await fetchText(path, "utf-8");
  return parseStoplist(text);
}

// ---------- selectstop: 接近情報一覧 ----------

export function parseApproach(html: string, fromCode: number, toCode: number): ApproachInfo {
  const $ = cheerio.load(html);
  const buses: ApproachBus[] = [];
  const tables = $("table").toArray();

  for (let i = 0; i < tables.length; i++) {
    const t = $(tables[i]);
    const ths = t
      .find("th")
      .map((_, el) => $(el).text().trim())
      .get();
    if (!ths.includes("系統")) continue;

    const cells: Record<string, string> = {};
    t.find("tr").each((_, tr) => {
      const th = $(tr).find("th").text().trim();
      const td = $(tr).find("td").text().trim();
      if (th) cells[th] = td;
    });

    const vehicleRaw = (cells["車両番号"] ?? "").trim();
    const vmatch = vehicleRaw.match(/^([^\s※★]+)\s*(※|★)?/);
    const link = t.find('a[href*="displayrouteinfo"]').attr("href") ?? "";

    const next = i + 1 < tables.length ? $(tables[i + 1]) : $();
    const arrivalMatch = next.text().match(/(\d+)分/);
    const next2 = i + 2 < tables.length ? $(tables[i + 2]) : $();
    const fareCells: Record<string, string> = {};
    next2.find("tr").each((_, tr) => {
      $(tr)
        .find("th")
        .each((_, th) => {
          const label = $(th).text().trim();
          const td = $(th).next("td");
          if (label && td.length) fareCells[label] = td.text().trim();
        });
    });

    buses.push({
      route: cells["系統"] ?? "",
      destination: cells["行き先"] ?? "",
      via: cells["経由"] ?? "",
      vehicle: vmatch?.[1] ?? vehicleRaw,
      mark: vmatch?.[2] ?? "",
      arrivalMinutes: arrivalMatch ? Number(arrivalMatch[1] ?? -1) : -1,
      status: "normal",
      fare: {
        cash: Number.parseInt(fareCells["現金"] ?? "0") || 0,
        ic: Number.parseInt(fareCells["IC"] ?? "0") || 0,
      },
      routePath: link,
    });
    i += 2;
  }

  return {
    from: { code: fromCode, name: "" },
    to: { code: toCode, name: "" },
    buses,
    fetchedAt: new Date().toISOString(),
  };
}

export async function fetchApproach(fromCode: number, toCode: number): Promise<ApproachInfo> {
  const path = `/pc/selectstop?fNO=${fromCode}&tNO=${toCode}`;
  const html = await fetchText(path, "shift_jis");
  return parseApproach(html, fromCode, toCode);
}

// ---------- displayrouteinfo: バスルート図 ----------

export function parseRoute(html: string): RouteInfo {
  const $ = cheerio.load(html);
  const stops: RouteStop[] = [];

  $(".placeArea01").each((_, el) => {
    const bs = $(el).find(".inner_busstop").first();
    const name = bs.find("p").text().trim();
    if (!name) return;
    const cls = bs.attr("class") ?? "";
    const type = cls.includes("departure")
      ? "departure"
      : cls.includes("destination")
        ? "destination"
        : "normal";

    const busesHere: string[] = [];
    if ($(el).find(".inner_arrow").first().hasClass("nowBetween")) {
      $(el).find("p.ic").each((_, ic) => {
        busesHere.push($(ic).text().trim());
      });
    }
    stops.push({ name, type, busesHere });
  });

  const heading = $("h2.heading2-1").text().trim();
  const hm = heading.match(/^(\S+)系統\s*(.+?)行き\s*(.*?)経由/);
  return {
    route: hm?.[1] ?? "",
    destination: hm?.[2] ?? "",
    via: hm?.[3] ?? "",
    stops,
    fetchedAt: new Date().toISOString(),
  };
}

export async function fetchRoute(q: RouteQuery): Promise<RouteInfo> {
  // 注意: URLSearchParams を使うと % が %25 に二重エンコードされるため手動組み立て
  const params = [
    "corpno=0",
    `routeno=${encodeURIComponent(q.routeno)}`,
    "rtripkbn=1",
    `fromStopNo=${encodeURIComponent(q.fromStopNo)}`,
    `toStopNo=${encodeURIComponent(q.toStopNo)}`,
    `routeName=${sjisUrlEncode(q.routeName)}`,
    `keikaName=${sjisUrlEncode(q.keikaName ?? "")}`,
    `lastStopName=${sjisUrlEncode(q.lastStopName)}`,
    `fromStopRPS=${encodeURIComponent(q.fromStopRPS ?? "1")}`,
    `toStopRPS=${encodeURIComponent(q.toStopRPS ?? "2")}`,
  ].join("&");
  const html = await fetchText(`/pc/displayrouteinfo?${params}`, "shift_jis");
  return parseRoute(html);
}
