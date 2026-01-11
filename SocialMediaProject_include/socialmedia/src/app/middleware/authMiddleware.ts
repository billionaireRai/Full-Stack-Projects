import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export const config = {
  matcher: ["/username","/explore","/payment-page","/subscription","/api/profile"],
  runtime: 'nodejs'
};

export default async function authMiddleware(request: NextRequest) {
  const cookiess = await cookies() ;
  const accessToken = cookiess.get("accessToken")?.value || request.headers.get("authorization")?.replace("Bearer ", "");
  const refreshToken = cookiess.get("refreshToken")?.value || request.headers.get("authorization")?.replace("Bearer ", "");

  if (!accessToken || !refreshToken) return NextResponse.redirect(new URL("/login", request.url));

  return NextResponse.next();
}
