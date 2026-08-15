export interface Stop {
  code: number;
  name: string;
  city: string;
}

export interface ApproachBus {
  route: string;
  destination: string;
  via: string;
  vehicle: string;
  /** 車両番号に付くマーク(※/★)。神奈中側の凡例に従う */
  mark: string;
  /** 乗車〜降車バス停の標準所要時分(全バス同じ値) */
  arrivalMinutes: number;
  /** バスごとの実際の到着予測(「あとN分」形式のときのみ、それ以外は null) */
  etaMinutes: number | null;
  /** 接近情報ステータス(「笹子にあと24分で到着 運行中」等) */
  statusText: string;
  /** 乗車バス停までに通過するバス停リスト(現在位置ではない。区間共通) */
  approachingStops: string[];
  status: "normal" | "late" | "unknown";
  fare: { cash: number; ic: number };
  routePath: string;
}

export interface ApproachInfo {
  from: { code: number; name: string };
  to: { code: number; name: string };
  buses: ApproachBus[];
  fetchedAt: string;
}

export interface RouteStop {
  name: string;
  type: "departure" | "destination" | "normal";
  busesHere: string[];
}

export interface RouteInfo {
  route: string;
  destination: string;
  via: string;
  stops: RouteStop[];
  fetchedAt: string;
}

export interface RouteQuery {
  routeno: string;
  fromStopNo: string;
  toStopNo: string;
  routeName: string;
  keikaName?: string;
  lastStopName: string;
  fromStopRPS?: string;
  toStopRPS?: string;
}
