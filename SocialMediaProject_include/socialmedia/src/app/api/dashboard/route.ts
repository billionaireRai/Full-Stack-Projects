import { NextResponse , NextRequest } from "next/server";
import { getProfileDashboardAnalyticsController } from "@/app/controllers/analytics";

export const POST = (req:NextRequest) : Promise<NextResponse> => { 
    return getProfileDashboardAnalyticsController(req) ;
}