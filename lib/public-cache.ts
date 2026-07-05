import { NextResponse } from "next/server";

export const PUBLIC_CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
} as const;

export function jsonWithPublicCache<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, {
    ...init,
    headers: {
      ...PUBLIC_CACHE_HEADERS,
      ...(init?.headers as Record<string, string> | undefined),
    },
  });
}
