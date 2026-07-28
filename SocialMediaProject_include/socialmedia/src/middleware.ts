import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = [
  "/",
  "/auth/log-in",
  "/auth/sign-up",
  "/auth/forgot-password",
  "/auth/reset-password",
];

export const config = {
  matcher: [
    "/((?!api|_next|.*\\..*).*)",
  ],
};

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublicRoute = PUBLIC_ROUTES.some(route =>
    route === "/"
      ? pathname === "/"
      : pathname.startsWith(route)
  );

  if (isPublicRoute) return NextResponse.next();

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  if (!accessToken && !refreshToken) {
    return NextResponse.redirect(new URL("/auth/log-in", request.url));
  }

  return NextResponse.next();
}