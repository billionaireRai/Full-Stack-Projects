import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: NextRequest) {
  const session = await getServerSession({ req: request, ...authOptions });

  if (!session) {
    return NextResponse.json({ error: 'Access Denied , Authentication required !!!' }, { status: 401 });
  }

  return NextResponse.json({ message: `Welcome ${session.user?.name}` });
}
