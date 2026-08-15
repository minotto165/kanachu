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
  arrivalMinutes: number;
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
