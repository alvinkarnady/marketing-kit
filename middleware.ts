// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "please-change-me"
);

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  // protect admin pages and admin api routes
  if (
    pathname.startsWith("/admin") ||
    (pathname.startsWith("/api/themes") && req.method !== "GET")
  ) {
    const cookie = req.headers.get("cookie") || "";
    const match = cookie
      .split(";")
      .map((s) => s.trim())
      .find((s) => s.startsWith("mk_session="));
    if (!match) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    const token = match.split("=")[1];
    try {
      await jwtVerify(token, secret);
      return NextResponse.next();
    } catch (err) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/themes/:path*"],
};
