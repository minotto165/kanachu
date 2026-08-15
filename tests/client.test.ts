import { describe, expect, test } from "bun:test";
import { parseApproach, parseRoute, parseStoplist } from "../src/client";

const stoplistFixture = await Bun.file("test/fixtures/stoplist.txt").text();
const selectstopFixture = await Bun.file("test/fixtures/selectstop.html").text();
const routeinfoFixture = await Bun.file("test/fixtures/routeinfo.html").text();

describe("parseStoplist", () => {
  test("バス停リストをパースする", () => {
    const stops = parseStoplist(stoplistFixture);
    expect(stops.length).toBe(11);
    expect(stops[0]).toEqual({ name: "厚木アクスト", city: "厚木市", code: 16348 });
    expect(stops.find((s) => s.code === 19001)).toEqual({
      name: "厚木バスセンター",
      city: "厚木市",
      code: 19001,
    });
  });
});

describe("parseApproach", () => {
  test("接近情報一覧をパースする", () => {
    const info = parseApproach(selectstopFixture, 19001, 19002);
    expect(info.from).toEqual({ code: 19001, name: "" });
    expect(info.to).toEqual({ code: 19002, name: "" });
    expect(info.buses.length).toBeGreaterThan(0);

    const first = info.buses[0]!;
    expect(first.route).toBe("厚09");
    expect(first.destination).toBe("宿原入口");
    expect(first.via).toBe("そりだハイツ前");
    expect(first.vehicle).toBe("あ84");
    expect(first.arrivalMinutes).toBe(2);
    expect(first.fare).toEqual({ cash: 230, ic: 230 });
    expect(first.routePath).toContain("displayrouteinfo");
    expect(first.routePath).toContain("routeno=19250");
    // 接近情報セクション(fixture は出発予定形式)
    expect(first.etaMinutes).toBeNull();
    expect(first.statusText).toContain("発予定");
    expect(first.approachingStops.length).toBeGreaterThan(0);
  });
});

describe("parseRoute", () => {
  test("バスルート図をパースする(バス現在位置)", () => {
    const route = parseRoute(routeinfoFixture);
    expect(route.route).toBe("厚09");
    expect(route.destination).toBe("宿原入口");
    expect(route.via).toBe("そりだハイツ前");
    expect(route.stops.length).toBe(15);

    // バス停の並び
    expect(route.stops[0]).toMatchObject({ name: "厚木バスセンター", type: "departure" });
    expect(route.stops[1]).toMatchObject({ name: "本厚木駅", type: "destination" });
    expect(route.stops[2]).toMatchObject({ name: "あつぎ大通り", type: "normal" });

    // バス(あ84)はあつぎ大通りにいる
    const withBus = route.stops.find((s) => s.busesHere.length > 0);
    expect(withBus).toMatchObject({ name: "あつぎ大通り" });
    expect(withBus?.busesHere).toContain("あ84");
  });
});
