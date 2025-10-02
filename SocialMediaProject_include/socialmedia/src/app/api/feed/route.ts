import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";


export async function GET(request: NextRequest) {
  const session = await getServerSession({ req: request, ...authOptions });

  if (!session) {
    return NextResponse.json({ error: 'Access Denied, Authentication required !!!' }, { status: 401 });
  }

  // TODO: Replace with actual DB query to fetch posts for the user's feed (e.g., posts from followed users)
  // For now, return mock data
  return NextResponse.json({message:'success' , status:200}) ;
}
