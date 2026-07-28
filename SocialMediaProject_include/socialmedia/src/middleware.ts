// import { NextRequest, NextResponse } from "next/server";

// const PUBLIC_ROUTES = [
//   "/",
//   "/auth/log-in",
//   "/auth/sign-up",
//   "/auth/forgot-password",
//   "/auth/reset-password",
// ];

// export const config = {
//   matcher: ["/:path*"],
// };

// export default function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;

//   // Skip all static assets and Next.js internals...
//   if (
//     pathname.startsWith("/_next") ||
//     pathname.startsWith("/api") ||
//     pathname.startsWith("/images") ||
//     pathname.startsWith("/svg") ||
//     pathname === "/favicon.ico" ||
//     pathname === "/robots.txt" ||
//     pathname === "/sitemap.xml" ||
//     /\.[a-zA-Z0-9]+$/.test(pathname) // any file with an extension
//   ) {
//     return NextResponse.next();
//   }

//   const isPublicRoute = PUBLIC_ROUTES.some((route) =>
//     route === "/" ? pathname === "/" : pathname.startsWith(route)
//   );

//   if (isPublicRoute) {
//     return NextResponse.next();
//   }

//   const accessToken = request.cookies.get("accessToken")?.value;
//   const refreshToken = request.cookies.get("refreshToken")?.value;

//   if (!accessToken && !refreshToken) {
//     return NextResponse.redirect(new URL("/auth/log-in", request.url));
//   }

//   return NextResponse.next();
// }