# kanachu

[神奈中バスロケ](https://real.kanachu.jp/) の非公式 JSON API ラッパー。

神奈中バスロケの Web 画面をスクレイピングして、モダンな REST JSON API として再公開する。

> **免責事項**: このプロジェクトは非公式です。データの著作権・所有権は神奈川中央交通株式会社に帰属します。過剰なアクセスは行わないでください。サービスが予告なく変更・停止される場合があります。

## エンドポイント

### `GET /api/stops?q=<検索語>`

バス停を検索する。

```bash
curl "http://localhost:8080/api/stops?q=あつぎ"
```

```json
{
  "query": "あつぎ",
  "stops": [
    { "code": 19001, "name": "厚木バスセンター", "city": "厚木市" }
  ]
}
```

### `GET /api/approach?from=<コード>&to=<コード>`

乗車バス停と降車バス停を指定して、その区間を走る接近中のバス一覧を取得する。

```bash
curl "http://localhost:8080/api/approach?from=19001&to=19002"
```

```json
{
  "from": { "code": 19001, "name": "" },
  "to": { "code": 19002, "name": "" },
  "buses": [
    {
      "route": "厚09",
      "destination": "宿原入口",
      "via": "そりだハイツ前",
      "vehicle": "あ84",
      "mark": "※",
      "arrivalMinutes": 2,
      "status": "normal",
      "fare": { "cash": 230, "ic": 230 },
      "routePath": "displayrouteinfo?corpno=0&routeno=19250&..."
    }
  ],
  "fetchedAt": "2026-08-15T15:37:45+09:00"
}
```

- `mark`: 車両番号に付く記号（`※` / `★`）
- `routePath`: `/api/route` を呼ぶための元リンク（`route` / `via` / `destination` をそのまま `routeName` / `keikaName` / `lastStopName` に使える）

### `GET /api/route?routeno=<系統コード>&fromStopNo=<乗車>&toStopNo=<降車>&routeName=<系統名>&keikaName=<経由>&lastStopName=<終点>`

系統のバスルート図と、各バスの現在位置（どのバス停にいるか）を取得する。

```bash
curl "http://localhost:8080/api/route?routeno=19250&fromStopNo=19001&toStopNo=19002&routeName=厚09&keikaName=そりだハイツ前&lastStopName=宿原入口"
```

```json
{
  "route": "厚09",
  "destination": "宿原入口",
  "via": "そりだハイツ前",
  "stops": [
    { "name": "厚木バスセンター", "type": "departure", "busesHere": [] },
    { "name": "本厚木駅", "type": "destination", "busesHere": [] },
    { "name": "あつぎ大通り", "type": "normal", "busesHere": ["あ84"] },
    { "name": "市役所入口", "type": "normal", "busesHere": [] }
  ],
  "fetchedAt": "2026-08-15T15:37:45+09:00"
}
```

- `type`: `departure` = 乗車バス停 / `destination` = 降車バス停 / `normal` = 通常バス停
- `busesHere`: そのバス停にいる（または直近を通過した）バスの車両番号

### `GET /health`

死活監視用。

## セットアップ

```bash
bun install
bun start
```

`PORT` 環境変数で待ち受けポートを変更できる。

## ライセンス

MIT
