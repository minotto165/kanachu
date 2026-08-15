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

  // 各バスは .wrap > .col01(系統/所要時分/運賃テーブル) + .col02(接近情報) のペア
  $(".wrap").each((_, wrapEl) => {
    const wrap = $(wrapEl);
    const col01 = wrap.find(".col01").first();
    const col02 = wrap.find(".col02").first();
    if (!col01.length) return;

    // col01: テーブルから系統・行き先・経由・車両番号・所要時分・運賃をまとめて取得
    const cells: Record<string, string> = {};
    col01.find("tr").each((_, tr) => {
      $(tr)
        .find("th")
        .each((_, th) => {
          const label = $(th).text().trim();
          const td = $(th).next("td");
          if (label && td.length) cells[label] = td.text().trim();
        });
    });
    if (!cells["系統"]) return;

    const vehicleRaw = (cells["車両番号"] ?? "").trim();
    const vmatch = vehicleRaw.match(/^([^\s※★]+)\s*(※|★)?/);
    const link = col01.find('a[href*="displayrouteinfo"]').attr("href") ?? "";
    const arrivalMatch = (cells["所要時分"] ?? "").match(/(\d+)分/);

    // col02: 接近情報(バスごとの実際の到着予測 + 現在位置バス停リスト)
    let statusText = "";
    let etaMinutes: number | null = null;
    const approachingStops: string[] = [];
    if (col02.length) {
      statusText = col02.find("p.title01").text().replace(/\s+/g, " ").trim();
      const etaMatch = statusText.match(/あと(\d+)分/);
      if (etaMatch) etaMinutes = Number(etaMatch[1]);
      col02.find(".placeArea01").each((_, el) => {
        const name = $(el).find("p").first().text().trim();
        if (name) approachingStops.push(name);
      });
    }

    buses.push({
      route: cells["系統"] ?? "",
      destination: cells["行き先"] ?? "",
      via: cells["経由"] ?? "",
      vehicle: vmatch?.[1] ?? vehicleRaw,
      mark: vmatch?.[2] ?? "",
      arrivalMinutes: arrivalMatch ? Number(arrivalMatch[1]) : -1,
      etaMinutes,
      statusText,
      approachingStops,
      status: "normal",
      fare: {
        cash: Number.parseInt(cells["現金"] ?? "0") || 0,
        ic: Number.parseInt(cells["IC"] ?? "0") || 0,
      },
      routePath: link,
    });
  });

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

  // 乗車/降車バス停は2通りの表現がある:
  // A) placeArea01 の class に departure/destination が付く
  // B) frameBox01/frameBox02 の <p class="text"> で名前が示される
  const depName = $(".frameBox01 p.text").first().text().trim();
  const destName = $(".frameBox02 p.text").first().text().trim();

  $(".placeArea01").each((_, el) => {
    const bs = $(el).find(".inner_busstop").first();
    const name = bs.find("p").text().trim();
    if (!name) return;
    const cls = bs.attr("class") ?? "";
    const type = cls.includes("departure")
      ? "departure"
      : cls.includes("destination")
        ? "destination"
        : depName && name === depName
          ? "departure"
          : destName && name === destName
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
