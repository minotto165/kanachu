import type { ApproachInfo, RouteInfo, Stop } from './types';

// 同一オリジン配信のため /api 相対パス
const API_BASE = '/api';

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(API_BASE + path);
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const msg = body?.error?.message ?? `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return res.json() as Promise<T>;
}

export function searchStops(q: string): Promise<{ query: string; stops: Stop[] }> {
  return getJson(`/stops?q=${encodeURIComponent(q)}`);
}

export function getApproach(from: number, to: number): Promise<ApproachInfo> {
  return getJson(`/approach?from=${from}&to=${to}`);
}

export function getRoute(params: {
  routeno: string;
  fromStopNo: string;
  toStopNo: string;
  routeName: string;
  keikaName: string;
  lastStopName: string;
}): Promise<RouteInfo> {
  const q = new URLSearchParams(params).toString();
  return getJson(`/route?${q}`);
}
