import { aiExplanationController } from "@/app/controllers/ai"
import { NextRequest , NextResponse } from "next/server"

export const POST = (request:NextRequest) : Promise<NextResponse> => {
  return aiExplanationController(request);  
}
