import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/","/auth/log-in","/auth/sign-up","/auth/forgot-password","/auth/reset-password"];

export default function authMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) return NextResponse.next();

  // checking tokens in cookies...
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // no existed session...
  if (!accessToken && !refreshToken) return NextResponse.redirect(new URL("/auth/log-in", request.url));

  return NextResponse.next();
}
