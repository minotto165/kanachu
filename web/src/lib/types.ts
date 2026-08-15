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
  mark: string;
  arrivalMinutes: number;
  status: 'normal' | 'late' | 'unknown';
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
  type: 'departure' | 'destination' | 'normal';
  busesHere: string[];
}

export interface RouteInfo {
  route: string;
  destination: string;
  via: string;
  stops: RouteStop[];
  fetchedAt: string;
}
